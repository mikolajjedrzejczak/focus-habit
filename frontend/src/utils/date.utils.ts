import { type Habit, type HabitEntry} from '../types/habit.types.js';

const getTodayUTC = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const isHabitDoneToday = (habit: Habit) => {
  const todayTimestamp = getTodayUTC().getTime();

  return habit.entries.some((entry) => {
    const entryDate = new Date(entry.date);

    return entryDate.getTime() === todayTimestamp;
  });
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

export const toUTCDateString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const calculateCurrentStreak = (entries: HabitEntry[]) => {
  if (entries.length === 0) return 0;

  const entriesSet = new Set(
    entries.map((entry) => toUTCDateString(new Date(entry.date)))
  );

  let currentStreak = 0;

  const dayToCheck = getTodayUTC();

  if (entriesSet.has(toUTCDateString(dayToCheck))) {
    currentStreak = 1;
  } else {
    dayToCheck.setUTCDate(dayToCheck.getUTCDate() - 1);
    if (entriesSet.has(toUTCDateString(dayToCheck))) {
      currentStreak = 1;
    } else {
      return 0;
    }
  }

  dayToCheck.setUTCDate(dayToCheck.getUTCDate() - 1);

  while (entriesSet.has(toUTCDateString(dayToCheck))) {
    currentStreak++;
    dayToCheck.setUTCDate(dayToCheck.getUTCDate() - 1);
  }

  return currentStreak;
};

export const calculateLongestStreak = (entries: HabitEntry[]) => {
  if (entries.length === 0) return 0;

  const sortedDates = [
    ...new Set(entries.map((entry) => toUTCDateString(new Date(entry.date)))),
  ];

  let longestStreak = 0;
  let currentStreak = 0;
  let prevTimestamp: number | null = null;

  for (const dateString of sortedDates) {
    const currentTimestamp = new Date(dateString).getTime();

    if (prevTimestamp !== null) {
      const diffTime = currentTimestamp - prevTimestamp;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    prevTimestamp = currentTimestamp;

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }

  return longestStreak;
};
