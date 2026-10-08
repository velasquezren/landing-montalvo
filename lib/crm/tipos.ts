/**
 * Lo que la landing usa de la API pública del CRM, ya normalizado.
 *
 * El contrato lo define el backend (`backend-crm-montalvo`,
 * docs/promociones-y-directorio.md). Aquí vive la forma que necesitan las
 * páginas, no la respuesta cruda: `normalizar.ts` traduce una a la otra y
 * descarta lo que llegue incompleto, para que un cambio en el backend se note
 * en un solo archivo y no como un `undefined` en medio de una página.
 */

export interface EspecialidadPublica {
  slug: string;
  nombre: string;
  descripcion: string | null;
  /** Médicos publicados que atienden esta especialidad. */
  medicos: number;
}

export interface Referencia {
  slug: string;
  nombre: string;
}

/** Día ISO: 1 = lunes … 7 = domingo. */
export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface BloqueHorario {
  diaSemana: DiaSemana;
  /** "08:00", hora de Bolivia. */
  desde: string;
  hasta: string;
  lugar: string | null;
}

export interface Ausencia {
  /** Fecha civil "2026-10-20", inclusive. */
  desde: string;
  hasta: string;
  motivo: string | null;
}

export interface MedicoPublico {
  slug: string;
  nombre: string;
  resumen: string | null;
  especialidades: Referencia[];
  fotoUrl: string | null;
  /** Bolivianos. `null`: la clínica no lo publica. */
  precioConsulta: number | null;
  horario: BloqueHorario[];
  /** «Lunes a viernes, 08:00–12:00». Vacío: «Con cita a solicitud». */
  resumenHorario: string;
  /** Próximas ausencias; el listado las trae solo si el backend las publica. */
  ausencias: Ausencia[];
  /** Su número en la agenda de la clínica: con él «Reservar» abre su calendario en línea. `null`: solo solicitud. */
  agendaMedicoId: string | null;
}

export interface FichaMedico extends MedicoPublico {
  biografia: string | null;
  matricula: string | null;
}

export type FormatoBanner = "CUADRADO" | "VERTICAL" | "HISTORIA" | "HORIZONTAL";

export interface Banner {
  url: string;
  ancho: number;
  alto: number;
  alt: string;
}

export interface PromocionPublica {
  slug: string;
  codigo: string;
  titulo: string;
  resumen: string;
  descripcion: string | null;
  condiciones: string | null;
  /** «2x1», «-30 %»: lo que dice la etiqueta del banner. */
  etiquetaOferta: string | null;
  precioRegular: number | null;
  precioPromocional: number | null;
  vigenteDesde: string;
  vigenteHasta: string | null;
  destacada: boolean;
  especialidad: Referencia | null;
  medicos: Referencia[];
  banners: Partial<Record<FormatoBanner, Banner>>;
  /** Mensaje de WhatsApp con el código de la promoción, redactado por el CRM. */
  mensajeWhatsapp: string;
}
