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
const SheetTrigger = DialogPrimitive.Trigger;

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
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
      ref={ref}
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
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("h3", className)} {...props} />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

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
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
};
