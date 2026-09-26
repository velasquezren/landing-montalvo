/** Fotografías editoriales. src: null conserva el diseño sin solicitar archivos inexistentes.
 * Guía de encuadres y entrega: public/images/README.md.
 */
export type EditorialImage = {
  src: string | null;
  alt: string;
  position: string;
};

export const editorialImages = {
  inicio: {
    // La vista más amplia de una suite: ventanal y zona de estar caen a la
    // derecha, donde el velo es más transparente. Es un original de 1280 px;
    // bajo el velo apenas se nota, pero conviene sustituirlo por uno mayor.
    src: "/images/habitaciones/gold/principal-2.jpg",
    alt: "Suite de internación amplia con zona de estar, sofás y ventanal",
    position: "center 55%",
  },
  servicios: {
    // Elegida entre las cuatro vistas generales de suite más anchas: es la
    // única cuyo punto de interés —el ventanal— cae a la derecha, donde el
    // velo verde de la cabecera es más transparente. El titular queda sobre
    // verde sólido a la izquierda y se lee sin esfuerzo.
    src: "/images/habitaciones/silver/principal-1.jpg",
    alt: "Suite de internación amplia con ventanal de suelo a techo y sala de estar",
    position: "center 55%",
  },
  habitaciones: {
    src: "/images/habitaciones/gold/principal-1.jpg",
    alt: "Sala de estar de una suite de internación, con sofá y cuna junto a la cama",
    position: "center",
  },
  especialidades: { src: null, alt: "", position: "center" },
  nosotros: { src: null, alt: "", position: "center" },
  pacientes: { src: null, alt: "", position: "center" },
  doctor: {
    src: "/images/equipo/dr-montalvo-reconocimiento.jpg",
    alt: "El Dr. Juan Carlos Montalvo sostiene el diploma y la medalla del reconocimiento de la Cámara de Diputados de Bolivia",
    position: "center 20%",
  },
} satisfies Record<string, EditorialImage>;
