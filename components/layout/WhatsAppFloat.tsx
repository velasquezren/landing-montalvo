"use client";

import * as React from "react";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Acceso flotante a WhatsApp.
 *
 * Entra cuando el héroe ya ha quedado atrás, que es cuando hace falta, y es
 * solo un botón.
 *
 * Sigue el mismo criterio que el resto de botones: contorno y fondo blanco en
 * reposo, y el verde solo al pasar por encima. Lo que lo hace encontrable es la
 * posición y la sombra, no una mancha de color permanente en la esquina.
 *
 * No lleva el verde corporativo de WhatsApp: dos verdes distintos compitiendo
 * rompen la paleta, y el glifo ya identifica el canal.
 *
 * Cómo aparece: antes lo decidía `useScroll` de Motion, que ejecutaba una
 * comparación en cada fotograma de scroll mientras durase la visita. Ahora hay
 * un testigo de la altura del héroe y un IntersectionObserver: el navegador
 * avisa solo al cruzar el umbral, dos veces por visita en lugar de miles.
 */

/** Altura a partir de la cual el héroe se da por superado. */
const SHOW_AFTER = 420;

const HREF = buildWhatsAppUrl(
  "Hola Clínica Montalvo, quisiera realizar una consulta."
);

export default function WhatsAppFloat() {
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      // El atributo se conmuta directamente sobre el nodo, sin pasar por el
      // estado: es una marca puramente visual que React no vuelve a leer, así
      // que hacerla estado obligaría a renderizar el árbol para cambiar una
      // cadena que solo consulta el CSS. Así el componente renderiza una vez.
      linkRef.current?.toggleAttribute("data-visible", !entry.isIntersecting);
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sin ancestro posicionado, `absolute` se ancla al bloque contenedor
          inicial, es decir, al origen del documento: el testigo cubre siempre
          la franja superior de la página, mida lo que mida el contenido. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 w-px"
        style={{ height: SHOW_AFTER }}
      />

      <a
        ref={linkRef}
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribirnos por WhatsApp"
        className="float-action fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-xs border border-border-strong bg-background text-primary shadow-md hover:border-primary hover:bg-primary hover:text-white sm:bottom-7 sm:right-7"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </>
  );
}
