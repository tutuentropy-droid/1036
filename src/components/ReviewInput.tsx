import { useState } from 'react';
import { Send } from 'lucide-react';
import { useReviewStore } from '@/store/useReviewStore';

interface ReviewInputProps {
  movieId: string;
}

export default function ReviewInput({ movieId }: ReviewInputProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { addReview } = useReviewStore();

  const MAX_LEN = 50;
  const remaining = MAX_LEN - content.length;
  const isValid = content.trim().length > 0 && content.length <= MAX_LEN;

  const handleSubmit = () => {
    if (!isValid) return;
    addReview(movieId, content.trim());
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky-note relative p-4 rounded-sm">
      <div className="tape-strip" />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder="写一条错位短评..."
        maxLength={MAX_LEN}
        rows={2}
        className={`w-full bg-transparent font-terminal text-base text-amber-900 placeholder-amber-700/50 resize-none outline-none leading-relaxed ${
          isFocused ? 'border-b-2 border-amber-600/40' : ''
        }`}
      />
      <div className="flex items-center justify-between mt-2">
        <span
          className={`font-terminal text-xs ${
            remaining <= 10 ? 'text-red-600' : 'text-amber-700/60'
          }`}
        >
          {remaining} 字
        </span>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex items-center gap-1 px-3 py-1.5 rounded font-terminal text-sm transition-all ${
            isValid
              ? 'bg-amber-800/80 text-amber-100 hover:bg-amber-900 active:scale-95'
              : 'bg-amber-800/30 text-amber-700/40 cursor-not-allowed'
          }`}
        >
          <Send className="w-3 h-3" />
          发布
        </button>
      </div>
    </div>
  );
}
