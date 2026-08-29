package com.example.moonkoi.ui.dialogue

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.DialogueChoice
import com.example.moonkoi.model.GameState
import com.example.moonkoi.ui.theme.*

@Composable
fun DialogueScreen(
    gameState: GameState,
    onChoiceSelected: (DialogueChoice) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val npcId = gameState.activeNpcId ?: return
    val npc = GameData.NPCS[npcId] ?: return
    val nodeId = gameState.activeDialogueNodeId ?: npc.dialogueTreeId
    val node = GameData.DIALOGUE_TREES[nodeId]

    val scrollState = rememberScrollState()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MidnightIndigo.copy(alpha = 0.95f))
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Surface(
            color = SurfaceCard,
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, BorderGlass),
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 600.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(scrollState)
            ) {
                // Header: NPC Info & Close button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (npc.portraitRes != null) {
                            Image(
                                painter = painterResource(id = npc.portraitRes),
                                contentDescription = npc.name,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .size(54.dp)
                                    .clip(CircleShape)
                                    .border(2.dp, MoonCyanGlow, CircleShape)
                            )
                        } else {
                            Box(
                                modifier = Modifier
                                    .size(54.dp)
                                    .clip(CircleShape)
                                    .background(SurfaceVariantDark)
                                    .border(1.5.dp, MoonCyan, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(npc.iconEmoji, fontSize = 28.sp)
                            }
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column {
                            Text(
                                text = npc.name,
                                color = StarlightWhite,
                                style = MaterialTheme.typography.titleLarge
                            )
                            Text(
                                text = npc.title,
                                color = MoonCyan,
                                fontSize = 12.sp
                            )
                            Text(
                                text = "Affinity: ${npc.affinity}%",
                                color = JadeTide,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    IconButton(
                        onClick = onClose,
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(SurfaceVariantDark)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite, modifier = Modifier.size(16.dp))
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                HorizontalDivider(color = BorderGlass)
                Spacer(modifier = Modifier.height(16.dp))

                // Dialogue Speech Box
                Surface(
                    color = SurfaceDark,
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass.copy(alpha = 0.5f))
                ) {
                    Text(
                        text = node?.text ?: npc.greeting,
                        color = StarlightWhite,
                        fontSize = 14.sp,
                        lineHeight = 22.sp,
                        modifier = Modifier.padding(16.dp)
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Choices
                Text(
                    text = "RESPONSES // ACTIONS",
                    color = LanternAmber,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(10.dp))

                val choices = node?.choices ?: listOf(DialogueChoice("Depart.", null))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    for (choice in choices) {
                        Surface(
                            onClick = { onChoiceSelected(choice) },
                            color = SurfaceVariantDark,
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 14.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "✦",
                                    color = MoonCyan,
                                    fontSize = 12.sp
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = choice.text,
                                    color = StarlightWhite,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
