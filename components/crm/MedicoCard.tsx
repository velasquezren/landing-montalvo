import Image from "next/image";
import Link from "next/link";
import { Clock3, UserRound } from "lucide-react";
import type { MedicoPublico } from "@/lib/crm/tipos";
import { bolivianos } from "@/lib/formato";

/**
 * Tarjeta del directorio. La foto va en un marco 4:5 fijo con `object-cover`
 * encuadrado arriba: el CRM no exige proporción a las fotos de ficha, y un
 * marco que cambiara con cada foto desalinearía la rejilla.
 */
export default function MedicoCard({ medico, sizes }: { medico: MedicoPublico; sizes: string }) {
  return (
    <Link
      href={`/staff-medico/${medico.slug}`}
      className="group flex h-full flex-col border border-border bg-background transition-colors hover:border-primary"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-wash">
        {medico.fotoUrl ? (
          <Image
            src={medico.fotoUrl}
            alt=""
            fill
            sizes={sizes}
            className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
          />
        ) : (
          <UserRound aria-hidden="true" className="absolute inset-0 m-auto h-14 w-14 text-primary/30" strokeWidth={1} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="h3 line-clamp-2">{medico.nombre}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-primary">
          {medico.especialidades.map((e) => e.nombre).join(" · ")}
        </p>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Clock3 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-3">{medico.resumenHorario}</span>
        </p>
        {medico.precioConsulta !== null && (
          <p className="mt-auto pt-4 text-sm font-semibold tabular-nums">
            {bolivianos(medico.precioConsulta)}
            <span className="font-normal text-muted-foreground"> · consulta</span>
          </p>
        )}
      </div>
    </Link>
  );
}
