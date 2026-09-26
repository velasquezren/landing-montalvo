import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import SplitHero from "@/components/sections/SplitHero";
import SectionHeader from "@/components/sections/SectionHeader";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { doctor, milestones } from "@/content/institucional";
import { getAppointmentLink } from "@/lib/links";

export const metadata: Metadata = {
  title: "Dr. Montalvo",
  description:
    "Dr. Juan Carlos Montalvo, de Clínica Montalvo, Santa Cruz de la Sierra. Trayectoria e investigación médica.",
  alternates: { canonical: "/dr-montalvo" },
};

/**
 * Página del Dr. Montalvo.
 *
 * El cargo y la reseña los tiene que facilitar la clínica. La página está montada para recibirlos:
 * en cuanto `doctor.role` y `doctor.bio` tengan contenido en
 * content/institucional.ts, aparecen solos y el aviso desaparece.
 *
 * Mientras no haya cargo confirmado no se le atribuye ninguno: el subtítulo cae
 * en la ubicación de la clínica, que es un dato y no una suposición.
 */
export default function DrMontalvoPage() {
  const hasBio = doctor.bio.length > 0;
  const appointment = getAppointmentLink();

  return (
    <>
      <SplitHero
        headingId="doctor-heading"
        image={editorialImages.doctor}
        preload
      >
        <nav aria-label="Ruta de navegación">
          <ol className="label flex items-center gap-2 text-white/75">
            <li><Link href="/" className="transition-colors hover:text-white">Inicio</Link></li>
            <li aria-hidden="true" className="text-white/30">/</li>
            <li aria-current="page" className="text-white">Dr. Montalvo</li>
          </ol>
        </nav>
        <h1 id="doctor-heading" className="display mt-6 max-w-xl text-balance">{doctor.name}</h1>
        <p className="lead mt-6 max-w-lg text-white/85">
          {doctor.role || `Clínica Montalvo · ${siteConfig.city}`}
        </p>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
          Conozca su trayectoria y su aportación a la investigación médica.
          Nuestro equipo le orientará para coordinar una consulta.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button asChild variant="inverse" size="lg">
            <a href={appointment.href} target={appointment.external ? "_blank" : undefined} rel={appointment.external ? "noopener noreferrer" : undefined}>
              Solicitar una consulta <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Button>
          <a href="#trayectoria" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white hover:underline">
            Ver trayectoria <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </SplitHero>

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
            <div>
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
