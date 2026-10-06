import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MessageCircle, Tag } from "lucide-react";
import Precio from "@/components/crm/Precio";
import JsonLd from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { obtenerPromocion, obtenerPromociones } from "@/lib/crm/api";
import { esSlug } from "@/lib/crm/normalizar";
import type { PromocionPublica } from "@/lib/crm/tipos";
import { fechaCivil, hoyEnBolivia } from "@/lib/formato";
import { pageMetadata } from "@/lib/metadata";
import { clinicId } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site-url";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** `REVALIDAR_SEGUNDOS` de lib/crm/api.ts. Next exige aquí un literal. */
export const revalidate = 300;

/**
 * Las vigentes salen en el build; una publicada después se genera en su
 * primera visita y queda guardada igual (ISR). Una vencida o pausada da 404
 * en la siguiente regeneración, o al instante con el aviso del CRM.
 */
export async function generateStaticParams() {
  const promociones = await obtenerPromociones();
  return promociones.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

async function cargar(slug: string) {
  // Un slug imposible no viaja al CRM: 404 directo.
  return esSlug(slug) ? obtenerPromocion(slug) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const promocion = await cargar((await params).slug);
  if (!promocion) return { title: "Promoción no disponible", robots: { index: false } };
  const base = pageMetadata({
    title: promocion.titulo,
    description: promocion.resumen || `Promoción de Clínica Montalvo: ${promocion.titulo}.`,
    path: `/promociones/${promocion.slug}`,
  });
  // Al compartir el enlace por WhatsApp, la vista previa es el banner.
  const banner = promocion.banners.HORIZONTAL ?? promocion.banners.CUADRADO;
  return banner
    ? { ...base, openGraph: { ...base.openGraph, images: [{ url: banner.url, width: banner.ancho, height: banner.alto, alt: banner.alt }] } }
    : base;
}

/** Un texto del CRM en párrafos: una línea en blanco separa párrafos. */
function Parrafos({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/\n\s*\n/).map((parrafo, i) => (
        <p key={i} className="whitespace-pre-line">
          {parrafo.trim()}
        </p>
      ))}
    </>
  );
}

function ofertaJsonLd(p: PromocionPublica) {
  const precio = p.precioPromocional ?? p.precioRegular;
  const banner = p.banners.CUADRADO ?? p.banners.HORIZONTAL;
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: p.titulo,
    description: p.resumen || undefined,
    url: absoluteUrl(`/promociones/${p.slug}`),
    ...(banner ? { image: banner.url } : {}),
    ...(precio !== null ? { price: precio, priceCurrency: "BOB" } : {}),
    validFrom: p.vigenteDesde,
    ...(p.vigenteHasta ? { validThrough: p.vigenteHasta } : {}),
    offeredBy: { "@id": clinicId },
  };
}

export default async function PromocionPage({ params }: Props) {
  const promocion = await cargar((await params).slug);
  if (!promocion) notFound();

  const hoy = hoyEnBolivia();
  const banner = promocion.banners.CUADRADO ?? promocion.banners.VERTICAL;
  const unMedico = promocion.medicos.length === 1 ? promocion.medicos[0] : null;
  const enlaceSolicitud = unMedico
    ? `/reservar?medico=${unMedico.slug}`
    : promocion.especialidad
      ? `/reservar?especialidad=${promocion.especialidad.slug}`
      : null;

  return (
    <>
      <JsonLd data={ofertaJsonLd(promocion)} />

      <section className="border-b border-border bg-wash">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:pb-20 lg:pt-14">
          <div className="lg:col-span-5">
            <div className="relative aspect-square overflow-hidden border border-border bg-background">
              {banner ? (
                <Image
                  src={banner.url}
                  alt={banner.alt}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <Tag aria-hidden="true" className="absolute inset-0 m-auto h-12 w-12 text-primary/30" strokeWidth={1.25} />
              )}
            </div>
          </div>

          <div className="lg:col-span-7 lg:self-center">
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
                  <Link href="/promociones" className="transition-colors hover:text-primary">
                    Promociones
                  </Link>
                </li>
              </ol>
            </nav>

            {promocion.etiquetaOferta && (
              <p className="mt-6 inline-block bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                {promocion.etiquetaOferta}
              </p>
            )}
            <h1 className="h2 mt-4 [overflow-wrap:anywhere]">{promocion.titulo}</h1>
            {promocion.resumen && <p className="lead measure mt-4">{promocion.resumen}</p>}

            <div className="mt-8 border-t border-border-strong pt-6">
              <Precio promocion={promocion} grande />
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                {promocion.vigenteHasta
                  ? `Válida hasta el ${fechaCivil(promocion.vigenteHasta, hoy)}`
                  : "Vigente hasta nuevo aviso"}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="primary" size="lg">
                <a href={buildWhatsAppUrl(promocion.mensajeWhatsapp)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  Quiero esta promoción
                </a>
              </Button>
              {enlaceSolicitud && (
                <Button asChild size="lg" className="bg-background">
                  <Link href={enlaceSolicitud}>Elegir día y profesional</Link>
                </Button>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Código de la promoción: <span className="font-semibold tabular-nums text-foreground">{promocion.codigo}</span>
              . Va incluido en el mensaje de WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {(promocion.descripcion || promocion.condiciones || promocion.medicos.length > 0) && (
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-24">
          {promocion.descripcion && (
            <div className="lg:col-span-7">
              <h2 className="label text-muted-foreground">Qué incluye</h2>
              <div className="measure mt-5 space-y-4 text-[15px] leading-relaxed">
                <Parrafos texto={promocion.descripcion} />
              </div>
            </div>
          )}

          <div className={promocion.descripcion ? "space-y-10 lg:col-span-5" : "space-y-10 lg:col-span-7"}>
            {promocion.condiciones && (
              <div className="border-t border-border-strong pt-6">
                <h2 className="label text-muted-foreground">Condiciones</h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <Parrafos texto={promocion.condiciones} />
                </div>
              </div>
            )}
            {promocion.medicos.length > 0 && (
              <div className="border-t border-border-strong pt-6">
                <h2 className="label text-muted-foreground">
                  {promocion.medicos.length === 1 ? "La atiende" : "La atienden"}
                </h2>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {promocion.medicos.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/staff-medico/${m.slug}`}
                        className="flex min-h-12 items-center justify-between gap-4 py-3 text-sm font-medium transition-colors hover:text-primary"
                      >
                        <span className="min-w-0 truncate">{m.nombre}</span>
                        <span aria-hidden="true" className="text-primary">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
