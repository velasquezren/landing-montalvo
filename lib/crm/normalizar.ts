import type {
  Ausencia,
  Banner,
  BloqueHorario,
  DiaSemana,
  EspecialidadPublica,
  FichaMedico,
  FormatoBanner,
  MedicoPublico,
  PromocionPublica,
  Referencia,
} from "./tipos.ts";

/**
 * De la respuesta cruda de la API pública a los tipos de `tipos.ts`.
 *
 * Es código puro y sin dependencias de Next a propósito: se prueba con
 * `node --test` (`crm.test.ts`) y es la única pieza que conoce los nombres de
 * campo del backend.
 *
 * Criterio: un registro al que le falta lo imprescindible (slug, nombre,
 * título) se descarta entero en vez de pintarse a medias; un campo opcional
 * malformado se trata como ausente. Así una página nunca muestra «undefined»
 * ni un enlace a `/staff-medico/undefined`.
 */

type Objeto = Record<string, unknown>;

const esObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function texto(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const limpio = v.trim();
  return limpio ? limpio : null;
}

function numero(v: unknown): number | null {
  if (typeof v === "string" && v.trim() === "") return null;
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Un slug con la forma que genera el CRM; lo demás no se le pregunta. */
export const esSlug = (v: string) => v.length <= 120 && SLUG.test(v);

function slug(v: unknown): string | null {
  const s = texto(v);
  return s && SLUG.test(s) ? s : null;
}

function fecha(v: unknown): string | null {
  const s = texto(v);
  if (!s || !FECHA.test(s)) return null;
  const dia = new Date(`${s}T12:00:00Z`);
  return Number.isFinite(dia.getTime()) && dia.toISOString().slice(0, 10) === s ? s : null;
}

/** Los elementos válidos de una lista; lo que no lo sea se descarta. */
function lista<T>(v: unknown, de: (x: unknown) => T | null): T[] {
  if (!Array.isArray(v)) return [];
  const salida: T[] = [];
  for (const x of v) {
    const item = de(x);
    if (item !== null) salida.push(item);
  }
  return salida;
}

/**
 * Una imagen solo se acepta si vive en el propio CRM: la API las da absolutas
 * (`CRM_URL_PUBLICA`) o, sin esa variable, relativas. Cualquier otro origen
 * se descarta, porque `next/image` solo optimiza los permitidos en
 * `remotePatterns` y respondería 400 con la imagen rota.
 */
export function urlDeImagen(v: unknown, baseApi: string): string | null {
  const s = texto(v);
  if (!s) return null;
  try {
    const base = new URL(baseApi);
    const url = new URL(s, base);
    // Mismo contrato que images.remotePatterns en next.config.ts.
    return url.origin === base.origin && url.pathname.startsWith("/publico/") &&
      !url.search && !url.hash && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function referencia(v: unknown): Referencia | null {
  if (!esObjeto(v)) return null;
  const s = slug(v.slug);
  const nombre = texto(v.nombre);
  return s && nombre ? { slug: s, nombre } : null;
}

function bloque(v: unknown): BloqueHorario | null {
  if (!esObjeto(v)) return null;
  const dia = v.diaSemana;
  const desde = texto(v.desde);
  const hasta = texto(v.hasta);
  if (typeof dia !== "number" || !Number.isInteger(dia) || dia < 1 || dia > 7) return null;
  if (!desde || !hasta || !HORA.test(desde) || !HORA.test(hasta) || desde >= hasta) return null;
  return { diaSemana: dia as DiaSemana, desde, hasta, lugar: texto(v.lugar) };
}

function ausencia(v: unknown): Ausencia | null {
  if (!esObjeto(v)) return null;
  const desde = fecha(v.desde);
  const hasta = fecha(v.hasta);
  if (!desde || !hasta || desde > hasta) return null;
  // El listado y la ficha la llaman distinto: `motivo` y `motivoPublico`.
  return { desde, hasta, motivo: texto(v.motivo) ?? texto(v.motivoPublico) };
}

export function especialidadDe(v: unknown): EspecialidadPublica | null {
  if (!esObjeto(v)) return null;
  const s = slug(v.slug);
  const nombre = texto(v.nombre);
  if (!s || !nombre) return null;
  return {
    slug: s,
    nombre,
    descripcion: texto(v.descripcion),
    medicos: Math.trunc(numero(v.medicos) ?? 0),
  };
}

export function medicoDe(v: unknown, baseApi: string): MedicoPublico | null {
  if (!esObjeto(v)) return null;
  const s = slug(v.slug);
  const nombre = texto(v.nombre);
  if (!s || !nombre) return null;
  const horario = lista(v.horario, bloque).sort(
    (a, b) => a.diaSemana - b.diaSemana || a.desde.localeCompare(b.desde),
  );
  return {
    slug: s,
    nombre,
    resumen: texto(v.resumen),
    especialidades: lista(v.especialidades, referencia),
    fotoUrl: urlDeImagen(v.fotoUrl, baseApi),
    precioConsulta: numero(v.precioConsulta),
    horario,
    resumenHorario: texto(v.resumenHorario) ?? "Con cita a solicitud",
    ausencias: lista(v.ausencias, ausencia),
    agendaMedicoId: typeof v.agendaMedicoId === "string" && /^\d{1,10}$/.test(v.agendaMedicoId) ? v.agendaMedicoId : null,
  };
}

export function fichaDe(v: unknown, baseApi: string): FichaMedico | null {
  const medico = medicoDe(v, baseApi);
  if (!medico || !esObjeto(v)) return null;
  return { ...medico, biografia: texto(v.biografia), matricula: texto(v.matricula) };
}

const FORMATOS: FormatoBanner[] = ["CUADRADO", "VERTICAL", "HISTORIA", "HORIZONTAL"];

function banner(v: unknown, baseApi: string): Banner | null {
  if (!esObjeto(v)) return null;
  const url = urlDeImagen(v.url, baseApi);
  const ancho = numero(v.ancho);
  const alto = numero(v.alto);
  if (!url || !ancho || !alto) return null;
  return { url, ancho, alto, alt: texto(v.alt) ?? "" };
}

export function promocionDe(v: unknown, baseApi: string): PromocionPublica | null {
  if (!esObjeto(v)) return null;
  const s = slug(v.slug);
  const codigo = texto(v.codigo);
  const titulo = texto(v.titulo);
  const vigenteDesde = fecha(v.vigenteDesde);
  if (!s || !codigo || !titulo || !vigenteDesde) return null;

  const banners: PromocionPublica["banners"] = {};
  if (esObjeto(v.banners)) {
    for (const formato of FORMATOS) {
      const b = banner(v.banners[formato], baseApi);
      if (b) banners[formato] = b;
    }
  }

  const precioRegular = numero(v.precioRegular);
  const precioPromocional = numero(v.precioPromocional);
  return {
    slug: s,
    codigo,
    titulo,
    resumen: texto(v.resumen) ?? "",
    descripcion: texto(v.descripcion),
    condiciones: texto(v.condiciones),
    etiquetaOferta: texto(v.etiquetaOferta),
    precioRegular,
    // El backend ya lo exige menor que el regular; si no lo fuera, no se
    // anuncia un «descuento» que no lo es.
    precioPromocional:
      precioPromocional !== null && precioRegular !== null && precioPromocional >= precioRegular
        ? null
        : precioPromocional,
    vigenteDesde,
    vigenteHasta: fecha(v.vigenteHasta),
    destacada: v.destacada === true,
    especialidad: referencia(v.especialidad),
    medicos: lista(v.medicos, referencia),
    banners,
    mensajeWhatsapp:
      texto(v.mensajeWhatsapp) ?? `Hola, quisiera información sobre la promoción «${titulo}» (${codigo}).`,
  };
}

/** `{ datos, totalPaginas }` de un listado paginado del CRM; `null` si no lo es. */
export function paginaDe(v: unknown): { datos: unknown[]; totalPaginas: number } | null {
  if (!esObjeto(v) || !Array.isArray(v.datos)) return null;
  const totalPaginas = numero(v.totalPaginas);
  return { datos: v.datos, totalPaginas: totalPaginas ? Math.trunc(totalPaginas) : 1 };
}
