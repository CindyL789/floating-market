import React, { useState } from 'react';
import { GameState, SkillNode, SkillCategory } from '../types';
import { SKILL_CATEGORIES, SKILL_NODES } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  Shield, 
  Zap, 
  RotateCcw, 
  CheckCircle, 
  Lock, 
  Unlock, 
  X, 
  Compass, 
  ChevronRight, 
  Coins, 
  Flame, 
  Layers, 
  Info,
  Wind,
  Heart,
  TrendingUp,
  Award
} from 'lucide-react';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<Props> = ({
  gameState,
  setGameState,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('lantern_efficiency_1');
  const [respecConfirm, setRespecConfirm] = useState<boolean>(false);

  const unlockedSkills = gameState.unlockedSkills || [];
  const selectedSkill = SKILL_NODES.find(s => s.id === selectedSkillId) || SKILL_NODES[0];
  const selectedSkillCategory = SKILL_CATEGORIES[selectedSkill.category];

  // Check if a skill is unlocked
  const isSkillUnlocked = (skillId: string) => unlockedSkills.includes(skillId);

  // Check if a skill can be unlocked (prerequisites met + sufficient favors)
  const canUnlockSkill = (skill: SkillNode) => {
    if (isSkillUnlocked(skill.id)) return false;
    const prereqsMet = skill.prerequisites.every(pid => unlockedSkills.includes(pid));
    return prereqsMet && gameState.favors >= skill.costFavors;
  };

  // Check if prerequisites are met (ignoring favor cost)
  const arePrereqsMet = (skill: SkillNode) => {
    return skill.prerequisites.every(pid => unlockedSkills.includes(pid));
  };

  // Calculate total favors spent on skills
  const totalFavorsSpent = SKILL_NODES
    .filter(s => unlockedSkills.includes(s.id))
    .reduce((sum, s) => sum + s.costFavors, 0);

  // Handle Unlocking a Skill Node
  const handleUnlockSkill = (skill: SkillNode) => {
    if (!canUnlockSkill(skill)) return;

    sound.playAttunementChime();

    // Compute updated max stats if this skill increases maxHull or maxLanternPower
    let bonusMaxHull = 0;
    let bonusMaxLantern = 0;
    if (skill.id === 'hull_capacity_1') bonusMaxHull += 30;
    if (skill.id === 'hull_capacity_2') bonusMaxHull += 30;
    if (skill.id === 'max_lantern_1') bonusMaxLantern += 50;

    setGameState(prev => {
      const nextUnlocked = [...prev.unlockedSkills, skill.id];
      const newMaxHull = prev.stats.maxHull + bonusMaxHull;
      const newMaxLantern = prev.stats.maxLanternPower + bonusMaxLantern;

      // Also adjust reputation if high archon unlocked
      let repBonus = { ...prev.reputation };
      if (skill.id === 'archipelago_renown') {
        repBonus = {
          lanternGuild: Math.min(100, repBonus.lanternGuild + 30),
          undertowSyndicate: Math.min(100, repBonus.undertowSyndicate + 30),
          anchorMonks: Math.min(100, repBonus.anchorMonks + 30),
        };
      }

      return {
        ...prev,
        favors: prev.favors - skill.costFavors,
        unlockedSkills: nextUnlocked,
        reputation: repBonus,
        stats: {
          ...prev.stats,
          maxHull: newMaxHull,
          hullIntegrity: Math.min(newMaxHull, prev.stats.hullIntegrity + bonusMaxHull),
          maxLanternPower: newMaxLantern,
          lanternPower: Math.min(newMaxLantern, prev.stats.lanternPower + bonusMaxLantern),
        },
        logMessages: [
          {
            id: Date.now().toString(),
            text: `Attuned Passive Mastery: "${skill.name}" (${skill.effectLabel})!`,
            time: 'Just now',
            type: 'reward',
          },
          ...prev.logMessages,
        ],
      };
    });
  };

  // Handle Respec / Reallocating all Favors
  const handleRespec = () => {
    sound.playRespecWhoosh();

    // Recalculate base stats without passive bonuses
    setGameState(prev => ({
      ...prev,
      favors: prev.favors + totalFavorsSpent,
      unlockedSkills: [],
      stats: {
        ...prev.stats,
        maxHull: 100,
        hullIntegrity: Math.min(100, prev.stats.hullIntegrity),
        maxLanternPower: 100,
        lanternPower: Math.min(100, prev.stats.lanternPower),
      },
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Attunement Altar Reset: Refunded ${totalFavorsSpent} Favors for reallocation!`,
          time: 'Just now',
          type: 'info',
        },
        ...prev.logMessages,
      ],
    }));

    setRespecConfirm(false);
  };

  // Filter skills by selected category
  const displayedCategories = selectedCategory === 'all' 
    ? (Object.keys(SKILL_CATEGORIES) as SkillCategory[])
    : [selectedCategory];

  // Active passives calculation for summary
  const hasLanternEfficiency = isSkillUnlocked('lantern_efficiency_1');
  const hasMaxLantern = isSkillUnlocked('max_lantern_1');
  const hasLanternRecharge = isSkillUnlocked('lantern_recharge_1');
  const hasNovaFlare = isSkillUnlocked('lantern_flare_burst');
  
  const hasHull1 = isSkillUnlocked('hull_capacity_1');
  const hasStormPlating = isSkillUnlocked('storm_plating_1');
  const hasHull2 = isSkillUnlocked('hull_capacity_2');
  const hasAeroSails = isSkillUnlocked('sail_aerodynamics');

  const hasMoteAttraction = isSkillUnlocked('koi_harmonic_bond');
  const hasDropletBonus = isSkillUnlocked('koi_pearl_gleaner');
  const hasWakeShield = isSkillUnlocked('koi_slipstream');
  const hasAscension = isSkillUnlocked('koi_celestial_surge');

  const hasContractBroker = isSkillUnlocked('contract_broker');
  const hasTraderDiscount = isSkillUnlocked('trader_bargaining');
  const hasDoubleSalvage = isSkillUnlocked('salvage_keen_eye');
  const hasArchonPrestige = isSkillUnlocked('archipelago_renown');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#050914] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#080e1e]/90 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500/20 to-sky-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-100 font-fantasy tracking-wider">
                  Astral Attunement & Masteries
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Permanent Passives
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Disciplines of the Skybound Courier</span>
                <span>•</span>
                <span className="text-sky-300 font-medium">{unlockedSkills.length} / {SKILL_NODES.length} Masteries Attuned</span>
              </div>
            </div>
          </div>

          {/* Right Header Resources & Actions */}
          <div className="flex items-center gap-3">
            {/* Favors Balance */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-inner">
              <span className="text-base">📜</span>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-amber-400 font-bold">
                  Brass Favors
                </div>
                <div className="text-sm font-extrabold text-amber-200 leading-none">
                  {gameState.favors} Available
                </div>
              </div>
            </div>

            {/* Respec Button */}
            {unlockedSkills.length > 0 && (
              <>
                {!respecConfirm ? (
                  <button
                    id="btn-respec-skills"
                    onClick={() => setRespecConfirm(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                    title="Refund all favors and reallocate masteries"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Reset Attunement</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-600/80 p-1 rounded-xl animate-fadeIn">
                    <button
                      onClick={handleRespec}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                    >
                      Confirm (Refund {totalFavorsSpent})
                    </button>
                    <button
                      onClick={() => setRespecConfirm(false)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Close Button */}
            <button
              id="btn-close-skill-tree"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="px-5 py-2.5 bg-[#060a14] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-slate-100 border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Disciplines ({unlockedSkills.length}/{SKILL_NODES.length})
          </button>

          {(Object.keys(SKILL_CATEGORIES) as SkillCategory[]).map(catKey => {
            const cat = SKILL_CATEGORIES[catKey];
            const catSkills = SKILL_NODES.filter(s => s.category === catKey);
            const catUnlocked = catSkills.filter(s => isSkillUnlocked(s.id)).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? `${cat.accentBg} ${cat.borderColor} ${cat.textColor} shadow-md`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-semibold text-slate-400">
                  {catUnlocked}/{catSkills.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content: Tree View (Left) & Inspector Detail Panel (Right) */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Trees Canvas Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin bg-radial-gradient">
            {displayedCategories.map(catKey => {
              const cat = SKILL_CATEGORIES[catKey];
              const skillsInCat = SKILL_NODES.filter(s => s.category === catKey).sort((a, b) => a.tier - b.tier);

              return (
                <div 
                  key={cat.id} 
                  className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-xl border border-slate-800">
                        {cat.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-slate-100 font-fantasy">
                            {cat.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.accentBg} ${cat.textColor} border ${cat.borderColor}`}>
                            {cat.subtitle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-lore mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Tier Progression Nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    {skillsInCat.map((skill, idx) => {
                      const unlocked = isSkillUnlocked(skill.id);
                      const canUnlock = canUnlockSkill(skill);
                      const prereqMet = arePrereqsMet(skill);
                      const isSelected = selectedSkillId === skill.id;

                      return (
                        <div key={skill.id} className="relative flex flex-col">
                          
                          {/* Connector Arrow for desktop */}
                          {idx > 0 && (
                            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none text-slate-600">
                              <ChevronRight className={`w-4 h-4 ${unlocked ? 'text-amber-400' : 'text-slate-700'}`} />
                            </div>
                          )}

                          {/* Skill Node Card */}
                          <button
                            onClick={() => {
                              sound.playMoonChime(480 + idx * 40);
                              setSelectedSkillId(skill.id);
                            }}
                            className={`w-full p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[145px] group ${
                              isSelected
                                ? 'ring-2 ring-amber-400/80 shadow-lg scale-[1.02] z-20'
                                : 'hover:scale-[1.01]'
                            } ${
                              unlocked
                                ? `${cat.accentBg} border-amber-400/70 shadow-md shadow-amber-500/10`
                                : canUnlock
                                ? 'bg-slate-900/90 border-sky-400/60 hover:border-sky-300'
                                : prereqMet
                                ? 'bg-slate-950/80 border-slate-700/80 text-slate-400'
                                : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                            }`}
                          >
                            {/* Top Tier Badge & Status */}
                            <div className="flex items-center justify-between gap-1 w-full mb-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                Tier {['I', 'II', 'III', 'IV'][skill.tier - 1]}
                              </span>

                              {unlocked ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                                  <CheckCircle className="w-3 h-3 text-amber-400" /> Attuned
                                </span>
                              ) : canUnlock ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/50 animate-pulse">
                                  <Unlock className="w-3 h-3 text-sky-400" /> Unlock ({skill.costFavors} 📜)
                                </span>
                              ) : prereqMet ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                                  Cost: {skill.costFavors} Favors
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                                  <Lock className="w-3 h-3 text-slate-500" /> Locked
                                </span>
                              )}
                            </div>

                            {/* Node Icon & Name */}
                            <div className="flex items-center gap-2.5 my-1">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base border shrink-0 ${
                                unlocked 
                                  ? 'bg-amber-500/20 border-amber-400/60 shadow-sm'
                                  : 'bg-slate-900 border-slate-800'
                              }`}>
                                {skill.icon}
                              </div>
                              <div className="font-extrabold text-xs text-slate-100 font-fantasy line-clamp-1 group-hover:text-amber-300 transition-colors">
                                {skill.name}
                              </div>
                            </div>

                            {/* Effect Pill */}
                            <div className="mt-2 pt-2 border-t border-slate-800/80">
                              <div className={`text-[11px] font-bold line-clamp-1 ${
                                unlocked ? 'text-amber-300' : 'text-sky-300'
                              }`}>
                                {skill.effectLabel}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar: Selected Skill Inspector & Active Passives Summary */}
          <div className="w-full lg:w-96 bg-[#040813] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto scrollbar-thin p-5 space-y-5">
            
            {/* Selected Skill Detail Card */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {selectedSkill.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                      Tier {['I', 'II', 'III', 'IV'][selectedSkill.tier - 1]} • {selectedSkillCategory.name}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-100 font-fantasy">
                      {selectedSkill.name}
                    </h3>
                  </div>
                </div>

                {isSkillUnlocked(selectedSkill.id) && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-amber-400" /> Active
                  </span>
                )}
              </div>

              {/* Lore / Description */}
              <p className="text-xs text-slate-300 font-lore leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                "{selectedSkill.description}"
              </p>

              {/* Stat Benefit Box */}
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-400" /> Permanent Passive Mastery
                </div>
                <div className="text-xs font-extrabold text-amber-300">
                  {selectedSkill.effectLabel}
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  {selectedSkill.statsEffectDescription}
                </div>
              </div>

              {/* Prerequisite Check */}
              {selectedSkill.prerequisites.length > 0 && (
                <div className="text-xs text-slate-400 space-y-1 pt-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Prerequisites Required:</div>
                  {selectedSkill.prerequisites.map(prereqId => {
                    const prereqSkill = SKILL_NODES.find(s => s.id === prereqId);
                    const isMet = unlockedSkills.includes(prereqId);
                    return (
                      <div key={prereqId} className="flex items-center gap-2 text-xs">
                        {isMet ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className={isMet ? 'text-slate-200 font-medium' : 'text-rose-300/90'}>
                          {prereqSkill?.name || prereqId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action Button: Unlock with Favors */}
              <div>
                {isSkillUnlocked(selectedSkill.id) ? (
                  <div className="w-full py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Mastery Attuned & Active
                  </div>
                ) : (
                  <button
                    id="btn-attune-skill"
                    onClick={() => handleUnlockSkill(selectedSkill)}
                    disabled={!canUnlockSkill(selectedSkill)}
                    className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                      canUnlockSkill(selectedSkill)
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/30 hover:scale-[1.02] cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Attune Passive ({selectedSkill.costFavors} Brass Favors)
                  </button>
                )}

                {/* Insufficient favor hint */}
                {!isSkillUnlocked(selectedSkill.id) && arePrereqsMet(selectedSkill) && gameState.favors < selectedSkill.costFavors && (
                  <div className="text-[11px] text-amber-400/90 text-center mt-2 font-medium">
                    Need {selectedSkill.costFavors - gameState.favors} more Favor(s). Complete delivery contracts or salvage adrift capsules!
                  </div>
                )}
              </div>
            </div>

            {/* Aggregated Passive Mastery Summary Card */}
            <div className="p-4 rounded-3xl bg-slate-950/70 border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-fantasy flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Active Passives Summary
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">
                  {unlockedSkills.length} Total
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Max Hull */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Skiff Max Hull
                  </span>
                  <span className="font-extrabold text-slate-100">
                    {gameState.stats.maxHull} Integrity
                    {(hasHull1 || hasHull2) && (
                      <span className="text-emerald-400 ml-1 text-[11px]">
                        (+{(hasHull1 ? 30 : 0) + (hasHull2 ? 30 : 0)})
                      </span>
                    )}
                  </span>
                </div>

                {/* Lantern Capacity & Efficiency */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-sky-400" /> Lantern Reservoir
                  </span>
                  <span className="font-extrabold text-slate-100">
                    {gameState.stats.maxLanternPower} Charge
                    {hasLanternEfficiency && (
                      <span className="text-sky-400 ml-1 text-[10px]">+35% Eff</span>
                    )}
                  </span>
                </div>

                {/* Hazard Damage Reduction */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" /> Storm Hazard Shield
                  </span>
                  <span className="font-extrabold text-slate-100">
                    {hasStormPlating ? '50% Damage Resistance' : 'Standard'}
                  </span>
                </div>

                {/* Companion Mote Harvesting */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Mote Attraction
                  </span>
                  <span className="font-extrabold text-slate-100">
                    {hasMoteAttraction ? '+75% Range Magnet' : 'Standard Radius'}
                  </span>
                </div>

                {/* Droplets Yield */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" /> Droplets Multiplier
                  </span>
                  <span className="font-extrabold text-slate-100">
                    {hasDropletBonus ? '1.5x (Bonus +50%)' : '1.0x (Standard)'}
                  </span>
                </div>

                {/* Contract Pay */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Contract Guild Bonus
                  </span>
                  <span className="font-extrabold text-slate-100">
                    {hasContractBroker ? '+30% Droplets & +1 Favor' : 'Standard Bounty'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
