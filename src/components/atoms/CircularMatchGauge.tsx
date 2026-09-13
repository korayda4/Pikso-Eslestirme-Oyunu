import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';
import { AppText } from './AppText';

interface CircularMatchGaugeProps {
  percentage: number;
  size?: number;
}

export const CircularMatchGauge: React.FC<CircularMatchGaugeProps> = ({
  percentage,
  size = 110,
}) => {
  const getColor = () => {
    if (percentage >= 85) return THEME.colors.mint;
    if (percentage >= 70) return THEME.colors.primary;
    return THEME.colors.secondary;
  };

  const getBgColor = () => {
    if (percentage >= 85) return THEME.colors.mintLight;
    if (percentage >= 70) return THEME.colors.primaryLight;
    return THEME.colors.secondaryLight;
  };

  const color = getColor();
  const bg = getBgColor();

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor: color,
        },
      ]}
    >
      <AppText variant="titleLarge" style={[styles.percentText, { color }]}>
        %{percentage}
      </AppText>
      <AppText variant="caption" style={[styles.labelText, { color }]}>
        BENZERLİK
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.soft,
  },
  percentText: {
    fontWeight: '900',
    fontSize: 28,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: -2,
    letterSpacing: 0.5,
  },
});
