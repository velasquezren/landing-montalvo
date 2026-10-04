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
  weeklySchedule: string;
  price: number;
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
export type PaymentStatus =
  | "PENDIENTE_PAGO"
  | "COMPROBANTE_ENVIADO"
  | "EN_VERIFICACION"
  | "PAGO_CONFIRMADO";
export interface PaymentDraft {
  nit: string;
  businessName: string;
  receipt: File | null;
  status: PaymentStatus;
}
export type MockScenario = "normal" | "empty" | "error";
export interface BookingData {
  getSpecialties(scenario?: MockScenario): Promise<Specialty[]>;
  getDoctors(specialtyId: string, scenario?: MockScenario): Promise<Doctor[]>;
  getDays(): Promise<AvailabilityDay[]>;
  getAvailability(
    doctorId: string,
    date: string,
    retry?: boolean,
  ): Promise<Availability>;
}
