"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { roomsData, type Room } from "@/content/rooms";
import SectionHeader from "@/components/sections/SectionHeader";
import RoomTabs from "@/components/sections/RoomTabs";
import RoomPanel from "@/components/sections/RoomPanel";
import RoomsComparison from "@/components/sections/RoomsComparison";
import { EASE_OUT, EASE_SMOOTH } from "@/lib/motion";

export default function RoomsSection() {
  const [activeSlug, setActiveSlug] = React.useState<string>("gold");

  // Enlaces directos del tipo /servicios#gold.
  React.useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (roomsData.some((room) => room.slug === hash)) setActiveSlug(hash);
    };

    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const selectTab = (slug: string) => {
    setActiveSlug(slug);
    window.history.replaceState(null, "", `#${slug}`);
  };

  const activeRoom: Room =
    roomsData.find((room) => room.slug === activeSlug) ?? roomsData[0];

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
          aria-labelledby={`tab-${activeRoom.slug}`}
          tabIndex={0}
        >
          {/* `initial={false}` evita que el panel entre animado en la primera
              carga: así se pinta con el HTML y solo se anima al cambiar de suite. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeRoom.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // La salida es corta a propósito: con `mode="wait"` el usuario
              // espera exit + enter antes de ver la suite que acaba de pedir.
              exit={{ opacity: 0, y: -6, transition: { duration: 0.14, ease: EASE_SMOOTH } }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <RoomPanel room={activeRoom} />
            </motion.div>
          </AnimatePresence>
        </div>

        <RoomsComparison activeSlug={activeSlug} onSelectRoom={selectTab} />
      </div>
    </section>
  );
}
