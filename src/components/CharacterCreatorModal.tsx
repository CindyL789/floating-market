import React, { useState } from 'react';
import { GameState, CharacterCustomization, RigId } from '../types';
import { CHARACTER_OPTIONS, CHARACTER_PRESETS, GEAR_RIGS } from '../data/gameData';
import { CharacterAvatar } from './CharacterAvatar';
import { sound } from '../utils/audio';
import { 
  User, 
  Sparkles, 
  Scissors, 
  Shield, 
  Dice5, 
  Save, 
  X, 
  Check, 
  Feather, 
  Eye, 
  HeartHandshake,
  Compass,
  Scroll
} from 'lucide-react';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

type TabType = 'identity' | 'face' | 'hair' | 'outfit' | 'companion';

export const CharacterCreatorModal: React.FC<Props> = ({
  gameState,
  setGameState,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [char, setChar] = useState<CharacterCustomization>(() => {
    return { ...gameState.character };
  });
  const [isSaved, setIsSaved] = useState(false);

  // Tab switching with sound
  const handleTabChange = (tab: TabType) => {
    sound.playMoonChime(480);
    setActiveTab(tab);
  };

  // Preset loading
  const handleLoadPreset = (presetConfig: Partial<CharacterCustomization>) => {
    sound.playMoonChime(560);
    setChar(prev => ({
      ...prev,
      ...presetConfig
    }));
  };

  // Randomize character
  const handleRandomize = () => {
    sound.playDiceRoll();
    const randItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    
    const randomSkin = randItem(CHARACTER_OPTIONS.skinTones).color;
    const randomFace = randItem(CHARACTER_OPTIONS.faceShapes).id as any;
    const randomEyeStyle = randItem(CHARACTER_OPTIONS.eyeStyles).id as any;
    const randomEyeColor = randItem(CHARACTER_OPTIONS.eyeColors).color;
    const randomEyebrow = randItem(CHARACTER_OPTIONS.eyebrowStyles).id as any;
    const randomFeature = randItem(CHARACTER_OPTIONS.facialFeatures).id as any;
    const randomHair = randItem(CHARACTER_OPTIONS.hairstyles).id as any;
    const randomHairColor = randItem(CHARACTER_OPTIONS.hairColors).color;
    const randomAccessory = randItem(CHARACTER_OPTIONS.accessories).id as any;
    const randomBody = randItem(CHARACTER_OPTIONS.bodyTypes).id as any;
    const randomKoiColor = randItem(CHARACTER_OPTIONS.koiCompanionColors).id as any;
    const randomBackstory = randItem(CHARACTER_OPTIONS.backstories).id as any;
    const randomTitle = randItem(CHARACTER_OPTIONS.titles);

    setChar(prev => ({
      ...prev,
      title: randomTitle,
      bodyType: randomBody,
      skinTone: randomSkin,
      faceShape: randomFace,
      eyeStyle: randomEyeStyle,
      eyeColor: randomEyeColor,
      eyebrows: randomEyebrow,
      facialFeature: randomFeature,
      hairstyle: randomHair,
      hairColor: randomHairColor,
      accessory: randomAccessory,
      koiCompanionColor: randomKoiColor,
      backstory: randomBackstory
    }));
  };

  // Save character
  const handleSaveCharacter = () => {
    sound.playTempleGong();
    
    // Also unlock the chosen initial outfit if not unlocked
    const newUnlockedRigs = Array.from(new Set([...gameState.unlockedRigs, char.initialOutfit]));

    setGameState(prev => ({
      ...prev,
      character: { ...char },
      activeRig: char.initialOutfit,
      unlockedRigs: newUnlockedRigs,
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Courier Registry Updated: ${char.name}, the ${char.title}. Ready for flight.`,
          time: 'Just now',
          type: 'story'
        },
        ...prev.logMessages
      ]
    }));

    // Save to localStorage
    try {
      localStorage.setItem('moon_koi_courier_char', JSON.stringify(char));
    } catch (e) {
      console.error(e);
    }

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0a0f1d] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Left Column: Live Visual Avatar Preview & Profile Card */}
        <div className="w-full md:w-80 lg:w-96 bg-gradient-to-b from-[#0c1427] to-[#060913] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col items-center justify-between shrink-0">
          
          {/* Preset Picker Header */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Courier Avatar
              </span>
              <button
                id="btn-randomize-char"
                onClick={handleRandomize}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-amber-300 flex items-center gap-1 border border-slate-700 transition-all hover:scale-105"
                title="Randomize Appearance"
              >
                <Dice5 className="w-3 h-3" /> Roll
              </button>
            </div>

            {/* Presets fast chips */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {CHARACTER_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => handleLoadPreset(preset.config)}
                  className={`px-2 py-1 rounded-lg text-left text-[10px] font-medium border transition-all ${
                    char.name === preset.name
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold truncate">{preset.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{preset.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: Dynamic Vector Avatar */}
          <div className="my-2 relative flex flex-col items-center">
            <div className="p-3 rounded-full bg-slate-900/70 border border-sky-500/20 shadow-2xl shadow-sky-950/50">
              <CharacterAvatar character={char} size="xl" showKoiCompanion={true} />
            </div>

            {/* Floating Companion Aura Badge */}
            <div className="mt-3 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2 shadow-sm">
              <div 
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: CHARACTER_OPTIONS.koiCompanionColors.find(k => k.id === char.koiCompanionColor)?.color || '#38bdf8' }}
              />
              <span>Companion: <strong>Nami ({CHARACTER_OPTIONS.koiCompanionColors.find(k => k.id === char.koiCompanionColor)?.name})</strong></span>
            </div>
          </div>

          {/* Bottom Card Summary */}
          <div className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <h3 className="text-base font-extrabold text-slate-100 font-fantasy">{char.name || 'Unnamed Pilot'}</h3>
            <p className="text-xs text-sky-400 font-medium">{char.title}</p>
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 mt-1">
              <span>{char.pronouns}</span>
              <span>•</span>
              <span className="capitalize">{char.bodyType} Frame</span>
              <span>•</span>
              <span className="capitalize">{GEAR_RIGS[char.initialOutfit]?.name || 'Courier'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#070b16]">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-fantasy tracking-wide">
                  Courier Pilot Registry
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-lore">
                Customize Sera Venn or forge your own skyward identity adrift above the clouds.
              </p>
            </div>
            
            <button
              id="btn-close-char-creator"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto px-4">
            <button
              onClick={() => handleTabChange('identity')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'identity'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" /> Identity & Lore
            </button>
            <button
              onClick={() => handleTabChange('face')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'face'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Face & Markings
            </button>
            <button
              onClick={() => handleTabChange('hair')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'hair'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" /> Hairstyle & Dye
            </button>
            <button
              onClick={() => handleTabChange('outfit')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'outfit'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Gear & Attire
            </button>
            <button
              onClick={() => handleTabChange('companion')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'companion'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Moon-Koi Nami
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6">
            
            {/* TAB 1: IDENTITY */}
            {activeTab === 'identity' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Character Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Courier Call-Sign / Name
                  </label>
                  <input
                    id="input-char-name"
                    type="text"
                    value={char.name}
                    onChange={(e) => setChar(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter pilot name..."
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 font-bold focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>

                {/* Title & Honorific */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Skyway Title / Reputation
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CHARACTER_OPTIONS.titles.map(title => (
                      <button
                        key={title}
                        onClick={() => { sound.playMoonChime(420); setChar(prev => ({ ...prev, title })); }}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                          char.title === title
                            ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pronouns */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Form of Address / Pronouns
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CHARACTER_OPTIONS.pronounOptions.map(p => (
                      <button
                        key={p}
                        onClick={() => { sound.playMoonChime(400); setChar(prev => ({ ...prev, pronouns: p })); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          char.pronouns === p
                            ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Type & Frame */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Pilot Frame & Physique
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CHARACTER_OPTIONS.bodyTypes.map(body => (
                      <button
                        key={body.id}
                        onClick={() => { sound.playMoonChime(440); setChar(prev => ({ ...prev, bodyType: body.id as any })); }}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          char.bodyType === body.id
                            ? 'bg-sky-500/15 border-sky-400 text-slate-100 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                          <span>{body.name}</span>
                          {char.bodyType === body.id && <Check className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{body.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backstory Lore */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Origin & Skyway Backstory
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CHARACTER_OPTIONS.backstories.map(b => (
                      <button
                        key={b.id}
                        onClick={() => { sound.playMoonChime(460); setChar(prev => ({ ...prev, backstory: b.id as any })); }}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          char.backstory === b.id
                            ? 'bg-amber-500/15 border-amber-400 text-slate-100 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                          <span>{b.name}</span>
                          {char.backstory === b.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400 font-lore mt-0.5 leading-relaxed">{b.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FACE & MARKINGS */}
            {activeTab === 'face' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Skin Tone Swatches */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Skin Complexion
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {CHARACTER_OPTIONS.skinTones.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => { sound.playMoonChime(380); setChar(prev => ({ ...prev, skinTone: tone.color })); }}
                        className={`group relative p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          char.skinTone === tone.color
                            ? 'border-sky-400 ring-2 ring-sky-400/40 bg-slate-800'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full shadow-inner border border-black/20"
                          style={{ backgroundColor: tone.color }}
                        />
                        <span className="text-[9px] font-medium text-slate-300 truncate w-full text-center">
                          {tone.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Face Shape */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Facial Contour & Bone Structure
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {CHARACTER_OPTIONS.faceShapes.map(f => (
                      <button
                        key={f.id}
                        onClick={() => { sound.playMoonChime(420); setChar(prev => ({ ...prev, faceShape: f.id as any })); }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          char.faceShape === f.id
                            ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200">{f.name}</div>
                        <div className="text-[10px] text-slate-400">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Style & Eye Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Eye Style */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Eye Expression
                    </label>
                    <div className="space-y-1.5">
                      {CHARACTER_OPTIONS.eyeStyles.map(eye => (
                        <button
                          key={eye.id}
                          onClick={() => { sound.playMoonChime(440); setChar(prev => ({ ...prev, eyeStyle: eye.id as any })); }}
                          className={`w-full p-2 rounded-xl text-left border transition-all ${
                            char.eyeStyle === eye.id
                              ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-200">{eye.name}</div>
                          <div className="text-[10px] text-slate-400">{eye.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Eye Color Swatches */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Iris Luminescence
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CHARACTER_OPTIONS.eyeColors.map(color => (
                        <button
                          key={color.id}
                          onClick={() => { sound.playMoonChime(480); setChar(prev => ({ ...prev, eyeColor: color.color })); }}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            char.eyeColor === color.color
                              ? 'border-sky-400 bg-sky-500/15'
                              : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: color.color }}
                          />
                          <span className="text-[11px] font-bold text-slate-200">{color.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Eyebrows */}
                    <div className="mt-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Eyebrows
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {CHARACTER_OPTIONS.eyebrowStyles.map(brow => (
                          <button
                            key={brow.id}
                            onClick={() => { sound.playMoonChime(400); setChar(prev => ({ ...prev, eyebrows: brow.id as any })); }}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                              char.eyebrows === brow.id
                                ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            {brow.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facial Markings & Scars */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Facial Markings, Scars & Talismans
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CHARACTER_OPTIONS.facialFeatures.map(feat => (
                      <button
                        key={feat.id}
                        onClick={() => { sound.playMoonChime(500); setChar(prev => ({ ...prev, facialFeature: feat.id as any })); }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          char.facialFeature === feat.id
                            ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200">{feat.name}</div>
                        <div className="text-[10px] text-slate-400">{feat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HAIR & STYLE */}
            {activeTab === 'hair' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Hair Color Dye Swatches */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Hair Color & Astral Dye
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CHARACTER_OPTIONS.hairColors.map(hairC => (
                      <button
                        key={hairC.id}
                        onClick={() => { sound.playMoonChime(420); setChar(prev => ({ ...prev, hairColor: hairC.color })); }}
                        className={`p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all ${
                          char.hairColor === hairC.color
                            ? 'border-sky-400 ring-2 ring-sky-400/40 bg-slate-800'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full shadow-md shrink-0 border border-slate-700"
                          style={{ 
                            background: `linear-gradient(135deg, ${hairC.color}, ${hairC.highlight})` 
                          }}
                        />
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-200 leading-tight">{hairC.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hairstyle Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Hairstyle Cut
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CHARACTER_OPTIONS.hairstyles.map(h => (
                      <button
                        key={h.id}
                        onClick={() => { sound.playMoonChime(460); setChar(prev => ({ ...prev, hairstyle: h.id as any })); }}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          char.hairstyle === h.id
                            ? 'bg-sky-500/20 border-sky-400 text-slate-100 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                          <span>{h.name}</span>
                          {char.hairstyle === h.id && <Check className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{h.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GEAR & ATTIRE */}
            {activeTab === 'outfit' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Initial Rig Suit Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Starting Courier Rig Attire
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(GEAR_RIGS).map(rig => (
                      <button
                        key={rig.id}
                        onClick={() => { sound.playMoonChime(520); setChar(prev => ({ ...prev, initialOutfit: rig.id })); }}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          char.initialOutfit === rig.id
                            ? 'bg-sky-500/20 border-sky-400 text-slate-100 shadow-md ring-1 ring-sky-400/40'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-slate-100 font-fantasy">{rig.name}</span>
                          {char.initialOutfit === rig.id && <Check className="w-4 h-4 text-sky-400" />}
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mb-2">{rig.description}</p>
                        
                        <div className="space-y-1 pt-1.5 border-t border-slate-800">
                          {rig.perks.slice(0, 2).map((perk, i) => (
                            <div key={i} className="text-[10px] text-sky-300 font-medium flex items-center gap-1.5">
                              <Sparkles className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courier Accessories */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Flight Accessory & Headpiece
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CHARACTER_OPTIONS.accessories.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => { sound.playMoonChime(440); setChar(prev => ({ ...prev, accessory: acc.id as any })); }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          char.accessory === acc.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200">{acc.name}</div>
                        <div className="text-[10px] text-slate-400">{acc.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MOON-KOI COMPANION */}
            {activeTab === 'companion' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30">
                  <div className="flex items-center gap-2 text-sky-300 font-bold text-sm mb-1">
                    <Sparkles className="w-4 h-4 text-sky-400" /> Nami the Moon-Koi Companion
                  </div>
                  <p className="text-xs text-slate-300 font-lore leading-relaxed">
                    Nami swims in the atmospheric currents alongside your skiff, locating drifting moon-droplets and guiding you through dense fog slipstreams.
                  </p>
                </div>

                {/* Companion Aura Color */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nami's Spectral Resonance & Luminescence
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CHARACTER_OPTIONS.koiCompanionColors.map(koiC => (
                      <button
                        key={koiC.id}
                        onClick={() => { sound.playMoonChime(540); setChar(prev => ({ ...prev, koiCompanionColor: koiC.id as any })); }}
                        className={`p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                          char.koiCompanionColor === koiC.id
                            ? 'border-sky-400 ring-2 ring-sky-400/40 bg-slate-800'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full shadow-md shrink-0 animate-pulse"
                          style={{ backgroundColor: koiC.color, boxShadow: `0 0 12px ${koiC.color}` }}
                        />
                        <div className="text-left flex-1">
                          <div className="text-xs font-bold text-slate-200">{koiC.name}</div>
                          <div className="text-[10px] text-slate-400">Resonates with celestial winds</div>
                        </div>
                        {char.koiCompanionColor === koiC.id && <Check className="w-4 h-4 text-sky-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-save-character"
              onClick={handleSaveCharacter}
              disabled={!char.name.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> Character Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save & Launch Skiff
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
