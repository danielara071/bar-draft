import { LoginButton } from "@/shared/components/Buttons";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 w-80">
        <p className="text-brand-navy font-semibold text-center">{message}</p>
        {subMessage && (
          <p className="text-sm text-gray-500 text-center">{subMessage}</p>
        )}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-full border border-brand-navy text-brand-navy text-sm font-medium hover:bg-brand-navy/5 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-full bg-brand-crimson text-white text-sm font-medium hover:bg-brand-crimson/90 transition disabled:opacity-50"
          >
            {loading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}