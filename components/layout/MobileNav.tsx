"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";

/**
 * Disparador del menú móvil.
 *
 * El panel en sí —y con él Radix Dialog entero: portal, trampa de foco,
 * bloqueo de scroll— está en un módulo aparte que no entra en el paquete
 * inicial. Eran 43 KB de JavaScript que toda página descargaba, analizaba e
 * hidrataba por un botón que en la mayoría de las visitas nadie llega a pulsar,
 * y que en páginas de solo texto era lo único que hidrataba.
 *
 * El módulo se pide en el primer hueco libre del hilo principal, ya pintada y
 * utilizable la página. Para cuando alguien toca el botón, hace rato que está
 * en memoria: el panel abre sin esperar a la red.
 */
const loadDrawer = () => import("@/components/layout/MobileNavDrawer");
const MobileNavDrawer = dynamic(loadDrawer);

export default function MobileNav() {
  /** Cierto desde que el panel se ha montado una vez. No vuelve a ser falso:
   *  desmontarlo al cerrar se saltaría su animación de salida. */
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const schedule =
      window.requestIdleCallback ??
      ((callback: IdleRequestCallback) => window.setTimeout(callback, 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;

    const handle = schedule(() => {
      void loadDrawer().then(() => setMounted(true));
    });
    return () => cancel(handle);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xs text-foreground transition-colors duration-150 hover:bg-wash hover:text-primary xl:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {mounted && <MobileNavDrawer open={open} onOpenChange={setOpen} />}
    </>
  );
}
