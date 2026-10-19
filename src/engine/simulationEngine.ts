import { Match, MatchEvent, MatchStats, Team, Player, Position } from '../types';

export interface SimState {
  currentMinute: number;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stats: MatchStats;
  isFinished: boolean;
  isHalfTime: boolean;
  momentum: number; // -100 (away dominating) to +100 (home dominating)
}

function calculateTeamOverall(team: Team, players: Record<string, Player>): {
  attack: number;
  midfield: number;
  defense: number;
  gk: number;
  total: number;
} {
  let attSum = 0, attCount = 0;
  let midSum = 0, midCount = 0;
  let defSum = 0, defCount = 0;
  let gkVal = 75;

  team.lineup.forEach((pId) => {
    const p = players[pId];
    if (!p) return;
    const effOvr = (p.overall * 0.8) + (p.form * 2) + (p.morale * 1.5) * (p.currentStamina / 100);

    if (p.position === 'GK') {
      gkVal = effOvr;
    } else if (p.position === 'CB' || p.position === 'LB' || p.position === 'RB') {
      defSum += effOvr;
      defCount++;
    } else if (p.position === 'CDM' || p.position === 'CM' || p.position === 'CAM') {
      midSum += effOvr;
      midCount++;
    } else {
      attSum += effOvr;
      attCount++;
    }
  });

  const attack = attCount > 0 ? attSum / attCount : 75;
  const midfield = midCount > 0 ? midSum / midCount : 75;
  const defense = defCount > 0 ? defSum / defCount : 75;

  return {
    attack,
    midfield,
    defense,
    gk: gkVal,
    total: (attack * 0.3) + (midfield * 0.35) + (defense * 0.25) + (gkVal * 0.1),
  };
}

export function initializeMatchSim(
  match: Match,
  homeTeam: Team,
  awayTeam: Team,
  players: Record<string, Player>
): SimState {
  const homePower = calculateTeamOverall(homeTeam, players);
  const awayPower = calculateTeamOverall(awayTeam, players);

  // Initial possession based on midfield & tactics
  const midDiff = homePower.midfield - awayPower.midfield;
  const homePoss = Math.min(72, Math.max(28, Math.round(50 + midDiff * 0.8)));
  const awayPoss = 100 - homePoss;

  return {
    currentMinute: 0,
    homeScore: 0,
    awayScore: 0,
    events: [],
    stats: {
      possession: [homePoss, awayPoss],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      corners: [0, 0],
      fouls: [0, 0],
      yellowCards: [0, 0],
      redCards: [0, 0],
      expectedGoals: [0, 0],
    },
    isFinished: false,
    isHalfTime: false,
    momentum: 0,
  };
}

