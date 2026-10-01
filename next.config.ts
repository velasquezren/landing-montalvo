import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /** Cabecera `X-Powered-By`: informa de la pila a quien no le incumbe. */
  poweredByHeader: false,

  images: {
    /* AVIF primero: pesa entre un 20% y un 30% menos que WebP a igual calidad,
       y el navegador que no lo entienda recibe WebP por content negotiation. */
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],

    /* Los anchos por defecto de Next llegan a 3840px, que aquí no se usa nunca.
       El tope son 2560 por las cabeceras, que van a sangre: en una pantalla de
       1440 px a doble densidad el navegador pide 2880 y, con el tope en 1920,
       la fotografía se ampliaba y se veía blanda. 2560 cubre ese caso sin
       generar variantes de 4K que nadie pide. */
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [64, 128, 256, 384],

    /* Las fotos son archivos estáticos versionados por despliegue: no cambian
       bajo la misma URL. Un año de caché. */
    minimumCacheTTL: 31_536_000,
  },

  /**
   * Cabeceras de seguridad para todas las respuestas.
   *
   * Ninguna restringe los scripts ni los estilos, así que no pueden romper la
   * página: cierran lo que un sitio informativo no usa nunca.
   *
   * - `frame-ancestors 'none'`: nadie puede incrustar el sitio en un iframe
   *   para suplantarlo. (Sin X-Frame-Options: lo sustituye en todo navegador
   *   actual, y cada cabecera cuenta —ver más abajo—.)
   * - `nosniff`: el navegador no adivina tipos de archivo.
   * - Referrer-Policy: a sitios externos (WhatsApp, redes) solo llega el
   *   dominio, no la ruta que el paciente estaba viendo.
   * - Permissions-Policy: cámara, micrófono y ubicación desactivados.
   *
   * Sin HSTS: Vercel ya la envía en todos sus dominios. Duplicarla solo sumaba
   * bytes a la primera respuesta, que es la que más importa: la portada tiene
   * que caber en los ~14 KB del primer viaje de red, y medida con 1,3 KB de más
   * necesitaba un viaje extra (+170 ms en el primer pintado en móvil).
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
