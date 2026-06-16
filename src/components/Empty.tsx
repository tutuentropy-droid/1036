import { SearchX, Sparkles } from 'lucide-react';

export default function Empty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-vhs-gray/30 border-2 border-dashed border-vhs-gray/50 flex items-center justify-center animate-pulse">
          <SearchX className="w-16 h-16 text-vhs-gray" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-vhs-purple/20 border border-vhs-purple/40 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-vhs-purple animate-pulse" />
        </div>
      </div>
      
      <h3 className="font-pixel text-xl text-white mb-4 text-center">
        暂无匹配藏品
      </h3>
      <p className="font-terminal text-lg text-gray-400 mb-2 text-center max-w-md">
        当前筛选条件下没有找到错位电影...
      </p>
      <p className="font-terminal text-sm text-gray-500 text-center max-w-md">
        试试调整年代滑块或切换地区筛选，说不定能发现惊喜哦 ✨
      </p>
      
      <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-vhs-dark/60 border border-vhs-gray/40">
        <span className="w-2 h-2 rounded-full bg-vhs-pink animate-pulse" />
        <span className="font-pixel text-xs text-gray-400">时空搜索中...</span>
        <span className="w-2 h-2 rounded-full bg-vhs-green animate-pulse" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}
