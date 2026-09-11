export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  iconName:
    | "Stethoscope"
    | "Microscope"
    | "ScanLine"
    | "Scissors"
    | "Ambulance"
    | "Baby"
    | "Brain"
    | "HeartPulse";
  /**
   * Solo se enlazan los servicios que tienen un destino real.
   *
   * Antes los ocho apuntaban a anclas (#diagnostico, #imagenologia, #cirugias,
   * #fertilidad, #salud-mental, #uci) que no existen en ninguna página: las
   * ocho tarjetas ofrecían "Ver más" y seis no llevaban a ninguna parte.
   * [COMPLETAR: añadir href cuando cada sección tenga contenido propio]
   */
  href?: string;
  isAnchor?: boolean;
};

export const servicesData: ServiceItem[] = [
  {
    id: "consultas",
    title: "Consultas médicas",
    description: "Más de 30 especialidades y 80 especialistas.",
    iconName: "Stethoscope",
    href: "/especialidades"
  },
  {
    id: "laboratorio",
    title: "Diagnóstico y laboratorio",
    description: "Análisis clínicos con resultados confiables.",
    iconName: "Microscope"
  },
  {
    id: "imagenologia",
    title: "Imagenología",
    description: "Estudios por imágenes para un diagnóstico preciso.",
    iconName: "ScanLine"
  },
  {
    id: "cirugias",
    title: "Cirugías",
    description: "Procedimientos programados y de urgencia, con laparoscopía 3D.",
    iconName: "Scissors"
  },
  {
    id: "internacion-emergencias",
    title: "Internación y emergencias",
    description: "Suites privadas y atención de urgencias las 24 horas.",
    iconName: "Ambulance",
    href: "#habitaciones",
    isAnchor: true
  },
  {
    id: "fertilidad",
    // Es el posicionamiento más fuerte de la clínica, no un servicio más.
    title: "Reproducción asistida",
    description: "Pioneros en Bolivia, con más de 2.400 bebés nacidos.",
    iconName: "Baby"
  },
  {
    id: "salud-mental",
    title: "Salud mental",
    description: "Atención profesional del bienestar emocional.",
    iconName: "Brain"
  },
  {
    id: "uci",
    title: "Unidad de cuidados intensivos",
    description: "Monitoreo y atención especializada continua.",
    iconName: "HeartPulse"
  }
];
