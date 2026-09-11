"use client";

import * as React from "react";
import { Reveal } from "@/components/ui/reveal";
import { amenitiesCatalog } from "@/content/amenities";
import { roomsData, type RoomSlug } from "@/content/rooms";
import TierDot from "@/components/sections/TierDot";
import { cn } from "@/lib/utils";

interface RoomsComparisonProps {
  activeSlug: RoomSlug;
  onSelectRoom: (slug: RoomSlug) => void;
}

/**
 * Comparativa de equipamiento.
 *
 * Cambios: fuera la tarjeta con sombra y los fondos teñidos fila a fila, y
 * fuera los tres botones "Consultar" incrustados en las cabeceras. Ahora la
 * cabecera de cada columna cambia la suite activa del panel de arriba, que es
 * lo que uno quiere hacer justo después de comparar.
 */
export default function RoomsComparison({
  activeSlug,
  onSelectRoom,
}: RoomsComparisonProps) {
  return (
    <div className="mt-24 lg:mt-32">
      <Reveal className="flex items-baseline justify-between gap-6 border-b border-border-strong pb-4">
        <h3 className="h3">Comparar las tres suites</h3>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Seleccione una columna para verla en detalle
        </p>
      </Reveal>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">
            Equipamiento incluido en las suites Gold, Silver y Bronce
          </caption>

          <thead>
            <tr>
              <th scope="col" className="w-[40%] py-5 pr-4">
                <span className="label text-muted-foreground">Prestación</span>
              </th>

              {roomsData.map((room) => {
                const active = room.slug === activeSlug;

                return (
                  <th key={room.slug} scope="col" className="py-5 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectRoom(room.slug)}
                      aria-pressed={active}
                      aria-controls="suite-panel"
                      className="group inline-flex flex-col items-center gap-1.5"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <TierDot tier={room.tier} />
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors duration-200",
                            active
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary"
                          )}
                        >
                          {room.tabLabel}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-[2px] w-8 transition-colors duration-200",
                          active ? "bg-primary" : "bg-transparent"
                        )}
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          <ComparisonRows />
        </table>
      </div>
    </div>
  );
}

/**
 * El cuerpo de la tabla: quince prestaciones por tres suites, todo leído de
 * `content/`. No depende de la suite activa ni de ninguna otra propiedad, así
 * que `memo` sobre un componente sin props equivale a montarlo una vez y no
 * volver a tocarlo: cambiar de suite ya no reconcilia cuarenta y cinco celdas
 * que siempre dicen lo mismo.
 */
const ComparisonRows = React.memo(function ComparisonRows() {
  return (
    <tbody>
      {amenitiesCatalog.map((amenity) => (
        <tr key={amenity.key} className="border-t border-border">
          <th
            scope="row"
            className="py-3.5 pr-4 text-sm font-normal text-foreground"
          >
            {amenity.label}
          </th>

          {roomsData.map((room) => {
            const included = room.amenities.includes(amenity.key);

            return (
              <td key={room.slug} className="py-3.5 text-center">
                {included ? (
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-block h-px w-3 bg-border-strong align-middle"
                  />
                )}
                <span className="sr-only">
                  {included
                    ? `Incluido en ${room.name}`
                    : `No disponible en ${room.name}`}
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
});
