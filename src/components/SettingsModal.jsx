import React, { useState } from 'react';
import { X, Volume2, VolumeX, Monitor, Shield, Trash2, Check, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  initialLives,
  maxUnlockedLevel,
  onUpdateSettings,
  onUpdateLives,
  onResetData
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ soundVolume: val });
  };

  const handleMuteToggle = () => {
    sound.playSelect();
    const newMuted = !settings.soundMuted;
    onUpdateSettings({ soundMuted: newMuted });
  };

  const handleScanlineToggle = () => {
    sound.playSelect();
    onUpdateSettings({ crtScanlines: !settings.crtScanlines });
  };

  const handleShakeToggle = () => {
    sound.playSelect();
    onUpdateSettings({ screenShake: !settings.screenShake });
  };

  const handleBloodToggle = () => {
    sound.playSelect();
    onUpdateSettings({ bloodEffects: !settings.bloodEffects });
  };

  const handleLivesChange = (num) => {
    sound.playSelect();
    onUpdateLives(num);
  };

  const handleReset = () => {
    sound.playGameOver();
    onResetData();
    setConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-crt-card border-2 border-crt-border rounded p-4 shadow-pixel text-left relative flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-crt-border pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-toxic" />
            <span className="text-xs font-bold neon-blood">CONFIGURACIÓN</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-zinc-900 border border-zinc-700 hover:border-blood text-zinc-400 hover:text-white rounded"
          >
            <X size={14} />
          </button>
        </div>

        {/* Audio Section */}
        <div className="mb-4">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">
            AUDIO RETRO
          </span>

          <div className="bg-black/40 border border-crt-border p-2.5 rounded space-y-2.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-zinc-300">ESTADO DE SONIDO:</span>
              <button
                onClick={handleMuteToggle}
                className={`px-2 py-1 border rounded text-[9px] flex items-center gap-1 ${
                  settings.soundMuted
                    ? 'border-blood text-blood bg-blood-darkest'
                    : 'border-toxic text-toxic bg-toxic-dark/30'
                }`}
              >
                {settings.soundMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                <span>{settings.soundMuted ? 'SILENCIADO' : 'ACTIVO'}</span>
              </button>
            </div>

            <div>
              <div className="flex justify-between text-[9px] text-zinc-400 mb-1">
                <span>VOLUMEN MASTER:</span>
                <span className="text-toxic font-bold">{Math.round((settings.soundVolume ?? 0.8) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume ?? 0.8}
                onChange={handleVolumeChange}
                disabled={settings.soundMuted}
                className="w-full accent-toxic cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Gameplay Section */}
        <div className="mb-4">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">
            VIDAS INICIALES ({initialLives})
          </span>
          <div className="flex gap-2">
            {[1, 3, 5, 7].map((num) => (
              <button
                key={num}
                onClick={() => handleLivesChange(num)}
                className={`flex-1 py-1.5 border text-[10px] font-bold rounded ${
                  initialLives === num
                    ? 'bg-blood border-blood-light text-white shadow-pixel-blood'
                    : 'bg-black/50 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {num} {num === 1 ? 'VIDA' : 'VIDAS'}
              </button>
            ))}
          </div>
        </div>

        {/* Video & Effects Section */}
        <div className="mb-4">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">
            EFECTOS VISUALES
          </span>
          <div className="space-y-2 bg-black/40 border border-crt-border p-2.5 rounded text-[10px]">
            {/* Scanlines */}
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">LÍNEAS CRT SCANLINES:</span>
              <button
                onClick={handleScanlineToggle}
                className={`px-2 py-0.5 border text-[8px] font-bold rounded ${
                  settings.crtScanlines
                    ? 'bg-toxic-dark border-toxic text-toxic'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                }`}
              >
                {settings.crtScanlines ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Screen Shake */}
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">SACUDIDA DE PANTALLA:</span>
              <button
                onClick={handleShakeToggle}
                className={`px-2 py-0.5 border text-[8px] font-bold rounded ${
                  settings.screenShake
                    ? 'bg-toxic-dark border-toxic text-toxic'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                }`}
              >
                {settings.screenShake ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Blood Effects */}
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">EFECTOS DE SANGRE:</span>
              <button
                onClick={handleBloodToggle}
                className={`px-2 py-0.5 border text-[8px] font-bold rounded ${
                  settings.bloodEffects
                    ? 'bg-blood-darkest border-blood text-blood'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                }`}
              >
                {settings.bloodEffects ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress & Factory Reset */}
        <div className="border-t border-crt-border pt-3">
          <div className="text-[8px] text-zinc-400 mb-2">
            NIVEL DESBLOQUEADO: <span className="text-arcade-yellow font-bold">{maxUnlockedLevel}/10</span>
          </div>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2 bg-zinc-900 border border-zinc-700 hover:border-blood text-zinc-400 hover:text-blood text-[9px] font-bold rounded flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={12} />
              <span>REINICIAR DATOS DE PARTIDA</span>
            </button>
          ) : (
            <div className="space-y-1.5 bg-blood-darkest/90 border border-blood p-2 rounded text-center">
              <span className="text-[8px] text-white block font-bold">
                ¿CONFIRMAR REINICIO TOTAL?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-1 bg-blood hover:bg-blood-light text-white text-[8px] font-bold rounded"
                >
                  SÍ, REINICIAR
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1 bg-zinc-800 text-zinc-300 text-[8px] font-bold rounded"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
