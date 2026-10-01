import type * as React from "react";
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
 * 2. El relleno verde es solo para la acción principal de cada bloque (`primary`).
 *    El resto son contornos de 1px con el texto en negro y el verde al pasar por
 *    encima. Con el héroe y la franja de cierre en claro, ese botón es la
 *    mancha de color de la pantalla: tiene que ser una y se tiene que ver.
 * 3. Sin animación de pulsado. El `active:scale` daba un rebote de juguete;
 *    queda solo una transición de color, que es la que informa de algo.
 */
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xs font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Acción principal: relleno de marca. Una por bloque. */
        primary:
          "border border-primary bg-primary text-white hover:border-primary-dark hover:bg-primary-dark",
        /** Secundaria. Es el botón por defecto de todo el sitio. */
        default:
          "border border-border-strong bg-transparent text-foreground hover:border-primary hover:bg-wash hover:text-primary",
        /** Acción terciaria: sin caja. */
        ghost:
          "bg-transparent text-muted-foreground hover:bg-wash hover:text-primary",

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
  extends React.ComponentPropsWithRef<"button">,
    VariantProps<typeof buttonVariants> {
  /** Presta los estilos al único hijo en lugar de dibujar un <button>. */
  asChild?: boolean;
}

/**
 * En React 19 `ref` es una propiedad más, así que `forwardRef` sobra: era una
 * envoltura por componente sin ninguna contrapartida.
 */
function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { Button, buttonVariants, type ButtonProps };
