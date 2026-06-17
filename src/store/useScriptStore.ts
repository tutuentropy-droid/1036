import { create } from 'zustand';
import type { Script, ScriptHistory, ComboRanking } from '@/types';

interface ScriptState {
  history: ScriptHistory[];
  comboRankings: Record<string, ComboRanking>;
  currentScript: Script | null;

  saveScript: (script: Script) => void;
  rateScript: (scriptId: string, rating: number) => void;
  getScriptRating: (scriptId: string) => number;
  getHistory: () => ScriptHistory[];
  getComboRankings: () => ComboRanking[];
  setCurrentScript: (script: Script | null) => void;
  clearHistory: () => void;
}

function getComboId(aId: string, bId: string): string {
  return [aId, bId].sort().join('_');
}

export const useScriptStore = create<ScriptState>((set, get) => ({
  history: [],
  comboRankings: {},
  currentScript: null,

  saveScript: (script: Script) => {
    set((state) => {
      const exists = state.history.find((h) => h.script.id === script.id);
      if (exists) return state;

      const historyEntry: ScriptHistory = {
        script,
        rating: 0,
        viewedAt: Date.now(),
      };

      return {
        history: [historyEntry, ...state.history],
        currentScript: script,
      };
    });
  },

  rateScript: (scriptId: string, rating: number) => {
    set((state) => {
      const history = state.history.map((h) => {
        if (h.script.id === scriptId) {
          return { ...h, rating };
        }
        return h;
      });

      const target = state.history.find((h) => h.script.id === scriptId);
      let comboRankings = { ...state.comboRankings };

      if (target) {
        const { movieA, movieB } = target.script;
        const comboId = getComboId(movieA.id, movieB.id);
        const existing = comboRankings[comboId];

        const prevRating = target.rating;
        const isNewRating = prevRating === 0;

        if (existing) {
          let newTotalRating = existing.totalRating - prevRating + rating;
          let newRatingCount = isNewRating ? existing.ratingCount + 1 : existing.ratingCount;
          if (newRatingCount === 0) newRatingCount = 1;

          comboRankings[comboId] = {
            ...existing,
            totalRating: newTotalRating,
            ratingCount: newRatingCount,
            averageRating: newTotalRating / newRatingCount,
          };
        } else {
          comboRankings[comboId] = {
            comboId,
            movieAId: movieA.id,
            movieBId: movieB.id,
            totalRating: rating,
            ratingCount: 1,
            averageRating: rating,
          };
        }
      }

      return { history, comboRankings };
    });
  },

  getScriptRating: (scriptId: string): number => {
    const entry = get().history.find((h) => h.script.id === scriptId);
    return entry?.rating || 0;
  },

  getHistory: (): ScriptHistory[] => {
    return [...get().history].sort((a, b) => b.viewedAt - a.viewedAt);
  },

  getComboRankings: (): ComboRanking[] => {
    return Object.values(get().comboRankings).sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.ratingCount - a.ratingCount;
    });
  },

  setCurrentScript: (script: Script | null) => {
    set({ currentScript: script });
  },

  clearHistory: () => {
    set({ history: [], comboRankings: {}, currentScript: null });
  },
}));
