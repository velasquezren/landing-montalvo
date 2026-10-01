import { MessageCircle, Phone } from "lucide-react";
import Rings from "@/components/brand/Rings";
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
 * Una pregunta y dos formas de responderla, en una tarjeta clara con hairline
 * y no en una franja verde a sangre: pegada al pie, ésta era la mayor mancha de
 * color de cada página. El verde queda en el botón principal.
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
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24"
    >
      <div className="relative overflow-hidden border border-border bg-wash">
        <Rings className="-right-24 -top-32 w-[24rem] lg:-right-16 lg:-top-40 lg:w-[34rem]" />

        <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-end lg:gap-16 lg:p-16">
          <div className="lg:col-span-7">
            <h2 id="cta-heading" className="h2 reveal">
              {title}
            </h2>
            <Reveal step={3}>
              <p className="measure mt-5 text-muted-foreground">{body}</p>
            </Reveal>
          </div>

          <Reveal
            step={5}
            className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end"
          >
            <Button asChild variant="primary" size="lg">
              <a
                href={buildWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                Escribir por WhatsApp
              </a>
            </Button>

            <Button asChild size="lg">
              <a href={siteConfig.phoneTel}>
                <Phone className="h-4 w-4" strokeWidth={1.75} />
                {siteConfig.phone}
              </a>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
