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
    // Cada foto se usa en un solo sitio destacado: la portada lleva la otra
    // vista de la suite Silver. Esta tiene los ventanales triangulares con el
    // jardín, que en la mitad derecha de la cabecera se ven enteros.
    src: "/images/habitaciones/silver/principal-2.jpg",
    alt: "Suite Silver con sofá para el acompañante y ventanales triangulares con vista al jardín",
    position: "center 40%",
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
    position: "center 12%",
  },
} satisfies Record<string, EditorialImage>;
