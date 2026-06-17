import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startAmbientSound = () => {
    if (audioContextRef.current) return;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.04;
    gainNodeRef.current = gainNode;

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 60;
    oscillatorRef.current = oscillator;

    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfo.start();

    const oscillator2 = audioContext.createOscillator();
    oscillator2.type = 'triangle';
    oscillator2.frequency.value = 82.5;
    const gain2 = audioContext.createGain();
    gain2.gain.value = 0.02;

    const lfo2 = audioContext.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.3;
    const lfoGain2 = audioContext.createGain();
    lfoGain2.gain.value = 8;
    lfo2.connect(lfoGain2);
    lfoGain2.connect(oscillator2.frequency);
    lfo2.start();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    oscillator2.connect(gain2);
    gain2.connect(audioContext.destination);
    oscillator2.start();

    oscillatorRef.current = oscillator;

    setIsPlaying(true);
  };

  const stopAmbientSound = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      oscillatorRef.current = null;
      gainNodeRef.current = null;
      setIsPlaying(false);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleMusic}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`fixed top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
          isPlaying
            ? 'bg-vhs-green/20 border-vhs-green text-vhs-green neon-border-green'
            : 'bg-vhs-dark/80 border-vhs-gray/50 text-gray-400 hover:border-vhs-green/50 hover:text-vhs-green'
        }`}
        title={isPlaying ? '关闭背景音乐' : '开启背景音乐'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      {showTooltip && (
        <div className="fixed top-20 right-4 z-50 bg-vhs-dark/90 border border-vhs-gray/50 rounded-lg px-4 py-2 font-terminal text-sm text-gray-300 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-vhs-purple" />
          <span>{isPlaying ? '音乐已开启' : '点击开启音乐'}</span>
        </div>
        {isPlaying && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1 h-3 bg-vhs-green rounded-full animate-pulse" />
            <div className="w-1 h-4 bg-vhs-purple rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-2 bg-vhs-pink rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-5 bg-vhs-green rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
        )}
      </div>
      )}
    </div>
  );
}
