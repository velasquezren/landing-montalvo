import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface CtaBandProps {
  /** Sin valores, cierra con la pregunta sobre internación. */
  title?: string;
  body?: string;
  /** Texto con el que se abre el chat de WhatsApp. */
  whatsappMessage?: string;
}

/**
 * Cierre de página.
 *
 * Se retiraron los dos círculos difuminados de 384px (`blur-3xl`) y la insignia
 * con destellos: eran decoración pura. Queda el color de marca, una pregunta y
 * dos formas de responderla.
 *
 * El texto es configurable porque la misma franja cierra páginas distintas y
 * preguntar por la internación en "Sobre nosotros" no venía a cuento.
 */
export default function CtaBand({
  title = "¿Tiene dudas sobre su internación?",
  body = "Le orientamos para elegir la habitación adecuada y le explicamos qué cubre cada categoría.",
  whatsappMessage = "Hola, quisiera orientación para elegir la habitación de internación en Clínica Montalvo.",
}: CtaBandProps = {}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="arc-end relative overflow-hidden bg-primary text-white"
    >
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-16 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-7">
          <h2 id="cta-heading" className="h2 reveal text-white">
            {title}
          </h2>
          <Reveal step={3}>
            <p className="measure mt-5 text-white/75">{body}</p>
          </Reveal>
        </div>

        <Reveal
          step={5}
          className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end"
        >
          <Button asChild variant="inverse" size="lg">
            <a
              href={buildWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              Escribir por WhatsApp
            </a>
          </Button>

          <Button asChild variant="inverseOutline" size="lg">
            <a href={siteConfig.phoneTel}>
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {siteConfig.phone}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
