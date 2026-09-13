import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { AppButton } from '../atoms/AppButton';
import { CircularMatchGauge } from '../atoms/CircularMatchGauge';
import { ImageAnalysisResult } from '../../core/types/game';

interface PhotoAnalysisModalProps {
  visible: boolean;
  result: ImageAnalysisResult | null;
  onContinue: () => void;
  onRetry: () => void;
}

export const PhotoAnalysisModal: React.FC<PhotoAnalysisModalProps> = ({
  visible,
  result,
  onContinue,
  onRetry,
}) => {
  if (!result) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.card, THEME.shadows.medium]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Title */}
            <AppText variant="titleMedium" style={styles.headerTitle} center>
              {result.feedbackTitle}
            </AppText>

            {/* Photo Preview & Circular Gauge */}
            <View style={styles.visualRow}>
              {result.photoUri ? (
                <Image
                  source={{ uri: result.photoUri }}
                  style={styles.photoPreview}
                  resizeMode="cover"
                />
              ) : null}

              <View style={styles.gaugeContainer}>
                <CircularMatchGauge percentage={result.matchPercentage} />
              </View>
            </View>

            {/* Score Pill */}
            <View style={styles.scorePill}>
              <Ionicons name="sparkles" size={18} color={THEME.colors.yellow} />
              <AppText variant="bodyLarge" style={styles.scoreText}>
                +{result.similarityScore} Puan Kazanıldı!
              </AppText>
            </View>

            {/* Humorous / Encouraging Feedback */}
            <View style={styles.feedbackBox}>
              <AppText variant="body" style={styles.feedbackText} center>
                {result.feedbackMessage}
              </AppText>
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
              <AppButton
                title="Sonraki Göreve Geç"
                onPress={onContinue}
                variant="primary"
                size="lg"
                icon={<Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
                style={styles.actionBtn}
              />

              <AppButton
                title="Tekrar Fotoğraf Çek"
                onPress={onRetry}
                variant="ghost"
                size="sm"
                icon={<Ionicons name="camera-reverse-outline" size={18} color={THEME.colors.textMuted} />}
                style={styles.actionBtn}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: 22,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '900',
    color: THEME.colors.textMain,
    marginBottom: 16,
  },
  visualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: THEME.radius.lg,
    borderWidth: 3,
    borderColor: THEME.colors.surfaceBorder,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.yellowLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.full,
    gap: 6,
    marginBottom: 14,
  },
  scoreText: {
    color: '#92400E',
    fontWeight: '800',
    fontSize: 16,
  },
  feedbackBox: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  feedbackText: {
    color: THEME.colors.textMain,
    lineHeight: 22,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    gap: 8,
  },
  actionBtn: {
    width: '100%',
  },
});
