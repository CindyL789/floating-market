export type DistrictId = 'lantern_bazaar' | 'undertow_den' | 'storm_anchor_shrine' | 'pilgrim_haven' | 'celestial_pier';
export type RigId = 'standard_courier' | 'dawn_dock' | 'storm_run' | 'undertow_civilian';
export type LanternMode = 'beacon' | 'signal' | 'ward';
export type BiomeId = 'lantern_shallows' | 'undertow_abyss' | 'storm_anchor_rift' | 'pilgrim_drift' | 'celestial_zenith' | 'maelstrom_vortex';
export type SkillCategory = 'lantern' | 'hull_mobility' | 'koi_synergy' | 'trade_prestige';

export interface CharacterCustomization {
  name: string;
  title: string;
  pronouns: string;
  bodyType: string;
  skinTone: string;
  faceShape: string;
  eyeStyle: string;
  eyeColor: string;
  eyebrows: string;
  facialFeature: string;
  hairstyle: string;
  hairColor: string;
  initialOutfit: RigId;
  accessory: string;
  koiCompanionColor: string;
  backstory: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  tier: number;
  costFavors: number;
  icon: string;
  description: string;
  effectLabel: string;
  statsEffectDescription: string;
  prerequisites?: string[];
}

export interface BiomeRegion {
  id: BiomeId;
  name: string;
  subtitle: string;
  description: string;
  dangerLevel: string;
  weather: string;
  color: string;
  accentColor: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  specialDrop: string;
  windCurrent: string;
}

export interface LandmarkInfo {
  id: string;
  name: string;
  type: string;
  districtId?: DistrictId;
  x: number;
  y: number;
  icon: string;
  description: string;
  discoveryBonus: string;
  discovered?: boolean;
  image?: string;
}

export interface ArtWorkEntry {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  description: string;
  loreQuote: string;
  artistNote: string;
}

export interface GearRig {
  id: RigId;
  name: string;
  subtitle: string;
  description: string;
  perks: string[];
  visualFeatures: string[];
  colorTheme: string;
  unlocked: boolean;
  cost: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  count: number;
  iconName: string;
  value: number;
}

export interface Quest {
  id: string;
  chapter: number;
  title: string;
  giver: string;
  giverLocation: DistrictId;
  destination: DistrictId;
  description: string;
  requiredRig?: RigId;
  rewardDroplets: number;
  rewardFavors: number;
  rewardItems?: string[];
  completed: boolean;
  active: boolean;
  stepDescription: string;
  dialogueIdOnComplete?: string;
}

export interface DeliveryContract {
  id: string;
  client: string;
  title: string;
  origin: DistrictId;
  destination: DistrictId;
  cargo: string;
  urgency: string;
  hazard: string;
  rewardDroplets: number;
  rewardFavors: number;
  flavorText: string;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  districtId: DistrictId;
  avatarMood: string;
  greeting: string;
  dialogueTreeId: string;
  affinity: number;
  portrait?: string;
  iconEmoji: string;
}

export interface DialogueChoice {
  text: string;
  nextNodeId?: string;
  actionType?: string;
  requiredFavor?: number;
  requiredRig?: RigId;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  portrait: string;
  text: string;
  choices: DialogueChoice[];
}

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  epithet: string;
  description: string;
  visualDirection: string;
  designTakeaway: string;
  x: number;
  y: number;
  accentColor: string;
  bgGradient: string;
  npcs: string[];
  availableServices: string[];
  image?: string;
}

export interface PlayerStats {
  hullIntegrity: number;
  maxHull: number;
  speedLevel: number;
  lanternPower: number;
  maxLanternPower: number;
  koiAffinity: number;
}

export interface UpgradeLevels {
  hull: number;
  engine: number;
  weapon: number;
}

export interface LogMessage {
  id: string;
  text: string;
  time: string;
  type: string;
}

export interface Waypoint {
  x: number;
  y: number;
  label: string;
}

export interface Reputation {
  lanternGuild: number;
  undertowSyndicate: number;
  anchorMonks: number;
}

export interface GameState {
  currentDistrict: DistrictId | null;
  viewMode: 'flight' | 'district' | 'dialogue';
  playerX: number;
  playerY: number;
  playerVelocityX: number;
  playerVelocityY: number;
  playerAngle: number;
  stats: PlayerStats;
  upgrades: UpgradeLevels;
  droplets: number;
  favors: number;
  stormJars: number;
  reputation: Reputation;
  activeRig: RigId;
  unlockedRigs: RigId[];
  lanternMode: LanternMode;
  activeQuests: Quest[];
  completedQuestIds: string[];
  currentMainChapter: number;
  activeContract: DeliveryContract | null;
  inventory: InventoryItem[];
  activeDialogueNodeId: string | null;
  activeNpcId: string | null;
  character: CharacterCustomization;
  discoveredLandmarks: string[];
  mapWaypoint: Waypoint | null;
  unlockedSkills: string[];
  soundEnabled: boolean;
  volume: number;
  logMessages: LogMessage[];
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
  gliderCharges: number;
  grappleCharges: number;
  shockCharges: number;
}
