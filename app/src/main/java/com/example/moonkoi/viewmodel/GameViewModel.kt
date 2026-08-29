package com.example.moonkoi.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.math.*

enum class ModalType {
    NONE,
    WARDROBE,
    CODEX,
    UNDERTOW_DICE,
    CHARACTER_CREATOR,
    WORLD_MAP,
    SKILL_TREE,
    UPGRADE_SHOP,
    QUEST_DRAWER
}

class GameViewModel : ViewModel() {

    private val _gameState = MutableStateFlow(
        GameState(
            activeQuests = GameData.MAIN_QUESTS,
            inventory = GameData.INITIAL_INVENTORY,
            character = GameData.DEFAULT_CHARACTER
        )
    )
    val gameState: StateFlow<GameState> = _gameState.asStateFlow()

    private val _telemetry = MutableStateFlow(FlightTelemetry())
    val telemetry: StateFlow<FlightTelemetry> = _telemetry.asStateFlow()

    private val _activeModal = MutableStateFlow(ModalType.NONE)
    val activeModal: StateFlow<ModalType> = _activeModal.asStateFlow()

    private val _collectibles = MutableStateFlow(
        listOf(
            Collectible("d1", 600f, 450f, "droplet", 15),
            Collectible("d2", 750f, 380f, "droplet", 15),
            Collectible("d3", 1100f, 600f, "droplet", 20),
            Collectible("d4", 480f, 900f, "droplet", 15),
            Collectible("d5", 800f, 1100f, "droplet", 25),
            Collectible("d6", 1300f, 500f, "droplet", 20),
            Collectible("s1", 900f, 800f, "salvage", 40),
            Collectible("s2", 1350f, 900f, "salvage", 50),
            Collectible("z1", 350f, 1150f, "storm_charge", 30),
            Collectible("z2", 850f, 300f, "storm_charge", 30)
        )
    )
    val collectibles: StateFlow<List<Collectible>> = _collectibles.asStateFlow()

    private val _powerUps = MutableStateFlow(
        listOf(
            PowerUp("p-glider-1", 630f, 500f, "wind_glider"),
            PowerUp("p-grapple-1", 790f, 550f, "grapple_charge"),
            PowerUp("p-shock-1", 1010f, 650f, "shock_cell"),
            PowerUp("p-hull-1", 1260f, 720f, "hull_patch")
        )
    )
    val powerUps: StateFlow<List<PowerUp>> = _powerUps.asStateFlow()

    private val _enemies = MutableStateFlow(
        listOf(
            EnemySkiff("raider-1", 980f, 620f, 0.3f, 1),
            EnemySkiff("raider-2", 1320f, 820f, 1.7f, 1),
            EnemySkiff("raider-3", 420f, 1190f, 3.2f, 1)
        )
    )
    val enemies: StateFlow<List<EnemySkiff>> = _enemies.asStateFlow()

    val windCurrents = listOf(
        WindCurrent(450f, 520f, 1200f, 700f, 3.5f, 90f),
        WindCurrent(1250f, 700f, 1350f, 400f, 3.0f, 80f),
        WindCurrent(1350f, 300f, 950f, 220f, 3.2f, 80f),
        WindCurrent(900f, 250f, 450f, 500f, 3.8f, 100f),
        WindCurrent(500f, 600f, 420f, 1280f, 3.0f, 90f)
    )

    val stormZones = listOf(
        StormZone(380f, 1250f, 180f),
        StormZone(920f, 950f, 150f),
        StormZone(750f, 150f, 140f)
    )

    val grappleAnchors = listOf(
        GrappleAnchor("anchor-turbines", "Cloud-Harvester Array", 800f, 550f),
        GrappleAnchor("anchor-chain", "Mooring Chain Link #4", 280f, 1150f),
        GrappleAnchor("anchor-astrolabe", "Zenith Astrolabe Beacon", 1100f, 120f)
    )

    // Flight input state
    var joystickX = 0f
    var joystickY = 0f
    var isBoostActive = false

    private var gliderCharges = 1
    private var grappleCharges = 1
    private var shockCharges = 2
    private var gliderActiveTime = 0f
    private var grappleTargetAnchor: GrappleAnchor? = null

    private var gameLoopJob: Job? = null

    init {
        startGameLoop()
    }

