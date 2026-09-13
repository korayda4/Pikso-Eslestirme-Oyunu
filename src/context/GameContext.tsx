import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CameraQuest, GameState, ImageAnalysisResult } from '../core/types/game';
import { GAME_RULES } from '../core/constants/gameRules';
import { QuestManager } from '../engine/QuestManager';
import { useSettings } from './SettingsContext';
import { useAudio } from './AudioContext';

interface GameContextValue {
  gameState: GameState;
  startGame: () => void;
  recordAnalysis: (analysis: ImageAnalysisResult) => void;
  proceedToNextQuest: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  quitGame: () => void;
  isNewRecord: boolean;
}

const initialStats = {
  completedQuests: 0,
  failedQuests: 0,
  bestSimilarity: 0,
  totalScore: 0,
  highestStreak: 0,
};

const initialGameState: GameState = {
  score: 0,
  level: 1,
  lives: GAME_RULES.INITIAL_LIVES,
  maxLives: GAME_RULES.MAX_LIVES,
  streak: 0,
  multiplier: 1.0,
  currentQuest: null,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  isAnalyzing: false,
  lastAnalysis: null,
  timeRemaining: 30,
  stats: initialStats,
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { recordGameScore } = useSettings();
  const { playSfx } = useAudio();

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearGameTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startQuestTimer = (duration: number) => {
    clearGameTimer();
    setGameState((prev) => ({ ...prev, timeRemaining: duration }));

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (!prev.isPlaying || prev.isPaused || prev.isAnalyzing || prev.lastAnalysis || prev.isGameOver) {
          return prev;
        }

        if (prev.timeRemaining <= 1) {
          clearGameTimer();
          handleTimeUp();
          return { ...prev, timeRemaining: 0 };
        }

        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    playSfx('wrong');
    setGameState((prev) => {
      const newLives = prev.lives - 1;
      const isOver = newLives <= 0;

      if (isOver) {
        handleGameOver(prev.score);
      }

      const nextQuest = !isOver ? QuestManager.getNextQuest(prev.level) : prev.currentQuest;

      return {
        ...prev,
        lives: Math.max(0, newLives),
        streak: 0,
        multiplier: 1.0,
        isGameOver: isOver,
        currentQuest: nextQuest,
        stats: {
          ...prev.stats,
          failedQuests: prev.stats.failedQuests + 1,
        },
      };
    });

    setTimeout(() => {
      setGameState((prev) => {
        if (!prev.isGameOver && prev.currentQuest) {
          startQuestTimer(prev.currentQuest.timeLimit);
        }
        return prev;
      });
    }, 500);
  };

  const handleGameOver = async (finalScore: number) => {
    clearGameTimer();
    playSfx('gameover');
    const record = await recordGameScore(finalScore);
    setIsNewRecord(record);
  };

  const startGame = () => {
    setIsNewRecord(false);
    clearGameTimer();

    const firstQuest = QuestManager.getNextQuest(1);

    setGameState({
      ...initialGameState,
      isPlaying: true,
      currentQuest: firstQuest,
      timeRemaining: firstQuest.timeLimit,
    });

    startQuestTimer(firstQuest.timeLimit);
  };

  const recordAnalysis = (analysis: ImageAnalysisResult) => {
    clearGameTimer();

    if (analysis.isSuccess) {
      playSfx('correct');

      setGameState((prev) => {
        const newScore = prev.score + analysis.similarityScore;
        const newStreak = prev.streak + 1;
        const newHighestStreak = Math.max(prev.stats.highestStreak, newStreak);
        const bestSim = Math.max(prev.stats.bestSimilarity, analysis.matchPercentage);

        let newLives = prev.lives;
        if (newStreak % 4 === 0 && newLives < prev.maxLives) {
          newLives += 1;
        }

        return {
          ...prev,
          score: newScore,
          streak: newStreak,
          lives: newLives,
          lastAnalysis: analysis,
          stats: {
            ...prev.stats,
            completedQuests: prev.stats.completedQuests + 1,
            highestStreak: newHighestStreak,
            bestSimilarity: bestSim,
            totalScore: newScore,
          },
        };
      });
    } else {
      playSfx('wrong');

      setGameState((prev) => {
        const newLives = prev.lives - 1;
        const isOver = newLives <= 0;

        if (isOver) {
          handleGameOver(prev.score);
        }

        return {
          ...prev,
          lives: Math.max(0, newLives),
          streak: 0,
          multiplier: 1.0,
          isGameOver: isOver,
          lastAnalysis: analysis,
          stats: {
            ...prev.stats,
            failedQuests: prev.stats.failedQuests + 1,
          },
        };
      });
    }
  };

  const proceedToNextQuest = () => {
    setGameState((prev) => {
      const nextLevel = Math.floor(prev.stats.completedQuests / 2) + 1;
      const nextQuest = QuestManager.getNextQuest(nextLevel);

      startQuestTimer(nextQuest.timeLimit);

      return {
        ...prev,
        level: nextLevel,
        currentQuest: nextQuest,
        lastAnalysis: null,
      };
    });
  };

  const pauseGame = () => {
    clearGameTimer();
    setGameState((prev) => ({ ...prev, isPaused: true }));
  };

  const resumeGame = () => {
    setGameState((prev) => {
      startQuestTimer(prev.timeRemaining);
      return { ...prev, isPaused: false };
    });
  };

  const restartGame = () => {
    startGame();
  };

  const quitGame = () => {
    clearGameTimer();
    setGameState(initialGameState);
  };

  useEffect(() => {
    return () => {
      clearGameTimer();
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        recordAnalysis,
        proceedToNextQuest,
        pauseGame,
        resumeGame,
        restartGame,
        quitGame,
        isNewRecord,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
