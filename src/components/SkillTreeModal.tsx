import React, { useState } from 'react';
import { GameState, SkillCategory } from '../types';
import { SKILL_NODES, SKILL_CATEGORIES } from '../data/gameData';
import { X, Award, Check, Lock, Sparkles } from 'lucide-react';

interface SkillTreeModalProps {
  gameState: GameState;
  onUnlockSkill: (skillId: string) => void;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  gameState,
  onUnlockSkill,
  onClose
}) => {
  const [selectedCat, setSelectedCat] = useState<SkillCategory>('lantern');

  const categorySkills = SKILL_NODES.filter(s => s.category === selectedCat);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-sky-950 border border-sky-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-moon-cyan flex items-center gap-2">
              <Award size={20} />
              ATTUNEMENT SKILL SANCTUARY
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Brass Favors Available: <span className="text-lantern-amber font-bold">{gameState.favors} ⚓</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 py-3 border-b border-sky-800/40 overflow-x-auto text-xs">
          {(Object.keys(SKILL_CATEGORIES) as SkillCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCat === cat ? 'bg-moon-cyan text-sky-950 font-bold' : 'bg-sky-900/40 text-slate-400 hover:text-slate-200'}`}
            >
              {SKILL_CATEGORIES[cat]}
            </button>
          ))}
        </div>

        {/* Skill Nodes List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {categorySkills.map(skill => {
            const isUnlocked = gameState.unlockedSkills.includes(skill.id);
            const prereqsMet = !skill.prerequisites || skill.prerequisites.every(p => gameState.unlockedSkills.includes(p));
            const canAfford = gameState.favors >= skill.costFavors;
            const canUnlock = !isUnlocked && prereqsMet && canAfford;

            return (
              <div
                key={skill.id}
                className={`p-4 rounded-xl border transition-all ${isUnlocked ? 'bg-emerald-950/25 border-emerald-500/40' : 'bg-sky-900/30 border-sky-800/50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-900 border border-sky-700 flex items-center justify-center text-xl">
                      {skill.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{skill.name}</h4>
                      <p className="text-xs text-moon-cyan font-mono">Tier {skill.tier} // {skill.effectLabel}</p>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Check size={12} />
                      ATTUNED
                    </span>
                  ) : (
                    <button
                      onClick={() => onUnlockSkill(skill.id)}
                      disabled={!canUnlock}
                      className="px-3 py-1.5 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs disabled:opacity-40 transition-colors flex items-center gap-1"
                    >
                      {!prereqsMet ? (
                        <>
                          <Lock size={12} />
                          <span>LOCKED</span>
                        </>
                      ) : (
                        <span>{skill.costFavors} FAVORS</span>
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2">{skill.description}</p>
                <p className="text-[11px] font-mono text-moon-cyan/80 mt-1">{skill.statsEffectDescription}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
