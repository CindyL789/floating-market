import {
  CharacterCustomization,
  SkillNode,
  BiomeRegion,
  LandmarkInfo,
  ArtWorkEntry,
  GearRig,
  InventoryItem,
  Quest,
  DeliveryContract,
  NPC,
  DialogueNode,
  DistrictInfo,
  BiomeId,
  DistrictId,
  RigId
} from '../types';

import lanternBazaarImg from '../assets/images/art_lantern_bazaar.jpg';
import undertowDenImg from '../assets/images/art_undertow_den.jpg';
import moonKoiFlightImg from '../assets/images/art_moon_koi_flight.jpg';
import manusAgentImg from '../assets/images/art_manus_agent.jpg';

export const ART_GALLERY: ArtWorkEntry[] = [
  {
    id: 'art_manus_agent',
    title: 'Agent Manus — Celestial Operative',
    subtitle: 'Shadow Broker & Starlight Cartographer',
    category: 'agent',
    image: manusAgentImg,
    description: 'A key operative in the skyway underground, Agent Manus moves unseen between the merchant guilds and the clandestine hulls of the Undertow. Manus preserves ancient charts that keep the archipelago from falling into the dark.',
    loreQuote: '"The winds do not care for guild seals or merchant gold. They obey the resonance of the Moon-Koi."',
    artistNote: 'Atmospheric deep indigo twilight, glowing cyan filigree, and warm brass reflections.'
  },
  {
    id: 'art_lantern_bazaar',
    title: 'The Lantern Bazaar at Twilight',
    subtitle: 'Commerce on a Moving Street',
    category: 'district',
    image: lanternBazaarImg,
    description: 'The sprawling heart of the Skybound Archipelago. Precarious black-lacquer avenues connect dozens of vessels beneath an immense crescent moon, lit by blue glass lamps and amber lanterns.',
    loreQuote: '"When the fog thickens and the anchors strain, look to the blue lamps."',
    artistNote: 'Rich architectural density contrasting warm hearth glows against vast cool cloudbanks.'
  },
  {
    id: 'art_moon_koi_flight',
    title: 'Moon-Koi Companion & Sky Skiff',
    subtitle: 'Harmonic Slipstream Crossing',
    category: 'lore',
    image: moonKoiFlightImg,
    description: "Sera Venn's skiff glides effortlessly through the upper cloud strata alongside Nami, the bioluminescent Moon-Koi. Shedding trails of stardust, Nami senses thermal updrafts and guides couriers through dangerous stormfronts.",
    loreQuote: '"A courier without a Moon-Koi is just wood and canvas waiting for the wind to fail."',
    artistNote: 'Ethereal starlight, dynamic aerodynamic flow lines, and bioluminescent stardust.'
  },
  {
    id: 'art_undertow_den',
    title: 'The Undertow Den Tavern',
    subtitle: 'Lower Hull Refuge & Clandestine Market',
    category: 'district',
    image: undertowDenImg,
    description: 'Tucked deep in the lower belly of a giant drifting trade barge, this tavern is neutral ground for smugglers and favor brokers. A circular porthole frames the electric storm clouds below.',
    loreQuote: '"Up above they pray to the wind; down here we drink to the chains."',
    artistNote: 'Warm intimate tavern interior framed dramatically against cold violet lightning storm effects.'
  }
];

export const DEFAULT_CHARACTER: CharacterCustomization = {
  name: 'Sera Venn',
  title: 'Moon-Koi Courier',
  pronouns: 'she/her',
  bodyType: 'nimble',
  skinTone: '#f4d0b2',
  faceShape: 'sharp',
  eyeStyle: 'focused',
  eyeColor: '#38bdf8',
  eyebrows: 'arched',
  facialFeature: 'koi_whisker_mark',
  hairstyle: 'windblown_crest',
  hairColor: '#1e293b',
  initialOutfit: 'standard_courier',
  accessory: 'gilded_goggles',
  koiCompanionColor: 'azure_glow',
  backstory: 'guild_apprentice'
};

