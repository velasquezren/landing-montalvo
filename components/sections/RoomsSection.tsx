"use client";

import * as React from "react";
import {
  defaultRoomSlug,
  isRoomSlug,
  roomsBySlug,
  type RoomSlug,
} from "@/content/rooms";
import SectionHeader from "@/components/sections/SectionHeader";
import RoomTabs from "@/components/sections/RoomTabs";
import RoomPanel from "@/components/sections/RoomPanel";
import RoomsComparison from "@/components/sections/RoomsComparison";

/** Lee el ancla de la URL y devuelve la suite que nombra, si nombra alguna. */
function readSlugFromHash(): RoomSlug | null {
  const hash = window.location.hash.slice(1).toLowerCase();
  return isRoomSlug(hash) ? hash : null;
}

export default function RoomsSection() {
  const [activeSlug, setActiveSlug] = React.useState<RoomSlug>(defaultRoomSlug);

  // Enlaces directos del tipo /servicios#gold.
  React.useEffect(() => {
    const sync = () => {
      const slug = readSlugFromHash();
      if (slug) setActiveSlug(slug);
    };

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Estable entre renders: `RoomsComparison` está memoizado y una función
  // nueva en cada render lo obligaría a redibujar sus cuarenta y cinco celdas.
  const selectTab = React.useCallback((slug: RoomSlug) => {
    setActiveSlug(slug);
    window.history.replaceState(null, "", `#${slug}`);
  }, []);

  const activeRoom = roomsBySlug.get(activeSlug) ?? roomsBySlug.get(defaultRoomSlug)!;

  return (
    <section id="habitaciones" aria-labelledby="internacion-heading">
      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:pb-16">
        <SectionHeader
          index="02"
          eyebrow="Internación"
          title="Nuestras habitaciones"
          description="Suites privadas para la llegada de un bebé o para una recuperación, pensadas para que la familia pueda quedarse."
          id="internacion-heading"
        />
      </div>

      <RoomTabs activeSlug={activeSlug} onSelectTab={selectTab} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          id="suite-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeSlug}`}
          tabIndex={0}
        >
          {/* Cambiar la `key` remonta el panel, y con el montaje se reproduce
              la animación de entrada declarada en CSS.
              
              Antes esto era un `AnimatePresence mode="wait"`: la suite anterior
              se desvanecía durante 140 ms y solo entonces empezaba la entrada
              de 450 ms de la nueva. Casi 600 ms de espera para ver lo que uno
              acababa de pedir. Ahora el relevo es inmediato y la entrada dura
              300 ms. */}
          <div key={activeSlug} className="panel-enter">
            <RoomPanel room={activeRoom} />
          </div>
        </div>

        <RoomsComparison activeSlug={activeSlug} onSelectRoom={selectTab} />
      </div>
    </section>
  );
}
