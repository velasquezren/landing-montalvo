import Link from "next/link";
import Logo from "@/components/brand/Logo";
import MainNav from "@/components/layout/MainNav";
import MobileNav from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { getAppointmentLink } from "@/lib/links";

/**
 * Una referencia estable al recorrer páginas o leer su contenido.
 *
 * Es un componente de servidor. Solo las dos piezas que de verdad dependen del
 * navegador —los enlaces activos y el panel lateral— cruzan la frontera de
 * cliente, y lo hacen por su cuenta.
 */
export default function Header() {
  const appointment = getAppointmentLink();

  return (
    // El nombre de transición va en el propio <header> y nunca en una
    // envoltura. `view-transition-name` convierte al elemento en bloque
    // contenedor de sus descendientes `position: fixed` y le crea un contexto
    // de apilamiento: puesto en un <div> envolvente —que aquí mide 0 px de alto,
    // porque su único hijo está fuera de flujo— la cabecera quedaba atrapada en
    // ese contexto y <main>, que va después, se pintaba encima. La barra
    // desaparecía al navegar.
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-border bg-background"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — Inicio`}
          className="shrink-0 rounded-xs py-1 transition-opacity duration-150 hover:opacity-80"
        >
          <Logo />
        </Link>

        <MainNav />

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="sm" className="hidden min-h-11 sm:inline-flex">
            <a
              href={appointment.href}
              target={appointment.external ? "_blank" : undefined}
              rel={appointment.external ? "noopener noreferrer" : undefined}
            >
              Reservar cita
            </a>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
