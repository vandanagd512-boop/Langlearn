import { StateCreator } from 'zustand';

export interface UiState {
  sidebarOpen: boolean;
  activeLanguageModalOpen: boolean;
  globalSearchOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguageModalOpen: (open: boolean) => void;
  setGlobalSearchOpen: (open: boolean) => void;
}

export const createUiSlice: StateCreator<UiState, [], [], UiState> = (set) => ({
  sidebarOpen: false,
  activeLanguageModalOpen: false,
  globalSearchOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLanguageModalOpen: (open) => set({ activeLanguageModalOpen: open }),
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
});
