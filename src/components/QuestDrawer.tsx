import React from 'react';
import { GameState } from '../types';
import { MAIN_QUESTS } from '../data/gameData';
import { X, Scroll, Check, Clock } from 'lucide-react';

interface QuestDrawerProps {
  gameState: GameState;
  onClose: () => void;
}

export const QuestDrawer: React.FC<QuestDrawerProps> = ({ gameState, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-sky-950 border border-sky-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-moon-cyan flex items-center gap-2">
              <Scroll size={20} />
              MAIN STORY CAMPAIGN & FLIGHT LOGS
            </h3>
            <p className="text-xs text-lantern-amber font-mono font-bold">
              Chapter {gameState.currentMainChapter} // Skyways Chronicle
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {MAIN_QUESTS.map(quest => {
            const isCompleted = gameState.completedQuestIds.includes(quest.id);
            const isActive = quest.active || (quest.chapter === gameState.currentMainChapter && !isCompleted);

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-emerald-950/20 border-emerald-500/40' : isActive ? 'bg-lantern-amber/10 border-lantern-amber/50' : 'bg-sky-900/30 border-sky-800/40 opacity-70'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-mono font-bold uppercase block ${isCompleted ? 'text-emerald-400' : isActive ? 'text-lantern-amber' : 'text-slate-400'}`}>
                      Chapter {quest.chapter}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{quest.title}</h4>
                  </div>

                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <Check size={12} />
                      SEALED
                    </span>
                  ) : isActive ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-lantern-amber/20 text-lantern-amber border border-lantern-amber/40">
                      ACTIVE
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{quest.description}</p>
                <p className="text-xs font-mono text-moon-cyan mt-1">Current Objective: {quest.stepDescription}</p>

                <div className="mt-2 pt-2 border-t border-sky-800/40 flex space-x-3 text-xs font-mono">
                  <span className="text-moon-cyan font-bold">Rewards: +{quest.rewardDroplets} ✨</span>
                  <span className="text-lantern-amber font-bold">+{quest.rewardFavors} ⚓</span>
                </div>
              </div>
            );
          })}

          {/* Flight Logs */}
          <div className="pt-3 border-t border-sky-800/50">
            <h4 className="font-mono text-xs font-bold text-moon-cyan uppercase mb-2">Telemetry & Dispatch Log</h4>
            <div className="space-y-1.5">
              {gameState.logMessages.slice(0, 5).map(log => (
                <div key={log.id} className="p-2 rounded bg-sky-900/40 border border-sky-800/40 flex justify-between text-xs font-mono">
                  <span className={log.type === 'reward' ? 'text-emerald-400' : log.type === 'hazard' ? 'text-rose-400' : 'text-slate-300'}>
                    {log.text}
                  </span>
                  <span className="text-slate-500 text-[10px]">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
