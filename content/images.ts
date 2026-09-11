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
    src: null,
    alt: "",
    position: "center 38%",
  },
  servicios: {
    src: null,
    alt: "",
    position: "center 38%",
  },
  habitaciones: {
    src: null,
    alt: "",
    position: "center",
  },
  especialidades: { src: null, alt: "", position: "center" },
  nosotros: { src: null, alt: "", position: "center" },
  pacientes: { src: null, alt: "", position: "center" },
  doctor: { src: null, alt: "", position: "center top" },
} satisfies Record<string, EditorialImage>;
