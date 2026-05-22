import { CircleAlert } from "lucide-react";

type DismissReportModalProps = {
  isOpen: boolean;
  reportedUserName: string;
  onClose: () => void;
  onConfirmDismiss: () => void;
  isSubmitting?: boolean;
};

const DismissReportModal = ({
  isOpen,
  reportedUserName,
  onClose,
  onConfirmDismiss,
  isSubmitting = false,
}: DismissReportModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 px-4">
      <div className="w-full max-w-md rounded-3xl border border-brand-gray-light bg-brand-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-yellow/15 text-brand-yellow">
            <CircleAlert className="h-6 w-6" strokeWidth={2.25} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-navy">
              Confirmar desestimación
            </h3>
            <p className="mt-1 text-sm text-brand-gray-mid">
              Vas a desestimar el reporte de{" "}
              <span className="font-semibold text-brand-navy">
                {reportedUserName}
              </span>
              .
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-2xl bg-brand-gray-light/30 px-4 py-3 text-sm text-brand-gray-mid">
          Esta acción marcará el reporte como revisado sin aplicar un baneo.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-brand-gray-light px-5 py-3 text-sm font-semibold text-brand-navy transition cursor-pointer hover:bg-brand-gray-light/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmDismiss}
            disabled={isSubmitting}
            className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-brand-white transition cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Desestimando..." : "Confirmar desestimación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { DismissReportModal };
export default DismissReportModal;
