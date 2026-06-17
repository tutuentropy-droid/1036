import { useState, useEffect, useRef } from 'react';
import type { Script, DialogLine } from '@/types';
import { Play, Pause, RotateCcw, SkipForward, Film } from 'lucide-react';

interface ScriptPlayerProps {
  script: Script;
}

export default function ScriptPlayer({ script }: ScriptPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleLines: DialogLine[] = script.lines.slice(0, currentIndex + 1);

  useEffect(() => {
    if (isPlaying && currentIndex < script.lines.length - 1) {
      const nextLine = script.lines[currentIndex + 1];
      const prevLine = script.lines[currentIndex];
      const delay = prevLine ? nextLine.timestamp - prevLine.timestamp : 1000;

      timerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, Math.min(delay, 3000));
    } else if (currentIndex >= script.lines.length - 1 && isPlaying) {
      setIsPlaying(false);
      setIsFinished(true);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, script.lines]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentIndex]);

  const handlePlay = () => {
    if (isFinished) {
      setCurrentIndex(0);
      setIsFinished(false);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentIndex(-1);
    setIsFinished(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleSkip = () => {
    setIsPlaying(false);
    setCurrentIndex(script.lines.length - 1);
    setIsFinished(true);
  };

  const getLineStyle = (speaker: 'A' | 'B') => {
    const movie = speaker === 'A' ? script.movieA : script.movieB;
    return {
      borderColor: `${movie.posterColor}40`,
      backgroundColor: `${movie.posterColor}10`,
    };
  };

  const getSpeakerColor = (speaker: 'A' | 'B') => {
    return speaker === 'A' ? script.movieA.posterColor : script.movieB.posterColor;
  };

  const progress = ((currentIndex + 1) / script.lines.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Film className="w-6 h-6 text-vhs-purple" />
          <h3 className="font-pixel text-lg text-white">{script.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${script.movieA.posterColor}15`,
              border: `1px solid ${script.movieA.posterColor}40`,
            }}
          >
            <span className="text-xl">{script.movieA.emoji}</span>
            <span className="font-pixel text-xs" style={{ color: script.movieA.posterColor }}>
              {script.movieA.title}
            </span>
          </div>
          <span className="font-pixel text-vhs-pink text-lg">×</span>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${script.movieB.posterColor}15`,
              border: `1px solid ${script.movieB.posterColor}40`,
            }}
          >
            <span className="text-xl">{script.movieB.emoji}</span>
            <span className="font-pixel text-xs" style={{ color: script.movieB.posterColor }}>
              {script.movieB.title}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-vhs-gray/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-vhs-green via-vhs-purple to-vhs-pink transition-all duration-500"
          style={{ width: `${Math.max(0, progress)}%` }}
        />
      </div>

      <div
        ref={containerRef}
        className="relative h-80 overflow-y-auto rounded-xl border border-vhs-gray/40 bg-vhs-dark/60 p-4 space-y-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#c77dff transparent' }}
      >
        <div className="absolute inset-0 pointer-events-none vhs-stripe opacity-10 rounded-xl" />

        {visibleLines.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="font-terminal text-gray-500 text-lg">
              点击 ▶ 播放按钮，开始错位对话...
            </p>
          </div>
        )}

        {visibleLines.map((line, idx) => (
          <div
            key={line.id}
            className={`relative animate-fade-in-up ${
              idx === visibleLines.length - 1 && isPlaying ? 'scale-[1.02]' : ''
            }`}
            style={{ animationDelay: '0ms' }}
          >
            <div
              className="p-3 rounded-lg border transition-all duration-300"
              style={getLineStyle(line.speaker)}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{line.movieEmoji}</span>
                <span
                  className="font-pixel text-xs"
                  style={{ color: getSpeakerColor(line.speaker) }}
                >
                  {line.movieTitle}
                </span>
                <span className="font-terminal text-xs text-gray-600 ml-auto">
                  {formatTime(line.timestamp)}
                </span>
              </div>
              <p className="font-terminal text-gray-200 text-base leading-relaxed">
                {line.text}
              </p>
            </div>
          </div>
        ))}

        {isPlaying && currentIndex < script.lines.length - 1 && (
          <div className="flex items-center gap-2 pl-3 animate-pulse">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-vhs-green animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-vhs-purple animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-vhs-pink animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {isFinished && (
          <div className="text-center py-4">
            <p className="font-pixel text-vhs-green text-lg">
              — 剧终 —
            </p>
            <p className="font-terminal text-gray-500 text-sm mt-1">
              感谢观看这场错位对话
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleRestart}
          className="p-3 rounded-xl border border-vhs-gray/40 bg-vhs-dark/60 text-gray-400 hover:text-white hover:border-vhs-gray/60 transition-all duration-200 hover:scale-105 active:scale-95"
          title="重新开始"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {isPlaying ? (
          <button
            onClick={handlePause}
            className="p-4 rounded-xl font-pixel text-vhs-black bg-vhs-green hover:bg-vhs-green/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)' }}
            title="暂停"
          >
            <Pause className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="p-4 rounded-xl font-pixel text-vhs-black bg-vhs-green hover:bg-vhs-green/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)' }}
            title={isFinished ? '重新播放' : '播放'}
          >
            <Play className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={handleSkip}
          disabled={isFinished}
          className="p-3 rounded-xl border border-vhs-gray/40 bg-vhs-dark/60 text-gray-400 hover:text-white hover:border-vhs-gray/60 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title="跳到结尾"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center">
        <p className="font-terminal text-xs text-gray-500">
          {currentIndex + 1} / {script.lines.length} 条对话
        </p>
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
