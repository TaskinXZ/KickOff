import React from 'react';
import { LeagueStanding, Team, Player } from '../types';
import { Trophy, Award } from 'lucide-react';

interface LeagueTableProps {
  standings: LeagueStanding[];
  teams: Record<string, Team>;
  players: Record<string, Player>;
  userTeamId: string;
}

export const LeagueTable: React.FC<LeagueTableProps> = ({
  standings,
  teams,
  players,
  userTeamId,
}) => {
  // Compute Top Scorers across all players
  const topScorers = Object.values(players)
    .filter((p) => p.seasonStats.goals > 0)
    .sort((a, b) => b.seasonStats.goals - a.seasonStats.goals)
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main League Table (2 cols on large screen) */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            European Super Championship Standings
          </h2>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> UCL
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> UEL
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Relegation
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-3">Club</th>
                <th className="py-2.5 px-2 text-center">PL</th>
                <th className="py-2.5 px-2 text-center">W</th>
                <th className="py-2.5 px-2 text-center">D</th>
                <th className="py-2.5 px-2 text-center">L</th>
                <th className="py-2.5 px-2 text-center hidden sm:table-cell">GD</th>
                <th className="py-2.5 px-3 text-center font-bold text-white">PTS</th>
                <th className="py-2.5 px-2 text-center hidden md:table-cell">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {standings.map((row, index) => {
                const team = teams[row.teamId];
                if (!team) return null;
                const isUser = row.teamId === userTeamId;
                const pos = index + 1;

                // Qualification zone borders
                let posColor = 'text-slate-400';
                let indicator = 'bg-transparent';
                if (pos <= 4) {
                  posColor = 'text-emerald-400 font-bold';
                  indicator = 'bg-emerald-400';
                } else if (pos <= 6) {
                  posColor = 'text-cyan-400 font-bold';
                  indicator = 'bg-cyan-400';
                } else if (pos >= standings.length - 2) {
                  posColor = 'text-rose-400 font-bold';
                  indicator = 'bg-rose-500';
                }

                return (
                  <tr
                    key={row.teamId}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-emerald-500/15 border-l-4 border-emerald-400 font-bold text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-1 h-3 rounded-full ${indicator}`} />
                        <span className={`mono-num ${posColor}`}>{pos}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold shadow-xs"
                          style={{ backgroundColor: team.primaryColor, color: team.textColor }}
                        >
                          {team.shortName.slice(0, 2)}
                        </div>
                        <span className="truncate max-w-[140px] sm:max-w-none">{team.name}</span>
                        {isUser && (
                          <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center mono-num">{row.played}</td>
                    <td className="py-2.5 px-2 text-center mono-num text-slate-200">{row.won}</td>
                    <td className="py-2.5 px-2 text-center mono-num text-slate-400">{row.drawn}</td>
                    <td className="py-2.5 px-2 text-center mono-num text-slate-400">{row.lost}</td>
                    <td className="py-2.5 px-2 text-center mono-num text-slate-300 hidden sm:table-cell">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-2.5 px-3 text-center mono-num font-black text-white text-base">
                      {row.points}
                    </td>
                    <td className="py-2.5 px-2 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center space-x-1">
                        {row.form.map((res, fIdx) => (
                          <span
                            key={fIdx}
                            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                              res === 'W'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : res === 'D'
                                ? 'bg-slate-700 text-slate-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Scorers / Golden Boot Race */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Golden Boot Leaderboard
        </h3>
        <p className="text-xs text-slate-400">
          The league's most lethal goalscorers in this campaign.
        </p>

        <div className="space-y-2.5">
          {topScorers.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-6 text-center">
              No goals recorded yet this season.
            </div>
          ) : (
            topScorers.map((p, idx) => {
              // Find club
              const club = Object.values(teams).find((t) => t.players.includes(p.id));
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black mono-num text-amber-400">#{idx + 1}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {club?.name || 'Club'} • {p.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 mono-num">
                      {p.seasonStats.goals}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">goals</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
