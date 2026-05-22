import { CircleAlert, Clock3 } from "lucide-react";

export type BannedUserEntry = {
  id: string;
  name: string;
  reason: string;
  remainingTime: string;
};

type BannedUsersModalProps = {
  isOpen: boolean;
  users: BannedUserEntry[];
  onClose: () => void;
};

const BannedUsersModal = ({
  isOpen,
  users,
  onClose,
}: BannedUsersModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-brand-gray-light bg-brand-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-crimson/10 text-brand-crimson">
            <CircleAlert className="h-6 w-6" strokeWidth={2.25} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-navy">
              Usuarios actualmente banneados
            </h3>
            <p className="mt-1 text-sm text-brand-gray-mid">
              Revisa quién sigue suspendido y cuánto tiempo le queda.
            </p>
          </div>
        </div>

        <div className="mt-5 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-gray-light px-4 py-6 text-center text-sm text-brand-gray-mid">
              No hay usuarios banneados por el momento.
            </div>
          ) : (
            users.map((user) => (
              <article
                key={user.id}
                className="rounded-2xl border border-brand-gray-light bg-brand-white px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">
                      {user.name}
                    </p>
                    <p className="mt-1 text-xs text-brand-gray-mid">
                      Motivo: {user.reason}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-crimson/10 px-3 py-2 text-xs font-semibold text-brand-crimson">
                    <Clock3 className="h-4 w-4" />
                    {user.remainingTime}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-brand-white transition hover:brightness-110 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannedUsersModal;
