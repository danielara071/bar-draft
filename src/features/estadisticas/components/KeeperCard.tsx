import type { TeamType } from "../types";
import type { KeeperCardData } from "../types";
import TeamCard from "./TeamCard";
import PlayerImage from "./PlayerImage";
import DonutChart from "./DonutChart";

function KeeperCard({ teamType, data }: { teamType: TeamType; data: KeeperCardData | null }) {
  if (!data) {
    return (
      <TeamCard teamType={teamType}>
        <p className="text-center text-white/80">Sin datos de atajadores.</p>
      </TeamCard>
    );
  }

  return (
    <TeamCard teamType={teamType}>
      <h3 className="text-xl font-bold text-center mb-3">{data.player.nombre}</h3>
      <PlayerImage src={data.player.imagen_url} alt={data.player.nombre} />
      <p className="mt-4 text-center text-white/90">Lidera la porteria con un</p>
      <DonutChart percent={data.efectividadPct} />
      <p className="text-center text-xl mt-2">de efectividad</p>
    </TeamCard>
  );
}

export default KeeperCard;
