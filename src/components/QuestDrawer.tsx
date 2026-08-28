import React, { useState } from 'react';
import { GameState } from '../types';
import { MAIN_QUESTS, DISTRICTS } from '../data/gameData';
import { Scroll, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Props {
  gameState: GameState;
}

export const QuestDrawer: React.FC<Props> = ({ gameState }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Active story quest
  const activeStoryQuest = gameState.activeQuests.find(q => q.active && !q.completed) || MAIN_QUESTS[0];

  return (
    <div className="absolute top-16 left-4 z-20 max-w-sm">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        {/* Header clickable to expand/collapse */}
        <button
          id="btn-toggle-quest-drawer"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Scroll className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                Chapter {activeStoryQuest?.chapter || 1} Story Objective
              </span>
              <span className="text-xs font-bold text-slate-100 font-fantasy line-clamp-1">
                {activeStoryQuest?.title}
              </span>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Expanded View */}
        {isExpanded && (
          <div className="p-4 pt-1 border-t border-slate-800 space-y-3 text-xs">
            <p className="text-slate-300 font-lore leading-relaxed italic">
              "{activeStoryQuest?.description}"
            </p>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sky-300 font-medium flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Current Task: {activeStoryQuest?.stepDescription}</span>
            </div>

            {/* Active Contract if any */}
            {gameState.activeContract && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200">
                <div className="font-bold text-[11px] flex items-center gap-1.5 text-amber-300 mb-1">
                  <AlertCircle className="w-3 h-3" /> Active Delivery Contract
                </div>
                <div className="text-xs font-semibold">{gameState.activeContract.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Deliver to: <strong className="text-amber-300">{DISTRICTS[gameState.activeContract.destination].name}</strong>
                </div>
              </div>
            )}

            {/* Recent Log Messages */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Recent Skyway Dispatch Logs:
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {gameState.logMessages.slice(0, 3).map(log => (
                  <div key={log.id} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                    <span className="text-sky-400">•</span>
                    <span className={log.type === 'reward' ? 'text-emerald-300' : log.type === 'hazard' ? 'text-rose-300' : 'text-slate-300'}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
