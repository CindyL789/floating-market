import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, DistrictId, LanternMode } from '../types';
import { DISTRICTS, GEAR_RIGS } from '../data/gameData';
import { sound } from '../utils/audio';
import { Compass, Zap, Anchor, Wind, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onDock: (districtId: DistrictId) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  maxLife: number;
  life: number;
}

interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'droplet' | 'salvage' | 'storm_charge';
  value: number;
  pulsePhase: number;
}

interface WindCurrent {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  speed: number;
  width: number;
}

interface LightningZone {
  x: number;
  y: number;
  radius: number;
  active: boolean;
  strikeTimer: number;
  arcs: { x1: number; y1: number; x2: number; y2: number }[];
}

export const SkyFlightCanvas: React.FC<Props> = ({ gameState, setGameState, onDock }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Flight simulation state
  const posRef = useRef(gameState.playerPos);
  const velRef = useRef(gameState.playerVelocity);
  const angleRef = useRef(gameState.playerAngle);
  const lanternModeRef = useRef(gameState.lanternMode);
  const activeRigRef = useRef(gameState.activeRig);

  // Key states
  const keysRef = useRef<Record<string, boolean>>({});
  
  // Touch / Virtual joystick
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 });
  const [nearbyDistrict, setNearbyDistrict] = useState<DistrictId | null>(null);
  const [nearbyDistance, setNearbyDistance] = useState<number>(9999);

  // World Elements
  const collectiblesRef = useRef<Collectible[]>([
    { id: 'd1', x: 600, y: 450, type: 'droplet', value: 10, pulsePhase: 0 },
    { id: 'd2', x: 750, y: 380, type: 'droplet', value: 15, pulsePhase: 1 },
    { id: 'd3', x: 1100, y: 600, type: 'droplet', value: 20, pulsePhase: 2 },
    { id: 'd4', x: 480, y: 900, type: 'droplet', value: 15, pulsePhase: 3 },
    { id: 'd5', x: 800, y: 1100, type: 'droplet', value: 25, pulsePhase: 4 },
    { id: 'd6', x: 1300, y: 500, type: 'droplet', value: 20, pulsePhase: 5 },
    { id: 's1', x: 900, y: 800, type: 'salvage', value: 40, pulsePhase: 0 },
    { id: 's2', x: 1350, y: 900, type: 'salvage', value: 50, pulsePhase: 2 },
    { id: 'z1', x: 350, y: 1150, type: 'storm_charge', value: 30, pulsePhase: 1 },
    { id: 'z2', x: 850, y: 300, type: 'storm_charge', value: 30, pulsePhase: 3 },
  ]);

  const windCurrentsRef = useRef<WindCurrent[]>([
    { x1: 450, y1: 520, x2: 1200, y2: 700, speed: 2.2, width: 90 },
    { x1: 1250, y1: 700, x2: 1350, y2: 400, speed: 1.8, width: 80 },
    { x1: 1350, y1: 300, x2: 950, y2: 220, speed: 2.0, width: 80 },
    { x1: 900, y1: 250, x2: 450, y2: 500, speed: 2.5, width: 100 },
    { x1: 500, y1: 600, x2: 420, y2: 1280, speed: 2.0, width: 90 },
  ]);

  const stormZonesRef = useRef<LightningZone[]>([
    { x: 380, y: 1250, radius: 180, active: true, strikeTimer: 0, arcs: [] },
    { x: 920, y: 950, radius: 150, active: true, strikeTimer: 0, arcs: [] },
    { x: 750, y: 150, radius: 140, active: true, strikeTimer: 0, arcs: [] },
  ]);

  // Visual particles
  const particlesRef = useRef<Particle[]>([]);
  const koiSegmentsRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 9 }, (_, i) => ({ x: 500 - i * 12, y: 500 }))
  );

  // Sync refs when props update
  const unlockedSkillsRef = useRef<string[]>(gameState.unlockedSkills || []);
  useEffect(() => {
    lanternModeRef.current = gameState.lanternMode;
    activeRigRef.current = gameState.activeRig;
    unlockedSkillsRef.current = gameState.unlockedSkills || [];
  }, [gameState.lanternMode, gameState.activeRig, gameState.unlockedSkills]);

  // Controls listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;

      // Quick lantern switch
      if (e.key === '1') handleSetLantern('beacon');
      if (e.key === '2') handleSetLantern('signal');
      if (e.key === '3') handleSetLantern('ward');

      // Docking trigger
      if ((e.key === 'f' || e.key === 'F' || e.key === 'e' || e.key === 'E') && nearbyDistrict) {
        onDock(nearbyDistrict);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyDistrict, onDock]);

  const handleSetLantern = (mode: LanternMode) => {
    sound.playLanternIgnite(mode);
    setGameState(prev => ({ ...prev, lanternMode: mode }));
  };

  // Main animation / simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Audio ambience start
    sound.startAtmosphericAmbience();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // 1. INPUT & FLIGHT DYNAMICS
      const keys = keysRef.current;
      const rig = GEAR_RIGS[activeRigRef.current];
      const accelBase = rig?.id === 'standard_courier' ? 140 : 110;
      const turnSpeed = 2.8;

      let turning = 0;
      if (keys['arrowleft'] || keys['a'] || keys['keya']) turning -= 1;
      if (keys['arrowright'] || keys['d'] || keys['keyd']) turning += 1;

      let thrust = 0;
      if (keys['arrowup'] || keys['w'] || keys['keyw']) thrust += 1;
      if (keys['arrowdown'] || keys['s'] || keys['keys']) thrust -= 0.5;
      if (keys[' ']) thrust += 1.6; // Boost sail

      // Virtual Joystick support
      if (joystickActive) {
        turning += joystickVector.x * 1.5;
        thrust += -joystickVector.y * 1.5;
      }

      // Update angle & velocity
      angleRef.current += turning * turnSpeed * dt;

      const ax = Math.cos(angleRef.current) * thrust * accelBase;
      const ay = Math.sin(angleRef.current) * thrust * accelBase;

      velRef.current.x += ax * dt;
      velRef.current.y += ay * dt;

      // Wind current influence
      const px = posRef.current.x;
      const py = posRef.current.y;
      let inWindCurrent = false;

      windCurrentsRef.current.forEach(wc => {
        // Line distance check
        const dx = wc.x2 - wc.x1;
        const dy = wc.y2 - wc.y1;
        const len = Math.hypot(dx, dy);
        const u = ((px - wc.x1) * dx + (py - wc.y1) * dy) / (len * len);
        if (u >= 0 && u <= 1) {
          const nx = wc.x1 + u * dx;
          const ny = wc.y1 + u * dy;
          const dist = Math.hypot(px - nx, py - ny);
          if (dist < wc.width) {
            inWindCurrent = true;
            // Push along current vector
            const ndx = dx / len;
            const ndy = dy / len;
            velRef.current.x += ndx * wc.speed * 85 * dt;
            velRef.current.y += ndy * wc.speed * 85 * dt;

            // Spawn stream bubble particles
            if (Math.random() < 0.3) {
              particlesRef.current.push({
                x: px + (Math.random() - 0.5) * 30,
                y: py + (Math.random() - 0.5) * 30,
                vx: ndx * 60 + (Math.random() - 0.5) * 20,
                vy: ndy * 60 + (Math.random() - 0.5) * 20,
                size: 2 + Math.random() * 3,
                alpha: 0.8,
                color: '#38bdf8',
                maxLife: 0.8,
                life: 0.8
              });
            }
          }
        }
      });

      // Air resistance / friction
      const friction = rig?.id === 'dawn_dock' ? 0.985 : 0.975;
      velRef.current.x *= Math.pow(friction, dt * 60);
      velRef.current.y *= Math.pow(friction, dt * 60);

      // Passive bonus checks
      const hasAeroSails = unlockedSkillsRef.current.includes('sail_aerodynamics');
      const hasMoteMagnet = unlockedSkillsRef.current.includes('koi_harmonic_bond');
      const hasDropletBonus = unlockedSkillsRef.current.includes('koi_pearl_gleaner');
      const hasDoubleSalvage = unlockedSkillsRef.current.includes('salvage_keen_eye');
      const hasStormPlating = unlockedSkillsRef.current.includes('storm_plating_1');

      // Max velocity cap (boosted by aero spinnakers)
      const currentSpeed = Math.hypot(velRef.current.x, velRef.current.y);
      const baseMaxSpeed = inWindCurrent ? 320 : (keys[' '] ? 260 : 190);
      const maxSpeed = baseMaxSpeed * (hasAeroSails ? 1.25 : 1.0);
      if (currentSpeed > maxSpeed) {
        velRef.current.x = (velRef.current.x / currentSpeed) * maxSpeed;
        velRef.current.y = (velRef.current.y / currentSpeed) * maxSpeed;
      }

      // Update position
      posRef.current.x += velRef.current.x * dt;
      posRef.current.y += velRef.current.y * dt;

      // Keep in world bounds (0, 0) to (1800, 1600)
      posRef.current.x = Math.max(50, Math.min(1750, posRef.current.x));
      posRef.current.y = Math.max(50, Math.min(1550, posRef.current.y));

      // 2. NAMI (MOON-KOI) PROCEDURAL IK SWIMMING
      const koiTargetDist = 45;
      const koiTargetAngle = angleRef.current + Math.PI * 0.75 + Math.sin(currentTime * 0.003) * 0.4;
      const koiTargetX = posRef.current.x + Math.cos(koiTargetAngle) * koiTargetDist;
      const koiTargetY = posRef.current.y + Math.sin(koiTargetAngle) * koiTargetDist;

      // Head leads
      const head = koiSegmentsRef.current[0];
      head.x += (koiTargetX - head.x) * 6 * dt;
      head.y += (koiTargetY - head.y) * 6 * dt;

      // Trailing spine segments
      for (let i = 1; i < koiSegmentsRef.current.length; i++) {
        const prev = koiSegmentsRef.current[i - 1];
        const curr = koiSegmentsRef.current[i];
        const segDist = 8;
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const targetX = prev.x + (dx / dist) * segDist;
        const targetY = prev.y + (dy / dist) * segDist;

        // Wave undulation
        const wave = Math.sin(currentTime * 0.008 - i * 0.6) * (i * 0.8);
        const perpX = -dy / dist;
        const perpY = dx / dist;

        curr.x += (targetX + perpX * wave - curr.x) * 14 * dt;
        curr.y += (targetY + perpY * wave - curr.y) * 14 * dt;
      }

      // Spawn koi luminescence trail
      if (Math.random() < 0.5) {
        const tail = koiSegmentsRef.current[koiSegmentsRef.current.length - 1];
        particlesRef.current.push({
          x: tail.x + (Math.random() - 0.5) * 6,
          y: tail.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          size: 2 + Math.random() * 3,
          alpha: 0.9,
          color: '#38bdf8',
          maxLife: 1.2,
          life: 1.2
        });
      }

      // Skiff wake trail
      if (currentSpeed > 30 && Math.random() < 0.4) {
        const sternX = posRef.current.x - Math.cos(angleRef.current) * 18;
        const sternY = posRef.current.y - Math.sin(angleRef.current) * 18;
        particlesRef.current.push({
          x: sternX,
          y: sternY,
          vx: -velRef.current.x * 0.2 + (Math.random() - 0.5) * 10,
          vy: -velRef.current.y * 0.2 + (Math.random() - 0.5) * 10,
          size: 3 + Math.random() * 4,
          alpha: 0.6,
          color: '#94a3b8',
          maxLife: 0.7,
          life: 0.7
        });
      }

      // 3. COLLECTIBLES INTERACTION (with magnetic mote attraction if unlocked)
      const baseReach = lanternModeRef.current === 'beacon' ? 70 : 45;
      const reachDist = baseReach * (hasMoteMagnet ? 1.75 : 1.0);

      collectiblesRef.current.forEach((col) => {
        const cdx = col.x - posRef.current.x;
        const cdy = col.y - posRef.current.y;
        const dist = Math.hypot(cdx, cdy);

        // Magnetic attraction toward player
        if (hasMoteMagnet && dist < 180 && dist > 10) {
          const pull = (180 - dist) * 1.8 * dt;
          col.x -= (cdx / dist) * pull;
          col.y -= (cdy / dist) * pull;
        }

        if (dist < reachDist) {
          // Collect!
          if (col.type === 'droplet') {
            sound.playCollectDroplet();
            const earnedDroplets = Math.round(col.value * (hasDropletBonus ? 1.5 : 1.0));
            setGameState(prev => ({
              ...prev,
              droplets: prev.droplets + earnedDroplets,
              stats: {
                ...prev.stats,
                koiAffinity: Math.min(100, prev.stats.koiAffinity + 2)
              }
            }));
          } else if (col.type === 'salvage') {
            sound.playBrassClink();
            const earnedFavors = hasDoubleSalvage ? 2 : 1;
            const earnedDroplets = Math.round(col.value * (hasDropletBonus ? 1.5 : 1.0));
            setGameState(prev => ({
              ...prev,
              favors: prev.favors + earnedFavors,
              droplets: prev.droplets + earnedDroplets,
              logMessages: [
                {
                  id: Date.now().toString(),
                  text: `Recovered adrift message capsule (+${earnedDroplets} Droplets, +${earnedFavors} Favor${earnedFavors > 1 ? 's' : ''})`,
                  time: 'Just now',
                  type: 'reward'
                },
                ...prev.logMessages
              ]
            }));
          } else if (col.type === 'storm_charge') {
            sound.playLanternIgnite('ward');
            setGameState(prev => ({
              ...prev,
              stormJars: prev.stormJars + 1,
              logMessages: [
                {
                  id: Date.now().toString(),
                  text: 'Harvested condensed Storm Jar from cloud well!',
                  time: 'Just now',
                  type: 'reward'
                },
                ...prev.logMessages
              ]
            }));
          }

          // Spawn burst particles
          for (let p = 0; p < 12; p++) {
            const pAngle = Math.random() * Math.PI * 2;
            const pSpeed = 30 + Math.random() * 60;
            particlesRef.current.push({
              x: col.x,
              y: col.y,
              vx: Math.cos(pAngle) * pSpeed,
              vy: Math.sin(pAngle) * pSpeed,
              size: 3 + Math.random() * 4,
              alpha: 1,
              color: col.type === 'droplet' ? '#38bdf8' : col.type === 'salvage' ? '#fbbf24' : '#c084fc',
              maxLife: 0.8,
              life: 0.8
            });
          }

          // Respawn elsewhere
          col.x = 200 + Math.random() * 1400;
          col.y = 200 + Math.random() * 1200;
        }
      });

      // 4. STORM HAZARDS & LIGHTNING
      stormZonesRef.current.forEach(sz => {
        sz.strikeTimer += dt;
        if (sz.strikeTimer > 2.5 + Math.random() * 2) {
          sz.strikeTimer = 0;
          // Generate jagged arcs
          sz.arcs = [];
          let curX = sz.x + (Math.random() - 0.5) * 80;
          let curY = sz.y - sz.radius * 0.8;
          for (let a = 0; a < 6; a++) {
            const nextX = curX + (Math.random() - 0.5) * 50;
            const nextY = curY + (sz.radius * 1.6) / 6;
            sz.arcs.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });
            curX = nextX;
            curY = nextY;
          }

          // Check if player near lightning
          const distToStorm = Math.hypot(posRef.current.x - sz.x, posRef.current.y - sz.y);
          if (distToStorm < sz.radius) {
            sound.playThunderRumble();
            if (activeRigRef.current !== 'storm_run' && lanternModeRef.current !== 'ward') {
              // Take hull damage (reduced by 50% if conductive storm plating unlocked)
              const dmg = hasStormPlating ? 4 : 8;
              setGameState(prev => {
                const newHull = Math.max(10, prev.stats.hullIntegrity - dmg);
                return {
                  ...prev,
                  stats: { ...prev.stats, hullIntegrity: newHull }
                };
              });
            }
          }
        }
      });

      // 5. DISTRICT DOCKING PROXIMITY CHECK
      let closestDist: DistrictId | null = null;
      let minD = 99999;

      (Object.keys(DISTRICTS) as DistrictId[]).forEach(dId => {
        const d = DISTRICTS[dId];
        const dist = Math.hypot(posRef.current.x - d.coordinates.x, posRef.current.y - d.coordinates.y);
        if (dist < minD) {
          minD = dist;
          if (dist < 110) {
            closestDist = dId;
          }
        }
      });

      setNearbyDistrict(closestDist);
      setNearbyDistance(Math.round(minD));

      // 6. RENDER SCENE WITH CAMERA CENTERING
      const camX = canvas.width / 2 - posRef.current.x;
      const camY = canvas.height / 2 - posRef.current.y;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep sky gradient background
      const skyGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      skyGrad.addColorStop(0, '#040711');
      skyGrad.addColorStop(0.5, '#071021');
      skyGrad.addColorStop(1, '#02050d');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Camera transform
      ctx.translate(camX, camY);

      // Draw Grid / Cloud Sea Parallax Layers
      ctx.strokeStyle = 'rgba(30, 58, 102, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 120;
      for (let x = 0; x <= 1800; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1600);
        ctx.stroke();
      }
      for (let y = 0; y <= 1600; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1800, y);
        ctx.stroke();
      }

      // Draw Cloud Sea Billows (Atmospheric Depth)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      for (let i = 0; i < 16; i++) {
        const cx = (i * 230 + currentTime * 0.01) % 1900;
        const cy = (i * 180 + Math.sin(i + currentTime * 0.001) * 60) % 1700;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Wind Currents (Slipstream ribbons)
      windCurrentsRef.current.forEach(wc => {
        const streamGrad = ctx.createLinearGradient(wc.x1, wc.y1, wc.x2, wc.y2);
        streamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
        streamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.22)');
        streamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');

        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = wc.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(wc.x1, wc.y1);
        ctx.lineTo(wc.x2, wc.y2);
        ctx.stroke();

        // Flowing current arrows
        const dx = wc.x2 - wc.x1;
        const dy = wc.y2 - wc.y1;
        const len = Math.hypot(dx, dy);
        const numArrows = Math.floor(len / 80);
        for (let a = 0; a < numArrows; a++) {
          const prog = ((a / numArrows) + (currentTime * 0.0003 * wc.speed)) % 1;
          const ax = wc.x1 + dx * prog;
          const ay = wc.y1 + dy * prog;
          const aAngle = Math.atan2(dy, dx);

          ctx.fillStyle = 'rgba(125, 211, 252, 0.6)';
          ctx.beginPath();
          ctx.arc(ax, ay, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Storm Vortexes & Lightning
      stormZonesRef.current.forEach(sz => {
        const stormGrad = ctx.createRadialGradient(sz.x, sz.y, 10, sz.x, sz.y, sz.radius);
        stormGrad.addColorStop(0, 'rgba(88, 28, 135, 0.45)');
        stormGrad.addColorStop(0.7, 'rgba(30, 27, 75, 0.25)');
        stormGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.fillStyle = stormGrad;
        ctx.beginPath();
        ctx.arc(sz.x, sz.y, sz.radius, 0, Math.PI * 2);
        ctx.fill();

        // Storm boundary ring
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(sz.x, sz.y, sz.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active lightning arcs
        if (sz.arcs.length > 0) {
          ctx.strokeStyle = '#e9d5ff';
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 15;
          ctx.lineWidth = 3;
          ctx.beginPath();
          sz.arcs.forEach((arc, i) => {
            if (i === 0) ctx.moveTo(arc.x1, arc.y1);
            ctx.lineTo(arc.x2, arc.y2);
          });
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // Draw District Platforms & Floating Barges
      (Object.keys(DISTRICTS) as DistrictId[]).forEach(dId => {
        const d = DISTRICTS[dId];
        const isSelected = nearbyDistrict === dId;

        // Monumental Anchor Chains (especially for Storm Anchor Shrine)
        if (dId === 'storm_anchor_shrine') {
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.moveTo(d.coordinates.x, d.coordinates.y);
          ctx.lineTo(d.coordinates.x - 120, d.coordinates.y + 350);
          ctx.stroke();
          
          ctx.lineWidth = 8;
          ctx.strokeStyle = '#0f172a';
          ctx.beginPath();
          ctx.moveTo(d.coordinates.x, d.coordinates.y);
          ctx.lineTo(d.coordinates.x + 160, d.coordinates.y + 380);
          ctx.stroke();
        }

        // Platform Base Shadow & Hull
        ctx.save();
        ctx.translate(d.coordinates.x, d.coordinates.y);

        // Platform Aura / Glow
        const platGlow = ctx.createRadialGradient(0, 0, 20, 0, 0, 110);
        platGlow.addColorStop(0, d.accentColor + '33');
        platGlow.addColorStop(1, d.accentColor + '00');
        ctx.fillStyle = platGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI * 2);
        ctx.fill();

        // Docking Perimeter Circle
        ctx.strokeStyle = isSelected ? '#fbbf24' : d.accentColor + '55';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        if (isSelected) {
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 12;
        }
        ctx.setLineDash(isSelected ? [10, 6] : [6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 85, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;

        // Black-Lacquer Barge Hull Shape
        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 52, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Architectural details (Temple roof / Lantern posts)
        ctx.fillStyle = d.accentColor;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Hanging Amber & Blue Lanterns
        const lanternAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
        lanternAngles.forEach((la, idx) => {
          const lx = Math.cos(la) * 36;
          const ly = Math.sin(la) * 22;
          ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#f59e0b';
          ctx.shadowColor = idx % 2 === 0 ? '#38bdf8' : '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(lx, ly, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // District Name Banner
        ctx.font = 'bold 13px Cinzel, serif';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(d.name, 0, -48);

        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = isSelected ? '#fbbf24' : '#94a3b8';
        ctx.fillText(isSelected ? '⚓ PRESS [F] OR TAP TO DOCK' : d.epithet, 0, 50);

        ctx.restore();
      });

      // Draw Collectibles
      collectiblesRef.current.forEach(col => {
        const pulse = 1 + Math.sin(currentTime * 0.005 + col.pulsePhase) * 0.2;
        ctx.save();
        ctx.translate(col.x, col.y);

        if (col.type === 'droplet') {
          // Luminescent Moon Droplet
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14 * pulse;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(0, 0, 6 * pulse, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-1, -1, 2 * pulse, 0, Math.PI * 2);
          ctx.fill();
        } else if (col.type === 'salvage') {
          // Brass Message Capsule / Lost Crate
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 12 * pulse;
          ctx.fillStyle = '#d97706';
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(-7 * pulse, -7 * pulse, 14 * pulse, 14 * pulse);
          ctx.fill();
          ctx.stroke();
        } else if (col.type === 'storm_charge') {
          // Storm Jar
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 15 * pulse;
          ctx.fillStyle = '#9333ea';
          ctx.beginPath();
          ctx.arc(0, 0, 8 * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#e9d5ff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      });

      // Draw Active Particles
      particlesRef.current.forEach((p, idx) => {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) {
          particlesRef.current.splice(idx, 1);
          return;
        }
        const alpha = (p.life / p.maxLife) * p.alpha;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 6. DRAW WAYPOINT BEACON (IF SET FROM WORLD MAP)
      if (gameState.mapWaypoint) {
        ctx.save();
        // Dashed glowing line from skiff to waypoint
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(posRef.current.x, posRef.current.y);
        ctx.lineTo(gameState.mapWaypoint.x, gameState.mapWaypoint.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Destination Pulsing Beacon
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        const wave = 14 + Math.sin(currentTime * 0.006) * 6;
        ctx.beginPath();
        ctx.arc(gameState.mapWaypoint.x, gameState.mapWaypoint.y, wave, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(gameState.mapWaypoint.x, gameState.mapWaypoint.y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.fillText(gameState.mapWaypoint.label, gameState.mapWaypoint.x, gameState.mapWaypoint.y - 18);
        ctx.restore();
      }

      // 7. DRAW NAMI (MOON-KOI)
      ctx.save();
      const koiAlpha = 0.88;
      ctx.globalAlpha = koiAlpha;
      const companionColors: Record<string, string> = {
        azure_glow: '#38bdf8',
        rose_gold: '#fb7185',
        midnight_purple: '#c084fc',
        emerald_jade: '#34d399',
        solar_amber: '#fbbf24',
      };
      const koiColor = companionColors[gameState.character.koiCompanionColor] || '#38bdf8';

      for (let i = 0; i < koiSegmentsRef.current.length; i++) {
        const seg = koiSegmentsRef.current[i];
        const segRadius = Math.max(3, 10 - i * 0.9);

        // Segment glow
        ctx.shadowColor = koiColor;
        ctx.shadowBlur = 12;
        ctx.fillStyle = i === 0 ? '#ffffff' : i < 4 ? koiColor : '#0284c7';
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, segRadius, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Translucent Fins on segment 2
        if (i === 2) {
          const prev = koiSegmentsRef.current[1];
          const angle = Math.atan2(seg.y - prev.y, seg.x - prev.x);
          const finLength = 16;

          // Left fin
          ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
          ctx.beginPath();
          ctx.ellipse(
            seg.x + Math.cos(angle + Math.PI / 2) * 8,
            seg.y + Math.sin(angle + Math.PI / 2) * 8,
            finLength,
            5,
            angle + Math.PI / 3,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Right fin
          ctx.beginPath();
          ctx.ellipse(
            seg.x + Math.cos(angle - Math.PI / 2) * 8,
            seg.y + Math.sin(angle - Math.PI / 2) * 8,
            finLength,
            5,
            angle - Math.PI / 3,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();

      // 8. DRAW SERA'S SALVAGE SKIFF & STAFF-LANTERN
      ctx.save();
      ctx.translate(posRef.current.x, posRef.current.y);
      ctx.rotate(angleRef.current);

      // Staff Lantern Beam
      const mode = lanternModeRef.current;
      const beamColor = mode === 'beacon' ? 'rgba(56, 189, 248, 0.22)' : mode === 'signal' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(192, 132, 252, 0.3)';
      const beamDist = mode === 'beacon' ? 260 : mode === 'signal' ? 190 : 130;
      const beamSpread = mode === 'ward' ? Math.PI : Math.PI * 0.45;

      const beamGrad = ctx.createRadialGradient(20, 0, 5, 20, 0, beamDist);
      beamGrad.addColorStop(0, beamColor);
      beamGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.arc(20, 0, beamDist, -beamSpread / 2, beamSpread / 2);
      ctx.closePath();
      ctx.fill();

      // Skiff Hull (Black Lacquer & Brass Trim)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(24, 0); // Prow
      ctx.lineTo(-14, -10); // Port
      ctx.lineTo(-20, -7);
      ctx.lineTo(-20, 7);
      ctx.lineTo(-14, 10); // Starboard
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sail / Rig visual (Vermilion / Indigo cloth)
      const rigStyle = GEAR_RIGS[activeRigRef.current];
      ctx.fillStyle = rigStyle?.id === 'standard_courier' ? '#dc2626' : rigStyle?.id === 'dawn_dock' ? '#78716c' : '#7c3aed';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-12, -8);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-12, 8);
      ctx.closePath();
      ctx.fill();

      // Staff-Lantern Orb at prow
      ctx.fillStyle = mode === 'beacon' ? '#38bdf8' : mode === 'signal' ? '#f59e0b' : '#c084fc';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(22, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      ctx.restore(); // Restore camera transform

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [joystickActive, joystickVector, nearbyDistrict, setGameState]);

  // Sync position back to global state on unmount or docking
  useEffect(() => {
    return () => {
      setGameState(prev => ({
        ...prev,
        playerPos: { ...posRef.current },
        playerVelocity: { ...velRef.current },
        playerAngle: angleRef.current
      }));
    };
  }, [setGameState]);

  // Scale Compass Target Angle calculation (Waypoint or Contract Destination)
  const activeTargetLocation = gameState.mapWaypoint 
    ? { name: `Waypoint: ${gameState.mapWaypoint.label}`, x: gameState.mapWaypoint.x, y: gameState.mapWaypoint.y }
    : gameState.activeContract 
    ? { name: DISTRICTS[gameState.activeContract.destination].name, x: DISTRICTS[gameState.activeContract.destination].coordinates.x, y: DISTRICTS[gameState.activeContract.destination].coordinates.y }
    : { name: DISTRICTS.lantern_bazaar.name, x: DISTRICTS.lantern_bazaar.coordinates.x, y: DISTRICTS.lantern_bazaar.coordinates.y };

  const targetAngle = Math.atan2(
    activeTargetLocation.y - gameState.playerPos.y,
    activeTargetLocation.x - gameState.playerPos.x
  );
  const targetDistanceLeagues = Math.round(Math.hypot(activeTargetLocation.x - gameState.playerPos.x, activeTargetLocation.y - gameState.playerPos.y) / 10);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[520px] bg-[#070b14] overflow-hidden select-none">
      {/* 2D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Top HUD: Scale Compass & Status */}
      <div className="absolute top-4 left-4 right-4 pointer-events-none flex items-start justify-between">
        {/* Scale Compass Widget */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-sky-500/30 rounded-2xl p-3.5 shadow-xl flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full border border-sky-400/40 bg-slate-950 flex items-center justify-center shadow-inner">
            {/* Compass Needle */}
            <div 
              className="absolute w-1.5 h-9 bg-gradient-to-t from-sky-500 to-amber-400 rounded-full transition-transform duration-200 shadow-sm shadow-amber-400/50"
              style={{ transform: `rotate(${(targetAngle - gameState.playerAngle) * (180 / Math.PI) + 90}deg)` }}
            />
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-sky-300 z-10" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Scale Compass (Moonlight Navigation)
            </div>
            <div className="text-sm font-bold text-slate-100 font-fantasy line-clamp-1">
              Target: {activeTargetLocation.name}
            </div>
            <div className="text-xs text-sky-400 font-medium">
              Distance: {targetDistanceLeagues} leagues
            </div>
          </div>
        </div>

        {/* Staff Lantern Controls */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-2xl p-2 shadow-xl flex items-center gap-1.5">
          <button
            id="btn-lantern-beacon"
            onClick={() => handleSetLantern('beacon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              gameState.lanternMode === 'beacon'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Route Beacon [1]
          </button>
          <button
            id="btn-lantern-signal"
            onClick={() => handleSetLantern('signal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              gameState.lanternMode === 'signal'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            Coded Signal [2]
          </button>
          <button
            id="btn-lantern-ward"
            onClick={() => handleSetLantern('ward')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              gameState.lanternMode === 'ward'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Storm Ward [3]
          </button>
        </div>
      </div>

      {/* Docking Callout (When near a district platform) */}
      {nearbyDistrict && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto animate-bounce">
          <button
            id="btn-dock-district"
            onClick={() => onDock(nearbyDistrict)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-2xl shadow-amber-500/50 border border-amber-300 flex items-center gap-2.5 transition-transform active:scale-95"
          >
            <Anchor className="w-5 h-5" />
            Dock at {DISTRICTS[nearbyDistrict].name} [Press F]
          </button>
        </div>
      )}

      {/* Bottom Controls / Flight Hints */}
      <div className="absolute bottom-4 left-4 pointer-events-none hidden md:flex items-center gap-3 text-xs text-slate-400 bg-slate-950/70 backdrop-blur-sm border border-slate-800 px-3.5 py-2 rounded-xl">
        <span className="text-slate-200 font-semibold flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-sky-400" /> Controls:</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">WASD</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">Arrows</kbd> Steer</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">Space</kbd> Sail Boost</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">1-3</kbd> Lantern Staff</span>
      </div>

      {/* On-screen Touch Controls for mobile */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-center gap-3 md:hidden">
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          <div />
          <button
            onPointerDown={() => { keysRef.current['arrowup'] = true; }}
            onPointerUp={() => { keysRef.current['arrowup'] = false; }}
            className="w-11 h-11 bg-slate-800 active:bg-sky-500 text-slate-200 rounded-xl flex items-center justify-center font-bold text-lg"
          >
            ▲
          </button>
          <div />
          <button
            onPointerDown={() => { keysRef.current['arrowleft'] = true; }}
            onPointerUp={() => { keysRef.current['arrowleft'] = false; }}
            className="w-11 h-11 bg-slate-800 active:bg-sky-500 text-slate-200 rounded-xl flex items-center justify-center font-bold text-lg"
          >
            ◀
          </button>
          <button
            onPointerDown={() => { keysRef.current[' '] = true; }}
            onPointerUp={() => { keysRef.current[' '] = false; }}
            className="w-11 h-11 bg-amber-600/80 active:bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-bold text-xs"
          >
            BOOST
          </button>
          <button
            onPointerDown={() => { keysRef.current['arrowright'] = true; }}
            onPointerUp={() => { keysRef.current['arrowright'] = false; }}
            className="w-11 h-11 bg-slate-800 active:bg-sky-500 text-slate-200 rounded-xl flex items-center justify-center font-bold text-lg"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
