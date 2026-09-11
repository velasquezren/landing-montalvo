import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

/**
 * Manifiesto de aplicación web.
 *
 * Next añade el `<link rel="manifest">` por convención de archivo. Sirve para
 * que, al añadir el sitio a la pantalla de inicio, el icono y el color sean los
 * de la clínica y no una captura de la página.
 *
 * `display: "browser"` a propósito: esto es un sitio informativo, no una
 * aplicación. Abrirlo sin barra de direcciones le quitaría al visitante la
 * posibilidad de ver dónde está y de compartir la página, que es justo lo que
 * se espera de un portal institucional.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline.replace(/\.$/, "")}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "es-BO",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#006156",
    categories: ["medical", "health"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // Android recorta el icono con la forma del sistema —círculo, cuadrado
        // redondeado, gota—. Esta variante va a sangre y con la marca dentro de
        // la zona segura, así que ningún recorte se la come.
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
