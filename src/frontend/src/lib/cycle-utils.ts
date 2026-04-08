import type { CyclePhase } from "@/types";

/**
 * Calculate cycle phase from start date and current date
 * Default assumptions: period lasts 5 days, cycle length 28 days
 */
export function calculateCyclePhase(
  startDate: string,
  currentDate: string,
  cycleLength = 28,
  periodDuration = 5,
): CyclePhase {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const daysDiff = Math.floor(
    (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const cycleDay = (((daysDiff % cycleLength) + cycleLength) % cycleLength) + 1;

  if (cycleDay <= periodDuration) return "menstrual";
  const ovulationDay = Math.round(cycleLength / 2) - 2;
  if (cycleDay < ovulationDay - 1) return "follicular";
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 2)
    return "ovulation";
  return "luteal";
}

/**
 * Get the current cycle day number
 */
export function getCycleDay(
  startDate: string,
  currentDate: string,
  cycleLength = 28,
): number {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const daysDiff = Math.floor(
    (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return (((daysDiff % cycleLength) + cycleLength) % cycleLength) + 1;
}

/**
 * Get daily message for a given phase and user name
 */
export function getDailyMessage(phase: CyclePhase, userName: string): string {
  const firstName = userName.split(" ")[0];
  const messages: Record<CyclePhase, string> = {
    menstrual: `Your body is in a recovery phase today, ${firstName}. Focus on rest and hydration — be gentle with yourself.`,
    follicular: `Your energy is building, ${firstName}. A great time to set intentions and move gently toward your goals.`,
    ovulation: `You're in your most vibrant phase, ${firstName}. Embrace your energy and connect with those around you.`,
    luteal: `Your body is preparing, ${firstName}. Nourish yourself with calm activities and good nutrition today.`,
  };
  return messages[phase];
}

/**
 * Get a friendly label for a cycle phase
 */
export function getPhaseLabel(phase: CyclePhase): string {
  const labels: Record<CyclePhase, string> = {
    menstrual: "Recovery Phase",
    follicular: "Renewal Phase",
    ovulation: "Peak Energy Phase",
    luteal: "Preparation Phase",
  };
  return labels[phase];
}

/**
 * Get cycle phase description
 */
export function getPhaseDescription(phase: CyclePhase): string {
  const descriptions: Record<CyclePhase, string> = {
    menstrual:
      "Your body is shedding the uterine lining. Rest is important during this time.",
    follicular:
      "Follicles in your ovaries are maturing. Estrogen is rising and energy levels improve.",
    ovulation:
      "An egg is released. This is your most fertile time and energy is at its peak.",
    luteal:
      "Progesterone rises to prepare the uterus. A time for introspection and nourishment.",
  };
  return descriptions[phase];
}

/**
 * Validate height and weight for human plausibility
 */
export function validateHeightWeight(
  heightCm: number,
  weightKg: number,
): { valid: boolean; message?: string } {
  if (heightCm < 100 || heightCm > 250) {
    return {
      valid: false,
      message:
        "Please enter a height between 100 cm and 250 cm for accurate tracking.",
    };
  }

  if (weightKg < 20 || weightKg > 300) {
    return {
      valid: false,
      message:
        "Please enter a weight between 20 kg and 300 kg for accurate tracking.",
    };
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 10 || bmi > 60) {
    return {
      valid: false,
      message:
        "Your entered details seem unusual. Please recheck your height and weight for accuracy.",
    };
  }

  return { valid: true };
}

/**
 * Validate age
 */
export function validateAge(age: number): { valid: boolean; message?: string } {
  if (age < 10 || age > 60) {
    return {
      valid: false,
      message: "Age must be between 10 and 60 for this application.",
    };
  }
  return { valid: true };
}

/**
 * Convert feet/inches to centimeters
 */
export function ftInToCm(feet: number, inches: number): number {
  return Math.round(feet * 30.48 + inches * 2.54);
}

/**
 * Format a date string to a friendly display format
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get today as ISO date string (YYYY-MM-DD)
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Add days to a date string and return new date string
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

/**
 * Get cycle phase color class
 */
export function getPhaseColorClass(phase: CyclePhase): string {
  const colors: Record<CyclePhase, string> = {
    menstrual: "text-cycle-period",
    follicular: "text-primary",
    ovulation: "text-cycle-ovulation",
    luteal: "text-cycle-fertile",
  };
  return colors[phase];
}
