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
    // Fachada de la clínica. El archivo recibido es de 382 × 510 px: va en la
    // columna de foto de la cabecera partida, donde menos se amplía. A sangre
    // se vería borrosa. Pedir el original a mayor resolución.
    src: "/images/portada/fachada.jpg",
    alt: "Fachada de Clínica Montalvo, reproducción asistida, con palmeras en la entrada",
    position: "center 35%",
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
