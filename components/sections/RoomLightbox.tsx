"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface RoomLightboxProps {
  open: boolean;
  close: () => void;
  index: number;
  slides: { src: string; alt: string }[];
}

/**
 * Visor a pantalla completa.
 *
 * Existe como módulo aparte para poder cargarse solo cuando alguien va a
 * ampliar una fotografía. Importado desde la galería, viajaba en el paquete de
 * `/servicios` en toda visita —unos 45 KB de JavaScript y 5 KB de CSS— aunque
 * nadie llegase a abrirlo.
 *
 * Las propiedades se declaran aquí, estrechas, en lugar de reexportar las de la
 * librería: la galería no necesita conocerla para pedirle que abra una foto.
 */
export default function RoomLightbox(props: RoomLightboxProps) {
  return <Lightbox {...props} />;
}
