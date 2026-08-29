package com.example.moonkoi.ui.flight

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.*
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel
import kotlin.math.*

@Composable
fun SkyFlightScreen(
    viewModel: GameViewModel,
    gameState: GameState,
    onDock: (DistrictId) -> Unit,
    modifier: Modifier = Modifier
) {
    val telemetry by viewModel.telemetry.collectAsState()
    val collectibles by viewModel.collectibles.collectAsState()
    val powerUps by viewModel.powerUps.collectAsState()
    val enemies by viewModel.enemies.collectAsState()

    var joystickOffset by remember { mutableStateOf(Offset.Zero) }
    var animPhase by remember { mutableFloatStateOf(0f) }

    LaunchedEffect(Unit) {
        while (true) {
            animPhase = (animPhase + 0.05f) % (Math.PI.toFloat() * 2f)
            kotlinx.coroutines.delay(16L)
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MidnightIndigo)
    ) {
        // Flight Canvas Viewport
        Canvas(
            modifier = Modifier
                .fillMaxSize()
        ) {
            val canvasW = size.width
            val canvasH = size.height
            val cx = canvasW / 2f
            val cy = canvasH / 2f

            val px = gameState.playerX
            val py = gameState.playerY
            val angle = gameState.playerAngle

            // Draw Skyways Background Grid & Stars
            drawSkyBackground(px, py, canvasW, canvasH, animPhase)

            // Draw Wind Currents
            for (curr in viewModel.windCurrents) {
                drawWindCurrent(curr, px, py, cx, cy, animPhase)
            }

            // Draw Storm Zones
            for (storm in viewModel.stormZones) {
                drawStormZone(storm, px, py, cx, cy, animPhase)
            }

            // Draw Districts (Islands)
            for ((dId, dInfo) in GameData.DISTRICTS) {
                drawDistrictPlatform(dInfo, px, py, cx, cy, animPhase, isDockable = (dId == telemetry.nearbyDistrict))
            }

            // Draw Collectibles
            for (item in collectibles) {
                drawCollectible(item, px, py, cx, cy, animPhase)
            }

            // Draw PowerUps
            for (pu in powerUps) {
                drawPowerUp(pu, px, py, cx, cy, animPhase)
            }

            // Draw Enemies
            for (enemy in enemies) {
                drawEnemySkiff(enemy, px, py, cx, cy, animPhase)
            }

            // Draw Nami (Moon-Koi Companion)
            drawMoonKoiCompanion(gameState, px, py, cx, cy, angle, animPhase)

            // Draw Player Skiff & Staff Lantern
            drawPlayerSkiff(gameState, cx, cy, angle, animPhase)
        }

        // Top Compass & Waypoint Lock HUD
        Column(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Surface(
                color = DeepAbyss.copy(alpha = 0.85f),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("NW", color = SlateSubtle, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                    Text("•", color = SlateSubtle, fontSize = 10.sp)
                    Text("N", color = StarlightWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                    Text("•", color = SlateSubtle, fontSize = 10.sp)
                    Text("NE", color = MoonCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                    Text("•", color = SlateSubtle, fontSize = 10.sp)
                    Text("E", color = SlateSubtle, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                }
            }

            if (telemetry.waypointDistance != null) {
                Spacer(modifier = Modifier.height(4.dp))
                Surface(
                    color = DeepAbyss.copy(alpha = 0.9f),
                    shape = RoundedCornerShape(8.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MoonCyan.copy(alpha = 0.5f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Navigation, contentDescription = null, tint = MoonCyan, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "WAYPOINT LOCK: ${telemetry.waypointDistance}m",
                            color = MoonCyanGlow,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Top Left Flight Telemetry / Hull & Speed
        Column(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(start = 12.dp, top = 12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            // Speedometer Pill
            Surface(
                color = DeepAbyss.copy(alpha = 0.85f),
                shape = RoundedCornerShape(10.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Speed, contentDescription = null, tint = MoonCyan, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${telemetry.speed}",
                        color = StarlightWhite,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = "KTS",
                        color = MoonCyan,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Hull integrity
            Surface(
                color = DeepAbyss.copy(alpha = 0.85f),
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("HULL", color = SlateMuted, fontSize = 9.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .width(70.dp)
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(SurfaceDark)
                    ) {
                        val hullRatio = (gameState.stats.hullIntegrity / gameState.stats.maxHull).coerceIn(0f, 1f)
                        Box(
                            modifier = Modifier
                                .fillMaxHeight()
                                .fillMaxWidth(hullRatio)
                                .background(if (telemetry.inStorm) StormCrimson else MoonCyan)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${gameState.stats.hullIntegrity.roundToInt()}%",
                        color = StarlightWhite,
                        fontSize = 9.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Weather conditions chips
            if (telemetry.inWind) {
                FlightStatusChip(label = "WIND CURRENT // RIDING", color = JadeTide, icon = Icons.Default.Air)
            }
            if (telemetry.inStorm) {
                FlightStatusChip(label = "STORM FRONT // ACTIVE", color = StormCrimson, icon = Icons.Default.Thunderstorm)
            }
        }

        // Mini Radar View (Top Right)
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 12.dp, end = 12.dp)
                .size(75.dp)
                .clip(CircleShape)
                .background(DeepAbyss.copy(alpha = 0.9f))
                .border(1.dp, BorderGlass, CircleShape)
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val rW = size.width
                val rH = size.height
                val rcx = rW / 2f
                val rcy = rH / 2f
                val radarRange = 600f

                drawCircle(color = MoonCyan.copy(alpha = 0.15f), radius = rcx, style = Stroke(width = 1.dp.toPx()))
                drawCircle(color = MoonCyan.copy(alpha = 0.25f), radius = rcx * 0.5f, style = Stroke(width = 1.dp.toPx()))

                // Radar blips
                val px = gameState.playerX
                val py = gameState.playerY
                for (blip in telemetry.radarBlips) {
                    val dx = blip.x - px
                    val dy = blip.y - py
                    val dist = hypot(dx, dy)
                    if (dist < radarRange) {
                        val bx = rcx + (dx / radarRange) * (rcx * 0.9f)
                        val by = rcy + (dy / radarRange) * (rcy * 0.9f)
                        drawCircle(color = Color(blip.accent), radius = 2.5.dp.toPx(), center = Offset(bx, by))
                    }
                }

                // Player center point
                drawCircle(color = MoonCyanGlow, radius = 3.dp.toPx(), center = Offset(rcx, rcy))
            }
        }

        // Bottom Controls Overlay
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Touch Joystick (Bottom Left)
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .size(110.dp)
                    .clip(CircleShape)
                    .background(DeepAbyss.copy(alpha = 0.75f))
                    .border(1.5.dp, BorderGlass, CircleShape)
                    .pointerInput(Unit) {
                        detectDragGestures(
                            onDragEnd = {
                                joystickOffset = Offset.Zero
                                viewModel.joystickX = 0f
                                viewModel.joystickY = 0f
                            },
                            onDragCancel = {
                                joystickOffset = Offset.Zero
                                viewModel.joystickX = 0f
                                viewModel.joystickY = 0f
                            },
                            onDrag = { change, dragAmount ->
                                change.consume()
                                val maxRadius = 40f
                                val newOffset = joystickOffset + dragAmount
                                val dist = hypot(newOffset.x, newOffset.y)
                                joystickOffset = if (dist > maxRadius) {
                                    Offset(newOffset.x / dist * maxRadius, newOffset.y / dist * maxRadius)
                                } else {
                                    newOffset
                                }
                                viewModel.joystickX = joystickOffset.x / maxRadius
                                viewModel.joystickY = joystickOffset.y / maxRadius
                            }
                        )
                    },
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .offset(x = (joystickOffset.x).dp, y = (joystickOffset.y).dp)
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(Brush.radialGradient(listOf(MoonCyan, SurfaceDark)))
                        .border(1.dp, MoonCyanGlow, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Navigation, contentDescription = "Steer", tint = StarlightWhite, modifier = Modifier.size(18.dp))
                }
            }

            // Center Lantern Mode Bar & Tactical Action buttons
            Column(
                modifier = Modifier.align(Alignment.BottomCenter),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Lantern Mode Toggle
                Surface(
                    color = DeepAbyss.copy(alpha = 0.9f),
                    shape = RoundedCornerShape(16.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
                ) {
                    Row(
                        modifier = Modifier.padding(3.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        LanternButton(
                            label = "BEACON",
                            icon = Icons.Default.LightMode,
                            isActive = gameState.lanternMode == LanternMode.beacon
                        ) { viewModel.setLanternMode(LanternMode.beacon) }

                        LanternButton(
                            label = "SIGNAL",
                            icon = Icons.Default.Flare,
                            isActive = gameState.lanternMode == LanternMode.signal
                        ) { viewModel.setLanternMode(LanternMode.signal) }

                        LanternButton(
                            label = "WARD",
                            icon = Icons.Default.Shield,
                            isActive = gameState.lanternMode == LanternMode.ward
                        ) { viewModel.setLanternMode(LanternMode.ward) }
                    }
                }

                // Tactical action buttons: Glide, Shock, Boost
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TacticalBtn(
                        label = "GLIDE",
                        charges = telemetry.gliderCharges,
                        icon = Icons.Default.Air,
                        color = JadeTide
                    ) { viewModel.useGlider() }

                    TacticalBtn(
                        label = "SHOCK",
                        charges = telemetry.shockCharges,
                        icon = Icons.Default.Bolt,
                        color = StormPurple
                    ) { viewModel.useShock() }
                }
            }

            // Right side: Boost Button & Dock Button
            Column(
                modifier = Modifier.align(Alignment.BottomEnd),
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Dock Button when near district
                AnimatedVisibility(
                    visible = telemetry.nearbyDistrict != null,
                    enter = fadeIn(),
                    exit = fadeOut()
                ) {
                    val districtName = telemetry.nearbyDistrict?.let { GameData.DISTRICTS[it]?.name } ?: "District"
                    Button(
                        onClick = { telemetry.nearbyDistrict?.let { onDock(it) } },
                        colors = ButtonDefaults.buttonColors(containerColor = LanternAmber),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.height(48.dp)
                    ) {
                        Icon(Icons.Default.Anchor, contentDescription = null, tint = MidnightIndigo)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "DOCK: $districtName",
                            color = MidnightIndigo,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Boost Button
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .clip(CircleShape)
                        .background(if (viewModel.isBoostActive) LanternAmber else SurfaceCard)
                        .border(1.5.dp, if (viewModel.isBoostActive) LanternAmberGlow else MoonCyan, CircleShape)
                        .pointerInput(Unit) {
                            detectTapGestures(
                                onPress = {
                                    viewModel.isBoostActive = true
                                    tryAwaitRelease()
                                    viewModel.isBoostActive = false
                                }
                            )
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.RocketLaunch,
                            contentDescription = "Boost",
                            tint = if (viewModel.isBoostActive) MidnightIndigo else MoonCyan,
                            modifier = Modifier.size(24.dp)
                        )
                        Text(
                            text = "BOOST",
                            color = if (viewModel.isBoostActive) MidnightIndigo else StarlightWhite,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun LanternButton(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    isActive: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(if (isActive) MoonCyan.copy(alpha = 0.25f) else Color.Transparent)
            .border(
                1.dp,
                if (isActive) MoonCyan else Color.Transparent,
                RoundedCornerShape(12.dp)
            )
            .clickable { onClick() }
            .padding(horizontal = 10.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (isActive) MoonCyanGlow else SlateMuted,
                modifier = Modifier.size(13.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = label,
                color = if (isActive) MoonCyanGlow else SlateMuted,
                fontWeight = FontWeight.Bold,
                fontSize = 10.sp,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
fun TacticalBtn(
    label: String,
    charges: Int,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        color = DeepAbyss.copy(alpha = 0.85f),
        shape = RoundedCornerShape(10.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.5f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = label, tint = color, modifier = Modifier.size(14.dp))
            Spacer(modifier = Modifier.width(4.dp))
            Text(label, color = StarlightWhite, fontSize = 10.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.width(4.dp))
            Text("[$charges]", color = color, fontSize = 9.sp, fontFamily = FontFamily.Monospace)
        }
    }
}

@Composable
fun FlightStatusChip(label: String, color: Color, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Surface(
        color = DeepAbyss.copy(alpha = 0.9f),
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.6f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(12.dp))
            Spacer(modifier = Modifier.width(4.dp))
            Text(label, color = color, fontSize = 9.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
        }
    }
}

// Canvas Drawing Helpers
private fun DrawScope.drawSkyBackground(px: Float, py: Float, w: Float, h: Float, phase: Float) {
    // Grid Lines for spatial orientation
    val gridSize = 150f
    val startX = -(px % gridSize)
    val startY = -(py % gridSize)

    var x = startX
    while (x < w) {
        drawLine(
            color = BorderGlass.copy(alpha = 0.15f),
            start = Offset(x, 0f),
            end = Offset(x, h),
            strokeWidth = 1f
        )
        x += gridSize
    }

    var y = startY
    while (y < h) {
        drawLine(
            color = BorderGlass.copy(alpha = 0.15f),
            start = Offset(0f, y),
            end = Offset(w, y),
            strokeWidth = 1f
        )
        y += gridSize
    }

    // Stars
    for (i in 0 until 40) {
        val starX = ((i * 137f + 50f) % 1800f - px + w / 2f + 1800f) % 1800f - (1800f - w) / 2f
        val starY = ((i * 223f + 80f) % 1600f - py + h / 2f + 1600f) % 1600f - (1600f - h) / 2f
        if (starX in 0f..w && starY in 0f..h) {
            val alpha = (sin(phase + i) * 0.4f + 0.6f).coerceIn(0.2f, 1f)
            drawCircle(
                color = StarlightWhite.copy(alpha = alpha),
                radius = if (i % 3 == 0) 2f else 1.2f,
                center = Offset(starX, starY)
            )
        }
    }
}

private fun DrawScope.drawWindCurrent(curr: WindCurrent, px: Float, py: Float, cx: Float, cy: Float, phase: Float) {
    val sx = cx + (curr.x1 - px)
    val sy = cy + (curr.y1 - py)
    val ex = cx + (curr.x2 - px)
    val ey = cy + (curr.y2 - py)

    drawLine(
        color = JadeTide.copy(alpha = 0.35f),
        start = Offset(sx, sy),
        end = Offset(ex, ey),
        strokeWidth = curr.width,
        cap = StrokeCap.Round
    )

    // Animated dashed vector flow
    val dx = ex - sx
    val dy = ey - sy
    val len = hypot(dx, dy)
    if (len > 10f) {
        val count = (len / 60f).toInt()
        for (i in 0 until count) {
            val t = ((i.toFloat() / count + phase * 0.15f) % 1f)
            val ax = sx + dx * t
            val ay = sy + dy * t
            drawCircle(
                color = MoonCyanGlow.copy(alpha = 0.8f),
                radius = 3.5f,
                center = Offset(ax, ay)
            )
        }
    }
}

private fun DrawScope.drawStormZone(storm: StormZone, px: Float, py: Float, cx: Float, cy: Float, phase: Float) {
    val sx = cx + (storm.x - px)
    val sy = cy + (storm.y - py)

    drawCircle(
        color = StormCrimson.copy(alpha = 0.12f),
        radius = storm.radius,
        center = Offset(sx, sy)
    )
    drawCircle(
        color = StormViolet.copy(alpha = 0.4f),
        radius = storm.radius,
        center = Offset(sx, sy),
        style = Stroke(width = 2f)
    )
    // Pulsing vortex core
    val pulse = sin(phase * 2f) * 15f
    drawCircle(
        color = StormPurple.copy(alpha = 0.3f),
        radius = (storm.radius * 0.4f + pulse).coerceAtLeast(10f),
        center = Offset(sx, sy)
    )
}

private fun DrawScope.drawDistrictPlatform(dInfo: DistrictInfo, px: Float, py: Float, cx: Float, cy: Float, phase: Float, isDockable: Boolean) {
    val dx = cx + (dInfo.x - px)
    val dy = cy + (dInfo.y - py)

    // Outer Docking Ring
    val ringColor = if (isDockable) LanternAmber else MoonCyan
    drawCircle(
        color = ringColor.copy(alpha = if (isDockable) 0.35f else 0.15f),
        radius = 120f,
        center = Offset(dx, dy)
    )
    drawCircle(
        color = ringColor.copy(alpha = 0.6f),
        radius = 120f,
        center = Offset(dx, dy),
        style = Stroke(width = if (isDockable) 3f else 1.5f)
    )

    // District Center Platform
    drawCircle(
        color = DeepAbyss,
        radius = 45f,
        center = Offset(dx, dy)
    )
    drawCircle(
        color = ringColor,
        radius = 45f,
        center = Offset(dx, dy),
        style = Stroke(width = 2.5f)
    )
    // Core Lamp Glow
    drawCircle(
        color = if (isDockable) LanternAmberGlow else MoonCyanGlow,
        radius = 18f + sin(phase * 1.5f) * 3f,
        center = Offset(dx, dy)
    )
}

private fun DrawScope.drawCollectible(item: Collectible, px: Float, py: Float, cx: Float, cy: Float, phase: Float) {
    val ix = cx + (item.x - px)
    val iy = cy + (item.y - py)

    val color = when (item.type) {
        "salvage" -> LanternAmber
        "storm_charge" -> StormPurple
        else -> MoonCyan
    }

    val pulse = sin(phase * 3f + item.pulse) * 3f
    drawCircle(
        color = color.copy(alpha = 0.25f),
        radius = 14f + pulse,
        center = Offset(ix, iy)
    )
    drawCircle(
        color = color,
        radius = 7f,
        center = Offset(ix, iy)
    )
    drawCircle(
        color = StarlightWhite,
        radius = 2.5f,
        center = Offset(ix, iy)
    )
}

private fun DrawScope.drawPowerUp(pu: PowerUp, px: Float, py: Float, cx: Float, cy: Float, phase: Float) {
    val pxPos = cx + (pu.x - px)
    val pyPos = cy + (pu.y - py)

    val color = when (pu.type) {
        "wind_glider" -> JadeTide
        "shock_cell" -> StormPurple
        "hull_patch" -> EmeraldGlow
        else -> LanternAmber
    }

    drawCircle(color = color.copy(alpha = 0.3f), radius = 18f, center = Offset(pxPos, pyPos))
    drawCircle(color = color, radius = 18f, center = Offset(pxPos, pyPos), style = Stroke(width = 2f))
    drawCircle(color = StarlightWhite, radius = 5f, center = Offset(pxPos, pyPos))
}

private fun DrawScope.drawEnemySkiff(enemy: EnemySkiff, px: Float, py: Float, cx: Float, cy: Float, phase: Float) {
    val ex = cx + (enemy.x - px)
    val ey = cy + (enemy.y - py)

    drawCircle(color = StormCrimson.copy(alpha = 0.25f), radius = 22f, center = Offset(ex, ey))
    drawCircle(color = StormCrimson, radius = 12f, center = Offset(ex, ey))
    // Target Crosshair
    drawLine(color = StormCrimson, start = Offset(ex - 18f, ey), end = Offset(ex + 18f, ey), strokeWidth = 1.5f)
    drawLine(color = StormCrimson, start = Offset(ex, ey - 18f), end = Offset(ex, ey + 18f), strokeWidth = 1.5f)
}

private fun DrawScope.drawMoonKoiCompanion(gameState: GameState, px: Float, py: Float, cx: Float, cy: Float, playerAngle: Float, phase: Float) {
    // Companion swims smoothly behind and to the side of the skiff
    val koiAngle = playerAngle + 2.4f
    val koiDist = 55f
    val kx = cx + cos(koiAngle) * koiDist + sin(phase * 2.5f) * 12f
    val ky = cy + sin(koiAngle) * koiDist + cos(phase * 2.5f) * 12f

    val koiColor = when (gameState.character.koiCompanionColor) {
        "rose_gold" -> Color(0xFFFB7185)
        "midnight_purple" -> StormPurple
        "emerald_jade" -> JadeTide
        "solar_amber" -> LanternAmber
        else -> MoonCyanGlow
    }

    // Bioluminescent Aura
    drawCircle(
        color = koiColor.copy(alpha = 0.35f),
        radius = 26f + sin(phase * 3f) * 4f,
        center = Offset(kx, ky)
    )

    // Fish body & sinusoidal waving tail
    val fishRot = playerAngle * (180f / Math.PI.toFloat())
    rotate(fishRot, pivot = Offset(kx, ky)) {
        // Body ellipse
        drawOval(
            color = koiColor,
            topLeft = Offset(kx - 16f, ky - 8f),
            size = Size(32f, 16f)
        )
        // Whisker / head highlight
        drawCircle(color = StarlightWhite, radius = 3.5f, center = Offset(kx + 10f, ky))
        // Fins
        val finWave = sin(phase * 4f) * 8f
        drawLine(
            color = koiColor.copy(alpha = 0.8f),
            start = Offset(kx - 14f, ky),
            end = Offset(kx - 32f, ky + finWave),
            strokeWidth = 6f,
            cap = StrokeCap.Round
        )
    }
}

private fun DrawScope.drawPlayerSkiff(gameState: GameState, cx: Float, cy: Float, angle: Float, phase: Float) {
    val rotDeg = angle * (180f / Math.PI.toFloat())

    // Staff Lantern Beam / Aura based on LanternMode
    when (gameState.lanternMode) {
        LanternMode.beacon -> {
            rotate(rotDeg, pivot = Offset(cx, cy)) {
                val path = Path().apply {
                    moveTo(cx + 15f, cy)
                    lineTo(cx + 180f, cy - 65f)
                    lineTo(cx + 180f, cy + 65f)
                    close()
                }
                drawPath(
                    path = path,
                    brush = Brush.radialGradient(
                        colors = listOf(MoonCyan.copy(alpha = 0.35f), Color.Transparent),
                        center = Offset(cx + 15f, cy),
                        radius = 200f
                    )
                )
            }
        }
        LanternMode.signal -> {
            rotate(rotDeg, pivot = Offset(cx, cy)) {
                val path = Path().apply {
                    moveTo(cx + 15f, cy)
                    lineTo(cx + 260f, cy - 20f)
                    lineTo(cx + 260f, cy + 20f)
                    close()
                }
                drawPath(
                    path = path,
                    brush = Brush.radialGradient(
                        colors = listOf(LanternAmberGlow.copy(alpha = 0.45f), Color.Transparent),
                        center = Offset(cx + 15f, cy),
                        radius = 280f
                    )
                )
            }
        }
        LanternMode.ward -> {
            drawCircle(
                color = StormViolet.copy(alpha = 0.28f + sin(phase * 4f) * 0.08f),
                radius = 75f,
                center = Offset(cx, cy)
            )
            drawCircle(
                color = StormViolet.copy(alpha = 0.7f),
                radius = 75f,
                center = Offset(cx, cy),
                style = Stroke(width = 2f)
            )
        }
    }

    // Skiff Hull
    rotate(rotDeg, pivot = Offset(cx, cy)) {
        // Engine Wake Trail
        drawLine(
            color = MoonCyan.copy(alpha = 0.6f),
            start = Offset(cx - 20f, cy),
            end = Offset(cx - 45f - sin(phase * 5f) * 10f, cy),
            strokeWidth = 5f,
            cap = StrokeCap.Round
        )

        // Skiff Body (Sleek aerodynamic pointed skiff)
        val skiffPath = Path().apply {
            moveTo(cx + 24f, cy) // bow
            lineTo(cx - 16f, cy - 12f) // port stern
            lineTo(cx - 22f, cy) // stern
            lineTo(cx - 16f, cy + 12f) // starboard stern
            close()
        }

        val hullColor = when (gameState.activeRig) {
            RigId.dawn_dock -> Color(0xFF78716C)
            RigId.storm_run -> Color(0xFF1D4ED8)
            RigId.undertow_civilian -> Color(0xFF881337)
            else -> Color(0xFF312E81)
        }

        drawPath(path = skiffPath, color = hullColor)
        drawPath(path = skiffPath, color = MoonCyan, style = Stroke(width = 1.8f))

        // Center Lantern Staff
        drawCircle(color = MoonCyanGlow, radius = 5f, center = Offset(cx + 4f, cy))
        drawCircle(color = StarlightWhite, radius = 2f, center = Offset(cx + 4f, cy))
    }
}
