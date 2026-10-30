/**
 * Módulo de Almacenamiento Local para Videojuego Móvil (storage.js)
 * Maneja la persistencia y carga automática de progreso, récords y configuraciones.
 */

const STORAGE_KEY = 'amigatronic_save_data_v1';

// Valores iniciales por defecto del jugador
export const DEFAULT_GAME_DATA = Object.freeze({
  maxUnlockedLevel: 1, // Del 1 al 10
  highScore: 0,
  initialLives: 3,     // Vidas iniciales por defecto: 3
  settings: {
    soundVolume: 0.8,  // 0.0 a 1.0
    soundMuted: false, // Silenciado
    crtScanlines: true,// Efecto scanline retro
    screenShake: true, // Sacudida de pantalla en impactos
    bloodEffects: true // Efectos visuales de sangre/partículas
  },
  stats: {
    gamesPlayed: 0,
    totalScore: 0
  }
});

/**
 * Valida si localStorage está disponible en el entorno del dispositivo
 */
function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('[Storage] localStorage no disponible o cuota excedida:', error);
    return false;
  }
}

// Caché en memoria por si localStorage falla o para acceso rápido sincrónico
let memoryCache = null;

/**
 * Carga todos los datos del jugador desde el almacenamiento local.
 * Fusiona los datos guardados con los valores por defecto para asegurar integridad de esquema.
 * @returns {typeof DEFAULT_GAME_DATA} Objeto con la información del jugador
 */
export function loadGameData() {
  if (memoryCache) {
    return { ...memoryCache };
  }

  if (!isStorageAvailable()) {
    memoryCache = JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
    return { ...memoryCache };
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      memoryCache = JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
      saveGameData(memoryCache);
      return { ...memoryCache };
    }

    const parsed = JSON.parse(rawData);

    // Fusión recursiva segura con defaults
    memoryCache = {
      maxUnlockedLevel: Math.min(10, Math.max(1, Number(parsed.maxUnlockedLevel) || DEFAULT_GAME_DATA.maxUnlockedLevel)),
      highScore: Math.max(0, Number(parsed.highScore) || 0),
      initialLives: Math.max(1, Number(parsed.initialLives) || DEFAULT_GAME_DATA.initialLives),
      settings: {
        soundVolume: typeof parsed.settings?.soundVolume === 'number' ? Math.max(0, Math.min(1, parsed.settings.soundVolume)) : DEFAULT_GAME_DATA.settings.soundVolume,
        soundMuted: typeof parsed.settings?.soundMuted === 'boolean' ? parsed.settings.soundMuted : DEFAULT_GAME_DATA.settings.soundMuted,
        crtScanlines: typeof parsed.settings?.crtScanlines === 'boolean' ? parsed.settings.crtScanlines : DEFAULT_GAME_DATA.settings.crtScanlines,
        screenShake: typeof parsed.settings?.screenShake === 'boolean' ? parsed.settings.screenShake : DEFAULT_GAME_DATA.settings.screenShake,
        bloodEffects: typeof parsed.settings?.bloodEffects === 'boolean' ? parsed.settings.bloodEffects : DEFAULT_GAME_DATA.settings.bloodEffects
      },
      stats: {
        gamesPlayed: Number(parsed.stats?.gamesPlayed) || 0,
        totalScore: Number(parsed.stats?.totalScore) || 0
      }
    };

    return { ...memoryCache };
  } catch (error) {
    console.error('[Storage] Error al leer datos guardados. Usando valores predeterminados:', error);
    memoryCache = JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
    return { ...memoryCache };
  }
}

/**
 * Guarda el objeto de datos completo en localStorage.
 * @param {Object} data Objeto completo a persistir
 * @returns {boolean} true si se guardó con éxito
 */
export function saveGameData(data) {
  memoryCache = { ...data };
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('[Storage] Error al escribir en localStorage:', error);
    return false;
  }
}

/**
 * Actualiza parcialmente los datos del jugador y persiste los cambios.
 * @param {Partial<typeof DEFAULT_GAME_DATA>} partialData 
 * @returns {typeof DEFAULT_GAME_DATA} Objeto actualizado
 */
export function updateGameData(partialData) {
  const current = loadGameData();
  const updated = {
    ...current,
    ...partialData,
    settings: {
      ...current.settings,
      ...(partialData.settings || {})
    },
    stats: {
      ...current.stats,
      ...(partialData.stats || {})
    }
  };

  saveGameData(updated);
  return updated;
}

/**
 * Desbloquea un nuevo nivel (restringido del nivel 1 al 10).
 * Solo actualiza si el nuevo nivel es mayor al actual.
 * @param {number} level Número de nivel a desbloquear
 * @returns {number} Nivel máximo desbloqueado actual
 */
export function unlockLevel(level) {
  const current = loadGameData();
  const targetLevel = Math.min(10, Math.max(1, Math.floor(Number(level) || 1)));

  if (targetLevel > current.maxUnlockedLevel) {
    updateGameData({ maxUnlockedLevel: targetLevel });
    return targetLevel;
  }
  return current.maxUnlockedLevel;
}

/**
 * Actualiza el puntaje récord (High Score) si el puntaje dado es superior.
 * @param {number} newScore Puntaje obtenido en la partida
 * @returns {{ isNewRecord: boolean, highScore: number }}
 */
export function updateHighScore(newScore) {
  const current = loadGameData();
  const validScore = Math.max(0, Math.floor(Number(newScore) || 0));

  if (validScore > current.highScore) {
    updateGameData({
      highScore: validScore,
      stats: {
        ...current.stats,
        totalScore: current.stats.totalScore + validScore
      }
    });
    return { isNewRecord: true, highScore: validScore };
  }

  return { isNewRecord: false, highScore: current.highScore };
}

/**
 * Modifica la cantidad de vidas iniciales (por defecto 3).
 * @param {number} lives Cantidad de vidas (mínimo 1, máximo recomendado 9)
 */
export function setInitialLives(lives) {
  const safeLives = Math.max(1, Math.min(9, Math.floor(Number(lives) || 3)));
  return updateGameData({ initialLives: safeLives });
}

/**
 * Actualiza las opciones de volumen y efectos visuales.
 * @param {Partial<typeof DEFAULT_GAME_DATA['settings']>} newSettings
 */
export function updateSettings(newSettings) {
  const current = loadGameData();
  const updatedSettings = {
    ...current.settings,
    ...newSettings
  };

  // Clamping de volumen
  if (typeof updatedSettings.soundVolume === 'number') {
    updatedSettings.soundVolume = Math.max(0, Math.min(1, updatedSettings.soundVolume));
  }

  return updateGameData({ settings: updatedSettings });
}

/**
 * Registra una partida jugada en las estadísticas.
 */
export function recordGameSession(finalScore) {
  const current = loadGameData();
  const validScore = Math.max(0, Math.floor(Number(finalScore) || 0));

  return updateGameData({
    stats: {
      gamesPlayed: current.stats.gamesPlayed + 1,
      totalScore: current.stats.totalScore + validScore
    }
  });
}

/**
 * Reinicia todos los datos de la partida a los valores predeterminados de fábrica.
 * @returns {typeof DEFAULT_GAME_DATA}
 */
export function resetGameData() {
  const defaults = JSON.parse(JSON.stringify(DEFAULT_GAME_DATA));
  saveGameData(defaults);
  return defaults;
}
