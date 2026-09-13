import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { AppButton } from '../atoms/AppButton';
import { Badge } from '../atoms/Badge';
import { GameStats } from '../../core/types/game';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  level: number;
  stats: GameStats;
  isNewRecord: boolean;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  level,
  stats,
  isNewRecord,
  onRestart,
  onHome,
}) => {
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
      : 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, THEME.shadows.medium]}>
          {/* Header Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={isNewRecord ? 'trophy' : 'sparkles'}
              size={44}
              color={isNewRecord ? THEME.colors.yellow : THEME.colors.primary}
            />
          </View>

          {isNewRecord && (
            <View style={styles.recordBadge}>
              <Badge
                label="🎉 YENİ REKOR!"
                color={THEME.colors.yellow}
                backgroundColor={THEME.colors.yellowLight}
              />
            </View>
          )}

          <AppText variant="titleMedium" style={styles.title} center>
            {isNewRecord ? 'Tebrikler Şampiyon!' : 'Oyun Bitti!'}
          </AppText>

          <AppText variant="caption" color={THEME.colors.textMuted} center>
            Harika bir dikkat ve hız sergiledin
          </AppText>

          {/* Main Score Box */}
          <View style={styles.scoreBox}>
            <AppText variant="caption" color={THEME.colors.textMuted}>
              TOPLAM SKOR
            </AppText>
            <AppText variant="titleLarge" style={styles.scoreNumber}>
              {score.toLocaleString()}
            </AppText>
          </View>

          {/* Detailed Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <AppText variant="caption" color={THEME.colors.textMuted}>
                Ulaşılan Seviye
              </AppText>
              <AppText variant="headline" style={styles.statValue}>
                {level}
              </AppText>
            </View>

            <View style={styles.statItem}>
              <AppText variant="caption" color={THEME.colors.textMuted}>
                Doğru Cevap
              </AppText>
              <AppText variant="headline" style={styles.statValue}>
                {stats.correctAnswers}
              </AppText>
            </View>

            <View style={styles.statItem}>
              <AppText variant="caption" color={THEME.colors.textMuted}>
                En Yüksek Seri
              </AppText>
              <AppText variant="headline" style={styles.statValue}>
                {stats.highestStreak}x
              </AppText>
            </View>

            <View style={styles.statItem}>
              <AppText variant="caption" color={THEME.colors.textMuted}>
                İsabet Oranı
              </AppText>
              <AppText variant="headline" style={styles.statValue}>
                %{accuracy}
              </AppText>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <AppButton
              title="Tekrar Oyna"
              onPress={onRestart}
              variant="primary"
              size="lg"
              icon={<Ionicons name="reload" size={20} color="#FFFFFF" />}
              style={styles.actionButton}
            />

            <AppButton
              title="Ana Menü"
              onPress={onHome}
              variant="outline"
              size="md"
              icon={<Ionicons name="home-outline" size={18} color={THEME.colors.primary} />}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  recordBadge: {
    marginBottom: 8,
  },
  title: {
    color: THEME.colors.textMain,
    fontWeight: '800',
  },
  scoreBox: {
    width: '100%',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  scoreNumber: {
    color: THEME.colors.primary,
    fontWeight: '900',
    marginTop: 2,
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  statValue: {
    color: THEME.colors.textMain,
    fontWeight: '800',
    marginTop: 2,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  actionButton: {
    width: '100%',
  },
});
