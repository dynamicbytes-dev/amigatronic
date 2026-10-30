import React, { useState, useEffect, useRef } from 'react';
import { Heart, Pause, Play, RefreshCw, Skull, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

export default function GameScreen({ 
  level, 
  initialLives = 3, 
  onGameOver, 
  onLevelComplete, 
  onQuitToMenu 
}) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [isPaused, setIsPaused] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  // References for internal loop state
  const gameStateRef = useRef({
    player: { x: 140, y: 160, vx: 0, vy: 0, width: 16, height: 22, grounded: false },
    hazards: [],
    coins: [],
    keys: { left: false, right: false, action: false },
    score: 0,
    lives: initialLives,
    isOver: false
  });

  // Handle Pause
  const togglePause = () => {
    sound.playSelect();
    setIsPaused((prev) => !prev);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.key === 'a') gameStateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd') gameStateRef.current.keys.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        gameStateRef.current.keys.action = true;
        handleJump();
      }
      if (e.key === 'p' || e.key === 'Escape') togglePause();
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.key === 'a') gameStateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd') gameStateRef.current.keys.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        gameStateRef.current.keys.action = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleJump = () => {
    const p = gameStateRef.current.player;
    if (p.grounded && !isPaused) {
      p.vy = -7.5;
      p.grounded = false;
      sound.playBeep(480, 'square', 0.08);
    }
  };

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let frame = 0;

    const gravity = 0.35;
    const floorY = canvas.height - 24;

    const loop = () => {
      if (!isPaused && !gameStateRef.current.isOver) {
        frame++;
        const state = gameStateRef.current;
        const p = state.player;

        // Player movement
        if (state.keys.left) p.vx = -3.2;
        else if (state.keys.right) p.vx = 3.2;
        else p.vx *= 0.7;

        p.x += p.vx;
        p.vy += gravity;
        p.y += p.vy;

        // Ground constraint
        if (p.y + p.height >= floorY) {
          p.y = floorY - p.height;
          p.vy = 0;
          p.grounded = true;
        }

        // Screen boundaries
        if (p.x < 10) p.x = 10;
        if (p.x + p.width > canvas.width - 10) p.x = canvas.width - 10 - p.width;

        // Spawn hazards (bats/mutants)
        if (frame % 85 === 0) {
          state.hazards.push({
            x: Math.random() > 0.5 ? canvas.width + 10 : -20,
            y: floorY - 18 - Math.random() * 40,
            vx: Math.random() > 0.5 ? -2 : 2,
            size: 14,
            type: Math.random() > 0.5 ? 'skull' : 'ooze'
          });
        }

        // Spawn orbs/blood coins
        if (frame % 120 === 0) {
          state.coins.push({
            x: 20 + Math.random() * (canvas.width - 40),
            y: floorY - 30 - Math.random() * 50,
            size: 8
          });
        }

        // Update hazards & collisions
        for (let i = state.hazards.length - 1; i >= 0; i--) {
          const h = state.hazards[i];
          h.x += h.vx;

          // Check player collision
          if (
            p.x < h.x + h.size &&
            p.x + p.width > h.x &&
            p.y < h.y + h.size &&
            p.y + p.height > h.y
          ) {
            state.hazards.splice(i, 1);
            sound.playBeep(180, 'sawtooth', 0.15);
            state.lives -= 1;
            setLives(state.lives);

            if (state.lives <= 0) {
              state.isOver = true;
              sound.playGameOver();
              setTimeout(() => {
                onGameOver(state.score);
              }, 400);
              return;
            }
            continue;
          }

          // Remove out of bounds
          if (h.x < -40 || h.x > canvas.width + 40) {
            state.hazards.splice(i, 1);
          }
        }

        // Update Coins & Collisions
        for (let i = state.coins.length - 1; i >= 0; i--) {
          const c = state.coins[i];
          if (
            p.x < c.x + c.size &&
            p.x + p.width > c.x &&
            p.y < c.y + c.size &&
            p.y + p.height > c.y
          ) {
            state.coins.splice(i, 1);
            sound.playBeep(880, 'square', 0.05);
            state.score += 150;
            setScore(state.score);
          }
        }

        // Incremental score
        if (frame % 30 === 0) {
          state.score += 5;
          setScore(state.score);
          setGameTime((t) => t + 1);
        }

        // Render Canvas
        ctx.fillStyle = '#08070d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Floor / Dungeon grid
        ctx.fillStyle = '#1e182b';
        ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);
        ctx.fillStyle = '#800020';
        ctx.fillRect(0, floorY, canvas.width, 2);

        // Grid lines on floor
        ctx.strokeStyle = '#2d2242';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, floorY);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // Draw Player (Pixel Art Survivor)
        ctx.fillStyle = '#ff003c';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        // Player eyes (visor)
        ctx.fillStyle = '#00ff41';
        ctx.fillRect(p.vx >= 0 ? p.x + 8 : p.x + 2, p.y + 4, 6, 3);
        // Weapon / backpack
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.vx >= 0 ? p.x - 2 : p.x + p.width, p.y + 8, 3, 5);

        // Draw Hazards (Enemies)
        state.hazards.forEach((h) => {
          ctx.fillStyle = h.type === 'skull' ? '#ff3366' : '#5bfb6c';
          ctx.fillRect(h.x, h.y, h.size, h.size);
          // Dark eyes
          ctx.fillStyle = '#000000';
          ctx.fillRect(h.x + 2, h.y + 3, 3, 3);
          ctx.fillRect(h.x + 8, h.y + 3, 3, 3);
        });

        // Draw Coins (Energy Orbs)
        state.coins.forEach((c) => {
          ctx.fillStyle = '#ffe600';
          ctx.fillRect(c.x, c.y, c.size, c.size);
        });
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, onGameOver]);

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 justify-between select-none">
      {/* Top HUD */}
      <div className="bg-crt-card border border-crt-border p-2.5 rounded flex justify-between items-center text-[10px]">
        {/* Lives */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              size={14}
              className={i < lives ? 'text-blood fill-blood drop-shadow-[0_0_4px_#ff003c]' : 'text-zinc-700'}
            />
          ))}
        </div>

        {/* Score */}
        <div className="text-center">
          <span className="text-[8px] text-zinc-500 block">SCORE</span>
          <span className="text-xs font-bold text-arcade-yellow tracking-widest">
            {score.toString().padStart(6, '0')}
          </span>
        </div>

        {/* Level & Pause */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-toxic font-bold hidden sm:inline">
            LVL {level?.id || 1}
          </span>
          <button
            onClick={togglePause}
            className="p-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-300 hover:text-white active:scale-95"
            title="Pausa"
          >
            {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} />}
          </button>
        </div>
      </div>

      {/* Main Pixel Canvas Display */}
      <div className="relative my-auto flex flex-col items-center justify-center">
        <div className="crt-vignette relative rounded border-2 border-blood/60 overflow-hidden shadow-pixel-blood">
          <canvas
            ref={canvasRef}
            width={320}
            height={220}
            className="w-full max-w-[340px] aspect-[320/220] block bg-black"
          />

          {/* Pause Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
              <span className="text-sm font-bold neon-blood mb-4">JUEGO PAUSADO</span>
              <div className="space-y-2 w-3/4">
                <button
                  onClick={togglePause}
                  className="pixel-btn pixel-btn-toxic w-full text-[9px] py-2"
                >
                  CONTINUAR
                </button>
                <button
                  onClick={() => onGameOver(score)}
                  className="pixel-btn pixel-btn-blood w-full text-[9px] py-2"
                >
                  TERMINAR PARTIDA
                </button>
                <button
                  onClick={onQuitToMenu}
                  className="pixel-btn pixel-btn-dark w-full text-[9px] py-2"
                >
                  SALIR AL MENÚ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Touch Controls (D-Pad & Action Button) */}
      <div className="w-full pt-2 pb-1">
        <div className="flex items-center justify-between px-2">
          {/* Movement Buttons (Left/Right) */}
          <div className="flex gap-2">
            <button
              onTouchStart={() => { gameStateRef.current.keys.left = true; }}
              onTouchEnd={() => { gameStateRef.current.keys.left = false; }}
              onMouseDown={() => { gameStateRef.current.keys.left = true; }}
              onMouseUp={() => { gameStateRef.current.keys.left = false; }}
              className="w-14 h-14 bg-zinc-900/90 border-2 border-zinc-700 active:border-toxic rounded-lg flex items-center justify-center shadow-pixel active:translate-y-1"
            >
              <ArrowLeft size={22} className="text-zinc-200" />
            </button>
            <button
              onTouchStart={() => { gameStateRef.current.keys.right = true; }}
              onTouchEnd={() => { gameStateRef.current.keys.right = false; }}
              onMouseDown={() => { gameStateRef.current.keys.right = true; }}
              onMouseUp={() => { gameStateRef.current.keys.right = false; }}
              className="w-14 h-14 bg-zinc-900/90 border-2 border-zinc-700 active:border-toxic rounded-lg flex items-center justify-center shadow-pixel active:translate-y-1"
            >
              <ArrowRight size={22} className="text-zinc-200" />
            </button>
          </div>

          {/* Jump / Action Button */}
          <div className="flex items-center gap-3">
            <button
              onTouchStart={handleJump}
              onMouseDown={handleJump}
              className="w-16 h-16 bg-blood border-2 border-blood-light rounded-full flex flex-col items-center justify-center shadow-pixel-blood active:scale-95"
            >
              <Zap size={20} className="text-white fill-white" />
              <span className="text-[7px] text-white font-bold mt-0.5">SALTO</span>
            </button>
          </div>
        </div>
        <div className="text-[8px] text-zinc-500 text-center mt-2">
          TECLADO: [A / D] MOVER • [ESPACIO] SALTAR • [P] PAUSA
        </div>
      </div>
    </div>
  );
}
