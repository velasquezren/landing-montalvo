# Revisión local de reservas — 6 de octubre de 2026

## Cambios recibidos

Repositorios actualizados mediante avance directo, conservando los archivos
locales existentes:

| Repositorio | main recibido | Cambio relevante |
| --- | --- | --- |
| backend-crm-montalvo | f05efdd | Menús por línea, piloto de interacciones, solicitud mediante Flow y cobros de promociones |
| frontend-crm-montalvo | b619f6c | Editor de menú/cobro por línea y revisión de pagos en conversación |
| landing-montalvo | 37f3a47 | Catálogo público del CRM y solicitud por WhatsApp en `/reservar` |
| backend-resultados-montalvo | ec0480f | Comprobaciones de adjuntos en CI |

La landing ya estaba actualizada. No se revirtieron commits ni se mezcló la rama
antigua de preparación Meta con los cambios posteriores de main.

## Diferencia funcional que debe resolverse con el propietario

El commit 37f3a47 sustituyó la demostración de reserva de siete pasos por una
solicitud de cinco pasos que abre WhatsApp. Conserva el catálogo publicado del
CRM y recoge día/franja preferidos, pero no consulta cupos ni registra citas.

El horario semanal y las ausencias del directorio permiten orientar la elección;
no prueban que un turno esté libre. El Flow de citas del CRM recoge preferencias
y las presenta al personal como solicitud. Tampoco confirma una reserva.

El propietario manifestó disconformidad con el cambio, sin precisar todavía si
quiere recuperar el prototipo de hora exacta o integrar la agenda existente.
No se restauró una reserva ficticia ni se conectó el VPS por suposición.

## Correcciones locales

- Reinicio completo al hacer otra solicitud; volver a editar sigue conservando
  los datos válidos.
- Enlaces a especialidades sin médicos omiten la elección de profesional,
  igual que la navegación normal.
- Progreso ajustado a los pasos efectivamente visibles; editar profesional en
  una especialidad sin médicos lleva a elegir especialidad.
- Tras pulsar WhatsApp, instrucciones para completar/reintentar el envío, sin
  afirmar que la aplicación se abrió o que la clínica recibió el mensaje.
  El resumen permanece editable.
- Un precio vacío se interpreta como desconocido, nunca como Bs 0. Un cero
  explícito sigue siendo válido.
- Fechas civiles imposibles se descartan antes de mostrarlas en fichas,
  promociones o ausencias.
- Imágenes del catálogo respetan también la ruta `/publico/` y las restricciones
  de parámetros del optimizador de Next; las rechazadas usan los respaldos existentes.

No se añadieron librerías ni se cambiaron estilos, infraestructura o backends.

## Validación ejecutada

- Landing: 22 pruebas aprobadas, incluidas cinco regresiones reproducidas antes
  de aplicar las correcciones. Lint, TypeScript y build aprobados.
- Build con `CRM_API_URL=http://127.0.0.1:3199`, catálogo sintético en localhost.
  No usa el CRM real ni el VPS de agenda.
- Chromium local, 360/390/412/1440 px: selección explícita de franja, navegación
  por datos y resumen, precio visible, intento de apertura bloqueado de WhatsApp,
  reinicio completo, enlace sin médicos y vuelta a especialidad con médicos.
  Sin overflow horizontal, excepciones JS, peticiones externas, escrituras de
  red ni almacenamiento local/de sesión durante ese recorrido.
- Evidencia temporal: `/tmp/montalvo-review-evidence/results.json` y capturas en
  esa carpeta; scripts `/tmp/montalvo-review-catalog.mjs` y
  `/tmp/montalvo-review-browser.mjs`. Son artefactos locales, no parte del despliegue.
- CRM: 46 pruebas unitarias de piloto por línea, promociones, menú y reglas de
  cobro; 12 pruebas del validador de Flows y `check:flows`, aprobadas.

No se repitió la suite completa de integración PostgreSQL del CRM: su código no
se modificó en esta revisión. Las pruebas anteriores registradas en sus documentos
no se presentan como ejecutadas de nuevo.

## Alcance pendiente

Definir el comportamiento esperado de reservas antes de rehacerlo. Verificar y
conectar disponibilidad real requiere una tarea específica; esta revisión no
accede al VPS, no prueba operaciones con pacientes y no publica nada.
