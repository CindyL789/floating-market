package com.example.moonkoi.ui.modals

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import com.example.moonkoi.model.SkillCategory
import com.example.moonkoi.model.SkillNode
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel

@Composable
fun SkillTreeModal(
    viewModel: GameViewModel,
    gameState: GameState,
    onDismiss: () -> Unit
) {
    var selectedCategory by remember { mutableStateOf(SkillCategory.lantern) }

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
                        Text("ATTUNEMENT SKILL SANCTUARY", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Brass Favors Available: ${gameState.favors} ⚓", color = LanternAmber, fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Category Tabs
                ScrollableTabRow(
                    selectedTabIndex = selectedCategory.ordinal,
                    containerColor = SurfaceDark,
                    contentColor = MoonCyan,
                    edgePadding = 4.dp
                ) {
                    for (cat in SkillCategory.values()) {
                        Tab(
                            selected = selectedCategory == cat,
                            onClick = { selectedCategory = cat },
                            text = {
                                Text(
                                    text = GameData.SKILL_CATEGORIES[cat] ?: cat.name,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Skills List for selected Category
                val categorySkills = GameData.SKILL_NODES.filter { it.category == selectedCategory }

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(categorySkills) { skill ->
                        SkillNodeCard(skill, gameState, onUnlock = { viewModel.unlockSkill(skill.id) })
                    }
                }
            }
        }
    }
}

@Composable
fun SkillNodeCard(
    skill: SkillNode,
    gameState: GameState,
    onUnlock: () -> Unit
) {
    val isUnlocked = gameState.unlockedSkills.contains(skill.id)
    val prereqsMet = skill.prerequisites.all { gameState.unlockedSkills.contains(it) }
    val canAfford = gameState.favors >= skill.costFavors
    val canUnlock = !isUnlocked && prereqsMet && canAfford

    Surface(
        color = if (isUnlocked) JadeTide.copy(alpha = 0.12f) else SurfaceVariantDark,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isUnlocked) JadeTide else if (prereqsMet) BorderGlass else BorderGlass.copy(alpha = 0.2f)
        )
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(if (isUnlocked) JadeTide.copy(alpha = 0.25f) else SurfaceDark),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = skill.icon, fontSize = 16.sp)
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(skill.name, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("Tier ${skill.tier} // ${skill.effectLabel}", color = if (isUnlocked) JadeTide else MoonCyan, fontSize = 11.sp)
                    }
                }

                if (isUnlocked) {
                    Surface(
                        color = JadeTide.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = JadeTide, modifier = Modifier.size(12.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("ATTUNED", color = JadeTide, fontSize = 10.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                        }
                    }
                } else {
                    Button(
                        onClick = onUnlock,
                        enabled = canUnlock,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = LanternAmber,
                            disabledContainerColor = SurfaceDark
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        if (!prereqsMet) {
                            Icon(Icons.Default.Lock, contentDescription = null, tint = SlateMuted, modifier = Modifier.size(12.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("LOCKED", color = SlateMuted, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                        } else {
                            Text(
                                "${skill.costFavors} FAVORS",
                                color = if (canAfford) MidnightIndigo else SlateMuted,
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(skill.description, color = SlateMuted, fontSize = 12.sp, lineHeight = 16.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(skill.statsEffectDescription, color = MoonCyanGlow, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
        }
    }
}
