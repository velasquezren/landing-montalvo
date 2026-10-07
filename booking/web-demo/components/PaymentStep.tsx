"use client";
import { useRef, useState } from "react";
import { ArrowRight, FileText, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { money, receiptError } from "../state";
import type { PaymentDraft, PaymentStatus } from "../types";
import s from "../booking.module.css";

export const paymentLabels: Record<PaymentStatus, string> = {
  PENDIENTE_PAGO: "Pendiente de pago",
  COMPROBANTE_ENVIADO: "Comprobante enviado · simulado",
  EN_VERIFICACION: "En verificación · simulado",
  PAGO_CONFIRMADO: "Pago confirmado · simulado",
};
export function PaymentStep({
  price,
  payment,
  onChange,
  onNext,
}: {
  price: number;
  payment: PaymentDraft;
  onChange: (payment: PaymentDraft) => void;
  onNext: () => void;
}) {
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className={s.paymentTop}>
        <div>
          <p className={s.eyebrow}>Monto de ejemplo</p>
          <p className={s.paymentAmount}>{money(price)}</p>
          <span className={s.status}>{paymentLabels[payment.status]}</span>
        </div>
        <div className={s.qr}>
          <QrCode size={52} strokeWidth={1} aria-hidden="true" />
          <strong>QR de demostración</strong>
          <span>No admite pagos</span>
        </div>
      </div>
      <p className={s.bank}>Banco de ejemplo · Sin cuenta bancaria asociada</p>
      <p className={s.hint}>
        Este recorrido muestra cómo será el pago por QR y la revisión del
        comprobante. No hagas ninguna transferencia.
      </p>
      <div className={s.formFields}>
        <div className={s.field}>
          <label htmlFor="payment-nit">
            NIT <span className={s.optional}>(opcional en esta demo)</span>
          </label>
          <input
            id="payment-nit"
            inputMode="numeric"
            autoComplete="off"
            maxLength={20}
            value={payment.nit}
            onChange={(event) =>
              onChange({ ...payment, nit: event.target.value })
            }
            placeholder="Datos de facturación de ejemplo"
          />
        </div>
        <div className={s.field}>
          <label htmlFor="payment-business">
            Razón social <span className={s.optional}>(opcional)</span>
          </label>
          <input
            id="payment-business"
            maxLength={120}
            autoComplete="off"
            value={payment.businessName}
            onChange={(event) =>
              onChange({ ...payment, businessName: event.target.value })
            }
            placeholder="Nombre para la factura"
          />
        </div>
      </div>
      <div className={s.fileArea}>
        <label htmlFor="payment-receipt">
          <FileText size={21} aria-hidden="true" />
          <strong>Seleccionar comprobante de ejemplo</strong>
        </label>
        <p id="receipt-help" className={s.hint}>
          JPG, PNG o PDF · Hasta 5 MB. El archivo permanece en tu dispositivo y
          nunca se sube.
        </p>
        <Button
          onClick={() => fileInput.current?.click()}
          aria-controls="payment-receipt"
          aria-describedby={`receipt-help${error ? " receipt-error" : ""}`}
        >
          {payment.receipt ? "Elegir otro archivo" : "Elegir archivo"}
        </Button>
        <input
          ref={fileInput}
          hidden
          id="payment-receipt"
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          aria-describedby={`receipt-help${error ? " receipt-error" : ""}`}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const message = receiptError(file);
            setError(message);
            onChange({
              ...payment,
              receipt: message ? null : file,
              status: "PENDIENTE_PAGO",
            });
            event.target.value = "";
          }}
        />
        {error && (
          <p id="receipt-error" className={s.error} role="alert">
            {error}
          </p>
        )}
        {payment.receipt && (
          <div className={s.fileSelected} role="status">
            <FileText size={20} aria-hidden="true" />
            <div>
              <strong>{payment.receipt.name}</strong>
              <span>
                {Math.max(1, Math.ceil(payment.receipt.size / 1024))} KB ·
                Seleccionado localmente
              </span>
            </div>
            <button
              type="button"
              aria-label="Quitar archivo"
              onClick={() => {
                onChange({
                  ...payment,
                  receipt: null,
                  status: "PENDIENTE_PAGO",
                });
                setError("");
              }}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <p className={s.hint}>
        Seleccionar un comprobante no confirma el pago. La verificación humana
        será un paso separado.
      </p>
      <div className={s.nextRow}>
        <Button
          variant="primary"
          size="lg"
          disabled={!payment.receipt}
          onClick={() => {
            onChange({ ...payment, status: "COMPROBANTE_ENVIADO" });
            onNext();
          }}
        >
          Simular envío y continuar
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
      <button className={s.textButton} type="button" onClick={onNext}>
        Ver confirmación sin comprobante
      </button>
    </>
  );
}
