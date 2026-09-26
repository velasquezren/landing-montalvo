import type { ReactNode } from "react";
import EditorialPhoto from "@/components/sections/EditorialPhoto";
import type { EditorialImage } from "@/content/images";

interface SplitHeroProps {
  /** Id del titular, para `aria-labelledby`. */
  headingId: string;
  image: EditorialImage;
  /** Precargar solo en la portada: es la imagen de mayor pintado de la web. */
  preload?: boolean;
  children: ReactNode;
}

/**
 * Cabecera partida: texto sobre verde a un lado y fotografía al otro.
 *
 * La usa la página del Dr. Montalvo. Vive como componente, y no escrita en la
 * página, por la lógica del arco, que es fácil de romper:
 *
 * El arco cambia de dueño según el ancho. En escritorio la cabecera son dos
 * columnas y el borde inferior lo comparten: el arco va en la sección y recorta
 * verde y fotografía juntos. Apilado, la última pieza es la fotografía, así que
 * un arco en la sección quedaría al pie de ella, contra blanco y sin contraste.
 * Apilado lo lleva la columna verde, que es la que de verdad termina.
 *
 * En móvil la fotografía va en 4:3 y no en 16:10: aquí van retratos, y 16:10
 * dejaba una franja en la que solo cabía la cara a medias.
 */
export default function SplitHero({ headingId, image, preload = false, children }: SplitHeroProps) {
  return (
    <section
      data-hero=""
      aria-labelledby={headingId}
      className="overflow-hidden text-white lg:arc-end lg:bg-primary"
    >
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="arc-end bg-primary px-5 py-14 sm:px-8 sm:py-20 lg:rounded-none lg:bg-transparent lg:py-24 lg:pr-12">
          {children}
        </div>
        <EditorialPhoto
          image={image}
          preload={preload}
          sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
          className="aspect-[4/3] lg:aspect-auto lg:min-h-full"
        />
      </div>
    </section>
  );
}
