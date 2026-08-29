import React, { useState } from 'react';
import { GameState, CharacterCustomization } from '../types';
import { CHARACTER_PRESETS } from '../data/gameData';
import { X, User, Sparkles, Check } from 'lucide-react';

interface CharacterCreatorModalProps {
  gameState: GameState;
  onUpdateCharacter: (char: CharacterCustomization) => void;
  onClose: () => void;
}

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  gameState,
  onUpdateCharacter,
  onClose
}) => {
  const [char, setChar] = useState<CharacterCustomization>(gameState.character);

  const companionColors = [
    { id: 'azure_glow', name: 'Azure Glow', hex: '#38bdf8' },
    { id: 'rose_gold', name: 'Rose Gold', hex: '#fb7185' },
    { id: 'midnight_purple', name: 'Midnight Violet', hex: '#818cf8' },
    { id: 'emerald_jade', name: 'Emerald Tide', hex: '#2dd4bf' },
    { id: 'solar_amber', name: 'Solar Amber', hex: '#f59e0b' }
  ];

  const handleSave = () => {
    onUpdateCharacter(char);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-sky-950 border border-sky-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[88vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-moon-cyan flex items-center gap-2">
              <User size={20} />
              COURIER DOSSIER & PERSONA
            </h3>
            <p className="text-xs text-slate-400">Personalize Courier & Moon-Koi Companion</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Presets */}
        <div>
          <p className="text-[11px] font-mono font-bold text-lantern-amber uppercase mb-2">Quick Archetype Presets</p>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {CHARACTER_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => setChar(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs border whitespace-nowrap transition-colors ${char.name === preset.name ? 'bg-moon-cyan/20 border-moon-cyan text-moon-cyan' : 'bg-sky-900/40 border-sky-800 text-slate-300 hover:bg-sky-800'}`}
              >
                <span className="font-bold">{preset.name}</span>
                <span className="text-[10px] text-slate-400 block">{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Courier Name</label>
            <input
              type="text"
              value={char.name}
              onChange={e => setChar({ ...char, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-sky-900/50 border border-sky-800 text-sm text-slate-100 focus:outline-none focus:border-moon-cyan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Skyway Title</label>
            <input
              type="text"
              value={char.title}
              onChange={e => setChar({ ...char, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-sky-900/50 border border-sky-800 text-sm text-slate-100 focus:outline-none focus:border-moon-cyan"
            />
          </div>

          {/* Koi Color */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-emerald-400 font-bold block">Nami Moon-Koi Companion Color</label>
            <div className="flex space-x-3">
              {companionColors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setChar({ ...char, koiCompanionColor: c.id })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${char.koiCompanionColor === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80'}`}
                >
                  {char.koiCompanionColor === c.id && <Check size={16} className="text-sky-950" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pronouns */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Pronouns</label>
            <div className="flex space-x-2">
              {['she/her', 'they/them', 'he/him', 'ze/hir'].map(p => (
                <button
                  key={p}
                  onClick={() => setChar({ ...char, pronouns: p })}
                  className={`px-2.5 py-1 rounded text-xs border ${char.pronouns === p ? 'bg-sky-800 border-moon-cyan text-moon-cyan' : 'bg-sky-950 border-sky-800 text-slate-400'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-moon-cyan hover:bg-sky-200 text-sky-950 font-bold font-mono text-xs transition-colors"
        >
          CONFIRM DOSSIER
        </button>
      </div>
    </div>
  );
};
