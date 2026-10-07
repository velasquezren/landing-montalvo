"use client";
import { useSearchParams } from "next/navigation";
import { solicitudInicial } from "../state";
import type { CatalogoReserva } from "../types";
import BookingChannels from "./BookingChannels";
import { initialChannel } from "../channels";

/**
 * Lee `?medico=` / `?especialidad=` (los enlaces de la ficha de un médico y
 * del directorio) y arranca el recorrido con eso ya elegido.
 *
 * Va aparte y dentro de un `<Suspense>` en la página: `useSearchParams` en
 * una página estática hace que este trozo se pinte en el cliente, y así el
 * resto de la página sigue saliendo prerenderizado.
 */
export default function ReservaConParametros({ catalogo, demoEnabled, agendaEnabled = false }: { catalogo: CatalogoReserva; demoEnabled: boolean; agendaEnabled?: boolean }) {
  const parametros = useSearchParams();
  const medico = parametros.get("medico");
  const especialidad = parametros.get("especialidad");
  const canal = parametros.get("canal");
  return (
    <BookingChannels
      key={`${medico ?? ""}|${especialidad ?? ""}|${canal ?? ""}`}
      catalogo={catalogo}
      demoEnabled={demoEnabled}
      agendaEnabled={agendaEnabled}
      initial={initialChannel(demoEnabled, canal, Boolean(medico || especialidad), agendaEnabled)}
      preselection={solicitudInicial(catalogo, { medico, especialidad })}
    />
  );
}
