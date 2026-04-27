import PerfilUsuario from "../features/perfil/PerfilUsuario";
import AmigosContainer from "../features/perfil/AmigosContainer";
import LogrosContainer from "../features/perfil/LogrosContainer";

import { useUsuarioById } from "../shared/hooks/useUsuario";
import { useUsuarioLogros } from "../shared/hooks/useLogros";
import { useFetchAmigos } from "../shared/hooks/useAmigos";

import { useLocation } from "react-router-dom";
import useSession  from "../shared/hooks/useSession"

import { useSendFriendRequest } from "../shared/hooks/useFriendRequests"; 


function Amigo() {
  const session = useSession();
  const user_id = session?.user?.id || "";
  const location = useLocation();
  const friend_id = location.state?.idAmigo || "";
  const { usuario : Usuario } = useUsuarioById(friend_id);
  const { logros : Logro } = useUsuarioLogros(Usuario?.id ?? "");
  const { amigos : Amigo } = useFetchAmigos(Usuario?.id ?? "", "accepted");
  const { sendRequest } = useSendFriendRequest();

  const onRequest = () => {
    console.log("Enviar solicitud a ", friend_id , " de ", user_id);
    sendRequest(user_id, friend_id);
  };

  if (friend_id == ""){
    return (
    <div>
      <div className="bg-[#002244] px-6 py-6">
        <text>Inicie sesion para ver su perfil</text>
      </div>
    </div>
    );
  }
  return (
    
    <div>
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

            onLogoutFunc={() => onRequest()}
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
