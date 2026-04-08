// Life stage options
export type LifeStage =
  | "Regular Cycle Tracking"
  | "Trying to Conceive"
  | "Irregular Cycles"
  | "General Awareness";

// Cycle phase
export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

// User profile
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  dateOfBirth?: string;
  heightCm: number;
  weightKg: number;
  city: string;
  lifeStage: LifeStage;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdate {
  name?: string;
  age?: number;
  dateOfBirth?: string;
  heightCm?: number;
  weightKg?: number;
  city?: string;
  lifeStage?: LifeStage;
}

// Cycle records
export interface CycleRecord {
  id: string;
  startDate: string;
  periodDurationDays: number;
  cycleLength?: number;
  notes?: string;
  createdAt: string;
}

export interface CyclePrediction {
  nextPeriodStart: string;
  nextPeriodEnd: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  currentPhase: CyclePhase;
  currentCycleDay: number;
  estimatedCycleLength: number;
}

// Daily log
export interface DailyLog {
  id: string;
  date: string;
  painLevel?: number;
  mood?: string;
  symptoms: string[];
  notes?: string;
  createdAt: string;
}

// Analysis result
export interface AnalysisResult {
  isNormal: boolean;
  summary: string;
  explanation: string;
  recommendation:
    | "Continue monitoring"
    | "Focus on lifestyle adjustments"
    | "Consider professional consultation";
  details: string[];
  isDelayed: boolean;
  delayMessage?: string;
}

// Monthly report
export interface MonthlyReport {
  month: string;
  year: number;
  cycleLength: number;
  averageCycleLength: number;
  changeFromPrevious?: number;
  patternInsights: string[];
  suggestedNextSteps: string[];
  symptomSummary: Record<string, number>;
  averagePainLevel: number;
}

// Chat
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Self-care
export interface SelfCareItem {
  id: string;
  phase: CyclePhase;
  category: "exercise" | "nutrition" | "hygiene" | "mindfulness" | "tip";
  title: string;
  description: string;
  icon?: string;
}

// Quiz
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface QuizResult {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  quizzesCompleted: number;
  streak: number;
  badges: string[];
  todayQuizzesRemaining: number;
}

// Store
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Onboarding form
export interface OnboardingFormData {
  name: string;
  age: string;
  dateOfBirth: string;
  heightUnit: "cm" | "ft";
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightKg: string;
  city: string;
  lifeStage: LifeStage | "";
}

export interface ValidationError {
  field: string;
  message: string;
}
