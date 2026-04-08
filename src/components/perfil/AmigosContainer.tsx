import AmigoCard from "./AmigoCard";

type Amigo = {
  username: string;
  avatarUrl: string;
  badgeUrl?: string;
};

type AmigosContainerProps = {
  amigos: Amigo[];
  onAddFriend: () => void;
};

export default function AmigosContainer({
  amigos,
  onAddFriend,
}: AmigosContainerProps) {
  return (
    <div className="w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs font-semibold text-gray-500 tracking-wider">
          MIS AMIGOS
        </h2>

        <button
          onClick={onAddFriend}
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs px-4 py-2 rounded-full"
        >
          + Añadir Amigos
        </button>
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