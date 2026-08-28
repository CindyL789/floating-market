import React, { useState, useRef, useEffect } from 'react';
import { GameState, DistrictId, LandmarkInfo, BiomeRegion, BiomeId } from '../types';
import { DISTRICTS, BIOMES, LANDMARKS } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crosshair, 
  Navigation, 
  MapPin, 
  ShieldAlert, 
  Wind, 
  Sparkles, 
  Layers, 
  X, 
  Anchor, 
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
  onFastTravel?: (districtId: DistrictId) => void;
}

export const WorldMapModal: React.FC<Props> = ({
  gameState,
  setGameState,
  onClose,
  onFastTravel,
}) => {
  // World bounds in coordinate units
  const WORLD_WIDTH = 2000;
  const WORLD_HEIGHT = 1800;

  // Viewport / Pan & Zoom state
  const [zoom, setZoom] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({
    x: -gameState.playerPos.x * 0.85 + 400,
    y: -gameState.playerPos.y * 0.85 + 300,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Inspection states
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkInfo | null>(null);
  const [selectedBiome, setSelectedBiome] = useState<BiomeRegion | null>(null);

  // Filter toggles
  const [showBiomes, setShowBiomes] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showWindRoutes, setShowWindRoutes] = useState(true);
  const [showHazards, setShowHazards] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Center on player position
  const handleCenterOnPlayer = () => {
    sound.playMoonChime(500);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPan({
      x: rect.width / 2 - gameState.playerPos.x * zoom,
      y: rect.height / 2 - gameState.playerPos.y * zoom,
    });
  };

  // Center on player on first mount
  useEffect(() => {
    handleCenterOnPlayer();
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    sound.playMoonChime(460);
    setZoom(prev => Math.min(prev + 0.25, 2.2));
  };

  const handleZoomOut = () => {
    sound.playMoonChime(420);
    setZoom(prev => Math.max(prev - 0.25, 0.45));
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.45), 2.2));
  };

  // Mouse drag panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-map-btn')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Set flight navigation waypoint
  const handleSetWaypoint = (x: number, y: number, label: string) => {
    sound.playMoonChime(620);
    setGameState(prev => ({
      ...prev,
      mapWaypoint: { x, y, label },
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Navigation Waypoint set to: ${label} [${Math.round(x)}, ${Math.round(y)}]`,
          time: 'Just now',
          type: 'info'
        },
        ...prev.logMessages
      ]
    }));
  };

  // Fast Travel handler
  const handleFastTravelToDistrict = (districtId: DistrictId) => {
    if (onFastTravel) {
      onFastTravel(districtId);
      onClose();
    } else {
      sound.playTempleGong();
      const coords = DISTRICTS[districtId].coordinates;
      setGameState(prev => ({
        ...prev,
        currentDistrict: districtId,
        viewMode: 'district',
        playerPos: { ...coords },
        playerVelocity: { x: 0, y: 0 },
        logMessages: [
          {
            id: Date.now().toString(),
            text: `Fast Traveled to ${DISTRICTS[districtId].name}`,
            time: 'Just now',
            type: 'story'
          },
          ...prev.logMessages
        ]
      }));
      onClose();
    }
  };

  // Current Biome detection based on player position
  const currentBiome = Object.values(BIOMES).find(b => 
    gameState.playerPos.x >= b.bounds.minX &&
    gameState.playerPos.x <= b.bounds.maxX &&
    gameState.playerPos.y >= b.bounds.minY &&
    gameState.playerPos.y <= b.bounds.maxY
  ) || BIOMES.lantern_shallows;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#050914] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-[#080e1e]/90 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-100 font-fantasy tracking-wider">
                  Skybound Archipelago World Chart
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  Real-Time Aerial Radar
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Current Zone: <strong className="text-sky-300">{currentBiome.name}</strong></span>
                <span>•</span>
                <span>Coordinates: [{Math.round(gameState.playerPos.x)}, {Math.round(gameState.playerPos.y)}]</span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setShowBiomes(!showBiomes)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                showBiomes ? 'bg-sky-500/20 border-sky-400 text-sky-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              Biomes
            </button>
            <button
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                showLandmarks ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              Landmarks
            </button>
            <button
              onClick={() => setShowWindRoutes(!showWindRoutes)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                showWindRoutes ? 'bg-teal-500/20 border-teal-400 text-teal-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              Wind Currents
            </button>
            <button
              onClick={() => setShowHazards(!showHazards)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                showHazards ? 'bg-rose-500/20 border-rose-400 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              Storm Hazards
            </button>
          </div>

          {/* Close button */}
          <button
            id="btn-close-world-map"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Viewport Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-[#02050c]"
        >
          {/* Transform Layer */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: `${WORLD_WIDTH}px`,
              height: `${WORLD_HEIGHT}px`,
            }}
            className="absolute top-0 left-0 transition-transform duration-75 ease-out select-none"
          >
            {/* SVG Background, Biomes & Currents */}
            <svg
              width={WORLD_WIDTH}
              height={WORLD_HEIGHT}
              viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
              className="absolute inset-0 pointer-events-none"
            >
              <defs>
                {/* Grid Pattern */}
                <pattern id="mapGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeOpacity="0.4" />
                </pattern>

                {/* Biome Gradients */}
                <radialGradient id="lanternGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
                </radialGradient>

                <radialGradient id="undertowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#701a75" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
                </radialGradient>

                <radialGradient id="stormGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#312e81" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.05" />
                </radialGradient>

                <radialGradient id="pilgrimGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#115e59" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
                </radialGradient>

                <radialGradient id="celestialGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#581c87" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
                </radialGradient>

                <radialGradient id="maelstromGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#be123c" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#881337" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.05" />
                </radialGradient>
              </defs>

              {/* Background Base */}
              <rect width={WORLD_WIDTH} height={WORLD_HEIGHT} fill="#030712" />
              <rect width={WORLD_WIDTH} height={WORLD_HEIGHT} fill="url(#mapGrid)" />

              {/* Biomes Colored Shading & Boundaries */}
              {showBiomes && (
                <g id="biomes-layer">
                  {/* Lantern Shallows */}
                  <ellipse cx="500" cy="500" rx="350" ry="280" fill="url(#lanternGrad)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />
                  <text x="500" y="320" textAnchor="middle" fill="#38bdf8" fontSize="20" fontWeight="bold" fontFamily="Cinzel, serif" opacity="0.6">
                    LANTERN SHALLOWS
                  </text>

                  {/* Undertow Abyss */}
                  <ellipse cx="1300" cy="850" rx="350" ry="300" fill="url(#undertowGrad)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />
                  <text x="1300" y="650" textAnchor="middle" fill="#f59e0b" fontSize="20" fontWeight="bold" fontFamily="Cinzel, serif" opacity="0.6">
                    THE UNDERTOW ABYSS
                  </text>

                  {/* Storm Anchor Rift */}
                  <ellipse cx="450" cy="1300" rx="320" ry="320" fill="url(#stormGrad)" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />
                  <text x="450" y="1120" textAnchor="middle" fill="#818cf8" fontSize="20" fontWeight="bold" fontFamily="Cinzel, serif" opacity="0.6">
                    STORM ANCHOR RIFT
                  </text>

                  {/* Pilgrim Drift Mistlands */}
                  <ellipse cx="1450" cy="350" rx="300" ry="250" fill="url(#pilgrimGrad)" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />
                  <text x="1450" y="200" textAnchor="middle" fill="#2dd4bf" fontSize="20" fontWeight="bold" fontFamily="Cinzel, serif" opacity="0.6">
                    PILGRIM DRIFT MISTLANDS
                  </text>

                  {/* Celestial High Peaks */}
                  <ellipse cx="1000" cy="220" rx="320" ry="180" fill="url(#celestialGrad)" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />
                  <text x="1000" y="120" textAnchor="middle" fill="#c084fc" fontSize="20" fontWeight="bold" fontFamily="Cinzel, serif" opacity="0.6">
                    CELESTIAL HIGH PEAKS
                  </text>

                  {/* The Great Upper Maelstrom Vortex */}
                  <ellipse cx="950" cy="1050" rx="250" ry="250" fill="url(#maelstromGrad)" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="8 4" strokeOpacity="0.7" />
                  <text x="950" y="930" textAnchor="middle" fill="#f43f5e" fontSize="22" fontWeight="bold" fontFamily="Cinzel, serif" opacity="0.8">
                    THE UPPER MAELSTROM (HAZARD)
                  </text>
                </g>
              )}

              {/* Atmospheric Wind Current Streams */}
              {showWindRoutes && (
                <g id="wind-streams" opacity="0.45">
                  {/* Eastbound Trade Current */}
                  <path d="M 200,450 Q 500,550 850,480 T 1400,380" stroke="#38bdf8" strokeWidth="4" strokeDasharray="12 8" fill="none" />
                  {/* Undertow Downdraft Shear */}
                  <path d="M 900,650 Q 1150,850 1400,750 T 1600,1050" stroke="#f59e0b" strokeWidth="4" strokeDasharray="12 8" fill="none" />
                  {/* Storm Ascent Jet */}
                  <path d="M 300,1450 Q 600,1200 950,1050" stroke="#818cf8" strokeWidth="4" strokeDasharray="12 8" fill="none" />
                  {/* High Celestial Jetstream */}
                  <path d="M 600,180 Q 950,150 1350,220" stroke="#c084fc" strokeWidth="4" strokeDasharray="12 8" fill="none" />
                </g>
              )}

              {/* Colossal Chain Links Visuals in Storm Rift */}
              <g id="chains-visual" opacity="0.35" stroke="#64748b" strokeWidth="6" fill="none">
                <ellipse cx="280" cy="1150" rx="30" ry="60" />
                <ellipse cx="320" cy="1230" rx="30" ry="60" />
                <ellipse cx="360" cy="1310" rx="30" ry="60" />
                <ellipse cx="400" cy="1390" rx="30" ry="60" />
              </g>

              {/* Active Waypoint Line */}
              {gameState.mapWaypoint && (
                <g id="waypoint-line">
                  <line
                    x1={gameState.playerPos.x}
                    y1={gameState.playerPos.y}
                    x2={gameState.mapWaypoint.x}
                    y2={gameState.mapWaypoint.y}
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    strokeOpacity="0.8"
                  />
                  {/* Destination Marker */}
                  <circle cx={gameState.mapWaypoint.x} cy={gameState.mapWaypoint.y} r="16" fill="none" stroke="#38bdf8" strokeWidth="3" className="animate-ping" />
                  <circle cx={gameState.mapWaypoint.x} cy={gameState.mapWaypoint.y} r="8" fill="#38bdf8" />
                  <text x={gameState.mapWaypoint.x} y={gameState.mapWaypoint.y - 18} fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">
                    {gameState.mapWaypoint.label}
                  </text>
                </g>
              )}

              {/* Player Real-Time Marker & Orientation Arrow */}
              <g id="player-map-marker">
                {/* Radar pulse wave */}
                <circle cx={gameState.playerPos.x} cy={gameState.playerPos.y} r="28" fill="#38bdf8" fillOpacity="0.15" className="animate-pulse" />
                <circle cx={gameState.playerPos.x} cy={gameState.playerPos.y} r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx={gameState.playerPos.x} cy={gameState.playerPos.y} r="4" fill="#ffffff" />
                
                {/* Heading indicator */}
                <path
                  d={`M ${gameState.playerPos.x + Math.cos(gameState.playerAngle) * 26} ${gameState.playerPos.y + Math.sin(gameState.playerAngle) * 26} L ${gameState.playerPos.x + Math.cos(gameState.playerAngle + 2.5) * 14} ${gameState.playerPos.y + Math.sin(gameState.playerAngle + 2.5) * 14} L ${gameState.playerPos.x} ${gameState.playerPos.y} L ${gameState.playerPos.x + Math.cos(gameState.playerAngle - 2.5) * 14} ${gameState.playerPos.y + Math.sin(gameState.playerAngle - 2.5) * 14} Z`}
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1"
                />

                {/* Player Pilot Tag */}
                <rect
                  x={gameState.playerPos.x - 60}
                  y={gameState.playerPos.y + 20}
                  width="120"
                  height="22"
                  rx="6"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x={gameState.playerPos.x}
                  y={gameState.playerPos.y + 35}
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {gameState.character.name} (Skiff)
                </text>
              </g>
            </svg>

            {/* Interactive HTML Landmark Pins */}
            {showLandmarks && (
              <div className="absolute inset-0 pointer-events-auto">
                {LANDMARKS.map(landmark => {
                  const isCurrent = gameState.currentDistrict === landmark.districtId;
                  const isCity = landmark.type === 'city_platform';

                  return (
                    <div
                      key={landmark.id}
                      style={{
                        left: `${landmark.coordinates.x}px`,
                        top: `${landmark.coordinates.y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute z-10"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playMoonChime(520);
                          setSelectedLandmark(landmark);
                        }}
                        className={`group relative p-2.5 rounded-2xl border flex items-center justify-center transition-all hover:scale-125 ${
                          isCity
                            ? 'bg-slate-900/90 border-sky-400 text-sky-300 shadow-lg shadow-sky-500/20'
                            : 'bg-slate-900/80 border-amber-400/80 text-amber-300 shadow-md shadow-amber-500/20'
                        }`}
                      >
                        <span className="text-lg">{landmark.icon}</span>

                        {/* Hover Tooltip Card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center w-48 p-2 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl pointer-events-none z-30">
                          <span className="text-xs font-bold text-slate-100">{landmark.name}</span>
                          <span className="text-[10px] text-sky-400 font-medium capitalize">{landmark.type.replace('_', ' ')}</span>
                        </div>

                        {/* Docked Status Indicator */}
                        {isCurrent && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Floating Map Navigation & Zoom Controls (Bottom Right) */}
          <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-2xl shadow-xl">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors border border-slate-700/80"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors border border-slate-700/80"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleCenterOnPlayer}
              className="w-10 h-10 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 flex items-center justify-center transition-colors border border-sky-500/40"
              title="Center on Skiff Position"
            >
              <Crosshair className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Biome & Coordinates HUD (Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-30 max-w-xs bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Atmospheric Sector
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {Math.round(zoom * 100)}% Zoom
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: currentBiome.accentColor }}
              />
              <span className="text-sm font-extrabold text-slate-100 font-fantasy">{currentBiome.name}</span>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Danger:</span>
                <span className={`font-bold ${currentBiome.dangerLevel === 'Lethal' ? 'text-rose-400' : currentBiome.dangerLevel === 'Dangerous' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {currentBiome.dangerLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Wind:</span>
                <span className="font-medium text-slate-200">{currentBiome.windCurrent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Landmark / District Inspect Popover Panel */}
        {selectedLandmark && (
          <div className="absolute top-16 right-6 z-40 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-3xl shadow-2xl p-5 animate-fadeIn">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedLandmark.icon}</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100 font-fantasy">{selectedLandmark.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 capitalize">
                    {selectedLandmark.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLandmark(null)}
                className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-lore leading-relaxed mb-3">
              {selectedLandmark.description}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1 mb-4">
              <div className="text-slate-400">Discovery Bonus / Specialty:</div>
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{selectedLandmark.discoveryBonus}</span>
              </div>
            </div>

            {/* Action Buttons: Set Waypoint / Fast Travel */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleSetWaypoint(selectedLandmark.coordinates.x, selectedLandmark.coordinates.y, selectedLandmark.name);
                  setSelectedLandmark(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-sky-500/40 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" /> Set Waypoint Beacon
              </button>

              {selectedLandmark.districtId && (
                <button
                  onClick={() => handleFastTravelToDistrict(selectedLandmark.districtId!)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Anchor className="w-3.5 h-3.5" /> Dock
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
