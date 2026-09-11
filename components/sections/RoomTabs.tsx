"use client";

import * as React from "react";
import { roomsData, type RoomSlug } from "@/content/rooms";
import TierDot from "@/components/sections/TierDot";
import { cn } from "@/lib/utils";

interface RoomTabsProps {
  activeSlug: RoomSlug;
  onSelectTab: (slug: RoomSlug) => void;
}

/**
 * Selector de suite.
 *
 * Era un control segmentado con fondo teñido, sombra interior, borde y una
 * píldora blanca deslizante: mucho cromo para elegir entre tres opciones. Ahora
 * son tres palabras sobre una línea, con un subrayado que se desplaza.
 *
 * El subrayado lo movía `layoutId` de Motion, que para animar dos números
 * arrastraba el motor de proyección de layout de la librería entera. Aquí se
 * miden la posición y el ancho de la pestaña activa —una vez por selección, no
 * por fotograma— y se escriben como variables CSS; el recorrido lo interpola el
 * compositor sin volver a pasar por JavaScript.
 */
export default function RoomTabs({ activeSlug, onSelectTab }: RoomTabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  // `useLayoutEffect` y no `useEffect`: la medida tiene que estar escrita antes
  // de que el navegador pinte, o el subrayado parpadea en la posición anterior.
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const tab = list.querySelector<HTMLElement>(`#tab-${activeSlug}`);
      if (!tab) return;

      list.style.setProperty("--tab-x", `${tab.offsetLeft}px`);
      list.style.setProperty("--tab-w", `${tab.offsetWidth}px`);
      // Solo a partir de la primera medida se permite la transición: si no, el
      // subrayado se vería viajar desde el origen al cargar la página.
      list.toggleAttribute("data-tabs-ready", true);
    };

    measure();

    // Cubre el cambio de viewport, el zoom y —sobre todo— el momento en que
    // Montserrat termina de cargar y las tres etiquetas cambian de ancho.
    const observer = new ResizeObserver(measure);
    for (const tab of list.querySelectorAll<HTMLElement>('[role="tab"]')) {
      observer.observe(tab);
    }
    return () => observer.disconnect();
  }, [activeSlug]);

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
    //
    // Sin `backdrop-blur`: desenfocar el fondo de una barra pegajosa obliga al
    // navegador a recomponer esa franja en cada fotograma mientras se hace
    // scroll, que es justo cuando no hay presupuesto. Y se notaba poco: debajo
    // de la barra solo pasa página blanca.
    <div className="sticky top-[var(--header-bottom)] z-30 border-b border-border bg-background">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Tipo de suite de internación"
        onKeyDown={onKeyDown}
        className="relative mx-auto flex max-w-7xl items-center gap-7 px-5 sm:gap-9 sm:px-8"
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
                "flex items-center gap-2 py-4 text-sm font-medium transition-colors duration-200",
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
            </button>
          );
        })}

        {/* Un solo subrayado para las tres pestañas, en lugar de uno por
            pestaña apareciendo y desapareciendo. */}
        <span
          aria-hidden="true"
          className="tab-indicator absolute -bottom-px left-0 h-[2px] bg-primary"
        />
      </div>
    </div>
  );
}
