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
| **Animaciones** | CSS nativo | N/A | **No hay librería de animación.** Fotogramas y transiciones en `app/globals.css`: entradas al montar, paneles, subrayado deslizante y botón flotante. Corren en el hilo de composición y no esperan a la hidratación. |
| **Animaciones Scroll** | CSS Nativo | N/A | `animation-timeline: view()` y `@supports` para animaciones reveal en scroll sin peso JS. |
| **Primitivas UI** | Radix UI | 1.x | Acordeones accesibles (`@radix-ui/react-accordion`) y Sheet/Dialog (`@radix-ui/react-dialog`, en carga diferida). |
| **Galería / Carrusel** | Anclaje de scroll nativo & Lightbox | N/A / 3.32 | Carrusel por `scroll-snap` en CSS, sin librería. `yet-another-react-lightbox` para zoom fotográfico, cargado bajo demanda. |
| **Iconos** | Lucide React | 1.43 | Iconografía médica y utilitaria coherente de 1.5 a 1.75 stroke. |
| **Gestor Paquetes**| pnpm | 11.24 | Configuración rápida con `pnpm-workspace.yaml`. |

---

## 3. Sistema de Diseño y Tokens (`app/globals.css`)

Basado estrictamente en el tablero de marca corporativo (`colorimetria.jpeg`):

### Paleta de Colores
* **`--color-primary` (`#006156`)**: Verde oscuro de marca. Utilizado en el botón de acción principal, etiquetas, bordes activos y palabras destacadas de un titular. Ya no se usa como bloque de fondo (§23).
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
│   ├── template.tsx           # Una captura por ruta: fundido de 160 ms, cabecera estable (§28)
│   ├── globals.css            # Tokens Tailwind v4, animaciones CSS scroll-timeline, estilos base
│   ├── not-found.tsx          # Página 404 estilizada con listado de rutas disponibles
│   ├── robots.ts              # Reglas de indexación SEO
│   ├── sitemap.ts             # Sitemap XML dinámico
│   ├── manifest.ts            # Manifiesto de aplicación web
│   ├── favicon.ico            # 16/32/48/64, cada tamaño con su propio dibujo
│   ├── icon.svg               # Icono de pestaña, vectorial
│   └── apple-icon.png         # 180px, a sangre y opaco (iOS recorta él)
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
* **`Rings.tsx`**: Tres circunferencias concéntricas, eco del isotipo. Única decoración de las superficies claras.
* **`SocialIcons.tsx`**: SVGs limpios y accesibles para Facebook, Instagram, TikTok, YouTube y WhatsApp.

### Layout (`components/layout/`)
* **`Header.tsx`**: **Componente de servidor.** Barra fija blanca con logotipo, navegación y reserva de cita. Menú completo desde 1280px; drawer por debajo. Solo delega en cliente las dos piezas que lo necesitan (`MainNav`, `MobileNav`).
* **`MainNav.tsx`**: Enlaces de escritorio. Única parte de la cabecera que lee `usePathname`, y por tanto lo único que viaja como JavaScript. Exporta `isActivePath`, compartida con el drawer.
* **`Footer.tsx`**: Pie de página institucional sobre fondo blanco con hairlines de 1px. Contiene el logotipo, enlaces a todas las páginas, datos de contacto, horarios y derechos.
* **`MobileNav.tsx`**: Solo el botón de hamburguesa. Pide `MobileNavDrawer` en el primer hueco libre del hilo principal (`requestIdleCallback`), de modo que Radix Dialog no entra en el paquete inicial de ninguna página.
* **`MobileNavDrawer.tsx`**: Drawer lateral sobre Radix Dialog/Sheet, controlado desde `MobileNav`. Navegación escalonada por CSS (`.stagger-item`), botones rápidos para cita o WhatsApp y datos de guardia. Se cierra al navegar.
* **`WhatsAppFloat.tsx`**: Botón flotante accesible de WhatsApp. Un testigo de 420px al inicio del documento y un `IntersectionObserver` lo muestran al superar el héroe: el navegador avisa al cruzar el umbral, no en cada fotograma de scroll.

### Secciones (`components/sections/`)
* **`PageHero.tsx`**: Encabezado de página, claro (`bg-wash`), de renderizado del lado servidor (RSC). Con fotografía, la foto ocupa la parte derecha de arriba abajo y se funde con el fondo detrás del texto (`HeroMedia`, modo "side"); sin ella, las circunferencias de `Rings`. Migas de pan y metadatos al pie.
* **`SplitHero.tsx`**: Cabecera de la página del doctor: texto a la izquierda y el retrato detrás, a la derecha, fundido con el fondo.
* **`HeroMedia.tsx`**: Fotografía de cabecera detrás del texto, con velo claro (`.hero-scrim`). Modo "full" (portada: la foto es todo el fondo) o "side" (interiores y retrato: la foto empieza donde acaba el texto). `lcp` la pide al instante y con `fetchPriority="high"`. Se asienta al cargar y se acerca al desplazarse, sin JavaScript. Exporta `SIDE_TEXT`, el ancho de columna que garantiza que texto y foto no se pisen.
* **`PhotoSlideshow.tsx`** (§28): Carrusel de Inicio y del equipo en Sobre nosotros. Primera imagen renderizada en el servidor, siguiente carga anticipada, fundido de 600 ms y temporizador visual de 7 s. Pausa por interacción, visibilidad y movimiento reducido. La portada usa este componente desde §28; `HeroMedia` se conserva en las cabeceras interiores y el doctor.
* **`EditorialPhoto.tsx`**: Foto de contenido con proporción reservada, esquinas `rounded-lg` y la cortina común al entrar en pantalla (`.photo-reveal`).
* **`ServicesGrid.tsx`**: Grilla de 4 columnas en desktop con hairlines perimetrales de 1px. No usa `overflow: hidden` para permitir animaciones CSS scroll nativas escalonadas mediante `--step`.
* **`RoomsSection.tsx`**: Bloque interactivo de internación:
  * Maneja el estado de la suite activa (`gold`, `silver`, `bronce`).
  * Se sincroniza automáticamente con el hash de la URL (`#gold`, `#silver`, `#bronce`).
  * Contiene las pestañas fijas (`RoomTabs`), el panel detallado (`RoomPanel`) y la comparativa (`RoomsComparison`).
* **`RoomTabs.tsx`**: Selector de habitaciones pegajoso (`sticky top-[var(--header-bottom)]`). Sin `backdrop-blur`: desenfocar una barra pegajosa obliga a recomponer esa franja en cada fotograma de scroll. El subrayado deslizante se mide una vez por selección y se escribe como variables CSS (`--tab-x`, `--tab-w`); el recorrido lo interpola el compositor. Navegación completa con flechas de teclado.
* **`RoomPanel.tsx`**: Muestra la información de la suite seleccionada (mote de categoría, titular, descripción, puntos destacados, especificaciones de m² o acompañantes si existen, botón a WhatsApp preconfigurado con el nombre de la suite y amenidades).
* **`RoomGallery.tsx`**: Galería fotográfica inteligente:
  * En desktop: Mosaico asimétrico (1 imagen principal dominante + 2 secundarias con indicador `+N fotos más`).
  * En móvil: Carrusel táctil por anclaje de scroll nativo (`SnapCarousel`).
  * Al hacer clic: Abre el visor a pantalla completa. El módulo del visor se carga bajo demanda y se adelanta al acercar el puntero o al tocar la pantalla; se guarda en estado, no con `next/dynamic`, para que no suspenda en el clic.
