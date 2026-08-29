import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, DistrictId, FlightTelemetry } from '../types';
import { DISTRICTS, LANDMARKS, BIOMES } from '../data/gameData';
import { soundEngine } from '../utils/audio';
import {
  Compass,
  Wind,
  Zap,
  Navigation,
  Anchor,
  Sparkles,
  AlertTriangle,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Volume2,
  VolumeX,
  Crosshair,
  Layers,
  MapPin
} from 'lucide-react';

interface SkyFlightCanvasProps {
  gameState: GameState;
  onDock: (districtId: DistrictId) => void;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onSetWaypoint: (x: number, y: number, label: string) => void;
  onClearWaypoint: () => void;
  onOpenModal: (modal: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Mote {
  x: number;
  y: number;
  type: 'droplet' | 'storm_jar' | 'salvage';
  id: number;
  pulseOffset: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
  color: string;
}

export const SkyFlightCanvas: React.FC<SkyFlightCanvasProps> = ({
  gameState,
  onDock,
  onUpdateState,
  onSetWaypoint,
  onClearWaypoint,
  onOpenModal
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound toggle
  const [muted, setMuted] = useState(!gameState.soundEnabled);

  // HUD telemetry state (throttled updates to React, 5 FPS for display, smooth 60 FPS on canvas)
  const [hudData, setHudData] = useState({
    speed: 0,
    heading: 0,
    x: gameState.playerX,
    y: gameState.playerY,
    nearbyDistrict: null as DistrictId | null,
    nearbyDistance: 9999,
    inStorm: false,
    inWind: false,
    waypointDist: null as number | null
  });

  // Controls state in Ref to avoid frame drops
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const touchControlRef = useRef<{
    thrust: boolean;
    turnLeft: boolean;
    turnRight: boolean;
    brake: boolean;
    targetPointer: { x: number; y: number } | null;
  }>({
    thrust: false,
    turnLeft: false,
    turnRight: false,
    brake: false,
    targetPointer: null
  });

  // Local physics simulation ref
  const simRef = useRef({
    x: gameState.playerX,
    y: gameState.playerY,
    vx: gameState.playerVelocityX,
    vy: gameState.playerVelocityY,
    angle: gameState.playerAngle,
    koiX: gameState.playerX - 30,
    koiY: gameState.playerY - 20,
    trail: [] as { x: number; y: number; alpha: number }[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    motes: [
      { x: 550, y: 520, type: 'droplet', id: 1, pulseOffset: 0 },
      { x: 640, y: 460, type: 'droplet', id: 2, pulseOffset: 1 },
      { x: 420, y: 720, type: 'salvage', id: 3, pulseOffset: 2 },
      { x: 1080, y: 640, type: 'droplet', id: 4, pulseOffset: 3 },
      { x: 500, y: 1220, type: 'storm_jar', id: 5, pulseOffset: 4 },
      { x: 1320, y: 400, type: 'droplet', id: 6, pulseOffset: 5 },
      { x: 920, y: 320, type: 'salvage', id: 7, pulseOffset: 6 },
      { x: 1250, y: 1050, type: 'storm_jar', id: 8, pulseOffset: 7 },
      { x: 780, y: 880, type: 'droplet', id: 9, pulseOffset: 8 },
      { x: 350, y: 380, type: 'droplet', id: 10, pulseOffset: 9 }
    ] as Mote[],
    nearestDist: null as DistrictId | null,
    distMin: 9999
  });

  // Keep gameState reference updated in ref
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === 'e' || e.key === 'E') {
        if (simRef.current.nearestDist && simRef.current.distMin < 180) {
          soundEngine.playDockSound();
          onDock(simRef.current.nearestDist);
        }
      }
      if (e.key === 'm' || e.key === 'M') onOpenModal('world_map');
      if (e.key === 'j' || e.key === 'J') onOpenModal('quest_drawer');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onDock, onOpenModal]);

  // Main 60 FPS Physics & Canvas Render Engine
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let hudTimer = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to container
    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const sim = simRef.current;
      const state = gameStateRef.current;
      const keys = keysRef.current;
      const touch = touchControlRef.current;

      // 1. Controls processing
      const turnSpeed = 3.6;
      const maxSpeed = 390 + (state.upgrades.engine * 45);
      const accel = 320;

      let isLeft = keys['ArrowLeft'] || keys['a'] || keys['A'] || touch.turnLeft;
      let isRight = keys['ArrowRight'] || keys['d'] || keys['D'] || touch.turnRight;
      let isThrust = keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' '] || touch.thrust;
      let isBrake = keys['ArrowDown'] || keys['s'] || keys['S'] || touch.brake;

