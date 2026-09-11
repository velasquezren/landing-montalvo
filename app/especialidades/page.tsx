import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { fertilityTreatments, positioning } from "@/content/institucional";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Especialidades",
  description:
    "Más de 30 especialidades médicas en Clínica Montalvo, con tratamientos de reproducción asistida: fertilización in vitro, ICSI, ovodonación y más.",
  alternates: { canonical: "/especialidades" },
};

/**
 * De las más de 30 especialidades que la clínica afirma tener, la única
 * documentada hoy es reproducción asistida, con su listado de tratamientos.
 * Se publica esa y se deja dicho qué falta, en lugar de rellenar la página con
 * un listado inventado.
 */
export default function EspecialidadesPage() {
  return (
    <>
      <PageHero
        image={editorialImages.especialidades}
        title="Especialidades"
        subtitle="Más de 30 áreas médicas y 80 especialistas."
        breadcrumbCurrent="Especialidades"
      />

      <section
        aria-labelledby="reproduccion"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
      >
        <SectionHeader
          index="01"
          eyebrow={positioning}
          title="Reproducción asistida"
          description="Tratamientos especializados para aumentar las posibilidades de formar una familia."
          id="reproduccion"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <ul className="grid grid-cols-1 border-t border-border-strong sm:grid-cols-2">
              {fertilityTreatments.map((treatment) => (
                <li
                  key={treatment}
                  className="border-b border-border py-3.5 pr-4 text-[15px]"
                >
                  {treatment}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal step={2} className="lg:col-span-5">
            <div className="border-t border-border-strong pt-6">
              <h3 className="label text-muted-foreground">
                Encuentre su especialidad
              </h3>
              <p className="mt-4 border-l-2 border-border-strong pl-4 text-sm leading-relaxed text-muted-foreground">
                Cuéntenos qué atención necesita. Le orientamos sobre las
                especialidades disponibles y cómo agendar una consulta.
              </p>
              <Button asChild size="sm" className="mt-6">
                <a
                  href={buildWhatsAppUrl(
                    "Hola, quisiera consultar por una especialidad médica."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar por una especialidad
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="¿Quiere agendar una consulta?"
        body="Le orientamos sobre la especialidad y el profesional adecuados para su caso."
        whatsappMessage="Hola, quisiera agendar una consulta en Clínica Montalvo."
      />
    </>
  );
}
