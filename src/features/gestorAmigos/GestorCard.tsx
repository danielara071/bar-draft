//import { useNavigate } from "react-router-dom";

type GestorCardProps = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
  status: string;
};

export default function GestorCard({
  id,
  nombre_usuario,
  url_avatar,
  logro,
  status,
}: GestorCardProps) {
  //const navigate = useNavigate();


  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm transition-all hover:scale-102">
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
  );
}