    private fun startGameLoop() {
        gameLoopJob?.cancel()
        gameLoopJob = viewModelScope.launch {
            var lastTime = System.currentTimeMillis()
            while (isActive) {
                val now = System.currentTimeMillis()
                val dt = ((now - lastTime).coerceIn(1L, 100L)) / 1000f
                lastTime = now

                if (_gameState.value.viewMode == ViewMode.FLIGHT) {
                    updatePhysics(dt)
                }

                delay(16L) // ~60 FPS
            }
        }
    }

    private fun updatePhysics(dt: Float) {
        val state = _gameState.value
        val unlocked = state.unlockedSkills
        val hasAeroSilk = unlocked.contains("sail_aerodynamics")
        val hasLanternRecharge = unlocked.contains("lantern_recharge_1")
        val hasHarmonicBond = unlocked.contains("koi_harmonic_bond")
        val hasStormPlating = unlocked.contains("storm_plating_1")
        val hasImmunity = state.activeRig == RigId.storm_run || unlocked.contains("koi_slipstream")

        var vx = state.playerVelocityX
        var vy = state.playerVelocityY
        var px = state.playerX
        var py = state.playerY
        var angle = state.playerAngle

        val baseSpeed = (35f + state.upgrades.engine * 10f) * (if (state.activeRig == RigId.standard_courier) 1.25f else 1.0f) * (if (hasAeroSilk) 1.25f else 1.0f)
        val accel = if (isBoostActive) baseSpeed * 2.2f else baseSpeed

        // Joystick acceleration
        if (abs(joystickX) > 0.05f || abs(joystickY) > 0.05f) {
            val targetAngle = atan2(joystickY, joystickX)
            angle = targetAngle
            vx += cos(targetAngle) * accel * dt
            vy += sin(targetAngle) * accel * dt
        }

        // Glider boost
        if (gliderActiveTime > 0f) {
            gliderActiveTime -= dt
            vx += cos(angle) * baseSpeed * 2.5f * dt
            vy += sin(angle) * baseSpeed * 2.5f * dt
        }

        // Check Wind Currents
        var inWind = false
        for (current in windCurrents) {
            val dx = current.x2 - current.x1
            val dy = current.y2 - current.y1
            val len = hypot(dx, dy)
            val nx = dx / len
            val ny = dy / len
            val pxRel = px - current.x1
            val pyRel = py - current.y1
            val proj = pxRel * nx + pyRel * ny
            if (proj in 0f..len) {
                val perpDist = abs(pxRel * -ny + pyRel * nx)
                if (perpDist < current.width / 2f) {
                    inWind = true
                    vx += nx * current.speed * 25f * dt
                    vy += ny * current.speed * 25f * dt
                }
            }
        }

        // Check Storm Zones
        var inStorm = false
        for (storm in stormZones) {
            val d = hypot(px - storm.x, py - storm.y)
            if (d < storm.radius) {
                inStorm = true
                if (!hasImmunity && state.lanternMode != LanternMode.ward) {
                    val dmgMult = if (hasStormPlating) 0.5f else 1.0f
                    val newHull = (state.stats.hullIntegrity - 5f * dmgMult * dt).coerceAtLeast(10f)
                    _gameState.value = state.copy(
                        stats = state.stats.copy(hullIntegrity = newHull)
                    )
                }
            }
        }

        // Friction damping
        val friction = if (state.activeRig == RigId.dawn_dock) 0.94f else 0.91f
        vx *= friction.pow(dt * 60f)
        vy *= friction.pow(dt * 60f)

        // Integrate position (Bounds: 50..1750, 50..1550)
        px = (px + vx * dt).coerceIn(50f, 1750f)
        py = (py + vy * dt).coerceIn(50f, 1550f)

        // Passive lantern recharge if unlocked
        if (hasLanternRecharge) {
            val newLantern = (state.stats.lanternPower + 3f * dt).coerceAtMost(state.stats.maxLanternPower)
            _gameState.value = state.copy(stats = state.stats.copy(lanternPower = newLantern))
        }

        // Collectibles pickup
        val magnetRadius = if (hasHarmonicBond) 90f else 45f
        val currentItems = _collectibles.value.toMutableList()
        val remainingItems = mutableListOf<Collectible>()
        var gainedDroplets = 0
        var gainedFavors = 0
        var gainedJars = 0

        for (item in currentItems) {
            val dist = hypot(px - item.x, py - item.y)
            if (dist < magnetRadius) {
                when (item.type) {
                    "droplet" -> {
                        val yield = if (unlocked.contains("koi_pearl_gleaner")) (item.value * 1.5f).roundToInt() else item.value
                        gainedDroplets += yield
                    }
                    "salvage" -> {
                        gainedDroplets += item.value
                        val favorYield = if (unlocked.contains("salvage_keen_eye")) 2 else 1
                        gainedFavors += favorYield
                    }
                    "storm_charge" -> {
                        gainedJars += 1
                    }
                }
            } else {
                remainingItems.add(item)
            }
        }

        if (gainedDroplets > 0 || gainedFavors > 0 || gainedJars > 0) {
            _collectibles.value = remainingItems
            _gameState.value = _gameState.value.copy(
                droplets = _gameState.value.droplets + gainedDroplets,
                favors = _gameState.value.favors + gainedFavors,
                stormJars = _gameState.value.stormJars + gainedJars
            )
        }

        // Check PowerUps pickup
        val currentPowerUps = _powerUps.value.toMutableList()
        val remainingPowerUps = mutableListOf<PowerUp>()
        for (pu in currentPowerUps) {
            val dist = hypot(px - pu.x, py - pu.y)
            if (dist < 40f) {
                when (pu.type) {
                    "wind_glider" -> gliderCharges = (gliderCharges + 1).coerceAtMost(3)
                    "grapple_charge" -> grappleCharges = (grappleCharges + 1).coerceAtMost(3)
                    "shock_cell" -> shockCharges = (shockCharges + 2).coerceAtMost(4)
                    "hull_patch" -> {
                        val newH = (_gameState.value.stats.hullIntegrity + 25f).coerceAtMost(_gameState.value.stats.maxHull)
                        _gameState.value = _gameState.value.copy(stats = _gameState.value.stats.copy(hullIntegrity = newH))
                    }
                }
            } else {
                remainingPowerUps.add(pu)
            }
        }
        _powerUps.value = remainingPowerUps

        // Determine nearby district for docking
        var closestDist: DistrictId? = null
        var minDistrictDist = 9999f
        for ((dId, dInfo) in GameData.DISTRICTS) {
            val dist = hypot(px - dInfo.x, py - dInfo.y)
            if (dist < minDistrictDist) {
                minDistrictDist = dist
                if (dist < 130f) {
                    closestDist = dId
                }
            }
        }

        // Calculate Waypoint distance
        val wp = state.mapWaypoint
        val wpDist = if (wp != null) hypot(px - wp.x, py - wp.y).roundToInt() else null

        val currentSpeedKts = (hypot(vx, vy) * 1.8f).roundToInt()

        // Build radar blips
        val blips = mutableListOf<RadarBlip>()
        for ((dId, dInfo) in GameData.DISTRICTS) {
            blips.add(RadarBlip(dId.name, dInfo.x, dInfo.y, "district", 0xFF38BDF8))
        }
        for (item in _collectibles.value) {
            blips.add(RadarBlip(item.id, item.x, item.y, "collectible", 0xFFFBBF24))
        }
        for (enemy in _enemies.value) {
            blips.add(RadarBlip(enemy.id, enemy.x, enemy.y, "enemy", 0xFFF43F5E))
        }

        _telemetry.value = FlightTelemetry(
            speed = currentSpeedKts,
            nearbyDistrict = closestDist,
            nearbyDistance = minDistrictDist.roundToInt(),
            inWind = inWind,
            inStorm = inStorm,
            waypointDistance = wpDist,
            lanternMode = state.lanternMode,
            playerX = px,
            playerY = py,
            playerAngle = angle,
            radarBlips = blips,
            gliderCharges = gliderCharges,
            grappleCharges = grappleCharges,
            shockCharges = shockCharges,
            gliderActive = gliderActiveTime > 0f,
            grappleActive = grappleTargetAnchor != null,
            combatTargetCount = _enemies.value.size,
            powerUpCount = _powerUps.value.size
        )

        _gameState.value = state.copy(
            playerX = px,
            playerY = py,
            playerVelocityX = vx,
            playerVelocityY = vy,
            playerAngle = angle
        )
    }

