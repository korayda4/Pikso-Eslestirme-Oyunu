import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings } from '../core/types/settings';
import { AudioSettings } from '../core/types/audio';
import { GameDifficulty } from '../core/types/game';
import { DEFAULT_SETTINGS, StorageService } from '../core/storage/StorageService';
import { SoundManager } from '../services/SoundManager';

interface SettingsContextValue {
  settings: AppSettings;
  isLoading: boolean;
  updateAudio: (audio: Partial<AudioSettings>) => Promise<void>;
  setDifficulty: (difficulty: GameDifficulty) => Promise<void>;
  recordGameScore: (score: number) => Promise<boolean>;
  resetScores: () => Promise<void>;
  toggleVibration: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      const loaded = await StorageService.loadSettings();
      setSettings(loaded);
      await SoundManager.init(loaded.audio);
      if (loaded.audio.musicEnabled) {
        SoundManager.playMusic();
      }
      setIsLoading(false);
    }
    init();

    return () => {
      SoundManager.cleanup();
    };
  }, []);

  const updateAudio = async (partial: Partial<AudioSettings>) => {
    const updatedAudio = { ...settings.audio, ...partial };
    const newSettings = { ...settings, audio: updatedAudio };
    setSettings(newSettings);
    SoundManager.updateSettings(updatedAudio);
    await StorageService.saveSettings(newSettings);
  };

  const setDifficulty = async (difficulty: GameDifficulty) => {
    const newSettings = { ...settings, difficulty };
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
  };

  const recordGameScore = async (score: number): Promise<boolean> => {
    const isRecord = await StorageService.saveHighScore(settings.difficulty, score);
    const updated = await StorageService.loadSettings();
    setSettings(updated);
    return isRecord;
  };

  const resetScores = async () => {
    const updated = await StorageService.resetHighScores();
    setSettings(updated);
  };

  const toggleVibration = async () => {
    const newSettings = { ...settings, vibrationEnabled: !settings.vibrationEnabled };
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateAudio,
        setDifficulty,
        recordGameScore,
        resetScores,
        toggleVibration,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
