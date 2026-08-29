package com.example.moonkoi.data

import com.example.moonkoi.R
import com.example.moonkoi.model.*

object GameData {

    val ART_GALLERY = listOf(
        ArtWorkEntry(
            id = "art_manus_agent",
            title = "Agent Manus — Celestial Operative",
            subtitle = "Shadow Broker & Starlight Cartographer",
            category = "agent",
            drawableRes = R.drawable.art_manus_agent,
            description = "A key operative in the skyway underground, Agent Manus moves unseen between the merchant guilds and the clandestine hulls of the Undertow. Dressed in tailored midnight-indigo silk with brass astrolabe epaulets, Manus preserves the ancient navigation charts that keep the archipelago from drifting into the abyss.",
            loreQuote = "\"The winds don't care for guild seals or merchant gold. They obey the currents of light and the resonance of the Moon-Koi.\"",
            artistNote = "Painted with rich atmospheric contrast, balancing deep indigo twilight, glowing celestial cyan filigree, and warm brass lantern reflections."
        ),
        ArtWorkEntry(
            id = "art_lantern_bazaar",
            title = "The Lantern Bazaar at Twilight",
            subtitle = "Commerce on a Moving Street",
            category = "district",
            drawableRes = R.drawable.art_lantern_bazaar,
            description = "The sprawling heart of the Skybound Archipelago. Precarious black-lacquer walkways and tethered trading barges link dozens of platforms under an immense crescent moon, illuminated by thousands of blue-glass lamps and amber lanterns.",
            loreQuote = "\"When the fog thickens and the anchors strain, look to the blue lamps—they are the only guide between life and the endless fall.\"",
            artistNote = "Emphasizes wide perspective and layered architectural density, contrasting warm hearth glows against vast cool cloudbanks."
        ),
        ArtWorkEntry(
            id = "art_moon_koi_flight",
            title = "Moon-Koi Companion & Sky Skiff",
            subtitle = "Harmonic Slipstream Crossing",
            category = "lore",
            drawableRes = R.drawable.art_moon_koi_flight,
            description = "Sera Venn's skiff glides effortlessly through the upper cloud strata alongside Nami, the bioluminescent Moon-Koi. Shedding trails of stardust and cyan luminescence, the Moon-Koi senses invisible thermal updrafts and guides couriers through dangerous stormfronts.",
            loreQuote = "\"A courier without a Moon-Koi is just wood and canvas waiting for the wind to fail.\"",
            artistNote = "Rendered in ethereal starlight, capturing dynamic flow lines and bioluminescent particulate dust."
        ),
        ArtWorkEntry(
            id = "art_undertow_den",
            title = "The Undertow Den Tavern",
            subtitle = "Lower Hull Refuge & Clandestine Market",
            category = "district",
            drawableRes = R.drawable.art_undertow_den,
            description = "Tucked deep in the lower belly of a giant drifting trade barge, the Undertow Den is neutral ground for smugglers, skyward vagabonds, and favor brokers. A colossal circular porthole frames the churning electric storm clouds below.",
            loreQuote = "\"Up above they pray to the wind; down here we drink to the chains.\"",
            artistNote = "Warm intimate tavern interior framed dramatically against cold violet lightning storm effects through the observation glass."
        )
    )

    val DEFAULT_CHARACTER = CharacterCustomization(
        name = "Sera Venn",
        title = "Moon-Koi Courier",
        pronouns = "she/her",
        bodyType = "nimble",
        skinTone = "#f4d0b2",
        faceShape = "sharp",
        eyeStyle = "focused",
        eyeColor = "#38bdf8",
        eyebrows = "arched",
        facialFeature = "koi_whisker_mark",
        hairstyle = "windblown_crest",
        hairColor = "#1e293b",
        initialOutfit = RigId.standard_courier,
        accessory = "gilded_goggles",
        koiCompanionColor = "azure_glow",
        backstory = "guild_apprentice"
    )

    val BIOMES = mapOf(
        BiomeId.lantern_shallows to BiomeRegion(
            id = BiomeId.lantern_shallows,
            name = "Lantern Shallows",
            subtitle = "The Golden-Indigo Merchant Currents",
            description = "Calm trade breezes illuminated by thousands of floating silk lanterns, market skiffs, and spice barges. Safe cruising skies with abundant moon-droplet drift.",
            dangerLevel = "Low",
            weather = "Gentle Mist & Lantern Warmth",
            color = "#0d223a",
            accentColor = "#38bdf8",
            minX = 200f, maxX = 850f, minY = 250f, maxY = 800f,
            specialDrop = "Pure Moon-Droplets",
            windCurrent = "Steady Easterly 12 kn"
        ),
        BiomeId.undertow_abyss to BiomeRegion(
            id = BiomeId.undertow_abyss,
            name = "The Undertow Abyss",
            subtitle = "Lower Hull Wreckage & Smuggler Drift",
            description = "Sub-cloud underbelly beneath the drifting platforms. Heavy gravitational downdrafts, shadow reefs, and discarded salvage wrecks where clandestine deals occur.",
            dangerLevel = "Dangerous",
            weather = "Turbulent Downdrafts & Murk",
            color = "#241030",
            accentColor = "#f59e0b",
            minX = 950f, maxX = 1650f, minY = 550f, maxY = 1150f,
            specialDrop = "Smuggler Brass & Salvage Scraps",
            windCurrent = "Vortical Down-Shear 28 kn"
        ),
        BiomeId.storm_anchor_rift to BiomeRegion(
            id = BiomeId.storm_anchor_rift,
            name = "Storm Anchor Rift",
            subtitle = "Monumental Iron Tether Cloud Wells",
            description = "Colossal black mooring chains span from heaven to abyss. Electrified ozone and crackling storm clouds wrap the iron links tethering the city.",
            dangerLevel = "Dangerous",
            weather = "Ozone Static & Lightning Arcs",
            color = "#111a3b",
            accentColor = "#818cf8",
            minX = 150f, maxX = 800f, minY = 950f, maxY = 1650f,
            specialDrop = "Charged Storm Jars",
            windCurrent = "Shearing Updrafts 34 kn"
        ),
        BiomeId.pilgrim_drift to BiomeRegion(
            id = BiomeId.pilgrim_drift,
            name = "Pilgrim Drift Mistlands",
            subtitle = "Tranquil Koi Spawning Streams",
            description = "Muted emerald-teal fog where schools of wild bioluminescent Moon-Koi migrate. Sacred silence broken only by distant wind chimes and floating braziers.",
            dangerLevel = "Low",
            weather = "Silken Cloud Fog & Chimes",
            color = "#0a2e2b",
            accentColor = "#2dd4bf",
            minX = 1100f, maxX = 1750f, minY = 150f, maxY = 600f,
            specialDrop = "Moon-Koi Luminescence Scale",
            windCurrent = "Gentle Thermal Stream 8 kn"
        ),
        BiomeId.celestial_zenith to BiomeRegion(
            id = BiomeId.celestial_zenith,
            name = "Celestial High Peaks",
            subtitle = "Upper Starlight & Observatory Spires",
            description = "Thin, crystal-clear stratosphere piercing above the cloud ceiling. Astral navigational slipstreams and sparkling silver aurora ribbons.",
            dangerLevel = "Moderate",
            weather = "Crystalline Aurora Stratosphere",
            color = "#1f103d",
            accentColor = "#c084fc",
            minX = 700f, maxX = 1300f, minY = 50f, maxY = 450f,
            specialDrop = "Star-Chart Parchment",
            windCurrent = "High-Altitude Jetstream 45 kn"
        ),
        BiomeId.maelstrom_vortex to BiomeRegion(
            id = BiomeId.maelstrom_vortex,
            name = "The Great Upper Maelstrom",
            subtitle = "The Impossible Vortex Hazard",
            description = "A violent spinning atmospheric eye at the heart of the sky. Flashing lightning webs and intense gravity wells require Storm-Run Rig or Storm Ward Lantern to traverse.",
            dangerLevel = "Lethal",
            weather = "Catastrophic Tempest Vortex",
            color = "#380c1d",
            accentColor = "#f43f5e",
            minX = 700f, maxX = 1200f, minY = 800f, maxY = 1300f,
            specialDrop = "Prismatic Storm Nucleus",
            windCurrent = "Violent Hurricane Shear 65 kn"
        )
    )

