import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Solo las páginas con contenido propio. Blog y Staff médico están en
 * preparación y llevan `noindex` (ver `pageMetadata`): listarlas aquí sería
 * pedir a los buscadores que indexen una página que se les pide no indexar.
 * Cuando tengan contenido, se añaden aquí y se les quita el `index: false`.
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({ url: absoluteUrl(route), lastModified }));
}
