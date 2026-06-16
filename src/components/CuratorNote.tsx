import { useMemo } from 'react';
import { BookmarkPlus, Trophy, TrendingDown, MessageSquareQuote } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';

export default function CuratorNote() {
  const {
    getMostMisalignedMovie,
    getLeastMisalignedMovie,
    computeMovieMisalignment,
    getMisalignmentRate,
    getFilteredMovies,
    selectedYear,
    regionFilter,
  } = useFilterStore();

  const mostMovie = getMostMisalignedMovie();
  const leastMovie = getLeastMisalignedMovie();
  const avgRate = getMisalignmentRate();
  const filteredCount = getFilteredMovies().length;

  const mostRate = mostMovie ? computeMovieMisalignment(mostMovie) : 0;
  const leastRate = leastMovie ? computeMovieMisalignment(leastMovie) : 0;

  const regionName = useMemo(() => {
    switch (regionFilter) {
      case 'domestic':
        return '华语电影区';
      case 'foreign':
        return '海外电影区';
      default:
        return '全馆藏品';
    }
  }, [regionFilter]);

  const curatorQuote = useMemo(() => {
    if (filteredCount === 0) {
      return `唉，${selectedYear}年在${regionName}里找不到任何藏品...馆长我要去喝杯茶冷静一下。`;
    }

    if (avgRate >= 70) {
      return (
        mostMovie &&
        `警告！${regionName}在${selectedYear}年出现严重时空错乱！《${mostMovie.title}》的错位率高达${mostRate}%，据馆长我的专业眼光推测——${mostMovie.错位Director}拍这部片时肯定喝了${mostRate}杯浓缩咖啡。建议佩戴偏振眼镜观看，否则有脑壳炸裂风险！`
      );
    }

    if (avgRate >= 50) {
      return (
        mostMovie &&
        leastMovie &&
        `嗯哼，${selectedYear}年的${regionName}相当有看点。最疯的是《${mostMovie.title}》（${mostRate}%），${mostMovie.错位Director}简直把原作按在地上摩擦；最稳的是《${leastMovie.title}》（${leastRate}%），感觉${leastMovie.错位Director}只是换了个机位就收工了。作为馆长，我对这种参差表示满意。`
      );
    }

    if (avgRate >= 30) {
      return (
        leastMovie &&
        `${selectedYear}年，${regionName}整体还算克制。值得一提的是《${leastMovie.title}》（${leastRate}%），${leastMovie.错位Director}的处理保守得像我家老太太——明明有错位机会，愣是拍成了纪录片。年轻人还是要敢想敢干嘛！`
      );
    }

    return (
      leastMovie &&
      `${selectedYear}年的${regionName}真是...无聊啊。平均错位率才${avgRate}%，特别是《${leastMovie.title}》（${leastRate}%），跟原片几乎没差！馆长我建议把这些片子移到"原味复刻区"去，这里是错位博物馆不是电影院！`
    );
  }, [avgRate, mostMovie, leastMovie, mostRate, leastRate, selectedYear, regionName, filteredCount]);

  if (filteredCount === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-vhs-dark/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-dashed border-vhs-gray/50 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquareQuote className="w-6 h-6 text-gray-500" />
            <h3 className="font-pixel text-lg text-gray-400">馆长留言</h3>
          </div>
          <p className="font-terminal text-base md:text-lg text-gray-500 leading-relaxed italic">
            "{curatorQuote}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="relative bg-vhs-dark/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 shadow-2xl overflow-hidden"
        style={{
          borderColor: avgRate >= 50 ? 'rgba(255, 107, 157, 0.4)' : 'rgba(199, 125, 255, 0.4)',
          boxShadow:
            avgRate >= 50
              ? '0 0 40px rgba(255, 107, 157, 0.15), inset 0 0 30px rgba(255, 107, 157, 0.05)'
              : '0 0 40px rgba(199, 125, 255, 0.15), inset 0 0 30px rgba(199, 125, 255, 0.05)',
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{
            background: `linear-gradient(90deg, #39ff14, #c77dff, #ff6b9d)`,
          }}
        />
        <div className="absolute top-4 right-4 w-20 h-20 opacity-10 pointer-events-none">
          <BookmarkPlus className="w-full h-full text-vhs-purple" />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <MessageSquareQuote
            className="w-6 h-6"
            style={{ color: avgRate >= 50 ? '#ff6b9d' : '#c77dff' }}
          />
          <h3 className="font-pixel text-lg text-white">馆长留言</h3>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-vhs-gray/40 border border-vhs-gray/50">
            <span className="w-2 h-2 rounded-full bg-vhs-green animate-pulse" />
            <span className="font-terminal text-xs text-gray-400">实时生成</span>
          </div>
        </div>

        <blockquote className="mb-8 p-5 rounded-xl border-l-4 bg-vhs-black/40"
          style={{
            borderColor: avgRate >= 50 ? '#ff6b9d' : '#c77dff',
          }}
        >
          <p className="font-terminal text-base md:text-lg text-gray-200 leading-relaxed italic">
            "{curatorQuote}"
          </p>
          <footer className="mt-4 flex items-center gap-2">
            <span className="font-pixel text-xs" style={{ color: avgRate >= 50 ? '#ff6b9d' : '#c77dff' }}>
              — 错位博物馆·老馆长
            </span>
            <span className="font-terminal text-xs text-gray-500">
              {selectedYear}.{String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}
            </span>
          </footer>
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mostMovie && (
            <div
              className="p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              style={{
                borderColor: `${mostMovie.posterColor}50`,
                backgroundColor: `${mostMovie.posterColor}08`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5" style={{ color: '#ff6b9d' }} />
                <span className="font-pixel text-sm text-vhs-pink">最错位奖</span>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${mostMovie.posterColor}30, transparent)`,
                    border: `1px solid ${mostMovie.posterColor}40`,
                  }}
                >
                  {mostMovie.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-pixel text-sm text-white truncate group-hover:text-vhs-pink transition-colors">
                    《{mostMovie.title}》
                  </h4>
                  <p className="font-terminal text-xs text-gray-400 mt-1">
                    {mostMovie.错位Director || '神秘导演'} × {mostMovie.director}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="font-pixel text-2xl"
                    style={{ color: '#ff6b9d' }}
                  >
                    {mostRate}%
                  </div>
                  <div className="font-terminal text-xs text-gray-500">错乱指数</div>
                </div>
              </div>
            </div>
          )}

          {leastMovie && (
            <div
              className="p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              style={{
                borderColor: `${leastMovie.posterColor}50`,
                backgroundColor: `${leastMovie.posterColor}08`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5" style={{ color: '#39ff14' }} />
                <span className="font-pixel text-sm text-vhs-green">最克制奖</span>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${leastMovie.posterColor}30, transparent)`,
                    border: `1px solid ${leastMovie.posterColor}40`,
                  }}
                >
                  {leastMovie.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-pixel text-sm text-white truncate group-hover:text-vhs-green transition-colors">
                    《{leastMovie.title}》
                  </h4>
                  <p className="font-terminal text-xs text-gray-400 mt-1">
                    {leastMovie.错位Director || '神秘导演'} × {leastMovie.director}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="font-pixel text-2xl"
                    style={{ color: '#39ff14' }}
                  >
                    {leastRate}%
                  </div>
                  <div className="font-terminal text-xs text-gray-500">克制指数</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
