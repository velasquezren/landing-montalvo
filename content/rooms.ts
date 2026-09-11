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
    images: [],
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
    images: [],
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
    images: [],
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
