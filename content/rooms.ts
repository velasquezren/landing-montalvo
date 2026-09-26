export type AmenityKey =
  | "habitacion-privada"
  | "tipo-suite"
  | "servicio-habitacion"
  | "bano-ducha-privados"
  | "secadora"
  | "frigobar"
  | "ropa-cama"
  | "muebleria"
  | "aire-acondicionado"
  | "tv-cable"
  | "wifi"
  | "parqueo-gratis"
  | "sala-jardin"
  | "vajilla-especial"
  | "lujo-confort";

export type RoomImage = {
  src: string;
  alt: string; // descripción real de la foto, en español
  role: "principal" | "galeria" | "detalle";
  /**
   * Punto de interés, en la sintaxis de `object-position`.
   *
   * Las fichas de la galería son apaisadas y varias fotografías son
   * verticales: sin esto, el recorte centrado se come el motivo. Solo hace
   * falta declararlo cuando el centro geométrico no es el centro de atención.
   */
  position?: string;
};

/** Identificador de suite. Es también el ancla de la URL (/servicios#gold). */
export type RoomSlug = "gold" | "silver" | "bronce";

export type Room = {
  slug: RoomSlug;
  tabLabel: string; // "Gold"
  name: string; // "Gold Deluxe Suite"
  tier: RoomSlug;
  tagline: string;
  description: string[];
  highlights: string[];
  amenities: AmenityKey[];
  images: RoomImage[];
  areaM2?: number;
  companions?: number;
  priceFrom?: { amount: number; currency: "Bs" | "USD" };
  order: number;
};

