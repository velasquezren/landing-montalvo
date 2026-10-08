import { test } from "node:test";
import assert from "node:assert/strict";
import type { MedicoPublico } from "../lib/crm/tipos.ts";
import {
  diaSemanaDe,
  estadoDelDia,
  franjasDelDia,
  hoyEnBolivia,
  mensajeDeSolicitud,
  pasoAlcanzable,
  proximosDias,
  solicitudInicial,
  solicitudReducer,
  solicitudVacia,
  validarPaciente,
} from "./state.ts";
import type { CatalogoReserva, SolicitudDraft } from "./types.ts";

const ginecologia = { slug: "ginecologia", nombre: "Ginecología" };
const pediatria = { slug: "pediatria", nombre: "Pediatría" };

function medico(datos: Partial<MedicoPublico> & { slug: string }): MedicoPublico {
  return {
    nombre: `Dra. ${datos.slug}`,
    resumen: null,
    especialidades: [ginecologia],
    fotoUrl: null,
    precioConsulta: 250,
    horario: [],
    resumenHorario: "Con cita a solicitud",
    agendaMedicoId: null,
    ausencias: [],
    ...datos,
  };
}

// Lunes, miércoles y viernes por la mañana; miércoles también por la tarde.
const ana = medico({
  slug: "ana",
  horario: [
    { diaSemana: 1, desde: "08:00", hasta: "12:00", lugar: null },
    { diaSemana: 3, desde: "10:00", hasta: "13:00", lugar: null },
    { diaSemana: 3, desde: "15:00", hasta: "18:00", lugar: null },
    { diaSemana: 5, desde: "08:00", hasta: "11:30", lugar: null },
  ],
  ausencias: [{ desde: "2026-10-16", hasta: "2026-10-16", motivo: "Congreso" }],
});
const sinHorario = medico({ slug: "sin-horario", precioConsulta: null });
const pediatra = medico({ slug: "pedro", especialidades: [pediatria] });

const catalogo: CatalogoReserva = {
  especialidades: [
    { ...ginecologia, descripcion: null, medicos: 2 },
    { ...pediatria, descripcion: null, medicos: 1 },
  ],
  medicos: [ana, sinHorario, pediatra],
};

const paciente = { nombre: "María Pérez", carnet: "1234567 SC", observaciones: "Es un control." };

// 2026-10-12 es lunes; 2026-10-14, miércoles; 2026-10-16, viernes.
function completa(): SolicitudDraft {
  let d = solicitudReducer(solicitudVacia(), {
    tipo: "especialidad",
    valor: { tipo: "especialidad", especialidad: ginecologia },
  });
  d = solicitudReducer(d, { tipo: "profesional", valor: { tipo: "medico", medico: ana } });
  d = solicitudReducer(d, { tipo: "fecha", valor: "2026-10-14" });
  d = solicitudReducer(d, { tipo: "franja", valor: "manana" });
  return solicitudReducer(d, { tipo: "paciente", valor: paciente });
}

test("la fecha de hoy es la de Bolivia, no la del dispositivo", () => {
  // 03:00 UTC del 13 son las 23:00 del 12 en Bolivia (UTC−4).
  assert.equal(hoyEnBolivia(new Date("2026-10-13T03:00:00Z")), "2026-10-12");
  assert.equal(hoyEnBolivia(new Date("2026-10-13T04:00:00Z")), "2026-10-13");
});

test("los próximos días cruzan meses y años sin saltarse ninguno", () => {
  const dias = proximosDias("2026-12-25", 14);
  assert.equal(dias.length, 14);
  assert.equal(dias[0], "2026-12-25");
  assert.equal(dias[7], "2027-01-01");
  assert.equal(diaSemanaDe("2026-10-12"), 1);
  assert.equal(diaSemanaDe("2026-10-18"), 7);
});

test("un día se ofrece según el horario y las ausencias publicadas", () => {
  assert.equal(estadoDelDia(ana, "2026-10-12"), "atiende");
  assert.equal(estadoDelDia(ana, "2026-10-13"), "no-atiende");
  assert.equal(estadoDelDia(ana, "2026-10-16"), "ausente");
  // Sin horario publicado o sin profesional elegido, lo coordina la clínica.
  assert.equal(estadoDelDia(sinHorario, "2026-10-13"), "a-coordinar");
  assert.equal(estadoDelDia(null, "2026-10-18"), "a-coordinar");
});

test("las franjas salen de los bloques del día, partidos a mediodía", () => {
  const miercoles = franjasDelDia(ana, "2026-10-14");
  assert.deepEqual(
    miercoles.map((o) => [o.franja, o.disponible, o.detalle]),
    [
      ["manana", true, "10:00–12:00"],
      ["tarde", true, "12:00–13:00 · 15:00–18:00"],
      ["indistinta", true, "Primer cupo"],
    ],
  );
  const lunes = franjasDelDia(ana, "2026-10-12");
  assert.equal(lunes[1].disponible, false, "el lunes no atiende por la tarde");
  assert.ok(franjasDelDia(ana, "2026-10-13").every((o) => !o.disponible), "el martes no atiende");
  // Sin horario no se inventan horas.
  assert.deepEqual(
    franjasDelDia(sinHorario, "2026-10-13").map((o) => o.detalle),
    ["Antes del mediodía", "Después del mediodía", "Primer cupo"],
  );
});

test("cambiar la especialidad invalida profesional y día, y conserva a la paciente", () => {
  const d = solicitudReducer(completa(), {
    tipo: "especialidad",
    valor: { tipo: "especialidad", especialidad: pediatria },
  });
  assert.equal(d.profesional, null);
  assert.equal(d.fecha, "");
  assert.equal(d.franja, null);
  assert.deepEqual(d.paciente, paciente);
});

