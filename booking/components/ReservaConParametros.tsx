"use client";
import { useSearchParams } from "next/navigation";
import { solicitudInicial } from "../state";
import type { CatalogoReserva } from "../types";
import BookingFlow from "./BookingFlow";

/**
 * Lee `?medico=` / `?especialidad=` (los enlaces de la ficha de un médico y
 * del directorio) y arranca el recorrido con eso ya elegido.
 *
 * Va aparte y dentro de un `<Suspense>` en la página: `useSearchParams` en
 * una página estática hace que este trozo se pinte en el cliente, y así el
 * resto de la página sigue saliendo prerenderizado.
 */
export default function ReservaConParametros({ catalogo }: { catalogo: CatalogoReserva }) {
  const parametros = useSearchParams();
  const medico = parametros.get("medico");
  const especialidad = parametros.get("especialidad");
  return (
    <BookingFlow
      key={`${medico ?? ""}|${especialidad ?? ""}`}
      catalogo={catalogo}
      inicial={solicitudInicial(catalogo, { medico, especialidad })}
    />
  );
}
