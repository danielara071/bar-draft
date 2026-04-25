import GestorContainer from "../features/gestorAmigos/GestorContainer";
import useSession  from "../shared/hooks/useSession"

import { useUsuarioById } from "../shared/hooks/useUsuario";
import { useFetchAmigos } from "../shared/hooks/useAmigos";






function GestionarAmigos() {
  const session = useSession();
  const user_id = session?.user?.id || "";
  const { usuario : Usuario } = useUsuarioById(user_id);
  const { amigos : Amigo } = useFetchAmigos(Usuario?.id ?? "", "accepted");
  const { amigos : Pendiente } = useFetchAmigos(Usuario?.id ?? "", "pending");
  const { amigos : Solicitudes } = useFetchAmigos(Usuario?.id ?? "", "request");
  if (user_id == ""){
    return (
    <div className="min-h-screen">
      <div className="bg-[#002244] px-6 py-6">
        <text>Inicie sesion para gestionar sus amigos</text> // de momento solo hacemos un redirect a la pagina de inicio de sesion, 
      </div>
    </div>
    );
  }
  return (
    <div>
      <div className="bg-[#002244] h-25 py "/>
      <div >
          <GestorContainer
          amigos={(Amigo || [])}
          text="Solicitudes"
          />
          <GestorContainer
          amigos={(Pendiente || [])}
          text="Pendientes"
          />
          <GestorContainer
          amigos={(Solicitudes || [])}
          text="Amigos"
          />
      </div>
    </div>
  );
}

export default GestionarAmigos
