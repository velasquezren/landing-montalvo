/**
 * Identidad institucional de Clínica Montalvo.
 *
 * Todo lo que hay aquí sale de lo que la clínica publica hoy en su web. Cada
 * bloque indica su procedencia, porque no es lo mismo un dato que la clínica
 * afirma que una redacción nuestra:
 *
 *   VERIFICADO  — aparece literalmente en la web de la clínica.
 *   REDACTADO   — reformulación nuestra de algo que sí comunica la clínica.
 *   PENDIENTE   — no existe todavía; hace falta que lo apruebe Dirección.
 *
 * Regla: no convertir en oficial nada que la clínica no haya declarado como
 * tal. Un eslogan inventado en un sitio institucional se acaba citando como si
 * fuera doctrina de la casa.
 */

/** VERIFICADO — descriptor con el que la clínica se presenta. */
export const descriptor = "Atención médica integral";

/** VERIFICADO — posicionamiento que la clínica usa de forma destacada. */
export const positioning = "Pioneros en reproducción asistida";

/** VERIFICADO — cifras que la clínica publica. */
export const facts = [
  {
    value: "+2.400",
    label: "bebés nacidos por reproducción asistida"
  },
  { value: "+30", label: "especialidades médicas" },
  { value: "80", label: "especialistas" },
  { value: "24 h", label: "servicio de emergencias" }
] as const;

/** VERIFICADO — diferenciales que la clínica afirma. */
export const differentiators = [
  "Única laparoscopía 3D en Bolivia",
  "Especialidades respaldadas a nivel nacional e internacional",
  "Tecnología médica de vanguardia"
] as const;

/**
 * REDACTADO — reformulación institucional de lo que la web comunica hoy.
 * No copia el texto comercial: lo ordena.
 */
export const about = [
  "Clínica Montalvo es una institución de atención médica integral orientada a brindar servicios de salud especializados con profesionalismo, tecnología y atención personalizada.",
  "Pioneros en reproducción asistida, contamos con más de 2.400 casos de bebés nacidos, más de 30 especialidades médicas y un equipo conformado por más de 80 especialistas.",
  "Nuestra atención integra experiencia médica, tecnología de vanguardia y un compromiso permanente con la ética, la responsabilidad y el bienestar de nuestros pacientes."
] as const;

/**
 * La web no tiene una sección "Valores". Los tres primeros sí los repite en sus
 * comunicaciones; los tres últimos son una estructuración coherente con lo que
 * comunica, pero la clínica no los ha declarado. El flag los mantiene separados
 * para que Dirección decida si los adopta.
 */
export const values = [
  { name: "Ética", declared: true },
  { name: "Profesionalismo", declared: true },
  { name: "Responsabilidad", declared: true },
  { name: "Compromiso con el paciente", declared: false },
  { name: "Innovación médica", declared: false },
  { name: "Excelencia en la atención", declared: false }
] as const;

/** REDACTADO — bloque de tecnología, a partir de lo que la web destaca. */
export const technology = {
  title: "Innovación y tecnología médica",
  body: "Incorporamos tecnología médica avanzada y procedimientos especializados para brindar diagnósticos y tratamientos cada vez más precisos, seguros y efectivos."
};

/**
 * Dr. Montalvo. Lo único que la web publica hoy es el hito de 2017; todo lo
 * demás (cargo, formación, trayectoria, fotografía) está pendiente de que la
 * clínica lo facilite.
 *
 * Ojo con el cargo: que la clínica lleve su apellido no acredita que sea el
 * fundador ni el director. Mientras `role` esté vacío, la página no le atribuye
 * ninguno.
 */
export const doctor = {
  name: "Dr. Juan Carlos Montalvo",
  // [COMPLETAR: cargo en la clínica, especialidad, formación y matrícula]
  role: "",
  // [COMPLETAR: reseña biográfica facilitada por la clínica]
  bio: [] as readonly string[],
  // [COMPLETAR: retrato en /public/images/equipo/]
  photo: ""
};

/** VERIFICADO — hito científico que recoge la propia web. */
export const milestones = [
  {
    year: "2017",
    title: "Dispositivo BATTS",
    text: "Presentación del dispositivo BATTS en el congreso latinoamericano de ginecología y obstetricia, en São Paulo."
  }
] as const;

/** REDACTADO — programa de maternidad, en versión institucional. */
export const maternity = {
  title: "Maternidad y Plan Nacer",
  body: "Acompañamiento integral durante cada etapa del embarazo, con atención médica especializada y seguimiento continuo hasta el nacimiento del bebé.",
  // VERIFICADO: la clínica ofrece pago en cuotas durante la gestación para
  // pacientes sin seguro médico privado.
  note: "Permite realizar pagos en cuotas durante la gestación a pacientes sin seguro médico privado."
};

/** VERIFICADO — tratamientos de reproducción asistida que la clínica publica. */
export const fertilityTreatments = [
  "Inseminación artificial",
  "Fertilización in vitro",
  "ICSI",
  "Ovodonación",
  "Vitrificación de óvulos",
  "Biopsia testicular",
  "Semen de donante",
  "Subrogación de vientre",
  "TESA-MESA"
] as const;

/** VERIFICADO — aseguradoras que la web lista como aliadas. */
export const insurers = ["Alianza", "Bisa", "Bupa", "Univida"] as const;

/**
 * PENDIENTE — la web no publica misión ni visión. No se inventan: el bloque no
 * se dibuja mientras estas dos cadenas estén vacías.
 * [COMPLETAR: redactar misión y visión y hacerlas aprobar por Dirección]
 */
export const mission = "";
export const vision = "";
