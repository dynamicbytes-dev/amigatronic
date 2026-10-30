import React from 'react';
import { Skull, Play, Grid, Trophy, Volume2, VolumeX, Flame, Settings } from 'lucide-react';
import { sound } from '../utils/audio';

export default function MainMenu({ 
  onStartGame, 
  onSelectLevel, 
  onOpenHighScores,
  onOpenSettings,
  muted, 
  onToggleMute, 
  highScore 
}) {
  const handleStart = () => {
    sound.playStart();
    onStartGame();
  };

  const handleLevels = () => {
    sound.playSelect();
    onSelectLevel();
  };

  const handleHighScores = () => {
    sound.playSelect();
    if (onOpenHighScores) {
      onOpenHighScores();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full h-[100dvh] max-h-[100dvh] w-full max-w-md mx-auto p-5 pb-[max(1.75rem,env(safe-area-inset-bottom,1.75rem))] text-center select-none overflow-hidden">
      {/* Top Header / System Status & Quick Actions */}
      <div className="w-full flex justify-between items-center text-[9px] tracking-widest text-zinc-400 border-b border-crt-border pb-2.5">
        <div className="flex items-center gap-1.5 text-toxic">
          <span className="w-2 h-2 bg-toxic animate-ping inline-block rounded-full"></span>
          <span>AMIGATRONIC CORE: ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSettings}
            className="p-2 bg-crt-card border border-crt-border hover:border-toxic text-zinc-300 hover:text-white rounded active:scale-95 transition-all"
            title="Configuración"
            aria-label="Configuración"
          >
            <Settings size={15} className="text-arcade-cyan" />
          </button>
          <button 
            onClick={onToggleMute}
            className="p-2 bg-crt-card border border-crt-border hover:border-toxic text-zinc-300 hover:text-white rounded active:scale-95 transition-all"
            title={muted ? "Activar Sonido" : "Silenciar"}
            aria-label="Silenciar sonido"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-toxic" />}
          </button>
        </div>
      </div>

      {/* Main Arcade Title: NIGHTMARE MAZE */}
      <div className="my-auto flex flex-col items-center w-full px-2">
        {/* Animatronic Skull with Fire Aura */}
        <div className="relative mb-5">
          <div className="w-20 h-20 bg-blood-darkest border-2 border-blood rounded-lg flex items-center justify-center mx-auto shadow-glow-red animate-float">
            <Skull className="text-blood w-12 h-12 drop-shadow-[0_0_10px_#ff003c]" />
          </div>
          <Flame className="absolute -top-3 -right-3 text-arcade-orange animate-bounce w-7 h-7" />
          <Flame className="absolute -bottom-2 -left-3 text-arcade-yellow animate-pulse w-6 h-6" />
        </div>

        {/* Título Principal Llamativo */}
        <div className="relative mb-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight neon-blood uppercase leading-none">
            NIGHTMARE
          </h1>
          <h2 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase drop-shadow-[0_2px_4px_#000] mt-1">
            MAZE
          </h2>
        </div>

        <p className="text-[8px] text-zinc-400 tracking-widest uppercase mb-4">
          ★ HORROR ARCADE RUNNER // PROTOCOLO 1988 ★
        </p>

        {/* High Score Badge */}
        <div className="inline-block bg-black/70 border border-blood-dark px-4 py-2 rounded mb-5 shadow-pixel">
          <span className="text-[8px] text-zinc-500 block mb-0.5 tracking-wider">MÁXIMO RÉCORD REGISTRADO</span>
          <span className="text-sm font-bold text-arcade-yellow tracking-widest">
            {highScore.toString().padStart(6, '0')} PTS
          </span>
        </div>

        <div className="text-[9px] text-toxic animate-pulse-fast tracking-widest">
          ▼ PULSA JUGAR O TOCA LA PANTALLA ▼
        </div>
      </div>

      {/* Action Buttons: JUGAR, SELECCIONAR NIVEL, PUNTAJES RÉCORD */}
      <div className="w-full space-y-3 mb-2">
        {/* Botón 1: JUGAR */}
        <button
          onClick={handleStart}
          className="pixel-btn pixel-btn-blood w-full flex items-center justify-center gap-2 py-4 text-xs font-bold"
        >
          <Play size={16} fill="currentColor" />
          <span>JUGAR</span>
        </button>

        {/* Botón 2: SELECCIONAR NIVEL */}
        <button
          onClick={handleLevels}
          className="pixel-btn pixel-btn-dark w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-zinc-200 hover:text-white"
        >
          <Grid size={15} />
          <span>SELECCIONAR NIVEL</span>
        </button>

        {/* Botón 3: PUNTAJES RÉCORD */}
        <button
          onClick={handleHighScores}
          className="pixel-btn pixel-btn-dark w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-arcade-yellow border-zinc-700 hover:border-arcade-yellow"
        >
          <Trophy size={15} />
          <span>PUNTAJES RÉCORD</span>
        </button>
      </div>

      {/* Mobile Footer */}
      <div className="text-[7px] text-zinc-600 tracking-wider">
        AMIGATRONIC ENGINE v2.0 • OPTIMIZADO PARA PANTALLAS TÁCTILES
      </div>
    </div>
  );
}
