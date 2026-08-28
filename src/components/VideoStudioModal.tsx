import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  X, 
  Maximize2, 
  Layers, 
  Image as ImageIcon, 
  Check, 
  Loader2, 
  RefreshCw, 
  Ratio,
  Compass,
  AlertCircle,
  Video
} from 'lucide-react';
import { ART_GALLERY } from '../data/gameData';
import { sound } from '../utils/audio';

interface GeneratedVideo {
  id: string;
  title: string;
  model: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  videoUrl: string;
  sourceImage: string;
  timestamp: string;
}

interface Props {
  onClose: () => void;
}

const MOTION_PRESETS = [
  {
    id: 'motion_lantern_drift',
    title: 'Twilight Lantern Drift & Cloud Flow',
    prompt: 'Gentle atmospheric night wind swaying silk lanterns and blue paper lamps as soft glowing clouds roll beneath the wooden platforms.',
    aspectRatio: '16:9' as const,
    artRefId: 'art_lantern_bazaar'
  },
  {
    id: 'motion_koi_swim',
    title: 'Bioluminescent Moon-Koi Graceful Glide',
    prompt: 'Smooth cinematic motion as the glowing cyan Moon-Koi circles gracefully through the night sky, leaving a sparkling trail of stardust.',
    aspectRatio: '16:9' as const,
    artRefId: 'art_moon_koi_flight'
  },
  {
    id: 'motion_agent_portrait',
    title: 'Operative Ambient Living Portrait',
    prompt: 'Subtle atmospheric living portrait with ambient wind blowing hair and cape, eyes glowing with celestial starlight, and distant lightning flashing.',
    aspectRatio: '9:16' as const,
    artRefId: 'art_manus_agent'
  },
  {
    id: 'motion_tavern_porthole',
    title: 'Undertow Storm Observation Window',
    prompt: 'Tavern lanterns flickering warmly while violent electric storm clouds and purple lightning surge outside the giant circular observation porthole.',
    aspectRatio: '16:9' as const,
    artRefId: 'art_undertow_den'
  }
];

