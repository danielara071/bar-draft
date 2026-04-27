import GestorCard from "./GestorCard";

type Amigo = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
  status: string;
};

type GestorContainerProps = {
  amigos: Amigo[];
  text: string;
  red?: string; //El texto del boton rojo
  accept?: (id: string) => void;
  deny?: (id: string) => void;
};

export default function GestorContainer({
  amigos,
  text,
  red="",
  accept,
  deny
}: GestorContainerProps) {
  return (
    <div className="w-full mt-8 mb-8 ">
      <h2 className="text-xl font-semibold text-[#002244]"> 
        {text}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {amigos.map((amigo, index) => (
          <GestorCard key={index} {...amigo} red={red} accept={accept} deny={deny}/>
        ))}
      </div>
    </div>
  );
}