export const BIOMES: Record<BiomeId, BiomeRegion> = {
  lantern_shallows: {
    id: 'lantern_shallows',
    name: 'Lantern Shallows',
    subtitle: 'The Golden-Indigo Merchant Currents',
    description: 'Calm trade breezes illuminated by thousands of floating silk lanterns and spice barges. Safe cruising skies with abundant moon-droplet drift.',
    dangerLevel: 'Low',
    weather: 'Gentle Mist & Lantern Warmth',
    color: '#0d223a',
    accentColor: '#38bdf8',
    minX: 200, maxX: 850, minY: 250, maxY: 800,
    specialDrop: 'Pure Moon-Droplets',
    windCurrent: 'Steady Easterly 12 kn'
  },
  undertow_abyss: {
    id: 'undertow_abyss',
    name: 'The Undertow Abyss',
    subtitle: 'Lower Hull Wreckage & Smuggler Drift',
    description: 'Sub-cloud underbelly beneath the drifting platforms. Heavy gravitational downdrafts, shadow reefs, and discarded salvage wrecks.',
    dangerLevel: 'Dangerous',
    weather: 'Turbulent Downdrafts & Murk',
    color: '#241030',
    accentColor: '#f59e0b',
    minX: 950, maxX: 1650, minY: 550, maxY: 1150,
    specialDrop: 'Smuggler Brass & Salvage Scraps',
    windCurrent: 'Vortical Down-Shear 28 kn'
  },
  storm_anchor_rift: {
    id: 'storm_anchor_rift',
    name: 'Storm Anchor Rift',
    subtitle: 'Monumental Iron Tether Cloud Wells',
    description: 'Colossal black mooring chains span from heaven to abyss. Electrified ozone and crackling storm clouds wrap the iron links tethering the city.',
    dangerLevel: 'Dangerous',
    weather: 'Ozone Static & Lightning Arcs',
    color: '#111a3b',
    accentColor: '#818cf8',
    minX: 150, maxX: 800, minY: 950, maxY: 1650,
    specialDrop: 'Charged Storm Jars',
    windCurrent: 'Shearing Updrafts 34 kn'
  },
  pilgrim_drift: {
    id: 'pilgrim_drift',
    name: 'Pilgrim Drift Mistlands',
    subtitle: 'Tranquil Koi Spawning Streams',
    description: 'Muted emerald-teal fog where schools of wild bioluminescent Moon-Koi migrate. Sacred silence broken only by distant wind chimes.',
    dangerLevel: 'Low',
    weather: 'Silken Cloud Fog & Chimes',
    color: '#0a2e2b',
    accentColor: '#2dd4bf',
    minX: 1100, maxX: 1750, minY: 150, maxY: 600,
    specialDrop: 'Moon-Koi Luminescence Scale',
    windCurrent: 'Gentle Thermal Stream 8 kn'
  },
  celestial_zenith: {
    id: 'celestial_zenith',
    name: 'Celestial High Peaks',
    subtitle: 'Upper Starlight & Observatory Spires',
    description: 'Thin, crystal-clear stratosphere piercing above the cloud ceiling. Astral navigational slipstreams and sparkling silver aurora ribbons.',
    dangerLevel: 'Moderate',
    weather: 'Crystalline Aurora Stratosphere',
    color: '#1f103d',
    accentColor: '#c084fc',
    minX: 700, maxX: 1300, minY: 50, maxY: 450,
    specialDrop: 'Star-Chart Parchment',
    windCurrent: 'High-Altitude Jetstream 45 kn'
  },
  maelstrom_vortex: {
    id: 'maelstrom_vortex',
    name: 'The Great Upper Maelstrom',
    subtitle: 'The Impossible Vortex Hazard',
    description: 'A violent spinning atmospheric eye at the heart of the sky. Flashing lightning webs and intense gravity wells require Storm-Run Rig or Ward Lantern.',
    dangerLevel: 'Lethal',
    weather: 'Catastrophic Tempest Vortex',
    color: '#380c1d',
    accentColor: '#f43f5e',
    minX: 700, maxX: 1200, minY: 800, maxY: 1300,
    specialDrop: 'Prismatic Storm Nucleus',
    windCurrent: 'Violent Hurricane Shear 65 kn'
  }
};

export const LANDMARKS: LandmarkInfo[] = [
  {
    id: 'landmark_lantern_bazaar',
    name: 'Lantern Bazaar',
    type: 'city_platform',
    districtId: 'lantern_bazaar',
    x: 500, y: 500,
    icon: '🏮',
    description: 'The sprawling central hub of commerce. Wet black-lacquer avenues connect dozens of precarious platforms beneath glowing moon-lamps.',
    discoveryBonus: 'Guild Trading Discounts (+10% Droplet Sell Value)',
    discovered: true,
    image: lanternBazaarImg
  },
  {
    id: 'landmark_undertow_den',
    name: 'The Undertow Den',
    type: 'city_platform',
    districtId: 'undertow_den',
    x: 1250, y: 750,
    icon: '🎲',
    description: 'Clandestine tavern hidden in a trading barge lower hull. A circular porthole frames the swirling storm below.',
    discoveryBonus: 'Black Market Delivery Contracts & Moon-Dice Access',
    discovered: true,
    image: undertowDenImg
  },
  {
    id: 'landmark_storm_anchor',
    name: 'Storm Anchor Shrine',
    type: 'city_platform',
    districtId: 'storm_anchor_shrine',
    x: 400, y: 1350,
    icon: '⚡',
    description: 'Sacred iron infrastructure that fastens the archipelago against gale winds with massive chains into the abyss.',
    discoveryBonus: 'Storm Ward Attunement (+25% Lightning Resistance)',
    discovered: true
  },
  {
    id: 'landmark_pilgrim_haven',
    name: "Pilgrim's Drift & Salvage",
    type: 'city_platform',
    districtId: 'pilgrim_haven',
    x: 1400, y: 350,
    icon: '🎏',
    description: 'Moored skiffs and resting rafts where weary wayfarers repair torn sails and commune with migrating koi.',
    discoveryBonus: 'Nami Affinity Boost (+15% Koi Companion Resonance)',
    discovered: true
  },
  {
    id: 'landmark_celestial_pier',
    name: 'High Moon Pier',
    type: 'city_platform',
    districtId: 'celestial_pier',
    x: 950, y: 200,
    icon: '🔭',
    description: 'The highest watchtower platform of the archipelago, where astral navigators read residual moonlight.',
    discoveryBonus: 'High-Altitude Slipstream Mastery (+20% Top Speed)',
    discovered: true
  }
];

