"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Baby,
  CalendarDays,
  Check,
  Clock3,
  HeartPulse,
  MessageCircleQuestion,
  Search,
  Stethoscope,
  UserRound,
  Users,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { bolivianos, rangoCivil } from "@/lib/formato";
import type { EspecialidadPublica, MedicoPublico } from "@/lib/crm/tipos";
import {
  NOMBRE_FRANJA,
  diaCorto,
  diaElegible,
  estadoDelDia,
  fechaLarga,
  franjasDelDia,
  hoyEnBolivia,
  medicoElegido,
  numeroDeDia,
  proximosDias,
} from "../state";
import type { AccionSolicitud } from "../state";
import type { EleccionProfesional, EstadoDia, SolicitudDraft } from "../types";
import s from "../booking.module.css";

export function Notice({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className={s.notice} role="status">
      <CalendarDays aria-hidden="true" size={26} />
      <p className={s.noticeTitle}>{title}</p>
      {children}
    </div>
  );
}

/* Íconos para las especialidades más comunes; el resto, el estetoscopio. */
const ICONOS: Record<string, typeof Stethoscope> = {
  ginecologia: Stethoscope,
  "ginecologia-y-obstetricia": Stethoscope,
  cardiologia: HeartPulse,
  pediatria: Baby,
  neonatologia: Baby,
  ecografia: Waves,
};

const paraBuscar = (valor: string) =>
  valor.toLocaleLowerCase("es").normalize("NFD").replace(/\p{Diacritic}/gu, "");

const profesionales = (n: number) =>
  n === 0 ? "La clínica le asigna profesional" : n === 1 ? "1 profesional" : `${n} profesionales`;

