import InsigniaCard from "./InsigniaCard";

type Insignia = {
  user_id: string;
  name: string;
  id_producto : number;
  url_image: string;
};

type InsigniasContainerProps = {
  insignias: Insignia[];
  text: string;

};

export default function InsigniasContainer({
  insignias,
  text,

}: InsigniasContainerProps) {
  return (
    <div >
      <h2 className="text-xl font-semibold text-[#002244] tracking-wider mb-4">
        {text}
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {insignias.map((insignia, index) => (
          <InsigniaCard key={index} {...insignia } />
        ))}
      </div>
    </div>
  );
}