/**
 * Health backend service — provides typed wrappers for backend calls.
 * Since backend bindings are generated stubs, this layer manages local
 * state via localStorage as the primary data persistence for the MVP.
 */

import type {
  AnalysisResult,
  ChatMessage,
  CyclePhase,
  CyclePrediction,
  CycleRecord,
  DailyLog,
  MonthlyReport,
  ProfileUpdate,
  QuizQuestion,
  QuizResult,
  SelfCareItem,
  UserProfile,
  UserProgress,
} from "@/types";
import { addDays, calculateCyclePhase, todayISO } from "./cycle-utils";

const STORAGE_KEYS = {
  PROFILE: "cyrasense_profile",
  CYCLES: "cyrasense_cycles",
  LOGS: "cyrasense_logs",
  CHAT: "cyrasense_chat",
  PROGRESS: "cyrasense_progress",
} as const;

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Profile ──────────────────────────────────────────────────────────────────

export async function saveProfile(
  profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
): Promise<UserProfile> {
  const now = new Date().toISOString();
  const full: UserProfile = {
    ...profile,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  writeStorage(STORAGE_KEYS.PROFILE, full);
  return full;
}

export async function getProfile(): Promise<UserProfile | null> {
  return readStorage<UserProfile>(STORAGE_KEYS.PROFILE);
}

export async function updateProfile(
  update: ProfileUpdate,
): Promise<UserProfile | null> {
  const existing = readStorage<UserProfile>(STORAGE_KEYS.PROFILE);
  if (!existing) return null;
  const updated: UserProfile = {
    ...existing,
    ...update,
    updatedAt: new Date().toISOString(),
  };
  writeStorage(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

// ── Cycle records ─────────────────────────────────────────────────────────────

export async function addCycleRecord(
  startDate: string,
  periodDurationDays: number,
  notes?: string,
): Promise<CycleRecord> {
  const cycles = readStorage<CycleRecord[]>(STORAGE_KEYS.CYCLES) ?? [];
  const sorted = [...cycles].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  let cycleLength: number | undefined;
  if (sorted.length > 0) {
    const prev = sorted[0];
    const days = Math.round(
      (new Date(startDate).getTime() - new Date(prev.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (days > 0 && days < 90) cycleLength = days;
  }

  const record: CycleRecord = {
    id: crypto.randomUUID(),
    startDate,
    periodDurationDays,
    cycleLength,
    notes,
    createdAt: new Date().toISOString(),
  };
  writeStorage(STORAGE_KEYS.CYCLES, [...cycles, record]);
  return record;
}

export async function getCycleHistory(): Promise<CycleRecord[]> {
  const cycles = readStorage<CycleRecord[]>(STORAGE_KEYS.CYCLES) ?? [];
  return cycles.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

export async function getAverageCycleLength(): Promise<number> {
  const cycles = await getCycleHistory();
  const withLength = cycles.filter((c) => c.cycleLength !== undefined);
  if (withLength.length === 0) return 28;
  const sum = withLength.reduce((acc, c) => acc + (c.cycleLength ?? 0), 0);
  return Math.round(sum / withLength.length);
}

export async function getCurrentCyclePrediction(): Promise<CyclePrediction | null> {
  const cycles = await getCycleHistory();
  if (cycles.length === 0) return null;

  const latest = cycles[0];
  const avgCycleLength = await getAverageCycleLength();
  const periodDuration = latest.periodDurationDays;
  const today = todayISO();

  const nextStart = addDays(latest.startDate, avgCycleLength);
  const nextEnd = addDays(nextStart, periodDuration - 1);
  const ovulationDate = addDays(
    latest.startDate,
    Math.round(avgCycleLength / 2) - 2,
  );
  const fertileStart = addDays(ovulationDate, -2);
  const fertileEnd = addDays(ovulationDate, 2);

  const currentPhase = calculateCyclePhase(
    latest.startDate,
    today,
    avgCycleLength,
    periodDuration,
  );
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(latest.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const currentCycleDay = (daysDiff % avgCycleLength) + 1;

  return {
    nextPeriodStart: nextStart,
    nextPeriodEnd: nextEnd,
    ovulationDate,
    fertileWindowStart: fertileStart,
    fertileWindowEnd: fertileEnd,
    currentPhase,
    currentCycleDay,
    estimatedCycleLength: avgCycleLength,
  };
}

// ── Daily logs ────────────────────────────────────────────────────────────────

export async function saveDailyLog(
  log: Omit<DailyLog, "id" | "createdAt">,
): Promise<DailyLog> {
  const logs = readStorage<DailyLog[]>(STORAGE_KEYS.LOGS) ?? [];
  const existing = logs.findIndex((l) => l.date === log.date);
  const full: DailyLog = {
    ...log,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  if (existing >= 0) {
    logs[existing] = full;
  } else {
    logs.push(full);
  }
  writeStorage(STORAGE_KEYS.LOGS, logs);
  return full;
}

export async function getDailyLogs(
  startDate?: string,
  endDate?: string,
): Promise<DailyLog[]> {
  const logs = readStorage<DailyLog[]>(STORAGE_KEYS.LOGS) ?? [];
  return logs.filter((l) => {
    if (startDate && l.date < startDate) return false;
    if (endDate && l.date > endDate) return false;
    return true;
  });
}

export async function getLogForDate(date: string): Promise<DailyLog | null> {
  const logs = readStorage<DailyLog[]>(STORAGE_KEYS.LOGS) ?? [];
  return logs.find((l) => l.date === date) ?? null;
}

// ── Analysis ──────────────────────────────────────────────────────────────────

export async function analyzeCurrentCycle(): Promise<AnalysisResult> {
  const cycles = await getCycleHistory();
  const avgLength = await getAverageCycleLength();

  if (cycles.length === 0) {
    return {
      isNormal: true,
      summary: "No cycle data yet",
      explanation:
        "Start tracking your cycle to receive personalized insights.",
      recommendation: "Continue monitoring",
      details: [],
      isDelayed: false,
    };
  }

  const latest = cycles[0];
  const today = todayISO();
  const daysSincePeriod = Math.floor(
    (new Date(today).getTime() - new Date(latest.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const isDelayed = daysSincePeriod > avgLength + 5;
  let recommendation: AnalysisResult["recommendation"] = "Continue monitoring";

  if (isDelayed) {
    recommendation = "Consider professional consultation";
  } else if (cycles.length >= 2) {
    const lengths = cycles
      .filter((c) => c.cycleLength)
      .map((c) => c.cycleLength!);
    const variance =
      lengths.length > 1 ? Math.max(...lengths) - Math.min(...lengths) : 0;
    if (variance > 10) recommendation = "Focus on lifestyle adjustments";
  }

  const details: string[] = [];
  if (cycles.length >= 2) {
    const prev = cycles[1];
    if (prev.cycleLength && latest.cycleLength) {
      const diff = latest.cycleLength - prev.cycleLength;
      if (Math.abs(diff) > 3) {
        details.push(
          `Compared to your usual pattern, this cycle is ${diff > 0 ? "slightly longer" : "slightly shorter"}.`,
        );
      }
    }
  }

  return {
    isNormal: !isDelayed,
    summary: isDelayed ? "Cycle appears delayed" : "Cycle within normal range",
    explanation: isDelayed
      ? "Your cycle appears delayed. This can be due to multiple reasons such as stress or hormonal changes. If relevant, you may consider a pregnancy test for clarity."
      : "This may fall within common variation. If it continues across cycles, consider seeking professional advice.",
    recommendation,
    details,
    isDelayed,
    delayMessage: isDelayed
      ? "Your cycle appears delayed. This can be due to multiple reasons such as stress or hormonal changes. If relevant, you may consider a pregnancy test for clarity."
      : undefined,
  };
}

// ── Monthly report ────────────────────────────────────────────────────────────

export async function getMonthlyReport(
  month?: number,
  year?: number,
): Promise<MonthlyReport | null> {
  const now = new Date();
  const reportMonth = month ?? now.getMonth() + 1;
  const reportYear = year ?? now.getFullYear();

  const cycles = await getCycleHistory();
  const avgLength = await getAverageCycleLength();

  if (cycles.length === 0) return null;

  const monthStr = `${reportYear}-${String(reportMonth).padStart(2, "0")}`;
  const monthLogs = await getDailyLogs(`${monthStr}-01`, `${monthStr}-31`);

  const avgPain =
    monthLogs.length > 0
      ? monthLogs.reduce((acc, l) => acc + (l.painLevel ?? 0), 0) /
        monthLogs.length
      : 0;

  const symptomCounts: Record<string, number> = {};
  for (const log of monthLogs) {
    for (const s of log.symptoms) {
      symptomCounts[s] = (symptomCounts[s] ?? 0) + 1;
    }
  }

  const latest = cycles[0];
  const cycleLength = latest.cycleLength ?? avgLength;

  return {
    month: monthStr,
    year: reportYear,
    cycleLength,
    averageCycleLength: avgLength,
    patternInsights: [
      cycleLength === avgLength
        ? "Your cycle length was consistent this month."
        : `Your cycle length was ${Math.abs(cycleLength - avgLength)} days ${cycleLength > avgLength ? "longer" : "shorter"} than your average.`,
    ],
    suggestedNextSteps: [
      "Continue logging daily to improve pattern recognition.",
    ],
    symptomSummary: symptomCounts,
    averagePainLevel: Math.round(avgPain * 10) / 10,
  };
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export async function sendChatMessage(content: string): Promise<ChatMessage> {
  const history = readStorage<ChatMessage[]>(STORAGE_KEYS.CHAT) ?? [];
  const userMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: new Date().toISOString(),
  };
  history.push(userMsg);

  // Simple rule-based response engine
  const response = generateChatResponse(content);
  const assistantMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: response,
    timestamp: new Date().toISOString(),
  };
  history.push(assistantMsg);
  writeStorage(STORAGE_KEYS.CHAT, history);
  return assistantMsg;
}

function generateChatResponse(input: string): string {
  const lower = input.toLowerCase();

  if (
    !lower.match(
      /cycle|period|ovulat|fertil|pregnan|pms|cramp|discharge|health|body|pain|mood|symptom|tampon|pad|menstrual|hormones|fertility|spotting|flow|pcos|endometriosis|uterus|ovary|progesterone|estrogen|tracking|calendar|flow|bleed|self.?care|wellness|nutrition|exercise/,
    )
  ) {
    return "I focus on women's health topics. Let me assist you within that area — feel free to ask about your cycle, symptoms, fertility, or general wellness.";
  }

  if (lower.includes("pain") || lower.includes("cramp")) {
    return "Mild to moderate cramping is common during the menstrual phase as your uterus contracts. Heat therapy, gentle movement, and staying hydrated can help. If pain is severe or disrupting daily activities, consider speaking with a healthcare professional.";
  }

  if (lower.includes("pregnan")) {
    return "Pregnancy is possible during your fertile window, typically 5 days before ovulation and 1 day after. If your period is delayed and you've been sexually active, a home pregnancy test can provide clarity. Remember, delays can also be caused by stress, illness, or hormonal shifts.";
  }

  if (lower.includes("fertil") || lower.includes("ovulat")) {
    return "Your fertile window typically spans about 6 days — the 5 days leading up to ovulation and the day of ovulation itself. Ovulation usually occurs around the midpoint of your cycle. Your CyraSense calendar highlights this window for you.";
  }

  if (lower.includes("pcos")) {
    return "PCOS (Polycystic Ovary Syndrome) can cause irregular cycles, hormonal imbalances, and other symptoms. If you suspect PCOS, tracking your cycles and symptoms here is a great first step. A healthcare professional can provide a proper diagnosis and treatment options.";
  }

  if (
    lower.includes("delay") ||
    lower.includes("late") ||
    lower.includes("missed")
  ) {
    return "A delayed period can be caused by stress, weight changes, illness, hormonal fluctuations, or pregnancy. Occasional delays of a few days are quite common. If your period is significantly late or this is a recurring pattern, consider speaking with a healthcare professional.";
  }

  if (lower.includes("mood") || lower.includes("emotional")) {
    return "Mood changes throughout your cycle are normal and tied to hormonal shifts. Rising estrogen in the follicular phase often brings a mood lift, while progesterone in the luteal phase can cause fatigue or irritability. Tracking your moods here helps reveal your personal patterns.";
  }

  if (lower.includes("exercise") || lower.includes("workout")) {
    return "Exercise affects your cycle differently by phase. Light movement and walking are gentle during menstruation. Energy peaks during the follicular and ovulation phases — great for more intense workouts. The luteal phase calls for calming activities like yoga or walks.";
  }

  return "That's a great question about women's health. Tracking your cycles, symptoms, and moods regularly gives your body a voice. If you're experiencing any persistent or concerning symptoms, I always recommend consulting with a qualified healthcare professional for personalized guidance.";
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  return readStorage<ChatMessage[]>(STORAGE_KEYS.CHAT) ?? [];
}

// ── Self-care ─────────────────────────────────────────────────────────────────

export async function getSelfCareForPhase(
  phase: CyclePhase,
): Promise<SelfCareItem[]> {
  const items: Record<CyclePhase, SelfCareItem[]> = {
    menstrual: [
      {
        id: "m1",
        phase: "menstrual",
        category: "exercise",
        title: "Gentle Yoga",
        description:
          "Restorative poses like child's pose and cat-cow help ease cramps and release tension.",
        icon: "🧘",
      },
      {
        id: "m2",
        phase: "menstrual",
        category: "nutrition",
        title: "Iron-Rich Foods",
        description:
          "Incorporate leafy greens, lentils, and fortified cereals to replenish iron lost during menstruation.",
        icon: "🥗",
      },
      {
        id: "m3",
        phase: "menstrual",
        category: "hygiene",
        title: "Hygiene & Comfort",
        description:
          "Change your pad or tampon every 4-6 hours. Consider a heating pad for cramp relief.",
        icon: "🌸",
      },
      {
        id: "m4",
        phase: "menstrual",
        category: "mindfulness",
        title: "Rest & Recharge",
        description:
          "Your body is working hard. Prioritize sleep and allow yourself to slow down without guilt.",
        icon: "💤",
      },
      {
        id: "m5",
        phase: "menstrual",
        category: "tip",
        title: "Hydration First",
        description:
          "Drink warm herbal teas like ginger or chamomile to ease bloating and soothe cramping.",
        icon: "🍵",
      },
    ],
    follicular: [
      {
        id: "f1",
        phase: "follicular",
        category: "exercise",
        title: "Cardio & Strength",
        description:
          "Rising estrogen boosts endurance. This is a great time to try new workouts or increase intensity.",
        icon: "🏃",
      },
      {
        id: "f2",
        phase: "follicular",
        category: "nutrition",
        title: "Fresh & Light Foods",
        description:
          "Your digestion improves in this phase. Focus on fresh vegetables, salads, and lean proteins.",
        icon: "🥑",
      },
      {
        id: "f3",
        phase: "follicular",
        category: "mindfulness",
        title: "Set Intentions",
        description:
          "Energy and clarity are building. Journal your goals or start a new project you've been putting off.",
        icon: "📓",
      },
      {
        id: "f4",
        phase: "follicular",
        category: "tip",
        title: "Social Energy",
        description:
          "Estrogen boosts sociability and communication. Plan meaningful connections during this phase.",
        icon: "✨",
      },
    ],
    ovulation: [
      {
        id: "o1",
        phase: "ovulation",
        category: "exercise",
        title: "High-Intensity Training",
        description:
          "Peak energy and strength make this the perfect time for HIIT, dancing, or competitive sports.",
        icon: "💪",
      },
      {
        id: "o2",
        phase: "ovulation",
        category: "nutrition",
        title: "Anti-Inflammatory Foods",
        description:
          "Support your body with omega-3 rich foods like salmon, walnuts, and flaxseed.",
        icon: "🐟",
      },
      {
        id: "o3",
        phase: "ovulation",
        category: "mindfulness",
        title: "Express Yourself",
        description:
          "This is your most communicative phase. Have important conversations, present ideas, or create art.",
        icon: "🎨",
      },
      {
        id: "o4",
        phase: "ovulation",
        category: "tip",
        title: "Track Cervical Mucus",
        description:
          "Clear, stretchy mucus similar to egg whites is a natural sign of peak fertility.",
        icon: "🔍",
      },
    ],
    luteal: [
      {
        id: "l1",
        phase: "luteal",
        category: "exercise",
        title: "Calming Movement",
        description:
          "Pilates, swimming, and gentle walks support your body as it transitions and progesterone rises.",
        icon: "🌊",
      },
      {
        id: "l2",
        phase: "luteal",
        category: "nutrition",
        title: "Magnesium & B6",
        description:
          "These nutrients help ease PMS symptoms. Find them in dark chocolate, bananas, and avocados.",
        icon: "🍫",
      },
      {
        id: "l3",
        phase: "luteal",
        category: "hygiene",
        title: "Prep & Plan",
        description:
          "Stock up on period supplies and prepare a comfort kit for the coming phase.",
        icon: "🎒",
      },
      {
        id: "l4",
        phase: "luteal",
        category: "mindfulness",
        title: "Reduce Stress",
        description:
          "Cortisol and progesterone interact. Practice deep breathing or meditation to manage mood dips.",
        icon: "🌿",
      },
      {
        id: "l5",
        phase: "luteal",
        category: "tip",
        title: "Limit Caffeine & Alcohol",
        description:
          "These can amplify PMS symptoms. Opt for herbal teas or warm lemon water instead.",
        icon: "☕",
      },
    ],
  };
  return items[phase] ?? [];
}

// ── Quizzes ───────────────────────────────────────────────────────────────────

const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "q1",
    question: "How many days does a typical menstrual cycle last?",
    options: ["14 days", "21 days", "28 days", "35 days"],
    correctIndex: 2,
    explanation:
      "A typical cycle is 28 days, though 21-35 days is considered normal range.",
    category: "Basics",
  },
  {
    id: "q2",
    question: "What hormone triggers ovulation?",
    options: ["Estrogen", "Progesterone", "LH (Luteinizing Hormone)", "FSH"],
    correctIndex: 2,
    explanation:
      "A surge in Luteinizing Hormone (LH) triggers ovulation, causing the follicle to release an egg.",
    category: "Hormones",
  },
  {
    id: "q3",
    question: "What is the fertile window?",
    options: [
      "Days 1-5",
      "Days 7-10",
      "5 days before ovulation to 1 day after",
      "Last 3 days of cycle",
    ],
    correctIndex: 2,
    explanation:
      "The fertile window spans 5 days before ovulation and the day of ovulation itself — up to 6 days total.",
    category: "Fertility",
  },
  {
    id: "q4",
    question: "What does PMS stand for?",
    options: [
      "Post Menstrual Syndrome",
      "Premenstrual Syndrome",
      "Pre-Menstrual Stage",
      "Progesterone Management System",
    ],
    correctIndex: 1,
    explanation:
      "PMS stands for Premenstrual Syndrome — symptoms that occur in the luteal phase before menstruation.",
    category: "Basics",
  },
  {
    id: "q5",
    question:
      "Which vitamin is especially important during the menstrual phase?",
    options: ["Vitamin D", "Vitamin C", "Iron", "Calcium"],
    correctIndex: 2,
    explanation:
      "Iron replenishment is key during menstruation as blood loss reduces iron stores in the body.",
    category: "Nutrition",
  },
  {
    id: "q6",
    question: "What does the follicular phase prepare?",
    options: [
      "Uterine shedding",
      "Egg maturation in ovaries",
      "Corpus luteum formation",
      "Progesterone production",
    ],
    correctIndex: 1,
    explanation:
      "During the follicular phase, FSH stimulates follicles in the ovaries to mature, preparing an egg for release.",
    category: "Physiology",
  },
  {
    id: "q7",
    question: "What causes cramps during menstruation?",
    options: [
      "Low estrogen",
      "Uterine muscle contractions",
      "High iron levels",
      "Ovary stimulation",
    ],
    correctIndex: 1,
    explanation:
      "The uterus contracts to help shed its lining, and prostaglandins trigger these contractions, causing cramps.",
    category: "Symptoms",
  },
  {
    id: "q8",
    question: "How long does an egg survive after ovulation?",
    options: ["12-24 hours", "2-3 days", "5-7 days", "Until the next cycle"],
    correctIndex: 0,
    explanation:
      "An egg can only be fertilized within 12-24 hours of ovulation, though sperm can survive up to 5 days.",
    category: "Fertility",
  },
  {
    id: "q9",
    question: "What is endometriosis?",
    options: [
      "A hormone disorder",
      "When uterine-like tissue grows outside the uterus",
      "An ovarian cyst",
      "A type of birth control",
    ],
    correctIndex: 1,
    explanation:
      "Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus, often causing pain.",
    category: "Conditions",
  },
  {
    id: "q10",
    question: "Which phase is associated with highest energy levels?",
    options: ["Menstrual", "Follicular", "Ovulation", "Luteal"],
    correctIndex: 2,
    explanation:
      "Estrogen peaks at ovulation, creating the highest energy, mood, and social drive in your cycle.",
    category: "Phases",
  },
];

export async function getDailyQuizzes(): Promise<QuizQuestion[]> {
  const progress = readStorage<UserProgress>(STORAGE_KEYS.PROGRESS);
  const completed = progress?.quizzesCompleted ?? 0;
  const startIdx = (completed * 5) % QUIZ_BANK.length;
  const slice = [...QUIZ_BANK, ...QUIZ_BANK].slice(startIdx, startIdx + 5);
  return slice.slice(0, 5);
}

export async function submitQuizAnswer(
  questionId: string,
  selectedIndex: number,
): Promise<QuizResult> {
  const question = QUIZ_BANK.find((q) => q.id === questionId);
  const isCorrect = question?.correctIndex === selectedIndex;
  const pointsEarned = isCorrect ? 10 : 0;

  const existing = readStorage<UserProgress>(STORAGE_KEYS.PROGRESS);
  const progress: UserProgress = existing ?? {
    userId: "local",
    totalPoints: 0,
    level: 1,
    quizzesCompleted: 0,
    streak: 0,
    badges: [],
    todayQuizzesRemaining: 10,
  };

  progress.totalPoints += pointsEarned;
  progress.quizzesCompleted += 1;
  progress.level = Math.floor(progress.totalPoints / 100) + 1;
  if (progress.todayQuizzesRemaining > 0) progress.todayQuizzesRemaining -= 1;

  writeStorage(STORAGE_KEYS.PROGRESS, progress);
  return { questionId, selectedIndex, isCorrect, pointsEarned };
}

export async function getUserProgress(): Promise<UserProgress> {
  return (
    readStorage<UserProgress>(STORAGE_KEYS.PROGRESS) ?? {
      userId: "local",
      totalPoints: 0,
      level: 1,
      quizzesCompleted: 0,
      streak: 0,
      badges: [],
      todayQuizzesRemaining: 10,
    }
  );
}
