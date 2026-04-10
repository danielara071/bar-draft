
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

  return (
    <div className="bg-[#0B2A45] text-white p-6 rounded-2xl mt-4">
      
      {/* Nivel + barra */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Nivel {nivel}</span>
          <span>{xpActual.toLocaleString()} XP</span>
        </div>

        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>


    </div>
  );
}