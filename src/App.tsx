import React, { useState, useEffect } from 'react';
import {
  GameState,
  DistrictId,
  RigId,
  DialogueChoice,
  DeliveryContract,
  CharacterCustomization
} from './types';
import {
  DEFAULT_CHARACTER,
  INITIAL_INVENTORY,
  MAIN_QUESTS,
  GEAR_RIGS,
  NPCS
} from './data/gameData';

import { TopNav } from './components/TopNav';
import { SkyFlightCanvas } from './components/SkyFlightCanvas';
import { DistrictView } from './components/DistrictView';
import { DialogueModal } from './components/DialogueModal';
import { UndertowGameModal } from './components/UndertowGameModal';
import { SkillTreeModal } from './components/SkillTreeModal';
import { UpgradeShopModal } from './components/UpgradeShopModal';
import { GearRigsModal } from './components/GearRigsModal';
import { WorldMapModal } from './components/WorldMapModal';
import { CodexModal } from './components/CodexModal';
import { CharacterCreatorModal } from './components/CharacterCreatorModal';
import { QuestDrawer } from './components/QuestDrawer';

const initialGameState: GameState = {
  currentDistrict: null,
  viewMode: 'flight',
  playerX: 520,
  playerY: 530,
  playerVelocityX: 0,
  playerVelocityY: 0,
  playerAngle: 0,
  stats: {
    hullIntegrity: 100,
    maxHull: 100,
    speedLevel: 1,
    lanternPower: 100,
    maxLanternPower: 100,
    koiAffinity: 75
  },
  upgrades: {
    hull: 0,
    engine: 0,
    weapon: 0
  },
  droplets: 150,
  favors: 4,
  stormJars: 2,
  reputation: {
    lanternGuild: 40,
    undertowSyndicate: 25,
    anchorMonks: 20
  },
  activeRig: 'standard_courier',
  unlockedRigs: ['standard_courier'],
  lanternMode: 'beacon',
  activeQuests: MAIN_QUESTS,
  completedQuestIds: [],
  currentMainChapter: 1,
  activeContract: null,
  inventory: INITIAL_INVENTORY,
  activeDialogueNodeId: null,
  activeNpcId: null,
  character: DEFAULT_CHARACTER,
  discoveredLandmarks: ['landmark_lantern_bazaar', 'landmark_undertow_den'],
  mapWaypoint: null,
  unlockedSkills: [],
  soundEnabled: true,
  volume: 0.8,
  logMessages: [
    { id: '1', text: 'Skiff engines calibrated. Nami swimming alongside in starlight slipstream.', time: '00:01', type: 'info' },
    { id: '2', text: 'Lantern Bazaar docking beacon aligned.', time: '00:02', type: 'reward' }
  ]
};

