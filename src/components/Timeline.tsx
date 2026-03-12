import { useFixtureEvents } from "../hooks/useFixtureEvents";

interface TimelineProps {
  fixtureId: number;
}

const Timeline = ({ fixtureId }: TimelineProps) => {
  const events = useFixtureEvents(fixtureId);

  if (!events || events.length === 0) {
    return (
      <div className="bg-slate-500 w-[90%] mb-5 p-4">
        <p>No events available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-200 w-[90%] mb-5 p-4 rounded-lg">
      <div className="flex flex-col gap-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-l-2 border-white pl-3"
          >
            <span className="font-bold w-10">{event.time?.elapsed}'</span>

            <span className="bg-slate-300 px-2 py-1 rounded text-sm">
              {event.type}
            </span>

            <span className="text-sm opacity-80">
              {event.player?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;