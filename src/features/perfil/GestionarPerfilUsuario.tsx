import { FiEdit } from "react-icons/fi";
import ChangeProfilePicture from "./ChangeProfilePicture";
import { useState, useEffect } from "react";

type GestionarPerfilUsuarioProps = {
  username: string;
  avatarUrl: string;
  logro?:string;
  user_id : string;
  onLogoutFunc: () => void;
  onLogoutText: string;

  insignia_url?: string;
};

export default function GestionarPerfilUsuario({
  username,
  avatarUrl: initialAvatarUrl,
  logro,
  user_id,
  onLogoutFunc,
  onLogoutText,
  insignia_url,

}: GestionarPerfilUsuarioProps) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(initialAvatarUrl);
  
  useEffect(() => {
    setCurrentAvatarUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);
  const handleAvatarUpdate = (newUrl: string) => {
    setCurrentAvatarUrl(newUrl);
  };
  console.log("URL del avatar:", currentAvatarUrl);
  return (
    <div className="p-6"> 
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-start gap-4">
          <img
            src={currentAvatarUrl}
            alt="avatar"
            className="w-40 h-40 rounded-full object-cover"
          />
          <ChangeProfilePicture
          user_id={user_id}
          onUpdateSuccess={handleAvatarUpdate}
          />
          </div>
          <div className="flex justify-end">
          {insignia_url && (
            <img
              src={insignia_url}
              alt="insignia"
              className="mt-5 mr-5 w-30 h-30 object-cover"
            />
          )}
          {logro && (
            <img
              src={logro}
              alt="avatar"
              className="w-40 h-40 object-cover rounded-lg"
            />
          )}
          </div>
        </div>
        
        <div className="py-4 flex justify-between">
            <div className="flex items-center justify-start gap-4">
            <h2 className="text-white text-4xl font-semibold">@{username}</h2>
            <button className="text-black bg-brand-yellow hover:bg-[#ffd11f] px-4 py-4 rounded-full text-md" > 
              <FiEdit size={20} />
            </button>
            </div>
            <div className="flex justify-end gap-4">
              <button
                  onClick={onLogoutFunc}
                  className="text-white bg-[#A50044] hover:bg-pink-700 px-4 py-2 rounded-full text-md"
              >
                  {onLogoutText}
              </button>
              </div>

        </div>

      </div>

    </div>
  );
}