export type ShapeType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'diamond'
  | 'hexagon'
  | 'crescent';

export interface ColorDefinition {
  id: string;
  name: string;
  hex: string;
  pastelHex: string;
  borderHex: string;
}

export type IconType = 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';

export interface ConceptItem {
  id: string;
  name: string;
  clue: string;
  category: 'Doğa' | 'Meyve & Yiyecek' | 'Hayvanlar' | 'Eşyalar' | 'Hava Durumu' | 'Araçlar';
  icon: string;
  iconType: IconType;
  color: string;
  accentColor: string;
}

export type QuestionCategory = 'shape-color' | 'concept' | 'hybrid';

export interface QuestionOption {
  id: string;
  label: string;
  shape?: ShapeType;
  colorHex?: string;
  icon?: string;
  iconType?: IconType;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  title: string;
  prompt: string;
  subPrompt?: string;
  badgeText: string;
  badgeColor: string;
  targetId: string;
  options: QuestionOption[];
  timeLimit: number;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface GameStats {
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  highestStreak: number;
}

export interface GameState {
  score: number;
  level: number;
  lives: number;
  maxLives: number;
  streak: number;
  multiplier: number;
  currentQuestion: Question | null;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isAnswerProcessing: boolean;
  selectedOptionId: string | null;
  timeRemaining: number;
  stats: GameStats;
}
