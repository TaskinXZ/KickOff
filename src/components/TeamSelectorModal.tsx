import React, { useState } from 'react';
import { Team, Player } from '../types';
import { Shield, Search, ArrowRight, DollarSign, Star } from 'lucide-react';

interface TeamSelectorModalProps {
  teams: Record<string, Team>;
  players: Record<string, Player>;
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelectorModal: React.FC<TeamSelectorModalProps> = ({
  teams,
  players,
  onSelectTeam,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('arsenal');
  const [search, setSearch] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');

  const teamList = Object.values(teams).filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter !== 'ALL' && t.country !== countryFilter) return false;
    return true;
  });

  const selectedTeam = teams[selectedTeamId] || teamList[0];
  const starPlayers = selectedTeam
    ? selectedTeam.lineup
        .map((id) => players[id])
        .filter(Boolean)
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 3)
    : [];

  const formatMoney = (val: number) => `€${(val / 1_000_000).toFixed(0)}M`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Intro Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl">⚽</span>
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              KickØff
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Choose Your Starting Club</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select one of Europe's elite 32 clubs to embark on your 10-season managerial journey.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search club name (e.g. Arsenal, Real Madrid, Bayern)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            {['ALL', 'England', 'Spain', 'Germany', 'Italy', 'France', 'Portugal'].map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  countryFilter === c
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Club Selection Grid & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Club Cards List (2 cols) */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
            {teamList.map((team) => {
              const isSelected = selectedTeamId === team.id;
              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-md border border-white/20 mb-2"
                    style={{ backgroundColor: team.primaryColor, color: team.textColor }}
                  >
                    {team.shortName}
                  </div>
                  <div className="text-xs font-bold text-white truncate w-full">{team.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{team.country}</div>
                </div>
              );
            })}
          </div>

          {/* Selected Club Preview Card (1 col) */}
          {selectedTeam && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-md border border-white/20"
                    style={{ backgroundColor: selectedTeam.primaryColor, color: selectedTeam.textColor }}
                  >
                    {selectedTeam.shortName}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{selectedTeam.name}</h3>
                    <p className="text-xs text-slate-400">
                      {selectedTeam.city}, {selectedTeam.country}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stadium:</span>
                    <span className="font-semibold text-white">{selectedTeam.stadium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacity:</span>
                    <span className="font-semibold text-white mono-num">
                      {selectedTeam.stadiumCapacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transfer Budget:</span>
                    <span className="font-bold text-emerald-400 mono-num">
                      {formatMoney(selectedTeam.budget)}
                    </span>
                  </div>
                </div>

                {/* Star Players */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                    Key Superstars:
                  </span>
                  <div className="space-y-1">
                    {starPlayers.map((sp) => (
                      <div
                        key={sp.id}
                        className="flex items-center justify-between text-xs bg-slate-900/40 px-2 py-1 rounded-lg"
                      >
                        <span className="text-slate-200">
                          {sp.name} ({sp.position})
                        </span>
                        <span className="font-black text-amber-400 mono-num">{sp.overall}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectTeam(selectedTeam.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <span>Take Manager Job</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
