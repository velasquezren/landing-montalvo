import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, MessageCircle, UserRound } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { obtenerMedico } from "@/lib/crm/api";
import { esSlug } from "@/lib/crm/normalizar";
import type { FichaMedico } from "@/lib/crm/tipos";
import { NOMBRE_DIA, bolivianos, hoyEnBolivia, rangoCivil } from "@/lib/formato";
import { pageMetadata } from "@/lib/metadata";
import { clinicId } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site-url";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** `REVALIDAR_SEGUNDOS` de lib/crm/api.ts. Next exige aquí un literal. */
export const revalidate = 300;

/**
 * Ninguna ficha se genera en el build: cada una se genera en su primera visita
 * y queda guardada (ISR). Con 80 especialistas, generarlas todas en el build
 * serían 80 peticiones seguidas al CRM, cerca de su límite de 120 por minuto.
 */
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

async function cargar(slug: string) {
  return esSlug(slug) ? obtenerMedico(slug) : null;
}

const especialidadesDe = (m: FichaMedico) => m.especialidades.map((e) => e.nombre).join(" · ");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const medico = await cargar((await params).slug);
  if (!medico) return { title: "Profesional no disponible", robots: { index: false } };
  const base = pageMetadata({
    title: `${medico.nombre} · ${especialidadesDe(medico)}`,
    description:
      medico.resumen ??
      `${medico.nombre}, ${especialidadesDe(medico).toLowerCase()} en Clínica Montalvo, Santa Cruz de la Sierra. Horario de atención y precio de la consulta.`,
    path: `/staff-medico/${medico.slug}`,
  });
  return medico.fotoUrl
    ? { ...base, openGraph: { ...base.openGraph, type: "profile", images: [{ url: medico.fotoUrl, alt: medico.nombre }] } }
    : base;
}

function medicoJsonLd(m: FichaMedico) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: m.nombre,
    url: absoluteUrl(`/staff-medico/${m.slug}`),
    ...(m.fotoUrl ? { image: m.fotoUrl } : {}),
    ...(m.resumen ? { description: m.resumen } : {}),
    hospitalAffiliation: { "@id": clinicId },
  };
}

export default async function MedicoPage({ params }: Props) {
  const medico = await cargar((await params).slug);
  if (!medico) notFound();

  const hoy = hoyEnBolivia();
  // Los bloques ya llegan ordenados por día y hora (lib/crm/normalizar.ts).
  const dias = [1, 2, 3, 4, 5, 6, 7]
    .map((dia) => ({ dia, bloques: medico.horario.filter((b) => b.diaSemana === dia) }))
    .filter((d) => d.bloques.length > 0);

  return (
    <>
      <JsonLd data={medicoJsonLd(medico)} />

      <section className="border-b border-border bg-wash">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-10 sm:px-8 md:grid-cols-12 lg:gap-16 lg:pb-20 lg:pt-14">
          <div className="md:col-span-5 lg:col-span-4">
            <div className="relative mx-auto aspect-[4/5] max-w-64 overflow-hidden border border-border bg-background md:max-w-none">
              {medico.fotoUrl ? (
                <Image
                  src={medico.fotoUrl}
                  alt={`Retrato de ${medico.nombre}`}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1280px) 384px, (min-width: 768px) 38vw, 256px"
                  className="object-cover object-top"
                />
              ) : (
                <UserRound aria-hidden="true" className="absolute inset-0 m-auto h-16 w-16 text-primary/30" strokeWidth={1} />
              )}
            </div>
          </div>

          <div className="md:col-span-7 md:self-center lg:col-span-8">
            <nav aria-label="Ruta de navegación">
              <ol className="label flex flex-wrap items-center gap-2 leading-normal text-muted-foreground">
                <li>
                  <Link href="/" className="transition-colors hover:text-primary">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border-strong">
                  /
                </li>
                <li>
                  <Link href="/staff-medico" className="transition-colors hover:text-primary">
                    Staff médico
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="h2 mt-6 [overflow-wrap:anywhere]">{medico.nombre}</h1>
            <p className="mt-2 text-primary">
              {medico.especialidades.map((e, i) => (
                <span key={e.slug}>
                  {i > 0 && " · "}
                  <Link href={`/staff-medico#${e.slug}`} className="hover:underline">
                    {e.nombre}
                  </Link>
                </span>
              ))}
            </p>
            {medico.matricula && (
              <p className="mt-1 text-sm text-muted-foreground">
                Matrícula profesional <span className="tabular-nums">{medico.matricula}</span>
              </p>
            )}
            {medico.resumen && <p className="lead measure mt-6">{medico.resumen}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="primary" size="lg">
                <Link href={`/reservar?medico=${medico.slug}`}>
                  <CalendarCheck aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  Solicitar una consulta
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-background">
                <a
                  href={buildWhatsAppUrl(`Hola, quisiera consultar por la atención de ${medico.nombre}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  Escribir por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-7">
          {medico.biografia ? (
            <>
              <h2 className="label text-muted-foreground">Trayectoria</h2>
              <div className="measure mt-5 space-y-4 text-[15px] leading-relaxed">
                {medico.biografia.split(/\n\s*\n/).map((parrafo, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {parrafo.trim()}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <p className="measure text-[15px] leading-relaxed text-muted-foreground">
              Para conocer la experiencia de {medico.nombre} o resolver una duda antes de la consulta, escríbanos:
              le respondemos en horario de atención.
            </p>
          )}
        </div>

        <aside className="space-y-10 lg:col-span-5" aria-label="Horario y consulta">
          <div className="border-t border-border-strong pt-6">
            <h2 className="label text-muted-foreground">Horario de atención</h2>
            {dias.length > 0 ? (
              <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
                {dias.map(({ dia, bloques }) => (
                  <div key={dia} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-3">
                    <dt className="font-medium">{NOMBRE_DIA[dia]}</dt>
                    <dd className="space-y-0.5 tabular-nums text-muted-foreground">
                      {bloques.map((b) => (
                        <p key={`${b.desde}-${b.hasta}`}>
                          {b.desde}–{b.hasta}
                          {b.lugar && <span className="text-xs"> · {b.lugar}</span>}
                        </p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">{medico.resumenHorario}.</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Hora de Bolivia. La clínica confirma cada turno.</p>
          </div>

          {medico.ausencias.length > 0 && (
            <div className="border-t border-border-strong pt-6">
              <h2 className="label text-muted-foreground">Próximas ausencias</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {medico.ausencias.map((a) => (
                  <li key={`${a.desde}-${a.hasta}`}>
                    No atiende {rangoCivil(a.desde, a.hasta, hoy)}
                    {a.motivo && <span className="text-muted-foreground"> · {a.motivo}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {medico.precioConsulta !== null && (
            <div className="border-t border-border-strong pt-6">
              <h2 className="label text-muted-foreground">Consulta</h2>
              <p className="mt-3 text-2xl font-semibold tabular-nums text-primary">
                {bolivianos(medico.precioConsulta)}
              </p>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