    // Dock at a district
    fun dockDistrict(districtId: DistrictId) {
        val dInfo = GameData.DISTRICTS[districtId] ?: return
        val unlocked = _gameState.value.unlockedSkills
        val hasAutoRepair = unlocked.contains("hull_capacity_2")
        val currentStats = _gameState.value.stats
        val repairedHull = if (hasAutoRepair) (currentStats.hullIntegrity + 25f).coerceAtMost(currentStats.maxHull) else currentStats.hullIntegrity

        _gameState.value = _gameState.value.copy(
            currentDistrict = districtId,
            viewMode = ViewMode.DISTRICT,
            playerX = dInfo.x,
            playerY = dInfo.y,
            playerVelocityX = 0f,
            playerVelocityY = 0f,
            stats = currentStats.copy(hullIntegrity = repairedHull),
            logMessages = listOf(
                LogMessage(System.currentTimeMillis().toString(), "Docked at ${dInfo.name}", "Just now", "info")
            ) + _gameState.value.logMessages
        )
    }

    // Launch back to Skyways flight
    fun undockToSky() {
        val current = _gameState.value.currentDistrict
        val startX = if (current != null) {
            val d = GameData.DISTRICTS[current]
            if (d != null) (d.x - 140f).coerceAtLeast(50f) else _gameState.value.playerX
        } else _gameState.value.playerX

        _gameState.value = _gameState.value.copy(
            currentDistrict = null,
            viewMode = ViewMode.FLIGHT,
            playerX = startX,
            playerVelocityX = 0f,
            playerVelocityY = 0f,
            logMessages = listOf(
                LogMessage(
                    System.currentTimeMillis().toString(),
                    "Skiff launched into the Skyways. ${_gameState.value.character.name}'s Moon-Koi is swimming alongside.",
                    "Just now",
                    "info"
                )
            ) + _gameState.value.logMessages
        )
    }

