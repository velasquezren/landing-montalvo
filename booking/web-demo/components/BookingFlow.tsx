"use client";
import { useReducer, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  bookingReducer,
  canContinue,
  dateLabel,
  initialDraft,
  money,
} from "../state";
import type { BookingDraft, PaymentDraft } from "../types";
import { SpecialtyStep, DoctorStep, DateTimeStep } from "./SelectionSteps";
import { PatientStep } from "./PatientStep";
import { PaymentStep, paymentLabels } from "./PaymentStep";
import s from "../booking.module.css";

const steps = [
  "Especialidad",
  "Médico",
  "Horario",
  "Datos",
  "Resumen",
  "Pago",
  "Confirmación",
];
const titles = [
  "¿Qué atención estás buscando?",
  "Elegí con quién atenderte",
  "Un horario que se adapte a vos",
  "Contanos quién viene a la consulta",
  "Revisá los detalles con tranquilidad",
  "Pago y comprobante",
  "Vista previa de confirmación",
];
const descriptions = [
  "Empezá por la especialidad. Te acompañamos paso a paso.",
  "Conocé los horarios y el precio antes de elegir.",
  "Primero el día. Después, la hora que te quede mejor.",
  "Solo necesitamos unos pocos datos para esta reserva.",
  "Podés corregir tu selección antes de continuar.",
  "Una reserva y un pago son pasos distintos.",
  "Así se verá la respuesta cuando el sistema esté conectado.",
];
const emptyPayment = (): PaymentDraft => ({
  nit: "",
  businessName: "",
  receipt: null,
  status: "PENDIENTE_PAGO",
});