    val LANDMARKS = listOf(
        LandmarkInfo(
            id = "landmark_lantern_bazaar",
            name = "Lantern Bazaar",
            type = "city_platform",
            districtId = DistrictId.lantern_bazaar,
            x = 500f, y = 500f,
            icon = "🏮",
            description = "The sprawling central hub of commerce. Wet black-lacquer avenues connect dozens of precarious platforms beneath glowing moon-lamps.",
            discoveryBonus = "Guild Trading Discounts (+10% Droplet Sell Value)",
            discovered = true,
            drawableRes = R.drawable.art_lantern_bazaar
        ),
        LandmarkInfo(
            id = "landmark_undertow_den",
            name = "The Undertow Den",
            type = "city_platform",
            districtId = DistrictId.undertow_den,
            x = 1250f, y = 750f,
            icon = "🎲",
            description = "Clandestine tavern hidden in a trading barge's lower hull. A circular porthole frames the swirling abyss below.",
            discoveryBonus = "Black Market Delivery Contracts & Moon-Dice Access",
            discovered = true,
            drawableRes = R.drawable.art_undertow_den
        ),
        LandmarkInfo(
            id = "landmark_storm_anchor",
            name = "Storm Anchor Shrine",
            type = "city_platform",
            districtId = DistrictId.storm_anchor_shrine,
            x = 400f, y = 1350f,
            icon = "⚡",
            description = "Sacred iron infrastructure that fastens the archipelago against gale winds with massive chains into the abyss.",
            discoveryBonus = "Storm Ward Attunement (+25% Lightning Resistance)",
            discovered = true
        ),
        LandmarkInfo(
            id = "landmark_pilgrim_haven",
            name = "Pilgrim's Drift & Salvage",
            type = "city_platform",
            districtId = DistrictId.pilgrim_haven,
            x = 1400f, y = 350f,
            icon = "🎏",
            description = "Moored skiffs and resting rafts where weary wayfarers repair torn sails and commune with migrating koi.",
            discoveryBonus = "Nami Affinity Boost (+15% Koi Companion Resonance)",
            discovered = true
        ),
        LandmarkInfo(
            id = "landmark_celestial_pier",
            name = "High Moon Pier",
            type = "city_platform",
            districtId = DistrictId.celestial_pier,
            x = 950f, y = 200f,
            icon = "🔭",
            description = "The highest watchtower platform of the archipelago, where astral navigators read residual moonlight.",
            discoveryBonus = "High-Altitude Slipstream Mastery (+20% Top Speed)",
            discovered = true
        ),
        LandmarkInfo(
            id = "landmark_chain_4",
            name = "Mooring Chain Link #4",
            type = "ancient_wonder",
            x = 280f, y = 1150f,
            icon = "⛓️",
            description = "A single link of this ancient sky-chain is large enough to dock three courier skiffs. Emits a deep resonant harmonic gong during gales.",
            discoveryBonus = "+50 Moon Droplets, +2 Brass Favors",
            discovered = false
        ),
        LandmarkInfo(
            id = "landmark_star_weaver",
            name = "Wreck of the Star-Weaver",
            type = "salvage_wreck",
            x = 1480f, y = 950f,
            icon = "⚓",
            description = "The legendary royal exploration galleon that vanished fifty years ago in the Undertow downdrafts.",
            discoveryBonus = "+80 Moon Droplets, +1 Charged Storm Jar",
            discovered = false
        ),
        LandmarkInfo(
            id = "landmark_koi_spawning",
            name = "Luminescent Koi Pool",
            type = "natural_stream",
            x = 1550f, y = 280f,
            icon = "✨",
            description = "A tranquil cloud eddy where glowing moon-koi gather to shed astral scales, filling the air with soft turquoise luminescence.",
            discoveryBonus = "Companion Affinity Max Boost & +60 Droplets",
            discovered = false
        ),
        LandmarkInfo(
            id = "landmark_wind_turbines",
            name = "Cloud-Harvester Array",
            type = "ancient_wonder",
            x = 800f, y = 550f,
            icon = "🌀",
            description = "Gigantic brass propeller arrays that compress atmospheric moisture into pure moon-luminescence droplets.",
            discoveryBonus = "+100 Moon Droplets",
            discovered = false
        ),
        LandmarkInfo(
            id = "landmark_maelstrom_eye",
            name = "Eye of Upper Maelstrom",
            type = "hazard_zone",
            x = 950f, y = 1050f,
            icon = "🌪️",
            description = "The catastrophic spinning vortex that separates the lower night markets from the high astral heavens.",
            discoveryBonus = "Master Navigator Title & +3 Brass Favors",
            discovered = false
        ),
        LandmarkInfo(
            id = "landmark_astrolabe_spire",
            name = "Zenith Astrolabe Beacon",
            type = "ancient_wonder",
            x = 1100f, y = 120f,
            icon = "🌌",
            description = "A spinning spherical bronze astrolabe floating atop the high cloud sea, casting constellation projections.",
            discoveryBonus = "Reveals all Skyway Wind Currents on the World Map",
            discovered = false
        )
    )

