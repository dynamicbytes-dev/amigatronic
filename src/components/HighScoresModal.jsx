import React from 'react';
import { X, Trophy, Flame, Skull, Medal, Crown } from 'lucide-react';
import { sound } from '../utils/audio';

export default function HighScoresModal({ isOpen, onClose, highScore, stats }) {
  if (!isOpen) return null;

  const gamesPlayed = stats?.gamesPlayed || 0;
  const totalScore = stats?.totalScore || highScore;

  // Tabla simulada arcade encabezada por el récord real guardado en storage
  const leaderboard = [
    { rank: 1, tag: 'T-800', score: Math.max(highScore, 5400), isUser: highScore >= 5400 },
    { rank: 2, tag: 'AMIGA', score: Math.max(highScore, 3200), isUser: highScore < 5400 && highScore >= 3200 },
    { rank: 3, tag: 'NIGHT', score: Math.max(highScore, 1850), isUser: highScore < 3200 && highScore >= 1850 },
    { rank: 4, tag: 'BLOOD', score: 1200, isUser: false },
    { rank: 5, tag: 'GHOST', score: 850, isUser: false },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-crt-card border-2 border-blood rounded p-4 shadow-pixel-blood relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-crt-border pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <Trophy size={16} className="text-arcade-yellow animate-bounce" />
            <span className="text-xs font-bold neon-blood">TABLA DE RÉCORDS</span>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="p-1 bg-zinc-900 border border-zinc-700 hover:border-blood text-zinc-400 hover:text-white rounded active:scale-95"
          >
            <X size={14} />
          </button>
        </div>

        {/* User High Score Highlight Box */}
        <div className="bg-black/60 border-2 border-arcade-yellow/60 p-3 rounded mb-3 text-center shadow-pixel">
          <span className="text-[8px] text-zinc-400 block tracking-wider uppercase mb-1">
            TU MEJOR MARCA HISTÓRICA
          </span>
          <div className="flex items-center justify-center gap-2">
            <Crown size={16} className="text-arcade-yellow" />
            <span className="text-xl font-black text-arcade-yellow tracking-widest">
              {highScore.toString().padStart(6, '0')} PTS
            </span>
          </div>
        </div>

        {/* Arcade Hall of Fame */}
        <div className="mb-3">
          <span className="text-[8px] text-zinc-500 uppercase tracking-widest block mb-1.5">
            TOP 5 GLORIA ARCADE
          </span>
          <div className="space-y-1.5 bg-black/40 border border-crt-border p-2 rounded">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className={`flex justify-between items-center text-[9px] px-2 py-1 rounded ${
                  item.isUser
                    ? 'bg-blood-darkest border border-blood text-white font-bold'
                    : 'text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={item.rank === 1 ? 'text-arcade-yellow font-bold' : 'text-zinc-500'}>
                    #{item.rank}
                  </span>
                  <span className="tracking-widest font-mono">
                    {item.isUser ? 'JUGADOR' : item.tag}
                  </span>
                </div>
                <span className={item.rank === 1 ? 'text-arcade-yellow' : 'text-zinc-300'}>
                  {item.score.toString().padStart(6, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Player Stats */}
        <div className="grid grid-cols-2 gap-2 text-[8px] border-t border-crt-border pt-2.5 mb-3 text-center">
          <div className="bg-zinc-900/60 p-2 border border-zinc-800 rounded">
            <span className="text-zinc-500 block">PARTIDAS JUGADAS</span>
            <span className="text-xs font-bold text-arcade-cyan">{gamesPlayed}</span>
          </div>
          <div className="bg-zinc-900/60 p-2 border border-zinc-800 rounded">
            <span className="text-zinc-500 block">PUNTOS ACUMULADOS</span>
            <span className="text-xs font-bold text-toxic">{totalScore}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playSelect();
            onClose();
          }}
          className="pixel-btn pixel-btn-dark w-full py-2.5 text-[9px] font-bold"
        >
          CERRAR
        </button>
      </div>
    </div>
  );
}
