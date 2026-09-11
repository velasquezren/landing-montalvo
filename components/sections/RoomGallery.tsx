"use client";

import * as React from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import EditorialPhoto from "@/components/sections/EditorialPhoto";
import SnapCarousel from "@/components/ui/snap-carousel";
import type { RoomLightboxProps } from "@/components/sections/RoomLightbox";
import { type RoomImage } from "@/content/rooms";
import { cn } from "@/lib/utils";

/**
 * El visor se descarga la primera vez que hace falta, no antes. Los imports de
 * módulo quedan cacheados, así que invocar esto dos veces no descarga nada dos
 * veces y sirve igual para adelantar la carga.
 */
const loadLightbox = () => import("@/components/sections/RoomLightbox");

type LightboxComponent = (props: RoomLightboxProps) => React.ReactNode;

interface RoomGalleryProps {
  images: RoomImage[];
  roomName: string;
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  /**
   * El visor se guarda en estado en lugar de envolverse con `next/dynamic`.
   *
   * La diferencia es medible. Un componente perezoso suspende la primera vez
   * que se dibuja, y React espera 300 ms antes de sustituir el contenido de
   * reserva por el definitivo, para que no parpadee. Como aquí ese primer
   * dibujo caía justo en el clic, la espera se cobraba íntegra al abrir: 324 ms
   * medidos con el módulo ya descargado. Teniéndolo en estado de antemano, el
   * visor se dibuja sin suspender y abre en el mismo fotograma.
   */
  const [Lightbox, setLightbox] = React.useState<LightboxComponent | null>(null);
  const requested = React.useRef(false);

  const preloadLightbox = React.useCallback(() => {
    if (requested.current) return;
    requested.current = true;
    // El componente se guarda envuelto en una función porque `setState` trata
    // una función suelta como actualizador del estado anterior.
    void loadLightbox().then((module) => setLightbox(() => module.default));
  }, []);

  const openPhoto = React.useCallback(
    (index: number) => {
      preloadLightbox();
      setOpenIndex(index);
    },
    [preloadLightbox]
  );

  const slides = React.useMemo(
    () => images.map((img) => ({ src: img.src, alt: img.alt })),
    [images]
  );

  const main = images[0];
  const side = images.slice(1, 3);
  const remaining = Math.max(images.length - 3, 0);

  if (!main) {
    return (
      <EditorialPhoto
        image={{ src: null, alt: "", position: "center" }}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="aspect-[4/3] w-full lg:aspect-auto lg:h-[30rem] xl:h-[33rem]"
      />
    );
  }

  return (
    // Adelantar la carga en cuanto el puntero se acerca —o en cuanto un dedo
    // toca la pantalla, que ocurre bastante antes de que se dispare el clic—.
    <div
      className="w-full"
      onPointerEnter={preloadLightbox}
      onPointerDown={preloadLightbox}
    >
      {Lightbox && openIndex !== null && (
        <Lightbox
          open
          close={() => setOpenIndex(null)}
          index={openIndex}
          slides={slides}
        />
      )}

      {/* Móvil: carrusel deslizable. */}
      <SnapCarousel label={`Fotografías de ${roomName}`} className="lg:hidden">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => openPhoto(i)}
            aria-label={`Ampliar foto ${i + 1} de ${images.length} de ${roomName}`}
            className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-wash"
          >
            <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-cover" />
          </button>
        ))}
      </SnapCarousel>

      {/* Escritorio: una imagen que manda y dos de apoyo. */}
      <div className="hidden h-[30rem] grid-cols-12 gap-2 lg:grid xl:h-[33rem]">
        <Tile
          image={main}
          roomName={roomName}
          index={0}
          onOpen={openPhoto}
          sizes="(min-width: 1024px) 42vw, 100vw"
          className={side.length ? "col-span-8" : "col-span-12"}
        >
          <span className="label absolute bottom-4 left-4 rounded-xs bg-primary-dark/85 px-2.5 py-1.5 text-white">
            1 / {images.length}
          </span>
        </Tile>

        {side.length > 0 && (
          <div className="col-span-4 grid grid-rows-2 gap-2">
            {side.map((img, i) => (
              <Tile
                key={img.src}
                image={img}
                roomName={roomName}
                index={i + 1}
                onOpen={openPhoto}
                sizes="(min-width: 1024px) 20vw, 100vw"
              >
                {i === side.length - 1 && remaining > 0 && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-primary-dark/70 text-white transition-colors duration-300 group-hover:bg-primary-dark/80">
                    <span className="font-display text-2xl font-bold leading-none">
                      +{remaining}
                    </span>
                    <span className="label text-white/80">
                      {remaining === 1 ? "foto más" : "fotos más"}
                    </span>
                  </span>
                )}
              </Tile>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => openPhoto(0)}
        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
      >
        <Expand className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        Ver las {images.length} fotos
      </button>
    </div>
  );
}

function Tile({
  image,
  roomName,
  index,
  onOpen,
  sizes,
  className,
  children,
}: {
  image: RoomImage;
  roomName: string;
  index: number;
  onOpen: (index: number) => void;
  sizes: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Ampliar foto ${index + 1} de ${roomName}`}
      className={cn("group relative block overflow-hidden rounded-lg bg-wash", className)}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
      />
      {children}
    </button>
  );
}
