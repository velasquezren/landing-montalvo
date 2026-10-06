import type { DiaSemana, MedicoPublico } from "../lib/crm/tipos.ts";
import { hoyEnBolivia } from "../lib/formato.ts";
import type {
  CatalogoReserva,
  EleccionEspecialidad,
  EleccionProfesional,
  EstadoDia,
  Franja,
  OpcionFranja,
  PacienteSolicitud,
  SolicitudDraft,
} from "./types.ts";

/* ── Fechas: siempre la fecha civil de Bolivia ─────────────────────────── */

export { hoyEnBolivia };

/** Las fechas civiles se operan a mediodía UTC: ningún huso las mueve de día. */
const aDate = (fecha: string) => new Date(`${fecha}T12:00:00Z`);

export function sumarDias(fecha: string, dias: number): string {
  const d = aDate(fecha);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Los próximos `cantidad` días, empezando hoy. */
export function proximosDias(hoy: string, cantidad = 14): string[] {
  return Array.from({ length: cantidad }, (_, i) => sumarDias(hoy, i));
}

/** Día ISO: 1 = lunes … 7 = domingo, como el horario del CRM. */
export function diaSemanaDe(fecha: string): DiaSemana {
  return (aDate(fecha).getUTCDay() || 7) as DiaSemana;
}

const formato = (opciones: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-BO", { ...opciones, timeZone: "UTC" });
const FORMATO_LARGO = formato({ weekday: "long", day: "numeric", month: "long" });
const FORMATO_DIA = formato({ weekday: "short" });

/** «martes, 7 de octubre» → «martes 7 de octubre». */
export const fechaLarga = (fecha: string) => FORMATO_LARGO.format(aDate(fecha)).replace(",", "");
/** «mar» (sin el punto que añaden algunos motores). */
export const diaCorto = (fecha: string) => FORMATO_DIA.format(aDate(fecha)).replace(".", "");
export const numeroDeDia = (fecha: string) => String(aDate(fecha).getUTCDate());

/* ── Horario: qué días y franjas ofrecer ───────────────────────────────── */

const MEDIODIA = "12:00";

export function estadoDelDia(medico: MedicoPublico | null, fecha: string): EstadoDia {
  if (!medico) return "a-coordinar";
  if (medico.ausencias.some((a) => a.desde <= fecha && fecha <= a.hasta)) return "ausente";
  if (medico.horario.length === 0) return "a-coordinar";
  const dia = diaSemanaDe(fecha);
  return medico.horario.some((b) => b.diaSemana === dia) ? "atiende" : "no-atiende";
}

export const diaElegible = (estado: EstadoDia) => estado === "atiende" || estado === "a-coordinar";

/**
 * Mañana y tarde según los bloques de ese día, partidos a mediodía: un bloque
 * de 10:00 a 13:00 ofrece «10:00–12:00» y «12:00–13:00». Sin horario
 * publicado, las dos franjas se ofrecen con una indicación genérica: decir
 * «07:00–12:00» sería atribuir un horario que nadie publicó.
 */
export function franjasDelDia(medico: MedicoPublico | null, fecha: string): OpcionFranja[] {
  const estado = estadoDelDia(medico, fecha);
  const cualquiera: OpcionFranja = { franja: "indistinta", disponible: diaElegible(estado), detalle: "Primer cupo" };
  if (estado !== "atiende" || !medico) {
    const abierto = estado === "a-coordinar";
    return [
      { franja: "manana", disponible: abierto, detalle: "Antes del mediodía" },
      { franja: "tarde", disponible: abierto, detalle: "Después del mediodía" },
      cualquiera,
    ];
  }
  const dia = diaSemanaDe(fecha);
  const bloques = medico.horario.filter((b) => b.diaSemana === dia);
  const manana = bloques
    .filter((b) => b.desde < MEDIODIA)
    .map((b) => `${b.desde}–${b.hasta < MEDIODIA ? b.hasta : MEDIODIA}`);
  const tarde = bloques
    .filter((b) => b.hasta > MEDIODIA)
    .map((b) => `${b.desde > MEDIODIA ? b.desde : MEDIODIA}–${b.hasta}`);
  return [
    { franja: "manana", disponible: manana.length > 0, detalle: manana.join(" · ") || "No atiende" },
    { franja: "tarde", disponible: tarde.length > 0, detalle: tarde.join(" · ") || "No atiende" },
    cualquiera,
  ];
}

export const NOMBRE_FRANJA: Record<Franja, string> = {
  manana: "Mañana",
  tarde: "Tarde",
  indistinta: "Cualquiera",
};

/* ── Estado del recorrido ──────────────────────────────────────────────── */

export function solicitudVacia(): SolicitudDraft {
  return {
    especialidad: null,
    profesional: null,
    fecha: "",
    franja: null,
    paciente: { nombre: "", carnet: "", observaciones: "" },
  };
}

export type AccionSolicitud =
  | { tipo: "especialidad"; valor: EleccionEspecialidad }
  | { tipo: "profesional"; valor: EleccionProfesional }
  | { tipo: "fecha"; valor: string }
  | { tipo: "franja"; valor: Franja }
  | { tipo: "paciente"; valor: PacienteSolicitud };

const claveEspecialidad = (e: EleccionEspecialidad | null) =>
  !e ? "" : e.tipo === "orientacion" ? "orientacion" : e.especialidad.slug;
const claveProfesional = (p: EleccionProfesional | null) =>
  !p ? "" : p.tipo === "indistinto" ? "indistinto" : p.medico.slug;

export const medicoElegido = (draft: SolicitudDraft) =>
  draft.profesional?.tipo === "medico" ? draft.profesional.medico : null;

/**
 * Cambiar algo invalida lo que depende de ello, nunca los datos de la
 * paciente. Devolver el mismo objeto cuando no cambia nada permite saber, con
 * una comparación, si una acción tuvo efecto.
 */
export function solicitudReducer(state: SolicitudDraft, accion: AccionSolicitud): SolicitudDraft {
  switch (accion.tipo) {
    case "especialidad": {
      if (claveEspecialidad(state.especialidad) === claveEspecialidad(accion.valor)) return state;
      return {
        ...state,
        especialidad: accion.valor,
        // Sin especialidad elegida no hay a quién elegir: la clínica asigna.
        profesional: accion.valor.tipo === "orientacion" ? { tipo: "indistinto" } : null,
        fecha: "",
        franja: null,
      };
    }
    case "profesional": {
      const especialidad = state.especialidad;
      if (!especialidad) return state;
      if (accion.valor.tipo === "medico") {
        // Un médico solo vale dentro de la especialidad elegida.
        if (especialidad.tipo !== "especialidad") return state;
        const slug = especialidad.especialidad.slug;
        if (!accion.valor.medico.especialidades.some((e) => e.slug === slug)) return state;
      }
      if (claveProfesional(state.profesional) === claveProfesional(accion.valor)) return state;
      return { ...state, profesional: accion.valor, fecha: "", franja: null };
    }
    case "fecha": {
      if (!state.profesional || state.fecha === accion.valor) return state;
      const medico = medicoElegido(state);
      if (!diaElegible(estadoDelDia(medico, accion.valor))) return state;
      // La franja elegida se conserva si el nuevo día también la ofrece.
      const sigue = franjasDelDia(medico, accion.valor).some((o) => o.franja === state.franja && o.disponible);
      return { ...state, fecha: accion.valor, franja: sigue ? state.franja : null };
    }
    case "franja": {
      if (!state.fecha) return state;
      const opcion = franjasDelDia(medicoElegido(state), state.fecha).find((o) => o.franja === accion.valor);
      return opcion?.disponible && state.franja !== accion.valor ? { ...state, franja: accion.valor } : state;
    }
    case "paciente":
      return { ...state, paciente: accion.valor };
  }
}

/* ── Datos de la paciente ──────────────────────────────────────────────── */

export const LIMITES = { nombre: 100, carnet: 25, observaciones: 300 } as const;

export function validarPaciente(paciente: PacienteSolicitud) {
  const errores: Partial<Record<keyof PacienteSolicitud, string>> = {};
  const nombre = paciente.nombre.trim();
  if ((nombre.match(/\p{L}/gu) ?? []).length < 3) errores.nombre = "Escriba su nombre y apellido.";
  else if (nombre.length > LIMITES.nombre) errores.nombre = `Use como máximo ${LIMITES.nombre} caracteres.`;
  const carnet = paciente.carnet.trim();
  if (carnet && !/^[\p{L}\p{N}][\p{L}\p{N} .-]{2,24}$/u.test(carnet))
    errores.carnet = "Revise el carnet: de 3 a 25 letras o números.";
  if (paciente.observaciones.trim().length > LIMITES.observaciones)
    errores.observaciones = `Use como máximo ${LIMITES.observaciones} caracteres.`;
  return errores;
}

/** El paso más avanzado al que se puede llegar con lo elegido hasta ahora. */
export function pasoAlcanzable(draft: SolicitudDraft): number {
  if (!draft.especialidad) return 0;
  if (!draft.profesional) return 1;
  if (!draft.fecha || !draft.franja) return 2;
  if (Object.keys(validarPaciente(draft.paciente)).length > 0) return 3;
  return 4;
}

/* ── Catálogo ──────────────────────────────────────────────────────────── */

export const medicosDe = (catalogo: CatalogoReserva, especialidadSlug: string) =>
  catalogo.medicos.filter((m) => m.especialidades.some((e) => e.slug === especialidadSlug));

/**
 * Lo que llega preelegido desde un enlace (`/reservar?medico=…` desde la ficha
 * de un médico, `?especialidad=…` desde el directorio). Un slug que ya no está
 * publicado se ignora y el recorrido empieza de cero, sin error.
 */
export function solicitudInicial(
  catalogo: CatalogoReserva,
  parametros: { medico?: string | null; especialidad?: string | null },
): { draft: SolicitudDraft; paso: number } {
  const draft = solicitudVacia();
  const medico = parametros.medico ? catalogo.medicos.find((m) => m.slug === parametros.medico) : undefined;
  const especialidad =
    (medico &&
      (medico.especialidades.find((e) => e.slug === parametros.especialidad) ?? medico.especialidades[0])) ||
    catalogo.especialidades.find((e) => e.slug === parametros.especialidad);
  if (!especialidad) return { draft, paso: 0 };

  let siguiente = solicitudReducer(draft, {
    tipo: "especialidad",
    valor: { tipo: "especialidad", especialidad: { slug: especialidad.slug, nombre: especialidad.nombre } },
  });
  if (medico) {
    siguiente = solicitudReducer(siguiente, { tipo: "profesional", valor: { tipo: "medico", medico } });
    return { draft: siguiente, paso: 2 };
  }
  return { draft: siguiente, paso: 1 };
}

/* ── El mensaje ────────────────────────────────────────────────────────── */

/**
 * El texto que la paciente manda por WhatsApp. Una línea por dato, con
 * etiqueta: lo lee una persona en el chat y tiene que poder copiar cada valor
 * al sistema de la clínica sin interpretar nada.
 */
export function mensajeDeSolicitud(draft: SolicitudDraft): string {
  const medico = medicoElegido(draft);
  const opcion = draft.fecha && draft.franja
    ? franjasDelDia(medico, draft.fecha).find((o) => o.franja === draft.franja)
    : undefined;
  const franja =
    draft.franja === "indistinta"
      ? "Cualquier horario"
      : draft.franja && opcion
        ? `${NOMBRE_FRANJA[draft.franja]}${medico && estadoDelDia(medico, draft.fecha) === "atiende" ? ` (${opcion.detalle})` : ""}`
        : "";
  const lineas = [
    "Hola, Clínica Montalvo. Quisiera solicitar una consulta.",
    "",
    `Especialidad: ${
      draft.especialidad?.tipo === "especialidad" ? draft.especialidad.especialidad.nombre : "Necesito orientación"
    }`,
    `Profesional: ${medico ? medico.nombre : "Sin preferencia"}`,
    draft.fecha ? `Día preferido: ${fechaLarga(draft.fecha)}` : "",
    franja ? `Horario preferido: ${franja}` : "",
    `Paciente: ${draft.paciente.nombre.trim().replace(/\s+/g, " ")}`,
    draft.paciente.carnet.trim() ? `Carnet: ${draft.paciente.carnet.trim()}` : "",
    draft.paciente.observaciones.trim()
      ? `Comentario: ${draft.paciente.observaciones.trim().replace(/\s+/g, " ")}`
      : "",
    "",
    "Enviado desde la web. Quedo a la espera de la confirmación.",
  ];
  // Las líneas vacías del medio son datos que no se dieron; las de los
  // extremos separan el saludo y la despedida.
  return lineas.filter((linea, i) => linea !== "" || i === 1 || i === lineas.length - 2).join("\n");
}