export const DISTRICTS: Record<DistrictId, DistrictInfo> = {
  lantern_bazaar: {
    id: 'lantern_bazaar',
    name: 'Lantern Bazaar',
    epithet: 'Commerce on a Moving Street',
    description: 'A wet black-lacquer avenue connects dozens of precarious vessels and drifting platforms. Spice sellers, charm merchants, and book dealers create a dense human scale beneath an immense moon.',
    visualDirection: 'A full-bleed opening tableau in deep indigo and teal, lit by amber market lamps.',
    designTakeaway: 'Close foreground props and a long curving avenue make the bazaar feel inhabited and immense.',
    x: 500, y: 500,
    accentColor: '#38bdf8',
    bgGradient: 'from-[#071326] to-[#040914]',
    npcs: ['madame_lin', 'master_corvo'],
    availableServices: ['contracts', 'trader', 'rig_smith'],
    image: lanternBazaarImg
  },
  undertow_den: {
    id: 'undertow_den',
    name: 'The Undertow Den',
    epithet: 'A Market Beneath the Market',
    description: 'Hidden in a trading barge lower hull, this tavern is neutral ground for smugglers, brokers, performers, and captains. A circular porthole frames the churning electric storm clouds below.',
    visualDirection: 'Warm interior refuge is made tense by the cold blue storm framed beyond the room.',
    designTakeaway: 'Contraband is embedded in the decor: courier tubes, scale charms, storm jars, locked crates.',
    x: 1250, y: 750,
    accentColor: '#f59e0b',
    bgGradient: 'from-[#1C0E18] to-[#070B14]',
    npcs: ['agent_manus', 'captain_jax', 'whisperer_kael'],
    availableServices: ['contracts', 'dice_game', 'trader'],
    image: undertowDenImg
  },
  storm_anchor_shrine: {
    id: 'storm_anchor_shrine',
    name: 'Storm Anchor Shrine',
    epithet: "The City's Fragile Foundation",
    description: 'The outer shrine secures the archipelago with colossal black chains lowered through the cloud sea. It is both sacred infrastructure and a liminal market for storm jars and weather craft.',
    visualDirection: 'Balances tiny safe pools of lamplight with the perilous negative space of the storm below.',
    designTakeaway: 'The monumental chain scale turns a practical structure into a mythic landmark.',
    x: 400, y: 1350,
    accentColor: '#818cf8',
    bgGradient: 'from-[#0B0C1E] to-[#030712]',
    npcs: ['brother_hane'],
    availableServices: ['shrine_altar', 'contracts', 'trader']
  },
  pilgrim_haven: {
    id: 'pilgrim_haven',
    name: "Pilgrim's Drift & Salvage",
    epithet: 'Harbor of Stranded Wayfarers',
    description: 'Moored skiffs and tethered resting rafts where weary cloud voyagers repair ripped canvas and share rumors of migrating moon-koi schools.',
    visualDirection: 'Muted mist, patched sailcloth, glowing droplet nets, and soft vermilion ribbons.',
    designTakeaway: 'Fragile hope floating in open air; small braziers warming traveler hands.',
    x: 1400, y: 350,
    accentColor: '#2dd4bf',
    bgGradient: 'from-[#051821] to-[#040C14]',
    npcs: ['pilgrim_yuna'],
    availableServices: ['trader', 'contracts']
  },
  celestial_pier: {
    id: 'celestial_pier',
    name: 'High Moon Pier',
    epithet: 'The Horizon Lookout',
    description: 'The highest watchtower platform of the archipelago, where astral navigators read residual moonlight and forecast storm tides.',
    visualDirection: 'Pure cobalt luminescence, open starlight, silver astrolabes, and high altitude winds.',
    designTakeaway: 'Unobstructed panorama above the entire cloud sea.',
    x: 950, y: 200,
    accentColor: '#c084fc',
    bgGradient: 'from-[#140B2B] to-[#040817]',
    npcs: ['astronomer_lyra'],
    availableServices: ['shrine_altar', 'rig_smith']
  }
};