    // Open NPC dialogue
    fun openDialogue(npcId: String) {
        val npc = GameData.NPCS[npcId] ?: return
        _gameState.value = _gameState.value.copy(
            activeNpcId = npcId,
            activeDialogueNodeId = npc.dialogueTreeId,
            viewMode = ViewMode.DIALOGUE
        )
    }

    fun closeDialogue() {
        _gameState.value = _gameState.value.copy(
            activeNpcId = null,
            activeDialogueNodeId = null,
            viewMode = if (_gameState.value.currentDistrict != null) ViewMode.DISTRICT else ViewMode.FLIGHT
        )
    }

    fun selectDialogueChoice(choice: DialogueChoice) {
        val prev = _gameState.value
        when (choice.actionType) {
            "complete_ch1" -> {
                val updated = prev.activeQuests.map { q ->
                    if (q.id == "quest_chapter_1") q.copy(completed = true, active = false)
                    else if (q.id == "quest_chapter_2") q.copy(active = true)
                    else q
                }
                _gameState.value = prev.copy(
                    droplets = prev.droplets + 60,
                    favors = prev.favors + 2,
                    currentMainChapter = 2,
                    activeQuests = updated,
                    completedQuestIds = prev.completedQuestIds + "quest_chapter_1",
                    logMessages = listOf(
                        LogMessage(System.currentTimeMillis().toString(), "Completed: The Moonrise Opening (+60 Droplets, +2 Favors)", "Just now", "reward"),
                        LogMessage((System.currentTimeMillis() + 1).toString(), "New Chapter: Whispers Beneath the Hull (Visit Undertow Den)", "Just now", "story")
                    ) + prev.logMessages
                )
            }
            "complete_ch2" -> {
                val updated = prev.activeQuests.map { q ->
                    if (q.id == "quest_chapter_2") q.copy(completed = true, active = false)
                    else if (q.id == "quest_chapter_3") q.copy(active = true)
                    else q
                }
                val rigs = if (prev.unlockedRigs.contains(RigId.storm_run)) prev.unlockedRigs else prev.unlockedRigs + RigId.storm_run
                _gameState.value = prev.copy(
                    droplets = prev.droplets + 120,
                    favors = prev.favors + 4,
                    stormJars = prev.stormJars + 2,
                    unlockedRigs = rigs,
                    currentMainChapter = 3,
                    activeQuests = updated,
                    completedQuestIds = prev.completedQuestIds + "quest_chapter_2",
                    logMessages = listOf(
                        LogMessage(System.currentTimeMillis().toString(), "Completed: Whispers Beneath the Hull (+120 Droplets, +4 Favors, Storm-Run Rig Unlocked!)", "Just now", "reward"),
                        LogMessage((System.currentTimeMillis() + 1).toString(), "New Chapter: Chains in the Tempest (Equip Storm-Run Rig & fly to Anchor Shrine)", "Just now", "story")
                    ) + prev.logMessages
                )
            }
            "complete_ch3" -> {
                val updated = prev.activeQuests.map { q ->
                    if (q.id == "quest_chapter_3") q.copy(completed = true, active = false)
                    else if (q.id == "quest_chapter_4") q.copy(active = true)
                    else q
                }
                _gameState.value = prev.copy(
                    droplets = prev.droplets + 220,
                    favors = prev.favors + 6,
                    currentMainChapter = 4,
                    activeQuests = updated,
                    completedQuestIds = prev.completedQuestIds + "quest_chapter_3",
                    logMessages = listOf(
                        LogMessage(System.currentTimeMillis().toString(), "Completed: Chains in the Tempest (+220 Droplets, +6 Favors)", "Just now", "reward"),
                        LogMessage((System.currentTimeMillis() + 1).toString(), "FINALE UNLOCKED: The Impossible Final Delivery (Fly to High Moon Pier)", "Just now", "story")
                    ) + prev.logMessages
                )
            }
            "complete_ch4" -> {
                val updated = prev.activeQuests.map { q ->
                    if (q.id == "quest_chapter_4") q.copy(completed = true, active = false)
                    else q
                }
                _gameState.value = prev.copy(
                    droplets = prev.droplets + 500,
                    favors = prev.favors + 15,
                    currentMainChapter = 5,
                    activeQuests = updated,
                    completedQuestIds = prev.completedQuestIds + "quest_chapter_4",
                    logMessages = listOf(
                        LogMessage(System.currentTimeMillis().toString(), "VICTORY! You have completed the Impossible Final Delivery! All Skyways are United!", "Just now", "reward")
                    ) + prev.logMessages
                )
            }
            "manus_intel" -> {
                val newAffinity = (prev.stats.koiAffinity + 10).coerceAtMost(100)
                _gameState.value = prev.copy(
                    stats = prev.stats.copy(koiAffinity = newAffinity),
                    logMessages = listOf(
                        LogMessage(System.currentTimeMillis().toString(), "Agent Manus attuned your Moon-Koi resonance (+10 Koi Affinity)", "Just now", "info")
                    ) + prev.logMessages
                )
            }
            "manus_mission" -> {
                _gameState.value = prev.copy(
                    favors = prev.favors + 3,
                    droplets = prev.droplets + 50,
                    logMessages = listOf(
                        LogMessage(System.currentTimeMillis().toString(), "Agent Manus granted Clandestine Intelligence (+50 Droplets, +3 Favors)", "Just now", "reward")
                    ) + prev.logMessages
                )
            }
        }

        if (choice.nextNodeId != null) {
            _gameState.value = _gameState.value.copy(activeDialogueNodeId = choice.nextNodeId)
        } else if (choice.actionType == null) {
            closeDialogue()
        }
    }

