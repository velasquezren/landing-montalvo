import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import PagePlaceholder from "@/components/sections/PagePlaceholder";
import CtaBand from "@/components/sections/CtaBand";
import MedicoCard from "@/components/crm/MedicoCard";
import { obtenerEspecialidades, obtenerMedicos } from "@/lib/crm/api";
import { pageMetadata } from "@/lib/metadata";

/** `REVALIDAR_SEGUNDOS` de lib/crm/api.ts. Next exige aquí un literal. */
export const revalidate = 300;

const DESCRIPCION =
  "Médicos especialistas de Clínica Montalvo en Santa Cruz de la Sierra: especialidad, horario de atención y precio de la consulta.";

export async function generateMetadata(): Promise<Metadata> {
  const medicos = await obtenerMedicos();
  // Fuera del índice mientras no haya fichas publicadas (ver app/sitemap.ts).
  return pageMetadata({ title: "Staff médico", description: DESCRIPCION, path: "/staff-medico", index: medicos.length > 0 });
}

const TAMANOS = "(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw";

export default async function StaffMedicoPage() {
  const [especialidades, medicos] = await Promise.all([obtenerEspecialidades(), obtenerMedicos()]);

  // Por especialidad, en el orden que fija la clínica en el CRM. Quien atiende
  // dos especialidades aparece en las dos: se busca por especialidad.
  const grupos = especialidades
    .map((especialidad) => ({
      especialidad,
      medicos: medicos.filter((m) => m.especialidades.some((e) => e.slug === especialidad.slug)),
    }))
    .filter((g) => g.medicos.length > 0);

  return (
    <>
      <PageHero
        title="Staff médico"
        subtitle="El equipo de especialistas que atiende en la clínica, con su horario y el precio de la consulta."
        breadcrumbCurrent="Staff médico"
      />

      {grupos.length === 0 ? (
        <PagePlaceholder topic="las fichas del equipo médico" />
      ) : (
        <>
          {grupos.length > 1 && (
            <nav aria-label="Especialidades" className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 lg:pt-16">
              <ul className="flex flex-wrap gap-2">
                {grupos.map(({ especialidad, medicos: lista }) => (
                  <li key={especialidad.slug}>
                    <Link
                      href={`#${especialidad.slug}`}
                      className="inline-flex min-h-10 items-center gap-2 border border-border-strong px-3.5 text-sm transition-colors hover:border-primary hover:bg-wash hover:text-primary"
                    >
                      {especialidad.nombre}
                      <span className="tabular-nums text-muted-foreground">{lista.length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="mx-auto max-w-7xl space-y-16 px-5 py-12 sm:px-8 lg:space-y-20 lg:py-16">
            {grupos.map(({ especialidad, medicos: lista }) => (
              <section key={especialidad.slug} id={especialidad.slug} aria-labelledby={`titulo-${especialidad.slug}`}>
                <div className="flex flex-col gap-3 border-t border-border-strong pt-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <h2 id={`titulo-${especialidad.slug}`} className="h2">
                      {especialidad.nombre}
                    </h2>
                    {especialidad.descripcion && (
                      <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">
                        {especialidad.descripcion}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/reservar?especialidad=${especialidad.slug}`}
                    className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-primary hover:underline"
                  >
                    Solicitar consulta →
                  </Link>
                </div>
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {lista.map((medico) => (
                    <li key={medico.slug}>
                      <MedicoCard medico={medico} sizes={TAMANOS} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}

      <CtaBand
        title="¿No sabe con quién atenderse?"
        body="Cuéntenos qué necesita y le orientamos sobre la especialidad y el profesional adecuados."
        whatsappMessage="Hola, quisiera orientación para elegir un especialista en Clínica Montalvo."
      />
    </>
  );
}
