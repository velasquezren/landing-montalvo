import type { ReactNode } from "react";
import HeroMedia, { SIDE_TEXT } from "@/components/sections/HeroMedia";
import type { EditorialImage } from "@/content/images";

interface SplitHeroProps {
  /** Id del titular, para `aria-labelledby`. */
  headingId: string;
  image: EditorialImage & { src: string };
  /** La foto es el elemento más grande de la primera pantalla. */
  lcp?: boolean;
  children: ReactNode;
}

/**
 * Cabecera con retrato: el texto a la izquierda y la foto detrás, ocupando la
 * parte derecha de arriba abajo y hasta el borde de la pantalla, con su borde
 * izquierdo fundido con el fondo (`HeroMedia` en modo "side").
 *
 * Un retrato 4:5 a todo el ancho de la página quedaría reducido a una franja a
 * la altura de los ojos; en la parte derecha conserva cabeza, medalla y bata.
 *
 * En móvil, como el resto de cabeceras: la foto arriba, fundida hacia abajo, y
 * el titular entrando encima.
 */
export default function SplitHero({ headingId, image, lcp = false, children }: SplitHeroProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="relative overflow-hidden border-b border-border bg-wash lg:flex lg:min-h-[38rem] lg:items-center"
    >
      <HeroMedia
        image={image}
        lcp={lcp}
        layout="side"
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto"
      />
      <div className="relative mx-auto -mt-16 w-full max-w-7xl px-5 pb-12 sm:-mt-24 sm:px-8 sm:pb-14 lg:mt-0 lg:py-20">
        <div className={SIDE_TEXT}>
          {children}
        </div>
      </div>
    </section>
  );
}
