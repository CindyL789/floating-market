import { DistrictId, DistrictInfo, GearRig, Quest, DeliveryContract, NPC, DialogueNode, InventoryItem, CharacterCustomization, BiomeRegion, LandmarkInfo, BiomeId, SkillNode, SkillCategory, ArtWorkEntry } from '../types';
import manusAgentPortrait from '../assets/images/manus_agent_portrait_1787896227441.jpg';
import lanternBazaarConcept from '../assets/images/lantern_bazaar_concept_1787896236888.jpg';
import moonKoiSkyFlight from '../assets/images/moon_koi_sky_flight_1787896253050.jpg';
import undertowDenConcept from '../assets/images/undertow_den_concept_1787896264353.jpg';

export const ART_GALLERY: ArtWorkEntry[] = [
  {
    id: 'art_manus_agent',
    title: 'Agent Manus — Celestial Operative',
    subtitle: 'Shadow Broker & Starlight Cartographer',
    category: 'agent',
    image: manusAgentPortrait,
    description: 'A key operative in the skyway underground, Agent Manus moves unseen between the merchant guilds and the clandestine hulls of the Undertow. Dressed in tailored midnight-indigo silk with brass astrolabe epaulets, Manus preserves the ancient navigation charts that keep the archipelago from drifting into the abyss.',
    loreQuote: '"The winds don\'t care for guild seals or merchant gold. They obey the currents of light and the resonance of the Moon-Koi."',
    artistNote: 'Painted with rich atmospheric contrast, balancing deep indigo twilight, glowing celestial cyan filigree, and warm brass lantern reflections.'
  },
  {
    id: 'art_lantern_bazaar',
    title: 'The Lantern Bazaar at Twilight',
    subtitle: 'Commerce on a Moving Street',
    category: 'district',
    image: lanternBazaarConcept,
    description: 'The sprawling heart of the Skybound Archipelago. Precarious black-lacquer walkways and tethered trading barges link dozens of platforms under an immense crescent moon, illuminated by thousands of blue-glass lamps and amber lanterns.',
    loreQuote: '"When the fog thickens and the anchors strain, look to the blue lamps—they are the only guide between life and the endless fall."',
    artistNote: 'Emphasizes wide perspective and layered architectural density, contrasting warm hearth glows against vast cool cloudbanks.'
  },
  {
    id: 'art_moon_koi_flight',
    title: 'Moon-Koi Companion & Sky Skiff',
    subtitle: 'Harmonic Slipstream Crossing',
    category: 'lore',
    image: moonKoiSkyFlight,
    description: 'Sera Venn\'s skiff glides effortlessly through the upper cloud strata alongside Nami, the bioluminescent Moon-Koi. Shedding trails of stardust and cyan luminescence, the Moon-Koi senses invisible thermal updrafts and guides couriers through dangerous stormfronts.',
    loreQuote: '"A courier without a Moon-Koi is just wood and canvas waiting for the wind to fail."',
    artistNote: 'Rendered in ethereal starlight, capturing dynamic flow lines and bioluminescent particulate dust.'
  },
  {
    id: 'art_undertow_den',
    title: 'The Undertow Den Tavern',
    subtitle: 'Lower Hull Refuge & Clandestine Market',
    category: 'district',
    image: undertowDenConcept,
    description: 'Tucked deep in the lower belly of a giant drifting trade barge, the Undertow Den is neutral ground for smugglers, skyward vagabonds, and favor brokers. A colossal circular porthole frames the churning electric storm clouds below.',
    loreQuote: '"Up above they pray to the wind; down here we drink to the chains."',
    artistNote: 'Warm intimate tavern interior framed dramatically against cold violet lightning storm effects through the observation glass.'
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
  eyeColor: '#38bdf8', // Moon cyan
  eyebrows: 'arched',
  facialFeature: 'koi_whisker_mark',
  hairstyle: 'windblown_crest',
  hairColor: '#1e293b', // Midnight obsidian
  initialOutfit: 'standard_courier',
  accessory: 'gilded_goggles',
  koiCompanionColor: 'azure_glow',
  backstory: 'guild_apprentice'
};

export const CHARACTER_OPTIONS = {
  titles: [
    'Moon-Koi Courier',
    'Skyward Drifter',
    'Storm-Chaser Pilot',
    'Undertow Smuggler',
    'Mistland Wayfarer',
    'Celestial Cartographer',
    'Lantern Guild Adept',
    'Anchor Reef Diver'
  ],
  pronounOptions: ['she/her', 'they/them', 'he/him', 'ze/zir', 'pilot'],
  bodyTypes: [
    { id: 'nimble', name: 'Nimble & Fleet', desc: 'Fast turning agility and quick reflex slipstream response' },
    { id: 'athletic', name: 'Athletic Skiff Pilot', desc: 'Balanced stamina for heavy cargo and storm navigation' },
    { id: 'slender', name: 'Slender High-Flyer', desc: 'Lightweight build ideal for high-altitude thin cloud glide' },
    { id: 'broad', name: 'Broad Salvage Diver', desc: 'Resilient posture built for hauling deep undertow wreckage' }
  ],
  skinTones: [
    { id: 'pale_starlight', name: 'Starlight Fair', color: '#fbeade' },
    { id: 'warm_sand', name: 'Dune Sand', color: '#f4d0b2' },
    { id: 'sun_bronze', name: 'Sky-Burn Bronze', color: '#d89b70' },
    { id: 'amber_glow', name: 'Amber Dusk', color: '#b97a4a' },
    { id: 'deep_espresso', name: 'Midnight Umber', color: '#68402b' },
    { id: 'obsidian_dusk', name: 'Obsidian Cloud', color: '#3d251d' },
    { id: 'celestial_porcelain', name: 'Moon-Porcelain', color: '#e8eef8' },
    { id: 'storm_tint', name: 'Azure-Touched', color: '#c7d6e6' }
  ],
  faceShapes: [
    { id: 'sharp', name: 'Sharp & Keen', desc: 'Defined jawline honed by cutting through high-speed slipstreams' },
    { id: 'chiseled', name: 'Chiseled Navigator', desc: 'Structured high cheekbones and determined profile' },
    { id: 'round', name: 'Soft Moon-Faced', desc: 'Gentle curves reminiscent of the silver crescent moon' },
    { id: 'angular', name: 'Angular Wind-Carved', desc: 'Prominent features suited for harsh gale exposure' },
    { id: 'soft', name: 'Youthful Wayfarer', desc: 'Approachable and warm demeanor favored in night-markets' }
  ],
  eyeStyles: [
    { id: 'focused', name: 'Focused Pilot Gaze', desc: 'Piercing sight that tracks storm clouds miles ahead' },
    { id: 'almond', name: 'Almond Sky-Seeker', desc: 'Expressive and thoughtful courier eyes' },
    { id: 'wide', name: 'Wide Curious Wanderer', desc: 'Vigilant for drifting salvage and sparkling moon-droplets' },
    { id: 'mystic_glow', name: 'Moon-Attuned Glow', desc: 'Luminescent irises that resonate with Koi magic' }
  ],
  eyeColors: [
    { id: 'moon_cyan', name: 'Moon Cyan', color: '#38bdf8' },
    { id: 'amber_lantern', name: 'Lantern Amber', color: '#f59e0b' },
    { id: 'storm_violet', name: 'Storm Violet', color: '#a855f7' },
    { id: 'emerald_jade', name: 'Jade Tide', color: '#10b981' },
    { id: 'silver_starlight', name: 'Silver Starlight', color: '#e2e8f0' },
    { id: 'rose_dawn', name: 'Dawn Rose', color: '#fb7185' },
    { id: 'obsidian_dark', name: 'Deep Midnight', color: '#0f172a' }
  ],
  eyebrowStyles: [
    { id: 'arched', name: 'Arched Wind-Swept' },
    { id: 'thick', name: 'Bold & Determined' },
    { id: 'straight', name: 'Straight Courier Focus' },
    { id: 'feathered', name: 'Feathered Astral Brow' }
  ],
  facialFeatures: [
    { id: 'koi_whisker_mark', name: 'Koi Whisker Markings', desc: 'Bioluminescent streaks symbolizing bond with Nami' },
    { id: 'storm_scar', name: 'Lightning Arc Scar', desc: 'A souvenir from a close lightning bolt near the Storm Shrine' },
    { id: 'star_talisman', name: 'Forehead Star Talisman', desc: 'Sacred astral navigational rune painted with starlight ink' },
    { id: 'cloud_tattoos', name: 'Wind-Current Tattoos', desc: 'Swirling blue cloud waves etched across the cheekbones' },
    { id: 'porcelain_freckles', name: 'Stardust Freckles', desc: 'Sparkling celestial speckles that shimmer in moonlight' },
    { id: 'gilded_eyeshadow', name: 'Night-Market Gilded Kohl', desc: 'Smokey black and gold pigments favored by Undertow brokers' },
    { id: 'none', name: 'Clean Visage', desc: 'Unmarked pilot countenance' }
  ],
  hairstyles: [
    { id: 'windblown_crest', name: 'Windblown Crest', desc: 'Swept-back styling built to withstand open skiff wind' },
    { id: 'braided_topknot', name: 'Guild Topknot & Ribbons', desc: 'Traditional sky-courier knot tied with vermilion silk' },
    { id: 'flowing_strands', name: 'Flowing Astral Strands', desc: 'Long drifting hair that floats with cloud currents' },
    { id: 'courier_shave', name: 'Side-Shaved Hawk', desc: 'Pragmatic aerodynamic cut favored by speed racers' },
    { id: 'twin_loop_braids', name: 'Twin Loop Braids', desc: 'Plaited loops adorned with tiny brass beads' },
    { id: 'undercut_dreadlocks', name: 'Undertow Dreadlocks', desc: 'Rough textured braids favored in clandestine dens' },
    { id: 'celestial_bob', name: 'Celestial Sharp Bob', desc: 'Geometric modern cut framing the face neatly' },
    { id: 'wild_drift', name: 'Wild Cloud Mane', desc: 'Untamed voluminous locks kissed by mist and thunder' }
  ],
  hairColors: [
    { id: 'midnight_black', name: 'Midnight Obsidian', color: '#1e293b', highlight: '#475569' },
    { id: 'moonbeam_silver', name: 'Moonbeam Silver', color: '#e2e8f0', highlight: '#ffffff' },
    { id: 'celestial_indigo', name: 'Celestial Indigo', color: '#312e81', highlight: '#6366f1' },
    { id: 'copper_rust', name: 'Copper Sky-Rust', color: '#b45309', highlight: '#f59e0b' },
    { id: 'dawn_rose', name: 'Dawn Sakura Rose', color: '#be185d', highlight: '#f472b6' },
    { id: 'storm_teal', name: 'Storm Abyss Teal', color: '#115e59', highlight: '#2dd4bf' },
    { id: 'luminescent_cyan', name: 'Luminescent Cyan', color: '#0369a1', highlight: '#38bdf8' },
    { id: 'golden_wheat', name: 'Sunlit Gold', color: '#ca8a04', highlight: '#fde047' }
  ],
  accessories: [
    { id: 'gilded_goggles', name: 'Brass Aviator Goggles', desc: 'Amber polarized lenses to peer through dense cloud cover' },
    { id: 'lantern_earring', name: 'Hanging Lantern Earring', desc: 'A tiny glowing glass sphere filled with liquid moonlight' },
    { id: 'aviator_monocle', name: 'Sky-Nav Monocle', desc: 'Calibrated lenses for reading distant storm barometer rings' },
    { id: 'silk_face_veil', name: 'Night-Bazaar Silk Veil', desc: 'Translucent indigo face covering for anonymity' },
    { id: 'brass_hairpin', name: 'Carved Koi Hairpin', desc: 'Intricate brass pin shaped like a leaping fish' },
    { id: 'none', name: 'No Accessory', desc: 'Simple, unencumbered flight gear' }
  ],
  koiCompanionColors: [
    { id: 'azure_glow', name: 'Azure Moonbeam', color: '#38bdf8', aura: 'rgba(56, 189, 248, 0.4)' },
    { id: 'rose_gold', name: 'Rose Twilight', color: '#fb7185', aura: 'rgba(251, 113, 133, 0.4)' },
    { id: 'midnight_purple', name: 'Astral Violet', color: '#c084fc', aura: 'rgba(192, 132, 252, 0.4)' },
    { id: 'emerald_jade', name: 'Pilgrim Jade', color: '#34d399', aura: 'rgba(52, 211, 153, 0.4)' },
    { id: 'solar_amber', name: 'Lantern Amber', color: '#fbbf24', aura: 'rgba(251, 191, 36, 0.4)' }
  ],
  backstories: [
    {
      id: 'guild_apprentice',
      name: 'Sky-Guild Apprentice',
      desc: 'Trained from youth in the high lantern towers. You understand air currents, official seal protocols, and safe transit lanes.'
    },
    {
      id: 'undertow_salvager',
      name: 'Undertow Salvage Diver',
      desc: 'Grew up scavenging the dangerous under-hull wrecks. You have an eye for contraband, hidden hatches, and survival under pressure.'
    },
    {
      id: 'cloud_monk_novice',
      name: 'Anchor Shrine Acolyte',
      desc: 'Former keeper of the sacred iron chains and storm jars. You possess deep reverence for the cloud sea spirits and koi currents.'
    },
    {
      id: 'exiled_astronomer',
      name: 'Exiled Star-Cartographer',
      desc: 'Cast out from the high observatories for charting forbidden storm corridors. You seek the lost route through the Great Maelstrom.'
    }
  ]
};

export const CHARACTER_PRESETS: { name: string; tag: string; config: Partial<CharacterCustomization> }[] = [
  {
    name: 'Sera Venn',
    tag: 'Guild Master Courier',
    config: {
      name: 'Sera Venn',
      title: 'Moon-Koi Courier',
      pronouns: 'she/her',
      bodyType: 'nimble',
      skinTone: '#f4d0b2',
      faceShape: 'sharp',
      eyeStyle: 'focused',
      eyeColor: '#38bdf8',
      facialFeature: 'koi_whisker_mark',
      hairstyle: 'windblown_crest',
      hairColor: '#1e293b',
      initialOutfit: 'standard_courier',
      accessory: 'gilded_goggles',
      koiCompanionColor: 'azure_glow',
      backstory: 'guild_apprentice'
    }
  },
  {
    name: 'Kaelen Vance',
    tag: 'Undertow Shadow Runner',
    config: {
      name: 'Kaelen Vance',
      title: 'Undertow Smuggler',
      pronouns: 'they/them',
      bodyType: 'athletic',
      skinTone: '#d89b70',
      faceShape: 'chiseled',
      eyeStyle: 'mystic_glow',
      eyeColor: '#f59e0b',
      facialFeature: 'gilded_eyeshadow',
      hairstyle: 'undercut_dreadlocks',
      hairColor: '#312e81',
      initialOutfit: 'undertow_civilian',
      accessory: 'silk_face_veil',
      koiCompanionColor: 'midnight_purple',
      backstory: 'undertow_salvager'
    }
  },
  {
    name: 'Brother Thall',
    tag: 'Storm-Anchor Warden',
    config: {
      name: 'Brother Thall',
      title: 'Storm-Chaser Pilot',
      pronouns: 'he/him',
      bodyType: 'broad',
      skinTone: '#b97a4a',
      faceShape: 'angular',
      eyeStyle: 'wide',
      eyeColor: '#a855f7',
      facialFeature: 'storm_scar',
      hairstyle: 'courier_shave',
      hairColor: '#b45309',
      initialOutfit: 'storm_run',
      accessory: 'lantern_earring',
      koiCompanionColor: 'solar_amber',
      backstory: 'cloud_monk_novice'
    }
  },
  {
    name: 'Yuna of the Drift',
    tag: 'Pilgrim Wayfarer',
    config: {
      name: 'Yuna of the Drift',
      title: 'Mistland Wayfarer',
      pronouns: 'she/her',
      bodyType: 'slender',
      skinTone: '#fbeade',
      faceShape: 'round',
      eyeStyle: 'almond',
      eyeColor: '#10b981',
      facialFeature: 'porcelain_freckles',
      hairstyle: 'flowing_strands',
      hairColor: '#e2e8f0',
      initialOutfit: 'dawn_dock',
      accessory: 'brass_hairpin',
      koiCompanionColor: 'emerald_jade',
      backstory: 'guild_apprentice'
    }
  }
];

export const BIOMES: Record<BiomeId, BiomeRegion> = {
  lantern_shallows: {
    id: 'lantern_shallows',
    name: 'Lantern Shallows',
    subtitle: 'The Golden-Indigo Merchant Currents',
    description: 'Calm trade breezes illuminated by thousands of floating silk lanterns, market skiffs, and spice barges. Safe cruising skies with abundant moon-droplet drift.',
    dangerLevel: 'Low',
    weather: 'Gentle Mist & Lantern Warmth',
    color: '#0d223a',
    accentColor: '#38bdf8',
    bounds: { minX: 200, maxX: 850, minY: 250, maxY: 800 },
    specialDrop: 'Pure Moon-Droplets',
    windCurrent: 'Steady Easterly 12 kn'
  },
  undertow_abyss: {
    id: 'undertow_abyss',
    name: 'The Undertow Abyss',
    subtitle: 'Lower Hull Wreckage & Smuggler Drift',
    description: 'Sub-cloud underbelly beneath the drifting platforms. Heavy gravitational downdrafts, shadow reefs, and discarded salvage wrecks where clandestine deals occur.',
    dangerLevel: 'Dangerous',
    weather: 'Turbulent Downdrafts & Murk',
    color: '#241030',
    accentColor: '#f59e0b',
    bounds: { minX: 950, maxX: 1650, minY: 550, maxY: 1150 },
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
    bounds: { minX: 150, maxX: 800, minY: 950, maxY: 1650 },
    specialDrop: 'Charged Storm Jars',
    windCurrent: 'Shearing Updrafts 34 kn'
  },
  pilgrim_drift: {
    id: 'pilgrim_drift',
    name: 'Pilgrim Drift Mistlands',
    subtitle: 'Tranquil Koi Spawning Streams',
    description: 'Muted emerald-teal fog where schools of wild bioluminescent Moon-Koi migrate. Sacred silence broken only by distant wind chimes and floating braziers.',
    dangerLevel: 'Low',
    weather: 'Silken Cloud Fog & Chimes',
    color: '#0a2e2b',
    accentColor: '#2dd4bf',
    bounds: { minX: 1100, maxX: 1750, minY: 150, maxY: 600 },
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
    bounds: { minX: 700, maxX: 1300, minY: 50, maxY: 450 },
    specialDrop: 'Star-Chart Parchment',
    windCurrent: 'High-Altitude Jetstream 45 kn'
  },
  maelstrom_vortex: {
    id: 'maelstrom_vortex',
    name: 'The Great Upper Maelstrom',
    subtitle: 'The Impossible Vortex Hazard',
    description: 'A violent spinning atmospheric eye at the heart of the sky. Flashing lightning webs and intense gravity wells require Storm-Run Rig or Storm Ward Lantern to traverse.',
    dangerLevel: 'Lethal',
    weather: 'Catastrophic Tempest Vortex',
    color: '#380c1d',
    accentColor: '#f43f5e',
    bounds: { minX: 700, maxX: 1200, minY: 800, maxY: 1300 },
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
    coordinates: { x: 500, y: 500 },
    icon: '🏮',
    description: 'The sprawling central hub of commerce. Wet black-lacquer avenues connect dozens of precarious platforms beneath glowing moon-lamps.',
    discoveryBonus: 'Guild Trading Discounts (+10% Droplet Sell Value)',
    discovered: true
  },
  {
    id: 'landmark_undertow_den',
    name: 'The Undertow Den',
    type: 'city_platform',
    districtId: 'undertow_den',
    coordinates: { x: 1250, y: 750 },
    icon: '🎲',
    description: 'Clandestine tavern hidden in a trading barge\'s lower hull. A circular porthole frames the swirling abyss below.',
    discoveryBonus: 'Black Market Delivery Contracts & Moon-Dice Access',
    discovered: true
  },
  {
    id: 'landmark_storm_anchor',
    name: 'Storm Anchor Shrine',
    type: 'city_platform',
    districtId: 'storm_anchor_shrine',
    coordinates: { x: 400, y: 1350 },
    icon: '⚡',
    description: 'Sacred iron infrastructure that fastens the archipelago against gale winds with massive chains into the abyss.',
    discoveryBonus: 'Storm Ward Attunement (+25% Lightning Resistance)',
    discovered: true
  },
  {
    id: 'landmark_pilgrim_haven',
    name: 'Pilgrim\'s Drift & Salvage',
    type: 'city_platform',
    districtId: 'pilgrim_haven',
    coordinates: { x: 1400, y: 350 },
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
    coordinates: { x: 950, y: 200 },
    icon: '🔭',
    description: 'The highest watchtower platform of the archipelago, where astral navigators read residual moonlight.',
    discoveryBonus: 'High-Altitude Slipstream Mastery (+20% Top Speed)',
    discovered: true
  },
  {
    id: 'landmark_chain_4',
    name: 'Colossal Mooring Chain Link #4',
    type: 'ancient_wonder',
    coordinates: { x: 280, y: 1150 },
    icon: '⛓️',
    description: 'A single link of this ancient sky-chain is large enough to dock three courier skiffs. Emits a deep resonant harmonic gong during gales.',
    discoveryBonus: '+50 Moon Droplets, +2 Brass Favors',
    discovered: false
  },
  {
    id: 'landmark_star_weaver',
    name: 'Wreck of the Star-Weaver',
    type: 'salvage_wreck',
    coordinates: { x: 1480, y: 950 },
    icon: '⚓',
    description: 'The legendary royal exploration galleon that vanished fifty years ago in the Undertow downdrafts. Glowing salvage still clings to its keel.',
    discoveryBonus: '+80 Moon Droplets, +1 Charged Storm Jar',
    discovered: false
  },
  {
    id: 'landmark_koi_spawning',
    name: 'Luminescent Koi Spawning Pool',
    type: 'natural_stream',
    coordinates: { x: 1550, y: 280 },
    icon: '✨',
    description: 'A tranquil cloud eddy where glowing moon-koi gather to shed astral scales, filling the air with soft turquoise luminescence.',
    discoveryBonus: 'Companion Affinity Max Boost & +60 Droplets',
    discovered: false
  },
  {
    id: 'landmark_wind_turbines',
    name: 'Cloud-Harvester Turbine Array',
    type: 'ancient_wonder',
    coordinates: { x: 800, y: 550 },
    icon: '🌀',
    description: 'Gigantic brass propeller arrays that compress atmospheric moisture into pure moon-luminescence droplets for city lanterns.',
    discoveryBonus: '+100 Moon Droplets',
    discovered: false
  },
  {
    id: 'landmark_maelstrom_eye',
    name: 'Eye of the Upper Maelstrom',
    type: 'hazard_zone',
    coordinates: { x: 950, y: 1050 },
    icon: '🌪️',
    description: 'The catastrophic spinning vortex that separates the lower night markets from the high astral heavens. The ultimate pilot challenge.',
    discoveryBonus: 'Master Navigator Title & +3 Brass Favors',
    discovered: false
  },
  {
    id: 'landmark_astrolabe_spire',
    name: 'Zenith Astrolabe Beacon',
    type: 'ancient_wonder',
    coordinates: { x: 1100, y: 120 },
    icon: '🌌',
    description: 'A spinning spherical bronze astrolabe floating atop the high cloud sea, casting celestial constellation projections across the clouds.',
    discoveryBonus: 'Reveals all Skyway Wind Currents on the World Map',
    discovered: false
  }
];

export const DISTRICTS: Record<DistrictId, DistrictInfo> = {
  lantern_bazaar: {
    id: 'lantern_bazaar',
    name: 'Lantern Bazaar',
    epithet: 'Commerce on a Moving Street',
    description: 'A wet black-lacquer avenue connects dozens of precarious vessels and drifting platforms. Spice sellers, charm merchants, and clandestine book dealers create a dense human scale beneath an immense moon.',
    visualDirection: 'A full-bleed opening tableau in deep indigo and teal, lit by amber market lamps.',
    designTakeaway: 'Close foreground props and a long curving avenue make the bazaar feel inhabited, immense, and vulnerable.',
    coordinates: { x: 500, y: 500 },
    accentColor: '#38bdf8', // sky-400
    bgGradient: 'from-slate-950 via-[#071326] to-[#040914]',
    ambientChimeNote: 440,
    npcs: ['madame_lin', 'master_corvo'],
    availableServices: ['contracts', 'trader', 'rig_smith'],
    image: lanternBazaarConcept
  },
  undertow_den: {
    id: 'undertow_den',
    name: 'The Undertow Den',
    epithet: 'A Market Beneath the Market',
    description: 'Hidden in a trading barge\'s lower hull, this tavern is neutral ground for smugglers, brokers, performers, and captains. A circular porthole keeps the cloud sea visible, reminding every patron that safety is borrowed.',
    visualDirection: 'Warm interior refuge is made tense by the cold blue storm framed beyond the room.',
    designTakeaway: 'Contraband is embedded in the decor: courier tubes, scale charms, storm jars, locked crates, and concealed hatches.',
    coordinates: { x: 1250, y: 750 },
    accentColor: '#f59e0b', // amber-500
    bgGradient: 'from-[#1c0e18] via-[#100b1e] to-[#070b14]',
    ambientChimeNote: 330,
    npcs: ['agent_manus', 'captain_jax', 'whisperer_kael'],
    availableServices: ['contracts', 'dice_game', 'trader'],
    image: undertowDenConcept
  },
  storm_anchor_shrine: {
    id: 'storm_anchor_shrine',
    name: 'Storm Anchor Shrine',
    epithet: 'The City\'s Fragile Foundation',
    description: 'The outer shrine secures the archipelago with colossal black chains lowered through the cloud sea. It is both sacred infrastructure and a liminal market for storm jars, rope, charms, and illicit weather craft.',
    visualDirection: 'Balances tiny safe pools of lamplight with the perilous negative space of the storm below.',
    designTakeaway: 'The monumental chain scale turns a practical structure into a mythic landmark.',
    coordinates: { x: 400, y: 1350 },
    accentColor: '#818cf8', // indigo-400
    bgGradient: 'from-[#0b0c1e] via-[#09152b] to-[#030712]',
    ambientChimeNote: 261.63,
    npcs: ['brother_hane'],
    availableServices: ['shrine_altar', 'contracts', 'trader']
  },
  pilgrim_haven: {
    id: 'pilgrim_haven',
    name: 'Pilgrim\'s Drift & Salvage',
    epithet: 'Harbor of Stranded Wayfarers',
    description: 'Moored skiffs and tethered resting rafts where weary cloud voyagers repair ripped canvas and share rumors of migrating moon-koi schools.',
    visualDirection: 'Muted mist, patched sailcloth, glowing droplet nets, and soft vermilion ribbons.',
    designTakeaway: 'Fragile hope floating in open air; small braziers warming traveler hands.',
    coordinates: { x: 1400, y: 350 },
    accentColor: '#2dd4bf', // teal-400
    bgGradient: 'from-[#051821] via-[#081f2c] to-[#040c14]',
    ambientChimeNote: 523.25,
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
    coordinates: { x: 950, y: 200 },
    accentColor: '#c084fc', // purple-400
    bgGradient: 'from-[#140b2b] via-[#0a122e] to-[#040817]',
    ambientChimeNote: 659.25,
    npcs: ['astronomer_lyra'],
    availableServices: ['shrine_altar', 'rig_smith']
  }
};

export const GEAR_RIGS: Record<string, GearRig> = {
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
    colorTheme: 'from-indigo-600 to-sky-600',
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
    visualFeatures: ['Sand-grey oilskin poncho', 'Masked lower face', 'Muted rope belt', 'Concealed tubes'],
    colorTheme: 'from-amber-700 to-stone-700',
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
    colorTheme: 'from-blue-700 to-purple-800',
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
    visualFeatures: ['Plum waistcoat', 'Rolled sleeves', 'Concealed sheath', 'Vermilion sash'],
    colorTheme: 'from-rose-800 to-amber-900',
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
    description: 'A glowing cobalt scale shed by Nami. Resonates when near secret wind currents.',
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
    description: 'One of the colossal black anchor chains is rattling loose in the storm well. Deliver 2 charged Storm Jars to Brother Hane at the Shrine before the city drifts apart.',
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
    description: 'Carry the unified Covenant of Wind and Light through the eye of the Upper Maelstrom to the High Moon Pier. Sera Venn and Nami must chart the missing route that no map can hold.',
    stepDescription: 'Navigate the violent storm currents to the High Moon Pier and seal the archipelago\'s fate!',
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
    affinity: 30
  },
  master_corvo: {
    id: 'master_corvo',
    name: 'Master Corvo',
    title: 'Clockwork & Brass Antiquarian',
    districtId: 'lantern_bazaar',
    avatarMood: 'eccentric',
    greeting: 'Look at this scale compass! It drinks moonlight, not terrestrial magnetism. Need your lantern lenses polished or your skiff sails re-tensioned?',
    dialogueTreeId: 'master_corvo_start',
    affinity: 20
  },
  captain_jax: {
    id: 'captain_jax',
    name: 'Captain Jax',
    title: 'Master of the Undertow Den',
    districtId: 'undertow_den',
    avatarMood: 'shrewd',
    greeting: 'Keep your voice down, Courier. Out there, the Guild reigns; in here, under this lacquer hull, we answer only to the storm.',
    dialogueTreeId: 'captain_jax_start',
    affinity: 15
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
    portraitImage: manusAgentPortrait
  },
  whisperer_kael: {
    id: 'whisperer_kael',
    name: 'Whisperer Kael',
    title: 'Contraband & Favor Broker',
    districtId: 'undertow_den',
    avatarMood: 'mysterious',
    greeting: 'Every locked crate holds a secret, and every secret is worth three brass favors. Looking for a game of Moon-Koi Dice?',
    dialogueTreeId: 'whisperer_kael_start',
    affinity: 25
  },
  brother_hane: {
    id: 'brother_hane',
    name: 'Brother Hane',
    title: 'Guardian of the Anchor Shrine',
    districtId: 'storm_anchor_shrine',
    avatarMood: 'solemn',
    greeting: 'Do you hear them groaning? The monumental chains hold five thousand souls above oblivion. May the wind be merciful to your skiff.',
    dialogueTreeId: 'brother_hane_start',
    affinity: 20
  },
  pilgrim_yuna: {
    id: 'pilgrim_yuna',
    name: 'Pilgrim Yuna',
    title: 'Wayfarer of the Drifting Skiffs',
    districtId: 'pilgrim_haven',
    avatarMood: 'gentle',
    greeting: 'Your moon-koi, Nami... her fins shed the softest blue radiance. She guided my salvage boat through the blind fog yesterday. Bless you both.',
    dialogueTreeId: 'pilgrim_yuna_start',
    affinity: 40
  },
  astronomer_lyra: {
    id: 'astronomer_lyra',
    name: 'Astronomer Lyra',
    title: 'High Moon Observer',
    districtId: 'celestial_pier',
    avatarMood: 'visionary',
    greeting: 'The celestial alignment is at its peak. The Great Upper Maelstrom is parting its eye for only a fleeting hour. Are you ready for the final crossing?',
    dialogueTreeId: 'astronomer_lyra_start',
    affinity: 35
  }
};

