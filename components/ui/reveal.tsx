import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Primitivas de entrada, en CSS puro.
 *
 * Por qué no van con Motion: `whileInView` renderiza el estado inicial como
 * estilo en línea, así que el HTML del servidor sale con `opacity: 0` y el
 * contenido no aparece hasta que hidrata. En una página cuyo cuerpo entero es
 * un solo bloque eso es media pantalla en blanco mientras carga el JavaScript,
 * y una pantalla entera en blanco si el JavaScript falla.
 *
 * Con `animation-timeline: view()` la animación la lleva el propio scroll: sin
 * JavaScript, sin estado inicial en línea y —lo importante— si el navegador no
 * soporta la regla simplemente no anima y el contenido sale visible. El peor
 * caso es "sin animación", nunca "sin contenido".
 *
 * Como son componentes de servidor, las secciones que solo usaban esto han
 * dejado de enviar JavaScript al navegador.
 */

/** `--step` escalona elementos hermanos retrasando el inicio de su tramo. */
function stepStyle(step?: number): CSSProperties | undefined {
  return step ? ({ "--step": step } as CSSProperties) : undefined;
}

interface RevealProps {
  children: ReactNode;
  /** Posición en un grupo escalonado. 0 o sin valor entra primero. */
  step?: number;
  className?: string;
}

export function Reveal({ children, step, className }: RevealProps) {
  return (
    <div className={cn("reveal", className)} style={stepStyle(step)}>
      {children}
    </div>
  );
}
