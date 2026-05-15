import { LoginButton } from "@/shared/components/Buttons";

interface ConfirmationPopupProps {
  message: string;
  success: boolean;
  onClose: () => void;
}

export default function ConfirmationPopup({ message, success, onClose }: ConfirmationPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
        <p className={`text-lg font-bold ${success ? 'text-black' : 'text-brand-crimson'}`}>
          {message}
        </p>
        <LoginButton onClick={onClose} size="sm">
          Cerrar
        </LoginButton>
      </div>
    </div>
  );
}