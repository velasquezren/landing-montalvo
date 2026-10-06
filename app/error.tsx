"use client";

import { Button } from "@/components/ui/button";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Lo que se ve si una página falla al generarse por primera vez: la que pide
 * datos al CRM (una promoción, una ficha) mientras el CRM no responde. Una
 * página ya generada no llega aquí: Next sigue sirviendo su última versión.
 *
 * Dentro del layout, así que cabecera, pie y botón de WhatsApp siguen en su
 * sitio; aquí solo se ofrece reintentar o escribir.
 */
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-10 border-t border-border-strong pt-10 lg:grid-cols-12 lg:gap-16">
        <p className="label text-muted-foreground lg:col-span-4">No disponible</p>
        <div className="lg:col-span-8">
          <h1 className="h2">No pudimos cargar esta página.</h1>
          <p className="measure mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Es un problema momentáneo de nuestro lado. Vuelva a intentarlo en unos segundos o escríbanos: le
            respondemos en horario de atención.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" onClick={() => retry()}>
              Reintentar
            </Button>
            <Button asChild>
              <a href={getGeneralWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
