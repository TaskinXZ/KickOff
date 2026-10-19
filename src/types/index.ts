export type Position = 
  | 'GK' 
  | 'CB' | 'LB' | 'RB' 
  | 'CDM' | 'CM' | 'CAM' 
  | 'LW' | 'RW' | 'ST';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  stamina: number; // max stamina
}

export interface PlayerHistory {
  goals: number;
  assists: number;
  appearances: number;
  cleanSheets: number;
}

export interface Player {
  id: string;
  name: string;
  nationality: string;
  age: number;
  position: Position;
  secondaryPosition?: Position;
  number: number;
  overall: number; // 50 - 99
  potential: number; // 50 - 99
  stats: PlayerStats;
  currentStamina: number; // 0 - 100 in match
  form: number; // 1 - 10
  morale: number; // 1 - 10
  value: number; // market value in Euros
  wage: number; // weekly wage in Euros
  contractYears: number;
  seasonStats: PlayerHistory;
  careerStats: PlayerHistory;
  isInjured: boolean;
  injuryWeeksRemaining: number;
  yellowCards: number;
  redCards: number;
}

export type FormationName = '4-3-3' | '4-2-3-1' | '3-5-2' | '4-4-2' | '5-3-2';
export type Mentality = 'Ultra Defensive' | 'Defensive' | 'Balanced' | 'Attacking' | 'All-Out Attack';
export type PressingStyle = 'Low Block' | 'Mid Block' | 'Gegenpress';

export interface TacticalSetup {
  formation: FormationName;
  mentality: Mentality;
  pressing: PressingStyle;
  tempo: 'Slow & Patient' | 'Standard' | 'Fast Counter';
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  stadium: string;
  stadiumCapacity: number;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  budget: number; // transfer budget in Euros
  wageBudget: number; // weekly wage budget in Euros
  reputation: number; // 1 - 5 stars
  players: string[]; // all player IDs in club
  lineup: string[]; // 11 player IDs starting
  bench: string[]; // up to 7 player IDs
  tactics: TacticalSetup;
  streak: number; // positive = win streak, negative = loss streak
}

export type MatchEventType = 
  | 'goal' 
  | 'penalty_goal' 
  | 'penalty_missed' 
  | 'yellow_card' 
  | 'red_card' 
  | 'injury' 
  | 'substitution' 
  | 'woodwork' 
  | 'big_save';

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  teamId: string;
  playerId?: string;
  playerName?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  subInPlayerId?: string;
  subInPlayerName?: string;
  description: string;
}

export interface MatchStats {
  possession: [number, number]; // [home%, away%]
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  expectedGoals: [number, number]; // xG
}

export interface Match {
  id: string;
  season: number;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  played: boolean;
  events: MatchEvent[];
  stats: MatchStats;
}

export interface LeagueStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface SeasonRecord {
  season: number;
  year: number;
  championId: string;
  runnerUpId: string;
  topScorer: {
    playerId: string;
    playerName: string;
    teamName: string;
    goals: number;
  };
  userFinishedPosition: number;
  userTeamId: string;
}

export interface CareerSaveState {
  managerName: string;
  userTeamId: string;
  currentSeason: number; // 1 to 10
  currentYear: number;
  currentRound: number; // 1 to total
  totalRounds: number;
  transferWindowOpen: boolean;
  history: SeasonRecord[];
  managerRating: number; // 0 - 100
}
