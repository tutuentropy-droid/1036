import { Heart, Trash2 } from 'lucide-react';
import type { Review } from '@/types';
import { useReviewStore } from '@/store/useReviewStore';

interface ReviewItemProps {
  review: Review;
  showMovieName?: boolean;
  movieTitle?: string;
  movieEmoji?: string;
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 30) return `${diffDay}天前`;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReviewItem({ review, showMovieName, movieTitle, movieEmoji }: ReviewItemProps) {
  const { toggleLike, deleteReview, authorId } = useReviewStore();
  const isOwner = review.authorId === authorId;
  const hasLiked = review.likedBy.includes(authorId);

  return (
    <div className="sticky-note relative p-3 rounded-sm group">
      <div className="tape-strip" />
      {showMovieName && movieTitle && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">{movieEmoji}</span>
          <span className="font-terminal text-xs text-amber-800/70 bg-amber-200/60 px-2 py-0.5 rounded">
            {movieTitle}
          </span>
        </div>
      )}
      <p className="font-terminal text-base text-amber-900 leading-relaxed mb-2">
        "{review.content}"
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleLike(review.id)}
            className={`flex items-center gap-1 font-terminal text-xs transition-all active:scale-90 ${
              hasLiked ? 'text-red-500' : 'text-amber-700/50 hover:text-red-400'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all ${hasLiked ? 'fill-red-500 scale-110' : ''}`}
            />
            <span>{review.likes}</span>
          </button>
          <span className="font-terminal text-xs text-amber-700/40">
            {formatTimestamp(review.createdAt)}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={() => deleteReview(review.id)}
            className="flex items-center gap-1 font-terminal text-xs text-amber-700/30 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
          >
            <Trash2 className="w-3 h-3" />
            删除
          </button>
        )}
      </div>
    </div>
  );
}
