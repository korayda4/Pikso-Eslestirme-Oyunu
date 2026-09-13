import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types/settings';
import { GameDifficulty } from '../types/game';

const SETTINGS_KEY = '@pikso_app_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  audio: {
    musicEnabled: true,
    sfxEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.9,
  },
  difficulty: 'medium',
  highScores: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  vibrationEnabled: true,
  totalGamesPlayed: 0,
};

export class StorageService {
  static async loadSettings(): Promise<AppSettings> {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          audio: { ...DEFAULT_SETTINGS.audio, ...(parsed.audio || {}) },
          highScores: { ...DEFAULT_SETTINGS.highScores, ...(parsed.highScores || {}) },
        };
      }
    } catch (error) {
      console.warn('StorageService load error:', error);
    }
    return DEFAULT_SETTINGS;
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('StorageService save error:', error);
    }
  }

  static async saveHighScore(difficulty: GameDifficulty, score: number): Promise<boolean> {
    try {
      const current = await this.loadSettings();
      if (score > (current.highScores[difficulty] || 0)) {
        current.highScores[difficulty] = score;
        await this.saveSettings(current);
        return true; // New record!
      }
    } catch (error) {
      console.warn('StorageService saveHighScore error:', error);
    }
    return false;
  }

  static async resetHighScores(): Promise<AppSettings> {
    try {
      const current = await this.loadSettings();
      current.highScores = { easy: 0, medium: 0, hard: 0 };
      await this.saveSettings(current);
      return current;
    } catch (error) {
      console.warn('StorageService resetHighScores error:', error);
      return DEFAULT_SETTINGS;
    }
  }
}
