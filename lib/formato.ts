/**
 * Montos y fechas tal como se leen en la clínica. Puro y sin dependencias:
 * lo usan páginas de servidor, el recorrido de solicitud y sus pruebas.
 */

const BS = new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 });

/** «Bs 1.250». */
export const bolivianos = (monto: number) => `Bs ${BS.format(monto)}`;

/* Las fechas civiles («2026-10-31») se leen a mediodía UTC: así ningún huso
   horario las corre de día al formatearlas. */
const civil = (fecha: string) => new Date(`${fecha}T12:00:00Z`);

const DIA_MES = new Intl.DateTimeFormat("es-BO", { day: "numeric", month: "long", timeZone: "UTC" });
const DIA_MES_ANIO = new Intl.DateTimeFormat("es-BO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** «31 de octubre», con el año solo si no es el de `referencia`. */
export function fechaCivil(fecha: string, referencia?: string): string {
  const mismoAnio = referencia !== undefined && referencia.slice(0, 4) === fecha.slice(0, 4);
  return (mismoAnio ? DIA_MES : DIA_MES_ANIO).format(civil(fecha));
}

/** «del 20 al 25 de octubre» / «el 20 de octubre». */
export function rangoCivil(desde: string, hasta: string, referencia?: string): string {
  if (desde === hasta) return `el ${fechaCivil(desde, referencia)}`;
  const mismoMes = desde.slice(0, 7) === hasta.slice(0, 7);
  const inicio = mismoMes ? String(civil(desde).getUTCDate()) : fechaCivil(desde, referencia);
  return `del ${inicio} al ${fechaCivil(hasta, referencia)}`;
}

/** Hoy en Bolivia, como fecha civil. */
export function hoyEnBolivia(ahora: Date = new Date()): string {
  // `en-CA` formatea AAAA-MM-DD, que es justo una fecha civil ISO.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);
}

export const NOMBRE_DIA = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
