import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { HeartBar } from '../atoms/HeartBar';
import { TimerBar } from '../atoms/TimerBar';
import { AppText } from '../atoms/AppText';
import { useAudio } from '../../context/AudioContext';

interface GameHeaderProps {
  lives: number;
  maxLives: number;
  timeRemaining: number;
  totalTime: number;
  onPause: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  lives,
  maxLives,
  timeRemaining,
  totalTime,
  onPause,
}) => {
  const { playSfx } = useAudio();

  const handlePause = () => {
    playSfx('click');
    onPause();
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        {/* Pause Button */}
        <Pressable
          onPress={handlePause}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
        >
          <Ionicons name="pause" size={20} color={THEME.colors.textMain} />
        </Pressable>

        {/* Lives / Hearts */}
        <HeartBar lives={lives} maxLives={maxLives} size={26} />

        {/* Timer countdown text */}
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={16} color={THEME.colors.textMuted} />
          <AppText
            variant="body"
            style={[
              styles.timerText,
              timeRemaining <= 3 && { color: THEME.colors.error },
            ]}
          >
            {timeRemaining}s
          </AppText>
        </View>
      </View>

      {/* Animated Timer Progress Bar */}
      <View style={styles.timerBarWrapper}>
        <TimerBar timeRemaining={timeRemaining} totalTime={totalTime} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.soft,
  },
  iconButtonPressed: {
    backgroundColor: '#F1F5F9',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.full,
    gap: 4,
    ...THEME.shadows.soft,
  },
  timerText: {
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
  timerBarWrapper: {
    marginTop: 4,
  },
});
