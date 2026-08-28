import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  Sparkles, 
  Play, 
  Pause, 
  Download, 
  Volume2, 
  VolumeX, 
  X, 
  Radio, 
  Disc, 
  Layers, 
  Image as ImageIcon, 
  Check, 
  Loader2, 
  RefreshCw, 
  FileText,
  Compass,
  Headphones
} from 'lucide-react';
import { ART_GALLERY } from '../data/gameData';
import { sound } from '../utils/audio';

interface GeneratedTrack {
  id: string;
  title: string;
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  prompt: string;
  audioUrl: string;
  audioBlob: Blob;
  mimeType: string;
  lyrics?: string;
  imageRef?: string;
  timestamp: string;
  durationEstimate: string;
}

interface Props {
  onClose: () => void;
  onSetBGM?: (track: GeneratedTrack) => void;
}

const MUSIC_PRESETS = [
  {
    id: 'preset_lantern_bazaar',
    title: 'Lantern Bazaar Twilight Chimes',
    prompt: 'Atmospheric ethereal Asian fantasy market theme with delicate bamboo flute, guzheng arpeggios, glowing night ambient wind chimes, and subtle hand percussion under the moonlight.',
    model: 'lyria-3-clip-preview' as const,
    vibe: 'Mystical & Serene',
    artRefId: 'art_lantern_bazaar'
  },
  {
    id: 'preset_undertow_tavern',
    title: 'Undertow Den Sea Shanty',
    prompt: 'Lively acoustic sky-sailor tavern shanty with acoustic accordion, wooden hurdy-gurdy rhythm, warm plucked strings, and cheerful clandestine market energy.',
    model: 'lyria-3-clip-preview' as const,
    vibe: 'Warm & Rhythmic',
    artRefId: 'art_undertow_den'
  },
  {
    id: 'preset_moon_koi_flight',
    title: 'Moon-Koi Celestial Slipstream',
    prompt: 'Dreamy ambient celestial orchestral suite with shimmering glass marimba, ethereal harp sweeps, soaring cinematic strings, and bioluminescent stardust resonance.',
    model: 'lyria-3-pro-preview' as const,
    vibe: 'Epic & Ethereal',
    artRefId: 'art_moon_koi_flight'
  },
  {
    id: 'preset_storm_maelstrom',
    title: 'Storm Maelstrom High-Altitude Flight',
    prompt: 'Dramatic cinematic orchestral adventure track with thundering taiko drums, driving cello staccato, sweeping brass fanfares, and turbulent cloud-flying intensity.',
    model: 'lyria-3-pro-preview' as const,
    vibe: 'Thrilling & Dynamic',
    artRefId: 'art_manus_agent'
  }
];