export function simulateMinuteTick(
  state: SimState,
  homeTeam: Team,
  awayTeam: Team,
  players: Record<string, Player>
): SimState {
  if (state.isFinished || state.isHalfTime) return state;

  const minute = state.currentMinute + 1;
  const homeP = calculateTeamOverall(homeTeam, players);
  const awayP = calculateTeamOverall(awayTeam, players);

  // Home advantage + streak momentum
  const homeStreakMod = Math.min(6, Math.max(-6, homeTeam.streak * 1.5));
  const awayStreakMod = Math.min(6, Math.max(-6, awayTeam.streak * 1.5));
  const homeEff = homeP.total + 2.5 + homeStreakMod;
  const awayEff = awayP.total + awayStreakMod;

  // Tactical mentality bonus
  const getMentalityBonus = (m: string) => {
    if (m === 'All-Out Attack') return { att: 8, def: -8 };
    if (m === 'Attacking') return { att: 4, def: -4 };
    if (m === 'Defensive') return { att: -4, def: 5 };
    if (m === 'Ultra Defensive') return { att: -8, def: 9 };
    return { att: 0, def: 0 };
  };

  const homeM = getMentalityBonus(homeTeam.tactics.mentality);
  const awayM = getMentalityBonus(awayTeam.tactics.mentality);

  const homeAttackScore = homeP.attack + homeM.att + homeStreakMod;
  const awayDefenseScore = awayP.defense + awayM.def;

  const awayAttackScore = awayP.attack + awayM.att + awayStreakMod;
  const homeDefenseScore = homeP.defense + homeM.def + 2;

  // Minute chance for an action opportunity (roughly 1 in 4 ticks)
  const actionRoll = Math.random();
  const newEvents = [...state.events];
  const newStats = { ...state.stats };
  let newHomeScore = state.homeScore;
  let newAwayScore = state.awayScore;
  let newMomentum = state.momentum;

  // Slight fatigue per minute
  homeTeam.lineup.forEach(pId => {
    if (players[pId] && players[pId].currentStamina > 40) {
      players[pId].currentStamina -= 0.15;
    }
  });
  awayTeam.lineup.forEach(pId => {
    if (players[pId] && players[pId].currentStamina > 40) {
      players[pId].currentStamina -= 0.15;
    }
  });

  if (actionRoll < 0.22) {
    // An attacking phase occurs
    const isHomeAttack = Math.random() * (homeEff + awayEff) < homeEff;
    const attackingTeam = isHomeAttack ? homeTeam : awayTeam;
    const defendingTeam = isHomeAttack ? awayTeam : homeTeam;
    const attScore = isHomeAttack ? homeAttackScore : awayAttackScore;
    const defScore = isHomeAttack ? awayDefenseScore : homeDefenseScore;
    const statIdx = isHomeAttack ? 0 : 1;
    const otherIdx = isHomeAttack ? 1 : 0;

    // Shift momentum
    newMomentum = Math.min(100, Math.max(-100, newMomentum + (isHomeAttack ? 15 : -15)));

    // Choose key attackers
    const attackers = attackingTeam.lineup
      .map(id => players[id])
      .filter(p => p && (p.position === 'ST' || p.position === 'LW' || p.position === 'RW' || p.position === 'CAM'));
    const chosenAttacker = attackers.length > 0 
      ? attackers[Math.floor(Math.random() * attackers.length)] 
      : players[attackingTeam.lineup[0]];

    const midAssisters = attackingTeam.lineup
      .map(id => players[id])
      .filter(p => p && p.id !== chosenAttacker?.id && (p.position === 'CAM' || p.position === 'CM' || p.position === 'LW' || p.position === 'RW'));
    const chosenAssister = midAssisters.length > 0
      ? midAssisters[Math.floor(Math.random() * midAssisters.length)]
      : undefined;

    // Shot taken!
    newStats.shots[statIdx]++;
    const shotQuality = (attScore - defScore + 50) / 100; // 0.2 to 0.8
    const xGAdd = Math.max(0.04, Math.min(0.75, shotQuality * 0.45));
    newStats.expectedGoals[statIdx] = Number((newStats.expectedGoals[statIdx] + xGAdd).toFixed(2));

    // Shot on target probability
    const onTargetRoll = Math.random();
    if (onTargetRoll < 0.55 + (chosenAttacker ? chosenAttacker.stats.shooting * 0.003 : 0)) {
      newStats.shotsOnTarget[statIdx]++;

      // Goal probability vs Goalkeeper
      const gkId = defendingTeam.lineup.find(id => players[id]?.position === 'GK');
      const gk = gkId ? players[gkId] : undefined;
      const gkScore = gk ? gk.overall : 75;

      const finishFactor = (chosenAttacker ? chosenAttacker.stats.shooting : 75) - (gkScore * 0.85);
      const goalThreshold = 0.32 + (finishFactor * 0.008);

      if (Math.random() < goalThreshold) {
        // GOAL!
        if (isHomeAttack) newHomeScore++;
        else newAwayScore++;

        if (chosenAttacker) {
          chosenAttacker.seasonStats.goals++;
          chosenAttacker.careerStats.goals++;
          chosenAttacker.morale = Math.min(10, chosenAttacker.morale + 1);
        }
        if (chosenAssister) {
          chosenAssister.seasonStats.assists++;
          chosenAssister.careerStats.assists++;
        }

        const descriptions = [
          `GOAL! ${chosenAttacker?.name} curls a sensational strike into the top corner!`,
          `GOAL! Clinical finish from ${chosenAttacker?.name} after a flowing team move!`,
          `GOAL! ${chosenAttacker?.name} pounces on the rebound and hammers it home!`,
          `GOAL! Bullet header from ${chosenAttacker?.name} leaving the keeper no chance!`,
        ];

        newEvents.unshift({
          minute,
          type: 'goal',
          teamId: attackingTeam.id,
          playerId: chosenAttacker?.id,
          playerName: chosenAttacker?.name,
          assistPlayerId: chosenAssister?.id,
          assistPlayerName: chosenAssister?.name,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
        });
      } else {
        // Saved by keeper
        if (Math.random() < 0.4) {
          newEvents.unshift({
            minute,
            type: 'big_save',
            teamId: defendingTeam.id,
            description: `Huge save! ${gk?.name || 'The keeper'} pushes ${chosenAttacker?.name}'s fierce drive wide!`,
          });
          newStats.corners[statIdx]++;
        }
      }
    } else if (Math.random() < 0.1) {
      // Woodwork hit
      newEvents.unshift({
        minute,
        type: 'woodwork',
        teamId: attackingTeam.id,
        description: `OFF THE POST! ${chosenAttacker?.name}'s thunderous shot rattles the woodwork!`,
      });
    }
  } else if (actionRoll < 0.26) {
    // Foul / Card event
    const foulTeam = Math.random() > 0.5 ? homeTeam : awayTeam;
    const fIdx = foulTeam.id === homeTeam.id ? 0 : 1;
    newStats.fouls[fIdx]++;

    if (Math.random() < 0.28) {
      // Yellow card
      const culpritId = foulTeam.lineup[Math.floor(Math.random() * foulTeam.lineup.length)];
      const culprit = players[culpritId];
      newStats.yellowCards[fIdx]++;
      if (culprit) culprit.yellowCards++;

      newEvents.unshift({
        minute,
        type: 'yellow_card',
        teamId: foulTeam.id,
        playerId: culprit?.id,
        playerName: culprit?.name,
        description: `Yellow Card: ${culprit?.name} receives a booking for a tactical foul.`,
      });
    }
  }

  // Momentum decay towards neutral
  newMomentum = Math.round(newMomentum * 0.95);

  const isHalf = minute === 45;
  const isEnd = minute >= 90;

  return {
    currentMinute: minute,
    homeScore: newHomeScore,
    awayScore: newAwayScore,
    events: newEvents,
    stats: newStats,
    isFinished: isEnd,
    isHalfTime: isHalf,
    momentum: newMomentum,
  };
}

export function simulateFullMatchInstantly(
  match: Match,
  homeTeam: Team,
  awayTeam: Team,
  players: Record<string, Player>
): Match {
  let sim = initializeMatchSim(match, homeTeam, awayTeam, players);
  while (!sim.isFinished) {
    if (sim.isHalfTime) {
      sim.isHalfTime = false; // Bypass pause in instant sim
    }
    sim = simulateMinuteTick(sim, homeTeam, awayTeam, players);
  }

  // Update match object
  return {
    ...match,
    homeScore: sim.homeScore,
    awayScore: sim.awayScore,
    events: sim.events,
    stats: sim.stats,
    played: true,
  };
}
