import type { EspecialidadAgenda, MedicoAgenda } from "../../lib/agenda/contrato.ts";

export interface ConsultaAgenda {
  paso: 0 | 1 | 2; especialidad: EspecialidadAgenda | null; medico: MedicoAgenda | null; fecha: string;
}
export const consultaInicial: ConsultaAgenda = { paso: 0, especialidad: null, medico: null, fecha: "" };
export type AccionConsulta = { tipo: "especialidad"; especialidad: EspecialidadAgenda } | { tipo: "medico"; medico: MedicoAgenda }
  | { tipo: "fecha"; fecha: string } | { tipo: "volver" };
export function reducirConsulta(estado: ConsultaAgenda, accion: AccionConsulta): ConsultaAgenda {
  switch (accion.tipo) {
    case "especialidad": return { ...estado, paso: 1, especialidad: accion.especialidad,
      medico: estado.especialidad?.id === accion.especialidad.id ? estado.medico : null,
      fecha: estado.especialidad?.id === accion.especialidad.id ? estado.fecha : "" };
    case "medico": return accion.medico.especialidadId !== estado.especialidad?.id ? estado : {
      ...estado, paso: 2, medico: accion.medico, fecha: estado.medico?.id === accion.medico.id ? estado.fecha : "",
    };
    case "fecha": return { ...estado, fecha: accion.fecha };
    case "volver": return { ...estado, paso: Math.max(0, estado.paso - 1) as ConsultaAgenda["paso"] };
  }
}
export function fechasConsulta(ahora = new Date()) {
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/La_Paz", year: "numeric", month: "2-digit", day: "2-digit" }).format(ahora);
  const ultimo = new Date(`${hoy}T00:00:00Z`); ultimo.setUTCDate(ultimo.getUTCDate() + 29);
  return { hoy, ultimo: ultimo.toISOString().slice(0, 10) };
}
export function precioConsulta(precio: MedicoAgenda["precio"]): string {
  return precio === null ? "Precio por confirmar con recepción" : `Bs ${(precio.importeCentavos / 100).toLocaleString("es-BO", { maximumFractionDigits: 2 })}`;
}
