"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EASE_OUT } from "@/lib/motion";

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
 */
const SHOW_AFTER = 420;

export default function WhatsAppFloat() {
  const [visible, setVisible] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > SHOW_AFTER));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          href={buildWhatsAppUrl(
            "Hola Clínica Montalvo, quisiera realizar una consulta."
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribirnos por WhatsApp"
          className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-xs border border-border-strong bg-background text-primary shadow-md transition-colors duration-150 hover:border-primary hover:bg-primary hover:text-white sm:bottom-7 sm:right-7"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
