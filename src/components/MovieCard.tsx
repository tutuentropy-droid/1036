import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, User, Tag, Shuffle, Quote } from 'lucide-react';
import type { Movie } from '@/types';
import { useFilterStore } from '@/store/useFilterStore';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [rewindPhase, setRewindPhase] = useState<'idle' | 'rewinding' | 'clearing'>('idle');
  const { rewindKey, computeMovieMisalignment } = useFilterStore();
  const prevRewindKey = useRef(rewindKey);

  const misalignment = computeMovieMisalignment(movie);

  useEffect(() => {
    if (prevRewindKey.current !== rewindKey) {
      prevRewindKey.current = rewindKey;
      const baseDelay = (index % 10) * 60;
      
      setRewindPhase('rewinding');
      
      const clearTimer = setTimeout(() => {
        setRewindPhase('clearing');
      }, 400 + baseDelay);
      
      const doneTimer = setTimeout(() => {
        setRewindPhase('idle');
      }, 900 + baseDelay);
      
      return () => {
        clearTimeout(clearTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [rewindKey, index]);

  const getRewindStyles = (): React.CSSProperties => {
    if (rewindPhase === 'idle') {
      return {};
    }
    if (rewindPhase === 'rewinding') {
      return {
        filter: `blur(12px) hue-rotate(${180 + misalignment}deg) saturate(2) contrast(1.5) brightness(0.7)`,
        transform: `skewX(${Math.sin(misalignment) * 10}deg) scale(0.95)`,
        opacity: 0.4,
      };
    }
    return {
      filter: `blur(0px) hue-rotate(0deg) saturate(1) contrast(1) brightness(1)`,
      transform: `skewX(0deg) scale(1)`,
      opacity: 1,
    };
  };

  const delayClass = `delay-${(index % 10) * 100}` as const;

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`perspective cursor-pointer opacity-0 animate-fade-in-up ${delayClass} relative group`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {rewindPhase !== 'idle' && (
        <>
          <div 
            className="absolute inset-0 z-50 pointer-events-none rounded-xl overflow-hidden vhs-rewind-lines"
            style={{ opacity: rewindPhase === 'rewinding' ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
            style={{ opacity: rewindPhase === 'rewinding' ? 1 : 0, transition: 'opacity 0.2s ease' }}
          >
            <span className="font-pixel text-3xl text-vhs-green animate-pulse vhs-text-glitch">
              ⏪ REW
            </span>
          </div>
        </>
      )}
      
      <div
        className="transition-all ease-out relative z-10"
        style={{
          ...getRewindStyles(),
          transitionDuration: rewindPhase === 'rewinding' ? '0.15s' : '0.5s',
        }}
      >
      <div
        className={`relative w-full h-[420px] transition-transform duration-700 ease-in-out preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2 border-vhs-gray/50 bg-vhs-dark"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div 
            className={`h-40 bg-gradient-to-br ${movie.posterGradient} flex items-center justify-center relative overflow-hidden`}
          >
            <span className="text-6xl z-10">{movie.emoji}</span>
            <div className="absolute inset-0 vhs-stripe opacity-30" />
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-xs font-pixel text-vhs-green">
              NO.{String(index + 1).padStart(2, '0')}
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-pixel text-sm text-white mb-1 leading-relaxed">
                {movie.title}
              </h3>
              {movie.originalTitle && (
                <p className="font-terminal text-sm text-gray-400">
                  {movie.originalTitle}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4 text-vhs-purple" />
                <span className="font-terminal text-sm">{movie.director}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-vhs-green" />
                <span className="font-terminal text-sm">{movie.year}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-vhs-pink" />
                <span className="font-terminal text-sm">{movie.country}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 text-xs font-terminal rounded border border-vhs-gray/50 text-gray-400"
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {g}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-vhs-gray/30">
              <p className={`font-terminal text-xs flex items-center gap-1 transition-colors duration-300 ${isHovered ? 'text-vhs-green' : 'text-vhs-green/70'}`}>
                <Shuffle className={`w-3 h-3 ${isHovered ? 'animate-pulse' : ''}`} />
                点击翻转查看错位事实
              </p>
            </div>
          </div>

          <div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 30px ${movie.posterColor}40, 0 0 20px ${movie.posterColor}30`
            }}
          />
        </div>

        <div 
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2 bg-vhs-dark rotate-y-180"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderColor: `${movie.posterColor}60`,
            boxShadow: `0 0 30px ${movie.posterColor}30, inset 0 0 30px ${movie.posterColor}10`
          }}
        >
          <div 
            className="h-16 bg-gradient-to-r flex items-center justify-center relative"
            style={{ background: `linear-gradient(to right, ${movie.posterColor}40, transparent)` }}
          >
            <Quote className="w-6 h-6 absolute left-4 top-3 opacity-30" style={{ color: movie.posterColor }} />
            <Quote className="w-6 h-6 absolute right-4 bottom-3 opacity-30 rotate-180" style={{ color: movie.posterColor }} />
            <span className="font-pixel text-xs" style={{ color: movie.posterColor }}>
              错位现实
            </span>
          </div>

          <div className="p-5 flex flex-col justify-between h-[calc(100%-4rem)]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shuffle className="w-5 h-5" style={{ color: movie.posterColor }} />
                <span className="font-terminal text-sm text-gray-400">如果</span>
                <span 
                  className="font-pixel text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: `${movie.posterColor}20`, color: movie.posterColor }}
                >
                  {movie.错位Director || '另一位导演'}
                </span>
                <span className="font-terminal text-sm text-gray-400">来拍</span>
              </div>

              <p 
                className="font-terminal text-lg leading-relaxed"
                style={{ color: '#e0e0e0' }}
              >
                "{movie.错位Fact}"
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-terminal">原始导演: {movie.director}</span>
                <span className="font-terminal">{movie.year}</span>
              </div>
              <div className="h-1 rounded-full bg-vhs-gray/30 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: isFlipped ? '100%' : '30%',
                    backgroundColor: movie.posterColor 
                  }}
                />
              </div>
              <p className="font-terminal text-xs text-gray-500 text-center">
                点击卡片返回正面
              </p>
            </div>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="text-3xl opacity-20">{movie.emoji}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