      // Pointer / Click-to-Fly mode
      if (touch.targetPointer && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const screenCenterX = rect.width / 2;
        const screenCenterY = rect.height / 2;
        const dx = touch.targetPointer.x - screenCenterX;
        const dy = touch.targetPointer.y - screenCenterY;
        const targetAngle = Math.atan2(dy, dx);
        const distFromCenter = Math.hypot(dx, dy);

        if (distFromCenter > 30) {
          let angleDiff = targetAngle - sim.angle;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          sim.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnSpeed * dt * 1.5);
          isThrust = true;
        }
      }

      if (isLeft) sim.angle -= turnSpeed * dt;
      if (isRight) sim.angle += turnSpeed * dt;

      if (isThrust) {
        sim.vx += Math.cos(sim.angle) * accel * dt;
        sim.vy += Math.sin(sim.angle) * accel * dt;

        // Thrust particle spawn
        if (Math.random() < 0.6) {
          const rearX = sim.x - Math.cos(sim.angle) * 18;
          const rearY = sim.y - Math.sin(sim.angle) * 18;
          sim.particles.push({
            x: rearX + (Math.random() - 0.5) * 4,
            y: rearY + (Math.random() - 0.5) * 4,
            vx: -Math.cos(sim.angle) * 80 + (Math.random() - 0.5) * 30,
            vy: -Math.sin(sim.angle) * 80 + (Math.random() - 0.5) * 30,
            size: Math.random() * 3 + 2,
            alpha: 0.8,
            maxAlpha: 0.8,
            color: Math.random() > 0.4 ? '#38bdf8' : '#f59e0b',
            life: 0,
            maxLife: 0.35
          });
        }
      }

      // Wind current zone (Lantern Shallows thermal lift)
      const inWindZone = sim.x > 300 && sim.x < 850 && sim.y > 250 && sim.y < 800;
      if (inWindZone) {
        sim.vx += 40 * dt; // Eastward push
      }

      // Friction
      const friction = isBrake ? 0.86 : 0.965;
      sim.vx *= Math.pow(friction, dt * 60);
      sim.vy *= Math.pow(friction, dt * 60);

      // Speed cap
      const currentSpeed = Math.hypot(sim.vx, sim.vy);
      if (currentSpeed > maxSpeed) {
        sim.vx = (sim.vx / currentSpeed) * maxSpeed;
        sim.vy = (sim.vy / currentSpeed) * maxSpeed;
      }

      sim.x += sim.vx * dt;
      sim.y += sim.vy * dt;

      // World boundaries (1800 x 1600 map)
      sim.x = Math.max(60, Math.min(1740, sim.x));
      sim.y = Math.max(60, Math.min(1540, sim.y));

      // Trail update
      if (currentSpeed > 20 && Math.random() < 0.4) {
        sim.trail.unshift({ x: sim.x, y: sim.y, alpha: 0.6 });
        if (sim.trail.length > 20) sim.trail.pop();
      }
      for (const t of sim.trail) {
        t.alpha -= dt * 0.8;
      }
      sim.trail = sim.trail.filter(t => t.alpha > 0.05);

      // Koi companion smooth following lag
      const targetKoiX = sim.x - Math.cos(sim.angle + 0.5) * 38;
      const targetKoiY = sim.y - Math.sin(sim.angle + 0.5) * 38;
      sim.koiX += (targetKoiX - sim.koiX) * 8 * dt;
      sim.koiY += (targetKoiY - sim.koiY) * 8 * dt;

      // Nearest district check
      let nearestDistId: DistrictId | null = null;
      let minDist = 9999;
      for (const [dId, dist] of Object.entries(DISTRICTS)) {
        const d = Math.hypot(sim.x - dist.x, sim.y - dist.y);
        if (d < minDist) {
          minDist = d;
          nearestDistId = dId as DistrictId;
        }
      }
      sim.nearestDist = nearestDistId;
      sim.distMin = minDist;

      // Motes magnetism & collection
      const magnetDist = state.unlockedSkills.includes('koi_harmonic_bond') ? 160 : 90;
      const remainingMotes: Mote[] = [];

      for (const m of sim.motes) {
        const dist = Math.hypot(sim.x - m.x, sim.y - m.y);
        if (dist < 46) {
          // Collected!
          soundEngine.playCollectChime();
          let amount = 10;
          let label = '+10 ✨';
          let color = '#38bdf8';

          if (m.type === 'droplet') {
            amount = state.unlockedSkills.includes('koi_pearl_gleaner') ? 15 : 10;
            label = `+${amount} ✨`;
            onUpdateState(p => ({ ...p, droplets: p.droplets + amount }));
          } else if (m.type === 'storm_jar') {
            label = '+1 ⚡';
            color = '#818cf8';
            onUpdateState(p => ({ ...p, stormJars: p.stormJars + 1 }));
          } else if (m.type === 'salvage') {
            label = '+25 ✨ +1 ⚓';
            color = '#f59e0b';
            onUpdateState(p => ({ ...p, droplets: p.droplets + 25, favors: p.favors + 1 }));
          }

          sim.floatingTexts.push({
            id: Date.now() + Math.random(),
            text: label,
            x: m.x,
            y: m.y - 10,
            alpha: 1,
            color
          });

          // Burst particles
          for (let p = 0; p < 8; p++) {
            const pAngle = Math.random() * Math.PI * 2;
            const pSpeed = Math.random() * 80 + 30;
            sim.particles.push({
              x: m.x,
              y: m.y,
              vx: Math.cos(pAngle) * pSpeed,
              vy: Math.sin(pAngle) * pSpeed,
              size: Math.random() * 3 + 2,
              alpha: 1,
              maxAlpha: 1,
              color,
              life: 0,
              maxLife: 0.5
            });
          }
        } else {
          if (dist < magnetDist) {
            m.x += ((sim.x - m.x) / dist) * 160 * dt;
            m.y += ((sim.y - m.y) / dist) * 160 * dt;
          }
          remainingMotes.push(m);
        }
      }
      sim.motes = remainingMotes;

      // Replenish motes if low
      if (sim.motes.length < 12 && Math.random() < 0.08) {
        const randAngle = Math.random() * Math.PI * 2;
        const randDist = Math.random() * 400 + 200;
        const typeRoll = Math.random();
        sim.motes.push({
          x: Math.max(100, Math.min(1700, sim.x + Math.cos(randAngle) * randDist)),
          y: Math.max(100, Math.min(1500, sim.y + Math.sin(randAngle) * randDist)),
          type: typeRoll > 0.4 ? 'droplet' : typeRoll > 0.2 ? 'salvage' : 'storm_jar',
          id: Date.now() + Math.random(),
          pulseOffset: Math.random() * 5
        });
      }

      // Update particles
      for (const p of sim.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life += dt;
        p.alpha = p.maxAlpha * (1 - p.life / p.maxLife);
      }
      sim.particles = sim.particles.filter(p => p.life < p.maxLife);

      // Update floating texts
      for (const ft of sim.floatingTexts) {
        ft.y -= 35 * dt;
        ft.alpha -= dt * 0.9;
      }
      sim.floatingTexts = sim.floatingTexts.filter(ft => ft.alpha > 0.05);

      // 2. CANVAS RENDERING
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const h = containerRef.current?.clientHeight || (window.innerHeight - 56);
      const px = sim.x;
      const py = sim.y;

      ctx.clearRect(0, 0, w, h);

      // Camera view translated to center player
      ctx.save();
      ctx.translate(w / 2 - px, h / 2 - py);

      // A. World Grid & Cosmic Deep Night Gradient
      const grad = ctx.createRadialGradient(px, py, 100, px, py, 1200);
      grad.addColorStop(0, '#0a1628');
      grad.addColorStop(0.6, '#060d1a');
      grad.addColorStop(1, '#02050c');
      ctx.fillStyle = grad;
      ctx.fillRect(-300, -300, 2400, 2200);

      // Starlight Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 60; i++) {
        const starX = (i * 137.5) % 1800;
        const starY = (i * 263.3) % 1600;
        const starSize = (i % 3) === 0 ? 2 : 1;
        ctx.fillRect(starX, starY, starSize, starSize);
      }

      // B. Biome Zones
      for (const [, biome] of Object.entries(BIOMES)) {
        ctx.fillStyle = biome.color + '33';
        ctx.fillRect(biome.minX, biome.minY, biome.maxX - biome.minX, biome.maxY - biome.minY);

        ctx.strokeStyle = biome.accentColor + '55';
        ctx.lineWidth = 2;
        ctx.strokeRect(biome.minX, biome.minY, biome.maxX - biome.minX, biome.maxY - biome.minY);

        // Biome watermark text
        ctx.fillStyle = biome.accentColor + '22';
        ctx.font = 'bold 36px "Cinzel"';
        ctx.textAlign = 'center';
        ctx.fillText(
          biome.name.toUpperCase(),
          (biome.minX + biome.maxX) / 2,
          (biome.minY + biome.maxY) / 2
        );
      }

      // C. Wind Stream Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(250, 420);
      ctx.bezierCurveTo(600, 560, 950, 480, 1450, 390);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(129, 140, 248, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(300, 780);
      ctx.bezierCurveTo(700, 950, 1100, 890, 1500, 1150);
      ctx.stroke();

      // D. Active Waypoint Line & Marker
      if (state.mapWaypoint) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(state.mapWaypoint.x, state.mapWaypoint.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Waypoint beacon
        ctx.save();
        ctx.translate(state.mapWaypoint.x, state.mapWaypoint.y);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 10 + Math.sin(now * 0.006) * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(`WAYPOINT: ${state.mapWaypoint.label}`, 0, -18);
        ctx.restore();
      }

      // E. District Mooring Platform Hubs
      for (const [dId, dist] of Object.entries(DISTRICTS)) {
        ctx.save();
        ctx.translate(dist.x, dist.y);

        const isNearby = dId === sim.nearestDist && sim.distMin < 180;

        // Docking radius ring
        ctx.strokeStyle = isNearby ? dist.accentColor : dist.accentColor + '55';
        ctx.lineWidth = isNearby ? 3 : 1.5;
        ctx.setLineDash(isNearby ? [8, 4] : [6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Outer Glow Aura
        const hubGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 80);
        hubGrad.addColorStop(0, dist.accentColor + '66');
        hubGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = hubGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.fill();

        // Central Island / Barge Structure
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = dist.accentColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner Beacon light
        ctx.fillStyle = dist.accentColor;
        ctx.shadowColor = dist.accentColor;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Plus Jakarta Sans"';
        ctx.textAlign = 'center';
        ctx.fillText(dist.name, 0, 74);

        ctx.fillStyle = dist.accentColor;
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText(dist.epithet, 0, 88);

        ctx.restore();
      }

      // F. Stardust Motes
      for (const m of sim.motes) {
        ctx.save();
        ctx.translate(m.x, m.y);
        const floatY = Math.sin(now * 0.004 + m.pulseOffset) * 4;

        if (m.type === 'droplet') {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, floatY, 6.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (m.type === 'storm_jar') {
          ctx.fillStyle = '#818cf8';
          ctx.shadowColor = '#818cf8';
          ctx.shadowBlur = 15;
          ctx.fillRect(-5.5, -5.5 + floatY, 11, 11);
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, floatY, 7.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // G. Particles
      for (const p of sim.particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // H. Floating Text Popups (+15 ✨)
      for (const ft of sim.floatingTexts) {
        ctx.save();
        ctx.font = 'bold 13px "JetBrains Mono"';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = ft.alpha;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      // I. Moon-Koi Companion (Nami)
      const koiAngle = Math.atan2(sim.y - sim.koiY, sim.x - sim.koiX);
      ctx.save();
      ctx.translate(sim.koiX, sim.koiY);
      ctx.rotate(koiAngle);

      // Bioluminescent Glow Body
      ctx.fillStyle = state.character.koiCompanionColor === 'rose_gold' ? '#fb7185' : state.character.koiCompanionColor === 'solar_amber' ? '#f59e0b' : '#38bdf8';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tail flutter
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      const tailWiggle = Math.sin(now * 0.012) * 6;
      ctx.lineTo(-26, -7 + tailWiggle);
      ctx.lineTo(-26, 7 + tailWiggle);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // J. Player Skiff
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(sim.angle);

      // Lantern Light Beam
      const lanternMode = state.lanternMode;
      ctx.fillStyle = lanternMode === 'fog_piercer' ? 'rgba(245, 158, 11, 0.22)' : 'rgba(56, 189, 248, 0.18)';
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(160, -50);
      ctx.lineTo(160, 50);
      ctx.closePath();
      ctx.fill();

      // Skiff Hull
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(-16, -14);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-16, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Lantern Crystal
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(2, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      // Thruster Flare
      if (isThrust) {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-26 - Math.random() * 10, 0);
        ctx.lineTo(-14, -5);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      ctx.restore(); // End camera transform

      // Throttled HUD Telemetry dispatch (5 times a second)
      hudTimer += dt;
      if (hudTimer > 0.18) {
        hudTimer = 0;
        setHudData({
          speed: Math.round(currentSpeed * 0.14),
          heading: Math.round((sim.angle * 180 / Math.PI + 360) % 360),
          x: Math.round(sim.x),
          y: Math.round(sim.y),
          nearbyDistrict: sim.distMin < 180 ? sim.nearestDist : null,
          nearbyDistance: Math.round(sim.distMin),
          inStorm: sim.x > 750 && sim.x < 1200 && sim.y > 800 && sim.y < 1300,
          inWind: inWindZone,
          waypointDist: state.mapWaypoint ? Math.round(Math.hypot(sim.x - state.mapWaypoint.x, sim.y - state.mapWaypoint.y)) : null
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [onDock, onOpenModal, onUpdateState]);

  // Pointer / Touch down handlers for canvas tap-to-fly
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    touchControlRef.current.targetPointer = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    soundEngine.playThrustSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (touchControlRef.current.targetPointer) {
      const rect = e.currentTarget.getBoundingClientRect();
      touchControlRef.current.targetPointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handlePointerUp = () => {
    touchControlRef.current.targetPointer = null;
  };

  const toggleSound = () => {
    soundEngine.enabled = !soundEngine.enabled;
    setMuted(!soundEngine.enabled);
    onUpdateState(p => ({ ...p, soundEnabled: soundEngine.enabled }));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-[#070B14] select-none touch-none"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Top Left: Flight Telemetry HUD */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2 pointer-events-none font-mono text-xs">
        <div className="bg-sky-950/85 border border-sky-800/60 backdrop-blur-md px-3.5 py-2.5 rounded-xl flex items-center space-x-3 shadow-xl text-slate-200">
          <div className="flex items-center space-x-1.5">
            <Wind size={15} className="text-moon-cyan" />
            <span className="text-slate-400 text-[11px]">SPD:</span>
            <span className="font-bold text-moon-cyan text-sm">{hudData.speed} KTS</span>
          </div>

          <div className="w-[1px] h-4 bg-slate-700" />

          <div className="flex items-center space-x-1.5">
            <Compass size={15} className="text-lantern-amber" />
            <span className="text-slate-400 text-[11px]">HDG:</span>
            <span className="font-bold text-lantern-amber text-sm">{hudData.heading}°</span>
          </div>

          <div className="w-[1px] h-4 bg-slate-700" />

          <div className="hidden sm:flex items-center space-x-1.5">
            <MapPin size={14} className="text-indigo-400" />
            <span className="text-slate-300">{hudData.x}, {hudData.y}</span>
          </div>
        </div>

        {/* Hazard alert */}
        {hudData.inStorm && (
          <div className="bg-rose-950/90 border border-rose-600/80 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-rose-300 text-xs shadow-lg animate-pulse">
            <AlertTriangle size={14} className="text-rose-400" />
            <span>STORM VORTEX // GALE LIGHTNING TURBULENCE</span>
          </div>
        )}

        {/* Waypoint alert */}
        {hudData.waypointDist !== null && (
          <div className="bg-sky-900/80 border border-moon-cyan/40 px-3 py-1 rounded-lg text-moon-cyan text-[11px] flex items-center space-x-2">
            <Navigation size={13} className="text-rose-400" />
            <span>WAYPOINT: {hudData.waypointDist}m</span>
          </div>
        )}
      </div>

      {/* Top Right: Sound & Quick View Actions */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-800/60 text-slate-300 hover:text-moon-cyan backdrop-blur-md shadow-lg transition-colors"
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          onClick={() => onOpenModal('world_map')}
          className="px-3 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-800/60 text-moon-cyan font-mono text-xs backdrop-blur-md shadow-lg flex items-center space-x-1.5"
        >
          <Layers size={14} />
          <span className="hidden sm:inline">WORLD MAP</span>
        </button>
      </div>

      {/* Center Bottom: Docking Prompt Banner */}
      {hudData.nearbyDistrict && (
        <div className="absolute bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <button
            onClick={() => {
              soundEngine.playDockSound();
              onDock(hudData.nearbyDistrict!);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-moon-cyan via-sky-300 to-amber-300 text-sky-950 font-bold font-mono text-xs sm:text-sm tracking-wider shadow-2xl shadow-moon-cyan/50 hover:brightness-110 transition-all transform hover:scale-105 flex items-center space-x-2 animate-bounce border-2 border-white/50"
          >
            <Anchor size={18} />
            <span>DOCK AT {DISTRICTS[hudData.nearbyDistrict]?.name.toUpperCase()} (PRESS E / TAP)</span>
          </button>
        </div>
      )}

      {/* On-Screen Mobile & Touch Flight Controls (Virtual D-Pad & Action Buttons) */}
      <div className="absolute bottom-4 left-4 z-20 flex space-x-2">
        {/* Turn Left */}
        <button
          onPointerDown={() => { touchControlRef.current.turnLeft = true; }}
          onPointerUp={() => { touchControlRef.current.turnLeft = false; }}
          onPointerLeave={() => { touchControlRef.current.turnLeft = false; }}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-sky-950/85 hover:bg-sky-900 active:bg-moon-cyan active:text-sky-950 border border-sky-700/60 text-moon-cyan shadow-xl flex items-center justify-center backdrop-blur-md"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Turn Right */}
        <button
          onPointerDown={() => { touchControlRef.current.turnRight = true; }}
          onPointerUp={() => { touchControlRef.current.turnRight = false; }}
          onPointerLeave={() => { touchControlRef.current.turnRight = false; }}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-sky-950/85 hover:bg-sky-900 active:bg-moon-cyan active:text-sky-950 border border-sky-700/60 text-moon-cyan shadow-xl flex items-center justify-center backdrop-blur-md"
        >
          <ArrowRight size={22} />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
        {/* Air Brake */}
        <button
          onPointerDown={() => { touchControlRef.current.brake = true; }}
          onPointerUp={() => { touchControlRef.current.brake = false; }}
          onPointerLeave={() => { touchControlRef.current.brake = false; }}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-sky-950/85 hover:bg-sky-900 active:bg-rose-600 active:text-white border border-sky-700/60 text-rose-400 shadow-xl flex flex-col items-center justify-center backdrop-blur-md"
        >
          <ArrowDown size={18} />
          <span className="text-[9px] font-mono font-bold">BRAKE</span>
        </button>

        {/* Thrust */}
        <button
          onPointerDown={() => {
            touchControlRef.current.thrust = true;
            soundEngine.playThrustSound();
          }}
          onPointerUp={() => { touchControlRef.current.thrust = false; }}
          onPointerLeave={() => { touchControlRef.current.thrust = false; }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-moon-cyan active:from-amber-400 active:to-yellow-300 text-sky-950 shadow-2xl shadow-moon-cyan/40 flex flex-col items-center justify-center font-mono font-bold"
        >
          <ArrowUp size={22} />
          <span className="text-[10px]">THRUST</span>
        </button>
      </div>

      {/* Flight Control Legend for desktop */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-sky-950/70 border border-sky-800/50 px-4 py-1.5 rounded-full text-[11px] font-mono text-slate-400 backdrop-blur-md hidden md:flex items-center space-x-3 pointer-events-none">
        <span><b className="text-moon-cyan">W / ↑</b> Thrust</span>
        <span><b className="text-moon-cyan">A / D</b> Steer</span>
        <span><b className="text-moon-cyan">S / ↓</b> Brake</span>
        <span><b className="text-lantern-amber">Click/Tap Screen</b> Fly To Point</span>
        <span><b className="text-lantern-amber">E</b> Dock</span>
      </div>
    </div>
  );
};
