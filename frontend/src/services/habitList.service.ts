import type { HabitList } from '../types/habit.types';
import apiClient from './apiClient';

interface CreateListData {
  name: string;
}

interface UpdateListData {
  name: string;
}

export const getHabitListsRequest = () => {
  return apiClient.get<HabitList[]>('/lists');
};

export const createHabitListRequest = (data: CreateListData) => {
  return apiClient.post<HabitList>('/lists', data);
};

export const updateHabitListRequest = (
  listId: string,
  data: UpdateListData
) => {
  return apiClient.put(`/lists/${listId}`, data);
};

export const deleteHabitListRequest = (listId: string) => {
  return apiClient.delete(`/lists/${listId}`);
};
