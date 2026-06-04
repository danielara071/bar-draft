import { PrimaryButton } from "./Buttons";

type HistoriaButtonProps = {
  onClick: () => void;
  className?: string;
};

const HistoriaButton = ({ onClick, className = "" }: HistoriaButtonProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <PrimaryButton
          onClick={onClick}
          size="lg"
          className={`w-full max-w-3xl text-lg md:text-xl lg:text-2xl py-5 md:py-6 ${className}`}
        >
          Conoce nuestras historias
        </PrimaryButton>
      </div>
      <hr className="mt-8 w-full border-brand-gray-light" />
    </div>
  );
};

export default HistoriaButton;
