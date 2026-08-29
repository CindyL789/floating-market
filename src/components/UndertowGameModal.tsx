import React, { useState } from 'react';
import { GameState } from '../types';
import { X, Dices, Award, Sparkles } from 'lucide-react';

interface UndertowGameModalProps {
  gameState: GameState;
  onPlayDice: (wager: number) => { playerDice: number[]; brokerDice: number[]; message: string };
  onClose: () => void;
}

export const UndertowGameModal: React.FC<UndertowGameModalProps> = ({
  gameState,
  onPlayDice,
  onClose
}) => {
  const [wager, setWager] = useState(20);
  const [playerRoll, setPlayerRoll] = useState<number[]>([]);
  const [brokerRoll, setBrokerRoll] = useState<number[]>([]);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const handleRoll = () => {
    const res = onPlayDice(wager);
    setPlayerRoll(res.playerDice);
    setBrokerRoll(res.brokerDice);
    setResultMsg(res.message);
  };

  const hasCharisma = gameState.activeRig === 'undertow_civilian';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-sky-950 border border-lantern-amber/50 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-lantern-amber flex items-center gap-2">
              <Dices size={20} />
              UNDERTOW MOON-DICE
            </h3>
            <p className="text-xs text-slate-400">Whisperer Kael's Clandestine Table</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-slate-300">
            <X size={18} />
          </button>
        </div>

        {hasCharisma && (
          <div className="p-2.5 rounded-lg bg-lantern-amber/15 border border-lantern-amber/30 text-lantern-amber text-xs font-mono">
            ✨ Undertow Civilian Rig: +30% Dice Payouts & Wins Ties!
          </div>
        )}

        {/* Dice Arena */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/60 space-y-3">
            <p className="font-bold text-sm text-moon-cyan">{gameState.character.name}</p>
            <div className="flex justify-center space-x-2">
              {playerRoll.length === 0 ? (
                <>
                  <div className="w-9 h-9 rounded-lg bg-sky-950 border border-moon-cyan/40 flex items-center justify-center font-mono font-bold text-moon-cyan text-sm">?</div>
                  <div className="w-9 h-9 rounded-lg bg-sky-950 border border-moon-cyan/40 flex items-center justify-center font-mono font-bold text-moon-cyan text-sm">?</div>
                  <div className="w-9 h-9 rounded-lg bg-sky-950 border border-moon-cyan/40 flex items-center justify-center font-mono font-bold text-moon-cyan text-sm">?</div>
                </>
              ) : (
                playerRoll.map((d, i) => (
                  <div key={i} className="w-9 h-9 rounded-lg bg-sky-950 border-2 border-moon-cyan flex items-center justify-center font-mono font-bold text-moon-cyan text-base">
                    {d}
                  </div>
                ))
              )}
            </div>
            <p className="text-xs font-mono text-slate-400">
              Total: {playerRoll.length > 0 ? playerRoll.reduce((a, b) => a + b, 0) : '—'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sky-900/40 border border-sky-800/60 space-y-3">
            <p className="font-bold text-sm text-lantern-amber">Whisperer Kael</p>
            <div className="flex justify-center space-x-2">
              {brokerRoll.length === 0 ? (
                <>
                  <div className="w-9 h-9 rounded-lg bg-sky-950 border border-lantern-amber/40 flex items-center justify-center font-mono font-bold text-lantern-amber text-sm">?</div>
                  <div className="w-9 h-9 rounded-lg bg-sky-950 border border-lantern-amber/40 flex items-center justify-center font-mono font-bold text-lantern-amber text-sm">?</div>
                  <div className="w-9 h-9 rounded-lg bg-sky-950 border border-lantern-amber/40 flex items-center justify-center font-mono font-bold text-lantern-amber text-sm">?</div>
                </>
              ) : (
                brokerRoll.map((d, i) => (
                  <div key={i} className="w-9 h-9 rounded-lg bg-sky-950 border-2 border-lantern-amber flex items-center justify-center font-mono font-bold text-lantern-amber text-base">
                    {d}
                  </div>
                ))
              )}
            </div>
            <p className="text-xs font-mono text-slate-400">
              Total: {brokerRoll.length > 0 ? brokerRoll.reduce((a, b) => a + b, 0) : '—'}
            </p>
          </div>
        </div>

        {/* Message */}
        {resultMsg && (
          <div className={`p-3 rounded-xl text-center font-mono text-xs font-bold ${resultMsg.startsWith('Victory') ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border border-rose-500 text-rose-300'}`}>
            {resultMsg}
          </div>
        )}

        {/* Wager control */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono text-slate-400 uppercase text-center">Wager Amount</p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setWager(Math.max(10, wager - 10))}
              className="px-3 py-1 bg-sky-900 hover:bg-sky-800 rounded-lg text-xs font-bold text-slate-200"
            >
              -10
            </button>
            <span className="font-mono text-lg font-bold text-lantern-amber">{wager} ✨</span>
            <button
              onClick={() => setWager(Math.min(gameState.droplets, wager + 10))}
              className="px-3 py-1 bg-sky-900 hover:bg-sky-800 rounded-lg text-xs font-bold text-slate-200"
            >
              +10
            </button>
          </div>
        </div>

        <button
          onClick={handleRoll}
          disabled={gameState.droplets < wager}
          className="w-full py-3 rounded-xl bg-lantern-amber hover:bg-amber-300 text-sky-950 font-bold font-mono text-sm transition-all transform hover:scale-102 shadow-lg shadow-lantern-amber/20 disabled:opacity-50"
        >
          ROLL BONE DICE
        </button>
      </div>
    </div>
  );
};
