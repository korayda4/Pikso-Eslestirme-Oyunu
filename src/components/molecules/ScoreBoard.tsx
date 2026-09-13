import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { Badge } from '../atoms/Badge';

interface ScoreBoardProps {
  score: number;
  level: number;
  streak: number;
  multiplier: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  level,
  streak,
  multiplier,
}) => {
  return (
    <View style={styles.container}>
      {/* Level Info */}
      <View style={styles.item}>
        <Badge
          label={`Seviye ${level}`}
          backgroundColor={THEME.colors.primaryLight}
          color={THEME.colors.primary}
        />
      </View>

      {/* Score */}
      <View style={[styles.item, styles.centerItem]}>
        <AppText variant="caption" color={THEME.colors.textMuted}>
          Puan
        </AppText>
        <AppText variant="headline" style={styles.scoreText}>
          {score.toLocaleString()}
        </AppText>
      </View>

      {/* Combo / Multiplier */}
      <View style={[styles.item, styles.rightItem]}>
        {streak >= 2 ? (
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={16} color={THEME.colors.secondary} />
            <Badge
              label={`${multiplier}x`}
              backgroundColor={THEME.colors.secondaryLight}
              color={THEME.colors.secondary}
              size="sm"
            />
          </View>
        ) : (
          <AppText variant="caption" color={THEME.colors.textLight}>
            Seri: {streak}
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.lg,
    ...THEME.shadows.soft,
  },
  item: {
    flex: 1,
  },
  centerItem: {
    alignItems: 'center',
  },
  rightItem: {
    alignItems: 'flex-end',
  },
  scoreText: {
    color: THEME.colors.textMain,
    fontWeight: '800',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
