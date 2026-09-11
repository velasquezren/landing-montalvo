import type { AmenityKey } from "./rooms";

export type AmenityDefinition = {
  key: AmenityKey;
  label: string;
  iconName:
    | "DoorClosed"
    | "Crown"
    | "ConciergeBell"
    | "ShowerHead"
    | "Wind"
    | "Refrigerator"
    | "BedDouble"
    | "Sofa"
    | "AirVent"
    | "Tv"
    | "Wifi"
    | "SquareParking"
    | "Trees"
    | "UtensilsCrossed"
    | "Gem";
};

export const amenitiesCatalog: AmenityDefinition[] = [
  { key: "habitacion-privada", label: "Habitación privada", iconName: "DoorClosed" },
  { key: "tipo-suite", label: "Tipo suite", iconName: "Crown" },
  { key: "servicio-habitacion", label: "Servicio a la habitación", iconName: "ConciergeBell" },
  { key: "bano-ducha-privados", label: "Baño y ducha privados", iconName: "ShowerHead" },
  { key: "secadora", label: "Secadora de pelo", iconName: "Wind" },
  { key: "frigobar", label: "Frigobar", iconName: "Refrigerator" },
  { key: "ropa-cama", label: "Ropa de cama", iconName: "BedDouble" },
  { key: "muebleria", label: "Mueblería", iconName: "Sofa" },
  { key: "aire-acondicionado", label: "Aire acondicionado", iconName: "AirVent" },
  { key: "tv-cable", label: "TV cable", iconName: "Tv" },
  { key: "wifi", label: "Zona Wi-Fi", iconName: "Wifi" },
  { key: "parqueo-gratis", label: "Parqueo gratis", iconName: "SquareParking" },
  { key: "sala-jardin", label: "Sala jardín", iconName: "Trees" },
  { key: "vajilla-especial", label: "Vajilla especial", iconName: "UtensilsCrossed" },
  { key: "lujo-confort", label: "Lujo y confort", iconName: "Gem" }
];
