import { useEffect, useState, useRef } from 'react';
import { useFilterStore, minYear, maxYear } from '@/store/useFilterStore';

interface TimeTravelTransitionProps {
  type: 'film-roll' | 'flash-frame';
  onComplete?: () => void;
  targetYear?: number;
}

const FILM_ROLL_TIMING = {
  enter: 800,
  hold: 3200,
  exit: 1400,
  total: 5400,
};

const FLASH_FRAME_TIMING = {
  enter: 400,
  hold: 2200,
  exit: 800,
  total: 3400,
};

export default function TimeTravelTransition({ type, onComplete, targetYear }: TimeTravelTransitionProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const [displayYear, setDisplayYear] = useState(targetYear || minYear);
  const [filmFrames, setFilmFrames] = useState<number[]>([]);
  const [flashCount, setFlashCount] = useState(0);
  const { setSelectedYear } = useFilterStore();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    const frames = [];
    for (let i = 0; i < 12; i++) {
      frames.push(Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear);
    }
    setFilmFrames(frames);
  }, [targetYear]);

  useEffect(() => {
    const timing = type === 'film-roll' ? FILM_ROLL_TIMING : FLASH_FRAME_TIMING;

    const t1 = setTimeout(() => {
      setPhase('hold');
    }, timing.enter);

    const t2 = setTimeout(() => {
      if (targetYear) {
        setSelectedYear(targetYear);
        setDisplayYear(targetYear);
      }
      setPhase('exit');
    }, timing.enter + timing.hold);

    const t3 = setTimeout(() => {
      onComplete?.();
    }, timing.total);

    timersRef.current = [t1, t2, t3];

    return () => {
      timersRef.current.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
    };
  }, [type, targetYear, setSelectedYear, onComplete]);

  useEffect(() => {
    if (type === 'film-roll' && phase === 'enter') {
      let frame = 0;
      const totalFrames = 20;
      const interval = 200;

      const filmInterval = setInterval(() => {
        const newFrames = [];
        for (let i = 0; i < 12; i++) {
          newFrames.push(Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear);
        }
        setFilmFrames(newFrames);
        setDisplayYear(newFrames[5] || minYear);
        frame++;
        if (frame >= totalFrames) {
          clearInterval(filmInterval);
          if (targetYear) {
            setDisplayYear(targetYear);
          }
        }
      }, interval);

      intervalsRef.current.push(filmInterval);

      return () => clearInterval(filmInterval);
    }
  }, [type, phase, targetYear]);

  useEffect(() => {
    if (type === 'flash-frame' && phase === 'enter') {
      let frame = 0;
      const totalFrames = 40;
      const interval = 45;

      const flashInterval = setInterval(() => {
        const randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
        setDisplayYear(randomYear);
        setFlashCount(frame);
        frame++;
        if (frame >= totalFrames) {
          clearInterval(flashInterval);
          if (targetYear) {
            setDisplayYear(targetYear);
          }
        }
      }, interval);

      intervalsRef.current.push(flashInterval);

      return () => clearInterval(flashInterval);
    }
  }, [type, phase, targetYear]);

  const opacityStyle = phase === 'enter'
    ? { opacity: 0 }
    : phase === 'hold'
      ? { opacity: 1 }
      : { opacity: 0 };

  const scaleStyle = phase === 'enter'
    ? { transform: 'scale(1.05)' }
    : phase === 'hold'
      ? { transform: 'scale(1)' }
      : { transform: 'scale(0.97)' };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" style={{ pointerEvents: phase === 'hold' ? 'auto' : 'none' }}>
      {type === 'film-roll' && (
        <div
          className="absolute inset-0"
          style={{
            ...opacityStyle,
            ...scaleStyle,
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="absolute inset-0 bg-vhs-black" />

          <div className="absolute inset-0 vhs-static-noise" />

          <div className="absolute left-0 right-0 top-0 h-12 bg-vhs-dark/90 flex items-center film-perforation-top overflow-hidden border-b border-vhs-gray/30">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={`top-${i}`} className="w-3 h-5 bg-vhs-black/80 rounded-sm flex-shrink-0 mx-1.5" />
            ))}
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-12 bg-vhs-dark/90 flex items-center film-perforation-bottom overflow-hidden border-t border-vhs-gray/30">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={`bot-${i}`} className="w-3 h-5 bg-vhs-black/80 rounded-sm flex-shrink-0 mx-1.5" />
            ))}
          </div>

          <div className="absolute left-0 right-0 top-12 bottom-12 overflow-hidden">
            <div className="film-vertical-scroll">
              {filmFrames.map((year, index) => (
                <div
                  key={`frame-${index}`}
                  className="film-frame-item absolute left-1/2 -translate-x-1/2 w-44 h-28 md:w-60 md:h-36 border-2 border-vhs-gray/40 rounded bg-vhs-dark/60 flex items-center justify-center"
                  style={{
                    top: `${index * 150 - 80}px`,
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <div className="font-pixel text-xl md:text-3xl" style={{ color: '#39ff14', opacity: 0.5 }}>
                    {year}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10">
              <div
                className="font-pixel text-7xl md:text-9xl mb-4 vhs-text-glitch px-8 py-4 inline-block"
                style={{
                  color: '#39ff14',
                  textShadow: '0 0 20px #39ff14, 0 0 40px #39ff14, 0 0 80px rgba(57,255,20,0.5)',
                }}
              >
                {displayYear}
              </div>
              <div
                className="font-pixel text-xl md:text-2xl tracking-[0.3em] mb-3"
                style={{ color: '#c77dff', textShadow: '0 0 10px #c77dff, 0 0 20px #c77dff' }}
              >
                脑内穿越
              </div>
              <div
                className="font-pixel text-xs md:text-sm tracking-[0.2em]"
                style={{ color: '#ff6b9d', textShadow: '0 0 8px #ff6b9d' }}
              >
                BRAIN TIME TRAVEL
              </div>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-2.5 h-2.5 bg-vhs-green rounded-full animate-pulse" style={{ boxShadow: '0 0 8px #39ff14' }} />
                <div className="w-2.5 h-2.5 bg-vhs-purple rounded-full animate-pulse" style={{ animationDelay: '0.2s', boxShadow: '0 0 8px #c77dff' }} />
                <div className="w-2.5 h-2.5 bg-vhs-pink rounded-full animate-pulse" style={{ animationDelay: '0.4s', boxShadow: '0 0 8px #ff6b9d' }} />
                <div className="w-2.5 h-2.5 bg-vhs-blue rounded-full animate-pulse" style={{ animationDelay: '0.6s', boxShadow: '0 0 8px #00d4ff' }} />
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-vhs-green/80 to-transparent -translate-y-1/2" style={{ boxShadow: '0 0 12px rgba(57,255,20,0.6)' }} />
          <div className="absolute top-1/2 left-0 right-0 h-6 -translate-y-1/2 bg-vhs-green/5" />

          <div className="absolute inset-0 film-scanline" />

          <div className="absolute inset-0 bg-gradient-to-b from-vhs-black/70 via-transparent to-vhs-black/70" />
        </div>
      )}

      {type === 'flash-frame' && (
        <div
          className="absolute inset-0"
          style={{
            ...opacityStyle,
            transition: 'opacity 0.4s ease',
          }}
        >
          <div className="absolute inset-0 flash-flicker" style={{ backgroundColor: flashCount % 2 === 0 ? '#ffffff' : '#f0f0f0' }} />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="font-pixel text-8xl md:text-[12rem] leading-none"
                style={{
                  color: '#0a0a0a',
                  textShadow: '2px 2px 0 rgba(199,125,255,0.3), -2px -2px 0 rgba(57,255,20,0.3)',
                  animation: 'flashYearScale 0.15s ease-out',
                }}
              >
                {displayYear}
              </div>
              <div
                className="font-pixel text-base md:text-2xl mt-6 tracking-[0.25em]"
                style={{ color: 'rgba(10,10,10,0.7)' }}
              >
                ⚡ 随机穿越 ⚡
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-vhs-dark/40 rounded-full"
                    style={{
                      height: `${12 + Math.random() * 24}px`,
                      animation: `audioBar 0.3s ease-in-out ${i * 0.05}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {phase === 'hold' && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`scanline-${i}`}
                  className="absolute left-0 right-0 h-[1px] bg-vhs-dark/20"
                  style={{
                    top: `${15 + i * 14}%`,
                    animation: `scanlineDrift ${1.5 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
