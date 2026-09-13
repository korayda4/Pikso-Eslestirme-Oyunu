import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme/theme';
import { useGame } from '../context/GameContext';
import { HeartBar } from '../components/atoms/HeartBar';
import { AppText } from '../components/atoms/AppText';
import { AppButton } from '../components/atoms/AppButton';
import { PhotoAnalysisModal } from '../components/organisms/PhotoAnalysisModal';
import { PauseModal } from '../components/organisms/PauseModal';
import { GameOverModal } from '../components/organisms/GameOverModal';
import { FloatingComboBadge } from '../components/atoms/FloatingComboBadge';
import { ImageAnalyzer } from '../engine/ImageAnalyzer';
import { ImageAnalysisResult } from '../core/types/game';

interface GameScreenProps {
  onGoHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGoHome }) => {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const {
    gameState,
    recordAnalysis,
    proceedToNextQuest,
    pauseGame,
    resumeGame,
    restartGame,
    quitGame,
    isNewRecord,
  } = useGame();

  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);

  const shutterScale = useRef(new Animated.Value(1)).current;

  // Auto-switch camera facing based on quest type
  useEffect(() => {
    if (gameState.currentQuest) {
      if (gameState.currentQuest.isFaceQuest || gameState.currentQuest.category === 'funny') {
        setFacing('front');
      } else {
        setFacing('back');
      }
    }
  }, [gameState.currentQuest?.id]);

  const handleFlipCamera = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (isCapturing || !cameraRef.current || !gameState.currentQuest) return;

    // Tactile press bounce
    Animated.sequence([
      Animated.timing(shutterScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(shutterScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });

      if (photo && photo.uri) {
        // Genuine offline algorithmic analysis
        const result = await ImageAnalyzer.analyze(
          photo.uri,
          gameState.currentQuest,
          gameState.timeRemaining,
          photo.base64
        );
        setAnalysisResult(result);
        recordAnalysis(result);
      }
    } catch (e) {
      console.warn('Camera takePictureAsync error:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleContinueNext = () => {
    setAnalysisResult(null);
    proceedToNextQuest();
  };

  const handleRetryCapture = () => {
    setAnalysisResult(null);
  };

  const handleGoHome = () => {
    quitGame();
    onGoHome();
  };

  // Permission handling
  if (!permission) {
    return (
      <View style={[styles.centerScreen, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.centerScreen,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 24,
          },
        ]}
      >
        <Ionicons name="camera-outline" size={64} color={THEME.colors.primary} />
        <AppText variant="titleMedium" style={styles.permTitle} center>
          Kamera İzni Gerekiyor
        </AppText>
        <AppText variant="body" color={THEME.colors.textMuted} style={styles.permDesc} center>
          Pikso ile etraftaki eşyaları ve komik yüz pozlarını yakalayabilmek için kamera erişimine izin vermen gerekiyor.
        </AppText>
        <AppButton
          title="Kameraya İzin Ver"
          onPress={requestPermission}
          variant="primary"
          size="lg"
          style={{ width: '100%', marginTop: 20 }}
        />
        <AppButton
          title="Ana Menüye Dön"
          onPress={handleGoHome}
          variant="ghost"
          size="md"
          style={{ width: '100%', marginTop: 8 }}
        />
      </View>
    );
  }

  const quest = gameState.currentQuest;

  return (
    <View style={styles.container}>
      {/* 1. DIRECT LIVE CAMERA VIEW IN FULL SCREEN */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
      />

      {/* 2. FLOATING TOP HUD (SAFE AREA AWARE) */}
      <View
        style={[
          styles.floatingTopContainer,
          { paddingTop: Math.max(insets.top, 14) },
        ]}
      >
        {/* Floating Top Stats Bar */}
        <View style={[styles.floatingStatsRow, THEME.shadows.medium]}>
          <Pressable onPress={pauseGame} style={styles.hudIconButton}>
            <Ionicons name="pause" size={18} color={THEME.colors.textMain} />
          </Pressable>

          <HeartBar lives={gameState.lives} maxLives={gameState.maxLives} size={22} />

          <View
            style={[
              styles.timerPill,
              gameState.timeRemaining <= 5 && styles.timerWarning,
            ]}
          >
            <Ionicons
              name="time-outline"
              size={15}
              color={gameState.timeRemaining <= 5 ? THEME.colors.error : THEME.colors.textMain}
            />
            <AppText
              variant="caption"
              style={[
                styles.timerText,
                gameState.timeRemaining <= 5 && { color: THEME.colors.error },
              ]}
            >
              {gameState.timeRemaining}s
            </AppText>
          </View>

          <View style={styles.scorePill}>
            <Ionicons name="trophy" size={15} color={THEME.colors.yellow} />
            <AppText variant="caption" style={styles.scoreText}>
              {gameState.score}
            </AppText>
          </View>
        </View>

        {/* Floating Question / Quest Card */}
        {quest && (
          <View style={[styles.floatingQuestCard, THEME.shadows.medium]}>
            <View style={styles.questHeader}>
              <View style={styles.questEmojiCircle}>
                <AppText style={styles.questEmoji}>{quest.emoji}</AppText>
              </View>
              <View style={styles.questTextContainer}>
                <AppText variant="caption" color={THEME.colors.primary} style={styles.questBadge}>
                  {quest.badgeText}
                </AppText>
                <AppText variant="headline" style={styles.questPrompt} numberOfLines={2}>
                  {quest.prompt}
                </AppText>
              </View>
            </View>
          </View>
        )}

        {/* Floating Animated Combo Multiplier Badge */}
        <FloatingComboBadge
          streak={gameState.streak}
          multiplier={gameState.multiplier}
        />
      </View>

      {/* 3. FLOATING BOTTOM SHUTTER CONTROLS */}
      <View
        style={[
          styles.floatingBottomContainer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        {/* Flip Camera Button */}
        <Pressable
          onPress={handleFlipCamera}
          style={[styles.flipButton, THEME.shadows.medium]}
        >
          <Ionicons name="camera-reverse-outline" size={26} color="#FFFFFF" />
        </Pressable>

        {/* Central Shutter Button */}
        <Animated.View style={{ transform: [{ scale: shutterScale }] }}>
          <Pressable
            onPress={handleCapture}
            disabled={isCapturing}
            style={[styles.shutterOuterRing, THEME.shadows.medium]}
          >
            <View style={styles.shutterInnerCircle}>
              {isCapturing ? (
                <ActivityIndicator size="small" color={THEME.colors.primary} />
              ) : (
                <Ionicons name="camera" size={32} color={THEME.colors.primary} />
              )}
            </View>
          </Pressable>
        </Animated.View>

        {/* Camera Facing Label Pill */}
        <View style={styles.facingIndicator}>
          <AppText variant="caption" style={styles.facingText}>
            {facing === 'front' ? 'Ön Kamera' : 'Arka Kamera'}
          </AppText>
        </View>
      </View>

      {/* Analysis Result Modal */}
      <PhotoAnalysisModal
        visible={!!analysisResult}
        result={analysisResult}
        onContinue={handleContinueNext}
        onRetry={handleRetryCapture}
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerScreen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permTitle: {
    fontWeight: '800',
    color: THEME.colors.textMain,
    marginTop: 16,
    marginBottom: 8,
  },
  permDesc: {
    lineHeight: 22,
    maxWidth: 300,
  },
  floatingTopContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  floatingStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: THEME.radius.full,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  hudIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timerWarning: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  timerText: {
    fontWeight: '800',
    color: THEME.colors.textMain,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.full,
    gap: 4,
  },
  scoreText: {
    fontWeight: '900',
    color: '#92400E',
  },
  floatingQuestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: THEME.radius.xl,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: THEME.colors.primaryLight,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questEmojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questEmoji: {
    fontSize: 28,
  },
  questTextContainer: {
    flex: 1,
  },
  questBadge: {
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 11,
    marginBottom: 2,
  },
  questPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textMain,
    lineHeight: 20,
  },
  floatingBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    zIndex: 10,
  },
  shutterOuterRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInnerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  facingIndicator: {
    width: 52,
    alignItems: 'center',
  },
  facingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
