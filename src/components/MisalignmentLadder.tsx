import { useState, useEffect } from 'react';
import { Trophy, Heart, Zap, TrendingUp, Shuffle, ArrowUpDown } from 'lucide-react';
import { useLadderStore } from '@/store/useLadderStore';
import { movies } from '@/data/movies';
import type { Movie } from '@/types';

const movieMap: Record<string, Movie> = {};
movies.forEach((m) => {
  movieMap[m.id] = m;
});

function RetroMeter({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const segments = 10;
  const filledSegments = Math.round((percentage / 100) * segments);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: segments }).map((_, i) => {
        const isFilled = i < filledSegments;
        const intensity = i / segments;
        const barColor = isFilled
          ? intensity > 0.7
            ? '#ff6b9d'
            : intensity > 0.4
            ? color
            : '#39ff14'
          : '#1a1a2e';

        return (
          <div
            key={i}
            className="w-1.5 h-4 rounded-sm transition-all duration-300"
            style={{
              backgroundColor: barColor,
              boxShadow: isFilled ? `0 0 4px ${barColor}` : 'none',
              opacity: isFilled ? 1 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}

function LadderBar({
  movie,
  rank,
  value,
  maxValue,
  mashupCount,
  donatedPopularity,
  likes,
  sortMode,
  onDonate,
  onLike,
}: {
  movie: Movie;
  rank: number;
  value: number;
  maxValue: number;
  mashupCount: number;
  donatedPopularity: number;
  likes: number;
  sortMode: 'mashup' | 'popularity';
  onDonate: () => void;
  onLike: () => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDonateEffect, setShowDonateEffect] = useState(false);

  const percentage = Math.min((value / maxValue) * 100, 100);
  const mashupPercentage = Math.min((mashupCount / maxValue) * 100, 100);
  const donatedPercentage = Math.min((donatedPopularity / maxValue) * 100, 100);

  const getRankStyle = () => {
    if (rank === 1) return { color: '#ffd700', glow: 'rgba(255, 215, 0, 0.6)' };
    if (rank === 2) return { color: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.5)' };
    if (rank === 3) return { color: '#cd7f32', glow: 'rgba(205, 127, 50, 0.5)' };
    return { color: '#888', glow: 'transparent' };
  };

  const rankStyle = getRankStyle();

  const handleDonate = () => {
    onDonate();
    setIsAnimating(true);
    setShowDonateEffect(true);
    setTimeout(() => setIsAnimating(false), 300);
    setTimeout(() => setShowDonateEffect(false), 800);
  };

  return (
    <div
      className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
        isAnimating ? 'scale-[1.02]' : ''
      }`}
      style={{
        borderColor: `${movie.posterColor}30`,
        backgroundColor: `${movie.posterColor}08`,
      }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-pixel text-lg"
        style={{
          color: rankStyle.color,
          textShadow: rank <= 3 ? `0 0 10px ${rankStyle.glow}` : 'none',
          backgroundColor: 'rgba(0,0,0,0.4)',
          border: `1px solid ${rankStyle.color}40`,
        }}
      >
        {rank <= 3 ? (
          <Trophy className="w-5 h-5" style={{ color: rankStyle.color }} />
        ) : (
          `#${rank}`
        )}
      </div>

      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg text-3xl"
        style={{
          background: `linear-gradient(135deg, ${movie.posterColor}30, transparent)`,
          border: `1px solid ${movie.posterColor}40`,
        }}
      >
        {movie.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-pixel text-sm text-white truncate group-hover:text-vhs-green transition-colors">
            {movie.title}
          </h3>
          <RetroMeter value={value} max={maxValue} color={movie.posterColor} />
        </div>

        <div className="relative h-8 rounded-md overflow-hidden bg-vhs-gray/40 border border-vhs-gray/50">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
            style={{
              width: `${mashupPercentage}%`,
              background: `linear-gradient(90deg, ${movie.posterColor}60, ${movie.posterColor})`,
            }}
          />

          {sortMode === 'popularity' && donatedPopularity > 0 && (
            <div
              className="absolute inset-y-0 transition-all duration-700 ease-out"
              style={{
                left: `${mashupPercentage}%`,
                width: `${donatedPercentage}%`,
                background: `linear-gradient(90deg, #ff6b9d, #c77dff)`,
                boxShadow: '0 0 10px rgba(255, 107, 157, 0.5)',
              }}
            />
          )}

          <div className="absolute inset-0 vhs-stripe opacity-20" />

          <div className="absolute inset-0 flex items-center px-3">
            <span className="font-pixel text-xs text-white drop-shadow-lg">
              {sortMode === 'mashup' ? (
                <>
                  <Shuffle className="w-3 h-3 inline mr-1" />
                  {mashupCount} 次混搭
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {value} 人气值
                  {donatedPopularity > 0 && (
                    <span className="text-vhs-pink ml-1">
                      (+{donatedPopularity})
                    </span>
                  )}
                </>
              )}
            </span>
          </div>

          {showDonateEffect && (
            <div className="absolute inset-0 bg-vhs-pink/30 animate-pulse" />
          )}
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <button
          onClick={onLike}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-vhs-pink/30 bg-vhs-pink/10 text-vhs-pink hover:bg-vhs-pink/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Heart className="w-3.5 h-3.5" />
          <span className="font-pixel text-xs">{likes}</span>
        </button>

        <button
          onClick={handleDonate}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-vhs-green/30 bg-vhs-green/10 text-vhs-green hover:bg-vhs-green/20 transition-all duration-200 hover:scale-105 active:scale-95 group/btn"
        >
          <Zap className="w-3.5 h-3.5 group-hover/btn:animate-pulse" />
          <span className="font-pixel text-xs">捐赠错位</span>
        </button>
      </div>

      {showDonateEffect && (
        <div className="absolute -top-2 right-16 font-pixel text-sm text-vhs-pink animate-bounce">
          +1
        </div>
      )}
    </div>
  );
}

export default function MisalignmentLadder() {
  const {
    sortMode,
    setSortMode,
    getSortedEntries,
    getTotalLikes,
    getDisplayValue,
    getMaxDisplayValue,
    getMashupCount,
    getDonatedPopularity,
    donate,
    like,
  } = useLadderStore();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const sortedEntries = getSortedEntries();
  const totalLikes = getTotalLikes();
  const maxValue = getMaxDisplayValue();

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-vhs-yellow" />
            <h2 className="font-pixel text-2xl md:text-3xl neon-text-purple">
              错位天梯
            </h2>
            <Trophy className="w-8 h-8 text-vhs-yellow" />
          </div>
          <p className="font-terminal text-xl text-gray-400">
            每一次混搭都是一次时空错乱 · 捐赠错位值为你爱的电影充电
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-vhs-pink to-transparent mx-auto mt-6" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vhs-dark/60 border border-vhs-pink/30">
            <Heart className="w-5 h-5 text-vhs-pink animate-pulse" />
            <span className="font-terminal text-lg text-gray-300">总点赞量:</span>
            <span className="font-pixel text-lg text-vhs-pink">{totalLikes}</span>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-vhs-dark/60 border border-vhs-gray/50">
            <button
              onClick={() => setSortMode('mashup')}
              className={`px-4 py-2 rounded-lg font-pixel text-xs transition-all duration-300 flex items-center gap-2 ${
                sortMode === 'mashup'
                  ? 'bg-vhs-green text-vhs-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{
                boxShadow: sortMode === 'mashup' ? '0 0 20px rgba(57, 255, 20, 0.4)' : 'none',
              }}
            >
              <Shuffle className="w-4 h-4" />
              混搭次数
            </button>
            <button
              onClick={() => setSortMode('popularity')}
              className={`px-4 py-2 rounded-lg font-pixel text-xs transition-all duration-300 flex items-center gap-2 ${
                sortMode === 'popularity'
                  ? 'bg-vhs-purple text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{
                boxShadow: sortMode === 'popularity' ? '0 0 20px rgba(199, 125, 255, 0.4)' : 'none',
              }}
            >
              <TrendingUp className="w-4 h-4" />
              人气值
            </button>
          </div>
        </div>

        <div
          className={`space-y-3 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {sortedEntries.map((entry, index) => {
            const movie = movieMap[entry.movieId];
            if (!movie) return null;

            const value = getDisplayValue(entry.movieId);
            const mashupCount = getMashupCount(entry.movieId);
            const donatedPopularity = getDonatedPopularity(entry.movieId);

            return (
              <div
                key={entry.movieId}
                style={{ animationDelay: `${index * 80}ms` }}
                className="animate-fade-in-up opacity-0"
              >
                <LadderBar
                  movie={movie}
                  rank={index + 1}
                  value={value}
                  maxValue={maxValue}
                  mashupCount={mashupCount}
                  donatedPopularity={donatedPopularity}
                  likes={entry.likes}
                  sortMode={sortMode}
                  onDonate={() => donate(entry.movieId)}
                  onLike={() => like(entry.movieId)}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-terminal text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-vhs-green/60 to-vhs-green" />
            <span>基础混搭次数</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-vhs-pink to-vhs-purple" />
            <span>捐赠错位加成</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            <span>点击切换排序维度</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-vhs-green" />
            <span>捐赠错位值可提升人气排名</span>
          </div>
        </div>
      </div>
    </section>
  );
}