test("elegir lo mismo no cambia nada; un médico de otra especialidad se rechaza", () => {
  const d = completa();
  assert.equal(solicitudReducer(d, { tipo: "profesional", valor: { tipo: "medico", medico: ana } }), d);
  assert.equal(solicitudReducer(d, { tipo: "profesional", valor: { tipo: "medico", medico: pediatra } }), d);
});

test("no se puede elegir un día en que no atiende ni una franja que no ofrece", () => {
  const d = completa();
  assert.equal(solicitudReducer(d, { tipo: "fecha", valor: "2026-10-13" }), d, "martes");
  assert.equal(solicitudReducer(d, { tipo: "fecha", valor: "2026-10-16" }), d, "ausente");
  const lunes = solicitudReducer(d, { tipo: "fecha", valor: "2026-10-12" });
  assert.equal(lunes.franja, "manana", "el lunes también hay mañana: se conserva");
  assert.equal(solicitudReducer(lunes, { tipo: "franja", valor: "tarde" }), lunes);
  const tarde = solicitudReducer(d, { tipo: "franja", valor: "tarde" });
  assert.equal(solicitudReducer(tarde, { tipo: "fecha", valor: "2026-10-12" }).franja, null);
});

test("pedir orientación deja el profesional a cargo de la clínica", () => {
  const d = solicitudReducer(completa(), { tipo: "especialidad", valor: { tipo: "orientacion" } });
  assert.deepEqual(d.profesional, { tipo: "indistinto" });
  assert.equal(pasoAlcanzable(d), 2);
});

test("los datos de la paciente: nombre obligatorio, carnet opcional pero válido", () => {
  assert.deepEqual(validarPaciente(paciente), {});
  assert.ok(validarPaciente({ ...paciente, nombre: " Al " }).nombre);
  assert.deepEqual(validarPaciente({ ...paciente, carnet: "" }), {});
  assert.ok(validarPaciente({ ...paciente, carnet: "<script>" }).carnet);
  assert.ok(validarPaciente({ ...paciente, observaciones: "x".repeat(301) }).observaciones);
});

test("el paso alcanzable avanza con lo elegido", () => {
  assert.equal(pasoAlcanzable(solicitudVacia()), 0);
  assert.equal(pasoAlcanzable(completa()), 4);
  assert.equal(pasoAlcanzable({ ...completa(), paciente: { ...paciente, nombre: "" } }), 3);
});

test("otra solicitud elimina también profesional, fecha y franja de la anterior", () => {
  const anterior = completa();
  const nueva = solicitudReducer(anterior, { tipo: "reiniciar" });
  assert.deepEqual(nueva, solicitudVacia());
  assert.equal(pasoAlcanzable(nueva), 0);
  assert.deepEqual(anterior.paciente, paciente, "no muta el borrador anterior");
});

test("el enlace a una especialidad sin médicos omite el paso de profesional", () => {
  const { draft, paso } = solicitudInicial({ ...catalogo, medicos: [] }, { especialidad: "pediatria" });
  assert.equal(paso, 2);
  assert.deepEqual(draft.profesional, { tipo: "indistinto" });
  assert.equal(pasoAlcanzable(draft), 2);
  assert.equal(draft.fecha, "");
});

test("un enlace con ?medico= arranca en el día, con su especialidad", () => {
  const { draft, paso } = solicitudInicial(catalogo, { medico: "ana" });
  assert.equal(paso, 2);
  assert.equal(draft.profesional?.tipo === "medico" && draft.profesional.medico.slug, "ana");
  assert.deepEqual(draft.especialidad, { tipo: "especialidad", especialidad: ginecologia });
  assert.equal(solicitudInicial(catalogo, { especialidad: "pediatria" }).paso, 1);
  // Un slug que ya no está publicado no rompe nada: se empieza de cero.
  assert.equal(solicitudInicial(catalogo, { medico: "retirado" }).paso, 0);
});

test("el mensaje de WhatsApp lleva cada dato en su línea, sin huecos", () => {
  assert.equal(
    mensajeDeSolicitud(completa()),
    [
      "Hola, Clínica Montalvo. Quisiera solicitar una consulta.",
      "",
      "Especialidad: Ginecología",
      "Profesional: Dra. ana",
      "Día preferido: miércoles 14 de octubre",
      "Horario preferido: Mañana (10:00–12:00)",
      "Paciente: María Pérez",
      "Carnet: 1234567 SC",
      "Comentario: Es un control.",
      "",
      "Enviado desde la web. Quedo a la espera de la confirmación.",
    ].join("\n"),
  );
  let orientacion = solicitudReducer(solicitudVacia(), { tipo: "especialidad", valor: { tipo: "orientacion" } });
  orientacion = solicitudReducer(orientacion, { tipo: "fecha", valor: "2026-10-13" });
  orientacion = solicitudReducer(orientacion, { tipo: "franja", valor: "indistinta" });
  orientacion = solicitudReducer(orientacion, { tipo: "paciente", valor: { nombre: "Ana  Rojas", carnet: "", observaciones: "" } });
  const mensaje = mensajeDeSolicitud(orientacion);
  assert.match(mensaje, /Especialidad: Necesito orientación\nProfesional: Sin preferencia\nDía preferido: martes 13 de octubre\nHorario preferido: Cualquier horario\nPaciente: Ana Rojas\n\nEnviado/);
  assert.doesNotMatch(mensaje, /Carnet|Comentario/);
});
