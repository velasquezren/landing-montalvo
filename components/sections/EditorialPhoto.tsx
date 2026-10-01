import Image from "next/image";
import type { EditorialImage } from "@/content/images";
import { cn } from "@/lib/utils";

/**
 * Fotografía del contenido. La proporción se reserva incluso mientras llega la
 * fotografía definitiva, y al entrar en pantalla se descubre con la cortina
 * común a todas las fotos del sitio (`.photo-reveal`, app/globals.css).
 */
export default function EditorialPhoto({ image, className, sizes, preload = false, quality = 75 }: {
  image: EditorialImage;
  className?: string;
  sizes: string;
  preload?: boolean;
  quality?: 75 | 85;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-wash [--photo-radius:var(--radius-lg)]", image.src && "photo-reveal", className)}>
      {image.src ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} quality={quality} className="object-cover" style={{ objectPosition: image.position }} />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-wash">
          <div className="absolute -right-1/4 -top-1/4 aspect-square w-full rounded-full border border-primary/10" />
          <div className="absolute -bottom-1/3 -left-1/4 aspect-square w-full rounded-full border border-primary/10" />
          <Image src="/images/logo/isotipo.svg" alt="" width={240} height={240} className="relative w-2/5 max-w-60 opacity-25" />
        </div>
      )}
    </div>
  );
}
