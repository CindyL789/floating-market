import React, { useState } from 'react';
import { GameState } from '../types';
import { sound } from '../utils/audio';
import { Dices, X, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

export const UndertowGameModal: React.FC<Props> = ({ gameState, setGameState, onClose }) => {
  const [wager, setWager] = useState<number>(20);
  const [playerDice, setPlayerDice] = useState<number[]>([3, 5, 6]);
  const [brokerDice, setBrokerDice] = useState<number[]>([2, 4, 5]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const rollDice = () => {
    if (gameState.droplets < wager) {
      alert('Not enough Moon-Luminescence Droplets to place wager!');
      return;
    }

    setIsRolling(true);
    setGameResult(null);
    sound.playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      setPlayerDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      setBrokerDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 80);
  };

  const finalizeRoll = () => {
    const pD = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    const bD = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];

    setPlayerDice(pD);
    setBrokerDice(bD);
    setIsRolling(false);

    const pSum = pD.reduce((a, b) => a + b, 0);
    const bSum = bD.reduce((a, b) => a + b, 0);

    // Undertow Civilian rig charisma bonus
    const hasCharisma = gameState.activeRig === 'undertow_civilian';

    if (pSum > bSum || (pSum === bSum && hasCharisma)) {
      const winnings = Math.round(wager * (hasCharisma ? 1.8 : 1.5));
      confetti({ particleCount: 40, spread: 50 });
      sound.playMoonChime(700);
      setGameResult(`Victory! You rolled ${pSum} vs Broker's ${bSum}. Won ${winnings} Droplets & +1 Favor!`);
      setGameState(prev => ({
        ...prev,
        droplets: prev.droplets + winnings,
        favors: prev.favors + 1,
        logMessages: [
          {
            id: Date.now().toString(),
            text: `Won Undertow Moon-Dice (+${winnings} Droplets, +1 Favor)`,
            time: 'Just now',
            type: 'reward'
          },
          ...prev.logMessages
        ]
      }));
    } else if (pSum < bSum) {
      sound.playThunderRumble();
      setGameResult(`Defeat! You rolled ${pSum} vs Broker's ${bSum}. Lost ${wager} Droplets.`);
      setGameState(prev => ({
        ...prev,
        droplets: Math.max(0, prev.droplets - wager),
        logMessages: [
          {
            id: Date.now().toString(),
            text: `Lost Moon-Dice Wager (-${wager} Droplets)`,
            time: 'Just now',
            type: 'hazard'
          },
          ...prev.logMessages
        ]
      }));
    } else {
      setGameResult(`Push! Both rolled ${pSum}. Wager returned.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Dices className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-fantasy">The Smuggler's Moon-Dice Table</h2>
              <p className="text-xs text-amber-400">Undertow Den • High-Stakes Favor Wagers</p>
            </div>
          </div>
          <button
            id="btn-close-dice-game"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dice Arena */}
        <div className="py-6 grid grid-cols-2 gap-6 text-center">
          {/* Player Dice */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-sky-500/30">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-2">
              Sera's Talisman Dice
            </span>
            <div className="flex justify-center gap-2 text-2xl font-extrabold text-sky-300">
              {playerDice.map((d, i) => (
                <div key={i} className="w-11 h-11 bg-slate-900 border border-sky-400/50 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20">
                  {d}
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-400 mt-2 font-semibold">
              Sum: {playerDice.reduce((a, b) => a + b, 0)}
            </div>
          </div>

          {/* Broker Dice */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Undertow Broker
            </span>
            <div className="flex justify-center gap-2 text-2xl font-extrabold text-amber-300">
              {brokerDice.map((d, i) => (
                <div key={i} className="w-11 h-11 bg-slate-900 border border-amber-400/50 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
                  {d}
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-400 mt-2 font-semibold">
              Sum: {brokerDice.reduce((a, b) => a + b, 0)}
            </div>
          </div>
        </div>

        {/* Game Result Banner */}
        {gameResult && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs md:text-sm font-semibold text-slate-200">
            {gameResult}
          </div>
        )}

        {/* Wager Controls */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Select Wager (Droplets):</span>
            <div className="flex gap-2">
              {[10, 20, 50, 100].map(amt => (
                <button
                  key={amt}
                  id={`btn-wager-${amt}`}
                  onClick={() => setWager(amt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    wager === amt ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-roll-dice"
            disabled={isRolling}
            onClick={rollDice}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            {isRolling ? 'Rolling Dice...' : `Cast Talisman Dice (${wager} Droplets)`}
          </button>
        </div>
      </div>
    </div>
  );
};
