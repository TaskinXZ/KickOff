import React, { useState, useEffect } from 'react';
import { 
  Team, 
  Player, 
  Match, 
  LeagueStanding, 
  SeasonRecord 
} from './types';
import { generateInitialLeagueData } from './data/teamsData';
import { 
  generateLeagueSchedule, 
  computeStandings, 
  advanceSeasonCareer 
} from './engine/careerEngine';
import { simulateFullMatchInstantly } from './engine/simulationEngine';
import { Header } from './components/Header';
import { PitchBoard } from './components/PitchBoard';
import { LeagueTable } from './components/LeagueTable';
import { SquadList } from './components/SquadList';
import { TransfersModal } from './components/TransfersModal';
import { DynastyHistory } from './components/DynastyHistory';
import { MatchDayModal } from './components/MatchDayModal';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { TeamSelectorModal } from './components/TeamSelectorModal';

const SAVE_KEY = 'KICKOFF_CAREER_SAVE_V1';

export const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [showTeamSelector, setShowTeamSelector] = useState<boolean>(false);

  // Core Game State
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [userTeamId, setUserTeamId] = useState<string>('arsenal');
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [standings, setStandings] = useState<LeagueStanding[]>([]);
  const [history, setHistory] = useState<SeasonRecord[]>([]);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'pitch' | 'table' | 'squad' | 'transfers' | 'history'>('pitch');
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [seasonSummaryData, setSeasonSummaryData] = useState<{
    seasonRecord: SeasonRecord;
    clubOffers: Team[];
  } | null>(null);

  // Initialize or load game state
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeams(parsed.teams);
        setPlayers(parsed.players);
        setUserTeamId(parsed.userTeamId);
        setCurrentSeason(parsed.currentSeason);
        setCurrentRound(parsed.currentRound);
        setFixtures(parsed.fixtures);
        setStandings(parsed.standings);
        setHistory(parsed.history || []);
        setIsInitialized(true);
        return;
      } catch (e) {
        console.error('Failed to load save, starting fresh', e);
      }
    }

    // Fresh start
    startFreshGame('arsenal', true);
  }, []);

  const startFreshGame = (startingTeamId: string, promptSelection: boolean = false) => {
    const { teams: initTeams, players: initPlayers } = generateInitialLeagueData();
    const teamIds = Object.keys(initTeams);
    const schedule = generateLeagueSchedule(teamIds, 1);
    const initialStandings = computeStandings(teamIds, schedule);

    setTeams(initTeams);
    setPlayers(initPlayers);
    setUserTeamId(startingTeamId);
    setCurrentSeason(1);
    setCurrentRound(1);
    setFixtures(schedule);
    setStandings(initialStandings);
    setHistory([]);
    setIsInitialized(true);

    if (promptSelection) {
      setShowTeamSelector(true);
    }
  };

  const handleSaveGame = () => {
    const payload = {
      teams,
      players,
      userTeamId,
      currentSeason,
      currentRound,
      fixtures,
      standings,
      history,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    alert('✅ Career successfully saved to browser storage!');
  };

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset your career? All 10-season dynasty progress will be cleared.')) {
      localStorage.removeItem(SAVE_KEY);
      startFreshGame('arsenal', true);
    }
  };

  // Find user's upcoming match for the current round
  const currentRoundMatches = fixtures.filter((m) => m.round === currentRound);
  const userUpcomingMatch = currentRoundMatches.find(
    (m) => (m.homeTeamId === userTeamId || m.awayTeamId === userTeamId) && !m.played
  );

  const nextOpponentTeam = userUpcomingMatch
    ? userUpcomingMatch.homeTeamId === userTeamId
      ? teams[userUpcomingMatch.awayTeamId]
      : teams[userUpcomingMatch.homeTeamId]
    : undefined;

  const totalRounds = (Object.keys(teams).length - 1) * 2;

  // Tactical Updates
  const handleUpdateTactics = (newTactics: Team['tactics']) => {
    setTeams((prev) => ({
      ...prev,
      [userTeamId]: {
        ...prev[userTeamId],
        tactics: newTactics,
      },
    }));
  };

  // Player Swapping (on pitch or bench)
  const handleSwapPlayers = (pAId: string, pBId: string) => {
    const team = teams[userTeamId];
    if (!team) return;

    const newLineup = [...team.lineup];
    const newBench = [...team.bench];

    const aInLineup = newLineup.indexOf(pAId);
    const bInLineup = newLineup.indexOf(pBId);
    const aInBench = newBench.indexOf(pAId);
    const bInBench = newBench.indexOf(pBId);

    if (aInLineup !== -1 && bInLineup !== -1) {
      // Swap within Starting XI
      newLineup[aInLineup] = pBId;
      newLineup[bInLineup] = pAId;
    } else if (aInLineup !== -1 && bInBench !== -1) {
      // Swap Lineup <-> Bench
      newLineup[aInLineup] = pBId;
      newBench[bInBench] = pAId;
    } else if (aInBench !== -1 && bInLineup !== -1) {
      // Swap Bench <-> Lineup
      newBench[aInBench] = pBId;
      newLineup[bInLineup] = pAId;
    }

    setTeams((prev) => ({
      ...prev,
      [userTeamId]: {
        ...prev[userTeamId],
        lineup: newLineup,
        bench: newBench,
      },
    }));
  };

  // Transfers
  const handleBuyPlayer = (player: Player, sellingTeam: Team) => {
    setTeams((prev) => {
      const uTeam = prev[userTeamId];
      const sTeam = prev[sellingTeam.id];

      return {
        ...prev,
        [userTeamId]: {
          ...uTeam,
          budget: uTeam.budget - player.value,
          players: [...uTeam.players, player.id],
          bench: [...uTeam.bench, player.id],
        },
        [sellingTeam.id]: {
          ...sTeam,
          budget: sTeam.budget + player.value,
          players: sTeam.players.filter((id) => id !== player.id),
          lineup: sTeam.lineup.filter((id) => id !== player.id),
          bench: sTeam.bench.filter((id) => id !== player.id),
        },
      };
    });
  };

  const handleSellPlayer = (player: Player) => {
    setTeams((prev) => {
      const uTeam = prev[userTeamId];
      return {
        ...prev,
        [userTeamId]: {
          ...uTeam,
          budget: uTeam.budget + player.value,
          players: uTeam.players.filter((id) => id !== player.id),
          lineup: uTeam.lineup.filter((id) => id !== player.id),
          bench: uTeam.bench.filter((id) => id !== player.id),
        },
      };
    });
  };

  // Completing User's Match & Simulating the rest of the round
  const handleFinishMatch = (completedUserMatch: Match) => {
    setActiveMatch(null);

    // 1. Update user match in fixtures
    const updatedFixtures = fixtures.map((m) =>
      m.id === completedUserMatch.id ? completedUserMatch : m
    );

    // 2. Simulate all remaining AI matches in this round instantly
    const fullySimulated = updatedFixtures.map((m) => {
      if (m.round === currentRound && !m.played) {
        const hTeam = teams[m.homeTeamId];
        const aTeam = teams[m.awayTeamId];
        if (hTeam && aTeam) {
          return simulateFullMatchInstantly(m, hTeam, aTeam, players);
        }
      }
      return m;
    });

    // 3. Compute updated standings
    const newStandings = computeStandings(Object.keys(teams), fullySimulated);
    setFixtures(fullySimulated);
    setStandings(newStandings);

    // 4. Check if Season Finished!
    if (currentRound >= totalRounds) {
      // Trigger Season Progression
      const careerAdv = advanceSeasonCareer(
        currentSeason,
        newStandings,
        teams,
        players,
        userTeamId
      );

      setSeasonSummaryData({
        seasonRecord: careerAdv.seasonRecord,
        clubOffers: careerAdv.clubOffers,
      });
      // Store progressed players & teams
      setPlayers(careerAdv.updatedPlayers);
      setTeams(careerAdv.updatedTeams);
      setHistory((prev) => [...prev, careerAdv.seasonRecord]);
    } else {
      // Advance to next round
      setCurrentRound((r) => r + 1);
    }
  };

  // Advance to Next Season from Summary Modal
  const handleConfirmNextSeason = (chosenTeamId: string) => {
    const nextSeasonNum = currentSeason + 1;
    setUserTeamId(chosenTeamId);
    setCurrentSeason(nextSeasonNum);
    setCurrentRound(1);

    // Generate new calendar
    const teamIds = Object.keys(teams);
    const newSchedule = generateLeagueSchedule(teamIds, nextSeasonNum);
    const newStandings = computeStandings(teamIds, newSchedule);

    setFixtures(newSchedule);
    setStandings(newStandings);
    setSeasonSummaryData(null);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-bold text-lg">
        Loading KickØff Engine...
      </div>
    );
  }

  const currentTeam = teams[userTeamId] || Object.values(teams)[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation & Status */}
      <Header
        currentTeam={currentTeam}
        currentSeason={currentSeason}
        currentRound={currentRound}
        totalRounds={totalRounds}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMatchDay={() => userUpcomingMatch && setActiveMatch(userUpcomingMatch)}
        onSaveGame={handleSaveGame}
        onResetGame={handleResetGame}
        nextOpponentName={nextOpponentTeam?.name}
        isMatchReady={Boolean(userUpcomingMatch)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'pitch' && (
          <PitchBoard
            team={currentTeam}
            players={players}
            onUpdateTactics={handleUpdateTactics}
            onSwapPlayers={handleSwapPlayers}
          />
        )}

        {activeTab === 'table' && (
          <LeagueTable
            standings={standings}
            teams={teams}
            players={players}
            userTeamId={userTeamId}
          />
        )}

        {activeTab === 'squad' && (
          <SquadList team={currentTeam} players={players} />
        )}

        {activeTab === 'transfers' && (
          <TransfersModal
            userTeam={currentTeam}
            allTeams={teams}
            allPlayers={players}
            onBuyPlayer={handleBuyPlayer}
            onSellPlayer={handleSellPlayer}
          />
        )}

        {activeTab === 'history' && (
          <DynastyHistory
            history={history}
            allTeams={teams}
            currentSeason={currentSeason}
          />
        )}
      </main>

      {/* Interactive Match Day Modal */}
      {activeMatch && (
        <MatchDayModal
          match={activeMatch}
          homeTeam={teams[activeMatch.homeTeamId]}
          awayTeam={teams[activeMatch.awayTeamId]}
          players={players}
          userTeamId={userTeamId}
          onFinishMatch={handleFinishMatch}
          onClose={() => setActiveMatch(null)}
        />
      )}

      {/* Season Summary & Career Renewal Modal */}
      {seasonSummaryData && (
        <SeasonSummaryModal
          seasonRecord={seasonSummaryData.seasonRecord}
          championTeam={teams[seasonSummaryData.seasonRecord.championId]}
          userTeam={teams[userTeamId]}
          clubOffers={seasonSummaryData.clubOffers}
          onConfirmNextSeason={handleConfirmNextSeason}
        />
      )}

      {/* Initial Team Selector Modal */}
      {showTeamSelector && (
        <TeamSelectorModal
          teams={teams}
          players={players}
          onSelectTeam={(chosenId) => {
            setUserTeamId(chosenId);
            setShowTeamSelector(false);
          }}
        />
      )}
    </div>
  );
};
