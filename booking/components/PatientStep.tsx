"use client";
import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIMITES, validarPaciente } from "../state";
import type { PacienteSolicitud } from "../types";
import s from "../booking.module.css";

const CAMPOS = [
  {
    clave: "nombre",
    etiqueta: "Nombre y apellido",
    obligatorio: true,
    autoComplete: "name",
    placeholder: "Nombre de quien viene a la consulta",
    pista: null,
  },
  {
    clave: "carnet",
    etiqueta: "Carnet de identidad",
    obligatorio: false,
    autoComplete: "off",
    placeholder: "Ej. 1234567 SC",
    pista: "Agiliza el registro si es su primera consulta.",
  },
] as const;

export function PatientStep({
  paciente,
  onChange,
  onNext,
}: {
  paciente: PacienteSolicitud;
  onChange: (paciente: PacienteSolicitud) => void;
  onNext: () => void;
}) {
  // Los errores aparecen al intentar continuar, no mientras se escribe.
  const [intentado, setIntentado] = useState(false);
  const errores = intentado ? validarPaciente(paciente) : {};
  const restantes = LIMITES.observaciones - paciente.observaciones.length;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setIntentado(true);
        const primero = Object.keys(validarPaciente(paciente))[0];
        if (primero) document.getElementById(`paciente-${primero}`)?.focus();
        else onNext();
      }}
    >
      <div className={s.formFields}>
        {CAMPOS.map((campo) => {
          const error = errores[campo.clave];
          const descripcion = error ? `error-${campo.clave}` : campo.pista ? `pista-${campo.clave}` : undefined;
          return (
            <div className={s.field} key={campo.clave}>
              <label htmlFor={`paciente-${campo.clave}`}>
                {campo.etiqueta}{" "}
                {campo.obligatorio ? (
                  <span aria-hidden="true">*</span>
                ) : (
                  <span className={s.optional}>(opcional)</span>
                )}
              </label>
              <input
                id={`paciente-${campo.clave}`}
                name={campo.clave}
                type="text"
                autoComplete={campo.autoComplete}
                required={campo.obligatorio}
                maxLength={LIMITES[campo.clave]}
                placeholder={campo.placeholder}
                value={paciente[campo.clave]}
                onChange={(event) => onChange({ ...paciente, [campo.clave]: event.target.value })}
                aria-invalid={Boolean(error)}
                aria-describedby={descripcion}
              />
              {error ? (
                <p className={s.error} id={`error-${campo.clave}`} role="alert">
                  {error}
                </p>
              ) : (
                campo.pista && (
                  <p className={s.hint} id={`pista-${campo.clave}`}>
                    {campo.pista}
                  </p>
                )
              )}
            </div>
          );
        })}

        <div className={s.field}>
          <label htmlFor="paciente-observaciones">
            Comentario <span className={s.optional}>(opcional)</span>
          </label>
          <textarea
            id="paciente-observaciones"
            name="observaciones"
            rows={3}
            maxLength={LIMITES.observaciones}
            value={paciente.observaciones}
            onChange={(event) => onChange({ ...paciente, observaciones: event.target.value })}
            placeholder="Por ejemplo: es un control, o es mi primera consulta."
            aria-invalid={Boolean(errores.observaciones)}
            aria-describedby="pista-observaciones"
          />
          <p className={s.hint} id="pista-observaciones">
            Evite datos clínicos sensibles: el mensaje viaja por WhatsApp. Quedan {restantes} caracteres.
          </p>
          {errores.observaciones && (
            <p className={s.error} role="alert">
              {errores.observaciones}
            </p>
          )}
        </div>
      </div>

      <p className={s.privacy}>
        <LockKeyhole size={16} aria-hidden="true" />
        Esta página no guarda sus datos: van solo en el mensaje que usted envía por WhatsApp.
      </p>
      <div className={s.nextRow}>
        <Button type="submit" variant="primary" size="lg">
          Revisar la solicitud
          <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
