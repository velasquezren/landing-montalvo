"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import MobileNav from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { getAppointmentLink } from "@/lib/links";
import { cn } from "@/lib/utils";

/** Una referencia estable al recorrer páginas o leer su contenido. */
export default function Header() {
  const pathname = usePathname();
  const appointment = getAppointmentLink();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-border bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label={`${siteConfig.name} — Inicio`} className="shrink-0 rounded-xs py-1 transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <nav aria-label="Navegación principal" className="hidden items-center xl:flex">
          {siteConfig.navigation.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center px-2.5 text-[13px] font-medium transition-colors hover:bg-wash hover:text-primary after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:bg-primary after:transition-opacity",
                  active ? "text-primary after:opacity-100" : "text-muted-foreground after:opacity-0"
                )}
              >
                {item.short}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="sm" className="hidden min-h-11 sm:inline-flex">
            <a href={appointment.href} target={appointment.external ? "_blank" : undefined} rel={appointment.external ? "noopener noreferrer" : undefined}>
              Reservar cita
            </a>
          </Button>
          <MobileNav key={pathname} />
        </div>
      </div>
    </header>
  );
}
