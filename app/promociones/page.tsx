import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import PromocionCard from "@/components/crm/PromocionCard";
import { Button } from "@/components/ui/button";
import { obtenerPromociones } from "@/lib/crm/api";
import { hoyEnBolivia } from "@/lib/formato";
import { pageMetadata } from "@/lib/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** `REVALIDAR_SEGUNDOS` de lib/crm/api.ts. Next exige aquí un literal. */
export const revalidate = 300;

const DESCRIPCION =
  "Promociones vigentes de Clínica Montalvo en Santa Cruz de la Sierra: precios, condiciones y hasta cuándo valen.";

export async function generateMetadata(): Promise<Metadata> {
  const promociones = await obtenerPromociones();
  // Sin promociones la página no tiene nada propio que ofrecer a un buscador.
  return pageMetadata({ title: "Promociones", description: DESCRIPCION, path: "/promociones", index: promociones.length > 0 });
}

export default async function PromocionesPage() {
  const promociones = await obtenerPromociones();
  const hoy = hoyEnBolivia();

  return (
    <>
      <PageHero
        title="Promociones"
        subtitle="Ofertas vigentes en consultas, estudios y tratamientos. Cada una con su precio, sus condiciones y su fecha de cierre."
        breadcrumbCurrent="Promociones"
      />

      <section aria-labelledby="promociones-vigentes" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <h2 id="promociones-vigentes" className="sr-only">
          Promociones vigentes
        </h2>
        {promociones.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {promociones.map((promocion, i) => (
              <li key={promocion.slug}>
                <PromocionCard
                  promocion={promocion}
                  hoy={hoy}
                  prioridad={i === 0}
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-8 border-t border-border-strong pt-10 lg:grid-cols-12 lg:gap-16">
            <p className="label text-muted-foreground lg:col-span-4">Sin promociones vigentes</p>
            <div className="lg:col-span-8">
              <p className="h3">En este momento no hay promociones publicadas.</p>
              <p className="measure mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Puede solicitar su consulta igualmente o escribirnos para conocer los precios vigentes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="primary">
                  <Link href="/reservar">Solicitar una consulta</Link>
                </Button>
                <Button asChild>
                  <a
                    href={buildWhatsAppUrl("Hola, quisiera conocer los precios de consulta en Clínica Montalvo.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Consultar precios por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <CtaBand
        title="¿Tiene dudas sobre una promoción?"
        body="Le explicamos qué incluye, cómo agendar y qué condiciones aplican."
        whatsappMessage="Hola, quisiera información sobre las promociones de Clínica Montalvo."
      />
    </>
  );
}
