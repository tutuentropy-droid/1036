import { create } from 'zustand';
import { movies } from '@/data/movies';
import type { Movie } from '@/types';

export type RegionFilter = 'all' | 'domestic' | 'foreign';

interface FilterState {
  yearRange: [number, number];
  selectedYear: number;
  regionFilter: RegionFilter;
  isRewinding: boolean;
  rewindKey: number;
  
  setYearRange: (range: [number, number]) => void;
  setSelectedYear: (year: number) => void;
  setRegionFilter: (filter: RegionFilter) => void;
  triggerRewind: () => void;
  finishRewind: () => void;
  
  getFilteredMovies: () => Movie[];
  getMisalignmentRate: () => number;
  getMostMisalignedMovie: () => Movie | null;
  getLeastMisalignedMovie: () => Movie | null;
  computeMovieMisalignment: (movie: Movie) => number;
}

const allYears = movies.map((m) => m.year);
const minYear = Math.min(...allYears);
const maxYear = Math.max(...allYears);

const directorStyles: Record<string, string[]> = {
  '王家卫': ['独白美学', '慢镜头', '都市孤独'],
  '张艺谋': ['色彩浓烈', '宏大叙事', '乡土情怀'],
  '陈凯歌': ['诗意象征', '史诗格局', '京剧元素'],
  '昆汀·塔伦蒂诺': ['非线性叙事', '暴力美学', '话痨对白'],
  '吕克·贝松': ['法式浪漫', '动作节奏', '孤胆英雄'],
  '罗伯特·泽米吉斯': ['励志温情', '奇幻设定', '时空穿越'],
  '詹姆斯·卡梅隆': ['技术狂人', '灾难场面', '浪漫史诗'],
  '大卫·芬奇': ['黑暗悬疑', '心理惊悚', '对称构图'],
  '刘镇伟': ['无厘头喜剧', '时空穿越', '爱情悲剧'],
  '沃卓斯基姐妹': ['哲学思辨', '视觉革命', '赛博朋克'],
  '周星驰': ['无厘头搞笑', '小人物逆袭', '悲喜剧'],
  '成龙': ['动作喜剧', '特技实拍', '功夫冒险'],
  '北野武': ['暴力静默', '日式冷幽默', '武士道'],
  '蒂姆·波顿': ['哥特奇幻', '暗黑童话', '怪诞美学'],
  '盖·里奇': ['多线叙事', '英式黑帮', '快速剪辑'],
  '韦斯·安德森': ['对称构图', '复古美学', '色彩强迫症'],
  '黑泽明': ['武士道精神', '人性探讨', '恢弘场面'],
  '宫崎骏': ['奇幻世界', '自然主义', '人文关怀'],
};

const getStyleTags = (director: string): string[] => {
  return directorStyles[director] || ['独特风格'];
};

export const useFilterStore = create<FilterState>((set, get) => ({
  yearRange: [minYear, maxYear],
  selectedYear: Math.floor((minYear + maxYear) / 2),
  regionFilter: 'all',
  isRewinding: false,
  rewindKey: 0,

  setYearRange: (range) => set({ yearRange: range }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setRegionFilter: (filter) => set({ regionFilter: filter }),
  triggerRewind: () => {
    set((state) => ({ isRewinding: true, rewindKey: state.rewindKey + 1 }));
    setTimeout(() => {
      set({ isRewinding: false });
    }, 1200);
  },
  finishRewind: () => set({ isRewinding: false }),

  computeMovieMisalignment: (movie: Movie): number => {
    let score = 0;
    
    const originalTags = getStyleTags(movie.director);
    const alternativeTags = getStyleTags(movie.错位Director || '');
    
    const commonTags = originalTags.filter((t) => alternativeTags.includes(t));
    const tagDifference =
      (originalTags.length + alternativeTags.length - 2 * commonTags.length) /
      (originalTags.length + alternativeTags.length);
    score += tagDifference * 40;

    const yearDiff = Math.abs(movie.year - get().selectedYear);
    const maxPossibleDiff = maxYear - minYear || 1;
    score += (yearDiff / maxPossibleDiff) * 30;

    const genres = movie.genre.length;
    score += Math.min(genres * 5, 15);

    const factLength = movie.错位Fact.length;
    score += Math.min(factLength / 10, 15);

    return Math.min(Math.max(Math.round(score), 0), 100);
  },

  getFilteredMovies: (): Movie[] => {
    const { selectedYear, regionFilter } = get();
    return movies.filter((movie) => {
      const yearMatch = movie.year === selectedYear;
      let regionMatch = true;
      if (regionFilter === 'domestic') {
        regionMatch = movie.country.includes('中国');
      } else if (regionFilter === 'foreign') {
        regionMatch = !movie.country.includes('中国');
      }
      return yearMatch && regionMatch;
    });
  },

  getMisalignmentRate: (): number => {
    const filtered = get().getFilteredMovies();
    if (filtered.length === 0) return 0;
    const rates = filtered.map((m) => get().computeMovieMisalignment(m));
    return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
  },

  getMostMisalignedMovie: (): Movie | null => {
    const filtered = get().getFilteredMovies();
    if (filtered.length === 0) return null;
    return filtered.reduce((max, movie) => {
      const rate = get().computeMovieMisalignment(movie);
      const maxRate = get().computeMovieMisalignment(max);
      return rate > maxRate ? movie : max;
    }, filtered[0]);
  },

  getLeastMisalignedMovie: (): Movie | null => {
    const filtered = get().getFilteredMovies();
    if (filtered.length === 0) return null;
    return filtered.reduce((min, movie) => {
      const rate = get().computeMovieMisalignment(movie);
      const minRate = get().computeMovieMisalignment(min);
      return rate < minRate ? movie : min;
    }, filtered[0]);
  },
}));

export { minYear, maxYear };
