import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from './AppText';

interface FloatingComboBadgeProps {
  streak: number;
  multiplier: number;
}

export const FloatingComboBadge: React.FC<FloatingComboBadgeProps> = ({
  streak,
  multiplier,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Punchy spring pop when streak increases
  useEffect(() => {
    if (streak >= 2) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.28,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [streak]);

  // Gentle floating pulse loop
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  if (streak < 2) return null;

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
        THEME.shadows.medium,
      ]}
    >
      <View style={styles.badgeContent}>
        <Ionicons name="flame" size={20} color="#F97316" />
        <AppText variant="caption" style={styles.comboLabel}>
          KOMBO
        </AppText>
        <View style={styles.multiplierPill}>
          <AppText style={styles.multiplierText}>{multiplier.toFixed(1)}x</AppText>
        </View>
        <AppText variant="caption" style={styles.streakCount}>
          ({streak} Seri)
        </AppText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: THEME.radius.full,
    borderWidth: 2,
    borderColor: '#FB923C',
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  comboLabel: {
    fontWeight: '900',
    color: '#C2410C',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  multiplierPill: {
    backgroundColor: '#EA580C',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.full,
  },
  multiplierText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  streakCount: {
    color: '#9A3412',
    fontWeight: '700',
    fontSize: 11,
  },
});
