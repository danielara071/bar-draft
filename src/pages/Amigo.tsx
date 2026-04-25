import PerfilUsuario from "../features/perfil/PerfilUsuario";
import AmigosContainer from "../features/perfil/AmigosContainer";
import LogrosContainer from "../features/perfil/LogrosContainer";

import { useUsuarioById } from "../shared/hooks/useUsuario";
import { useUsuarioLogros } from "../shared/hooks/useLogros";
import { useFetchAmigos } from "../shared/hooks/useAmigos";

import { useLocation } from "react-router-dom";




function Amigo() {
  const location = useLocation();
  const user_id = location.state?.idAmigo || "";
  const { usuario : Usuario } = useUsuarioById(user_id);
  const { logros : Logro } = useUsuarioLogros(Usuario?.id ?? "");
  const { amigos : Amigo } = useFetchAmigos(Usuario?.id ?? "");

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
      <div className="bg-[#002244] px-6 py-6">
        <div className="max-w-5xl mx-auto mt-13">
          <PerfilUsuario
            username= {Usuario?.nombre_usuario || "Usuario"}
            ranking={Usuario?.ranking || 0}
            pais={Usuario?.pais || ""}
            avatarUrl={Usuario?.url_avatar || "https://i.pravatar.cc/150?img=3"}
            puntos={Usuario?.experiencia || 0}
            logros={Usuario?.logros || 0}
            predicciones={Usuario?.predicciones || 0}
            nivel={Usuario?.nivel || 1}
            xpActual={Usuario?.experiencia || 0}
            xpMax={4000}
            logro={Usuario?.logro || ""}

            onLogoutFunc={() => alert("Funcionalidad de cerrar sesion")}
            onLogoutText="Agregar Amigo"

          />
        </div>

      </div>
      <div className="bg-gray-100" >
        <div className="bg-gray-100 mx-auto py-8 max-w-5xl">
            <AmigosContainer 
              amigos={(Amigo || [])}
              text={`AMIGOS DE @${Usuario?.nombre_usuario || "Usuario"}`}
            />

            <LogrosContainer logros={Logro || []}
            clickable={false}
            text={`LOGROS DE @${Usuario?.nombre_usuario || "Usuario"}`}
            />
        </div>
      </div> 
    </div>
  );
}

export default Amigo
