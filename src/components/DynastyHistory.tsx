import React from 'react';
import { SeasonRecord, Team } from '../types';
import { Trophy, History, Award, Crown } from 'lucide-react';

interface DynastyHistoryProps {
  history: SeasonRecord[];
  allTeams: Record<string, Team>;
  currentSeason: number;
}

export const DynastyHistory: React.FC<DynastyHistoryProps> = ({
  history,
  allTeams,
  currentSeason,
}) => {
  const titlesWon = history.filter((h) => h.championId === h.userTeamId).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Trophy Cabinet Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            10-Season Managerial Dynasty & Trophy Cabinet
          </h2>
          <p className="text-xs text-slate-400">
            Chronicle of European champions, Golden Boot recipients, and your personal legacy over a decade.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Trophies Lifted</div>
            <div className="text-base font-extrabold text-amber-400 mono-num">
              {titlesWon} {titlesWon === 1 ? 'Title' : 'Titles'}
            </div>
          </div>
        </div>
      </div>

      {/* History Grid */}
      {history.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-300">Your Dynasty Has Just Begun!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Complete your first 30-game season campaign to engrave your name into the European Super Championship history books.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => {
            const champion = allTeams[record.championId];
            const runnerUp = allTeams[record.runnerUpId];
            const userTeam = allTeams[record.userTeamId];
            const userWon = record.championId === record.userTeamId;

            return (
              <div
                key={record.season}
                className={`p-4 rounded-2xl border transition-all ${
                  userWon
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-black mono-num text-white">
                      Season {record.season} ({record.year})
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                        <span>Champion: {champion?.name || 'Champion'}</span>
                        {userWon && (
                          <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full font-black">
                            YOUR TITLE!
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Runner-Up: {runnerUp?.name || 'Runner Up'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Your Finish:</span>
                      <span className="font-bold text-emerald-400 mono-num">
                        {record.userFinishedPosition}th Place ({userTeam?.shortName})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Golden Boot:</span>
                      <span className="font-bold text-white">
                        {record.topScorer.playerName} ({record.topScorer.goals} goals)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
