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
    // La fachada disponible solo tiene 382 × 510 px. Usamos la fotografía
    // de 2000 × 1500 px de Servicios hasta recibir un original más grande.
    src: "/images/habitaciones/silver/principal-1.jpg",
    alt: "Suite de Clínica Montalvo con amplios ventanales y espacio para acompañantes",
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
    src: "/images/equipo/dr-montalvo-retrato.jpg",
    alt: "Retrato del Dr. Juan Carlos Montalvo con bata blanca y medalla de reconocimiento",
    position: "center 22%",
  },
} satisfies Record<string, EditorialImage>;
