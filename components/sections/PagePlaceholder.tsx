import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Bloque compartido por las páginas que todavía no tienen contenido.
 *
 * Las cinco repetían el mismo recuadro con borde discontinuo sobre fondo verde
 * claro y un [COMPLETAR] como titular. Este es sobrio, dice qué falta y deja
 * dos salidas útiles en lugar de dejar al visitante en un callejón.
 */
export default function PagePlaceholder({
  topic,
}: {
  /** Qué contendrá la página, en minúsculas: "el staff médico". */
  topic: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <Reveal className="grid gap-10 border-t border-border-strong pt-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="label text-muted-foreground">En preparación</p>
        </div>

        <div className="lg:col-span-8">
          <p className="h3">
            Estamos redactando {topic}.
          </p>
          <p className="measure mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Mientras tanto puede consultar la oferta de servicios e internación o
            escribirnos directamente: le respondemos en horario de atención.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="md">
              <Link href="/servicios">Ver servicios e internación</Link>
            </Button>
            <Button asChild variant="ghost" size="md">
              <a
                href={buildWhatsAppUrl(
                  "Hola, quisiera información sobre Clínica Montalvo."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribir por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
