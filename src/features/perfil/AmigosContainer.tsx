import AmigoCard from "./AmigoCard";
import BuscarAmigosContainer from "./BuscarAmigosContainer";
import { useNavigate } from "react-router-dom";

type Amigo = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
};

type AmigosContainerProps = {
  amigos: Amigo[];
  clickable?: boolean;
  text: string;

};

export default function AmigosContainer({
  amigos,
  clickable = true,
  text,
}: AmigosContainerProps) {
  const navigate = useNavigate();
  const irGestionarAmigos = () => {
    navigate("/gestionarAmigos")
  }
  return (
    <div className="w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold tracking-wider text-[#002244]"> 
          {text}
        </h2>
        {text === "MIS AMIGOS" && <BuscarAmigosContainer/>}
        
  
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {amigos.map((amigo, index) => (
          <AmigoCard key={index} {...amigo} clickAble={clickable} />
        ))}
      </div>

      {/* Ver más */}
      {text === "MIS AMIGOS" && (
      <div className="text-right mt-2">
        <button className="text-pink-600 text-xl hover:underline "
        onClick={irGestionarAmigos}>
          Ver más
          
        </button>
      </div>)}
    </div>
  );
}