    val DISTRICTS = mapOf(
        DistrictId.lantern_bazaar to DistrictInfo(
            id = DistrictId.lantern_bazaar,
            name = "Lantern Bazaar",
            epithet = "Commerce on a Moving Street",
            description = "A wet black-lacquer avenue connects dozens of precarious vessels and drifting platforms. Spice sellers, charm merchants, and clandestine book dealers create a dense human scale beneath an immense moon.",
            visualDirection = "A full-bleed opening tableau in deep indigo and teal, lit by amber market lamps.",
            designTakeaway = "Close foreground props and a long curving avenue make the bazaar feel inhabited, immense, and vulnerable.",
            x = 500f, y = 500f,
            accentColor = "#38bdf8",
            bgGradientStart = 0xFF071326,
            bgGradientEnd = 0xFF040914,
            ambientChimeNote = 440f,
            npcs = listOf("madame_lin", "master_corvo"),
            availableServices = listOf("contracts", "trader", "rig_smith"),
            drawableRes = R.drawable.art_lantern_bazaar
        ),
        DistrictId.undertow_den to DistrictInfo(
            id = DistrictId.undertow_den,
            name = "The Undertow Den",
            epithet = "A Market Beneath the Market",
            description = "Hidden in a trading barge's lower hull, this tavern is neutral ground for smugglers, brokers, performers, and captains. A circular porthole keeps the cloud sea visible, reminding every patron that safety is borrowed.",
            visualDirection = "Warm interior refuge is made tense by the cold blue storm framed beyond the room.",
            designTakeaway = "Contraband is embedded in the decor: courier tubes, scale charms, storm jars, locked crates, and concealed hatches.",
            x = 1250f, y = 750f,
            accentColor = "#f59e0b",
            bgGradientStart = 0xFF1C0E18,
            bgGradientEnd = 0xFF070B14,
            ambientChimeNote = 330f,
            npcs = listOf("agent_manus", "captain_jax", "whisperer_kael"),
            availableServices = listOf("contracts", "dice_game", "trader"),
            drawableRes = R.drawable.art_undertow_den
        ),
        DistrictId.storm_anchor_shrine to DistrictInfo(
            id = DistrictId.storm_anchor_shrine,
            name = "Storm Anchor Shrine",
            epithet = "The City's Fragile Foundation",
            description = "The outer shrine secures the archipelago with colossal black chains lowered through the cloud sea. It is both sacred infrastructure and a liminal market for storm jars, rope, charms, and illicit weather craft.",
            visualDirection = "Balances tiny safe pools of lamplight with the perilous negative space of the storm below.",
            designTakeaway = "The monumental chain scale turns a practical structure into a mythic landmark.",
            x = 400f, y = 1350f,
            accentColor = "#818cf8",
            bgGradientStart = 0xFF0B0C1E,
            bgGradientEnd = 0xFF030712,
            ambientChimeNote = 261.63f,
            npcs = listOf("brother_hane"),
            availableServices = listOf("shrine_altar", "contracts", "trader")
        ),
        DistrictId.pilgrim_haven to DistrictInfo(
            id = DistrictId.pilgrim_haven,
            name = "Pilgrim's Drift & Salvage",
            epithet = "Harbor of Stranded Wayfarers",
            description = "Moored skiffs and tethered resting rafts where weary cloud voyagers repair ripped canvas and share rumors of migrating moon-koi schools.",
            visualDirection = "Muted mist, patched sailcloth, glowing droplet nets, and soft vermilion ribbons.",
            designTakeaway = "Fragile hope floating in open air; small braziers warming traveler hands.",
            x = 1400f, y = 350f,
            accentColor = "#2dd4bf",
            bgGradientStart = 0xFF051821,
            bgGradientEnd = 0xFF040C14,
            ambientChimeNote = 523.25f,
            npcs = listOf("pilgrim_yuna"),
            availableServices = listOf("trader", "contracts")
        ),
        DistrictId.celestial_pier to DistrictInfo(
            id = DistrictId.celestial_pier,
            name = "High Moon Pier",
            epithet = "The Horizon Lookout",
            description = "The highest watchtower platform of the archipelago, where astral navigators read residual moonlight and forecast storm tides.",
            visualDirection = "Pure cobalt luminescence, open starlight, silver astrolabes, and high altitude winds.",
            designTakeaway = "Unobstructed panorama above the entire cloud sea.",
            x = 950f, y = 200f,
            accentColor = "#c084fc",
            bgGradientStart = 0xFF140B2B,
            bgGradientEnd = 0xFF040817,
            ambientChimeNote = 659.25f,
            npcs = listOf("astronomer_lyra"),
            availableServices = listOf("shrine_altar", "rig_smith")
        )
    )

