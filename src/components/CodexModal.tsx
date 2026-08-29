import React, { useState } from 'react';
import { ART_GALLERY, DISTRICTS } from '../data/gameData';
import { X, BookOpen, Image, FileText, Layers, Shield } from 'lucide-react';

interface CodexModalProps {
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'art' | 'districts' | 'factions' | 'manifest'>('art');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-sky-950 border border-sky-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[88vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-moon-cyan flex items-center gap-2">
              <BookOpen size={20} />
              ILLUSTRATED LORE CODEX
            </h3>
            <p className="text-xs text-slate-400 font-mono">Artworks, Historical Records & World Archives</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-sky-800/40 pb-2 text-xs">
          <button
            onClick={() => setTab('art')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === 'art' ? 'bg-moon-cyan text-sky-950 font-bold' : 'bg-sky-900/40 text-slate-400 hover:text-slate-200'}`}
          >
            Art Gallery
          </button>
          <button
            onClick={() => setTab('districts')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === 'districts' ? 'bg-moon-cyan text-sky-950 font-bold' : 'bg-sky-900/40 text-slate-400 hover:text-slate-200'}`}
          >
            Districts
          </button>
          <button
            onClick={() => setTab('factions')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === 'factions' ? 'bg-moon-cyan text-sky-950 font-bold' : 'bg-sky-900/40 text-slate-400 hover:text-slate-200'}`}
          >
            Factions
          </button>
          <button
            onClick={() => setTab('manifest')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === 'manifest' ? 'bg-moon-cyan text-sky-950 font-bold' : 'bg-sky-900/40 text-slate-400 hover:text-slate-200'}`}
          >
            Cargo Manifest
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {tab === 'art' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ART_GALLERY.map(art => (
                <div key={art.id} className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-3">
                  <div className="w-full h-44 rounded-lg overflow-hidden border border-sky-800/60">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-cinzel font-bold text-sm text-slate-100">{art.title}</h4>
                  <p className="text-xs text-moon-cyan">{art.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{art.description}</p>
                  <p className="text-xs font-serif italic text-lantern-amber">{art.loreQuote}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'districts' && (
            <div className="space-y-4">
              {Object.values(DISTRICTS).map(d => (
                <div key={d.id} className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-2">
                  <h4 className="font-cinzel font-bold text-sm text-slate-100">{d.name}</h4>
                  <p className="text-xs text-moon-cyan">{d.epithet}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{d.description}</p>
                  <p className="text-xs font-mono text-emerald-400">Design Takeaway: {d.designTakeaway}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'factions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-2">
                <h4 className="font-bold text-sm text-moon-cyan">The Lantern Guild</h4>
                <p className="text-xs text-slate-400">Key Figures: Madame Lin, Master Corvo</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Holders of the celestial star-charts and lawful commerce. They maintain the blue beacons that guide weary couriers across the fog.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-2">
                <h4 className="font-bold text-sm text-lantern-amber">The Undertow Syndicate</h4>
                <p className="text-xs text-slate-400">Key Figures: Captain Jax, Agent Manus, Whisperer Kael</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The shadow economy beneath the markets. Smugglers, brokers, and inventors who know how fragile the tethered platforms truly are.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-2">
                <h4 className="font-bold text-sm text-indigo-400">The Anchor Monks</h4>
                <p className="text-xs text-slate-400">Key Figures: Brother Hane</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Devout guardians of the colossal mooring chains. They capture lightning inside storm jars to prevent the kinetic anchors from shearing.
                </p>
              </div>
            </div>
          )}

          {tab === 'manifest' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-100">Moon-Koi Scale Talismans</h4>
                  <span className="text-xs font-mono text-lantern-amber">Living Relic</span>
                </div>
                <p className="text-xs text-slate-300">
                  Cobalt scales shed naturally by Moon-Koi companions during celestial alignments. Resonates when near secret thermal slipstreams.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-100">Charged Weather Storm Jars</h4>
                  <span className="text-xs font-mono text-lantern-amber">Kinetic Fuel</span>
                </div>
                <p className="text-xs text-slate-300">
                  Glass spheres reinforced with silver ribbing, capturing lightning vortex strikes from the Upper Maelstrom.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-100">Ribbed Blue Glass Lenses</h4>
                  <span className="text-xs font-mono text-lantern-amber">Navigation Optic</span>
                </div>
                <p className="text-xs text-slate-300">
                  Focuses phosphor lantern luminescence to cut through blinding thunderstorm fog banks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
