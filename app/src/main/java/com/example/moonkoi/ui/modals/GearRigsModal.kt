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
import com.example.moonkoi.model.GearRig
import com.example.moonkoi.model.GameState
import com.example.moonkoi.model.RigId
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel

@Composable
fun GearRigsModal(
    viewModel: GameViewModel,
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
                .fillMaxHeight(0.85f)
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
                        Text("WARDROBE & RIGSMITH", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Equip specialized skyway attires & tactical harnesses", color = SlateMuted, fontSize = 12.sp)
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
                    items(GameData.GEAR_RIGS.values.toList()) { rig ->
                        RigCard(rig, gameState, onEquip = { viewModel.equipRig(rig.id) })
                    }
                }
            }
        }
    }
}

@Composable
fun RigCard(
    rig: GearRig,
    gameState: GameState,
    onEquip: () -> Unit
) {
    val isEquipped = gameState.activeRig == rig.id
    val isUnlocked = gameState.unlockedRigs.contains(rig.id)
    val canAfford = gameState.droplets >= rig.cost

    Surface(
        color = if (isEquipped) MoonCyan.copy(alpha = 0.12f) else SurfaceVariantDark,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isEquipped) MoonCyan else BorderGlass
        )
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(rig.name, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text(rig.subtitle, color = MoonCyan, fontSize = 11.sp)
                }

                if (isEquipped) {
                    Surface(
                        color = MoonCyan.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = MoonCyan, modifier = Modifier.size(12.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("EQUIPPED", color = MoonCyan, fontSize = 10.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                        }
                    }
                } else if (isUnlocked) {
                    Button(
                        onClick = onEquip,
                        colors = ButtonDefaults.buttonColors(containerColor = LanternAmber),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text("EQUIP", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                    }
                } else {
                    Button(
                        onClick = onEquip,
                        enabled = canAfford,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = LanternAmber,
                            disabledContainerColor = SurfaceDark
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            "UNLOCK (${rig.cost} ✨)",
                            color = if (canAfford) MidnightIndigo else SlateMuted,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))
            Text(rig.description, color = SlateMuted, fontSize = 12.sp, lineHeight = 16.sp)

            Spacer(modifier = Modifier.height(8.dp))
            Text("PERKS & SPECIALIZATIONS:", color = LanternAmber, fontSize = 10.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            for (perk in rig.perks) {
                Text("✦ $perk", color = JadeTide, fontSize = 11.sp, lineHeight = 15.sp)
            }
        }
    }
}
