// ── Scraper / Fixtures ────────────────────────────────────────────────────

export interface Fixture {
  fixture_id: string;           // "varonil-1776193200000"
  date: string;
  homeTeam: string;
  awayTeam: string;
  venue?: string;               // opcional, scraper no siempre lo incluye
  status: string;
  competition: string;
  category: "varonil" | "femenil";
}

// ── Supabase watch_parties ────────────────────────────────────────────────

export interface WatchParty {
  id: string;
  code: string;
  name: string;
  fixture_id: string;           // TEXT en BD — era number (BUG corregido)
  home_team: string;
  away_team: string;
  match_date: string;
  privacy: "publica" | "privada";
  created_by: string;
  created_at: string;
}

// ── Supabase friendships ──────────────────────────────────────────────────

export type FriendshipStatus = "pending" | "accepted" | "rejected";

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
}

// ── Modal / Form ──────────────────────────────────────────────────────────

export type MatchType = "femenil" | "varonil";
export type Privacy = "publica" | "privada";
export type ModalStep = 1 | 2;

export interface WatchPartyMatch {
  id: string;                   // era number — BUG corregido
  type: MatchType;
  title: string;
  competition: string;
  time: string;
  code: string;
  home_team?: string;
  away_team?: string;
  match_date?: string;
}

export interface CreatePartyForm {
  name: string;
  fixture_id: string;
  privacy: Privacy;
}

// ── Component props ───────────────────────────────────────────────────────

export interface WatchPartyHeroProps {
  onCreateParty: () => void;
}

export interface WatchPartyCardBaseProps {
  onClick?: () => void;
}

export interface WatchPartyMatchCardProps extends WatchPartyCardBaseProps {
  variant?: "default";
  match: WatchPartyMatch;
}

export interface WatchPartyAddCardProps extends WatchPartyCardBaseProps {
  variant: "add";
  match?: never;
}

export type WatchPartyCardProps =
  | WatchPartyMatchCardProps
  | WatchPartyAddCardProps;

export interface WatchPartyUpcomingProps {
  parties: WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
  onAddClick?: () => void;
  isLoading?: boolean;
}

export interface WatchPartyGridProps {
  title: string;
  matches: WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
  isLoading?: boolean;
}

export interface WatchPartyCodeInputProps {
  onJoin?: (code: string) => void;
}

export interface WatchPartyModalProps {
  open: boolean;
  onClose?: () => void;
}

export interface JoinModalProps {
  match: WatchPartyMatch | null;
  onClose: () => void;
}