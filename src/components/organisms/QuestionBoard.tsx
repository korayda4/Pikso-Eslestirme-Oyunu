import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Question } from '../../core/types/game';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { Badge } from '../atoms/Badge';
import { AnswerCard } from '../molecules/AnswerCard';

interface QuestionBoardProps {
  question: Question;
  selectedOptionId: string | null;
  isProcessing: boolean;
  onSelectOption: (optionId: string) => void;
}

export const QuestionBoard: React.FC<QuestionBoardProps> = ({
  question,
  selectedOptionId,
  isProcessing,
  onSelectOption,
}) => {
  const optionsCount = question.options.length;
  const isThreeCol = optionsCount === 6;

  return (
    <View style={styles.container}>
      {/* Prompt Bubble Card */}
      <View style={[styles.promptCard, THEME.shadows.medium]}>
        <View style={styles.badgeRow}>
          <Badge
            label={question.badgeText}
            color={question.badgeColor || THEME.colors.primary}
            backgroundColor={THEME.colors.surfaceSubtle}
          />
        </View>

        <AppText variant="titleMedium" style={styles.promptText} center>
          {question.prompt}
        </AppText>

        {question.subPrompt && (
          <AppText
            variant="caption"
            color={THEME.colors.textMuted}
            style={styles.subPromptText}
            center
          >
            {question.subPrompt}
          </AppText>
        )}
      </View>

      {/* Options Grid */}
      <ScrollView
        contentContainerStyle={[
          styles.optionsGrid,
          isThreeCol && styles.threeColGrid,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {question.options.map((opt) => (
          <AnswerCard
            key={opt.id}
            option={opt}
            isSelected={selectedOptionId === opt.id}
            isProcessing={isProcessing}
            onPress={onSelectOption}
            columnCount={isThreeCol ? 3 : 2}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  promptCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
  },
  badgeRow: {
    marginBottom: 8,
  },
  promptText: {
    color: THEME.colors.textMain,
    lineHeight: 30,
    fontWeight: '800',
  },
  subPromptText: {
    marginTop: 6,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  threeColGrid: {
    justifyContent: 'space-between',
  },
});
