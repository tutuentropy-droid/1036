import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Sparkles, Gamepad2 } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const fullText = '90年代电影错位博物馆';
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowSubtitle(true), 500);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vhs-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-vhs-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vhs-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Film className="w-8 h-8 text-vhs-green animate-pulse" />
          <span className="font-pixel text-xs text-vhs-green tracking-widest">VHS MUSEUM</span>
          <Film className="w-8 h-8 text-vhs-green animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <h1 
          className="font-pixel text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight vhs-glitch"
          data-text={displayText || ' '}
        >
          <span className="neon-text-green">{displayText}</span>
          <span className="animate-blink-caret inline-block w-1 h-10 md:h-14 bg-vhs-green ml-1 align-middle" />
        </h1>

        <div className={`transition-all duration-1000 ${showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="font-terminal text-xl md:text-2xl text-gray-300 mb-4">
            当经典电影遇上错位导演 · 一切都变得不可思议
          </p>
          <div className="flex items-center justify-center gap-2 text-vhs-purple">
            <Sparkles className="w-5 h-5" />
            <span className="font-terminal text-lg">10部神级错位重想象</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className={`mt-10 transition-all duration-1000 delay-300 ${showSubtitle ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => navigate('/script-killer')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-pixel text-lg bg-gradient-to-r from-vhs-pink to-vhs-purple text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
            style={{ boxShadow: '0 0 30px rgba(255, 107, 157, 0.3)' }}
          >
            <Gamepad2 className="w-5 h-5 group-hover:animate-pulse" />
            进入错位剧本杀
            <Gamepad2 className="w-5 h-5 group-hover:animate-pulse" />
          </button>
        </div>

        <div className={`mt-10 transition-all duration-1000 delay-500 ${showSubtitle ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-block px-6 py-3 border-2 border-vhs-green/50 rounded-lg">
            <span className="font-terminal text-vhs-green text-lg">
              ▼ 向下滚动探索 ▼
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-vhs-black to-transparent" />
    </section>
  );
}
