import { CircleAlert, Clock3 } from "lucide-react";
import type { BanDuration } from "../types/reportTypes";

type BanUserModalProps = {
  isOpen: boolean;
  reportedUserName: string;
  selectedDuration: BanDuration;
  onClose: () => void;
  onSelectDuration: (duration: BanDuration) => void;
  onConfirmBan: () => void;
  isSubmitting?: boolean;
};

const banOptions: Array<{ value: BanDuration; label: string }> = [
  { value: "24h", label: "24 horas" },
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "permanent", label: "Permanente" },
];

const BanUserModal = ({
  isOpen,
  reportedUserName,
  selectedDuration,
  onClose,
  onSelectDuration,
  onConfirmBan,
  isSubmitting = false,
}: BanUserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-brand-gray-light bg-brand-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-crimson/10 text-brand-crimson">
            <CircleAlert className="h-6 w-6" strokeWidth={2.25} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-navy">Bannear usuario</h3>
            <p className="mt-1 text-sm text-brand-gray-mid">
              Selecciona durante cuánto tiempo quedará suspendido <span className="font-semibold text-brand-navy">{reportedUserName}</span>.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {banOptions.map((option) => {
            const isSelected = selectedDuration === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelectDuration(option.value)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-brand-crimson bg-brand-crimson/5"
                    : "border-brand-gray-light bg-brand-white hover:bg-brand-gray-light/30"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">{option.label}</p>
                  </div>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${isSelected ? "border-brand-crimson bg-brand-crimson" : "border-brand-gray-light"}`}>
                    {isSelected ? <Clock3 className="h-3.5 w-3.5 text-brand-white" /> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-brand-gray-light px-5 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-gray-light/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmBan}
            disabled={isSubmitting}
            className="rounded-full bg-brand-crimson px-5 py-3 text-sm font-semibold text-brand-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Baneando..." : "Confirmar baneo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanUserModal;