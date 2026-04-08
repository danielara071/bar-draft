import { Calendar, MapPin, Users } from "lucide-react";
type ScoreCardProps = {
  date: string;
  homeTeam: string;
  homeTeamShort: string;
  awayTeam: string;
  awayTeamShort: string;
  matchTime: number;
  location: string;
  fansWatching: number;
};

const ScoreCard = ({
  date,
  homeTeam,
  homeTeamShort,
  awayTeam,
  awayTeamShort,
  matchTime,
  location,
  fansWatching,
}: ScoreCardProps) => {
  const formattedTime = `${String(matchTime).padStart(2, "0")}:00`;

  return (
    <div className="border bg-brand-crimson rounded-3xl p-6">
      {/* Fecha y Ubicación */}
      <div className="flex justify-between mb-5">
        <div className="flex font-semibold text-white gap-2">
          <Calendar />
          {date}
        </div>
        <div className="flex font-semibold text-white gap-2">
          <MapPin />
          {location}
        </div>
      </div>
      {/* Equipo local, tiempo y visitante */}
      <div className="flex justify-between items-end mx-20">
        <div>
          <div className="w-16 h-16 rounded-full bg-brand-crimsonlight flex items-center justify-center text-white font-bold text-2xl">
            {homeTeamShort}
          </div>
          <p className="mt-3 text-base font-semibold text-white">{homeTeam}</p>
        </div>
        <div className="flex flex-col items-center justify-center pb-1">
          <p className="text-sm font-medium uppercase tracking-widest text-white">
            vs
          </p>
          <p className="text-5xl leading-none font-bold tracking-[0.14em] text-white">
            {formattedTime}
          </p>
        </div>
        <div>
          <div className="w-16 h-16 rounded-full bg-brand-crimsonlight flex items-center justify-center text-white font-bold text-2xl">
            {awayTeamShort}
          </div>
          <p className="mt-3 text-base font-semibold text-white">{awayTeam}</p>
        </div>
      </div>

      <div className="mt-5 w-full rounded-xl bg-brand-crimsonlight/70 px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Users size={14} />
          <p>{fansWatching} fans participando</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
