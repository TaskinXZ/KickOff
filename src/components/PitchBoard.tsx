import React, { useState } from 'react';
import { Team, Player, FormationName, Mentality, PressingStyle } from '../types';
import { FORMATIONS_COORDS } from '../engine/formationEngine';
import { Shield, Zap, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';

interface PitchBoardProps {
  team: Team;
  players: Record<string, Player>;
  onUpdateTactics: (newTactics: Team['tactics']) => void;
  onSwapPlayers: (playerAId: string, playerBId: string) => void;
}

export const PitchBoard: React.FC<PitchBoardProps> = ({
  team,
  players,
  onUpdateTactics,
  onSwapPlayers,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const coords = FORMATIONS_COORDS[team.tactics.formation] || FORMATIONS_COORDS['4-3-3'];

  const handlePlayerClick = (pId: string) => {
    if (!selectedPlayerId) {
      setSelectedPlayerId(pId);
    } else if (selectedPlayerId === pId) {
      setSelectedPlayerId(null);
    } else {
      // Swap selected player with clicked player
      onSwapPlayers(selectedPlayerId, pId);
      setSelectedPlayerId(null);
    }
  };

  const getOverallColor = (ovr: number) => {
    if (ovr >= 88) return 'from-amber-400 to-yellow-500 text-black border-amber-300';
    if (ovr >= 84) return 'from-emerald-400 to-teal-500 text-slate-950 border-emerald-300';
    if (ovr >= 80) return 'from-cyan-400 to-blue-500 text-slate-950 border-cyan-300';
    return 'from-slate-300 to-slate-400 text-slate-900 border-slate-300';
  };

  return (
    <div className="space-y-6">
      {/* Tactical Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Tactical Command & Formation
            </h2>
            <p className="text-xs text-slate-400">
              Select your system and click players to swap positions or make substitutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Formation Picker */}
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Formation:</span>
              <select
                value={team.tactics.formation}
                onChange={(e) =>
                  onUpdateTactics({ ...team.tactics, formation: e.target.value as FormationName })
                }
                className="bg-transparent text-emerald-400 font-bold text-sm focus:outline-none cursor-pointer"
              >
                <option value="4-3-3">4-3-3 (Attack)</option>
                <option value="4-2-3-1">4-2-3-1 (Control)</option>
                <option value="3-5-2">3-5-2 (Dominance)</option>
                <option value="4-4-2">4-4-2 (Classic)</option>
                <option value="5-3-2">5-3-2 (Solid Counter)</option>
              </select>
            </div>

            {/* Mentality Picker */}
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Mentality:</span>
              <select
                value={team.tactics.mentality}
                onChange={(e) =>
                  onUpdateTactics({ ...team.tactics, mentality: e.target.value as Mentality })
                }
                className="bg-transparent text-cyan-400 font-bold text-sm focus:outline-none cursor-pointer"
              >
                <option value="Ultra Defensive">Ultra Defensive</option>
                <option value="Defensive">Defensive</option>
                <option value="Balanced">Balanced</option>
                <option value="Attacking">Attacking</option>
                <option value="All-Out Attack">All-Out Attack</option>
              </select>
            </div>

            {/* Pressing Style */}
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Press:</span>
              <select
                value={team.tactics.pressing}
                onChange={(e) =>
                  onUpdateTactics({ ...team.tactics, pressing: e.target.value as PressingStyle })
                }
                className="bg-transparent text-amber-400 font-bold text-sm focus:outline-none cursor-pointer"
              >
                <option value="Low Block">Low Block</option>
                <option value="Mid Block">Mid Block</option>
                <option value="Gegenpress">Gegenpress</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Pitch Canvas Area */}
      <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-[#092b1a]">
        {/* Grass Texture & Striping */}
        <div className="absolute inset-0 turf-striped opacity-95" />

        {/* Pitch Markings (White SVG lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Border pitch line */}
          <rect x="4" y="4" width="92" height="92" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          
          {/* Halfway Line */}
          <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          
          {/* Center Circle */}
          <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.7)" />

          {/* Top Penalty Area (Opponent Box) */}
          <rect x="25" y="4" width="50" height="18" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <rect x="36" y="4" width="28" height="7" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <circle cx="50" cy="14" r="0.8" fill="rgba(255,255,255,0.7)" />
          <path d="M 40,22 A 10,10 0 0,0 60,22" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

          {/* Bottom Penalty Area (Our Box) */}
          <rect x="25" y="78" width="50" height="18" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <rect x="36" y="89" width="28" height="7" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <circle cx="50" cy="86" r="0.8" fill="rgba(255,255,255,0.7)" />
          <path d="M 40,78 A 10,10 0 0,1 60,78" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

          {/* Corner Arcs */}
          <path d="M 4,7 A 3,3 0 0,0 7,4" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <path d="M 93,4 A 3,3 0 0,0 96,7" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <path d="M 4,93 A 3,3 0 0,1 7,96" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
          <path d="M 96,93 A 3,3 0 0,0 93,96" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
        </svg>

        {/* 11 Starting Players Positioned on Pitch */}
        {team.lineup.map((pId, index) => {
          const p = players[pId];
          const coord = coords[index] || { x: 50, y: 50, roleLabel: 'SUB', defaultPosition: 'CM' };
          const isSelected = selectedPlayerId === pId;

          if (!p) return null;

          return (
            <div
              key={pId}
              onClick={() => handlePlayerClick(pId)}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-10 ${
                isSelected ? 'scale-115 z-30' : 'hover:scale-110'
              }`}
            >
              {/* Pulse effect if selected */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-2xl bg-amber-400/40 animate-ping" />
              )}

              <div
                className={`flex flex-col items-center bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border-2 transition-all shadow-xl ${
                  isSelected
                    ? 'border-amber-400 ring-4 ring-amber-400/30'
                    : 'border-slate-700/80 group-hover:border-emerald-400'
                }`}
              >
                {/* Kit / Jersey Icon & Number */}
                <div className="flex items-center space-x-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm"
                    style={{ backgroundColor: team.primaryColor, color: team.textColor }}
                  >
                    #{p.number}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-1 rounded bg-gradient-to-r shadow-xs ${getOverallColor(
                      p.overall
                    )}`}
                  >
                    {p.overall}
                  </span>
                </div>

                {/* Player Name */}
                <span className="text-[11px] font-bold text-white tracking-tight mt-0.5 whitespace-nowrap max-w-[85px] truncate">
                  {p.name.split(' ').pop()}
                </span>

                {/* Role badge */}
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                  {coord.roleLabel}
                </span>

                {/* Stamina Pill */}
                <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.round(p.currentStamina)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bench / Substitutes Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Substitutes Bench (Click to swap with Starting XI)
          </h3>
          {selectedPlayerId && (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-semibold animate-pulse">
              Select any player to complete swap
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {team.bench.map((bId) => {
            const bp = players[bId];
            if (!bp) return null;
            const isSelected = selectedPlayerId === bId;

            return (
              <div
                key={bId}
                onClick={() => handlePlayerClick(bId)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-400">#{bp.number}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1 rounded bg-gradient-to-r ${getOverallColor(
                      bp.overall
                    )}`}
                  >
                    {bp.overall}
                  </span>
                  <span className="text-[10px] font-bold text-cyan-400">{bp.position}</span>
                </div>
                <span className="text-xs font-semibold text-slate-200 truncate w-full text-center">
                  {bp.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Sta: {Math.round(bp.currentStamina)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
