import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/content/site";

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Página no encontrada"
        subtitle="La dirección no existe o ha cambiado de sitio. Estas son las secciones disponibles."
        breadcrumbCurrent="Error 404"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <nav aria-label="Secciones del sitio" className="border-t border-border-strong">
            {siteConfig.navigation.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-baseline gap-4 border-b border-border py-5 transition-colors hover:text-primary"
              >
                <span className="label w-6 shrink-0 text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-medium">{item.label}</span>
                <span
                  aria-hidden="true"
                  className="text-muted-foreground transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-primary"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>
        </Reveal>
      </section>
    </>
  );
}