export const VideoStudioModal: React.FC<Props> = ({ onClose }) => {
  // Model specified in requirements
  const MODEL_NAME = 'veo-3.1-fast-generate-preview';

  // Input states
  const [selectedImage, setSelectedImage] = useState<string>(ART_GALLERY[0].image);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [motionPrompt, setMotionPrompt] = useState(MOTION_PRESETS[0].prompt);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Generation execution state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Video playback & library state
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<GeneratedVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPEG, WebP).');
      return;
    }
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomImageBase64(event.target.result);
        setSelectedImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleStartVideoGeneration = async () => {
    if (isGenerating || !selectedImage) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setProgressPercent(10);
    setGenerationStep('Preparing frame and starting Veo video generation...');
    sound.playLanternIgnite('signal');

    try {
      // Get base64 representation of source image
      let imageBase64ToSend: string = '';
      let mimeTypeToSend: string = 'image/jpeg';

      if (customImageBase64) {
        imageBase64ToSend = customImageBase64;
      } else {
        // Fetch static asset
        const imgRes = await fetch(selectedImage);
        const blob = await imgRes.blob();
        mimeTypeToSend = blob.type || 'image/jpeg';
        const buffer = await blob.arrayBuffer();
        imageBase64ToSend = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      }

      // Step 1: POST /api/generate-video
      setGenerationStep('Submitting animation request to veo-3.1-fast-generate-preview...');
      setProgressPercent(25);

      const genRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: motionPrompt,
          imageBase64: imageBase64ToSend,
          imageMimeType: mimeTypeToSend,
          aspectRatio
        })
      });

      if (!genRes.ok) {
        const errJson = await genRes.json().catch(() => ({}));
        throw new Error(errJson.error || `Veo initiation failed: ${genRes.statusText}`);
      }

      const { operationName } = await genRes.json();
      if (!operationName) {
        throw new Error('No operation name returned from video generator');
      }

      // Step 2: Poll /api/video-status
      setGenerationStep('Simulating celestial lighting and atmospheric motion...');
      setProgressPercent(40);

      const pollStatus = async (): Promise<boolean> => {
        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName })
        });

        if (!statusRes.ok) {
          const errJson = await statusRes.json().catch(() => ({}));
          throw new Error(errJson.error || 'Failed to poll video status');
        }

        const statusData = await statusRes.json();
        if (statusData.error) {
          throw new Error(`Veo generation error: ${statusData.error}`);
        }

        return Boolean(statusData.done);
      };

      // Polling loop with progressive user-facing status messages
      const statusMessages = [
        'Calculating optical flow vectors & perspective planes...',
        'Synthesizing cloud particle turbulence and glow rays...',
        'Rendering high-fidelity celestial video frames...',
        'Finalizing temporal coherence and fluid transitions...'
      ];

      let pollCount = 0;
      let isDone = false;

      while (!isDone && pollCount < 40) { // Up to ~2.5 minutes
        await new Promise(resolve => setTimeout(resolve, 3500));
        pollCount++;
        
        const msgIndex = Math.min(pollCount - 1, statusMessages.length - 1);
        setGenerationStep(statusMessages[msgIndex]);
        setProgressPercent(Math.min(90, 40 + pollCount * 4));

        isDone = await pollStatus();
      }

      if (!isDone) {
        throw new Error('Video generation timed out. Please try again with a shorter prompt.');
      }

      // Step 3: Download video via POST /api/video-download
      setGenerationStep('Downloading and assembling video stream...');
      setProgressPercent(95);

      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName })
      });

      if (!downloadRes.ok) {
        const errJson = await downloadRes.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to download generated video');
      }

      const videoBlob = await downloadRes.blob();
      const videoUrl = URL.createObjectURL(videoBlob);

      const newVideo: GeneratedVideo = {
        id: `video_${Date.now()}`,
        title: motionPrompt.slice(0, 32) + (motionPrompt.length > 32 ? '...' : ''),
        model: MODEL_NAME,
        prompt: motionPrompt,
        aspectRatio,
        videoUrl,
        sourceImage: selectedImage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setVideos(prev => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      sound.playAttunementChime();

    } catch (err: any) {
      console.error('Video generation error:', err);
      setErrorMessage(err.message || 'An error occurred during video generation. Please check your GEMINI_API_KEY settings.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setProgressPercent(0);
    }
  };

  const handleDownloadVideo = (video: GeneratedVideo) => {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    a.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'skyway_video'}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-sky-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <Film className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100 font-fantasy tracking-wide">
                  Living Tapestry: Veo Video Animator
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 font-mono">
                  {MODEL_NAME}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload a photo or choose concept art to generate fluid atmospheric video animations with Google Veo
              </p>
            </div>
          </div>

          <button
            id="btn-close-video-studio"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Image Source & Animation Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Image Upload & Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  1. Source Image to Animate
                </label>
                {customImageBase64 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Custom Photo Uploaded
                  </span>
                )}
              </div>

              {/* Drag & Drop Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
                  isDragging
                    ? 'border-sky-400 bg-sky-500/15 scale-[1.01]'
                    : 'border-slate-800 hover:border-sky-500/60 bg-slate-950/70 hover:bg-slate-950'
                }`}
              >
                {selectedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Source preview"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full rounded-xl object-contain shadow-md border border-slate-800"
                    />
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                        <Upload className="w-3.5 h-3.5" />
                        Click to Change / Upload New Photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <Upload className="w-8 h-8 text-sky-400 mx-auto animate-bounce" />
                    <p className="text-xs font-bold text-slate-200">Drag & drop your photo here, or click to browse</p>
                    <p className="text-[10px] text-slate-500">Supports PNG, JPEG, WebP</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Quick Select Preset Art */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Or select from world concept art:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {ART_GALLERY.map(art => (
                    <div
                      key={art.id}
                      onClick={() => {
                        setSelectedImage(art.image);
                        setCustomImageBase64(null);
                        const matchPreset = MOTION_PRESETS.find(p => p.artRefId === art.id);
                        if (matchPreset) {
                          setMotionPrompt(matchPreset.prompt);
                          setAspectRatio(matchPreset.aspectRatio);
                        }
                      }}
                      className={`relative h-14 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        selectedImage === art.image
                          ? 'border-2 border-sky-400 shadow-md scale-105 ring-2 ring-sky-400/20'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={art.image}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1">
                        <span className="text-[8px] text-slate-200 font-bold truncate">{art.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Aspect Ratio Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Ratio className="w-3.5 h-3.5 text-sky-400" />
                2. Target Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-aspect-16-9"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span className="w-4 h-2.5 rounded bg-sky-400/40 border border-sky-400 inline-block" />
                      16:9 Landscape
                    </div>
                    <p className="text-[10px] text-slate-400">Panoramic skyway vista & cinematic wide frame</p>
                  </div>
                  {aspectRatio === '16:9' && <Check className="w-4 h-4 text-sky-400" />}
                </button>

                <button
                  type="button"
                  id="btn-aspect-9-16"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <span className="w-2.5 h-4 rounded bg-indigo-400/40 border border-indigo-400 inline-block" />
                      9:16 Portrait
                    </div>
                    <p className="text-[10px] text-slate-400">Celestial banner & vertical operative portraits</p>
                  </div>
                  {aspectRatio === '9:16' && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              </div>
            </div>

            {/* 3. Motion Prompt */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  3. Motion Direction Prompt
                </span>
                <span className="text-[10px] text-slate-500">Camera motion & atmospheric physics</span>
              </label>
              <textarea
                value={motionPrompt}
                onChange={e => setMotionPrompt(e.target.value)}
                rows={2}
                placeholder="Describe the motion dynamics, wind, camera glide, lighting pulses, and atmospheric animation..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-100 placeholder-slate-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Animation Error</span>
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              id="btn-trigger-video-gen"
              type="button"
              disabled={isGenerating || !selectedImage}
              onClick={handleStartVideoGeneration}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isGenerating || !selectedImage
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-600 hover:from-indigo-400 hover:to-sky-400 text-white shadow-indigo-950/60 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>{generationStep || 'Animating with Veo...'}</span>
                </>
              ) : (
                <>
                  <Film className="w-5 h-5 text-amber-300" />
                  <span>Animate Image into Video with Veo ({aspectRatio})</span>
                </>
              )}
            </button>

            {/* Progress Bar during generation */}
            {isGenerating && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 animate-pulse">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-sky-400">{generationStep}</span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Video Player & Output Archive (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Active Video Player Screen */}
            <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800/80 flex flex-col shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  Generated Video Player
                </span>
                {activeVideo && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                    {activeVideo.aspectRatio}
                  </span>
                )}
              </div>

              {activeVideo ? (
                <div className="space-y-3">
                  <div className={`relative w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shadow-inner ${
                    activeVideo.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[360px] mx-auto' : 'aspect-video'
                  }`}>
                    <video
                      ref={videoRef}
                      src={activeVideo.videoUrl}
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {/* Overlay Play/Pause Button on Hover */}
                    <div 
                      onClick={toggleVideoPlayback}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-900/80 group-hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-lg group-hover:scale-110 transition-transform">
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-100 font-fantasy truncate">
                      {activeVideo.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 italic line-clamp-2 mt-0.5">
                      "{activeVideo.prompt}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadVideo(activeVideo)}
                    className="w-full py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold text-indigo-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Generated MP4 Video
                  </button>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <Film className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-xs font-medium">No video generated yet.</p>
                  <p className="text-[10px] text-slate-600">
                    Select an image and click animate to generate your first Veo atmospheric video.
                  </p>
                </div>
              )}
            </div>

            {/* Generated Videos Session Archive */}
            <div className="flex-1 flex flex-col bg-slate-950/60 rounded-3xl border border-slate-800/80 p-4 overflow-hidden min-h-[140px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Generated Video Archive ({videos.length})
                </span>
                {videos.length > 0 && (
                  <span className="text-[10px] text-slate-500 font-mono">720p H.264</span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {videos.length === 0 ? (
                  <div className="py-6 text-center text-slate-600 text-xs italic">
                    Your rendered Veo videos will appear here
                  </div>
                ) : (
                  videos.map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        activeVideo?.id === vid.id
                          ? 'bg-slate-800/90 border-indigo-500/60 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-black border border-slate-700 shrink-0">
                          <video
                            src={vid.videoUrl}
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{vid.title}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>{vid.aspectRatio}</span>
                            <span>•</span>
                            <span>{vid.timestamp}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadVideo(vid);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
                        title="Download MP4"
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
