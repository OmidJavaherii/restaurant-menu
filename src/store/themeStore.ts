import { create } from 'zustand';

type State = {
  isDarkMode: boolean;
};

type Actions = {
  toggleTheme: () => void;
};

type ThemeStore = State & Actions;

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
})); 