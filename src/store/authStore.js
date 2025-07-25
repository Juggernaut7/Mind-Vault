// src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: localStorage.getItem('mindvault_user') ? true : false,
  user: localStorage.getItem('mindvault_user') ? JSON.parse(localStorage.getItem('mindvault_user')) : null,

  login: (username) => {
    const user = { username }; // In a real app, you'd get full user data from backend
    localStorage.setItem('mindvault_user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  logout: () => {
    localStorage.removeItem('mindvault_user');
    set({ isAuthenticated: false, user: null });
  },
}));

export default useAuthStore;