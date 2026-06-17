import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Sparkles, Download, RefreshCw } from 'lucide-react';
import type { Movie, Script } from '@/types';
import { movies } from '@/data/movies';
import { generateScript, getRandomPartnerMovie, exportScriptToText } from '@/lib/scriptGenerator';
import { useScriptStore } from '@/store/useScriptStore';
import MovieSelector from '@/components/MovieSelector';
import ScriptPlayer from '@/components/ScriptPlayer';
import ScriptHistory from '@/components/ScriptHistory';
import StarRating from '@/components/StarRating';
import ScanlineOverlay from '@/components/ScanlineOverlay';

export default function ScriptKiller() {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { saveScript, rateScript, getScriptRating } = useScriptStore();

  const handleGenerate = async () => {
    if (!selectedMovie) return;
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

    const partner = getRandomPartnerMovie(selectedMovie.id, movies);
    const script = generateScript(selectedMovie, partner);
    saveScript(script);
    setCurrentScript(script);
    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    setCurrentScript(null);
    setSelectedMovie(null);
  };

  const handleSelectFromHistory = (script: Script) => {
    setCurrentScript(script);
  };

  const handleExport = () => {
    if (!currentScript) return;
    const text = exportScriptToText(currentScript);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = currentScript.title.replace(/[《》]/g, '').replace(/\s+/g, '_');
    link.download = `${safeTitle}_${currentScript.createdAt}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-vhs-black relative overflow-hidden">
      <ScanlineOverlay />

      <div className="relative z-10">
        <header className="sticky top-0 z-20 backdrop-blur-md bg-vhs-black/70 border-b border-vhs-gray/30">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-vhs-gray/40 text-gray-400 hover:text-white hover:border-vhs-gray/60 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-pixel text-xs">返回首页</span>
              </button>

              <div className="flex items-center gap-3">
                <Gamepad2 className="w-6 h-6 text-vhs-pink animate-pulse" />
                <h1 className="font-pixel text-xl md:text-2xl neon-text-pink">
                  错位剧本杀
                </h1>
                <Gamepad2 className="w-6 h-6 text-vhs-pink animate-pulse" />
              </div>

              <div className="w-24" />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-10">
          {!currentScript ? (
            <div className="space-y-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-vhs-green" />
                  <h2 className="font-pixel text-2xl md:text-3xl neon-text-green">
                    开始一场错位对话
                  </h2>
                  <Sparkles className="w-8 h-8 text-vhs-green" />
                </div>
                <p className="font-terminal text-lg text-gray-400 max-w-xl mx-auto">
                  选择一部你喜欢的电影作为主角，
                  系统将随机匹配另一部经典，
                  生成一场穿越时空的错位对话。
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-vhs-pink to-transparent mx-auto mt-6" />
              </div>

              <MovieSelector
                selectedMovie={selectedMovie}
                onSelect={setSelectedMovie}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />

              <div className="pt-8 border-t border-vhs-gray/30">
                <ScriptHistory onSelectScript={handleSelectFromHistory} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vhs-pink/10 border border-vhs-pink/30 mb-6">
                  <Sparkles className="w-4 h-4 text-vhs-pink" />
                  <span className="font-pixel text-xs text-vhs-pink">
                    剧本生成成功
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-vhs-gray/40 bg-vhs-dark/40">
                <ScriptPlayer script={currentScript} key={currentScript.id} />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 p-6 rounded-2xl border border-vhs-gray/40 bg-vhs-dark/40">
                <div className="flex items-center gap-3">
                  <span className="font-terminal text-gray-400">为这个组合打分：</span>
                  <StarRating
                    rating={getScriptRating(currentScript.id)}
                    onRate={(r) => rateScript(currentScript.id, r)}
                    size="lg"
                  />
                </div>

                <div className="w-px h-8 bg-vhs-gray/40 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-vhs-purple/40 bg-vhs-purple/10 text-vhs-purple hover:bg-vhs-purple/20 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-pixel text-xs">导出剧本</span>
                  </button>

                  <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-vhs-green/40 bg-vhs-green/10 text-vhs-green hover:bg-vhs-green/20 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-pixel text-xs">再来一次</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <ScriptHistory onSelectScript={handleSelectFromHistory} />
              </div>
            </div>
          )}
        </main>

        <footer className="mt-20 py-8 border-t border-vhs-gray/30">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="font-terminal text-sm text-gray-600">
              错位剧本杀 · VHS MUSEUM · 每一次对话都是独一无二的穿越
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