    fun acceptContract(contract: DeliveryContract) {
        _gameState.value = _gameState.value.copy(
            activeContract = contract,
            logMessages = listOf(
                LogMessage(
                    System.currentTimeMillis().toString(),
                    "Accepted Contract: ${contract.title} -> Deliver to ${GameData.DISTRICTS[contract.destination]?.name}",
                    "Just now",
                    "story"
                )
            ) + _gameState.value.logMessages
        )
    }

    fun deliverContract() {
        val contract = _gameState.value.activeContract ?: return
        if (contract.destination != _gameState.value.currentDistrict) return

        val hasBroker = _gameState.value.unlockedSkills.contains("contract_broker")
        val finalDroplets = (contract.rewardDroplets * (if (hasBroker) 1.3f else 1.0f)).roundToInt()
        val finalFavors = contract.rewardFavors + (if (hasBroker) 1 else 0)

        _gameState.value = _gameState.value.copy(
            droplets = _gameState.value.droplets + finalDroplets,
            favors = _gameState.value.favors + finalFavors,
            activeContract = null,
            logMessages = listOf(
                LogMessage(
                    System.currentTimeMillis().toString(),
                    "Contract Completed: ${contract.title} (+${finalDroplets} Droplets, +${finalFavors} Favors)${if (hasBroker) " [Guild Broker Bonus!]" else ""}",
                    "Just now",
                    "reward"
                )
            ) + _gameState.value.logMessages
        )
    }