    val GEAR_RIGS = mapOf(
        RigId.standard_courier to GearRig(
            id = RigId.standard_courier,
            name = "Standard Courier Rig",
            subtitle = "Official Sky Guild Attire",
            description = "For visible routes and formal deliveries. Features an indigo cloak, vermilion sash, blue-glass staff-lantern, and brass message tubes.",
            perks = listOf(
                "+25% Skiff Flight Acceleration",
                "Guild Pass: Access lawful docks & formal contracts",
                "Staff Lantern emits wide Route Beacon beam"
            ),
            visualFeatures = listOf("Indigo cloak", "Vermilion sash", "Blue-glass staff-lantern", "Brass message tubes"),
            colorTheme = "Indigo & Cyan",
            unlocked = true,
            cost = 0
        ),
        RigId.dawn_dock to GearRig(
            id = RigId.dawn_dock,
            name = "Dawn-Dock Disguise",
            subtitle = "High-Risk Clandestine Mantle",
            description = "For anonymous exchanges and high-risk handoffs. Utilizes a sand-grey oilskin poncho, masked lower face, and muted rope belt.",
            perks = listOf(
                "Stealth: Avoid patrol inspections & contraband confiscation",
                "Undertow Access: Unlocks clandestine black market orders",
                "Silent Glide: 40% less cloud turbulence friction"
            ),
            visualFeatures = listOf("Sand-grey oilskin poncho", "Masked lower face", "Muted rope belt", "Concealed tubes"),
            colorTheme = "Amber & Stone",
            unlocked = false,
            cost = 120
        ),
        RigId.storm_run to GearRig(
            id = RigId.storm_run,
            name = "Storm-Run Rig",
            subtitle = "Tempest & Chain Climber Harness",
            description = "For chain climbs and violent cloud crossings. Equipped with a short sailcoat, tether harness, lightning-proof gloves, and grappling hook.",
            perks = listOf(
                "Lightning Immunity: Immune to storm surge damage in vortexes",
                "Grappling Hook: Can tether to monumental storm chains",
                "Storm Jar Harvester: Captures lightning energy directly from clouds"
            ),
            visualFeatures = listOf("Short sailcoat", "Tether harness", "Lightning-proof gloves", "Grappling hook"),
            colorTheme = "Azure & Violet",
            unlocked = false,
            cost = 200
        ),
        RigId.undertow_civilian to GearRig(
            id = RigId.undertow_civilian,
            name = "Undertow Civilian Cover",
            subtitle = "Tavern Negotiator Attire",
            description = "For meetings inside the hidden tavern. Blends in with a plum waistcoat, rolled sleeves, concealed sheath, and retained vermilion sash.",
            perks = listOf(
                "Charisma: +30% payout on all favors & tavern wagers",
                "Haggling: 20% discount at all merchant stalls",
                "Rumor Network: Discovers hidden salvage coordinates"
            ),
            visualFeatures = listOf("Plum waistcoat", "Rolled sleeves", "Concealed sheath", "Vermilion sash"),
            colorTheme = "Rose & Amber",
            unlocked = false,
            cost = 160
        )
    )

    val INITIAL_INVENTORY = listOf(
        InventoryItem(
            id = "brass_message_tube",
            name = "Brass Message Tube",
            category = "packet",
            description = "Watertight brass cylinder stamped with the Moon-Koi seal.",
            count = 2,
            iconName = "Scroll",
            value = 20
        ),
        InventoryItem(
            id = "moon_koi_scale_charm",
            name = "Moon-Koi Scale Charm",
            category = "talisman",
            description = "A glowing cobalt scale shed by Nami. Resonates when near secret wind currents.",
            count = 1,
            iconName = "Sparkles",
            value = 50
        ),
        InventoryItem(
            id = "weather_storm_jar",
            name = "Storm Jar (Charged)",
            category = "craft",
            description = "Reinforced glass sphere containing captured blue lightning.",
            count = 1,
            iconName = "Zap",
            value = 40
        ),
        InventoryItem(
            id = "ribbed_blue_glass_lens",
            name = "Ribbed Blue Glass Lens",
            category = "upgrade",
            description = "Focuses lantern light to cut through dense thunder mist.",
            count = 1,
            iconName = "Compass",
            value = 30
        )
    )

    val MAIN_QUESTS = listOf(
        Quest(
            id = "quest_chapter_1",
            chapter = 1,
            title = "The Moonrise Opening",
            giver = "Madame Lin",
            giverLocation = DistrictId.lantern_bazaar,
            destination = DistrictId.lantern_bazaar,
            description = "Deliver the sealed Celestial Star Chart to Madame Lin at the Lantern Bazaar spice pavilion to establish your courier seal.",
            stepDescription = "Talk to Madame Lin at the Lantern Bazaar",
            rewardDroplets = 60,
            rewardFavors = 2,
            active = true,
            completed = false,
            dialogueIdOnComplete = "madame_lin_complete_ch1"
        ),
        Quest(
            id = "quest_chapter_2",
            chapter = 2,
            title = "Whispers Beneath the Hull",
            giver = "Madame Lin",
            giverLocation = DistrictId.lantern_bazaar,
            destination = DistrictId.undertow_den,
            description = "A clandestine manifest must reach Captain Jax inside the Undertow Den tavern. Beware of guild patrols—equip the Dawn-Dock Disguise or navigate stealthily.",
            stepDescription = "Fly to the Undertow Den and meet Captain Jax",
            requiredRig = RigId.dawn_dock,
            rewardDroplets = 120,
            rewardFavors = 4,
            rewardItems = listOf("Contraband Seal"),
            active = false,
            completed = false,
            dialogueIdOnComplete = "captain_jax_meet"
        ),
        Quest(
            id = "quest_chapter_3",
            chapter = 3,
            title = "Chains in the Tempest",
            giver = "Captain Jax",
            giverLocation = DistrictId.undertow_den,
            destination = DistrictId.storm_anchor_shrine,
            description = "One of the colossal black anchor chains is rattling loose in the storm well. Deliver 2 charged Storm Jars to Brother Hane at the Shrine before the city drifts apart.",
            stepDescription = "Equip Storm-Run Rig and deliver Storm Jars to Brother Hane at the Shrine",
            requiredRig = RigId.storm_run,
            rewardDroplets = 220,
            rewardFavors = 6,
            active = false,
            completed = false,
            dialogueIdOnComplete = "brother_hane_complete_ch3"
        ),
        Quest(
            id = "quest_chapter_4",
            chapter = 4,
            title = "The Impossible Final Delivery",
            giver = "Brother Hane",
            giverLocation = DistrictId.storm_anchor_shrine,
            destination = DistrictId.celestial_pier,
            description = "Carry the unified Covenant of Wind and Light through the eye of the Upper Maelstrom to the High Moon Pier. Sera Venn and Nami must chart the missing route that no map can hold.",
            stepDescription = "Navigate the violent storm currents to the High Moon Pier and seal the archipelago's fate!",
            rewardDroplets = 500,
            rewardFavors = 15,
            rewardItems = listOf("Master Courier Medallion"),
            active = false,
            completed = false,
            dialogueIdOnComplete = "finale_complete"
        )
    )