export const DIALOGUE_TREES: Record<string, DialogueNode> = {
  madame_lin_start: {
    id: 'madame_lin_start',
    speaker: 'Madame Lin',
    portrait: '👘',
    text: 'Welcome back to the Lantern Bazaar, Sera. The black lacquer avenue is bustling tonight, but tension ripples across the barges. The trade routes are fraying.',
    choices: [
      {
        text: 'I am ready for duty. What deliveries are required?',
        nextNodeId: 'madame_lin_quest_check'
      },
      {
        text: 'How does the Bazaar hold together in this turbulent weather?',
        nextNodeId: 'madame_lin_lore'
      },
      {
        text: 'I\'d like to browse your trade supplies.',
        nextNodeId: 'madame_lin_trade'
      }
    ]
  },
  madame_lin_lore: {
    id: 'madame_lin_lore',
    speaker: 'Madame Lin',
    portrait: '👘',
    text: 'Blue glass is our navigation language; amber light signals shelter, food, and trustworthy passage. When the moon rises, the cloud sea becomes navigable—if your moon-koi senses the currents.',
    choices: [
      {
        text: 'Nami can smell the moonlight between the lightning clouds.',
        nextNodeId: 'madame_lin_start'
      }
    ]
  },
  madame_lin_quest_check: {
    id: 'madame_lin_quest_check',
    speaker: 'Madame Lin',
    portrait: '👘',
    text: 'Our first priority: ensure your courier credentials are confirmed with the merchant elders. Take this sealed celestial chart to the upper spice pavilion.',
    choices: [
      {
        text: 'Consider it done. (Complete Prologue)',
        action: (state, setState) => {
          setState(prev => {
            const updatedQuests = prev.activeQuests.map(q => {
              if (q.id === 'quest_chapter_1') return { ...q, completed: true, active: false };
              if (q.id === 'quest_chapter_2') return { ...q, active: true };
              return q;
            });
            return {
              ...prev,
              droplets: prev.droplets + 60,
              favors: prev.favors + 2,
              currentMainChapter: 2,
              activeQuests: updatedQuests,
              completedQuestIds: [...prev.completedQuestIds, 'quest_chapter_1'],
              logMessages: [
                {
                  id: Date.now().toString(),
                  text: 'Completed: The Moonrise Opening (+60 Droplets, +2 Favors)',
                  time: 'Just now',
                  type: 'reward'
                },
                {
                  id: (Date.now() + 1).toString(),
                  text: 'New Chapter: Whispers Beneath the Hull (Visit Undertow Den)',
                  time: 'Just now',
                  type: 'story'
                },
                ...prev.logMessages
              ]
            };
          });
        },
        nextNodeId: 'madame_lin_start'
      }
    ]
  },
  captain_jax_start: {
    id: 'captain_jax_start',
    speaker: 'Captain Jax',
    portrait: '⚓',
    text: 'Look at this porthole, Sera. The storm boils below us like black oil. You wear the marks of the courier, but the Undertow Den doesn\'t care for guild seals. What brings you into the belly of the barge?',
    choices: [
      {
        text: 'I bring a sealed manifest from the upper bazaar.',
        nextNodeId: 'captain_jax_manifest'
      },
      {
        text: 'Tell me how you survive down here beneath the market.',
        nextNodeId: 'captain_jax_lore'
      },
      {
        text: 'Let\'s talk favors and black-market contraband.',
        nextNodeId: 'captain_jax_contraband'
      }
    ]
  },
  captain_jax_lore: {
    id: 'captain_jax_lore',
    speaker: 'Captain Jax',
    portrait: '⚓',
    text: 'Safety is borrowed, kid. Up there, they pretend the wood won\'t rot and the chains won\'t snap. Down here, we trade in storm jars and illicit weather craft. If a chain gives way, only those with good sails will see tomorrow.',
    choices: [
      {
        text: 'That\'s why we need to keep the anchors secure.',
        nextNodeId: 'captain_jax_start'
      }
    ]
  },
  captain_jax_manifest: {
    id: 'captain_jax_manifest',
    speaker: 'Captain Jax',
    portrait: '⚓',
    text: 'Ah... Madame Lin\'s ciphered wax. So the upper district is finally admitting the anchor chains are slipping! Here, take this seal of the Undertow. You\'ll need the Storm-Run Rig to get near the Anchor Shrine.',
    choices: [
      {
        text: 'I will take the Storm-Run Rig and reach Brother Hane. (Advance Quest)',
        action: (state, setState) => {
          setState(prev => {
            const updatedQuests = prev.activeQuests.map(q => {
              if (q.id === 'quest_chapter_2') return { ...q, completed: true, active: false };
              if (q.id === 'quest_chapter_3') return { ...q, active: true };
              return q;
            });
            // Unlock Storm-Run Rig
            const unlocked = prev.unlockedRigs.includes('storm_run') 
              ? prev.unlockedRigs 
              : [...prev.unlockedRigs, 'storm_run' as const];

            return {
              ...prev,
              droplets: prev.droplets + 120,
              favors: prev.favors + 4,
              stormJars: prev.stormJars + 2,
              unlockedRigs: unlocked,
              currentMainChapter: 3,
              activeQuests: updatedQuests,
              completedQuestIds: [...prev.completedQuestIds, 'quest_chapter_2'],
              logMessages: [
                {
                  id: Date.now().toString(),
                  text: 'Completed: Whispers Beneath the Hull (+120 Droplets, +4 Favors, Storm-Run Rig Unlocked!)',
                  time: 'Just now',
                  type: 'reward'
                },
                {
                  id: (Date.now() + 1).toString(),
                  text: 'New Chapter: Chains in the Tempest (Equip Storm-Run Rig & fly to Anchor Shrine)',
                  time: 'Just now',
                  type: 'story'
                },
                ...prev.logMessages
              ]
            };
          });
        },
        nextNodeId: 'captain_jax_start'
      }
    ]
  },
  agent_manus_start: {
    id: 'agent_manus_start',
    speaker: 'Agent Manus',
    portrait: '🌌',
    text: 'Sera Venn. I have observed your skiff tracing the high-altitude slipstreams. The merchants see only cargo and coin, but I know what you truly carry—the harmonic resonance between courier and Moon-Koi. What intelligence do you seek?',
    choices: [
      {
        text: 'Tell me about the hidden celestial currents across the cloud sea.',
        nextNodeId: 'agent_manus_intel'
      },
      {
        text: 'Do you have classified shadow operations for an agile courier?',
        nextNodeId: 'agent_manus_mission'
      },
      {
        text: 'How did you obtain these ancient astrolabe sky charts?',
        nextNodeId: 'agent_manus_lore'
      }
    ]
  },
  agent_manus_intel: {
    id: 'agent_manus_intel',
    speaker: 'Agent Manus',
    portrait: '🌌',
    text: 'The Great Upper Maelstrom is not an ordinary weather front—it is a cosmic flux gate that draws energy directly from the moon\'s orbit. When you align your lantern with the beacon frequency while Nami is at full affinity, the lightning parted around your skiff like silk.',
    choices: [
      {
        text: 'Incredible insight. Nami feels that pull as well.',
        action: (state, setState) => {
          setState(prev => ({
            ...prev,
            stats: {
              ...prev.stats,
              koiAffinity: Math.min(100, prev.stats.koiAffinity + 10)
            },
            logMessages: [
              {
                id: Date.now().toString(),
                text: 'Agent Manus attuned your Moon-Koi resonance (+10 Koi Affinity)',
                time: 'Just now',
                type: 'info'
              },
              ...prev.logMessages
            ]
          }));
        },
        nextNodeId: 'agent_manus_start'
      }
    ]
  },
  agent_manus_mission: {
    id: 'agent_manus_mission',
    speaker: 'Agent Manus',
    portrait: '🌌',
    text: 'The Syndicate requires a discreet hand. A black-box cipher capsule was dropped into the Undertow vortex during the last patrol scramble. If you recover adrift salvage in the storm corridors, bring the brass to me.',
    choices: [
      {
        text: 'I accept the shadow contract. (+3 Brass Favors, +50 Droplets)',
        action: (state, setState) => {
          setState(prev => ({
            ...prev,
            favors: prev.favors + 3,
            droplets: prev.droplets + 50,
            logMessages: [
              {
                id: Date.now().toString(),
                text: 'Agent Manus granted Clandestine Intelligence (+50 Droplets, +3 Brass Favors)',
                time: 'Just now',
                type: 'reward'
              },
              ...prev.logMessages
            ]
          }));
        },
        nextNodeId: 'agent_manus_start'
      },
      {
        text: 'I will keep my eyes sharp on the currents.',
        nextNodeId: 'agent_manus_start'
      }
    ]
  },
  agent_manus_lore: {
    id: 'agent_manus_lore',
    speaker: 'Agent Manus',
    portrait: '🌌',
    text: 'Before the islands drifted, the Star Weavers charted every invisible thermal thread between the upper spires. My role as an agent is to ensure that when the winds shift, our people do not plunge into the dark.',
    choices: [
      {
        text: 'We are both keepers of the skyway.',
        nextNodeId: 'agent_manus_start'
      }
    ]
  },
  brother_hane_start: {
    id: 'brother_hane_start',
    speaker: 'Brother Hane',
    portrait: '🕯️',
    text: 'The lightning-lit cloud wells are violent tonight. Every link of these black chains weighs as much as a temple tower. We are tethered to the abyss, Courier.',
    choices: [
      {
        text: 'I brought the charged Storm Jars to reinforce the kinetic anchors!',
        nextNodeId: 'brother_hane_altar'
      },
      {
        text: 'How old are these monumental storm chains?',
        nextNodeId: 'brother_hane_lore'
      }
    ]
  },
  brother_hane_lore: {
    id: 'brother_hane_lore',
    speaker: 'Brother Hane',
    portrait: '🕯️',
    text: 'Forged before the Great Cataclysm when the islands first took flight. The monks have watched the links for seven hundred moonrises. The scale turning practical engineering into mythic sanctuary.',
    choices: [
      {
        text: 'The Skybound Archipelago owes you its survival.',
        nextNodeId: 'brother_hane_start'
      }
    ]
  },
  brother_hane_altar: {
    id: 'brother_hane_altar',
    speaker: 'Brother Hane',
    portrait: '🕯️',
    text: 'The lightning within these jars glows true! The anchor altar absorbs the surge—the chain stabilizes! Now, you must make the final flight to High Moon Pier and ignite the Celestial Covenant Beacon.',
    choices: [
      {
        text: 'Sera Venn and Nami will carry the light. (Advance to Finale)',
        action: (state, setState) => {
          setState(prev => {
            const updatedQuests = prev.activeQuests.map(q => {
              if (q.id === 'quest_chapter_3') return { ...q, completed: true, active: false };
              if (q.id === 'quest_chapter_4') return { ...q, active: true };
              return q;
            });
            return {
              ...prev,
              droplets: prev.droplets + 220,
              favors: prev.favors + 6,
              currentMainChapter: 4,
              activeQuests: updatedQuests,
              completedQuestIds: [...prev.completedQuestIds, 'quest_chapter_3'],
              logMessages: [
                {
                  id: Date.now().toString(),
                  text: 'Completed: Chains in the Tempest (+220 Droplets, +6 Favors)',
                  time: 'Just now',
                  type: 'reward'
                },
                {
                  id: (Date.now() + 1).toString(),
                  text: 'FINALE UNLOCKED: The Impossible Final Delivery (Fly to High Moon Pier through the vortex)',
                  time: 'Just now',
                  type: 'story'
                },
                ...prev.logMessages
              ]
            };
          });
        },
        nextNodeId: 'brother_hane_start'
      }
    ]
  },
  astronomer_lyra_start: {
    id: 'astronomer_lyra_start',
    speaker: 'Astronomer Lyra',
    portrait: '🔭',
    text: 'You made it through the Upper Maelstrom! Look below—the blue lanterns of the Archipelago shine in unison against the storm. The missing route is charted!',
    choices: [
      {
        text: 'Deliver the Master Covenant and ignite the Celestial Beacon!',
        action: (state, setState) => {
          setState(prev => {
            const updatedQuests = prev.activeQuests.map(q => {
              if (q.id === 'quest_chapter_4') return { ...q, completed: true, active: false };
              return q;
            });
            return {
              ...prev,
              droplets: prev.droplets + 500,
              favors: prev.favors + 15,
              currentMainChapter: 5,
              activeQuests: updatedQuests,
              completedQuestIds: [...prev.completedQuestIds, 'quest_chapter_4'],
              logMessages: [
                {
                  id: Date.now().toString(),
                  text: 'VICTORY! You have completed the Impossible Final Delivery! All Skyways are United!',
                  time: 'Just now',
                  type: 'reward'
                },
                ...prev.logMessages
              ]
            };
          });
        },
        nextNodeId: 'finale_complete'
      }
    ]
  },
  finale_complete: {
    id: 'finale_complete',
    speaker: 'Sera Venn & Nami',
    portrait: '✨',
    text: 'Nami glides into the starlight, scattering trails of cobalt luminescence across the clouds. The Night-Market is anchored, the winds are calm, and you are heralded as the legendary Master Courier of the Skybound Archipelago!',
    choices: [
      {
        text: 'Continue flying freely and taking endless courier contracts across the Skyways!'
      }
    ]
  }
};

