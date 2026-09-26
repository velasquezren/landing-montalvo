import type { ReactNode } from "react";
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
 * El marco queda dentro del arco para que este no recorte la fotografía.
 */
export default function SplitHero({ headingId, image, preload = false, caption, children }: SplitHeroProps) {
  return (
    <section
      data-hero=""
      aria-labelledby={headingId}
      className="arc-end overflow-hidden bg-primary text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-10 pb-20 sm:gap-12 sm:px-8 sm:pt-14 sm:pb-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:pt-12 lg:pb-20">
        <div>
          {children}
        </div>
        <figure className="mx-auto w-full max-w-[26rem] overflow-hidden rounded-xl bg-wash shadow-xl shadow-primary-dark/20 ring-1 ring-white/20">
          <EditorialPhoto
            image={image}
            preload={preload}
            quality={85}
            sizes="(min-width: 456px) 416px, calc(100vw - 40px)"
            className="aspect-[4/5]"
          />
          {caption && (
            <figcaption className="px-5 py-4 text-sm leading-relaxed text-primary-dark">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