* **`RoomLightbox.tsx`**: Envoltorio de `yet-another-react-lightbox` y su hoja de estilos, aislado en su propio módulo para poder quedar fuera del paquete inicial.
* **`RoomAmenities.tsx`**: Lista en grilla de las prestaciones incluidas en la suite activa, con iconos Lucide específicos.
* **`RoomsComparison.tsx`**: Tabla comparativa con las 15 amenidades para Gold, Silver y Bronce. Al pulsar sobre la cabecera de una suite, cambia activamente el panel principal. El cuerpo de la tabla va en un subcomponente memoizado sin props: cambiar de suite no reconcilia sus 45 celdas.
* **`InternacionFaq.tsx`**: Acordeón Radix desplegable con preguntas frecuentes de internación y llamada lateral a admisiones.
* **`CtaBand.tsx`**: Cierre de página en tarjeta clara con hairline, titular personalizable, botón primario a WhatsApp y enlace de llamada telefónica.
* **`SectionHeader.tsx`**: Encabezado estándar con numeración de sección (`01`, `02`), antetítulo en mayúsculas (`label`), titular y descripción.
* **`TierDot.tsx`**: Punto coloreado que distingue visualmente las categorías Gold, Silver y Bronce.
* **`PagePlaceholder.tsx`**: Plantilla para secciones pendientes (`/staff-medico`, `/blog`), explicando qué contenido está en preparación y ofreciendo vías de contacto alternativas para no perder al visitante.

### SEO (`components/seo/`)
* **`JsonLd.tsx`**: Datos estructurados schema.org en un `<script>`, con `<` escapado.

### UI Primitivas (`components/ui/`)
* **`button.tsx`**: Botón polimórfico (`asChild` vía `@radix-ui/react-slot`) con variantes (`primary`, `default`, `ghost`, `link`) y tamaños calibrados. Es componente de servidor: no usa estado ni APIs del navegador, así que en las páginas que no hidratan nada se resuelve en el servidor.
* **`reveal.tsx`**: 
  * `Reveal`: Envoltura que aplica clases CSS de revelado por scroll sin Javascript.
* **`accordion.tsx`**: Implementación accesible de Radix Accordion con transiciones de apertura y cierre por CSS keyframes.
* **`sheet.tsx`**: Modal tipo panel lateral deslizante (Drawer).
* **`snap-carousel.tsx`**: Carrusel por anclaje de scroll nativo. El desplazamiento lo lleva el navegador en el hilo de composición —sin bucle de `rAF` ni escucha táctil en JavaScript—, así que el arrastre no puede dar tirones aunque el hilo principal esté ocupado. Un `IntersectionObserver` mantiene el contador.

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

> Las curvas de animación ya no viven en TypeScript: son tokens CSS
> (`--ease-out-expo`, `--ease-out-quart`, `--ease-smooth`) en `app/globals.css`.

