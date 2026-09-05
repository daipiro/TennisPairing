/**
 * テニス乱数表 - 組み合わせ決定および公平性スコア計算アルゴリズム
 */

/**
 * 4人のプレイヤーから可能な3つのペア・対戦組み合わせパターンを定義
 * @param {number[]} players4 - 4人のプレイヤー番号配列 (例: [1, 3, 5, 6])
 * @returns {Array<{ team1: number[], team2: number[], key: string }>}
 */
export function getPossibleCombinations(players4) {
  const [a, b, c, d] = players4;

  const patterns = [
    { team1: [a, b], team2: [c, d] },
    { team1: [a, c], team2: [b, d] },
    { team1: [a, d], team2: [b, c] }
  ];

  return patterns.map(p => {
    const t1 = [...p.team1].sort((x, y) => x - y);
    const t2 = [...p.team2].sort((x, y) => x - y);

    const [first, second] = [t1, t2].sort((tA, tB) => tA[0] - tB[0] || tA[1] - tB[1]);
    const key = `${first[0]}-${first[1]}_vs_${second[0]}-${second[1]}`;

    return {
      team1: p.team1,
      team2: p.team2,
      key
    };
  });
}

export function makePairKey(p1, p2) {
  return p1 < p2 ? `${p1}-${p2}` : `${p2}-${p1}`;
}

export function makeCardKey(team1, team2) {
  const t1 = [...team1].sort((x, y) => x - y);
  const t2 = [...team2].sort((x, y) => x - y);
  const [first, second] = [t1, t2].sort((tA, tB) => tA[0] - tB[0] || tA[1] - tB[1]);
  return `${first[0]}-${first[1]}_vs_${second[0]}-${second[1]}`;
}

/**
 * 過去履歴からの集計データを求める
 */
export function aggregateHistory(history) {
  const pairCounts = {};
  const opponentCounts = {};
  const cardCounts = {};

  const getPair = (a, b) => {
    const k = makePairKey(a, b);
    return pairCounts[k] || 0;
  };

  const getOpponent = (a, b) => {
    const k = makePairKey(a, b);
    return opponentCounts[k] || 0;
  };

  const getCard = (cardKey) => {
    return cardCounts[cardKey] || 0;
  };

  for (const game of history) {
    const { team1, team2 } = game;
    const pair1Key = makePairKey(team1[0], team1[1]);
    const pair2Key = makePairKey(team2[0], team2[1]);
    pairCounts[pair1Key] = (pairCounts[pair1Key] || 0) + 1;
    pairCounts[pair2Key] = (pairCounts[pair2Key] || 0) + 1;

    for (const p1 of team1) {
      for (const p2 of team2) {
        const oppKey = makePairKey(p1, p2);
        opponentCounts[oppKey] = (opponentCounts[oppKey] || 0) + 1;
      }
    }

    const cardKey = makeCardKey(team1, team2);
    cardCounts[cardKey] = (cardCounts[cardKey] || 0) + 1;
  }

  return { pairCounts, opponentCounts, cardCounts, getPair, getOpponent, getCard };
}

/**
 * 公平性スコアの計算 (7.2節)
 */
export function calculatePenaltyScore(combination, history, lastDisplayedKey = null) {
  const { team1, team2, key } = combination;
  const { getPair, getOpponent, getCard } = aggregateHistory(history);

  const pairRepetition = getPair(team1[0], team1[1]) + getPair(team2[0], team2[1]);

  const oppRepetition = 
    getOpponent(team1[0], team2[0]) +
    getOpponent(team1[0], team2[1]) +
    getOpponent(team1[1], team2[0]) +
    getOpponent(team1[1], team2[1]);

  const sameCardCount = getCard(key);

  let lastGameSamePairCount = 0;
  let lastGameSameCard = false;

  if (history.length > 0) {
    const lastGame = history[history.length - 1];
    const lastPair1 = makePairKey(lastGame.team1[0], lastGame.team1[1]);
    const lastPair2 = makePairKey(lastGame.team2[0], lastGame.team2[1]);
    
    const currPair1 = makePairKey(team1[0], team1[1]);
    const currPair2 = makePairKey(team2[0], team2[1]);

    if (currPair1 === lastPair1 || currPair1 === lastPair2) lastGameSamePairCount++;
    if (currPair2 === lastPair1 || currPair2 === lastPair2) lastGameSamePairCount++;

    const lastCardKey = makeCardKey(lastGame.team1, lastGame.team2);
    if (key === lastCardKey) {
      lastGameSameCard = true;
    }
  }

  const isSameAsLastDisplayed = lastDisplayedKey && (key === lastDisplayedKey);

  const score =
    (pairRepetition * 100) +
    (oppRepetition * 10) +
    (sameCardCount * 30) +
    (lastGameSamePairCount * 300) +
    (lastGameSameCard ? 500 : 0) +
    (isSameAsLastDisplayed ? 200 : 0);

  return {
    score,
    breakdown: {
      pairRepetition,
      oppRepetition,
      sameCardCount,
      lastGameSamePairCount,
      lastGameSameCard,
      isSameAsLastDisplayed
    }
  };
}

