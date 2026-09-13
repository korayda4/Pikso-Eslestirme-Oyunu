import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';

interface HeartBarProps {
  lives: number;
  maxLives?: number;
  size?: number;
}

export const HeartBar: React.FC<HeartBarProps> = ({
  lives,
  maxLives = 3,
  size = 24,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxLives }).map((_, index) => {
        const isAlive = index < lives;
        return (
          <View key={index} style={styles.heartWrapper}>
            <Ionicons
              name={isAlive ? 'heart' : 'heart-outline'}
              size={size}
              color={isAlive ? THEME.colors.accent : '#CBD5E1'}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartWrapper: {
    marginHorizontal: 3,
  },
});
