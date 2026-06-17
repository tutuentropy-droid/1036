import { useState } from 'react';
import { useScriptStore } from '@/store/useScriptStore';
import { exportScriptToText } from '@/lib/scriptGenerator';
import StarRating from './StarRating';
import type { Script } from '@/types';
import { History, Download, Eye, Trash2, Trophy } from 'lucide-react';

interface ScriptHistoryProps {
  onSelectScript: (script: Script) => void;
}

export default function ScriptHistory({ onSelectScript }: ScriptHistoryProps) {
  const {
    getHistory,
    getComboRankings,
    rateScript,
    getScriptRating,
    clearHistory,
  } = useScriptStore();

  const [activeTab, setActiveTab] = useState<'history' | 'ranking'>('history');
  const history = getHistory();
  const rankings = getComboRankings();
  const movieMap: Record<string, { emoji: string; title: string }> = {};
  // We'll build this from the history data since movies are in script objects

  const handleExport = (script: Script) => {
    const text = exportScriptToText(script);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = script.title.replace(/[《》]/g, '').replace(/\s+/g, '_');
    link.download = `${safeTitle}_${script.createdAt}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Build movie map from history
  history.forEach((h) => {
    if (!movieMap[h.script.movieA.id]) {
      movieMap[h.script.movieA.id] = {
        emoji: h.script.movieA.emoji,
        title: h.script.movieA.title,
      };
    }
    if (!movieMap[h.script.movieB.id]) {
      movieMap[h.script.movieB.id] = {
        emoji: h.script.movieB.emoji,
        title: h.script.movieB.title,
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-1 p-1 rounded-xl bg-vhs-dark/60 border border-vhs-gray/40 w-fit mx-auto">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2 rounded-lg font-pixel text-xs transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-vhs-green text-vhs-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{
            boxShadow: activeTab === 'history' ? '0 0 15px rgba(57, 255, 20, 0.3)' : 'none',
          }}
        >
          <History className="w-4 h-4" />
          对话历史
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-5 py-2 rounded-lg font-pixel text-xs transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'ranking'
              ? 'bg-vhs-purple text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{
            boxShadow: activeTab === 'ranking' ? '0 0 15px rgba(199, 125, 255, 0.3)' : 'none',
          }}
        >
          <Trophy className="w-4 h-4" />
          组合排名
        </button>
      </div>

      {activeTab === 'history' && (
        <>
          {history.length === 0 ? (
            <div className="text-center py-16">
              <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="font-terminal text-gray-500 text-lg">
                还没有生成过对话剧本
              </p>
              <p className="font-terminal text-gray-600 text-sm mt-1">
                选择一部电影开始你的第一次错位对话吧！
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vhs-pink/30 bg-vhs-pink/10 text-vhs-pink hover:bg-vhs-pink/20 transition-all duration-200 text-xs font-pixel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  清空历史
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {history.map((entry) => {
                  const { script, rating, viewedAt } = entry;
                  return (
                    <div
                      key={script.id}
                      className="p-4 rounded-xl border border-vhs-gray/40 bg-vhs-dark/40 hover:bg-vhs-dark/60 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xl">{script.movieA.emoji}</span>
                            <span className="font-pixel text-sm text-white">
                              {script.movieA.title}
                            </span>
                            <span className="font-pixel text-vhs-pink">×</span>
                            <span className="text-xl">{script.movieB.emoji}</span>
                            <span className="font-pixel text-sm text-white">
                              {script.movieB.title}
                            </span>
                          </div>
                          <p className="font-terminal text-xs text-gray-500">
                            {script.lines.length} 条对话 · {formatDate(viewedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <StarRating
                          rating={getScriptRating(script.id)}
                          onRate={(r) => rateScript(script.id, r)}
                          size="sm"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectScript(script)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vhs-green/30 bg-vhs-green/10 text-vhs-green hover:bg-vhs-green/20 transition-all duration-200 text-xs font-pixel"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            查看
                          </button>
                          <button
                            onClick={() => handleExport(script)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vhs-purple/30 bg-vhs-purple/10 text-vhs-purple hover:bg-vhs-purple/20 transition-all duration-200 text-xs font-pixel"
                          >
                            <Download className="w-3.5 h-3.5" />
                            导出
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'ranking' && (
        <>
          {rankings.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="font-terminal text-gray-500 text-lg">
                还没有评分数据
              </p>
              <p className="font-terminal text-gray-600 text-sm mt-1">
                为你喜欢的对话打分，就能看到组合排名啦！
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {rankings.map((rank, idx) => {
                const movieA = movieMap[rank.movieAId];
                const movieB = movieMap[rank.movieBId];
                const getRankColor = () => {
                  if (idx === 0) return '#ffd700';
                  if (idx === 1) return '#c0c0c0';
                  if (idx === 2) return '#cd7f32';
                  return '#888';
                };
                return (
                  <div
                    key={rank.comboId}
                    className="p-3 rounded-xl border border-vhs-gray/40 bg-vhs-dark/40 flex items-center gap-4"
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-pixel text-sm"
                      style={{
                        color: getRankColor(),
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        border: `1px solid ${getRankColor()}40`,
                        textShadow: idx < 3 ? `0 0 8px ${getRankColor()}80` : 'none',
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {movieA && <span className="text-lg">{movieA.emoji}</span>}
                        <span className="font-pixel text-xs text-white truncate">
                          {movieA?.title || rank.movieAId}
                        </span>
                        <span className="font-pixel text-vhs-pink text-xs">×</span>
                        {movieB && <span className="text-lg">{movieB.emoji}</span>}
                        <span className="font-pixel text-xs text-white truncate">
                          {movieB?.title || rank.movieBId}
                        </span>
                      </div>
                      <p className="font-terminal text-xs text-gray-500 mt-0.5">
                        {rank.ratingCount} 人评分
                      </p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <StarRating rating={Math.round(rank.averageRating)} onRate={() => {}} size="sm" readOnly />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
