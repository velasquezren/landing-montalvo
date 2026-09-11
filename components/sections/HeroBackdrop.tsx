import Image from "next/image";

/** Fondo estable: conserva el encuadre y el contraste durante toda la lectura. */
export default function HeroBackdrop({ src, alt, position = "center 38%" }: {
  src: string;
  alt: string;
  position?: string;
}) {
  return (
    <div className="absolute inset-0">
      <Image src={src} alt={alt} fill preload sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/50" />
    </div>
  );
}
