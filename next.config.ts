import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /** Cabecera `X-Powered-By`: informa de la pila a quien no le incumbe. */
  poweredByHeader: false,

  images: {
    /* AVIF primero: pesa entre un 20% y un 30% menos que WebP a igual calidad,
       y el navegador que no lo entienda recibe WebP por content negotiation. */
    formats: ["image/avif", "image/webp"],

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
};

export default nextConfig;
