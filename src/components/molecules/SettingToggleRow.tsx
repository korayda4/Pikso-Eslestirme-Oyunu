import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';

interface SettingToggleRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export const SettingToggleRow: React.FC<SettingToggleRowProps> = ({
  iconName,
  iconColor = THEME.colors.primary,
  iconBg = THEME.colors.primaryLight,
  title,
  description,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>

      <View style={styles.textContainer}>
        <AppText variant="bodyLarge" style={styles.title}>
          {title}
        </AppText>
        {description && (
          <AppText variant="caption" color={THEME.colors.textMuted}>
            {description}
          </AppText>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CBD5E1', true: THEME.colors.primary }}
        thumbColor={value ? '#FFFFFF' : '#F1F5F9'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
});
