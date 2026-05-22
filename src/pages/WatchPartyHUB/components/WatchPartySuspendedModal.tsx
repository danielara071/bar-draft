import { CircleAlert } from "lucide-react";

type WatchPartySuspendedModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const WatchPartySuspendedModal = ({
  isOpen,
  onClose,
}: WatchPartySuspendedModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-brand-gray-light bg-brand-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson/10 text-2xl font-bold text-brand-crimson">
          <CircleAlert className="h-7 w-7" strokeWidth={2.25} />
        </div>

        <h3 className="mt-4 text-xl font-bold text-brand-navy">
          Acceso suspendido
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-brand-gray-mid">
          Tu cuenta ha sido temporalmente suspendida de unirse a WatchParties
          públicos.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-brand-crimson px-4 py-3 text-sm font-semibold text-brand-white transition hover:brightness-110 cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default WatchPartySuspendedModal;
