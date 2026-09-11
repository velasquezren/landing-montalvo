import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Numeración editorial: "01", "02"… Ordena la página sin añadir adornos. */
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  className?: string;
}

/**
 * Encabezado de sección.
 *
 * Antes cada sección repetía el mismo bloque centrado (antetítulo + título +
 * párrafo), que es el patrón con el que se reconoce una plantilla a distancia.
 * Este va alineado a la izquierda y reparte título y descripción en dos
 * columnas, que es como se compone una página editorial.
 */
export default function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  id,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("", className)}>
      <Reveal className="flex items-center gap-3">
        <span className="label text-primary">{index}</span>
        <span aria-hidden="true" className="arc-rule text-border-strong" />
        <span className="label text-muted-foreground">{eyebrow}</span>
      </Reveal>

      <div className="mt-6 grid gap-x-12 gap-y-5 lg:mt-8 lg:grid-cols-12 lg:items-end">
        <h2 id={id} className="h2 reveal lg:col-span-7">
          {title}
        </h2>

        {description && (
          <Reveal step={3} className="lg:col-span-5">
            <p className="lead">{description}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
