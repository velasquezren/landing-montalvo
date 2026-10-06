import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";
import type { PromocionPublica } from "@/lib/crm/tipos";
import { fechaCivil } from "@/lib/formato";
import Precio from "./Precio";

/**
 * Tarjeta de promoción: el banner cuadrado (obligatorio para publicar, así que
 * siempre existe), la etiqueta de oferta, el título, el precio y hasta cuándo
 * vale. Toda la tarjeta es el enlace.
 */
export default function PromocionCard({
  promocion,
  hoy,
  sizes,
  prioridad = false,
}: {
  promocion: PromocionPublica;
  /** Fecha civil de hoy: decide si la vigencia lleva año. */
  hoy: string;
  sizes: string;
  /** Visible al cargar: se pide de inmediato y con prioridad alta (como `HeroMedia`). */
  prioridad?: boolean;
}) {
  const banner = promocion.banners.CUADRADO ?? promocion.banners.VERTICAL ?? promocion.banners.HORIZONTAL;
  return (
    <Link
      href={`/promociones/${promocion.slug}`}
      className="group flex h-full flex-col border border-border bg-background transition-colors hover:border-primary"
    >
      <div className="relative aspect-square overflow-hidden bg-wash">
        {banner ? (
          <Image
            src={banner.url}
            alt={banner.alt}
            fill
            sizes={sizes}
            loading={prioridad ? "eager" : undefined}
            fetchPriority={prioridad ? "high" : undefined}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
          />
        ) : (
          <Tag aria-hidden="true" className="absolute inset-0 m-auto h-10 w-10 text-primary/30" strokeWidth={1.25} />
        )}
        {promocion.etiquetaOferta && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate bg-primary px-2.5 py-1 text-xs font-semibold text-white">
            {promocion.etiquetaOferta}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {promocion.especialidad && (
          <p className="label truncate leading-normal text-primary">{promocion.especialidad.nombre}</p>
        )}
        <h3 className="h3 mt-2 flex items-start justify-between gap-3">
          <span className="line-clamp-2 min-w-0 [overflow-wrap:anywhere]">{promocion.titulo}</span>
          <ArrowUpRight aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        </h3>
        {promocion.resumen && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{promocion.resumen}</p>
        )}
        <div className="mt-auto pt-5">
          <Precio promocion={promocion} />
          {promocion.vigenteHasta && (
            <p className="mt-1 text-xs text-muted-foreground">
              Válida hasta el {fechaCivil(promocion.vigenteHasta, hoy)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
