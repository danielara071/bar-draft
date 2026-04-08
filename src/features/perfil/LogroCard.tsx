type LogroCardProps = {
  titulo: string;
  descripcion: string;
  iconoUrl?: string;
  desbloqueado?: boolean;
};

export default function LogroCard({
  titulo,
  descripcion,
  iconoUrl,
  desbloqueado = true,
}: LogroCardProps) {
  return (
    <div
      className={`rounded-xl p-4 text-center ${
        desbloqueado
          ? "bg-[#1E3A5F] text-white"
          : "bg-gray-300 text-gray-600"
      }`}
    >
      {iconoUrl && (
        <img
          src={iconoUrl}
          alt={titulo}
          className="w-10 h-10 mx-auto mb-2"
        />
      )}

      <p className="text-sm font-semibold">{titulo}</p>
      <p className="text-xs mt-1 opacity-80">{descripcion}</p>
    </div>
  );
}