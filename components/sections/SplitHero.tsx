import type { ReactNode } from "react";
import Rings from "@/components/brand/Rings";
import EditorialPhoto from "@/components/sections/EditorialPhoto";
import type { EditorialImage } from "@/content/images";

interface SplitHeroProps {
  /** Id del titular, para `aria-labelledby`. */
  headingId: string;
  image: EditorialImage;
  /** Precargar la fotografía principal de la página. */
  preload?: boolean;
  caption?: ReactNode;
  children: ReactNode;
}

/**
 * Cabecera editorial con retrato 4:5, completo en todos los tamaños: la
 * proporción del marco es la del original y los bordes se funden con el fondo.
 */
export default function SplitHero({ headingId, image, preload = false, caption, children }: SplitHeroProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="relative overflow-hidden border-b border-border bg-wash"
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-10 pb-14 sm:gap-12 sm:px-8 sm:pt-14 sm:pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:pt-12 lg:pb-16">
        <div>
          {children}
        </div>
        <figure className="relative mx-auto w-full max-w-xs lg:max-w-[22rem]">
          <Rings className="left-1/2 top-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 lg:w-[150%]" />
          <EditorialPhoto
            image={image}
            preload={preload}
            quality={85}
            sizes="(min-width: 1024px) 352px, 320px"
            className="feather hero-photo relative aspect-[4/5]"
          />
          {caption && (
            <figcaption className="relative mt-4 text-center text-sm leading-relaxed text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
