# Pedido de fotografía — Clínica Montalvo

Documento para **Marketing**. Todo lo que la web necesita para quedar completa,
ordenado **página por página** y numerado por importancia.

Las medidas no son estimaciones: están tomadas del sitio ya construido, medido a
1920, 1440 y 412 px de ancho.

**Total: 13 fotografías sueltas + 3 galerías de habitación (de 5 a 8 fotos cada
una).**

---

## Anchos de entrega — resumen

| Tipo de foto | Ancho a entregar | Proporción |
| :--- | ---: | :--- |
| Cabecera de página | **2560 px** (mínimo 1920) | 2560 × 1200 |
| Portada, foto principal | **1600 px** | 1600 × 1600 (cuadrada) |
| Portada, internación | **1600 px** | 1600 × 1200 (4:3) |
| Habitación, foto principal | **2000 px** | 2000 × 1500 (4:3) |
| Habitación, resto de galería | **1600 px** | 1600 × 1200 (4:3) |

Más grande siempre es bienvenido: el sitio reduce, **nunca amplía**. Quedarse
corto sí se nota, sobre todo en las cabeceras, que ocupan todo el ancho de la
pantalla.

---

## Orden de prioridad

Si hay que ir por partes, este es el orden que más rápido mejora el sitio.

| # | Fotografía | Página | Por qué va aquí |
| :-- | :--- | :--- | :--- |
| **01** | `portada/principal.jpg` | Portada | Es la primera imagen que ve cualquier visitante |
| **02** | `habitaciones/gold/principal-1.jpg` | Servicios | Las suites son el argumento comercial y hoy es el hueco más grande |
| **03** | `habitaciones/silver/principal-1.jpg` | Servicios | |
| **04** | `habitaciones/bronce/principal-1.jpg` | Servicios | |
| **05** | `cabeceras/servicios.jpg` | Servicios | La página más visitada después de la portada |
| **06** | `portada/internacion.jpg` | Portada | Cierra la portada |
| **07** | Resto de galería Gold | Servicios | Activa el visor a pantalla completa |
| **08** | Resto de galería Silver | Servicios | |
| **09** | Resto de galería Bronce | Servicios | |
| **10** | `cabeceras/dr-montalvo.jpg` | Dr. Montalvo | |
| **11** | `cabeceras/especialidades.jpg` | Especialidades | |
| **12** | `cabeceras/sobre-nosotros.jpg` | Sobre nosotros | |
| **13** | `cabeceras/atencion-al-paciente.jpg` | Atención al paciente | |

---

# Página por página

## `/` — Portada

Dos fotografías. Es la página que más se ve.

### 01 · `portada/principal.jpg` — **1600 × 1600 px**

Ocupa la mitad derecha de la apertura, junto al titular *«Su salud, con atención
cercana»*.

**Qué mostrar:** atención cercana y trato humano. Una persona siendo atendida,
una consulta real. No una sala vacía.

**Encuadre — es la foto más exigente del pedido:**

```
   ESCRITORIO          MÓVIL
   640 × 630 px        412 × 258 px
   ┌─────────┐         ┌───────────────┐
   │         │         │               │   Pasa de cuadrada
   │  CASI   │         │   APAISADA    │   a apaisada.
   │CUADRADA │         │               │   Deje aire por los
   └─────────┘         └───────────────┘   CUATRO lados.
```

Sujeto centrado y con margen generoso. Un recorte ajustado se romperá en uno de
los dos formatos.

### 06 · `portada/internacion.jpg` — **1600 × 1200 px (4:3)**

Bloque *«Un espacio para recuperarse. Y estar en familia»*. Se ve a 576 × 432 px
en escritorio.

**Qué mostrar:** vista amplia de una suite, vacía y ordenada. Verticales rectas,
sin distorsión de gran angular.

---

## `/servicios` — Servicios e internación

La página más importante después de la portada, y la que más material necesita:
**una cabecera y tres galerías completas**.

### 05 · `cabeceras/servicios.jpg` — **2560 × 1200 px**

**Qué mostrar:** escena de atención médica real — consulta, sala de espera,
pasillo clínico.

Ver más abajo **«Cómo se recorta una cabecera»**: son las fotos más difíciles
del pedido.

### 02 · 03 · 04 · 07 · 08 · 09 — Las tres galerías de habitación

| Carpeta | Suite | Rasgos que deben verse |
| :--- | :--- | :--- |
| `habitaciones/gold/` | Gold Deluxe Suite | La más espaciosa, sala jardín |
| `habitaciones/silver/` | Silver Suite | Sala de estar amplia, balcón con ventanales |
| `habitaciones/bronce/` | Suite Bronce | Individual, luminosa, baño independiente |

