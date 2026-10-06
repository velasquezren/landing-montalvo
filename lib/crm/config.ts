/**
 * Dónde vive la API pública del CRM. Una sola fuente: la usan la capa de
 * datos (`lib/crm/api.ts`) y `next.config.ts`, que deja a `next/image`
 * optimizar las fotos y banners que sirve ese mismo origen.
 *
 * No es un secreto —la API pública no lleva credenciales—, pero tampoco
 * `NEXT_PUBLIC_`: el navegador nunca habla con el CRM, todo se pide en el
 * servidor y llega ya renderizado.
 */
export const CRM_API_URL = (process.env.CRM_API_URL || "https://crm.107.175.132.15.nip.io").replace(/\/+$/, "");