export const roomsData: Room[] = [
  {
    slug: "gold",
    tabLabel: "Gold",
    name: "Gold Deluxe Suite",
    tier: "gold",
    tagline: "La más espaciosa y exclusiva",
    description: [
      "Nuestras Gold Deluxe Suites ofrecen un espacio íntimo y privado, lleno de estilo y elegancia.",
      "Esta estancia destaca por ser la más espaciosa y por sus exquisitos y exclusivos servicios.",
      "Vivir la experiencia Gold Deluxe es disfrutar de servicios únicos que harán del nacimiento de su bebé el momento más especial, en compañía de sus familiares y amigos."
    ],
    highlights: [
      "La más espaciosa",
      "Servicios exclusivos",
      "Sala jardín"
    ],
    amenities: [
      "habitacion-privada",
      "tipo-suite",
      "servicio-habitacion",
      "bano-ducha-privados",
      "secadora",
      "frigobar",
      "ropa-cama",
      "muebleria",
      "aire-acondicionado",
      "tv-cable",
      "wifi",
      "parqueo-gratis",
      "sala-jardin",
      "vajilla-especial",
      "lujo-confort"
    ],
    // Añadir fotografías reales siguiendo public/images/README.md.
    images: [
      { src: "/images/habitaciones/gold/principal-1.jpg",
        alt: "Suite Gold Deluxe con sala de estar, sofá de tres plazas, mesa de centro y cuna junto a la cama",
        role: "principal" },
      { src: "/images/habitaciones/gold/principal-2.jpg",
        alt: "Vista general de la suite Gold Deluxe con televisor, mueblería de madera y salida a la terraza",
        role: "principal" },
      { src: "/images/habitaciones/gold/galeria-1.jpg",
        alt: "Baño de la suite Gold con encimera de mármol, ducha independiente y toallas bordadas",
        role: "galeria" },
      { src: "/images/habitaciones/gold/galeria-2.jpg",
        alt: "Baño de la suite Gold con espejo de cuerpo entero y orquídeas sobre el mármol",
        role: "galeria", position: "center 62%" },
      { src: "/images/habitaciones/gold/galeria-3.jpg",
        alt: "Albornoz y zapatillas con el logotipo de Clínica Montalvo sobre la cama",
        role: "detalle" },
      { src: "/images/habitaciones/gold/galeria-4.jpg",
        alt: "Set de aseo de Maternidad Privada Montalvo sobre la encimera de mármol",
        role: "detalle" },
      { src: "/images/habitaciones/gold/galeria-5.jpg",
        alt: "Orquídea sobre la mesa de la suite, con la cama y el sofá al fondo",
        role: "detalle", position: "center 45%" },
    ],
    order: 1
    // [COMPLETAR: areaM2, companions, priceFrom si la clínica decide publicarlos]
  },
  {
    slug: "silver",
    tabLabel: "Silver",
    name: "Silver Suite",
    tier: "silver",
    tagline: "Amplitud y luz natural",
    description: [
      "Nuestras Silver Suites combinan minimalismo, comodidad y amplitud. Esta estancia destaca por su amplia sala de estar y un balcón con ventanales que le aportan gran luminosidad.",
      "La Silver Suite le permitirá disfrutar de un momento tan íntimo y especial como el nacimiento de su bebé, junto a sus familiares y amigos, con elegancia y comodidad."
    ],
    highlights: [
      "Amplia sala de estar",
      "Balcón con ventanales",
      "Gran luminosidad"
    ],
    amenities: [
      "habitacion-privada",
      "tipo-suite",
      "servicio-habitacion",
      "bano-ducha-privados",
      "secadora",
      "frigobar",
      "ropa-cama",
      "muebleria",
      "aire-acondicionado",
      "tv-cable",
      "wifi",
      "parqueo-gratis"
    ],
    // Añadir fotografías reales siguiendo public/images/README.md.
    images: [
      { src: "/images/habitaciones/silver/principal-1.jpg",
        alt: "Suite Silver con sala de estar, televisor y balcón con ventanales de suelo a techo",
        role: "principal" },
      { src: "/images/habitaciones/silver/principal-2.jpg",
        alt: "Suite Silver con sofá para el acompañante y ventanales triangulares con vista al jardín",
        role: "principal" },
    ],
    order: 2
    // [COMPLETAR: areaM2, companions, priceFrom si la clínica decide publicarlos]
  },
  {
    slug: "bronce",
    tabLabel: "Bronce",
    name: "Suite Bronce",
    tier: "bronce",
    tagline: "Comodidad y privacidad",
    description: [
      "Nuestras Suites Bronce combinan minimalismo y comodidad. Son espaciosas estancias individuales, luminosas y con baño independiente.",
      "La Suite Bronce es perfecta para que pueda disfrutar de ese momento tan especial junto a su bebé y su familia."
    ],
    highlights: [
      "Estancia individual",
      "Luminosa",
      "Baño independiente"
    ],
    amenities: [
      "habitacion-privada",
      "servicio-habitacion",
      "bano-ducha-privados",
      "secadora",
      "frigobar",
      "ropa-cama",
      "muebleria",
      "aire-acondicionado",
      "tv-cable",
      "wifi",
      "parqueo-gratis"
    ],
    // Añadir fotografías reales siguiendo public/images/README.md.
    images: [
      { src: "/images/habitaciones/bronce/principal-1.jpg",
        alt: "Suite Bronce individual con cama, armario de madera y frigobar",
        role: "principal" },
      { src: "/images/habitaciones/bronce/principal-2.jpg",
        alt: "Suite Bronce con banco para el acompañante, aire acondicionado y televisor",
        role: "principal" },
      { src: "/images/habitaciones/bronce/galeria-1.jpg",
        alt: "Suite Bronce vista desde la entrada, con zona de descanso junto a la ventana",
        role: "galeria" },
      { src: "/images/habitaciones/bronce/galeria-2.jpg",
        alt: "Baño independiente de la suite Bronce con ducha y lavabo",
        role: "galeria", position: "center 55%" },
    ],
    order: 3
    // [COMPLETAR: areaM2, companions, priceFrom si la clínica decide publicarlos]
  }
];

/** La primera suite de la lista: la que se muestra si la URL no pide otra. */
export const defaultRoomSlug: RoomSlug = roomsData[0].slug;

/**
 * Acceso por slug. Evita recorrer el array en cada render y, sobre todo, hace
 * que leer el ancla de la URL sea una comprobación de pertenencia en vez de una
 * búsqueda seguida de una comparación.
 */
export const roomsBySlug = new Map<RoomSlug, Room>(
  roomsData.map((room) => [room.slug, room])
);

/** Comprueba que una cadena arbitraria —un hash— nombra una suite real. */
export function isRoomSlug(value: string): value is RoomSlug {
  return roomsBySlug.has(value as RoomSlug);
}
