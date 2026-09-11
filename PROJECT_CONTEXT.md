# Contexto del Proyecto — Clínica Montalvo

> **Documento de persistencia y contexto integral.**  
> Diseñado para que cualquier desarrollador o agente de IA comprenda la arquitectura, el diseño, los componentes y el estado de la aplicación sin tener que inspeccionar los archivos uno por uno.

---

## 1. Ficha del Proyecto y Visión General

* **Cliente / Institución**: Clínica Montalvo S.R.L.
* **Ubicación**: Santa Cruz de la Sierra, Bolivia.
* **Descriptor institucional**: *"Atención médica integral."*
* **Posicionamiento clave**: Pioneros en reproducción asistida en Bolivia (+2.400 casos de bebés nacidos).
* **Propósito del sitio web**: Portal web institucional y comercial de alta calidad que proyecta confianza, rigor médico y confort de vanguardia. Destaca su programa de maternidad (*Plan Nacer*), la internación en suites privadas de alta gama (Gold, Silver, Bronce), sus más de 30 especialidades y su servicio de emergencias 24 horas.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión | Propósito / Particularidades |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 16.3.4 | Compilación estática con Turbopack. `export const dynamic = "force-static"` en páginas clave. |
| **Librería UI** | React | 19.2.8 | Con soporte completo para Server Components y Client Components optimizados. |
| **Tipado** | TypeScript | 5.x | Tipado estricto en datos de contenido y componentes. |
| **Estilos** | Tailwind CSS | 4.x (`@tailwindcss/postcss`) | Sintaxis moderna con directivas `@theme` en `app/globals.css`. |
| **Animaciones UI** | Motion | 13.2.0 | Para transiciones de estado, tabs con `layoutId`, drawers y transiciones entre suites. |
| **Animaciones Scroll** | CSS Nativo | N/A | `animation-timeline: view()` y `@supports` para animaciones reveal en scroll sin peso JS. |
| **Primitivas UI** | Radix UI | 1.x | Acordeones accesibles (`@radix-ui/react-accordion`) y Sheet/Dialog (`@radix-ui/react-dialog`). |
| **Galería / Carrusel** | Embla Carousel & Lightbox | 8.6 / 3.32 | `embla-carousel-react` en móviles y `yet-another-react-lightbox` para zoom fotográfico. |
| **Iconos** | Lucide React | 1.43 | Iconografía médica y utilitaria coherente de 1.5 a 1.75 stroke. |
| **Gestor Paquetes**| pnpm | 11.24 | Configuración rápida con `pnpm-workspace.yaml`. |

---

## 3. Sistema de Diseño y Tokens (`app/globals.css`)

Basado estrictamente en el tablero de marca corporativo (`colorimetria.jpeg`):

### Paleta de Colores
* **`--color-primary` (`#006156`)**: Verde oscuro de marca. Utilizado en elementos de acción principal, héroes de página, bordes activos y titulares destacados.
* **`--color-accent` (`#39ada3`)**: Verde claro corporativo. Se usa exclusivamente para acentos visuales y fondos suaves, nunca para texto sobre blanco (por restricción de contraste WCAG 2.7:1).
* **`--color-primary-dark` (`#00453d`)**: Variante oscura para estados hover, pulsados y velos sobre fotografía.
* **`--color-wash` (`#f5fbfa`)**: Tinte verde al 5% para fondos de tarjetas, estados hover sutiles y contenedores de imágenes.
* **`--color-background` (`#ffffff`)** / **`--color-foreground` (`#111111`)**: Superficie blanca limpia y texto casi negro de alto contraste.
* **`--color-muted-foreground` (`#5a6664`)**: Texto secundario que garantiza ratio accesible > 5.9:1.
* **`--color-border` (`#e8efee`)** y **`--color-border-strong` (`#d5e1df`)**: Hairlines calculadas mezclando verde oscuro sobre blanco para no ensuciar la interfaz con grises neutros.
* **Badges de Suites**: Gold (`#b8893b`), Silver (`#8a96a3`), Bronce (`#a8693f`).

### Tipografía
* **Familia única**: `Montserrat` (Google Fonts) configurada como variable `--font-montserrat`.
* **Tokens**:
  * `--font-display`: Para titulares grandes y números de impacto.
  * `--font-sans`: Para lectura, UI y textos generales.

### Comportamiento de Scroll y Cabecera
* Variables CSS dinámicas:
  * `--header-h`: Alto de la barra (60px móvil, 76px desktop en `>=1024px`).
  * `--header-bottom`: Igual a `--header-h`; las pestañas de habitaciones quedan debajo de la cabecera persistente.

