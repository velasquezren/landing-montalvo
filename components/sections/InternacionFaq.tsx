import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "@/components/sections/SectionHeader";
import { Reveal } from "@/components/ui/reveal";
import { internacionFaqs } from "@/content/faq";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function InternacionFaq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"
    >
      <SectionHeader
        index="03"
        eyebrow="Antes de ingresar"
        title="Preguntas frecuentes"
        description="Requisitos, visitas, cobertura y reserva de habitación."
        id="faq-heading"
      />

      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-8">
          <Accordion type="single" collapsible className="border-t border-border">
            {internacionFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.isPending ? (
                    <>
                      Consulte este detalle con admisiones antes de su ingreso.
                      {" "}
                      <a
                        href={buildWhatsAppUrl(`Hola, quisiera consultar: ${faq.question}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline underline-offset-4"
                      >
                        Consultar por WhatsApp
                      </a>
                    </>
                  ) : faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal step={3} className="lg:col-span-4">
          <div className="border-t border-border-strong pt-6">
            <h3 className="h3">¿Su pregunta no está aquí?</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Admisiones responde por WhatsApp durante el horario de atención,
              {" "}
              {siteConfig.schedule.toLowerCase()}.
            </p>
            <a
              href={buildWhatsAppUrl(
                "Hola, tengo una consulta sobre la internación en Clínica Montalvo."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Escribir a admisiones
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
