import { movies } from '@/data/movies';
import type { Movie } from '@/types';
import { Sparkles, User, Shuffle } from 'lucide-react';

interface MovieSelectorProps {
  selectedMovie: Movie | null;
  onSelect: (movie: Movie) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function MovieSelector({
  selectedMovie,
  onSelect,
  onGenerate,
  isGenerating,
}: MovieSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <User className="w-7 h-7 text-vhs-green" />
          <h3 className="font-pixel text-xl neon-text-green">
            选择你的主角电影
          </h3>
        </div>
        <p className="font-terminal text-gray-400">
          点击一部电影作为主角，系统将随机匹配另一部进行错位对话
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => {
          const isSelected = selectedMovie?.id === movie.id;
          return (
            <button
              key={movie.id}
              onClick={() => onSelect(movie)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'scale-105 shadow-lg'
                  : 'hover:scale-[1.02] hover:shadow-md'
              }`}
              style={{
                borderColor: isSelected ? movie.posterColor : 'rgba(255,255,255,0.1)',
                backgroundColor: isSelected ? `${movie.posterColor}15` : 'rgba(255,255,255,0.03)',
                boxShadow: isSelected ? `0 0 25px ${movie.posterColor}30` : 'none',
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-4xl transition-transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${movie.posterColor}40, transparent)`,
                    border: `1px solid ${movie.posterColor}40`,
                  }}
                >
                  {movie.emoji}
                </div>
                <div className="text-center">
                  <p className="font-pixel text-sm text-white truncate w-full">
                    {movie.title}
                  </p>
                  <p className="font-terminal text-xs text-gray-500 mt-1">
                    {movie.year} · {movie.director}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-pixel"
                  style={{ backgroundColor: movie.posterColor, color: '#000' }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onGenerate}
          disabled={!selectedMovie || isGenerating}
          className="group relative px-8 py-4 rounded-xl font-pixel text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: selectedMovie
              ? `linear-gradient(135deg, ${selectedMovie.posterColor}, #c77dff)`
              : 'linear-gradient(135deg, #39ff14, #c77dff)',
            color: '#000',
            boxShadow: selectedMovie
              ? `0 0 30px ${selectedMovie.posterColor}40`
              : '0 0 20px rgba(57, 255, 20, 0.2)',
          }}
        >
          <span className="flex items-center gap-2">
            {isGenerating ? (
              <>
                <Shuffle className="w-5 h-5 animate-spin" />
                错位匹配中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                生成错位剧本
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </span>
        </button>
      </div>

      {selectedMovie && (
        <div
          className="p-4 rounded-xl border text-center"
          style={{
            borderColor: `${selectedMovie.posterColor}30`,
            backgroundColor: `${selectedMovie.posterColor}08`,
          }}
        >
          <p className="font-terminal text-gray-300">
            已选择 <span className="font-pixel text-vhs-green">{selectedMovie.emoji} {selectedMovie.title}</span>
            ，即将穿越到另一部电影的世界...
          </p>
        </div>
      )}
    </div>
  );
}
