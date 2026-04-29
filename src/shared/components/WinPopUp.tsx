import { SecondaryButton } from "./Buttons";
import { FaTrophy } from "react-icons/fa";

interface WinProps {
    guesses: number;
    onClose: () => void;
}

const WinPopUp = ({ guesses, onClose }: WinProps) => {
    const coins = Math.max(6 - (guesses - 1), 1);

    return (
        <div className="flex flex-col items-center text-center gap-4">
            <FaTrophy className="text-brand-yellow text-6xl" />
            <h1 className="text-2xl font-bold">Felicidades!</h1>
            <div className="border border-brand-yellow rounded-full px-4 py-1">
                <p className="text-sm font-medium">+{coins} Monedas</p>
            </div>
            <p className="text-sm text-gray-mid">Adivinaste la palabra en {guesses}{" "}{guesses === 1 ? "intento" : "intentos"}.</p>
            <SecondaryButton onClick={onClose} size="sm">Regresar</SecondaryButton>
            <p className="text-xs text-gray-light">Regresa mañana para jugar de nuevo.</p>
        </div>
    );
};

export default WinPopUp;