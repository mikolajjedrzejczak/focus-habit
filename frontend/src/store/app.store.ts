import { create } from 'zustand';

export interface TimeSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

interface AppState {
  selectedListId: string | null;
  setSelectedListId: (listId: string | null) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  focusHabitId: string | null;
  setFocusHabitId: (habitId: string | null) => void;

  timerSettings: TimeSettings;
  updateTimerSettings: (settings: Partial<TimeSettings>) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  selectedListId: null,
  setSelectedListId: (listId) => set({ selectedListId: listId }),

  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  focusHabitId: null,
  setFocusHabitId: (habitId) => set({ focusHabitId: habitId }),

  timerSettings: {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  updateTimerSettings: (newSettings) =>
    set((state) => ({
      timerSettings: { ...state.timerSettings, ...newSettings },
    })),
}));
