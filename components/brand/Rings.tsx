import { cn } from "@/lib/utils";

/**
 * Tres circunferencias concéntricas: el eco del isotipo, que son medias lunas
 * concéntricas. Es la única decoración de las superficies claras y sustituye al
 * bloque verde: pone la marca en la página sin pintarla de verde.
 *
 * Posición y tamaño los fija quien la usa; el recorte, el contenedor.
 */
export default function Rings({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute aspect-square rounded-full border border-primary/15",
        className
      )}
    >
      <div className="absolute inset-[13%] rounded-full border border-primary/15" />
      <div className="absolute inset-[26%] rounded-full border border-primary/15" />
    </div>
  );
}
