import { Suspense } from "react";
import BookingFlow from "@/booking/components/BookingFlow";
import ReservaConParametros from "@/booking/components/ReservaConParametros";
import type { CatalogoReserva } from "@/booking/types";
import { obtenerEspecialidades, obtenerMedicos } from "@/lib/crm/api";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Solicitar una consulta",
  description:
    "Elija especialidad, profesional y el día que prefiere, y envíe su solicitud de consulta a Clínica Montalvo por WhatsApp.",
  path: "/reservar",
});

/** `REVALIDAR_SEGUNDOS` de lib/crm/api.ts. Next exige aquí un literal. */
export const revalidate = 300;

export default async function ReservarPage() {
  // Especialidades y médicos publicados en el CRM, leídos en el servidor: el
  // recorrido llega con todo el catálogo y no espera a ninguna petición.
  const [especialidades, medicos] = await Promise.all([obtenerEspecialidades(), obtenerMedicos()]);
  const catalogo: CatalogoReserva = { especialidades, medicos };

  return (
    <>
      {/* El respaldo es el mismo recorrido sin preelección: es lo que sale en
          el HTML y lo que ve quien llega sin parámetros. */}
      <Suspense fallback={<BookingFlow catalogo={catalogo} />}>
        <ReservaConParametros catalogo={catalogo} />
      </Suspense>
      <noscript>
        <p className="mx-auto max-w-7xl p-8">
          Para elegir paso a paso hace falta JavaScript. También puede escribirnos directamente por WhatsApp
          desde Atención al paciente.
        </p>
      </noscript>
    </>
  );
}
