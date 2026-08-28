import React from 'react';
import { Check, Coins, Gauge, Hammer, Shield, Sparkles, X, Zap } from 'lucide-react';
import { GameState, UpgradeLevels } from '../types';
import { sound } from '../utils/audio';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

type UpgradeId = keyof UpgradeLevels;

type UpgradeDefinition = {
  id: UpgradeId;
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  currentEffect: (level: number) => string;
  nextEffect: (level: number) => string;
};

const UPGRADE_DEFINITIONS: UpgradeDefinition[] = [
  {
    id: 'hull',
    title: 'Abyssal Hull Plating',
    eyebrow: 'FRAME // SURVIVABILITY',
    description: 'Layer the skiff with lacquered storm-iron plates. Each tier expands the hull buffer and repairs the newly reinforced frame.',
    icon: <Shield className="h-5 w-5" />,
    accent: 'cyan',
    maxLevel: 5,
    baseCost: 70,
    costMultiplier: 1.55,
    currentEffect: level => `+${level * 18} max hull`,
    nextEffect: level => `+${(level + 1) * 18} max hull / +18 repair`,
  },
  {
    id: 'engine',
    title: 'Slipstream Engine',
    eyebrow: 'DRIVE // MOBILITY',
    description: 'Tune the brass impeller and moon-koi resonance chamber for faster acceleration, stronger wind-current response, and a higher cruising ceiling.',
    icon: <Gauge className="h-5 w-5" />,
    accent: 'teal',
    maxLevel: 5,
    baseCost: 90,
    costMultiplier: 1.6,
    currentEffect: level => `+${level * 12}% acceleration`,
    nextEffect: level => `+${(level + 1) * 12}% acceleration / +${(level + 1) * 4}% cruise`,
  },
  {
    id: 'weapon',
    title: 'Resonance Lance',
    eyebrow: 'ARMAMENT // SHOCK PULSE',
    description: 'Focus the lantern grid into a forward resonance lance. Upgrades increase pulse range, add charge capacity, and widen the raider scatter cone.',
    icon: <Zap className="h-5 w-5" />,
    accent: 'rose',
    maxLevel: 5,
    baseCost: 110,
    costMultiplier: 1.65,
    currentEffect: level => `+${level * 55}m pulse range`,
    nextEffect: level => `+${(level + 1) * 55}m pulse range / +1 charge`,
  },
];

const costFor = (definition: UpgradeDefinition, level: number) => Math.round(definition.baseCost * Math.pow(definition.costMultiplier, level));

const accentClasses: Record<string, { border: string; text: string; bg: string; ring: string; button: string }> = {
  cyan: { border: 'border-cyan-400/40', text: 'text-cyan-300', bg: 'bg-cyan-400/10', ring: 'ring-cyan-400/20', button: 'bg-cyan-400 hover:bg-cyan-300' },
  teal: { border: 'border-teal-400/40', text: 'text-teal-300', bg: 'bg-teal-400/10', ring: 'ring-teal-400/20', button: 'bg-teal-400 hover:bg-teal-300' },
  rose: { border: 'border-rose-400/40', text: 'text-rose-300', bg: 'bg-rose-400/10', ring: 'ring-rose-400/20', button: 'bg-rose-400 hover:bg-rose-300' },
};

