export type QuestCategory = 'color' | 'face' | 'object' | 'shape' | 'funny';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type ShapeType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'diamond'
  | 'hexagon'
  | 'crescent';

export type IconType = 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';

export interface ColorDefinition {
  id: string;
  name: string;
  hex: string;
  pastelHex: string;
  borderHex: string;
}

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

export interface CameraQuest {
  id: string;
  category: QuestCategory;
  title: string;
  prompt: string;
  hint: string;
  emoji: string;
  levelRequired: number;
  timeLimit: number; // in seconds
  targetColor?: 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple' | 'white' | 'dark';
  isFaceQuest?: boolean;
  funFactor?: number;
  badgeText: string;
  badgeColor: string;
}

export interface ImageAnalysisResult {
  matchPercentage: number;
  similarityScore: number;
  feedbackTitle: string;
  feedbackMessage: string;
  photoUri: string;
  isSuccess: boolean;
}

export interface GameStats {
  completedQuests: number;
  failedQuests: number;
  bestSimilarity: number;
  totalScore: number;
  highestStreak: number;
}

export interface GameState {
  score: number;
  level: number;
  lives: number;
  maxLives: number;
  streak: number;
  multiplier: number;
  currentQuest: CameraQuest | null;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isAnalyzing: boolean;
  lastAnalysis: ImageAnalysisResult | null;
  timeRemaining: number;
  stats: GameStats;
}
