import React, { useState, useEffect } from 'react';
import { SeasonRecord, Team } from '../types';
import { Trophy, Award, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeasonSummaryModalProps {
  seasonRecord: SeasonRecord;
  championTeam: Team;
  userTeam: Team;
  clubOffers: Team[];
  onConfirmNextSeason: (chosenTeamId: string) => void;
}

export const SeasonSummaryModal: React.FC<SeasonSummaryModalProps> = ({
  seasonRecord,
  championTeam,
  userTeam,
  clubOffers,
  onConfirmNextSeason,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(userTeam.id);

  const userWonTitle = seasonRecord.championId === userTeam.id;

  useEffect(() => {
    confetti({
      particleCount: userWonTitle ? 120 : 60,
      spread: 70,
      origin: { y: 0.5 },
    });
  }, [userWonTitle]);

  const formatMoney = (val: number) => `€${(val / 1_000_000).toFixed(1)}M`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Celebration Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-lg border border-amber-400/30">
            🏆
          </div>
          <h2 className="text-2xl font-black text-white">
            Season {seasonRecord.season} Finale & Awards!
          </h2>
          <p className="text-xs text-slate-400">
            The campaign has concluded. Review awards, player evolution, and decide your managerial future.
          </p>
        </div>

        {/* Season Honors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Champions */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Champions of Europe
            </div>
            <div className="text-base font-black text-white mt-1">{championTeam.name}</div>
            <div className="text-xs text-emerald-400 font-semibold mt-0.5">
              {userWonTitle ? '🎉 You are the Champions!' : 'League Winners'}
            </div>
          </div>

          {/* Golden Boot */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Golden Boot Winner
            </div>
            <div className="text-base font-black text-white mt-1">
              {seasonRecord.topScorer.playerName}
            </div>
            <div className="text-xs text-slate-300 font-semibold mt-0.5">
              {seasonRecord.topScorer.goals} goals ({seasonRecord.topScorer.teamName})
            </div>
          </div>
        </div>

        {/* Managerial Future: Stay or Switch Club */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Your Managerial Future for Season {seasonRecord.season + 1}
            </h3>
            <p className="text-xs text-slate-400">
              Extend your contract with your current club or accept a lucrative offer from another European powerhouse!
            </p>
          </div>

          <div className="space-y-2">
            {/* Current Club Option */}
            <div
              onClick={() => setSelectedTeamId(userTeam.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedTeamId === userTeam.id
                  ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: userTeam.primaryColor, color: userTeam.textColor }}
                >
                  {userTeam.shortName}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Stay with {userTeam.name}</span>
                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      Current Club
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Budget: {formatMoney(userTeam.budget)} • Finished {seasonRecord.userFinishedPosition}th
                  </div>
                </div>
              </div>

              {selectedTeamId === userTeam.id && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            {/* Other Club Offers */}
            {clubOffers.map((offer) => {
              const isSelected = selectedTeamId === offer.id;
              return (
                <div
                  key={offer.id}
                  onClick={() => setSelectedTeamId(offer.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: offer.primaryColor, color: offer.textColor }}
                    >
                      {offer.shortName}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Take charge of {offer.name}</span>
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                          Job Offer
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Budget: {formatMoney(offer.budget)} • Stadium: {offer.stadium}
                      </div>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            onClick={() => onConfirmNextSeason(selectedTeamId)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl active:scale-98 transition-all"
          >
            <span>Advance to Season {seasonRecord.season + 1} & Age Squad</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
