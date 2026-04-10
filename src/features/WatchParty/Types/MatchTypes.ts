export type Match = {
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number;
    away: number;
  };
  fixture: {
    status: {
      elapsed: number;
    };
  };
};

export type MatchResponse = {
  type: "live" | "next" | "none";
  match: Match | null;
};