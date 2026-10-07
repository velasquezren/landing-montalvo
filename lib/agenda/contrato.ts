/** Vista pública del contrato v1 de modules/agenda del CRM. Sin datos de pacientes. */
export interface EspecialidadAgenda { id: string; nombre: string }
export interface MedicoAgenda {
  id: string; especialidadId: string; nombre: string;
  horarioInformativo: string | null;
  modalidad: "ONLINE" | "A_SOLICITUD";
  precio: { importeCentavos: number; moneda: "BOB" } | null;
}
export interface DisponibilidadAgenda {
  medicoId: string; fecha: string; zonaHoraria: "America/La_Paz"; consultadoEn: string;
  estado: "DISPONIBLE" | "SIN_CUPOS" | "SIN_ATENCION" | "A_SOLICITUD";
  horarios: { id: string; hora: string }[];
}
export interface PaginaAgenda<T> { datos: T[]; total: number; pagina: number; limite: number; totalPaginas: number }
export type RecursoAgenda = "especialidades" | "medicos" | "disponibilidad";

const id = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(v);
const texto = (v: unknown, max: number): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= max;
const objeto = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
const entero = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v >= 0;

function especialidad(v: unknown): v is EspecialidadAgenda { return objeto(v) && id(v.id) && texto(v.nombre, 210); }
function medico(v: unknown): v is MedicoAgenda {
  return especialidad(v) && objeto(v) && id(v.especialidadId)
    && (v.horarioInformativo === null || texto(v.horarioInformativo, 600))
    && (v.modalidad === "ONLINE" || v.modalidad === "A_SOLICITUD")
    && (v.precio === null || objeto(v.precio) && entero(v.precio.importeCentavos) && v.precio.importeCentavos <= 100_000_000 && v.precio.moneda === "BOB");
}

export function leerPagina<T>(v: unknown, pagina: number, esItem: (v: unknown) => v is T): PaginaAgenda<T> {
  if (!objeto(v) || v.pagina !== pagina || v.limite !== 25 || !entero(v.total) || v.total > 100_000
    || v.totalPaginas !== Math.max(1, Math.ceil(v.total / 25)) || !Array.isArray(v.datos)
    || v.datos.length !== Math.max(0, Math.min(25, v.total - (pagina - 1) * 25)) || !v.datos.every(esItem)) {
    throw new Error("No pudimos consultar la agenda.");
  }
  return { datos: v.datos, total: v.total, pagina, limite: 25, totalPaginas: v.totalPaginas };
}

/** También proyecta campos: la ruta Next no retransmite JSON arbitrario. */
export function leerRespuesta(recurso: "especialidades", v: unknown, query: URLSearchParams): PaginaAgenda<EspecialidadAgenda>;
export function leerRespuesta(recurso: "medicos", v: unknown, query: URLSearchParams): PaginaAgenda<MedicoAgenda>;
export function leerRespuesta(recurso: "disponibilidad", v: unknown, query: URLSearchParams): DisponibilidadAgenda;
export function leerRespuesta(recurso: RecursoAgenda, v: unknown, query: URLSearchParams): PaginaAgenda<EspecialidadAgenda> | PaginaAgenda<MedicoAgenda> | DisponibilidadAgenda;
export function leerRespuesta(recurso: RecursoAgenda, v: unknown, query: URLSearchParams) {
  if (recurso === "especialidades") {
    const p = leerPagina(v, Number(query.get("pagina") ?? 1), especialidad);
    return { ...p, datos: p.datos.map(({ id, nombre }) => ({ id, nombre })) };
  }
  if (recurso === "medicos") {
    const p = leerPagina(v, Number(query.get("pagina") ?? 1), medico);
    if (p.datos.some(m => m.especialidadId !== query.get("especialidadId"))) throw new Error("Especialidad diferente");
    return { ...p, datos: p.datos.map(m => ({ id: m.id, nombre: m.nombre, especialidadId: m.especialidadId,
      modalidad: m.modalidad, horarioInformativo: m.horarioInformativo,
      precio: m.precio && { importeCentavos: m.precio.importeCentavos, moneda: m.precio.moneda } })) };
  }
  if (!objeto(v) || v.medicoId !== query.get("medicoId") || v.fecha !== query.get("fecha")
    || v.zonaHoraria !== "America/La_Paz" || !texto(v.consultadoEn, 35)
    || !Number.isFinite(Date.parse(v.consultadoEn)) || Date.now() - Date.parse(v.consultadoEn) > 60_000
    || Date.parse(v.consultadoEn) - Date.now() > 5_000
    || !["DISPONIBLE", "SIN_CUPOS", "SIN_ATENCION", "A_SOLICITUD"].includes(String(v.estado))
    || !Array.isArray(v.horarios) || v.horarios.length > 288
    || (v.estado === "DISPONIBLE") !== (v.horarios.length > 0)) throw new Error("Disponibilidad no válida");
  const horarios = v.horarios.map(h => {
    if (!objeto(h) || !id(h.id) || typeof h.hora !== "string" || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(h.hora)) throw new Error("Horario no válido");
    return { id: h.id, hora: h.hora };
  });
  if (new Set(horarios.map(h => h.id)).size !== horarios.length || new Set(horarios.map(h => h.hora)).size !== horarios.length) throw new Error("Horarios duplicados");
  return { medicoId: String(v.medicoId), fecha: String(v.fecha), zonaHoraria: "America/La_Paz" as const,
    consultadoEn: v.consultadoEn, estado: v.estado as DisponibilidadAgenda["estado"], horarios };
}

/** Lista cerrada de recursos y parámetros; nunca permite elegir destino ni ruta remota. */
export function consultaAgenda(recurso: string, entrada: URLSearchParams): { recurso: RecursoAgenda; query: URLSearchParams } | null {
  const permitidos = recurso === "especialidades" ? ["pagina"] : recurso === "medicos" ? ["pagina", "especialidadId"]
    : recurso === "disponibilidad" ? ["medicoId", "fecha"] : null;
  if (!permitidos || [...entrada.keys()].some(k => !permitidos.includes(k) || entrada.getAll(k).length !== 1)) return null;
  const query = new URLSearchParams(entrada);
  if (recurso !== "disponibilidad") {
    const pagina = query.get("pagina") ?? "1";
    if (!/^[1-9]\d{0,3}$/.test(pagina)) return null;
    query.set("pagina", pagina); query.set("limite", "25");
  }
  if (recurso === "medicos" && !id(query.get("especialidadId"))) return null;
  if (recurso === "disponibilidad" && (!id(query.get("medicoId")) || !/^\d{4}-\d{2}-\d{2}$/.test(query.get("fecha") ?? ""))) return null;
  return { recurso: recurso as RecursoAgenda, query };
}
