import AmigoCard from "./AmigoCard";
import BuscarAmigosContainer from "./BuscarAmigosContainer";

type Amigo = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
};

type AmigosContainerProps = {
  amigos: Amigo[];

};

export default function AmigosContainer({
  amigos
}: AmigosContainerProps) {
  return (
    <div className="w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs font-semibold text-gray-500 tracking-wider">
          MIS AMIGOS
        </h2>

        <BuscarAmigosContainer/>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {amigos.map((amigo, index) => (
          <AmigoCard key={index} {...amigo} />
        ))}
      </div>

      {/* Ver más */}
      <div className="text-right mt-2">
        <button className="text-pink-600 text-xs hover:underline">
          Ver más
        </button>
      </div>
    </div>
  );
}