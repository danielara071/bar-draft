import PerfilUsuario from "../features/perfil/PerfilUsuario";
import AmigosContainer from "../features/perfil/AmigosContainer";
import LogrosContainer from "../features/perfil/LogrosContainer";


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

const logros = [
  {
    titulo: "Racha de 10 días",
    descripcion: "",
    desbloqueado: true,
  },
  {
    titulo: "5 Predicciones",
    descripcion: "4/5 Correctas",
    desbloqueado: false,
  },
];


function Perfil() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#002244] px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <PerfilUsuario
            username="pedroTrej5"
            ranking={14}
            pais="Chile"
            avatarUrl="https://i.pravatar.cc/150?img=12"
            onLogout={() => alert("Tu no mete cabra")}
            puntos={2400}
            logros={3}
            predicciones={4}
            nivel={1}
            xpActual={2}
            xpMax={4000}
          />
        </div>
      </div>

      <div className="bg-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          <AmigosContainer
            amigos={amigos}
            onAddFriend={() => alert("Agregar amigo")}
          />

          <LogrosContainer logros={logros} />

        </div>
      </div>

    </div>
  );
}

export default Perfil