export const MusicStudioModal: React.FC<Props> = ({ onClose, onSetBGM }) => {
  const [selectedModel, setSelectedModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [prompt, setPrompt] = useState(MUSIC_PRESETS[0].prompt);
  const [selectedImage, setSelectedImage] = useState<string | null>(ART_GALLERY[1].image);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Track List & Current Playback
  const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLooping, setIsLooping] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Audio Player events
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (!isLooping) setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeTrack, isLooping]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isLooping]);

  const togglePlay = () => {
    if (!audioRef.current || !activeTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error('Playback error:', e));
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: GeneratedTrack) => {
    setActiveTrack(track);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 50);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomImageBase64(event.target.result);
        setSelectedImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateMusic = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Contacting Lyria neural audio engine...');

    try {
      sound.playLanternIgnite('beacon');

      // Prepare image base64 if selected
      let imageBase64ToSend: string | undefined = undefined;
      let mimeTypeToSend = 'image/jpeg';

      if (customImageBase64) {
        imageBase64ToSend = customImageBase64;
      } else if (selectedImage) {
        // Convert static asset URL to base64 for API transmission
        try {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          mimeTypeToSend = blob.type || 'image/jpeg';
          const buffer = await blob.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          imageBase64ToSend = base64;
        } catch {
          // If fetch fails, proceed with text-only
          imageBase64ToSend = undefined;
        }
      }

      setGenerationStep(
        selectedModel === 'lyria-3-clip-preview'
          ? 'Synthesizing 30-second skyway chime clip with Lyria Clip...'
          : 'Composing full-length celestial symphony with Lyria Pro...'
      );

      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          imageBase64: imageBase64ToSend,
          imageMimeType: mimeTypeToSend
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Generation failed: ${response.statusText}`);
      }

      setGenerationStep('Decoding audio stream into master waveform...');
      const data = await response.json();

      if (!data.audioBase64) {
        throw new Error('No audio returned by the Lyria model');
      }

      // Convert base64 to Blob URL
      const binaryString = atob(data.audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const newTrack: GeneratedTrack = {
        id: `track_${Date.now()}`,
        title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
        model: selectedModel,
        prompt,
        audioUrl,
        audioBlob,
        mimeType: data.mimeType || 'audio/wav',
        lyrics: data.lyrics || undefined,
        imageRef: selectedImage || undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationEstimate: selectedModel === 'lyria-3-clip-preview' ? '0:30' : '2:15'
      };

      setTracks(prev => [newTrack, ...prev]);
      setActiveTrack(newTrack);
      sound.playAttunementChime();

      // Auto play the new track
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 100);

    } catch (err: any) {
      console.error('Music generation error:', err);
      setErrorMessage(err.message || 'An error occurred during music generation. Please verify your GEMINI_API_KEY settings.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleDownloadTrack = (track: GeneratedTrack) => {
    const a = document.createElement('a');
    a.href = track.audioUrl;
    a.download = `${track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'skyway_music'}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-sky-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-sky-950/40 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-inner">
              <Music className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-fantasy tracking-wide">
                  Celestial Chimes: Lyria Music Studio
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40">
                  Lyria 3 Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compose custom atmospheric soundtrack themes & skyway harmonies using Google Lyria AI models
              </p>
            </div>
          </div>

          <button
            id="btn-close-music-studio"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Generator Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Model Selector Tabs */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-400" />
                1. Select Lyria Model Architecture
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-model-lyria-clip"
                  onClick={() => setSelectedModel('lyria-3-clip-preview')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedModel === 'lyria-3-clip-preview'
                      ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-950/40 text-sky-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      Lyria Clip (30s)
                    </span>
                    {selectedModel === 'lyria-3-clip-preview' && (
                      <Check className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fast generation for atmospheric chimes, market ambient loops, and short harmonic cues.
                  </p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-slate-900 text-sky-300 border border-slate-700 font-mono">
                    lyria-3-clip-preview
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-model-lyria-pro"
                  onClick={() => setSelectedModel('lyria-3-pro-preview')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedModel === 'lyria-3-pro-preview'
                      ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <Disc className="w-4 h-4 text-amber-400 animate-spin-slow" />
                      Lyria Pro (Full Track)
                    </span>
                    {selectedModel === 'lyria-3-pro-preview' && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Full-length dynamic symphonies, multi-layered melodic progression & orchestral arrangements.
                  </p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700 font-mono">
                    lyria-3-pro-preview
                  </span>
                </button>
              </div>
            </div>

            {/* Presets Quick Pick */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                2. Skyway Harmonic Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MUSIC_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setPrompt(preset.prompt);
                      setSelectedModel(preset.model);
                      const art = ART_GALLERY.find(a => a.id === preset.artRefId);
                      if (art) setSelectedImage(art.image);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      prompt === preset.prompt
                        ? 'bg-slate-800 border-sky-400 text-sky-200 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-bold text-slate-200 line-clamp-1">{preset.title}</div>
                    <div className="text-[10px] text-sky-400 flex items-center gap-1 mt-0.5">
                      <span>{preset.vibe}</span>
                      <span>•</span>
                      <span>{preset.model.includes('pro') ? 'Full Track' : '30s Clip'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  3. Musical Prompt & Instrumentation
                </span>
                <span className="text-[10px] text-slate-500">Natural language style & instruments</span>
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe your desired musical track, instrumentation (e.g. bamboo flute, harp, cello, taiko), mood, tempo, and atmosphere..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-100 placeholder-slate-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Optional Image Reference for Multimodal Music Generation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  4. Visual Reference Inspiration (Optional)
                </label>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => { setSelectedImage(null); setCustomImageBase64(null); }}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Clear Reference
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {/* Upload Custom Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-16 rounded-xl border border-dashed border-slate-700 hover:border-sky-400 bg-slate-950 flex flex-col items-center justify-center text-slate-400 hover:text-sky-300 transition-all shrink-0"
                >
                  <ImageIcon className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-bold">Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />

                {/* Concept Arts */}
                {ART_GALLERY.map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      setSelectedImage(art.image);
                      setCustomImageBase64(null);
                    }}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border cursor-pointer shrink-0 transition-all ${
                      selectedImage === art.image
                        ? 'border-2 border-sky-400 shadow-md scale-105'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1">
                      <span className="text-[8px] text-slate-200 font-medium truncate">{art.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <span>Generation Notice:</span>
                </div>
                {errorMessage}
              </div>
            )}

            {/* Generate Action Button */}
            <button
              id="btn-trigger-music-gen"
              type="button"
              disabled={isGenerating || !prompt.trim()}
              onClick={handleGenerateMusic}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isGenerating || !prompt.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-950/60 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-sky-200" />
                  <span>{generationStep || 'Composing Skyway Music...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Generate Music with {selectedModel === 'lyria-3-clip-preview' ? 'Lyria Clip' : 'Lyria Pro'}</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Audio Player & Track Library (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Active Track Player Card */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    Active Player
                  </span>
                  {activeTrack && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                      {activeTrack.model}
                    </span>
                  )}
                </div>

                {activeTrack ? (
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-fantasy line-clamp-1 mb-1">
                      {activeTrack.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 mb-4">
                      "{activeTrack.prompt}"
                    </p>

                    {/* Waveform Animation */}
                    <div className="h-12 bg-slate-900/90 rounded-2xl border border-slate-800/80 p-2 flex items-center justify-center gap-1 overflow-hidden mb-4">
                      {[12, 28, 40, 18, 35, 48, 22, 44, 30, 15, 38, 50, 24, 32, 42, 16, 28, 46, 20].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-full transition-all duration-150 ${
                            isPlaying
                              ? 'bg-sky-400 animate-pulse'
                              : 'bg-slate-700'
                          }`}
                          style={{
                            height: isPlaying ? `${Math.max(6, (h * (Math.sin(currentTime * 5 + i) + 1.2)) / 2)}px` : `${h / 2}px`
                          }}
                        />
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 mb-4">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setCurrentTime(val);
                          if (audioRef.current) audioRef.current.currentTime = val;
                        }}
                        className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{formatSeconds(currentTime)}</span>
                        <span>{formatSeconds(duration || 30)}</span>
                      </div>
                    </div>

                    {/* Player Controls */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsLooping(!isLooping)}
                        className={`p-2 rounded-xl border text-xs transition-colors ${
                          isLooping ? 'bg-sky-500/20 border-sky-400 text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="Toggle Loop"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLooping ? 'animate-spin-slow' : ''}`} />
                      </button>

                      <button
                        id="btn-music-play-pause"
                        type="button"
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-sky-950 transition-all hover:scale-105"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadTrack(activeTrack)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                        title="Download WAV"
                      >
                        <Download className="w-4 h-4 text-sky-400" />
                      </button>
                    </div>

                    {/* Set as Active BGM Button */}
                    {onSetBGM && (
                      <button
                        type="button"
                        onClick={() => {
                          onSetBGM(activeTrack);
                          sound.playAttunementChime();
                        }}
                        className="w-full mt-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-xs font-bold text-sky-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Disc className="w-3.5 h-3.5" />
                        Set as Active In-Game Atmosphere Track
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <Music className="w-10 h-10 mx-auto text-slate-700" />
                    <p className="text-xs">No track generated yet. Select a model and generate your first skyway chime theme!</p>
                  </div>
                )}
              </div>

              {/* Hidden HTML Audio Element */}
              <audio ref={audioRef} />
            </div>

            {/* Generated Tracks Session History */}
            <div className="flex-1 flex flex-col bg-slate-950/60 rounded-3xl border border-slate-800/80 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Generated Archive ({tracks.length})
                </span>
                {tracks.length > 0 && (
                  <span className="text-[10px] text-slate-500 font-mono">WAV 44.1kHz</span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tracks.length === 0 ? (
                  <div className="py-8 text-center text-slate-600 text-xs italic">
                    Your session compositions will appear here
                  </div>
                ) : (
                  tracks.map(track => (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        activeTrack?.id === track.id
                          ? 'bg-slate-800/90 border-sky-500/60 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          activeTrack?.id === track.id && isPlaying
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {activeTrack?.id === track.id && isPlaying ? (
                            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{track.title}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>{track.model.includes('pro') ? 'Pro Track' : 'Clip'}</span>
                            <span>•</span>
                            <span>{track.timestamp}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadTrack(track);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
                        title="Download WAV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
