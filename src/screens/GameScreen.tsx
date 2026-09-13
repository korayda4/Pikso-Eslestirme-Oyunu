import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { THEME } from '../theme/theme';
import { useGame } from '../context/GameContext';
import { GameHeader } from '../components/organisms/GameHeader';
import { ScoreBoard } from '../components/molecules/ScoreBoard';
import { QuestionBoard } from '../components/organisms/QuestionBoard';
import { PauseModal } from '../components/organisms/PauseModal';
import { GameOverModal } from '../components/organisms/GameOverModal';
import { AppText } from '../components/atoms/AppText';

interface GameScreenProps {
  onGoHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGoHome }) => {
  const {
    gameState,
    submitAnswer,
    pauseGame,
    resumeGame,
    restartGame,
    quitGame,
    isNewRecord,
  } = useGame();

  const handleGoHome = () => {
    quitGame();
    onGoHome();
  };

  if (!gameState.currentQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <AppText variant="bodyLarge">Oyun Hazırlanıyor...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Top HUD / Header */}
      <GameHeader
        lives={gameState.lives}
        maxLives={gameState.maxLives}
        timeRemaining={gameState.timeRemaining}
        totalTime={gameState.currentQuestion.timeLimit}
        onPause={pauseGame}
      />

      {/* Score & Multiplier HUD */}
      <View style={styles.scoreBoardWrapper}>
        <ScoreBoard
          score={gameState.score}
          level={gameState.level}
          streak={gameState.streak}
          multiplier={gameState.multiplier}
        />
      </View>

      {/* Active Question & Options Grid */}
      <QuestionBoard
        question={gameState.currentQuestion}
        selectedOptionId={gameState.selectedOptionId}
        isProcessing={gameState.isAnswerProcessing}
        onSelectOption={submitAnswer}
      />

      {/* Pause Modal */}
      <PauseModal
        visible={gameState.isPaused}
        score={gameState.score}
        level={gameState.level}
        onResume={resumeGame}
        onRestart={restartGame}
        onHome={handleGoHome}
      />

      {/* Game Over Modal */}
      <GameOverModal
        visible={gameState.isGameOver}
        score={gameState.score}
        level={gameState.level}
        stats={gameState.stats}
        isNewRecord={isNewRecord}
        onRestart={restartGame}
        onHome={handleGoHome}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBoardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
});
