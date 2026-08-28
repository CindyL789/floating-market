import React from 'react';
import { GameState, RigId } from '../types';
import { GEAR_RIGS } from '../data/gameData';
import { sound } from '../utils/audio';
import { Shield, Sparkles, Check, Lock, X, Zap } from 'lucide-react';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

export const GearRigsModal: React.FC<Props> = ({ gameState, setGameState, onClose }) => {
  const handleEquipRig = (rigId: RigId) => {
    sound.playMoonChime(660);
    setGameState(prev => ({
      ...prev,
      activeRig: rigId,
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Equipped: ${GEAR_RIGS[rigId].name}`,
          time: 'Just now',
          type: 'info'
        },
        ...prev.logMessages
      ]
    }));
  };

  const handleUnlockRig = (rigId: RigId, cost: number) => {
    if (gameState.droplets < cost) {
      alert('Not enough Moon-Luminescence Droplets to tailor this rig!');
      return;
    }
    sound.playBrassClink();
    setGameState(prev => ({
      ...prev,
      droplets: prev.droplets - cost,
      unlockedRigs: [...prev.unlockedRigs, rigId],
      activeRig: rigId,
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Tailored & Equipped: ${GEAR_RIGS[rigId].name}`,
          time: 'Just now',
          type: 'reward'
        },
        ...prev.logMessages
      ]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 font-semibold mb-1">
              <Shield className="w-4 h-4" />
              Wardrobe & Rig Forge
            </div>
            <h2 className="text-2xl font-bold text-slate-100 font-fantasy">
              "Wardrobe and Gear Turn Duty into Identity"
            </h2>
            <p className="text-xs text-slate-400 font-serif italic mt-0.5">
              Each specialized suit alters skiff handling, faction trust, and environmental immunities.
            </p>
          </div>
          <button
            id="btn-close-wardrobe"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rig Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {(Object.keys(GEAR_RIGS) as RigId[]).map(rigId => {
            const rig = GEAR_RIGS[rigId];
            const isUnlocked = gameState.unlockedRigs.includes(rigId);
            const isEquipped = gameState.activeRig === rigId;

            return (
              <div
                key={rig.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-slate-900/90 border-sky-500 shadow-xl shadow-sky-500/10 ring-1 ring-sky-500/50'
                    : isUnlocked
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-80'
                }`}
              >
                <div>
                  {/* Top Rig Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                        {rig.subtitle}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 font-fantasy mt-0.5">
                        {rig.name}
                      </h3>
                    </div>
                    {isEquipped ? (
                      <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Equipped
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                        Unlocked
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {rig.cost} Droplets
                      </span>
                    )}
                  </div>

                  {/* Lore Description */}
                  <p className="text-xs text-slate-300 font-serif italic mt-3 leading-relaxed">
                    "{rig.description}"
                  </p>

                  {/* Visual Signature Features */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Visual Signature & Components:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rig.visualFeatures.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tactical Perks */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Tactical Traits:
                    </span>
                    <ul className="space-y-1">
                      {rig.perks.map((perk, i) => (
                        <li key={i} className="text-xs text-sky-300/90 flex items-start gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  {isEquipped ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold text-xs cursor-default flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Currently In Use
                    </button>
                  ) : isUnlocked ? (
                    <button
                      id={`btn-equip-${rig.id}`}
                      onClick={() => handleEquipRig(rig.id)}
                      className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" /> Equip This Rig
                    </button>
                  ) : (
                    <button
                      id={`btn-unlock-${rig.id}`}
                      onClick={() => handleUnlockRig(rig.id, rig.cost)}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-4 h-4" /> Unlock for {rig.cost} Droplets
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
