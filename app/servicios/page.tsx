import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ServicesGrid from "@/components/sections/ServicesGrid";
import RoomsSection from "@/components/sections/RoomsSection";
import InternacionFaq from "@/components/sections/InternacionFaq";
import CtaBand from "@/components/sections/CtaBand";
import { siteConfig } from "@/content/site";
import { servicesData } from "@/content/services";
import { descriptor } from "@/content/institucional";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Servicios e internación",
  description:
    "Servicios médicos e internación en suites Gold, Silver y Bronce en Clínica Montalvo, Santa Cruz de la Sierra, Bolivia.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Servicios e internación | Clínica Montalvo",
    description:
      "Servicios médicos integrales, internación en suites privadas y maternidad en Santa Cruz de la Sierra, Bolivia.",
    url: "https://clinicamontalvo.net/servicios",
    siteName: siteConfig.name,
    locale: "es_BO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicios e internación | Clínica Montalvo",
    description:
      "Atención médica integral e internación en suites Gold, Silver y Bronce en Santa Cruz de la Sierra.",
  },
};

export default function ServiciosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    slogan: descriptor,
    description: siteConfig.description,
    medicalSpecialty: ["Reproductive", "Obstetric", "Gynecologic", "Emergency"],
    url: "https://clinicamontalvo.net/servicios",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...(siteConfig.address.street ? { streetAddress: siteConfig.address.street } : {}),
      addressLocality: siteConfig.city,
      addressRegion: "Santa Cruz",
      addressCountry: siteConfig.countryCode,
    },
    openingHours: "Mo-Su 07:00-19:00",
    availableService: servicesData.map((service) => ({
      "@type": "MedicalProcedure",
      name: service.title,
      description: service.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        image={editorialImages.servicios}
        title="Atención médica integral"
        subtitle="Consultas, diagnóstico, cirugía e internación para acompañarle en cada etapa de su atención."
        breadcrumbCurrent="Servicios"
        meta={[siteConfig.schedule, siteConfig.emergencies]}
      />

      <ServicesGrid />
      <RoomsSection />
      <InternacionFaq />
      <CtaBand />
    </>
  );
}
