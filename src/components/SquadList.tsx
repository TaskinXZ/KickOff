import React, { useState } from 'react';
import { Team, Player, Position } from '../types';
import { Users, Star, Award, HeartPulse, Flame } from 'lucide-react';

interface SquadListProps {
  team: Team;
  players: Record<string, Player>;
}

export const SquadList: React.FC<SquadListProps> = ({ team, players }) => {
  const [filterPos, setFilterPos] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'overall' | 'goals' | 'age' | 'value'>('overall');

  const squadPlayers = team.players
    .map((id) => players[id])
    .filter(Boolean)
    .filter((p) => {
      if (filterPos === 'ALL') return true;
      if (filterPos === 'DEF') return ['CB', 'LB', 'RB'].includes(p.position);
      if (filterPos === 'MID') return ['CDM', 'CM', 'CAM'].includes(p.position);
      if (filterPos === 'ATT') return ['LW', 'RW', 'ST'].includes(p.position);
      if (filterPos === 'GK') return p.position === 'GK';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'overall') return b.overall - a.overall;
      if (sortBy === 'goals') return b.seasonStats.goals - a.seasonStats.goals;
      if (sortBy === 'age') return a.age - b.age;
      if (sortBy === 'value') return b.value - a.value;
      return 0;
    });

  const formatMoney = (val: number) => `€${(val / 1_000_000).toFixed(1)}M`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Title & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Squad Management & Player Attributes
          </h2>
          <p className="text-xs text-slate-400">
            Monitor player fitness, growth, contract duration, and match performance statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Position Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'ATT', 'MID', 'DEF', 'GK'].map((pos) => (
              <button
                key={pos}
                onClick={() => setFilterPos(pos)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterPos === pos ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="overall">Highest Overall</option>
              <option value="goals">Season Goals</option>
              <option value="age">Youngest (Wonderkids)</option>
              <option value="value">Market Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Squad Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Player</th>
              <th className="py-2.5 px-2 text-center">POS</th>
              <th className="py-2.5 px-2 text-center">OVR</th>
              <th className="py-2.5 px-2 text-center">POT</th>
              <th className="py-2.5 px-2 text-center">Age</th>
              <th className="py-2.5 px-2 text-center hidden md:table-cell">Pace</th>
              <th className="py-2.5 px-2 text-center hidden md:table-cell">Shot</th>
              <th className="py-2.5 px-2 text-center hidden md:table-cell">Pass</th>
              <th className="py-2.5 px-2 text-center hidden md:table-cell">Def</th>
              <th className="py-2.5 px-2 text-center">Goals</th>
              <th className="py-2.5 px-2 text-center">Stamina</th>
              <th className="py-2.5 px-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {squadPlayers.map((player) => {
              const isStarting = team.lineup.includes(player.id);

              return (
                <tr
                  key={player.id}
                  className="hover:bg-slate-800/40 text-slate-300 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-bold text-slate-500 w-5">#{player.number}</span>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{player.name}</span>
                          {isStarting && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                              XI
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{player.nationality}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-xs font-black px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {player.position}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center mono-num font-black text-white text-base">
                    {player.overall}
                  </td>
                  <td className="py-3 px-2 text-center mono-num font-bold text-amber-400">
                    {player.potential}
                  </td>
                  <td className="py-3 px-2 text-center mono-num text-slate-300">{player.age}</td>
                  <td className="py-3 px-2 text-center mono-num hidden md:table-cell">{player.stats.pace}</td>
                  <td className="py-3 px-2 text-center mono-num hidden md:table-cell">{player.stats.shooting}</td>
                  <td className="py-3 px-2 text-center mono-num hidden md:table-cell">{player.stats.passing}</td>
                  <td className="py-3 px-2 text-center mono-num hidden md:table-cell">{player.stats.defending}</td>
                  <td className="py-3 px-2 text-center mono-num font-bold text-emerald-400">
                    {player.seasonStats.goals}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.round(player.currentStamina)}%` }}
                        />
                      </div>
                      <span className="text-[10px] mono-num text-slate-400">
                        {Math.round(player.currentStamina)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right mono-num font-bold text-white">
                    {formatMoney(player.value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
