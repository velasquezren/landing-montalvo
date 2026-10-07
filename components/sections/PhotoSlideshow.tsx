"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PhotoSlide } from "@/content/images";
import { cn } from "@/lib/utils";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getHidden = () => document.hidden;
const getServerSnapshot = () => true;

/** La primera foto sale del servidor. Solo se adelanta la siguiente al entrar
 * en pantalla; nunca se descubre una imagen antes de que termine decode().
 * La barra CSS es el reloj: animationend avanza, animation-play-state pausa.
 */
export default function PhotoSlideshow({ slides, label, priority = false, className }: {
  slides: readonly PhotoSlide[];
  label: string;
  priority?: boolean;
  className?: string;
}) {
  const container = useRef<HTMLElement>(null);
  const requestedIndex = useRef<number | null>(null);
  const [requested, setRequested] = useState<number | null>(null);
  const [selected, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  // Si falla incluso la primera foto, montar la siguiente permite recuperarse
  // sin esperar un onLoad que nunca llegará. No se deja el marco vacío.
  const active = failed.has(selected)
    ? Math.max(0, slides.findIndex((_, index) => !failed.has(index)))
    : selected;
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, getServerSnapshot);
  const hidden = useSyncExternalStore(subscribeVisibility, getHidden, getServerSnapshot);
  const next = Array.from({ length: slides.length - 1 }, (_, n) => (active + n + 1) % slides.length)
    .find(index => !failed.has(index)) ?? active;
  const previous = Array.from({ length: slides.length - 1 }, (_, n) => (active - n - 1 + slides.length) % slides.length)
    .find(index => !failed.has(index)) ?? active;
  const running = visible && !hidden && !paused && !hovered && !reducedMotion && loaded.has(next) && next !== active;

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function select(index: number) {
    setPaused(true);
    if (failed.has(index)) return;
    if (loaded.has(index)) {
      requestedIndex.current = null;
      setRequested(null);
      setActive(index);
    } else {
      requestedIndex.current = index;
      setRequested(index);
    }
  }

  async function imageReady(index: number, image: HTMLImageElement) {
    try { await image.decode(); } catch { imageFailed(index); return; }
    setLoaded(previous => new Set(previous).add(index));
    if (requestedIndex.current === index) {
      requestedIndex.current = null;
      setRequested(null);
      setActive(index);
    }
  }

  function imageFailed(index: number) {
    setFailed(previous => new Set(previous).add(index));
    if (requestedIndex.current === index) {
      requestedIndex.current = null;
      setRequested(null);
    }
  }

  const buttonClass = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-wash disabled:opacity-35";

  return (
    <section
      ref={container}
      aria-label={label}
      aria-roledescription="carrusel"
      className={cn("min-w-0", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="relative isolate aspect-[16/10] overflow-hidden rounded-lg bg-wash">
        {failed.size === slides.length && <p role="status" className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-muted-foreground">No pudimos cargar las fotografías. Puedes seguir recorriendo la página.</p>}
        {slides.map((slide, index) => {
          const mounted = index === 0 || index === active || index === requested || loaded.has(index)
            || (visible && loaded.has(active) && index === next);
          if (!mounted || failed.has(index)) return null;
          return (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${slides.length}: ${slide.caption}`}
              aria-hidden={index !== active}
              data-active={index === active || undefined}
              className="slideshow-photo absolute inset-0"
              style={{ zIndex: index === active ? 1 : 0 }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw"
                quality={85}
                loading={priority || index !== 0 ? "eager" : "lazy"}
                fetchPriority={priority && index === 0 ? "high" : "auto"}
                className="object-cover"
                style={{ objectPosition: slide.position }}
                onLoad={event => void imageReady(index, event.currentTarget)}
                onError={() => imageFailed(index)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex min-h-20 items-center gap-2 border-b border-border py-3">
        <div className="min-w-0 flex-1" aria-live={paused || reducedMotion ? "polite" : "off"} aria-atomic="true">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {String(active + 1).padStart(2, "0")} <span aria-hidden="true">/</span> <span className="sr-only">de</span> {String(slides.length).padStart(2, "0")}
          </p>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm font-medium text-foreground">{slides[active].caption}</p>
        </div>
        {!reducedMotion && slides.length > 1 && (
          <button type="button" className={buttonClass} onPointerDown={event => event.preventDefault()} onClick={() => setPaused(value => !value)} aria-label={paused ? "Reanudar presentación" : "Pausar presentación"}>
            {paused ? <Play aria-hidden="true" size={15} /> : <Pause aria-hidden="true" size={15} />}
          </button>
        )}
        <button type="button" className={buttonClass} aria-label="Fotografía anterior" onClick={() => select(previous)} disabled={previous === active}>
          <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>
        <button type="button" className={buttonClass} aria-label="Fotografía siguiente" onClick={() => select(next)} disabled={next === active}>
          <ChevronRight aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex gap-2 pt-1" role="group" aria-label="Elegir fotografía">
        {slides.map((slide, index) => (
          <button key={slide.src} type="button" className="group flex h-11 min-w-11 flex-1 items-center" aria-label={`Ver fotografía ${index + 1}: ${slide.caption}`} aria-current={index === active ? "true" : undefined} disabled={failed.has(index)} onClick={() => select(index)}>
            <span className="relative block h-0.5 w-full overflow-hidden rounded-full bg-border-strong group-hover:bg-primary/30">
              {index === active && <span key={active} aria-hidden="true" className={cn("absolute inset-0 bg-primary", !reducedMotion && "slideshow-progress")} style={{ animationPlayState: running ? "running" : "paused" }} onAnimationEnd={() => { if (running) setActive(next); }} />}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">{requested !== null ? "Cargando fotografía" : ""}</p>
    </section>
  );
}
