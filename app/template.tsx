import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Next remonta la plantilla al cambiar de página y conserva el layout.
 *
 * Envolverla en `<ViewTransition>` hace que el relevo entre páginas lo anime el
 * propio navegador con la View Transitions API: toma una instantánea de lo que
 * hay, otra de lo que viene, y funde entre las dos. Antes era un fundido de
 * opacidad sobre el contenido nuevo (`.page-enter`), que arrancaba en 0,65 y
 * dejaba ver un salto; aquí las dos páginas se solapan y no hay salto.
 *
 * No pesa nada: la animación corre en el compositor y no hay ninguna librería
 * detrás. Y si el navegador no la soporta, la navegación funciona igual, sin
 * animar —el mismo criterio que el resto del movimiento del sitio—.
 *
 * Tiene que ir aquí y no en el layout: los layouts persisten entre
 * navegaciones, así que su entrada y su salida no llegan a dispararse nunca.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <ViewTransition>{children}</ViewTransition>;
}
