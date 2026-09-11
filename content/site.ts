export type NavItem = {
  /** Etiqueta completa: menú móvil, pie de página. */
  label: string;
  /** Etiqueta corta para la barra de escritorio, donde el espacio es el límite. */
  short: string;
  href: string;
};

export const siteConfig = {
  name: "Clínica Montalvo",
  legalName: "Clínica Montalvo S.R.L.",
  city: "Santa Cruz de la Sierra",
  country: "Bolivia",
  countryCode: "BO",
  // Descriptor con el que la clínica se presenta en su propia web. No es un
  // eslogan inventado: ver content/institucional.ts.
  tagline: "Atención médica integral.",
  description:
    "Clínica Montalvo, atención médica integral en Santa Cruz de la Sierra: pioneros en reproducción asistida, más de 30 especialidades, 80 especialistas, maternidad y emergencias las 24 horas.",
  address: {
    street: "", // Pendiente de confirmar la dirección exacta.
    city: "Santa Cruz de la Sierra",
    country: "Bolivia"
  },
  phone: "335 819 19",
  phoneTel: "tel:33581919",
  whatsapp: "+591 75031306",
  whatsappClean: "59175031306",
  email: "contacto@clinicamontalvo.net",
  schedule: "Lunes a domingo, 7:00 a 19:00",
  emergencies: "Emergencias, 24 horas",
  appointmentUrl:
    process.env.NEXT_PUBLIC_APPOINTMENT_URL ||
    "[COMPLETAR: URL de reserva de citas en línea]",
  socialLinks: {
    facebook: "https://www.facebook.com/clinicamontalvofacebook",
    instagram: "https://www.instagram.com/clinica__montalvo",
    tiktok: "https://www.tiktok.com/@clinicamontalvo",
    youtube: "https://youtube.com/@clinicamontalvo1"
  },
  navigation: [
    { label: "Inicio", short: "Inicio", href: "/" },
    { label: "Servicios", short: "Servicios", href: "/servicios" },
    { label: "Especialidades", short: "Especialidades", href: "/especialidades" },
    { label: "Dr. Montalvo", short: "Dr. Montalvo", href: "/dr-montalvo" },
    { label: "Staff médico", short: "Staff", href: "/staff-medico" },
    { label: "Sobre nosotros", short: "Nosotros", href: "/sobre-nosotros" },
    { label: "Atención al paciente", short: "Pacientes", href: "/atencion-al-paciente" },
    { label: "Blog", short: "Blog", href: "/blog" }
  ] satisfies NavItem[]
};
