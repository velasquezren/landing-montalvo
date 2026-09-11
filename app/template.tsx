import type { ReactNode } from "react";

/** Next remonta la plantilla al cambiar de página y conserva el layout. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
