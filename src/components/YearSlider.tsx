import { useCallback, useEffect, useRef } from 'react';
import { Calendar, Gauge, MapPin, Globe2, Home } from 'lucide-react';
import { useFilterStore, minYear, maxYear, type RegionFilter } from '@/store/useFilterStore';
import { cn } from '@/lib/utils';

export default function YearSlider() {
  const {
    selectedYear,
    setSelectedYear,
    regionFilter,
    setRegionFilter,
    getMisalignmentRate,
    triggerRewind,
    getFilteredMovies,
  } = useFilterStore();

  const rate = getMisalignmentRate();
  const filteredCount = getFilteredMovies().length;
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleYearChange = useCallback(
    (year: number) => {
      const clampedYear = Math.max(minYear, Math.min(maxYear, year));
      if (clampedYear !== selectedYear) {
        setSelectedYear(clampedYear);
        triggerRewind();
      }
    },
    [selectedYear, setSelectedYear, triggerRewind]
  );

  const getYearFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return selectedYear;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(minYear + percent * (maxYear - minYear));
  }, [selectedYear]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleYearChange(getYearFromPosition(e.clientX));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleYearChange(getYearFromPosition(e.clientX));
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleYearChange, getYearFromPosition]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleYearChange(getYearFromPosition(e.touches[0].clientX));
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging.current = true;
        handleYearChange(getYearFromPosition(e.touches[0].clientX));
      }
    };
    const handleTouchEnd = () => {
      isDragging.current = false;
    };
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleYearChange, getYearFromPosition]);

  const percent = ((selectedYear - minYear) / (maxYear - minYear)) * 100;

  const getRateColor = (r: number) => {
    if (r >= 70) return '#ff6b9d';
    if (r >= 40) return '#c77dff';
    return '#39ff14';
  };

  const regions: { value: RegionFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: '全部', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'domestic', label: '国内', icon: <Home className="w-4 h-4" /> },
    { value: 'foreign', label: '国外', icon: <MapPin className="w-4 h-4" /> },
  ];

  const handleRegionChange = (filter: RegionFilter) => {
    if (filter !== regionFilter) {
      setRegionFilter(filter);
      triggerRewind();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-vhs-dark/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-vhs-gray/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-vhs-green" />
            <h3 className="font-pixel text-lg text-white">错位年代控制</h3>
          </div>
          <div className="flex items-center gap-2">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => handleRegionChange(r.value)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg font-terminal text-sm transition-all duration-300 border',
                  regionFilter === r.value
                    ? 'bg-vhs-green/20 border-vhs-green text-vhs-green neon-border-green'
                    : 'bg-vhs-gray/30 border-vhs-gray/50 text-gray-400 hover:border-vhs-green/50 hover:text-gray-200'
                )}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-sm text-gray-400">{minYear}</span>
            <div
              className="font-pixel text-2xl md:text-3xl px-4 py-2 rounded-xl border-2 animate-pulse-glow"
              style={{
                color: '#39ff14',
                borderColor: '#39ff14',
                boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)',
              }}
            >
              {selectedYear}
            </div>
            <span className="font-pixel text-sm text-gray-400">{maxYear}</span>
          </div>

          <div
            ref={sliderRef}
            className="relative h-4 bg-vhs-gray/60 rounded-full cursor-pointer overflow-hidden border border-vhs-gray/50"
            onMouseDown={handleMouseDown}
          >
            <div
              className="absolute top-0 left-0 h-full transition-all duration-150 rounded-full"
              style={{
                width: `${percent}%`,
                background: `linear-gradient(90deg, #39ff14, #c77dff, #ff6b9d)`,
                boxShadow: '0 0 15px rgba(57, 255, 20, 0.5)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 transition-all duration-150"
              style={{
                left: `calc(${percent}% - 16px)`,
                backgroundColor: '#0a0a0a',
                borderColor: '#39ff14',
                boxShadow:
                  '0 0 20px rgba(57, 255, 20, 0.8), inset 0 0 10px rgba(57, 255, 20, 0.3)',
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-vhs-green/30 to-transparent" />
            </div>
            <div className="absolute inset-0 vhs-stripe opacity-40 pointer-events-none" />
          </div>

          <div className="flex justify-between mt-3 px-2">
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map(
              (year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={cn(
                    'font-terminal text-xs transition-all duration-200 h-4',
                    selectedYear === year
                      ? 'text-vhs-green font-bold scale-125'
                      : 'text-gray-500 hover:text-gray-300'
                  )}
                >
                  {year}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="bg-vhs-dark/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-vhs-gray/50 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Gauge className="w-6 h-6" style={{ color: getRateColor(rate) }} />
          <h3 className="font-pixel text-lg text-white">错位率检测</h3>
          <span className="font-terminal text-sm text-gray-500 ml-auto">
            匹配影片: {filteredCount} 部
          </span>
        </div>

        <div className="relative">
          <div className="relative h-10 bg-vhs-gray/40 rounded-xl overflow-hidden border border-vhs-gray/60">
            <div
              className="h-full transition-all duration-500 ease-out rounded-xl"
              style={{
                width: `${rate}%`,
                background: `linear-gradient(90deg, ${getRateColor(0)}, ${getRateColor(
                  50
                )}, ${getRateColor(100)})`,
                boxShadow: `0 0 20px ${getRateColor(rate)}60`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-pixel text-xl md:text-2xl relative z-10 mix-blend-difference"
                style={{ color: '#ffffff' }}
              >
                {rate}%
              </span>
            </div>
            <div className="absolute inset-0 vhs-stripe opacity-30 pointer-events-none" />
          </div>

          <div className="flex justify-between mt-4 px-1">
            <div className="text-center">
              <div
                className="font-terminal text-2xl font-bold mb-1"
                style={{ color: '#39ff14' }}
              >
                0%
              </div>
              <div className="font-terminal text-xs text-gray-500">原味复刻</div>
            </div>
            <div className="text-center">
              <div
                className="font-terminal text-2xl font-bold mb-1"
                style={{ color: '#c77dff' }}
              >
                50%
              </div>
              <div className="font-terminal text-xs text-gray-500">轻微错位</div>
            </div>
            <div className="text-center">
              <div
                className="font-terminal text-2xl font-bold mb-1"
                style={{ color: '#ff6b9d' }}
              >
                100%
              </div>
              <div className="font-terminal text-xs text-gray-500">精神错乱</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border border-vhs-gray/40 bg-vhs-black/40">
          <p className="font-terminal text-sm text-gray-400 leading-relaxed">
            <span className="text-vhs-green">▶</span> 当前选中年份{' '}
            <span className="text-vhs-green font-bold">{selectedYear}</span> 的错位指数为{' '}
            <span
              className="font-bold"
              style={{ color: getRateColor(rate) }}
            >
              {rate}%
            </span>
            。{rate >= 70
              ? '警告：该年代的电影已经严重错位，小心观看！'
              : rate >= 40
              ? '提示：存在一定程度的时空错位，体验时请注意辨别。'
              : '状态：年代较为稳定，错位处于可控范围内。'}
          </p>
        </div>
      </div>
    </div>
  );
}
