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
    // チーム内は昇順
    const t1 = [...p.team1].sort((x, y) => x - y);
    const t2 = [...p.team2].sort((x, y) => x - y);

    // チーム間も昇順でユニークキー化
    const [first, second] = [t1, t2].sort((tA, tB) => tA[0] - tB[0] || tA[1] - tB[1]);
    const key = `${first[0]}-${first[1]}_vs_${second[0]}-${second[1]}`;

    return {
      team1: p.team1, // 元の順番を維持
      team2: p.team2,
      key
    };
  });
}

/**
 * ペアおよび対戦カードのキー生成用ユーティリティ
 */
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
 * @param {Array} history 
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
    // ペア集計
    const pair1Key = makePairKey(team1[0], team1[1]);
    const pair2Key = makePairKey(team2[0], team2[1]);
    pairCounts[pair1Key] = (pairCounts[pair1Key] || 0) + 1;
    pairCounts[pair2Key] = (pairCounts[pair2Key] || 0) + 1;

    // 対戦相手集計 (team1 vs team2)
    for (const p1 of team1) {
      for (const p2 of team2) {
        const oppKey = makePairKey(p1, p2);
        opponentCounts[oppKey] = (opponentCounts[oppKey] || 0) + 1;
      }
    }

    // 対戦カード集計
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

  // 1. ペア重複回数
  const pairRepetition = getPair(team1[0], team1[1]) + getPair(team2[0], team2[1]);

  // 2. 対戦相手重複回数
  const oppRepetition = 
    getOpponent(team1[0], team2[0]) +
    getOpponent(team1[0], team2[1]) +
    getOpponent(team1[1], team2[0]) +
    getOpponent(team1[1], team2[1]);

  // 3. 同一対戦カード回数
  const sameCardCount = getCard(key);

  // 4. 直前ゲームとの比較
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

  // 5. 再抽選で直前表示と同一
  const isSameAsLastDisplayed = lastDisplayedKey && (key === lastDisplayedKey);

  // 要件定義書のスコア計算式
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
 * 休憩者を決定する（手動指定 + ランダム不足補充）
 * @param {number} playerCount 
 * @param {number[]} manualRestPlayers 
 */
export function determineRestPlayers(playerCount, manualRestPlayers = []) {
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

  // 残りのプレイヤー候補
  const remainingCandidates = [];
  for (let i = 1; i <= playerCount; i++) {
    if (!manualSet.has(i)) {
      remainingCandidates.push(i);
    }
  }

  // ランダムに autoNeeded 人選出 (Fisher-Yates)
  const shuffled = [...remainingCandidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const autoRestPlayers = shuffled.slice(0, autoNeeded).sort((a, b) => a - b);
  const restPlayers = [...Array.from(manualSet), ...autoRestPlayers].sort((a, b) => a - b);

  return {
    restPlayers,
    manualRestPlayers: Array.from(manualSet).sort((a, b) => a - b),
    autoRestPlayers
  };
}

/**
 * 最良の組み合わせ候補を選出する (要件定義書 7.3節)
 * @param {number[]} players4 - 出場する4人のプレイヤー番号
 * @param {Array} history - 確定済み履歴
 * @param {string|null} lastDisplayedKey - 再抽選時の直前表示カードキー
 */
export function selectBestCombination(players4, history, lastDisplayedKey = null) {
  const combinations = getPossibleCombinations(players4);

  const scoredCombinations = combinations.map(comb => {
    const { score, breakdown } = calculatePenaltyScore(comb, history, lastDisplayedKey);
    return { ...comb, score, breakdown };
  });

  // 最小スコアを求める
  const minScore = Math.min(...scoredCombinations.map(c => c.score));

  // 最小スコアから一定範囲内 (同等または +20 差以内) の候補を抽出
  const threshold = minScore + 20;
  const bestCandidates = scoredCombinations.filter(c => c.score <= threshold);

  // 抽出候補からランダムに1つ選択
  const selectedIndex = Math.floor(Math.random() * bestCandidates.length);
  return bestCandidates[selectedIndex];
}
