import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { siteConfig } from "@/content/site";

/**
 * Una sola fuente en todo el sitio: la sans del tablero de marca. Es también
 * una petición menos y un archivo menos que descargar.
 *
 * Cuando llegue el logotipo definitivo con su tipografía, los titulares se
 * cambian desde `--font-display` en globals.css.
 */
const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  /* Next mide la fuente de respaldo y ajusta sus métricas a las de Montserrat,
     de modo que el texto no se recoloca cuando la definitiva termina de
     cargar. Declarar la pila explícitamente evita caer en la serif por defecto
     durante ese intervalo. */
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: "#006156",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://clinicamontalvo.net"),
  title: {
    default: "Clínica Montalvo | Atención médica integral en Santa Cruz",
    template: "%s | Clínica Montalvo",
  },
  description: siteConfig.description,
  keywords: [
    "Clínica Montalvo",
    "Santa Cruz de la Sierra",
    "Bolivia",
    "atención médica integral",
    "reproducción asistida",
    "fertilización in vitro",
    "fertilidad Santa Cruz",
    "maternidad Santa Cruz",
    "Plan Nacer",
    "laparoscopía 3D",
    "internación clínica",
    "emergencias 24 horas",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: "https://clinicamontalvo.net",
    siteName: siteConfig.name,
    title: "Clínica Montalvo | Atención médica integral",
    description:
      "Pioneros en reproducción asistida. Más de 30 especialidades, maternidad, internación y emergencias 24 horas en Santa Cruz de la Sierra.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clínica Montalvo",
    description:
      "Atención médica integral en Santa Cruz de la Sierra. Pioneros en reproducción asistida.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-BO" className={sans.variable}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xs focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>

        <Header />
        {/* La barra es fija: este relleno evita que cualquier página sin héroe
            quede por debajo. Los héroes lo compensan con un margen negativo. */}
        <main id="contenido" className="flex-1 pt-[var(--header-h)]">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
