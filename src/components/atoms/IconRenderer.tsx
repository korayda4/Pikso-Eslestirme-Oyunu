import React from 'react';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { IconType } from '../../core/types/game';

interface IconRendererProps {
  name: string;
  type?: IconType;
  size?: number;
  color?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  type = 'Ionicons',
  size = 28,
  color = '#2D3142',
}) => {
  switch (type) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    case 'Feather':
      return <Feather name={name as any} size={size} color={color} />;
    case 'Ionicons':
    default:
      return <Ionicons name={name as any} size={size} color={color} />;
  }
};
