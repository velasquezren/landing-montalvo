"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  Check,
  ChevronDown,
  Clock3,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { AgendaError, agendaData } from "../agenda-data";
import { bookingReducer, canContinue, dateLabel, initialDraft, money } from "../state";
import type { BookingDraft, Reservation } from "../types";
import { SpecialtyStep, DoctorStep, DateTimeStep, LoadingCards } from "./SelectionSteps";
import { PatientStep } from "./PatientStep";
import { PaymentStep } from "./PaymentStep";
import s from "../booking.module.css";

const steps = ["Especialidad", "Médico", "Horario", "Datos", "Resumen", "Pago", "Confirmación"];
const titles = [
  "¿Qué atención estás buscando?",
  "Elige con quién atenderte",
  "Un horario que se adapte a ti",
  "Cuéntanos quién viene a la consulta",
  "Revisa los detalles y confirma",
  "Pago y comprobante",
  "Tu reserva está registrada",
];
const descriptions = [
  "Empezá por la especialidad. Te acompañamos paso a paso.",
  "Conocé los horarios y el precio antes de elegir.",
  "Primero el día. Después, la hora que te quede mejor.",
  "Solo necesitamos unos pocos datos para la reserva.",
  "Al confirmar, la hora queda registrada en la agenda de la clínica.",
  "Pagá con el QR y subí el comprobante. Caja lo verifica.",
  "Te esperamos. Guardá tu número de reserva.",
];

function AppointmentSummary({
  draft,
  edit,
  patient = false,
}: {
  draft: BookingDraft;
  edit?: (step: number) => void;
  patient?: boolean;
}) {
  const precio = draft.doctor?.price;
  return (
    <dl className={s.summaryList}>
      <div>
        <dt>Especialidad</dt>
        <dd>{draft.specialty?.name ?? "Por elegir"}</dd>
        {edit && (
          <button type="button" onClick={() => edit(0)} aria-label="Cambiar especialidad">
            Cambiar
          </button>
        )}
      </div>
      <div>
        <dt>Profesional</dt>
        <dd>{draft.doctor?.name ?? "Por elegir"}</dd>
        {edit && (
          <button type="button" onClick={() => edit(1)} aria-label="Cambiar médico">
            Cambiar
          </button>
        )}
      </div>
      <div>
        <dt>Fecha y hora</dt>
        <dd className={s.capitalize}>
          {dateLabel(draft.date)}
          {draft.slot && (
            <strong className={s.summaryTime}>
              {draft.slot.time} <span>· Bolivia</span>
            </strong>
          )}
        </dd>
        {edit && (
          <button type="button" onClick={() => edit(2)} aria-label="Cambiar fecha y hora">
            Cambiar
          </button>
        )}
      </div>
      {patient && (
        <div>
          <dt>Paciente</dt>
          <dd>
            {draft.patient.name}
            <span className={s.patientPhone}>{draft.patient.phone}</span>
          </dd>
          {edit && (
            <button type="button" onClick={() => edit(3)} aria-label="Corregir datos">
              Corregir
            </button>
          )}
        </div>
      )}
      <div className={s.summaryTotal}>
        <dt>
          Consulta <span>· {precio != null ? "precio de la agenda" : "a confirmar por la clínica"}</span>
        </dt>
        <dd>{!draft.doctor ? "Por elegir" : precio != null ? money(precio) : "—"}</dd>
      </div>
    </dl>
  );
}

/**
 * `profesional`: el número de agenda de un médico (desde «Reservar» en su
 * ficha). La reserva abre con su especialidad y con él ya elegidos, en el paso
 * de fecha; si dejó de reservarse en línea, en la lista de su especialidad; si
 * ya no está, desde el principio, sin error.
 */