export const SKILL_CATEGORIES: Record<SkillCategory, {
  id: SkillCategory;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  description: string;
}> = {
  lantern: {
    id: 'lantern',
    name: 'Luminescent Conduit',
    subtitle: 'Staff-Lantern & Energy Attunement',
    icon: '🏮',
    color: '#38bdf8',
    accentBg: 'bg-sky-500/15',
    borderColor: 'border-sky-500/40',
    textColor: 'text-sky-400',
    description: 'Mastery of phosphor optics, celestial recharge wells, and beacon illumination efficiency.'
  },
  hull_mobility: {
    id: 'hull_mobility',
    name: 'Aeronautical Mastery',
    subtitle: 'Hull Armor, Sails & Propulsion',
    icon: '🛡️',
    color: '#818cf8',
    accentBg: 'bg-indigo-500/15',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-400',
    description: 'Reinforced bulkhead frameworks, storm plating, and aerodynamic silk spinnaker aerodynamics.'
  },
  koi_synergy: {
    id: 'koi_synergy',
    name: 'Moon-Koi Attunement',
    subtitle: 'Companion Link & Astral Currents',
    icon: '✨',
    color: '#2dd4bf',
    accentBg: 'bg-teal-500/15',
    borderColor: 'border-teal-500/40',
    textColor: 'text-teal-400',
    description: 'Spiritual harmony with Nami, granting magnetic mote harvesting and slipstream immunity.'
  },
  trade_prestige: {
    id: 'trade_prestige',
    name: 'Guild Prestige & Trade',
    subtitle: 'Contracts, Favors & Commerce',
    icon: '📜',
    color: '#fbbf24',
    accentBg: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    description: 'Diplomatic standing with Sky Factions, rewarding premium cargo bounties and shop discounts.'
  }
};

