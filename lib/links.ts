/** Entrada única al recorrido público. Los enlaces de contacto siguen separados. */
export function getAppointmentLink(): { href: string; external: boolean } {
  return { href: "/reservar", external: false };
}
