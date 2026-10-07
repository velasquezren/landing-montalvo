import { consultaAgenda, leerRespuesta } from "./contrato.ts";

/** Función comprobable sin Next ni secretos. La ruta aporta solo configuración de servidor. */
export async function consultarAgendaCRM(recurso: string, query: URLSearchParams, config: { habilitada: boolean; crmUrl: string }, pedir: typeof fetch = fetch): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  if (!config.habilitada) return Response.json({ message: "Consulta de agenda no habilitada." }, { status: 503, headers });
  const consulta = consultaAgenda(recurso, query);
  if (!consulta) return Response.json({ message: "Consulta no válida." }, { status: 400, headers });
  try {
    const respuesta = await pedir(`${config.crmUrl.replace(/\/+$/, "")}/publico/agenda/${consulta.recurso}?${consulta.query}`, {
      cache: "no-store", redirect: "error", headers: { accept: "application/json" }, signal: AbortSignal.timeout(8_000),
    });
    if (!respuesta.ok || !respuesta.headers.get("content-type")?.includes("application/json") || !respuesta.body) {
      await respuesta.body?.cancel(); throw new Error("Agenda no disponible");
    }
    const reader = respuesta.body.getReader();
    const parts: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        bytes += part.value.byteLength;
        if (bytes > 512 * 1024) throw new Error("Respuesta demasiado grande");
        parts.push(part.value);
      }
    } finally { await reader.cancel().catch(() => undefined); }
    const raw: unknown = JSON.parse(Buffer.concat(parts).toString("utf8"));
    return Response.json(leerRespuesta(consulta.recurso, raw, consulta.query), { headers });
  } catch {
    return Response.json({ message: "No pudimos consultar la agenda. Podés reintentar o continuar en la agenda de la clínica." }, { status: 503, headers });
  }
}
