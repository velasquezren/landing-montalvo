import Image from "next/image";
import type { ReactNode } from "react";
import type { EditorialImage } from "@/content/images";
import { cn } from "@/lib/utils";

/**
 * Fotografía de cabecera a sangre: ocupa todo el ancho de su sección.
 *
 * El alto lo fija quien la usa (`className`), porque cada cabecera tiene su
 * proporción. El movimiento vive en CSS (`.hero-media`, app/globals.css): se
 * abre al cargar y se acerca despacio al desplazarse, sin JavaScript.
 *
 * `children` se pinta encima de la foto, dentro del mismo recorte.
 */
export default function HeroMedia({ image, sizes, preload = false, className, children }: {
  image: EditorialImage & { src: string };
  sizes: string;
  preload?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("hero-media relative overflow-hidden bg-wash", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        preload={preload}
        quality={85}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: image.position }}
      />
      {children}
    </div>
  );
}
