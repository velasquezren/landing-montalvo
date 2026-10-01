import Link from "next/link";
import Rings from "@/components/brand/Rings";
import HeroMedia, { SIDE_TEXT } from "@/components/sections/HeroMedia";
import type { EditorialImage } from "@/content/images";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumbCurrent: string;
  /** Sin imagen el héroe se resuelve en tipografía sobre el fondo suave. */
  image?: EditorialImage;
  /** Datos sueltos alineados al pie del héroe (horario, teléfono…). */
  meta?: string[];
}

/**
 * Cabecera de página.
 *
 * Es un componente de servidor: los textos salen como HTML y se animan con CSS,
 * de modo que el titular ya está pintado antes de que hidrate nada.
 *
 * Es clara: el verde sólido a sangre pesaba más que el contenido que presentaba.
 * Con fotografía, la foto ocupa la parte derecha, de arriba abajo y hasta el
 * borde, y se funde con el fondo por detrás del texto (`HeroMedia` en modo
 * "side"). Sin ella, las circunferencias del isotipo.
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
      className={cn(
        "relative overflow-hidden border-b border-border bg-wash",
        src && "lg:flex lg:min-h-[clamp(28rem,calc(78svh_-_var(--header-h)),36rem)] lg:items-center"
      )}
    >
      {src && image ? (
        <HeroMedia
          image={{ ...image, src }}
          lcp
          layout="side"
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="h-[clamp(15rem,62vw,26rem)]"
        />
      ) : (
        <Rings className="-right-40 -top-40 w-[28rem] sm:-right-32 sm:w-[34rem] lg:-right-20 lg:-top-48 lg:w-[44rem]" />
      )}

      <div
        className={cn(
          "relative mx-auto w-full max-w-7xl px-5 sm:px-8",
          src
            ? "-mt-14 pb-12 sm:-mt-20 sm:pb-16 lg:mt-0 lg:py-16"
            : "pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20"
        )}
      >
        <div className={cn(src && SIDE_TEXT)}>
          <nav aria-label="Ruta de navegación">
            <ol className="label flex items-center gap-2 text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="text-border-strong">
                /
              </li>
              <li aria-current="page" className="text-primary">
                {breadcrumbCurrent}
              </li>
            </ol>
          </nav>

          <h1 className="display mt-6 max-w-4xl">{title}</h1>

          <p className="lead measure mt-6">{subtitle}</p>

          {meta && meta.length > 0 && (
            <ul className="label mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-strong pt-5 text-muted-foreground lg:mt-12">
              {meta.map((item) => (
                // El separador es un ::after del propio elemento: así no puede
                // caer solo al principio de una línea cuando la fila se parte.
                <li
                  key={item}
                  className="flex items-center gap-5 after:text-border-strong after:content-['·'] last:after:content-none"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
