import { AgeResult, BirthdayCountdown, AvatarStage } from "../types";

// Get number of days in a specific month of a specific year
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Map day of week index to Bengali name
export function getBengaliDayName(dayIndex: number): string {
  const days = [
    "রবিবার (Sunday)",
    "সোমবার (Monday)",
    "মঙ্গলবার (Tuesday)",
    "বুধবার (Wednesday)",
    "বৃহস্পতিবার (Thursday)",
    "শুক্রবার (Friday)",
    "শনিবার (Saturday)"
  ];
  return days[dayIndex];
}

// Format date into readable Bengali text
export function formatToBengaliDate(date: Date): string {
  const monthsBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  return `${date.getDate()} ${monthsBn[date.getMonth()]}, ${date.getFullYear()}`;
}

// Calculate the actual age and rounded age
export function calculateAge(birthDateStr: string, now: Date = new Date()): AgeResult {
  const parts = birthDateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const birthDate = new Date(year, month, day);
  
  let actualYears = now.getFullYear() - birthDate.getFullYear();
  let actualMonths = now.getMonth() - birthDate.getMonth();
  let actualDays = now.getDate() - birthDate.getDate();
  
  let actualHours = now.getHours() - birthDate.getHours();
  let actualMinutes = now.getMinutes() - birthDate.getMinutes();
  let actualSeconds = now.getSeconds() - birthDate.getSeconds();

  // Adjust seconds
  if (actualSeconds < 0) {
    actualSeconds += 60;
    actualMinutes--;
  }

  // Adjust minutes
  if (actualMinutes < 0) {
    actualMinutes += 60;
    actualHours--;
  }

  // Adjust hours
  if (actualHours < 0) {
    actualHours += 24;
    actualDays--;
  }

  // Adjust days
  if (actualDays < 0) {
    // Get previous month's days
    const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    actualDays += daysInPrevMonth;
    actualMonths--;
  }

  // Adjust months
  if (actualMonths < 0) {
    actualMonths += 12;
    actualYears--;
  }

  // Handle case where birthDate is in the future
  if (actualYears < 0) {
    return {
      actualYears: 0,
      actualMonths: 0,
      actualDays: 0,
      actualHours: 0,
      actualMinutes: 0,
      actualSeconds: 0,
      roundedYears: 0,
      isRoundedUp: false,
    };
  }

  // Rounding Logic: "৬ মাস ১ দিন থাকলে ১ বছর যোগ হবে যেমন ১ বছর ৬ মাস ১ দিন হলে তাকে ২ বছর দেখাবে"
  // Mathematically: If actualMonths > 6 OR (actualMonths === 6 and actualDays >= 1)
  let roundedYears = actualYears;
  let isRoundedUp = false;
  
  if (actualMonths > 6 || (actualMonths === 6 && actualDays >= 1)) {
    roundedYears = actualYears + 1;
    isRoundedUp = true;
  }

  return {
    actualYears,
    actualMonths,
    actualDays,
    actualHours,
    actualMinutes,
    actualSeconds,
    roundedYears,
    isRoundedUp,
  };
}

// Calculate the remaining time for the next birthday
export function calculateNextBirthday(birthDateStr: string, now: Date = new Date()): BirthdayCountdown {
  const parts = birthDateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const birthDate = new Date(year, month, day);
  
  const currentYear = now.getFullYear();
  
  // Create birthday date in the current year
  let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate(), 0, 0, 0);
  
  // Is today their birthday?
  const isBirthdayToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
  
  let isToday = false;
  let months = 0;
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let totalDaysRemaining = 0;

  if (isBirthdayToday) {
    isToday = true;
    // Birthday is today! Countdown shows remaining time of today
    totalDaysRemaining = 0;
    months = 0;
    days = 0;
    hours = Math.max(0, 23 - now.getHours());
    minutes = Math.max(0, 59 - now.getMinutes());
    seconds = Math.max(0, 59 - now.getSeconds());
  } else {
    // If birthday has already passed this year, set it to next year
    if (nextBday.getTime() <= now.getTime()) {
      nextBday.setFullYear(currentYear + 1);
    }

    const diffMs = nextBday.getTime() - now.getTime();
    
    // Calculate total remaining days
    totalDaysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // Detailed countdown calculation (months, days, hours, minutes, seconds remaining)
    months = nextBday.getMonth() - now.getMonth();
    days = nextBday.getDate() - now.getDate();
    hours = 23 - now.getHours();
    minutes = 59 - now.getMinutes();
    seconds = 59 - now.getSeconds();

    if (days < 0) {
      const prevMonthYear = nextBday.getMonth() === 0 ? nextBday.getFullYear() - 1 : nextBday.getFullYear();
      const prevMonth = nextBday.getMonth() === 0 ? 12 : nextBday.getMonth();
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
      
      days += daysInPrevMonth;
      months--;
    }

    if (months < 0) {
      months += 12;
    }
  }

  const nextBirthdayDayOfWeekBn = getBengaliDayName(nextBday.getDay());
  const nextBirthdayDateStr = formatToBengaliDate(nextBday);

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDaysRemaining,
    nextBirthdayDateStr,
    nextBirthdayDayOfWeekBn,
    isToday,
  };
}

// Select Avatar Stage based on rounded age
export function getAvatarStage(age: number): AvatarStage {
  if (age <= 3) return "baby";
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 35) return "young";
  if (age <= 55) return "middle";
  return "elderly";
}
