import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/reveal";
import {
  about,
  descriptor,
  differentiators,
  facts,
  milestones,
  mission,
  vision,
  positioning,
  technology,
  values,
} from "@/content/institucional";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Clínica Montalvo: atención médica integral en Santa Cruz de la Sierra. Pioneros en reproducción asistida, con más de 30 especialidades y 80 especialistas.",
  alternates: { canonical: "/sobre-nosotros" },
};

export default function SobreNosotrosPage() {
  const declaredValues = values.filter((value) => value.declared);

  return (
    <>
      <PageHero
        image={editorialImages.nosotros}
        title="Sobre nosotros"
        subtitle={`${descriptor}. ${positioning}.`}
        breadcrumbCurrent="Sobre nosotros"
      />

      {/* Quiénes somos + las cifras que la clínica publica. */}
      <section
        aria-labelledby="quienes-somos"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
      >
        <SectionHeader
          index="01"
          eyebrow="Quiénes somos"
          title="Una institución de atención médica integral"
          description="Experiencia médica, tecnología y atención personalizada, al servicio de la salud de la población."
          id="quienes-somos"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              {about.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal step={2} className="lg:col-span-5">
            <dl className="border-t border-border-strong">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline gap-5 border-b border-border py-4"
                >
                  <dt className="font-display w-24 shrink-0 text-[1.625rem] font-bold leading-none tracking-[-0.02em] text-primary">
                    {fact.value}
                  </dt>
                  <dd className="text-sm leading-snug text-muted-foreground">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Tecnología, diferenciales y el hito científico que recoge la web. */}
      <section
        aria-labelledby="tecnologia"
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28"
      >
        <SectionHeader
          index="02"
          eyebrow="Tecnología"
          title={technology.title}
          description={technology.body}
          id="tecnologia"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <ul className="border-t border-border-strong">
              {differentiators.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 border-b border-border py-4 text-[15px]"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-4 shrink-0 translate-y-[-0.35em] bg-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal step={2} className="lg:col-span-5">
            <div className="border-t border-border-strong pt-6">
              <h3 className="label text-muted-foreground">Investigación</h3>
              {milestones.map((milestone) => (
                <p
                  key={milestone.year}
                  className="mt-4 text-[15px] leading-relaxed text-muted-foreground"
                >
                  <span className="font-display mr-2 text-lg font-bold text-primary">
                    {milestone.year}
                  </span>
                  {milestone.text}
                </p>
              ))}
              <Link
                href="/dr-montalvo"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Conocer al Dr. Montalvo
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valores y aseguradoras con convenio. */}
      <section
        aria-labelledby="valores"
        className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32"
      >
        <SectionHeader
          index="03"
          eyebrow="Cómo trabajamos"
          title="Nuestros valores"
          description="Los principios que la clínica repite en todas sus comunicaciones institucionales."
          id="valores"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <ul className="flex flex-wrap gap-x-3 gap-y-3">
              {declaredValues.map((value) => (
                <li
                  key={value.name}
                  className="rounded-xs border border-border-strong px-4 py-2 text-sm font-medium"
                >
                  {value.name}
                </li>
              ))}
            </ul>

            {/* La web no publica misión ni visión; el bloque aparecerá solo
                cuando Dirección apruebe una redacción oficial. */}
            {mission && vision ? (
              <dl className="measure mt-8 space-y-5 text-[15px] leading-relaxed">
                <div>
                  <dt className="label text-muted-foreground">Misión</dt>
                  <dd className="mt-2 text-muted-foreground">{mission}</dd>
                </div>
                <div>
                  <dt className="label text-muted-foreground">Visión</dt>
                  <dd className="mt-2 text-muted-foreground">{vision}</dd>
                </div>
              </dl>
            ) : null}
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
