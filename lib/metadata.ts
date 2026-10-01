import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

/**
 * Imagen que acompaña al enlace cuando se comparte por WhatsApp, Facebook o
 * cualquier red. Sin ella la vista previa salía vacía, y WhatsApp es por
 * donde más se comparte una clínica en Bolivia.
 *
 * Es un archivo estático en `public/og/` y no `opengraph-image` por convención
 * de archivo: así la misma imagen llega a todas las páginas, también a las que
 * declaran su propio `openGraph` y sustituirían a la de la raíz (los metadatos
 * se combinan de forma superficial: el `openGraph` de una página reemplaza
 * entero al del layout).
 *
 * Al cambiarla, cambiar también el nombre del archivo: las redes la guardan en
 * caché por URL.
 */
export const shareImage = {
  url: "/og/clinica-montalvo.jpg",
  width: 1200,
  height: 630,
  alt: "Clínica Montalvo, atención médica integral en Santa Cruz de la Sierra",
};

interface PageMetadataInput {
  /** Título de la página, sin la marca: la plantilla del layout la añade. */
  title: string;
  description: string;
  /** Ruta de la página: "/servicios". */
  path: string;
  /** `false` para páginas que aún no tienen contenido propio. */
  index?: boolean;
  /** Usa `title` tal cual, sin añadir la marca (la portada ya la lleva). */
  absoluteTitle?: boolean;
}

/**
 * Metadatos completos de una página: canónica, Open Graph y tarjeta social con
 * el título y la descripción de esa página, no los de la portada.
 *
 * Antes solo Servicios declaraba su `openGraph`; las demás heredaban el de la
 * portada, así que al compartir «Especialidades» la vista previa decía
 * «Atención médica integral» y llevaba a la URL de la portada.
 */
export function pageMetadata({ title, description, path, index = true, absoluteTitle = false }: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_BO",
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
      images: [shareImage],
    },
    // Solo la tarjeta: X toma título, descripción e imagen de las etiquetas
    // de Open Graph cuando faltan las suyas, y repetirlas engordaba el HTML.
    twitter: { card: "summary_large_image" },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}
