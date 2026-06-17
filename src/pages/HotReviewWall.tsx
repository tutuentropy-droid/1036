import { Flame, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReviewStore } from '@/store/useReviewStore';
import { movies } from '@/data/movies';
import ReviewItem from '@/components/ReviewItem';
import ScanlineOverlay from '@/components/ScanlineOverlay';

const movieMap = new Map(movies.map((m) => [m.id, m]));

export default function HotReviewWall() {
  const navigate = useNavigate();
  const { getAllReviewsSortedByLikes } = useReviewStore();
  const sortedReviews = getAllReviewsSortedByLikes();

  return (
    <div className="min-h-screen bg-vhs-black relative overflow-hidden">
      <ScanlineOverlay />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-terminal text-lg text-gray-400 hover:text-vhs-green transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          返回博物馆
        </button>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
            <h1 className="font-pixel text-2xl md:text-3xl neon-text-pink">
              热评墙
            </h1>
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
          </div>
          <p className="font-terminal text-xl text-gray-400">
            按点赞数排列 · 全部电影的错位短评
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto mt-6" />
        </div>

        {sortedReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedReviews.map((review, index) => {
              const movie = movieMap.get(review.movieId);
              const isTop3 = index < 3;
              return (
                <div
                  key={review.id}
                  className={`relative ${isTop3 ? 'scale-[1.02]' : ''}`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {isTop3 && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <span
                        className={`font-pixel text-xs px-2 py-1 rounded-sm ${
                          index === 0
                            ? 'bg-yellow-500 text-yellow-900'
                            : index === 1
                            ? 'bg-gray-300 text-gray-700'
                            : 'bg-amber-600 text-amber-100'
                        }`}
                      >
                        TOP {index + 1}
                      </span>
                    </div>
                  )}
                  <ReviewItem
                    review={review}
                    showMovieName
                    movieTitle={movie?.title}
                    movieEmoji={movie?.emoji}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-terminal text-2xl text-gray-500 mb-4">
              🔥 热评墙空空如也
            </p>
            <p className="font-terminal text-lg text-gray-600">
              去电影卡片下方写下第一条错位短评吧
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
