import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AgendaError,
  createAgendaBookingData,
  disponibilidadDeAgenda,
  medicoDeAgenda,
  diasDeAgenda,
  reservaDeAgenda,
} from "./agenda-data.ts";
import type { BookingDraft } from "./types.ts";

const json = (cuerpo: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(cuerpo), { status, headers: { "content-type": "application/json" } }));

test("un médico sin tarifa válida queda «a confirmar», nunca gratis", () => {
  const base = { id: "82", especialidadId: "abc", nombre: "Dra. Ana", horarioInformativo: null, modalidad: "ONLINE" };
  assert.equal(medicoDeAgenda({ ...base, precio: null })?.price, null);
  assert.equal(medicoDeAgenda({ ...base, precio: { importeCentavos: 0, moneda: "BOB" } })?.price, null);
  assert.equal(medicoDeAgenda({ ...base, precio: { importeCentavos: 25050, moneda: "BOB" } })?.price, 250.5);
  assert.equal(medicoDeAgenda({ ...base, modalidad: "A_SOLICITUD", precio: null })?.availability, "on-request");
  assert.equal(medicoDeAgenda({ nombre: "sin id" }), null);
});

test("la disponibilidad distingue sin atención, sin cupos y horas libres", () => {
  const base = { medicoId: "82", fecha: "2026-10-08", horarios: [] };
  assert.deepEqual(disponibilidadDeAgenda({ ...base, estado: "SIN_ATENCION" }, "82", "2026-10-08"), { status: "not-working", slots: [] });
  assert.deepEqual(disponibilidadDeAgenda({ ...base, estado: "SIN_CUPOS" }, "82", "2026-10-08"), { status: "full", slots: [] });
  const libres = disponibilidadDeAgenda({ ...base, estado: "DISPONIBLE", horarios: [{ hora: "09:30" }, { hora: "25:00" }] }, "82", "2026-10-08");
  assert.deepEqual(libres, { status: "available", slots: [{ id: "82_2026-10-08_09:30", time: "09:30" }] });
  // Una respuesta de otro médico o de otra fecha no se pinta.
  assert.throws(() => disponibilidadDeAgenda({ ...base, estado: "DISPONIBLE" }, "83", "2026-10-08"));
});

test("solo se ofrecen los días que la agenda da con horas libres", () => {
  assert.deepEqual(diasDeAgenda({ medicoId: "20", fechas: ["2026-10-08", "basura", "2026-10-09"] }, "20"), [
    { date: "2026-10-08", label: "jue", day: "8" },
    { date: "2026-10-09", label: "vie", day: "9" },
  ]);
  assert.throws(() => diasDeAgenda({ medicoId: "21", fechas: [] }, "20"));
});

test("la foto del médico llega como URL absoluta del CRM", () => {
  const base = { id: "20", especialidadId: "abc", nombre: "Dra. Lady", horarioInformativo: null, modalidad: "ONLINE", precio: null };
  assert.match(medicoDeAgenda({ ...base, fotoUrl: "/publico/agenda/fotos/20/0123456789abcdef" })?.photo ?? "", /^https:\/\/.+\/publico\/agenda\/fotos\/20\/0123456789abcdef$/);
  assert.equal(medicoDeAgenda({ ...base, fotoUrl: "https://crm.107.175.132.15.nip.io/publico/agenda/fotos/20/x" })?.photo, "https://crm.107.175.132.15.nip.io/publico/agenda/fotos/20/x");
  assert.equal(medicoDeAgenda({ ...base, fotoUrl: "javascript:alert(1)" })?.photo, undefined);
  assert.equal(medicoDeAgenda({ ...base, fotoUrl: null })?.photo, undefined);
});

test("la reserva se lee con su número, referencia y monto", () => {
  const r = reservaDeAgenda({
    codigo: 41, referencia: "41.1.x", medico: "Dra. Ana", fecha: "2026-10-08", hora: "09:30",
    estado: "PENDIENTE", pago: { precio: { importeCentavos: 30000, moneda: "BOB" }, bancoId: 7 },
  });
  assert.deepEqual(r, { code: 41, reference: "41.1.x", doctorName: "Dra. Ana", date: "2026-10-08", time: "09:30", amount: 300, bankId: 7 });
  assert.throws(() => reservaDeAgenda({ codigo: "41" }));
});

const draft: BookingDraft = {
  specialty: { id: "abc", name: "Cardiología", description: "" },
  doctor: { id: "82", specialtyId: "abc", name: "Dra. Ana", weeklySchedule: null, price: 300, availability: "online" },
  date: "2026-10-08",
  slot: { id: "82_2026-10-08_09:30", time: "09:30" },
  patient: { name: "María Pérez", phone: "70012345", identity: "1234567 SC", observations: "" },
};

test("reservar manda exactamente lo elegido y una hora ocupada llega con su código", async () => {
  let enviado: RequestInit | undefined;
  const ok = createAgendaBookingData((_, init) => {
    enviado = init;
    return json({ codigo: 41, referencia: "r", medico: "Dra. Ana", fecha: "2026-10-08", hora: "09:30", pago: { precio: null, bancoId: null } }, 201);
  });
  const reserva = await ok.reservar(draft);
  assert.equal(reserva.code, 41);
  assert.equal(enviado?.credentials, "omit", "nunca manda cookies al CRM");
  assert.deepEqual(JSON.parse(String(enviado?.body)), {
    medicoId: "82", fecha: "2026-10-08", hora: "09:30", nombre: "María Pérez", telefono: "70012345", ci: "1234567 SC", observaciones: "",
  });

  const ocupada = createAgendaBookingData(() => json({ codigo: "HORA_NO_DISPONIBLE", message: "Esa hora acaba de ocuparse." }, 409));
  await assert.rejects(ocupada.reservar(draft), (e: unknown) => e instanceof AgendaError && e.code === "HORA_NO_DISPONIBLE" && e.status === 409);

  const sinRed = createAgendaBookingData(() => Promise.reject(new TypeError("Failed to fetch")));
  await assert.rejects(sinRed.getSpecialties(), (e: unknown) => e instanceof AgendaError && e.status === 0);
});

test("abrir la reserva con un médico: su especialidad viene con él; si ya no está, sin error", async () => {
  const medico = { id: "20", especialidadId: "esp-1", nombre: "Dra. Ana", horarioInformativo: null, modalidad: "ONLINE", precio: null };
  const pedidos: string[] = [];
  const datos = createAgendaBookingData((url) => {
    pedidos.push(String(url));
    return String(url).endsWith("/medicos/20")
      ? json({ version: 1, medico, especialidad: { id: "esp-1", nombre: "Ginecología" } })
      : json({ codigo: "MEDICO_NO_DISPONIBLE", message: "Ese profesional no está disponible en línea." }, 404);
  });
  const elegido = await datos.getDoctor("20");
  assert.equal(elegido?.doctor.name, "Dra. Ana");
  assert.deepEqual(elegido?.specialty, { id: "esp-1", name: "Ginecología", description: "" });
  assert.equal(await datos.getDoctor("21"), null); // 404: empieza desde el principio
  assert.equal(await datos.getDoctor("21; drop"), null); // ni siquiera se pide
  assert.equal(pedidos.length, 2);
});
