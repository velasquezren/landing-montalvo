import "server-only";
import { cache } from "react";
import { CRM_API_URL } from "./config";
import { especialidadDe, fichaDe, medicoDe, paginaDe, promocionDe } from "./normalizar";
import type { EspecialidadPublica, FichaMedico, MedicoPublico, PromocionPublica } from "./tipos";

/**
 * Lectura de la API pública del CRM. Solo en el servidor: las páginas salen
 * prerenderizadas (ISR) y el navegador nunca llama al CRM.
 *
 * Frescura, en dos capas:
 * - **Al instante**: al publicar o editar, el CRM llama a `/api/revalidar` con
 *   la etiqueta (`ETIQUETAS`) y Next descarta lo guardado.
 * - **Red de seguridad**: cada `REVALIDAR_SEGUNDOS` se vuelve a pedir, por si
 *   ese aviso no llegó. Con el mismo valor que `export const revalidate` de
 *   las páginas que leen de aquí.
 *
 * Si el CRM falla:
 * - **Durante una regeneración** se lanza el error y Next sigue sirviendo la
 *   última versión buena (docs de ISR, «Handling uncaught exceptions»). Mejor
 *   una promoción de hace cinco minutos que una página que dice que no hay.
 * - **Durante `next build`** no hay versión anterior: se registra y se sigue
 *   con listas vacías, para que una caída del CRM no bloquee un despliegue
 *   de la landing. La página se regenera sola en el siguiente intervalo.
 */

export const ETIQUETAS = {
  promociones: "crm:promociones",
  directorio: "crm:directorio",
} as const;

export type Etiqueta = (typeof ETIQUETAS)[keyof typeof ETIQUETAS];

export const REVALIDAR_SEGUNDOS = 300;

/** El tope de la API por página. */
const POR_PAGINA = 100;
/** 500 registros: muy por encima de la clínica (80 especialistas). */
const PAGINAS_MAXIMAS = 5;
/** Una respuesta del CRM tarda decenas de ms; 8 s ya es una caída. */
const ESPERA_MAXIMA_MS = 8_000;

const enBuild = () => process.env.NEXT_PHASE === "phase-production-build";

/** El JSON de una ruta; `null` si el CRM responde 404 (no existe o no es pública). */
async function pedir(ruta: string, etiqueta: Etiqueta): Promise<unknown> {
  const respuesta = await fetch(`${CRM_API_URL}${ruta}`, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    next: { revalidate: REVALIDAR_SEGUNDOS, tags: [etiqueta] },
  });
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new Error(`CRM ${ruta} respondió ${respuesta.status}`);
  return respuesta.json();
}

/** Todas las páginas de un listado, ya normalizadas. */
async function listar<T>(
  ruta: string,
  etiqueta: Etiqueta,
  normalizar: (crudo: unknown) => T | null,
): Promise<T[]> {
  try {
    const salida: T[] = [];
    const separador = ruta.includes("?") ? "&" : "?";
    for (let pagina = 1; pagina <= PAGINAS_MAXIMAS; pagina++) {
      const cuerpo = paginaDe(await pedir(`${ruta}${separador}pagina=${pagina}&limite=${POR_PAGINA}`, etiqueta));
      if (!cuerpo) throw new Error(`CRM ${ruta}: la respuesta no es un listado`);
      for (const crudo of cuerpo.datos) {
        const item = normalizar(crudo);
        if (item) salida.push(item);
      }
      if (pagina >= cuerpo.totalPaginas) break;
    }
    return salida;
  } catch (error) {
    if (!enBuild()) throw error;
    console.warn(`[crm] ${ruta} no disponible durante el build; se publica vacío y se regenera solo.`, error);
    return [];
  }
}

/** Un registro por slug: `null` si no existe o ya no es público (la página da 404). */
async function uno<T>(ruta: string, etiqueta: Etiqueta, normalizar: (crudo: unknown) => T | null): Promise<T | null> {
  const crudo = await pedir(ruta, etiqueta);
  return crudo === null ? null : normalizar(crudo);
}

/* `cache` de React: una página y su `generateMetadata` piden lo mismo y se
   resuelve una vez por render. (El `signal` del tiempo de espera desactiva la
   memoización propia de `fetch`, no la caché de datos.) */

export const obtenerPromociones = cache(
  (): Promise<PromocionPublica[]> =>
    listar("/publico/promociones?canal=landing", ETIQUETAS.promociones, (x) => promocionDe(x, CRM_API_URL)),
);

export const obtenerPromocion = cache(
  (slug: string): Promise<PromocionPublica | null> =>
    uno(`/publico/promociones/${encodeURIComponent(slug)}`, ETIQUETAS.promociones, (x) => promocionDe(x, CRM_API_URL)),
);

export const obtenerEspecialidades = cache(
  (): Promise<EspecialidadPublica[]> =>
    listar("/publico/directorio/especialidades", ETIQUETAS.directorio, especialidadDe),
);

export const obtenerMedicos = cache(
  (): Promise<MedicoPublico[]> =>
    listar("/publico/directorio/medicos", ETIQUETAS.directorio, (x) => medicoDe(x, CRM_API_URL)),
);

export const obtenerMedico = cache(
  (slug: string): Promise<FichaMedico | null> =>
    uno(`/publico/directorio/medicos/${encodeURIComponent(slug)}`, ETIQUETAS.directorio, (x) => fichaDe(x, CRM_API_URL)),
);
