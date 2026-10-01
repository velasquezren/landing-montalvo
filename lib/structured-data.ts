import { siteConfig } from "@/content/site";
import { descriptor } from "@/content/institucional";
import { shareImage } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site-url";

/**
 * La clínica como entidad de schema.org (`MedicalClinic`).
 *
 * Solo lleva datos de `content/site.ts`, que son los publicados por la clínica:
 * nada de dirección mientras no esté confirmada, ni coordenadas inventadas.
 *
 * El `@id` es fijo para que Sobre nosotros y Servicios hablen de la misma entidad:
 * los buscadores combinan los dos bloques en lugar de ver dos clínicas.
 */
export const clinicId = absoluteUrl("/#clinica");

export function clinicJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": clinicId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    // Sin `description`: es la misma de la etiqueta meta de cada página.
    slogan: descriptor,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icons/icon-512.png"),
    image: absoluteUrl(shareImage.url),
    // Bolivia es +591; el número es el que publica la clínica.
    telephone: `+591 ${siteConfig.phone}`,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...(siteConfig.address.street ? { streetAddress: siteConfig.address.street } : {}),
      addressLocality: siteConfig.city,
      addressRegion: "Santa Cruz",
      addressCountry: siteConfig.countryCode,
    },
    // `siteConfig.schedule`: «Lunes a domingo, 7:00 a 19:00».
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "19:00",
    },
    // Solo valores que existen en la enumeración MedicalSpecialty de
    // schema.org. «Reproductive», que figuraba antes, no existe y se ignoraba.
    medicalSpecialty: ["Gynecologic", "Obstetric", "Emergency"],
    sameAs: Object.values(siteConfig.socialLinks),
  };
}
