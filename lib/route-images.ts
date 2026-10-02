import { getImageProps } from "next/image";
import { clinicPhotos, editorialImages } from "@/content/images";

const photos: Record<string, { src: string; sizes: string }> = {
  "/": { src: clinicPhotos.fachada.src, sizes: "(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw" },
  "/servicios": { src: editorialImages.servicios.src, sizes: "(min-width: 1024px) 54vw, 100vw" },
  "/sobre-nosotros": { src: clinicPhotos.exterior.src, sizes: "(min-width: 1024px) 54vw, 100vw" },
  "/atencion-al-paciente": { src: clinicPhotos.acceso.src, sizes: "(min-width: 1024px) 54vw, 100vw" },
  "/dr-montalvo": { src: editorialImages.doctor.src, sizes: "(min-width: 1024px) 60vw, 100vw" },
};
const requested = new Set<string>();

/** Next precarga la ruta, pero no sus fotos. Adelantamos solo la cabecera
 * señalada por el puntero o el teclado, con la misma variante de next/image.
 */
export function warmRouteImage(href: string) {
  const photo = photos[href];
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!photo || requested.has(href) || connection?.saveData || connection?.effectiveType?.includes("2g")) return;
  requested.add(href);
  const { props } = getImageProps({ ...photo, alt: "", fill: true, quality: 85 });
  const image = new window.Image();
  image.decoding = "async";
  image.fetchPriority = "low";
  image.onerror = () => requested.delete(href);
  image.sizes = props.sizes ?? "100vw";
  image.srcset = props.srcSet ?? "";
  image.src = props.src;
}
