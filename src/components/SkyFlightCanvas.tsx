import React, { useEffect, useRef, useState } from 'react';
import { Anchor, Compass, Gauge, Navigation, Shield, Sparkles, Wind, Zap } from 'lucide-react';
import { CarmackEngine, FlightTelemetry, RadarBlip } from '../game/CarmackEngine';
import { DistrictId, GameState, LanternMode } from '../types';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onDock: (districtId: DistrictId) => void;
}

const DEFAULT_TELEMETRY: FlightTelemetry = {
  speed: 0,
  nearbyDistrict: null,
  nearbyDistance: 9999,
  inWind: false,
  inStorm: false,
  waypointDistance: null,
  lanternMode: 'beacon',
  playerX: 0,
  playerY: 0,
  playerAngle: 0,
  radarBlips: [],
};

const lanternModes: { id: LanternMode; label: string; key: string; icon: React.ReactNode }[] = [
  { id: 'signal', label: 'SIGNAL', key: '2', icon: <Sparkles size={14} /> },
  { id: 'beacon', label: 'BEACON', key: '1', icon: <Navigation size={14} /> },
  { id: 'ward', label: 'WARD', key: '3', icon: <Shield size={14} /> },
];

const formatDistance = (distance: number | null) => distance === null ? '—' : `${distance}m`;

