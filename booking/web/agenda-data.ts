import type {
  Availability,
  AvailabilityDay,
  BookingData,
  BookingDraft,
  Doctor,
  Reservation,
  Specialty,
} from "./types.ts";

/**
 * La agenda real de la clínica (ScriptCase), a través del CRM.
 *
 * El navegador llama al CRM directamente (`/publico/agenda/*`, CORS solo para
 * la landing y sin cookies): así el límite de peticiones es por paciente y el
 * comprobante no pasa por las funciones de Vercel, que cortan a 4,5 MB.
 *
 * Todo lo que llega se valida antes de pintarse. Un fallo de red o del CRM se
 * propaga como error —la pantalla ofrece reintentar—, nunca como «no hay
 * horarios».
 */

export const CRM_PUBLICO = (process.env.NEXT_PUBLIC_CRM_API_URL || "https://crm.107.175.132.15.nip.io").replace(/\/+$/, "");

/** Error de la agenda con el código del CRM, para decidir qué mostrar. */
export class AgendaError extends Error {
  readonly status: number;
  readonly code: string | null;
  constructor(status: number, code: string | null, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type Objeto = Record<string, unknown>;
const esObjeto = (v: unknown): v is Objeto => typeof v === "object" && v !== null && !Array.isArray(v);
const texto = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const HORA = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

async function leer(pedir: typeof fetch, ruta: string, init?: RequestInit): Promise<unknown> {
  let respuesta: Response;
  try {
    respuesta = await pedir(`${CRM_PUBLICO}/publico/agenda/${ruta}`, {
      ...init,
      credentials: "omit",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new AgendaError(0, null, "No pudimos conectar con la agenda. Revisa tu conexión e intenta de nuevo.");
  }
  const cuerpo: unknown = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const c = esObjeto(cuerpo) ? cuerpo : {};
    const mensaje = typeof c.message === "string" ? c.message : "La agenda no respondió. Intenta de nuevo.";
    throw new AgendaError(respuesta.status, typeof c.codigo === "string" ? c.codigo : null, mensaje);
  }
  return cuerpo;
}

/** Todas las páginas de un listado de la agenda (100 por página, hasta 500). */
async function todas(pedir: typeof fetch, ruta: string): Promise<unknown[]> {
  const datos: unknown[] = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const separador = ruta.includes("?") ? "&" : "?";
    const cuerpo = await leer(pedir, `${ruta}${separador}pagina=${pagina}&limite=100`);
    if (!esObjeto(cuerpo) || !Array.isArray(cuerpo.datos)) throw new AgendaError(502, null, "La agenda respondió algo inesperado.");
    datos.push(...cuerpo.datos);
    if (pagina >= Number(cuerpo.totalPaginas ?? 1)) break;
  }
  return datos;
}

export function especialidadDeAgenda(v: unknown): Specialty | null {
  if (!esObjeto(v)) return null;
  const id = texto(v.id);
  const nombre = texto(v.nombre);
  return id && nombre ? { id, name: nombre, description: "" } : null;
}

export function medicoDeAgenda(v: unknown): Doctor | null {
  if (!esObjeto(v)) return null;
  const id = texto(v.id);
  const especialidad = texto(v.especialidadId);
  const nombre = texto(v.nombre);
  if (!id || !especialidad || !nombre) return null;
  const precio = esObjeto(v.precio) && typeof v.precio.importeCentavos === "number" && v.precio.importeCentavos > 0
    ? v.precio.importeCentavos / 100
    : null;
  const foto = texto(v.fotoUrl);
  return {
    id,
    specialtyId: especialidad,
    name: nombre,
    // La foto la sirve el CRM; una URL relativa es de ese mismo origen.
    ...(foto && /^(\/|https:\/\/)/.test(foto) ? { photo: foto.startsWith("/") ? `${CRM_PUBLICO}${foto}` : foto } : {}),
    weeklySchedule: texto(v.horarioInformativo),
    price: precio,
    availability: v.modalidad === "ONLINE" ? "online" : "on-request",
  };
}

export function disponibilidadDeAgenda(v: unknown, medicoId: string, fecha: string): Availability {
  if (!esObjeto(v) || v.medicoId !== medicoId || v.fecha !== fecha || !Array.isArray(v.horarios)) {
    throw new AgendaError(502, null, "La agenda respondió algo inesperado.");
  }
  if (v.estado === "SIN_ATENCION" || v.estado === "A_SOLICITUD") return { status: "not-working", slots: [] };
  if (v.estado === "SIN_CUPOS") return { status: "full", slots: [] };
  if (v.estado !== "DISPONIBLE") throw new AgendaError(502, null, "La agenda respondió algo inesperado.");
  const slots = v.horarios
    .map((h) => (esObjeto(h) && typeof h.hora === "string" && HORA.test(h.hora) ? { id: `${medicoId}_${fecha}_${h.hora}`, time: h.hora } : null))
    .filter((h): h is { id: string; time: string } => h !== null);
  return slots.length ? { status: "available", slots } : { status: "full", slots: [] };
}

export function reservaDeAgenda(v: unknown): Reservation {
  if (!esObjeto(v) || typeof v.codigo !== "number" || typeof v.referencia !== "string" || !esObjeto(v.pago)) {
    throw new AgendaError(502, null, "La reserva se registró, pero la respuesta fue inesperada. Escríbenos por WhatsApp.");
  }
  const fecha = texto(v.fecha);
  const hora = texto(v.hora);
  const precio = esObjeto(v.pago.precio) && typeof v.pago.precio.importeCentavos === "number" && v.pago.precio.importeCentavos > 0
    ? v.pago.precio.importeCentavos / 100
    : null;
  return {
    code: v.codigo,
    reference: v.referencia,
    doctorName: texto(v.medico) ?? "",
    date: fecha && FECHA.test(fecha) ? fecha : "",
    time: hora && HORA.test(hora) ? hora : "",
    amount: precio,
    bankId: typeof v.pago.bancoId === "number" ? v.pago.bancoId : null,
  };
}

const CORTO = new Intl.DateTimeFormat("es-BO", { weekday: "short", timeZone: "UTC" });

/** Una fecha civil como botón del calendario: «jue» / «8». */
export function diaDeAgenda(fecha: string): AvailabilityDay {
  const d = new Date(`${fecha}T12:00:00Z`);
  return { date: fecha, label: CORTO.format(d).replace(".", ""), day: String(d.getUTCDate()) };
}

/** Los días con horas libres de un médico, tal como los da la agenda (próximos 30). */
export function diasDeAgenda(v: unknown, medicoId: string): AvailabilityDay[] {
  if (!esObjeto(v) || v.medicoId !== medicoId || !Array.isArray(v.fechas)) {
    throw new AgendaError(502, null, "La agenda respondió algo inesperado.");
  }
  return v.fechas.filter((f): f is string => typeof f === "string" && FECHA.test(f)).map(diaDeAgenda);
}

/** Un médico con su especialidad (`/publico/agenda/medicos/:id`): para abrir la reserva ya elegida. */
export function medicoConEspecialidadDeAgenda(v: unknown): { doctor: Doctor; specialty: Specialty } | null {
  if (!esObjeto(v)) return null;
  const doctor = medicoDeAgenda(v.medico);
  const specialty = especialidadDeAgenda(v.especialidad);
  return doctor && specialty && doctor.specialtyId === specialty.id ? { doctor, specialty } : null;
}

export function createAgendaBookingData(pedir: typeof fetch = (...a) => fetch(...a)): BookingData & {
  /** `null` si ya no está disponible (inactivo, sin especialidad o inexistente). */
  getDoctor(doctorId: string): Promise<{ doctor: Doctor; specialty: Specialty } | null>;
  reservar(draft: BookingDraft): Promise<Reservation>;
  pagar(reference: string, receipt: File, nit: string, businessName: string): Promise<void>;
} {
  return {
    async getDoctor(doctorId) {
      if (!/^\d{1,10}$/.test(doctorId)) return null;
      try {
        return medicoConEspecialidadDeAgenda(await leer(pedir, `medicos/${doctorId}`));
      } catch (error) {
        if (error instanceof AgendaError && error.status === 404) return null;
        throw error;
      }
    },
    async getSpecialties() {
      return (await todas(pedir, "especialidades")).map(especialidadDeAgenda).filter((e): e is Specialty => e !== null);
    },
    async getDoctors(specialtyId) {
      const crudos = await todas(pedir, `medicos?especialidadId=${encodeURIComponent(specialtyId)}`);
      return crudos.map(medicoDeAgenda).filter((m): m is Doctor => m !== null && m.specialtyId === specialtyId);
    },
    async getDays(doctorId) {
      return diasDeAgenda(await leer(pedir, `dias?medicoId=${encodeURIComponent(doctorId)}`), doctorId);
    },
    async getAvailability(doctorId, date) {
      const consulta = new URLSearchParams({ medicoId: doctorId, fecha: date });
      return disponibilidadDeAgenda(await leer(pedir, `disponibilidad?${consulta}`), doctorId, date);
    },
    async reservar(draft) {
      if (!draft.doctor || !draft.date || !draft.slot) throw new AgendaError(400, null, "Falta elegir profesional, día y hora.");
      const cuerpo = await leer(pedir, "reservas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          medicoId: draft.doctor.id,
          fecha: draft.date,
          hora: draft.slot.time,
          nombre: draft.patient.name.trim(),
          telefono: draft.patient.phone.trim(),
          ci: draft.patient.identity.trim(),
          observaciones: draft.patient.observations.trim(),
        }),
      });
      return reservaDeAgenda(cuerpo);
    },
    async pagar(reference, receipt, nit, businessName) {
      const form = new FormData();
      form.append("referencia", reference);
      if (nit.trim()) form.append("nit", nit.trim());
      if (businessName.trim()) form.append("razonSocial", businessName.trim());
      form.append("comprobante", receipt, receipt.name);
      await leer(pedir, "reservas/pago", { method: "POST", body: form });
    },
  };
}

export const qrDelBanco = (bankId: number) => `${CRM_PUBLICO}/publico/agenda/qr/${bankId}`;

export const agendaData = createAgendaBookingData();