export function SpecialtyStep({
  especialidades,
  seleccion,
  onSelect,
  onOrientacion,
}: {
  especialidades: EspecialidadPublica[];
  /** Slug elegido, o "orientacion". */
  seleccion: string | null;
  onSelect: (especialidad: EspecialidadPublica) => void;
  onOrientacion: () => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const termino = paraBuscar(busqueda.trim());
  const visibles = termino
    ? especialidades.filter((e) => paraBuscar(e.nombre).includes(termino))
    : especialidades;

  return (
    <>
      {especialidades.length > 6 && (
        <label className={s.search}>
          <Search aria-hidden="true" size={20} />
          <span className="sr-only">Buscar especialidad</span>
          <input
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar especialidad"
            type="search"
            enterKeyHint="search"
          />
        </label>
      )}

      {especialidades.length === 0 ? (
        <Notice title="Las especialidades todavía no están publicadas en línea.">
          <p>Cuéntenos qué necesita y le orientamos por WhatsApp.</p>
        </Notice>
      ) : visibles.length === 0 ? (
        <Notice title="No encontramos esa especialidad.">
          <p>Pruebe con otro nombre o pida orientación.</p>
          <Button className="mt-4" onClick={() => setBusqueda("")}>
            Ver todas
          </Button>
        </Notice>
      ) : (
        <ul className={s.specialties} aria-label="Especialidades">
          {visibles.map((especialidad) => {
            const Icono = ICONOS[especialidad.slug] ?? Stethoscope;
            return (
              <li key={especialidad.slug}>
                <button
                  type="button"
                  className={s.specialty}
                  aria-pressed={seleccion === especialidad.slug}
                  onClick={() => onSelect(especialidad)}
                >
                  <span className={s.iconTile}>
                    <Icono aria-hidden="true" size={25} strokeWidth={1.5} />
                  </span>
                  <strong>{especialidad.nombre}</strong>
                  <span className={s.specialtyText}>
                    {especialidad.descripcion ?? profesionales(especialidad.medicos)}
                  </span>
                  <span className={s.choose}>
                    Elegir <ArrowRight size={17} aria-hidden="true" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        className={`${s.specialty} ${s.orientation}`}
        aria-pressed={seleccion === "orientacion"}
        onClick={onOrientacion}
      >
        <span className={s.iconTile}>
          <MessageCircleQuestion aria-hidden="true" size={25} strokeWidth={1.5} />
        </span>
        <strong>No sé qué especialidad necesito</strong>
        <span className={s.specialtyText}>Cuéntenos su caso y la clínica le orienta.</span>
        <span className={s.choose}>
          Continuar <ArrowRight size={17} aria-hidden="true" />
        </span>
      </button>
    </>
  );
}

/** La próxima ausencia, en una línea: «Ausente del 20 al 25 de octubre · Congreso». */
function proximaAusencia(medico: MedicoPublico, hoy: string) {
  const a = medico.ausencias.find((x) => x.hasta >= hoy);
  return a ? `Ausente ${rangoCivil(a.desde, a.hasta, hoy)}${a.motivo ? ` · ${a.motivo}` : ""}` : null;
}

export function DoctorStep({
  especialidad,
  medicos,
  seleccion,
  onSelect,
}: {
  especialidad: string;
  medicos: MedicoPublico[];
  seleccion: EleccionProfesional | null;
  onSelect: (eleccion: EleccionProfesional) => void;
}) {
  const [hoy] = useState(hoyEnBolivia);
  const indistinto = seleccion?.tipo === "indistinto";
  return (
    <>
      <button
        type="button"
        className={`${s.specialty} ${s.anyDoctor}`}
        aria-pressed={indistinto}
        onClick={() => onSelect({ tipo: "indistinto" })}
      >
        <span className={s.iconTile}>
          <Users aria-hidden="true" size={25} strokeWidth={1.5} />
        </span>
        <strong>Sin preferencia de profesional</strong>
        <span className={s.specialtyText}>La clínica le asigna el primer turno disponible.</span>
        <span className={s.choose}>
          Elegir <ArrowRight size={17} aria-hidden="true" />
        </span>
      </button>

      <ul className={s.doctors} aria-label={`Profesionales de ${especialidad}`}>
        {medicos.map((medico) => {
          const elegido = seleccion?.tipo === "medico" && seleccion.medico.slug === medico.slug;
          const ausencia = proximaAusencia(medico, hoy);
          return (
            <li key={medico.slug} className={s.doctor} data-selected={elegido}>
              <div className={s.avatar}>
                {medico.fotoUrl ? (
                  <Image src={medico.fotoUrl} alt="" width={88} height={104} sizes="88px" />
                ) : (
                  <UserRound size={38} strokeWidth={1} aria-hidden="true" />
                )}
              </div>
              <div className={s.doctorInfo}>
                <h3>{medico.nombre}</h3>
                <p className={s.specialtyName}>{medico.especialidades.map((e) => e.nombre).join(" · ")}</p>
                <p className={s.schedule}>
                  <Clock3 size={15} aria-hidden="true" />
                  {medico.resumenHorario}
                </p>
                {ausencia && <p className={s.absence}>{ausencia}</p>}
                <p className={s.price}>
                  {medico.precioConsulta !== null ? (
                    <>
                      {bolivianos(medico.precioConsulta)} <span>· consulta</span>
                    </>
                  ) : (
                    <span>Precio de la consulta a confirmar</span>
                  )}
                </p>
              </div>
              <div className={s.doctorAction}>
                {/* El nombre va en la etiqueta accesible y no en el texto: un
                    nombre largo no cabe en un botón de una línea a 390 px. */}
                <Button
                  aria-pressed={elegido}
                  aria-label={`Elegir a ${medico.nombre}`}
                  onClick={() => onSelect({ tipo: "medico", medico })}
                >
                  {elegido && <Check size={16} aria-hidden="true" />}
                  Elegir profesional
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const ESTADO_DIA: Record<EstadoDia, string> = {
  atiende: "",
  "a-coordinar": "",
  "no-atiende": "No atiende",
  ausente: "Ausente",
};

export function DateStep({
  draft,
  dispatch,
  onNext,
}: {
  draft: SolicitudDraft;
  dispatch: (accion: AccionSolicitud) => void;
  onNext: () => void;
}) {
  // Solo se pinta en el cliente (el paso 3 nunca sale del servidor), así que
  // «hoy» es el del dispositivo, llevado a la fecha civil de Bolivia.
  const [dias] = useState(() => proximosDias(hoyEnBolivia(), 14));
  const [semanaElegida, setSemana] = useState<number | null>(null);
  const medico = medicoElegido(draft);
  const semana = semanaElegida ?? (dias.indexOf(draft.fecha) >= 7 ? 1 : 0);
  const visibles = dias.slice(semana * 7, semana * 7 + 7);
  const rango = new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).formatRange(new Date(`${visibles[0]}T12:00:00Z`), new Date(`${visibles.at(-1)}T12:00:00Z`));
  const franjas = draft.fecha ? franjasDelDia(medico, draft.fecha) : [];
  const atiendeAlgunDia = dias.some((d) => diaElegible(estadoDelDia(medico, d)));

  return (
    <>
      <p className={s.contextLine}>
        <UserRound size={17} aria-hidden="true" />
        {medico ? medico.nombre : "Sin preferencia de profesional"}
        {medico?.precioConsulta != null && <span>{bolivianos(medico.precioConsulta)}</span>}
      </p>

      {!atiendeAlgunDia ? (
        <Notice title="No tiene días de atención en las próximas dos semanas.">
          <p>Vuelva al paso anterior y elija otro profesional, o «Sin preferencia».</p>
        </Notice>
      ) : (
        <>
          <div className={s.dateHeader}>
            <p>
              Día preferido <span>· hora de Bolivia</span>
            </p>
            <div>
              <button type="button" aria-label="Semana anterior" disabled={semana === 0} onClick={() => setSemana(0)}>
                ←
              </button>
              <button type="button" aria-label="Semana siguiente" disabled={semana === 1} onClick={() => setSemana(1)}>
                →
              </button>
            </div>
          </div>
          <p className={s.dateRange} aria-live="polite">
            {rango}
          </p>
          <div className={s.days} role="group" aria-label="Días">
            {visibles.map((fecha) => {
              const estado = estadoDelDia(medico, fecha);
              const elegible = diaElegible(estado);
              return (
                <button
                  type="button"
                  key={fecha}
                  aria-label={`${fechaLarga(fecha)}${elegible ? "" : `, ${ESTADO_DIA[estado].toLowerCase()}`}`}
                  aria-pressed={draft.fecha === fecha}
                  disabled={!elegible}
                  onClick={() => dispatch({ tipo: "fecha", valor: fecha })}
                >
                  <span>{diaCorto(fecha)}</span>
                  <strong>{numeroDeDia(fecha)}</strong>
                  {!elegible && <small>{ESTADO_DIA[estado]}</small>}
                </button>
              );
            })}
          </div>

          <div className={s.hours} aria-live="polite">
            {!draft.fecha ? (
              <Notice title="¿Qué día le viene bien?">
                <p>Elija un día para ver en qué momento atiende.</p>
              </Notice>
            ) : (
              <>
                <p className={s.dateCaption}>{fechaLarga(draft.fecha)}</p>
                <div className={s.slots} role="group" aria-label="Momento del día">
                  {franjas.map((opcion) => (
                    <button
                      key={opcion.franja}
                      type="button"
                      aria-pressed={draft.franja === opcion.franja}
                      disabled={!opcion.disponible}
                      onClick={() => dispatch({ tipo: "franja", valor: opcion.franja })}
                    >
                      <strong>{NOMBRE_FRANJA[opcion.franja]}</strong>
                      <span>{opcion.detalle}</span>
                    </button>
                  ))}
                </div>
                <p className={s.hint}>Es una preferencia: la clínica le confirma la hora exacta por WhatsApp.</p>
              </>
            )}
          </div>
        </>
      )}

      <div className={s.nextRow}>
        <Button variant="primary" size="lg" disabled={!draft.fecha || !draft.franja} onClick={onNext}>
          Continuar
          <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
