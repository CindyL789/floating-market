/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameState, DistrictId } from './types';
import { MAIN_QUESTS, INITIAL_INVENTORY, DISTRICTS, DEFAULT_CHARACTER } from './data/gameData';
import { SkyFlightCanvas } from './components/SkyFlightCanvas';
import { DistrictView } from './components/DistrictView';
import { TopNav } from './components/TopNav';
import { DialogueModal } from './components/DialogueModal';
import { GearRigsModal } from './components/GearRigsModal';
import { CodexModal } from './components/CodexModal';
import { UndertowGameModal } from './components/UndertowGameModal';
import { CharacterCreatorModal } from './components/CharacterCreatorModal';
import { WorldMapModal } from './components/WorldMapModal';
import { SkillTreeModal } from './components/SkillTreeModal';
import { UpgradeShopModal } from './components/UpgradeShopModal';
import { QuestDrawer } from './components/QuestDrawer';
import { sound } from './utils/audio';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Check if character was previously saved in localStorage
    let savedChar = DEFAULT_CHARACTER;
    try {
      const stored = localStorage.getItem('moon_koi_character');
      if (stored) {
        savedChar = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load saved character', e);
    }

    let savedUpgrades = { hull: 0, engine: 0, weapon: 0 };
    let savedHullIntegrity = 100;
    try {
      const storedProgress = localStorage.getItem('moon_koi_upgrade_progress');
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        savedUpgrades = { ...savedUpgrades, ...(parsed.upgrades || {}) };
        savedHullIntegrity = typeof parsed.hullIntegrity === 'number' ? parsed.hullIntegrity : savedHullIntegrity;
      }
    } catch (e) {
      console.error('Failed to load saved upgrade progress', e);
    }
    const savedMaxHull = 100 + savedUpgrades.hull * 18;

    return {
      currentDistrict: 'lantern_bazaar',
      viewMode: 'district', // starts docked at Lantern Bazaar for immediate story immersion
      playerPos: { x: 500, y: 500 },
      playerVelocity: { x: 0, y: 0 },
      playerAngle: 0,
      character: savedChar,
      discoveredLandmarks: ['lantern_bazaar', 'star_weaver_wreck'],
      mapWaypoint: null,
      unlockedSkills: [],
      stats: {
        hullIntegrity: Math.min(savedMaxHull, savedHullIntegrity),
        maxHull: savedMaxHull,
        speedLevel: 1 + savedUpgrades.engine,
        lanternPower: 100,
        maxLanternPower: 100,
        koiAffinity: 65
      },
      upgrades: savedUpgrades,
      droplets: 80,
      favors: 3,
      stormJars: 1,
      reputation: {
        lanternGuild: 50,
        undertowSyndicate: 15,
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
      soundEnabled: true,
      volume: 0.6,
      logMessages: [
        {
          id: '1',
          text: 'The markets open after moonrise. Blue lanterns guide the cloud sea.',
          time: 'Just now',
          type: 'story'
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('moon_koi_upgrade_progress', JSON.stringify({
      upgrades: gameState.upgrades,
      hullIntegrity: gameState.stats.hullIntegrity,
    }));
  }, [gameState.upgrades, gameState.stats.hullIntegrity]);

  // Modal display states
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [showUndertowGame, setShowUndertowGame] = useState(false);
  const [showCharacterCreator, setShowCharacterCreator] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showUpgradeShop, setShowUpgradeShop] = useState(false);

  // Docking event from Sky Flight
  const handleDockDistrict = (districtId: DistrictId) => {
    sound.playTempleGong();
    setGameState(prev => ({
      ...prev,
      currentDistrict: districtId,
      viewMode: 'district',
      playerPos: { ...DISTRICTS[districtId].coordinates },
      playerVelocity: { x: 0, y: 0 },
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Docked at ${DISTRICTS[districtId].name}`,
          time: 'Just now',
          type: 'info'
        },
        ...prev.logMessages
      ]
    }));
  };

  // Undock / Launch Skiff into Skyways
  const handleUndockToSky = () => {
    sound.playMoonChime(440);
    sound.startAtmosphericAmbience();
    setGameState(prev => ({
      ...prev,
      currentDistrict: null,
      viewMode: 'flight',
      playerPos: prev.currentDistrict
        ? { x: Math.max(50, DISTRICTS[prev.currentDistrict].coordinates.x - 140), y: DISTRICTS[prev.currentDistrict].coordinates.y }
        : prev.playerPos,
      playerVelocity: { x: 0, y: 0 },
      playerAngle: 0,
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Skiff launched into the Skyways. ${prev.character.name}'s Moon-Koi is swimming alongside.`,
          time: 'Just now',
          type: 'info'
        },
        ...prev.logMessages
      ]
    }));
  };

  // Open NPC dialogue
  const handleOpenDialogue = (npcId: string) => {
    sound.playMoonChime(520);
    setGameState(prev => ({
      ...prev,
      activeNpcId: npcId,
      activeDialogueNodeId: null,
      viewMode: 'dialogue'
    }));
  };

  // Close dialogue modal
  const handleCloseDialogue = () => {
    setGameState(prev => ({
      ...prev,
      activeNpcId: null,
      activeDialogueNodeId: null,
      viewMode: prev.currentDistrict ? 'district' : 'flight'
    }));
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#070b14] text-slate-100 overflow-hidden select-none">
      {/* Top Status and Navigation Bar */}
      <TopNav
        gameState={gameState}
        setGameState={setGameState}
        onOpenWardrobe={() => setShowWardrobe(true)}
        onOpenCodex={() => setShowCodex(true)}
        onOpenCharacterCreator={() => setShowCharacterCreator(true)}
        onOpenWorldMap={() => setShowWorldMap(true)}
        onOpenSkillTree={() => setShowSkillTree(true)}
        onOpenUpgradeShop={() => setShowUpgradeShop(true)}
      />

      {/* Main Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Sky Flight View (Real-time Canvas) */}
        {gameState.viewMode === 'flight' ? (
          <SkyFlightCanvas
            gameState={gameState}
            setGameState={setGameState}
            onDock={handleDockDistrict}
          />
        ) : (
          /* Docked District View (RPG Market & NPC Interactions) */
          <DistrictView
            gameState={gameState}
            setGameState={setGameState}
            onUndock={handleUndockToSky}
            onOpenDialogue={handleOpenDialogue}
            onOpenWardrobe={() => setShowWardrobe(true)}
            onOpenUndertowGame={() => setShowUndertowGame(true)}
            onOpenSkillTree={() => setShowSkillTree(true)}
          />
        )}

        {/* Story Quest & Dispatch Objectives Drawer */}
        <QuestDrawer gameState={gameState} />
      </main>

      {/* Permanent Skiff Upgrade Shop */}
      {showUpgradeShop && (
        <UpgradeShopModal
          gameState={gameState}
          setGameState={setGameState}
          onClose={() => setShowUpgradeShop(false)}
        />
      )}

      {/* Astral Attunement & Skill Tree Modal */}
      {showSkillTree && (
        <SkillTreeModal
          gameState={gameState}
          setGameState={setGameState}
          onClose={() => setShowSkillTree(false)}
        />
      )}

      {/* Dialogue Modal */}
      {gameState.viewMode === 'dialogue' && (
        <DialogueModal
          gameState={gameState}
          setGameState={setGameState}
          onClose={handleCloseDialogue}
        />
      )}

      {/* Character Creator Modal */}
      {showCharacterCreator && (
        <CharacterCreatorModal
          gameState={gameState}
          setGameState={setGameState}
          onClose={() => setShowCharacterCreator(false)}
        />
      )}

      {/* World Map & Biome Exploration Modal */}
      {showWorldMap && (
        <WorldMapModal
          gameState={gameState}
          setGameState={setGameState}
          onClose={() => setShowWorldMap(false)}
          onFastTravel={(districtId) => handleDockDistrict(districtId)}
        />
      )}

      {/* Wardrobe & Gear Rig Modal */}
      {showWardrobe && (
        <GearRigsModal
          gameState={gameState}
          setGameState={setGameState}
          onClose={() => setShowWardrobe(false)}
        />
      )}

      {/* Lore Codex Modal */}
      {showCodex && (
        <CodexModal onClose={() => setShowCodex(false)} />
      )}

      {/* Undertow Den Moon-Dice Mini-Game Modal */}
      {showUndertowGame && (
        <UndertowGameModal
          gameState={gameState}
          setGameState={setGameState}
          onClose={() => setShowUndertowGame(false)}
        />
      )}
    </div>
  );
}
