/**
 * テニス乱数表 - ローカルストレージ連動ステート管理
 */

const STORAGE_KEY = 'tennis_pairing_app_state_v1';

export class AppStore {
  constructor() {
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      playerCount: 6, // 初期値 6人
      currentStep: 'start', // 'start' | 'match_setup' | 'rest_option' | 'match_confirm' | 'history'
      gameHistory: [], // 確定ゲーム履歴
      manualRestPlayers: [], // オプションで保持される手動指定休憩者 (例: [1])
      currentGame: null, // 現在検討中のゲーム
    };
  }

  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (!parsed.manualRestPlayers) {
          parsed.manualRestPlayers = [];
        }
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
    // 人数制限を超えている手動休憩者をフィルタリング
    const maxRest = count - 4;
    this.state.manualRestPlayers = (this.state.manualRestPlayers || [])
      .filter(p => p <= count)
      .slice(0, Math.max(0, maxRest));
    
    this.state.currentStep = 'match_setup';
    this.saveState();
  }

  // 手動指定休憩者のオプション設定（選択状態の保持）
  setManualRestPlayers(players) {
    this.state.manualRestPlayers = [...players].sort((a, b) => a - b);
    this.saveState();
  }

  // 画面遷移
  setStep(step) {
    this.state.currentStep = step;
    this.saveState();
  }

  // 現在検討中ゲームの設定
  setCurrentGame(gameData) {
    this.state.currentGame = gameData;
    this.saveState();
  }

  // 組み合わせ確定 (8.3節)
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
    // 次のゲームの準備画面へ
    this.state.currentStep = 'match_setup';
    this.saveState();
  }

  // 直前の確定取り消し (8.4節)
  undoLastGame() {
    if (this.state.gameHistory.length === 0) return false;

    // 最新の確定ゲームを取り出す
    const lastGame = this.state.gameHistory.pop();

    // 復元して未確定状態にする
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

    this.state.currentStep = 'match_confirm';
    this.saveState();
    return true;
  }

  // 最初からやり直す (リセット)
  resetAll() {
    this.state = this.getDefaultState();
    this.saveState();
  }

  // 各参加者の出場・休憩回数統計の取得
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
