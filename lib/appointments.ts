/** Entrada enlazada por la web institucional; no es una API ni un login interno. */
export const CURRENT_AGENDA_URL = "http://23.95.128.187/clinicaw/medicos/";

export function appointmentUrl(configured?: string): string {
  if (!configured?.trim()) return CURRENT_AGENDA_URL;
  try {
    const url = new URL(configured);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return CURRENT_AGENDA_URL;
    return url.href;
  } catch {
    return CURRENT_AGENDA_URL;
  }
}
