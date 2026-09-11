"use client";

import * as React from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import EditorialPhoto from "@/components/sections/EditorialPhoto";
import { Expand } from "lucide-react";
import { type RoomImage } from "@/content/rooms";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface RoomGalleryProps {
  images: RoomImage[];
  roomName: string;
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = React.useState(1);

  React.useEffect(() => {
    if (!carouselApi) return;
    const update = () => setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on("select", update);
    carouselApi.on("reInit", update);
    queueMicrotask(update);
    return () => {
      carouselApi.off("select", update);
      carouselApi.off("reInit", update);
    };
  }, [carouselApi]);

  const open = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));

  const main = images[0];
  const side = images.slice(1, 3);
  const remaining = Math.max(images.length - 3, 0);

  if (!main) {
    return <EditorialPhoto image={{ src: null, alt: "", position: "center" }} sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[30rem] xl:h-[33rem]" />;
  }

  return (
    <div className="w-full">
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={slides}
      />

      {/* Móvil: carrusel deslizable. */}
      <div className="lg:hidden">
        <Carousel setApi={setCarouselApi}>
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={img.src}>
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-label={`Ampliar foto ${i + 1} de ${images.length} de ${roomName}`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-wash"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-3 flex items-center justify-between">
            <span className="label text-muted-foreground">
              {currentSlide} / {images.length}
            </span>
            <div className="flex gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>
        </Carousel>
      </div>

      {/* Escritorio: una imagen que manda y dos de apoyo. */}
      <div className="hidden h-[30rem] grid-cols-12 gap-2 lg:grid xl:h-[33rem]">
        <Tile
          image={main}
          roomName={roomName}
          index={0}
          onOpen={open}
          sizes="(min-width: 1024px) 42vw, 100vw"
          className={side.length ? "col-span-8" : "col-span-12"}
        >
          <span className="label absolute bottom-4 left-4 rounded-xs bg-primary-dark/75 px-2.5 py-1.5 text-white backdrop-blur-sm">
            1 / {images.length}
          </span>
        </Tile>

        {side.length > 0 && <div className="col-span-4 grid grid-rows-2 gap-2">
          {side.map((img, i) => (
            <Tile
              key={img.src}
              image={img}
              roomName={roomName}
              index={i + 1}
              onOpen={open}
              sizes="(min-width: 1024px) 20vw, 100vw"
            >
              {i === side.length - 1 && remaining > 0 && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-primary-dark/60 text-white backdrop-blur-[1px] transition-colors duration-300 group-hover:bg-primary-dark/70">
                  <span className="font-display text-2xl font-bold leading-none">+{remaining}</span>
                  <span className="label text-white/80">
                    {remaining === 1 ? "foto más" : "fotos más"}
                  </span>
                </span>
              )}
            </Tile>
          ))}
        </div>}
      </div>

      <button
        type="button"
        onClick={() => open(0)}
        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <Expand className="h-3.5 w-3.5" strokeWidth={1.75} />
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
      className={cn(
        "group relative block overflow-hidden rounded-lg bg-wash",
        className
      )}
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
