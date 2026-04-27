import type { TeamType } from "../types";
import type { ScorerCardData } from "../types";
import TeamCard from "./TeamCard";
import PlayerImage from "./PlayerImage";
import WhiteLineChart from "./WhiteLineChart";

function ScorerCard({ teamType, data }: { teamType: TeamType; data: ScorerCardData | null }) {
  if (!data) {
    return (
      <TeamCard teamType={teamType}>
        <p className="text-center text-white/80">Sin datos de anotadores.</p>
      </TeamCard>
    );
  }

  return (
    <TeamCard teamType={teamType}>
      <h3 className="text-xl font-bold text-center mb-3">{data.player.nombre}</h3>
      <PlayerImage src={data.player.imagen_url} alt={data.player.nombre} />
      <p className="mt-4 text-left text-base text-lg">
        <span className="font-bold">Goles:</span> {data.totalGoles}
      </p>
      <WhiteLineChart data={data.series} />
    </TeamCard>
  );
}

export default ScorerCard;
