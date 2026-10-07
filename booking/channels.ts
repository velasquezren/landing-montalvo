export type BookingChannel = "choose" | "whatsapp" | "web-demo" | "agenda";

/** Un parámetro de URL nunca habilita el prototipo en un despliegue real. */
export function initialChannel(
  demoEnabled: boolean,
  requested: string | null = null,
  hasPreselection = false,
  agendaEnabled = false,
): BookingChannel {
  if (requested === "agenda") return agendaEnabled ? "agenda" : "choose";
  if (requested === "web-demo") return demoEnabled ? "web-demo" : "choose";
  if (requested === "whatsapp") return "whatsapp";
  return hasPreselection ? "whatsapp" : "choose";
}
