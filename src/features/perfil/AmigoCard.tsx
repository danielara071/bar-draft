import { useNavigate } from "react-router-dom";

type AmigoCardProps = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
  clickAble?: boolean;
};

export default function AmigoCard({
  id,
  nombre_usuario,
  url_avatar,
  logro,
  clickAble = true
}: AmigoCardProps) {
  const navigate = useNavigate();

  const irPerfil = () => {
    if (!clickAble) return;
    console.log("ID amigo ", id)
    navigate("/amigo",{state:{idAmigo : id}})
  }
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm transition-all hover:scale-102"
    onClick={irPerfil}>
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