export const SKILL_NODES: SkillNode[] = [
  // Tree 1: Luminescent Conduit (Lantern & Efficiency)
  {
    id: 'lantern_efficiency_1',
    name: 'Moon-Glass Refractor',
    category: 'lantern',
    tier: 1,
    costFavors: 1,
    icon: '🏮',
    description: 'Ground crystalline lens reduces phosphor depletion rate during active beacon flight.',
    effectLabel: '+35% Lantern Fuel Efficiency',
    statsEffectDescription: 'Beacon & Ward staff modes consume 35% less power per second.',
    prerequisites: []
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
    description: 'Extracts ambient luminescent condensation directly from passing cloud layers into the lantern.',
    effectLabel: 'Passive +3/s Lantern Recharge',
    statsEffectDescription: 'Continuously regenerates lantern power over time without needing to dock.',
    prerequisites: ['max_lantern_1']
  },
  {
    id: 'lantern_flare_burst',
    name: 'Nova Lumina Radiance',
    category: 'lantern',
    tier: 4,
    costFavors: 4,
    icon: '🌟',
    description: 'Channels celestial starlight into a wide radiating flare that pierces thick darkness.',
    effectLabel: 'Radiant Flare Shockwave',
    statsEffectDescription: 'Lantern beam reach expanded by 80% and stuns squall hazards in dark zones.',
    prerequisites: ['lantern_recharge_1']
  },

  // Tree 2: Aeronautical Mastery (Hull & Mobility)
  {
    id: 'hull_capacity_1',
    name: 'Reinforced Teak Ribbing',
    category: 'hull_mobility',
    tier: 1,
    costFavors: 1,
    icon: '🛡️',
    description: 'Interlocking brass and ironwood cross-bracing reinforces the skiff under-keel.',
    effectLabel: '+30 Max Hull Capacity',
    statsEffectDescription: 'Increases maximum skiff structural integrity from 100 to 130.',
    prerequisites: []
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
    name: 'Titan-Alloy Keel Framework',
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
    id: 'sail_aerodynamics',
    name: 'Aero-Silk Spinnakers',
    category: 'hull_mobility',
    tier: 4,
    costFavors: 4,
    icon: '💨',
    description: 'Lightweight moon-spun silk sails that harness even the faintest whisper of high-altitude thermals.',
    effectLabel: '+25% Cruising & Boost Speed',
    statsEffectDescription: 'Increases maximum flight speed and extends spacebar sail-boost acceleration.',
    prerequisites: ['hull_capacity_2']
  },

  // Tree 3: Moon-Koi Attunement (Companion Synergy)
  {
    id: 'koi_harmonic_bond',
    name: 'Resonant Scale Link',
    category: 'koi_synergy',
    tier: 1,
    costFavors: 1,
    icon: '✨',
    description: 'Nami creates a subtle gravitational aura that draws nearby adrift motes into your path.',
    effectLabel: '+75% Mote Attraction Radius',
    statsEffectDescription: 'Magnetically pulls Moon-Droplets and salvage crates from greater flight distance.',
    prerequisites: []
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
    id: 'koi_slipstream',
    name: 'Astral Wake Shield',
    category: 'koi_synergy',
    tier: 3,
    costFavors: 3,
    icon: '🌊',
    description: 'Nami swims ahead to slice through adverse cloud gusts, establishing a clean slipstream path.',
    effectLabel: 'Headwind Turbulence Immunity',
    statsEffectDescription: 'Prevents headwinds from slowing your skiff and increases base turning agility.',
    prerequisites: ['koi_pearl_gleaner']
  },
  {
    id: 'koi_celestial_surge',
    name: 'Moon-Dragon Ascension',
    category: 'koi_synergy',
    tier: 4,
    costFavors: 4,
    icon: '🐉',
    description: 'Awakens ancestral celestial luminescence in Nami, illuminating all secret caches across the sky.',
    effectLabel: 'Auto-Scavenge & Aura Trails',
    statsEffectDescription: 'Nami periodically retrieves nearby message capsules automatically + Max Affinity.',
    prerequisites: ['koi_slipstream']
  },

  // Tree 4: Guild Prestige & Trade (Commerce & Favors)
  {
    id: 'contract_broker',
    name: 'Guild Seal of Expedience',
    category: 'trade_prestige',
    tier: 1,
    costFavors: 1,
    icon: '📜',
    description: 'Official guild recognition guarantees premium hazard pay and expedited dispatch clearance.',
    effectLabel: '+30% Contract Pay & +1 Bonus Favor',
    statsEffectDescription: 'Completed delivery contracts award 30% more Droplets and an extra Brass Favor.',
    prerequisites: []
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
  },
  {
    id: 'salvage_keen_eye',
    name: 'Relic Scavenger Scope',
    category: 'trade_prestige',
    tier: 3,
    costFavors: 3,
    icon: '🔍',
    description: 'Specially calibrated lens identifies uncracked seals in adrift message capsules from afar.',
    effectLabel: 'Doubles Favor from Salvage (+2)',
    statsEffectDescription: 'Recovering floating message capsules yields 2 Brass Favors instead of 1.',
    prerequisites: ['trader_bargaining']
  },
  {
    id: 'archipelago_renown',
    name: 'High Archon Ambassador',
    category: 'trade_prestige',
    tier: 4,
    costFavors: 4,
    icon: '👑',
    description: 'Attains legendary courier prestige across all three ruling factions of the archipelago.',
    effectLabel: '+30 All Faction Reputations',
    statsEffectDescription: 'Instantly grants +30 reputation with Lantern Guild, Undertow Syndicate, and Anchor Monks.',
    prerequisites: ['salvage_keen_eye']
  }
];