export const GEAR_RIGS: Record<RigId, GearRig> = {
  standard_courier: {
    id: 'standard_courier',
    name: 'Standard Courier Rig',
    subtitle: 'Official Sky Guild Attire',
    description: 'For visible routes and formal deliveries. Features an indigo cloak, vermilion sash, blue-glass staff-lantern, and brass message tubes.',
    perks: [
      '+25% Skiff Flight Acceleration',
      'Guild Pass: Access lawful docks & formal contracts',
      'Staff Lantern emits wide Route Beacon beam'
    ],
    visualFeatures: ['Indigo cloak', 'Vermilion sash', 'Blue-glass staff-lantern', 'Brass message tubes'],
    colorTheme: 'Indigo & Cyan',
    unlocked: true,
    cost: 0
  },
  dawn_dock: {
    id: 'dawn_dock',
    name: 'Dawn-Dock Disguise',
    subtitle: 'High-Risk Clandestine Mantle',
    description: 'For anonymous exchanges and high-risk handoffs. Utilizes a sand-grey oilskin poncho, masked lower face, and muted rope belt.',
    perks: [
      'Stealth: Avoid patrol inspections & contraband confiscation',
      'Undertow Access: Unlocks clandestine black market orders',
      'Silent Glide: 40% less cloud turbulence friction'
    ],
    visualFeatures: ['Sand-grey oilskin poncho', 'Masked lower face', 'Muted rope belt'],
    colorTheme: 'Amber & Stone',
    unlocked: false,
    cost: 120
  },
  storm_run: {
    id: 'storm_run',
    name: 'Storm-Run Rig',
    subtitle: 'Tempest & Chain Climber Harness',
    description: 'For chain climbs and violent cloud crossings. Equipped with a short sailcoat, tether harness, lightning-proof gloves, and grappling hook.',
    perks: [
      'Lightning Immunity: Immune to storm surge damage in vortexes',
      'Grappling Hook: Can tether to monumental storm chains',
      'Storm Jar Harvester: Captures lightning energy directly from clouds'
    ],
    visualFeatures: ['Short sailcoat', 'Tether harness', 'Lightning-proof gloves', 'Grappling hook'],
    colorTheme: 'Azure & Violet',
    unlocked: false,
    cost: 200
  },
  undertow_civilian: {
    id: 'undertow_civilian',
    name: 'Undertow Civilian Cover',
    subtitle: 'Tavern Negotiator Attire',
    description: 'For meetings inside the hidden tavern. Blends in with a plum waistcoat, rolled sleeves, concealed sheath, and retained vermilion sash.',
    perks: [
      'Charisma: +30% payout on all favors & tavern wagers',
      'Haggling: 20% discount at all merchant stalls',
      'Rumor Network: Discovers hidden salvage coordinates'
    ],
    visualFeatures: ['Plum waistcoat', 'Rolled sleeves', 'Concealed sheath'],
    colorTheme: 'Rose & Amber',
    unlocked: false,
    cost: 160
  }
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'brass_message_tube',
    name: 'Brass Message Tube',
    category: 'packet',
    description: 'Watertight brass cylinder stamped with the Moon-Koi seal.',
    count: 2,
    iconName: 'Scroll',
    value: 20
  },
  {
    id: 'moon_koi_scale_charm',
    name: 'Moon-Koi Scale Charm',
    category: 'talisman',
    description: 'A glowing cobalt scale shed by Nami. Resonates near secret wind currents.',
    count: 1,
    iconName: 'Sparkles',
    value: 50
  },
  {
    id: 'weather_storm_jar',
    name: 'Storm Jar (Charged)',
    category: 'craft',
    description: 'Reinforced glass sphere containing captured blue lightning.',
    count: 1,
    iconName: 'Zap',
    value: 40
  },
  {
    id: 'ribbed_blue_glass_lens',
    name: 'Ribbed Blue Glass Lens',
    category: 'upgrade',
    description: 'Focuses lantern light to cut through dense thunder mist.',
    count: 1,
    iconName: 'Compass',
    value: 30
  }
];

export const MAIN_QUESTS: Quest[] = [
  {
    id: 'quest_chapter_1',
    chapter: 1,
    title: 'The Moonrise Opening',
    giver: 'Madame Lin',
    giverLocation: 'lantern_bazaar',
    destination: 'lantern_bazaar',
    description: 'Deliver the sealed Celestial Star Chart to Madame Lin at the Lantern Bazaar spice pavilion to establish your courier seal.',
    stepDescription: 'Talk to Madame Lin at the Lantern Bazaar',
    rewardDroplets: 60,
    rewardFavors: 2,
    active: true,
    completed: false,
    dialogueIdOnComplete: 'madame_lin_complete_ch1'
  },
  {
    id: 'quest_chapter_2',
    chapter: 2,
    title: 'Whispers Beneath the Hull',
    giver: 'Madame Lin',
    giverLocation: 'lantern_bazaar',
    destination: 'undertow_den',
    description: 'A clandestine manifest must reach Captain Jax inside the Undertow Den tavern. Beware of guild patrols—equip the Dawn-Dock Disguise or navigate stealthily.',
    stepDescription: 'Fly to the Undertow Den and meet Captain Jax',
    requiredRig: 'dawn_dock',
    rewardDroplets: 120,
    rewardFavors: 4,
    rewardItems: ['Contraband Seal'],
    active: false,
    completed: false,
    dialogueIdOnComplete: 'captain_jax_meet'
  },
  {
    id: 'quest_chapter_3',
    chapter: 3,
    title: 'Chains in the Tempest',
    giver: 'Captain Jax',
    giverLocation: 'undertow_den',
    destination: 'storm_anchor_shrine',
    description: 'One of the colossal black anchor chains is rattling loose in the storm well. Deliver 2 charged Storm Jars to Brother Hane at the Shrine.',
    stepDescription: 'Equip Storm-Run Rig and deliver Storm Jars to Brother Hane at the Shrine',
    requiredRig: 'storm_run',
    rewardDroplets: 220,
    rewardFavors: 6,
    active: false,
    completed: false,
    dialogueIdOnComplete: 'brother_hane_complete_ch3'
  },
  {
    id: 'quest_chapter_4',
    chapter: 4,
    title: 'The Impossible Final Delivery',
    giver: 'Brother Hane',
    giverLocation: 'storm_anchor_shrine',
    destination: 'celestial_pier',
    description: 'Carry the unified Covenant of Wind and Light through the eye of the Upper Maelstrom to the High Moon Pier. Chart the missing route that no map can hold.',
    stepDescription: 'Navigate the violent storm currents to the High Moon Pier and seal the archipelago fate!',
    rewardDroplets: 500,
    rewardFavors: 15,
    rewardItems: ['Master Courier Medallion'],
    active: false,
    completed: false,
    dialogueIdOnComplete: 'finale_complete'
  }
];

