import React, { useState, useEffect, useRef } from 'react';
import { Match, Team, Player, MatchEvent } from '../types';
import { 
  SimState, 
  initializeMatchSim, 
  simulateMinuteTick 
} from '../engine/simulationEngine';
import { 
  Play, 
  Pause, 
  FastForward, 
  SkipForward, 
  Shield, 
  RefreshCw, 
  Activity, 
  Trophy,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchDayModalProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  players: Record<string, Player>;
  userTeamId: string;
  onFinishMatch: (completedMatch: Match) => void;
  onClose: () => void;
}

export const MatchDayModal: React.FC<MatchDayModalProps> = ({
  match,
  homeTeam,
  awayTeam,
  players,
  userTeamId,
  onFinishMatch,
  onClose,
}) => {
  const [simState, setSimState] = useState<SimState>(() =>
    initializeMatchSim(match, homeTeam, awayTeam, players)
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(100); // ms per tick
  const [selectedSubIn, setSelectedSubIn] = useState<string | null>(null);
  const [halfTimeSubDone, setHalfTimeSubDone] = useState<boolean>(false);

  const isUserHome = userTeamId === homeTeam.id;
  const userTeam = isUserHome ? homeTeam : awayTeam;

  // Running simulation loop
  useEffect(() => {
    if (!isPlaying || simState.isFinished || simState.isHalfTime) return;

    const timer = setTimeout(() => {
      setSimState((prev) => {
        const next = simulateMinuteTick(prev, homeTeam, awayTeam, players);
        if (next.isFinished) {
          setIsPlaying(false);
          // Check if user won
          const userWon =
            (isUserHome && next.homeScore > next.awayScore) ||
            (!isUserHome && next.awayScore > next.homeScore);
          if (userWon) {
            confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
          }
        }
        return next;
      });
    }, simSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, simState, simSpeed, homeTeam, awayTeam, players, isUserHome]);

  const handleInstantSim = () => {
    let current = { ...simState };
    while (!current.isFinished) {
      if (current.isHalfTime) {
        current.isHalfTime = false;
      }
      current = simulateMinuteTick(current, homeTeam, awayTeam, players);
    }
    setSimState(current);
    setIsPlaying(false);
  };

  const handleFinishAndExit = () => {
    const completed: Match = {
      ...match,
      homeScore: simState.homeScore,
      awayScore: simState.awayScore,
      events: simState.events,
      stats: simState.stats,
      played: true,
    };
    onFinishMatch(completed);
  };

  const handleHalfTimeSub = (pitchPlayerId: string, benchPlayerId: string) => {
    // Swap in user lineup
    const idx = userTeam.lineup.indexOf(pitchPlayerId);
    const bIdx = userTeam.bench.indexOf(benchPlayerId);
    if (idx !== -1 && bIdx !== -1) {
      userTeam.lineup[idx] = benchPlayerId;
      userTeam.bench[bIdx] = pitchPlayerId;
      setHalfTimeSubDone(true);
      setSelectedSubIn(null);

      // Add substitution event to log
      const pOut = players[pitchPlayerId];
      const pIn = players[benchPlayerId];
      setSimState((prev) => ({
        ...prev,
        events: [
          {
            minute: 45,
            type: 'substitution',
            teamId: userTeam.id,
            description: `Half-Time Sub: ${pIn?.name} replaces ${pOut?.name}`,
          },
          ...prev.events,
        ],
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Top Header & Scoreboard */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-inner">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center space-x-3 w-2/5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg border border-white/20"
                style={{ backgroundColor: homeTeam.primaryColor, color: homeTeam.textColor }}
              >
                {homeTeam.shortName}
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-black text-white truncate">
                  {homeTeam.name}
                </div>
                {isUserHome && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    YOUR CLUB
                  </span>
                )}
              </div>
            </div>

            {/* Score & Minute */}
            <div className="flex flex-col items-center justify-center w-1/5">
              <div className="flex items-center space-x-3 text-3xl sm:text-4xl font-black text-white mono-num">
                <span>{simState.homeScore}</span>
                <span className="text-slate-600">-</span>
                <span>{simState.awayScore}</span>
              </div>
              <div className="mt-1 px-3 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-emerald-400 mono-num flex items-center space-x-1">
                {simState.isFinished ? (
                  <span>FULL TIME</span>
                ) : simState.isHalfTime ? (
                  <span className="text-amber-400">HALF TIME</span>
                ) : (
                  <span>{simState.currentMinute}'</span>
                )}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-end space-x-3 w-2/5 text-right">
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-black text-white truncate">
                  {awayTeam.name}
                </div>
                {!isUserHome && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    YOUR CLUB
                  </span>
                )}
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg border border-white/20"
                style={{ backgroundColor: awayTeam.primaryColor, color: awayTeam.textColor }}
              >
                {awayTeam.shortName}
              </div>
            </div>
          </div>

          {/* Dynamic Momentum Meter */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mb-1">
              <span>{homeTeam.shortName} Pressure</span>
              <span className="text-slate-500">Field Momentum</span>
              <span>{awayTeam.shortName} Pressure</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${50 + simState.momentum / 2}%` }}
              />
              <div
                className="h-full bg-gradient-to-l from-rose-500 to-amber-500 transition-all duration-300"
                style={{ width: `${50 - simState.momentum / 2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Half-Time Locker Room Intermission (Minute 45) */}
        {simState.isHalfTime && !simState.isFinished && (
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-amber-300 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Half-Time Tactical Talk & Substitutions
                </h3>
                <p className="text-xs text-slate-300">
                  Adjust tactics, swap fatigued players, or give an inspiring team talk before the 2nd half begins!
                </p>
              </div>

              <button
                onClick={() => {
                  setSimState((prev) => ({ ...prev, isHalfTime: false }));
                  setIsPlaying(true);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg active:scale-95"
              >
                Start 2nd Half &rarr;
              </button>
            </div>

            {/* Quick Half-Time Substitutions */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white mb-2 block">
                Make Half-Time Substitution:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* On-Pitch Players */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold mb-2 block">
                    Starting XI (Select player to sub off):
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {userTeam.lineup.map((pId) => {
                      const p = players[pId];
                      if (!p) return null;
                      const isSel = selectedSubIn === pId;
                      return (
                        <div
                          key={pId}
                          onClick={() => setSelectedSubIn(pId)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                            isSel
                              ? 'bg-amber-500/30 border border-amber-400 text-white font-bold'
                              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span>{p.name} ({p.position})</span>
                          <span className="text-[10px] text-slate-400">
                            Sta: {Math.round(p.currentStamina)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bench Substitutes */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold mb-2 block">
                    Available Bench (Click to bring on):
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {userTeam.bench.map((bId) => {
                      const bp = players[bId];
                      if (!bp) return null;
                      return (
                        <button
                          key={bId}
                          disabled={!selectedSubIn}
                          onClick={() => selectedSubIn && handleHalfTimeSub(selectedSubIn, bId)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                            selectedSubIn
                              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold cursor-pointer'
                              : 'bg-slate-900/30 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span>{bp.name} ({bp.position})</span>
                          <span className="text-[10px] text-slate-400">OVR {bp.overall}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Event Ticker Feed */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Match Commentary & Key Events
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {simState.events.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-4 text-center">
                Match is kicking off... players are settling into rhythm.
              </div>
            ) : (
              simState.events.map((ev, i) => (
                <div
                  key={i}
                  className={`flex items-start space-x-2 text-xs p-2 rounded-xl transition-all ${
                    ev.type === 'goal'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 font-bold'
                      : ev.type === 'yellow_card'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                      : ev.type === 'woodwork'
                      ? 'bg-rose-500/10 text-rose-300'
                      : 'bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <span className="font-black mono-num text-slate-400">{ev.minute}'</span>
                  <span className="text-sm">
                    {ev.type === 'goal'
                      ? '⚽'
                      : ev.type === 'yellow_card'
                      ? '🟨'
                      : ev.type === 'woodwork'
                      ? '🥅'
                      : ev.type === 'big_save'
                      ? '🧤'
                      : '🔄'}
                  </span>
                  <span>{ev.description}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Match Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold">Possession</div>
            <div className="text-sm font-extrabold text-white mt-0.5 mono-num">
              {simState.stats.possession[0]}% - {simState.stats.possession[1]}%
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold">Total Shots (On Target)</div>
            <div className="text-sm font-extrabold text-white mt-0.5 mono-num">
              {simState.stats.shots[0]} ({simState.stats.shotsOnTarget[0]}) - {simState.stats.shots[1]} ({simState.stats.shotsOnTarget[1]})
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold">Expected Goals (xG)</div>
            <div className="text-sm font-extrabold text-emerald-400 mt-0.5 mono-num">
              {simState.stats.expectedGoals[0]} - {simState.stats.expectedGoals[1]}
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold">Corners / Fouls</div>
            <div className="text-sm font-extrabold text-white mt-0.5 mono-num">
              {simState.stats.corners[0]}/{simState.stats.fouls[0]} - {simState.stats.corners[1]}/{simState.stats.fouls[1]}
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            {!simState.isFinished && (
              <>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSimSpeed(simSpeed === 100 ? 30 : 100)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    simSpeed === 30 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <FastForward className="w-3.5 h-3.5 inline mr-1" />
                  {simSpeed === 30 ? 'Fast (5x)' : '1x'}
                </button>
                <button
                  onClick={handleInstantSim}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all"
                >
                  <SkipForward className="w-3.5 h-3.5 inline mr-1" />
                  Sim to End
                </button>
              </>
            )}
          </div>

          <div>
            {simState.isFinished ? (
              <button
                onClick={handleFinishAndExit}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-xl active:scale-95 transition-all"
              >
                Confirm Match Result &rarr;
              </button>
            ) : (
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg"
              >
                Close Modal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
