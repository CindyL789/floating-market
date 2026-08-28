import { DistrictId, GameState, LanternMode } from '../types';
import { DISTRICTS, GEAR_RIGS, LANDMARKS } from '../data/gameData';
import { sound } from '../utils/audio';

export type GameStateUpdater = (updater: (previous: GameState) => GameState) => void;

export interface RadarBlip {
  id: string;
  x: number;
  y: number;
  type: 'district' | 'landmark' | 'collectible' | 'storm' | 'powerup' | 'enemy' | 'anchor';
  accent: string;
}

export interface FlightTelemetry {
  speed: number;
  nearbyDistrict: DistrictId | null;
  nearbyDistance: number;
  inWind: boolean;
  inStorm: boolean;
  waypointDistance: number | null;
  lanternMode: LanternMode;
  playerX: number;
  playerY: number;
  playerAngle: number;
  radarBlips: RadarBlip[];
  gliderCharges: number;
  grappleCharges: number;
  shockCharges: number;
  gliderActive: boolean;
  grappleActive: boolean;
  combatTargetCount: number;
  powerUpCount: number;
}

export interface CarmackEngineOptions {
  canvas: HTMLCanvasElement;
  getState: () => GameState;
  updateState: GameStateUpdater;
  onDock: (districtId: DistrictId) => void;
  onTelemetry?: (telemetry: FlightTelemetry) => void;
}

type Vec2 = { x: number; y: number };

type CollectibleType = 'droplet' | 'salvage' | 'storm_charge';
type PowerUpType = 'wind_glider' | 'grapple_charge' | 'shock_cell' | 'hull_patch';

interface Collectible {
  id: string;
  x: number;
  y: number;
  type: CollectibleType;
  value: number;
  pulse: number;
}

interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: PowerUpType;
  pulse: number;
}

interface EnemySkiff {
  id: string;
  x: number;
  y: number;
  phase: number;
  health: number;
  attackTimer: number;
}

