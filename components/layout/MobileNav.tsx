"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Menu, Phone, MessageCircle, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getAppointmentLink } from "@/lib/links";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  /** La barra está sobre el héroe oscuro, así que el disparador va en blanco. */
  light?: boolean;
}

export default function MobileNav({ light = false }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const appointment = getAppointmentLink();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir menú"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-xs transition-colors duration-150 xl:hidden",
            light
              ? "text-white hover:bg-white/10"
              : "text-foreground hover:bg-wash hover:text-primary"
          )}
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </SheetTrigger>

      <SheetContent aria-describedby="mobile-nav-desc">
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
            const active =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.015, ease: EASE_OUT }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-3 border-b border-border py-4 transition-colors",
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
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
          className="border-t border-border px-5 py-5"
        >
          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="md">
              <a
                href={appointment.href}
                target={appointment.external ? "_blank" : undefined}
                rel={appointment.external ? "noopener noreferrer" : undefined}
              >
                Reservar cita
              </a>
            </Button>
            <Button asChild size="md">
              <a
                href={buildWhatsAppUrl("Hola, deseo realizar una consulta.")}
                target="_blank"
                rel="noopener noreferrer"
              >
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
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
