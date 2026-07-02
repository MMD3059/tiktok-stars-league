export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  value?: number | null;
  manualPoints?: number | null;
  manualWon?: number | null;
  manualDrawn?: number | null;
  manualLost?: number | null;
  manualGoalsFor?: number | null;
  manualGoalsAgainst?: number | null;
  players?: Player[];
  createdAt: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  imageUrl?: string | null;
  price?: number | null;
  isCaptain: boolean;
  isSubstitute: boolean;
  goalsScored: number;
  teamId: number;
  team?: Team;
  createdAt: string;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  homeYellowCards: number;
  homeRedCards: number;
  awayYellowCards: number;
  awayRedCards: number;
  date: string;
  time: string;
  week: number;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  events?: MatchEvent[];
  createdAt: string;
}

export interface MatchEvent {
  id: number;
  matchId: number;
  teamId: number;
  playerId: number;
  playerName: string;
  type: "goal" | "yellow_card" | "red_card";
  createdAt: string;
}

export interface Standing {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  yellowCards: number;
  redCards: number;
}

export interface Transfer {
  id: number;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  transferDate: string;
  createdAt: string;
}
