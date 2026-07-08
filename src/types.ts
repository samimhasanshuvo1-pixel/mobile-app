export interface AgeResult {
  actualYears: number;
  actualMonths: number;
  actualDays: number;
  actualHours: number;
  actualMinutes: number;
  actualSeconds: number;
  roundedYears: number;
  isRoundedUp: boolean;
}

export interface BirthdayCountdown {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDaysRemaining: number;
  nextBirthdayDateStr: string;
  nextBirthdayDayOfWeekBn: string;
  isToday?: boolean;
}

export interface HoroscopeData {
  zodiacNameBn: string;
  personality: string;
  dailyPrediction: string;
  birthdayWish: string;
  luckyColor: string;
  luckyNumber: number;
  isOffline?: boolean;
}

export type AvatarStage = "baby" | "child" | "teenager" | "young" | "middle" | "elderly";
