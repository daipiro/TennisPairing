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
 * 各プレイヤーの現在の連続出場数を計算する
 * @param {number} playerNum - プレイヤー番号
 * @param {Array} history - 確定済みゲーム履歴
 * @returns {number} 連続出場数
 */
export function calculateConsecutivePlays(playerNum, history) {
  let consecutive = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const game = history[i];
    const activePlayers = [...game.team1, ...game.team2];
    if (activePlayers.includes(playerNum)) {
      consecutive++;
    } else {
      break;
    }
  }
  return consecutive;
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

  // 連続プレイペナルティ: 3連続以上のプレイヤーが4人の出場者に含まれている場合にペナルティ加算
  const allPlayers = [...team1, ...team2];
  let consecutivePlayPenalty = 0;
  for (const p of allPlayers) {
    const consecutive = calculateConsecutivePlays(p, history);
    if (consecutive >= 3) {
      // 3連続: ペナルティ中、4連続以上: さらに大きいペナルティ
      consecutivePlayPenalty += (consecutive - 2) * 150;
    }
  }

  const score =
    (pairRepetition * 100) +
    (oppRepetition * 10) +
    (sameCardCount * 30) +
    (lastGameSamePairCount * 300) +
    (lastGameSameCard ? 500 : 0) +
    (isSameAsLastDisplayed ? 200 : 0) +
    consecutivePlayPenalty;

  return {
    score,
    breakdown: {
      pairRepetition,
      oppRepetition,
      sameCardCount,
      lastGameSamePairCount,
      lastGameSameCard,
      isSameAsLastDisplayed,
      consecutivePlayPenalty
    }
  };
}

/**
 * 休憩者を決定する（手動指定 + 連続プレイ制限 + 直前休憩者の優先プレイロジック適用）
 * @param {number} playerCount 
 * @param {number[]} manualRestPlayers - 手動で固定指定された休憩者
 * @param {number[]} lastGameRestPlayers - 直前の確定ゲームで休憩していたプレイヤー
 * @param {Array} history - 確定済みゲーム履歴（連続プレイ数計算用）
 */
export function determineRestPlayers(playerCount, manualRestPlayers = [], lastGameRestPlayers = [], history = []) {
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

  // シャッフル関数 (Fisher-Yates)
  const shuffle = (arr) => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };

  // 各候補の連続出場数を計算
  const consecutiveCounts = {};
  for (const p of remainingCandidates) {
    consecutiveCounts[p] = calculateConsecutivePlays(p, history);
  }

  // 優先度グループ分け:
  // 1. 連続3回以上出場中のプレイヤー（最優先で休憩させる）
  // 2. 直前ゲームに出場していたプレイヤー（次に休憩候補にしやすい）
  // 3. 直前ゲームで休憩していたプレイヤー（できる限り出場させたい）
  const lastRestSet = new Set(lastGameRestPlayers);

  const overLimitPlayers = remainingCandidates.filter(p => consecutiveCounts[p] >= 3);
  const playedLastGame = remainingCandidates.filter(p => consecutiveCounts[p] < 3 && !lastRestSet.has(p));
  const restedLastGame = remainingCandidates.filter(p => consecutiveCounts[p] < 3 && lastRestSet.has(p));

  const shuffledOverLimit = shuffle(overLimitPlayers);
  const shuffledPlayed = shuffle(playedLastGame);
  const shuffledRested = shuffle(restedLastGame);

  // 優先度順に休憩者を選出: 連続超過 → 直前出場 → 直前休憩
  let selectedAutoRest = [];
  for (const group of [shuffledOverLimit, shuffledPlayed, shuffledRested]) {
    if (selectedAutoRest.length >= autoNeeded) break;
    const needed = autoNeeded - selectedAutoRest.length;
    selectedAutoRest = [...selectedAutoRest, ...group.slice(0, needed)];
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
