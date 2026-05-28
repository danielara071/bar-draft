import GestionarPerfilUsuario from "../features/perfil/GestionarPerfilUsuario";
import LogrosContainer from "../features/perfil/LogrosContainer";
import useSession  from "../shared/hooks/useSession"

import { useUsuarioById } from "../shared/hooks/useUsuario";
import { useUsuarioLogros } from "../shared/hooks/useLogros";
import { supabase } from "@/shared/services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";






function GestionarPerfil() {
  const session = useSession();
  const user_id = session?.user?.id || "";
  const { usuario : Usuario } = useUsuarioById(user_id);
  const { logros : Logro } = useUsuarioLogros(Usuario?.id ?? "");
  
  const navigate = useNavigate();
  const irPerfil = () => {
    navigate("/perfil")
  }

  console.log("usuario url avatar:", Usuario?.url_avatar);
  const cerrar_sesion = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("Cerrando sesión...");
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    } else {
      console.log("Sesión cerrada");
    }
  };
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
    
    <div >
      <div className="bg-[#002244] px-6 py-6">
          <button 
          className="bg-red-50 p-3 rounded-full group hover:bg-red-100 transition-colors"
          onClick={irPerfil}
        > 
          <ArrowLeft className="text-brand-navy w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
        <div className="max-w-5xl mx-auto mt-13">
          <GestionarPerfilUsuario
            username= {Usuario?.nombre_usuario || "Usuario"}
            avatarUrl={Usuario?.url_avatar || "https://vsywrimuzdnfyztreolz.supabase.co/storage/v1/object/public/profile-pictures/0001.png"}
            logro={Usuario?.logro || ""}
            user_id= {user_id}
            onLogoutFunc={cerrar_sesion}
            onLogoutText="Cerrar sesión"
          />
        </div>

      </div>
      <div className="bg-gray-100" >
        <div className="bg-gray-100 mx-auto py-8 max-w-5xl">

            <LogrosContainer logros={Logro || []} text="MIS LOGROS"/>
        </div>
      </div>
    </div>
  );
}

export default GestionarPerfil
