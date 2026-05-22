import GestorContainer from "../features/gestorAmigos/GestorContainer";
import useSession  from "../shared/hooks/useSession"
import { useState } from "react";

import { useUsuarioById } from "../shared/hooks/useUsuario";
import { useFetchAmigos } from "../shared/hooks/useAmigos";

import { useAcceptFriendRequest } from "../shared/hooks/useFriendRequests";
import { useRemoveFriend } from "../shared/hooks/useFriendRequests";

import AskPopUp from "../features/gestorAmigos/AskPopUp";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


function GestionarAmigos() {
  const session = useSession();
  const user_id = session?.user?.id || "";
  const { usuario : Usuario } = useUsuarioById(user_id);
  
  const {amigos: Amigo, reload: reloadAmigos} = useFetchAmigos(user_id, "accepted");
  const { amigos : Pendiente, reload: reloadPendientes} = useFetchAmigos(Usuario?.id ?? "", "pending");
  const { amigos : Solicitudes, reload: reloadSolicitudes } = useFetchAmigos(Usuario?.id ?? "", "request");
  
  const { acceptRequest } = useAcceptFriendRequest();
  const { removeFriend } = useRemoveFriend();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const irPerfil = () => {
    navigate("/perfil")
  }

  const onAccept = async(idFriend: string) => {
    console.log("Aceptar solicitud amigo>> ", idFriend);
    await acceptRequest(user_id, idFriend);
    await reloadAmigos();
    await reloadSolicitudes();
  }
  const onDeny = async(idFriend: string) => {
    console.log("Denegar solicitud", idFriend );
    await removeFriend(user_id, idFriend);
    await reloadSolicitudes();
    await reloadPendientes();
  }  
  const onDelete = (idFriend: string) => {
    setFriendToDelete(idFriend);
    setShowConfirm(true);
  };
  const confirmDelete = async () => {
    if (!friendToDelete) return;

    await removeFriend(user_id, friendToDelete);
    await reloadAmigos();
    await reloadPendientes();

    setShowConfirm(false);
    setFriendToDelete(null);
  };
  const cancelDelete = () => {
    setShowConfirm(false);
    setFriendToDelete(null);
  };

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

      {showConfirm && (
        <AskPopUp
          pregunta="Eliminar amigo"
          texto="¿Estás seguro de que quieres eliminar a este amigo?"
          textConf="Sí, eliminar"
          textDeny="No, mantener"
          onConfirm={confirmDelete}
          onDeny={cancelDelete}
        />
      )}
      <div className="bg-[#002244] h-25 px-6 py-6">
        <button 
          className="bg-red-50 p-3 rounded-full group hover:bg-red-100 transition-colors"
          onClick={irPerfil}
        > 
          <ArrowLeft className="text-brand-navy w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
      <div className="bg-gray-100">
        
        <div className="max-w-5xl py-8 mx-auto" >
            {Solicitudes?.length != 0 && (
              <GestorContainer
                amigos={(Solicitudes || [])}
                text="Solicitudes"
                accept={(idFriend: string) => onAccept(idFriend)}
                red="Rechazar"
                deny={(idFriend: string) => onDeny(idFriend)}
            />)}
            {Pendiente?.length != 0 && (
              <GestorContainer
                amigos={(Pendiente || [])}
                text="Pendientes"
                red="Cancelar"
                deny={(idFriend: string) => onDeny(idFriend)}//uso on deny en vez de on delete para manetner delete con el popUp                    
            />)}
            {Amigo?.length != 0 && (
              <GestorContainer
                amigos={(Amigo || [])}
                text="Amigos"
                red="Eliminar"
                deny={(idFriend: string) => onDelete(idFriend)}                
            />)}
            {(Solicitudes?.length || 0) === 0 &&
              (Pendiente?.length || 0) === 0 &&
              (Amigo?.length || 0) === 0 && (
                <div className="flex items-center justify-center py-20">
                  <p className="text-gray-500 text-xl font-medium">
                    Aún no has agregado amigos
                  </p>
                </div>
              )}
        </div>

      </div>
    </div>
  );
}

export default GestionarAmigos
