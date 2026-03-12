import LastMatchStats from "../components/LastMatchStats";
import { useFixtures } from "../hooks/useFixtures";

const SportsApi = () => {
  const fixtures = useFixtures();

  return (
    <div className="flex flex-col">
      <div className="flex justify-center flex-col items-center">
        <p className="text-3xl font-sans mt-4 mb-2">Partidos anteriores</p>
        <div className="flex flex-col gap-y-4 ">

          {fixtures.map((item, _) => {
            return (
              <LastMatchStats
                key={item.fixture.id}
                fixtureId={item.fixture.id}
                date={item.fixture.date}
                league={item.league}
                venue={item.fixture.venue}
                goals={item.goals}
                teams={item.teams}
              ></LastMatchStats>
            );
          })}

          <LastMatchStats
          fixtureId={1208755}
          date="2024-08-31T15:00:00+00:00"
          league={{
            id: 140,
            name: "La Liga",
            country: "Spain",
            logo: "https:\/\/media.api-sports.io\/football\/leagues\/140.png",
            flag: "https:\/\/media.api-sports.io\/flags\/es.svg",
            season: 2024,
            round: "Regular Season - 4",
          }}
          venue={{
            id: 19939,
            name: "Estadi Ol\u00edmpic Llu\u00eds Companys",
            city: "Barcelona",
          }}
          teams={{
            home: {
              id: 529,
              name: "Barcelona",
              logo: "https:\/\/media.api-sports.io\/football\/teams\/529.png",
              winner: true,
            },
            away: {
              id: 720,
              name: "Valladolid",
              logo: "https:\/\/media.api-sports.io\/football\/teams\/720.png",
              winner: false,
            },
          }}
          goals={{ home: 5, away: 5 }}
        ></LastMatchStats>
        </div>
      </div>
    </div>
  );
};

export default SportsApi;