export function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('moon_koi_game_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use initial
      }
    }
    return initialGameState;
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Auto save to local storage
  useEffect(() => {
    localStorage.setItem('moon_koi_game_state', JSON.stringify(gameState));
  }, [gameState]);

  // Handlers
  const handleDock = (districtId: DistrictId) => {
    setGameState(prev => {
      let repairBonus = 0;
      if (prev.unlockedSkills.includes('hull_capacity_2')) {
        repairBonus = 25;
      }
      return {
        ...prev,
        currentDistrict: districtId,
        viewMode: 'district',
        stats: {
          ...prev.stats,
          hullIntegrity: Math.min(prev.stats.maxHull, prev.stats.hullIntegrity + repairBonus),
          lanternPower: prev.stats.maxLanternPower
        },
        logMessages: [
          { id: Date.now().toString(), text: `Docked at ${districtId.replace('_', ' ').toUpperCase()}`, time: 'NOW', type: 'reward' },
          ...prev.logMessages
        ]
      };
    });
  };

  const handleUndock = () => {
    setGameState(prev => ({
      ...prev,
      viewMode: 'flight',
      currentDistrict: null,
      logMessages: [
        { id: Date.now().toString(), text: 'Skiff launched into the Skyways.', time: 'NOW', type: 'info' },
        ...prev.logMessages
      ]
    }));
  };

  const handleOpenDialogue = (npcId: string) => {
    setGameState(prev => ({
      ...prev,
      activeNpcId: npcId,
      activeDialogueNodeId: NPCS[npcId]?.dialogueTreeId || null,
      viewMode: 'dialogue'
    }));
  };

  const handleCloseDialogue = () => {
    setGameState(prev => ({
      ...prev,
      activeNpcId: null,
      activeDialogueNodeId: null,
      viewMode: prev.currentDistrict ? 'district' : 'flight'
    }));
  };

  const handleChoiceSelected = (choice: DialogueChoice) => {
    setGameState(prev => {
      let { droplets, favors, currentMainChapter, completedQuestIds } = prev;

      if (choice.actionType === 'complete_ch1') {
        currentMainChapter = 2;
        droplets += 60;
        favors += 2;
        completedQuestIds = [...completedQuestIds, 'quest_chapter_1'];
      } else if (choice.actionType === 'complete_ch2') {
        currentMainChapter = 3;
        droplets += 120;
        favors += 4;
        completedQuestIds = [...completedQuestIds, 'quest_chapter_2'];
      } else if (choice.actionType === 'complete_ch3') {
        currentMainChapter = 4;
        droplets += 220;
        favors += 6;
        completedQuestIds = [...completedQuestIds, 'quest_chapter_3'];
      } else if (choice.actionType === 'manus_mission') {
        droplets += 50;
        favors += 3;
      }

      if (!choice.nextNodeId) {
        return {
          ...prev,
          droplets,
          favors,
          currentMainChapter,
          completedQuestIds,
          activeNpcId: null,
          activeDialogueNodeId: null,
          viewMode: prev.currentDistrict ? 'district' : 'flight'
        };
      }

      return {
        ...prev,
        droplets,
        favors,
        currentMainChapter,
        completedQuestIds,
        activeDialogueNodeId: choice.nextNodeId
      };
    });
  };

  const handleAcceptContract = (contract: DeliveryContract) => {
    setGameState(prev => ({
      ...prev,
      activeContract: contract,
      logMessages: [
        { id: Date.now().toString(), text: `Accepted shipment for ${contract.client}`, time: 'NOW', type: 'info' },
        ...prev.logMessages
      ]
    }));
  };

  const handleDeliverContract = () => {
    if (!gameState.activeContract) return;
    const hasBonus = gameState.unlockedSkills.includes('contract_broker');
    const dropletReward = gameState.activeContract.rewardDroplets * (hasBonus ? 1.3 : 1.0);
    const favorReward = gameState.activeContract.rewardFavors + (hasBonus ? 1 : 0);

    setGameState(prev => ({
      ...prev,
      droplets: Math.round(prev.droplets + dropletReward),
      favors: prev.favors + favorReward,
      activeContract: null,
      logMessages: [
        { id: Date.now().toString(), text: `Delivery complete! +${Math.round(dropletReward)} Droplets, +${favorReward} Favors`, time: 'NOW', type: 'reward' },
        ...prev.logMessages
      ]
    }));
  };

  const handleBuyTraderItem = (itemId: string, cost: number) => {
    if (gameState.droplets < cost) return;

    setGameState(prev => {
      let stats = { ...prev.stats };
      let stormJars = prev.stormJars;

      if (itemId === 'hull_repair') {
        stats.hullIntegrity = Math.min(stats.maxHull, stats.hullIntegrity + 35);
      } else if (itemId === 'storm_jar') {
        stormJars += 1;
      } else if (itemId === 'koi_treat') {
        stats.koiAffinity = Math.min(100, stats.koiAffinity + 15);
      }

      return {
        ...prev,
        droplets: prev.droplets - cost,
        stats,
        stormJars,
        logMessages: [
          { id: Date.now().toString(), text: `Purchased ${itemId.replace('_', ' ')} for ${cost} Droplets`, time: 'NOW', type: 'info' },
          ...prev.logMessages
        ]
      };
    });
  };

  const handlePlayDice = (wager: number) => {
    const p1 = Math.floor(Math.random() * 6) + 1;
    const p2 = Math.floor(Math.random() * 6) + 1;
    const p3 = Math.floor(Math.random() * 6) + 1;
    const playerTotal = p1 + p2 + p3;

    const b1 = Math.floor(Math.random() * 6) + 1;
    const b2 = Math.floor(Math.random() * 6) + 1;
    const b3 = Math.floor(Math.random() * 6) + 1;
    const brokerTotal = b1 + b2 + b3;

    const hasCharisma = gameState.activeRig === 'undertow_civilian';
    const playerWon = hasCharisma ? playerTotal >= brokerTotal : playerTotal > brokerTotal;

    if (playerWon) {
      const payout = hasCharisma ? Math.round(wager * 1.3) : wager;
      setGameState(prev => ({
        ...prev,
        droplets: prev.droplets + payout,
        favors: prev.favors + 1
      }));
      return {
        playerDice: [p1, p2, p3],
        brokerDice: [b1, b2, b3],
        message: `Victory! You scored ${playerTotal} vs Kael's ${brokerTotal}. Won +${payout} Droplets & +1 Favor!`
      };
    } else {
      setGameState(prev => ({
        ...prev,
        droplets: Math.max(0, prev.droplets - wager)
      }));
      return {
        playerDice: [p1, p2, p3],
        brokerDice: [b1, b2, b3],
        message: `Defeat. You scored ${playerTotal} vs Kael's ${brokerTotal}. Lost ${wager} Droplets.`
      };
    }
  };

  const handleUnlockSkill = (skillId: string) => {
    setGameState(prev => {
      const skill = NPCS; // dummy ref
      return {
        ...prev,
        favors: prev.favors - 1,
        unlockedSkills: [...prev.unlockedSkills, skillId],
        stats: {
          ...prev.stats,
          maxHull: skillId === 'hull_capacity_1' ? 130 : (skillId === 'hull_capacity_2' ? 160 : prev.stats.maxHull),
          maxLanternPower: skillId === 'max_lantern_1' ? 150 : prev.stats.maxLanternPower
        }
      };
    });
  };

  const handleUpgradeSkiff = (type: 'hull' | 'engine' | 'weapon') => {
    setGameState(prev => {
      const currentLvl = prev.upgrades[type];
      const cost = type === 'hull' ? 50 + currentLvl * 30 : type === 'engine' ? 60 + currentLvl * 35 : 70 + currentLvl * 40;
      if (prev.droplets < cost) return prev;

      return {
        ...prev,
        droplets: prev.droplets - cost,
        upgrades: {
          ...prev.upgrades,
          [type]: currentLvl + 1
        },
        stats: {
          ...prev.stats,
          maxHull: type === 'hull' ? prev.stats.maxHull + 18 : prev.stats.maxHull
        }
      };
    });
  };

  const handleEquipRig = (rigId: RigId) => {
    setGameState(prev => {
      const rig = GEAR_RIGS[rigId];
      if (!prev.unlockedRigs.includes(rigId)) {
        if (prev.droplets < rig.cost) return prev;
        return {
          ...prev,
          droplets: prev.droplets - rig.cost,
          unlockedRigs: [...prev.unlockedRigs, rigId],
          activeRig: rigId
        };
      }
      return {
        ...prev,
        activeRig: rigId
      };
    });
  };

  const handleSetWaypoint = (x: number, y: number, label: string) => {
    setGameState(prev => ({
      ...prev,
      mapWaypoint: { x, y, label }
    }));
  };

  const handleClearWaypoint = () => {
    setGameState(prev => ({
      ...prev,
      mapWaypoint: null
    }));
  };

  const handleUpdateCharacter = (character: CharacterCustomization) => {
    setGameState(prev => ({ ...prev, character }));
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#070B14] text-slate-100">
      {/* Top Header Navigation */}
      <TopNav
        gameState={gameState}
        onOpenModal={modal => setActiveModal(modal)}
      />

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden">
        {gameState.viewMode === 'flight' ? (
          <SkyFlightCanvas
            gameState={gameState}
            onDock={handleDock}
            onUpdateState={setGameState}
            onSetWaypoint={handleSetWaypoint}
            onClearWaypoint={handleClearWaypoint}
            onOpenModal={modal => setActiveModal(modal)}
          />
        ) : gameState.viewMode === 'district' && gameState.currentDistrict ? (
          <DistrictView
            districtId={gameState.currentDistrict}
            gameState={gameState}
            onUndock={handleUndock}
            onOpenDialogue={handleOpenDialogue}
            onAcceptContract={handleAcceptContract}
            onDeliverContract={handleDeliverContract}
            onBuyItem={handleBuyTraderItem}
            onOpenDiceGame={() => setActiveModal('undertow_dice')}
          />
        ) : null}

        {/* Dialogue Modal Overlay */}
        {gameState.viewMode === 'dialogue' && (
          <DialogueModal
            gameState={gameState}
            onChoiceSelected={handleChoiceSelected}
            onClose={handleCloseDialogue}
          />
        )}
      </main>

      {/* Modals */}
      {activeModal === 'undertow_dice' && (
        <UndertowGameModal
          gameState={gameState}
          onPlayDice={handlePlayDice}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'skill_tree' && (
        <SkillTreeModal
          gameState={gameState}
          onUnlockSkill={handleUnlockSkill}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'upgrade_shop' && (
        <UpgradeShopModal
          gameState={gameState}
          onUpgrade={handleUpgradeSkiff}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'wardrobe' && (
        <GearRigsModal
          gameState={gameState}
          onEquipRig={handleEquipRig}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'world_map' && (
        <WorldMapModal
          gameState={gameState}
          onSetWaypoint={handleSetWaypoint}
          onClearWaypoint={handleClearWaypoint}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'codex' && (
        <CodexModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'character_creator' && (
        <CharacterCreatorModal
          gameState={gameState}
          onUpdateCharacter={handleUpdateCharacter}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'quest_drawer' && (
        <QuestDrawer
          gameState={gameState}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}

export default App;
