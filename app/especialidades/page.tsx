import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { fertilityTreatments, positioning } from "@/content/institucional";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";
import { obtenerEspecialidades } from "@/lib/crm/api";

/** Las especialidades del CRM: `REVALIDAR_SEGUNDOS` de lib/crm/api.ts (Next exige un literal). */
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Especialidades",
  description:
    "Más de 30 especialidades médicas en Clínica Montalvo, con tratamientos de reproducción asistida: fertilización in vitro, ICSI, ovodonación y más.",
  path: "/especialidades",
});

/**
 * Reproducción asistida, con sus tratamientos, es el contenido institucional
 * fijo. Debajo, las especialidades que la clínica publica en el CRM, con sus
 * profesionales: la sección solo aparece cuando hay alguna, en lugar de
 * rellenar la página con un listado inventado.
 */
const profesionales = (n: number) => (n === 1 ? "1 profesional" : `${n} profesionales`);

export default async function EspecialidadesPage() {
  const especialidades = await obtenerEspecialidades();
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

      {especialidades.length > 0 && (
        <section
          aria-labelledby="areas"
          className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28"
        >
          <SectionHeader
            index="02"
            eyebrow="Áreas médicas"
            title="Especialidades y profesionales"
            description="Elija una especialidad para conocer a sus médicos o solicitar una consulta."
            id="areas"
          />

          <ul className="mt-12 grid border-l border-t border-border sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {especialidades.map((especialidad) => (
              <li
                key={especialidad.slug}
                className="flex flex-col border-b border-r border-border p-6 sm:p-7"
              >
                <h3 className="h3">{especialidad.nombre}</h3>
                {especialidad.descripcion && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {especialidad.descripcion}
                  </p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-x-5 pt-5 text-sm font-semibold">
                  {especialidad.medicos > 0 && (
                    <Link
                      href={`/staff-medico#${especialidad.slug}`}
                      className="inline-flex min-h-11 items-center text-foreground transition-colors hover:text-primary"
                    >
                      {profesionales(especialidad.medicos)}
                    </Link>
                  )}
                  <Link
                    href={`/reservar?especialidad=${especialidad.slug}`}
                    className="inline-flex min-h-11 items-center text-primary hover:underline"
                  >
                    Solicitar consulta →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand
        title="¿Quiere agendar una consulta?"
        body="Le orientamos sobre la especialidad y el profesional adecuados para su caso."
        whatsappMessage="Hola, quisiera agendar una consulta en Clínica Montalvo."
      />
    </>
  );
}
