"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { EditorialImage } from "@/content/images";

/** Solo cambia la fotografía de fondo. El marco, el velo y el contenido
 * pertenecen al HeroMedia original y permanecen inmóviles. */
export default function HeroRotation({ images, sizes, lcp }: {
  images: readonly (EditorialImage & { src: string })[];
  sizes: string;
  lcp: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState<Set<number>>(() => new Set());
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const next = (active + 1) % images.length;

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => setRunning(visible && !document.hidden && !motion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!running || paused || !ready.has(next) || images.length < 2) return;
    const timer = window.setTimeout(() => setActive(next), 8000);
    return () => window.clearTimeout(timer);
  }, [running, paused, ready, next, images.length]);

  async function decoded(index: number, image: HTMLImageElement) {
    try { await image.decode(); } catch { return; }
    setReady(previous => new Set(previous).add(index));
  }

  return (
    <div ref={frame} className="absolute inset-0" data-hero-rotation>
      {images.map((image, index) => {
        if (index !== 0 && index !== active && !ready.has(index)
          && !(running && ready.has(active) && index === next)) return null;
        return (
          <div
            key={image.src}
            className="hero-rotation-photo absolute inset-0"
            data-active={index === active || undefined}
            aria-hidden={index !== active}
            style={{ zIndex: index === active ? 1 : 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              quality={85}
              loading={lcp || index > 0 ? "eager" : "lazy"}
              fetchPriority={lcp && index === 0 ? "high" : "auto"}
              className="object-cover"
              style={{ objectPosition: image.position }}
              onLoad={event => void decoded(index, event.currentTarget)}
            />
          </div>
        );
      })}
      {/* Control disponible al navegar con teclado, sin añadir interfaz visual
          de carrusel a la portada. Movimiento reducido desactiva el avance. */}
      <button
        type="button"
        onClick={() => setPaused(value => !value)}
        className="sr-only focus:not-sr-only focus:absolute focus:right-5 focus:top-5 focus:z-10 focus:rounded-xs focus:bg-background focus:px-4 focus:py-3 focus:text-sm focus:text-primary"
      >
        {paused ? "Reanudar fotografías de fondo" : "Pausar fotografías de fondo"}
      </button>
    </div>
  );
}
