

import { CheckCircle, XCircle } from "lucide-react";

interface PopUpProps {
  message: string;
  success: boolean;
  onClose: () => void;
}

export default function PopUp({
  message,
  success,
  onClose,
}: PopUpProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <CheckCircle className="h-12 w-12 text-green-500" strokeWidth={1.5} />
        ) : (
          <XCircle className="h-12 w-12 text-red-500" strokeWidth={1.5} />
        )}

        <p
          className={`text-lg font-bold text-center ${
            success ? "text-slate-800" : "text-red-600"
          }`}
        >
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-brand-navy px-6 py-2.5 font-semibold text-white transition hover:bg-blue-950"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}