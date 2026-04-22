import PerfilUsuario from "../features/perfil/PerfilUsuario";
import AmigosContainer from "../features/perfil/AmigosContainer";
import LogrosContainer from "../features/perfil/LogrosContainer";
import useSession  from "../shared/hooks/useSession"

import { useUsuarioByName } from "../shared/hooks/useUsuario";
import { useUsuarioLogros } from "../shared/hooks/useLogros";



const amigos = [
  {
    username: "marckiecrack",
    avatarUrl: "https://i.pravatar.cc/100?img=14",
  },
  {
    username: "sofiGonz",
    avatarUrl: "https://i.pravatar.cc/100?img=14",
  },
];

const logrosHardcoded = [
  {
    logro_id: 1,
    nombre: "Racha de 10 días",
    descripcion: "",
    desbloqueado: true,
    url_image: "Nivel_1",
    user_id: "NA"
  },
  {
    logro_id: 2,
    nombre: "5 Predicciones",
    descripcion: "4/5 Correctas",
    desbloqueado: false,
    url_image: "Nivel_1",
    user_id: "NA"
  },
];


function Perfil() {
  console.log("Perfil")
  const session = useSession();
  const user_id = session?.user?.id || "";
  const { usuario : Usuario } = useUsuarioByName(user_id);
  const { logros : Logro } = useUsuarioLogros(Usuario?.id ?? "");
  console.log("Usuario: ", session?.user?.id)
  if (user_id == ""){
    return (
    <div className="min-h-screen">
      <div className="bg-[#002244] px-6 py-6">
        <text>Inicie sesion para ver su perfil</text>
      </div>
    </div>
    );
  }
  return (
    
    <div className="min-h-screen">
      <div className="p-8 bg-[#002244]"></div>
      <div className="bg-[#002244] px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <PerfilUsuario
            username= {Usuario?.nombre_usuario || "Usuario"}
            ranking={14}
            pais={Usuario?.pais || ""}
            avatarUrl={Usuario?.url_avatar || "https://i.pravatar.cc/150?img=3"}
            onLogout={() => alert("Funcionalidad de cerrar sesion")}
            puntos={Usuario?.experiencia || 0}
            logros={Usuario?.logros || 0}
            predicciones={Usuario?.predicciones || 0}
            nivel={Usuario?.nivel || 1}
            xpActual={Usuario?.experiencia || 0}
            xpMax={4000}
            logro={Usuario?.logro || ""}
          />
        </div>

      </div>

      <div className="bg-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          <AmigosContainer
            amigos={amigos}
            onAddFriend={() => alert("Agregar amigo")}
          />

          <LogrosContainer logros={Logro || logrosHardcoded} />

        </div>
      </div>

    </div>
  );
}

export default Perfil
