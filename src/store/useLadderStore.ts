import { create } from 'zustand';
import { movies } from '@/data/movies';
import { useFilterStore } from './useFilterStore';

export type SortMode = 'mashup' | 'popularity';

interface LadderEntry {
  movieId: string;
  mashupCount: number;
  donatedPopularity: number;
  likes: number;
}

interface LadderState {
  entries: Record<string, LadderEntry>;
  sortMode: SortMode;
  donate: (movieId: string, amount?: number) => void;
  like: (movieId: string) => void;
  setSortMode: (mode: SortMode) => void;
  getSortedEntries: () => LadderEntry[];
  getTotalLikes: () => number;
  getMashupCount: (movieId: string) => number;
  getDonatedPopularity: (movieId: string) => number;
  getTotalPopularity: (movieId: string) => number;
  getDisplayValue: (movieId: string) => number;
  getMaxDisplayValue: () => number;
}

const seedMashupCounts: Record<string, number> = {};
movies.forEach((m) => {
  const misalignment = useFilterStore.getState().computeMovieMisalignment(m);
  seedMashupCounts[m.id] = Math.floor(misalignment * 1.2) + Math.floor(Math.random() * 15) + 20;
});

const initialEntries: Record<string, LadderEntry> = {};
movies.forEach((m) => {
  initialEntries[m.id] = {
    movieId: m.id,
    mashupCount: seedMashupCounts[m.id] || 25,
    donatedPopularity: 0,
    likes: Math.floor(Math.random() * 50) + 10,
  };
});

export const useLadderStore = create<LadderState>((set, get) => ({
  entries: initialEntries,
  sortMode: 'mashup',

  donate: (movieId: string, amount: number = 1) => {
    set((state) => {
      const entry = state.entries[movieId];
      if (!entry) return state;
      return {
        entries: {
          ...state.entries,
          [movieId]: {
            ...entry,
            donatedPopularity: entry.donatedPopularity + amount,
          },
        },
      };
    });
  },

  like: (movieId: string) => {
    set((state) => {
      const entry = state.entries[movieId];
      if (!entry) return state;
      return {
        entries: {
          ...state.entries,
          [movieId]: {
            ...entry,
            likes: entry.likes + 1,
          },
        },
      };
    });
  },

  setSortMode: (mode: SortMode) => set({ sortMode: mode }),

  getSortedEntries: (): LadderEntry[] => {
    const { entries, sortMode } = get();
    return Object.values(entries).sort((a, b) => {
      if (sortMode === 'mashup') {
        return b.mashupCount - a.mashupCount;
      }
      const aTotal = a.mashupCount + a.donatedPopularity;
      const bTotal = b.mashupCount + b.donatedPopularity;
      return bTotal - aTotal;
    });
  },

  getTotalLikes: (): number => {
    return Object.values(get().entries).reduce((sum, e) => sum + e.likes, 0);
  },

  getMashupCount: (movieId: string): number => {
    return get().entries[movieId]?.mashupCount || 0;
  },

  getDonatedPopularity: (movieId: string): number => {
    return get().entries[movieId]?.donatedPopularity || 0;
  },

  getTotalPopularity: (movieId: string): number => {
    const entry = get().entries[movieId];
    if (!entry) return 0;
    return entry.mashupCount + entry.donatedPopularity;
  },

  getDisplayValue: (movieId: string): number => {
    const { sortMode } = get();
    if (sortMode === 'mashup') {
      return get().getMashupCount(movieId);
    }
    return get().getTotalPopularity(movieId);
  },

  getMaxDisplayValue: (): number => {
    const entries = Object.values(get().entries);
    if (entries.length === 0) return 100;
    return Math.max(...entries.map((e) => get().getDisplayValue(e.movieId)));
  },
}));
