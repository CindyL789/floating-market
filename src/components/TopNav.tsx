import React from 'react';
import { GameState } from '../types';
import {
  Compass,
  BookOpen,
  Shield,
  Award,
  Map,
  Sparkles,
  Anchor,
  User,
  Zap,
  Wrench,
  Shirt,
  Scroll,
  Navigation
} from 'lucide-react';

interface TopNavProps {
  gameState: GameState;
  onOpenModal: (modal: string) => void;
  onFastTravel?: (districtId: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ gameState, onOpenModal }) => {
  return (
    <header className="h-14 bg-sky-950/95 border-b border-sky-800/60 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between text-xs select-none z-30 shadow-md">
      {/* Title & Brand */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => onOpenModal('character_creator')}
          className="w-8 h-8 rounded-lg bg-sky-900 border border-moon-cyan/40 flex items-center justify-center text-moon-cyan shadow-sm shadow-moon-cyan/20 hover:scale-105 transition-transform"
          title="Courier Dossier"
        >
          <Sparkles size={16} />
        </button>
        <div>
          <h1 className="font-cinzel font-bold text-xs sm:text-sm tracking-wide text-slate-100 flex items-center gap-1.5">
            <span className="truncate max-w-[110px] sm:max-w-none">MOON-KOI COURIER</span>
            <span className="text-[9px] sm:text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-sky-800/90 text-moon-cyan border border-moon-cyan/40">
              CH.{gameState.currentMainChapter}
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono truncate max-w-[130px] sm:max-w-[200px]">
            {gameState.character.name}
          </p>
        </div>
      </div>

      {/* Currency & Vitals Bar */}
      <div className="flex items-center space-x-2 sm:space-x-3 font-mono">
        {/* Hull */}
        <div className="hidden md:flex items-center space-x-1.5 bg-sky-900/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
          <Shield size={13} className="text-emerald-400" />
          <span className="text-slate-300 text-[11px]">HULL:</span>
          <span className={`font-bold text-[11px] ${gameState.stats.hullIntegrity < 30 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {Math.round(gameState.stats.hullIntegrity)}/{Math.round(gameState.stats.maxHull)}
          </span>
        </div>

        {/* Droplets */}
        <div
          title="Moon-Droplets (Currency)"
          className="flex items-center space-x-1 sm:space-x-1.5 bg-sky-900/80 px-2 sm:px-2.5 py-1 rounded-lg border border-moon-cyan/40 shadow-sm shadow-moon-cyan/10"
        >
          <Sparkles size={12} className="text-moon-cyan" />
          <span className="font-bold text-moon-cyan text-[11px] sm:text-xs">{gameState.droplets}</span>
        </div>

        {/* Favors */}
        <div
          title="Syndicate Favors"
          className="flex items-center space-x-1 sm:space-x-1.5 bg-sky-900/80 px-2 sm:px-2.5 py-1 rounded-lg border border-lantern-amber/40 shadow-sm shadow-lantern-amber/10"
        >
          <Anchor size={12} className="text-lantern-amber" />
          <span className="font-bold text-lantern-amber text-[11px] sm:text-xs">{gameState.favors}</span>
        </div>

        {/* Storm Jars */}
        <div
          title="Charged Storm Jars"
          className="hidden sm:flex items-center space-x-1.5 bg-sky-900/80 px-2 py-1 rounded-lg border border-indigo-500/40"
        >
          <Zap size={12} className="text-indigo-400" />
          <span className="font-bold text-indigo-300 text-xs">{gameState.stormJars}</span>
        </div>
      </div>

      {/* Nav Action Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        <button
          onClick={() => onOpenModal('quest_drawer')}
          title="Quest Log & Contracts (J)"
          className="p-1.5 sm:p-2 rounded-lg bg-sky-900/70 hover:bg-sky-800 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition-all relative"
        >
          <Scroll size={15} />
          {gameState.activeQuests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => onOpenModal('world_map')}
          title="Skyways World Map (M)"
          className="p-1.5 sm:p-2 rounded-lg bg-sky-900/70 hover:bg-sky-800 text-slate-300 hover:text-moon-cyan border border-slate-700/60 transition-all"
        >
          <Map size={15} />
        </button>

        <button
          onClick={() => onOpenModal('upgrade_shop')}
          title="Skiff Forge & Engine Upgrades"
          className="p-1.5 sm:p-2 rounded-lg bg-sky-900/70 hover:bg-sky-800 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition-all"
        >
          <Wrench size={15} />
        </button>

        <button
          onClick={() => onOpenModal('wardrobe')}
          title="Gear Rigs & Outfits"
          className="hidden sm:inline-flex p-1.5 sm:p-2 rounded-lg bg-sky-900/70 hover:bg-sky-800 text-slate-300 hover:text-purple-400 border border-slate-700/60 transition-all"
        >
          <Shirt size={15} />
        </button>

        <button
          onClick={() => onOpenModal('skill_tree')}
          title="Sanctuary Skill Tree"
          className="p-1.5 sm:p-2 rounded-lg bg-sky-900/70 hover:bg-sky-800 text-slate-300 hover:text-lantern-amber border border-slate-700/60 transition-all"
        >
          <Award size={15} />
        </button>

        <button
          onClick={() => onOpenModal('codex')}
          title="Archipelago Codex & Gallery"
          className="hidden md:inline-flex p-1.5 sm:p-2 rounded-lg bg-sky-900/70 hover:bg-sky-800 text-slate-300 hover:text-moon-cyan border border-slate-700/60 transition-all"
        >
          <BookOpen size={15} />
        </button>

        <button
          onClick={() => onOpenModal('character_creator')}
          title="Courier Persona Dossier"
          className="p-1.5 sm:p-2 rounded-lg bg-sky-900/70 hover:bg-sky-800 text-slate-300 hover:text-moon-cyan border border-slate-700/60 transition-all"
        >
          <User size={15} />
        </button>
      </div>
    </header>
  );
};
