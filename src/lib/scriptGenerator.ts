import type { Movie, DialogLine, Script } from '@/types';

const openingTemplates: Record<string, string[]> = {
  greeting: [
    '等等，你是谁？为什么在我的世界里？',
    '这位朋友，我们是不是在哪部电影里见过？',
    '你好...等等，你的画风好像和我不太一样。',
    '请问...现在是哪一年？导演又是谁？',
  ],
  confused: [
    '我是谁？我在哪？这是哪部戏？',
    '不对啊，我剧本里没有这个角色啊...',
    '等一下，我的配乐呢？怎么换成你的了？',
    '摄影师麻烦停一下，这位是...？',
  ],
};

const responseTemplates: Record<string, string[]> = {
  defensive: [
    '我还想问你呢！这明明是我的场景！',
    '别紧张，我也不知道怎么就到这儿了。',
    '嘿，冷静点，我比你还困惑呢。',
    '嘘...先别管这些，我们先把戏演下去。',
  ],
  curious: [
    '有意思...你从哪部电影穿越过来的？',
    '你的服装很特别，是哪个年代的风格？',
    '哇，你的世界观听起来很有趣！',
    '你的导演是谁？我想和他交流一下。',
  ],
};

const midTalkTemplates: Record<string, string[]> = {
  plot: [
    '说起来，我最近遇到一件很奇怪的事...',
    '你相信平行宇宙吗？我之前是不信的。',
    '在我的世界里，事情从来不会按常理发展。',
    '我有一个预感，我们的相遇不是偶然。',
  ],
  philosophy: [
    '你有没有想过，我们可能只是别人笔下的角色？',
    '人生就像一盒巧克力，你永远不知道...哦不对，那是你的台词。',
    '如果记忆是一个罐头，我希望它永远不会过期。',
    '我们都是戏子，在别人的故事里流自己的眼泪。',
  ],
};

const replyTemplates: Record<string, string[]> = {
  agree: [
    '说得好！我完全有同感！',
    '这话我好像在哪听过...但记不清了。',
    '你的话让我想起了我的故事...',
    '真是英雄所见略同！',
  ],
  disagree: [
    '我倒不这么看，事情没那么简单。',
    '在我的世界里，情况恰恰相反。',
    '你太理想化了，现实是很残酷的。',
    '你需要我的帮助吗？我经历过类似的事。',
  ],
};

