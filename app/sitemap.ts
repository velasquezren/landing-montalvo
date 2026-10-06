import type { MetadataRoute } from "next";
import { obtenerMedicos, obtenerPromociones } from "@/lib/crm/api";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Solo las páginas con contenido propio. Blog sigue en preparación y lleva
 * `noindex` (ver `pageMetadata`): listarlo aquí sería pedir a los buscadores
 * que indexen una página que se les pide no indexar.
 *
 * Promociones y Staff médico entran cuando el CRM tiene algo publicado, con
 * una URL por promoción vigente y por médico: es la misma condición con la
 * que esas páginas dejan de llevar `noindex`.
 *
 * Sin `priority` ni `changeFrequency`: Google los ignora.
 */
const routes = [
  "/",
  "/servicios",
  "/especialidades",
  "/dr-montalvo",
  "/sobre-nosotros",
  "/atencion-al-paciente",
  "/reservar",
];

/** `REVALIDAR_SEGUNDOS` de lib/crm/api.ts. Next exige aquí un literal. */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [promociones, medicos] = await Promise.all([obtenerPromociones(), obtenerMedicos()]);
  const dinamicas = [
    ...(promociones.length > 0 ? ["/promociones", ...promociones.map((p) => `/promociones/${p.slug}`)] : []),
    ...(medicos.length > 0 ? ["/staff-medico", ...medicos.map((m) => `/staff-medico/${m.slug}`)] : []),
  ];
  return [...routes, ...dinamicas].map((route) => ({ url: absoluteUrl(route), lastModified }));
}
