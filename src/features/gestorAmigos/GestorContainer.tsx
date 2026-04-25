import GestorCard from "./GestorCard";
import { useNavigate } from "react-router-dom";

type Amigo = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
  status: string;
};

type GestorContainerProps = {
  amigos: Amigo[];
  text: string;

};

export default function GestorContainer({
  amigos,
  text,
}: GestorContainerProps) {
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
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {amigos.map((amigo, index) => (
          <GestorCard key={index} {...amigo} />
        ))}
      </div>
    </div>
  );
}