"use client";

import * as React from "react";
import { motion } from "motion/react";
import { roomsData } from "@/content/rooms";
import TierDot from "@/components/sections/TierDot";
import { slide } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RoomTabsProps {
  activeSlug: string;
  onSelectTab: (slug: string) => void;
}

/**
 * Selector de suite.
 *
 * Era un control segmentado con fondo teñido, sombra interior, borde y una
 * píldora blanca deslizante: mucho cromo para elegir entre tres opciones. Ahora
 * son tres palabras sobre una línea, con un subrayado que se desplaza.
 */
export default function RoomTabs({ activeSlug, onSelectTab }: RoomTabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  // Flechas izquierda/derecha entre pestañas, como espera un `tablist`.
  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = roomsData.findIndex((room) => room.slug === activeSlug);
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % roomsData.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + roomsData.length) % roomsData.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = roomsData.length - 1;
    else return;

    event.preventDefault();
    onSelectTab(roomsData[next].slug);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#tab-${roomsData[next].slug}`)
      ?.focus();
  };

  return (
    // Las pestañas permanecen inmediatamente debajo de la cabecera fija.
    <div className="sticky top-[var(--header-bottom)] z-30 border-b border-border bg-background/95 backdrop-blur-md">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Tipo de suite de internación"
        onKeyDown={onKeyDown}
        className="mx-auto flex max-w-7xl items-center gap-7 px-5 sm:gap-9 sm:px-8"
      >
        {roomsData.map((room) => {
          const active = room.slug === activeSlug;

          return (
            <button
              key={room.slug}
              id={`tab-${room.slug}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls="suite-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => onSelectTab(room.slug)}
              className={cn(
                "relative flex items-center gap-2 py-4 text-sm font-medium transition-colors duration-200",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TierDot
                tier={room.tier}
                className={cn(
                  "transition-opacity duration-200",
                  active ? "opacity-100" : "opacity-40"
                )}
              />
              {room.tabLabel}

              {active && (
                <motion.span
                  layoutId="room-tab-underline"
                  transition={slide}
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
