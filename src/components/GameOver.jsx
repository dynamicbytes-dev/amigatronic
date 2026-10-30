import React from 'react';
import { RotateCcw, Grid, Home, Skull, Trophy, AlertTriangle, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

export default function GameOver({ score, highScore, level, onRestart, onSelectLevel, onMainMenu }) {
  const isNewHighScore = score > highScore;

  const handleRestart = () => {
    sound.playStart();
    onRestart();
  };

  const handleLevels = () => {
    sound.playSelect();
    onSelectLevel();
  };

  const handleMenu = () => {
    sound.playSelect();
    onMainMenu();
  };

  return (
    <div className="flex flex-col h-full h-[100dvh] max-h-[100dvh] w-full max-w-md mx-auto p-5 pb-[max(1.75rem,env(safe-area-inset-bottom,1.75rem))] justify-between text-center select-none overflow-hidden">
      {/* Top Warning Banner */}
      <div className="flex items-center justify-center gap-2 text-blood text-[9px] tracking-widest border-b border-blood-dark/80 pb-2.5">
        <AlertTriangle size={14} className="animate-bounce" />
        <span className="uppercase font-bold">SEÑAL VITAL PERDIDA // PROTOCOLO CORRUPTO</span>
        <AlertTriangle size={14} className="animate-bounce" />
      </div>

      {/* Main Spooky Center Area */}
      <div className="my-auto flex flex-col items-center px-2">
        {/* Broken Animatronic Skull with Red Halo */}
        <div className="relative mb-4">
          <div className="w-18 h-18 w-[72px] h-[72px] bg-black border-2 border-blood rounded-full flex items-center justify-center shadow-glow-red animate-pulse">
            <Skull className="text-blood w-11 h-11 drop-shadow-[0_0_12px_#ff003c]" />
          </div>
          <Flame className="absolute -bottom-1 -right-1 text-arcade-orange w-6 h-6 animate-ping" />
        </div>

        {/* Título Tétrico Game Over */}
        <h1 className="text-3xl sm:text-4xl font-black neon-blood tracking-tight mb-2 uppercase">
          GAME OVER
        </h1>
        
        {/* Mensaje Tétrico */}
        <p className="text-[9px] text-zinc-300 max-w-xs mx-auto leading-relaxed uppercase tracking-wider mb-5">
          "TU ALMA HA SIDO ATRAPADA EN EL LABERINTO. LOS CIRCUITOS HAN RECLAMADO TU CARNE."
        </p>

        {/* Card de Puntuación Final */}
        <div className="w-full bg-crt-card border-2 border-blood/70 p-4 rounded-sm shadow-pixel mb-3">
          <span className="text-[8px] text-zinc-400 block mb-1 uppercase tracking-widest">
            PUNTUACIÓN FINAL OBTENIDA
          </span>
          <div className="text-2xl font-black text-arcade-yellow tracking-widest font-mono mb-2">
            {score.toString().padStart(6, '0')} PTS
          </div>

          {isNewHighScore ? (
            <div className="bg-toxic-dark/80 border border-toxic py-1.5 px-3 rounded flex items-center justify-center gap-2 text-[9px] text-toxic font-bold animate-pulse">
              <Trophy size={14} />
              <span>¡NUEVO RÉCORD HISTÓRICO!</span>
            </div>
          ) : (
            <div className="text-[8px] text-zinc-400">
              RÉCORD ACTUAL: <span className="text-white font-bold font-mono">{highScore.toString().padStart(6, '0')} PTS</span>
            </div>
          )}

          <div className="mt-2 text-[8px] text-zinc-500 border-t border-crt-border pt-2 flex justify-between items-center">
            <span>SECTOR DE MUERTE:</span>
            <span className="text-zinc-300 font-bold uppercase">{level?.name || `Sector ${level?.id || 1}`}</span>
          </div>
        </div>
      </div>

      {/* Botones de Acción para Pantalla Táctil */}
      <div className="w-full space-y-2.5">
        {/* Botón Primario: REINTENTAR */}
        <button
          onClick={handleRestart}
          className="pixel-btn pixel-btn-blood w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold"
        >
          <RotateCcw size={15} />
          <span>REINTENTAR SECTOR</span>
        </button>

        {/* Botón Secundario: VOLVER AL MENÚ */}
        <button
          onClick={handleMenu}
          className="pixel-btn pixel-btn-dark w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-zinc-300 hover:text-white"
        >
          <Home size={15} />
          <span>VOLVER AL MENÚ</span>
        </button>

        {/* Botón Terciario: SELECCIONAR NIVEL */}
        <button
          onClick={handleLevels}
          className="pixel-btn pixel-btn-dark w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold text-zinc-400 hover:text-zinc-200"
        >
          <Grid size={13} />
          <span>SELECCIONAR NIVEL</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-[7px] text-zinc-600 mt-2">
        PULSA CUALQUIER BOTÓN PARA RECONECTAR AL SISTEMA
      </div>
    </div>
  );
}
