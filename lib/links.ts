import { siteConfig } from "@/content/site";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Destino del botón "Reservar cita".
 *
 * `appointmentUrl` todavía es un marcador ([COMPLETAR: ...]); si se renderizara
 * tal cual, el botón llevaría a una ruta relativa inexistente. Mientras no haya
 * URL real, la reserva cae en WhatsApp, que es el canal que sí funciona.
 */
export function getAppointmentLink(): { href: string; external: boolean } {
  const url = siteConfig.appointmentUrl;

  if (/^https?:\/\//i.test(url)) {
    return { href: url, external: true };
  }

  return { href: getGeneralWhatsAppUrl("una reserva de cita"), external: true };
}
