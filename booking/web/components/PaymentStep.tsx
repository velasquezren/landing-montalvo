"use client";
import { useRef, useState } from "react";
import { ArrowRight, FileText, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgendaError, agendaData, qrDelBanco } from "../agenda-data";
import { money, receiptError } from "../state";
import type { PaymentDraft, Reservation } from "../types";
import s from "../booking.module.css";

const emptyPayment = (): PaymentDraft => ({ nit: "", businessName: "", receipt: null });

/**
 * Pago de una reserva ya registrada: el mismo QR y el mismo monto que muestra
 * ScriptCase, y el comprobante va a esa reserva (queda «a verificar» por caja).
 * Pagar después es válido: la cita ya está registrada como pendiente.
 */
export function PaymentStep({
  reservation,
  whatsappUrl,
  onPaid,
  onLater,
}: {
  reservation: Reservation;
  whatsappUrl: string;
  onPaid: () => void;
  onLater: () => void;
}) {
  const [payment, setPayment] = useState<PaymentDraft>(emptyPayment);
  const [fileError, setFileError] = useState("");
  const [sendError, setSendError] = useState("");
  const [sending, setSending] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function send() {
    if (!payment.receipt || sending) return;
    setSending(true);
    setSendError("");
    try {
      await agendaData.pagar(reservation.reference, payment.receipt, payment.nit, payment.businessName);
      onPaid();
    } catch (error) {
      if (error instanceof AgendaError && error.code === "YA_REGISTRADO") {
        onPaid();
        return;
      }
      setSendError(error instanceof Error ? error.message : "No pudimos enviar el comprobante.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className={s.paymentTop}>
        <div>
          <p className={s.eyebrow}>Monto de la consulta</p>
          <p className={s.paymentAmount}>{reservation.amount !== null ? money(reservation.amount) : "—"}</p>
          <span className={s.status}>Reserva N.º {reservation.code} · pendiente de pago</span>
        </div>
        <div className={s.qr}>
          {reservation.bankId !== null && !qrFailed ? (
            // QR del banco servido por el CRM; <img> y no next/image: puede cambiar y no debe guardarse un año.
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDelBanco(reservation.bankId)}
                alt="Código QR para pagar la consulta desde la app de tu banco"
                width={180}
                height={180}
                onError={() => setQrFailed(true)}
              />
              <a className={s.qrLink} href={qrDelBanco(reservation.bankId)} target="_blank" rel="noopener noreferrer">
                Abrir el QR para guardarlo
              </a>
            </>
          ) : (
            <>
              <QrCode size={52} strokeWidth={1} aria-hidden="true" />
              <strong>QR no disponible</strong>
              <span>Pedilo por WhatsApp</span>
            </>
          )}
        </div>
      </div>
      <p className={s.hint}>
        Escaneá el QR con la app de tu banco y pagá el monto exacto. Después subí la captura del comprobante: la
        clínica lo verifica y te confirma.
      </p>
      <div className={s.formFields}>
        <div className={s.field}>
          <label htmlFor="payment-nit">
            NIT o carnet para la factura <span className={s.optional}>(opcional)</span>
          </label>
          <input
            id="payment-nit"
            inputMode="numeric"
            autoComplete="off"
            maxLength={20}
            value={payment.nit}
            onChange={(event) => setPayment({ ...payment, nit: event.target.value.replace(/[^0-9-]/g, "") })}
          />
        </div>
        <div className={s.field}>
          <label htmlFor="payment-business">
            Razón social <span className={s.optional}>(opcional)</span>
          </label>
          <input
            id="payment-business"
            maxLength={100}
            autoComplete="off"
            value={payment.businessName}
            onChange={(event) => setPayment({ ...payment, businessName: event.target.value })}
            placeholder="Nombre para la factura"
          />
        </div>
      </div>
      <div className={s.fileArea}>
        <label htmlFor="payment-receipt">
          <FileText size={21} aria-hidden="true" />
          <strong>Comprobante de pago</strong>
        </label>
        <p id="receipt-help" className={s.hint}>
          Foto o captura de pantalla · JPG, PNG o WebP · Hasta 5 MB.
        </p>
        <Button
          onClick={() => fileInput.current?.click()}
          aria-controls="payment-receipt"
          aria-describedby={`receipt-help${fileError ? " receipt-error" : ""}`}
        >
          {payment.receipt ? "Elegir otro archivo" : "Elegir archivo"}
        </Button>
        <input
          ref={fileInput}
          className="sr-only"
          tabIndex={-1}
          id="payment-receipt"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby={`receipt-help${fileError ? " receipt-error" : ""}`}
          aria-invalid={Boolean(fileError)}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const message = receiptError(file);
            setFileError(message);
            setPayment({ ...payment, receipt: message ? null : file });
            event.target.value = "";
          }}
        />
        {fileError && (
          <p id="receipt-error" className={s.error} role="alert">
            {fileError}
          </p>
        )}
        {payment.receipt && (
          <div className={s.fileSelected} role="status">
            <FileText size={20} aria-hidden="true" />
            <div>
              <strong>{payment.receipt.name}</strong>
              <span>{Math.max(1, Math.ceil(payment.receipt.size / 1024))} KB</span>
            </div>
            <button
              type="button"
              aria-label="Quitar archivo"
              onClick={() => {
                setPayment({ ...payment, receipt: null });
                setFileError("");
              }}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {sendError && (
        <div className={s.notice} role="alert">
          <p className={s.noticeTitle}>{sendError}</p>
          <p>Tu reserva sigue registrada. Podés reintentar o enviar el comprobante por WhatsApp.</p>
          <Button asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Enviar por WhatsApp
            </a>
          </Button>
        </div>
      )}
      <div className={s.nextRow}>
        <Button variant="primary" size="lg" disabled={!payment.receipt || sending} aria-busy={sending} onClick={send}>
          {sending ? "Enviando comprobante…" : "Enviar comprobante"}
          {!sending && <ArrowRight size={16} aria-hidden="true" />}
        </Button>
      </div>
      <button className={s.textButton} type="button" onClick={onLater} disabled={sending}>
        Pagar más tarde
      </button>
    </>
  );
}
