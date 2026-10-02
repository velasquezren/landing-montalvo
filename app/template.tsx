import { ViewTransition } from "react";
import type { ReactNode } from "react";

/** Una sola captura por página; Next conserva el scroll de atrás/adelante.
 * Sin el div, React captura cada sección por separado. Los estilos de `root`
 * no las controlan y las secciones salientes pueden tapar la cabecera.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition default="none" enter="route-enter" exit="route-exit">
      <div className="route-page bg-background">{children}</div>
    </ViewTransition>
  );
}
