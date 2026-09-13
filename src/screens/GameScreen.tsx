import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme/theme';
import { useGame } from '../context/GameContext';
import { GameHeader } from '../components/organisms/GameHeader';
import { ScoreBoard } from '../components/molecules/ScoreBoard';
import { QuestCard } from '../components/organisms/QuestCard';
import { PhotoAnalysisModal } from '../components/organisms/PhotoAnalysisModal';
import { PauseModal } from '../components/organisms/PauseModal';
import { GameOverModal } from '../components/organisms/GameOverModal';
import { AppButton } from '../components/atoms/AppButton';
import { AppText } from '../components/atoms/AppText';

interface GameScreenProps {
  onGoHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGoHome }) => {
  const insets = useSafeAreaInsets();
  const {
    gameState,
    capturePhoto,
    pickFromGallery,
    proceedToNextQuest,
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

  if (!gameState.currentQuest) {
    return (
      <View
        style={[
          styles.screen,
          styles.center,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <AppText variant="bodyLarge" style={{ marginTop: 12 }}>
          Görev Yükleniyor...
        </AppText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {/* Top Game HUD */}
      <GameHeader
        lives={gameState.lives}
        maxLives={gameState.maxLives}
        timeRemaining={gameState.timeRemaining}
        totalTime={gameState.currentQuest.timeLimit}
        onPause={pauseGame}
      />

      {/* Score and Streak HUD */}
      <View style={styles.scoreWrapper}>
        <ScoreBoard
          score={gameState.score}
          level={gameState.level}
          streak={gameState.streak}
          multiplier={gameState.multiplier}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quest Card */}
        <QuestCard quest={gameState.currentQuest} />

        {/* Analyzing Spinner or Shutter Trigger Section */}
        {gameState.isAnalyzing ? (
          <View style={[styles.analyzingCard, THEME.shadows.soft]}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
            <AppText variant="headline" style={styles.analyzingTitle}>
              Pikso Analiz Ediyor...
            </AppText>
            <AppText variant="caption" color={THEME.colors.textMuted} center>
              Fotoğraftaki renkler, formlar ve yüz ifadeleri inceleniyor
            </AppText>
          </View>
        ) : (
          <View style={styles.cameraActionSection}>
            <AppButton
              title="Fotoğraf Çek & Analiz Et"
              onPress={capturePhoto}
              variant="primary"
              size="lg"
              icon={<Ionicons name="camera" size={26} color="#FFFFFF" />}
              style={styles.shutterBtn}
            />

            <AppButton
              title="Galeriden Resim Seç"
              onPress={pickFromGallery}
              variant="outline"
              size="md"
              icon={<Ionicons name="images-outline" size={20} color={THEME.colors.primary} />}
              style={styles.galleryBtn}
            />
          </View>
        )}
      </ScrollView>

      {/* Analysis Result Modal */}
      <PhotoAnalysisModal
        visible={!!gameState.lastAnalysis}
        result={gameState.lastAnalysis}
        onContinue={proceedToNextQuest}
        onRetry={capturePhoto}
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreWrapper: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cameraActionSection: {
    gap: 12,
    marginTop: 10,
  },
  shutterBtn: {
    width: '100%',
  },
  galleryBtn: {
    width: '100%',
  },
  analyzingCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
  },
  analyzingTitle: {
    color: THEME.colors.textMain,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 4,
  },
});