const closingTemplates: string[] = [
  '也许...我们还会在另一部电影里再见。',
  '不管怎样，很高兴认识你，错位的朋友。',
  '胶片到头了，我们的故事暂时告一段落。',
  '该说再见了...但故事永远不会结束。',
  '灯光渐暗，演员表升起，我们的相遇已成经典。',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLineId(): string {
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateScriptId(): string {
  return `script_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildTitle(movieA: Movie, movieB: Movie): string {
  return `《${movieA.title}》×《${movieB.title}》错位对话`;
}

function injectMovieContext(text: string, movie: Movie, otherMovie: Movie): string {
  let result = text;
  
  if (result.includes('导演') && movie.错位Director) {
    result = result.replace('导演', movie.错位Director);
  }
  
  if (result.includes('巧克力') && movie.title.includes('阿甘')) {
    result = result.replace('巧克力', '那盒巧克力');
  }
  
  if (result.includes('罐头') && movie.title.includes('重庆')) {
    result = result.replace('罐头', '凤梨罐头');
  }
  
  if (result.includes('配乐') && movie.director.includes('宫崎骏')) {
    result = result + '（久石让的旋律在背景响起）';
  }
  
  if (otherMovie.director.includes('王家卫') && Math.random() > 0.7) {
    result = result + ' 不过我得承认，你的旁白真的很有感觉。';
  }
  
  if (otherMovie.genre.includes('动作') && Math.random() > 0.8) {
    result = result + ' 话说回来，你要不要跟我过两招？';
  }
  
  return result;
}

export function generateScript(movieA: Movie, movieB: Movie): Script {
  const lines: DialogLine[] = [];
  const lineCount = 8 + Math.floor(Math.random() * 5);
  let timestamp = 0;

  const openingKey = pickRandom(['greeting', 'confused']) as keyof typeof openingTemplates;
  const responseKey = pickRandom(['defensive', 'curious']) as keyof typeof responseTemplates;

  lines.push({
    id: generateLineId(),
    speaker: 'A',
    movieTitle: movieA.title,
    movieEmoji: movieA.emoji,
    text: injectMovieContext(pickRandom(openingTemplates[openingKey]), movieA, movieB),
    timestamp: (timestamp += 1000),
  });

  lines.push({
    id: generateLineId(),
    speaker: 'B',
    movieTitle: movieB.title,
    movieEmoji: movieB.emoji,
    text: injectMovieContext(pickRandom(responseTemplates[responseKey]), movieB, movieA),
    timestamp: (timestamp += 1500),
  });

  for (let i = 0; i < lineCount - 4; i++) {
    const isEven = i % 2 === 0;
    const speaker: 'A' | 'B' = isEven ? 'A' : 'B';
    const currentMovie = isEven ? movieA : movieB;
    const otherMovie = isEven ? movieB : movieA;

    const talkKey = pickRandom(['plot', 'philosophy']) as keyof typeof midTalkTemplates;
    const replyKey = pickRandom(['agree', 'disagree']) as keyof typeof replyTemplates;

    let text: string;
    if (i % 4 < 2) {
      text = pickRandom(midTalkTemplates[talkKey]);
    } else {
      text = pickRandom(replyTemplates[replyKey]);
    }

    lines.push({
      id: generateLineId(),
      speaker,
      movieTitle: currentMovie.title,
      movieEmoji: currentMovie.emoji,
      text: injectMovieContext(text, currentMovie, otherMovie),
      timestamp: (timestamp += 2000 + Math.random() * 1000),
    });
  }

  lines.push({
    id: generateLineId(),
    speaker: 'A',
    movieTitle: movieA.title,
    movieEmoji: movieA.emoji,
    text: injectMovieContext(pickRandom(closingTemplates), movieA, movieB),
    timestamp: (timestamp += 2000),
  });

  lines.push({
    id: generateLineId(),
    speaker: 'B',
    movieTitle: movieB.title,
    movieEmoji: movieB.emoji,
    text: injectMovieContext(pickRandom(closingTemplates), movieB, movieA),
    timestamp: (timestamp += 2500),
  });

  return {
    id: generateScriptId(),
    movieA,
    movieB,
    lines,
    createdAt: Date.now(),
    title: buildTitle(movieA, movieB),
  };
}

export function getRandomPartnerMovie(selectedId: string, allMovies: Movie[]): Movie {
  const others = allMovies.filter((m) => m.id !== selectedId);
  return others[Math.floor(Math.random() * others.length)];
}

export function exportScriptToText(script: Script): string {
  const separator = '='.repeat(50);
  const lines: string[] = [];

  lines.push(separator);
  lines.push(script.title);
  lines.push(separator);
  lines.push('');
  lines.push(`主角A: ${script.movieA.emoji} 《${script.movieA.title}》 (${script.movieA.year}, ${script.movieA.director})`);
  lines.push(`主角B: ${script.movieB.emoji} 《${script.movieB.title}》 (${script.movieB.year}, ${script.movieB.director})`);
  lines.push('');
  lines.push('-'.repeat(50));
  lines.push('');

  script.lines.forEach((line) => {
    const speakerName = line.speaker === 'A' ? '主角A' : '主角B';
    const timeStr = formatTime(line.timestamp);
    lines.push(`[${timeStr}] ${speakerName} (${line.movieEmoji} ${line.movieTitle}):`);
    lines.push(`    ${line.text}`);
    lines.push('');
  });

  lines.push('-'.repeat(50));
  lines.push('');
  lines.push(`生成时间: ${new Date(script.createdAt).toLocaleString('zh-CN')}`);
  lines.push(`错位剧本杀 · VHS MUSEUM`);
  lines.push(separator);

  return lines.join('\n');
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