/**
 * 休憩者を決定する（手動指定 + 直前休憩者の優先プレイロジック適用）
 * @param {number} playerCount 
 * @param {number[]} manualRestPlayers - 手動で固定指定された休憩者
 * @param {number[]} lastGameRestPlayers - 直前の確定ゲームで休憩していたプレイヤー
 */
export function determineRestPlayers(playerCount, manualRestPlayers = [], lastGameRestPlayers = []) {
  const targetRestCount = playerCount - 4;
  if (targetRestCount <= 0) {
    return {
      restPlayers: [],
      manualRestPlayers: [],
      autoRestPlayers: []
    };
  }

  const manualSet = new Set(manualRestPlayers.filter(p => p >= 1 && p <= playerCount));
  const autoNeeded = targetRestCount - manualSet.size;

  if (autoNeeded <= 0) {
    const finalRest = Array.from(manualSet).sort((a, b) => a - b);
    return {
      restPlayers: finalRest,
      manualRestPlayers: finalRest,
      autoRestPlayers: []
    };
  }

  // 手動固定指定されていない残り候補プレイヤー
  const remainingCandidates = [];
  for (let i = 1; i <= playerCount; i++) {
    if (!manualSet.has(i)) {
      remainingCandidates.push(i);
    }
  }

  // 直前ゲームで休憩していたプレイヤーは「優先的にプレイ」させるため、
  // 自動選出の休憩者候補からできる限り除外し、直前出場者を優先して休憩者候補にする。
  const lastRestSet = new Set(lastGameRestPlayers);
  const playedLastGame = remainingCandidates.filter(p => !lastRestSet.has(p));
  const restedLastGame = remainingCandidates.filter(p => lastRestSet.has(p));

  // シャッフル関数 (Fisher-Yates)
  const shuffle = (arr) => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };

  const shuffledPlayed = shuffle(playedLastGame);
  const shuffledRested = shuffle(restedLastGame);

  // まず直前ゲームに出場していた人から休憩者を選ぶ
  let selectedAutoRest = shuffledPlayed.slice(0, autoNeeded);

  // もし不足分があれば、直前ゲームで休憩していた人からも補填する
  if (selectedAutoRest.length < autoNeeded) {
    const neededMore = autoNeeded - selectedAutoRest.length;
    selectedAutoRest = [...selectedAutoRest, ...shuffledRested.slice(0, neededMore)];
  }

  const autoRestPlayers = selectedAutoRest.sort((a, b) => a - b);
  const restPlayers = [...Array.from(manualSet), ...autoRestPlayers].sort((a, b) => a - b);

  return {
    restPlayers,
    manualRestPlayers: Array.from(manualSet).sort((a, b) => a - b),
    autoRestPlayers
  };
}

/**
 * 最良の組み合わせ候補を選出する (要件定義書 7.3節)
 */
export function selectBestCombination(players4, history, lastDisplayedKey = null) {
  const combinations = getPossibleCombinations(players4);

  const scoredCombinations = combinations.map(comb => {
    const { score, breakdown } = calculatePenaltyScore(comb, history, lastDisplayedKey);
    return { ...comb, score, breakdown };
  });

  const minScore = Math.min(...scoredCombinations.map(c => c.score));
  const threshold = minScore + 20;
  const bestCandidates = scoredCombinations.filter(c => c.score <= threshold);

  const selectedIndex = Math.floor(Math.random() * bestCandidates.length);
  return bestCandidates[selectedIndex];
}
