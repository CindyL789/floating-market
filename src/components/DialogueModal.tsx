import React from 'react';
import { GameState, DialogueNode } from '../types';
import { NPCS, DIALOGUE_TREES } from '../data/gameData';
import { sound } from '../utils/audio';
import { MessageSquare, Sparkles, X, Check } from 'lucide-react';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

export const DialogueModal: React.FC<Props> = ({ gameState, setGameState, onClose }) => {
  const npcId = gameState.activeNpcId;
  const npc = npcId ? NPCS[npcId] : null;
  const activeNodeId = gameState.activeDialogueNodeId || npc?.dialogueTreeId || 'madame_lin_start';
  const node: DialogueNode | undefined = DIALOGUE_TREES[activeNodeId];

  if (!npc || !node) return null;

  const handleChoice = (choice: typeof node.choices[0]) => {
    sound.playMoonChime(520);
    if (choice.action) {
      choice.action(gameState, setGameState);
    }
    if (choice.nextNodeId) {
      setGameState(prev => ({
        ...prev,
        activeDialogueNodeId: choice.nextNodeId || null
      }));
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            {npc.portraitImage ? (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-sky-400/60 shadow-lg shadow-sky-500/20 shrink-0 group">
                <img
                  src={npc.portraitImage}
                  alt={npc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-sky-300/30 rounded-2xl pointer-events-none" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-sky-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
                {node.portrait}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 font-fantasy">{node.speaker}</h2>
                {npc.portraitImage && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">
                    Illustrated Agent
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-400 font-semibold">{npc.title}</p>
            </div>
          </div>
          <button
            id="btn-close-dialogue"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialogue Body */}
        <div className="py-6 min-h-[140px] flex items-center">
          <p className="font-lore text-base md:text-lg text-slate-200 leading-relaxed italic">
            "{node.text}"
          </p>
        </div>

        {/* Response Choices */}
        <div className="space-y-2.5 pt-4 border-t border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Choose Response
          </span>
          {node.choices.map((choice, idx) => (
            <button
              key={idx}
              id={`btn-dialogue-choice-${idx}`}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-950/70 hover:bg-sky-950/50 border border-slate-800 hover:border-sky-500/50 text-slate-200 text-xs md:text-sm font-medium transition-all flex items-center justify-between group"
            >
              <span>{choice.text}</span>
              <Sparkles className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
