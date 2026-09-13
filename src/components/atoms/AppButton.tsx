import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { THEME } from '../../theme/theme';
import { AppText } from './AppText';
import { useAudio } from '../../context/AudioContext';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'mint' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
}) => {
  const { playSfx } = useAudio();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 8,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    playSfx('click');
    onPress();
  };

  // Variant styles
  const getBackgroundColor = () => {
    if (disabled) return '#E2E8F0';
    switch (variant) {
      case 'primary':
        return THEME.colors.primary;
      case 'secondary':
        return THEME.colors.secondary;
      case 'accent':
        return THEME.colors.accent;
      case 'mint':
        return THEME.colors.mint;
      case 'outline':
        return THEME.colors.surface;
      case 'ghost':
        return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    switch (variant) {
      case 'outline':
        return THEME.colors.primary;
      case 'ghost':
        return THEME.colors.textMuted;
      default:
        return '#FFFFFF';
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16, borderRadius: THEME.radius.md };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: 28, borderRadius: THEME.radius.lg };
      case 'md':
      default:
        return { paddingVertical: 14, paddingHorizontal: 22, borderRadius: THEME.radius.md };
    }
  };

  const isOutline = variant === 'outline';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.buttonBase,
          getSizeStyles(),
          { backgroundColor: getBackgroundColor() },
          isOutline && styles.outlineBorder,
          variant !== 'ghost' && !disabled && THEME.shadows.bouncyButton,
        ]}
      >
        {icon && <Animated.View style={styles.iconContainer}>{icon}</Animated.View>}
        <AppText
          variant={size === 'lg' ? 'bodyLarge' : size === 'sm' ? 'caption' : 'body'}
          style={{ color: getTextColor(), fontWeight: '700' }}
        >
          {title}
        </AppText>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  outlineBorder: {
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
});
