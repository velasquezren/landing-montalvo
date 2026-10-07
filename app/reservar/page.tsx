import { Suspense } from "react";
import BookingChannels from "@/booking/components/BookingChannels";
import ReservaConParametros from "@/booking/components/ReservaConParametros";
import type { CatalogoReserva } from "@/booking/types";
import { obtenerEspecialidades, obtenerMedicos } from "@/lib/crm/api";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "Reservar una consulta",
  description:
    "Reservá tu consulta en la agenda web de Clínica Montalvo o coordiná una cita por WhatsApp. Elegí la forma que te resulte más cómoda.",
  path: "/reservar",
});

/** `REVALIDAR_SEGUNDOS` de lib/crm/api.ts. Next exige aquí un literal. */
export const revalidate = 300;

export default async function ReservarPage() {
  // Especialidades y médicos publicados en el CRM, leídos en el servidor: el
  // recorrido llega con todo el catálogo y no espera a ninguna petición.
  let catalogo: CatalogoReserva = { especialidades: [], medicos: [] };
  try {
    const [especialidades, medicos] = await Promise.all([obtenerEspecialidades(), obtenerMedicos()]);
    catalogo = { especialidades, medicos };
  } catch {
    // El catálogo solo alimenta la preparación opcional. Su caída no debe
    // cerrar el acceso a la agenda existente ni al contacto por WhatsApp.
    console.warn("[reservar] Catálogo no disponible; se mantienen los dos accesos de reserva.");
  }

  return (
    <>
      {/* El respaldo es el mismo recorrido sin preelección: es lo que sale en
          el HTML y lo que ve quien llega sin parámetros. */}
      <Suspense fallback={<BookingChannels catalogo={catalogo} />}>
        <ReservaConParametros catalogo={catalogo} />
      </Suspense>
      <noscript>
        <p className="mx-auto max-w-7xl p-8">
          Podés <a href={siteConfig.appointmentUrl} className="underline">abrir la agenda de citas</a> o
          {" "}<a href={buildWhatsAppUrl("Hola, quisiera reservar una cita.")} className="underline">escribirnos por WhatsApp</a>.
        </p>
      </noscript>
    </>
  );
}
