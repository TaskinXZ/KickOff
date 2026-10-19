import React from 'react';
import { Team } from '../types';
import { 
  Trophy, 
  Users, 
  ArrowLeftRight, 
  History, 
  Calendar, 
  Save, 
  RotateCcw,
  Play
} from 'lucide-react';

interface HeaderProps {
  currentTeam: Team;
  currentSeason: number;
  currentRound: number;
  totalRounds: number;
  activeTab: 'pitch' | 'table' | 'squad' | 'transfers' | 'history';
  setActiveTab: (tab: 'pitch' | 'table' | 'squad' | 'transfers' | 'history') => void;
  onOpenMatchDay: () => void;
  onSaveGame: () => void;
  onResetGame: () => void;
  nextOpponentName?: string;
  isMatchReady: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTeam,
  currentSeason,
  currentRound,
  totalRounds,
  activeTab,
  setActiveTab,
  onOpenMatchDay,
  onSaveGame,
  onResetGame,
  nextOpponentName,
  isMatchReady,
}) => {
  const formatMoney = (val: number) => {
    return `€${(val / 1_000_000).toFixed(1)}M`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Club Identity */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚽</span>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  KickØff
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Career Simulation
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center pl-4 border-l border-slate-800 space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border border-white/20"
                style={{ backgroundColor: currentTeam.primaryColor, color: currentTeam.textColor }}
              >
                {currentTeam.shortName}
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-tight">{currentTeam.name}</div>
                <div className="text-xs text-emerald-400 font-semibold mono-num">
                  Budget: {formatMoney(currentTeam.budget)}
                </div>
              </div>
            </div>
          </div>

          {/* Season & Round Badge */}
          <div className="hidden lg:flex items-center bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300 space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">Season {currentSeason}</span>
              <span className="text-slate-500">({2025 + currentSeason - 1}/{26 + currentSeason - 1})</span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              Matchday <span className="text-white font-bold mono-num">{currentRound}</span> of {totalRounds}
            </div>
          </div>

          {/* Action Buttons & Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isMatchReady && (
              <button
                onClick={onOpenMatchDay}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Play Match</span>
                {nextOpponentName && (
                  <span className="text-xs opacity-90 hidden xl:inline">vs {nextOpponentName}</span>
                )}
              </button>
            )}

            <button
              onClick={onSaveGame}
              title="Save Career"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={onResetGame}
              title="Reset Career"
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-4 border-t border-slate-800/60 overflow-x-auto py-2">
          {[
            { id: 'pitch', label: 'Tactics & Pitch', icon: Trophy },
            { id: 'table', label: 'League Table', icon: Calendar },
            { id: 'squad', label: 'Squad & Stats', icon: Users },
            { id: 'transfers', label: 'Transfer Market', icon: ArrowLeftRight },
            { id: 'history', label: '10-Season Dynasty', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
