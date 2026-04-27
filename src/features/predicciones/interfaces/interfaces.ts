// ── Predicciones ──────────────────────────────────────────────────────────

export type WinnerOption = "home" | "draw" | "away";
export type TotalGoalsOption = "0-1" | "2-3" | "4-5" | "6+";
export type HalftimeOption = "home" | "draw" | "away";

export interface PredictionForm {
  winner:       WinnerOption | null;
  scoreHome:    number;
  scoreAway:    number;
  firstGoaler:  string;
  totalGoals:   TotalGoalsOption | null;
  halftime:     HalftimeOption | null;
}

export interface Prediction {
  id:           string;
  user_id:      string;
  room_code:    string;          // Código de la watch party
  fixture_id:   string;
  winner:       WinnerOption | null;
  score_home:   number;
  score_away:   number;
  first_goaler: string;
  total_goals:  TotalGoalsOption | null;
  halftime:     HalftimeOption | null;
  created_at:   string;
}

// Props de la pantalla completa
export interface PredictionsPageProps {
  roomCode:  string;
  fixtureId: string;
  homeTeam:  string;
  awayTeam:  string;
  onSkip:    () => void;
  onSave:    () => void;
}

// Props de cada sección
export interface WinnerSectionProps {
  homeTeam:  string;
  awayTeam:  string;
  value:     WinnerOption | null;
  onChange:  (v: WinnerOption) => void;
}

export interface ScoreSectionProps {
  homeTeam:  string;
  awayTeam:  string;
  scoreHome: number;
  scoreAway: number;
  onChangeHome: (v: number) => void;
  onChangeAway: (v: number) => void;
}

export interface FirstGoalerSectionProps {
  value:    string;
  onChange: (v: string) => void;
}

export interface TotalGoalsSectionProps {
  value:    TotalGoalsOption | null;
  onChange: (v: TotalGoalsOption) => void;
}

export interface HalftimeSectionProps {
  homeTeam:  string;
  awayTeam:  string;
  value:     HalftimeOption | null;
  onChange:  (v: HalftimeOption) => void;
}