import Link from "next/link";
import Rings from "@/components/brand/Rings";
import EditorialPhoto from "@/components/sections/EditorialPhoto";
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
 * La marca queda en la etiqueta y en el botón; con fotografía, ésta va en su
 * propio marco en arco, y sin ella, las circunferencias del isotipo.
 */
export default function PageHero({
  title,
  subtitle,
  breadcrumbCurrent,
  image,
  meta,
}: PageHeroProps) {
  const hasPhoto = Boolean(image?.src);
  return (
    <section
      className="relative overflow-hidden border-b border-border bg-wash"
    >
      {!hasPhoto && (
        <Rings className="-right-40 -top-40 w-[28rem] sm:-right-32 sm:w-[34rem] lg:-right-20 lg:-top-48 lg:w-[44rem]" />
      )}

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-5 sm:px-8",
          "pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16",
          hasPhoto
            ? "grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-16"
            : "lg:pb-20"
        )}
      >
        <div>
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

        {image?.src && (
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
            <Rings className="-bottom-14 -right-16 w-[110%]" />
            <EditorialPhoto
              image={image}
              quality={85}
              sizes="(min-width: 1024px) 760px, (min-width: 640px) 576px, 520px"
              className="arch relative aspect-[5/4] shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
