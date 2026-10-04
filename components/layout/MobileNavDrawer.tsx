"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
} from "@/components/ui/sheet";
import Logo from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { isActivePath } from "@/components/layout/MainNav";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getAppointmentLink } from "@/lib/links";
import { cn } from "@/lib/utils";
import NavigationHint from "@/components/layout/NavigationHint";
import { warmRouteImage } from "@/lib/route-images";

const appointment = getAppointmentLink();
const whatsappHref = buildWhatsAppUrl("Hola, deseo realizar una consulta.");

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Panel de navegación.
 *
 * La entrada escalonada de los enlaces la lleva `.stagger-item` en CSS. Antes
 * era un `motion.div` por enlace: ocho suscriptores de animación montándose
 * justo cuando el hilo principal está ocupado abriendo el panel, que es el peor
 * momento posible para pedirle trabajo.
 *
 * Vive en su propio módulo para poder cargarse aparte: aquí dentro está todo
 * Radix Dialog, y es la única razón por la que una página de solo texto tendría
 * que descargar y ejecutar un sistema de diálogos. Quién lo carga y cuándo, en
 * `MobileNav.tsx`.
 *
 * El disparador no es un `SheetTrigger`, sino el botón que queda en la
 * cabecera; onCloseAutoFocus lo devuelve explícitamente a ese botón sin
 * desplazar la página, también cuando el diálogo se cargó bajo demanda.
 */
export default function MobileNavDrawer({ open, onOpenChange, triggerRef }: MobileNavDrawerProps) {
  const pathname = usePathname();

  // Al navegar, el panel se cierra. Los enlaces ya lo cierran al pulsarlos;
  // esto cubre lo demás (atrás/adelante del navegador, saltos programáticos).
  // Antes se resolvía remontando el componente entero con `key={pathname}`
  // desde la cabecera, que tiraba y reconstruía el diálogo en cada página.
  //
  // Solo cuando la ruta cambia, no al montarse: si el primer toque llegaba
  // antes de que terminara la precarga, el panel se montaba ya abierto y este
  // efecto lo cerraba en el mismo instante. El menú no respondía al primer
  // toque en un teléfono ocupado, reproducido bloqueando `requestIdleCallback`.
  const routeAtMount = React.useRef(pathname);
  React.useEffect(() => {
    if (routeAtMount.current === pathname) return;
    routeAtMount.current = pathname;
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        aria-describedby="mobile-nav-desc"
        onCloseAutoFocus={event => {
          event.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Logo />
          <SheetCloseButton />
        </div>

        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <SheetDescription id="mobile-nav-desc" className="sr-only">
          Secciones del sitio y datos de contacto de {siteConfig.name}.
        </SheetDescription>

        <nav aria-label="Navegación móvil" className="flex-1 overflow-y-auto px-5 py-2">
          {siteConfig.navigation.map((item, i) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onPointerDown={() => warmRouteImage(item.href)}
                onFocus={() => warmRouteImage(item.href)}
                onNavigate={() => onOpenChange(false)}
                aria-current={active ? "page" : undefined}
                style={{ "--i": i } as React.CSSProperties}
                className={cn(
                  "stagger-item relative flex items-baseline gap-3 border-b border-border py-4 transition-colors duration-150",
                  active ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                <span
                  className={cn(
                    "label w-5 shrink-0",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[17px] font-medium tracking-[-0.01em]">
                  {item.label}
                </span>
                <NavigationHint />
              </Link>
            );
          })}
        </nav>

        <div
          style={{ "--i": siteConfig.navigation.length } as React.CSSProperties}
          className="stagger-item border-t border-border px-5 py-5"
        >
          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="md">
              <Link
                href={appointment.href}
                onNavigate={() => onOpenChange(false)}
                target={appointment.external ? "_blank" : undefined}
                rel={appointment.external ? "noopener noreferrer" : undefined}
              >
                Reservar cita
              </Link>
            </Button>
            <Button asChild size="md">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                WhatsApp
              </a>
            </Button>
          </div>

          <dl className="mt-5 space-y-2.5 text-[13px]">
            <div className="flex items-center gap-2.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
              <dt className="sr-only">Teléfono</dt>
              <dd>
                <a href={siteConfig.phoneTel} className="font-medium hover:text-primary">
                  {siteConfig.phone}
                </a>
              </dd>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
              <dt className="sr-only">Horario</dt>
              <dd>
                {siteConfig.schedule} · {siteConfig.emergencies}
              </dd>
            </div>
          </dl>
        </div>
      </SheetContent>
    </Sheet>
  );
}
