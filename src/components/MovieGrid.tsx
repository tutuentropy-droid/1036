import { useFilterStore } from '@/store/useFilterStore';
import MovieCard from './MovieCard';
import YearSlider from './YearSlider';
import CuratorNote from './CuratorNote';
import Empty from './Empty';
import { Clapperboard, Filter, Film, Rewind } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MovieGrid() {
  const { getFilteredMovies, rewindKey, getMisalignmentRate, isRewinding } = useFilterStore();
  const filteredMovies = getFilteredMovies();
  const rate = getMisalignmentRate();
  const [showRewindIndicator, setShowRewindIndicator] = useState(false);

  useEffect(() => {
    if (isRewinding) {
      setShowRewindIndicator(true);
      const timer = setTimeout(() => setShowRewindIndicator(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [rewindKey, isRewinding]);

  return (
    <section className="relative py-12 px-4 space-y-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clapperboard className="w-8 h-8 text-vhs-purple" />
            <h2 className="font-pixel text-2xl md:text-3xl neon-text-purple">
              馆藏展品
            </h2>
            <Clapperboard className="w-8 h-8 text-vhs-purple" />
          </div>
          <p className="font-terminal text-xl text-gray-400">
            十部90年代经典 × 十位错位导演 = 无限可能
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-vhs-green to-transparent mx-auto mt-6" />
        </div>

        <CuratorNote />

        <div className="mt-12 relative">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-vhs-green" />
              <span className="font-terminal text-lg text-gray-300">
                年代控制
              </span>
              {showRewindIndicator && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-vhs-green/20 border border-vhs-green animate-pulse">
                  <Rewind className="w-4 h-4 text-vhs-green animate-spin" style={{ animationDuration: '0.5s' }} />
                  <span className="font-pixel text-xs text-vhs-green">倒带中...</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-gray-500" />
              <span className="font-terminal text-sm text-gray-500">
                拖动滑块或点击年份 ⏪ 触发倒带
              </span>
            </div>
          </div>

          <div className="mb-8">
            <YearSlider />
          </div>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pt-2 border-t border-vhs-gray/40">
            <div className="flex items-center gap-2">
              <span className="font-terminal text-lg text-gray-300">
                筛选结果
              </span>
              <span
                className="font-pixel text-sm px-3 py-1 rounded-full"
                style={{
                  backgroundColor: filteredMovies.length > 0 ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 107, 157, 0.15)',
                  color: filteredMovies.length > 0 ? '#39ff14' : '#ff6b9d',
                  border: `1px solid ${filteredMovies.length > 0 ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 107, 157, 0.3)'}`,
                }}
              >
                {filteredMovies.length} 部
              </span>
              {filteredMovies.length > 0 && (
                <span
                  className="font-pixel text-sm px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(199, 125, 255, 0.15)',
                    color: '#c77dff',
                    border: '1px solid rgba(199, 125, 255, 0.3)',
                  }}
                >
                  平均错位 {rate}%
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            {showRewindIndicator && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                <div className="absolute inset-0 bg-vhs-black/60 backdrop-blur-sm rounded-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="font-pixel text-5xl text-vhs-green animate-pulse mb-2">
                    ⏪
                  </div>
                  <div className="font-pixel text-xl text-vhs-green vhs-text-glitch">
                    REWINDING
                  </div>
                  <div className="w-48 h-2 bg-vhs-gray/50 rounded-full mt-4 mx-auto overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-vhs-green via-vhs-purple to-vhs-pink rounded-full"
                      style={{ 
                        width: '100%',
                        animation: 'rewindProgress 1s ease-in-out forwards',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {filteredMovies.length > 0 ? (
              <div 
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-all duration-500 ${showRewindIndicator ? 'scale-[0.98] opacity-60' : 'scale-100 opacity-100'}`}
                key={rewindKey}
              >
                {filteredMovies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-4 border-2 border-dashed border-vhs-gray/50 rounded-xl">
            <p className="font-terminal text-lg text-gray-400">
              <span className="text-vhs-green">更多错位电影</span> 正在制作中...
            </p>
            <p className="font-terminal text-sm text-gray-500 mt-1">
              欢迎贡献你的脑洞 ✨
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