---

## 4. Estructura de Rutas y Páginas (`app/`)

```
app/
├── (core)
│   ├── layout.tsx             # Root layout: Montserrat, SEO metadata, Skip-to-content, Header, Footer, WhatsAppFloat
│   ├── page.tsx               # Portada: atención, recorridos por necesidad y vista de internación
│   ├── template.tsx           # Entrada CSS de 180 ms al navegar; respeta movimiento reducido
│   ├── globals.css            # Tokens Tailwind v4, animaciones CSS scroll-timeline, estilos base
│   ├── not-found.tsx          # Página 404 estilizada con listado de rutas disponibles
│   ├── robots.ts              # Reglas de indexación SEO
│   └── sitemap.ts             # Sitemap XML dinámico
├── servicios/
│   └── page.tsx               # Página estrella: Hero, Grid de Servicios, Sección Habitaciones, FAQs y CTA
├── especialidades/
│   └── page.tsx               # Tratamientos de fertilidad y consulta a otras especialidades
├── dr-montalvo/
│   └── page.tsx               # Ficha del Dr. Juan Carlos Montalvo y su hito científico (Dispositivo BATTS)
├── sobre-nosotros/
│   └── page.tsx               # Historia, cifras institucionales, tecnología, valores y aseguradoras
├── atencion-al-paciente/
│   └── page.tsx               # Horarios, emergencias, citas, programa Plan Nacer y convenios
├── staff-medico/
│   └── page.tsx               # Placeholder informativo elegante esperando directorio médico
└── blog/
    └── page.tsx               # Placeholder informativo elegante esperando artículos médicos
```

---

## 5. Catálogo Completo de Componentes (`components/`)

### Brand (`components/brand/`)
* **`Logo.tsx`**: Renderiza el isotipo oficial vectorizado en línea junto con la tipografía "CLÍNICA MONTALVO". Acepta la propiedad `tone="color"` (para fondo blanco) o `tone="light"` (para fondos verdes oscuros o héroes).
* **`SocialIcons.tsx`**: SVGs limpios y accesibles para Facebook, Instagram, TikTok, YouTube y WhatsApp.

### Layout (`components/layout/`)
* **`Header.tsx`**: Barra fija blanca con Inicio explícito, ruta activa accesible y reserva de cita. Mantiene posición y contraste al cambiar de página. Menú completo desde 1280px; drawer por debajo para evitar solapamientos. El logotipo enlaza a la portada real.
* **`Footer.tsx`**: Pie de página institucional sobre fondo blanco con hairlines de 1px. Contiene el logotipo, enlaces a todas las páginas, datos de contacto, horarios y derechos.
* **`MobileNav.tsx`**: Drawer lateral basado en Radix Dialog/Sheet. Ofrece navegación escalonada con Motion, botones rápidos para reservar cita o abrir chat de WhatsApp y datos de guardia.
* **`Motion.tsx`**: `MotionConfig` con soporte automático para usuarios con preferencia de movimiento reducido (`reducedMotion="user"`).
* **`WhatsAppFloat.tsx`**: Botón flotante accesible de WhatsApp. Aparece suavemente solo cuando el usuario pasa la zona del héroe (`>420px`).

### Secciones (`components/sections/`)
* **`PageHero.tsx`**: Encabezado visual de página de renderizado del lado servidor (RSC). Soporta fotografía editorial configurable o textura de marca, migas de pan y metadatos al pie. Mantiene alturas equivalentes con y sin imagen; el texto aparece sin retrasos individuales.
* **`HeroBackdrop.tsx`**: Componente de servidor con Next Image y un velo de contraste constante, sin paralaje ni JavaScript de scroll.
* **`ServicesGrid.tsx`**: Grilla de 4 columnas en desktop con hairlines perimetrales de 1px. No usa `overflow: hidden` para permitir animaciones CSS scroll nativas escalonadas mediante `--step`.
* **`RoomsSection.tsx`**: Bloque interactivo de internación:
  * Maneja el estado de la suite activa (`gold`, `silver`, `bronce`).
  * Se sincroniza automáticamente con el hash de la URL (`#gold`, `#silver`, `#bronce`).
  * Contiene las pestañas fijas (`RoomTabs`), el panel detallado (`RoomPanel`) y la comparativa (`RoomsComparison`).