    val CONTRACT_POOL = listOf(
        DeliveryContract(
            id = "contract_1",
            client = "Silk Broker Vane",
            title = "Moisture-Sensitive Indigo Silks",
            origin = DistrictId.lantern_bazaar,
            destination = DistrictId.pilgrim_haven,
            cargo = "Bolts of woven vermilion silk",
            urgency = "Standard",
            hazard = "Avoid cloud rain pockets",
            rewardDroplets = 45,
            rewardFavors = 1,
            flavorText = "Silk ruins instantly if soaked in cloud rain. Glide swiftly on the upper thermal currents."
        ),
        DeliveryContract(
            id = "contract_2",
            client = "Smuggler Kael",
            title = "Sealed Alchemical Vials",
            origin = DistrictId.undertow_den,
            destination = DistrictId.storm_anchor_shrine,
            cargo = "Unmarked brass cylinder",
            urgency = "Urgent",
            hazard = "Volatile lightning risk",
            rewardDroplets = 85,
            rewardFavors = 3,
            flavorText = "Keep away from direct lightning strikes or the fluid will combust!"
        ),
        DeliveryContract(
            id = "contract_3",
            client = "Shrine Novice Taro",
            title = "Purified Moonlight Incense",
            origin = DistrictId.storm_anchor_shrine,
            destination = DistrictId.lantern_bazaar,
            cargo = "Incense burner & blue glass jars",
            urgency = "Standard",
            hazard = "Cross winds near the great chain",
            rewardDroplets = 55,
            rewardFavors = 2,
            flavorText = "The merchants at the Bazaar await consecrated incense to open the midnight trade."
        ),
        DeliveryContract(
            id = "contract_4",
            client = "Skyway Cartographer",
            title = "Urgent Drift Coordinates",
            origin = DistrictId.pilgrim_haven,
            destination = DistrictId.celestial_pier,
            cargo = "Wax-sealed chart tube",
            urgency = "Perilous",
            hazard = "High altitude vortex gusts",
            rewardDroplets = 110,
            rewardFavors = 4,
            flavorText = "The archipelago shifted three leagues east during the last moon tremor. Deliver before sunrise!"
        )
    )

    val NPCS = mapOf(
        "madame_lin" to NPC(
            id = "madame_lin",
            name = "Madame Lin",
            title = "Guildmistress of the Blue Lantern",
            districtId = DistrictId.lantern_bazaar,
            avatarMood = "composed",
            greeting = "Ah, Sera Venn. The moon-koi swimming beside your skiff is luminous tonight. Come, trade is brisk and the fog thickens.",
            dialogueTreeId = "madame_lin_start",
            affinity = 30,
            iconEmoji = "👘"
        ),
        "master_corvo" to NPC(
            id = "master_corvo",
            name = "Master Corvo",
            title = "Clockwork & Brass Antiquarian",
            districtId = DistrictId.lantern_bazaar,
            avatarMood = "eccentric",
            greeting = "Look at this scale compass! It drinks moonlight, not terrestrial magnetism. Need your lantern lenses polished or your skiff sails re-tensioned?",
            dialogueTreeId = "master_corvo_start",
            affinity = 20,
            iconEmoji = "🕰️"
        ),
        "captain_jax" to NPC(
            id = "captain_jax",
            name = "Captain Jax",
            title = "Master of the Undertow Den",
            districtId = DistrictId.undertow_den,
            avatarMood = "shrewd",
            greeting = "Keep your voice down, Courier. Out there, the Guild reigns; in here, under this lacquer hull, we answer only to the storm.",
            dialogueTreeId = "captain_jax_start",
            affinity = 15,
            iconEmoji = "⚓"
        ),
        "agent_manus" to NPC(
            id = "agent_manus",
            name = "Agent Manus",
            title = "Celestial Shadow Operative & Cartographer",
            districtId = DistrictId.undertow_den,
            avatarMood = "astral",
            greeting = "Greetings, Courier Sera Venn. I monitor the invisible currents that keep this archipelago suspended between oblivion and the stars. Have you come seeking classified sky charts or clandestine operations?",
            dialogueTreeId = "agent_manus_start",
            affinity = 45,
            portraitRes = R.drawable.art_manus_agent,
            iconEmoji = "🌌"
        ),
        "whisperer_kael" to NPC(
            id = "whisperer_kael",
            name = "Whisperer Kael",
            title = "Contraband & Favor Broker",
            districtId = DistrictId.undertow_den,
            avatarMood = "mysterious",
            greeting = "Every locked crate holds a secret, and every secret is worth three brass favors. Looking for a game of Moon-Koi Dice?",
            dialogueTreeId = "whisperer_kael_start",
            affinity = 25,
            iconEmoji = "🎲"
        ),
        "brother_hane" to NPC(
            id = "brother_hane",
            name = "Brother Hane",
            title = "Guardian of the Anchor Shrine",
            districtId = DistrictId.storm_anchor_shrine,
            avatarMood = "solemn",
            greeting = "Do you hear them groaning? The monumental chains hold five thousand souls above oblivion. May the wind be merciful to your skiff.",
            dialogueTreeId = "brother_hane_start",
            affinity = 20,
            iconEmoji = "🕯️"
        ),
        "pilgrim_yuna" to NPC(
            id = "pilgrim_yuna",
            name = "Pilgrim Yuna",
            title = "Wayfarer of the Drifting Skiffs",
            districtId = DistrictId.pilgrim_haven,
            avatarMood = "gentle",
            greeting = "Your moon-koi, Nami... her fins shed the softest blue radiance. She guided my salvage boat through the blind fog yesterday. Bless you both.",
            dialogueTreeId = "pilgrim_yuna_start",
            affinity = 40,
            iconEmoji = "🎏"
        ),
        "astronomer_lyra" to NPC(
            id = "astronomer_lyra",
            name = "Astronomer Lyra",
            title = "High Moon Observer",
            districtId = DistrictId.celestial_pier,
            avatarMood = "visionary",
            greeting = "The celestial alignment is at its peak. The Great Upper Maelstrom is parting its eye for only a fleeting hour. Are you ready for the final crossing?",
            dialogueTreeId = "astronomer_lyra_start",
            affinity = 35,
            iconEmoji = "🔭"
        )
    )

