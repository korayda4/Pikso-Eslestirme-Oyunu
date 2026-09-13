import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { THEME } from '../../theme/theme';
import { AppText } from './AppText';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = THEME.colors.primary,
  backgroundColor = THEME.colors.primaryLight,
  size = 'md',
  style,
}) => {
  const isSm = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingVertical: isSm ? 3 : 5,
          paddingHorizontal: isSm ? 8 : 12,
        },
        style,
      ]}
    >
      <AppText
        variant="caption"
        style={{ color, fontWeight: '700', fontSize: isSm ? 11 : 12 }}
      >
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: THEME.radius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
