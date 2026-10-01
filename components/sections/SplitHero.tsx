import type { ReactNode } from "react";
import HeroMedia from "@/components/sections/HeroMedia";
import type { EditorialImage } from "@/content/images";

interface SplitHeroProps {
  /** Id del titular, para `aria-labelledby`. */
  headingId: string;
  image: EditorialImage & { src: string };
  /** Precargar la fotografía principal de la página. */
  preload?: boolean;
  children: ReactNode;
}

/**
 * Cabecera partida: texto a la izquierda y la fotografía ocupando la mitad
 * derecha entera, de arriba abajo y hasta el borde de la pantalla.
 *
 * Es la versión a sangre para retratos. Un retrato 4:5 estirado a todo el ancho
 * de la página quedaría reducido a una franja a la altura de los ojos; a media
 * página conserva cabeza, medalla y bata.
 *
 * La columna de texto se alinea con el contenedor del resto del sitio: medio
 * `max-w-7xl` (40rem) pegado al centro, con el mismo relleno lateral.
 */
export default function SplitHero({ headingId, image, preload = false, children }: SplitHeroProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="border-b border-border bg-wash lg:grid lg:grid-cols-2"
    >
      <div className="px-5 pt-10 pb-10 sm:px-8 sm:pt-14 sm:pb-12 lg:ml-auto lg:w-full lg:max-w-[40rem] lg:self-center lg:py-20 lg:pr-16">
        {children}
      </div>
      <HeroMedia
        image={image}
        preload={preload}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[38rem]"
      />
    </section>
  );
}