* **[links.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/lib/links.ts)**: Lógica defensiva para el botón "Reservar cita". Si `siteConfig.appointmentUrl` aún no tiene una URL externa válida, redirige automáticamente a WhatsApp solicitando cita.
* **[whatsapp.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/lib/whatsapp.ts)**: Generador centralizado de URLs `wa.me/59175031306` con mensajes contextuales predefinidos (general, por habitación o por especialidad).
* **[utils.ts](file:///home/httpreen/Documentos/Clinica%20Montalvo/montalvo/montalvo/lib/utils.ts)**: Combinador de clases CSS `cn()` con `clsx` y `tailwind-merge`.
* **`site-url.ts`**: Dirección pública del sitio (`NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `clinicamontalvo.vercel.app`) y `absoluteUrl()`. Única fuente de canónicas, sitemap, robots y datos estructurados.
* **`metadata.ts`**: `pageMetadata()` —título, descripción, canónica, Open Graph y `noindex` por página— y `shareImage`, la imagen para compartir (`public/og/clinica-montalvo.jpg`).
* **`structured-data.ts`**: `clinicJsonLd()`, la clínica como `MedicalClinic`, en Sobre nosotros y Servicios.

---

## 8. Recursos Estáticos (`public/`)

* `/images/logo/isotipo.svg`: Isotipo vectorial original de Clínica Montalvo.
  Es la fuente de la que derivan todos los iconos de aplicación.
* `/icons/icon-192.png`, `/icons/icon-512.png`: Iconos del manifiesto.
* `/icons/icon-maskable-512.png`: Variante a sangre para el recorte de Android.
* `/images/servicios/hero.webp`: Maqueta de referencia; no publicar como fotografía.
* `/images/habitaciones/gold/`: 7 fotografías reales de la suite Gold.
* `/images/habitaciones/silver/`: 2 fotografías reales de la suite Silver.
* `/images/habitaciones/bronce/`: 4 fotografías reales de la suite Bronce.

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

---

## 12. Pasada de rendimiento — 11 de septiembre de 2026

Objetivo: bajar el coste de arranque y quitar de en medio todo lo que compite
por el hilo principal mientras el usuario se desplaza o interactúa. Sin cambios
de diseño ni de contenido.

### Medido, antes y después (`next build`, peso que pide el HTML generado)

| Ruta | Antes | Después | |
| :--- | ---: | ---: | ---: |
| `/`, `/blog`, `/sobre-nosotros`… | 248 KB gz | **190 KB gz** | −23% |
| `/servicios` | 278 KB gz | **208 KB gz** | −25% |

| Interacción | Antes | Después |
| :--- | ---: | ---: |
| Clic en pestaña → suite visible | ~590 ms por diseño | **6–39 ms** |
| Clic en foto → visor abierto | 810 ms | **51 ms** |

### Qué se quitó y por qué

1. **Motion (librería de animación), eliminada.** `MotionConfig` envolvía el
   layout raíz, así que entraba en el paquete compartido de las once rutas,
   incluidas las que son solo texto. Sus cuatro usos se rehicieron en CSS:
   entradas del drawer, cambio de panel, subrayado de pestañas y botón
   flotante. Ver el bloque «ANIMACIONES CSS» de `app/globals.css`.
2. **Embla Carousel, eliminada.** Sustituida por `scroll-snap` nativo
   (`components/ui/snap-carousel.tsx`). Además se inicializaba también en
   escritorio, donde el carrusel está oculto.
3. **`AnimatePresence mode="wait"` en el cambio de suite.** Encadenaba 140 ms de
   salida y 450 ms de entrada: casi 600 ms entre el clic y ver lo pedido.
4. **`useScroll` en el botón flotante.** Ejecutaba una comparación en cada
   fotograma de scroll durante toda la visita. Ahora, un `IntersectionObserver`.
5. **`backdrop-blur` en las pestañas pegajosas y en el velo del drawer.**
   Desenfocar obliga a recomponer esa región en cada fotograma, justo cuando no
   hay presupuesto. Contra una página blanca no se distinguía.
6. **`text-rendering: optimizeLegibility` en `body`.** Fuerza kerning y
   ligaduras en todo el texto y retrasa el primer pintado.

### Qué se movió fuera del arranque

* **El visor de fotografías** (`yet-another-react-lightbox`, ~45 KB + 5 KB de
  CSS) vive en `RoomLightbox.tsx` y se carga al acercar el puntero o al tocar la
  galería. Hoy, con `images: []`, no se descarga nunca.
* **Radix Dialog** (~43 KB) sale del paquete inicial de todas las páginas:
  `MobileNav` es solo el botón y pide el drawer en el primer hueco libre del
  hilo principal.

> **Nota sobre Suspense.** El visor se guarda en estado y no con `next/dynamic`.
> Un componente perezoso suspende la primera vez que se dibuja, y React espera
> 300 ms antes de revelar el contenido para que no parpadee; como ese primer
> dibujo caía en el clic, esos 300 ms se cobraban al abrir (324 ms medidos con
> el módulo ya en caché). Es la diferencia entre 810 ms y 51 ms.

### Qué pasó a resolverse en el servidor

* `Header.tsx` y `button.tsx` dejaron de ser componentes de cliente. La cabecera
  entera —isotipo SVG incluido— viajaba como JavaScript por leer `usePathname`
  en un sitio; ahora eso vive aislado en `MainNav.tsx`.

### Configuración

* `next.config.ts`: AVIF antes que WebP, anchos de dispositivo acotados a los
  tamaños que el diseño pide de verdad, caché de imagen de un año,
  `poweredByHeader: false`, `reactStrictMode`.
* `tsconfig.json`: `target` de ES2017 a ES2022 — deja de transpilar `async`,
  generadores y campos de clase a máquinas de estado.

### Verificado

Build, `eslint` y `tsc --noEmit` limpios. Comprobado en navegador real
(Chromium) sin errores de consola ni de hidratación: posición y recorrido del
subrayado, cambio de suite, sincronía con el hash, flechas de teclado en el
`tablist`, aparición y ocultado del flotante, apertura y cierre del drawer en
móvil y su cierre al navegar, carrusel con anclaje y contador, visor con teclado,
y todo el contenido visible con `prefers-reduced-motion: reduce`.

La galería se probó inyectando temporalmente las maquetas WebP en
`content/rooms.ts`, ya que las suites siguen con `images: []`.

---

## 13. Iconos de aplicación — 11 de septiembre de 2026

El sitio venía con el `favicon.ico` de la plantilla de Next: el triángulo negro
de Vercel. Se sustituyó por el isotipo de marca, siguiendo el juego de iconos
del CRM de la clínica (`frontend-crm-montalvo`), con dos correcciones.

### Tamaño óptico

El isotipo son medias lunas finas: a 16 px el punto y la coma no se distinguen y
solo emborronan el conjunto. Por eso no hay un único dibujo reescalado, sino dos
versiones de la misma marca:

* **Pestaña** (`icon.svg`, y las cuatro entradas de `favicon.ico`): las dos
  medias lunas exteriores, que son los trazos gruesos. Es lo que se lee a 16 px.
* **Iconos grandes** (`apple-icon.png`, manifiesto 192 y 512): la marca
  completa, con el punto y la coma. A partir de 96 px el detalle sí aporta y es
  lo que la identifica.

`favicon.ico` lleva entradas de 16, 32, 48 y 64 px generadas una a una, no una
imagen reducida cuatro veces.

### Marca calada en blanco sobre disco verde

En el CRM el isotipo va en verde `#006156` sobre fondo transparente. Sobre una
pestaña oscura —el modo por defecto de mucha gente— eso es verde oscuro sobre
casi negro: el icono desaparece. Aquí la marca va calada en blanco sobre un
disco del verde corporativo, que se distingue igual en pestaña clara y oscura y
además hace el icono localizable de un vistazo en una tira de pestañas.

**El contenedor es un círculo, no una baldosa redondeada.** El isotipo son
medias lunas concéntricas: meterlo en una caja repetía la contradicción que el
sitio ya corrige con el arco de marca (sección 14), y además en una tira de
pestañas todos los iconos vecinos son cuadrados, así que un disco destaca. A
16 px se probaron cuadrado, squircle y círculo con uno y con dos arcos: con dos
arcos, el exterior y el borde del círculo se empastan; **el único que se lee
nítido es el disco con un solo arco**, que es el que va en la pestaña.

### Dos defectos del juego del CRM que aquí no se repiten

1. Su `apple-touch-icon.png` es transparente. iOS compone los iconos sobre negro,
   así que el isotipo verde oscuro queda ilegible en la pantalla de inicio. El de
   aquí va opaco y a sangre; el redondeo lo pone iOS.
2. No tenía variante `maskable`. Android recorta el icono con la forma del
   sistema —círculo, cuadrado redondeado, gota— y se comía los bordes de la
   marca. `icon-maskable-512.png` va a sangre y con la marca dentro de la zona
   segura del 80%.

### Manifiesto

`app/manifest.ts` genera `/manifest.webmanifest`. Va con `display: "browser"` a
propósito: esto es un portal informativo, no una aplicación, y abrirlo sin barra
de direcciones le quitaría al visitante ver dónde está y poder compartirlo.

Los PNG se rasterizaron desde el SVG con el motor de Chromium, que es el mismo
que los pinta. Para rehacerlos basta con volver a exportar desde
`public/images/logo/isotipo.svg` con los encuadres descritos arriba.

---

## 14. Transiciones nativas y el arco de marca — 11 de septiembre de 2026

### Transiciones entre páginas (View Transitions API)

El relevo entre páginas lo anima ahora el navegador, con `<ViewTransition>` de
React, que el App Router de Next 16 soporta sin configuración. Antes era un
fundido de opacidad desde 0,65 sobre el contenido nuevo (`.page-enter`), que
dejaba ver el corte.

* **Cabecera y pie anclados** (`viewTransitionName: site-header` / `site-footer`,
  con `animation: none` en `::view-transition-group`). No participan: son el
  punto de referencia de la página, y si parpadean la sensación es de recarga.
* **El héroe se transforma**: el bloque verde lleva `viewTransitionName:
  page-hero` en la portada y en `PageHero`, así que el navegador lo reconoce
  como un elemento que continúa y lo morfea de una forma a la otra en vez de
  redibujarlo. Es lo que separa una transición de un fundido.
* **`::view-transition { pointer-events: none }`**: la capa de transición captura
  los clics mientras dura; sin esto se pierde una pulsación hecha a mitad.
* Movimiento reducido anula todas las duraciones.

Coste: **0 bytes.** El paquete sigue en 190 KB gz. Es API del navegador, y sin
soporte la navegación funciona igual, sin animar.

**No se llevó al cambio de suite**: ahí el CSS responde en 12 ms; usar la API
obligaría a acotar la animación raíz con más CSS y a diferir la actualización,
con riesgo de empeorar justo esa métrica.

### Tiempos

Se dejaron como estaban, por decisión expresa: salida de página 140 ms, entrada
220 ms tras ella, morfeo del héroe 320 ms, cambio de suite 300 ms.

### El arco de marca

El isotipo no tiene una sola línea recta —son medias lunas concéntricas, un
círculo y una coma— mientras que la página estaba resuelta entera con ángulos de
90 grados. La retícula contradecía a la marca, y de ahí la sensación de
"demasiado cuadrado".

No se arregla redondeando todo: eso convierte una institución médica en una
aplicación de consumo. Se arregla con una sola curva y una regla explícita:

> **Todo bloque verde termina en arco.**

Se cumple en el héroe de cada página y en la franja de cierre, que son los dos
sitios donde el verde se encuentra con el blanco. El resto sigue recto, que es
lo que da el aire clínico. El eco pequeño es `.arc-rule`, que sustituye al
separador recto de los encabezados de sección y hace que el arco grande se lea
como sistema y no como un adorno suelto.

**Implementación**: `@utility arc-end` en `app/globals.css`. El radio elíptico
horizontal es la mitad del ancho, de modo que las dos esquinas se encuentran en
el centro y forman un arco continuo de lado a lado; se recalcula solo al cambiar
el ancho, sin SVG, sin imagen y sin medir en JavaScript. La profundidad es
`--arc-depth: clamp(1.5rem, 4vw, 4rem)`: fija en móvil y proporcional en
pantallas anchas, porque un arco relativo al ancho se vuelve un cuenco en un
monitor de 27 pulgadas.

Va con `@utility` y no dentro de `@layer components` porque se usa con variantes
de ancho. Tailwind solo genera variantes de las clases registradas; declarada
como clase suelta, `lg:arc-end` no existía y el arco desaparecía en escritorio.

**La portada cambia de dueño según el ancho.** En escritorio el héroe son dos
columnas —verde y fotografía— y el borde inferior lo comparten: el arco va en la
sección y las recorta juntas. Apilado, la última pieza es la fotografía, así que
un arco en la sección quedaría al pie de ella, contra blanco y sin contraste.
Apilado lo lleva la columna verde, que es la que de verdad termina. De ahí el
juego de `bg-primary` / `lg:bg-transparent` entre sección y columna.

### Sobre el verde

Medido sobre la portada: el verde sólido pasó de **25,4 % a 24,0 %** de la
página. Es poco, y es lo esperado: el arco cambia la forma, no la superficie.

El diagnóstico de fondo no es "mucho verde" sino **mucho verde vacío**, y su
causa principal son los tres huecos de fotografía —lado derecho del héroe,
sección de internación y galería de habitaciones—, que hoy son rectángulos
pálidos con el isotipo de marca de agua. Cuando entren fotografías reales, el
verde pasará de masa a acento. El inventario de pendientes de la sección 9 sigue
siendo la vía para eso.

El relleno de la franja de cierre se reequilibró (`pt-16 pb-24`, `lg:pt-24
lg:pb-32`) para que el contenido no parezca deslizarse dentro de la curva. No
reduce su altura: compensa el área que el arco quita por abajo.

---

## 15. Dos correcciones de maquetación — 11 de septiembre de 2026

### La cabecera desaparecía al navegar

Introducido al anclar la cabecera para las transiciones de página (sección 14):
el nombre de transición se puso en un `<div>` envolvente en lugar de en el
propio `<header>`.

`view-transition-name` convierte al elemento en **bloque contenedor de sus
descendientes `position: fixed`** y le crea un contexto de apilamiento. Esa
envoltura medía 0 px de alto —su único hijo estaba fuera de flujo—, así que la
cabecera quedaba atrapada en su contexto de apilamiento y `<main>`, que va
después en el orden del documento, se pintaba encima. En las páginas interiores,
donde el héroe sube con `-mt-[var(--header-h)]`, la tapaba por completo.

**Regla**: el nombre de transición va siempre en el elemento real, nunca en una
envoltura, y con más motivo si el elemento es fijo o absoluto.

### `/servicios` se veía alejada en el móvil

Fallo anterior a todo este trabajo: está presente en `af58efb`, el primer commit
del portal. Se localizó buscando el origen del desbordamiento, no revisando el
código.

La tabla comparativa pide `min-w-[34rem]` (544 px) para que las quince
prestaciones no se partan en tres líneas, y por debajo de ese ancho se recorre en
horizontal. El contenedor la recortaba visualmente —`clientWidth` 372 sobre
`scrollWidth` 544—, pero ese ancho mínimo seguía propagándose al área desplazable
del documento: en un teléfono de 412 px la página entera medía 505 y el navegador
la alejaba para que cupiera. El síntoma era una cabecera encogida y todo el texto
más pequeño, **solo en esta página**.

Se resuelve con `contain: layout` sobre el contenedor, que declara que su layout
interno no afecta al de fuera. Es la contención mínima que funciona: `paint` y
`content` también sirven, pero prometen más de lo necesario.

> **Cómo medir esto.** Un viewport con emulación móvil se auto-expande para
> encajar el contenido que desborda, de modo que `scrollWidth` y `innerWidth`
> crecen a la vez y la comprobación habitual —`scrollWidth > innerWidth`— no
> detecta nada. Hay que usar un viewport de ancho fijo **sin** emulación móvil,
> que no se expande, y entonces el desbordamiento sí aparece.

### Gestor de paquetes

El repositorio tenía `pnpm-lock.yaml` y un `package-lock.json` sin seguimiento, y
`node_modules` mezclaba las dos instalaciones. `package.json` declara
`packageManager: pnpm@11.24.0`, así que se retiró el `package-lock.json` y se
reinstaló desde cero con pnpm: el árbol pasó de 1,0 GB mezclado a 492 MB, y
`motion` y `embla-carousel-react` —que seguían en disco pese a no estar ya en el
manifiesto— desaparecieron.

**Usar siempre `pnpm install` en este proyecto, no `npm install`.**

---

## 16. El parpadeo de la cabecera al navegar — 11 de septiembre de 2026

Tercer fallo de la misma familia que los de la sección 15, y el que de verdad se
notaba al usar el sitio: **al cambiar de página, la barra desaparecía bajo el
héroe verde durante unos 250 ms y volvía de golpe.**

Anclar la cabecera con `animation: none` no basta. Dentro de la capa de
transición los grupos se apilan **por orden de captura, no por el `z-index` que
tenían en la página**: el `z-50` del `<header>` no se hereda. Y como el héroe es
un grupo con nombre propio —`page-hero`, porque se transforma entre páginas— y
en las páginas interiores sube por debajo de la barra con
`-mt-[var(--header-h)]`, acababa pintándose encima de ella.

La corrección es una línea: `z-index: 100` en
`::view-transition-group(site-header)`.

### Cómo se midió

Los fotogramas no se pueden capturar con `page.screenshot()`: no recoge la capa
de transición y además fuerza un repintado, de modo que las quince capturas
salían idénticas y el fallo parecía no existir. Hay que pedirle los fotogramas
al compositor por CDP (`Page.startScreencast`) y medir el color medio de la
franja donde vive la barra.

Con eso el fallo era inequívoco: quince fotogramas seguidos con la franja en
verde sólido `(1, 97, 86)` en lugar de blanco. Tras la corrección, **351
fotogramas reales de ocho navegaciones —escritorio y móvil— sin un solo
fotograma con la cabecera comprometida.**

> **Regla general para elementos anclados en una view transition**: no basta con
> darles nombre y quitarles la animación. Hay que darles también un `z-index`
> dentro de la capa de transición, o cualquier otro grupo con nombre puede
> quedar por encima.

---

## 17. La navegación parecía lenta — 11 de septiembre de 2026

La transición entre páginas se estaba leyendo como lentitud. Tres causas, y la
solución de fondo de las tres resultó ser la misma pieza: la cabecera.

### El héroe se transformaba de una página a otra

Era el mayor responsable. El morfeo de elemento compartido comunica continuidad
cuando las dos cosas son **la misma** —una miniatura que se agranda hasta ser la
foto—, pero los héroes de dos páginas distintas no lo son: transformar uno en
otro se lee como que la página se está recolocando. Retirado.

### La salida esperaba a la entrada

La instantánea vieja se desvanecía durante 140 ms y solo entonces empezaba la
entrada de 220 ms: **360 ms** hasta ver la página pedida, y un bajón de opacidad
a mitad de camino.

Ahora la vieja se queda quieta y opaca debajo mientras la nueva aparece encima,
de modo que el compuesto nunca baja de opaco, y el total son **180 ms**. Por
encima de 400 ms una transición empieza a leerse como espera; el valor por
defecto del navegador es 250 ms.

Y nada se mueve: **solo opacidad**. Un `translate` sobre la raíz arrastraría
también a la cabecera, y una barra que se desplaza en cada navegación es lo que
más delata a una web como lenta.

### La cabecera: de `fixed` a `sticky`

Este es el cambio de fondo. Un elemento `position: fixed` **no entra en la
instantánea** que la API toma del documento, así que la capa de transición lo
tapa —el «z-index issue» conocido de esta API—. La salida habitual es darle
`view-transition-name`, pero entonces se sustituye por una instantánea, deja de
dibujarse y **deja de recibir clics**.

Medido, ese era el precio: con la cabecera nombrada, **300 ms sin responder en
cada navegación**; sin nombre, la franja se veía verde.

`sticky` participa del flujo, así que entra en la instantánea y transita con la
página. Sin nombre, sin taparse y sin dejar de responder. De paso, `<main>` ya
no necesita `pt-[var(--header-h)]` ni los héroes su margen negativo: la cabecera
ocupa su sitio de forma natural, y la maquetación queda más simple que antes.

| | Antes | Después |
| :--- | ---: | ---: |
| Cabecera sin responder, por navegación | 300 ms | **20 ms** |
| Fotogramas con la cabecera tapada | 15 seguidos | **0 de 304** |
| Transición completa | 360 ms | **180 ms** |
| Contenido nuevo visible | — | **16–35 ms** |

Referencias consultadas: la guía de view transitions de Next 16
(`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`), la nota de
Bram Van Damme sobre interactividad durante una transición, y las
recomendaciones de duración recogidas en corewebvitals.io y talkingtech.io.

---

## 18. Pedido fotográfico — 11 de septiembre de 2026

`public/images/README.md` es ahora un encargo completo para Marketing, no una
nota técnica: **13 fotografías más 3 galerías**, organizado **página por página**
y con **prioridad numerada del 01 al 13**, de modo que se pueda encargar por
partes sin decidir nada sobre la marcha. Incluye nombre de archivo y carpeta
exactos, ancho de entrega por tipo de foto, indicaciones de encuadre,
tratamiento visual, lo que no sirve y cómo se activa cada foto en `content/`.

El orden de prioridad no es arbitrario: **01** es la fotografía de portada
—la primera que ve cualquier visitante— y **02 a 04** son las principales de las
tres suites, porque la internación es el argumento comercial del sitio y hoy es
el hueco más grande. Las cabeceras de las páginas secundarias van al final.

Las medidas del documento están **tomadas del sitio construido** a 1920, 1440 y
412 px, no estimadas. Las dos que condicionan el encargo:

* **Cabecera de página**: 1920 × 395 en escritorio y 412 × 392 en móvil. La
  misma fotografía se ve panorámica en un ordenador y casi cuadrada en un
  teléfono, y lleva el titular sobre la mitad izquierda. De ahí las tres reglas
  del encargo: sujeto a la derecha, aire arriba y abajo, y que sobreviva a un
  recorte cuadrado.
* **Fotografía de portada**: 640 × 630 en escritorio y 412 × 258 en móvil. Pasa
  de 1:1 a 16:10, así que necesita margen por los cuatro lados.

Se pide **JPG o PNG sin comprimir**, no WebP: el sitio genera AVIF y WebP en
todos los tamaños, y recomprimir un WebP pierde calidad dos veces.

Se añadió `2560` a `images.deviceSizes` en `next.config.ts`. Las cabeceras van a
sangre, y en una pantalla de 1440 px a doble densidad el navegador pide 2880: con
el tope anterior de 1920 la fotografía se ampliaba y se veía blanda. Por eso el
documento pide 2560 px de ancho para las cabeceras.

Carpetas creadas y listas: `public/images/cabeceras/` y `public/images/portada/`,
además de las tres de `habitaciones/` que ya existían.

---

## 19. Despliegue de producción — 14 de septiembre de 2026

Se consolida y despliega como versión definitiva de producción la arquitectura de
transición fluida de esta máquina:
* **Transición de opacidad pura en 180 ms** (`::view-transition-old(root)` / `::view-transition-new(root)`), sin deslizamientos ni traslaciones laterales del lienzo que entorpezcan la lectura o la cabecera.
* **Cabecera sticky fija**: no se oculta ni pierde interactividad.
* Se descartan los experimentos de traslación horizontal de páginas y navegación direccional forzada.

---

## 20. Las fotografías de habitación, en producción — 26 de septiembre de 2026

Llegó el primer material fotográfico real: 18 archivos del cliente, 13 únicos
tras descartar duplicados. Las maquetas WebP con notas de producción se
retiraron.

### Proceso

HEIC y JPG de origen (hasta 5184 × 3456 y 9 MB) reducidos a 2000 px las
principales y 1600 px las de galería, JPEG al 82%. **Sin ampliar nunca**: dos
originales eran más pequeños que el tope y se conservan a su tamaño real; forzar
el tope solo habría añadido peso sin detalle. El reencodado descarta EXIF y GPS.
Total en disco: 4,7 MB, de los que Next sirve variantes AVIF y WebP al tamaño
que cada pantalla pide.

### Reparto por suite

Asignadas **por inspección visual** de cada fotografía contra la descripción de
cada suite en `content/rooms.ts`: Gold 7 —dos vistas generales, dos baños de
mármol y tres detalles de amenidades de marca—, Silver 2 y Bronce 4. **Es una
inferencia, no un dato del cliente**: conviene que Dirección confirme la
correspondencia antes de darla por buena.

### Tres correcciones de maquetación que solo podían verse con fotos

1. **La retícula no salía de la proporción de las fotografías.** `h-[30rem]` se
   eligió cuando no había fotos; medida contra el ancho real de la columna,
   dejaba las fichas del mosaico en **0,86 —verticales— mientras que las
   fotografías son 4:3**, de modo que se recortaba el 35% del ancho de cada una
   y las habitaciones no se reconocían. Ahora la altura sale de la proporción
   del contenedor: `aspect-[2/1]` para el mosaico de 8+4 y `aspect-[8/3]` para
   dos fichas. **Todas las fichas caen en 1,33 a cualquier ancho**, medido.
2. **Con dos fotografías la columna de apoyo dejaba media rejilla en blanco**, y
   al estirar esa única ficha para rellenarla, una fotografía apaisada quedaba
   recortada a una franja vertical. Con dos, ahora se reparten a lo ancho.
3. **El aviso de «+N fotos más» era un velo verde sobre la última ficha**, es
   decir, tapaba una fotografía entera para anunciar que había más fotografías.
   Ahora es un distintivo en la esquina.

### Encuadre por fotografía

`RoomImage` acepta `position` opcional (sintaxis de `object-position`). Cuatro
fotografías son verticales y las fichas son apaisadas: sin esto el recorte
centrado se comía el motivo. Solo se declara cuando el centro geométrico no es
el centro de atención.

### Portada

El bloque de internación ya no es un marcador: usa
`/images/habitaciones/gold/principal-1.jpg`, que es 4:3 y encaja con el hueco.

### Pendiente

* **Confirmar el reparto de fotografías por suite** con Dirección.
* Silver solo tiene dos fotografías; conviene pedir baño y detalles.
* El **retrato del Dr. Montalvo** ya está publicado y sin logotipo (§21).
* La carpeta de origen queda fuera de git y del linter (`.gitignore`,
  `eslint.config.mjs`): es material en bruto, no código del proyecto.

### El retrato del Dr. Montalvo

Publicado en `/dr-montalvo`, en `public/images/equipo/dr-montalvo.jpg`. El
original es **1639 × 2048, es decir 4:5 exacto**, la proporción natural de un
retrato vertical, así que se reduce a 1200 × 1500 sin recortar nada.

**No va en la cabecera de la página**, que es 1920 × 395 en escritorio: ahí
habría quedado una franja en la que no se le reconoce. Va en su propia columna
dentro de «Trayectoria», junto a los hitos, y renderiza a 0,80 —la proporción
del original— sin recorte alguno.

**Lleva el logotipo de la clínica incrustado** en la esquina superior derecha, y
no se puede quitar recortando: medido sobre el original, el logotipo ocupa del
58% al 99% del ancho y la cabeza llega hasta el 59%, de modo que cualquier
recorte que lo excluya corta el retrato. Se publica así por decisión expresa;
conviene pedir a la clínica el original sin logotipo y sustituirlo.

El cargo sigue vacío en `content/institucional.ts`. En la propia bata se lee
«GINECÓLOGO OBSTETRA», pero eso es una lectura de la fotografía, no un dato
facilitado por Dirección, y este proyecto no atribuye cargos por inferencia.

---

## 21. Las fotografías en su sitio — 26 de septiembre de 2026

### Dónde va cada una

* **Portada** → `gold/principal-2.jpg`, a sangre bajo el velo verde, con el
  mismo tratamiento que las cabeceras interiores (cambio pedido el 26/09: la
  portada enseña la clínica, no al doctor). Es la vista más amplia de suite
  —ventanal y zona de estar a la derecha—. **El original es de 1280 px**: bajo
  el velo apenas se nota, pero conviene pedir uno mayor.
* **Página del Dr. Montalvo** → el retrato vertical del doctor, integrado en
  una cabecera partida de texto y fotografía. El reconocimiento queda
  documentado en la sección de trayectoria, sin convertir la cabecera en una
  tarjeta independiente.
* **Cabecera de Servicios** → `silver/principal-1.jpg`. Elegida entre las cuatro
  vistas generales de suite más anchas porque es la única cuyo punto de interés
  —el ventanal— cae a la derecha, donde el velo verde es más transparente.

Cada fotografía se usa en un solo sitio destacado.

### `SplitHero`

La página del doctor usa `components/sections/SplitHero.tsx`:
texto sobre verde a un lado y fotografía al otro. Se extrajo en lugar de copiar
el marcado porque la lógica del arco es fácil de romper —en escritorio lo lleva
la sección, apilado lo lleva la columna verde (§14)—. En móvil la fotografía va
en 4:3 y no en 16:10: son retratos, y 16:10 dejaba la cara a medias.

### El logotipo incrustado, retirado

Las dos fotografías del doctor traían el logotipo de la clínica en la esquina
superior derecha. No se podía recortar: se solapa con la cabeza en horizontal y
en vertical. Pero detrás hay una pared **desenfocada y lisa**, que es el caso más
favorable para rellenar.

Se midió fila a fila el hueco entre la cabeza y el isotipo —el isotipo empieza
en x=959 y la cabeza no pasa de x=937 en esa franja— y se rellenó el rectángulo
del logotipo con un **parche de Coons**, que interpola desde los cuatro bordes y
coincide con el fondo en todos ellos, así que no deja costura. Los bordes solo
se toman donde son pared: el pelo gris de la sien, que el filtro de piel no
reconoce, se colaba como una línea oscura. El retrato no se toca.

**Aviso de caché.** Al sustituir el archivo con el mismo nombre, la web siguió
mostrando la versión con logotipo: el optimizador de Next indexa por URL y
`minimumCacheTTL` es de un año. Por eso el retrato pasó a llamarse
`dr-montalvo-retrato.jpg`. **Regla: al cambiar una fotografía, cambiar también el
nombre del archivo**; si no, quien ya la vio la seguirá viendo vieja hasta un año.

### Verificado

Las tres cabeceras cargan su fotografía con texto alternativo en escritorio y
móvil; 8 rutas por 3 anchos sin errores ni desbordes; galerías intactas; visor
en 93 ms. El paquete sigue en 190 KB gz.

---

## 22. Nitidez de portada y presentación del doctor — 26 de septiembre de 2026

La portada pasó posteriormente a una fachada de **382 × 510 px**, ampliada a
640 × 630 px en escritorio. Para resolver la falta de detalle, ahora utiliza
la misma fotografía real de **2000 × 1500 px** que Servicios
(`silver/principal-1.jpg`), con `HeroBackdrop`, velo verde y arco a todo el ancho.
La fachada sigue disponible, pendiente de un original de mayor resolución.
Esta composición sustituye las asignaciones de portada descritas en §21.

`HeroBackdrop` sirve calidad 85 y admite `sizes`: el recorte vertical en móvil
necesita más resolución que el ancho visible de la pantalla. Inicio reserva
900 px de ancho de imagen por debajo de 1024 px; las cabeceras interiores,
640 px por debajo de 640 px. `next.config.ts` permite las calidades 75 y 85;
las demás fotografías conservan 75.

La página del doctor usa una cabecera partida de `SplitHero`, con el retrato
vertical completo en una columna derecha y el titular, migas y CTA en la
izquierda. El marco de la foto no lleva una tarjeta blanca ni recorta el rostro;
la composición conserva el arco, el verde de marca y la escala editorial del
resto del sitio. La sección de trayectoria queda debajo con el hito del
reconocimiento y el CTA institucional. No se atribuyen cargos o formación
pendientes de confirmación.

Verificación: ESLint y TypeScript correctos; inicio, Servicios y doctor en
320, 390, 768, 1024, 1440 y 1920 px, con densidad 2, sin desbordes, imágenes
rotas ni errores de consola. Proporción del retrato y enlaces comprobados.
Se repitieron las vistas móviles tras ajustar `sizes`. Compilación de
producción correcta con `next build --webpack`; Turbopack falló en este entorno
por `Operation not permitted` al abrir un puerto para procesar CSS.

---

## 23. Héroe y cierre en claro — 1 de octubre de 2026

El cliente señaló que el bloque verde del héroe era demasiado invasivo y no
combinaba con el resto de la página, que es blanca. Se retiró el verde de fondo
en todas las cabeceras y en la franja de cierre; **esto sustituye la regla de §14
«todo bloque verde termina en arco» y los velos verdes de §21 y §22.**

### Qué cambió

* **Cabeceras** (`app/page.tsx`, `PageHero`, `SplitHero`): fondo `bg-wash` con
  hairline inferior, titular en negro y la fotografía en su propio marco, ya no a
  sangre bajo un velo. Sin fotografía, las circunferencias de `Rings`.
* **El arco pasó a la fotografía.** `@utility arch` (`app/globals.css`) redondea
  las dos esquinas superiores con un semicírculo exacto a cualquier ancho. Regla
  nueva: **toda fotografía de cabecera va en arco.** `arc-end`, `--arc-depth` y
  `.grain` se eliminaron.
* **`CtaBand`**: tarjeta `bg-wash` con borde sobre fondo blanco, en lugar de franja
  verde pegada al pie.
* **Botón `primary`** (relleno verde, hover `primary-dark`): la acción principal
  de cada cabecera y del cierre. Es ahora **la** mancha de color de la pantalla.
  Las variantes `inverse` e `inverseOutline` se eliminaron: no quedan superficies
  verdes donde usarlas.
* **Portada**: «con atención cercana.» va en `text-primary` dentro del titular.
* `HeroBackdrop.tsx` se eliminó: ya nada pinta una fotografía a sangre con velo.

### Fotografía

Las cabeceras interiores usan marco **5:4** y la portada **4:5**; el doctor
mantiene 4:5. Se pidió a Marketing 2000 × 1600 px por cabecera
(`public/images/README.md`, actualizado). La portada reutiliza
`silver/principal-1.jpg` con `sizes` generosos: el recorte vertical a 4:5 toma
solo parte del ancho y necesita más resolución que el marco.

### Si se quiere un toque de verde fuerte

Es una decisión de una sola clase: volver `CtaBand` a `bg-primary text-white` con
botones `primary`→blanco requiere reponer las variantes inversas del botón.
El verde de fondo no se recomienda en cabeceras: era lo que se retiró.

### Verificado

`tsc --noEmit` y `eslint` limpios. Portada, Servicios, Dr. Montalvo y Sobre
nosotros revisadas en 1440 y 390 px: sin desbordes horizontales ni errores de
consola.

---

## 24. Fotografía de cabecera: entera, más pequeña y fundida con el fondo — 1 de octubre de 2026

Tras ver §23 en producción, el cliente pidió la foto **más pequeña**, **completa**
y con los **bordes degradados**, y algo de animación. Esto sustituye el arco de
§23: el arco recortaba las esquinas, y la foto debía verse entera.

### Qué cambió

* **Tamaño.** Portada: foto de 544 × 408 (antes 560 × 700 en 4:5); héroe de
  **559 px de alto, antes unos 800**. Servicios: 512 × 384. Doctor: 352 × 440.
* **Completa.** El marco toma la proporción del original —4:3 las habitaciones,
  4:5 el retrato—, así que `object-cover` ya no recorta nada.
* **Bordes difuminados**: `@utility feather` en `app/globals.css`. Máscara de dos
  degradados intersecados (uno por eje) con rampa en S (smoothstep): con una
  rampa lineal se veía una banda gris alrededor de la foto. Ancho ajustable con
  `--feather` (10 % por defecto). Lleva el prefijo `-webkit-` a mano: el dev
  server no lo añade y Chrome < 120 lo necesita.
* **Animación** (`.hero-photo`): entrada de 1,1 s (opacidad y escala desde
  1,04), y después una deriva muy lenta de la `<img>` hasta 1,06 y vuelta,
  26 s por tramo. Solo `opacity` y `scale`: las hace el compositor. Movimiento
  reducido las anula.
* **Circunferencias centradas** detrás de la foto, como un halo; en móvil al
  100 % del ancho para que no crucen el texto de encima.
* Se eliminó `@utility arch`. `figcaption` de `SplitHero` pasa a texto bajo la foto.

### Detalle conocido

La foto de portada (`silver/principal-1.jpg`) tiene un foco de techo en la
esquina superior izquierda; la máscara lo deja como un rastro tenue. Es contenido
de la foto, no un defecto de la máscara. Con un original nuevo desaparece.

### Verificado

`tsc --noEmit`, `eslint` y `next build --webpack` correctos. Portada, Servicios,
Dr. Montalvo y Sobre nosotros en 1440 y 390 px: sin desbordes ni errores de consola.

---

## 25. Cabecera editorial con la foto a todo el ancho — 1 de octubre de 2026

El cliente vio §24 en producción y lo encontró **«muy común»**: la foto flotante
con bordes difuminados es un recurso de plantilla. Pidió la imagen **a todo el
ancho de su sección** y el mejor resultado posible. Esto sustituye §24.

### Investigación

* Las cabeceras de los hospitales de referencia (Cleveland Clinic, Mayo Clinic)
  usan fotografía a todo el ancho con un titular fuerte y ponen arriba las vías
  prácticas antes que el relato institucional.
* Texto sobre foto exige 4,5:1 (3:1 en titulares grandes): obliga a un velo, y
  el velo verde era justo lo que el cliente rechazó en §23.
* El patrón editorial —titular sobre fondo liso y foto a sangre debajo— resuelve
  las dos cosas: la foto se ve entera de lado a lado y el texto no depende de
  ella para leerse.
* Las animaciones ligadas al scroll en CSS ya funcionan en Chrome 115+ y en
  Safari 26; el sitio ya las usaba con `@supports` para los `reveal`.

### Qué cambió

* **Portada y `PageHero` con foto**: titular a la izquierda (7 columnas),
  entradilla y botones a la derecha (5), alineados por abajo. Debajo,
  `HeroMedia` a todo el ancho.
* **Alto de la franja ligado a la pantalla**:
  `clamp(17rem, min(40vw, 100svh − 24rem), 36rem)` en portada y
  `clamp(15rem, min(34vw, 100svh − 23rem), 30rem)` en las interiores. La
  cabecera entera —tarjeta incluida— cabe en la primera vista en un portátil
  de 1440 × 780; en 1920 × 1080 la franja se detiene en 576 px.
* **Página del doctor (`SplitHero`)**: el retrato llena la mitad derecha de
  arriba abajo y hasta el borde de la pantalla. A todo el ancho de la página, un
  retrato 4:5 quedaría en una franja a la altura de los ojos. La columna de
  texto se alinea con el contenedor del sitio (`max-w-[40rem]` + `ml-auto`).
* **Tarjeta sobre la foto de portada** (solo ≥ 1024 px): «Emergencias, 24 horas»,
  el horario y «Pioneros en reproducción asistida». Con un testigo que late
  (`.pulse-ring`). **No se asocia ningún teléfono a emergencias**: la clínica no
  ha confirmado que `siteConfig.phone` sea la línea de guardia. Por debajo de
  1024 px la foto es baja y la tarjeta la taparía: el dato de marca va en el texto.

### Movimiento (`app/globals.css`, bloque «Fotografía de cabecera a sangre»)

* **Apertura** (`hero-open`, 1,2 s): la foto arranca recortada —4% por los lados,
  6% arriba, esquinas de 24 px— y se abre hasta el borde. Es un `clip-path`, no
  una transparencia: la imagen se pinta desde el primer fotograma y no retrasa el
  LCP.
* **Acercamiento** (`hero-approach`): mientras se baja la primera pantalla, la
  `<img>` escala de 1 a 1,1 y baja un 4%. Medido a 300, 600 y 900 px de scroll:
  la imagen cubre siempre su marco, sin hueco por ningún lado.
* Movimiento reducido: apertura terminada y escala 1, comprobado.

Se retiraron `@utility feather`, `.hero-photo` y sus fotogramas.

### Fotografía

El pedido (`public/images/README.md`) vuelve a 2560 × 1440 para cabeceras y
portada. La foto actual de portada y Servicios mide 2000 px: en pantallas de
alta densidad a todo el ancho se verá algo blanda hasta que llegue un original
mayor.

### Verificado

`tsc --noEmit`, `eslint` y `next build --webpack` correctos. Portada, Servicios,
Dr. Montalvo y Sobre nosotros en 1920 × 1080, 1440 × 900, 1440 × 780, 820 × 1180 y
390 × 844: sin desbordes ni errores de consola.

---

## 26. La foto detrás del texto, y todas las fotos como una serie — 1 de octubre de 2026

El cliente vio §25 en producción: **«está horrible que la foto esté por debajo
del texto»**. Pidió la foto **detrás del texto** y que **todas las fotos** del
sitio se vean lo más estéticas posible al navegar. Sustituye §25.

### Cabeceras

* **Portada** (`HeroMedia` "full"): la foto es todo el fondo de la apertura, de
  `clamp(34rem, 100svh − cabecera, 46rem)` de alto. El texto va a la izquierda
  sobre un **velo claro** —el propio `--color-wash`, no verde— que se desvanece
  hacia la derecha, donde el ventanal queda nítido. La tarjeta de emergencias
  pasa a la esquina inferior derecha.
* **Interiores y doctor** (`HeroMedia` "side"): la foto ocupa la parte derecha
  de arriba abajo y su borde izquierdo se funde con el fondo. Empieza donde
  acaba la columna de texto (`SIDE_TEXT`: 28rem en `lg`, 32rem desde `xl`;
  foto desde el 50% y el 46%): **el texto nunca queda encima de la imagen** a
  ningún ancho, y la foto se ve casi entera. En Servicios se ven completos los
  ventanales triangulares con el jardín, que con la foto a todo el fondo
  quedaban bajo el velo.
* **Móvil**: la foto arriba, fundida hacia abajo con el fondo, y el titular
  entra encima de la zona fundida (`-mt-16`/`-mt-24`).
* **Servicios** cambia a `silver/principal-2.jpg` (ventanales triangulares):
  compartía foto con la portada, contra la regla de §21 de una foto por sitio.
* Retrato del doctor: encuadre `center 12%`, para dejar aire sobre la cabeza.

### El velo, medido

El velo de la portada **no se mide en porcentaje de la pantalla sino desde
donde termina el texto** (`--text-end` en `.hero-scrim`): con porcentajes fijos,
a 1024 px la columna ocupaba el 59% del ancho y la entradilla salía del velo
(**1,56:1**, medido). Rampa con paradas en S para que no se vea dónde acaba.

Contraste medido **contra los píxeles reales de la foto** (captura con el texto
oculto, percentil 2 del fondo bajo cada línea), en 1920, 1440, 1280, 1024 y
390 px: el peor texto da **5,12:1** (mínimo 4,5). El gris secundario sobre
fondo liso da 5,6:1, así que la foto apenas resta.

### Todas las fotos, como una serie (`app/globals.css`)

* **`.photo-reveal`**: al entrar en pantalla, cortina que sube (`clip-path`,
  16% → 0, con las esquinas de la ficha vía `--photo-radius`) mientras la
  imagen se asienta desde 1,08. Va en `EditorialPhoto` y en las fichas de la
  galería. Usa una línea de tiempo con nombre (`--photo`) porque la imagen,
  dentro de un marco recortado, no puede usar `view()` por sí misma.
* **`.photo-hover`**: al pasar el puntero, la foto se acerca a 1,04 en 0,7 s.
  Con `transform`, no con `scale`, para componerse con el asentamiento sin
  pisarlo. Sustituye al `group-hover:scale-[1.02]` de la galería.
* Las fotos de contenido llevan `rounded-lg`, como ya las fichas de la galería.
* Cabecera: asentamiento al cargar (escala 1,05 → 1 en 1,8 s; sin opacidad, no
  retrasa el LCP) y el acercamiento al desplazarse de §25.

Movimiento reducido: todo quieto y visible, comprobado. Se retiró `hero-open`.

### Verificado

`tsc --noEmit`, `eslint` y `next build --webpack` correctos. Nueve rutas en
1920 × 1080, 1440 × 900, 1440 × 780, 820 × 1180, 390 × 844 y 320 × 640: sin
desbordes, imágenes rotas ni errores de consola.

---

## 27. Auditoría completa: velocidad, SEO, accesibilidad y código — 1 de octubre de 2026

Pedido del cliente: revisar todo el sitio, corregir cada detalle, velocidad y
optimización, con las mejores prácticas. Método: medir primero (Lighthouse 12
sobre `next build`, en móvil y escritorio, ocho rutas), leer el código entero
y corregir solo lo que una medida o una prueba justificara. Cada cambio de
rendimiento se comparó contra la versión publicada (`4c94777`) servida a la
vez, con cinco pasadas alternas y la mediana: una sola pasada de Lighthouse
varía hasta 30 puntos en este entorno.

### Errores corregidos

* **El menú móvil no respondía al primer toque** si llegaba antes de terminar
  la precarga del panel: se montaba abierto y el efecto «cerrar al navegar» lo
  cerraba en el acto. Reproducido bloqueando `requestIdleCallback`; ahora solo
  cierra cuando la ruta cambia (`MobileNavDrawer`).
* **URLs canónicas, sitemap y robots apuntaban a `clinicamontalvo.net`**
  mientras el sitio vive en `clinicamontalvo.vercel.app`. Ahora salen de
  `lib/site-url.ts`, que en Vercel toma el dominio de producción del proyecto:
  al conectar el dominio propio cambia solo.
* **Sin imagen al compartir.** WhatsApp y Facebook mostraban el enlace sin
  vista previa. `public/og/clinica-montalvo.jpg` (1200 × 630, 96 KB), con la
  foto de portada, el isotipo y Montserrat, renderizada con Chromium. Cada
  página comparte con su propio título y URL (`pageMetadata`); antes heredaban
  los de la portada.
* **Blog y Staff médico, páginas vacías, se ofrecían a los buscadores.** Ahora
  `noindex, follow` y fuera del sitemap hasta que tengan contenido. Lighthouse
  marca SEO 66 en ellas: es el aviso del `noindex`, intencionado.
* **`medicalSpecialty: "Reproductive"`** no existe en schema.org; retirado.

### Rendimiento

* **Foto principal con `fetchPriority="high"`** y carga inmediata (`lcp` en
  `HeroMedia`), como recomienda la documentación de Next 16 frente a
  `preload`, que no le daba prioridad.
* **Animaciones fuera del hilo principal.** La cortina de las fotos animaba
  `clip-path` y el subrayado de las pestañas `width`: ninguna la mueve el
  compositor, se recalculaban en cada fotograma. Ahora un `::after` con
  `scale` y un subrayado de 1 px estirado con `scale`. Lighthouse: 0 animaciones
  no compuestas.
* **La regla de los 14 KB.** Medido en A/B, la portada empeoró 170 ms en el
  primer pintado con los metadatos nuevos: el HTML pasó de 13,6 a 14,9 KB y
  dejó de caber en el primer viaje de red (TCP envía unos 14,6 KB antes de
  esperar respuesta). Se recuperó sin perder nada útil: fuera `keywords` (Google
  la ignora), las etiquetas `twitter:` que repetían las de Open Graph, la HSTS
  duplicada (Vercel ya la envía) y X-Frame-Options (la cubre la CSP); los datos
  estructurados pasan de la portada a Sobre nosotros. Queda en 13,8 KB.
* **Descartado tras medirlo: `experimental.inlineCss`.** El HTML pasaba de 77 a
  158 KB y empeoraban LCP y TBT.
* **Sin tope en la precarga del menú**: forzarla a los 2 s la hacía coincidir
  con la carga.

Resultado, mediana de cinco pasadas en móvil contra la versión publicada:

| | Publicada | Nueva |
| :--- | ---: | ---: |
| Portada, primer pintado | 767 ms | 766 ms |
| Portada, LCP | 2.516 ms | **2.473 ms** |
| Portada, bloqueo (TBT) | 113 ms | **89 ms** |
| Servicios, bloqueo (TBT) | 215 ms | **183 ms** |

### Accesibilidad

* **Entradas por scroll con recorrido fijo** (6rem desde que asoman) y
  opacidad completa en el primer 45% del tramo (`reveal-in`). En porcentaje del
  bloque, uno más alto que la pantalla dejaba su primer párrafo atenuado
  mientras se leía en el móvil.
* **`overflow-clip` en la tarjeta de cierre.** Con `overflow-hidden`, la tarjeta
  era contenedor de desplazamiento y sus entradas se medían contra ella: con el
  recorrido fijo se quedaban a medio aparecer para siempre (lo detectó
  Lighthouse; corregido antes de publicar). Regla: para recortar alrededor de
  una entrada por scroll, `overflow-clip`, nunca `overflow-hidden`.
* **Botones táctiles de 44 px**: los del carrusel de fotos y los de redes en el
  pie medían 36.
* **Aviso conocido.** Un texto que cae justo en el borde inferior de la pantalla
  al cargar está a mitad de su entrada, y Lighthouse puede medirlo a media
  opacidad. Es propio de cualquier aparición por scroll con fundido y depende
  del tamaño de pantalla; la versión publicada lo tenía en dos páginas. Con el
  tramo acortado afecta solo a una franja de unos 40 px.

### Seguridad (`next.config.ts`)

CSP `frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action
'self'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy:
strict-origin-when-cross-origin` y `Permissions-Policy` sin cámara, micrófono ni
ubicación. Ninguna restringe scripts ni estilos, así que no pueden romper nada.

### Código

* `forwardRef` retirado de acordeón y panel lateral: en React 19 `ref` es una
  propiedad más.
* `Button` fija `type="button"` cuando dibuja un `<button>`.
* `themeColor` blanco, como la cabecera; `min-h-dvh` en lugar de `min-h-screen`.
* Retirado `SheetTrigger`, exportado y sin uso.

### Pendiente fuera del código

* **«Acceso para médicos»** (pie) enlaza a `resultados.107.175.132.15.nip.io`,
  un dominio de pruebas montado sobre una IP. Conviene un subdominio propio de
  la clínica antes de difundir el sitio.
* La foto de portada mide 2000 px; a todo el ancho en pantallas de alta
  densidad pide más. El pedido fotográfico ya lo recoge.

### Verificado

Lighthouse final, ocho rutas: rendimiento 99–100 en escritorio y 90–99 en
móvil; accesibilidad, buenas prácticas y SEO 100 (salvo el `noindex` de Blog
y Staff). Menú móvil abre al primer toque con la precarga bloqueada. Subrayado
de pestañas medido al píxel. `tsc --noEmit`, `eslint` y `next build --webpack`
correctos.

---

## 28. Navegación sin parpadeo y fotografías de la clínica — 1 de octubre de 2026

Sustituye la navegación descrita en §17 y la portada fotográfica de §26.
El detalle técnico, mapa de las siete fotos y referencias está en
[docs/navegacion-y-fotografias-2026-10-01.md](./docs/navegacion-y-fotografias-2026-10-01.md).

* **Parpadeo reproducido desde scroll profundo:** React capturaba las secciones
  por separado, con animaciones predeterminadas de 250 ms. El CSS de `root` no
  las gobernaba; la captura saliente pasaba por encima de la cabecera.
* **Una captura por ruta:** `template.tsx` tiene un contenedor único y clases
  `route-enter` / `route-exit`. Salida opaca y entrada de 160 ms. La cabecera
  `data-site-header` ocupa una capa quieta con z-index propio. Se desactiva la
  animación residual de `root`. El historial y las anclas siguen a cargo de Next.
* **Navegación:** precarga de la foto principal al señalar/enfocar un enlace,
  omitida con ahorro de datos/2G (`lib/route-images.ts`). `NavigationHint` muestra
  actividad solo si la ruta tarda más de 120 ms. El menú móvil abre/cierra en
  280/180 ms y devuelve el foco al botón con `preventScroll`.
* **Inicio:** texto y acciones permanentes, fachada real como primera imagen,
  recorrido de tres fotografías y franja con horario, emergencias y teléfono.
* **Sobre nosotros:** exterior en la cabecera y galería de tres fotos del equipo,
  sin identificar a personas ni atribuirles especialidades.
* **Atención al paciente:** acceso en la cabecera y fotografía del letrero de
  emergencias junto a Admisión. La página y el retrato del doctor se conservan.
* **Carrusel:** barra de siete segundos, controles de 44 px, pausa, fundido de
  600 ms y espera de decodificación antes de cambiar. Se detiene fuera de
  pantalla, con la pestaña oculta, al pasar el puntero o usar el teclado. Con
  movimiento reducido funciona solo manualmente. Sin dependencias nuevas.
* **Archivos:** siete copias públicas en `public/images/clinica/`, con fecha en
  el nombre para respetar la caché anual. Originales intactos en `Imagenes/`.
* **Verificación:** ocho comprobaciones funcionales en Chromium y las ocho
  rutas a 320, 390, 820 y 1440 px, sin desbordes, imágenes rotas ni errores de
  JavaScript. Atrás/Adelante conserva las posiciones. ESLint, TypeScript y
  compilación de producción correctos. Safari y Firefox no probados esta sesión.
