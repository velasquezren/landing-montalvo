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
        className="aspect-[4/3] w-full"
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
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: img.position }}
            />
          </button>
        ))}
      </SnapCarousel>

      {/* Escritorio.

          La retícula sale de la proporción de las fotografías, no de una altura
          fija. Con `h-[30rem]` —elegida cuando aún no había fotos— las fichas
          del mosaico quedaban a 0,86, es decir verticales, mientras que las
          fotografías son 4:3: se recortaba el 35% del ancho de cada una y las
          habitaciones no se reconocían.

          Dando al contenedor la proporción adecuada, cada ficha cae en 4:3 sola
          y a cualquier ancho: 2/1 reparte el mosaico de 8+4 en tres fichas de
          4:3, y 8/3 reparte dos fichas de 4:3 una al lado de otra.

          El reparto cambia según cuántas fotografías haya porque una sola
          retícula no sirve para las tres suites. */}
      {side.length === 0 ? (
        <Tile
          image={main}
          roomName={roomName}
          index={0}
          onOpen={openPhoto}
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="hidden aspect-[4/3] w-full lg:block"
        >
          <span className="label absolute bottom-4 left-4 rounded-xs bg-primary-dark/85 px-2.5 py-1.5 text-white">
            1 / {images.length}
          </span>
        </Tile>
      ) : side.length === 1 ? (
        <div className="hidden aspect-[8/3] grid-cols-2 gap-2 lg:grid">
          <Tile image={main} roomName={roomName} index={0} onOpen={openPhoto} sizes="(min-width: 1024px) 24vw, 100vw">
            <span className="label absolute bottom-4 left-4 rounded-xs bg-primary-dark/85 px-2.5 py-1.5 text-white">
              1 / {images.length}
            </span>
          </Tile>
          <Tile image={side[0]} roomName={roomName} index={1} onOpen={openPhoto} sizes="(min-width: 1024px) 24vw, 100vw" />
        </div>
      ) : (
        <div className="hidden aspect-[2/1] grid-cols-12 gap-2 lg:grid">
          <Tile
            image={main}
            roomName={roomName}
            index={0}
            onOpen={openPhoto}
            sizes="(min-width: 1024px) 32vw, 100vw"
            className="col-span-8"
          >
            <span className="label absolute bottom-4 left-4 rounded-xs bg-primary-dark/85 px-2.5 py-1.5 text-white">
              1 / {images.length}
            </span>
          </Tile>

          <div className="col-span-4 grid grid-rows-2 gap-2">
            {side.map((img, i) => (
              <Tile
                key={img.src}
                image={img}
                roomName={roomName}
                index={i + 1}
                onOpen={openPhoto}
                sizes="(min-width: 1024px) 16vw, 100vw"
              >
                {/* Distintivo en una esquina, no un velo sobre toda la ficha:
                    tapar la última fotografía para anunciar que hay más
                    fotografías es lo contrario de lo que se pretende. */}
                {i === side.length - 1 && remaining > 0 && (
                  <span className="label absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xs bg-primary-dark/85 px-2.5 py-1.5 text-white transition-colors duration-200 group-hover:bg-primary">
                    +{remaining} {remaining === 1 ? "foto" : "fotos"}
                  </span>
                )}
              </Tile>
            ))}
          </div>
        </div>
      )}

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
        // Varias fotografías son verticales y la ficha es apaisada: sin esto,
        // el recorte centrado se come el motivo.
        style={{ objectPosition: image.position }}
        className="object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
      />
      {children}
    </button>
  );
}
