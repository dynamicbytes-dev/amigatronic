import React from 'react';
import { ChevronLeft, Lock, Play, Star, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

const ALL_LEVELS = [
  { id: 1, name: "Cripta Subterránea", subtitle: "Infección Fase 1", difficulty: "FÁCIL", difficultyColor: "text-toxic" },
  { id: 2, name: "Alcantarillas Tóxicas", subtitle: "Fuga de Químicos", difficulty: "NORMAL", difficultyColor: "text-arcade-yellow" },
  { id: 3, name: "Laboratorio Sangriento", subtitle: "Sujetos Mutantes", difficulty: "DIFÍCIL", difficultyColor: "text-blood" },
  { id: 4, name: "Hospital Abandonado", subtitle: "Pasillos Malditos", difficulty: "DIFÍCIL", difficultyColor: "text-blood" },
  { id: 5, name: "Estación Fantasma", subtitle: "Rieles Sin Retorno", difficulty: "PESADILLA", difficultyColor: "text-arcade-purple" },
  { id: 6, name: "Zona de Cuarentena", subtitle: "Refugio Subterráneo", difficulty: "PESADILLA", difficultyColor: "text-arcade-purple" },
  { id: 7, name: "Fábrica Maldita", subtitle: "Engranajes de Carne", difficulty: "INFERNAL", difficultyColor: "text-blood-light" },
  { id: 8, name: "Cementerio Cibernético", subtitle: "Almas Digitales", difficulty: "INFERNAL", difficultyColor: "text-blood-light" },
  { id: 9, name: "Torre del Abismo", subtitle: "Tormento Ascendente", difficulty: "CAOS", difficultyColor: "text-arcade-cyan" },
  { id: 10, name: "El Núcleo del Caos", subtitle: "Pesadilla Final", difficulty: "APOCALIPSIS", difficultyColor: "text-blood" },
];

export default function LevelSelect({ maxUnlockedLevel = 1, onSelectLevel, onBack }) {
  const handleLevelClick = (lvl, isUnlocked) => {
    if (!isUnlocked) {
      sound.playBeep(200, 'sawtooth', 0.1);
      return;
    }
    sound.playStart();
    onSelectLevel(lvl);
  };

  const handleBack = () => {
    sound.playSelect();
    onBack();
  };

  return (
    <div className="flex flex-col h-full h-[100dvh] max-h-[100dvh] w-full max-w-md mx-auto p-5 pb-[max(1.75rem,env(safe-area-inset-bottom,1.75rem))] justify-between select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-crt-border pb-3 mb-3">
        <button
          onClick={handleBack}
          className="pixel-btn pixel-btn-dark py-2 px-3 text-[10px] flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          <span>ATRÁS</span>
        </button>
        <div className="text-right">
          <h2 className="text-xs font-bold neon-blood tracking-wider uppercase">
            SECTORES (1-10)
          </h2>
          <span className="text-[8px] text-toxic block">
            DESBLOQUEADOS: {maxUnlockedLevel}/10
          </span>
        </div>
      </div>

      {/* Level List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[62vh]">
        {ALL_LEVELS.map((lvl) => {
          const isUnlocked = lvl.id <= maxUnlockedLevel;

          return (
            <div
              key={lvl.id}
              onClick={() => handleLevelClick(lvl, isUnlocked)}
              className={`p-3 border-2 transition-all relative rounded-sm ${
                isUnlocked
                  ? 'bg-crt-card border-crt-border hover:border-toxic cursor-pointer active:scale-[0.98]'
                  : 'bg-black/40 border-zinc-900 opacity-55 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-arcade-cyan">
                    #{lvl.id.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    {lvl.name}
                  </span>
                </div>
                {isUnlocked ? (
                  <span className={`text-[8px] font-bold ${lvl.difficultyColor}`}>
                    {lvl.difficulty}
                  </span>
                ) : (
                  <Lock size={12} className="text-zinc-600" />
                )}
              </div>

              <p className="text-[8px] text-zinc-400 mb-2">
                {lvl.subtitle}
              </p>

              <div className="flex justify-between items-center text-[8px] text-zinc-500 border-t border-crt-border/60 pt-1.5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={9}
                      className={isUnlocked ? 'text-arcade-yellow fill-arcade-yellow' : 'text-zinc-700'}
                    />
                  ))}
                </div>
                {isUnlocked ? (
                  <div className="flex items-center gap-1 text-toxic font-bold">
                    <Play size={9} fill="currentColor" />
                    <span>JUGAR</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-zinc-600">
                    <AlertTriangle size={9} />
                    <span>BLOQUEADO</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="mt-3 text-center text-[8px] text-zinc-500">
        COMPLETA CADA SECTOR PARA DESBLOQUEAR HASTA EL NIVEL 10
      </div>
    </div>
  );
}
