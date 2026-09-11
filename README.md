# Clínica Montalvo — Portal Web Institucional & Corporativo

Portal web corporativo y comercial de **Clínica Montalvo S.R.L.** (Santa Cruz de la Sierra, Bolivia). Plataforma moderna de alta velocidad desarrollada para proyectar confianza, rigor médico, confort de internación (Suites Gold, Silver y Bronce), programa de maternidad (*Plan Nacer*), más de 30 especialidades y atención de emergencias 24 horas.

---

## 🚀 Stack Tecnológico

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) con compilación estática y Turbopack.
- **Librería UI**: [React 19](https://react.dev/).
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/).
- **Estilos y Tokens**: [Tailwind CSS v4](https://tailwindcss.com/) con tokens corporativos (`@theme` en `app/globals.css`).
- **Animaciones UI**: [Motion](https://motion.dev/) y animaciones reveal con CSS nativo (`animation-timeline`).
- **Componentes Accesibles**: [Radix UI](https://www.radix-ui.com/) (Accordion, Dialog/Sheet).
- **Galería y Carrusel**: [Embla Carousel](https://www.embla-carousel.com/) y [Yet Another React Lightbox](https://yet-another-react-lightbox.com/).
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Gestor de Paquetes**: [pnpm](https://pnpm.io/).

---

## 📁 Estructura del Proyecto

```text
├── app/
│   ├── (core)
│   │   ├── layout.tsx             # Root layout: metadata SEO, cabecera, pie y WhatsApp flotante
│   │   ├── page.tsx               # Portada: atención, recorridos por necesidad e internación
│   │   ├── template.tsx           # Transición CSS entre rutas
│   │   └── globals.css            # Tokens de color corporativos, tipografía y utilidades
│   ├── atencion-al-paciente/      # Guía de admisión, internación y preguntas frecuentes
│   ├── blog/                      # Artículos de salud, notas de prensa y guías médicas
│   ├── dr-montalvo/               # Trayectoria y legado del Dr. Montalvo
│   ├── especialidades/            # Catálogo interactivo de +30 especialidades médicas
│   ├── servicios/                 # Maternidad (Plan Nacer), Suites de internación y servicios 24h
│   ├── sobre-nosotros/            # Historia institucional, valores, tecnología y certificaciones
│   ├── staff-medico/              # Directorio de profesionales médicos por especialidad
│   ├── not-found.tsx              # Página de error 404 personalizada
│   ├── robots.ts                  # Configuración SEO robots
│   └── sitemap.ts                 # Generación dinámica del mapa de sitio
├── components/                    # Componentes UI modulares (header, footer, cards, sliders, etc.)
├── content/                       # Fuentes de datos estructuradas (especialidades, médicos, etc.)
├── lib/                           # Constantes, utilidades de clases (`cn`) y metadatos
├── public/                        # Fotografías optimizadas, isotipo y recursos estáticos
└── PROJECT_CONTEXT.md             # Documentación técnica integral para desarrollo
```

---

## 🎨 Paleta de Marca Corporativa

- **Primario (`#006156`)**: Verde oscuro de marca (titulares principales, acciones clave y acentos).
- **Acento (`#39ada3`)**: Verde claro complementario para contrastes suaves y badges.
- **Primario Oscuro (`#00453d`)**: Fondos profundos y estados hover interactivos.
- **Wash (`#f5fbfa`)**: Fondo suave al 5% para tarjetas y contenedores de lectura.
- **Suites de Internación**: Gold (`#b8893b`), Silver (`#8a96a3`), Bronce (`#a8693f`).

---

## 🛠️ Instalación y Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/velasquezren/landing-montalvo.git
   cd landing-montalvo
   ```

2. Instala las dependencias con `pnpm`:
   ```bash
   pnpm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. Compilación para producción:
   ```bash
   pnpm build
   pnpm start
   ```

---

## 📄 Licencia y Derechos

© 2026 Clínica Montalvo S.R.L. — Todos los derechos reservados.