    fun buyTraderItem(itemType: String, baseCost: Int) {
        val hasDiscount = _gameState.value.unlockedSkills.contains("trader_bargaining")
        val cost = if (hasDiscount) (baseCost * 0.75f).roundToInt() else baseCost

        if (_gameState.value.droplets < cost) {
            _gameState.value = _gameState.value.copy(
                logMessages = listOf(
                    LogMessage(System.currentTimeMillis().toString(), "Insufficient Moon-Droplets! Required: $cost Droplets.", "Just now", "hazard")
                ) + _gameState.value.logMessages
            )
            return
        }

        var newStats = _gameState.value.stats
        var newJars = _gameState.value.stormJars

        when (itemType) {
            "storm_jar" -> newJars += 1
            "hull_repair" -> newStats = newStats.copy(hullIntegrity = (newStats.hullIntegrity + 35f).coerceAtMost(newStats.maxHull))
            "koi_treat" -> newStats = newStats.copy(koiAffinity = (newStats.koiAffinity + 15).coerceAtMost(100))
        }

        _gameState.value = _gameState.value.copy(
            droplets = _gameState.value.droplets - cost,
            stormJars = newJars,
            stats = newStats,
            logMessages = listOf(
                LogMessage(System.currentTimeMillis().toString(), "Purchased: ${itemType.replace('_', ' ')} (-$cost Droplets)", "Just now", "info")
            ) + _gameState.value.logMessages
        )
    }

    fun unlockSkill(skillId: String) {
        val skill = GameData.SKILL_NODES.find { it.id == skillId } ?: return
        val prev = _gameState.value
        if (prev.unlockedSkills.contains(skillId)) return
        if (prev.favors < skill.costFavors) return

        var newStats = prev.stats
        if (skillId == "max_lantern_1") newStats = newStats.copy(maxLanternPower = 150f, lanternPower = 150f)
        if (skillId == "hull_capacity_1") newStats = newStats.copy(maxHull = 130f, hullIntegrity = 130f)
        if (skillId == "hull_capacity_2") newStats = newStats.copy(maxHull = 160f, hullIntegrity = 160f)

        var newRep = prev.reputation
        if (skillId == "archipelago_renown") {
            newRep = newRep.copy(
                lanternGuild = newRep.lanternGuild + 30,
                undertowSyndicate = newRep.undertowSyndicate + 30,
                anchorMonks = newRep.anchorMonks + 30
            )
        }

        _gameState.value = prev.copy(
            favors = prev.favors - skill.costFavors,
            unlockedSkills = prev.unlockedSkills + skillId,
            stats = newStats,
            reputation = newRep,
            logMessages = listOf(
                LogMessage(System.currentTimeMillis().toString(), "Attunement Unlocked: ${skill.name} (${skill.effectLabel})", "Just now", "reward")
            ) + prev.logMessages
        )
    }

    fun upgradeSkiff(stat: String) {
        val prev = _gameState.value
        val cost = when (stat) {
            "hull" -> 50 + prev.upgrades.hull * 30
            "engine" -> 60 + prev.upgrades.engine * 35
            "weapon" -> 70 + prev.upgrades.weapon * 40
            else -> 999
        }

        if (prev.droplets < cost) return

        val newUpgrades = when (stat) {
            "hull" -> prev.upgrades.copy(hull = prev.upgrades.hull + 1)
            "engine" -> prev.upgrades.copy(engine = prev.upgrades.engine + 1)
            "weapon" -> prev.upgrades.copy(weapon = prev.upgrades.weapon + 1)
            else -> prev.upgrades
        }

        val newMaxHull = 100f + newUpgrades.hull * 18f
        val newStats = prev.stats.copy(
            maxHull = newMaxHull,
            hullIntegrity = (prev.stats.hullIntegrity + 18f).coerceAtMost(newMaxHull),
            speedLevel = 1 + newUpgrades.engine
        )

        _gameState.value = prev.copy(
            droplets = prev.droplets - cost,
            upgrades = newUpgrades,
            stats = newStats,
            logMessages = listOf(
                LogMessage(System.currentTimeMillis().toString(), "Skiff Upgraded: ${stat.uppercase()} Tier ${when(stat){ "hull"->newUpgrades.hull; "engine"->newUpgrades.engine; else->newUpgrades.weapon }}", "Just now", "info")
            ) + prev.logMessages
        )
    }

