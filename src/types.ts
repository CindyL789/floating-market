export type DistrictId = 
  | 'lantern_bazaar'
  | 'undertow_den'
  | 'storm_anchor_shrine'
  | 'pilgrim_haven'
  | 'celestial_pier';

export type RigId = 
  | 'standard_courier'
  | 'dawn_dock'
  | 'storm_run'
  | 'undertow_civilian';

export type LanternMode = 'beacon' | 'signal' | 'ward';

export type BiomeId = 
  | 'lantern_shallows'
  | 'undertow_abyss'
  | 'storm_anchor_rift'
  | 'pilgrim_drift'
  | 'celestial_zenith'
  | 'maelstrom_vortex';

export interface CharacterCustomization {
  name: string;
  title: string;
  pronouns: string;
  bodyType: 'athletic' | 'slender' | 'broad' | 'nimble';
  skinTone: string;
  faceShape: 'sharp' | 'round' | 'chiseled' | 'soft' | 'angular';
  eyeStyle: 'almond' | 'wide' | 'focused' | 'mystic_glow';
  eyeColor: string;
  eyebrows: 'arched' | 'thick' | 'straight' | 'feathered';
  facialFeature: 'none' | 'star_talisman' | 'storm_scar' | 'cloud_tattoos' | 'koi_whisker_mark' | 'porcelain_freckles' | 'gilded_eyeshadow';
  hairstyle: 'windblown_crest' | 'braided_topknot' | 'flowing_strands' | 'courier_shave' | 'twin_loop_braids' | 'undercut_dreadlocks' | 'celestial_bob' | 'wild_drift';
  hairColor: string;
  initialOutfit: RigId;
  accessory: 'none' | 'gilded_goggles' | 'lantern_earring' | 'aviator_monocle' | 'silk_face_veil' | 'brass_hairpin';
  koiCompanionColor: 'azure_glow' | 'rose_gold' | 'midnight_purple' | 'emerald_jade' | 'solar_amber';
  backstory: 'guild_apprentice' | 'undertow_salvager' | 'cloud_monk_novice' | 'exiled_astronomer';
}

export type SkillCategory = 'lantern' | 'hull_mobility' | 'koi_synergy' | 'trade_prestige';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  tier: number; // 1, 2, 3, 4
  costFavors: number;
  icon: string;
  description: string;
  effectLabel: string;
  statsEffectDescription: string;
  prerequisites: string[];
}

export interface BiomeRegion {
  id: BiomeId;
  name: string;
  subtitle: string;
  description: string;
  dangerLevel: 'Low' | 'Moderate' | 'Dangerous' | 'Lethal';
  weather: string;
  color: string;
  accentColor: string;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  specialDrop: string;
  windCurrent: string;
}

export interface LandmarkInfo {
  id: string;
  name: string;
  type: 'city_platform' | 'ancient_wonder' | 'natural_stream' | 'hazard_zone' | 'salvage_wreck';
  districtId?: DistrictId;
  coordinates: { x: number; y: number };
  icon: string;
  description: string;
  discoveryBonus: string;
  discovered: boolean;
  image?: string;
}

export interface ArtWorkEntry {
  id: string;
  title: string;
  subtitle: string;
  category: 'agent' | 'district' | 'biome' | 'lore';
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
  category: 'craft' | 'contraband' | 'talisman' | 'packet' | 'upgrade';
  description: string;
  count: number;
  iconName: string;
  value: number;
}

export interface Quest {
  id: string;
  title: string;
  chapter: number;
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
  urgency: 'Standard' | 'Urgent' | 'Perilous';
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
  affinity: number; // 0-100
  portraitImage?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  portrait: string;
  text: string;
  choices: {
    text: string;
    nextNodeId?: string;
    action?: (state: GameState, setState: (updater: (prev: GameState) => GameState) => void) => void;
    requiredFavor?: number;
    requiredRig?: RigId;
  }[];
}

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  epithet: string;
  description: string;
  visualDirection: string;
  designTakeaway: string;
  coordinates: { x: number; y: number };
  accentColor: string;
  bgGradient: string;
  ambientChimeNote: number;
  npcs: string[];
  availableServices: ('contracts' | 'trader' | 'dice_game' | 'shrine_altar' | 'rig_smith')[];
  image?: string;
}

export interface PlayerStats {
  hullIntegrity: number; // 0 - 100
  maxHull: number;
  speedLevel: number;
  lanternPower: number; // 0 - 100
  maxLanternPower: number;
  koiAffinity: number; // 0 - 100
}

export interface GameState {
  // Navigation & Location
  currentDistrict: DistrictId | null; // null if in sky_flight
  viewMode: 'flight' | 'district' | 'dialogue' | 'contracts' | 'wardrobe' | 'codex' | 'shop' | 'undertow_game';
  
  // Position in sky
  playerPos: { x: number; y: number };
  playerVelocity: { x: number; y: number };
  playerAngle: number;
  
  // Stats & Resources
  stats: PlayerStats;
  droplets: number; // Moon-Luminescence Droplets
  favors: number; // Brass Seals / Favors
  stormJars: number; // Weather jars
  reputation: {
    lanternGuild: number;
    undertowSyndicate: number;
    anchorMonks: number;
  };
  
  // Active Gear & Lantern
  activeRig: RigId;
  unlockedRigs: RigId[];
  lanternMode: LanternMode;
  
  // Quests
  activeQuests: Quest[];
  completedQuestIds: string[];
  currentMainChapter: number;
  activeContract: DeliveryContract | null;
  
  // Inventory
  inventory: InventoryItem[];
  
  // Dialogue state
  activeDialogueNodeId: string | null;
  activeNpcId: string | null;
  
  // Character Customization
  character: CharacterCustomization;
  
  // World Map & Exploration
  discoveredLandmarks: string[];
  mapWaypoint: { x: number; y: number; label: string } | null;
  
  // Attunement Skill Tree Passives
  unlockedSkills: string[];
  
  // Sound
  soundEnabled: boolean;
  volume: number;
  
  // UI Notifications & logs
  logMessages: { id: string; text: string; time: string; type: 'info' | 'reward' | 'hazard' | 'story' }[];
}
