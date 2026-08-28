import React, { useState } from 'react';
import { GameState, DistrictId } from '../types';
import { DISTRICTS, NPCS, CONTRACT_POOL } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  Wind, 
  Sparkles, 
  MessageSquare, 
  Scroll, 
  ShoppingBag, 
  Dices, 
  Shield, 
  Zap, 
  Navigation, 
  Compass, 
  Anchor, 
  User, 
  CheckCircle2,
  Image as ImageIcon,
  Eye,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onUndock: () => void;
  onOpenDialogue: (npcId: string) => void;
  onOpenWardrobe: () => void;
  onOpenUndertowGame: () => void;
  onOpenSkillTree?: () => void;
}

export const DistrictView: React.FC<Props> = ({
  gameState,
  setGameState,
  onUndock,
  onOpenDialogue,
  onOpenWardrobe,
  onOpenUndertowGame,
  onOpenSkillTree,
}) => {
  const districtId = gameState.currentDistrict || 'lantern_bazaar';
  const district = DISTRICTS[districtId];
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'trader' | 'altar'>('overview');
  const [showArtPreview, setShowArtPreview] = useState(false);

  const unlockedSkills = gameState.unlockedSkills || [];
  const hasContractBroker = unlockedSkills.includes('contract_broker');
  const hasTraderDiscount = unlockedSkills.includes('trader_bargaining');
  const hasAutoRepair = unlockedSkills.includes('hull_capacity_2');

  // Filter NPCs in this district
  const districtNPCs = district.npcs.map(id => NPCS[id]).filter(Boolean);

  // Filter available contracts
  const localContracts = CONTRACT_POOL.filter(c => c.origin === districtId);

  // Accept a contract
  const handleAcceptContract = (contract: typeof CONTRACT_POOL[0]) => {
    sound.playBrassClink();
    setGameState(prev => ({
      ...prev,
      activeContract: contract,
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Accepted Contract: ${contract.title} -> Deliver to ${DISTRICTS[contract.destination].name}`,
          time: 'Just now',
          type: 'story'
        },
        ...prev.logMessages
      ]
    }));
  };

  // Complete an active delivery if we are at destination
  const handleDeliverContract = () => {
    if (!gameState.activeContract || gameState.activeContract.destination !== districtId) return;
    
    const reward = gameState.activeContract;
    const finalDroplets = Math.round(reward.rewardDroplets * (hasContractBroker ? 1.3 : 1.0));
    const finalFavors = reward.rewardFavors + (hasContractBroker ? 1 : 0);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    sound.playTempleGong();
    
    setGameState(prev => ({
      ...prev,
      droplets: prev.droplets + finalDroplets,
      favors: prev.favors + finalFavors,
      activeContract: null,
      logMessages: [
        {
          id: Date.now().toString(),
          text: `Contract Completed: ${reward.title} (+${finalDroplets} Droplets, +${finalFavors} Favors)${hasContractBroker ? ' [Guild Broker Bonus!]' : ''}`,
          time: 'Just now',
          type: 'reward'
        },
        ...prev.logMessages
      ]
    }));
  };

  // Trader purchase item with 25% discount if trader_bargaining unlocked
  const handleBuyItem = (itemType: 'storm_jar' | 'hull_repair' | 'koi_treat', baseCost: number) => {
    const cost = hasTraderDiscount ? Math.round(baseCost * 0.75) : baseCost;

    if (gameState.droplets < cost) {
      sound.playMoonChime(300);
      setGameState(prev => ({
        ...prev,
        logMessages: [
          {
            id: Date.now().toString(),
            text: `Insufficient Moon-Droplets! Required: ${cost} Droplets.`,
            time: 'Just now',
            type: 'danger'
          },
          ...prev.logMessages
        ]
      }));
      return;
    }
    sound.playBrassClink();
    setGameState(prev => {
      let stats = { ...prev.stats };
      let jars = prev.stormJars;
      if (itemType === 'storm_jar') jars += 1;
      if (itemType === 'hull_repair') stats.hullIntegrity = Math.min(stats.maxHull, stats.hullIntegrity + 35);
      if (itemType === 'koi_treat') stats.koiAffinity = Math.min(100, stats.koiAffinity + 15);

      return {
        ...prev,
        droplets: prev.droplets - cost,
        stormJars: jars,
        stats,
        logMessages: [
          {
            id: Date.now().toString(),
            text: `Purchased: ${itemType.replace('_', ' ')} (-${cost} Droplets)${hasTraderDiscount ? ' [25% Market Discount]' : ''}`,
            time: 'Just now',
            type: 'info'
          },
          ...prev.logMessages
        ]
      };
    });
  };

  return (
    <div className={`relative w-full h-full min-h-[600px] flex flex-col bg-gradient-to-b ${district.bgGradient} p-4 md:p-8 overflow-y-auto`}>
      {/* District Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 font-semibold mb-1">
            <Anchor className="w-3.5 h-3.5" />
            Docked Platform • Skybound Archipelago
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-fantasy tracking-wide">
            {district.name}
          </h1>
          <p className="text-sm text-amber-400/90 font-serif italic mt-0.5">
            "{district.epithet}"
          </p>
        </div>

        {/* Launch back to Skyways button */}
        <div className="flex items-center gap-3">
          {gameState.activeContract && gameState.activeContract.destination === districtId && (
            <button
              id="btn-complete-delivery"
              onClick={handleDeliverContract}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-transform active:scale-95 animate-pulse"
            >
              <CheckCircle2 className="w-5 h-5" />
              Deliver Cargo & Claim Reward!
            </button>
          )}

          <button
            id="btn-undock-sky"
            onClick={onUndock}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Wind className="w-4 h-4" />
            Launch Skiff into Skyways
          </button>
        </div>
      </div>

      {/* Atmospheric Visual Direction Banner with Concept Art */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {district.image && (
          <div 
            onClick={() => setShowArtPreview(true)}
            className="relative w-full lg:w-48 h-28 rounded-xl overflow-hidden border border-sky-500/40 shadow-md group cursor-pointer shrink-0"
          >
            <img
              src={district.image}
              alt={district.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 text-sky-300 font-semibold flex items-center gap-1 border border-sky-500/30">
                <Eye className="w-3 h-3 text-sky-400" />
                Concept Art
              </span>
            </div>
          </div>
        )}

        <div className="text-sm text-slate-300 flex-1 leading-relaxed">
          <span className="text-sky-300 font-semibold">Scene: </span>
          {district.description}
          <div className="text-xs text-slate-400 mt-1 italic">
            "{district.visualDirection}"
          </div>
        </div>

        {/* Quick District Actions */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <button
            id="btn-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Inhabitants & Lore
          </button>
          <button
            id="btn-tab-contracts"
            onClick={() => setActiveTab('contracts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'contracts' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Courier Board
          </button>
          <button
            id="btn-tab-trader"
            onClick={() => setActiveTab('trader')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'trader' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Market & Forge
          </button>
          {onOpenSkillTree && (
            <button
              id="btn-district-attunement-altar"
              onClick={onOpenSkillTree}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all bg-gradient-to-r from-amber-500/20 to-sky-500/20 text-amber-300 border border-amber-500/40 hover:from-amber-500/30 hover:to-sky-500/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Attunement Altar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mt-6 flex-1">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NPCs Column */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                Notable Inhabitants & Contacts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {districtNPCs.map(npc => (
                  <div
                    key={npc.id}
                    className={`p-5 rounded-2xl bg-slate-900/80 border transition-all shadow-md group flex flex-col justify-between ${
                      npc.portraitImage ? 'border-sky-500/40 hover:border-sky-400 shadow-sky-950/40' : 'border-slate-800 hover:border-sky-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3.5">
                        {npc.portraitImage ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-sky-400/60 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                            <img
                              src={npc.portraitImage}
                              alt={npc.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                            {npc.id.includes('lin') ? '👘' : npc.id.includes('jax') ? '⚓' : npc.id.includes('hane') ? '🕯️' : npc.id.includes('corvo') ? '⚙️' : '✨'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-100 font-fantasy">{npc.name}</h3>
                            {npc.portraitImage && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                                Key Agent
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-sky-400 font-medium">{npc.title}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 mt-3.5 italic line-clamp-3 leading-relaxed font-lore">
                        "{npc.greeting}"
                      </p>
                    </div>

                    <button
                      id={`btn-talk-${npc.id}`}
                      onClick={() => onOpenDialogue(npc.id)}
                      className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Converse & Inquire
                    </button>
                  </div>
                ))}
              </div>

              {/* Special Undertow Den Tavern Dice Game Banner */}
              {districtId === 'undertow_den' && (
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Dices className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-300 font-fantasy">The Smuggler's Moon-Dice Table</h3>
                      <p className="text-xs text-slate-300 mt-0.5">Wager moon-luminescence droplets against Undertow brokers for brass favors and rare contraband.</p>
                    </div>
                  </div>
                  <button
                    id="btn-open-dice-game"
                    onClick={onOpenUndertowGame}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 whitespace-nowrap"
                  >
                    Sit at Dice Table
                  </button>
                </div>
              )}
            </div>

            {/* District Lore & Design Takeaway Column */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                Architectural Record
              </h2>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Concept Blueprint</span>
                  <p className="font-lore text-sm text-slate-200">{district.designTakeaway}</p>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Active Rig Recommendation</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-200">Current Rig:</span>
                    <span className="font-bold text-sky-400 capitalize">{gameState.activeRig.replace('_', ' ')}</span>
                  </div>
                  <button
                    id="btn-open-wardrobe-district"
                    onClick={onOpenWardrobe}
                    className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    Open Wardrobe & Gear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courier Contracts Board Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 font-fantasy">Available Dispatch Orders</h2>
                <p className="text-xs text-slate-400">Carry sealed brass tubes and crates across the sky currents to earn Droplets and Favors.</p>
              </div>
              {gameState.activeContract && (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  Active Dispatch: {gameState.activeContract.title} ({DISTRICTS[gameState.activeContract.destination].name})
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localContracts.map(contract => {
                const dest = DISTRICTS[contract.destination];
                const isCurrent = gameState.activeContract?.id === contract.id;

                return (
                  <div
                    key={contract.id}
                    className={`p-5 rounded-2xl bg-slate-900/80 border transition-all flex flex-col justify-between ${
                      isCurrent ? 'border-amber-500 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            contract.urgency === 'Perilous' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                            contract.urgency === 'Urgent' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          }`}>
                            {contract.urgency} Urgency
                          </span>
                          <h3 className="font-bold text-slate-100 font-fantasy mt-2 text-base">{contract.title}</h3>
                          <p className="text-xs text-slate-400">Client: {contract.client}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-sky-400">+{contract.rewardDroplets} Droplets</div>
                          <div className="text-xs font-bold text-amber-400">+{contract.rewardFavors} Favors</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 font-serif italic leading-relaxed">
                        "{contract.flavorText}"
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>Cargo: <strong className="text-slate-200">{contract.cargo}</strong></span>
                        <span>Dest: <strong className="text-sky-300">{dest.name}</strong></span>
                      </div>
                    </div>

                    <button
                      id={`btn-accept-contract-${contract.id}`}
                      disabled={isCurrent}
                      onClick={() => handleAcceptContract(contract)}
                      className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        isCurrent 
                          ? 'bg-amber-500 text-slate-950 cursor-default'
                          : 'bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200'
                      }`}
                    >
                      <Scroll className="w-3.5 h-3.5" />
                      {isCurrent ? 'Current Active Delivery' : 'Accept Dispatch Contract'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Market & Forge Tab */}
        {activeTab === 'trader' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-fantasy">Skyway Outfitter & Provisions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Storm Jar */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 font-fantasy">Weather Storm Jar</h3>
                  <p className="text-xs text-slate-400 mt-1">Condensed blue lightning used for anchor rites and power surges.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">40 Droplets</span>
                  <button
                    id="btn-buy-storm-jar"
                    onClick={() => handleBuyItem('storm_jar', 40)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                  >
                    Purchase
                  </button>
                </div>
              </div>

              {/* Hull Repair */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 font-fantasy">Black-Lacquer Hull Repair</h3>
                  <p className="text-xs text-slate-400 mt-1">Re-seal skiff planks against cloud moisture and lightning damage (+35 Hull).</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">30 Droplets</span>
                  <button
                    id="btn-buy-hull-repair"
                    onClick={() => handleBuyItem('hull_repair', 30)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                  >
                    Repair Skiff
                  </button>
                </div>
              </div>

              {/* Moon-Koi Nourishment */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-100 font-fantasy">Luminescent Algae Feed</h3>
                  <p className="text-xs text-slate-400 mt-1">Deep-cloud nutrients for Nami (+15 Koi Affinity, reveals more currents).</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">25 Droplets</span>
                  <button
                    id="btn-buy-koi-feed"
                    onClick={() => handleBuyItem('koi_treat', 25)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                  >
                    Feed Nami
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-resolution Concept Art Lightbox Overlay */}
      {showArtPreview && district.image && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setShowArtPreview(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 border border-sky-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={district.image}
                alt={district.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[65vh]"
              />
              <button
                id="btn-close-district-art"
                onClick={() => setShowArtPreview(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-fantasy">{district.name}</h3>
                  <p className="text-xs text-sky-400 font-semibold italic">"{district.epithet}"</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase">
                  District Concept Art
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-lore">
                {district.description}
              </p>
              <p className="text-xs text-amber-300 italic pt-1">
                Visual Direction: {district.visualDirection}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
