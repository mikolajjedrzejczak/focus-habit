import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import {
  createHabitListRequest,
  deleteHabitListRequest,
  getHabitListsRequest,
} from '../services/habitList.service';
import type { HabitList } from '../types/habit.types';
import { createHabitRequest, deleteHabitRequest, toggleHabitRequest } from '../services/habit.service';

const LISTS_QUERY_KEY = ['habitLists'];

export const useHabitLists = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.isAuth);

  const {
    data: habitLists,
    isLoading: isLoadingLists,
    error: listsError,
  } = useQuery({
    queryKey: LISTS_QUERY_KEY,
    queryFn: async () => {
      const response = await getHabitListsRequest();
      return response.data;
    },
    enabled: token,
  });

  const { mutate: createList, isPending: isCreatingList } = useMutation({
    mutationFn: (name: string) => createHabitListRequest({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
    },
  });

  const { mutate: deleteList, isPending: isDeletingList } = useMutation({
    mutationFn: (listId: string) => deleteHabitListRequest(listId),
    onMutate: async (deletedListId: string) => {
      await queryClient.cancelQueries({ queryKey: LISTS_QUERY_KEY });
      const previousLists =
        queryClient.getQueryData<HabitList[]>(LISTS_QUERY_KEY);

      queryClient.setQueryData<HabitList[]>(LIST_QUERY_KEYS, (oldData) =>
        oldData ? oldData.filter((list) => list.id !== deletedListId) : []
      );

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(LISTS_QUERY_KEY, context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
    },
  });

  const { mutate: createHabit, isPending: isCreatingHabit } = useMutation({
    mutationFn: (data: { name: string, listId: string }) => createHabitRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
    },
  });

  const { mutate: deleteHabit, isPending: isDeletingHabit } = useMutation({
    mutationFn: (habitId: string) => deleteHabitRequest(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
    },
  });

  const { mutate: toggleHabit, isPending: isTogglingHabit } = useMutation({
    mutationFn: (habitId: string) => toggleHabitRequest(habitId),
    onMutate: async (toggledHabitId: string) => {
      await queryClient.cancelQueries({ queryKey: LISTS_QUERY_KEY });
      const previousLists = queryClient.getQueryData<HabitList[]>(LISTS_QUERY_KEY);

      queryClient.setQueryData<HabitList[]>(LISTS_QUERY_KEY, (oldLists) => {
        if (!oldLists) return [];
        return oldLists.map(list => ({
          ...list,
          habits: list.habits.map(habit => {
            if (habit.id === toggledHabitId) {
              return { ...habit, name: habit.name + '!' };
            }
            return habit;
          })
        }));
      });
      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(LISTS_QUERY_KEY, context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
    },
  });

  return {
    habitLists,
    isLoadingLists,
    listsError,
    createList,
    isCreatingList,
    deleteList,
    isDeletingList,
    createHabit,
    isCreatingHabit,
    deleteHabit,
    isDeletingHabit,
    toggleHabit,
    isTogglingHabit,
  };
};
