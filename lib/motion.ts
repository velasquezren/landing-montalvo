import type { Transition } from "motion/react";

/**
 * Vocabulario de movimiento del sitio.
 *
 * Es corto a propósito. Las entradas por scroll ya no viven aquí: se resuelven
 * en CSS (ver `.reveal` en globals.css) para no depender de la hidratación.
 * Lo que queda en Motion es lo que CSS no sabe hacer: transiciones entre
 * estados con recorrido, indicadores que se desplazan entre elementos y
 * elementos que entran y salen del árbol.
 */

/** Expo-out: arranca rápido y frena largo. Para entradas. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Curva estándar. Para cambios de estado (hover, activo, abierto). */
export const EASE_SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Indicadores que se desplazan entre posiciones (nav activo, pestañas). */
export const slide: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 38,
  mass: 0.8,
};
