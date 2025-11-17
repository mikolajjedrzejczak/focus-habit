import db from '../db.js';
import { getTodayDate } from '../utils/date.utils.js';
import type { CreateHabitBody } from '../validators/habit.validator.js';

export const createHabit = async (userId: string, data: CreateHabitBody) => {
  const { name, listId } = data;

  const listOwnerCheck = await db.habitList.findFirst({
    where: {
      id: listId,
      userId: userId,
    },
  });

  if (!listOwnerCheck) {
    throw new Error('Nie znaleziono listy lub brak uprawnień');
  }

  return db.habit.create({
    data: {
      name: data.name,
      listId: data.listId,
    },
  });
};

export const deleteHabitById = (userId: string, habbitId: string) => {
  return db.habit.deleteMany({
    where: {
      id: habbitId,
      list: {
        userId: userId,
      },
    },
  });
};

export const toggleHabitEntry = async (userId: string, habitId: string) => {
  const today = getTodayDate();

  const existingEntry = await db.habitEntry.findFirst({
    where: {
      habitId: habitId,
      date: today,
      habit: {
        list: {
          userId: userId,
        },
      },
    },
  });

  if (existingEntry) {
    await db.habitEntry.delete({
      where: {
        id: existingEntry.id,
      },
    });

    return { status: 'deleted' };
  } else {
    const habit = await db.habit.findFirst({
      where: {
        id: habitId,
        list: {
          userId: userId,
        },
      },
    });

    if (!habit) {
      throw new Error('Nie znaleziono nawyku lub brak uprawnień');
    }

    await db.habitEntry.create({
      data: {
        date: today,
        habitId: habitId,
      },
    });
    return { status: 'created' };
  }
};