interface GrappleAnchor {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface GrappleState {
  anchor: GrappleAnchor;
  remaining: number;
}

interface ProjectedPoint {
  x: number;
  depth: number;
  groundY: number;
  scale: number;
}

interface Renderable {
  depth: number;
  render: () => void;
}

const WORLD_WIDTH = 1800;
const WORLD_HEIGHT = 1600;
const HORIZON_RATIO = 0.43;
const FOV = Math.PI * 0.42;
const CAMERA_HEIGHT = 2.8;

const WIND_CURRENTS = [
  { x1: 450, y1: 520, x2: 1200, y2: 700, speed: 2.2, width: 90 },
  { x1: 1250, y1: 700, x2: 1350, y2: 400, speed: 1.8, width: 80 },
  { x1: 1350, y1: 300, x2: 950, y2: 220, speed: 2.0, width: 80 },
  { x1: 900, y1: 250, x2: 450, y2: 500, speed: 2.5, width: 100 },
  { x1: 500, y1: 600, x2: 420, y2: 1280, speed: 2.0, width: 90 },
];

const STORM_ZONES = [
  { x: 380, y: 1250, radius: 180 },
  { x: 920, y: 950, radius: 150 },
  { x: 750, y: 150, radius: 140 },
];

const INITIAL_POWERUPS: PowerUp[] = [
  { id: 'p-glider-1', x: 630, y: 500, type: 'wind_glider', pulse: 0 },
  { id: 'p-grapple-1', x: 790, y: 550, type: 'grapple_charge', pulse: 1 },
  { id: 'p-shock-1', x: 1010, y: 650, type: 'shock_cell', pulse: 2 },
  { id: 'p-hull-1', x: 1260, y: 720, type: 'hull_patch', pulse: 3 },
];

const INITIAL_ENEMIES: EnemySkiff[] = [
  { id: 'raider-1', x: 980, y: 620, phase: 0.3, health: 1, attackTimer: 0 },
  { id: 'raider-2', x: 1320, y: 820, phase: 1.7, health: 1, attackTimer: 1.2 },
  { id: 'raider-3', x: 420, y: 1190, phase: 3.2, health: 1, attackTimer: 2.4 },
];

const GRAPPLE_ANCHORS: GrappleAnchor[] = [
  { id: 'anchor-turbines', name: 'Cloud-Harvester Array', x: 800, y: 550 },
  { id: 'anchor-chain', name: 'Mooring Chain Link #4', x: 280, y: 1150 },
  { id: 'anchor-astrolabe', name: 'Zenith Astrolabe Beacon', x: 1100, y: 120 },
];

const INITIAL_COLLECTIBLES: Collectible[] = [
  { id: 'd1', x: 600, y: 450, type: 'droplet', value: 10, pulse: 0 },
  { id: 'd2', x: 750, y: 380, type: 'droplet', value: 15, pulse: 1 },
  { id: 'd3', x: 1100, y: 600, type: 'droplet', value: 20, pulse: 2 },
  { id: 'd4', x: 480, y: 900, type: 'droplet', value: 15, pulse: 3 },
  { id: 'd5', x: 800, y: 1100, type: 'droplet', value: 25, pulse: 4 },
  { id: 'd6', x: 1300, y: 500, type: 'droplet', value: 20, pulse: 5 },
  { id: 's1', x: 900, y: 800, type: 'salvage', value: 40, pulse: 0 },
  { id: 's2', x: 1350, y: 900, type: 'salvage', value: 50, pulse: 2 },
  { id: 'z1', x: 350, y: 1150, type: 'storm_charge', value: 30, pulse: 1 },
  { id: 'z2', x: 850, y: 300, type: 'storm_charge', value: 30, pulse: 3 },
];

const STAR_FIELD = Array.from({ length: 90 }, (_, index) => ({
  x: ((index * 197) % 1000) / 1000,
  y: 0.08 + (((index * 83) % 280) / 1000),
  size: 0.6 + ((index * 13) % 12) / 10,
  phase: (index * 0.37) % (Math.PI * 2),
}));

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function lerp(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

export class CarmackEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly getState: () => GameState;
  private readonly updateState: GameStateUpdater;
  private readonly onDock: (districtId: DistrictId) => void;
  private readonly onTelemetry?: (telemetry: FlightTelemetry) => void;

  private animationFrame = 0;
  private lastTime = 0;
  private width = 0;
  private height = 0;
  private focalLength = 0;
  private horizon = 0;
  private disposed = false;
  private telemetryTimer = 0;
  private spatialAudioTimer = 0;
  private stormDamageTimer = 0;
  private lastCollectedAt = 0;

  private pos: Vec2;
  private velocity: Vec2;
  private angle: number;
  private lanternMode: LanternMode;
  private keys: Record<string, boolean> = {};
  private joystick = { active: false, x: 0, y: 0 };
  private collectibles: Collectible[] = INITIAL_COLLECTIBLES.map(item => ({ ...item }));
  private powerUps: PowerUp[] = INITIAL_POWERUPS.map(item => ({ ...item }));
  private enemies: EnemySkiff[] = INITIAL_ENEMIES.map(item => ({ ...item }));
  private grappleAnchors: GrappleAnchor[] = GRAPPLE_ANCHORS.map(item => ({ ...item }));
  private grapple: GrappleState | null = null;
  private gliderTimer = 0;
  private gliderCharges = 1;
  private grappleCharges = 1;
  private shockCharges = 2;
  private weaponUpgradeLevel = 0;
  private shockPulseTimer = 0;
  private shockPulseHit = false;
  private koiSegments: Vec2[];

  constructor(options: CarmackEngineOptions) {
    this.canvas = options.canvas;
    const context = options.canvas.getContext('2d');
    if (!context) throw new Error('Canvas2D is unavailable in this browser.');
    this.ctx = context;
    this.getState = options.getState;
    this.updateState = options.updateState;
    this.onDock = options.onDock;
    this.onTelemetry = options.onTelemetry;

    const state = this.getState();
    this.pos = { ...state.playerPos };
    this.velocity = { ...state.playerVelocity };
    this.angle = state.playerAngle;
    this.lanternMode = state.lanternMode;
    this.weaponUpgradeLevel = state.upgrades?.weapon || 0;
    this.shockCharges += this.weaponUpgradeLevel;
    this.koiSegments = Array.from({ length: 11 }, (_, index) => ({
      x: this.pos.x - index * 10,
      y: this.pos.y + 14,
    }));

    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  start(): void {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    sound.startAtmosphericAmbience();
    this.lastTime = performance.now();
    this.animationFrame = window.requestAnimationFrame(this.loop);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    sound.disposeFlightSpatialAudio();
    this.updateState(previous => ({
      ...previous,
      playerPos: { ...this.pos },
      playerVelocity: { ...this.velocity },
      playerAngle: this.angle,
    }));
  }

  setJoystick(active: boolean, x: number, y: number): void {
    this.joystick = { active, x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
  }

  getTelemetry(): FlightTelemetry {
    return this.telemetry();
  }

  private loop = (time: number): void => {
    if (this.disposed) return;
    const dt = clamp((time - this.lastTime) / 1000, 0, 0.1);
    this.lastTime = time;
    this.update(dt, time);
    this.render(time);
    this.animationFrame = window.requestAnimationFrame(this.loop);
  };

  private handleResize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = Math.max(1, Math.floor(rect.width * dpr));
    this.height = Math.max(1, Math.floor(rect.height * dpr));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.focalLength = this.width / (2 * Math.tan(FOV / 2));
    this.horizon = Math.floor(this.height * HORIZON_RATIO);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keys[key] = true;
    this.keys[event.code.toLowerCase()] = true;

    if (key === '1') this.setLantern('beacon');
    if (key === '2') this.setLantern('signal');
    if (key === '3') this.setLantern('ward');
    if (key === 'g') this.activateGrapple();
    if (key === 'b') this.activateGlider();
    if (key === 'x') this.fireShockPulse();

    if ((key === 'f' || key === 'e') && this.telemetry().nearbyDistrict) {
      this.onDock(this.telemetry().nearbyDistrict as DistrictId);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys[event.key.toLowerCase()] = false;
    this.keys[event.code.toLowerCase()] = false;
  }

  private setLantern(mode: LanternMode): void {
    if (this.lanternMode === mode) return;
    this.lanternMode = mode;
    sound.playLanternIgnite(mode);
    this.updateState(previous => ({ ...previous, lanternMode: mode }));
  }

  private update(dt: number, time: number): void {
    const state = this.getState();
    const rig = GEAR_RIGS[state.activeRig];
    const keys = this.keys;
    let turning = 0;
    if (keys.arrowleft || keys.a || keys.keya) turning -= 1;
    if (keys.arrowright || keys.d || keys.keyd) turning += 1;

    let thrust = 0;
    if (keys.arrowup || keys.w || keys.keyw) thrust += 1;
    if (keys.arrowdown || keys.s || keys.keys) thrust -= 0.5;
    if (keys[' '] || keys.space) thrust += 1.6;
    if (this.joystick.active) {
      turning += this.joystick.x * 1.5;
      thrust += -this.joystick.y * 1.5;
    }

    const gliderActive = this.gliderTimer > 0;
    if (gliderActive) this.gliderTimer = Math.max(0, this.gliderTimer - dt);
    const engineLevel = state.upgrades?.engine || 0;
    const weaponLevel = state.upgrades?.weapon || 0;
    if (weaponLevel > this.weaponUpgradeLevel) {
      this.shockCharges += weaponLevel - this.weaponUpgradeLevel;
      this.weaponUpgradeLevel = weaponLevel;
    }
    const accel = (rig?.id === 'standard_courier' ? 140 : 110) * (1 + engineLevel * 0.12) * (gliderActive ? 1.35 : 1);
    this.angle += turning * 2.8 * dt;
    this.velocity.x += Math.cos(this.angle) * thrust * accel * dt;
    this.velocity.y += Math.sin(this.angle) * thrust * accel * dt;

    const wind = this.currentWind();
    if (wind) {
      const dx = wind.x2 - wind.x1;
      const dy = wind.y2 - wind.y1;
      const length = Math.hypot(dx, dy) || 1;
      this.velocity.x += (dx / length) * wind.speed * 85 * dt;
      this.velocity.y += (dy / length) * wind.speed * 85 * dt;
    }

    const friction = rig?.id === 'dawn_dock' ? 0.985 : 0.975;
    this.velocity.x *= Math.pow(friction, dt * 60);
    this.velocity.y *= Math.pow(friction, dt * 60);

    const hasAeroSails = (state.unlockedSkills || []).includes('sail_aerodynamics');
    const currentSpeed = Math.hypot(this.velocity.x, this.velocity.y);
    const baseMaxSpeed = wind ? 320 : (keys[' '] || keys.space ? 260 : 190);
    const maxSpeed = baseMaxSpeed * (hasAeroSails ? 1.25 : 1) * (1 + engineLevel * 0.04) * (gliderActive ? 1.45 : 1);
    if (currentSpeed > maxSpeed) {
      this.velocity.x = (this.velocity.x / currentSpeed) * maxSpeed;
      this.velocity.y = (this.velocity.y / currentSpeed) * maxSpeed;
    }

    this.pos.x = clamp(this.pos.x + this.velocity.x * dt, 50, WORLD_WIDTH - 50);
    this.pos.y = clamp(this.pos.y + this.velocity.y * dt, 50, WORLD_HEIGHT - 50);

    this.updateKoi(dt, time);
    this.updateCollectibles(dt, time, state);
    this.updatePowerUps(dt, time, state);
    this.updateEnemies(dt, state);
    this.updateGrapple(dt);
    this.updateStorm(dt, state);
    this.updateSpatialAudio(dt);
    this.shockPulseTimer = Math.max(0, this.shockPulseTimer - dt);

    this.telemetryTimer += dt;
    if (this.telemetryTimer > 0.12) {
      this.telemetryTimer = 0;
      this.onTelemetry?.(this.telemetry());
    }
  }

  private currentWind(): (typeof WIND_CURRENTS)[number] | null {
    let best: (typeof WIND_CURRENTS)[number] | null = null;
    let bestDistance = Infinity;
    for (const current of WIND_CURRENTS) {
      const dx = current.x2 - current.x1;
      const dy = current.y2 - current.y1;
      const lengthSquared = dx * dx + dy * dy || 1;
      const u = clamp(((this.pos.x - current.x1) * dx + (this.pos.y - current.y1) * dy) / lengthSquared, 0, 1);
      const nearestX = current.x1 + u * dx;
      const nearestY = current.y1 + u * dy;
      const nearestDistance = Math.hypot(this.pos.x - nearestX, this.pos.y - nearestY);
      if (nearestDistance < current.width && nearestDistance < bestDistance) {
        best = current;
        bestDistance = nearestDistance;
      }
    }
    return best;
  }

  private updateKoi(dt: number, time: number): void {
    const forward = { x: Math.cos(this.angle), y: Math.sin(this.angle) };
    const right = { x: -forward.y, y: forward.x };
    const target = {
      x: this.pos.x - forward.x * 42 + right.x * 18,
      y: this.pos.y - forward.y * 42 + right.y * 18,
    };
    this.koiSegments[0].x = lerp(this.koiSegments[0].x, target.x, Math.min(1, 7 * dt));
    this.koiSegments[0].y = lerp(this.koiSegments[0].y, target.y, Math.min(1, 7 * dt));
    for (let index = 1; index < this.koiSegments.length; index += 1) {
      const previous = this.koiSegments[index - 1];
      const current = this.koiSegments[index];
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const length = Math.hypot(dx, dy) || 1;
      const targetDistance = 10;
      const wave = Math.sin(time * 0.008 - index * 0.62) * index * 0.7;
      current.x = lerp(current.x, previous.x + (dx / length) * targetDistance + right.x * wave, Math.min(1, 12 * dt));
      current.y = lerp(current.y, previous.y + (dy / length) * targetDistance + right.y * wave, Math.min(1, 12 * dt));
    }
  }

  private updateCollectibles(dt: number, time: number, state: GameState): void {
    const hasMoteMagnet = (state.unlockedSkills || []).includes('koi_harmonic_bond');
    const hasDropletBonus = (state.unlockedSkills || []).includes('koi_pearl_gleaner');
    const hasDoubleSalvage = (state.unlockedSkills || []).includes('salvage_keen_eye');
    const reachDistance = (this.lanternMode === 'beacon' ? 70 : 45) * (hasMoteMagnet ? 1.75 : 1);

    for (const collectible of this.collectibles) {
      collectible.pulse = time * 0.004 + collectible.pulse;
      const dx = collectible.x - this.pos.x;
      const dy = collectible.y - this.pos.y;
      const itemDistance = Math.hypot(dx, dy);
      if (hasMoteMagnet && itemDistance < 180 && itemDistance > 10) {
        const pull = (180 - itemDistance) * 1.8 * dt;
        collectible.x -= (dx / itemDistance) * pull;
        collectible.y -= (dy / itemDistance) * pull;
      }
      if (itemDistance < reachDistance && time - this.lastCollectedAt > 180) {
        this.lastCollectedAt = time;
        if (collectible.type === 'droplet') {
          sound.playCollectDroplet();
          const earned = Math.round(collectible.value * (hasDropletBonus ? 1.5 : 1));
          this.updateState(previous => ({
            ...previous,
            droplets: previous.droplets + earned,
            stats: { ...previous.stats, koiAffinity: Math.min(100, previous.stats.koiAffinity + 2) },
          }));
        } else if (collectible.type === 'salvage') {
          sound.playBrassClink();
          const earnedDroplets = Math.round(collectible.value * (hasDropletBonus ? 1.5 : 1));
          const earnedFavors = hasDoubleSalvage ? 2 : 1;
          this.updateState(previous => ({
            ...previous,
            droplets: previous.droplets + earnedDroplets,
            favors: previous.favors + earnedFavors,
            logMessages: [{
              id: Date.now().toString(),
              text: `Recovered adrift message capsule (+${earnedDroplets} Droplets, +${earnedFavors} Favor${earnedFavors > 1 ? 's' : ''})`,
              time: 'Just now',
              type: 'reward',
            }, ...previous.logMessages],
          }));
        } else {
          sound.playLanternIgnite('ward');
          this.updateState(previous => ({
            ...previous,
            stormJars: previous.stormJars + 1,
            logMessages: [{
              id: Date.now().toString(),
              text: 'Harvested condensed Storm Jar from cloud well!',
              time: 'Just now',
              type: 'reward',
            }, ...previous.logMessages],
          }));
        }
        collectible.x = -9999;
        collectible.y = -9999;
      }
    }

    this.collectibles = this.collectibles.filter(item => item.x > -1000);
  }

  private activateGrapple(): void {
    if (this.grapple || this.grappleCharges <= 0) return;
    const forwardX = Math.cos(this.angle);
    const forwardY = Math.sin(this.angle);
    let bestAnchor: GrappleAnchor | null = null;
    let bestScore = Infinity;
    for (const anchor of this.grappleAnchors) {
      const dx = anchor.x - this.pos.x;
      const dy = anchor.y - this.pos.y;
      const depth = dx * forwardX + dy * forwardY;
      const anchorDistance = Math.hypot(dx, dy);
      if (depth > 35 && anchorDistance < 980) {
        const lateral = Math.abs(dx * -forwardY + dy * forwardX);
        const score = anchorDistance + lateral * 1.8;
        if (score < bestScore) {
          bestScore = score;
          bestAnchor = anchor;
        }
      }
    }
    if (!bestAnchor) return;
    this.grappleCharges -= 1;
    this.grapple = { anchor: bestAnchor, remaining: 1.25 };
    this.velocity.x = 0;
    this.velocity.y = 0;
    sound.playGrappleLaunch();
  }

  private activateGlider(): void {
    if (this.gliderTimer > 0 || this.gliderCharges <= 0) return;
    this.gliderCharges -= 1;
    this.gliderTimer = 5.5;
    this.velocity.x += Math.cos(this.angle) * 115;
    this.velocity.y += Math.sin(this.angle) * 115;
    sound.playPowerUp('wind_glider');
    this.updateState(previous => ({
      ...previous,
      logMessages: [{ id: Date.now().toString(), text: 'Wind-glider deployed. The skiff catches a high-altitude slipstream.', time: 'Just now', type: 'info' }, ...previous.logMessages],
    }));
  }

  private fireShockPulse(): void {
    if (this.shockCharges <= 0) return;
    this.shockCharges -= 1;
    const weaponLevel = this.getState().upgrades?.weapon || 0;
    const pulseRange = 310 + weaponLevel * 55;
    const pulseCone = 160 + weaponLevel * 18;
    this.shockPulseTimer = 0.5;
    this.shockPulseHit = false;
    sound.playShockPulse();

    let defeated = 0;
    for (const enemy of this.enemies) {
      if (enemy.health <= 0) continue;
      const enemyDistance = distance(this.pos, enemy);
      const dx = enemy.x - this.pos.x;
      const dy = enemy.y - this.pos.y;
      const forwardDistance = dx * Math.cos(this.angle) + dy * Math.sin(this.angle);
      const lateralDistance = Math.abs(dx * -Math.sin(this.angle) + dy * Math.cos(this.angle));
      if (enemyDistance < pulseRange && forwardDistance > 0 && lateralDistance < pulseCone) {
        enemy.health = 0;
        defeated += 1;
      }
    }
    if (defeated > 0) {
      this.shockPulseHit = true;
      this.updateState(previous => ({
        ...previous,
        favors: previous.favors + defeated,
        logMessages: [{ id: Date.now().toString(), text: `Shock pulse scattered ${defeated} raider skiff${defeated > 1 ? 's' : ''}. +${defeated} Favor`, time: 'Just now', type: 'reward' }, ...previous.logMessages],
      }));
    }
  }

  private updatePowerUps(dt: number, time: number, state: GameState): void {
    for (const powerUp of this.powerUps) {
      powerUp.pulse = time * 0.004 + powerUp.pulse;
      if (distance(this.pos, powerUp) > 56) continue;
      const label = powerUp.type === 'wind_glider' ? 'Wind-Glider Charge' : powerUp.type === 'grapple_charge' ? 'Grapple Charge' : powerUp.type === 'shock_cell' ? 'Shock Cell' : 'Hull Patch';
      sound.playPowerUp(powerUp.type);
      if (powerUp.type === 'wind_glider') this.gliderCharges += 1;
      if (powerUp.type === 'grapple_charge') this.grappleCharges += 1;
      if (powerUp.type === 'shock_cell') this.shockCharges += 1;
      if (powerUp.type === 'hull_patch') {
        this.updateState(previous => ({ ...previous, stats: { ...previous.stats, hullIntegrity: Math.min(previous.stats.maxHull, previous.stats.hullIntegrity + 22) } }));
      }
      this.updateState(previous => ({
        ...previous,
        logMessages: [{ id: Date.now().toString(), text: `Power-up acquired: ${label}.`, time: 'Just now', type: 'reward' }, ...previous.logMessages],
      }));
      powerUp.x = -9999;
      powerUp.y = -9999;
    }
    this.powerUps = this.powerUps.filter(item => item.x > -1000);
  }

  private updateEnemies(dt: number, state: GameState): void {
    const protectedByLantern = this.lanternMode === 'ward' || state.activeRig === 'storm_run';
    const hullLevel = state.upgrades?.hull || 0;
    const incomingDamage = Math.max(2, Math.round(8 * (1 - hullLevel * 0.08)));
    for (const enemy of this.enemies) {
      if (enemy.health <= 0) continue;
      enemy.phase += dt;
      enemy.attackTimer += dt;
      const driftRadius = 18;
      enemy.x += Math.cos(enemy.phase * 0.9) * driftRadius * dt;
      enemy.y += Math.sin(enemy.phase * 1.15) * driftRadius * dt;
      const enemyDistance = distance(this.pos, enemy);
      if (enemyDistance < 300 && enemy.attackTimer > 2.2) {
        enemy.attackTimer = 0;
        if (!protectedByLantern) {
          sound.playEnemyPulse();
          this.updateState(previous => ({
            ...previous,
            stats: { ...previous.stats, hullIntegrity: Math.max(0, previous.stats.hullIntegrity - incomingDamage) },
            logMessages: [{ id: Date.now().toString(), text: 'Raider skiff pulse hit the hull. Use X to fire a shock pulse.', time: 'Just now', type: 'hazard' }, ...previous.logMessages],
          }));
        }
      }
    }
    this.enemies = this.enemies.filter(enemy => enemy.health > 0);
  }

  private updateGrapple(dt: number): void {
    if (!this.grapple) return;
    const anchor = this.grapple.anchor;
    const dx = anchor.x - this.pos.x;
    const dy = anchor.y - this.pos.y;
    const anchorDistance = Math.hypot(dx, dy) || 1;
    const forwardX = Math.cos(this.angle);
    const forwardY = Math.sin(this.angle);
    const target = { x: anchor.x - forwardX * 62, y: anchor.y - forwardY * 62 };
    this.pos.x = lerp(this.pos.x, target.x, Math.min(1, dt * 5.5));
    this.pos.y = lerp(this.pos.y, target.y, Math.min(1, dt * 5.5));
    this.velocity.x = lerp(this.velocity.x, (dx / anchorDistance) * 120, Math.min(1, dt * 4));
    this.velocity.y = lerp(this.velocity.y, (dy / anchorDistance) * 120, Math.min(1, dt * 4));
    this.grapple.remaining -= dt;
    if (this.grapple.remaining <= 0 || anchorDistance < 82) {
      this.grapple = null;
      this.velocity.x *= 0.35;
      this.velocity.y *= 0.35;
    }
  }

  private updateStorm(dt: number, state: GameState): void {
    const inStorm = STORM_ZONES.some(zone => distance(this.pos, zone) < zone.radius);
    if (!inStorm) {
      this.stormDamageTimer = 0;
      return;
    }
    this.stormDamageTimer += dt;
    const isProtected = this.lanternMode === 'ward' || state.activeRig === 'storm_run';
    const hullLevel = state.upgrades?.hull || 0;
    const stormDamage = Math.max(1, Math.round(5 * (1 - hullLevel * 0.08)));
    if (this.stormDamageTimer > 1.8 && !isProtected) {
      this.stormDamageTimer = 0;
      sound.playThunderRumble();
      this.updateState(previous => ({
        ...previous,
        stats: { ...previous.stats, hullIntegrity: Math.max(0, previous.stats.hullIntegrity - stormDamage) },
        logMessages: [{
          id: Date.now().toString(),
          text: 'Storm surge rattles the skiff hull. Switch to WARD or equip Storm-Run.',
          time: 'Just now',
          type: 'hazard',
        }, ...previous.logMessages],
      }));
    }
  }

  private updateSpatialAudio(dt: number): void {
    this.spatialAudioTimer += dt;
    if (this.spatialAudioTimer < 0.08) return;
    this.spatialAudioTimer = 0;

    const wind = this.currentWind();
    let windIntensity = 0;
    let pan = 0;
    if (wind) {
      windIntensity = clamp(wind.speed / 2.5, 0.35, 1);
      const windX = wind.x2 - wind.x1;
      const windY = wind.y2 - wind.y1;
      const windLength = Math.hypot(windX, windY) || 1;
      const rightX = -Math.sin(this.angle);
      const rightY = Math.cos(this.angle);
      pan = clamp(((windX / windLength) * rightX + (windY / windLength) * rightY) * 1.3, -1, 1);
    }

    let stormIntensity = 0;
    let stormPan = pan;
    let nearestStormDistance = Infinity;
    for (const zone of STORM_ZONES) {
      const dx = zone.x - this.pos.x;
      const dy = zone.y - this.pos.y;
      const currentDistance = Math.hypot(dx, dy);
      if (currentDistance < nearestStormDistance) {
        nearestStormDistance = currentDistance;
        const rightX = -Math.sin(this.angle);
        const rightY = Math.cos(this.angle);
        stormPan = clamp(((dx * rightX + dy * rightY) / Math.max(zone.radius * 1.6, 1)), -1, 1);
      }
      stormIntensity = Math.max(stormIntensity, clamp(1 - currentDistance / (zone.radius * 1.6), 0, 1));
    }

    sound.updateFlightSpatialAudio(windIntensity, stormIntensity, stormIntensity > 0.05 ? stormPan : pan);
  }

  private telemetry(): FlightTelemetry {
    let nearbyDistrict: DistrictId | null = null;
    let nearbyDistance = Infinity;
    for (const [districtId, district] of Object.entries(DISTRICTS) as [DistrictId, typeof DISTRICTS[DistrictId]][]) {
      const currentDistance = distance(this.pos, district.coordinates);
      if (currentDistance < nearbyDistance) {
        nearbyDistance = currentDistance;
        nearbyDistrict = districtId;
      }
    }
    if (nearbyDistance > 96) nearbyDistrict = null;

    const waypoint = this.getState().mapWaypoint;
    return {
      speed: Math.round(Math.hypot(this.velocity.x, this.velocity.y) * 0.52),
      nearbyDistrict,
      nearbyDistance: Math.round(nearbyDistance),
      inWind: Boolean(this.currentWind()),
      inStorm: STORM_ZONES.some(zone => distance(this.pos, zone) < zone.radius),
      waypointDistance: waypoint ? Math.round(distance(this.pos, waypoint)) : null,
      lanternMode: this.lanternMode,
      playerX: this.pos.x,
      playerY: this.pos.y,
      playerAngle: this.angle,
      radarBlips: [
        ...(Object.values(DISTRICTS).map(district => ({ id: district.id, x: district.coordinates.x, y: district.coordinates.y, type: 'district' as const, accent: district.accentColor }))),
        ...(LANDMARKS.filter(landmark => !landmark.districtId).map(landmark => ({ id: landmark.id, x: landmark.coordinates.x, y: landmark.coordinates.y, type: 'landmark' as const, accent: landmark.type === 'hazard_zone' ? '#f43f5e' : '#c084fc' }))),
        ...(this.collectibles.map(item => ({ id: item.id, x: item.x, y: item.y, type: 'collectible' as const, accent: item.type === 'salvage' ? '#f59e0b' : item.type === 'storm_charge' ? '#a78bfa' : '#38bdf8' }))),
        ...(this.powerUps.map(item => ({ id: item.id, x: item.x, y: item.y, type: 'powerup' as const, accent: item.type === 'wind_glider' ? '#2dd4bf' : item.type === 'grapple_charge' ? '#f59e0b' : item.type === 'shock_cell' ? '#f43f5e' : '#a3e635' }))),
        ...(this.enemies.map(item => ({ id: item.id, x: item.x, y: item.y, type: 'enemy' as const, accent: '#f43f5e' }))),
        ...(this.grappleAnchors.map(item => ({ id: item.id, x: item.x, y: item.y, type: 'anchor' as const, accent: '#f9c74f' }))),
        ...(STORM_ZONES.map((zone, index) => ({ id: `storm-${index}`, x: zone.x, y: zone.y, type: 'storm' as const, accent: '#818cf8' }))),
      ],
      gliderCharges: this.gliderCharges,
      grappleCharges: this.grappleCharges,
      shockCharges: this.shockCharges,
      gliderActive: this.gliderTimer > 0,
      grappleActive: Boolean(this.grapple),
      combatTargetCount: this.enemies.length,
      powerUpCount: this.powerUps.length,
    };
  }

  private project(point: Vec2): ProjectedPoint | null {
    const dx = point.x - this.pos.x;
    const dy = point.y - this.pos.y;
    const forwardX = Math.cos(this.angle);
    const forwardY = Math.sin(this.angle);
    const rightX = -forwardY;
    const rightY = forwardX;
    const depth = dx * forwardX + dy * forwardY;
    const lateral = dx * rightX + dy * rightY;
    if (depth < 6) return null;
    const scale = this.focalLength / depth;
    return {
      x: this.width / 2 + lateral * scale,
      depth,
      groundY: this.horizon + this.height * 0.4 * (140 / depth),
      scale,
    };
  }

  private render(time: number): void {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    if (!width || !height) return;

    ctx.clearRect(0, 0, width, height);
    this.renderSky(time);
    this.renderCloudFloor(time);
    this.renderWorld(time);
    this.renderKoi(time);
    this.renderGrappleLine();
    this.renderShockPulse(time);
    this.renderSkiff(time);
    this.renderScanlines();
    this.renderVignette();
  }

  private renderSky(time: number): void {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, this.horizon);
    gradient.addColorStop(0, '#030713');
    gradient.addColorStop(0.56, '#07172c');
    gradient.addColorStop(1, '#123357');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.horizon + 2);

    for (const star of STAR_FIELD) {
      const twinkle = 0.35 + 0.65 * Math.sin(time * 0.001 + star.phase) ** 2;
      ctx.fillStyle = `rgba(170, 230, 255, ${twinkle * 0.75})`;
      ctx.fillRect(star.x * this.width, star.y * this.height, star.size, star.size);
    }

    const moonX = this.width * 0.2;
    const moonY = this.height * 0.2;
    const moonRadius = Math.min(this.width, this.height) * 0.075;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = '#bceeff';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#07172c';
    ctx.beginPath();
    ctx.arc(moonX + moonRadius * 0.36, moonY - moonRadius * 0.18, moonRadius * 0.94, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.26;
    ctx.fillStyle = '#1d5380';
    for (let index = 0; index < 11; index += 1) {
      const drift = ((time * 0.012 + index * 173) % (this.width + 240)) - 120;
      const cloudY = this.horizon - 20 - (index % 3) * 28;
      ctx.beginPath();
      ctx.ellipse(drift, cloudY, 130 + (index % 4) * 26, 20 + (index % 3) * 9, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderCloudFloor(time: number): void {
    const ctx = this.ctx;
    const floorGradient = ctx.createLinearGradient(0, this.horizon, 0, this.height);
    floorGradient.addColorStop(0, '#0b2943');
    floorGradient.addColorStop(0.35, '#071d35');
    floorGradient.addColorStop(1, '#020913');
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, this.horizon, this.width, this.height - this.horizon);

    const horizonGlow = ctx.createLinearGradient(0, this.horizon - 18, 0, this.horizon + 100);
    horizonGlow.addColorStop(0, 'rgba(77, 221, 255, 0.34)');
    horizonGlow.addColorStop(1, 'rgba(77, 221, 255, 0)');
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, this.horizon - 18, this.width, 120);

    ctx.save();
    ctx.globalAlpha = 0.13;
    for (let y = this.horizon + 12; y < this.height; y += 13) {
      const wave = Math.sin(time * 0.0008 + y * 0.035) * 6;
      ctx.strokeStyle = y % 26 === 0 ? '#3981a9' : '#1d4d6d';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y + wave);
      ctx.lineTo(this.width, y - wave * 0.5);
      ctx.stroke();
    }
    ctx.restore();

    this.renderPerspectiveGrid();
  }

  private renderPerspectiveGrid(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.33;
    ctx.lineWidth = Math.max(1, this.width / 1100);
    const forward = { x: Math.cos(this.angle), y: Math.sin(this.angle) };
    const right = { x: -forward.y, y: forward.x };
    for (let lane = -5; lane <= 5; lane += 1) {
      const far = { x: this.pos.x + forward.x * 1400 + right.x * lane * 120, y: this.pos.y + forward.y * 1400 + right.y * lane * 120 };
      const near = { x: this.pos.x + forward.x * 35 + right.x * lane * 120, y: this.pos.y + forward.y * 35 + right.y * lane * 120 };
      const farProjected = this.project(far);
      const nearProjected = this.project(near);
      if (!farProjected || !nearProjected) continue;
      ctx.strokeStyle = lane === 0 ? '#52efff' : '#1b92b7';
      ctx.beginPath();
      ctx.moveTo(nearProjected.x, nearProjected.groundY);
      ctx.lineTo(farProjected.x, farProjected.groundY);
      ctx.stroke();
    }
    for (const depth of [90, 150, 240, 370, 560, 820, 1160]) {
      const left = this.project({ x: this.pos.x + forward.x * depth - right.x * 680, y: this.pos.y + forward.y * depth - right.y * 680 });
      const rightPoint = this.project({ x: this.pos.x + forward.x * depth + right.x * 680, y: this.pos.y + forward.y * depth + right.y * 680 });
      if (!left || !rightPoint) continue;
      ctx.strokeStyle = depth < 250 ? 'rgba(79, 221, 255, 0.48)' : 'rgba(43, 133, 164, 0.24)';
      ctx.beginPath();
      ctx.moveTo(left.x, left.groundY);
      ctx.lineTo(rightPoint.x, rightPoint.groundY);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderWorld(time: number): void {
    const renderables: Renderable[] = [];

    for (const [districtId, district] of Object.entries(DISTRICTS) as [DistrictId, typeof DISTRICTS[DistrictId]][]) {
      const projected = this.project(district.coordinates);
      if (!projected || projected.x < -500 || projected.x > this.width + 500) continue;
      renderables.push({
        depth: projected.depth,
        render: () => this.renderDistrict(districtId, projected, time),
      });
    }

    for (const landmark of LANDMARKS.filter(item => !item.districtId)) {
      const projected = this.project(landmark.coordinates);
      if (!projected || projected.x < -500 || projected.x > this.width + 500) continue;
      renderables.push({ depth: projected.depth, render: () => this.renderLandmark(landmark.coordinates, landmark.type, projected, time) });
    }

    for (const collectible of this.collectibles) {
      const projected = this.project({ x: collectible.x, y: collectible.y });
      if (!projected || projected.x < -300 || projected.x > this.width + 300) continue;
      renderables.push({ depth: projected.depth, render: () => this.renderCollectible(collectible, projected, time) });
    }

    for (const powerUp of this.powerUps) {
      const projected = this.project(powerUp);
      if (!projected || projected.x < -300 || projected.x > this.width + 300) continue;
      renderables.push({ depth: projected.depth, render: () => this.renderPowerUp(powerUp, projected, time) });
    }

    for (const enemy of this.enemies) {
      const projected = this.project(enemy);
      if (!projected || projected.x < -400 || projected.x > this.width + 400) continue;
      renderables.push({ depth: projected.depth, render: () => this.renderEnemy(enemy, projected, time) });
    }

    for (const anchor of this.grappleAnchors) {
      const projected = this.project(anchor);
      if (!projected || projected.x < -400 || projected.x > this.width + 400) continue;
      renderables.push({ depth: projected.depth, render: () => this.renderGrappleAnchor(anchor, projected, time) });
    }

    for (const zone of STORM_ZONES) {
      const projected = this.project(zone);
      if (!projected || projected.x < -500 || projected.x > this.width + 500) continue;
      renderables.push({ depth: projected.depth, render: () => this.renderStorm(zone, projected, time) });
    }

    renderables.sort((a, b) => b.depth - a.depth);
    for (const item of renderables) item.render();
  }

  private renderDistrict(districtId: DistrictId, projected: ProjectedPoint, time: number): void {
    const ctx = this.ctx;
    const district = DISTRICTS[districtId];
    const scale = projected.scale;
    const baseY = projected.groundY;
    const accent = district.accentColor;
    const width = clamp(260 * scale, 18, this.width * 0.64);
    const height = clamp(230 * scale, 15, this.height * 0.42);
    const pillarWidth = Math.max(5, width * 0.14);
    const pillarHeight = height * 0.68;
    const leftX = projected.x - width * 0.36;
    const rightX = projected.x + width * 0.36;

    ctx.save();
    ctx.globalAlpha = clamp(1.15 - projected.depth / 1800, 0.42, 1);
    ctx.fillStyle = 'rgba(1, 7, 17, 0.75)';
    ctx.beginPath();
    ctx.ellipse(projected.x, baseY + 5, width * 0.64, Math.max(3, width * 0.13), 0, 0, Math.PI * 2);
    ctx.fill();

    this.drawMarketFacade(projected.x - width * 0.33, baseY - height * 0.12, width * 0.34, height * 0.44, accent, -1, time);
    this.drawMarketFacade(projected.x + width * 0.33, baseY - height * 0.12, width * 0.34, height * 0.44, accent, 1, time + 0.7);

    ctx.fillStyle = '#172a3b';
    ctx.fillRect(projected.x - width * 0.55, baseY - Math.max(3, height * 0.12), width * 1.1, Math.max(4, height * 0.12));
    ctx.strokeStyle = '#8d713e';
    ctx.lineWidth = Math.max(1, height * 0.018);
    for (let plank = -4; plank <= 4; plank += 1) {
      const plankX = projected.x + plank * width * 0.11;
      ctx.beginPath();
      ctx.moveTo(plankX, baseY - height * 0.115);
      ctx.lineTo(plankX + width * 0.025, baseY - height * 0.02);
      ctx.stroke();
    }
    ctx.strokeStyle = accent;
    ctx.globalAlpha *= 0.8;
    ctx.strokeRect(projected.x - width * 0.55, baseY - Math.max(3, height * 0.12), width * 1.1, Math.max(4, height * 0.12));
    ctx.globalAlpha = clamp(1.15 - projected.depth / 1800, 0.42, 1);

    this.drawPillar(leftX, baseY, pillarWidth, pillarHeight, accent, time);
    this.drawPillar(rightX, baseY, pillarWidth, pillarHeight, accent, time + 1.2);

    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(2, pillarWidth * 0.22);
    ctx.shadowBlur = Math.min(24, pillarWidth * 2.5);
    ctx.shadowColor = accent;
    ctx.beginPath();
    ctx.moveTo(leftX, baseY - pillarHeight * 0.93);
    ctx.quadraticCurveTo(projected.x, baseY - height * 1.05, rightX, baseY - pillarHeight * 0.93);
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (let lamp = -1; lamp <= 1; lamp += 1) {
      const lampX = projected.x + lamp * width * 0.18;
      const lampY = baseY - height * (0.78 + (1 - Math.abs(lamp) * 0.08) * 0.05);
      const lampSize = clamp(width * 0.05, 2, 12);
      ctx.fillStyle = '#ff9f43';
      ctx.shadowBlur = Math.min(20, lampSize * 2.8);
      ctx.shadowColor = '#ff8d24';
      ctx.fillRect(lampX - lampSize, lampY - lampSize * 1.8, lampSize * 2, lampSize * 3.6);
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = accent;
    ctx.globalAlpha *= 0.85;
    ctx.font = `600 ${clamp(13 * scale, 7, 18)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(district.name.toUpperCase(), projected.x, baseY - height * 1.28);
    ctx.restore();
  }

  private drawPillar(x: number, baseY: number, width: number, height: number, accent: string, time: number): void {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(x - width, 0, x + width, 0);
    gradient.addColorStop(0, '#172236');
    gradient.addColorStop(0.42, '#526077');
    gradient.addColorStop(0.62, '#202e42');
    gradient.addColorStop(1, '#0a1220');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - width / 2, baseY - height, width, height);
    ctx.strokeStyle = '#b18b52';
    ctx.lineWidth = Math.max(1, width * 0.08);
    ctx.strokeRect(x - width / 2, baseY - height, width, height);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.48 + 0.2 * Math.sin(time * 0.003);
    ctx.fillRect(x - width * 0.19, baseY - height * 0.68, width * 0.38, height * 0.17);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#101827';
    ctx.fillRect(x - width * 0.7, baseY - height * 0.1, width * 1.4, Math.max(2, height * 0.1));
    ctx.strokeStyle = 'rgba(220, 191, 123, 0.7)';
    ctx.lineWidth = Math.max(1, width * 0.035);
    for (let band = 1; band < 5; band += 1) {
      const bandY = baseY - height * (band / 5);
      ctx.beginPath();
      ctx.moveTo(x - width * 0.46, bandY);
      ctx.lineTo(x + width * 0.46, bandY);
      ctx.stroke();
    }
  }

  private drawMarketFacade(x: number, baseY: number, width: number, height: number, accent: string, side: -1 | 1, time: number): void {
    const ctx = this.ctx;
    const left = x - width / 2;
    const top = baseY - height;
    const wallGradient = ctx.createLinearGradient(left, top, left + width, baseY);
    wallGradient.addColorStop(0, '#0c1829');
    wallGradient.addColorStop(0.5, '#27384b');
    wallGradient.addColorStop(1, '#101b2b');
    ctx.fillStyle = wallGradient;
    ctx.fillRect(left, top, width, height);
    ctx.strokeStyle = '#9b7845';
    ctx.lineWidth = Math.max(1, width * 0.045);
    ctx.strokeRect(left, top, width, height);

    ctx.strokeStyle = 'rgba(196, 158, 91, 0.38)';
    ctx.lineWidth = Math.max(1, width * 0.015);
    for (let row = 1; row < 5; row += 1) {
      const rowY = top + row * height / 5;
      ctx.beginPath();
      ctx.moveTo(left, rowY);
      ctx.lineTo(left + width, rowY);
      ctx.stroke();
    }
    for (let column = 1; column < 4; column += 1) {
      const columnX = left + column * width / 4;
      ctx.beginPath();
      ctx.moveTo(columnX, top);
      ctx.lineTo(columnX, baseY);
      ctx.stroke();
    }

    const windowSize = Math.max(2, width * 0.13);
    for (let window = 0; window < 4; window += 1) {
      const windowX = left + width * (0.17 + (window % 2) * 0.56);
      const windowY = top + height * (0.23 + Math.floor(window / 2) * 0.38);
      ctx.fillStyle = window % 3 === 0 ? '#ffd58a' : '#ff9d4a';
      ctx.globalAlpha = 0.68 + 0.22 * Math.sin(time * 0.003 + window);
      ctx.shadowBlur = Math.min(14, width * 0.12);
      ctx.shadowColor = '#ff9d4a';
      ctx.fillRect(windowX - windowSize / 2, windowY - windowSize / 2, windowSize, windowSize * 0.72);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    const roofOverhang = width * 0.14;
    ctx.fillStyle = side < 0 ? '#124f5b' : '#155060';
    ctx.beginPath();
    ctx.moveTo(left - roofOverhang, top + height * 0.08);
    ctx.lineTo(left + width / 2, top - height * 0.28);
    ctx.lineTo(left + width + roofOverhang, top + height * 0.08);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1, width * 0.025);
    ctx.stroke();

    ctx.fillStyle = '#c27639';
    ctx.fillRect(left + width * 0.07, top - height * 0.4, Math.max(2, width * 0.04), height * 0.4);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.86;
    ctx.beginPath();
    ctx.moveTo(left + width * 0.09, top - height * 0.36);
    ctx.lineTo(left + width * 0.37, top - height * 0.28);
    ctx.lineTo(left + width * 0.09, top - height * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  private renderLandmark(point: Vec2, type: string, projected: ProjectedPoint, time: number): void {
    const ctx = this.ctx;
    const size = clamp(120 * projected.scale, 4, 120);
    const y = projected.groundY;
    ctx.save();
    ctx.translate(projected.x, y - size * 0.55);
    ctx.globalAlpha = clamp(1.2 - projected.depth / 1700, 0.35, 0.9);
    ctx.shadowBlur = Math.min(26, size * 0.4);
    ctx.shadowColor = type === 'hazard_zone' ? '#fb4f98' : '#54e8ff';
    if (type === 'ancient_wonder') {
      ctx.fillStyle = '#916d3a';
      ctx.fillRect(-size * 0.15, -size * 0.5, size * 0.3, size);
      ctx.strokeStyle = '#e9b95f';
      ctx.strokeRect(-size * 0.22, -size * 0.54, size * 0.44, size * 0.08);
    } else if (type === 'salvage_wreck') {
      ctx.fillStyle = '#5c3b25';
      ctx.rotate(-0.2);
      ctx.fillRect(-size * 0.46, -size * 0.18, size * 0.92, size * 0.36);
      ctx.fillStyle = '#e3a241';
      ctx.fillRect(-size * 0.24, -size * 0.1, size * 0.15, size * 0.2);
    } else if (type === 'hazard_zone') {
      ctx.strokeStyle = '#f75b9d';
      ctx.lineWidth = Math.max(1, size * 0.06);
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size * 0.42, size * 0.08);
      ctx.lineTo(size * 0.4, -size * 0.12);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#3adfda';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  private renderPowerUp(powerUp: PowerUp, projected: ProjectedPoint, time: number): void {
    const ctx = this.ctx;
    const size = clamp(24 * projected.scale, 4, 32);
    const bob = Math.sin(time * 0.005 + powerUp.pulse) * size * 0.25;
    const y = projected.groundY - size * 1.8 + bob;
    const color = powerUp.type === 'wind_glider' ? '#2dd4bf' : powerUp.type === 'grapple_charge' ? '#f59e0b' : powerUp.type === 'shock_cell' ? '#f43f5e' : '#a3e635';
    const glyph = powerUp.type === 'wind_glider' ? '»' : powerUp.type === 'grapple_charge' ? '⌁' : powerUp.type === 'shock_cell' ? '×' : '+';

    ctx.save();
    ctx.globalAlpha = clamp(1.25 - projected.depth / 1800, 0.48, 1);
    ctx.translate(projected.x, y);
    ctx.rotate(Math.sin(time * 0.002 + powerUp.pulse) * 0.15);
    ctx.shadowBlur = Math.min(28, size * 2);
    ctx.shadowColor = color;
    ctx.fillStyle = 'rgba(4, 16, 27, 0.92)';
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, size * 0.1);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.78, -size * 0.42);
    ctx.lineTo(size * 0.78, size * 0.42);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.78, size * 0.42);
    ctx.lineTo(-size * 0.78, -size * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.font = `bold ${Math.max(8, size * 1.15)}px ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(glyph, 0, 0);
    ctx.restore();
  }

  private renderEnemy(enemy: EnemySkiff, projected: ProjectedPoint, time: number): void {
    const ctx = this.ctx;
    const size = clamp(30 * projected.scale, 4, 42);
    const y = projected.groundY - size * 1.2 + Math.sin(time * 0.004 + enemy.phase) * size * 0.16;
    ctx.save();
    ctx.globalAlpha = clamp(1.25 - projected.depth / 1700, 0.5, 1);
    ctx.translate(projected.x, y);
    ctx.shadowBlur = Math.min(24, size * 1.4);
    ctx.shadowColor = '#f43f5e';
    ctx.fillStyle = '#240d24';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = Math.max(1, size * 0.08);
    ctx.beginPath();
    ctx.moveTo(-size * 1.15, size * 0.32);
    ctx.lineTo(-size * 0.42, -size * 0.34);
    ctx.lineTo(size * 0.45, -size * 0.28);
    ctx.lineTo(size * 1.15, size * 0.32);
    ctx.lineTo(size * 0.55, size * 0.62);
    ctx.lineTo(-size * 0.62, size * 0.62);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ff9b45';
    ctx.fillRect(-size * 0.19, size * 0.04, size * 0.38, size * 0.22);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.3);
    ctx.lineTo(0, -size * 0.98);
    ctx.lineTo(size * 0.25, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
    ctx.lineWidth = Math.max(1, size * 0.05);
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private renderGrappleAnchor(anchor: GrappleAnchor, projected: ProjectedPoint, time: number): void {
    const ctx = this.ctx;
    const size = clamp(25 * projected.scale, 4, 30);
    const y = projected.groundY - size * 1.15;
    ctx.save();
    ctx.globalAlpha = clamp(1.25 - projected.depth / 1600, 0.42, 1);
    ctx.translate(projected.x, y);
    ctx.shadowBlur = Math.min(26, size * 1.8);
    ctx.shadowColor = '#f9c74f';
    ctx.strokeStyle = '#f9c74f';
    ctx.lineWidth = Math.max(1, size * 0.14);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#203849';
    ctx.fillRect(-size * 0.16, -size * 1.12, size * 0.32, size * 0.54);
    ctx.fillStyle = '#f9c74f';
    ctx.globalAlpha = 0.7 + Math.sin(time * 0.004 + anchor.x) * 0.2;
    ctx.fillRect(-size * 0.22, -size * 0.16, size * 0.44, size * 0.32);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  private renderCollectible(item: Collectible, projected: ProjectedPoint, time: number): void {
    const ctx = this.ctx;
    const scale = clamp(projected.scale, 0.02, 2);
    const size = clamp((item.type === 'salvage' ? 32 : 23) * scale, 3, 36);
    const bob = Math.sin(time * 0.006 + item.pulse) * size * 0.22;
    const y = projected.groundY - size * 0.9 + bob;
    const color = item.type === 'droplet' ? '#4fe9ff' : item.type === 'salvage' ? '#e9a94e' : '#b78aff';

    ctx.save();
    ctx.globalAlpha = clamp(1.2 - projected.depth / 1800, 0.4, 1);
    ctx.shadowBlur = Math.min(30, size * 1.7);
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    if (item.type === 'droplet') {
      ctx.beginPath();
      ctx.moveTo(projected.x, y - size);
      ctx.quadraticCurveTo(projected.x + size * 0.9, y - size * 0.15, projected.x, y + size * 0.72);
      ctx.quadraticCurveTo(projected.x - size * 0.9, y - size * 0.15, projected.x, y - size);
      ctx.fill();
      ctx.fillStyle = '#e3fbff';
      ctx.fillRect(projected.x - size * 0.13, y - size * 0.56, Math.max(1, size * 0.2), Math.max(1, size * 0.26));
    } else {
      ctx.fillRect(projected.x - size, y - size * 0.55, size * 2, size * 1.1);
      ctx.fillStyle = item.type === 'salvage' ? '#fff0b1' : '#dfc8ff';
      ctx.fillRect(projected.x - size * 0.46, y - size * 0.25, size * 0.92, size * 0.5);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, size * 0.09);
      ctx.strokeRect(projected.x - size, y - size * 0.55, size * 2, size * 1.1);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  private renderStorm(zone: { x: number; y: number; radius: number }, projected: ProjectedPoint, time: number): void {
    const ctx = this.ctx;
    const radius = clamp(zone.radius * projected.scale * 0.5, 10, this.width * 0.46);
    const baseY = projected.groundY;
    ctx.save();
    ctx.globalAlpha = clamp(0.2 + 0.7 * (1 - projected.depth / 1600), 0.16, 0.72);
    ctx.strokeStyle = '#817dff';
    ctx.shadowBlur = Math.min(24, radius * 0.18);
    ctx.shadowColor = '#6d72ff';
    ctx.lineWidth = Math.max(1, radius * 0.022);
    ctx.beginPath();
    ctx.ellipse(projected.x, baseY, radius, radius * 0.25, 0, 0, Math.PI * 2);
    ctx.stroke();
    for (let arc = -1; arc <= 1; arc += 1) {
      const x = projected.x + arc * radius * 0.3;
      const top = baseY - radius * 2.5;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x - radius * 0.15, top + radius * 0.45);
      ctx.lineTo(x + radius * 0.06, top + radius * 0.84);
      ctx.lineTo(x - radius * 0.1, baseY - radius * 0.2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  private renderKoi(time: number): void {
    const ctx = this.ctx;
    for (let index = this.koiSegments.length - 1; index >= 0; index -= 1) {
      const projected = this.project(this.koiSegments[index]);
      if (!projected) continue;
      const size = clamp((index === 0 ? 18 : 13 - index * 0.45) * projected.scale, 1.5, 13);
      ctx.save();
      ctx.globalAlpha = clamp(1 - projected.depth / 1100, 0.12, 0.82) * (1 - index / 20);
      ctx.fillStyle = index === 0 ? '#72f4ff' : '#2bc9db';
      ctx.shadowBlur = Math.min(26, size * 2);
      ctx.shadowColor = '#32e4ff';
      ctx.beginPath();
      ctx.ellipse(projected.x, projected.groundY - size, size * 1.8, size, Math.sin(time * 0.004 + index) * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderGrappleLine(): void {
    if (!this.grapple) return;
    const projected = this.project(this.grapple.anchor);
    if (!projected) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#f9c74f';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#f59e0b';
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = Math.max(1.5, this.width * 0.0025);
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(this.width / 2, this.height * 0.76);
    ctx.lineTo(projected.x, projected.groundY - 18 * projected.scale);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  private renderShockPulse(time: number): void {
    if (this.shockPulseTimer <= 0) return;
    const ctx = this.ctx;
    const progress = 1 - this.shockPulseTimer / 0.5;
    const radius = this.width * (0.04 + progress * 0.42);
    ctx.save();
    ctx.globalAlpha = (1 - progress) * 0.85;
    ctx.strokeStyle = this.shockPulseHit ? '#fef08a' : '#f43f5e';
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.shockPulseHit ? '#f59e0b' : '#f43f5e';
    ctx.lineWidth = Math.max(2, this.width * 0.004);
    ctx.beginPath();
    ctx.ellipse(this.width / 2, this.height * 0.58, radius, radius * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private renderSkiff(time: number): void {
    const ctx = this.ctx;
    const center = this.width / 2;
    const bottom = this.height + 8;
    const hullTop = this.height * 0.76;
    const sway = Math.sin(time * 0.002) * 2;

    ctx.save();
    ctx.translate(sway, 0);
    ctx.fillStyle = 'rgba(0, 4, 10, 0.92)';
    ctx.beginPath();
    ctx.moveTo(center - this.width * 0.4, bottom);
    ctx.lineTo(center - this.width * 0.23, hullTop);
    ctx.lineTo(center - this.width * 0.08, hullTop - 20);
    ctx.lineTo(center, hullTop - 28);
    ctx.lineTo(center + this.width * 0.08, hullTop - 20);
    ctx.lineTo(center + this.width * 0.23, hullTop);
    ctx.lineTo(center + this.width * 0.4, bottom);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#c78c3c';
    ctx.lineWidth = Math.max(3, this.width * 0.006);
    ctx.beginPath();
    ctx.moveTo(center - this.width * 0.39, bottom);
    ctx.lineTo(center - this.width * 0.22, hullTop);
    ctx.lineTo(center, hullTop - 26);
    ctx.lineTo(center + this.width * 0.22, hullTop);
    ctx.lineTo(center + this.width * 0.39, bottom);
    ctx.stroke();

    ctx.fillStyle = '#183d48';
    ctx.fillRect(center - this.width * 0.09, hullTop - 6, this.width * 0.18, this.height * 0.2);
    ctx.strokeStyle = '#38dbe5';
    ctx.strokeRect(center - this.width * 0.09, hullTop - 6, this.width * 0.18, this.height * 0.2);

    const lanternGlow = ctx.createRadialGradient(center, hullTop + 36, 2, center, hullTop + 36, this.width * 0.18);
    lanternGlow.addColorStop(0, 'rgba(77, 238, 255, 0.84)');
    lanternGlow.addColorStop(1, 'rgba(77, 238, 255, 0)');
    ctx.fillStyle = lanternGlow;
    ctx.fillRect(center - this.width * 0.2, hullTop - 40, this.width * 0.4, this.height * 0.33);

    ctx.fillStyle = '#54efff';
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#3cecff';
    ctx.fillRect(center - this.width * 0.035, hullTop + 18, this.width * 0.07, this.height * 0.09);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#bd7331';
    ctx.lineWidth = Math.max(4, this.width * 0.007);
    ctx.beginPath();
    ctx.moveTo(center, hullTop - 30);
    ctx.lineTo(center, this.height * 0.55);
    ctx.stroke();
    ctx.fillStyle = '#e75c32';
    ctx.beginPath();
    ctx.moveTo(center + 4, this.height * 0.58);
    ctx.lineTo(center + this.width * 0.085, this.height * 0.71);
    ctx.lineTo(center + 4, this.height * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private renderScanlines(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#b7f5ff';
    for (let y = 0; y < this.height; y += 4) ctx.fillRect(0, y, this.width, 1);
    ctx.restore();
  }

  private renderVignette(): void {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(this.width / 2, this.height * 0.45, this.height * 0.12, this.width / 2, this.height * 0.45, this.width * 0.76);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.58)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
