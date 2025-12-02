import apiClient from './apiClient';
import type { Habit } from '../types/habit.types';

interface CreateHabitData {
  name: string;
  listId: string;
}

export const createHabitRequest = (data: CreateHabitData) => {
  return apiClient.post<Habit>('/habits', data);
};

export const toggleHabitRequest = (habitId: string) => {
  return apiClient.post(`/habits/${habitId}/toggle`);
};

export const deleteHabitRequest = (habitId: string) => {
  return apiClient.delete(`/habits/${habitId}`);
};
