import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { GameState, Question } from '../core/types/game';
import { GAME_RULES } from '../core/constants/gameRules';
import { QuestionGenerator } from '../engine/QuestionGenerator';
import { useSettings } from './SettingsContext';
import { useAudio } from './AudioContext';

interface GameContextValue {
  gameState: GameState;
  startGame: () => void;
  submitAnswer: (optionId: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  quitGame: () => void;
  isNewRecord: boolean;
}

const initialStats = {
  correctAnswers: 0,
  wrongAnswers: 0,
  totalQuestions: 0,
  highestStreak: 0,
};

const initialGameState: GameState = {
  score: 0,
  level: 1,
  lives: GAME_RULES.INITIAL_LIVES,
  maxLives: GAME_RULES.MAX_LIVES,
  streak: 0,
  multiplier: 1.0,
  currentQuestion: null,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  isAnswerProcessing: false,
  selectedOptionId: null,
  timeRemaining: 15,
  stats: initialStats,
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, recordGameScore } = useSettings();
  const { playSfx } = useAudio();

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear timer helper
  const clearGameTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start countdown timer
  const startQuestionTimer = (duration: number) => {
    clearGameTimer();
    setGameState((prev) => ({ ...prev, timeRemaining: duration }));

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (!prev.isPlaying || prev.isPaused || prev.isAnswerProcessing || prev.isGameOver) {
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

  // Handle when timer runs out
  const handleTimeUp = () => {
    playSfx('wrong');
    setGameState((prev) => {
      const newLives = prev.lives - 1;
      const isOver = newLives <= 0;

      if (isOver) {
        handleGameOver(prev.score);
      }

      const nextQuestion = !isOver
        ? QuestionGenerator.generate(prev.level, settings.difficulty)
        : prev.currentQuestion;

      return {
        ...prev,
        lives: Math.max(0, newLives),
        streak: 0,
        multiplier: 1.0,
        isGameOver: isOver,
        currentQuestion: nextQuestion,
        stats: {
          ...prev.stats,
          wrongAnswers: prev.stats.wrongAnswers + 1,
          totalQuestions: prev.stats.totalQuestions + 1,
        },
      };
    });

    // If still alive, restart timer for next question
    setTimeout(() => {
      setGameState((prev) => {
        if (!prev.isGameOver && prev.currentQuestion) {
          startQuestionTimer(prev.currentQuestion.timeLimit);
        }
        return prev;
      });
    }, 400);
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

    const firstQuestion = QuestionGenerator.generate(1, settings.difficulty);

    setGameState({
      ...initialGameState,
      isPlaying: true,
      currentQuestion: firstQuestion,
      timeRemaining: firstQuestion.timeLimit,
    });

    startQuestionTimer(firstQuestion.timeLimit);
  };

  const submitAnswer = (optionId: string) => {
    if (
      !gameState.isPlaying ||
      gameState.isPaused ||
      gameState.isGameOver ||
      gameState.isAnswerProcessing ||
      !gameState.currentQuestion
    ) {
      return;
    }

    clearGameTimer();
    const selected = gameState.currentQuestion.options.find((o) => o.id === optionId);
    const isCorrect = !!selected?.isCorrect;

    setGameState((prev) => ({
      ...prev,
      isAnswerProcessing: true,
      selectedOptionId: optionId,
    }));

    if (isCorrect) {
      playSfx('correct');

      setTimeout(() => {
        setGameState((prev) => {
          const newStreak = prev.streak + 1;
          const newHighestStreak = Math.max(prev.stats.highestStreak, newStreak);
          const currentMultiplier = GAME_RULES.getMultiplier(newStreak);

          // Calculate points
          const timeBonus = prev.timeRemaining * GAME_RULES.TIME_BONUS_MULTIPLIER;
          const pointsEarned = Math.round(
            (GAME_RULES.BASE_POINTS + timeBonus) * currentMultiplier
          );
          const newScore = prev.score + pointsEarned;

          // Check streak life bonus (every 5 streak gives 1 heart if not full)
          let newLives = prev.lives;
          if (newStreak % 5 === 0 && newLives < prev.maxLives) {
            newLives += 1;
          }

          // Level progression every 4 correct answers
          const newTotalCorrect = prev.stats.correctAnswers + 1;
          const newLevel = Math.floor(newTotalCorrect / 3) + 1;

          const nextQuestion = QuestionGenerator.generate(newLevel, settings.difficulty);

          startQuestionTimer(nextQuestion.timeLimit);

          return {
            ...prev,
            score: newScore,
            streak: newStreak,
            level: newLevel,
            lives: newLives,
            multiplier: currentMultiplier,
            currentQuestion: nextQuestion,
            isAnswerProcessing: false,
            selectedOptionId: null,
            stats: {
              ...prev.stats,
              correctAnswers: newTotalCorrect,
              highestStreak: newHighestStreak,
              totalQuestions: prev.stats.totalQuestions + 1,
            },
          };
        });
      }, 550);
    } else {
      playSfx('wrong');

      setTimeout(() => {
        setGameState((prev) => {
          const newLives = prev.lives - 1;
          const isOver = newLives <= 0;

          if (isOver) {
            handleGameOver(prev.score);
            return {
              ...prev,
              lives: 0,
              streak: 0,
              multiplier: 1.0,
              isGameOver: true,
              isAnswerProcessing: false,
              selectedOptionId: null,
              stats: {
                ...prev.stats,
                wrongAnswers: prev.stats.wrongAnswers + 1,
                totalQuestions: prev.stats.totalQuestions + 1,
              },
            };
          }

          const nextQuestion = QuestionGenerator.generate(prev.level, settings.difficulty);
          startQuestionTimer(nextQuestion.timeLimit);

          return {
            ...prev,
            lives: newLives,
            streak: 0,
            multiplier: 1.0,
            currentQuestion: nextQuestion,
            isAnswerProcessing: false,
            selectedOptionId: null,
            stats: {
              ...prev.stats,
              wrongAnswers: prev.stats.wrongAnswers + 1,
              totalQuestions: prev.stats.totalQuestions + 1,
            },
          };
        });
      }, 700);
    }
  };

  const pauseGame = () => {
    clearGameTimer();
    setGameState((prev) => ({ ...prev, isPaused: true }));
  };

  const resumeGame = () => {
    setGameState((prev) => {
      startQuestionTimer(prev.timeRemaining);
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
        submitAnswer,
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
