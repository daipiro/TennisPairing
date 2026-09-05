/**
 * テニス乱数表 - ローカルストレージ連動ステート管理
 */
import { determineRestPlayers, selectBestCombination } from './algorithm.js';

const STORAGE_KEY = 'tennis_pairing_app_state_v1';

export class AppStore {
  constructor() {
    this.state = this.loadState();
    if (this.state.currentStep !== 'start') {
      this.state.currentStep = 'main';
    }
    if (!this.state.currentGame) {
      this.generateNextCurrentGame();
    }
  }

  getDefaultState() {
    return {
      playerCount: 6, // 初期値 6人
      currentStep: 'start', // 'start' | 'main' | 'history'
      gameHistory: [], // 確定ゲーム履歴
      manualRestPlayers: [], // オプションで保持される手動指定休憩者 (例: [1])
      currentGame: null, // 現在検討・表示中のゲーム
    };
  }

  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (!parsed.manualRestPlayers) parsed.manualRestPlayers = [];
        parsed.currentStep = parsed.currentStep === 'start' ? 'start' : 'main';
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  // 参加人数選択 & ゲーム新規開始
  setPlayerCount(count) {
    this.state.playerCount = count;
    const maxRest = count - 4;
    this.state.manualRestPlayers = (this.state.manualRestPlayers || [])
      .filter(p => p <= count)
      .slice(0, Math.max(0, maxRest));
    
    this.state.currentGame = null;
    this.generateNextCurrentGame();
    this.state.currentStep = 'main';
    this.saveState();
  }

  /**
   * 次のゲームの組み合わせ（休憩者選出 + 4人のペア）を生成して currentGame にセット
   * @param {string|null} lastDisplayedKey - 再抽選時の直前カードキー
   */
  generateNextCurrentGame(lastDisplayedKey = null) {
    const playerCount = this.state.playerCount;
    const gameNumber = this.state.gameHistory.length + 1;

    // 直前の確定ゲームの休憩者を特定
    let lastGameRestPlayers = [];
    if (this.state.gameHistory.length > 0) {
      lastGameRestPlayers = this.state.gameHistory[this.state.gameHistory.length - 1].restPlayers || [];
    }

    // 休憩者の決定（連続3連続プレイヤー優先休憩 + 直前休憩者は優先的に出場させる）
    const { restPlayers, manualRestPlayers, autoRestPlayers } = determineRestPlayers(
      playerCount,
      this.state.manualRestPlayers || [],
      lastGameRestPlayers,
      this.state.gameHistory
    );

    // 出場者4人の選出
    const activePlayers = [];
    for (let p = 1; p <= playerCount; p++) {
      if (!restPlayers.includes(p)) activePlayers.push(p);
    }

    // 組み合わせのアルゴリズム決定
    const bestComb = selectBestCombination(activePlayers, this.state.gameHistory, lastDisplayedKey);

    this.state.currentGame = {
      gameNumber,
      restPlayers,
      manualRestPlayers,
      autoRestPlayers,
      team1: bestComb.team1,
      team2: bestComb.team2,
      lastDisplayedKey: bestComb.key
    };
    this.saveState();
    return this.state.currentGame;
  }

  // 再抽選（手動固定の休憩者は保持し、残りの休憩者・出場者・ペア構成をまるごと再選出）
  rerollCurrentGame() {
    const lastDisplayedKey = this.state.currentGame?.lastDisplayedKey || null;
    return this.generateNextCurrentGame(lastDisplayedKey);
  }

  // 手動固定休憩者のトグル切り替え（メイン画面インライン用）
  toggleManualRestPlayer(playerNum) {
    const maxRestCount = this.state.playerCount - 4;
    let list = [...(this.state.manualRestPlayers || [])];

    if (list.includes(playerNum)) {
      list = list.filter(p => p !== playerNum);
    } else {
      if (list.length < maxRestCount) {
        list.push(playerNum);
      }
    }

    this.state.manualRestPlayers = list.sort((a, b) => a - b);
    this.generateNextCurrentGame();
    this.saveState();
  }

  // 画面遷移
  setStep(step) {
    this.state.currentStep = step;
    this.saveState();
  }

  // 現在検討中ゲームの更新
  setCurrentGame(gameData) {
    this.state.currentGame = gameData;
    this.saveState();
  }

  // 組み合わせ確定
  confirmCurrentGame() {
    if (!this.state.currentGame) return;

    const gameNumber = this.state.gameHistory.length + 1;
    const confirmedRecord = {
      gameNumber,
      team1: [...this.state.currentGame.team1],
      team2: [...this.state.currentGame.team2],
      restPlayers: [...this.state.currentGame.restPlayers],
      manuallySelectedRestPlayers: [...(this.state.currentGame.manualRestPlayers || [])]
    };

    this.state.gameHistory.push(confirmedRecord);
    this.state.currentGame = null;
    
    this.generateNextCurrentGame();
    this.state.currentStep = 'main';
    this.saveState();
  }

  // 直前の確定取り消し
  undoLastGame() {
    if (this.state.gameHistory.length === 0) return false;

    const lastGame = this.state.gameHistory.pop();

    const manualRest = lastGame.manuallySelectedRestPlayers || [];
    const allRest = lastGame.restPlayers || [];
    const autoRest = allRest.filter(p => !manualRest.includes(p));

    this.state.currentGame = {
      gameNumber: lastGame.gameNumber,
      team1: lastGame.team1,
      team2: lastGame.team2,
      restPlayers: allRest,
      manualRestPlayers: manualRest,
      autoRestPlayers: autoRest,
      lastDisplayedKey: null
    };

    this.state.currentStep = 'main';
    this.saveState();
    return true;
  }

  // 最初からやり直す (リセット)
  resetAll() {
    this.state = this.getDefaultState();
    this.saveState();
  }

  // 統計データ取得
  getStats() {
    const stats = {};
    const count = this.state.playerCount;

    for (let i = 1; i <= count; i++) {
      stats[i] = { player: i, playCount: 0, restCount: 0 };
    }

    for (const game of this.state.gameHistory) {
      const activePlayers = [...game.team1, ...game.team2];
      for (const p of activePlayers) {
        if (stats[p]) stats[p].playCount++;
      }
      for (const r of game.restPlayers) {
        if (stats[r]) stats[r].restCount++;
      }
    }

    return stats;
  }
}