export const CONTRACT_POOL: DeliveryContract[] = [
  {
    id: 'contract_1',
    client: 'Silk Broker Vane',
    title: 'Moisture-Sensitive Indigo Silks',
    origin: 'lantern_bazaar',
    destination: 'pilgrim_haven',
    cargo: 'Bolts of woven vermilion silk',
    urgency: 'Standard',
    hazard: 'Avoid cloud rain pockets',
    rewardDroplets: 45,
    rewardFavors: 1,
    flavorText: 'Silk ruins instantly if soaked in cloud rain. Glide swiftly on the upper thermal currents.'
  },
  {
    id: 'contract_2',
    client: 'Smuggler Kael',
    title: 'Sealed Alchemical Vials',
    origin: 'undertow_den',
    destination: 'storm_anchor_shrine',
    cargo: 'Unmarked brass cylinder',
    urgency: 'Urgent',
    hazard: 'Volatile lightning risk',
    rewardDroplets: 85,
    rewardFavors: 3,
    flavorText: 'Keep away from direct lightning strikes or the fluid will combust!'
  },
  {
    id: 'contract_3',
    client: 'Shrine Novice Taro',
    title: 'Purified Moonlight Incense',
    origin: 'storm_anchor_shrine',
    destination: 'lantern_bazaar',
    cargo: 'Incense burner & blue glass jars',
    urgency: 'Standard',
    hazard: 'Cross winds near the great chain',
    rewardDroplets: 55,
    rewardFavors: 2,
    flavorText: 'The merchants at the Bazaar await consecrated incense to open the midnight trade.'
  },
  {
    id: 'contract_4',
    client: 'Skyway Cartographer',
    title: 'Urgent Drift Coordinates',
    origin: 'pilgrim_haven',
    destination: 'celestial_pier',
    cargo: 'Wax-sealed chart tube',
    urgency: 'Perilous',
    hazard: 'High altitude vortex gusts',
    rewardDroplets: 110,
    rewardFavors: 4,
    flavorText: 'The archipelago shifted three leagues east during the last moon tremor. Deliver before sunrise!'
  }
];

export const NPCS: Record<string, NPC> = {
  madame_lin: {
    id: 'madame_lin',
    name: 'Madame Lin',
    title: 'Guildmistress of the Blue Lantern',
    districtId: 'lantern_bazaar',
    avatarMood: 'composed',
    greeting: 'Ah, Sera Venn. The moon-koi swimming beside your skiff is luminous tonight. Come, trade is brisk and the fog thickens.',
    dialogueTreeId: 'madame_lin_start',
    affinity: 30,
    iconEmoji: '👘'
  },
  master_corvo: {
    id: 'master_corvo',
    name: 'Master Corvo',
    title: 'Clockwork & Brass Antiquarian',
    districtId: 'lantern_bazaar',
    avatarMood: 'eccentric',
    greeting: 'Look at this scale compass! It drinks moonlight, not terrestrial magnetism. Need your lantern lenses polished or your skiff sails re-tensioned?',
    dialogueTreeId: 'master_corvo_start',
    affinity: 20,
    iconEmoji: '🕰️'
  },
  captain_jax: {
    id: 'captain_jax',
    name: 'Captain Jax',
    title: 'Master of the Undertow Den',
    districtId: 'undertow_den',
    avatarMood: 'shrewd',
    greeting: 'Keep your voice down, Courier. Out there, the Guild reigns; in here, under this lacquer hull, we answer only to the storm.',
    dialogueTreeId: 'captain_jax_start',
    affinity: 15,
    iconEmoji: '⚓'
  },
  agent_manus: {
    id: 'agent_manus',
    name: 'Agent Manus',
    title: 'Celestial Shadow Operative & Cartographer',
    districtId: 'undertow_den',
    avatarMood: 'astral',
    greeting: 'Greetings, Courier Sera Venn. I monitor the invisible currents that keep this archipelago suspended between oblivion and the stars. Have you come seeking classified sky charts or clandestine operations?',
    dialogueTreeId: 'agent_manus_start',
    affinity: 45,
    portrait: manusAgentImg,
    iconEmoji: '🌌'
  },
  whisperer_kael: {
    id: 'whisperer_kael',
    name: 'Whisperer Kael',
    title: 'Contraband & Favor Broker',
    districtId: 'undertow_den',
    avatarMood: 'mysterious',
    greeting: 'Every locked crate holds a secret, and every secret is worth three brass favors. Looking for a game of Moon-Koi Dice?',
    dialogueTreeId: 'whisperer_kael_start',
    affinity: 25,
    iconEmoji: '🎲'
  },
  brother_hane: {
    id: 'brother_hane',
    name: 'Brother Hane',
    title: 'Guardian of the Anchor Shrine',
    districtId: 'storm_anchor_shrine',
    avatarMood: 'solemn',
    greeting: 'Do you hear them groaning? The monumental chains hold five thousand souls above oblivion. May the wind be merciful to your skiff.',
    dialogueTreeId: 'brother_hane_start',
    affinity: 20,
    iconEmoji: '🕯️'
  },
  pilgrim_yuna: {
    id: 'pilgrim_yuna',
    name: 'Pilgrim Yuna',
    title: 'Wayfarer of the Drifting Skiffs',
    districtId: 'pilgrim_haven',
    avatarMood: 'gentle',
    greeting: 'Your moon-koi, Nami... her fins shed the softest blue radiance. She guided my salvage boat through the blind fog yesterday. Bless you both.',
    dialogueTreeId: 'pilgrim_yuna_start',
    affinity: 40,
    iconEmoji: '🎏'
  },
  astronomer_lyra: {
    id: 'astronomer_lyra',
    name: 'Astronomer Lyra',
    title: 'High Moon Observer',
    districtId: 'celestial_pier',
    avatarMood: 'visionary',
    greeting: 'The celestial alignment is at its peak. The Great Upper Maelstrom is parting its eye for only a fleeting hour. Are you ready for the final crossing?',
    dialogueTreeId: 'astronomer_lyra_start',
    affinity: 35,
    iconEmoji: '🔭'
  }
};

