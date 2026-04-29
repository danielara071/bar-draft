type AuthErrorCardProps = {
  message: string;
  onClose: () => void;
};

const AuthErrorCard = ({ message, onClose }: AuthErrorCardProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-16">
      <div className="w-full max-w-md rounded-3xl border border-brand-gray-light bg-brand-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-crimson">
              Hubo un problema al iniciar sesion
            </p>
            <p className="mt-1 text-sm text-brand-gray-mid">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand-gray-light px-3 py-1 text-xs font-semibold text-brand-black hover:bg-brand-gray-light/40"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorCard;
