import React from 'react';
import { GameState } from '../types';
import { X, Wrench, Shield, Rocket, Zap } from 'lucide-react';

interface UpgradeShopModalProps {
  gameState: GameState;
  onUpgrade: (type: 'hull' | 'engine' | 'weapon') => void;
  onClose: () => void;
}

export const UpgradeShopModal: React.FC<UpgradeShopModalProps> = ({
  gameState,
  onUpgrade,
  onClose
}) => {
  const hullCost = 50 + gameState.upgrades.hull * 30;
  const engineCost = 60 + gameState.upgrades.engine * 35;
  const weaponCost = 70 + gameState.upgrades.weapon * 40;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-sky-950 border border-sky-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-moon-cyan flex items-center gap-2">
              <Wrench size={20} />
              SKIFF FORGE & WORKSHOP
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Available Moon-Droplets: <span className="text-lantern-amber font-bold">{gameState.droplets} ✨</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Upgrade Cards */}
        <div className="space-y-3">
          {/* Hull Upgrade */}
          <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-900 border border-sky-700 flex items-center justify-center text-xl text-emerald-400">
                🛡️
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">Hull Structural Plating (T{gameState.upgrades.hull})</h4>
                <p className="text-xs text-slate-400">Current: {Math.round(gameState.stats.maxHull)} HP</p>
                <p className="text-xs text-emerald-400 font-mono">+18 HP Max Capacity</p>
              </div>
            </div>

            <button
              onClick={() => onUpgrade('hull')}
              disabled={gameState.droplets < hullCost}
              className="px-3.5 py-2 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs disabled:opacity-40 transition-colors"
            >
              {hullCost} ✨
            </button>
          </div>

          {/* Engine Upgrade */}
          <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-900 border border-sky-700 flex items-center justify-center text-xl text-moon-cyan">
                🚀
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">Twin Turbine Aero-Engines (T{gameState.upgrades.engine})</h4>
                <p className="text-xs text-slate-400">Current: Tier {gameState.upgrades.engine + 1} Velocity</p>
                <p className="text-xs text-emerald-400 font-mono">+10 KTS Max Velocity & Accel</p>
              </div>
            </div>

            <button
              onClick={() => onUpgrade('engine')}
              disabled={gameState.droplets < engineCost}
              className="px-3.5 py-2 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs disabled:opacity-40 transition-colors"
            >
              {engineCost} ✨
            </button>
          </div>

          {/* Weapon / Shock Upgrade */}
          <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-900 border border-sky-700 flex items-center justify-center text-xl text-indigo-400">
                ⚡
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">Aetheric Pulse Shock Emitter (T{gameState.upgrades.weapon})</h4>
                <p className="text-xs text-slate-400">Current: Tier {gameState.upgrades.weapon + 1} Charge</p>
                <p className="text-xs text-emerald-400 font-mono">+1 Shock Cell Capacity & Radius</p>
              </div>
            </div>

            <button
              onClick={() => onUpgrade('weapon')}
              disabled={gameState.droplets < weaponCost}
              className="px-3.5 py-2 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs disabled:opacity-40 transition-colors"
            >
              {weaponCost} ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
