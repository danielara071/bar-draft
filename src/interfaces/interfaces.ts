



export interface Fixture {
  fixture: FixtureInfo
  league: League
  teams: Teams
  goals: Goals
  score: Score
}

export interface FixtureInfo {
  id: number
  referee: string
  timezone: string
  date: string
  timestamp: number
  venue: Venue
  status: Status
}

export interface Venue {
  id: number
  name: string
  city: string
}

export interface Status {
  long: string
  short: string
  elapsed: number
}

export interface League {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
  round: string
}

export interface Teams {
  home: Team
  away: Team
}

export interface Team {
  id: number
  name: string
  logo: string
  winner: boolean
}

export interface Goals {
  home: number
  away: number
}

export interface Score {
  halftime: Goals
  fulltime: Goals
}