function AppointmentSummary({
  draft,
  edit,
  patient = false,
}: {
  draft: BookingDraft;
  edit?: (step: number) => void;
  patient?: boolean;
}) {
  return (
    <dl className={s.summaryList}>
      <div>
        <dt>Especialidad</dt>
        <dd>{draft.specialty?.name ?? "Por elegir"}</dd>
        {edit && (
          <button onClick={() => edit(0)} aria-label="Cambiar especialidad">
            Cambiar
          </button>
        )}
      </div>
      <div>
        <dt>Profesional</dt>
        <dd>{draft.doctor?.name ?? "Por elegir"}</dd>
        {edit && (
          <button onClick={() => edit(1)} aria-label="Cambiar médico">
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
          <button onClick={() => edit(2)} aria-label="Cambiar fecha y hora">
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
            <button onClick={() => edit(3)} aria-label="Corregir datos">
              Corregir
            </button>
          )}
        </div>
      )}
      <div className={s.summaryTotal}>
        <dt>
          Consulta <span>· precio de ejemplo</span>
        </dt>
        <dd>{draft.doctor ? money(draft.doctor.price) : "Por elegir"}</dd>
      </div>
    </dl>
  );
}
export default function BookingFlow({ onChangeChannel }: { onChangeChannel?: () => void }) {
  const [draft, dispatch] = useReducer(bookingReducer, undefined, initialDraft);
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<PaymentDraft>(emptyPayment);
  const heading = useRef<HTMLHeadingElement>(null);
  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function changeSelection(action: Parameters<typeof dispatch>[0]) {
    const changed = bookingReducer(draft, action) !== draft;
    dispatch(action);
    if (changed && action.type !== "patient") setPayment(emptyPayment());
  }
  const completed = step === 6;
  return (
    <section className={s.booking} aria-label="Reserva de consulta">
      <div className={s.container}>
        <div className={s.intro}>
          <Link href="/" className={s.breadcrumb}>
            Inicio <span>/</span> Reservar
          </Link>
          {onChangeChannel && (
            <Button variant="link" className="mb-5 min-h-11 whitespace-normal text-left" onClick={onChangeChannel}>
              <ArrowLeft size={16} aria-hidden="true" />Cambiar forma de reservar
            </Button>
          )}
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
          <p className={s.demoBanner}>
            <span>DEMOSTRACIÓN</span> Profesionales, horarios y precios
            ficticios. No se crean citas ni se procesan pagos. Usá datos de ejemplo.
          </p>
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
              <li
                key={label}
                aria-current={i === step ? "step" : undefined}
                data-done={i < step}
              >
                <span className={s.progressBar} />
                <span className={s.stepLabel}>
                  {i < step ? (
                    <Check size={13} aria-hidden="true" />
                  ) : (
                    `${i + 1}.`
                  )}{" "}
                  {label}
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
                    {draft.doctor && ` · ${money(draft.doctor.price)}`}
                  </span>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <AppointmentSummary draft={draft} />
              </details>
            )}
            <div className={s.panel}>
              <div className={s.panelHeader}>
                {step > 0 && !completed && (
                  <button className={s.back} onClick={() => go(step - 1)}>
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
                {step === 0 && (
                  <SpecialtyStep
                    selected={draft.specialty}
                    onSelect={(specialty) => {
                      changeSelection({ type: "specialty", value: specialty });
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
                      changeSelection({ type: "doctor", value: doctor });
                      go(2);
                    }}
                  />
                )}
                {step === 2 && (
                  <DateTimeStep
                    draft={draft}
                    dispatch={changeSelection}
                    onNext={() => {
                      if (canContinue(2, draft)) go(3);
                    }}
                  />
                )}
                {step === 3 && (
                  <PatientStep
                    patient={draft.patient}
                    onChange={(patient) =>
                      dispatch({ type: "patient", value: patient })
                    }
                    onNext={() => {
                      if (canContinue(3, draft)) go(4);
                    }}
                  />
                )}
                {step === 4 && (
                  <>
                    <AppointmentSummary draft={draft} edit={go} patient />
                    <p className={s.privacy}>
                      <ShieldCheck size={18} aria-hidden="true" />
                      Todavía no se ha reservado ningún horario. Este es un
                      resumen de demostración.
                    </p>
                    <div className={s.nextRow}>
                      <Button
                        variant="primary"
                        size="lg"
                        disabled={!canContinue(4, draft)}
                        onClick={() => go(5)}
                      >
                        Continuar al pago de ejemplo
                        <ArrowRight size={16} aria-hidden="true" />
                      </Button>
                    </div>
                  </>
                )}
                {step === 5 && (
                  <PaymentStep
                    price={draft.doctor?.price ?? 0}
                    payment={payment}
                    onChange={setPayment}
                    onNext={() => go(6)}
                  />
                )}
                {completed && (
                  <>
                    <div className={s.confirmation}>
                      <span className={s.confirmIcon}>
                        <CheckCheck
                          size={32}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                      <p className={s.eyebrow}>Solo vista previa</p>
                      <h3>Reserva recibida</h3>
                      <p>
                        Este mensaje es un ejemplo.{" "}
                        <strong>No existe una cita reservada.</strong>
                      </p>
                    </div>
                    <AppointmentSummary draft={draft} patient />
                    <div className={s.paymentState} role="status">
                      <Clock3 size={20} aria-hidden="true" />
                      <div>
                        <strong>{paymentLabels[payment.status]}</strong>
                        <p>
                          {payment.status === "EN_VERIFICACION"
                            ? "La revisión humana está representada como ejemplo. No se ha confirmado ningún pago."
                            : payment.receipt
                              ? "El comprobante sigue en tu dispositivo. Ningún archivo fue enviado."
                              : "No se seleccionó un comprobante ni se realizó un pago."}
                        </p>
                      </div>
                    </div>
                    {payment.status === "COMPROBANTE_ENVIADO" && (
                      <Button
                        onClick={() =>
                          setPayment({ ...payment, status: "EN_VERIFICACION" })
                        }
                      >
                        Ver ejemplo de verificación
                      </Button>
                    )}
                    <div className={s.finalActions}>
                      <Button disabled aria-describedby="calendar-pending">
                        <CalendarDays size={17} aria-hidden="true" />
                        Agregar al calendario
                      </Button>
                      <Button asChild>
                        <Link href="/atencion-al-paciente">
                          Contactar con la clínica
                        </Link>
                      </Button>
                      <Button asChild variant="primary">
                        <Link href="/">Volver al inicio</Link>
                      </Button>
                    </div>
                    <p id="calendar-pending" className={s.hint}>
                      La opción de calendario estará disponible cuando exista
                      una reserva real.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <aside className={s.sidebar} aria-label="Resumen de tu selección">
            <div className={s.sidebarCard}>
              <p className={s.eyebrow}>Tu consulta</p>
              <h2>{draft.specialty?.name ?? "Un espacio para cuidarte"}</h2>
              {draft.specialty ? (
                <AppointmentSummary draft={draft} />
              ) : (
                <>
                  <p>
                    Elegí tu especialidad, encontrá un profesional y revisá cada
                    detalle antes de continuar.
                  </p>
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
                      Precio visible desde el inicio
                    </p>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Sin crear una cuenta
                    </p>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Podés volver y corregir
                    </p>
                  </div>
                </>
              )}
              <p className={s.sidebarFoot}>
                Vista de demostración
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
