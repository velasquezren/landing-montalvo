export interface Specialty {
  id: string;
  name: string;
  description: string;
}
export interface Doctor {
  id: string;
  specialtyId: string;
  name: string;
  photo?: string;
  /** Horario habitual en una frase; `null` si la agenda no lo publica. */
  weeklySchedule: string | null;
  /** Bolivianos. `null`: la agenda no tiene una tarifa válida (no es «gratis»). */
  price: number | null;
  availability: "online" | "on-request";
}
export interface TimeSlot {
  id: string;
  time: string;
}
export interface AvailabilityDay {
  date: string;
  label: string;
  day: string;
}
export type Availability =
  | { status: "available"; slots: TimeSlot[] }
  | { status: "not-working" | "full"; slots: [] };
export interface PatientDraft {
  name: string;
  phone: string;
  identity: string;
  observations: string;
}
export interface BookingDraft {
  specialty: Specialty | null;
  doctor: Doctor | null;
  date: string;
  slot: TimeSlot | null;
  patient: PatientDraft;
}
export interface PaymentDraft {
  nit: string;
  businessName: string;
  receipt: File | null;
}
/** La cita ya registrada en la agenda de la clínica (estado PENDIENTE). */
export interface Reservation {
  /** Número de reserva en la agenda; lo usa recepción. */
  code: number;
  /** Autoriza el pago de ESTA reserva; caduca a las 6 h. */
  reference: string;
  doctorName: string;
  date: string;
  time: string;
  /** Monto copiado del médico al reservar; `null` si no tiene tarifa. */
  amount: number | null;
  bankId: number | null;
}
export type ReservationStatus = "PENDIENTE" | "PAGADO";
export interface BookingData {
  getSpecialties(): Promise<Specialty[]>;
  getDoctors(specialtyId: string): Promise<Doctor[]>;
  getDays(): Promise<AvailabilityDay[]>;
  getAvailability(
    doctorId: string,
    date: string,
    retry?: boolean,
  ): Promise<Availability>;
}
