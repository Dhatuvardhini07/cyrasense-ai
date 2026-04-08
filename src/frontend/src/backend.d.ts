import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MonthlyReport {
    nextSteps: string;
    avgPainLevel: number;
    patternInsight: string;
    cycleLength: bigint;
    commonSymptoms: Array<string>;
}
export interface CycleRecord {
    id: string;
    periodDays: bigint;
    cycleLengthDays: bigint;
    createdAt: bigint;
    notes?: string;
    startDate: string;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface ProfileUpdate {
    age?: bigint;
    dob?: string;
    heightCm?: number;
    city?: string;
    name?: string;
    lifeStage?: string;
    weightKg?: number;
}
export interface QuizQuestion {
    id: string;
    question: string;
    correctIndex: bigint;
    explanation: string;
    options: Array<string>;
}
export interface SelfCareItem {
    title: string;
    tips: Array<string>;
    description: string;
    category: string;
    phase: string;
}
export interface DailyLog {
    id: string;
    painLevel?: bigint;
    date: string;
    mood?: string;
    createdAt: bigint;
    notes?: string;
    symptoms: Array<string>;
}
export interface CyclePrediction {
    currentPhase: string;
    ovulationDate: string;
    dayOfCycle: bigint;
    fertileWindowStart: string;
    fertileWindowEnd: string;
    nextPeriodStart: string;
}
export interface QuizResult {
    explanation: string;
    correct: boolean;
    pointsEarned: bigint;
}
export interface ChatMessage {
    content: string;
    role: string;
    timestamp: bigint;
}
export interface AnalysisResult {
    guidanceLevel: string;
    delayDays?: bigint;
    reasoning: string;
    isNormal: boolean;
    guidance: string;
}
export interface UserProgress {
    lastQuizDate: string;
    totalCompleted: bigint;
    quizzesCompletedToday: bigint;
    totalPoints: bigint;
}
export interface UserProfile {
    id: Principal;
    age: bigint;
    dob?: string;
    heightCm: number;
    city: string;
    name: string;
    createdAt: bigint;
    lifeStage: string;
    weightKg: number;
}
export interface backendInterface {
    addCycleRecord(record: CycleRecord): Promise<Result>;
    analyzeCurrentCycle(): Promise<AnalysisResult>;
    getAverageCycleLength(): Promise<number>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getCurrentCyclePrediction(): Promise<CyclePrediction | null>;
    getCycleHistory(): Promise<Array<CycleRecord>>;
    getDailyLogs(startDate: string, endDate: string): Promise<Array<DailyLog>>;
    getDailyQuizzes(): Promise<Array<QuizQuestion>>;
    getLogForDate(date: string): Promise<DailyLog | null>;
    getMonthlyReport(): Promise<MonthlyReport>;
    getProfile(): Promise<UserProfile | null>;
    getSelfCareForPhase(phase: string): Promise<Array<SelfCareItem>>;
    getUserProgress(): Promise<UserProgress>;
    saveDailyLog(log: DailyLog): Promise<Result>;
    saveProfile(profile: UserProfile): Promise<Result>;
    sendChatMessage(message: string): Promise<string>;
    submitQuizAnswer(questionId: string, selectedIndex: bigint): Promise<QuizResult>;
    updateProfile(updates: ProfileUpdate): Promise<Result>;
}
