import { useMemo, useState } from "react";
import type { ReportReason, WatchPartyReportDraft } from "../Types/reportType";

type ReportUserModalProps = {
  isOpen: boolean;
  reportedUserName: string;
  reportedUserId?: string;
  roomCode: string;
  onClose: () => void;
  onSubmit?: (payload: WatchPartyReportDraft) => Promise<void> | void;
  isSubmitting?: boolean;
  submitError?: string | null;
};

const reasons: ReportReason[] = [
  "Lenguaje ofensivo",
  "Acoso",
  "Spam",
  "Contenido inapropiado",
  "Otro",
];

const ReportUserModal = ({
  isOpen,
  reportedUserName,
  reportedUserId,
  roomCode,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitError,
}: ReportUserModalProps) => {
  const [motivo, setMotivo] = useState<ReportReason>("Lenguaje ofensivo");
  const [detalles, setDetalles] = useState("");

  const payload = useMemo<WatchPartyReportDraft>(
    () => ({
      reportedUserName,
      reportedUserId,
      roomCode,
      motivo,
      detalles: detalles.trim(),
    }),
    [reportedUserName, reportedUserId, roomCode, motivo, detalles],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-brand-gray-light bg-brand-white p-5 shadow-xl">
        <h3 className="text-lg font-bold text-brand-navy">Reportar Usuario</h3>
        <p className="mt-1 text-sm text-brand-gray-mid">
          Completa el reporte para{" "}
          <span className="font-semibold text-brand-crimson">
            {reportedUserName}
          </span>
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-spaced text-brand-gray-mid">
              Motivo
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as ReportReason)}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-xl border border-brand-gray-light px-3 py-2 text-sm text-brand-navy cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-spaced text-brand-gray-mid">
              Detalles
            </label>
            <textarea
              value={detalles}
              onChange={(e) => setDetalles(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              placeholder="Describe brevemente lo ocurrido..."
              className="mt-1 w-full rounded-xl border border-brand-gray-light px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="rounded-xl bg-brand-gray-light/40 px-3 py-2 text-xs text-brand-gray-mid">
            Sala:{" "}
            <span className="font-semibold text-brand-navy">{roomCode}</span>
          </div>

          {submitError ? (
            <p className="text-xs text-red-600">{submitError}</p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-brand-gray-light px-4 py-2 text-sm font-semibold text-brand-navy cursor-pointer hover:bg-brand-gray-light/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void onSubmit?.(payload)}
            disabled={isSubmitting}
            className="rounded-full bg-brand-crimson px-4 py-2 text-sm font-semibold text-brand-white cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Enviando..." : "Reportar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;