export const UpgradeShopModal: React.FC<Props> = ({ gameState, setGameState, onClose }) => {
  const upgrades = gameState.upgrades || { hull: 0, engine: 0, weapon: 0 };

  const handlePurchase = (definition: UpgradeDefinition) => {
    const level = upgrades[definition.id] || 0;
    if (level >= definition.maxLevel) return;
    const cost = costFor(definition, level);
    if (gameState.droplets < cost) {
      sound.playEnemyPulse();
      setGameState(previous => ({
        ...previous,
        logMessages: [{ id: Date.now().toString(), text: `Upgrade bay denied: ${definition.title} requires ${cost} Droplets.`, time: 'Just now', type: 'hazard' }, ...previous.logMessages],
      }));
      return;
    }

    sound.playBrassClink();
    setGameState(previous => {
      const nextLevel = (previous.upgrades?.[definition.id] || 0) + 1;
      const nextUpgrades = { ...(previous.upgrades || { hull: 0, engine: 0, weapon: 0 }), [definition.id]: nextLevel } as UpgradeLevels;
      const nextStats = { ...previous.stats };
      if (definition.id === 'hull') {
        nextStats.maxHull += 18;
        nextStats.hullIntegrity = Math.min(nextStats.maxHull, nextStats.hullIntegrity + 18);
      }
      if (definition.id === 'engine') nextStats.speedLevel += 1;
      return {
        ...previous,
        droplets: previous.droplets - cost,
        upgrades: nextUpgrades,
        stats: nextStats,
        logMessages: [{ id: Date.now().toString(), text: `Upgrade installed: ${definition.title} // Tier ${nextLevel}.`, time: 'Just now', type: 'reward' }, ...previous.logMessages],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-md animate-fade-in sm:p-6">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-slate-700/80 bg-[#08111f] p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.24em] text-cyan-300"><Hammer className="h-4 w-4" /> SKIFFWORKS // PERMANENT UPGRADE BAY</div>
            <h2 className="font-fantasy text-2xl font-bold text-slate-100 sm:text-3xl">Build a faster way through the cloud sea.</h2>
            <p className="mt-1 max-w-2xl font-serif text-sm italic leading-relaxed text-slate-400">Spend Moon-Luminescence Droplets to permanently tune the courier frame. Every installation persists across launches, storms, and district returns.</p>
          </div>
          <button id="btn-close-upgrade-shop" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100" aria-label="Close upgrade shop"><X className="h-5 w-5" /></button>
        </header>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/5 px-4 py-3">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300"><Coins className="h-5 w-5" /></div><div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/80">Available credits</div><div className="text-lg font-black text-amber-100">{gameState.droplets.toLocaleString()} <span className="text-xs font-semibold text-amber-300/70">DROPLETS</span></div></div></div>
          <div className="text-right text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">Permanent installs<br /><span className="text-slate-300">No respec fee</span></div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {UPGRADE_DEFINITIONS.map(definition => {
            const palette = accentClasses[definition.accent];
            const level = upgrades[definition.id] || 0;
            const isMaxed = level >= definition.maxLevel;
            const cost = costFor(definition, level);
            const canAfford = gameState.droplets >= cost;
            return (
              <article key={definition.id} className={`flex flex-col rounded-3xl border ${palette.border} bg-slate-950/55 p-5 ring-1 ${palette.ring}`}>
                <div className="flex items-start justify-between gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${palette.bg} ${palette.text}`}>{definition.icon}</div><span className={`rounded-full border ${palette.border} ${palette.bg} px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.14em] ${palette.text}`}>TIER {level}/{definition.maxLevel}</span></div>
                <div className="mt-4 text-[10px] font-bold tracking-[0.18em] text-slate-500">{definition.eyebrow}</div>
                <h3 className="mt-1 font-fantasy text-xl font-bold text-slate-100">{definition.title}</h3>
                <p className="mt-3 min-h-[72px] font-serif text-xs leading-relaxed text-slate-300">{definition.description}</p>
                <div className="mt-4 flex gap-1.5">{Array.from({ length: definition.maxLevel }, (_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index < level ? palette.bg.replace('/10', '') : 'bg-slate-800'}`} />)}</div>
                <div className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs"><div className="flex items-center justify-between text-slate-500"><span>Current output</span><span className={palette.text}>{definition.currentEffect(level)}</span></div><div className="flex items-center justify-between text-slate-500"><span>Next install</span><span className="text-slate-200">{isMaxed ? 'Fully tuned' : definition.nextEffect(level)}</span></div></div>
                <div className="mt-5 flex-1" />
                {isMaxed ? <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 py-3 text-xs font-bold text-emerald-300"><Check className="h-4 w-4" /> MAXIMUM TIER INSTALLED</div> : <button id={`btn-buy-upgrade-${definition.id}`} onClick={() => handlePurchase(definition)} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-slate-950 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 ${canAfford ? palette.button : ''}`} disabled={!canAfford}><Coins className="h-4 w-4" /> INSTALL // {cost} DROPLETS</button>}
                {!isMaxed && !canAfford && <div className="mt-2 text-center text-[10px] font-mono tracking-[0.12em] text-rose-300/80">{cost - gameState.droplets} MORE CREDITS REQUIRED</div>}
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-800 pt-5 text-xs sm:grid-cols-3">
          <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4"><div className="flex items-center gap-2 font-bold text-cyan-300"><Shield className="h-4 w-4" /> HULL BUFFER</div><div className="mt-2 font-mono text-slate-300">{Math.round(gameState.stats.hullIntegrity)} / {Math.round(gameState.stats.maxHull)} integrity</div></div>
          <div className="rounded-2xl border border-teal-400/15 bg-teal-400/5 p-4"><div className="flex items-center gap-2 font-bold text-teal-300"><Gauge className="h-4 w-4" /> ENGINE LEVEL</div><div className="mt-2 font-mono text-slate-300">{gameState.stats.speedLevel} // {Math.round((upgrades.engine || 0) * 12)}% tuned output</div></div>
          <div className="rounded-2xl border border-rose-400/15 bg-rose-400/5 p-4"><div className="flex items-center gap-2 font-bold text-rose-300"><Sparkles className="h-4 w-4" /> WEAPON ARRAY</div><div className="mt-2 font-mono text-slate-300">{2 + (upgrades.weapon || 0)} pulse charges // {55 * (upgrades.weapon || 0)}m bonus range</div></div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeShopModal;
