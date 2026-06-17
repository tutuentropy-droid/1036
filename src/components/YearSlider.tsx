import { useCallback, useEffect, useRef } from 'react';
import { Calendar, Gauge, MapPin, Globe2, Home, Shuffle, Zap } from 'lucide-react';
import { useFilterStore, minYear, maxYear, type RegionFilter } from '@/store/useFilterStore';
import { cn } from '@/lib/utils';

interface YearSliderProps {
  onYearTravel?: (year: number, type: 'film-roll' | 'flash-frame') => void;
}

export default function YearSlider({ onYearTravel }: YearSliderProps) {
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

  const handleYearClick = useCallback(
    (year: number) => {
      if (year !== selectedYear) {
        if (onYearTravel) {
          onYearTravel(year, 'film-roll');
        } else {
          setSelectedYear(year);
          triggerRewind();
        }
      }
    },
    [selectedYear, setSelectedYear, triggerRewind, onYearTravel]
  );

  const handleRandomTravel = useCallback(() => {
    const randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    if (onYearTravel) {
      onYearTravel(randomYear, 'flash-frame');
    } else {
      setSelectedYear(randomYear);
      triggerRewind();
    }
  }, [setSelectedYear, triggerRewind, onYearTravel]);

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
    <div className="w-full space-y-4">
      <div className="bg-vhs-dark/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-vhs-gray/50 shadow-2xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-vhs-green" />
            <h3 className="font-pixel text-base text-white">错位年代</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => handleRegionChange(r.value)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-lg font-terminal text-sm transition-all duration-300 border',
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

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-xs text-gray-400">{minYear}</span>
            <div className="flex items-center gap-3">
              <div
                className="font-pixel text-xl md:text-2xl px-3 py-1.5 rounded-xl border-2 animate-pulse-glow"
                style={{
                  color: '#39ff14',
                  borderColor: '#39ff14',
                  boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)',
                }}
              >
                {selectedYear}
              </div>
              <button
                onClick={handleRandomTravel}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-pixel text-xs bg-gradient-to-r from-vhs-pink/20 to-vhs-purple/20 border border-vhs-purple/50 text-vhs-purple hover:border-vhs-pink hover:text-vhs-pink transition-all duration-300 hover:scale-105 active:scale-95"
                title="随机穿越到任意年份"
              >
                <Shuffle className="w-4 h-4 group-hover:animate-spin" style={{ animationDuration: '0.5s' }} />
                <Zap className="w-3 h-3 text-vhs-pink" />
              </button>
            </div>
            <span className="font-pixel text-xs text-gray-400">{maxYear}</span>
          </div>

          <div
            ref={sliderRef}
            className="relative h-3 bg-vhs-gray/60 rounded-full cursor-pointer overflow-hidden border border-vhs-gray/50"
            onMouseDown={handleMouseDown}
          >
            <div
              className="absolute top-0 left-0 h-full transition-all duration-150 rounded-full"
              style={{
                width: `${percent}%`,
                background: `linear-gradient(90deg, #39ff14, #c77dff, #ff6b9d)`,
                boxShadow: '0 0 12px rgba(57, 255, 20, 0.5)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-3 transition-all duration-150"
              style={{
                left: `calc(${percent}% - 12px)`,
                backgroundColor: '#0a0a0a',
                borderColor: '#39ff14',
                borderWidth: '3px',
                boxShadow:
                  '0 0 15px rgba(57, 255, 20, 0.8), inset 0 0 8px rgba(57, 255, 20, 0.3)',
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-vhs-green/30 to-transparent" />
            </div>
            <div className="absolute inset-0 vhs-stripe opacity-40 pointer-events-none" />
          </div>

          <div className="flex justify-between mt-2 px-1">
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map(
              (year) => (
                <button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={cn(
                    'font-terminal text-xs transition-all duration-200 h-3',
                    selectedYear === year
                      ? 'text-vhs-green font-bold scale-125'
                      : 'text-gray-500 hover:text-gray-300 hover:scale-110'
                  )}
                >
                  {year}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="bg-vhs-dark/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-vhs-gray/50 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5" style={{ color: getRateColor(rate) }} />
          <h3 className="font-pixel text-base text-white">错位率</h3>
          <span className="font-terminal text-xs text-gray-500 ml-auto">
            匹配: {filteredCount} 部
          </span>
        </div>

        <div className="relative">
          <div className="relative h-8 bg-vhs-gray/40 rounded-xl overflow-hidden border border-vhs-gray/60">
            <div
              className="h-full transition-all duration-500 ease-out rounded-xl"
              style={{
                width: `${rate}%`,
                background: `linear-gradient(90deg, ${getRateColor(0)}, ${getRateColor(
                  50
                )}, ${getRateColor(100)})`,
                boxShadow: `0 0 15px ${getRateColor(rate)}60`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-pixel text-lg md:text-xl relative z-10 mix-blend-difference"
                style={{ color: '#ffffff' }}
              >
                {rate}%
              </span>
            </div>
            <div className="absolute inset-0 vhs-stripe opacity-30 pointer-events-none" />
          </div>

          <div className="flex justify-between mt-3 px-1">
            <div className="text-center">
              <div
                className="font-terminal text-lg font-bold mb-0.5"
                style={{ color: '#39ff14' }}
              >
                0%
              </div>
              <div className="font-terminal text-xs text-gray-500">原味</div>
            </div>
            <div className="text-center">
              <div
                className="font-terminal text-lg font-bold mb-0.5"
                style={{ color: '#c77dff' }}
              >
                50%
              </div>
              <div className="font-terminal text-xs text-gray-500">错位</div>
            </div>
            <div className="text-center">
              <div
                className="font-terminal text-lg font-bold mb-0.5"
                style={{ color: '#ff6b9d' }}
              >
                100%
              </div>
              <div className="font-terminal text-xs text-gray-500">错乱</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