export default function BookingFlow({ onChangeChannel, profesional }: { onChangeChannel?: () => void; profesional?: string | null }) {
  const [draft, dispatch] = useReducer(bookingReducer, undefined, initialDraft);
  const [step, setStep] = useState(0);
  const [preparando, setPreparando] = useState(Boolean(profesional));
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [slotNotice, setSlotNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  useEffect(() => {
    if (!profesional) return;
    let vigente = true;
    agendaData
      .getDoctor(profesional)
      .then((elegido) => {
        if (!vigente || !elegido) return;
        dispatch({ type: "specialty", value: elegido.specialty });
        if (elegido.doctor.availability === "online") {
          dispatch({ type: "doctor", value: elegido.doctor });
          setStep(2);
        } else {
          setStep(1);
        }
      })
      .catch(() => undefined) // sin conexión: empieza desde el principio, como siempre
      .finally(() => vigente && setPreparando(false));
    return () => {
      vigente = false;
    };
  }, [profesional]);

  /** Registra la cita en la agenda. Un solo envío a la vez; una vez registrada, ya no se repite. */
  async function confirm() {
    if (submitting || reservation || !canContinue(4, draft)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const nueva = await agendaData.reservar(draft);
      setReservation(nueva);
      go(nueva.amount !== null && nueva.bankId !== null ? 5 : 6);
    } catch (error) {
      if (error instanceof AgendaError && error.code === "HORA_NO_DISPONIBLE") {
        dispatch({ type: "slot", value: null });
        setSlotNotice("La hora que elegiste acaba de ocuparse. Elige otra; tus datos se conservan.");
        go(2);
      } else {
        setSubmitError(error instanceof Error ? error.message : "No pudimos registrar la reserva.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const completed = step === 6;
  // Con la cita registrada, la selección ya no se cambia desde aquí.
  const locked = reservation !== null;
  const whatsappReserva = reservation
    ? buildWhatsAppUrl(
        `Hola, Clínica Montalvo. Hice la reserva N.º ${reservation.code} en la web (${dateLabel(reservation.date)}, ${reservation.time}).`,
      )
    : buildWhatsAppUrl("Hola, Clínica Montalvo. Quisiera reservar una cita.");

  return (
    <section className={s.booking} aria-label="Reserva de consulta">
      <div className={s.container}>
        <div className={s.intro}>
          <div className={s.introTop}>
            <Link href="/" className={s.breadcrumb}>
              Inicio <span>/</span> Reservar
            </Link>
            {onChangeChannel && !locked && (
              <button type="button" className={s.changeChannel} onClick={onChangeChannel}>
                <ArrowLeft size={14} aria-hidden="true" />
                Otra forma de reservar
              </button>
            )}
          </div>
          <div className={s.introRow}>
            <div>
              <p className={s.eyebrow}>Clínica Montalvo · Reservas</p>
              <h1>
                Tu próxima consulta,
                <br className={s.mobileBreak} /> paso a paso.
              </h1>
            </div>
            <p className={s.introNote}>
              <ShieldCheck size={21} aria-hidden="true" />
              Con claridad.
              <br />A tu ritmo.
            </p>
          </div>
        </div>
        <nav className={s.progress} aria-label="Progreso de la reserva">
          <div className={s.progressCaption}>
            <span>
              Paso {step + 1} de {steps.length}
            </span>
            <strong>{steps[step]}</strong>
          </div>
          <ol>
            {steps.map((label, i) => (
              <li key={label} aria-current={i === step ? "step" : undefined} data-done={i < step}>
                <span className={s.progressBar} />
                <span className={s.stepLabel}>
                  {i < step ? <Check size={13} aria-hidden="true" /> : `${i + 1}.`} {label}
                </span>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.layout}>
          <div className={s.mainColumn}>
            {draft.specialty && step > 0 && step < 6 && (
              <details className={s.mobileSummary}>
                <summary>
                  <span>
                    {draft.specialty.name}
                    {draft.doctor?.price != null && ` · ${money(draft.doctor.price)}`}
                  </span>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <AppointmentSummary draft={draft} />
              </details>
            )}
            <div className={s.panel}>
              <div className={s.panelHeader}>
                {step > 0 && !locked && (
                  <button type="button" className={s.back} onClick={() => go(step - 1)}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    Volver
                  </button>
                )}
                <p className={s.eyebrow}>
                  {String(step + 1).padStart(2, "0")} / {steps[step]}
                </p>
                <h2 ref={heading} tabIndex={-1}>
                  {titles[step]}
                </h2>
                <p>{descriptions[step]}</p>
              </div>
              <div className={s.stepBody} key={step}>
                {preparando && <LoadingCards />}
                {step === 0 && !preparando && (
                  <SpecialtyStep
                    selected={draft.specialty}
                    onSelect={(specialty) => {
                      dispatch({ type: "specialty", value: specialty });
                      go(1);
                    }}
                  />
                )}
                {step === 1 && draft.specialty && (
                  <DoctorStep
                    key={draft.specialty.id}
                    specialty={draft.specialty}
                    selected={draft.doctor}
                    onSelect={(doctor) => {
                      dispatch({ type: "doctor", value: doctor });
                      go(2);
                    }}
                  />
                )}
                {step === 2 && (
                  <>
                    {slotNotice && (
                      <p className={s.requestNotice} role="alert">
                        {slotNotice}
                      </p>
                    )}
                    <DateTimeStep
                      draft={draft}
                      dispatch={(action) => {
                        setSlotNotice("");
                        dispatch(action);
                      }}
                      onNext={() => {
                        if (canContinue(2, draft)) go(3);
                      }}
                    />
                  </>
                )}
                {step === 3 && (
                  <PatientStep
                    patient={draft.patient}
                    onChange={(patient) => dispatch({ type: "patient", value: patient })}
                    onNext={() => {
                      if (canContinue(3, draft)) go(4);
                    }}
                  />
                )}
                {step === 4 && (
                  <>
                    <AppointmentSummary draft={draft} edit={locked ? undefined : go} patient />
                    <p className={s.privacy}>
                      <ShieldCheck size={18} aria-hidden="true" />
                      Al confirmar, la hora queda registrada a tu nombre en la agenda de la clínica. Tus datos
                      solo se usan para esta cita.
                    </p>
                    {submitError && (
                      <div className={s.notice} role="alert">
                        <p className={s.noticeTitle}>{submitError}</p>
                        <p>Tu selección se conserva. Puedes intentarlo de nuevo o reservar por WhatsApp.</p>
                        <Button asChild>
                          <a href={whatsappReserva} target="_blank" rel="noopener noreferrer">
                            Reservar por WhatsApp
                          </a>
                        </Button>
                      </div>
                    )}
                    <div className={s.nextRow}>
                      <Button
                        variant="primary"
                        size="lg"
                        disabled={!canContinue(4, draft) || submitting}
                        aria-busy={submitting}
                        onClick={confirm}
                      >
                        {submitting ? "Registrando tu reserva…" : "Confirmar reserva"}
                        {!submitting && <ArrowRight size={16} aria-hidden="true" />}
                      </Button>
                    </div>
                  </>
                )}
                {step === 5 && reservation && (
                  <PaymentStep
                    reservation={reservation}
                    whatsappUrl={whatsappReserva}
                    onPaid={() => {
                      setPaid(true);
                      go(6);
                    }}
                    onLater={() => go(6)}
                  />
                )}
                {completed && reservation && (
                  <>
                    <div className={s.confirmation} role="status">
                      <span className={s.confirmIcon}>
                        <CheckCheck size={32} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <p className={s.eyebrow}>Reserva N.º {reservation.code}</p>
                      <h3>{reservation.doctorName}</h3>
                      <p className={s.capitalize}>
                        {dateLabel(reservation.date)} · {reservation.time}
                      </p>
                    </div>
                    <AppointmentSummary draft={draft} patient />
                    <div className={s.paymentState} role="status">
                      <Clock3 size={20} aria-hidden="true" />
                      <div>
                        <strong>
                          {paid
                            ? "Pago en verificación"
                            : reservation.amount !== null
                              ? "Pendiente de pago"
                              : "Monto por confirmar"}
                        </strong>
                        <p>
                          {paid
                            ? "Recibimos tu comprobante. Caja lo verifica y la clínica te confirma por WhatsApp."
                            : reservation.amount !== null
                              ? "Puedes enviar el comprobante por WhatsApp citando tu número de reserva."
                              : "La clínica te contactará para confirmar el monto de la consulta."}
                        </p>
                      </div>
                    </div>
                    <div className={s.finalActions}>
                      <Button asChild>
                        <a href={whatsappReserva} target="_blank" rel="noopener noreferrer">
                          <MessageCircle size={17} aria-hidden="true" />
                          Escribir a la clínica
                        </a>
                      </Button>
                      <Button asChild variant="primary">
                        <Link href="/">Volver al inicio</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <aside className={s.sidebar} aria-label="Resumen de tu selección">
            <div className={s.sidebarCard}>
              <p className={s.eyebrow}>{reservation ? `Reserva N.º ${reservation.code}` : "Tu consulta"}</p>
              <h2>{draft.specialty?.name ?? "Un espacio para cuidarte"}</h2>
              {draft.specialty ? (
                <AppointmentSummary draft={draft} />
              ) : (
                <>
                  <p>Elige tu especialidad, encuentra un profesional y revisa cada detalle antes de confirmar.</p>
                  <Image
                    className={s.clinicPhoto}
                    src="/images/clinica/exterior-20261001.jpg"
                    alt="Exterior de Clínica Montalvo"
                    width={480}
                    height={320}
                  />
                  <div className={s.sidebarPoints}>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Horarios reales de la agenda
                    </p>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Sin crear una cuenta
                    </p>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Pago por QR desde tu banco
                    </p>
                  </div>
                </>
              )}
              <p className={s.sidebarFoot}>
                Agenda de Clínica Montalvo
                <br />
                Santa Cruz de la Sierra · Bolivia
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
