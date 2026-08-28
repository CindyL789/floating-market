import React from 'react';
import { GameState } from '../types';
import { sound } from '../utils/audio';
import { CharacterAvatar } from './CharacterAvatar';
import { 
  Sparkles, 
  Scroll, 
  Zap, 
  Shield, 
  Heart, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Anchor, 
  Wind,
  Compass,
  Map as MapIcon,
  User
} from 'lucide-react';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onOpenWardrobe: () => void;
  onOpenCodex: () => void;
  onOpenCharacterCreator: () => void;
  onOpenWorldMap: () => void;
  onOpenSkillTree: () => void;
}

export const TopNav: React.FC<Props> = ({
  gameState,
  setGameState,
  onOpenWardrobe,
  onOpenCodex,
  onOpenCharacterCreator,
  onOpenWorldMap,
  onOpenSkillTree,
}) => {
  const toggleSound = () => {
    const next = !gameState.soundEnabled;
    sound.setMuted(!next);
    setGameState(prev => ({ ...prev, soundEnabled: next }));
  };

  const unlockedSkillsCount = (gameState.unlockedSkills || []).length;
  const canSpendFavors = gameState.favors > 0;

  return (
    <header className="w-full bg-[#060a14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30 select-none">
      {/* Title & Courier Status */}
      <div className="flex items-center gap-3">
        <button
          id="btn-nav-character-profile"
          onClick={onOpenCharacterCreator}
          className="group relative flex items-center gap-2 p-1 pr-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all hover:scale-105"
          title="Open Character Profile & Creator"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-sky-500/40">
            <CharacterAvatar character={gameState.character} size="sm" showKoiCompanion={false} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-100 font-fantasy line-clamp-1">
                {gameState.character.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                Edit
              </span>
            </div>
            <div className="text-[10px] text-sky-400 font-medium line-clamp-1">
              {gameState.character.title}
            </div>
          </div>
        </button>
      </div>

      {/* Center Resources Bar */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-1">
        {/* Moon Droplets */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-sky-500/30 flex items-center gap-2 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400 animate-pulse" />
          <span className="text-xs font-bold text-sky-300">{gameState.droplets}</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">Droplets</span>
        </div>

        {/* Brass Favors / Quick Link to Skill Tree */}
        <button
          id="btn-nav-favors-skill-link"
          onClick={onOpenSkillTree}
          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/40 flex items-center gap-2 shadow-inner transition-all hover:scale-105 group"
          title="Click to open Skill Tree & spend Favors"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400 group-hover:animate-ping" />
          <span className="text-xs font-bold text-amber-300">{gameState.favors}</span>
          <span className="text-[10px] text-amber-400/90 font-medium hidden sm:inline">Favors (Spend)</span>
          {canSpendFavors && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        {/* Storm Jars */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-purple-500/30 flex items-center gap-2 shadow-inner">
          <Zap className="w-3 h-3 text-purple-400" />
          <span className="text-xs font-bold text-purple-300">{gameState.stormJars}</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">Storm Jars</span>
        </div>

        {/* Hull Health */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <Shield className="w-3 h-3 text-emerald-400" />
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(gameState.stats.hullIntegrity / gameState.stats.maxHull) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-300 font-bold">{gameState.stats.hullIntegrity}/{gameState.stats.maxHull}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Skill Tree / Attunement Button */}
        <button
          id="btn-nav-skill-tree"
          onClick={onOpenSkillTree}
          className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-sky-500/25 hover:from-amber-500/40 hover:to-sky-500/40 border border-amber-500/50 text-xs font-bold text-amber-200 flex items-center gap-1.5 transition-all shadow-sm shadow-amber-950"
          title="Open Astral Attunement & Skill Tree"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Attunement</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40">
            {unlockedSkillsCount}
          </span>
          {canSpendFavors && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 animate-ping" />
          )}
        </button>

        {/* World Map Button */}
        <button
          id="btn-nav-world-map"
          onClick={onOpenWorldMap}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600/30 to-indigo-600/30 hover:from-sky-600/50 hover:to-indigo-600/50 border border-sky-500/50 text-xs font-bold text-sky-200 flex items-center gap-1.5 transition-all shadow-sm shadow-sky-950"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
          <span>World Chart</span>
        </button>

        {/* Character Creator / Gear Rig Button */}
        <button
          id="btn-nav-creator"
          onClick={onOpenCharacterCreator}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
        >
          <User className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Pilot Rig</span>
        </button>

        {/* Lore Codex Button */}
        <button
          id="btn-nav-codex"
          onClick={onOpenCodex}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">World Codex</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          id="btn-nav-audio"
          onClick={toggleSound}
          className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors"
          title={gameState.soundEnabled ? 'Mute Atmosphere Audio' : 'Unmute Atmosphere Audio'}
        >
          {gameState.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-sky-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>
    </header>
  );
};
