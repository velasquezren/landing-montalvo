import type { EspecialidadPublica, MedicoPublico, Referencia } from "../lib/crm/tipos.ts";

/**
 * Solicitud de consulta por WhatsApp.
 *
 * No es una reserva: la agenda real vive en el sistema de la clínica, que la
 * landing no ve. La paciente elige especialidad, profesional, un día y una
 * franja **preferidos**, y manda la solicitud por WhatsApp con todo escrito;
 * la clínica confirma el horario en el chat. Por eso aquí no hay cupos ni
 * pagos: inventar una hora libre sería prometer lo que nadie comprobó.
 */

/** Lo que la página entrega al flujo, leído del CRM en el servidor. */
export interface CatalogoReserva {
  especialidades: EspecialidadPublica[];
  medicos: MedicoPublico[];
}

export type EleccionEspecialidad =
  | { tipo: "especialidad"; especialidad: Referencia }
  /** «No sé qué especialidad necesito»: la clínica orienta. */
  | { tipo: "orientacion" };

export type EleccionProfesional =
  | { tipo: "medico"; medico: MedicoPublico }
  | { tipo: "indistinto" };

export type Franja = "manana" | "tarde" | "indistinta";

export interface PacienteSolicitud {
  nombre: string;
  /** Opcional: agiliza el registro, pero no hace falta para pedir una cita. */
  carnet: string;
  observaciones: string;
}

export interface SolicitudDraft {
  especialidad: EleccionEspecialidad | null;
  profesional: EleccionProfesional | null;
  /** Fecha civil de Bolivia, "2026-10-07". */
  fecha: string;
  franja: Franja | null;
  paciente: PacienteSolicitud;
}

/** Cómo atiende un profesional un día concreto, según su horario publicado. */
export type EstadoDia =
  /** Tiene horario ese día de la semana. */
  | "atiende"
  /** Tiene horario publicado, pero no ese día. */
  | "no-atiende"
  /** Ausencia publicada (vacaciones, congreso). */
  | "ausente"
  /** Sin horario publicado o sin profesional elegido: lo coordina la clínica. */
  | "a-coordinar";

export interface OpcionFranja {
  franja: Franja;
  disponible: boolean;
  /** «08:00–12:00», o una indicación genérica si no hay horario publicado. */
  detalle: string;
}