    val DIALOGUE_TREES = mapOf(
        "madame_lin_start" to DialogueNode(
            id = "madame_lin_start",
            speaker = "Madame Lin",
            portrait = "👘",
            text = "Welcome back to the Lantern Bazaar, Sera. The black lacquer avenue is bustling tonight, but tension ripples across the barges. The trade routes are fraying.",
            choices = listOf(
                DialogueChoice("I am ready for duty. What deliveries are required?", "madame_lin_quest_check"),
                DialogueChoice("How does the Bazaar hold together in this turbulent weather?", "madame_lin_lore"),
                DialogueChoice("I'd like to browse your trade supplies.", "madame_lin_start")
            )
        ),
        "madame_lin_lore" to DialogueNode(
            id = "madame_lin_lore",
            speaker = "Madame Lin",
            portrait = "👘",
            text = "Blue glass is our navigation language; amber light signals shelter, food, and trustworthy passage. When the moon rises, the cloud sea becomes navigable—if your moon-koi senses the currents.",
            choices = listOf(
                DialogueChoice("Nami can smell the moonlight between the lightning clouds.", "madame_lin_start")
            )
        ),
        "madame_lin_quest_check" to DialogueNode(
            id = "madame_lin_quest_check",
            speaker = "Madame Lin",
            portrait = "👘",
            text = "Our first priority: ensure your courier credentials are confirmed with the merchant elders. Take this sealed celestial chart to the upper spice pavilion.",
            choices = listOf(
                DialogueChoice("Consider it done. (Complete Prologue)", actionType = "complete_ch1", nextNodeId = "madame_lin_start")
            )
        ),
        "captain_jax_start" to DialogueNode(
            id = "captain_jax_start",
            speaker = "Captain Jax",
            portrait = "⚓",
            text = "Look at this porthole, Sera. The storm boils below us like black oil. You wear the marks of the courier, but the Undertow Den doesn't care for guild seals. What brings you into the belly of the barge?",
            choices = listOf(
                DialogueChoice("I bring a sealed manifest from the upper bazaar.", "captain_jax_manifest"),
                DialogueChoice("Tell me how you survive down here beneath the market.", "captain_jax_lore"),
                DialogueChoice("Let's talk favors and black-market contraband.", "captain_jax_start")
            )
        ),
        "captain_jax_lore" to DialogueNode(
            id = "captain_jax_lore",
            speaker = "Captain Jax",
            portrait = "⚓",
            text = "Safety is borrowed, kid. Up there, they pretend the wood won't rot and the chains won't snap. Down here, we trade in storm jars and illicit weather craft. If a chain gives way, only those with good sails will see tomorrow.",
            choices = listOf(
                DialogueChoice("That's why we need to keep the anchors secure.", "captain_jax_start")
            )
        ),
        "captain_jax_manifest" to DialogueNode(
            id = "captain_jax_manifest",
            speaker = "Captain Jax",
            portrait = "⚓",
            text = "Ah... Madame Lin's ciphered wax. So the upper district is finally admitting the anchor chains are slipping! Here, take this seal of the Undertow. You'll need the Storm-Run Rig to get near the Anchor Shrine.",
            choices = listOf(
                DialogueChoice("I will take the Storm-Run Rig and reach Brother Hane. (Advance Quest)", actionType = "complete_ch2", nextNodeId = "captain_jax_start")
            )
        ),
        "agent_manus_start" to DialogueNode(
            id = "agent_manus_start",
            speaker = "Agent Manus",
            portrait = "🌌",
            text = "Sera Venn. I have observed your skiff tracing the high-altitude slipstreams. The merchants see only cargo and coin, but I know what you truly carry—the harmonic resonance between courier and Moon-Koi. What intelligence do you seek?",
            choices = listOf(
                DialogueChoice("Tell me about the hidden celestial currents across the cloud sea.", "agent_manus_intel"),
                DialogueChoice("Do you have classified shadow operations for an agile courier?", "agent_manus_mission"),
                DialogueChoice("How did you obtain these ancient astrolabe sky charts?", "agent_manus_lore")
            )
        ),
        "agent_manus_intel" to DialogueNode(
            id = "agent_manus_intel",
            speaker = "Agent Manus",
            portrait = "🌌",
            text = "The Great Upper Maelstrom is not an ordinary weather front—it is a cosmic flux gate that draws energy directly from the moon's orbit. When you align your lantern with the beacon frequency while Nami is at full affinity, the lightning parts around your skiff like silk.",
            choices = listOf(
                DialogueChoice("Incredible insight. Nami feels that pull as well.", actionType = "manus_intel", nextNodeId = "agent_manus_start")
            )
        ),
        "agent_manus_mission" to DialogueNode(
            id = "agent_manus_mission",
            speaker = "Agent Manus",
            portrait = "🌌",
            text = "The Syndicate requires a discreet hand. A black-box cipher capsule was dropped into the Undertow vortex during the last patrol scramble. If you recover adrift salvage in the storm corridors, bring the brass to me.",
            choices = listOf(
                DialogueChoice("I accept the shadow contract. (+3 Favors, +50 Droplets)", actionType = "manus_mission", nextNodeId = "agent_manus_start"),
                DialogueChoice("I will keep my eyes sharp on the currents.", nextNodeId = "agent_manus_start")
            )
        ),
        "agent_manus_lore" to DialogueNode(
            id = "agent_manus_lore",
            speaker = "Agent Manus",
            portrait = "🌌",
            text = "Before the islands drifted, the Star Weavers charted every invisible thermal thread between the upper spires. My role as an agent is to ensure that when the winds shift, our people do not plunge into the dark.",
            choices = listOf(
                DialogueChoice("We are both keepers of the skyway.", "agent_manus_start")
            )
        ),
        "brother_hane_start" to DialogueNode(
            id = "brother_hane_start",
            speaker = "Brother Hane",
            portrait = "🕯️",
            text = "The lightning-lit cloud wells are violent tonight. Every link of these black chains weighs as much as a temple tower. We are tethered to the abyss, Courier.",
            choices = listOf(
                DialogueChoice("I brought the charged Storm Jars to reinforce the kinetic anchors!", "brother_hane_altar"),
                DialogueChoice("How old are these monumental storm chains?", "brother_hane_lore")
            )
        ),
        "brother_hane_lore" to DialogueNode(
            id = "brother_hane_lore",
            speaker = "Brother Hane",
            portrait = "🕯️",
            text = "Forged before the Great Cataclysm when the islands first took flight. The monks have watched the links for seven hundred moonrises. The scale turning practical engineering into mythic sanctuary.",
            choices = listOf(
                DialogueChoice("The Skybound Archipelago owes you its survival.", "brother_hane_start")
            )
        ),
        "brother_hane_altar" to DialogueNode(
            id = "brother_hane_altar",
            speaker = "Brother Hane",
            portrait = "🕯️",
            text = "The lightning within these jars glows true! The anchor altar absorbs the surge—the chain stabilizes! Now, you must make the final flight to High Moon Pier and ignite the Celestial Covenant Beacon.",
            choices = listOf(
                DialogueChoice("Sera Venn and Nami will carry the light. (Advance to Finale)", actionType = "complete_ch3", nextNodeId = "brother_hane_start")
            )
        ),
        "astronomer_lyra_start" to DialogueNode(
            id = "astronomer_lyra_start",
            speaker = "Astronomer Lyra",
            portrait = "🔭",
            text = "You made it through the Upper Maelstrom! Look below—the blue lanterns of the Archipelago shine in unison against the storm. The missing route is charted!",
            choices = listOf(
                DialogueChoice("Deliver the Master Covenant and ignite the Celestial Beacon!", actionType = "complete_ch4", nextNodeId = "finale_complete")
            )
        ),
        "finale_complete" to DialogueNode(
            id = "finale_complete",
            speaker = "Sera Venn & Nami",
            portrait = "✨",
            text = "Nami glides into the starlight, scattering trails of cobalt luminescence across the clouds. The Night-Market is anchored, the winds are calm, and you are heralded as the legendary Master Courier of the Skybound Archipelago!",
            choices = listOf(
                DialogueChoice("Continue flying freely and taking endless courier contracts across the Skyways!")
            )
        )
    )

