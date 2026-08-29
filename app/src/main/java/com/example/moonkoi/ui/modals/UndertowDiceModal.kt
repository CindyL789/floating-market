package com.example.moonkoi.ui.modals

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
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
import com.example.moonkoi.model.GameState
import com.example.moonkoi.model.RigId
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel

@Composable
fun UndertowDiceModal(
    viewModel: GameViewModel,
    gameState: GameState,
    onDismiss: () -> Unit
) {
    var wager by remember { mutableIntStateOf(20) }
    var resultText by remember { mutableStateOf<String?>(null) }
    var playerDice by remember { mutableStateOf<List<Int>>(emptyList()) }
    var brokerDice by remember { mutableStateOf<List<Int>>(emptyList()) }

    val hasCharisma = gameState.activeRig == RigId.undertow_civilian

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = SurfaceCard,
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, LanternAmber),
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("UNDERTOW MOON-DICE", color = LanternAmber, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Broker Whisperer Kael's Table", color = SlateMuted, fontSize = 12.sp)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (hasCharisma) {
                    Surface(
                        color = LanternAmber.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            "✨ Undertow Civilian Rig: +30% Dice Payouts & Wins Ties!",
                            color = LanternAmberGlow,
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(8.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                }

                // Dice Arenas
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    // Player Dice
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("${gameState.character.name}", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (playerDice.isEmpty()) {
                                repeat(3) { DiceBox(value = 0, color = MoonCyan) }
                            } else {
                                for (d in playerDice) {
                                    DiceBox(value = d, color = MoonCyan)
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (playerDice.isNotEmpty()) "Total: ${playerDice.sum()}" else "Ready",
                            color = StarlightWhite,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    // Broker Dice
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Whisperer Kael", color = LanternAmber, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (brokerDice.isEmpty()) {
                                repeat(3) { DiceBox(value = 0, color = LanternAmber) }
                            } else {
                                for (d in brokerDice) {
                                    DiceBox(value = d, color = LanternAmber)
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (brokerDice.isNotEmpty()) "Total: ${brokerDice.sum()}" else "Ready",
                            color = StarlightWhite,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                if (resultText != null) {
                    Spacer(modifier = Modifier.height(14.dp))
                    Surface(
                        color = SurfaceDark,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = resultText ?: "",
                            color = if (resultText?.startsWith("Victory") == true) JadeTide else if (resultText?.startsWith("Defeat") == true) StormCrimson else MoonCyan,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(10.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Wager Controls
                Text("WAGER AMOUNT", color = MoonCyan, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = { wager = (wager - 10).coerceAtLeast(10) },
                        colors = ButtonDefaults.buttonColors(containerColor = SurfaceVariantDark)
                    ) { Text("-10", color = StarlightWhite) }

                    Text("$wager ✨", color = LanternAmber, fontSize = 16.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)

                    Button(
                        onClick = { wager = (wager + 10).coerceAtMost(gameState.droplets) },
                        colors = ButtonDefaults.buttonColors(containerColor = SurfaceVariantDark)
                    ) { Text("+10", color = StarlightWhite) }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        val res = viewModel.playUndertowDice(wager)
                        playerDice = res.first
                        brokerDice = res.second
                        resultText = res.third
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = LanternAmber),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("ROLL BONE DICE", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 13.sp, fontFamily = FontFamily.Monospace)
                }
            }
        }
    }
}

@Composable
fun DiceBox(value: Int, color: Color) {
    Box(
        modifier = Modifier
            .size(34.dp)
            .clip(RoundedCornerShape(6.dp))
            .background(SurfaceDark)
            .border(1.dp, color, RoundedCornerShape(6.dp)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = if (value > 0) "$value" else "•",
            color = color,
            fontWeight = FontWeight.Bold,
            fontSize = 15.sp,
            fontFamily = FontFamily.Monospace
        )
    }
}
