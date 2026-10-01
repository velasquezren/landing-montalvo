"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Acordeón sin caja.
 *
 * Cada pregunta era una tarjeta blanca con borde, sombra y 16px de radio; cinco
 * seguidas hacían más ruido que las propias preguntas. Ahora son filas
 * separadas por una línea, y el signo "+" gira hasta convertirse en "×".
 */

const Accordion = AccordionPrimitive.Root;

/* En React 19 `ref` es una propiedad más y llega dentro de `props`, así que
   `forwardRef` sobra (ver components/ui/button.tsx). */

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-border", className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-5 text-left text-[15px] font-medium transition-colors hover:text-primary sm:text-base",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <Plus
          aria-hidden="true"
          strokeWidth={1.5}
          className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform duration-300 ease-[var(--ease-out-expo)] group-data-[state=open]:rotate-[135deg]"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("measure pb-6 pr-10 text-[15px] leading-relaxed text-muted-foreground", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
