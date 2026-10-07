import { test } from "node:test";
import assert from "node:assert/strict";
import { createMockBookingData } from "./mock-booking-data.ts";
import { doctors, specialties, makeDays } from "./mock-data.ts";
import {
  bookingReducer,
  canContinue,
  initialDraft,
  receiptError,
  validatePatient,
} from "./state.ts";

const now = new Date("2026-10-04T16:00:00Z");
const data = createMockBookingData(0, () => now);
const patient = {
  name: "Paciente de ejemplo",
  phone: "70000000",
  identity: "1234567 SC",
  observations: "Ejemplo",
};
function completeDraft() {
  let draft = bookingReducer(initialDraft(), {
    type: "specialty",
    value: specialties[0],
  });
  draft = bookingReducer(draft, { type: "doctor", value: doctors[0] });
  draft = bookingReducer(draft, { type: "date", value: "2026-10-05" });
  draft = bookingReducer(draft, {
    type: "slot",
    value: { id: "ana-2026-10-05-09:00", time: "09:00" },
  });
  return bookingReducer(draft, { type: "patient", value: patient });
}
test("la especialidad filtra médicos y excluye otras especialidades", async () => {
  const results = await data.getDoctors("ginecologia");
  assert.equal(results.length, 3);
  assert.ok(results.every((doctor) => doctor.specialtyId === "ginecologia"));
  assert.deepEqual(await data.getDoctors("inexistente"), []);
});
test("cambiar especialidad invalida médico/fecha/hora y conserva paciente", () => {
  const result = bookingReducer(completeDraft(), {
    type: "specialty",
    value: specialties[1],
  });
  assert.equal(result.doctor, null);
  assert.equal(result.date, "");
  assert.equal(result.slot, null);
  assert.deepEqual(result.patient, patient);
});
test("cambiar médico invalida horario, pero elegir el mismo conserva selección", () => {
  const draft = completeDraft();
  assert.equal(
    bookingReducer(draft, { type: "doctor", value: doctors[0] }),
    draft,
  );
  const result = bookingReducer(draft, { type: "doctor", value: doctors[1] });
  assert.equal(result.date, "");
  assert.equal(result.slot, null);
  assert.deepEqual(result.patient, patient);
});
test("no permite médico de otra especialidad ni disponibilidad a solicitud", () => {
  const draft = completeDraft();
  assert.equal(
    bookingReducer(draft, { type: "doctor", value: doctors[3] }),
    draft,
  );
  assert.equal(
    bookingReducer(draft, { type: "doctor", value: doctors[2] }),
    draft,
  );
});
test("cambiar fecha borra la hora; sin elección explícita no continúa", async () => {
  const draft = bookingReducer(completeDraft(), {
    type: "date",
    value: "2026-10-09",
  });
  assert.equal(draft.slot, null);
  const availability = await data.getAvailability("ana", draft.date);
  assert.equal(availability.status, "available");
  assert.equal(draft.slot, null);
  assert.equal(canContinue(2, draft), false);
  assert.equal(canContinue(2, completeDraft()), true);
});
test("exige nombre, celular boliviano y carnet; admite +591 y complemento", () => {
  assert.deepEqual(Object.keys(validatePatient(initialDraft().patient)), [
    "name",
    "phone",
    "identity",
  ]);
  assert.deepEqual(validatePatient(patient), {});
  assert.deepEqual(
    validatePatient({
      ...patient,
      phone: "+591 7000 0000",
      identity: "1234567-1A SC",
    }),
    {},
  );
  assert.ok(validatePatient({ ...patient, phone: "123" }).phone);
  assert.equal(
    canContinue(3, { ...completeDraft(), patient: initialDraft().patient }),
    false,
  );
});
test("volver y reelegir opciones iguales conserva datos válidos", () => {
  const draft = completeDraft();
  let result = bookingReducer(draft, {
    type: "specialty",
    value: specialties[0],
  });
  result = bookingReducer(result, { type: "doctor", value: doctors[0] });
  result = bookingReducer(result, { type: "date", value: draft.date });
  assert.deepEqual(result, draft);
});
test("distingue sin cupos, sin atención y profesional a solicitud", async () => {
  assert.equal(
    (await data.getAvailability("ana", "2026-10-06")).status,
    "full",
  );
  assert.equal(
    (await data.getAvailability("ana", "2026-10-07")).status,
    "not-working",
  );
  assert.equal(
    (await data.getAvailability("elena", "2026-10-05")).status,
    "not-working",
  );
});
test("error recuperable no devuelve lista vacía y reintento devuelve horarios", async () => {
  await assert.rejects(data.getAvailability("ana", "2026-10-08"));
  const result = await data.getAvailability("ana", "2026-10-08", true);
  assert.equal(result.status, "available");
  assert.ok(result.slots.length > 0);
});
test("catálogos admiten loading mediante Promise, éxito, vacío y error", async () => {
  const pending = data.getSpecialties();
  assert.ok(pending instanceof Promise);
  assert.equal((await pending).length, 4);
  assert.deepEqual(await data.getSpecialties("empty"), []);
  await assert.rejects(data.getSpecialties("error"));
  await assert.rejects(data.getDoctors("ginecologia", "error"));
  assert.deepEqual(await data.getDoctors("ginecologia", "empty"), []);
});
test("precio disponible antes de recoger datos o confirmar", async () => {
  const [doctor] = await data.getDoctors("ginecologia");
  assert.equal(doctor.price, 400);
  assert.equal(initialDraft().patient.name, "");
});
test("fechas civiles correctas al cruzar medianoche y fin de año en Bolivia", () => {
  assert.equal(
    makeDays(new Date("2027-01-01T02:00:00Z"))[0].date,
    "2027-01-01",
  );
  assert.equal(
    makeDays(new Date("2027-01-01T05:00:00Z"))[0].date,
    "2027-01-02",
  );
});
test("rechaza comprobantes vacíos, tipos inesperados y más de 5 MB", () => {
  assert.equal(receiptError({ type: "image/webp", size: 1024 }), "");
  // El backend solo acepta imágenes (lo que ScriptCase muestra como comprobante).
  assert.ok(receiptError({ type: "application/pdf", size: 1024 }));
  assert.ok(receiptError({ type: "text/html", size: 1024 }));
  assert.ok(receiptError({ type: "image/png", size: 6 * 1024 * 1024 }));
  assert.ok(receiptError({ type: "image/png", size: 0 }));
});
