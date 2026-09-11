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
    // `sticky` y no `fixed`, y esa diferencia no es de estilo.
    //
    // Un elemento `fixed` no entra en la instantánea que la View Transitions
    // API toma del documento, así que la capa de transición lo tapaba: la
    // franja de la barra se veía verde en cada navegación. La forma de
    // esquivarlo era darle `view-transition-name`, pero entonces se sustituye
    // por una instantánea, deja de dibujarse y deja de recibir clics: 300 ms
    // muertos en cada navegación, medidos.
    //
    // `sticky` participa del flujo, así que entra en la instantánea y transita
    // con la página. Sin nombre, sin taparse y sin dejar de responder: la
    // ventana muerta baja de 300 ms a 20 ms. El comportamiento visible es el
    // mismo, y `<main>` ya no necesita compensar con relleno superior.
    <header className="sticky top-0 z-50 h-[var(--header-h)] border-b border-border bg-background">
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
