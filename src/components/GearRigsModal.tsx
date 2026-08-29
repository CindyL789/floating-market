import React from 'react';
import { GameState, RigId } from '../types';
import { GEAR_RIGS } from '../data/gameData';
import { X, Shirt, Check } from 'lucide-react';

interface GearRigsModalProps {
  gameState: GameState;
  onEquipRig: (rigId: RigId) => void;
  onClose: () => void;
}

export const GearRigsModal: React.FC<GearRigsModalProps> = ({
  gameState,
  onEquipRig,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-sky-950 border border-sky-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-moon-cyan flex items-center gap-2">
              <Shirt size={20} />
              WARDROBE & RIGSMITH
            </h3>
            <p className="text-xs text-slate-400">Equip specialized skyway attires & tactical harnesses</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {Object.values(GEAR_RIGS).map(rig => {
            const isEquipped = gameState.activeRig === rig.id;
            const isUnlocked = gameState.unlockedRigs.includes(rig.id);
            const canAfford = gameState.droplets >= rig.cost;

            return (
              <div
                key={rig.id}
                className={`p-4 rounded-xl border transition-all ${isEquipped ? 'bg-moon-cyan/10 border-moon-cyan' : 'bg-sky-900/30 border-sky-800/50'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{rig.name}</h4>
                    <p className="text-xs text-moon-cyan font-mono">{rig.subtitle}</p>
                  </div>

                  {isEquipped ? (
                    <span className="px-2.5 py-1 rounded-lg bg-moon-cyan/20 text-moon-cyan font-mono text-[10px] font-bold border border-moon-cyan/40 flex items-center gap-1">
                      <Check size={12} />
                      EQUIPPED
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onEquipRig(rig.id)}
                      className="px-3 py-1.5 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs transition-colors"
                    >
                      EQUIP
                    </button>
                  ) : (
                    <button
                      onClick={() => onEquipRig(rig.id)}
                      disabled={!canAfford}
                      className="px-3 py-1.5 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs disabled:opacity-40 transition-colors"
                    >
                      UNLOCK ({rig.cost} ✨)
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2">{rig.description}</p>

                <div className="mt-3 pt-2 border-t border-sky-800/40">
                  <p className="text-[10px] font-mono font-bold text-lantern-amber uppercase mb-1">Perks & Specializations:</p>
                  <ul className="space-y-1">
                    {rig.perks.map((p, i) => (
                      <li key={i} className="text-xs text-emerald-300 flex items-center gap-1.5">
                        <span className="text-moon-cyan text-xs">✦</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
