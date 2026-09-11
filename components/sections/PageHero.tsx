import Link from "next/link";
import HeroBackdrop from "@/components/sections/HeroBackdrop";
import type { EditorialImage } from "@/content/images";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumbCurrent: string;
  /** Sin imagen el héroe se resuelve en tipografía sobre el verde profundo. */
  image?: EditorialImage;
  /** Datos sueltos alineados al pie del héroe (horario, teléfono…). */
  meta?: string[];
}

/**
 * Cabecera de página.
 *
 * Es un componente de servidor: los textos salen como HTML y se animan con CSS,
 * de modo que el titular ya está pintado antes de que hidrate nada.
 */
export default function PageHero({
  title,
  subtitle,
  breadcrumbCurrent,
  image,
  meta,
}: PageHeroProps) {
  const src = image?.src;
  return (
    <section
      data-hero=""
      className="relative -mt-[var(--header-h)] overflow-hidden bg-primary text-white"
    >
      {src ? (
        <HeroBackdrop src={src} alt={image?.alt ?? ""} position={image?.position} />
      ) : (
        <div className="grain absolute inset-0" aria-hidden="true" />
      )}

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-5 sm:px-8",
          "pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-20",
          "lg:pt-[calc(var(--header-h)+4rem)] lg:pb-16"
        )}
      >
        <nav aria-label="Ruta de navegación">
          <ol className="label flex items-center gap-2 text-white/75">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/30">
              /
            </li>
            {/* El verde claro de marca sobre el verde oscuro da 2,7:1 y no
                llega al mínimo legible: la miga activa va en blanco. */}
            <li aria-current="page" className="text-white">
              {breadcrumbCurrent}
            </li>
          </ol>
        </nav>

        <h1 className="display mt-6 max-w-4xl text-white">
          {title}
        </h1>

        <p
          className="lead measure mt-6 text-white/75"
        >
          {subtitle}
        </p>

        {meta && meta.length > 0 && (
          <ul
            className="label mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-5 text-white/75 lg:mt-14"
          >
            {meta.map((item) => (
              // El separador es un ::after del propio elemento: así no puede
              // caer solo al principio de una línea cuando la fila se parte.
              <li
                key={item}
                className="flex items-center gap-5 after:text-white/25 after:content-['·'] last:after:content-none"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
