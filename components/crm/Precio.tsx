import type { PromocionPublica } from "@/lib/crm/tipos";
import { bolivianos } from "@/lib/formato";
import { cn } from "@/lib/utils";

/**
 * El precio de una promoción. Con precio promocional, el regular va tachado
 * al lado y el lector de pantalla oye «antes» y «ahora» en vez de dos cifras
 * sueltas. Sin ningún precio publicado no pinta nada.
 */
export default function Precio({
  promocion,
  grande = false,
}: {
  promocion: Pick<PromocionPublica, "precioRegular" | "precioPromocional">;
  grande?: boolean;
}) {
  const { precioRegular, precioPromocional } = promocion;
  const actual = precioPromocional ?? precioRegular;
  if (actual === null) return null;
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums">
      <span className="sr-only">{precioPromocional !== null ? "Precio promocional:" : "Precio:"}</span>
      <span className={cn("font-semibold text-primary", grande ? "text-3xl" : "text-xl")}>{bolivianos(actual)}</span>
      {precioPromocional !== null && precioRegular !== null && (
        <span className={cn("text-muted-foreground", grande ? "text-base" : "text-sm")}>
          <span className="sr-only">Precio regular:</span>
          <s>{bolivianos(precioRegular)}</s>
        </span>
      )}
    </p>
  );
}
