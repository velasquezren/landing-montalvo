import Link from "next/link";
import Logo from "@/components/brand/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/brand/SocialIcons";
import { siteConfig } from "@/content/site";
import { descriptor, positioning } from "@/content/institucional";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const socials = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
] as const;

/**
 * Pie de página en blanco.
 *
 * Antes era un bloque verde oscuro a sangre. Con la llamada a la acción también
 * en verde, la página terminaba en dos franjas de color seguidas. En blanco y
 * con hairlines el cierre es más ligero y el verde queda solo donde marca algo.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-labelledby="footer-heading"
      style={{ viewTransitionName: "site-footer" }}
      className="border-t border-border bg-background"
    >
      <h2 id="footer-heading" className="sr-only">
        Pie de página
      </h2>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo />
            <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground">
              {descriptor}.
              <br />
              {positioning}.
            </p>
          </div>

          <nav aria-label="Secciones del sitio" className="lg:col-span-3">
            <h3 className="label text-muted-foreground">Secciones</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="label text-muted-foreground">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={siteConfig.phoneTel}
                  className="transition-colors hover:text-primary"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(
                    "Hola, deseo comunicarme con Clínica Montalvo."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  WhatsApp {siteConfig.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-primary"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="pt-1 text-muted-foreground">
                {siteConfig.address.street && <>{siteConfig.address.street}<br /></>}
                {siteConfig.city}, {siteConfig.country}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="label text-muted-foreground">Horarios</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>{siteConfig.schedule}</li>
              <li className="font-medium text-primary">
                {siteConfig.emergencies}
              </li>
            </ul>

            <h3 className="label mt-8 text-muted-foreground">Redes</h3>
            <ul className="mt-4 flex items-center gap-1">
              {socials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={siteConfig.socialLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} de ${siteConfig.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xs text-muted-foreground transition-colors hover:bg-wash hover:text-primary"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}
          </p>
          <p>
            {siteConfig.city}, {siteConfig.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
