import { useEffect, useState } from 'react';
import { useFilterStore, minYear, maxYear } from '@/store/useFilterStore';

interface TimeTravelTransitionProps {
  type: 'film-roll' | 'flash-frame';
  onComplete?: () => void;
  targetYear?: number;
}

export default function TimeTravelTransition({ type, onComplete, targetYear }: TimeTravelTransitionProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const [displayYear, setDisplayYear] = useState(targetYear || minYear);
  const [filmFrames, setFilmFrames] = useState<number[]>([]);
  const { setSelectedYear } = useFilterStore();

  useEffect(() => {
    const frames = [];
    for (let i = 0; i < 8; i++) {
      frames.push(Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear);
    }
    setFilmFrames(frames);
  }, [targetYear]);

  useEffect(() => {
    setIsActive(true);
    setPhase('enter');

    const enterTimer = setTimeout(() => {
      setPhase('hold');
    }, type === 'film-roll' ? 500 : 80);

    const holdTimer = setTimeout(() => {
      if (targetYear) {
        setSelectedYear(targetYear);
        setDisplayYear(targetYear);
      }
      setPhase('exit');
    }, type === 'film-roll' ? 1500 : 350);

    const exitTimer = setTimeout(() => {
      setIsActive(false);
      onComplete?.();
    }, type === 'film-roll' ? 2200 : 550);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [type, targetYear, setSelectedYear, onComplete]);

  useEffect(() => {
    if (type === 'film-roll' && phase === 'enter') {
      let frame = 0;
      const totalFrames = 12;
      const interval = 120;

      const filmInterval = setInterval(() => {
        const newFrames = [];
        for (let i = 0; i < 8; i++) {
          newFrames.push(Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear);
        }
        setFilmFrames(newFrames);
        setDisplayYear(newFrames[3] || minYear);
        frame++;
        if (frame >= totalFrames) {
          clearInterval(filmInterval);
          if (targetYear) {
            setDisplayYear(targetYear);
          }
        }
      }, interval);

      return () => clearInterval(filmInterval);
    }
  }, [type, phase, targetYear]);

  useEffect(() => {
    if (type === 'flash-frame' && phase === 'enter') {
      let current = minYear;
      const frames = 24;
      const interval = 20;
      let frame = 0;

      const flashInterval = setInterval(() => {
        current = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
        setDisplayYear(current);
        frame++;
        if (frame >= frames) {
          clearInterval(flashInterval);
          if (targetYear) {
            setDisplayYear(targetYear);
          }
        }
      }, interval);

      return () => clearInterval(flashInterval);
    }
  }, [type, phase, targetYear]);

  if (!isActive) return null;

  const opacityClass = phase === 'enter' 
    ? 'opacity-0' 
    : phase === 'hold' 
      ? 'opacity-100' 
      : 'opacity-0';

  const scaleClass = phase === 'enter'
    ? 'scale-110'
    : phase === 'hold'
      ? 'scale-100'
      : 'scale-95';

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {type === 'film-roll' && (
        <div className={`absolute inset-0 transition-all duration-500 ${opacityClass} ${scaleClass}`}>
          <div className="absolute inset-0 bg-vhs-black" />
          
          <div className="absolute inset-0 vhs-static-noise" />
          
          <div className="absolute left-0 right-0 top-0 h-10 bg-vhs-dark flex items-center justify-around film-perforation-top overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={`top-${i}`} className="w-2.5 h-3.5 bg-vhs-black rounded-sm flex-shrink-0" />
            ))}
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-10 bg-vhs-dark flex items-center justify-around film-perforation-bottom overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={`bot-${i}`} className="w-2.5 h-3.5 bg-vhs-black rounded-sm flex-shrink-0" />
            ))}
          </div>
          
          <div className="absolute left-0 right-0 top-10 bottom-10 overflow-hidden">
            <div className="film-vertical-scroll">
              {filmFrames.map((year, index) => (
                <div
                  key={`frame-${index}`}
                  className="film-frame-item absolute left-1/2 -translate-x-1/2 w-48 h-32 md:w-64 md:h-40 border-2 border-vhs-gray/60 rounded bg-vhs-dark/50 flex items-center justify-center"
                  style={{
                    top: `${index * 180 - 100}px`,
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="font-pixel text-2xl md:text-4xl" style={{ color: '#39ff14', opacity: 0.7 }}>
                    {year}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10">
              <div className="font-pixel text-7xl md:text-9xl mb-6 vhs-text-glitch brain-travel-pulse px-8 py-4" style={{ color: '#39ff14' }}>
                {displayYear}
              </div>
              <div className="font-pixel text-base md:text-xl text-vhs-purple tracking-widest mb-4">
                脑内穿越
              </div>
              <div className="font-pixel text-xs md:text-sm text-vhs-pink/80 tracking-widest">
                BRAIN TIME TRAVEL
              </div>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-vhs-green rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-vhs-purple rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-vhs-pink rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-2 h-2 bg-vhs-blue rounded-full animate-pulse" style={{ animationDelay: '0.45s' }} />
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-vhs-green/80 to-transparent -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 bg-vhs-green/10" />
          
          <div className="absolute inset-0 film-scanline" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-vhs-black/60 via-transparent to-vhs-black/60" />
        </div>
      )}

      {type === 'flash-frame' && (
        <div className={`absolute inset-0 transition-all duration-75 ${opacityClass}`}>
          <div className="absolute inset-0 bg-white flash-flicker" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div 
                className="font-pixel text-8xl md:text-9xl flash-year"
                style={{ 
                  color: '#0a0a0a',
                  textShadow: '0 0 30px rgba(0,0,0,0.3)'
                }}
              >
                {displayYear}
              </div>
              <div className="font-pixel text-sm md:text-lg text-vhs-dark/80 mt-4 tracking-widest">
                ⚡ 随机穿越 ⚡
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