    val SKILL_CATEGORIES = mapOf(
        SkillCategory.lantern to "Luminescent Conduit",
        SkillCategory.hull_mobility to "Aeronautical Mastery",
        SkillCategory.koi_synergy to "Moon-Koi Attunement",
        SkillCategory.trade_prestige to "Guild Prestige & Trade"
    )

    val SKILL_NODES = listOf(
        // Tree 1: Luminescent Conduit
        SkillNode(
            id = "lantern_efficiency_1",
            name = "Moon-Glass Refractor",
            category = SkillCategory.lantern,
            tier = 1,
            costFavors = 1,
            icon = "🏮",
            description = "Ground crystalline lens reduces phosphor depletion rate during active beacon flight.",
            effectLabel = "+35% Lantern Fuel Efficiency",
            statsEffectDescription = "Beacon & Ward staff modes consume 35% less power per second."
        ),
        SkillNode(
            id = "max_lantern_1",
            name = "Phosphor Catalyst Core",
            category = SkillCategory.lantern,
            tier = 2,
            costFavors = 2,
            icon = "💡",
            description = "Installs an expanded alchemical phosphor chamber into the courier staff pommel.",
            effectLabel = "+50 Max Lantern Capacity",
            statsEffectDescription = "Increases maximum lantern charge reservoir from 100 to 150.",
            prerequisites = listOf("lantern_efficiency_1")
        ),
        SkillNode(
            id = "lantern_recharge_1",
            name = "Cloud-Well Siphon",
            category = SkillCategory.lantern,
            tier = 3,
            costFavors = 3,
            icon = "⚡",
            description = "Extracts ambient luminescent condensation directly from passing cloud layers into the lantern.",
            effectLabel = "Passive +3/s Lantern Recharge",
            statsEffectDescription = "Continuously regenerates lantern power over time without needing to dock.",
            prerequisites = listOf("max_lantern_1")
        ),
        SkillNode(
            id = "lantern_flare_burst",
            name = "Nova Lumina Radiance",
            category = SkillCategory.lantern,
            tier = 4,
            costFavors = 4,
            icon = "🌟",
            description = "Channels celestial starlight into a wide radiating flare that pierces thick darkness.",
            effectLabel = "Radiant Flare Shockwave",
            statsEffectDescription = "Lantern beam reach expanded by 80% and stuns squall hazards in dark zones.",
            prerequisites = listOf("lantern_recharge_1")
        ),

        // Tree 2: Aeronautical Mastery
        SkillNode(
            id = "hull_capacity_1",
            name = "Reinforced Teak Ribbing",
            category = SkillCategory.hull_mobility,
            tier = 1,
            costFavors = 1,
            icon = "🛡️",
            description = "Interlocking brass and ironwood cross-bracing reinforces the skiff under-keel.",
            effectLabel = "+30 Max Hull Capacity",
            statsEffectDescription = "Increases maximum skiff structural integrity from 100 to 130."
        ),
        SkillNode(
            id = "storm_plating_1",
            name = "Conductive Hull Mesh",
            category = SkillCategory.hull_mobility,
            tier = 2,
            costFavors = 2,
            icon = "⚡",
            description = "A woven silver mesh channels lightning strikes and squall impacts away from the cabin.",
            effectLabel = "50% Hazard Damage Reduction",
            statsEffectDescription = "Halves all structural damage taken from storm lightning and squall hazards.",
            prerequisites = listOf("hull_capacity_1")
        ),
        SkillNode(
            id = "hull_capacity_2",
            name = "Titan-Alloy Keel",
            category = SkillCategory.hull_mobility,
            tier = 3,
            costFavors = 3,
            icon = "⚓",
            description = "Heavy-duty astral alloy forge that permanently bolsters structural resilience and auto-repairs.",
            effectLabel = "+30 Max Hull & Auto Dock Repair",
            statsEffectDescription = "Increases max hull to 160 and automatically restores +25 hull integrity upon docking.",
            prerequisites = listOf("storm_plating_1")
        ),
        SkillNode(
            id = "sail_aerodynamics",
            name = "Aero-Silk Spinnakers",
            category = SkillCategory.hull_mobility,
            tier = 4,
            costFavors = 4,
            icon = "💨",
            description = "Lightweight moon-spun silk sails that harness even the faintest whisper of high-altitude thermals.",
            effectLabel = "+25% Cruising & Boost Speed",
            statsEffectDescription = "Increases maximum flight speed and extends sail-boost acceleration.",
            prerequisites = listOf("hull_capacity_2")
        ),

        // Tree 3: Moon-Koi Attunement
        SkillNode(
            id = "koi_harmonic_bond",
            name = "Resonant Scale Link",
            category = SkillCategory.koi_synergy,
            tier = 1,
            costFavors = 1,
            icon = "✨",
            description = "Nami creates a subtle gravitational aura that draws nearby adrift motes into your path.",
            effectLabel = "+75% Mote Attraction Radius",
            statsEffectDescription = "Magnetically pulls Moon-Droplets and salvage crates from greater flight distance."
        ),
        SkillNode(
            id = "koi_pearl_gleaner",
            name = "Luminous Pearl Harvest",
            category = SkillCategory.koi_synergy,
            tier = 2,
            costFavors = 2,
            icon = "🔮",
            description = "Nami purifies condensed cloud moisture, concentrating droplets into rare astral essence.",
            effectLabel = "+50% Droplets Yield Multiplier",
            statsEffectDescription = "All collected Moon-Droplets grant 50% more currency value on pickup.",
            prerequisites = listOf("koi_harmonic_bond")
        ),
        SkillNode(
            id = "koi_slipstream",
            name = "Astral Wake Shield",
            category = SkillCategory.koi_synergy,
            tier = 3,
            costFavors = 3,
            icon = "🌊",
            description = "Nami swims ahead to slice through adverse cloud gusts, establishing a clean slipstream path.",
            effectLabel = "Headwind Turbulence Immunity",
            statsEffectDescription = "Prevents headwinds from slowing your skiff and increases base turning agility.",
            prerequisites = listOf("koi_pearl_gleaner")
        ),
        SkillNode(
            id = "koi_celestial_surge",
            name = "Moon-Dragon Ascension",
            category = SkillCategory.koi_synergy,
            tier = 4,
            costFavors = 4,
            icon = "🐉",
            description = "Awakens ancestral celestial luminescence in Nami, illuminating all secret caches across the sky.",
            effectLabel = "Auto-Scavenge & Aura Trails",
            statsEffectDescription = "Nami periodically retrieves nearby message capsules automatically + Max Affinity.",
            prerequisites = listOf("koi_slipstream")
        ),

        // Tree 4: Guild Prestige & Trade
        SkillNode(
            id = "contract_broker",
            name = "Guild Seal of Expedience",
            category = SkillCategory.trade_prestige,
            tier = 1,
            costFavors = 1,
            icon = "📜",
            description = "Official guild recognition guarantees premium hazard pay and expedited dispatch clearance.",
            effectLabel = "+30% Contract Pay & +1 Bonus Favor",
            statsEffectDescription = "Completed delivery contracts award 30% more Droplets and an extra Brass Favor."
        ),
        SkillNode(
            id = "trader_bargaining",
            name = "Market Quartermaster",
            category = SkillCategory.trade_prestige,
            tier = 2,
            costFavors = 2,
            icon = "🪙",
            description = "Deep knowledge of district tariffs allows negotiating steep wholesale discounts at all trading posts.",
            effectLabel = "25% Trader Goods Discount",
            statsEffectDescription = "Reduces droplet cost of all hull repairs, storm jars, and koi treats by 25%.",
            prerequisites = listOf("contract_broker")
        ),
        SkillNode(
            id = "salvage_keen_eye",
            name = "Relic Scavenger Scope",
            category = SkillCategory.trade_prestige,
            tier = 3,
            costFavors = 3,
            icon = "🔍",
            description = "Specially calibrated lens identifies uncracked seals in adrift message capsules from afar.",
            effectLabel = "Doubles Favor from Salvage (+2)",
            statsEffectDescription = "Recovering floating message capsules yields 2 Brass Favors instead of 1.",
            prerequisites = listOf("trader_bargaining")
        ),
        SkillNode(
            id = "archipelago_renown",
            name = "High Archon Ambassador",
            category = SkillCategory.trade_prestige,
            tier = 4,
            costFavors = 4,
            icon = "👑",
            description = "Attains legendary courier prestige across all three ruling factions of the archipelago.",
            effectLabel = "+30 All Faction Reputations",
            statsEffectDescription = "Instantly grants +30 reputation with Lantern Guild, Undertow Syndicate, and Anchor Monks.",
            prerequisites = listOf("salvage_keen_eye")
        )
    )

