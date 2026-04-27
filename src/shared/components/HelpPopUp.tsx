import { LoginButton } from "./Buttons";
import Letter from "./Letter";

interface HelpProps {
    onClose: () => void;
}

const HelpPopUp = ({ onClose }: HelpProps) => {
    return (
        <div className="flex flex-col items-center text-center mx-6 gap-4">
            <h1 className="text-2xl font-bold">Cómo Jugar</h1>
            <div className="text-left">
                <p className="text-xs text-brand-gray-mid">Adivina la palabra en 6 intentos.</p>
                <ul className="list-disc mt-3">
                    <li className="text-xs text-brand-gray-mid list-disc">Cada intento debe ser una palabra válida de 5 letras.</li>
                    <li className="text-xs text-brand-gray-mid list-disc">El color de las casillas cambiará para indicar qué tan cerca estuvo tu respuesta.</li>
                </ul>
                <p className="text-md my-5">Ejemplos:</p>
                <div className="flex flex-row gap-2 my-4">
                <Letter letter="B" textColor="text-white" bgColor="bg-brand-yellow"/>
                <Letter letter="A"/>
                <Letter letter="R"/>
                <Letter letter="C"/>
                <Letter letter="A"/>
                </div>
                <p className="text-xs text-brand-gray-mid">La letra <span className="font-bold">B</span> está en la palabra y en el lugar correcto.</p>
                <div className="flex flex-row gap-2 my-4">
                <Letter letter="B"/>
                <Letter letter="A" textColor="text-white" bgColor="bg-brand-crimson"/>
                <Letter letter="R"/>
                <Letter letter="C"/>
                <Letter letter="A"/>
                </div>
                <p className="text-xs text-brand-gray-mid">La letra <span className="font-bold">A</span> está en la palabra, pero en el lugar equivocado.</p>
                <div className="flex flex-row gap-2 my-4">
                <Letter letter="B"/>
                <Letter letter="A"/>
                <Letter letter="R" textColor="text-white" bgColor="bg-brand-gray-mid"/>
                <Letter letter="C"/>
                <Letter letter="A"/>
                </div>
                <p className="text-xs text-brand-gray-mid">La letra <span className="font-bold">R</span> no está en la palabra.</p>
            </div>
            <LoginButton onClick={onClose} size="sm">Regresar</LoginButton>
        </div>
    );
};

export default HelpPopUp;