* **`RoomTabs.tsx`**: Selector de habitaciones pegajoso (`sticky top-[var(--header-bottom)]`). Subrayado animado con `layoutId="room-tab-underline"` y navegación completa con flechas de teclado.
* **`RoomPanel.tsx`**: Muestra la información de la suite seleccionada (mote de categoría, titular, descripción, puntos destacados, especificaciones de m² o acompañantes si existen, botón a WhatsApp preconfigurado con el nombre de la suite y amenidades).
* **`RoomGallery.tsx`**: Galería fotográfica inteligente:
  * En desktop: Mosaico asimétrico (1 imagen principal dominante + 2 secundarias con indicador `+N fotos más`).
  * En móvil: Carrusel táctil con `Carousel` (Embla).
  * Al hacer clic: Abre el visor a pantalla completa con `yet-another-react-lightbox`.
* **`RoomAmenities.tsx`**: Lista en grilla de las prestaciones incluidas en la suite activa, con iconos Lucide específicos.
* **`RoomsComparison.tsx`**: Tabla comparativa con las 15 amenidades para Gold, Silver y Bronce. Al pulsar sobre la cabecera de una suite, cambia activamente el panel principal.
* **`InternacionFaq.tsx`**: Acordeón Radix desplegable con preguntas frecuentes de internación y llamada lateral a admisiones.
* **`CtaBand.tsx`**: Franja de cierre de página en verde oscuro con titular personalizable, botón directo a WhatsApp y enlace de llamada telefónica.
* **`SectionHeader.tsx`**: Encabezado estándar con numeración de sección (`01`, `02`), antetítulo en mayúsculas (`label`), titular y descripción.
* **`TierDot.tsx`**: Punto coloreado que distingue visualmente las categorías Gold, Silver y Bronce.
* **`PagePlaceholder.tsx`**: Plantilla para secciones pendientes (`/staff-medico`, `/blog`), explicando qué contenido está en preparación y ofreciendo vías de contacto alternativas para no perder al visitante.

### UI Primitivas (`components/ui/`)
* **`button.tsx`**: Botón polimórfico (`asChild` vía `@radix-ui/react-slot`) con variantes (`default`, `inverse`, `inverseOutline`, `ghost`) y tamaños calibrados.
* **`reveal.tsx`**: 
  * `Reveal`: Envoltura que aplica clases CSS de revelado por scroll sin Javascript.
* **`accordion.tsx`**: Implementación accesible de Radix Accordion con transiciones de apertura y cierre por CSS keyframes.
* **`sheet.tsx`**: Modal tipo panel lateral deslizante (Drawer).
* **`carousel.tsx`**: Envoltorio declarativo para Embla Carousel adaptado a React 19.

---

## 6. Capa de Contenido Desacoplada (`content/`)

* **[site.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/content/site.ts)**: Configuración global del sitio (nombre, razón social, teléfonos, WhatsApp limpio y formateado, email, horarios de atención, enlaces a redes sociales y menú de navegación).
* **[institucional.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/content/institucional.ts)**:
  * Separa estrictamente la información en tres estados: `VERIFICADO` (literal de la web previa), `REDACTADO` (síntesis editorial) y `PENDIENTE` (esperando visto bueno de Dirección).
  * Contiene datos de fertilidad, valores corporativos, seguros médicos asociados (Alianza, Bisa, Bupa, Univida), programa de maternidad y datos del Dr. Montalvo.
* **[rooms.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/content/rooms.ts)**: Especificación tipada de las suites Gold, Silver y Bronce, textos descriptivos, listas de fotos en `/images/habitaciones/` y asignación de amenidades.
* **[amenities.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/content/amenities.ts)**: Diccionario de 15 comodidades con sus etiquetas y nombres de iconos Lucide asociados.
* **[services.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/content/services.ts)**: Listado de 8 áreas clínicas con sus iconos y enlaces válidos (evita enlazar anclas inexistentes).
* **[faq.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/content/faq.ts)**: Preguntas frecuentes de internación preparadas con textos guía para validación clínica.

---

## 7. Módulos Auxiliares (`lib/`)

* **[links.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/lib/links.ts)**: Lógica defensiva para el botón "Reservar cita". Si `siteConfig.appointmentUrl` aún no tiene una URL externa válida, redirige automáticamente a WhatsApp solicitando cita.
* **[whatsapp.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/lib/whatsapp.ts)**: Generador centralizado de URLs `wa.me/59175031306` con mensajes contextuales predefinidos (general, por habitación o por especialidad).
* **[motion.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/lib/motion.ts)**: Curvas de animación unificadas (`EASE_OUT`, `EASE_SMOOTH`, `slide` tipo spring).
* **[utils.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/lib/utils.ts)**: Combinador de clases CSS `cn()` con `clsx` y `tailwind-merge`.

