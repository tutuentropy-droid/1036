import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

export default function StarRating({
  rating,
  onRate,
  size = 'md',
  readOnly = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const gapMap = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  };

  const displayRating = hoverRating || rating;

  const handleClick = (value: number) => {
    if (readOnly) return;
    if (rating === value) {
      onRate(0);
    } else {
      onRate(value);
    }
  };

  const getRatingLabel = (value: number) => {
    const labels = ['', '很差', '一般', '还行', '不错', '神级错位'];
    return labels[value] || '';
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center ${gapMap[size]}`}>
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= displayRating;
          return (
            <button
              key={value}
              onClick={() => handleClick(value)}
              onMouseEnter={() => !readOnly && setHoverRating(value)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              disabled={readOnly}
              className={`transition-all duration-200 ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-125 active:scale-95'
              }`}
            >
              <Star
                className={`${sizeMap[size]} transition-all duration-200`}
                style={{
                  color: isFilled ? '#ffd700' : 'rgba(255,255,255,0.2)',
                  fill: isFilled ? '#ffd700' : 'transparent',
                  filter: isFilled ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' : 'none',
                }}
              />
            </button>
          );
        })}
      </div>

      {!readOnly && displayRating > 0 && (
        <span
          className={`font-pixel ${
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          }`}
          style={{ color: '#ffd700' }}
        >
          {getRatingLabel(displayRating)}
        </span>
      )}

      {readOnly && rating > 0 && (
        <span
          className={`font-pixel ${
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          }`}
          style={{ color: '#ffd700' }}
        >
          {rating}.0
        </span>
      )}
    </div>
  );
}
