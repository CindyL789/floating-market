import React, { useState } from 'react';
import { GameState, DistrictId, DeliveryContract } from '../types';
import { DISTRICTS, NPCS, CONTRACT_POOL } from '../data/gameData';
import { PlaneTakeoff, MessageSquare, ShoppingBag, Shield, CheckCircle, Sparkles, Anchor, Award } from 'lucide-react';

interface DistrictViewProps {
  districtId: DistrictId;
  gameState: GameState;
  onUndock: () => void;
  onOpenDialogue: (npcId: string) => void;
  onAcceptContract: (contract: DeliveryContract) => void;
  onDeliverContract: () => void;
  onBuyItem: (itemId: string, cost: number) => void;
  onOpenDiceGame: () => void;
}

export const DistrictView: React.FC<DistrictViewProps> = ({
  districtId,
  gameState,
  onUndock,
  onOpenDialogue,
  onAcceptContract,
  onDeliverContract,
  onBuyItem,
  onOpenDiceGame
}) => {
  const district = DISTRICTS[districtId];
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'trader' | 'shrine'>('overview');

  if (!district) return null;

  const hasTraderDiscount = gameState.unlockedSkills.includes('trader_bargaining');

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col bg-[#070B14] overflow-y-auto">
      {/* District Hero Banner */}
      <div className="relative w-full h-52 sm:h-64 overflow-hidden border-b border-sky-800/40">
        {district.image ? (
          <img src={district.image} alt={district.name} className="w-full h-full object-cover object-center" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-transparent" />

        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">{district.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-lantern-amber/20 text-lantern-amber border border-lantern-amber/40">
                DOCKED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-moon-cyan font-medium">{district.epithet}</p>
          </div>

          <button
            onClick={onUndock}
            className="px-5 py-2.5 rounded-xl bg-moon-cyan hover:bg-sky-200 text-sky-950 font-bold font-mono text-xs flex items-center space-x-2 shadow-lg shadow-moon-cyan/20 transition-all transform hover:scale-105"
          >
            <PlaneTakeoff size={15} />
            <span>LAUNCH SKIFF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-sky-800/40 px-6 flex space-x-6 text-xs font-semibold bg-sky-950/60">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-moon-cyan text-moon-cyan' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Overview & Citizens
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`py-3 border-b-2 transition-colors ${activeTab === 'contracts' ? 'border-moon-cyan text-moon-cyan' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Delivery Contracts {gameState.activeContract?.destination === districtId && '(!)'}
        </button>
        <button
          onClick={() => setActiveTab('trader')}
          className={`py-3 border-b-2 transition-colors ${activeTab === 'trader' ? 'border-moon-cyan text-moon-cyan' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Trading Post
        </button>
        <button
          onClick={() => setActiveTab('shrine')}
          className={`py-3 border-b-2 transition-colors ${activeTab === 'shrine' ? 'border-moon-cyan text-moon-cyan' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Altar & Harbor
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Lore Box */}
            <div className="p-4 rounded-xl bg-sky-900/30 border border-sky-800/40 text-slate-300 text-sm leading-relaxed">
              <p className="text-moon-cyan text-xs font-mono font-bold uppercase mb-1">District Dispatch</p>
              <p>{district.description}</p>
            </div>

            {/* NPCs */}
            <div>
              <h3 className="font-mono text-xs font-bold text-lantern-amber uppercase mb-3">Notable Citizens & Operatives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {district.npcs.map(npcId => {
                  const npc = NPCS[npcId];
                  if (!npc) return null;
                  return (
                    <div key={npcId} className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {npc.portrait ? (
                          <img src={npc.portrait} alt={npc.name} className="w-12 h-12 rounded-full object-cover border-2 border-moon-cyan/60" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-sky-800/80 border border-sky-700 flex items-center justify-center text-2xl">
                            {npc.iconEmoji}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-slate-100">{npc.name}</p>
                          <p className="text-xs text-moon-cyan">{npc.title}</p>
                          <div className="flex items-center space-x-1 mt-1 text-[10px] font-mono text-slate-400">
                            <span>Trust:</span>
                            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400" style={{ width: `${npc.affinity}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenDialogue(npcId)}
                        className="px-3 py-1.5 rounded-lg bg-lantern-amber text-sky-950 font-bold font-mono text-xs hover:bg-amber-300 transition-colors flex items-center space-x-1"
                      >
                        <MessageSquare size={13} />
                        <span>SPEAK</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {/* Active Contract */}
            {gameState.activeContract && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-lantern-amber uppercase">Active Shipment in Transit</span>
                  {gameState.activeContract.destination === districtId && (
                    <button
                      onClick={onDeliverContract}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-sky-950 font-bold font-mono text-xs flex items-center space-x-1.5 shadow-md"
                    >
                      <CheckCircle size={15} />
                      <span>DELIVER CARGO</span>
                    </button>
                  )}
                </div>
                <h4 className="font-bold text-slate-100">{gameState.activeContract.title}</h4>
                <p className="text-xs text-moon-cyan">Destination: {DISTRICTS[gameState.activeContract.destination]?.name}</p>
                <p className="text-xs text-slate-300">Cargo: {gameState.activeContract.cargo}</p>
                <div className="text-xs font-mono text-slate-400 flex space-x-3">
                  <span className="text-moon-cyan">+{gameState.activeContract.rewardDroplets} Droplets</span>
                  <span className="text-lantern-amber">+{gameState.activeContract.rewardFavors} Favors</span>
                </div>
              </div>
            )}

            {/* Available Local Contracts */}
            <h3 className="font-mono text-xs font-bold text-moon-cyan uppercase pt-2">Available Local Contracts</h3>
            <div className="space-y-3">
              {CONTRACT_POOL.filter(c => c.origin === districtId).map(contract => {
                const isCurrent = gameState.activeContract?.id === contract.id;
                return (
                  <div key={contract.id} className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 text-sm">{contract.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-800/60 text-moon-cyan">
                        {contract.urgency.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Client: {contract.client} // Dest: {DISTRICTS[contract.destination]?.name}</p>
                    <p className="text-xs text-slate-300">{contract.flavorText}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs font-mono flex space-x-3">
                        <span className="text-moon-cyan font-bold">+{contract.rewardDroplets} Droplets</span>
                        <span className="text-lantern-amber font-bold">+{contract.rewardFavors} Favors</span>
                      </div>
                      {!isCurrent ? (
                        <button
                          onClick={() => onAcceptContract(contract)}
                          className="px-3 py-1.5 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs transition-colors"
                        >
                          ACCEPT
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-emerald-400 font-bold">ACCEPTED</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'trader' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-sky-900/30 border border-sky-800/40 flex items-center justify-between">
              <div>
                <p className="text-moon-cyan text-xs font-mono font-bold uppercase">District Trading Post</p>
                <p className="text-xs text-slate-300">
                  {hasTraderDiscount ? '✨ Quartermaster Discount (-25% Active)' : 'Standard Market Exchange'}
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-moon-cyan">Your Droplets: {gameState.droplets} ✨</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Item 1: Hull Repair */}
              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-2xl mb-2">🛡️</div>
                  <h4 className="font-bold text-sm text-slate-100">Emergency Hull Repair</h4>
                  <p className="text-xs text-slate-400 mt-1">Restores +35 hull integrity instantly with fresh waterproof resin.</p>
                </div>
                <button
                  onClick={() => onBuyItem('hull_repair', hasTraderDiscount ? 22 : 30)}
                  className="w-full py-2 rounded-lg bg-moon-cyan hover:bg-sky-200 text-sky-950 font-bold font-mono text-xs transition-colors"
                >
                  BUY ({hasTraderDiscount ? 22 : 30} ✨)
                </button>
              </div>

              {/* Item 2: Storm Jar */}
              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-bold text-sm text-slate-100">Charged Storm Jar</h4>
                  <p className="text-xs text-slate-400 mt-1">Sealed ozone sphere with captured blue lightning for mechanics & altars.</p>
                </div>
                <button
                  onClick={() => onBuyItem('storm_jar', hasTraderDiscount ? 33 : 45)}
                  className="w-full py-2 rounded-lg bg-moon-cyan hover:bg-sky-200 text-sky-950 font-bold font-mono text-xs transition-colors"
                >
                  BUY ({hasTraderDiscount ? 33 : 45} ✨)
                </button>
              </div>

              {/* Item 3: Koi Treat */}
              <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-2xl mb-2">🎏</div>
                  <h4 className="font-bold text-sm text-slate-100">Stardust Kelp Wafer</h4>
                  <p className="text-xs text-slate-400 mt-1">Feed to Nami to strengthen harmonic link (+15 Koi Affinity).</p>
                </div>
                <button
                  onClick={() => onBuyItem('koi_treat', hasTraderDiscount ? 18 : 25)}
                  className="w-full py-2 rounded-lg bg-moon-cyan hover:bg-sky-200 text-sky-950 font-bold font-mono text-xs transition-colors"
                >
                  BUY ({hasTraderDiscount ? 18 : 25} ✨)
                </button>
              </div>
            </div>

            {/* Undertow Den Special: Dice Game */}
            {districtId === 'undertow_den' && (
              <div className="p-4 rounded-xl bg-lantern-amber/10 border border-lantern-amber/40 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-lantern-amber">Moon-Koi Dice Arena</h4>
                  <p className="text-xs text-slate-300">Wager Moon-Droplets against Whisperer Kael for Brass Favors!</p>
                </div>
                <button
                  onClick={onOpenDiceGame}
                  className="px-4 py-2 rounded-lg bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-xs transition-colors"
                >
                  PLAY DICE
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shrine' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-sky-900/30 border border-sky-800/40 space-y-3">
              <p className="text-emerald-400 text-xs font-mono font-bold uppercase">Moon-Koi Harbor Communion</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                In the sheltered water basins of this platform, Nami rests in pure starlight condensation. Communing here refreshes your spiritual focus and aligns your flight telemetry.
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-moon-cyan">Current Nami Bond: {gameState.stats.koiAffinity}%</span>
                <button
                  onClick={() => onBuyItem('koi_treat', 0)}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-sky-950 font-bold font-mono text-xs transition-colors"
                >
                  OFFER PRAYER
                </button>
              </div>
            </div>

            {/* Reputation */}
            <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/50 space-y-3">
              <p className="text-lantern-amber text-xs font-mono font-bold uppercase">Archipelago Reputation</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Lantern Guild:</span>
                  <span className="font-mono text-moon-cyan font-bold">{gameState.reputation.lanternGuild}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-moon-cyan" style={{ width: `${gameState.reputation.lanternGuild}%` }} />
                </div>

                <div className="flex justify-between pt-1">
                  <span>Undertow Syndicate:</span>
                  <span className="font-mono text-lantern-amber font-bold">{gameState.reputation.undertowSyndicate}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-lantern-amber" style={{ width: `${gameState.reputation.undertowSyndicate}%` }} />
                </div>

                <div className="flex justify-between pt-1">
                  <span>Anchor Monks:</span>
                  <span className="font-mono text-indigo-400 font-bold">{gameState.reputation.anchorMonks}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${gameState.reputation.anchorMonks}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
