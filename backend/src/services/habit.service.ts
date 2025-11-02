import db from '../db.js';
import type { CreateHabitBody } from '../validators/habits.validator.js';

export const findHabitsByUserId = (userId: string) => {
  return db.habit.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createHabit = (userId: string, data: CreateHabitBody) => {
  return db.habit.create({
    data: {
      name: data.name,
      userId: userId,
    },
  });
};

export const deleteHabitById = (userId: string, habbitId: string) => {
  return db.habit.deleteMany({
    where: {
      id: habbitId,
      userId: userId,
    },
  });
};
