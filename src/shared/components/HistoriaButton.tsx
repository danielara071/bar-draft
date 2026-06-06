import { LoginButton } from "./Buttons";

type HistoriaButtonProps = {
  onClick: () => void;
  className?: string;
};

const HistoriaButton = ({ onClick, className = "" }: HistoriaButtonProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <LoginButton
          onClick={onClick}
          size="sm"
          className={`w-150 text-sm md:text-xl  py-3 md:py-3 ${className}`}
        >
          Conoce ambos trayectos
        </LoginButton>
      </div>
      <hr className="mt-8 w-full border-brand-gray-light" />
    </div>
  );
};

export default HistoriaButton;
