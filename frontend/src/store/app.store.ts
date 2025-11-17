import { create } from 'zustand';

interface AppState {
  selectedListId: string | null;
  setSelectedListId: (listId: string | null) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  selectedListId: null,
  setSelectedListId: (listId) => set({ selectedListId: listId }),
}));