export const DIALOGUE_TREES: Record<string, DialogueNode> = {
  madame_lin_start: {
    id: 'madame_lin_start',
    speaker: 'Madame Lin',
    portrait: '👘',
    text: 'Welcome back to the Lantern Bazaar, Sera. The black lacquer avenue is bustling tonight, but tension ripples across the barges. The trade routes are fraying.',
    choices: [
      { text: 'I am ready for duty. What deliveries are required?', nextNodeId: 'madame_lin_quest_check' },
      { text: 'How does the Bazaar hold together in this turbulent weather?', nextNodeId: 'madame_lin_lore' },
      { text: "I'd like to browse your trade supplies.", nextNodeId: 'madame_lin_start' }
    ]
  },
  madame_lin_lore: {
    id: 'madame_lin_lore',
    speaker: 'Madame Lin',
    portrait: '👘',
    text: 'Blue glass is our navigation language; amber light signals shelter, food, and trustworthy passage. When the moon rises, the cloud sea becomes navigable—if your moon-koi senses the currents.',
    choices: [
      { text: 'Nami can smell the moonlight between the lightning clouds.', nextNodeId: 'madame_lin_start' }
    ]
  },
  madame_lin_quest_check: {
    id: 'madame_lin_quest_check',
    speaker: 'Madame Lin',
    portrait: '👘',
    text: 'Our first priority: ensure your courier credentials are confirmed with the merchant elders. Take this sealed celestial chart to the upper spice pavilion.',
    choices: [
      { text: 'Consider it done. (Complete Prologue)', actionType: 'complete_ch1', nextNodeId: 'madame_lin_start' }
    ]
  },
  captain_jax_start: {
    id: 'captain_jax_start',
    speaker: 'Captain Jax',
    portrait: '⚓',
    text: 'Look at this porthole, Sera. The storm boils below us like black oil. You wear the marks of the courier, but the Undertow Den does not care for guild seals. What brings you into the belly of the barge?',
    choices: [
      { text: 'I bring a sealed manifest from the upper bazaar.', nextNodeId: 'captain_jax_manifest' },
      { text: 'Tell me how you survive down here beneath the market.', nextNodeId: 'captain_jax_lore' }
    ]
  },
  captain_jax_lore: {
    id: 'captain_jax_lore',
    speaker: 'Captain Jax',
    portrait: '⚓',
    text: 'Safety is borrowed, kid. Up there, they pretend the wood will not rot and the chains will not snap. Down here, we trade in storm jars and illicit weather craft. If a chain gives way, only those with good sails will see tomorrow.',
    choices: [
      { text: "That's why we need to keep the anchors secure.", nextNodeId: 'captain_jax_start' }
    ]
  },
  captain_jax_manifest: {
    id: 'captain_jax_manifest',
    speaker: 'Captain Jax',
    portrait: '⚓',
    text: "Ah... Madame Lin's ciphered wax. So the upper district is finally admitting the anchor chains are slipping! Here, take this seal of the Undertow. You'll need the Storm-Run Rig to get near the Anchor Shrine.",
    choices: [
      { text: 'I will take the Storm-Run Rig and reach Brother Hane. (Advance Quest)', actionType: 'complete_ch2', nextNodeId: 'captain_jax_start' }
    ]
  },
  agent_manus_start: {
    id: 'agent_manus_start',
    speaker: 'Agent Manus',
    portrait: '🌌',
    text: 'Sera Venn. I have observed your skiff tracing the high-altitude slipstreams. The merchants see only cargo and coin, but I know what you truly carry—the harmonic resonance between courier and Moon-Koi. What intelligence do you seek?',
    choices: [
      { text: 'Tell me about the hidden celestial currents across the cloud sea.', nextNodeId: 'agent_manus_intel' },
      { text: 'Do you have classified shadow operations for an agile courier?', nextNodeId: 'agent_manus_mission' }
    ]
  },
  agent_manus_intel: {
    id: 'agent_manus_intel',
    speaker: 'Agent Manus',
    portrait: '🌌',
    text: "The Great Upper Maelstrom is not an ordinary weather front—it is a cosmic flux gate that draws energy directly from the moon's orbit. When you align your lantern with the beacon frequency while Nami is at full affinity, the lightning parts around your skiff like silk.",
    choices: [
      { text: 'Incredible insight. Nami feels that pull as well.', actionType: 'manus_intel', nextNodeId: 'agent_manus_start' }
    ]
  },
  agent_manus_mission: {
    id: 'agent_manus_mission',
    speaker: 'Agent Manus',
    portrait: '🌌',
    text: 'The Syndicate requires a discreet hand. A black-box cipher capsule was dropped into the Undertow vortex during the last patrol scramble. If you recover adrift salvage in the storm corridors, bring the brass to me.',
    choices: [
      { text: 'I accept the shadow contract. (+3 Favors, +50 Droplets)', actionType: 'manus_mission', nextNodeId: 'agent_manus_start' }
    ]
  },
  brother_hane_start: {
    id: 'brother_hane_start',
    speaker: 'Brother Hane',
    portrait: '🕯️',
    text: 'The lightning-lit cloud wells are violent tonight. Every link of these black chains weighs as much as a temple tower. We are tethered to the abyss, Courier.',
    choices: [
      { text: 'I brought the charged Storm Jars to reinforce the kinetic anchors!', nextNodeId: 'brother_hane_altar' }
    ]
  },
  brother_hane_altar: {
    id: 'brother_hane_altar',
    speaker: 'Brother Hane',
    portrait: '🕯️',
    text: 'The lightning within these jars glows true! The anchor altar absorbs the surge—the chain stabilizes! Now, you must make the final flight to High Moon Pier and ignite the Celestial Covenant Beacon.',
    choices: [
      { text: 'Sera Venn and Nami will carry the light. (Advance to Finale)', actionType: 'complete_ch3', nextNodeId: 'brother_hane_start' }
    ]
  },
  finale_complete: {
    id: 'finale_complete',
    speaker: 'Sera Venn & Nami',
    portrait: '✨',
    text: 'Nami glides into the starlight, scattering trails of cobalt luminescence across the clouds. The Night-Market is anchored, the winds are calm, and you are heralded as the legendary Master Courier of the Skybound Archipelago!',
    choices: [
      { text: 'Continue flying freely and taking endless courier contracts across the Skyways!' }
    ]
  }
};

