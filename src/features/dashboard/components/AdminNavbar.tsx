import { UserCog, Video } from "lucide-react";

const navItems = [
  { name: "Inicio", path: "/" },
  { name: "Joc!", path: "/wordle" },
  { name: "RA", path: "/ra" },
  { name: "Reels", path: "/reels" },
  { name: "Watch Party", path: "/watchPartyHUB" },
  // { name: "Watch PartyHUB", path: "/watchPartyHUB" }, //eliminar solo es para pruebas
  { name: "Tienda", path: "/tienda" },
  { name: "Perfil", path: "/perfil" },
];
const AdminNavbar = () => {
  return (
    <nav className="bg-brand-navy w-64 min-h-screen items-center flex flex-col mr-5">
      <div className="flex flex-row justify-center items-center gap-x-2">
        <div className="flex items-center justify-center bg-brand-crimson rounded-sm h-10 w-10">
          <UserCog color="white"/>
        </div>
        <div className="flex flex-col  justify-center ">
          <h1 className="text-brand-white text-2xl font-bold mt-4 font-sans">
            Bar Draft
          </h1>
          <p className="text-white pb-2">Admin</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex flex-row w-52 gap-x-4 hover:opacity-70 bg-brand-gray-light min-h-9 rounded-md items-center">
          <Video color="white" />
          <h2>Reels</h2>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
