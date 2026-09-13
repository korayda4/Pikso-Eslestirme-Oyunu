import { GameDifficulty } from '../types/game';

export const GAME_RULES = {
  INITIAL_LIVES: 3,
  MAX_LIVES: 5,
  BASE_POINTS: 100,
  TIME_BONUS_MULTIPLIER: 5, // extra points per second remaining
  STREAK_BONUS_THRESHOLD: 3, // earn extra life every 5 streak

  getOptionsCount(level: number, difficulty: GameDifficulty): number {
    if (difficulty === 'easy') {
      return level < 6 ? 3 : 4;
    }
    if (difficulty === 'medium') {
      if (level < 4) return 3;
      if (level < 9) return 4;
      return 6;
    }
    // Hard
    if (level < 3) return 4;
    return 6;
  },

  getTimeLimit(level: number, difficulty: GameDifficulty): number {
    let baseTime = 14;
    if (difficulty === 'easy') baseTime = 18;
    if (difficulty === 'hard') baseTime = 10;

    // Gradual time reduction per level, capped at minimum 5 seconds
    const timeReduction = Math.floor((level - 1) * 0.6);
    const minTime = difficulty === 'hard' ? 4 : 6;
    return Math.max(minTime, baseTime - timeReduction);
  },

  getMultiplier(streak: number): number {
    if (streak >= 12) return 2.5;
    if (streak >= 8) return 2.0;
    if (streak >= 5) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
  },
};
