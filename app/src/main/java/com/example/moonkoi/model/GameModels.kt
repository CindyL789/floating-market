package com.example.moonkoi.model

enum class DistrictId {
    lantern_bazaar,
    undertow_den,
    storm_anchor_shrine,
    pilgrim_haven,
    celestial_pier
}

enum class RigId {
    standard_courier,
    dawn_dock,
    storm_run,
    undertow_civilian
}

enum class LanternMode {
    beacon,
    signal,
    ward
}

enum class BiomeId {
    lantern_shallows,
    undertow_abyss,
    storm_anchor_rift,
    pilgrim_drift,
    celestial_zenith,
    maelstrom_vortex
}

enum class SkillCategory {
    lantern,
    hull_mobility,
    koi_synergy,
    trade_prestige
}

data class CharacterCustomization(
    val name: String = "Sera Venn",
    val title: String = "Moon-Koi Courier",
    val pronouns: String = "she/her",
    val bodyType: String = "nimble",
    val skinTone: String = "#f4d0b2",
    val faceShape: String = "sharp",
    val eyeStyle: String = "focused",
    val eyeColor: String = "#38bdf8",
    val eyebrows: String = "arched",
    val facialFeature: String = "koi_whisker_mark",
    val hairstyle: String = "windblown_crest",
    val hairColor: String = "#1e293b",
    val initialOutfit: RigId = RigId.standard_courier,
    val accessory: String = "gilded_goggles",
    val koiCompanionColor: String = "azure_glow",
    val backstory: String = "guild_apprentice"
)

data class SkillNode(
    val id: String,
    val name: String,
    val category: SkillCategory,
    val tier: Int,
    val costFavors: Int,
    val icon: String,
    val description: String,
    val effectLabel: String,
    val statsEffectDescription: String,
    val prerequisites: List<String> = emptyList()
)

data class BiomeRegion(
    val id: BiomeId,
    val name: String,
    val subtitle: String,
    val description: String,
    val dangerLevel: String,
    val weather: String,
    val color: String,
    val accentColor: String,
    val minX: Float,
    val maxX: Float,
    val minY: Float,
    val maxY: Float,
    val specialDrop: String,
    val windCurrent: String
)

data class LandmarkInfo(
    val id: String,
    val name: String,
    val type: String,
    val districtId: DistrictId? = null,
    val x: Float,
    val y: Float,
    val icon: String,
    val description: String,
    val discoveryBonus: String,
    val discovered: Boolean = false,
    val drawableRes: Int? = null
)

data class ArtWorkEntry(
    val id: String,
    val title: String,
    val subtitle: String,
    val category: String,
    val drawableRes: Int,
    val description: String,
    val loreQuote: String,
    val artistNote: String
)

data class GearRig(
    val id: RigId,
    val name: String,
    val subtitle: String,
    val description: String,
    val perks: List<String>,
    val visualFeatures: List<String>,
    val colorTheme: String,
    val unlocked: Boolean = false,
    val cost: Int = 0
)

data class InventoryItem(
    val id: String,
    val name: String,
    val category: String,
    val description: String,
    val count: Int,
    val iconName: String,
    val value: Int
)

data class Quest(
    val id: String,
    val chapter: Int,
    val title: String,
    val giver: String,
    val giverLocation: DistrictId,
    val destination: DistrictId,
    val description: String,
    val requiredRig: RigId? = null,
    val rewardDroplets: Int,
    val rewardFavors: Int,
    val rewardItems: List<String> = emptyList(),
    val completed: Boolean = false,
    val active: Boolean = false,
    val stepDescription: String,
    val dialogueIdOnComplete: String? = null
)

data class DeliveryContract(
    val id: String,
    val client: String,
    val title: String,
    val origin: DistrictId,
    val destination: DistrictId,
    val cargo: String,
    val urgency: String, // Standard, Urgent, Perilous
    val hazard: String,
    val rewardDroplets: Int,
    val rewardFavors: Int,
    val flavorText: String
)

data class NPC(
    val id: String,
    val name: String,
    val title: String,
    val districtId: DistrictId,
    val avatarMood: String,
    val greeting: String,
    val dialogueTreeId: String,
    val affinity: Int = 30,
    val portraitRes: Int? = null,
    val iconEmoji: String = "👤"
)

data class DialogueChoice(
    val text: String,
    val nextNodeId: String? = null,
    val actionType: String? = null, // "complete_ch1", "complete_ch2", "complete_ch3", "complete_ch4", "manus_intel", "manus_mission"
    val requiredFavor: Int? = null,
    val requiredRig: RigId? = null
)

data class DialogueNode(
    val id: String,
    val speaker: String,
    val portrait: String,
    val text: String,
    val choices: List<DialogueChoice>
)

