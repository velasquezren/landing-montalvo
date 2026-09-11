import { MessageCircle } from "lucide-react";
import { type Room } from "@/content/rooms";
import { Button } from "@/components/ui/button";
import { getRoomWhatsAppUrl } from "@/lib/whatsapp";
import RoomGallery from "@/components/sections/RoomGallery";
import RoomAmenities from "@/components/sections/RoomAmenities";
import TierDot from "@/components/sections/TierDot";

export default function RoomPanel({ room }: { room: Room }) {
  return (
    <div className="pt-12 lg:pt-16">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* En móvil la fotografía va primero: es lo que se está eligiendo. */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <RoomGallery images={room.images} roomName={room.name} />
        </div>

        <div className="order-2 lg:order-1 lg:col-span-5">
          <p className="label flex items-center gap-2 text-muted-foreground">
            <TierDot tier={room.tier} />
            Categoría {room.tabLabel}
          </p>

          <h3 className="mt-4 font-display text-[1.625rem] font-bold leading-[1.15] tracking-[-0.025em] lg:text-[2rem]">
            {room.name}
          </h3>

          <p className="mt-3 text-lg text-primary-dark">{room.tagline}</p>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {room.description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-8 border-t border-border">
            {room.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-center gap-3 border-b border-border py-3 text-sm font-medium"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-4 shrink-0 bg-primary"
                />
                {highlight}
              </li>
            ))}
          </ul>

          {/* Superficie, acompañantes y precio son opcionales en el modelo de
              datos y hoy están vacíos: el bloque no se dibuja si no hay nada. */}
          {(room.areaM2 || room.companions) && (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
              {room.areaM2 && (
                <div>
                  <dt className="label text-muted-foreground">Superficie</dt>
                  <dd className="mt-1 font-medium">{room.areaM2} m²</dd>
                </div>
              )}
              {room.companions && (
                <div>
                  <dt className="label text-muted-foreground">Acompañantes</dt>
                  <dd className="mt-1 font-medium">Hasta {room.companions}</dd>
                </div>
              )}
            </dl>
          )}

          <Button asChild size="md" className="mt-8 w-full sm:w-auto">
            <a
              href={getRoomWhatsAppUrl(room.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              Consultar disponibilidad
            </a>
          </Button>
        </div>
      </div>

      <RoomAmenities room={room} />
    </div>
  );
}
