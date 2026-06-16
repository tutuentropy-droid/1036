import { useFilterStore } from '@/store/useFilterStore';
import MovieCard from './MovieCard';
import YearSlider from './YearSlider';
import CuratorNote from './CuratorNote';
import Empty from './Empty';
import { Clapperboard, Filter, Film } from 'lucide-react';
import { useEffect } from 'react';

export default function MovieGrid() {
  const { getFilteredMovies, rewindKey, getMisalignmentRate } = useFilterStore();
  const filteredMovies = getFilteredMovies();
  const rate = getMisalignmentRate();

  useEffect(() => {
  }, [rewindKey]);

  return (
    <section className="relative py-16 px-4 space-y-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
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

        <div className="space-y-10">
          <YearSlider />
          <CuratorNote />
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-vhs-green" />
              <span className="font-terminal text-lg text-gray-300">
                当前筛选结果
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
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-gray-500" />
              <span className="font-terminal text-sm text-gray-500">
                拖动滑块体验 VHS 倒带效果 ⏪
              </span>
            </div>
          </div>

          {filteredMovies.length > 0 ? (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
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
