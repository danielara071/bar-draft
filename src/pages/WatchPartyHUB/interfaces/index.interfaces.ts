export type MatchType = "femenil" | "varonil";
export type Privacy = "publica" | "privada";
export type ModalStep = 1 | 2;

export interface WatchPartyMatch {
  id: number;
  type: MatchType;
  title: string;
  competition: string;
  time: string;
  code: string;
}

export interface CreatePartyForm {
  name: string;
  match: string;
  privacy: Privacy;
}

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

export type WatchPartyCardProps = WatchPartyMatchCardProps | WatchPartyAddCardProps;

export interface WatchPartyUpcomingProps {
  parties: WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
  onAddClick?: () => void;
}

export interface WatchPartyGridProps {
  title: string;
  matches: WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
}

export interface WatchPartyCodeInputProps {
  onJoin?: (code: string) => void;
}

export interface WatchPartyModalProps {
  open: boolean;
  onClose?: () => void;
}
