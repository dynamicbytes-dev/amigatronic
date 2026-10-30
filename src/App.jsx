import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import GameLevel from './components/GameLevel';
import GameOver from './components/GameOver';
import SettingsModal from './components/SettingsModal';
import HighScoresModal from './components/HighScoresModal';
import { sound } from './utils/audio';
import {
  loadGameData,
  updateGameData,
  unlockLevel,
  updateHighScore,
  setInitialLives,
  updateSettings,
  resetGameData,
  recordGameSession
} from './utils/storage';

// Enum for Screen states
export const SCREENS = {
  MENU: 'MENU',
  LEVEL_SELECT: 'LEVEL_SELECT',
  GAME: 'GAME',
  GAME_OVER: 'GAME_OVER',
};

export default function App() {
  const [gameData, setGameData] = useState(() => loadGameData());
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MENU);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHighScoresOpen, setIsHighScoresOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState({
    id: 1,
    name: "Cripta Subterránea",
    subtitle: "Infección Fase 1",
    difficulty: "FÁCIL",
  });
  const [lastScore, setLastScore] = useState(0);

  // Synchronize audio controller mute state with storage settings
  useEffect(() => {
    sound.muted = gameData.settings.soundMuted;
  }, [gameData.settings.soundMuted]);

  // Toggle Mute
  const handleToggleMute = () => {
    const newMuted = !gameData.settings.soundMuted;
    sound.muted = newMuted;
    const updated = updateSettings({ soundMuted: newMuted });
    setGameData(updated);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings) => {
    const updated = updateSettings(newSettings);
    setGameData(updated);
  };

  // Update Initial Lives
  const handleUpdateLives = (lives) => {
    const updated = setInitialLives(lives);
    setGameData(updated);
  };

  // Reset Data to Factory Defaults
  const handleResetData = () => {
    const reset = resetGameData();
    setGameData(reset);
    setSelectedLevel({
      id: 1,
      name: "Cripta Subterránea",
      subtitle: "Infección Fase 1",
      difficulty: "FÁCIL",
    });
  };

  // Navigation handlers
  const handleStartGame = (level = selectedLevel) => {
    setSelectedLevel(level);
    setCurrentScreen(SCREENS.GAME);
  };

  const handleLevelSelect = () => {
    setCurrentScreen(SCREENS.LEVEL_SELECT);
  };

  const handleLevelComplete = (nextLevelId) => {
    const newMax = unlockLevel(nextLevelId);
    setGameData((prev) => ({
      ...prev,
      maxUnlockedLevel: newMax
    }));
  };

  const handleGameOver = (finalScore) => {
    setLastScore(finalScore);
    const result = updateHighScore(finalScore);
    recordGameSession(finalScore);

    // Refresh game data state
    setGameData(loadGameData());
    setCurrentScreen(SCREENS.GAME_OVER);
  };

  const handleRestart = () => {
    setCurrentScreen(SCREENS.GAME);
  };

  const handleMainMenu = () => {
    setCurrentScreen(SCREENS.MENU);
  };

  const crtScanlines = gameData.settings.crtScanlines;

  return (
    <div className={`relative h-screen h-[100dvh] w-screen bg-crt-bg flex items-center justify-center overflow-hidden ${crtScanlines ? 'crt-overlay' : ''}`}>
      {/* Mobile Safe Area / Outer Arcade Cabinet Container */}
      <main className="w-full h-full max-w-lg mx-auto flex flex-col justify-between relative z-10 crt-vignette bg-[#0b0a12]/95 border-x-4 border-crt-border shadow-2xl">
        {/* Router View */}
        {currentScreen === SCREENS.MENU && (
          <MainMenu
            onStartGame={() => handleStartGame(selectedLevel)}
            onSelectLevel={handleLevelSelect}
            muted={gameData.settings.soundMuted}
            onToggleMute={handleToggleMute}
            highScore={gameData.highScore}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHighScores={() => setIsHighScoresOpen(true)}
          />
        )}

        {currentScreen === SCREENS.LEVEL_SELECT && (
          <LevelSelect
            maxUnlockedLevel={gameData.maxUnlockedLevel}
            onSelectLevel={(lvl) => handleStartGame(lvl)}
            onBack={handleMainMenu}
          />
        )}

        {currentScreen === SCREENS.GAME && (
          <GameLevel
            levelId={selectedLevel.id}
            initialLives={gameData.initialLives}
            onGameOver={handleGameOver}
            onLevelComplete={handleLevelComplete}
            onQuitToMenu={handleMainMenu}
          />
        )}

        {currentScreen === SCREENS.GAME_OVER && (
          <GameOver
            score={lastScore}
            highScore={gameData.highScore}
            level={selectedLevel}
            onRestart={handleRestart}
            onSelectLevel={handleLevelSelect}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Global CRT Scanlines Toggle switch at bottom edge */}
        <div className="absolute bottom-1 right-2 z-20 opacity-40 hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleUpdateSettings({ crtScanlines: !crtScanlines })}
            className="text-[7px] text-zinc-400 bg-black/70 px-1.5 py-0.5 border border-zinc-700 rounded"
          >
            CRT: {crtScanlines ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={gameData.settings}
          initialLives={gameData.initialLives}
          maxUnlockedLevel={gameData.maxUnlockedLevel}
          onUpdateSettings={handleUpdateSettings}
          onUpdateLives={handleUpdateLives}
          onResetData={handleResetData}
        />

        {/* High Scores Modal */}
        <HighScoresModal
          isOpen={isHighScoresOpen}
          onClose={() => setIsHighScoresOpen(false)}
          highScore={gameData.highScore}
          stats={gameData.stats}
        />
      </main>
    </div>
  );
}
