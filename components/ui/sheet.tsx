"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Panel lateral sobre Radix Dialog.
 *
 * Las clases anteriores (`animate-in`, `slide-in-from-right`, `fade-out-0`)
 * pertenecen al plugin tailwindcss-animate, que no está instalado: el panel
 * aparecía de golpe. Aquí se usan fotogramas propios definidos en globals.css,
 * que Radix sí espera a que terminen antes de desmontar.
 */

const Sheet = DialogPrimitive.Root;

/* En React 19 `ref` es una propiedad más y llega dentro de `props`, así que
   `forwardRef` sobra (ver components/ui/button.tsx). */

function SheetContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          // Sin `backdrop-blur`: el velo aparece a la vez que el panel entra
          // deslizándose, así que desenfocar obliga a recomponer la pantalla
          // entera durante toda la animación. Es la causa habitual de que un
          // cajón lateral se abra a trompicones en un teléfono de gama media.
          "fixed inset-0 z-50 bg-primary-dark/50",
          "data-[state=open]:animate-[overlay-in_0.3s_var(--ease-smooth)]",
          "data-[state=closed]:animate-[overlay-in_0.2s_var(--ease-smooth)_reverse]"
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-[min(88vw,26rem)] flex-col bg-background",
          "border-l border-border shadow-lg",
          "data-[state=open]:animate-[sheet-in_0.45s_var(--ease-out-expo)]",
          "data-[state=closed]:animate-[sheet-out_0.3s_var(--ease-smooth)]",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("h3", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function SheetCloseButton({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-xs text-muted-foreground transition-colors hover:bg-wash hover:text-primary",
        className
      )}
    >
      <X className="h-5 w-5" strokeWidth={1.75} />
      <span className="sr-only">Cerrar menú</span>
    </DialogPrimitive.Close>
  );
}

export {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
};
