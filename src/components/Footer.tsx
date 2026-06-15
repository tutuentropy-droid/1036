import { Film, Heart, Github, Coffee } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t border-vhs-gray/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-vhs-green animate-pulse" />
            <span className="font-pixel text-sm text-vhs-green">
              VHS MUSEUM '90s
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-400 font-terminal">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-vhs-pink fill-vhs-pink animate-pulse" />
            <span>for movie lovers</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-vhs-green transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-vhs-yellow transition-colors"
              aria-label="Buy me a coffee"
            >
              <Coffee className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-vhs-gray/20 text-center">
          <p className="font-terminal text-sm text-gray-500">
            © 2024 90年代电影错位博物馆 · 所有电影版权归原公司所有
          </p>
          <p className="font-terminal text-xs text-gray-600 mt-2">
            本网站纯属娱乐恶搞 · 致敬所有伟大的电影人和90年代
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-vhs-gray/30 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-vhs-green animate-pulse" />
            <span className="font-terminal text-xs text-gray-400">
              SIGNAL: STABLE · VHS TAPE: PLAYING
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
