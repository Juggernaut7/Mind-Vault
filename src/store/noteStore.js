// src/store/noteStore.js
import { create } from 'zustand';

// This store can hold global UI state related to notes,
// like search queries, active filters, or sort order,
// while useLiveQuery handles the actual note data from Dexie.
const useNoteStore = create((set) => ({
  searchTerm: '',
  activeTags: [],
  sortOrder: 'newest', // 'newest', 'oldest', 'title'

  setSearchTerm: (term) => set({ searchTerm: term }),
  addActiveTag: (tag) => set((state) => ({ activeTags: [...state.activeTags, tag] })),
  removeActiveTag: (tag) => set((state) => ({ activeTags: state.activeTags.filter(t => t !== tag) })),
  setSortOrder: (order) => set({ sortOrder: order }),
  toggleTag: (tag) =>
    set((state) => ({
      activeTags: state.activeTags.includes(tag)
        ? state.activeTags.filter((t) => t !== tag)
        : [...state.activeTags, tag],
    })),
}));

export default useNoteStore;