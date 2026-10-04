import type {
  BookingDraft,
  Doctor,
  PatientDraft,
  Specialty,
  TimeSlot,
} from "./types.ts";

export function initialDraft(): BookingDraft {
  return {
    specialty: null,
    doctor: null,
    date: "",
    slot: null,
    patient: { name: "", phone: "", identity: "", observations: "" },
  };
}
export type BookingAction =
  | { type: "specialty"; value: Specialty }
  | { type: "doctor"; value: Doctor }
  | { type: "date"; value: string }
  | { type: "slot"; value: TimeSlot | null }
  | { type: "patient"; value: PatientDraft };

export function bookingReducer(
  state: BookingDraft,
  action: BookingAction,
): BookingDraft {
  switch (action.type) {
    case "specialty":
      return state.specialty?.id === action.value.id
        ? state
        : {
            ...state,
            specialty: action.value,
            doctor: null,
            date: "",
            slot: null,
          };
    case "doctor":
      if (
        action.value.specialtyId !== state.specialty?.id ||
        action.value.availability !== "online"
      )
        return state;
      return state.doctor?.id === action.value.id
        ? state
        : { ...state, doctor: action.value, date: "", slot: null };
    case "date":
      return state.date === action.value
        ? state
        : { ...state, date: action.value, slot: null };
    case "slot":
      return { ...state, slot: action.value };
    case "patient":
      return { ...state, patient: action.value };
  }
}
export function validatePatient(patient: PatientDraft) {
  const errors: Partial<Record<keyof PatientDraft, string>> = {};
  if (patient.name.trim().length < 3)
    errors.name = "Escribí tu nombre completo.";
  const phone = patient.phone.replace(/[\s()-]/g, "").replace(/^\+591/, "");
  if (!/^[67]\d{7}$/.test(phone))
    errors.phone =
      "Ingresá un celular de Bolivia de 8 dígitos, que empiece por 6 o 7.";
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .-]{2,24}$/u.test(patient.identity.trim()))
    errors.identity = "Ingresá tu carnet de identidad (de 3 a 25 caracteres).";
  return errors;
}
export function hasAppointment(draft: BookingDraft) {
  return Boolean(draft.specialty && draft.doctor && draft.date && draft.slot);
}
export function canContinue(step: number, draft: BookingDraft) {
  if (step === 0) return Boolean(draft.specialty);
  if (step === 1) return Boolean(draft.doctor);
  if (step === 2) return hasAppointment(draft);
  return (
    hasAppointment(draft) &&
    Object.keys(validatePatient(draft.patient)).length === 0
  );
}
export function receiptError(file: Pick<File, "size" | "type">) {
  if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type))
    return "Elegí un archivo JPG, PNG o PDF.";
  if (file.size > 5 * 1024 * 1024)
    return "El archivo debe pesar como máximo 5 MB.";
  if (file.size === 0) return "El archivo está vacío. Elegí otro comprobante.";
  return "";
}
export const money = (amount: number) =>
  `Bs ${new Intl.NumberFormat("es-BO").format(amount)}`;
export const dateLabel = (date: string) =>
  date
    ? new Intl.DateTimeFormat("es-BO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      }).format(new Date(`${date}T12:00:00Z`))
    : "Fecha por elegir";
