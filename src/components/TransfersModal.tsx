import React, { useState } from 'react';
import { Player, Team, Position } from '../types';
import { ArrowLeftRight, Search, DollarSign, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

interface TransfersModalProps {
  userTeam: Team;
  allTeams: Record<string, Team>;
  allPlayers: Record<string, Player>;
  onBuyPlayer: (player: Player, sellingTeam: Team) => void;
  onSellPlayer: (player: Player) => void;
}

export const TransfersModal: React.FC<TransfersModalProps> = ({
  userTeam,
  allTeams,
  allPlayers,
  onBuyPlayer,
  onSellPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'squad'>('market');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posFilter, setPosFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const formatMoney = (val: number) => `€${(val / 1_000_000).toFixed(1)}M`;

  const showToast = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Filter players on the market (not in user's team)
  const marketPlayers = Object.values(allPlayers).filter((p) => {
    if (userTeam.players.includes(p.id)) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (posFilter !== 'ALL') {
      if (posFilter === 'DEF' && !['CB', 'LB', 'RB'].includes(p.position)) return false;
      if (posFilter === 'MID' && !['CDM', 'CM', 'CAM'].includes(p.position)) return false;
      if (posFilter === 'ATT' && !['LW', 'RW', 'ST'].includes(p.position)) return false;
      if (posFilter === 'GK' && p.position !== 'GK') return false;
    }
    return true;
  }).sort((a, b) => b.overall - a.overall);

  // User's own players to sell
  const userPlayers = userTeam.players
    .map((id) => allPlayers[id])
    .filter(Boolean)
    .sort((a, b) => b.overall - a.overall);

  const handleBuy = (player: Player) => {
    if (userTeam.budget < player.value) {
      showToast(`Insufficient transfer funds! Required: ${formatMoney(player.value)}`, 'error');
      return;
    }
    const sellingTeam = Object.values(allTeams).find((t) => t.players.includes(player.id));
    if (!sellingTeam) return;

    onBuyPlayer(player, sellingTeam);
    showToast(`Transfer Complete! Welcome ${player.name} to ${userTeam.name}!`, 'success');
  };

  const handleSell = (player: Player) => {
    if (userTeam.players.length <= 15) {
      showToast('Cannot sell: Squad requires minimum 15 registered players!', 'error');
      return;
    }
    onSellPlayer(player);
    showToast(`Sold ${player.name} for ${formatMoney(player.value)}!`, 'success');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header & Budget Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
            Global Transfer Market & Scouting
          </h2>
          <p className="text-xs text-slate-400">
            Sign world-class superstars or sell squad players to fund your European ambitions.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Transfer Budget</div>
            <div className="text-base font-extrabold text-emerald-400 mono-num">
              {formatMoney(userTeam.budget)}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`flex items-center space-x-2 p-3.5 rounded-2xl text-xs font-bold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Tabs: Buy Market vs Sell from Squad */}
      <div className="flex space-x-3">
        <button
          onClick={() => setActiveTab('market')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'market'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Available Superstars (Buy)
        </button>
        <button
          onClick={() => setActiveTab('squad')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'squad'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          My Squad for Sale ({userPlayers.length})
        </button>
      </div>

      {/* Search & Filters */}
      {activeTab === 'market' && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search player name (e.g. Haaland, Musiala, Bellingham)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'ATT', 'MID', 'DEF', 'GK'].map((p) => (
              <button
                key={p}
                onClick={() => setPosFilter(p)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  posFilter === p
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Players List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
        {(activeTab === 'market' ? marketPlayers : userPlayers).map((player) => {
          const club = Object.values(allTeams).find((t) => t.players.includes(player.id));
          const canAfford = userTeam.budget >= player.value;

          return (
            <div
              key={player.id}
              className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {player.position}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate max-w-[140px]">
                      {player.name}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {club?.name || 'Free Agent'} • Age {player.age} • Pot: {player.potential}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-amber-400 mono-num">
                    {player.overall}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-slate-500">Overall</div>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-4 gap-1 text-center bg-slate-900/60 p-2 rounded-xl text-[10px] font-semibold text-slate-300">
                <div>PAC: {player.stats.pace}</div>
                <div>SHO: {player.stats.shooting}</div>
                <div>PAS: {player.stats.passing}</div>
                <div>DEF: {player.stats.defending}</div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">Valuation</div>
                  <div className="text-xs font-black text-white mono-num">
                    {formatMoney(player.value)}
                  </div>
                </div>

                {activeTab === 'market' ? (
                  <button
                    onClick={() => handleBuy(player)}
                    disabled={!canAfford}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      canAfford
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Sign Player' : 'Too Expensive'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSell(player)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all active:scale-95"
                  >
                    Sell Player
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
