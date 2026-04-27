import { PrimaryButton } from "./Buttons";
import { TfiFaceSad } from "react-icons/tfi";

interface LoseProps {
    solution: string;
    onClose: () => void;
}

const LosePopUp = ({ solution, onClose }: LoseProps) => {
    return (
        <div className="flex flex-col items-center text-center gap-4">
            <TfiFaceSad className="text-brand-crimson text-6xl" />
            <h1 className="text-2xl font-bold">Intenta Mañana</h1>
            <p className="text-sm text-gray-mid">Se te acabaron los intentos</p>
            <div className="border border-brand-crimson rounded-full px-4 py-1">
                <p className="text-md font-medium tracking-[9px]">{solution.toUpperCase()}</p>
            </div>
            <p className="text-xs text-brand-gray-mid leading-none">era la palabra del día</p>
            <PrimaryButton onClick={onClose} size="sm">Regresar</PrimaryButton>        </div>
    );
};

export default LosePopUp;