data class DistrictInfo(
    val id: DistrictId,
    val name: String,
    val epithet: String,
    val description: String,
    val visualDirection: String,
    val designTakeaway: String,
    val x: Float,
    val y: Float,
    val accentColor: String,
    val bgGradientStart: Long,
    val bgGradientEnd: Long,
    val ambientChimeNote: Float,
    val npcs: List<String>,
    val availableServices: List<String>,
    val drawableRes: Int? = null
)

data class PlayerStats(
    val hullIntegrity: Float = 100f,
    val maxHull: Float = 100f,
    val speedLevel: Int = 1,
    val lanternPower: Float = 100f,
    val maxLanternPower: Float = 100f,
    val koiAffinity: Int = 65
)

data class UpgradeLevels(
    val hull: Int = 0,
    val engine: Int = 0,
    val weapon: Int = 0
)

data class LogMessage(
    val id: String,
    val text: String,
    val time: String,
    val type: String // "info", "reward", "hazard", "story"
)

data class Waypoint(
    val x: Float,
    val y: Float,
    val label: String
)

data class Reputation(
    val lanternGuild: Int = 50,
    val undertowSyndicate: Int = 15,
    val anchorMonks: Int = 20
)

enum class ViewMode {
    FLIGHT,
    DISTRICT,
    DIALOGUE
}

data class GameState(
    val currentDistrict: DistrictId? = DistrictId.lantern_bazaar,
    val viewMode: ViewMode = ViewMode.DISTRICT,
    val playerX: Float = 500f,
    val playerY: Float = 500f,
    val playerVelocityX: Float = 0f,
    val playerVelocityY: Float = 0f,
    val playerAngle: Float = 0f,
    val stats: PlayerStats = PlayerStats(),
    val upgrades: UpgradeLevels = UpgradeLevels(),
    val droplets: Int = 80,
    val favors: Int = 3,
    val stormJars: Int = 1,
    val reputation: Reputation = Reputation(),
    val activeRig: RigId = RigId.standard_courier,
    val unlockedRigs: List<RigId> = listOf(RigId.standard_courier),
    val lanternMode: LanternMode = LanternMode.beacon,
    val activeQuests: List<Quest> = emptyList(),
    val completedQuestIds: List<String> = emptyList(),
    val currentMainChapter: Int = 1,
    val activeContract: DeliveryContract? = null,
    val inventory: List<InventoryItem> = emptyList(),
    val activeDialogueNodeId: String? = null,
    val activeNpcId: String? = null,
    val character: CharacterCustomization = CharacterCustomization(),
    val discoveredLandmarks: List<String> = listOf("lantern_bazaar", "star_weaver_wreck"),
    val mapWaypoint: Waypoint? = null,
    val unlockedSkills: List<String> = emptyList(),
    val soundEnabled: Boolean = true,
    val volume: Float = 0.6f,
    val logMessages: List<LogMessage> = listOf(
        LogMessage("1", "The markets open after moonrise. Blue lanterns guide the cloud sea.", "Just now", "story")
    )
)

data class RadarBlip(
    val id: String,
    val x: Float,
    val y: Float,
    val type: String, // district, landmark, collectible, storm, powerup, enemy, anchor
    val accent: Long
)

data class Collectible(
    val id: String,
    val x: Float,
    val y: Float,
    val type: String, // droplet, salvage, storm_charge
    val value: Int,
    val pulse: Float = 0f
)

data class PowerUp(
    val id: String,
    val x: Float,
    val y: Float,
    val type: String, // wind_glider, grapple_charge, shock_cell, hull_patch
    val pulse: Float = 0f
)

data class EnemySkiff(
    val id: String,
    var x: Float,
    var y: Float,
    var phase: Float = 0f,
    var health: Int = 1,
    var attackTimer: Float = 0f
)

data class GrappleAnchor(
    val id: String,
    val name: String,
    val x: Float,
    val y: Float
)

data class WindCurrent(
    val x1: Float,
    val y1: Float,
    val x2: Float,
    val y2: Float,
    val speed: Float,
    val width: Float
)

data class StormZone(
    val x: Float,
    val y: Float,
    val radius: Float
)

data class FlightTelemetry(
    val speed: Int = 0,
    val nearbyDistrict: DistrictId? = null,
    val nearbyDistance: Int = 9999,
    val inWind: Boolean = false,
    val inStorm: Boolean = false,
    val waypointDistance: Int? = null,
    val lanternMode: LanternMode = LanternMode.beacon,
    val playerX: Float = 0f,
    val playerY: Float = 0f,
    val playerAngle: Float = 0f,
    val radarBlips: List<RadarBlip> = emptyList(),
    val gliderCharges: Int = 1,
    val grappleCharges: Int = 1,
    val shockCharges: Int = 2,
    val gliderActive: Boolean = false,
    val grappleActive: Boolean = false,
    val combatTargetCount: Int = 0,
    val powerUpCount: Int = 0
)
