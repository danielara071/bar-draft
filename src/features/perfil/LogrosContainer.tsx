import LogroCard from "./LogroCard";

type Logro = {
  logro_id: number;
  nombre: string;
  descripcion: string;
  url_image: string;
  desbloqueado: boolean;
  user_id: string;
  clickable?: boolean;
};

type LogrosContainerProps = {
  logros: Logro[];
  clickable?: boolean;
  text: string;

};

export default function LogrosContainer({
  logros,
  clickable = true,
  text,

}: LogrosContainerProps) {
  return (
    <div >
      <h2 className="text-xl font-semibold text-[#002244] tracking-wider mb-4">
        {text}
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {logros.map((logro, index) => (
          <LogroCard key={index} {...logro} clickable={clickable} />
        ))}
      </div>
    </div>
  );
}