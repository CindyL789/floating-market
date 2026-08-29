package com.example.moonkoi.ui.district

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import com.example.moonkoi.model.*
import com.example.moonkoi.ui.theme.*
import com.example.moonkoi.viewmodel.GameViewModel
import com.example.moonkoi.viewmodel.ModalType

enum class DistrictTab {
    OVERVIEW,
    CONTRACTS,
    TRADER,
    SHRINE
}

@Composable
fun DistrictScreen(
    districtId: DistrictId,
    viewModel: GameViewModel,
    gameState: GameState,
    onUndock: () -> Unit,
    onOpenDialogue: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val district = GameData.DISTRICTS[districtId] ?: return
    var selectedTab by remember { mutableStateOf(DistrictTab.OVERVIEW) }

    val bgBrush = Brush.verticalGradient(
        colors = listOf(
            Color(district.bgGradientStart),
            Color(district.bgGradientEnd)
        )
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(bgBrush)
    ) {
        // District Hero Banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(170.dp)
        ) {
            if (district.drawableRes != null) {
                Image(
                    painter = painterResource(id = district.drawableRes),
                    contentDescription = district.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color.Transparent, Color(district.bgGradientEnd).copy(alpha = 0.95f))
                            )
                        )
                )
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Brush.radialGradient(listOf(Color(district.bgGradientStart), SurfaceDark)))
                )
            }

            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = district.name,
                        style = MaterialTheme.typography.headlineMedium,
                        color = StarlightWhite
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Surface(
                        color = LanternAmber.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(6.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, LanternAmber.copy(alpha = 0.6f))
                    ) {
                        Text(
                            text = "DOCKED",
                            color = LanternAmber,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
                Text(
                    text = district.epithet,
                    color = MoonCyan,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            // Undock Button
            Button(
                onClick = onUndock,
                colors = ButtonDefaults.buttonColors(containerColor = MoonCyan),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(16.dp)
                    .height(42.dp)
            ) {
                Icon(Icons.Default.FlightTakeoff, contentDescription = null, tint = MidnightIndigo, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "LAUNCH SKIFF",
                    color = MidnightIndigo,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        // District Tabs
        TabRow(
            selectedTabIndex = selectedTab.ordinal,
            containerColor = SurfaceDark,
            contentColor = MoonCyan,
            divider = { HorizontalDivider(color = BorderGlass) }
        ) {
            Tab(
                selected = selectedTab == DistrictTab.OVERVIEW,
                onClick = { selectedTab = DistrictTab.OVERVIEW },
                text = { Text("Overview & Citizens", fontSize = 12.sp, fontWeight = FontWeight.SemiBold) }
            )
            Tab(
                selected = selectedTab == DistrictTab.CONTRACTS,
                onClick = { selectedTab = DistrictTab.CONTRACTS },
                text = {
                    val activeCount = if (gameState.activeContract?.destination == districtId) " (!)" else ""
                    Text("Contracts$activeCount", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            )
            Tab(
                selected = selectedTab == DistrictTab.TRADER,
                onClick = { selectedTab = DistrictTab.TRADER },
                text = { Text("Trading Post", fontSize = 12.sp, fontWeight = FontWeight.SemiBold) }
            )
            Tab(
                selected = selectedTab == DistrictTab.SHRINE,
                onClick = { selectedTab = DistrictTab.SHRINE },
                text = { Text("Altar & Harbor", fontSize = 12.sp, fontWeight = FontWeight.SemiBold) }
            )
        }

        // Tab Content
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp)
        ) {
            when (selectedTab) {
                DistrictTab.OVERVIEW -> OverviewTab(district, onOpenDialogue)
                DistrictTab.CONTRACTS -> ContractsTab(district, gameState, viewModel)
                DistrictTab.TRADER -> TraderTab(district, gameState, viewModel)
                DistrictTab.SHRINE -> ShrineTab(district, gameState, viewModel)
            }
        }
    }
}

@Composable
fun OverviewTab(district: DistrictInfo, onOpenDialogue: (String) -> Unit) {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            Surface(
                color = SurfaceCard,
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("DISTRICT DISPATCH", color = MoonCyan, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(district.description, color = StarlightWhite, fontSize = 13.sp, lineHeight = 19.sp)
                }
            }
        }

        item {
            Text("NOTABLE CITIZENS & OPERATIVES", color = LanternAmber, fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
        }

        items(district.npcs) { npcId ->
            val npc = GameData.NPCS[npcId]
            if (npc != null) {
                Surface(
                    color = SurfaceCard,
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            if (npc.portraitRes != null) {
                                Image(
                                    painter = painterResource(id = npc.portraitRes),
                                    contentDescription = npc.name,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(CircleShape)
                                        .border(1.5.dp, MoonCyan, CircleShape)
                                )
                            } else {
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(CircleShape)
                                        .background(SurfaceVariantDark)
                                        .border(1.dp, BorderGlass, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = npc.iconEmoji, fontSize = 22.sp)
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column {
                                Text(text = npc.name, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text(text = npc.title, color = MoonCyan, fontSize = 11.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("Trust", color = SlateMuted, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Box(
                                        modifier = Modifier
                                            .width(60.dp)
                                            .height(4.dp)
                                            .clip(RoundedCornerShape(2.dp))
                                            .background(SurfaceDark)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .fillMaxHeight()
                                                .fillMaxWidth(npc.affinity / 100f)
                                                .background(JadeTide)
                                        )
                                    }
                                }
                            }
                        }

                        Button(
                            onClick = { onOpenDialogue(npcId) },
                            colors = ButtonDefaults.buttonColors(containerColor = LanternAmber),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Icon(Icons.Default.Chat, contentDescription = null, tint = MidnightIndigo, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("SPEAK", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ContractsTab(district: DistrictInfo, gameState: GameState, viewModel: GameViewModel) {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        // Active contract banner if applicable
        val active = gameState.activeContract
        if (active != null) {
            item {
                Surface(
                    color = if (active.destination == district.id) JadeTide.copy(alpha = 0.15f) else SurfaceCard,
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, if (active.destination == district.id) JadeTide else LanternAmber)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("ACTIVE SHIPMENT IN TRANSIT", color = LanternAmber, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                            if (active.destination == district.id) {
                                Button(
                                    onClick = { viewModel.deliverContract() },
                                    colors = ButtonDefaults.buttonColors(containerColor = JadeTide),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = MidnightIndigo, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("DELIVER CARGO", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(active.title, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Destination: ${GameData.DISTRICTS[active.destination]?.name}", color = MoonCyan, fontSize = 12.sp)
                        Text("Cargo: ${active.cargo}", color = SlateMuted, fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("Reward: +${active.rewardDroplets} Droplets", color = MoonCyan, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                            Text("+${active.rewardFavors} Favors", color = LanternAmber, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            }
        }

        item {
            Text("AVAILABLE LOCAL CONTRACTS", color = MoonCyan, fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
        }

        val availableContracts = GameData.CONTRACT_POOL.filter { it.origin == district.id }
        if (availableContracts.isEmpty()) {
            item {
                Surface(color = SurfaceCard, shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth()) {
                    Text("No new dispatches from this platform currently. Check back after your next flight!", color = SlateMuted, modifier = Modifier.padding(14.dp), fontSize = 13.sp)
                }
            }
        } else {
            items(availableContracts) { contract ->
                val isCurrent = gameState.activeContract?.id == contract.id
                Surface(
                    color = SurfaceCard,
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(contract.title, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Surface(
                                color = if (contract.urgency == "Perilous") StormCrimson.copy(alpha = 0.2f) else MoonCyan.copy(alpha = 0.2f),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text(
                                    contract.urgency.uppercase(),
                                    color = if (contract.urgency == "Perilous") StormCrimson else MoonCyan,
                                    fontSize = 9.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Text("Client: ${contract.client} // Dest: ${GameData.DISTRICTS[contract.destination]?.name}", color = MoonCyan, fontSize = 11.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(contract.flavorText, color = SlateMuted, fontSize = 12.sp)

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text("+${contract.rewardDroplets} Droplets", color = MoonCyan, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                Text("+${contract.rewardFavors} Favors", color = LanternAmber, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                            }

                            if (!isCurrent) {
                                Button(
                                    onClick = { viewModel.acceptContract(contract) },
                                    colors = ButtonDefaults.buttonColors(containerColor = LanternAmber),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text("ACCEPT", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                                }
                            } else {
                                Text("ACCEPTED", color = JadeTide, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TraderTab(district: DistrictInfo, gameState: GameState, viewModel: GameViewModel) {
    val hasDiscount = gameState.unlockedSkills.contains("trader_bargaining")

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            Surface(
                color = SurfaceCard,
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("DISTRICT TRADING POST", color = MoonCyan, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                        Text(
                            text = if (hasDiscount) "✨ Quartermaster Discount (-25% Active)" else "Standard Market Exchange",
                            color = if (hasDiscount) JadeTide else SlateMuted,
                            fontSize = 12.sp
                        )
                    }
                    Text("Your Droplets: ${gameState.droplets}", color = MoonCyan, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }

        // Item 1: Hull Patch
        item {
            TraderItemCard(
                title = "Emergency Teak Hull Repair",
                description = "Restores +35 hull integrity instantly with fresh waterproof resin and brass ribbing.",
                icon = "🛡️",
                baseCost = 30,
                hasDiscount = hasDiscount,
                onBuy = { viewModel.buyTraderItem("hull_repair", 30) }
            )
        }

        // Item 2: Storm Jar
        item {
            TraderItemCard(
                title = "Charged Weather Storm Jar",
                description = "Sealed ozone sphere with captured blue lightning. Essential for storm altar ceremonies and mechanics.",
                icon = "⚡",
                baseCost = 45,
                hasDiscount = hasDiscount,
                onBuy = { viewModel.buyTraderItem("storm_jar", 45) }
            )
        }

        // Item 3: Moon-Koi Stardust Treat
        item {
            TraderItemCard(
                title = "Stardust Kelp Wafer",
                description = "Feed to Nami to strengthen your harmonic link (+15 Koi Affinity).",
                icon = "🎏",
                baseCost = 25,
                hasDiscount = hasDiscount,
                onBuy = { viewModel.buyTraderItem("koi_treat", 25) }
            )
        }

        // If Undertow Den, show Dice Arena button
        if (district.id == DistrictId.undertow_den) {
            item {
                Surface(
                    color = LanternAmber.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, LanternAmber)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("MOON-KOI DICE ARENA", color = LanternAmber, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Wager Moon-Droplets against Whisperer Kael for Brass Favors!", color = SlateMuted, fontSize = 12.sp)
                        }
                        Button(
                            onClick = { viewModel.openModal(ModalType.UNDERTOW_DICE) },
                            colors = ButtonDefaults.buttonColors(containerColor = LanternAmber),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("PLAY DICE", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TraderItemCard(
    title: String,
    description: String,
    icon: String,
    baseCost: Int,
    hasDiscount: Boolean,
    onBuy: () -> Unit
) {
    val finalCost = if (hasDiscount) (baseCost * 0.75f).toInt() else baseCost

    Surface(
        color = SurfaceCard,
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
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(SurfaceVariantDark),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = icon, fontSize = 20.sp)
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(title, color = StarlightWhite, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Text(description, color = SlateMuted, fontSize = 11.sp, lineHeight = 15.sp)
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = onBuy,
                colors = ButtonDefaults.buttonColors(containerColor = MoonCyan),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text(
                    "$finalCost ✨",
                    color = MidnightIndigo,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}

@Composable
fun ShrineTab(district: DistrictInfo, gameState: GameState, viewModel: GameViewModel) {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            Surface(
                color = SurfaceCard,
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("MOON-KOI HARBOR COMMUNION", color = JadeTide, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "In the sheltered water basins of this platform, Nami rests in pure starlight condensation. Communing here refreshes your spiritual focus and aligns your flight telemetry.",
                        color = StarlightWhite,
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Current Nami Bond: ${gameState.stats.koiAffinity}%", color = MoonCyan, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                        Button(
                            onClick = { viewModel.buyTraderItem("koi_treat", 0) },
                            colors = ButtonDefaults.buttonColors(containerColor = JadeTide),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("OFFER PRAYER", color = MidnightIndigo, fontWeight = FontWeight.Bold, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            }
        }

        item {
            Surface(
                color = SurfaceCard,
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderGlass)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("ARCHIPELAGO REPUTATION", color = LanternAmber, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    ReputationBar(label = "Lantern Guild", value = gameState.reputation.lanternGuild, color = MoonCyan)
                    Spacer(modifier = Modifier.height(6.dp))
                    ReputationBar(label = "Undertow Syndicate", value = gameState.reputation.undertowSyndicate, color = LanternAmber)
                    Spacer(modifier = Modifier.height(6.dp))
                    ReputationBar(label = "Anchor Monks", value = gameState.reputation.anchorMonks, color = StormViolet)
                }
            }
        }
    }
}

@Composable
fun ReputationBar(label: String, value: Int, color: Color) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(label, color = StarlightWhite, fontSize = 11.sp)
            Text("$value / 100", color = color, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(3.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(5.dp)
                .clip(RoundedCornerShape(2.5.dp))
                .background(SurfaceDark)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(value / 100f)
                    .background(color)
            )
        }
    }
}
