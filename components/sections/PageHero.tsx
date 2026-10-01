import Link from "next/link";
import Rings from "@/components/brand/Rings";
import HeroMedia from "@/components/sections/HeroMedia";
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
 * Con fotografía, el texto se reparte en dos columnas —titular a un lado,
 * entradilla al otro— y la foto va debajo a todo el ancho de la sección. Sin
 * ella, una columna y las circunferencias del isotipo.
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
    <section className="relative overflow-hidden border-b border-border bg-wash">
      {!src && (
        <Rings className="-right-40 -top-40 w-[28rem] sm:-right-32 sm:w-[34rem] lg:-right-20 lg:-top-48 lg:w-[44rem]" />
      )}

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-5 sm:px-8",
          "pt-10 sm:pt-14 lg:pt-16",
          src
            ? "pb-10 sm:pb-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-16 lg:pb-14"
            : "pb-12 sm:pb-16 lg:pb-20"
        )}
      >
        <div className={cn(src && "lg:col-span-7")}>
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
        </div>

        <div className={cn(src && "lg:col-span-5")}>
          <p className={cn("lead measure mt-6", src && "lg:mt-0")}>{subtitle}</p>

          {meta && meta.length > 0 && (
            <ul
              className={cn(
                "label mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-strong pt-5 text-muted-foreground",
                src ? "lg:mt-6" : "lg:mt-12"
              )}
            >
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

      {src && image && (
        <HeroMedia
          image={{ ...image, src }}
          preload
          sizes="100vw"
          className="h-[clamp(15rem,min(34vw,calc(100svh_-_23rem)),30rem)]"
        />
      )}
    </section>
  );
}
