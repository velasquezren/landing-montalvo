/** Fotografías editoriales. src: null conserva el diseño sin solicitar archivos inexistentes.
 * Guía de encuadres y entrega: public/images/README.md.
 */
export type EditorialImage = {
  src: string | null;
  alt: string;
  position: string;
};

export type PhotoSlide = EditorialImage & { src: string; caption: string };

export const clinicPhotos = {
  fachada: { src: "/images/clinica/fachada-20261001.jpg", alt: "Fachada de Clínica Montalvo, con sus ventanales triangulares y entrada principal", position: "center", caption: "Bienvenidos a Clínica Montalvo" },
  exterior: { src: "/images/clinica/exterior-20261001.jpg", alt: "Vista de la clínica desde la acera, entre árboles y junto al letrero de emergencias", position: "center", caption: "Un lugar cercano, en Santa Cruz" },
  acceso: { src: "/images/clinica/acceso-vertical-20261001.jpg", alt: "Letrero de Clínica Montalvo y emergencias junto al acceso", position: "62% 70%", caption: "Reconozca nuestro acceso" },
  emergencias: { src: "/images/clinica/emergencias-20261001.jpg", alt: "Señal de emergencias de Clínica Montalvo sobre la acera arbolada", position: "center", caption: "Emergencias las 24 horas" },
  equipoEntrada: { src: "/images/clinica/equipo-entrada-20261001.jpg", alt: "Integrantes del equipo de la clínica reunidos en la entrada con la bandera de Santa Cruz", position: "center", caption: "Atención que empieza con las personas" },
  equipoCercano: { src: "/images/clinica/equipo-cercano-20261001.jpg", alt: "Integrantes del equipo de Clínica Montalvo frente a la fachada", position: "center 60%", caption: "Un equipo para acompañarle" },
  equipoCompleto: { src: "/images/clinica/equipo-completo-20261001.jpg", alt: "Fotografía de grupo del equipo de Clínica Montalvo frente a sus instalaciones", position: "center 60%", caption: "Las personas detrás de nuestra atención" },
} satisfies Record<string, PhotoSlide>;

export const homeSlides = [{
  src: "/images/habitaciones/silver/principal-1.jpg",
  alt: "Suite de Clínica Montalvo con amplios ventanales y espacio para acompañantes",
  position: "center 55%", caption: "Espacios para una estancia tranquila",
}, clinicPhotos.fachada, clinicPhotos.exterior] satisfies PhotoSlide[];

export const teamSlides = [clinicPhotos.equipoCompleto, clinicPhotos.equipoEntrada, clinicPhotos.equipoCercano];

export const editorialImages = {
  inicio: homeSlides[0],
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
  nosotros: clinicPhotos.exterior,
  pacientes: clinicPhotos.acceso,
  doctor: {
    src: "/images/equipo/dr-montalvo-retrato.jpg",
    alt: "Retrato del Dr. Juan Carlos Montalvo con bata blanca y medalla de reconocimiento",
    position: "center 12%",
  },
} satisfies Record<string, EditorialImage>;