export const SkyFlightCanvas: React.FC<Props> = ({ gameState, setGameState, onDock }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<CarmackEngine | null>(null);
  const stateRef = useRef(gameState);
  const dockRef = useRef(onDock);
  const joystickRef = useRef<HTMLDivElement | null>(null);
  const [telemetry, setTelemetry] = useState<FlightTelemetry>(DEFAULT_TELEMETRY);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 });

  stateRef.current = gameState;
  dockRef.current = onDock;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || engineRef.current) return;

    const engine = new CarmackEngine({
      canvas,
      getState: () => stateRef.current,
      updateState: setGameState,
      onDock: (districtId) => dockRef.current(districtId),
      onTelemetry: setTelemetry,
    });
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [setGameState]);

  const handleJoystick = (event: React.PointerEvent<HTMLDivElement>) => {
    const pad = joystickRef.current;
    const engine = engineRef.current;
    if (!pad || !engine) return;
    const bounds = pad.getBoundingClientRect();
    const radius = bounds.width * 0.5;
    const dx = event.clientX - (bounds.left + radius);
    const dy = event.clientY - (bounds.top + radius);
    const length = Math.hypot(dx, dy) || 1;
    const scale = Math.min(1, radius / length);
    const vector = { x: (dx * scale) / radius, y: (dy * scale) / radius };
    setJoystickVector(vector);
    engine.setJoystick(true, vector.x, vector.y);
  };

  const releaseJoystick = () => {
    setJoystickActive(false);
    setJoystickVector({ x: 0, y: 0 });
    engineRef.current?.setJoystick(false, 0, 0);
  };

  const beginJoystick = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setJoystickActive(true);
    handleJoystick(event);
  };

  const setLantern = (mode: LanternMode) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: mode === 'beacon' ? '1' : mode === 'signal' ? '2' : '3' }));
  };

  const hullPercent = Math.max(0, Math.min(100, gameState.stats.hullIntegrity / gameState.stats.maxHull * 100));
  const isDockable = Boolean(telemetry.nearbyDistrict);

  return (
    <section className="relative h-full w-full overflow-hidden bg-[#030712]" aria-label="Skyways flight deck">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      <MiniRadar telemetry={telemetry} waypoint={gameState.mapWaypoint} />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="pointer-events-auto inline-flex w-fit items-center gap-2 rounded border border-cyan-400/40 bg-[#030b18]/80 px-3 py-2 font-mono text-[10px] font-bold tracking-[0.22em] text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-sm sm:text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
              SKYWAYS // FLIGHT DECK
              <span className="ml-1 hidden border-l border-cyan-300/20 pl-2 text-[9px] text-slate-500 sm:inline">CARMACK RENDERER v0.1</span>
            </div>
            <div className="flex w-52 items-center gap-2 rounded border border-white/10 bg-[#030b18]/70 px-3 py-2 backdrop-blur-sm sm:w-64">
              <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-slate-400">HULL</span>
              <div className="h-2 flex-1 overflow-hidden rounded-sm bg-slate-900 ring-1 ring-white/10">
                <div className={`h-full transition-all ${telemetry.inStorm ? 'bg-fuchsia-400' : 'bg-cyan-400'}`} style={{ width: `${hullPercent}%` }} />
              </div>
              <span className="font-mono text-[10px] text-slate-200">{Math.round(gameState.stats.hullIntegrity)}%</span>
            </div>
          </div>

          <div className="hidden items-start gap-5 rounded border border-white/10 bg-[#030b18]/75 px-4 py-2 text-right font-mono backdrop-blur-sm sm:flex">
            <ResourceReadout label="DROPLETS" value={gameState.droplets.toLocaleString()} color="text-cyan-300" icon={<Sparkles size={13} />} />
            <ResourceReadout label="FAVORS" value={gameState.favors.toString()} color="text-amber-300" icon={<Anchor size={13} />} />
            <ResourceReadout label="STORM JARS" value={gameState.stormJars.toString()} color="text-violet-300" icon={<Zap size={13} />} />
          </div>
        </div>

        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 flex-col items-center sm:top-6">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.35em] text-slate-400">
            <span>NW</span><span className="text-slate-600">╱</span><span className="text-white">N</span><span className="text-cyan-300">◆ NE</span><span className="text-slate-600">╱</span><span>E</span><span className="text-slate-600">╱</span><span>SE</span>
          </div>
          <div className="mt-2 h-px w-52 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent sm:w-80" />
          {telemetry.waypointDistance !== null && (
            <div className="mt-3 rounded border border-cyan-300/30 bg-[#03121c]/80 px-3 py-1 text-center font-mono text-[10px] tracking-[0.16em] text-cyan-200 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-cyan-400"><Navigation size={11} /> WAYPOINT LOCK</div>
              <div className="mt-0.5 font-bold">{formatDistance(telemetry.waypointDistance)}</div>
            </div>
          )}
        </div>

        <div className="pointer-events-auto flex items-end justify-between gap-3 pb-1 sm:pb-2">
          <div className="flex items-end gap-3">
            <div className="relative hidden h-28 w-28 items-center justify-center rounded-full border border-cyan-300/40 bg-[#030b18]/75 font-mono backdrop-blur-sm sm:flex">
              <div className="absolute inset-2 rounded-full border border-cyan-300/15" />
              <div className="absolute inset-4 rounded-full border border-dashed border-cyan-300/20" />
              <div className="absolute left-1/2 top-2 h-2 w-px bg-cyan-200/80" />
              <div className="text-center"><div className="text-2xl font-black tracking-tight text-slate-100">{telemetry.speed}</div><div className="text-[9px] font-bold tracking-[0.24em] text-cyan-300">KTS</div></div>
              <Gauge className="absolute bottom-3 right-3 text-cyan-300/75" size={14} />
            </div>
            <div className="hidden flex-col gap-1.5 font-mono text-[10px] tracking-[0.16em] sm:flex">
              <StatusChip icon={<Wind size={13} />} label={telemetry.inWind ? 'WIND CURRENT // RIDING' : 'WIND CURRENT // CLEAR'} active={telemetry.inWind} />
              <StatusChip icon={<Zap size={13} />} label={telemetry.inStorm ? 'STORM FRONT // ACTIVE' : 'STORM FRONT // CLEAR'} active={telemetry.inStorm} danger={telemetry.inStorm} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded border border-white/15 bg-[#030b18]/85 p-1 shadow-[0_0_28px_rgba(12,180,220,0.1)] backdrop-blur-sm">
              <div className="px-3 py-1 text-center font-mono text-[9px] font-bold tracking-[0.28em] text-slate-400">LANTERN MODE</div>
              <div className="flex gap-1">
                {lanternModes.map((mode) => (
                  <button key={mode.id} onClick={() => setLantern(mode.id)} className={`flex min-w-[62px] flex-col items-center gap-1 border px-2 py-2 font-mono text-[9px] font-bold tracking-[0.12em] transition sm:min-w-[78px] ${telemetry.lanternMode === mode.id ? 'border-cyan-300 bg-cyan-300/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.2)]' : 'border-transparent text-slate-600 hover:border-white/15 hover:text-slate-300'}`}>
                    {mode.icon}<span>{mode.label}</span><span className="text-[8px] text-slate-500">[{mode.key}]</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded border border-white/10 bg-[#030b18]/80 px-3 py-2 font-mono text-[9px] tracking-[0.14em] text-slate-400 backdrop-blur-sm sm:flex">
              <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-slate-200">WASD</kbd> / <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-slate-200">ARROWS</kbd> MOVE
              <kbd className="ml-1 rounded border border-white/20 px-1.5 py-0.5 text-slate-200">SPACE</kbd> BOOST
              <kbd className="ml-1 rounded border border-white/20 px-1.5 py-0.5 text-slate-200">F</kbd> DOCK
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div ref={joystickRef} onPointerDown={beginJoystick} onPointerMove={(event) => joystickActive && handleJoystick(event)} onPointerUp={releaseJoystick} onPointerCancel={releaseJoystick} className="pointer-events-auto relative flex h-24 w-24 touch-none items-center justify-center rounded-full border border-cyan-300/35 bg-[#030b18]/65 backdrop-blur-sm sm:hidden">
              <div className="absolute inset-3 rounded-full border border-cyan-300/15" />
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/50 bg-cyan-300/15 shadow-[0_0_18px_rgba(34,211,238,0.2)]" style={{ transform: `translate(${joystickVector.x * 15}px, ${joystickVector.y * 15}px)` }}>
                <Compass size={16} className="text-cyan-200" />
              </div>
            </div>
            {isDockable && (
              <button onClick={() => telemetry.nearbyDistrict && dockRef.current(telemetry.nearbyDistrict)} className="flex items-center gap-2 rounded border border-amber-300 bg-amber-300/15 px-3 py-3 font-mono text-[10px] font-bold tracking-[0.18em] text-amber-100 shadow-[0_0_22px_rgba(245,158,11,0.22)] transition hover:bg-amber-300/25 sm:px-4">
                <Anchor size={15} /> <span className="hidden sm:inline">{telemetry.nearbyDistance}m // </span> DOCK
              </button>
            )}
          </div>
        </div>
      </div>

      {telemetry.inStorm && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-fuchsia-300/45 bg-fuchsia-950/35 px-4 py-2 text-center font-mono text-[10px] tracking-[0.2em] text-fuchsia-100 shadow-[0_0_34px_rgba(217,70,239,0.2)] backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2"><Zap size={13} /> STORM SHEAR DETECTED</div>
          <div className="mt-1 text-[9px] tracking-[0.12em] text-fuchsia-200/70">{telemetry.lanternMode === 'ward' || gameState.activeRig === 'storm_run' ? 'WARD FIELD HOLDING' : 'HULL INTEGRITY AT RISK'}</div>
        </div>
      )}
    </section>
  );
};

const MiniRadar = ({ telemetry, waypoint }: { telemetry: FlightTelemetry; waypoint: GameState['mapWaypoint'] }) => {
  const toPercentX = (value: number) => Math.max(3, Math.min(97, value / 1800 * 100));
  const toPercentY = (value: number) => Math.max(4, Math.min(96, value / 1600 * 100));
  const blips = telemetry.radarBlips.filter((blip) => blip.x >= 0 && blip.y >= 0);
  const visibleBlips = blips.filter((blip) => blip.type !== 'landmark' || Math.hypot(blip.x - telemetry.playerX, blip.y - telemetry.playerY) < 850);

  return (
    <div className="pointer-events-none absolute right-4 top-24 z-10 hidden w-40 rounded border border-cyan-300/30 bg-[#030b18]/80 p-2 font-mono shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-sm sm:block sm:right-6 sm:top-28">
      <div className="mb-1.5 flex items-center justify-between text-[9px] font-bold tracking-[0.18em] text-cyan-200"><span>RADAR // SKYWAYS</span><span className="text-cyan-400/70">LIVE</span></div>
      <div className="relative h-28 overflow-hidden rounded border border-cyan-300/20 bg-[#061728]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(56,189,248,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.16) 1px, transparent 1px)', backgroundSize: '20% 20%' }} />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />
        <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />
        {visibleBlips.map((blip: RadarBlip) => (
          <span key={blip.id} title={blip.id} className={`absolute block -translate-x-1/2 -translate-y-1/2 ${blip.type === 'storm' ? 'h-2.5 w-2.5 rounded-full border border-violet-200 bg-violet-400/70 shadow-[0_0_10px_#8b5cf6]' : blip.type === 'district' ? 'h-2 w-2 rotate-45 border border-amber-100 bg-amber-300 shadow-[0_0_9px_#f59e0b]' : blip.type === 'collectible' ? 'h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]' : 'h-1 w-1 rounded-full bg-fuchsia-300'}`} style={{ left: `${toPercentX(blip.x)}%`, top: `${toPercentY(blip.y)}%`, backgroundColor: blip.type === 'storm' || blip.type === 'district' || blip.type === 'collectible' ? undefined : blip.accent }} />
        ))}
        {waypoint && <span className="absolute block h-2 w-2 animate-pulse rounded-full border border-white bg-cyan-300 shadow-[0_0_10px_#fff]" style={{ left: `${toPercentX(waypoint.x)}%`, top: `${toPercentY(waypoint.y)}%` }} />}
        <span className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-cyan-100 drop-shadow-[0_0_6px_#22d3ee]" style={{ left: `${toPercentX(telemetry.playerX)}%`, top: `${toPercentY(telemetry.playerY)}%`, transform: `translate(-50%, -50%) rotate(${telemetry.playerAngle * 180 / Math.PI + 90}deg)` }}><Navigation size={14} fill="currentColor" /></span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[8px] tracking-[0.12em] text-slate-500"><span><i className="mr-1 inline-block h-1.5 w-1.5 rotate-45 bg-amber-300" />DOCKS</span><span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />STORMS</span><span>{Math.round(telemetry.playerX)},{Math.round(telemetry.playerY)}</span></div>
    </div>
  );
};

const ResourceReadout = ({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) => (
  <div className="min-w-[64px]">
    <div className="flex items-center justify-end gap-1 text-[9px] tracking-[0.16em] text-slate-500">{icon}{label}</div>
    <div className={`mt-0.5 text-sm font-bold ${color}`}>{value}</div>
  </div>
);

const StatusChip = ({ icon, label, active, danger = false }: { icon: React.ReactNode; label: string; active: boolean; danger?: boolean }) => (
  <div className={`flex items-center gap-2 rounded border px-2 py-1.5 ${danger && active ? 'border-fuchsia-300/40 bg-fuchsia-400/10 text-fuchsia-200' : active ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200' : 'border-white/10 bg-[#030b18]/65 text-slate-500'}`}>
    {icon}<span>{label}</span>
  </div>
);
