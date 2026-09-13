import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

interface AppTextProps extends TextProps {
  variant?: 'titleLarge' | 'titleMedium' | 'headline' | 'bodyLarge' | 'body' | 'caption';
  color?: string;
  center?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = THEME.colors.textMain,
  center = false,
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        THEME.typography[variant],
        { color },
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
});
