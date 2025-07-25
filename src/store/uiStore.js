// src/store/uiStore.js
import { create } from 'zustand';

const useUiStore = create((set) => ({
  isSidebarOpen: false, // Default to closed on mobile
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));

export default useUiStore;