    val CHARACTER_PRESETS = listOf(
        CharacterCustomization(
            name = "Sera Venn",
            title = "Moon-Koi Courier",
            pronouns = "she/her",
            bodyType = "nimble",
            skinTone = "#f4d0b2",
            faceShape = "sharp",
            eyeStyle = "focused",
            eyeColor = "#38bdf8",
            facialFeature = "koi_whisker_mark",
            hairstyle = "windblown_crest",
            hairColor = "#1e293b",
            initialOutfit = RigId.standard_courier,
            accessory = "gilded_goggles",
            koiCompanionColor = "azure_glow",
            backstory = "guild_apprentice"
        ),
        CharacterCustomization(
            name = "Kaelen Vance",
            title = "Undertow Smuggler",
            pronouns = "they/them",
            bodyType = "athletic",
            skinTone = "#d89b70",
            faceShape = "chiseled",
            eyeStyle = "mystic_glow",
            eyeColor = "#f59e0b",
            facialFeature = "gilded_eyeshadow",
            hairstyle = "undercut_dreadlocks",
            hairColor = "#312e81",
            initialOutfit = RigId.undertow_civilian,
            accessory = "silk_face_veil",
            koiCompanionColor = "midnight_purple",
            backstory = "undertow_salvager"
        ),
        CharacterCustomization(
            name = "Brother Thall",
            title = "Storm-Chaser Pilot",
            pronouns = "he/him",
            bodyType = "broad",
            skinTone = "#b97a4a",
            faceShape = "angular",
            eyeStyle = "wide",
            eyeColor = "#a855f7",
            facialFeature = "storm_scar",
            hairstyle = "courier_shave",
            hairColor = "#b45309",
            initialOutfit = RigId.storm_run,
            accessory = "lantern_earring",
            koiCompanionColor = "solar_amber",
            backstory = "cloud_monk_novice"
        ),
        CharacterCustomization(
            name = "Yuna of the Drift",
            title = "Mistland Wayfarer",
            pronouns = "she/her",
            bodyType = "slender",
            skinTone = "#fbeade",
            faceShape = "round",
            eyeStyle = "almond",
            eyeColor = "#10b981",
            facialFeature = "porcelain_freckles",
            hairstyle = "flowing_strands",
            hairColor = "#e2e8f0",
            initialOutfit = RigId.dawn_dock,
            accessory = "brass_hairpin",
            koiCompanionColor = "emerald_jade",
            backstory = "guild_apprentice"
        )
    )
}
