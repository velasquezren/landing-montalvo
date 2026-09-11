"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SnapCarouselProps {
  /** Nombra la región para quien navega con lector de pantalla. */
  label: string;
  /** Una diapositiva por hijo directo. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Carrusel por anclaje de scroll nativo.
 *
 * Sustituye a Embla, que eran unos 25 KB y un bucle de `requestAnimationFrame`
 * traduciendo el arrastre a transformaciones. Aquí el que desplaza es el propio
 * navegador: el gesto se resuelve en el hilo de composición, así que no puede
 * dar tirones aunque el hilo principal esté ocupado, y hereda gratis el
 * comportamiento que el usuario espera de su sistema —inercia, rebote, rueda
 * horizontal, arrastre con el trackpad—.
 *
 * Lo único que queda en JavaScript es saber por qué diapositiva vamos, y eso lo
 * resuelve un IntersectionObserver: avisa al cruzar cada umbral, no en cada
 * fotograma.
 */
export default function SnapCarousel({
  label,
  children,
  className,
}: SnapCarouselProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const count = React.Children.count(children);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const position = slides.indexOf(entry.target);
          if (position !== -1) setIndex(position);
        }
      },
      // Más de media diapositiva a la vista es la que se está mirando; con el
      // anclaje activo solo una puede cumplirlo a la vez.
      { root: track, threshold: 0.6 }
    );

    for (const slide of slides) observer.observe(slide);
    return () => observer.disconnect();
  }, [count]);

  const scrollTo = React.useCallback((position: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: position * track.clientWidth });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") scrollTo(Math.max(index - 1, 0));
    else if (event.key === "ArrowRight") scrollTo(Math.min(index + 1, count - 1));
    else return;
    event.preventDefault();
  };

  return (
    <div
      role="group"
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("relative", className)}
    >
      <div ref={trackRef} className="snap-track">
        {children}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="label text-muted-foreground" aria-live="polite">
          {index + 1} / {count}
        </span>

        <div className="flex gap-2">
          <Button
            size="icon"
            className="h-9 w-9 disabled:opacity-25"
            aria-label="Fotografía anterior"
            disabled={index === 0}
            onClick={() => scrollTo(index - 1)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 disabled:opacity-25"
            aria-label="Fotografía siguiente"
            disabled={index >= count - 1}
            onClick={() => scrollTo(index + 1)}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
