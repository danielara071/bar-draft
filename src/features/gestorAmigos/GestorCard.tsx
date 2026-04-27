//import { useNavigate } from "react-router-dom";

type GestorCardProps = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
  status: string;
  red?: string;
  accept?: (id: string) => void;
  deny?: (id: string) => void;
};

export default function GestorCard({
  id,
  nombre_usuario,
  url_avatar,
  logro,
  red="",
  accept,
  deny,
}: GestorCardProps) {
  //const navigate = useNavigate();


  return ( // justify-between
    <div className= "flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
      {/* componentes del perfil*/}
      <div className="flex items-center gap-15">
        <div className="flex items-center gap-3">
          <img
            src={url_avatar}
            alt={nombre_usuario}
            className="w-20 h-20 rounded-full object-cover"
          />

          <span className="text-xl font-medium text-gray-800">
            @{nombre_usuario}
          </span>
        </div>

        {logro && (
          <img src={`src/assets/Logros/${logro}.png`} alt="badge" className="w-20 h-20 object-cover rounded-lg" />
        )}
      </div>
      {/* botones de gestion*/}
      <div className="flex items-center gap-4">
            {red=== "Rechazar"&&
            <button
                className="w-30 text-white bg-[#0973cc] hover:bg-[#002244] px-4 py-2 transition-all hover:scale-102 rounded-full text-xm"
                onClick={() => accept && accept(id)}
            >
              Aceptar
            </button>}
            { 
            <button
                className="w-30  text-white bg-[#A50044] hover:bg-pink-700 px-4 py-2 transition-all hover:scale-102 rounded-full text-xm"
                onClick={() => deny && deny(id)}
            >
              {red}
            </button>}
      </div>
    </div>
  );
}

