import CardAgregarTrofeo from "../features/adminMapaTrofeos/cardAgregarTrofeo";
import useSession  from "../shared/hooks/useSession"
import { useState } from "react";

import { useUsuarioById } from "../shared/hooks/useUsuario";
import { useFetchAmigos } from "../shared/hooks/useAmigos";

import { useAcceptFriendRequest } from "../shared/hooks/useFriendRequests";
import { useRemoveFriend } from "../shared/hooks/useFriendRequests";

import AskPopUp from "../features/gestorAmigos/AskPopUp";



function AdminMapaTrofeos() {
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

  return (
    <div>
        <div className="flex flex-row gap-1 mt-5 ml-5 text-4xl font-semibold">
          <p className="text-brand-navy">
              Mapa de
          </p>
          <p className="text-brand-yellow">
              Trofeos
          </p>
        </div>
        <CardAgregarTrofeo
          onUpload={() => console.log("Subir imagen")}
          onConfirmar={() => console.log("Confirmar nuevo trofeo")}
        />

    </div>
  );
}

export default AdminMapaTrofeos