    fun equipRig(rigId: RigId) {
        val rig = GameData.GEAR_RIGS[rigId] ?: return
        val prev = _gameState.value
        if (!prev.unlockedRigs.contains(rigId)) {
            if (prev.droplets < rig.cost) return
            _gameState.value = prev.copy(
                droplets = prev.droplets - rig.cost,
                unlockedRigs = prev.unlockedRigs + rigId,
                activeRig = rigId,
                logMessages = listOf(
                    LogMessage(System.currentTimeMillis().toString(), "Purchased & Equipped: ${rig.name}", "Just now", "reward")
                ) + prev.logMessages
            )
        } else {
            _gameState.value = prev.copy(
                activeRig = rigId,
                logMessages = listOf(
                    LogMessage(System.currentTimeMillis().toString(), "Equipped: ${rig.name}", "Just now", "info")
                ) + prev.logMessages
            )
        }
    }

    fun setLanternMode(mode: LanternMode) {
        _gameState.value = _gameState.value.copy(lanternMode = mode)
    }

    fun updateCharacter(customization: CharacterCustomization) {
        _gameState.value = _gameState.value.copy(character = customization)
    }

    fun setWaypoint(x: Float, y: Float, label: String) {
        _gameState.value = _gameState.value.copy(
            mapWaypoint = Waypoint(x, y, label),
            logMessages = listOf(
                LogMessage(System.currentTimeMillis().toString(), "Waypoint Set: $label ($x, $y)", "Just now", "info")
            ) + _gameState.value.logMessages
        )
    }

    fun clearWaypoint() {
        _gameState.value = _gameState.value.copy(mapWaypoint = null)
    }

    fun playUndertowDice(wager: Int): Triple<List<Int>, List<Int>, String> {
        val prev = _gameState.value
        if (prev.droplets < wager) {
            return Triple(emptyList(), emptyList(), "Insufficient Droplets for wager!")
        }

        val playerDice = listOf((1..6).random(), (1..6).random(), (1..6).random())
        val brokerDice = listOf((1..6).random(), (1..6).random(), (1..6).random())

        val pSum = playerDice.sum()
        val bSum = brokerDice.sum()
        val hasCharisma = prev.activeRig == RigId.undertow_civilian

        if (pSum > bSum || (pSum == bSum && hasCharisma)) {
            val winnings = (wager * (if (hasCharisma) 1.8f else 1.5f)).roundToInt()
            _gameState.value = prev.copy(
                droplets = prev.droplets + winnings,
                favors = prev.favors + 1,
                logMessages = listOf(
                    LogMessage(System.currentTimeMillis().toString(), "Won Undertow Moon-Dice (+${winnings} Droplets, +1 Favor)", "Just now", "reward")
                ) + prev.logMessages
            )
            return Triple(playerDice, brokerDice, "Victory! Rolled $pSum vs Broker's $bSum. Won $winnings Droplets & +1 Favor!")
        } else if (pSum < bSum) {
            _gameState.value = prev.copy(
                droplets = (prev.droplets - wager).coerceAtLeast(0),
                logMessages = listOf(
                    LogMessage(System.currentTimeMillis().toString(), "Lost Moon-Dice Wager (-${wager} Droplets)", "Just now", "hazard")
                ) + prev.logMessages
            )
            return Triple(playerDice, brokerDice, "Defeat! Rolled $pSum vs Broker's $bSum. Lost $wager Droplets.")
        } else {
            return Triple(playerDice, brokerDice, "Push! Both rolled $pSum. Wager returned.")
        }
    }

    fun useGlider() {
        if (gliderCharges > 0 && gliderActiveTime <= 0f) {
            gliderCharges -= 1
            gliderActiveTime = 3.5f
        }
    }

    fun useShock() {
        if (shockCharges > 0) {
            shockCharges -= 1
            // Clear nearby enemies within 200 units
            val px = _gameState.value.playerX
            val py = _gameState.value.playerY
            _enemies.value = _enemies.value.filter { hypot(px - it.x, py - it.y) > 220f }
        }
    }

    fun openModal(type: ModalType) {
        _activeModal.value = type
    }

    fun closeModal() {
        _activeModal.value = ModalType.NONE
    }
}
