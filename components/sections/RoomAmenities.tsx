import type { CSSProperties } from "react";
import {
  DoorClosed,
  Crown,
  ConciergeBell,
  ShowerHead,
  Wind,
  Refrigerator,
  BedDouble,
  Sofa,
  AirVent,
  Tv,
  Wifi,
  SquareParking,
  Trees,
  UtensilsCrossed,
  Gem,
} from "lucide-react";
import { amenitiesCatalog } from "@/content/amenities";
import { type Room } from "@/content/rooms";

const amenityIconMap = {
  DoorClosed,
  Crown,
  ConciergeBell,
  ShowerHead,
  Wind,
  Refrigerator,
  BedDouble,
  Sofa,
  AirVent,
  Tv,
  Wifi,
  SquareParking,
  Trees,
  UtensilsCrossed,
  Gem,
};

/**
 * Equipamiento incluido en la suite activa.
 *
 * Antes era un panel verde oscuro con tarjetas de cristal esmerilado
 * (bg-white/[0.06] + border-white/10) y una foto enmarcada. Es un listado de
 * prestaciones: se lee mejor como listado.
 */
export default function RoomAmenities({ room }: { room: Room }) {
  const included = amenitiesCatalog.filter((item) =>
    room.amenities.includes(item.key)
  );

  return (
    <section aria-label={`Equipamiento de ${room.name}`} className="mt-14 lg:mt-20">
      <div className="flex items-baseline justify-between gap-4 border-b border-border-strong pb-3">
        <h4 className="label text-foreground">Equipamiento incluido</h4>
        <span className="label text-muted-foreground">
          {included.length} prestaciones
        </span>
      </div>

      {/* El borde inferior de la lista cierra la última fila cuando queda
          incompleta; si no, la línea se corta a media rejilla. */}
      <ul className="grid grid-cols-2 border-b border-border sm:grid-cols-3 lg:grid-cols-4">
        {included.map((amenity, i) => {
          const Icon = amenityIconMap[amenity.iconName];

          return (
            <li
              // La clave incluye la suite: al cambiar de habitación React
              // remonta la lista y la animación CSS vuelve a reproducirse.
              key={`${room.slug}-${amenity.key}`}
              style={{ animationDelay: `${i * 0.025}s` } as CSSProperties}
              className="rise-in flex items-center gap-2.5 border-b border-border py-3.5 pr-4 text-sm text-foreground"
            >
              <Icon
                className="h-4 w-4 shrink-0 text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="leading-snug">{amenity.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
