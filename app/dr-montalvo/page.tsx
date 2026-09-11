import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { doctor, milestones } from "@/content/institucional";

export const metadata: Metadata = {
  title: "Dr. Montalvo",
  description:
    "Dr. Juan Carlos Montalvo, de Clínica Montalvo, Santa Cruz de la Sierra. Trayectoria e investigación médica.",
  alternates: { canonical: "/dr-montalvo" },
};

/**
 * Página del Dr. Montalvo.
 *
 * De él solo está publicado el hito de 2017; el cargo, la reseña y el retrato
 * los tiene que facilitar la clínica. La página está montada para recibirlos:
 * en cuanto `doctor.role` y `doctor.bio` tengan contenido en
 * content/institucional.ts, aparecen solos y el aviso desaparece.
 *
 * Mientras no haya cargo confirmado no se le atribuye ninguno: el subtítulo cae
 * en la ubicación de la clínica, que es un dato y no una suposición.
 */
export default function DrMontalvoPage() {
  const hasBio = doctor.bio.length > 0;

  return (
    <>
      <PageHero
        image={editorialImages.doctor}
        title={doctor.name}
        subtitle={doctor.role || `Clínica Montalvo · ${siteConfig.city}`}
        breadcrumbCurrent="Dr. Montalvo"
      />

      <section
        aria-labelledby="trayectoria"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
      >
        <SectionHeader
          index="01"
          eyebrow="Trayectoria"
          title="Investigación y práctica médica"
          description="La actividad científica que la clínica ha hecho pública."
          id="trayectoria"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            {hasBio ? (
              <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
                {doctor.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="border-l-2 border-border-strong pl-4 text-sm text-muted-foreground">
                Conozca los hitos de investigación del Dr. Juan Carlos
                Montalvo y comuníquese con la clínica para consultar por
                la disponibilidad de atención.
              </p>
            )}
          </Reveal>

          <Reveal step={2} className="lg:col-span-5">
            <ol className="border-t border-border-strong">
              {milestones.map((milestone) => (
                <li key={milestone.year} className="border-b border-border py-5">
                  <p className="label text-primary">{milestone.year}</p>
                  <p className="mt-2 text-[15px] font-medium">
                    {milestone.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {milestone.text}
                  </p>
                </li>
              ))}
            </ol>

            <Button asChild size="sm" className="mt-6">
              <Link href="/staff-medico">Ver el equipo médico</Link>
            </Button>
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
