import { AudioSettings } from './audio';
import { GameDifficulty } from './game';

export interface AppSettings {
  audio: AudioSettings;
  difficulty: GameDifficulty;
  highScores: Record<GameDifficulty, number>;
  vibrationEnabled: boolean;
  totalGamesPlayed: number;
}
