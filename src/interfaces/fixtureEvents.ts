

export interface MatchEvent {
  time: EventTime
  team: EventTeam
  player: EventPlayer
  assist: EventAssist
  type: string
  detail: string
  comments: string | null
}

export interface EventTime {
  elapsed: number
  extra: number | null
}

export interface EventTeam {
  id: number
  name: string
  logo: string
}

export interface EventPlayer {
  id: number
  name: string
}

export interface EventAssist {
  id: number | null
  name: string | null
}