import React, { useState } from 'react';
import { BookOpen, X, Sparkles, Anchor, Compass, User, Feather, Image, Eye, Quote, Palette } from 'lucide-react';
import { ART_GALLERY } from '../data/gameData';
import { ArtWorkEntry } from '../types';

interface Props {
  onClose: () => void;
}

export const CodexModal: React.FC<Props> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'gallery' | 'world' | 'systems' | 'sera' | 'visual'>('gallery');
  const [selectedArt, setSelectedArt] = useState<ArtWorkEntry | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 font-semibold mb-1">
              <BookOpen className="w-4 h-4" />
              World Lore & Concept Art Gallery
            </div>
            <h2 className="text-2xl font-bold text-slate-100 font-fantasy">
              Floating Night-Market: Skybound Archipelago
            </h2>
          </div>
          <button
            id="btn-close-codex"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pb-4 border-b border-slate-800/80 overflow-x-auto">
          <button
            id="btn-codex-gallery"
            onClick={() => setActiveSection('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'gallery' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 font-bold shadow-md shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Concept Art & Agent Manus
          </button>
          <button
            id="btn-codex-world"
            onClick={() => setActiveSection('world')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'world' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            The Skybound Archipelago
          </button>
          <button
            id="btn-codex-systems"
            onClick={() => setActiveSection('systems')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'systems' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Light, Wind, and Favors
          </button>
          <button
            id="btn-codex-sera"
            onClick={() => setActiveSection('sera')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'sera' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Sera Venn & Nami
          </button>
          <button
            id="btn-codex-visual"
            onClick={() => setActiveSection('visual')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSection === 'visual' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            Visual Language & Lore
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-6 space-y-6">
          {activeSection === 'gallery' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-fantasy flex items-center gap-2">
                  <Palette className="w-5 h-5 text-sky-400" />
                  Atmospheric Art Gallery & Operative Dossiers
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Original conceptual artwork capturing key districts, celestial flight dynamics, and prominent underworld figures including Agent Manus.
                </p>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ART_GALLERY.map((art) => (
                  <div
                    key={art.id}
                    className="rounded-3xl bg-slate-950/80 border border-slate-800/90 overflow-hidden shadow-xl hover:border-sky-500/50 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setSelectedArt(art)}>
                        <img
                          src={art.image}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                        
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] uppercase font-bold tracking-wider text-sky-300">
                          {art.category.toUpperCase()}
                        </div>

                        <button
                          id={`btn-view-art-${art.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArt(art);
                          }}
                          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-sky-500/90 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-sm transition-transform active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Full Art
                        </button>
                      </div>

                      {/* Info Body */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-100 font-fantasy">{art.title}</h4>
                          <p className="text-xs text-sky-400 font-medium">{art.subtitle}</p>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {art.description}
                        </p>
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs italic text-amber-300/90 flex gap-2">
                          <Quote className="w-4 h-4 text-amber-400/50 shrink-0" />
                          <span>{art.loreQuote}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-1 text-[11px] text-slate-400 border-t border-slate-900 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>{art.artistNote}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'world' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-lg font-bold text-sky-300 font-fantasy mb-2">A Bazaar Adrift Above the Storm</h3>
                <p className="font-lore text-slate-300 text-sm leading-relaxed">
                  The Skybound Archipelago is a trade city assembled from drifting barges, temple fragments, and chain-held platforms. Its markets open after moonrise, when blue lanterns make the cloud sea navigable.
                </p>
                <p className="font-lore text-slate-300 text-sm leading-relaxed mt-3">
                  Every route is temporary; every delivery is a promise made against the weather.
                </p>
                <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300 italic">
                  Visual Direction: A full-bleed opening tableau in deep indigo and teal, lit by amber market lamps.
                </div>
              </div>
            </div>
          )}

          {activeSection === 'systems' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100 font-fantasy">The World Runs on Light, Wind, and Favors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-sky-400 font-bold mb-1">System</div>
                  <h4 className="font-bold text-slate-100 font-fantasy text-base mb-2">Moon-koi</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    <strong>Story Function:</strong> Navigate hidden currents and carry messages through cloudbanks.
                  </p>
                  <p className="text-[11px] text-sky-300 italic">
                    <strong>Visual Signature:</strong> Translucent fins, cobalt luminescence, drifting droplets.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-purple-400 font-bold mb-1">System</div>
                  <h4 className="font-bold text-slate-100 font-fantasy text-base mb-2">Storm Anchors</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    <strong>Story Function:</strong> Prevent the market from scattering into the violent upper storm.
                  </p>
                  <p className="text-[11px] text-purple-300 italic">
                    <strong>Visual Signature:</strong> Monumental black chains and lightning-lit cloud wells.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">System</div>
                  <h4 className="font-bold text-slate-100 font-fantasy text-base mb-2">Night Trade</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    <strong>Story Function:</strong> Connects lawful vendors, pilgrims, smugglers, and distant floating islands.
                  </p>
                  <p className="text-[11px] text-amber-300 italic">
                    <strong>Visual Signature:</strong> Brass tubes, talismans, blue-glass lamps, vermilion cloth.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sera' && (
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-sky-300 font-fantasy">Moon-Koi Courier: A Messenger of Unstable Routes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Protagonist Profile: Sera Venn & Nami</p>
              </div>

              <div className="space-y-3 font-lore text-sm text-slate-300 leading-relaxed">
                <p>
                  Raised on a salvage skiff, Sera earned a courier seal after guiding stranded pilgrims through a closed storm current. Her work is to carry sealed messages between drifting districts—often through routes that maps cannot hold.
                </p>
                <p>
                  Her companion is a young moon-koi, <strong>Nami</strong>, who senses residual moonlight within the clouds and will not be caged.
                </p>
                <p className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300/90 italic text-xs">
                  Character Premise: Sera appears reliable because she is prepared; she is feared because she knows who paid for the missing routes.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'visual' && (
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 font-fantasy">One Visual Language, Many Stories</h3>
              <div className="space-y-3 text-xs md:text-sm text-slate-300">
                <div>
                  <strong className="text-sky-400">PALETTE:</strong> Indigo, teal, violet, charcoal, amber, and one controlled vermilion accent.
                </div>
                <div>
                  <strong className="text-amber-400">MATERIALS:</strong> Wet black lacquer, weathered rope, brass, ribbed blue glass, patched sailcloth, and cloud moisture.
                </div>
                <div>
                  <strong className="text-purple-400">COMPOSITION:</strong> Staging human-scale rituals against dangerous open air and immense sky architecture.
                </div>
                <div>
                  <strong className="text-emerald-400">NARRATIVE ENGINE:</strong> A market held together by trade must negotiate what is legal, sacred, and survivable.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* High-Resolution Artwork Lightbox Overlay */}
        {selectedArt && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedArt(null)}>
            <div className="relative max-w-4xl w-full bg-slate-900 border border-sky-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedArt.image}
                  alt={selectedArt.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[60vh]"
                />
                <button
                  id="btn-close-art-lightbox"
                  onClick={() => setSelectedArt(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 font-fantasy">{selectedArt.title}</h3>
                    <p className="text-xs text-sky-400 font-semibold">{selectedArt.subtitle}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase">
                    {selectedArt.category}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-lore">
                  {selectedArt.description}
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs italic text-amber-300 flex gap-2.5 items-center">
                  <Quote className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{selectedArt.loreQuote}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
