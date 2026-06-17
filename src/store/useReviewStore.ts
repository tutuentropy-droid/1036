import { create } from 'zustand';
import type { Review } from '@/types';

const STORAGE_KEY = 'vhs-museum-reviews';
const AUTHOR_KEY = 'vhs-museum-author-id';

function getAuthorId(): string {
  let id = localStorage.getItem(AUTHOR_KEY);
  if (!id) {
    id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(AUTHOR_KEY, id);
  }
  return id;
}

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

interface ReviewState {
  reviews: Review[];
  authorId: string;
  addReview: (movieId: string, content: string) => void;
  deleteReview: (reviewId: string) => void;
  toggleLike: (reviewId: string) => void;
  getReviewsByMovie: (movieId: string) => Review[];
  getReviewCountByMovie: (movieId: string) => number;
  getAllReviewsSortedByLikes: () => Review[];
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: loadReviews(),
  authorId: getAuthorId(),

  addReview: (movieId, content) => {
    const newReview: Review = {
      id: `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      movieId,
      content,
      authorId: get().authorId,
      likes: 0,
      likedBy: [],
      createdAt: Date.now(),
    };
    const updated = [...get().reviews, newReview];
    saveReviews(updated);
    set({ reviews: updated });
  },

  deleteReview: (reviewId) => {
    const updated = get().reviews.filter(
      (r) => !(r.id === reviewId && r.authorId === get().authorId)
    );
    saveReviews(updated);
    set({ reviews: updated });
  },

  toggleLike: (reviewId) => {
    const authorId = get().authorId;
    const updated = get().reviews.map((r) => {
      if (r.id !== reviewId) return r;
      const hasLiked = r.likedBy.includes(authorId);
      return {
        ...r,
        likes: hasLiked ? r.likes - 1 : r.likes + 1,
        likedBy: hasLiked
          ? r.likedBy.filter((id) => id !== authorId)
          : [...r.likedBy, authorId],
      };
    });
    saveReviews(updated);
    set({ reviews: updated });
  },

  getReviewsByMovie: (movieId) => {
    return get()
      .reviews.filter((r) => r.movieId === movieId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  getReviewCountByMovie: (movieId) => {
    return get().reviews.filter((r) => r.movieId === movieId).length;
  },

  getAllReviewsSortedByLikes: () => {
    return [...get().reviews].sort((a, b) => b.likes - a.likes);
  },
}));
