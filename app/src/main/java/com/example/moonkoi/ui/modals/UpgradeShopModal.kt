package com.example.moonkoi.ui.modals

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
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
import com.example.moonkoi.model.GameState
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel

@Composable
fun UpgradeShopModal(
    viewModel: GameViewModel,
    gameState: GameState,
    onDismiss: () -> Unit
) {
    val hullCost = 50 + gameState.upgrades.hull * 30
    val engineCost = 60 + gameState.upgrades.engine * 35
    val weaponCost = 70 + gameState.upgrades.weapon * 40

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = SurfaceCard,
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, BorderGlass),
            modifier = Modifier
                .fillMaxWidth()
                .padding(4.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("SKIFF FORGE & WORKSHOP", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Available Moon-Droplets: ${gameState.droplets} ✨", color = LanternAmber, fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Upgrade 1: Hull
                SkiffUpgradeCard(
                    title = "Hull Structural Plating",
                    level = gameState.upgrades.hull,
                    currentStat = "${gameState.stats.maxHull.toInt()} HP",
                    nextStat = "+18 HP Max Capacity",
                    cost = hullCost,
                    canAfford = gameState.droplets >= hullCost,
                    icon = "🛡️",
                    onUpgrade = { viewModel.upgradeSkiff("hull") }
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Upgrade 2: Engine
                SkiffUpgradeCard(
                    title = "Twin Turbine Aero-Engines",
                    level = gameState.upgrades.engine,
                    currentStat = "Tier ${gameState.upgrades.engine + 1} Velocity",
                    nextStat = "+10 KTS Max Velocity & Accel",
                    cost = engineCost,
                    canAfford = gameState.droplets >= engineCost,
                    icon = "🚀",
                    onUpgrade = { viewModel.upgradeSkiff("engine") }
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Upgrade 3: Weapon / Shock Emitters
                SkiffUpgradeCard(
                    title = "Aetheric Pulse Shock Cannons",
                    level = gameState.upgrades.weapon,
                    currentStat = "Tier ${gameState.upgrades.weapon + 1} Charge",
                    nextStat = "+1 Shock Cell Capacity & Radius",
                    cost = weaponCost,
                    canAfford = gameState.droplets >= weaponCost,
                    icon = "⚡",
                    onUpgrade = { viewModel.upgradeSkiff("weapon") }
                )
            }
        }
    }
}

@Composable
fun SkiffUpgradeCard(
    title: String,
    level: Int,
    currentStat: String,
    nextStat: String,
    cost: Int,
    canAfford: Boolean,
    icon: String,
    onUpgrade: () -> Unit
) {
    Surface(
        color = SurfaceVariantDark,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceDark),
                    contentAlignment = Alignment.Center
                ) {
                    Text(icon, fontSize = 20.sp)
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(title, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("T$level", color = MoonCyan, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                    Text("Current: $currentStat", color = SlateMuted, fontSize = 11.sp)
                    Text("Next: $nextStat", color = JadeTide, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = onUpgrade,
                enabled = canAfford,
                colors = ButtonDefaults.buttonColors(
                    containerColor = LanternAmber,
                    disabledContainerColor = SurfaceDark
                ),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text(
                    "$cost ✨",
                    color = if (canAfford) MidnightIndigo else SlateMuted,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}
