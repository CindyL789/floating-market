package com.example.moonkoi.ui.modals

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.moonkoi.data.GameData
import com.example.moonkoi.model.ArtWorkEntry
import com.example.moonkoi.ui.theme.*

enum class CodexTab {
    ART_GALLERY,
    DISTRICT_RECORDS,
    FACTIONS,
    CARGO_MANIFEST
}

@Composable
fun CodexModal(
    onDismiss: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(CodexTab.ART_GALLERY) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            color = SurfaceCard,
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, BorderGlass),
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.92f)
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
                        Text("ILLUSTRATED LORE CODEX", color = MoonCyan, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("Artworks, Historical Records & World Archives", color = SlateMuted, fontSize = 12.sp)
                    }
                    IconButton(onClick = onDismiss, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = StarlightWhite)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Tabs
                TabRow(
                    selectedTabIndex = selectedTab.ordinal,
                    containerColor = SurfaceDark,
                    contentColor = MoonCyan,
                    divider = { HorizontalDivider(color = BorderGlass) }
                ) {
                    Tab(selected = selectedTab == CodexTab.ART_GALLERY, onClick = { selectedTab = CodexTab.ART_GALLERY }, text = { Text("Art Gallery", fontSize = 11.sp) })
                    Tab(selected = selectedTab == CodexTab.DISTRICT_RECORDS, onClick = { selectedTab = CodexTab.DISTRICT_RECORDS }, text = { Text("Districts", fontSize = 11.sp) })
                    Tab(selected = selectedTab == CodexTab.FACTIONS, onClick = { selectedTab = CodexTab.FACTIONS }, text = { Text("Factions", fontSize = 11.sp) })
                    Tab(selected = selectedTab == CodexTab.CARGO_MANIFEST, onClick = { selectedTab = CodexTab.CARGO_MANIFEST }, text = { Text("Cargo Lore", fontSize = 11.sp) })
                }

                Spacer(modifier = Modifier.height(12.dp))

                Box(modifier = Modifier.weight(1f)) {
                    when (selectedTab) {
                        CodexTab.ART_GALLERY -> ArtGallerySection()
                        CodexTab.DISTRICT_RECORDS -> DistrictRecordsSection()
                        CodexTab.FACTIONS -> FactionsSection()
                        CodexTab.CARGO_MANIFEST -> CargoManifestSection()
                    }
                }
            }
        }
    }
}

@Composable
fun ArtGallerySection() {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(14.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(GameData.ART_GALLERY) { art ->
            Surface(
                color = SurfaceVariantDark,
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Image(
                        painter = painterResource(id = art.drawableRes),
                        contentDescription = art.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp)
                            .clip(RoundedCornerShape(8.dp))
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(art.title, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text(art.subtitle, color = MoonCyan, fontSize = 11.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(art.description, color = SlateMuted, fontSize = 12.sp, lineHeight = 17.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(art.loreQuote, color = LanternAmber, fontSize = 11.sp, fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                }
            }
        }
    }
}

@Composable
fun DistrictRecordsSection() {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(GameData.DISTRICTS.values.toList()) { d ->
            Surface(
                color = SurfaceVariantDark,
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(d.name, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text(d.epithet, color = MoonCyan, fontSize = 11.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(d.description, color = SlateMuted, fontSize = 12.sp, lineHeight = 17.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Design Takeaway: ${d.designTakeaway}", color = JadeTide, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                }
            }
        }
    }
}

@Composable
fun FactionsSection() {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            FactionCard(
                name = "The Lantern Guild",
                leader = "Madame Lin",
                color = MoonCyan,
                lore = "Holders of the celestial star-charts and lawful commerce. They maintain the blue beacons that guide weary couriers across the fog."
            )
        }
        item {
            FactionCard(
                name = "The Undertow Syndicate",
                leader = "Captain Jax & Agent Manus",
                color = LanternAmber,
                lore = "The shadow economy beneath the markets. Smugglers, brokers, and inventors who know how fragile the tethered platforms truly are."
            )
        }
        item {
            FactionCard(
                name = "The Anchor Monks",
                leader = "Brother Hane",
                color = StormViolet,
                lore = "Devout guardians of the colossal mooring chains. They capture lightning inside storm jars to prevent the kinetic anchors from shearing."
            )
        }
    }
}

@Composable
fun FactionCard(name: String, leader: String, color: Color, lore: String) {
    Surface(
        color = SurfaceVariantDark,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(name, color = color, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Text("Key Figures: $leader", color = StarlightWhite, fontSize = 11.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(lore, color = SlateMuted, fontSize = 12.sp, lineHeight = 17.sp)
        }
    }
}

@Composable
fun CargoManifestSection() {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            ManifestItemCard(
                title = "Moon-Koi Scale Talismans",
                category = "Living Relic",
                description = "Cobalt scales shed naturally by Moon-Koi companions during celestial alignments. Resonates when near secret thermal slipstreams."
            )
        }
        item {
            ManifestItemCard(
                title = "Charged Weather Storm Jars",
                category = "Kinetic Fuel",
                description = "Glass spheres reinforced with silver ribbing, capturing lightning vortex strikes from the Upper Maelstrom."
            )
        }
        item {
            ManifestItemCard(
                title = "Ribbed Blue Glass Lenses",
                category = "Navigation Optic",
                description = "Focuses phosphor lantern luminescence to cut through blinding thunderstorm fog banks."
            )
        }
    }
}

@Composable
fun ManifestItemCard(title: String, category: String, description: String) {
    Surface(
        color = SurfaceVariantDark,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(title, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text(category, color = LanternAmber, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(description, color = SlateMuted, fontSize = 12.sp, lineHeight = 16.sp)
        }
    }
}
