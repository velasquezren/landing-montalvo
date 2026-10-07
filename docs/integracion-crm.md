# La landing y el CRM

Desde el 5 de octubre de 2026 la landing lee del CRM de la clínica
(`backend-crm-montalvo`) lo que cambia: promociones, especialidades, médicos,
horarios y precios. Lo institucional (historia, habitaciones, Dr. Montalvo)
sigue en `content/`.

## Qué página lee qué

| Página | Del CRM | Si no hay nada publicado |
| :--- | :--- | :--- |
| `/` | Hasta tres promociones (destacadas primero) | La sección no aparece |
| `/promociones` | Todas las vigentes en el canal landing | Aviso honesto + solicitar consulta; `noindex` |
| `/promociones/[slug]` | Una promoción: banner, precio, condiciones, médicos | 404 |
| `/staff-medico` | Médicos publicados, agrupados por especialidad | `PagePlaceholder`; `noindex` |
| `/staff-medico/[slug]` | Ficha: foto, trayectoria, horario, ausencias, precio | 404 |
| `/especialidades` | Sección 02 con las especialidades activas | La sección no aparece |
| `/reservar` | Especialidades y médicos para la preparación opcional del mensaje | Agenda existente y WhatsApp directo siguen accesibles |
| `/sitemap.xml` | Una URL por promoción y por médico | Solo las páginas fijas |

## Cómo se pide (`lib/crm/`)

- `config.ts`: `CRM_API_URL` (por defecto la API de producción). La usan la capa
  de datos y `next.config.ts` (`images.remotePatterns`, solo `/publico/**`).
- `api.ts` (`server-only`): `fetch` con `next: { revalidate: 300, tags }` y
  `React.cache` para que página y `generateMetadata` pidan una vez. Recorre
  todas las páginas de un listado (100 por página, tope 500).
- `normalizar.ts`: de la respuesta cruda a `tipos.ts`. Un registro sin slug o
  nombre se descarta; un campo opcional malformado queda ausente; una imagen de
  otro origen se descarta (next/image respondería 400). Probado en `crm.test.ts`.

El navegador nunca llama al CRM: todo sale prerenderizado (ISR).

## Frescura

1. **Al instante**: al publicar, pausar, archivar o editar algo visible, el CRM
   llama a `POST /api/revalidar` con `Authorization: Bearer
   <CRM_REVALIDAR_SECRETO>` y `{ "etiquetas": ["promociones" | "directorio"] }`.
   La ruta hace `revalidateTag(etiqueta, { expire: 0 })`: la siguiente visita ya
   no ve lo anterior (una promoción pausada por un precio mal escrito no se
   sirve ni una vez más).
2. **Red de seguridad**: cada 5 minutos (`export const revalidate = 300` en cada
   página que lee del CRM, igual a `REVALIDAR_SEGUNDOS`). Cubre un aviso perdido
   y las promociones que vencen a medianoche.

Sin `CRM_REVALIDAR_SECRETO`, la ruta responde 503 y solo funciona el punto 2.

## Si el CRM no responde

- **Página ya generada**: Next sigue sirviendo la última versión buena y
  reintenta en la siguiente visita (se lanza el error a propósito; devolver una
  lista vacía publicaría «no hay promociones»).
- **Durante `next build`**: se registra y se publica vacío, para que una caída
  del CRM no bloquee un despliegue; se regenera sola a los 5 minutos.
- **Página nunca generada** (una ficha que nadie visitó) con el CRM caído:
  responde 500 hasta que vuelva. Es el único caso sin respaldo, y raro.

## Variables de entorno (Vercel)

| Variable | Para qué | Si falta |
| :--- | :--- | :--- |
| `CRM_API_URL` | Origen de la API pública del CRM | Producción (`crm.107.175.132.15.nip.io`) |
| `CRM_REVALIDAR_SECRETO` | Secreto compartido con el CRM (`LANDING_REVALIDAR_SECRETO` allí) | Solo renovación por tiempo |

## Probado

`pnpm test` (17 pruebas: normalización y solicitud), `pnpm lint`, `pnpm
typecheck`, `pnpm build`. Además, contra un CRM falso local con datos: las ocho
rutas responden con su contenido; `/staff-medico/no-existe` y slugs imposibles
dan 404 sin preguntar al CRM; el aviso con secreto incorrecto da 401 y con el
correcto retira al instante una promoción pausada de la portada, el listado y
su página; con el CRM caído, lo ya generado sigue en 200.
