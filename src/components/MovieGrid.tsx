import { movies } from '../data/movies';
import MovieCard from './MovieCard';
import { Clapperboard } from 'lucide-react';

export default function MovieGrid() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
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
