import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { QuestionOption } from '../../core/types/game';
import { THEME } from '../../theme/theme';
import { ShapeRenderer } from '../atoms/ShapeRenderer';
import { IconRenderer } from '../atoms/IconRenderer';
import { AppText } from '../atoms/AppText';

interface AnswerCardProps {
  option: QuestionOption;
  onPress: (id: string) => void;
  isSelected: boolean;
  isProcessing: boolean;
  columnCount?: 2 | 3;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  option,
  onPress,
  isSelected,
  isProcessing,
  columnCount = 2,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (isProcessing) return;
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 35,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
    }).start();
  };

  // Determine feedback style if selected & processing
  let cardBg = THEME.colors.surface;
  let cardBorder = THEME.colors.surfaceBorder;

  if (isSelected && isProcessing) {
    if (option.isCorrect) {
      cardBg = THEME.colors.successLight;
      cardBorder = THEME.colors.success;
    } else {
      cardBg = THEME.colors.errorLight;
      cardBorder = THEME.colors.error;
    }
  }

  const isThreeCol = columnCount === 3;
  const iconSize = isThreeCol ? 38 : 50;

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { width: isThreeCol ? '31%' : '47.5%', transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => !isProcessing && onPress(option.id)}
        disabled={isProcessing}
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
          },
          THEME.shadows.soft,
        ]}
      >
        <View style={styles.visualContainer}>
          {option.shape ? (
            <ShapeRenderer
              shape={option.shape}
              colorHex={option.colorHex || THEME.colors.primary}
              size={iconSize}
            />
          ) : option.icon ? (
            <IconRenderer
              name={option.icon}
              type={option.iconType}
              size={iconSize}
              color={option.colorHex || THEME.colors.textMain}
            />
          ) : null}
        </View>

        <AppText
          variant={isThreeCol ? 'caption' : 'body'}
          style={styles.labelText}
          numberOfLines={2}
          center
        >
          {option.label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 7,
  },
  card: {
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 125,
  },
  visualContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
});
