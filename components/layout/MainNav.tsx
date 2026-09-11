"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

/** Una ruta es la activa si coincide, o si la actual cuelga de ella. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Enlaces de la barra de escritorio.
 *
 * Es lo único de la cabecera que necesita saber en qué página estamos, así que
 * es lo único que se ejecuta en el navegador: el logotipo, el botón de reserva
 * y la estructura se resuelven en el servidor. Antes toda la cabecera —isotipo
 * SVG incluido— viajaba como JavaScript por leer aquí `usePathname`.
 */
export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="hidden items-center xl:flex">
      {siteConfig.navigation.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-h-11 items-center px-2.5 text-[13px] font-medium transition-colors duration-150 hover:bg-wash hover:text-primary",
              "after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:bg-primary after:transition-opacity after:duration-200",
              active
                ? "text-primary after:opacity-100"
                : "text-muted-foreground after:opacity-0"
            )}
          >
            {item.short}
          </Link>
        );
      })}
    </nav>
  );
}
