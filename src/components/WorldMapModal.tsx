import React, { useState } from 'react';
import { GameState, LandmarkInfo } from '../types';
import { LANDMARKS, BIOMES } from '../data/gameData';
import { X, Map, Navigation, Compass } from 'lucide-react';

interface WorldMapModalProps {
  gameState: GameState;
  onSetWaypoint: (x: number, y: number, label: string) => void;
  onClearWaypoint: () => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  gameState,
  onSetWaypoint,
  onClearWaypoint,
  onClose
}) => {
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkInfo>(LANDMARKS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-sky-950 border border-sky-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-moon-cyan flex items-center gap-2">
              <Map size={20} />
              SKYBOUND ARCHIPELAGO CHART
            </h3>
            <p className="text-xs text-slate-400 font-mono">Interactive Starlight Cartography (1800 x 1600)</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Map Visualization */}
        <div className="relative w-full h-56 bg-sky-950 rounded-xl border border-sky-800/60 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1800 1600">
            {/* Biomes */}
            {Object.values(BIOMES).map(b => (
              <rect
                key={b.id}
                x={b.minX}
                y={b.minY}
                width={b.maxX - b.minX}
                height={b.maxY - b.minY}
                fill={b.color}
                opacity={0.4}
                stroke={b.accentColor}
                strokeWidth={4}
              />
            ))}

            {/* Landmarks */}
            {LANDMARKS.map(lm => (
              <g
                key={lm.id}
                className="cursor-pointer"
                onClick={() => setSelectedLandmark(lm)}
              >
                <circle
                  cx={lm.x}
                  cy={lm.y}
                  r={selectedLandmark.id === lm.id ? 28 : 18}
                  fill={selectedLandmark.id === lm.id ? '#f59e0b' : '#38bdf8'}
                  className="transition-all"
                />
                <text
                  x={lm.x}
                  y={lm.y + 45}
                  fill="#f8fafc"
                  fontSize={26}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {lm.name}
                </text>
              </g>
            ))}

            {/* Player Marker */}
            <circle
              cx={gameState.playerX}
              cy={gameState.playerY}
              r={24}
              fill="#67e8f9"
              stroke="#ffffff"
              strokeWidth={5}
            />

            {/* Waypoint Marker */}
            {gameState.mapWaypoint && (
              <>
                <circle
                  cx={gameState.mapWaypoint.x}
                  cy={gameState.mapWaypoint.y}
                  r={22}
                  fill="#f43f5e"
                />
                <line
                  x1={gameState.playerX}
                  y1={gameState.playerY}
                  x2={gameState.mapWaypoint.x}
                  y2={gameState.mapWaypoint.y}
                  stroke="#f43f5e"
                  strokeWidth={6}
                  strokeDasharray="16,12"
                />
              </>
            )}
          </svg>
        </div>

        {/* Landmarks Horizontal Selector */}
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {LANDMARKS.map(lm => (
            <button
              key={lm.id}
              onClick={() => setSelectedLandmark(lm)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${selectedLandmark.id === lm.id ? 'bg-moon-cyan text-sky-950' : 'bg-sky-900/40 text-slate-300 hover:bg-sky-800'}`}
            >
              <span>{lm.icon}</span>
              <span>{lm.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Landmark Details */}
        {selectedLandmark && (
          <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{selectedLandmark.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{selectedLandmark.name}</h4>
                  <p className="text-xs text-moon-cyan font-mono">
                    Coord: ({Math.round(selectedLandmark.x)}, {Math.round(selectedLandmark.y)}) // {selectedLandmark.type.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              {gameState.mapWaypoint?.label === selectedLandmark.name ? (
                <button
                  onClick={onClearWaypoint}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs transition-colors flex items-center space-x-1"
                >
                  <Navigation size={13} />
                  <span>CLEAR WP</span>
                </button>
              ) : (
                <button
                  onClick={() => onSetWaypoint(selectedLandmark.x, selectedLandmark.y, selectedLandmark.name)}
                  className="px-3 py-1.5 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs transition-colors flex items-center space-x-1"
                >
                  <Navigation size={13} />
                  <span>SET WAYPOINT</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300">{selectedLandmark.description}</p>
            <div className="pt-2 border-t border-sky-800/40 text-xs">
              <span className="text-lantern-amber font-mono font-bold">Discovery / Attraction Bonus: </span>
              <span className="text-emerald-300 font-mono">{selectedLandmark.discoveryBonus}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
