export type PredictionSnapshot = {
  winner: string | null;
  home_goals: number | null;
  away_goals: number | null;
  goals_range: string | null;
  first_scorer: string | null;
  halftime_result: number | null;
};

export type PredictionSettlement = {
  id: string;
  fixture_id: string;
  prediction_snapshot: PredictionSnapshot;
  official_result: PredictionSnapshot;
  winner_correct: boolean;
  score_correct: boolean;
  goals_range_correct: boolean;
  first_scorer_correct: boolean;
  halftime_correct: boolean;
  all_correct: boolean;
  xp_awarded: number;
  evaluated_at: string;
};

export type PredictionHistoryItem = {
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  competition: string | null;
  matchDate: string;
  homeGoals: number | null;
  awayGoals: number | null;
  predictionExists: boolean;
  settlement: PredictionSettlement | null;
};