---

## 8. Recursos Estáticos (`public/`)

* `/images/logo/isotipo.svg`: Isotipo vectorial original de Clínica Montalvo.
* `/images/servicios/hero.webp`: Maqueta de referencia; no publicar como fotografía.
* `/images/habitaciones/gold/`: 7 maquetas en WebP de la suite Gold.
* `/images/habitaciones/silver/`: 4 maquetas en WebP de la suite Silver.
* `/images/habitaciones/bronce/`: 6 maquetas en WebP de la suite Bronce.

---

## 9. Inventario de Pendientes (`[COMPLETAR]`)

Para cuando el cliente suministre material definitivo:

1. **Ubicación física**:
   * En `content/site.ts:21`: Añadir dirección exacta de calle y zona en Santa Cruz.
2. **URL de citas médicas**:
   * En `content/site.ts:32` o variable de entorno `NEXT_PUBLIC_APPOINTMENT_URL`: URL del sistema de reservas médicas online.
3. **Ficha del Dr. Juan Carlos Montalvo**:
   * En `content/institucional.ts:81`: Completar cargo formal, matrícula médica, reseña biográfica y fotografía en `public/images/`.
4. **Misión y Visión**:
   * En `content/institucional.ts:130`: Redactar misión y visión cuando sean aprobadas formalmente por Dirección (actualmente no se imprimen para no inventar información).
5. **Directorio del Staff Médico**:
   * En `app/staff-medico/page.tsx`: Crear la lista o tarjetas de los 80 especialistas cuando se tengan sus nombres, especialidades, fotos y horarios.
6. **Preguntas Frecuentes de Internación**:
   * En `content/faq.ts`: Completar respuestas definitivas sobre visitas nocturnas, qué artículos llevar el día del parto y requisitos de internación.
7. **Especialidades Médicas Restantes**:
   * En `app/especialidades/page.tsx`: Listar las restantes áreas clínicas además de reproducción asistida.
8. **Blog Institucional**:
   * En `app/blog/page.tsx`: Cargar primeros artículos y autores médicos.
9. **Portada Principal (`/`)**:
   * Implementada en `/`: presentación, tres accesos por necesidad e internación. Pendiente de fotografías reales; los espacios editoriales están preparados.

---

## 10. Comandos Habituales

* Iniciar servidor de desarrollo: `pnpm dev`
* Compilar a producción: `pnpm build`
* Iniciar servidor de producción: `pnpm start`
* Ejecutar linter: `pnpm lint`


## 11. Revisión de navegación y fotografía — 10 de septiembre de 2026

* Inicio devuelve una página propia con canonical `/` e inclusión en sitemap. Accesos a especialidades, habitaciones y atención al paciente.
* Navegación nativa con Next Link y su gestión de historial, foco y scroll. CSS `scroll-behavior: auto` evita arrastrar visualmente el desplazamiento de la página anterior. Se mantiene `scroll-padding-top` para anclas y cabecera fija.
* `app/template.tsx` aplica una entrada de opacidad de 180 ms, sin transformar contenedores ni retrasar navegación. Desactivada con `prefers-reduced-motion`.
* `content/images.ts`: fuente tipada para imagen, texto alternativo y posición de encuadre de portada, internación y cabeceras. `src: null` conserva la cabecera de marca sin peticiones rotas.
* `EditorialPhoto.tsx`: imágenes editoriales con proporciones reservadas y tamaños adaptables. Guía de entrega y encuadres: `public/images/README.md`.
* Se reemplazaron los textos sobre edificio y guardia como argumento principal por una descripción centrada en las necesidades del paciente. Emergencias permanece como dato práctico de contacto.
* Notas `[COMPLETAR]` no se muestran en la interfaz. Datos aún no confirmados siguen pendientes en este documento y en contenido; preguntas de internación pendientes ofrecen una consulta contextual a admisiones.
* No se añadieron dependencias de producción.

Referencias de implementación: documentación local de Next 16.3.4 (`template`, navegación, `Image`); https://nextjs.org/docs/app/getting-started/linking-and-navigating y https://www.w3.org/WAI/WCAG21/Techniques/css/C39.html.

* Inspección visual de los WebP: contienen instrucciones de producción, no fotos. Quedan fuera de la interfaz y metadatos sociales. `images: []` en las suites muestra un panel de marca y activa automáticamente la galería al cargar fotografías reales.
