import type { Room } from "@/content/rooms";
import { cn } from "@/lib/utils";

/**
 * Punto de color de la categoría de suite.
 *
 * El mismo `<span>` con el mismo mapa tier → color estaba copiado en el panel,
 * en las pestañas y en la comparativa. Aquí vive una sola vez.
 *
 * Gold, Silver y Bronce no son colores de marca: son nombres de producto, y
 * necesitan distinguirse entre sí. Por eso no salen de la paleta verde.
 */
const TIER_COLOR: Record<Room["tier"], string> = {
  gold: "bg-gold",
  silver: "bg-silver",
  bronce: "bg-bronce",
};

export default function TierDot({
  tier,
  className,
}: {
  tier: Room["tier"];
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-1.5 w-1.5 shrink-0 rounded-full",
        TIER_COLOR[tier],
        className
      )}
    />
  );
}
