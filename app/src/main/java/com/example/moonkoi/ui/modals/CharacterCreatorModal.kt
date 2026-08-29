package com.example.moonkoi.ui.modals

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
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
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.CharacterCustomization
import com.example.moonkoi.model.GameState
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel

@Composable
fun CharacterCreatorModal(
    viewModel: GameViewModel,
    gameState: GameState,
    onDismiss: () -> Unit
) {
    var charState by remember { mutableStateOf(gameState.character) }
    val scrollState = rememberScrollState()

    val companionColors = listOf(
        "azure_glow" to MoonCyan,
        "rose_gold" to Color(0xFFFB7185),
        "midnight_purple" to StormPurple,
        "emerald_jade" to JadeTide,
        "solar_amber" to LanternAmber
    )

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
                        Text("COURIER DOSSIER & PERSONA", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Personalize Courier & Moon-Koi Companion", color = SlateMuted, fontSize = 12.sp)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Presets Carousel
                Text("QUICK ARCHETYPE PRESETS", color = LanternAmber, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(GameData.CHARACTER_PRESETS) { preset ->
                        Surface(
                            onClick = { charState = preset },
                            color = if (charState.name == preset.name) MoonCyan.copy(alpha = 0.2f) else SurfaceVariantDark,
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (charState.name == preset.name) MoonCyan else BorderGlass)
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) {
                                Text(preset.name, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                                Text(preset.title, color = MoonCyan, fontSize = 9.sp)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(scrollState),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Name & Title Inputs
                    OutlinedTextField(
                        value = charState.name,
                        onValueChange = { charState = charState.copy(name = it) },
                        label = { Text("Courier Name") },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = StarlightWhite,
                            unfocusedTextColor = StarlightWhite,
                            focusedBorderColor = MoonCyan,
                            unfocusedBorderColor = BorderGlass
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = charState.title,
                        onValueChange = { charState = charState.copy(title = it) },
                        label = { Text("Skyway Title") },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = StarlightWhite,
                            unfocusedTextColor = StarlightWhite,
                            focusedBorderColor = MoonCyan,
                            unfocusedBorderColor = BorderGlass
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Companion Color Picker
                    Text("NAMI MOON-KOI COMPANION COLOR", color = JadeTide, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        for ((id, color) in companionColors) {
                            val isSelected = charState.koiCompanionColor == id
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(color)
                                    .border(
                                        if (isSelected) 2.5.dp else 1.dp,
                                        if (isSelected) StarlightWhite else Color.Transparent,
                                        CircleShape
                                    )
                                    .clickable { charState = charState.copy(koiCompanionColor = id) },
                                contentAlignment = Alignment.Center
                            ) {
                                if (isSelected) {
                                    Icon(Icons.Default.Check, contentDescription = null, tint = MidnightIndigo, modifier = Modifier.size(18.dp))
                                }
                            }
                        }
                    }

                    // Pronouns selector
                    Text("PRONOUNS", color = SlateMuted, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        for (p in listOf("she/her", "they/them", "he/him", "ze/hir")) {
                            FilterChip(
                                selected = charState.pronouns == p,
                                onClick = { charState = charState.copy(pronouns = p) },
                                label = { Text(p, fontSize = 11.sp) }
                            )
                        }
                    }

                    // Hairstyle options
                    Text("HAIRSTYLE", color = SlateMuted, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        for (h in listOf("windblown_crest", "undercut_dreadlocks", "courier_shave", "flowing_strands")) {
                            FilterChip(
                                selected = charState.hairstyle == h,
                                onClick = { charState = charState.copy(hairstyle = h) },
                                label = { Text(h.replace('_', ' '), fontSize = 10.sp) }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Button(
                    onClick = {
                        viewModel.updateCharacter(charState)
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MoonCyan),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("CONFIRM DOSSIER", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                }
            }
        }
    }
}
