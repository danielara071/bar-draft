import GestorContainer from "../features/gestorAmigos/GestorContainer";
import useSession  from "../shared/hooks/useSession"

import { useUsuarioById } from "../shared/hooks/useUsuario";
import { useFetchAmigos } from "../shared/hooks/useAmigos";

import { useAcceptFriendRequest } from "../shared/hooks/useFriendRequests";
import { useRemoveFriend } from "../shared/hooks/useFriendRequests";




function GestionarAmigos() {
  const session = useSession();
  const user_id = session?.user?.id || "";
  const { usuario : Usuario } = useUsuarioById(user_id);
  const {amigos: Amigo, reload: reloadAmigos} = useFetchAmigos(user_id, "accepted");

  const { amigos : Pendiente, reload: reloadPendientes} = useFetchAmigos(Usuario?.id ?? "", "pending");
  const { amigos : Solicitudes, reload: reloadSolicitudes } = useFetchAmigos(Usuario?.id ?? "", "request");
  
  const { acceptRequest } = useAcceptFriendRequest();
  const { removeFriend } = useRemoveFriend();


  const onAccept = async(idFriend: string) => {
    console.log("Aceptar solicitud amigo>> ", idFriend);
    await acceptRequest(user_id, idFriend);
    await reloadAmigos();
    await reloadSolicitudes();
  }
  const onDeny = async(idFriend: string) => {
    console.log("Denegar solicitud", idFriend );
    await removeFriend(user_id, idFriend);
    await reloadPendientes();
  }  
  const onDelete = async(idFriend: string ) => {
    console.log("Eliminar amigo", idFriend);
    await removeFriend(user_id, idFriend);
    await reloadAmigos();
    await reloadPendientes(); //incluyes pendientes, porque usas la misma funcion de delete para cancelar solicitud y para eliminar amigo
  }
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
      <div className="max-w-5xl mx-auto">
          <GestorContainer
          amigos={(Solicitudes || [])}
          text="Solicitudes"
          accept={(idFriend: string) => onAccept(idFriend)}
          red="Rechazar"
          deny={(idFriend: string) => onDeny(idFriend)}
          />
          <GestorContainer
          amigos={(Pendiente || [])}
          text="Pendientes"
          red="Cancelar"
          deny={(idFriend: string) => onDeny(idFriend)}
          />
          <GestorContainer
          amigos={(Amigo || [])}
          text="Amigos"
          red="Eliminar"
          deny={(idFriend: string) => onDelete(idFriend)}
          />
      </div>
    </div>
  );
}

export default GestionarAmigos
