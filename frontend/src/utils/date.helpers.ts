import { type Habit } from '../types/habit.types.js';

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
