import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHabitsRequest,
  createHabitRequest,
  deleteHabitRequest,
  toggleHabitRequest,
} from '../services/habit.service';

const HABITS_QUERY_KEY = ['habits'];

export const useHabits = () => {
  const queryClient = useQueryClient();

  const {
    data: habits,
    isLoading: isLoadingHabits,
    error: habitsError,
  } = useQuery({
    queryKey: HABITS_QUERY_KEY,
    queryFn: async () => {
      const response = await getHabitsRequest();
      return response.data;
    },
  });

  const { mutate: createHabit, isPending: isCreatingHabit } = useMutation({
    mutationFn: (name: string) => createHabitRequest({ name }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  const { mutate: toggleHabit, isPending: isTogglingHabit } = useMutation({
    mutationFn: (habitId: string) => toggleHabitRequest(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  const { mutate: deleteHabit, isPending: isDeletingHabit } = useMutation({
    mutationFn: (habitId: string) => deleteHabitRequest(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  return {
    habits,
    isLoadingHabits,
    habitsError,
    createHabit,
    isCreatingHabit,
    toggleHabit,
    isTogglingHabit,
    deleteHabit,
    isDeletingHabit,
  };
};
