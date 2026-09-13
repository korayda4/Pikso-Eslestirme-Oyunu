import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraQuest } from '../../core/types/game';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { Badge } from '../atoms/Badge';

interface QuestCardProps {
  quest: CameraQuest;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  return (
    <View style={[styles.card, THEME.shadows.medium]}>
      {/* Category Badge & Emoji */}
      <View style={styles.topRow}>
        <Badge
          label={quest.badgeText}
          color={quest.badgeColor}
          backgroundColor={THEME.colors.surfaceSubtle}
        />
        <View style={styles.emojiCircle}>
          <AppText style={styles.emojiText}>{quest.emoji}</AppText>
        </View>
      </View>

      {/* Quest Title */}
      <AppText variant="headline" style={styles.title}>
        {quest.title}
      </AppText>

      {/* Main Prompt */}
      <AppText variant="titleMedium" style={styles.prompt}>
        {quest.prompt}
      </AppText>

      {/* Hint Bubble */}
      <View style={styles.hintBox}>
        <AppText style={styles.hintIcon}>💡</AppText>
        <AppText variant="body" color={THEME.colors.textMuted} style={styles.hintText}>
          {quest.hint}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 22,
    borderWidth: 2,
    borderColor: THEME.colors.surfaceBorder,
    marginVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 28,
  },
  title: {
    color: THEME.colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prompt: {
    color: THEME.colors.textMain,
    fontWeight: '900',
    lineHeight: 30,
    marginBottom: 14,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.md,
    padding: 12,
    gap: 8,
  },
  hintIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  hintText: {
    flex: 1,
    lineHeight: 20,
    fontSize: 14,
  },
});