**De 5 a 8 fotografías por suite.** Nombres exactos:

| Archivo | Contenido | Ancho | Prioridad |
| :--- | :--- | ---: | :--- |
| `principal-1.jpg` | La mejor vista general | **2000 px** | 02 / 03 / 04 |
| `principal-2.jpg` | Segunda vista general | 2000 px | 07 / 08 / 09 |
| `galeria-1.jpg` | Baño | 1600 px | 07 / 08 / 09 |
| `galeria-2.jpg` | Zona de estar o balcón | 1600 px | 07 / 08 / 09 |
| `galeria-3.jpg` | Detalle: frigobar, TV, mueblería | 1600 px | 07 / 08 / 09 |
| `galeria-4.jpg` | Sala jardín *(solo Gold)* | 1600 px | 07 |

`principal-1.jpg` manda: se ve grande en escritorio (≈ 605 × 480 px) y es la
primera del carrusel en móvil. Las demás salen pequeñas (≈ 288 × 236 px) y a
pantalla completa al ampliarlas.

**Cómo fotografiar una habitación:**

- Cama hecha, luces encendidas, persianas abiertas, **sin personal ni pacientes**
- Sin objetos personales, carros de limpieza, cables ni papeleras a la vista
- Cámara a la altura del pecho y **verticales rectas** — nada de inclinar
- Gran angular moderado: un 16 mm deforma la habitación y se nota
- **Las tres suites el mismo día y con la misma luz**, o parecerán de tres
  hoteles distintos

---

## `/dr-montalvo` — Dr. Montalvo

### 10 · `cabeceras/dr-montalvo.jpg` — **2560 × 1200 px**

**Retrato ambiental**, no primer plano: el Dr. Montalvo en su consulta o junto al
equipo. En este formato tan apaisado un primer plano vertical no cabe.

El Dr. Montalvo **a la derecha del encuadre** — su nombre se pinta a la
izquierda.

---

## `/especialidades` — Especialidades

### 11 · `cabeceras/especialidades.jpg` — **2560 × 1200 px**

Consulta médica; profesional atendiendo. Sujeto a la derecha.

---

## `/sobre-nosotros` — Sobre nosotros

### 12 · `cabeceras/sobre-nosotros.jpg` — **2560 × 1200 px**

Equipo médico o fachada e instalaciones. Sujeto a la derecha.

---

## `/atencion-al-paciente` — Atención al paciente

### 13 · `cabeceras/atencion-al-paciente.jpg` — **2560 × 1200 px**

Recepción, admisión o bienvenida. Sujeto a la derecha.

---

## `/blog` y `/staff-medico`

**No necesitan fotografía por ahora.** Llevan una cabecera de marca terminada.
Cuando haya artículos y directorio médico se pedirán aparte: retratos del staff
y portadas de artículo.

---

# Cómo se recorta una cabecera

Las cinco cabeceras (05, 10, 11, 12, 13) son las fotos **más difíciles del
pedido**, porque se recortan de forma muy distinta según la pantalla:

```
   ESCRITORIO 1920 px                      MÓVIL 412 px
   ┌────────────────────────────────┐      ┌──────────┐
   │  TITULAR       │               │      │ TITULAR  │
   │  encima        │    libre      │      │ encima   │
   └────────────────────────────────┘      │          │
    1920 × 395 px  ← franja muy ancha      │  libre   │
                                           └──────────┘
                                            412 × 392 px  ← casi cuadrada
```

**Tres reglas, y las tres importan:**

1. **El sujeto va a la derecha.** El titular y las migas de navegación se pintan
   sobre la mitad izquierda. Deje ese lado tranquilo: pared, fondo desenfocado,
   suelo. Nada importante a la izquierda.
2. **Aire arriba y abajo.** En escritorio solo se ve una franja central. Todo lo
   que quede en los bordes superior e inferior se pierde. Componga holgado.
3. **Entregue la foto clara.** Lleva un velo verde oscuro encima para que el
   texto blanco se lea; una foto ya oscura quedará casi negra.

---

# Cómo entregar

