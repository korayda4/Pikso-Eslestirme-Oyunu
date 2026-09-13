import {
  GameDifficulty,
  Question,
  QuestionCategory,
  QuestionOption,
} from '../core/types/game';
import { GAME_SHAPES, ShapeInfo } from '../core/constants/shapes';
import { GAME_COLORS } from '../core/constants/colors';
import { GAME_CONCEPTS } from '../core/constants/concepts';
import { GAME_RULES } from '../core/constants/gameRules';
import { THEME } from '../theme/theme';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export class QuestionGenerator {
  private static lastTargetId: string = '';

  public static generate(level: number, difficulty: GameDifficulty): Question {
    const optionsCount = GAME_RULES.getOptionsCount(level, difficulty);
    const timeLimit = GAME_RULES.getTimeLimit(level, difficulty);

    // Determine category based on level
    let category: QuestionCategory = 'shape-color';
    if (level >= 3 && level < 8) {
      // 50% shape-color, 50% concept
      category = Math.random() > 0.5 ? 'concept' : 'shape-color';
    } else if (level >= 8) {
      // 35% shape-color, 45% concept, 20% hybrid
      const r = Math.random();
      if (r < 0.35) category = 'shape-color';
      else if (r < 0.8) category = 'concept';
      else category = 'hybrid';
    }

    switch (category) {
      case 'concept':
        return this.generateConceptQuestion(optionsCount, timeLimit);
      case 'hybrid':
        return this.generateHybridQuestion(optionsCount, timeLimit);
      case 'shape-color':
      default:
        return this.generateShapeColorQuestion(optionsCount, timeLimit, level);
    }
  }

  // 1. Şekil + Renk Tanıma
  private static generateShapeColorQuestion(
    optionsCount: number,
    timeLimit: number,
    level: number
  ): Question {
    const isNegation = level >= 9 && Math.random() < 0.25;

    // Pick target shape and color
    const targetShape = randomItem(GAME_SHAPES);
    const targetColor = randomItem(GAME_COLORS);

    // Pick distinct distractor combinations
    const options: QuestionOption[] = [];

    if (!isNegation) {
      // Normal: Find "TargetColor TargetShape"
      options.push({
        id: `${targetShape.type}-${targetColor.id}-correct`,
        label: `${targetColor.name} ${targetShape.nameTr}`,
        shape: targetShape.type,
        colorHex: targetColor.hex,
        isCorrect: true,
      });

      // Distractors: Same shape different color, or same color different shape, or both different
      const usedCombos = new Set<string>([`${targetShape.type}-${targetColor.id}`]);

      while (options.length < optionsCount) {
        const shape = randomItem(GAME_SHAPES);
        const color = randomItem(GAME_COLORS);
        const comboKey = `${shape.type}-${color.id}`;

        if (!usedCombos.has(comboKey)) {
          usedCombos.add(comboKey);
          options.push({
            id: `${shape.type}-${color.id}-${options.length}`,
            label: `${color.name} ${shape.nameTr}`,
            shape: shape.type,
            colorHex: color.hex,
            isCorrect: false,
          });
        }
      }

      const prompt = `"${targetColor.name} ${targetShape.nameTr}" şeklini bul!`;

      return {
        id: `sc-${Date.now()}-${Math.random()}`,
        category: 'shape-color',
        title: 'Şekil & Renk Avı',
        prompt,
        subPrompt: 'Doğru renk ve şekil eşleşmesini seç',
        badgeText: 'Şekil & Renk',
        badgeColor: THEME.colors.primary,
        targetId: `${targetShape.type}-${targetColor.id}`,
        options: shuffle(options),
        timeLimit,
      };
    } else {
      // Negation: e.g. "Daire OLMAYAN şekli bul!"
      const nonShape = targetShape;
      const otherShapes = GAME_SHAPES.filter((s) => s.type !== nonShape.type);

      // 1 correct option (NOT the nonShape)
      const correctShape = randomItem(otherShapes);
      const correctColor = randomItem(GAME_COLORS);
      options.push({
        id: `not-${correctShape.type}-${correctColor.id}`,
        label: `${correctColor.name} ${correctShape.nameTr}`,
        shape: correctShape.type,
        colorHex: correctColor.hex,
        isCorrect: true,
      });

      // Distractors: Must be the nonShape with different colors!
      const shuffledColors = shuffle(GAME_COLORS);
      for (let i = 0; options.length < optionsCount; i++) {
        const color = shuffledColors[i % shuffledColors.length];
        options.push({
          id: `distractor-${nonShape.type}-${color.id}-${i}`,
          label: `${color.name} ${nonShape.nameTr}`,
          shape: nonShape.type,
          colorHex: color.hex,
          isCorrect: false,
        });
      }

      return {
        id: `sc-neg-${Date.now()}-${Math.random()}`,
        category: 'shape-color',
        title: 'Dikkat & Fark Etme',
        prompt: `"${nonShape.nameTr}" OLMAYAN şekli seç!`,
        subPrompt: 'Çeldiricilere dikkat et, farklı olanı bul',
        badgeText: 'Özel Görev',
        badgeColor: THEME.colors.secondary,
        targetId: nonShape.type,
        options: shuffle(options),
        timeLimit,
      };
    }
  }

  // 2. Benzerlik & Kavramsal Çağrışım
  private static generateConceptQuestion(
    optionsCount: number,
    timeLimit: number
  ): Question {
    // Pick target item avoiding last target if possible
    let pool = GAME_CONCEPTS.filter((c) => c.id !== this.lastTargetId);
    if (pool.length === 0) pool = GAME_CONCEPTS;
    const target = randomItem(pool);
    this.lastTargetId = target.id;

    // Pick distractors
    const distractors = shuffle(GAME_CONCEPTS.filter((c) => c.id !== target.id)).slice(
      0,
      optionsCount - 1
    );

    const options: QuestionOption[] = [
      {
        id: `concept-${target.id}`,
        label: target.name,
        icon: target.icon,
        iconType: target.iconType,
        colorHex: target.color,
        isCorrect: true,
      },
      ...distractors.map((d) => ({
        id: `concept-${d.id}`,
        label: d.name,
        icon: d.icon,
        iconType: d.iconType,
        colorHex: d.color,
        isCorrect: false,
      })),
    ];

    return {
      id: `concept-${Date.now()}-${Math.random()}`,
      category: 'concept',
      title: 'İpucu & Benzerlik',
      prompt: `"${target.clue}"`,
      subPrompt: 'Yukarıdaki tarife uyan nesneyi seç',
      badgeText: target.category,
      badgeColor: target.color,
      targetId: target.id,
      options: shuffle(options),
      timeLimit,
    };
  }

  // 3. Karma & İkili Kural (Hybrid Mode)
  private static generateHybridQuestion(
    optionsCount: number,
    timeLimit: number
  ): Question {
    const rules = [
      {
        condition: (s: ShapeInfo) => s.sides === 0,
        text: 'Köşesi olmayan (yuvarlak) şekli bul!',
      },
      {
        condition: (s: ShapeInfo) => s.sides === 4,
        text: 'Dört (4) kenarı olan şekli seç!',
      },
      {
        condition: (s: ShapeInfo) => s.sides === 3,
        text: 'Üçgen olan şekli bul!',
      },
    ];

    const rule = randomItem(rules);
    const validShapes = GAME_SHAPES.filter(rule.condition);
    const invalidShapes = GAME_SHAPES.filter((s) => !rule.condition(s));

    const targetShape = randomItem(validShapes);
    const targetColor = randomItem(GAME_COLORS);

    const options: QuestionOption[] = [
      {
        id: `hybrid-${targetShape.type}-${targetColor.id}-correct`,
        label: `${targetColor.name} ${targetShape.nameTr}`,
        shape: targetShape.type,
        colorHex: targetColor.hex,
        isCorrect: true,
      },
    ];

    const usedCombos = new Set<string>([`${targetShape.type}-${targetColor.id}`]);

    while (options.length < optionsCount) {
      // Pick from invalid shapes as distractors
      const shape = randomItem(invalidShapes);
      const color = randomItem(GAME_COLORS);
      const comboKey = `${shape.type}-${color.id}`;

      if (!usedCombos.has(comboKey)) {
        usedCombos.add(comboKey);
        options.push({
          id: `hybrid-${shape.type}-${color.id}-${options.length}`,
          label: `${color.name} ${shape.nameTr}`,
          shape: shape.type,
          colorHex: color.hex,
          isCorrect: false,
        });
      }
    }

    return {
      id: `hybrid-${Date.now()}-${Math.random()}`,
      category: 'hybrid',
      title: 'Zeka & Mantık',
      prompt: rule.text,
      subPrompt: 'Kurala uyan şekli hemen belirle',
      badgeText: 'Kural Avı',
      badgeColor: THEME.colors.yellow,
      targetId: targetShape.type,
      options: shuffle(options),
      timeLimit,
    };
  }
}
