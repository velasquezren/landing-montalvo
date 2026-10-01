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
 * Cabecera editorial con retrato 4:5, completo en todos los tamaños.
 * El arco recorta solo las esquinas superiores, que en el retrato son pared.
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
        <figure className="relative mx-auto w-full max-w-[26rem]">
          <Rings className="-bottom-16 -right-24 w-[130%]" />
          <div className="arch relative overflow-hidden bg-wash shadow-lg">
            <EditorialPhoto
              image={image}
              preload={preload}
              quality={85}
              sizes="(min-width: 456px) 416px, calc(100vw - 40px)"
              className="aspect-[4/5]"
            />
            {caption && (
              <figcaption className="bg-background px-5 py-4 text-sm leading-relaxed text-primary-dark">
                {caption}
              </figcaption>
            )}
          </div>
        </figure>
      </div>
    </section>
  );
}
