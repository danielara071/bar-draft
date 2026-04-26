export type TeamType = "male" | "female";

export type PlayerBase = {
  id: string;
  nombre: string;
  imagen_url: string | null;
};

export type ScorerCardData = {
  player: PlayerBase;
  totalGoles: number;
  series: { label: string; value: number }[];
};

export type AssisterCardData = {
  player: PlayerBase;
  totalAsistencias: number;
};

export type KeeperCardData = {
  player: PlayerBase;
  efectividadPct: number; // 0-100
};

export type RankingItem = {
  id: string;
  nombre: string;
  value: number;
};

export type CategoryRanking = Record<TeamType, RankingItem[]>;

export type DashboardStats = {
  scorers: Record<TeamType, ScorerCardData | null>;
  assisters: Record<TeamType, AssisterCardData | null>;
  keepers: Record<TeamType, KeeperCardData | null>;
  rankings: {
    scorers: CategoryRanking;
    assisters: CategoryRanking;
    keepers: CategoryRanking;
  };
};

