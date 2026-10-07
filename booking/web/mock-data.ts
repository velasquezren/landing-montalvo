import type { Doctor, Specialty } from "./types.ts";

/** Ficticios: no representan el directorio, las tarifas ni la agenda de la clínica. */
export const specialties: Specialty[] = [
  {
    id: "ginecologia",
    name: "Ginecología",
    description: "Acompañamiento en cada etapa de tu vida.",
  },
  {
    id: "cardiologia",
    name: "Cardiología",
    description: "Un espacio para cuidar tu corazón.",
  },
  {
    id: "pediatria",
    name: "Pediatría",
    description: "Atención para los más pequeños.",
  },
  {
    id: "ecografia",
    name: "Ecografía",
    description: "Elegí al profesional para tu consulta.",
  },
];
export const doctors: Doctor[] = [
  {
    id: "ana",
    specialtyId: "ginecologia",
    name: "Dra. Ana Rivera",
    weeklySchedule: "Lunes a viernes · 09:00 a 17:00",
    price: 400,
    availability: "online",
  },
  {
    id: "lucia",
    specialtyId: "ginecologia",
    name: "Dra. Lucía Méndez",
    weeklySchedule: "Lunes, miércoles y viernes · 09:00 a 13:00",
    price: 350,
    availability: "online",
  },
  {
    id: "elena",
    specialtyId: "ginecologia",
    name: "Dra. Elena Rojas",
    weeklySchedule: "Atención coordinada con la clínica",
    price: 400,
    availability: "on-request",
  },
  {
    id: "carlos",
    specialtyId: "cardiologia",
    name: "Dr. Carlos Rivera",
    weeklySchedule: "Lunes a viernes · 09:00 a 17:00",
    price: 400,
    availability: "online",
  },
  {
    id: "sofia",
    specialtyId: "pediatria",
    name: "Dra. Sofía Rojas",
    weeklySchedule: "Lunes a viernes · 09:00 a 17:00",
    price: 300,
    availability: "online",
  },
  {
    id: "diego",
    specialtyId: "ecografia",
    name: "Dr. Diego Méndez",
    weeklySchedule: "Lunes a viernes · 09:00 a 17:00",
    price: 350,
    availability: "online",
  },
];

/** Fechas civiles de Bolivia; no dependen del huso horario del dispositivo. */
export function makeDays(now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + index + 1);
    return {
      date: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat("es-BO", {
        weekday: "short",
        timeZone: "UTC",
      })
        .format(date)
        .replace(".", ""),
      day: String(date.getUTCDate()).padStart(2, "0"),
    };
  });
}
