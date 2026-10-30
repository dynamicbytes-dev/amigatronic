import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, 
  Pause, 
  Play, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Trophy, 
  Zap,
  Flame,
  Clock,
  Skull,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Home
} from 'lucide-react';
import { sound } from '../utils/audio';

// -------------------------------------------------------------
// 10 MATRICES DE NIVELES (11x11 Pac-Man style)
// 0: Vacío | 1: Humano | 2: Pared destructible | 3: Pizza (+1 Vida)
// -------------------------------------------------------------
export const LEVEL_MAPS = [
  // NIVEL 1: Cripta Inicial
  [
    [0, 1, 1, 1, 0, 3, 0, 1, 1, 1, 0],
    [1, 2, 0, 2, 1, 2, 1, 2, 0, 2, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [3, 2, 0, 2, 0, 0, 0, 2, 0, 2, 3],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 2, 0, 2, 1, 2, 1, 2, 0, 2, 1],
    [0, 1, 1, 1, 0, 3, 0, 1, 1, 1, 0],
  ],

  // NIVEL 2: Pasillos de Mantenimiento
  [
    [0, 1, 2, 1, 1, 0, 1, 1, 2, 1, 0],
    [1, 2, 2, 0, 2, 1, 2, 0, 2, 2, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
    [1, 0, 0, 1, 0, 3, 0, 1, 0, 0, 1],
    [1, 2, 1, 0, 2, 0, 2, 0, 1, 2, 1],
    [1, 0, 0, 1, 0, 3, 0, 1, 0, 0, 1],
    [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 2, 2, 0, 2, 1, 2, 0, 2, 2, 1],
    [0, 1, 2, 1, 1, 0, 1, 1, 2, 1, 0],
  ],

  // NIVEL 3: Cocina de Pizzería
  [
    [0, 1, 1, 2, 3, 0, 3, 2, 1, 1, 0],
    [1, 2, 1, 2, 0, 1, 0, 2, 1, 2, 1],
    [1, 1, 0, 2, 1, 2, 1, 2, 0, 1, 1],
    [2, 2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    [0, 0, 2, 2, 0, 2, 0, 2, 2, 0, 0],
    [1, 1, 1, 0, 2, 0, 2, 0, 1, 1, 1],
    [0, 0, 2, 2, 0, 2, 0, 2, 2, 0, 0],
    [2, 2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    [1, 1, 0, 2, 1, 2, 1, 2, 0, 1, 1],
    [1, 2, 1, 2, 0, 1, 0, 2, 1, 2, 1],
    [0, 1, 1, 2, 3, 0, 3, 2, 1, 1, 0],
  ],

  // NIVEL 4: Laboratorio Biológico
  [
    [0, 2, 1, 1, 2, 0, 2, 1, 1, 2, 0],
    [2, 3, 2, 1, 0, 1, 0, 1, 2, 3, 2],
    [1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [2, 1, 2, 1, 2, 0, 2, 1, 2, 1, 2],
    [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
    [2, 1, 2, 1, 2, 0, 2, 1, 2, 1, 2],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 1],
    [2, 3, 2, 1, 0, 1, 0, 1, 2, 3, 2],
    [0, 2, 1, 1, 2, 0, 2, 1, 1, 2, 0],
  ],

  // NIVEL 5: Alcantarillas del Terror
  [
    [0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0],
    [2, 2, 2, 0, 1, 2, 1, 0, 2, 2, 2],
    [1, 3, 1, 2, 0, 1, 0, 2, 1, 3, 1],
    [1, 2, 0, 2, 2, 0, 2, 2, 0, 2, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [2, 0, 2, 1, 2, 0, 2, 1, 2, 0, 2],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 2, 0, 2, 2, 0, 2, 2, 0, 2, 1],
    [1, 3, 1, 2, 0, 1, 0, 2, 1, 3, 1],
    [2, 2, 2, 0, 1, 2, 1, 0, 2, 2, 2],
    [0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0],
  ],

  // NIVEL 6: Zona de Cuarentena
  [
    [0, 2, 1, 2, 1, 0, 1, 2, 1, 2, 0],
    [2, 1, 1, 2, 0, 2, 0, 2, 1, 1, 2],
    [1, 2, 3, 1, 2, 1, 2, 1, 3, 2, 1],
    [2, 1, 2, 0, 1, 1, 1, 0, 2, 1, 2],
    [1, 0, 1, 2, 2, 0, 2, 2, 1, 0, 1],
    [0, 2, 1, 1, 0, 0, 0, 1, 1, 2, 0],
    [1, 0, 1, 2, 2, 0, 2, 2, 1, 0, 1],
    [2, 1, 2, 0, 1, 1, 1, 0, 2, 1, 2],
    [1, 2, 3, 1, 2, 1, 2, 1, 3, 2, 1],
    [2, 1, 1, 2, 0, 2, 0, 2, 1, 1, 2],
    [0, 2, 1, 2, 1, 0, 1, 2, 1, 2, 0],
  ],

  // NIVEL 7: Fábrica Maldita
  [
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [2, 1, 2, 2, 2, 0, 2, 2, 1, 2, 2],
    [2, 1, 2, 3, 1, 1, 1, 3, 2, 1, 2],
    [2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2],
    [2, 1, 0, 1, 2, 0, 1, 1, 0, 1, 2],
    [2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2],
    [2, 1, 2, 3, 1, 1, 1, 3, 2, 1, 2],
    [2, 1, 2, 2, 2, 0, 2, 2, 1, 2, 2],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  ],

  // NIVEL 8: Cementerio Cibernético
  [
    [0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [2, 1, 3, 1, 2, 1, 2, 1, 3, 1, 2],
    [1, 2, 1, 2, 0, 1, 0, 2, 1, 2, 1],
    [2, 1, 2, 0, 2, 1, 2, 0, 2, 1, 2],
    [1, 2, 1, 1, 1, 0, 1, 1, 1, 2, 1],
    [2, 1, 2, 0, 2, 1, 2, 0, 2, 1, 2],
    [1, 2, 1, 2, 0, 1, 0, 2, 1, 2, 1],
    [2, 1, 3, 1, 2, 1, 2, 1, 3, 1, 2],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0],
  ],

  // NIVEL 9: Torre del Abismo
  [
    [0, 2, 1, 1, 2, 3, 2, 1, 1, 2, 0],
    [1, 2, 2, 1, 2, 0, 2, 1, 2, 2, 1],
    [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1],
    [2, 1, 2, 2, 2, 0, 2, 2, 2, 1, 2],
    [1, 1, 0, 1, 2, 1, 2, 1, 0, 1, 1],
    [2, 2, 1, 2, 2, 0, 2, 2, 1, 2, 2],
    [1, 1, 0, 1, 2, 1, 2, 1, 0, 1, 1],
    [2, 1, 2, 2, 2, 0, 2, 2, 2, 1, 2],
    [1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 2, 2, 1, 2, 0, 2, 1, 2, 2, 1],
    [0, 2, 1, 1, 2, 3, 2, 1, 1, 2, 0],
  ],

  // NIVEL 10: El Núcleo del Caos (Pesadilla Final)
  [
    [0, 1, 2, 3, 2, 1, 2, 3, 2, 1, 0],
    [1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1],
    [2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2],
    [3, 1, 1, 2, 0, 1, 0, 2, 1, 1, 3],
    [2, 2, 1, 0, 2, 1, 2, 0, 1, 2, 2],
    [1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1],
    [2, 2, 1, 0, 2, 1, 2, 0, 1, 2, 2],
    [3, 1, 1, 2, 0, 1, 0, 2, 1, 1, 3],
    [2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2],
    [1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1],
    [0, 1, 2, 3, 2, 1, 2, 3, 2, 1, 0],
  ],
];

// Helper para contar humanos en una matriz
const countHumans = (grid) => {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 1) count++;
    }
  }
  return count;
};

// Generador de patrulleros según nivel
const getInitialEnemies = (lvl) => {
  const count = lvl >= 8 ? 3 : lvl >= 4 ? 2 : 1;
  const positions = [
    { r: 0, c: 0, dir: 'DOWN', name: 'Guardia A' },
    { r: 10, c: 10, dir: 'UP', name: 'Guardia B' },
    { r: 0, c: 10, dir: 'LEFT', name: 'Vigilante C' },
  ];
  return positions.slice(0, count);
};

export default function GameLevel({
  levelId = 1,
  initialLives = 3,
  onGameOver,
  onLevelComplete,
  onQuitToMenu
}) {
  const currentLevelIndex = Math.min(9, Math.max(0, (levelId || 1) - 1));
  const rawMap = LEVEL_MAPS[currentLevelIndex];

  // Estado del juego
  const [grid, setGrid] = useState(() => rawMap.map(row => [...row]));
  const [playerPos, setPlayerPos] = useState({ r: 5, c: 5 });
  const [playerDir, setPlayerDir] = useState('RIGHT');
  const [isChomping, setIsChomping] = useState(false);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives || 3);
  const [humansLeft, setHumansLeft] = useState(() => countHumans(rawMap));
  const [initialHumanCount] = useState(() => countHumans(rawMap));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [comboText, setComboText] = useState(null);

  // Estadísticas del sector actual para la pantalla de victoria
  const [stats, setStats] = useState({
    humansEaten: 0,
    obstaclesIncinerated: 0,
    enemiesPurged: 0
  });

  // Mecánica de Fuego
  const [flameCells, setFlameCells] = useState([]);
  const [fireCooldown, setFireCooldown] = useState(false);

  // Enemigos
  const [enemies, setEnemies] = useState(() => getInitialEnemies(levelId));

  // Reiniciar estado si cambia el nivel
  useEffect(() => {
    const map = LEVEL_MAPS[currentLevelIndex].map(row => [...row]);
    setGrid(map);
    setPlayerPos({ r: 5, c: 5 });
    setPlayerDir('RIGHT');
    setHumansLeft(countHumans(map));
    setLevelWon(false);
    setTimeLeft(60);
    setFlameCells([]);
    setEnemies(getInitialEnemies(levelId));
    setStats({ humansEaten: 0, obstaclesIncinerated: 0, enemiesPurged: 0 });
  }, [currentLevelIndex, levelId]);

  const showFloatText = (text, colorClass) => {
    setComboText({ text, colorClass });
    setTimeout(() => setComboText(null), 700);
  };

  // -------------------------------------------------------------
  // SISTEMA DE DAÑO Y SUPERVIVENCIA
  // -------------------------------------------------------------
  const takeDamage = useCallback((reason = '¡IMPACTO!') => {
    if (isInvulnerable || levelWon) return;

    sound.playHurt();
    setIsInvulnerable(true);
    showFloatText(`-1 VIDA (${reason})`, 'text-blood');

    setLives((prevLives) => {
      const nextLives = prevLives - 1;
      if (nextLives <= 0) {
        sound.playGameOver();
        setTimeout(() => {
          onGameOver(score);
        }, 300);
        return 0;
      }
      return nextLives;
    });

    setTimeout(() => {
      setIsInvulnerable(false);
    }, 1800);
  }, [isInvulnerable, levelWon, onGameOver, score]);

  // Temporizador de nivel
  useEffect(() => {
    if (isPaused || levelWon) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          takeDamage('TIEMPO AGOTADO');
          return 45;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, levelWon, takeDamage]);

  // Patrullaje de enemigos
  useEffect(() => {
    if (isPaused || levelWon) return;

    const moveInterval = Math.max(400, 750 - levelId * 30);
    const enemyLoop = setInterval(() => {
      setEnemies((currentEnemies) =>
        currentEnemies.map((enemy) => {
          const dirs = [
            { dr: -1, dc: 0, dName: 'UP' },
            { dr: 1, dc: 0, dName: 'DOWN' },
            { dr: 0, dc: -1, dName: 'LEFT' },
            { dr: 0, dc: 1, dName: 'RIGHT' },
          ];

          const validMoves = dirs.filter(({ dr, dc }) => {
            const nr = enemy.r + dr;
            const nc = enemy.c + dc;
            return (
              nr >= 0 && nr < 11 &&
              nc >= 0 && nc < 11 &&
              grid[nr][nc] !== 2
            );
          });

          if (validMoves.length === 0) return enemy;

          const sameDir = validMoves.find((m) => m.dName === enemy.dir);
          const chosen = sameDir && Math.random() > 0.35
            ? sameDir
            : validMoves[Math.floor(Math.random() * validMoves.length)];

          const nextR = enemy.r + chosen.dr;
          const nextC = enemy.c + chosen.dc;

          if (nextR === playerPos.r && nextC === playerPos.c) {
            takeDamage('GUARDA PATRULLA');
          }

          return {
            ...enemy,
            r: nextR,
            c: nextC,
            dir: chosen.dName,
          };
        })
      );
    }, moveInterval);

    return () => clearInterval(enemyLoop);
  }, [grid, isPaused, levelId, levelWon, playerPos, takeDamage]);

  // Colisión directa
  useEffect(() => {
    const hasCollided = enemies.some((e) => e.r === playerPos.r && e.c === playerPos.c);
    if (hasCollided) {
      takeDamage('GUARDA PATRULLA');
    }
  }, [playerPos, enemies, takeDamage]);

  // -------------------------------------------------------------
  // MECÁNICA 1: ALIENTO DE FUEGO
  // -------------------------------------------------------------
  const triggerFireBreath = useCallback(() => {
    if (fireCooldown || isPaused || levelWon) return;

    sound.playFireBreath();
    setFireCooldown(true);
    setTimeout(() => setFireCooldown(false), 500);

    let dr = 0;
    let dc = 0;
    if (playerDir === 'UP') dr = -1;
    if (playerDir === 'DOWN') dr = 1;
    if (playerDir === 'LEFT') dc = -1;
    if (playerDir === 'RIGHT') dc = 1;

    const impactedFlames = [];
    let currentR = playerPos.r;
    let currentC = playerPos.c;

    for (let step = 1; step <= 3; step++) {
      currentR += dr;
      currentC += dc;

      if (currentR < 0 || currentR >= 11 || currentC < 0 || currentC >= 11) {
        break;
      }

      impactedFlames.push({ r: currentR, c: currentC });

      // Pared destructible (2): se elimina y convierte en camino libre (0)
      if (grid[currentR][currentC] === 2) {
        sound.playBreakWall();
        setGrid((prevGrid) => {
          const nextGrid = prevGrid.map((row) => [...row]);
          nextGrid[currentR][currentC] = 0;
          return nextGrid;
        });

        setScore((s) => s + 150);
        setStats((prev) => ({ ...prev, obstaclesIncinerated: prev.obstaclesIncinerated + 1 }));
        showFloatText('+150 ¡INCINERADO!', 'text-arcade-orange');
        break;
      }

      // Enemigo alcanzado por la llamarada
      setEnemies((prevEnemies) => {
        const hit = prevEnemies.filter((e) => e.r === currentR && e.c === currentC);
        if (hit.length > 0) {
          sound.playEatHuman();
          setScore((s) => s + 250);
          setStats((prev) => ({ ...prev, enemiesPurged: prev.enemiesPurged + hit.length }));
          showFloatText('+250 ¡ENEMIGO PURGADO!', 'text-toxic');
        }
        return prevEnemies.filter((e) => e.r !== currentR || e.c !== currentC);
      });
    }

    setFlameCells(impactedFlames);
    setTimeout(() => setFlameCells([]), 320);
  }, [fireCooldown, isPaused, levelWon, playerDir, playerPos, grid]);

  // -------------------------------------------------------------
  // MOVIMIENTO DEL JUGADOR
  // -------------------------------------------------------------
  const movePlayer = useCallback((dr, dc, dirName) => {
    if (isPaused || levelWon) return;

    setPlayerDir(dirName);
    setIsChomping(true);
    setTimeout(() => setIsChomping(false), 120);

    setPlayerPos((prev) => {
      const newR = prev.r + dr;
      const newC = prev.c + dc;

      if (newR < 0 || newR >= 11 || newC < 0 || newC >= 11) {
        sound.playBeep(120, 'square', 0.05);
        return prev;
      }

      const cell = grid[newR][newC];

      // Pared destructible (2)
      if (cell === 2) {
        sound.playBreakWall();
        setGrid((g) => {
          const nextG = g.map((row) => [...row]);
          nextG[newR][newC] = 0;
          return nextG;
        });
        setScore((s) => s + 50);
        showFloatText('+50 SMASH!', 'text-arcade-yellow');
        return { r: newR, c: newC };
      }

      // Humano comestible (1)
      if (cell === 1) {
        sound.playEatHuman();
        setGrid((g) => {
          const nextG = g.map((row) => [...row]);
          nextG[newR][newC] = 0;
          return nextG;
        });
        setScore((s) => s + 100);
        setStats((prev) => ({ ...prev, humansEaten: prev.humansEaten + 1 }));
        setHumansLeft((h) => {
          const remaining = h - 1;
          if (remaining <= 0) {
            handleVictory();
          }
          return Math.max(0, remaining);
        });
        showFloatText('+100 YUM!', 'text-blood');
        return { r: newR, c: newC };
      }

      // Pizza (3): +1 Vida y +300 pts
      if (cell === 3) {
        sound.playPowerup();
        setGrid((g) => {
          const nextG = g.map((row) => [...row]);
          nextG[newR][newC] = 0;
          return nextG;
        });
        setScore((s) => s + 300);
        setLives((l) => Math.min(9, l + 1));
        showFloatText('+1 VIDA RECUPERADA! (+300)', 'text-toxic');
        return { r: newR, c: newC };
      }

      // Espacio libre (0)
      sound.playBeep(240, 'square', 0.03);
      return { r: newR, c: newC };
    });
  }, [grid, isPaused, levelWon]);

  // Victoria
  const handleVictory = () => {
    sound.playVictory();
    setLevelWon(true);
  };

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer(-1, 0, 'UP');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer(1, 0, 'DOWN');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer(0, -1, 'LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer(0, 1, 'RIGHT');
      } else if (e.code === 'Space' || e.key === 'f' || e.key === 'F' || e.key === 'j') {
        e.preventDefault();
        triggerFireBreath();
      } else if (e.key === 'p' || e.key === 'Escape') {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, triggerFireBreath]);

  const handleNextLevel = () => {
    if (onLevelComplete) {
      onLevelComplete(levelId + 1);
    }
  };

  return (
    <div className="flex flex-col h-full h-[100dvh] max-h-[100dvh] w-full max-w-md mx-auto p-2 justify-between select-none overflow-hidden pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
      {/* ------------------------------------------------------------- */}
      {/* 2. HUD DE JUEGO (SUPERIOR) - BARRA EN TIEMPO REAL             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-crt-card border-2 border-crt-border p-2 rounded shadow-pixel shrink-0">
        {/* Fila Principal del HUD */}
        <div className="flex justify-between items-center text-[9px] mb-1.5">
          {/* Nivel Actual (ej. 4/10) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] text-zinc-500 font-bold block uppercase">SECTOR</span>
            <span className="bg-black/70 border border-arcade-cyan text-arcade-cyan px-2 py-0.5 rounded font-black tracking-wider text-[10px]">
              NVL {levelId}/10
            </span>
          </div>

          {/* Vidas Restantes con Iconos de Corazones */}
          <div className="flex items-center gap-1 bg-black/50 border border-crt-border px-2 py-1 rounded">
            {[...Array(Math.min(5, lives))].map((_, i) => (
              <Heart
                key={i}
                size={12}
                className="text-blood fill-blood drop-shadow-[0_0_4px_#ff003c] animate-pulse"
              />
            ))}
            {lives > 5 && (
              <span className="text-[8px] text-toxic font-bold">+{lives - 5}</span>
            )}
            {lives <= 0 && (
              <span className="text-[7px] text-zinc-500 font-bold">0 VIDAS</span>
            )}
          </div>

          {/* Puntuación Actual */}
          <div className="text-right">
            <span className="text-[7px] text-zinc-500 block uppercase">SCORE</span>
            <span className="text-xs font-bold text-arcade-yellow tracking-widest font-mono">
              {score.toString().padStart(6, '0')}
            </span>
          </div>

          {/* Botón de Pausa */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="p-1.5 bg-zinc-900 border border-zinc-700 hover:border-toxic rounded text-zinc-300 active:scale-95 ml-1"
            title="Pausa"
          >
            {isPaused ? <Play size={11} fill="currentColor" /> : <Pause size={11} />}
          </button>
        </div>

        {/* Fila Secundaria del HUD: Estado del Botón de Fuego & Reloj */}
        <div className="flex justify-between items-center text-[8px] border-t border-crt-border/60 pt-1.5 px-0.5">
          {/* Estado del Botón de Fuego en Tiempo Real */}
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-bold transition-all ${
              fireCooldown 
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' 
                : 'bg-blood-darkest text-arcade-yellow border border-arcade-orange animate-pulse shadow-[0_0_6px_rgba(255,108,0,0.5)]'
            }`}>
              <Flame size={10} className={fireCooldown ? 'text-zinc-500' : 'text-arcade-orange fill-arcade-orange'} />
              <span>{fireCooldown ? 'FUEGO: RECARGANDO...' : 'FUEGO: LISTO'}</span>
            </div>
          </div>

          {/* Temporizador y Humanos Restantes */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock size={10} className={timeLeft <= 15 ? 'text-blood animate-bounce' : 'text-zinc-400'} />
              <span className={`font-mono font-bold ${timeLeft <= 15 ? 'text-blood animate-pulse' : 'text-zinc-300'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">HUMANOS:</span>
              <span className="text-toxic font-bold font-mono">{humansLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA CENTRAL: LABERINTO GRID 11x11 */}
      <div className="relative my-auto flex flex-col items-center justify-center">
        {comboText && (
          <div className={`absolute -top-7 text-[10px] font-black z-30 animate-bounce tracking-widest ${comboText.colorClass}`}>
            {comboText.text}
          </div>
        )}

        {/* Contenedor del Laberinto */}
        <div className={`relative p-1.5 bg-[#0e0c17] border-4 rounded shadow-pixel-blood overflow-hidden transition-colors ${
          isInvulnerable ? 'border-blood animate-pulse' : 'border-[#282038]'
        }`}>
          <div className="grid grid-cols-11 gap-[2px] bg-black/90 p-1 rounded">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = playerPos.r === r && playerPos.c === c;
                const isFlame = flameCells.some((f) => f.r === r && f.c === c);
                const enemyHere = enemies.find((e) => e.r === r && e.c === c);

                return (
                  <div
                    key={`${r}-${c}`}
                    className="w-[20px] h-[20px] min-[360px]:w-[23px] min-[360px]:h-[23px] min-[400px]:w-[26px] min-[400px]:h-[26px] flex items-center justify-center relative rounded-sm transition-all overflow-hidden"
                  >
                    {/* CELDA 0: VACÍO */}
                    {cell === 0 && !isFlame && (
                      <div className="w-1.5 h-1.5 bg-zinc-800/60 rounded-full" />
                    )}

                    {/* CELDA 1: HUMANO COMESTIBLE */}
                    {cell === 1 && (
                      <div className="relative flex flex-col items-center justify-center animate-pulse">
                        <div className="w-2.5 h-2.5 bg-[#fbcfe8] rounded-full border border-black shadow-[0_0_4px_#ff00ea]" />
                        <div className="w-3.5 h-2 bg-[#38bdf8] rounded-sm mt-[1px] border border-black" />
                      </div>
                    )}

                    {/* CELDA 2: PARED / OBSTÁCULO DESTRUCTIBLE */}
                    {cell === 2 && (
                      <div className="w-full h-full bg-[#4a3b56] border border-[#6d557f] flex flex-col justify-between p-[2px] rounded-sm shadow-pixel-sm">
                        <div className="w-full h-[2px] bg-[#8a6b9f]" />
                        <div className="flex justify-between">
                          <div className="w-1 h-1.5 bg-[#251c2e]" />
                          <div className="w-1 h-1.5 bg-[#251c2e]" />
                        </div>
                        <div className="w-full h-[2px] bg-[#251c2e]" />
                      </div>
                    )}

                    {/* CELDA 3: PIZZA (+1 VIDA EXTRA) */}
                    {cell === 3 && (
                      <div className="relative flex items-center justify-center animate-bounce">
                        <div className="w-4 h-4 bg-arcade-yellow border border-black rotate-45 flex items-center justify-center shadow-glow-green">
                          <Zap size={10} className="text-black fill-black -rotate-45" />
                        </div>
                      </div>
                    )}

                    {/* LLAMARADA DE FUEGO EN LA CELDA */}
                    {isFlame && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-arcade-orange/35 animate-pulse">
                        <Flame size={18} className="text-arcade-yellow fill-arcade-orange animate-bounce drop-shadow-[0_0_8px_#ff6c00]" />
                      </div>
                    )}

                    {/* ENEMIGO PATRULLANDO */}
                    {enemyHere && !isPlayer && (
                      <div className="absolute inset-0 z-15 flex flex-col items-center justify-center animate-float">
                        <div className="w-3 h-3 bg-zinc-400 border border-black rounded-full flex items-center justify-center shadow-[0_0_6px_#00f0ff]">
                          <div className="w-1 h-1 bg-arcade-cyan rounded-full" />
                        </div>
                        <div className="w-4 h-2 bg-[#1e293b] rounded-sm mt-[1px] border border-black" />
                      </div>
                    )}

                    {/* JUGADOR: ANIMATRÓNICO PIXEL ART */}
                    {isPlayer && (
                      <div
                        className={`absolute inset-0 z-20 flex items-center justify-center transition-transform duration-100 ${
                          playerDir === 'LEFT' ? '-scale-x-100' : ''
                        } ${
                          playerDir === 'UP' ? '-rotate-90' : ''
                        } ${
                          playerDir === 'DOWN' ? 'rotate-90' : ''
                        } ${
                          isInvulnerable ? 'opacity-50 animate-ping' : 'opacity-100'
                        }`}
                      >
                        <div className="relative w-5 h-5 bg-[#e60039] border-2 border-black rounded flex flex-col items-center justify-center shadow-glow-red">
                          <div className="absolute -top-1.5 -left-0.5 w-1.5 h-2 bg-[#800020] border border-black rounded-t" />
                          <div className="absolute -top-1.5 -right-0.5 w-1.5 h-2 bg-[#800020] border border-black rounded-t" />
                          <div className="flex gap-1 mb-[1px]">
                            <div className="w-1 h-1 bg-[#00ff41] rounded-full shadow-[0_0_3px_#00ff41]" />
                            <div className="w-1 h-1 bg-[#00ff41] rounded-full shadow-[0_0_3px_#00ff41]" />
                          </div>
                          <div
                            className={`w-3.5 h-1.5 bg-[#12101b] border border-black flex justify-between px-[1px] transition-all ${
                              isChomping ? 'h-2 bg-[#ff003c]' : 'h-1'
                            }`}
                          >
                            <div className="w-[1px] h-full bg-white" />
                            <div className="w-[1px] h-full bg-white" />
                            <div className="w-[1px] h-full bg-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. PANTALLA DE VICTORIA / FIN DEL NIVEL                       */}
        {/* ------------------------------------------------------------- */}
        {levelWon && (
          <div className="absolute inset-0 bg-black/95 z-40 flex flex-col items-center justify-between p-5 rounded text-center border-2 border-toxic shadow-pixel-toxic">
            {/* Header de Victoria */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-toxic-dark/40 border-2 border-toxic rounded-full flex items-center justify-center mb-2 shadow-glow-green animate-bounce">
                <Trophy size={28} className="text-arcade-yellow" />
              </div>
              <h3 className="text-base font-black neon-toxic tracking-tight mb-1">
                ¡SECTOR {levelId}/10 PURGADO!
              </h3>
              <p className="text-[9px] text-zinc-300 uppercase tracking-widest">
                TODOS LOS HUMANOS HAN SIDO DEVORADOS
              </p>
            </div>

            {/* Resumen Detallado de Puntos */}
            <div className="w-full bg-crt-card border border-crt-border p-3 rounded space-y-2 text-[9px] text-left">
              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block border-b border-crt-border pb-1">
                INFORME DE ASIMILACIÓN
              </span>
              <div className="flex justify-between items-center text-zinc-300">
                <span>HUMANOS CONSUMIDOS:</span>
                <span className="text-toxic font-bold font-mono">+{stats.humansEaten * 100} PTS</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span>OBSTÁCULOS INCINERADOS:</span>
                <span className="text-arcade-orange font-bold font-mono">+{stats.obstaclesIncinerated * 150} PTS</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span>ENEMIGOS PURGADOS:</span>
                <span className="text-arcade-cyan font-bold font-mono">+{stats.enemiesPurged * 250} PTS</span>
              </div>
              <div className="flex justify-between items-center border-t border-crt-border pt-1.5 text-arcade-yellow font-black text-xs">
                <span>PUNTUACIÓN TOTAL:</span>
                <span className="tracking-widest font-mono">{score.toString().padStart(6, '0')} PTS</span>
              </div>
            </div>

            {/* Botones de Acción para Pantallas Táctiles */}
            <div className="flex flex-col gap-2.5 w-full">
              {levelId < 10 ? (
                <button
                  onClick={handleNextLevel}
                  className="pixel-btn pixel-btn-toxic w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Play size={14} fill="currentColor" />
                  <span>AVANZAR AL SIGUIENTE NIVEL ({levelId + 1}/10)</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <div className="p-3 bg-arcade-yellow/20 border-2 border-arcade-yellow rounded text-center">
                  <span className="text-xs font-black text-arcade-yellow block mb-1">
                    ★ ¡PESADILLA CONQUISTADA! ★
                  </span>
                  <p className="text-[8px] text-zinc-300">
                    HAS PURGADO LOS 10 NIVELES DE AMIGATRONIC
                  </p>
                </div>
              )}

              <button
                onClick={onQuitToMenu}
                className="pixel-btn pixel-btn-dark w-full py-2.5 text-[10px] text-zinc-400 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Home size={12} />
                <span>VOLVER AL MENÚ PRINCIPAL</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL DE PAUSA */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/85 z-40 flex flex-col items-center justify-center p-4 rounded text-center">
            <h3 className="text-sm font-bold neon-blood mb-4">JUEGO EN PAUSA</h3>
            <div className="space-y-2 w-3/4">
              <button
                onClick={() => setIsPaused(false)}
                className="pixel-btn pixel-btn-toxic w-full py-2 text-[9px]"
              >
                CONTINUAR
              </button>
              <button
                onClick={() => onGameOver(score)}
                className="pixel-btn pixel-btn-blood w-full py-2 text-[9px]"
              >
                ABANDONAR
              </button>
              <button
                onClick={onQuitToMenu}
                className="pixel-btn pixel-btn-dark w-full py-2 text-[9px]"
              >
                SALIR AL MENÚ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONTROLES TÁCTILES MÓVILES OPTIMIZADOS (D-PAD COMPACTO + BOTÓN DE FUEGO) */}
      <div className="w-full shrink-0 flex items-center justify-between px-3 pt-1 pb-6 sm:pb-8 pb-[max(1.75rem,env(safe-area-inset-bottom,1.75rem))]">
        {/* Cruceta / D-Pad clásico de 4 direcciones compacto */}
        <div className="relative w-32 h-28 min-[360px]:w-36 min-[360px]:h-30 flex flex-col items-center justify-center">
          {/* BOTÓN ARRIBA */}
          <button
            onTouchStart={(e) => { e.preventDefault(); movePlayer(-1, 0, 'UP'); }}
            onMouseDown={() => movePlayer(-1, 0, 'UP')}
            className="w-10 h-8 min-[360px]:w-11 min-[360px]:h-9 bg-zinc-900 border-2 border-zinc-700 active:border-toxic hover:bg-zinc-800 rounded-t-md flex items-center justify-center shadow-pixel active:translate-y-0.5 active:bg-toxic-dark"
            aria-label="Arriba"
          >
            <ArrowUp size={18} className="text-zinc-200" />
          </button>

          {/* FILA CENTRAL: IZQUIERDA - CENTRO - DERECHA */}
          <div className="flex items-center gap-0.5">
            <button
              onTouchStart={(e) => { e.preventDefault(); movePlayer(0, -1, 'LEFT'); }}
              onMouseDown={() => movePlayer(0, -1, 'LEFT')}
              className="w-10 h-8 min-[360px]:w-11 min-[360px]:h-9 bg-zinc-900 border-2 border-zinc-700 active:border-toxic hover:bg-zinc-800 rounded-l-md flex items-center justify-center shadow-pixel active:-translate-x-0.5 active:bg-toxic-dark"
              aria-label="Izquierda"
            >
              <ArrowLeft size={18} className="text-zinc-200" />
            </button>

            <div className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 bg-zinc-950 border border-zinc-800 flex items-center justify-center rounded">
              <div className="w-1.5 h-1.5 bg-blood rounded-full animate-ping" />
            </div>

            <button
              onTouchStart={(e) => { e.preventDefault(); movePlayer(0, 1, 'RIGHT'); }}
              onMouseDown={() => movePlayer(0, 1, 'RIGHT')}
              className="w-10 h-8 min-[360px]:w-11 min-[360px]:h-9 bg-zinc-900 border-2 border-zinc-700 active:border-toxic hover:bg-zinc-800 rounded-r-md flex items-center justify-center shadow-pixel active:translate-x-0.5 active:bg-toxic-dark"
              aria-label="Derecha"
            >
              <ArrowRight size={18} className="text-zinc-200" />
            </button>
          </div>

          {/* BOTÓN ABAJO */}
          <button
            onTouchStart={(e) => { e.preventDefault(); movePlayer(1, 0, 'DOWN'); }}
            onMouseDown={() => movePlayer(1, 0, 'DOWN')}
            className="w-10 h-8 min-[360px]:w-11 min-[360px]:h-9 bg-zinc-900 border-2 border-zinc-700 active:border-toxic hover:bg-zinc-800 rounded-b-md flex items-center justify-center shadow-pixel active:translate-y-0.5 active:bg-toxic-dark"
            aria-label="Abajo"
          >
            <ArrowDown size={18} className="text-zinc-200" />
          </button>
        </div>

        {/* BOTÓN DE ACCIÓN: ALIENTO DE FUEGO COMPACTO Y ERGONÓMICO */}
        <div className="flex flex-col items-center">
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerFireBreath(); }}
            onMouseDown={triggerFireBreath}
            disabled={fireCooldown}
            className={`w-16 h-16 min-[360px]:w-17 min-[360px]:h-17 rounded-full border-3 flex flex-col items-center justify-center transition-all ${
              fireCooldown
                ? 'bg-zinc-800 border-zinc-600 opacity-60 scale-95'
                : 'bg-gradient-to-tr from-blood-dark via-arcade-orange to-arcade-yellow border-white shadow-glow-red active:scale-90 active:brightness-125'
            }`}
            title="Lanzar Aliento de Fuego (Espacio / F)"
          >
            <Flame size={22} className="text-white fill-arcade-yellow animate-bounce" />
            <span className="text-[7px] min-[360px]:text-[8px] font-black tracking-wider text-white uppercase mt-0.5 drop-shadow-[0_1px_2px_#000]">
              FUEGO
            </span>
          </button>
          <span className="text-[6px] min-[360px]:text-[7px] text-zinc-400 mt-0.5 font-bold">
            [ESPACIO / F]
          </span>
        </div>
      </div>
    </div>
  );
}
