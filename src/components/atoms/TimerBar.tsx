import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../theme/theme';

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  timeRemaining,
  totalTime,
}) => {
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fraction = Math.max(0, Math.min(1, timeRemaining / Math.max(1, totalTime)));
    Animated.timing(progressAnim, {
      toValue: fraction,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [timeRemaining, totalTime]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const getColor = () => {
    const fraction = timeRemaining / Math.max(1, totalTime);
    if (fraction > 0.5) return THEME.colors.mint;
    if (fraction > 0.25) return THEME.colors.warning;
    return THEME.colors.error;
  };

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: widthInterpolated,
            backgroundColor: getColor(),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 10,
    width: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: THEME.radius.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: THEME.radius.full,
  },
});
