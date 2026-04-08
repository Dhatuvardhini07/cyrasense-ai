import * as backend from "@/lib/health-backend";
import type {
  CyclePhase,
  CycleRecord,
  DailyLog,
  ProfileUpdate,
  UserProfile,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Profile ───────────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: () => backend.getProfile(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserProfile, "id" | "createdAt" | "updatedAt">) =>
      backend.saveProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (update: ProfileUpdate) => backend.updateProfile(update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ── Cycle ─────────────────────────────────────────────────────────────────────

export function useCycleHistory() {
  return useQuery<CycleRecord[]>({
    queryKey: ["cycles"],
    queryFn: () => backend.getCycleHistory(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCurrentPrediction() {
  return useQuery({
    queryKey: ["prediction"],
    queryFn: () => backend.getCurrentCyclePrediction(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAverageCycleLength() {
  return useQuery<number>({
    queryKey: ["avgCycleLength"],
    queryFn: () => backend.getAverageCycleLength(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddCycleRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      startDate,
      periodDurationDays,
      notes,
    }: {
      startDate: string;
      periodDurationDays: number;
      notes?: string;
    }) => backend.addCycleRecord(startDate, periodDurationDays, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      queryClient.invalidateQueries({ queryKey: ["prediction"] });
      queryClient.invalidateQueries({ queryKey: ["avgCycleLength"] });
      queryClient.invalidateQueries({ queryKey: ["analysis"] });
    },
  });
}

// ── Daily logs ────────────────────────────────────────────────────────────────

export function useDailyLogs(startDate?: string, endDate?: string) {
  return useQuery<DailyLog[]>({
    queryKey: ["logs", startDate, endDate],
    queryFn: () => backend.getDailyLogs(startDate, endDate),
    staleTime: 1000 * 60 * 2,
  });
}

export function useLogForDate(date: string) {
  return useQuery<DailyLog | null>({
    queryKey: ["log", date],
    queryFn: () => backend.getLogForDate(date),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSaveDailyLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (log: Omit<DailyLog, "id" | "createdAt">) =>
      backend.saveDailyLog(log),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.invalidateQueries({ queryKey: ["log", variables.date] });
    },
  });
}

// ── Analysis ──────────────────────────────────────────────────────────────────

export function useAnalysis() {
  return useQuery({
    queryKey: ["analysis"],
    queryFn: () => backend.analyzeCurrentCycle(),
    staleTime: 1000 * 60 * 10,
  });
}

// ── Monthly report ────────────────────────────────────────────────────────────

export function useMonthlyReport(month?: number, year?: number) {
  return useQuery({
    queryKey: ["monthlyReport", month, year],
    queryFn: () => backend.getMonthlyReport(month, year),
    staleTime: 1000 * 60 * 10,
  });
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export function useChatHistory() {
  return useQuery({
    queryKey: ["chat"],
    queryFn: () => backend.getChatHistory(),
    staleTime: 0,
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => backend.sendChatMessage(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
}

// ── Self-care ─────────────────────────────────────────────────────────────────

export function useSelfCare(phase: CyclePhase | null) {
  return useQuery({
    queryKey: ["selfcare", phase],
    queryFn: () =>
      phase ? backend.getSelfCareForPhase(phase) : Promise.resolve([]),
    enabled: !!phase,
    staleTime: 1000 * 60 * 60,
  });
}

// ── Quiz & Progress ───────────────────────────────────────────────────────────

export function useDailyQuizzes() {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: () => backend.getDailyQuizzes(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useQuizProgress() {
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => backend.getUserProgress(),
    staleTime: 1000 * 30,
  });
}

export function useSubmitQuizAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      selectedIndex,
    }: {
      questionId: string;
      selectedIndex: number;
    }) => backend.submitQuizAnswer(questionId, selectedIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
}
