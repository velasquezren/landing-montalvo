/**
 * Dirección pública del sitio, sin barra final: la base de las URLs canónicas,
 * del sitemap, de los metadatos sociales y de los datos estructurados.
 *
 * Antes estaba escrita a mano como `https://clinicamontalvo.net` en cinco
 * sitios, mientras el sitio se publicaba en `clinicamontalvo.vercel.app`: cada
 * página declaraba como canónica una dirección en la que no estaba, y los
 * buscadores y las vistas previas de WhatsApp apuntaban a otro sitio.
 *
 * Orden de preferencia:
 * 1. `NEXT_PUBLIC_SITE_URL`, para fijarla a mano.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL`, que Vercel expone al compilar: es el
 *    dominio de producción del proyecto, el propio en cuanto se asigne uno y
 *    el `.vercel.app` mientras no. Al conectar `clinicamontalvo.net` todo
 *    cambia solo, sin tocar código.
 * 3. El dominio de producción actual, para compilaciones locales.
 *
 * Solo se usa en el servidor: las variables sin `NEXT_PUBLIC_` no llegan al
 * navegador.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "https://clinicamontalvo.vercel.app";
}

export const siteUrl = resolveSiteUrl();

/** URL absoluta de una ruta del sitio: `absoluteUrl("/servicios")`. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl}/`).toString();
}
