import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ShapeType } from '../../core/types/game';

interface ShapeRendererProps {
  shape: ShapeType;
  colorHex: string;
  size?: number;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shape,
  colorHex,
  size = 54,
}) => {
  switch (shape) {
    case 'circle':
      return (
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colorHex,
            },
          ]}
        />
      );

    case 'square':
      return (
        <View
          style={[
            styles.square,
            {
              width: size * 0.9,
              height: size * 0.9,
              borderRadius: size * 0.18,
              backgroundColor: colorHex,
            },
          ]}
        />
      );

    case 'diamond':
      return (
        <View
          style={[
            styles.diamond,
            {
              width: size * 0.72,
              height: size * 0.72,
              borderRadius: size * 0.12,
              backgroundColor: colorHex,
              transform: [{ rotate: '45deg' }],
            },
          ]}
        />
      );

    case 'triangle':
      return <Ionicons name="triangle" size={size} color={colorHex} />;

    case 'star':
      return <Ionicons name="star" size={size} color={colorHex} />;

    case 'heart':
      return <Ionicons name="heart" size={size} color={colorHex} />;

    case 'hexagon':
      return (
        <MaterialCommunityIcons name="hexagon" size={size * 1.1} color={colorHex} />
      );

    case 'crescent':
      return <Ionicons name="moon" size={size * 0.95} color={colorHex} />;

    default:
      return (
        <View
          style={[
            styles.circle,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: colorHex },
          ]}
        />
      );
  }
};

const styles = StyleSheet.create({
  circle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  square: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  diamond: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
});
