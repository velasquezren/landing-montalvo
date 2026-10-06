"use client";
import { useReducer, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, CheckCheck, ChevronDown, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bolivianos } from "@/lib/formato";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  NOMBRE_FRANJA,
  fechaLarga,
  medicoElegido,
  medicosDe,
  mensajeDeSolicitud,
  pasoAlcanzable,
  solicitudReducer,
  solicitudVacia,
} from "../state";
import type { CatalogoReserva, SolicitudDraft } from "../types";
import { DateStep, DoctorStep, SpecialtyStep } from "./SelectionSteps";
import { PatientStep } from "./PatientStep";
import s from "../booking.module.css";

const PASOS = ["Especialidad", "Profesional", "Día", "Sus datos", "Enviar"];
const TITULOS = [
  "¿Qué atención necesita?",
  "¿Con quién prefiere atenderse?",
  "¿Qué día le conviene?",
  "¿Quién viene a la consulta?",
  "Revise y envíe su solicitud",
];
const DESCRIPCIONES = [
  "Elija la especialidad. Si no sabe cuál, le orientamos.",
  "Vea el horario y el precio de la consulta antes de elegir.",
  "Elija el día y el momento que prefiere. La hora exacta la confirma la clínica.",
  "Solo lo necesario para registrar la solicitud.",
  "Se abrirá WhatsApp con el mensaje ya escrito: solo tiene que enviarlo.",
];

function Resumen({
  draft,
  editar,
  conPaciente = false,
}: {
  draft: SolicitudDraft;
  editar?: (paso: number) => void;
  conPaciente?: boolean;
}) {
  const medico = medicoElegido(draft);
  const especialidad =
    draft.especialidad?.tipo === "especialidad"
      ? draft.especialidad.especialidad.nombre
      : draft.especialidad
        ? "Necesito orientación"
        : "Por elegir";
  const filas: { termino: string; valor: React.ReactNode; paso: number; accion: string; oculta?: boolean }[] = [
    { termino: "Especialidad", valor: especialidad, paso: 0, accion: "Cambiar especialidad" },
    {
      termino: "Profesional",
      valor: medico ? medico.nombre : draft.profesional ? "Sin preferencia" : "Por elegir",
      paso: 1,
      accion: "Cambiar profesional",
      // Con «Necesito orientación» no hay profesional que elegir.
      oculta: draft.especialidad?.tipo === "orientacion",
    },
    {
      termino: "Día y momento",
      valor: draft.fecha ? (
        <>
          <span className={s.capitalize}>{fechaLarga(draft.fecha)}</span>
          {draft.franja && <strong className={s.summaryTime}>{NOMBRE_FRANJA[draft.franja]}</strong>}
        </>
      ) : (
        "Por elegir"
      ),
      paso: 2,
      accion: "Cambiar día",
    },
  ];
  if (conPaciente) {
    filas.push({ termino: "Paciente", valor: draft.paciente.nombre.trim(), paso: 3, accion: "Corregir datos" });
  }

  return (
    <dl className={s.summaryList}>
      {filas
        .filter((f) => !f.oculta)
        .map((fila) => (
          <div key={fila.termino}>
            <dt>{fila.termino}</dt>
            <dd>{fila.valor}</dd>
            {editar && (
              <button type="button" onClick={() => editar(fila.paso)} aria-label={fila.accion}>
                Cambiar
              </button>
            )}
          </div>
        ))}
      {medico && (
        <div className={s.summaryTotal}>
          <dt>
            Consulta <span>· precio publicado por la clínica</span>
          </dt>
          <dd>{medico.precioConsulta !== null ? bolivianos(medico.precioConsulta) : "A confirmar"}</dd>
        </div>
      )}
    </dl>
  );
}

