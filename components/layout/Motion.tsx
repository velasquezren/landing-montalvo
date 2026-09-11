"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` hace que Motion respete la preferencia del sistema:
 * las reglas de globals.css solo alcanzan a las transiciones CSS, no a las
 * animaciones que corren en JavaScript.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
