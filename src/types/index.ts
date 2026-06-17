export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  year: number;
  director: string;
  country: string;
  genre: string[];
  posterColor: string;
  posterGradient?: string;
  错位Fact: string;
  错位Director?: string;
  emoji: string;
}

export interface DialogLine {
  id: string;
  speaker: 'A' | 'B';
  movieTitle: string;
  movieEmoji: string;
  text: string;
  timestamp: number;
}

export interface Script {
  id: string;
  movieA: Movie;
  movieB: Movie;
  lines: DialogLine[];
  createdAt: number;
  title: string;
}

export interface ScriptHistory {
  script: Script;
  rating: number;
  viewedAt: number;
}

export interface ComboRanking {
  comboId: string;
  movieAId: string;
  movieBId: string;
  totalRating: number;
  ratingCount: number;
  averageRating: number;
}

export interface Review {
  id: string;
  movieId: string;
  content: string;
  authorId: string;
  likes: number;
  likedBy: string[];
  createdAt: number;
}