export const SKILL_CATEGORIES: Record<string, string> = {
  lantern: 'Luminescent Conduit',
  hull_mobility: 'Aeronautical Mastery',
  koi_synergy: 'Moon-Koi Attunement',
  trade_prestige: 'Guild Prestige & Trade'
};

export const SKILL_NODES: SkillNode[] = [
  {
    id: 'lantern_efficiency_1',
    name: 'Moon-Glass Refractor',
    category: 'lantern',
    tier: 1,
    costFavors: 1,
    icon: '🏮',
    description: 'Ground crystalline lens reduces phosphor depletion rate during active beacon flight.',
    effectLabel: '+35% Lantern Fuel Efficiency',
    statsEffectDescription: 'Beacon & Ward staff modes consume 35% less power per second.'
  },
  {
    id: 'max_lantern_1',
    name: 'Phosphor Catalyst Core',
    category: 'lantern',
    tier: 2,
    costFavors: 2,
    icon: '💡',
    description: 'Installs an expanded alchemical phosphor chamber into the courier staff pommel.',
    effectLabel: '+50 Max Lantern Capacity',
    statsEffectDescription: 'Increases maximum lantern charge reservoir from 100 to 150.',
    prerequisites: ['lantern_efficiency_1']
  },
  {
    id: 'lantern_recharge_1',
    name: 'Cloud-Well Siphon',
    category: 'lantern',
    tier: 3,
    costFavors: 3,
    icon: '⚡',
    description: 'Extracts ambient luminescent condensation directly from passing cloud layers.',
    effectLabel: 'Passive +3/s Lantern Recharge',
    statsEffectDescription: 'Continuously regenerates lantern power over time without needing to dock.',
    prerequisites: ['max_lantern_1']
  },
  {
    id: 'hull_capacity_1',
    name: 'Reinforced Teak Ribbing',
    category: 'hull_mobility',
    tier: 1,
    costFavors: 1,
    icon: '🛡️',
    description: 'Interlocking brass and ironwood cross-bracing reinforces the skiff under-keel.',
    effectLabel: '+30 Max Hull Capacity',
    statsEffectDescription: 'Increases maximum skiff structural integrity from 100 to 130.'
  },
  {
    id: 'storm_plating_1',
    name: 'Conductive Hull Mesh',
    category: 'hull_mobility',
    tier: 2,
    costFavors: 2,
    icon: '⚡',
    description: 'A woven silver mesh channels lightning strikes and squall impacts away from the cabin.',
    effectLabel: '50% Hazard Damage Reduction',
    statsEffectDescription: 'Halves all structural damage taken from storm lightning and squall hazards.',
    prerequisites: ['hull_capacity_1']
  },
  {
    id: 'hull_capacity_2',
    name: 'Titan-Alloy Keel',
    category: 'hull_mobility',
    tier: 3,
    costFavors: 3,
    icon: '⚓',
    description: 'Heavy-duty astral alloy forge that permanently bolsters structural resilience and auto-repairs.',
    effectLabel: '+30 Max Hull & Auto Dock Repair',
    statsEffectDescription: 'Increases max hull to 160 and automatically restores +25 hull integrity upon docking.',
    prerequisites: ['storm_plating_1']
  },
  {
    id: 'koi_harmonic_bond',
    name: 'Resonant Scale Link',
    category: 'koi_synergy',
    tier: 1,
    costFavors: 1,
    icon: '✨',
    description: 'Nami creates a subtle gravitational aura that draws nearby adrift motes into your path.',
    effectLabel: '+75% Mote Attraction Radius',
    statsEffectDescription: 'Magnetically pulls Moon-Droplets and salvage crates from greater flight distance.'
  },
  {
    id: 'koi_pearl_gleaner',
    name: 'Luminous Pearl Harvest',
    category: 'koi_synergy',
    tier: 2,
    costFavors: 2,
    icon: '🔮',
    description: 'Nami purifies condensed cloud moisture, concentrating droplets into rare astral essence.',
    effectLabel: '+50% Droplets Yield Multiplier',
    statsEffectDescription: 'All collected Moon-Droplets grant 50% more currency value on pickup.',
    prerequisites: ['koi_harmonic_bond']
  },
  {
    id: 'contract_broker',
    name: 'Guild Seal of Expedience',
    category: 'trade_prestige',
    tier: 1,
    costFavors: 1,
    icon: '📜',
    description: 'Official guild recognition guarantees premium hazard pay and expedited dispatch clearance.',
    effectLabel: '+30% Contract Pay & +1 Bonus Favor',
    statsEffectDescription: 'Completed delivery contracts award 30% more Droplets and an extra Brass Favor.'
  },
  {
    id: 'trader_bargaining',
    name: 'Market Quartermaster',
    category: 'trade_prestige',
    tier: 2,
    costFavors: 2,
    icon: '🪙',
    description: 'Deep knowledge of district tariffs allows negotiating steep wholesale discounts at all trading posts.',
    effectLabel: '25% Trader Goods Discount',
    statsEffectDescription: 'Reduces droplet cost of all hull repairs, storm jars, and koi treats by 25%.',
    prerequisites: ['contract_broker']
  }
];

