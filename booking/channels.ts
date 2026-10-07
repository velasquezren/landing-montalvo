export type BookingChannel = "choose" | "whatsapp" | "web";

/**
 * El recorrido con el que se abre /reservar. `?canal=web` entra directo a la
 * reserva web; los enlaces antiguos (`web-demo`, `agenda`) llevan al mismo
 * sitio. `?medico=` / `?especialidad=` vienen del directorio del CRM y abren
 * la solicitud por WhatsApp con esa preelección.
 */
export function initialChannel(requested: string | null = null, hasPreselection = false): BookingChannel {
  if (requested === "web" || requested === "web-demo" || requested === "agenda") return "web";
  if (requested === "whatsapp") return "whatsapp";
  return hasPreselection ? "whatsapp" : "choose";
}
