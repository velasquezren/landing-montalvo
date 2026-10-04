"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
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
  const [selected, setActive] = useState(0);
  const [ready, setReady] = useState<Set<number>>(() => new Set());
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const active = failed.has(selected)
    ? Math.max(0, images.findIndex((_, index) => !failed.has(index)))
    : selected;
  const next = Array.from({ length: images.length - 1 }, (_, n) => (active + n + 1) % images.length)
    .find(index => !failed.has(index)) ?? active;

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
    if (!running || paused || !ready.has(next) || next === active) return;
    const timer = window.setTimeout(() => setActive(next), 8000);
    return () => window.clearTimeout(timer);
  }, [running, paused, ready, next, active]);

  async function decoded(index: number, image: HTMLImageElement) {
    try { await image.decode(); } catch {
      setFailed(previous => new Set(previous).add(index));
      return;
    }
    setReady(previous => new Set(previous).add(index));
  }

  return (
    <div ref={frame} className="absolute inset-0" data-hero-rotation>
      {images.map((image, index) => {
        if (failed.has(index)) return null;
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
              onError={() => setFailed(previous => new Set(previous).add(index))}
            />
          </div>
        );
      })}
      {/* Un único control discreto, también utilizable desde una pantalla táctil. */}
      {failed.size < images.length - 1 && <button
        type="button"
        onClick={() => setPaused(value => !value)}
        aria-label={paused ? "Reanudar fotografías de fondo" : "Pausar fotografías de fondo"}
        aria-pressed={paused}
        className="hero-motion-control absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xs border border-border-strong bg-background text-primary shadow-xs transition-colors hover:bg-wash"
      >
        {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
      </button>}
    </div>
  );
}
