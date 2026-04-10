export type MatchType = "femenil" | "varonil";
export type Privacy = "publica" | "privada";

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