export default function BookingFlow({
  catalogo,
  inicial,
}: {
  catalogo: CatalogoReserva;
  /** Preelección desde un enlace (`?medico=`, `?especialidad=`). */
  inicial?: { draft: SolicitudDraft; paso: number };
}) {
  const [draft, dispatch] = useReducer(solicitudReducer, inicial?.draft ?? solicitudVacia());
  const [pasoPedido, setPaso] = useState(inicial?.paso ?? 0);
  /* Nunca se pinta un paso sin lo que necesita: si falta algo de antes
     (p. ej. se cambió la especialidad), se muestra el primer paso incompleto. */
  const paso = Math.min(pasoPedido, pasoAlcanzable(draft));
  const [enviada, setEnviada] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);

  const especialidadSlug = draft.especialidad?.tipo === "especialidad" ? draft.especialidad.especialidad.slug : null;
  const medicos = especialidadSlug ? medicosDe(catalogo, especialidadSlug) : [];
  /* Sin médicos publicados en la especialidad, o pidiendo orientación, no hay
     a quién elegir: el paso «Profesional» se salta en los dos sentidos. */
  const sinEleccionDeProfesional = draft.especialidad !== null && medicos.length === 0;

  function ir(siguiente: number) {
    setPaso(siguiente);
    setEnviada(false);
    requestAnimationFrame(() => {
      titulo.current?.focus({ preventScroll: true });
      titulo.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  function reiniciar() {
    dispatch({ tipo: "paciente", valor: solicitudVacia().paciente });
    setPaso(0);
    setEnviada(false);
  }

  const mensaje = paso === 4 ? mensajeDeSolicitud(draft) : "";
  const anterior = paso === 2 && sinEleccionDeProfesional ? 0 : paso - 1;

  return (
    <section className={s.booking} aria-label="Solicitud de consulta">
      <div className={s.container}>
        <div className={s.intro}>
          <nav aria-label="Ruta de navegación" className={s.breadcrumb}>
            <Link href="/">Inicio</Link> <span aria-hidden="true">/</span> Solicitar una consulta
          </nav>
          <div className={s.introRow}>
            <div>
              <p className={s.eyebrow}>Clínica Montalvo · Consultas</p>
              <h1>
                Solicite su consulta,
                <br className={s.mobileBreak} /> paso a paso.
              </h1>
            </div>
            <p className={s.introNote}>
              <MessageCircle size={21} aria-hidden="true" />
              Confirmación
              <br />
              por WhatsApp.
            </p>
          </div>
          <p className={s.requestNote}>
            <span>Solicitud</span> Usted elige el día y el momento que prefiere; la clínica le confirma la hora
            exacta por WhatsApp.
          </p>
        </div>

        <nav className={s.progress} aria-label="Progreso de la solicitud">
          <div className={s.progressCaption}>
            <span>
              Paso {paso + 1} de {PASOS.length}
            </span>
            <strong>{PASOS[paso]}</strong>
          </div>
          <ol>
            {PASOS.map((etiqueta, i) => (
              <li key={etiqueta} aria-current={i === paso ? "step" : undefined} data-done={i < paso}>
                <span className={s.progressBar} />
                <span className={s.stepLabel}>
                  {i < paso ? <Check size={13} aria-hidden="true" /> : `${i + 1}.`} {etiqueta}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <div className={s.layout}>
          <div className={s.mainColumn}>
            {draft.especialidad && paso > 0 && (
              <details className={s.mobileSummary}>
                <summary>
                  <span>Su selección</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <Resumen draft={draft} />
              </details>
            )}

            <div className={s.panel}>
              <div className={s.panelHeader}>
                {paso > 0 && (
                  <button type="button" className={s.back} onClick={() => ir(anterior)}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    Volver
                  </button>
                )}
                <p className={s.eyebrow}>
                  {String(paso + 1).padStart(2, "0")} / {PASOS[paso]}
                </p>
                <h2 ref={titulo} tabIndex={-1}>
                  {TITULOS[paso]}
                </h2>
                <p>{DESCRIPCIONES[paso]}</p>
              </div>

              <div className={s.stepBody} key={paso}>
                {paso === 0 && (
                  <SpecialtyStep
                    especialidades={catalogo.especialidades}
                    seleccion={
                      draft.especialidad?.tipo === "orientacion" ? "orientacion" : especialidadSlug
                    }
                    onSelect={(especialidad) => {
                      dispatch({
                        tipo: "especialidad",
                        valor: {
                          tipo: "especialidad",
                          especialidad: { slug: especialidad.slug, nombre: especialidad.nombre },
                        },
                      });
                      if (medicosDe(catalogo, especialidad.slug).length === 0) {
                        dispatch({ tipo: "profesional", valor: { tipo: "indistinto" } });
                        ir(2);
                      } else ir(1);
                    }}
                    onOrientacion={() => {
                      dispatch({ tipo: "especialidad", valor: { tipo: "orientacion" } });
                      ir(2);
                    }}
                  />
                )}
                {paso === 1 && draft.especialidad?.tipo === "especialidad" && (
                  <DoctorStep
                    especialidad={draft.especialidad.especialidad.nombre}
                    medicos={medicos}
                    seleccion={draft.profesional}
                    onSelect={(eleccion) => {
                      dispatch({ tipo: "profesional", valor: eleccion });
                      ir(2);
                    }}
                  />
                )}
                {paso === 2 && <DateStep draft={draft} dispatch={dispatch} onNext={() => ir(3)} />}
                {paso === 3 && (
                  <PatientStep
                    paciente={draft.paciente}
                    onChange={(paciente) => dispatch({ tipo: "paciente", valor: paciente })}
                    onNext={() => ir(4)}
                  />
                )}
                {paso === 4 && (
                  <>
                    {enviada && (
                      <div className={s.confirmation} role="status">
                        <span className={s.confirmIcon}>
                          <CheckCheck size={32} strokeWidth={1.5} aria-hidden="true" />
                        </span>
                        <h3>Se abrió WhatsApp con su solicitud</h3>
                        <p>
                          Envíe el mensaje para completarla. <strong>La cita queda agendada cuando la clínica
                          le confirme el horario</strong> en ese mismo chat.
                        </p>
                      </div>
                    )}
                    <Resumen draft={draft} editar={enviada ? undefined : ir} conPaciente />
                    <details className={s.preview}>
                      <summary>Ver el mensaje que se enviará</summary>
                      <pre>{mensaje}</pre>
                    </details>
                    <p className={s.privacy}>
                      <ShieldCheck size={18} aria-hidden="true" />
                      Todavía no hay una cita reservada: es una solicitud. La clínica responde en su horario de
                      atención.
                    </p>
                    <div className={s.finalActions}>
                      {enviada && (
                        <Button type="button" onClick={reiniciar}>
                          Hacer otra solicitud
                        </Button>
                      )}
                      <Button asChild variant="primary" size="lg">
                        <a
                          href={buildWhatsAppUrl(mensaje)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setEnviada(true)}
                        >
                          <MessageCircle size={17} aria-hidden="true" />
                          {enviada ? "Abrir WhatsApp de nuevo" : "Enviar por WhatsApp"}
                        </a>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <aside className={s.sidebar} aria-label="Resumen de su solicitud">
            <div className={s.sidebarCard}>
              <p className={s.eyebrow}>Su solicitud</p>
              {draft.especialidad ? (
                <Resumen draft={draft} />
              ) : (
                <>
                  <h2>Un espacio para cuidarse</h2>
                  <p>Elija la especialidad y el profesional, y revise cada detalle antes de enviar.</p>
                  <Image
                    className={s.clinicPhoto}
                    src="/images/clinica/exterior-20261001.jpg"
                    alt="Exterior de Clínica Montalvo"
                    width={480}
                    height={320}
                    sizes="264px"
                  />
                  <div className={s.sidebarPoints}>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Horario y precio publicados por la clínica
                    </p>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Sin crear una cuenta
                    </p>
                    <p>
                      <Check size={17} aria-hidden="true" />
                      Confirmación por WhatsApp
                    </p>
                  </div>
                </>
              )}
              <p className={s.sidebarFoot}>Santa Cruz de la Sierra · Bolivia</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
