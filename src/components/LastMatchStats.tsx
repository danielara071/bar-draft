import { useState } from "react";
import type { Goals, League, Teams, Venue } from "../interfaces/interfaces";
import Timeline from "./Timeline";
import ToggleButton from "./ToggleButton";

interface LastMatchStatsProps {
  fixtureId: number;
  date: string;
  league: League;
  venue: Venue;
  teams: Teams;
  goals: Goals;
}

const LastMatchStats = ({
  fixtureId,
  date,
  league,
  venue,
  teams,
  goals,
}: LastMatchStatsProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleTimeline = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 w-28">
          {date.split("T")[0]}
        </p>

        <div className="flex items-center gap-3 w-48">
          <img
            src={league.logo}
            alt={league.name}
            className="w-8 h-8 object-contain"
          />
          <div className="flex flex-col text-sm">
            <p className="font-semibold text-gray-800">{league.name}</p>
            <p className="text-gray-500">{league.round}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 w-40 text-center">{venue.name}</p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800">{teams.home.name}</p>
            <img
              src={teams.home.logo}
              alt={teams.home.name}
              className="w-8 h-8 object-contain"
            />
          </div>

          <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <p>{goals.home}</p>
            <span className="text-gray-400">-</span>
            <p>{goals.away}</p>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={teams.away.logo}
              alt={teams.away.name}
              className="w-8 h-8 object-contain"
            />
            <p className="font-medium text-gray-800">{teams.away.name}</p>
          </div>
        </div>
      </div>
      <div className="ml-5 mb-2">
        <ToggleButton onPress={toggleTimeline} onToggle={isOpen}/>
      </div>
      {
        isOpen ? <Timeline fixtureId={fixtureId}></Timeline> : null
      }
      
    </div>
  );
};

export default LastMatchStats;
