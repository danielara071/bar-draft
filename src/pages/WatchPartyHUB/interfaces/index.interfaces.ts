// ── Shared types ──────────────────────────────────────────────────────────

export type MatchType = "femenil" | "varonil";
export type Privacy   = "publica" | "privada";
export type ModalStep = 1 | 2;
export type FriendshipStatus = "pending" | "accepted" | "rejected";

// ── Scraper / Fixtures ────────────────────────────────────────────────────

export interface Fixture {
  fixture_id:  string;          // "varonil-1776193200000"
  date:        string;
  homeTeam:    string;
  awayTeam:    string;
  venue?:      string;
  status:      string;
  competition: string;
  category:    MatchType;
}

// ── Supabase: watch_parties ───────────────────────────────────────────────

export interface WatchParty {
  id:         string;
  code:       string;
  name:       string;
  fixture_id: string;           // TEXT en BD
  home_team:  string;
  away_team:  string;
  match_date: string;
  privacy:    Privacy;
  created_by: string;
  created_at: string;
}

// ── Supabase: friendships ─────────────────────────────────────────────────

export interface Friendship {
  id:        string;
  user_id:   string;
  friend_id: string;
  status:    FriendshipStatus;
  created_at: string;
}

// ── UI model ──────────────────────────────────────────────────────────────

export interface WatchPartyMatch {
  id:          string;
  type:        MatchType;
  title:       string;
  competition: string;
  time:        string;
  code:        string;
  home_team?:  string;
  away_team?:  string;
  match_date?: string;
}

export interface CreatePartyForm {
  name:       string;
  fixture_id: string;
  privacy:    Privacy;
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
  match:    WatchPartyMatch;
}

export interface WatchPartyAddCardProps extends WatchPartyCardBaseProps {
  variant: "add";
  match?:  never;
}

export type WatchPartyCardProps =
  | WatchPartyMatchCardProps
  | WatchPartyAddCardProps;

export interface WatchPartyUpcomingProps {
  parties:      WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
  onAddClick?:  () => void;
  isLoading?:   boolean;
}

export interface WatchPartyGridProps {
  title:        string;
  matches:      WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
  isLoading?:   boolean;
}

export interface WatchPartyCodeInputProps {
  onJoin?: (code: string) => void;
}

export interface WatchPartyModalProps {
  open:     boolean;
  onClose?: () => void;
}

export interface JoinModalProps {
  match:          WatchPartyMatch | null;
  onClose:        () => void;
  onConfirmJoin:  (match: WatchPartyMatch) => void; // abre PrediccionesModal en vez de navegar directo
}