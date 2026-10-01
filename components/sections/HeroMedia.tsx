import Image from "next/image";
import type { EditorialImage } from "@/content/images";
import { cn } from "@/lib/utils";

/**
 * Ancho de la columna de texto junto a una foto "side". A 1024 px la foto
 * empieza en 512 y el texto acaba en 480; desde 1280, en el 46% y 32rem más el
 * margen del contenedor: no se tocan a ningún ancho, medido de 1024 a 1920.
 */
export const SIDE_TEXT = "max-w-xl lg:max-w-md xl:max-w-lg";

/**
 * Fotografía de cabecera, detrás del texto.
 *
 * En escritorio es el fondo de la sección (`lg:absolute`) y un velo claro del
 * color de la página la cubre por la izquierda, donde va el texto, y se
 * desvanece hacia la derecha, donde la foto se ve limpia. En móvil la foto va
 * arriba y se funde hacia abajo con el fondo, de modo que el titular puede
 * entrar encima de ella. El alto en móvil lo fija quien la usa (`className`).
 *
 * `layout`:
 * - "full": la foto ocupa toda la sección (fotos apaisadas de habitaciones).
 * - "side": ocupa la parte derecha y su borde izquierdo se funde con el fondo.
 *   Para retratos, que a todo el ancho quedarían cortados a la altura de los
 *   ojos, y para cabeceras interiores, cuya foto llega de Marketing sin saber
 *   dónde cae el motivo: así se ve casi entera, sin texto encima.
 *
 * El movimiento vive en CSS (`.hero-media`, app/globals.css), sin JavaScript.
 */
export default function HeroMedia({ image, sizes, lcp = false, layout = "full", className }: {
  image: EditorialImage & { src: string };
  sizes: string;
  /**
   * Es el elemento más grande de la primera pantalla (LCP). Se pide al
   * instante y con prioridad alta (`fetchPriority="high"`), como recomienda la
   * documentación de Next 16 frente a `preload`: con `preload` la imagen se
   * pedía sin prioridad y Lighthouse lo marcaba.
   */
  lcp?: boolean;
  layout?: "full" | "side";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hero-media relative overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto",
        // En "side" la foto empieza justo donde acaba la columna de texto
        // (`SIDE_TEXT`): el texto nunca queda encima de la imagen, y la foto se
        // ve casi entera.
        layout === "full" ? "lg:left-0" : "lg:left-1/2 xl:left-[46%]",
        className
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        loading={lcp ? "eager" : undefined}
        fetchPriority={lcp ? "high" : undefined}
        quality={85}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: image.position }}
      />
      <div
        aria-hidden="true"
        className={cn("hero-scrim absolute inset-0", layout === "side" && "hero-scrim--side")}
      />
    </div>
  );
}
