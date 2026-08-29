package com.example.moonkoi

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.moonkoi.model.ViewMode
import com.example.moonkoi.ui.TopNavigationBar
import com.example.moonkoi.ui.dialogue.DialogueScreen
import com.example.moonkoi.ui.district.DistrictScreen
import com.example.moonkoi.ui.flight.SkyFlightScreen
import com.example.moonkoi.ui.modals.*
import com.example.moonkoi.ui.theme.MidnightIndigo
import com.example.moonkoi.ui.theme.MoonKoiCourierTheme
import com.example.moonkoi.viewmodel.GameViewModel
import com.example.moonkoi.viewmodel.ModalType

class MainActivity : ComponentActivity() {

    private val viewModel: GameViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MoonKoiCourierTheme {
                MoonKoiApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun MoonKoiApp(viewModel: GameViewModel) {
    val gameState by viewModel.gameState.collectAsState()
    val activeModal by viewModel.activeModal.collectAsState()

    Scaffold(
        contentWindowInsets = WindowInsets.safeDrawing,
        topBar = {
            TopNavigationBar(
                gameState = gameState,
                onOpenModal = { viewModel.openModal(it) }
            )
        },
        containerColor = MidnightIndigo
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MidnightIndigo)
        ) {
            when (gameState.viewMode) {
                ViewMode.FLIGHT -> {
                    SkyFlightScreen(
                        viewModel = viewModel,
                        gameState = gameState,
                        onDock = { viewModel.dockDistrict(it) }
                    )
                }
                ViewMode.DISTRICT -> {
                    val districtId = gameState.currentDistrict
                    if (districtId != null) {
                        DistrictScreen(
                            districtId = districtId,
                            viewModel = viewModel,
                            gameState = gameState,
                            onUndock = { viewModel.undockToSky() },
                            onOpenDialogue = { viewModel.openDialogue(it) }
                        )
                    } else {
                        SkyFlightScreen(
                            viewModel = viewModel,
                            gameState = gameState,
                            onDock = { viewModel.dockDistrict(it) }
                        )
                    }
                }
                ViewMode.DIALOGUE -> {
                    DialogueScreen(
                        gameState = gameState,
                        onChoiceSelected = { viewModel.selectDialogueChoice(it) },
                        onClose = { viewModel.closeDialogue() }
                    )
                }
            }

            // Modals
            when (activeModal) {
                ModalType.UNDERTOW_DICE -> {
                    UndertowDiceModal(
                        viewModel = viewModel,
                        gameState = gameState,
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.SKILL_TREE -> {
                    SkillTreeModal(
                        viewModel = viewModel,
                        gameState = gameState,
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.UPGRADE_SHOP -> {
                    UpgradeShopModal(
                        viewModel = viewModel,
                        gameState = gameState,
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.WARDROBE -> {
                    GearRigsModal(
                        viewModel = viewModel,
                        gameState = gameState,
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.WORLD_MAP -> {
                    WorldMapModal(
                        viewModel = viewModel,
                        gameState = gameState,
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.CODEX -> {
                    CodexModal(
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.CHARACTER_CREATOR -> {
                    CharacterCreatorModal(
                        viewModel = viewModel,
                        gameState = gameState,
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.QUEST_DRAWER -> {
                    QuestDrawerModal(
                        gameState = gameState,
                        onDismiss = { viewModel.closeModal() }
                    )
                }
                ModalType.NONE -> {
                    // No modal open
                }
            }
        }
    }
}
