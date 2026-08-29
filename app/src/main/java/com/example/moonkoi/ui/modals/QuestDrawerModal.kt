package com.example.moonkoi.ui.modals

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.GameState
import com.example.moonkoi.model.Quest
import com.example.moonkoi.ui.theme.*

@Composable
fun QuestDrawerModal(
    gameState: GameState,
    onDismiss: () -> Unit
) {
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
                        Text("MAIN STORY CAMPAIGN & FLIGHT LOGS", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Chapter ${gameState.currentMainChapter} // Skyways Chronicle", color = LanternAmber, fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(GameData.MAIN_QUESTS) { quest ->
                        val isCompleted = gameState.completedQuestIds.contains(quest.id)
                        val isActive = quest.active || (quest.chapter == gameState.currentMainChapter && !isCompleted)

                        Surface(
                            color = if (isCompleted) JadeTide.copy(alpha = 0.12f) else if (isActive) LanternAmber.copy(alpha = 0.12f) else SurfaceVariantDark,
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isCompleted) JadeTide else if (isActive) LanternAmber else BorderGlass.copy(alpha = 0.3f)
                            )
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text("CHAPTER ${quest.chapter}", color = if (isCompleted) JadeTide else if (isActive) LanternAmber else SlateMuted, fontSize = 10.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                        Text(quest.title, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    }

                                    if (isCompleted) {
                                        Surface(color = JadeTide.copy(alpha = 0.2f), shape = RoundedCornerShape(6.dp)) {
                                            Row(modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), verticalAlignment = Alignment.CenterVertically) {
                                                Icon(Icons.Default.Check, contentDescription = null, tint = JadeTide, modifier = Modifier.size(12.dp))
                                                Spacer(modifier = Modifier.width(3.dp))
                                                Text("SEALED", color = JadeTide, fontSize = 9.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    } else if (isActive) {
                                        Surface(color = LanternAmber.copy(alpha = 0.2f), shape = RoundedCornerShape(6.dp)) {
                                            Text("ACTIVE", color = LanternAmber, fontSize = 9.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(6.dp))
                                Text(quest.description, color = SlateMuted, fontSize = 12.sp, lineHeight = 16.sp)

                                Spacer(modifier = Modifier.height(6.dp))
                                Text("Current Objective: ${quest.stepDescription}", color = MoonCyanGlow, fontSize = 11.sp, fontFamily = FontFamily.Monospace)

                                Spacer(modifier = Modifier.height(6.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Text("Rewards: +${quest.rewardDroplets} ✨", color = MoonCyan, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                                    Text("+${quest.rewardFavors} ⚓", color = LanternAmber, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                                }
                            }
                        }
                    }

                    // Flight Log History
                    item {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("TELEMETRY & FLIGHT DISPATCH LOG", color = MoonCyan, fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    }

                    items(gameState.logMessages.take(6)) { log ->
                        Surface(
                            color = SurfaceDark,
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(0.5.dp, BorderGlass)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = log.text,
                                    color = if (log.type == "reward") JadeTide else if (log.type == "hazard") StormCrimson else StarlightWhite,
                                    fontSize = 11.sp,
                                    modifier = Modifier.weight(1f)
                                )
                                Text(
                                    text = log.time,
                                    color = SlateMuted,
                                    fontSize = 9.sp,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
