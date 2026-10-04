import BookingFlow from "@/booking/components/BookingFlow";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Reservar una consulta · Demostración",
  description:
    "Explorá el recorrido de reserva de Clínica Montalvo con datos de ejemplo. No se crean reservas reales.",
  path: "/reservar",
  index: false,
});

export default function ReservarPage() {
  return (
    <>
      <BookingFlow />
      <noscript>
        <p className="mx-auto max-w-7xl p-8">
          Esta demostración necesita JavaScript para recorrer los pasos. Podés
          consultar los datos de contacto en Atención al paciente.
        </p>
      </noscript>
    </>
  );
}
