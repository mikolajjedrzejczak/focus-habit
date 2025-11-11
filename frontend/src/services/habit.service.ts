import apiClient from './apiClient';
import { type Habit } from '../types';

interface CreateHabitData {
  name: string;
}

export const getHabitsRequest = () => {
  return apiClient.get<Habit[]>('/habits');
};

export const createHabitRequest = (data: CreateHabitData) => {
  return apiClient.post<Habit>('/habits', data);
};

export const deleteHabitRequest = (habitId: string) => {
    return apiClient.delete(`/habits/${habitId}`);
}
