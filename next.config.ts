import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /** Cabecera `X-Powered-By`: informa de la pila a quien no le incumbe. */
  poweredByHeader: false,

  images: {
    /* AVIF primero: pesa entre un 20% y un 30% menos que WebP a igual calidad,
       y el navegador que no lo entienda recibe WebP por content negotiation. */
    formats: ["image/avif", "image/webp"],

    /* Los anchos por defecto de Next cubren hasta 3840px. Aquí la imagen más
       grande es media pantalla en un portátil, así que generar 2K y 4K solo
       alarga el build y llena la caché de variantes que nadie pide. */
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 128, 256, 384],

    /* Las fotos son archivos estáticos versionados por despliegue: no cambian
       bajo la misma URL. Un año de caché. */
    minimumCacheTTL: 31_536_000,
  },
};

export default nextConfig;
