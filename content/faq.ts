export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  isPending?: boolean;
};

export const internacionFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "¿Cuántos acompañantes pueden quedarse en la habitación?",
    answer:
      "[COMPLETAR: Cantidad exacta de acompañantes permitidos por noche según suite (Gold, Silver, Bronce) y condiciones de estancia en Clínica Montalvo].",
    isPending: true
  },
  {
    id: "faq-2",
    question: "¿Cuál es el horario de visitas?",
    answer:
      "[COMPLETAR: Horario oficial de visitas diurnas y nocturnas para habitaciones de internación y áreas especiales].",
    isPending: true
  },
  {
    id: "faq-3",
    question: "¿Qué debo llevar el día de mi internación?",
    answer:
      "[COMPLETAR: Lista de documentos de identidad, estudios médicos previos, artículos personales recomendados para la madre, el recién nacido o el paciente internado].",
    isPending: true
  },
  {
    id: "faq-4",
    question: "¿Trabajan con seguros médicos?",
    answer:
      "[COMPLETAR: Listado de compañías de seguros de salud nacionales e internacionales con convenio vigente o modalidad de reembolso].",
    isPending: true
  },
  {
    id: "faq-5",
    question: "¿Cómo reservo una habitación para mi parto?",
    answer:
      "[COMPLETAR: Procedimiento de pre-reserva de suite obstétrica, anticipación recomendada en semanas de gestación y canal de admisiones].",
    isPending: true
  }
];
