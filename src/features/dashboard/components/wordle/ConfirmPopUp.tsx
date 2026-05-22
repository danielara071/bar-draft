import { Trash2 } from "lucide-react";

interface ConfirmPopupProps {
  message: string;
  subMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
}

export default function ConfirmPopup({
  message,
  subMessage,
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = "Eliminar",
}: ConfirmPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl flex flex-col items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson/10">
          <Trash2 className="h-8 w-8 text-brand-crimson" strokeWidth={1.8} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-brand-navy">{message}</h2>
          {subMessage && (
            <p className="mt-2 text-sm text-slate-500">{subMessage}</p>
          )}
        </div>
        <div className="flex w-full gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-brand-crimson py-3 font-semibold text-white transition hover:bg-brand-crimson/90 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}