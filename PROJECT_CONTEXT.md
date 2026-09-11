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
* **`SocialIcons.tsx`**: SVGs limpios y accesibles para Facebook, Instagram, TikTok, YouTube y WhatsApp.

### Layout (`components/layout/`)
* **`Header.tsx`**: **Componente de servidor.** Barra fija blanca con logotipo, navegación y reserva de cita. Menú completo desde 1280px; drawer por debajo. Solo delega en cliente las dos piezas que lo necesitan (`MainNav`, `MobileNav`).
* **`MainNav.tsx`**: Enlaces de escritorio. Única parte de la cabecera que lee `usePathname`, y por tanto lo único que viaja como JavaScript. Exporta `isActivePath`, compartida con el drawer.
* **`Footer.tsx`**: Pie de página institucional sobre fondo blanco con hairlines de 1px. Contiene el logotipo, enlaces a todas las páginas, datos de contacto, horarios y derechos.
* **`MobileNav.tsx`**: Solo el botón de hamburguesa. Pide `MobileNavDrawer` en el primer hueco libre del hilo principal (`requestIdleCallback`), de modo que Radix Dialog no entra en el paquete inicial de ninguna página.
* **`MobileNavDrawer.tsx`**: Drawer lateral sobre Radix Dialog/Sheet, controlado desde `MobileNav`. Navegación escalonada por CSS (`.stagger-item`), botones rápidos para cita o WhatsApp y datos de guardia. Se cierra al navegar.
* **`WhatsAppFloat.tsx`**: Botón flotante accesible de WhatsApp. Un testigo de 420px al inicio del documento y un `IntersectionObserver` lo muestran al superar el héroe: el navegador avisa al cruzar el umbral, no en cada fotograma de scroll.

### Secciones (`components/sections/`)
* **`PageHero.tsx`**: Encabezado visual de página de renderizado del lado servidor (RSC). Soporta fotografía editorial configurable o textura de marca, migas de pan y metadatos al pie. Mantiene alturas equivalentes con y sin imagen; el texto aparece sin retrasos individuales.
* **`HeroBackdrop.tsx`**: Componente de servidor con Next Image y un velo de contraste constante, sin paralaje ni JavaScript de scroll.
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
* **`CtaBand.tsx`**: Franja de cierre de página en verde oscuro con titular personalizable, botón directo a WhatsApp y enlace de llamada telefónica.
* **`SectionHeader.tsx`**: Encabezado estándar con numeración de sección (`01`, `02`), antetítulo en mayúsculas (`label`), titular y descripción.
* **`TierDot.tsx`**: Punto coloreado que distingue visualmente las categorías Gold, Silver y Bronce.
* **`PagePlaceholder.tsx`**: Plantilla para secciones pendientes (`/staff-medico`, `/blog`), explicando qué contenido está en preparación y ofreciendo vías de contacto alternativas para no perder al visitante.

### UI Primitivas (`components/ui/`)
* **`button.tsx`**: Botón polimórfico (`asChild` vía `@radix-ui/react-slot`) con variantes (`default`, `inverse`, `inverseOutline`, `ghost`) y tamaños calibrados. Es componente de servidor: no usa estado ni APIs del navegador, así que en las páginas que no hidratan nada se resuelve en el servidor.
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

---

## 8. Recursos Estáticos (`public/`)

* `/images/logo/isotipo.svg`: Isotipo vectorial original de Clínica Montalvo.
  Es la fuente de la que derivan todos los iconos de aplicación.
* `/icons/icon-192.png`, `/icons/icon-512.png`: Iconos del manifiesto.
* `/icons/icon-maskable-512.png`: Variante a sangre para el recorte de Android.
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

### Marca calada en blanco sobre baldosa verde

En el CRM el isotipo va en verde `#006156` sobre fondo transparente. Sobre una
pestaña oscura —el modo por defecto de mucha gente— eso es verde oscuro sobre
casi negro: el icono desaparece. Aquí la marca va calada en blanco sobre una
baldosa del verde corporativo, que se distingue igual en pestaña clara y oscura
y además hace el icono localizable de un vistazo en una tira de pestañas.

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
