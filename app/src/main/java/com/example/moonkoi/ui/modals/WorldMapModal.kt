package com.example.moonkoi.ui.modals

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.BiomeRegion
import com.example.moonkoi.model.GameState
import com.example.moonkoi.model.LandmarkInfo
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel

@Composable
fun WorldMapModal(
    viewModel: GameViewModel,
    gameState: GameState,
    onDismiss: () -> Unit
) {
    var selectedLandmark by remember { mutableStateOf<LandmarkInfo?>(GameData.LANDMARKS.first()) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = SurfaceCard,
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, BorderGlass),
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.9f)
                .padding(4.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("SKYBOUND ARCHIPELAGO CHART", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Interactive Starlight Cartography (1800 x 1600)", color = SlateMuted, fontSize = 12.sp)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Map Visual Canvas
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(MidnightIndigo)
                        .border(1.dp, BorderGlass, RoundedCornerShape(12.dp))
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val mW = size.width
                        val mH = size.height

                        // Biome zones
                        for ((_, b) in GameData.BIOMES) {
                            val rx = (b.minX / 1800f) * mW
                            val ry = (b.minY / 1600f) * mH
                            val rw = ((b.maxX - b.minX) / 1800f) * mW
                            val rh = ((b.maxY - b.minY) / 1600f) * mH

                            drawRect(
                                color = try { Color(android.graphics.Color.parseColor(b.color)).copy(alpha = 0.4f) } catch (e: Exception) { DeepAbyss },
                                topLeft = Offset(rx, ry),
                                size = androidx.compose.ui.geometry.Size(rw, rh)
                            )
                        }

                        // Wind Currents lines
                        for (curr in viewModel.windCurrents) {
                            drawLine(
                                color = JadeTide.copy(alpha = 0.5f),
                                start = Offset((curr.x1 / 1800f) * mW, (curr.y1 / 1600f) * mH),
                                end = Offset((curr.x2 / 1800f) * mW, (curr.y2 / 1600f) * mH),
                                strokeWidth = 2f
                            )
                        }

                        // Landmarks / Districts
                        for (lm in GameData.LANDMARKS) {
                            val lx = (lm.x / 1800f) * mW
                            val ly = (lm.y / 1600f) * mH
                            val isSelected = selectedLandmark?.id == lm.id
                            val isPlayerNear = kotlin.math.hypot(gameState.playerX - lm.x, gameState.playerY - lm.y) < 150f

                            drawCircle(
                                color = if (isSelected) LanternAmberGlow else if (isPlayerNear) JadeTide else MoonCyan,
                                radius = if (isSelected) 7f else 4.5f,
                                center = Offset(lx, ly)
                            )
                            if (isSelected) {
                                drawCircle(
                                    color = LanternAmber,
                                    radius = 12f,
                                    center = Offset(lx, ly),
                                    style = Stroke(width = 1.5f)
                                )
                            }
                        }

                        // Player Skiff Position
                        val ppx = (gameState.playerX / 1800f) * mW
                        val ppy = (gameState.playerY / 1600f) * mH
                        drawCircle(color = MoonCyanGlow, radius = 5f, center = Offset(ppx, ppy))
                        drawCircle(color = MoonCyan, radius = 10f, center = Offset(ppx, ppy), style = Stroke(width = 1.5f))

                        // Waypoint marker if set
                        val wp = gameState.mapWaypoint
                        if (wp != null) {
                            val wpx = (wp.x / 1800f) * mW
                            val wpy = (wp.y / 1600f) * mH
                            drawCircle(color = StormCrimson, radius = 6f, center = Offset(wpx, wpy))
                            drawLine(
                                color = StormCrimson.copy(alpha = 0.7f),
                                start = Offset(ppx, ppy),
                                end = Offset(wpx, wpy),
                                strokeWidth = 1.5f
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Landmark Carousel / Selection
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(GameData.LANDMARKS) { lm ->
                        val isSelected = selectedLandmark?.id == lm.id
                        Surface(
                            onClick = { selectedLandmark = lm },
                            color = if (isSelected) MoonCyan.copy(alpha = 0.2f) else SurfaceVariantDark,
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) MoonCyan else BorderGlass)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(lm.icon, fontSize = 13.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(lm.name, color = if (isSelected) MoonCyanGlow else StarlightWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Landmark Detail Card
                val lm = selectedLandmark
                if (lm != null) {
                    Surface(
                        color = SurfaceVariantDark,
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(lm.icon, fontSize = 22.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(lm.name, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Text("Coord: (${lm.x.toInt()}, ${lm.y.toInt()}) // ${lm.type.replace('_', ' ').uppercase()}", color = MoonCyan, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                                    }
                                }

                                val isWaypoint = gameState.mapWaypoint?.label == lm.name
                                Button(
                                    onClick = {
                                        if (isWaypoint) viewModel.clearWaypoint()
                                        else viewModel.setWaypoint(lm.x, lm.y, lm.name)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = if (isWaypoint) StormCrimson else LanternAmber),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Icon(Icons.Default.Navigation, contentDescription = null, tint = MidnightIndigo, modifier = Modifier.size(12.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(if (isWaypoint) "CLEAR WP" else "SET WAYPOINT", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Text(lm.description, color = SlateMuted, fontSize = 12.sp, lineHeight = 16.sp)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("DISCOVERY / ATTRACTION BONUS:", color = LanternAmber, fontSize = 10.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                            Text(lm.discoveryBonus, color = JadeTide, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            }
        }
    }
}
