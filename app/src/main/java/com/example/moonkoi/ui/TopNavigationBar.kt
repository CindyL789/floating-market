package com.example.moonkoi.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.GameState
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.ModalType

@Composable
fun TopNavigationBar(
    gameState: GameState,
    onOpenModal: (ModalType) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, BorderGlass, RoundedCornerShape(bottomStart = 16.dp, bottomEnd = 16.dp)),
        color = MidnightIndigo.copy(alpha = 0.95f),
        shadowElevation = 8.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Character Badge & District
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable { onOpenModal(ModalType.CHARACTER_CREATOR) }
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Brush.radialGradient(listOf(MoonCyan, DeepAbyss)))
                            .border(1.5.dp, MoonCyanGlow, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "🎏",
                            fontSize = 18.sp
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = gameState.character.name,
                                color = StarlightWhite,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "(${gameState.character.title})",
                                color = MoonCyan,
                                fontSize = 11.sp
                            )
                        }
                        Text(
                            text = if (gameState.currentDistrict != null)
                                "📍 ${GameData.DISTRICTS[gameState.currentDistrict]?.name}"
                            else "☁️ Skyways Drift",
                            color = LanternAmber,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }

                // Currencies Readout
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    ResourcePill(
                        icon = "✨",
                        value = "${gameState.droplets}",
                        color = MoonCyan,
                        label = "Droplets"
                    )
                    ResourcePill(
                        icon = "⚓",
                        value = "${gameState.favors}",
                        color = LanternAmber,
                        label = "Favors"
                    )
                    ResourcePill(
                        icon = "⚡",
                        value = "${gameState.stormJars}",
                        color = StormPurple,
                        label = "Jars"
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Quick Nav Action Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Nami Koi Affinity bar
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = "NAMI BOND",
                        color = JadeTide,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(SurfaceDark)
                            .border(0.5.dp, BorderGlass, RoundedCornerShape(3.dp))
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxHeight()
                                .fillMaxWidth(gameState.stats.koiAffinity / 100f)
                                .background(Brush.horizontalGradient(listOf(JadeTide, MoonCyan)))
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${gameState.stats.koiAffinity}%",
                        color = StarlightWhite,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                // Action Buttons
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    NavIconBtn(icon = Icons.Default.Map, tooltip = "Map") { onOpenModal(ModalType.WORLD_MAP) }
                    NavIconBtn(icon = Icons.Default.AutoAwesome, tooltip = "Skills") { onOpenModal(ModalType.SKILL_TREE) }
                    NavIconBtn(icon = Icons.Default.Build, tooltip = "Forge") { onOpenModal(ModalType.UPGRADE_SHOP) }
                    NavIconBtn(icon = Icons.Default.Checkroom, tooltip = "Wardrobe") { onOpenModal(ModalType.WARDROBE) }
                    NavIconBtn(icon = Icons.Default.AutoStories, tooltip = "Codex") { onOpenModal(ModalType.CODEX) }
                    NavIconBtn(icon = Icons.Default.Assignment, tooltip = "Quests", badge = gameState.activeQuests.count { it.active }) {
                        onOpenModal(ModalType.QUEST_DRAWER)
                    }
                }
            }
        }
    }
}

@Composable
fun ResourcePill(icon: String, value: String, color: Color, label: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceCard)
            .border(0.5.dp, color.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(text = icon, fontSize = 11.sp)
        Spacer(modifier = Modifier.width(3.dp))
        Text(
            text = value,
            color = color,
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
fun NavIconBtn(
    icon: ImageVector,
    tooltip: String,
    badge: Int = 0,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(32.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceVariantDark)
            .border(0.5.dp, BorderGlass, RoundedCornerShape(8.dp))
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = tooltip,
            tint = MoonCyan,
            modifier = Modifier.size(16.dp)
        )
        if (badge > 0) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .size(10.dp)
                    .clip(CircleShape)
                    .background(LanternAmber)
            )
        }
    }
}
