import type { TeamType } from "../types";
import type { AssisterCardData } from "../types";
import TeamCard from "./TeamCard";
import PlayerImage from "./PlayerImage";

function AssisterCard({
  teamType,
  data,
}: {
  teamType: TeamType;
  data: AssisterCardData | null;
}) {
  if (!data) {
    return (
      <TeamCard teamType={teamType}>
        <p className="text-center text-white/80">Sin datos de asistidores.</p>
      </TeamCard>
    );
  }

  return (
    <TeamCard teamType={teamType}>
      <h3 className="text-xl font-bold text-center mb-3">{data.player.nombre}</h3>
      <PlayerImage src={data.player.imagen_url} alt={data.player.nombre} />
      <p className="mt-4 text-center text-white/90">Mayor asistidor(a) con</p>
      <p className="text-center text-6xl leading-none font-extrabold mt-1">
        {data.totalAsistencias}
      </p>
      <p className="text-center text-xl mt-1">asistencias</p>
    </TeamCard>
  );
}

export default AssisterCard;
