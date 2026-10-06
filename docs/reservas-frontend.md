# Solicitud de consulta por WhatsApp (`/reservar`)

Sustituye, el 5 de octubre de 2026, a la demostración con datos ficticios del 4
de octubre (siete pasos, pago de ejemplo). Decisión del propietario: **solicitud
real por WhatsApp**, no reserva en línea.

## Por qué no es una reserva

La agenda real vive en el sistema de la clínica (ScriptCase/FileMaker), que la
landing no ve. Mostrar «horas libres» sería prometer cupos que nadie comprobó.
La paciente elige un **día y un momento preferidos** y envía la solicitud por
WhatsApp con todo escrito; la clínica confirma la hora en el chat. Sin pagos.

## Recorrido (5 pasos)

Especialidad → Profesional → Día → Sus datos → Enviar.

- **Especialidad**: las activas del CRM, con buscador desde siete. Siempre
  existe «No sé qué especialidad necesito», que salta el paso de profesional.
  Una especialidad sin médicos publicados también lo salta («La clínica le
  asigna profesional»).
- **Profesional**: «Sin preferencia» o un médico publicado, con horario
  (`resumenHorario`), próxima ausencia y precio de consulta reales.
- **Día**: los próximos 14 días en fecha civil de Bolivia. Con horario
  publicado, solo los días que atiende (ausencias excluidas); sin horario, todos.
  Franjas mañana / tarde / cualquiera, partidas a mediodía y con las horas
  reales del médico; sin horario, sin horas inventadas.
- **Sus datos**: nombre (obligatorio), carnet (opcional) y comentario (300
  caracteres). Nada se guarda: los datos van solo en el mensaje.
- **Enviar**: resumen editable, vista previa del mensaje y un enlace `wa.me`
  (no `window.open`: en el teléfono abre la app). Tras pulsarlo, confirmación
  que dice la verdad: la cita queda agendada cuando la clínica la confirma.

`?medico=<slug>` (desde la ficha) arranca en el paso Día; `?especialidad=<slug>`
(directorio, especialidades, promociones) en Profesional. Un slug que ya no está
publicado se ignora.

## Archivos

- `app/reservar/page.tsx`: lee el catálogo del CRM en el servidor (ISR) y lo
  pasa entero al recorrido; no hay peticiones desde el navegador ni estados de
  carga.
- `booking/components/ReservaConParametros.tsx`: lee los parámetros con
  `useSearchParams` dentro de `<Suspense>`; el respaldo es el recorrido sin
  preelección, que es lo que sale en el HTML.
- `booking/state.ts`: reductor (cambiar algo invalida lo que depende de ello,
  nunca los datos de la paciente), días y franjas, validación, preelección y el
  texto del mensaje. `booking/booking.test.ts` lo cubre.
- `booking/components/`: `BookingFlow`, `SelectionSteps`, `PatientStep`.

El botón flotante de WhatsApp sigue oculto en esta ruta.

## Pendiente

- Reconocer la solicitud en la ingesta del CRM (hoy llega como un mensaje de
  texto con etiquetas, legible por una persona).
- Reservas con cupos reales cuando se integre la agenda de la clínica.
