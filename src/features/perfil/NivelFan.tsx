
type NivelFanProps = {
  nivel: number;
  xpActual: number;
  xpMax: number;

};

export default function NivelFan({
  nivel,
  xpActual,
  xpMax,

}: NivelFanProps) {
  const progreso = (xpActual / xpMax) * 100;

  return (// className="flex justify-between text-sm mb-1"
    <div className="bg-[#0B2A45] flex flex-row text-xl gap-x-12 justify-center text-white p-6 rounded-2xl mt-4 mb-4 h-18">
      <p>Nivel {nivel}</p>
      <div className="bg-gray-600 rounded-full h-2 w-150 mt-2">
        <div
          className="bg-yellow-400 h-2 rounded-full"
          style={{ width: `${progreso}%` }}
        />
      </div>
      <p>{xpActual.toLocaleString()} / {xpMax.toLocaleString()}XP</p>
    </div>
  );
}