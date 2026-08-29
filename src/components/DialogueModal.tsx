import React from 'react';
import { GameState, DialogueChoice } from '../types';
import { NPCS, DIALOGUE_TREES } from '../data/gameData';
import { X, Sparkles, ChevronRight } from 'lucide-react';

interface DialogueModalProps {
  gameState: GameState;
  onChoiceSelected: (choice: DialogueChoice) => void;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  gameState,
  onChoiceSelected,
  onClose
}) => {
  const npcId = gameState.activeNpcId;
  if (!npcId) return null;

  const npc = NPCS[npcId];
  if (!npc) return null;

  const nodeId = gameState.activeDialogueNodeId || npc.dialogueTreeId;
  const node = DIALOGUE_TREES[nodeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-sky-950/95 border border-sky-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sky-800/60 flex items-center justify-between bg-sky-900/40">
          <div className="flex items-center space-x-3">
            {npc.portrait ? (
              <img src={npc.portrait} alt={npc.name} className="w-12 h-12 rounded-full object-cover border-2 border-moon-cyan shadow-md shadow-moon-cyan/20" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-sky-800 border border-sky-700 flex items-center justify-center text-2xl">
                {npc.iconEmoji}
              </div>
            )}
            <div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100">{npc.name}</h3>
              <p className="text-xs text-moon-cyan">{npc.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialogue Box */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 text-slate-200 text-sm leading-relaxed min-h-[90px] flex items-center">
            <p>{node ? node.text : npc.greeting}</p>
          </div>

          {/* Choices */}
          <div className="space-y-2">
            <p className="text-[11px] font-mono font-bold text-lantern-amber uppercase">Responses // Actions</p>
            <div className="space-y-2">
              {(node?.choices || [{ text: 'Depart.', nextNodeId: undefined }]).map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => onChoiceSelected(choice)}
                  className="w-full text-left p-3.5 rounded-xl bg-sky-900/50 hover:bg-sky-800/70 border border-sky-800/60 hover:border-moon-cyan/50 text-xs text-slate-200 hover:text-moon-cyan font-medium transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-moon-cyan text-sm">✦</span>
                    <span>{choice.text}</span>
                  </span>
                  <ChevronRight size={14} className="text-slate-500 group-hover:text-moon-cyan group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
