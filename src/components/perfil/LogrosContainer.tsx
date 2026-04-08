import LogroCard from "./LogroCard";

type Logro = {
  titulo: string;
  descripcion: string;
  iconoUrl?: string;
  desbloqueado?: boolean;
};

type LogrosContainerProps = {
  logros: Logro[];
};

export default function LogrosContainer({
  logros,
}: LogrosContainerProps) {
  return (
    <div className="w-full mt-8">
      
      <h2 className="text-xs font-semibold text-gray-500 tracking-wider mb-4">
        MIS LOGROS
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {logros.map((logro, index) => (
          <LogroCard key={index} {...logro} />
        ))}
      </div>
    </div>
  );
}