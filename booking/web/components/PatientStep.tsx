"use client";
import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validatePatient } from "../state";
import type { PatientDraft } from "../types";
import s from "../booking.module.css";

/** Punto de inserción futuro; no simula una verificación de seguridad. */
export function AntiBotPlaceholder() {
  return null;
}

export function PatientStep({
  patient,
  onChange,
  onNext,
}: {
  patient: PatientDraft;
  onChange: (patient: PatientDraft) => void;
  onNext: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validatePatient(patient) : {};
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        const invalid = Object.keys(validatePatient(patient))[0];
        if (invalid) document.getElementById(`patient-${invalid}`)?.focus();
        else onNext();
      }}
    >
      <p className={s.hint}>
        Los campos con * son obligatorios. Usá los datos de quien viene a la consulta.
      </p>
      <div className={s.formFields}>
        {(
          [
            {
              key: "name",
              label: "Nombre completo",
              autoComplete: "name",
              placeholder: "Tu nombre y apellido",
              maxLength: 100,
            },
            {
              key: "phone",
              label: "Teléfono",
              autoComplete: "tel",
              placeholder: "Ej. 70000000",
              maxLength: 20,
            },
            {
              key: "identity",
              label: "Carnet de identidad",
              autoComplete: "off",
              placeholder: "Tu número de carnet",
              maxLength: 25,
            },
          ] as const
        ).map((field) => (
          <div className={s.field} key={field.key}>
            <label htmlFor={`patient-${field.key}`}>
              {field.label} <span aria-hidden="true">*</span>
            </label>
            <input
              id={`patient-${field.key}`}
              name={field.key}
              type={field.key === "phone" ? "tel" : "text"}
              inputMode={field.key === "phone" ? "tel" : "text"}
              autoComplete={field.autoComplete}
              required
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              value={patient[field.key]}
              onChange={(event) =>
                onChange({ ...patient, [field.key]: event.target.value })
              }
              aria-invalid={Boolean(errors[field.key])}
              aria-describedby={
                errors[field.key]
                  ? `error-${field.key}`
                  : field.key === "phone"
                    ? "phone-hint"
                    : undefined
              }
            />
            {field.key === "phone" && !errors.phone && (
              <p id="phone-hint" className={s.hint}>
                Celular de Bolivia · 8 dígitos. También podés incluir +591.
              </p>
            )}
            {errors[field.key] && (
              <p className={s.error} id={`error-${field.key}`} role="alert">
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}
        <div className={s.field}>
          <label htmlFor="patient-observations">
            Observaciones <span className={s.optional}>(opcional)</span>
          </label>
          <textarea
            id="patient-observations"
            name="observations"
            rows={3}
            maxLength={500}
            value={patient.observations}
            onChange={(event) =>
              onChange({ ...patient, observations: event.target.value })
            }
            placeholder="¿Hay algo que debamos saber para tu reserva?"
            aria-describedby="observations-hint"
          />
          <p className={s.hint} id="observations-hint">
            No incluyas informes ni información clínica sensible.
          </p>
        </div>
      </div>
      <AntiBotPlaceholder />
      <p className={s.privacy}>
        <LockKeyhole size={16} aria-hidden="true" />
        Tus datos se registran solo con tu reserva en la agenda de la clínica.
      </p>
      <div className={s.nextRow}>
        <Button type="submit" variant="primary" size="lg">
          Revisar mi selección
          <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
