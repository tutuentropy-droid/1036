import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { Movie } from '@/types';
import { useReviewStore } from '@/store/useReviewStore';
import ReviewInput from './ReviewInput';
import ReviewItem from './ReviewItem';

interface ReviewWallProps {
  movie: Movie;
}

export default function ReviewWall({ movie }: ReviewWallProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getReviewsByMovie, getReviewCountByMovie } = useReviewStore();
  const reviews = getReviewsByMovie(movie.id);
  const count = getReviewCountByMovie(movie.id);

  return (
    <div className="mt-3 border-t border-amber-800/20 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full group/review"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-amber-700/60" />
          <span className="font-terminal text-xs text-amber-700/70">
            错位短评
          </span>
          {count > 0 && (
            <span className="font-terminal text-xs bg-amber-700/20 text-amber-800 px-1.5 py-0.5 rounded">
              {count}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-amber-700/50" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-amber-700/50" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 animate-fade-in-up">
          <ReviewInput movieId={movie.id} />
          {reviews.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="font-terminal text-xs text-amber-700/40 text-center py-2">
              暂无短评，来写第一条吧 ✏️
            </p>
          )}
        </div>
      )}
    </div>
  );
}
