import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ServicesGrid from "@/components/sections/ServicesGrid";
import RoomsSection from "@/components/sections/RoomsSection";
import InternacionFaq from "@/components/sections/InternacionFaq";
import CtaBand from "@/components/sections/CtaBand";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/content/site";
import { servicesData } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { clinicJsonLd } from "@/lib/structured-data";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "Servicios e internación",
  description:
    "Servicios médicos e internación en suites Gold, Silver y Bronce en Clínica Montalvo, Santa Cruz de la Sierra, Bolivia.",
  path: "/servicios",
});

export default function ServiciosPage() {
  // La misma entidad que Sobre nosotros (mismo `@id`), con la lista de servicios.
  const jsonLd = {
    ...clinicJsonLd(),
    availableService: servicesData.map((service) => ({
      "@type": "MedicalProcedure",
      name: service.title,
      description: service.description,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

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
