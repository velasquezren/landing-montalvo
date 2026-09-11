"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botones.
 *
 * Tres decisiones que los definen:
 *
 * 1. Rectos. 2px de radio en vez de 6: a este tamaño se leen como rectángulos,
 *    que es lo que pega con una página construida a base de líneas.
 * 2. Sin relleno de color en reposo. El botón es un contorno de 1px con el texto
 *    en negro; el verde aparece solo al pasar por encima. Antes cada llamada a
 *    la acción era un bloque verde sólido y la página se llenaba de manchas.
 * 3. Sin animación de pulsado. El `active:scale` daba un rebote de juguete;
 *    queda solo una transición de color, que es la que informa de algo.
 *
 * Sobre el verde de marca el reparto se invierte: ahí el blanco no es "color",
 * así que el botón principal sí va relleno.
 */
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xs font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Sobre blanco. Es el botón por defecto de todo el sitio. */
        default:
          "border border-border-strong bg-transparent text-foreground hover:border-primary hover:bg-wash hover:text-primary",
        /** Acción secundaria sobre blanco: sin caja. */
        ghost:
          "bg-transparent text-muted-foreground hover:bg-wash hover:text-primary",

        /** Sobre el verde de marca: relleno blanco para la acción principal. */
        inverse: "bg-white text-primary hover:bg-wash",
        /** Y contorno blanco para la secundaria. */
        inverseOutline:
          "border border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-primary",

        link: "h-auto p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
