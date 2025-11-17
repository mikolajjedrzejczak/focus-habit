import db from '../db.js';
import type {
  CreateListBody,
  UpdateListBody,
} from '../validators/habitList.validator.js';

export const findListsByUserId = (userId: string) => {
  return db.habitList.findMany({
    where: { userId: userId },
    include: {
      habits: {
        include: {
          entries: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const createList = (userId: string, data: CreateListBody) => {
  return db.habitList.create({
    data: {
      name: data.name,
      userId: userId,
    },
  });
};

export const updateList = (
  userId: string,
  listId: string,
  data: UpdateListBody
) => {
  return db.habitList.updateMany({
    where: {
      id: listId,
      userId: userId,
    },
    data: {
      name: data.name,
    },
  });
};

export const deleteList = (userId: string, listId: string) => {
  return db.habitList.deleteMany({
    where: {
      id: listId,
      userId: userId,
    },
  });
};
