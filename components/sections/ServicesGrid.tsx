import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Microscope,
  ScanLine,
  Scissors,
  Ambulance,
  Baby,
  Brain,
  HeartPulse,
  ArrowUpRight,
} from "lucide-react";
import SectionHeader from "@/components/sections/SectionHeader";
import { servicesData, type ServiceItem } from "@/content/services";
import { cn } from "@/lib/utils";

const iconMap = {
  Stethoscope,
  Microscope,
  ScanLine,
  Scissors,
  Ambulance,
  Baby,
  Brain,
  HeartPulse,
};

/** Columnas en escritorio; marca el desfase de entrada de cada celda. */
const COLUMNS = 4;

/**
 * Rejilla de servicios.
 *
 * Se cambió la tarjeta con sombra, icono en círculo teñido y "Ver más" por una
 * rejilla separada por líneas de 1px: menos peso visual y ninguna promesa de
 * navegación que la página no pueda cumplir.
 *
 * No envía JavaScript al navegador: la entrada escalonada la lleva el scroll
 * desde CSS.
 */
export default function ServicesGrid() {
  return (
    <section
      aria-labelledby="servicios-heading"
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeader
        index="01"
        eyebrow="Atención"
        title="Atención para cada etapa de su salud"
        description="Desde una consulta hasta su recuperación, encuentre los servicios médicos y las opciones de internación que necesita."
        id="servicios-heading"
      />

      {/* Las líneas son bordes: izquierda y abajo en cada celda, arriba y derecha
          en la lista. Así cada separación la pinta un solo elemento y no hay
          dobles ni huecos en la última fila.

          Sin `overflow-hidden`: recortar aquí convertiría a la lista en el
          contenedor de scroll de las celdas y congelaría su animación de entrada
          (ver la nota sobre `view()` en globals.css). */}
      <ul className="mt-12 grid grid-cols-1 border-r border-t border-border sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {servicesData.map((service, index) => (
          <ServiceCell key={service.id} service={service} index={index} />
        ))}
      </ul>
    </section>
  );
}

function ServiceCell({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = iconMap[service.iconName];
  const interactive = Boolean(service.href);

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <Icon
          className="h-6 w-6 text-primary"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span className="label text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-7 lg:mt-10">
        <h3 className="h3 transition-colors duration-200 group-hover:text-primary">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </div>

      {interactive && (
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
          Ver
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
      )}
    </>
  );

  const cellClass = cn(
    "group block h-full p-5 transition-colors duration-300 sm:p-6 lg:p-7",
    interactive && "hover:bg-wash"
  );

  // El elemento animado queda por dentro del relleno, nunca pegado al borde.
  // Un elemento con `transform` animado se rasteriza en su propia capa y una
  // línea de 1px que cae justo en el límite de esa capa desaparece: eso es lo
  // que borraba la separación entre la tercera y la cuarta columna.
  const content = (
    <div
      className="reveal flex h-full flex-col"
      // Las celdas de una misma fila entran de izquierda a derecha.
      style={{ "--step": index % COLUMNS } as CSSProperties}
    >
      {body}
    </div>
  );

  return (
    <li className="border-b border-l border-border bg-background">
      {service.href ? (
        service.isAnchor ? (
          <a href={service.href} className={cellClass}>
            {content}
          </a>
        ) : (
          <Link href={service.href} className={cellClass}>
            {content}
          </Link>
        )
      ) : (
        <div className={cellClass}>{content}</div>
      )}
    </li>
  );
}
