export type GradeLevel = 1 | 2 | 3;

export type CompanionId = 'poko' | 'luna' | 'piko' | 'kou';

export interface Companion {
  id: CompanionId;
  name: string;
  title: string;
  species: string;
  avatarColor: string;
  accentBg: string;
  borderColor: string;
  greeting: string;
  catchphrase: string;
  description: string;
  voicePitch: number;
  voiceRate: number;
}

export type MainTab =
  | 'home'
  | 'adventure'
  | 'math'
  | 'japanese'
  | 'curiosity'
  | 'story'
  | 'stickers'
  | 'parent-report';

export type MathTopic =
  | 'counting'
  | 'addition'
  | 'subtraction'
  | 'carrying'
  | 'clock'
  | 'multiplication'
  | 'word-problems'
  | 'shapes';

export type JapaneseTopic =
  | 'kanji'
  | 'hiragana-katakana'
  | 'particles'
  | 'shiritori'
  | 'sentence-builder'
  | 'reading';

export interface MathQuestion {
  id: string;
  grade: GradeLevel;
  topic: MathTopic;
  title: string;
  questionText: string;
  formula?: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  visualType?: 'apples' | 'stars' | 'blocks' | 'animals' | 'cars' | 'clock' | 'grid' | 'shapes' | 'cookies';
  visualCountA?: number;
  visualCountB?: number;
  visualOperator?: '+' | '-' | '×' | '÷';
  encouragement: string;
  clockHour?: number;
  clockMinute?: number;
}

export interface JapaneseQuestion {
  id: string;
  grade: GradeLevel;
  topic: JapaneseTopic;
  title: string;
  questionText: string;
  kanjiChar?: string;
  furigana?: string;
  correctAnswer: string;
  options: string[];
  hint: string;
  explanation: string;
  exampleSentence?: string;
  encouragement: string;
  readingStory?: string;
}

export interface Sticker {
  id: string;
  name: string;
  icon: string;
  category: 'math' | 'japanese' | 'curiosity' | 'story' | 'streak' | 'special';
  description: string;
  requiredStars: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LearningLog {
  id: string;
  timestamp: string;
  subject: 'math' | 'japanese' | 'curiosity' | 'story' | 'adventure';
  topic: string;
  question: string;
  isCorrect: boolean;
  starsEarned: number;
  grade: GradeLevel;
}

export interface CuriosityItem {
  id: string;
  question: string;
  topic: string;
  simpleAnswer: string;
  storyExplanation: string;
  tryItIdea: string;
  miniQuiz: {
    question: string;
    answer: string;
  };
  timestamp?: string;
}

export interface StoryScene {
  sceneNumber: number;
  sceneTitle: string;
  content: string;
  illustrationPrompt?: string;
  badge: string;
}

export interface CreatedStory {
  id: string;
  title: string;
  hero: string;
  setting: string;
  magicItem: string;
  scenes: StoryScene[];
  praiseMessage: string;
  createdAt: string;
}

// ----------------------------------------------------
// Generative UI & Adventure Mode Types
// ----------------------------------------------------
export type AdventureWorldId = 'forest' | 'castle' | 'volcano' | 'ocean' | 'galaxy';

export type AdventureWidgetType =
  | 'chest_lock'      // Combination lock dials for numbers/kanji
  | 'crystal_scale'   // Interactive balance scale with physical weights
  | 'stepping_stones' // River crossing with interactive stones
  | 'magic_charge'    // Elemental spell casting for friendly monster encounters
  | 'ancient_tablet'  // Stone tablet with slot-in glyph tiles
  | 'potion_alchemy'  // Cauldron measurement and color mixing
  | 'compass_dial'    // Rotating compass & clock dial for time/spatial
  | 'rpg_action';     // Command battle with tactical cards

export interface AdventureLootItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AdventureUIConfig {
  widgetType: AdventureWidgetType;
  // Chest lock config
  lockDials?: Array<{ label: string; current: number | string; options: (number | string)[] }>;
  targetCode?: string | number;
  
  // Crystal scale config
  targetWeight?: number;
  leftPan?: Array<{ id: string; name: string; weight: number; icon: string; count?: number }>;
  availableItems?: Array<{ id: string; name: string; weight: number; icon: string }>;
  
  // Stepping stones config
  riverTheme?: string;
  stones?: Array<{ id: string; text: string; subText?: string; isCorrect: boolean; feedback: string }>;
  
  // Magic charge config
  monsterName?: string;
  monsterEmoji?: string;
  monsterHp?: number;
  spells?: Array<{ id: string; name: string; element: 'fire' | 'water' | 'nature' | 'star'; power: number; label: string; isCorrect: boolean }>;
  
  // Ancient tablet config
  tabletPrompt?: string;
  slotsCount?: number;
  runes?: Array<{ id: string; char: string; meaning: string; isCorrect: boolean }>;
  
  // Potion alchemy config
  potionTarget?: string;
  potionColor?: string;
  ingredients?: Array<{ id: string; name: string; icon: string; amount: number; isCorrect: boolean }>;
  
  // Compass dial config
  compassTargetAngle?: number;
  compassLabels?: string[];
  
  // RPG Action config
  actions?: Array<{ id: string; title: string; desc: string; icon: string; isCorrect: boolean; badge: string }>;
}

export interface AdventureQuest {
  id: string;
  grade: GradeLevel;
  worldId: AdventureWorldId;
  worldName: string;
  worldEmoji: string;
  stageNumber: number;
  totalStages: number;
  isBossStage?: boolean;
  subject: 'math' | 'japanese' | 'curiosity' | 'hybrid';
  title: string;
  storyIntro: string;
  characterMood: 'excited' | 'thinking' | 'cheering';
  questionPrompt: string;
  hint: string;
  loreExplanation: string;
  encouragement: string;
  correctAnswer: string | number;
  uiConfig: AdventureUIConfig;
  rewards: {
    stars: number;
    exp: number;
    lootItem?: AdventureLootItem;
  };
}

export interface UserProgress {
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedStickerIds: string[];
  totalQuestionsAnswered: number;
  correctCount: number;
  createdStoriesCount: number;
  curiosityCount: number;
  favoriteCompanion: CompanionId;
  selectedGrade: GradeLevel;
  showFurigana: boolean;
  voiceEnabled: boolean;
  // Adventure RPG Stats
  adventureLevel?: number;
  adventureExp?: number;
  clearedQuestCount?: number;
  inventory?: AdventureLootItem[];
}
