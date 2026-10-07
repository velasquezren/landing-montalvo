import { doctors, specialties, makeDays } from "./mock-data.ts";
import type { BookingData, MockScenario } from "./types.ts";

/** Contrato de lectura en memoria. No usa fetch, storage ni peticiones. */
export function createMockBookingData(
  delay = 280,
  now = () => new Date(),
): BookingData {
  const wait = () => new Promise<void>((resolve) => setTimeout(resolve, delay));
  async function list<T>(items: T[], scenario: MockScenario = "normal") {
    await wait();
    if (scenario === "error") throw new Error("Simulated catalog error");
    return scenario === "empty" ? [] : items;
  }
  return {
    getSpecialties: (scenario) => list(specialties, scenario),
    getDoctors: (id, scenario) =>
      list(
        doctors.filter((doctor) => doctor.specialtyId === id),
        scenario,
      ),
    async getDays() {
      await wait();
      return makeDays(now());
    },
    async getAvailability(doctorId, date, retry = false) {
      await wait();
      const doctor = doctors.find((item) => item.id === doctorId);
      const index = makeDays(now()).findIndex((day) => day.date === date);
      if (!doctor || doctor.availability !== "online" || index < 0)
        return { status: "not-working", slots: [] };
      // Fechas 2/3/4: sin cupos / sin atención / error recuperable.
      if (index % 7 === 3 && !retry)
        throw new Error("Simulated availability error");
      const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
      if (
        index % 7 === 2 ||
        weekday === 0 ||
        weekday === 6 ||
        (doctorId === "lucia" && ![1, 3, 5].includes(weekday))
      )
        return { status: "not-working", slots: [] };
      if (index % 7 === 1) return { status: "full", slots: [] };
      const times =
        doctorId === "lucia"
          ? ["09:00", "10:30", "11:00"]
          : ["09:00", "10:30", "11:00", "15:00", "16:30"];
      return {
        status: "available",
        slots: times.map((time) => ({
          id: `${doctorId}-${date}-${time}`,
          time,
        })),
      };
    },
  };
}
export const bookingData = createMockBookingData();
