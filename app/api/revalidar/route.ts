import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { ETIQUETAS } from "@/lib/crm/api";

/**
 * El CRM avisa aquí cuando cambia algo publicado (una promoción, una ficha,
 * un horario) y la landing descarta lo que tenía guardado de esa parte.
 *
 *   POST /api/revalidar
 *   Authorization: Bearer <CRM_REVALIDAR_SECRETO>
 *   { "etiquetas": ["promociones", "directorio"] }
 *
 * `{ expire: 0 }` y no `"max"`: con "max" la siguiente visita aún recibiría
 * la versión vieja mientras se regenera, y si el cambio es retirar una
 * promoción con un precio equivocado, esa visita no debe verla. La guía de
 * `revalidateTag` lo indica así para avisos que llegan de otro servicio.
 *
 * Sin `CRM_REVALIDAR_SECRETO` el aviso queda apagado (503) y las páginas se
 * renuevan solo por tiempo (`REVALIDAR_SEGUNDOS`).
 */

const PERMITIDAS = Object.keys(ETIQUETAS) as (keyof typeof ETIQUETAS)[];

/** Compara en tiempo constante, sin filtrar la longitud del secreto. */
function mismoSecreto(recibido: string, esperado: string) {
  const a = createHash("sha256").update(recibido).digest();
  const b = createHash("sha256").update(esperado).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secreto = process.env.CRM_REVALIDAR_SECRETO;
  if (!secreto) {
    return Response.json({ error: "La revalidación por aviso no está configurada." }, { status: 503 });
  }

  const autorizacion = request.headers.get("authorization") ?? "";
  if (!mismoSecreto(autorizacion, `Bearer ${secreto}`)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo debe ser JSON." }, { status: 400 });
  }
  const pedidas =
    typeof cuerpo === "object" && cuerpo !== null && Array.isArray((cuerpo as { etiquetas?: unknown }).etiquetas)
      ? (cuerpo as { etiquetas: unknown[] }).etiquetas
      : [];
  const etiquetas = PERMITIDAS.filter((e) => pedidas.includes(e));
  if (etiquetas.length === 0) {
    return Response.json({ error: `Indique "etiquetas": ${JSON.stringify(PERMITIDAS)}.` }, { status: 400 });
  }

  for (const etiqueta of etiquetas) revalidateTag(ETIQUETAS[etiqueta], { expire: 0 });
  return Response.json({ revalidadas: etiquetas, en: new Date().toISOString() });
}
