import { Match, LeagueStanding, Team, Player, SeasonRecord } from '../types';

export function generateLeagueSchedule(teamIds: string[], season: number): Match[] {
  const matches: Match[] = [];
  const teams = [...teamIds];
  if (teams.length % 2 !== 0) {
    teams.push('BYE');
  }

  const numTeams = teams.length;
  const numRounds = (numTeams - 1) * 2; // Home and Away
  const halfRounds = numTeams - 1;
  let matchIdCounter = 1;

  for (let round = 0; round < halfRounds; round++) {
    for (let i = 0; i < numTeams / 2; i++) {
      const home = teams[i];
      const away = teams[numTeams - 1 - i];

      if (home !== 'BYE' && away !== 'BYE') {
        matches.push({
          id: `s${season}_m${matchIdCounter++}`,
          season,
          round: round + 1,
          homeTeamId: round % 2 === 0 ? home : away,
          awayTeamId: round % 2 === 0 ? away : home,
          homeScore: 0,
          awayScore: 0,
          played: false,
          events: [],
          stats: {
            possession: [50, 50],
            shots: [0, 0],
            shotsOnTarget: [0, 0],
            corners: [0, 0],
            fouls: [0, 0],
            yellowCards: [0, 0],
            redCards: [0, 0],
            expectedGoals: [0, 0],
          },
        });
      }
    }

    // Rotate teams array keeping team[0] fixed
    teams.splice(1, 0, teams.pop()!);
  }

  // Second half of the season (reverse fixtures)
  for (let round = 0; round < halfRounds; round++) {
    const firstHalfMatches = matches.filter((m) => m.round === round + 1);
    firstHalfMatches.forEach((orig) => {
      matches.push({
        id: `s${season}_m${matchIdCounter++}`,
        season,
        round: round + 1 + halfRounds,
        homeTeamId: orig.awayTeamId,
        awayTeamId: orig.homeTeamId,
        homeScore: 0,
        awayScore: 0,
        played: false,
        events: [],
        stats: {
          possession: [50, 50],
          shots: [0, 0],
          shotsOnTarget: [0, 0],
          corners: [0, 0],
          fouls: [0, 0],
          yellowCards: [0, 0],
          redCards: [0, 0],
          expectedGoals: [0, 0],
        },
      });
    });
  }

  return matches;
}

export function computeStandings(teamIds: string[], matches: Match[]): LeagueStanding[] {
  const table: Record<string, LeagueStanding> = {};

  teamIds.forEach((id) => {
    table[id] = {
      teamId: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    };
  });

  matches.forEach((m) => {
    if (!m.played) return;
    const home = table[m.homeTeamId];
    const away = table[m.awayTeamId];
    if (!home || !away) return;

    home.played++;
    away.played++;
    home.goalsFor += m.homeScore;
    home.goalsAgainst += m.awayScore;
    away.goalsFor += m.awayScore;
    away.goalsAgainst += m.homeScore;

    if (m.homeScore > m.awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
      home.form.unshift('W');
      away.form.unshift('L');
    } else if (m.homeScore < m.awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
      away.form.unshift('W');
      home.form.unshift('L');
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
      home.form.unshift('D');
      away.form.unshift('D');
    }

    home.form = home.form.slice(0, 5);
    away.form = away.form.slice(0, 5);
    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  });

  return Object.values(table).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

/**
 * 10-Season Progression:
 * Handles player aging, skill growth, decay, AI transfers, and career statistics!
 */
export function advanceSeasonCareer(
  currentSeason: number,
  standings: LeagueStanding[],
  teams: Record<string, Team>,
  players: Record<string, Player>,
  userTeamId: string
): {
  newSeason: number;
  seasonRecord: SeasonRecord;
  updatedPlayers: Record<string, Player>;
  updatedTeams: Record<string, Team>;
  clubOffers: Team[];
} {
  const champion = standings[0];
  const runnerUp = standings[1] || standings[0];

  // Find Top Scorer of the season
  let bestScorerPlayer: Player | null = null;
  let bestScorerTeamId: string = '';

  for (const p of Object.values(players)) {
    if (!bestScorerPlayer || p.seasonStats.goals > bestScorerPlayer.seasonStats.goals) {
      bestScorerPlayer = p;
      const team = Object.values(teams).find((t) => t.players.includes(p.id));
      bestScorerTeamId = team?.id || '';
    }
  }

  const userPos = standings.findIndex((s) => s.teamId === userTeamId) + 1;
  const topScorerTeam = teams[bestScorerTeamId];

  const seasonRecord: SeasonRecord = {
    season: currentSeason,
    year: 2025 + currentSeason - 1,
    championId: champion.teamId,
    runnerUpId: runnerUp.teamId,
    topScorer: {
      playerId: bestScorerPlayer?.id || '',
      playerName: bestScorerPlayer?.name || 'Unknown',
      teamName: topScorerTeam?.name || 'League',
      goals: bestScorerPlayer?.seasonStats.goals || 0,
    },
    userFinishedPosition: userPos,
    userTeamId,
  };

  // Clone players & teams for updates
  const updatedPlayers: Record<string, Player> = {};
  const updatedTeams: Record<string, Team> = { ...teams };

  Object.values(players).forEach((p) => {
    const player = { ...p };
    player.age += 1;
    player.currentStamina = 100;
    player.isInjured = false;
    player.injuryWeeksRemaining = 0;
    player.yellowCards = 0;
    player.redCards = 0;
    player.seasonStats = { goals: 0, assists: 0, appearances: 0, cleanSheets: 0 };
    player.contractYears = Math.max(1, player.contractYears - 1);

    // Development Curve
    if (player.age <= 22) {
      // Young talent explosion towards potential
      const growth = Math.min(player.potential - player.overall, Math.floor(Math.random() * 4) + 1);
      player.overall = Math.min(player.potential, player.overall + Math.max(0, growth));
      player.stats.pace = Math.min(99, player.stats.pace + 1);
      player.stats.shooting = Math.min(99, player.stats.shooting + 1);
      player.stats.passing = Math.min(99, player.stats.passing + 1);
      player.value = Math.round(player.value * 1.25);
    } else if (player.age >= 31) {
      // Veteran physical decline
      const decay = Math.floor(Math.random() * 2) + 1;
      player.overall = Math.max(60, player.overall - decay);
      player.stats.pace = Math.max(45, player.stats.pace - 3);
      player.stats.stamina = Math.max(55, player.stats.stamina - 2);
      player.stats.physical = Math.max(50, player.stats.physical - 1);
      player.value = Math.max(1_000_000, Math.round(player.value * 0.75));
    }

    updatedPlayers[player.id] = player;
  });

  // End-of-season prize money & budget reset
  Object.values(updatedTeams).forEach((t) => {
    const standingIdx = standings.findIndex((s) => s.teamId === t.id);
    const prizeMoney = Math.max(15_000_000, (20 - standingIdx) * 5_000_000);
    t.budget += prizeMoney;
    t.streak = 0;
  });

  // Generate 3 job offers for user from other clubs
  const otherTeams = Object.values(updatedTeams).filter((t) => t.id !== userTeamId);
  // Sort by reputation and pick interesting options
  otherTeams.sort(() => Math.random() - 0.5);
  const clubOffers = otherTeams.slice(0, 3);

  return {
    newSeason: currentSeason + 1,
    seasonRecord,
    updatedPlayers,
    updatedTeams,
    clubOffers,
  };
}