| | |
| :--- | :--- |
| **Formato** | **JPG o PNG originales, sin comprimir.** El sitio genera solo las versiones AVIF y WebP en todos los tamaños. **No envíe WebP ya comprimido**: recomprimir pierde calidad dos veces. |
| **Perfil de color** | **sRGB.** Un perfil Adobe RGB se ve desaturado en el navegador. |
| **Nombre de archivo** | Exactamente el de este documento. Minúsculas, sin espacios, sin acentos, sin eñes. |
| **Sin texto incrustado** | Ni rótulos, ni logotipo, ni marca de agua. El sitio pone su propia tipografía encima. |
| **Sin marco** | Ni esquinas redondeadas, ni sombras, ni bordes blancos. El sitio los aplica. |
| **Derechos** | Cada persona reconocible necesita autorización de uso de imagen firmada. |

### Tratamiento visual

Todas las fotos van a convivir en la misma página, así que deben parecer de la
misma sesión: **luz natural, temperatura neutra o ligeramente cálida, exposición
alta y contraste suave**. Nada de filtros de moda, viñeteados ni azules fríos.

El sitio es blanco, verde `#006156` y líneas finas. Una fotografía saturada o muy
contrastada rompe el conjunto.

### Estructura de carpetas

Entregue **exactamente** esta estructura. Si un archivo no coincide en nombre o
ubicación, no aparece en la web.

```
images/
├── portada/
│   ├── principal.jpg          01
│   └── internacion.jpg        06
├── cabeceras/
│   ├── servicios.jpg          05
│   ├── dr-montalvo.jpg        10
│   ├── especialidades.jpg     11
│   ├── sobre-nosotros.jpg     12
│   └── atencion-al-paciente.jpg   13
└── habitaciones/
    ├── gold/
    │   ├── principal-1.jpg    02
    │   ├── principal-2.jpg
    │   └── galeria-1.jpg … galeria-4.jpg
    ├── silver/                03  (igual, sin galeria-4)
    └── bronce/                04  (igual, sin galeria-4)
```

Junto a las fotos, un **`creditos.txt`** con: fotógrafo, fecha, y si hay personas
reconocibles y su autorización está firmada.

---

# Lo que NO sirve

- **Banco de imágenes genérico.** Un médico sonriente de stock se reconoce al
  instante y resta credibilidad a una clínica real.
- **Fotos de teléfono con flash.** El flash directo aplana la escena y amarillea.
- **Capturas de Instagram o de WhatsApp.** Llegan recomprimidas y a 1080 px.
- **WebP ya comprimido.** Ver «Cómo entregar».
- **Fotos con texto, logotipo o marca de agua.**
- **Collages** o fotos ya montadas en marcos y mockups.
- **Personas sin autorización firmada**, incluido el personal de la clínica.
- **Fotos oscuras o nocturnas** para cabeceras: llevan un velo verde encima.
- **Habitaciones con gente dentro** o con objetos personales a la vista.

---

# Nota interna — cómo activar cada foto

*(No es necesario para Marketing.)*

Los huecos ya están reservados, así que **no se descoloca nada** al rellenarlos.

**Cabeceras y portada** — en `content/images.ts`, cambiar `src: null` por la ruta
y escribir el `alt`:

```ts
servicios: {
  src: "/images/cabeceras/servicios.jpg",
  alt: "Sala de espera de Clínica Montalvo con luz natural",
  position: "center 38%",   // sube o baja el encuadre si el sujeto se corta
},
```

Correspondencia de claves: `inicio` → `portada/principal.jpg` ·
`habitaciones` → `portada/internacion.jpg` · `nosotros` →
`cabeceras/sobre-nosotros.jpg` · `pacientes` →
`cabeceras/atencion-al-paciente.jpg` · `doctor` → `cabeceras/dr-montalvo.jpg`.

**Habitaciones** — en `content/rooms.ts`, rellenar el array `images: []`:

```ts
images: [
  { src: "/images/habitaciones/gold/principal-1.jpg",
    alt: "Suite Gold Deluxe con cama matrimonial y sala de estar",
    role: "principal" },
  { src: "/images/habitaciones/gold/galeria-1.jpg",
    alt: "Baño privado de la suite Gold",
    role: "galeria" },
],
```

Con el array vacío se muestra un panel de marca; en cuanto hay fotos, la galería
y el visor a pantalla completa se activan solos.

El `alt` **no es opcional**: lo lee quien navega con lector de pantalla y lo usa
Google. Describa lo que se ve, sin empezar por «foto de».

Después de cargarlas, revise a **412 px y a 1440 px** que ningún sujeto quede
cortado, y ajuste `position` si hace falta.

**Los 18 `.webp` que hay ahora** en `habitaciones/` y `servicios/` son maquetas
con notas de producción, no fotografías. Por eso el sitio no los publica. Se
borran en cuanto lleguen las reales.