export const CHARACTER_PRESETS: CharacterCustomization[] = [
  {
    name: 'Sera Venn',
    title: 'Moon-Koi Courier',
    pronouns: 'she/her',
    bodyType: 'nimble',
    skinTone: '#f4d0b2',
    faceShape: 'sharp',
    eyeStyle: 'focused',
    eyeColor: '#38bdf8',
    eyebrows: 'arched',
    facialFeature: 'koi_whisker_mark',
    hairstyle: 'windblown_crest',
    hairColor: '#1e293b',
    initialOutfit: 'standard_courier',
    accessory: 'gilded_goggles',
    koiCompanionColor: 'azure_glow',
    backstory: 'guild_apprentice'
  },
  {
    name: 'Kaelen Vance',
    title: 'Undertow Smuggler',
    pronouns: 'they/them',
    bodyType: 'athletic',
    skinTone: '#d89b70',
    faceShape: 'chiseled',
    eyeStyle: 'mystic_glow',
    eyeColor: '#f59e0b',
    eyebrows: 'arched',
    facialFeature: 'gilded_eyeshadow',
    hairstyle: 'undercut_dreadlocks',
    hairColor: '#312e81',
    initialOutfit: 'undertow_civilian',
    accessory: 'silk_face_veil',
    koiCompanionColor: 'midnight_purple',
    backstory: 'undertow_salvager'
  },
  {
    name: 'Brother Thall',
    title: 'Storm-Chaser Pilot',
    pronouns: 'he/him',
    bodyType: 'broad',
    skinTone: '#b97a4a',
    faceShape: 'angular',
    eyeStyle: 'wide',
    eyeColor: '#a855f7',
    eyebrows: 'arched',
    facialFeature: 'storm_scar',
    hairstyle: 'courier_shave',
    hairColor: '#b45309',
    initialOutfit: 'storm_run',
    accessory: 'lantern_earring',
    koiCompanionColor: 'solar_amber',
    backstory: 'cloud_monk_novice'
  }
];
