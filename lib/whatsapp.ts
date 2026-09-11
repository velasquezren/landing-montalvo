import { siteConfig } from "@/content/site";

/**
 * El número vive en un único sitio: `content/site.ts`. Antes estaba duplicado
 * aquí como constante, así que cambiarlo obligaba a acordarse de los dos.
 */

/** Enlace de WhatsApp con el mensaje ya escrito. */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappClean}`;
  const text = message?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Mensaje para consultar por una habitación concreta. El texto es el que fijó
 * la clínica, con el nombre de la suite incrustado.
 */
export function getRoomWhatsAppUrl(roomName: string): string {
  return buildWhatsAppUrl(
    `Hola, quisiera información sobre la ${roomName} para internación. Contacto desde la Web`
  );
}

/** Mensaje general de contacto, opcionalmente sobre un asunto. */
export function getGeneralWhatsAppUrl(subject?: string): string {
  return buildWhatsAppUrl(
    subject
      ? `Hola Clínica Montalvo, quisiera realizar una consulta sobre ${subject}. Contacto desde la Web.`
      : "Hola Clínica Montalvo, quisiera comunicarme con atención al paciente. Contacto desde la Web."
  );
}
