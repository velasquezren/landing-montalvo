import { editorialImages } from "@/content/images";
import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { insurers, maternity } from "@/content/institucional";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getAppointmentLink } from "@/lib/links";

export const metadata: Metadata = {
  title: "Atención al paciente",
  description:
    "Cómo agendar una consulta en Clínica Montalvo, programa de maternidad Plan Nacer y aseguradoras con convenio.",
  alternates: { canonical: "/atencion-al-paciente" },
};

/**
 * Página práctica: lo que un paciente necesita resolver antes de venir.
 *
 * Existe porque hay contenido verificado que darle (cómo agendar, Plan Nacer y
 * las aseguradoras con convenio). Los seguros estaban en "Sobre nosotros", que
 * es una página institucional: quien busca si su seguro sirve no entra ahí.
 */
export default function AtencionAlPacientePage() {
  const appointment = getAppointmentLink();

  return (
    <>
      <PageHero
        image={editorialImages.pacientes}
        title="Atención al paciente"
        subtitle="Cómo agendar, qué cubre el programa de maternidad y con qué seguros trabajamos."
        breadcrumbCurrent="Atención al paciente"
      />

      <section
        aria-labelledby="agendar"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
      >
        <SectionHeader
          index="01"
          eyebrow="Citas"
          title="Cómo agendar una consulta"
          description="Por WhatsApp o por teléfono, en horario de atención. Las emergencias se atienden las 24 horas."
          id="agendar"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <dl className="border-t border-border-strong">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-border py-4">
                <dt className="label w-32 shrink-0 text-muted-foreground">
                  Horario
                </dt>
                <dd className="text-[15px]">{siteConfig.schedule}</dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-border py-4">
                <dt className="label w-32 shrink-0 text-muted-foreground">
                  Emergencias
                </dt>
                <dd className="text-[15px] font-medium text-primary">
                  {siteConfig.emergencies}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-border py-4">
                <dt className="label w-32 shrink-0 text-muted-foreground">
                  Teléfono
                </dt>
                <dd className="text-[15px]">
                  <a href={siteConfig.phoneTel} className="hover:text-primary">
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-border py-4">
                <dt className="label w-32 shrink-0 text-muted-foreground">
                  Correo
                </dt>
                <dd className="text-[15px]">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="hover:text-primary"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="md">
                <a
                  href={appointment.href}
                  target={appointment.external ? "_blank" : undefined}
                  rel={appointment.external ? "noopener noreferrer" : undefined}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                  Reservar cita
                </a>
              </Button>
              <Button asChild variant="ghost" size="md">
                <a href={siteConfig.phoneTel}>
                  <Phone className="h-4 w-4" strokeWidth={1.75} />
                  Llamar
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal step={2} className="lg:col-span-5">
            <div className="border-t border-border-strong pt-6">
              <h3 className="label text-muted-foreground">Admisión</h3>
              <p className="mt-4 border-l-2 border-border-strong pl-4 text-sm leading-relaxed text-muted-foreground">
                Antes de su ingreso, consulte con admisiones los documentos
                y requisitos para su atención. También puede solicitar
                orientación sobre su estancia y compartir sus consultas.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="maternidad"
        className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32"
      >
        <SectionHeader
          index="02"
          eyebrow="Programas y convenios"
          title={maternity.title}
          description={maternity.body}
          id="maternidad"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="border-t border-border-strong pt-6 text-[15px] leading-relaxed text-muted-foreground">
              {maternity.note}
            </p>
            <Button asChild size="md" className="mt-6">
              <a
                href={buildWhatsAppUrl(
                  "Hola, quisiera información sobre el programa Plan Nacer."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar por Plan Nacer
              </a>
            </Button>
          </Reveal>

          <Reveal step={2} className="lg:col-span-5">
            <div className="border-t border-border-strong pt-6">
              <h3 className="label text-muted-foreground">
                Aseguradoras con convenio
              </h3>
              <ul className="mt-4">
                {insurers.map((insurer) => (
                  <li
                    key={insurer}
                    className="border-b border-border py-3 text-[15px]"
                  >
                    {insurer}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Consulte la cobertura de su póliza antes de su cita.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="¿Necesita ayuda para agendar?"
        body="Admisiones le responde por WhatsApp durante el horario de atención."
        whatsappMessage="Hola, necesito ayuda para agendar una cita en Clínica Montalvo."
      />
    </>
  );
}
