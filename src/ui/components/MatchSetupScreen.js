/**
 * メイン画面コンポーネント (1画面完結型)
 * - 上部：時系列対戦履歴（第1ゲームが一番上、下に追加される）
 * - 中央〜下部：作成・生成された対戦組み合わせのコート表示、手動入れ替え、再抽選
 * - 最下部：「この組み合わせで確定」ボタン & 「直前の確定を取り消す」ボタン
 */
import { selectBestCombination, makeCardKey } from '../../models/algorithm.js';

export function renderMatchSetupScreen({ store, onConfirmMatch, onUndoMatch, onGoRestOption, onGoHistory, onGoHome }) {
  const playerCount = store.state.playerCount;
  const history = store.state.gameHistory || [];
  const maxRestCount = playerCount - 4;
  const manualRestPlayers = store.state.manualRestPlayers || [];

  let currentGame = store.state.currentGame;
  if (!currentGame) {
    currentGame = store.generateNextCurrentGame();
  } else {
    currentGame = { ...currentGame };
  }

  let selectedPlayersForSwap = []; // 手動入れ替え用に選択されたスロット

  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up overflow-y-auto no-scrollbar space-y-6';

  const updateUI = () => {
    const manualCount = manualRestPlayers.length;
    const autoCount = Math.max(0, maxRestCount - manualCount);
    const { gameNumber, team1, team2, restPlayers, manualRestPlayers: gameManualRest, autoRestPlayers: gameAutoRest } = currentGame;

    const manualStr = (gameManualRest && gameManualRest.length > 0) ? gameManualRest.join('、') : 'なし';
    const autoStr = (gameAutoRest && gameAutoRest.length > 0) ? gameAutoRest.join('、') : 'なし';

    container.innerHTML = `
      <!-- Top Navigation Header -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-3 shrink-0">
        <button id="btn-home" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </button>
        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Main Court</span>
          <h2 class="text-lg font-bold text-white">テニス乱数表</h2>
        </div>
        <button id="btn-history" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
          </svg>
        </button>
      </div>

      <!-- 1. Top Section: Chronological Match History (Game 1 at Top -> Newest at Bottom) -->
      <div class="glass-panel rounded-3xl p-5 border border-slate-800/80 shadow-lg space-y-3 shrink-0">
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <h3 class="font-extrabold text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>対戦履歴 (${history.length} 試合完了)</span>
          </h3>
          <button id="btn-view-stats" class="text-[11px] text-slate-400 hover:text-white underline">
            参加状況詳細
          </button>
        </div>

        ${history.length === 0 ? `
          <div class="py-4 text-center text-slate-500 text-xs">
            確定済みの試合履歴はまだありません。
          </div>
        ` : `
          <div class="space-y-2.5">
            ${history.map(game => `
              <div class="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-2">
                  <span class="font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full text-[10px]">
                    第${game.gameNumber}G
                  </span>
                  <span class="font-extrabold text-white text-sm">
                    ${game.team1[0]}・${game.team1[1]} <span class="text-slate-500 font-normal text-xs">vs</span> ${game.team2[0]}・${game.team2[1]}
                  </span>
                </div>
                <div class="text-[11px] text-amber-400 font-medium">
                  休: ${game.restPlayers && game.restPlayers.length > 0 ? game.restPlayers.join(',') : 'なし'}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- 2. Middle Section: Current Generated Match Card (Inline Court Representation) -->
      <div class="space-y-3 shrink-0">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <h3 class="font-extrabold text-sm text-white">
              第 ${gameNumber} ゲームの組み合わせ
            </h3>
          </div>
          <span class="text-[11px] text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            💡 選手2人タップで位置交換
          </span>
        </div>

        <!-- Court Container -->
        <div class="court-card rounded-3xl p-6 relative overflow-hidden border shadow-2xl">
          <!-- Court Net Line -->
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed court-line flex items-center justify-center">
            <span class="bg-slate-900/90 text-amber-400 text-xs font-black tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
              VS
            </span>
          </div>

          <!-- Team 1 (Top Court) -->
          <div class="mb-9 text-center space-y-2">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400/90">TEAM A</span>
            <div class="flex items-center justify-center space-x-4">
              ${renderPlayerCard(team1[0], 't1-0')}
              <span class="text-slate-500 font-bold">•</span>
              ${renderPlayerCard(team1[1], 't1-1')}
            </div>
          </div>

          <!-- Team 2 (Bottom Court) -->
          <div class="mt-9 text-center space-y-2">
            <div class="flex items-center justify-center space-x-4">
              ${renderPlayerCard(team2[0], 't2-0')}
              <span class="text-slate-500 font-bold">•</span>
              ${renderPlayerCard(team2[1], 't2-1')}
            </div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-teal-400/90">TEAM B</span>
          </div>
        </div>

        <!-- Rest & Options Info Panel -->
        <div class="glass-panel rounded-2xl p-4 text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-300">休憩プレイヤー:</span>
            <span class="font-extrabold text-amber-400 text-sm">
              ${restPlayers && restPlayers.length > 0 ? restPlayers.join(' 、 ') : 'なし'}
            </span>
          </div>
          ${maxRestCount > 0 ? `
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動固定：<strong class="text-amber-300">${manualStr}</strong></span>
              <span>自動補充：<strong class="text-teal-300">${autoStr}</strong></span>
              <button id="btn-open-rest-option" class="text-amber-400 hover:underline font-bold ml-2">
                設定変更
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Reroll & Clear buttons -->
        <div class="grid grid-cols-2 gap-2">
          <button
            id="btn-reroll"
            class="py-3 rounded-xl font-bold text-xs bg-slate-800/90 text-emerald-400 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>組み合わせを再抽選</span>
          </button>

          <button
            id="btn-clear-swap"
            class="py-3 rounded-xl font-bold text-xs bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all"
          >
            位置選択を解除
          </button>
        </div>
      </div>

      <!-- 3. Bottom Action Buttons: Confirm Match, Undo & Options -->
      <div class="space-y-2.5 pt-2 border-t border-slate-800/60 shrink-0 pb-2">
        <button
          id="btn-confirm-match"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>この組み合わせで確定 (第${gameNumber}G)</span>
        </button>

        ${history.length > 0 ? `
          <button
            id="btn-undo-main"
            class="w-full py-3 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${history.length}G)</span>
          </button>
        ` : ''}

        ${maxRestCount > 0 ? `
          <button
            id="btn-option-secondary"
            class="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 text-amber-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>休憩者を選択する（オプション）</span>
          </button>
        ` : ''}
      </div>
    `;

    function renderPlayerCard(playerNum, slotId) {
      const isSelected = selectedPlayersForSwap.includes(slotId);
      return `
        <button
          data-slot="${slotId}"
          class="player-slot w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
            isSelected
              ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce'
              : 'bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600/50 active:scale-95'
          }"
        >
          ${playerNum}
        </button>
      `;
    }

    container.querySelectorAll('.player-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = e.currentTarget.dataset.slot;

        if (selectedPlayersForSwap.includes(slot)) {
          selectedPlayersForSwap = selectedPlayersForSwap.filter(s => s !== slot);
        } else {
          selectedPlayersForSwap.push(slot);
          if (selectedPlayersForSwap.length === 2) {
            swapPlayers(selectedPlayersForSwap[0], selectedPlayersForSwap[1]);
            selectedPlayersForSwap = [];
          }
        }
        updateUI();
      });
    });

    function swapPlayers(slotA, slotB) {
      const getVal = (slot) => {
        if (slot === 't1-0') return currentGame.team1[0];
        if (slot === 't1-1') return currentGame.team1[1];
        if (slot === 't2-0') return currentGame.team2[0];
        if (slot === 't2-1') return currentGame.team2[1];
      };

      const setVal = (slot, val) => {
        if (slot === 't1-0') currentGame.team1[0] = val;
        if (slot === 't1-1') currentGame.team1[1] = val;
        if (slot === 't2-0') currentGame.team2[0] = val;
        if (slot === 't2-1') currentGame.team2[1] = val;
      };

      const valA = getVal(slotA);
      const valB = getVal(slotB);

      setVal(slotA, valB);
      setVal(slotB, valA);

      currentGame.lastDisplayedKey = makeCardKey(currentGame.team1, currentGame.team2);
      store.setCurrentGame(currentGame);
    }

    const rerollBtn = container.querySelector('#btn-reroll');
    if (rerollBtn) {
      rerollBtn.addEventListener('click', () => {
        const active4 = [...currentGame.team1, ...currentGame.team2];
        const lastDisplayed = currentGame.lastDisplayedKey || makeCardKey(currentGame.team1, currentGame.team2);

        const nextComb = selectBestCombination(active4, store.state.gameHistory, lastDisplayed);

        currentGame.team1 = nextComb.team1;
        currentGame.team2 = nextComb.team2;
        currentGame.lastDisplayedKey = nextComb.key;
        selectedPlayersForSwap = [];

        store.setCurrentGame(currentGame);
        updateUI();
      });
    }

    const clearBtn = container.querySelector('#btn-clear-swap');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedPlayersForSwap = [];
        updateUI();
      });
    }

    const confirmMatchBtn = container.querySelector('#btn-confirm-match');
    if (confirmMatchBtn) {
      confirmMatchBtn.addEventListener('click', () => {
        store.setCurrentGame(currentGame);
        onConfirmMatch();
      });
    }

    // 確認ダイアログなしで即座に取り消し実行
    const undoMainBtn = container.querySelector('#btn-undo-main');
    if (undoMainBtn) {
      undoMainBtn.addEventListener('click', () => {
        onUndoMatch();
      });
    }

    const openOptionBtn = container.querySelector('#btn-open-rest-option');
    if (openOptionBtn) openOptionBtn.addEventListener('click', onGoRestOption);

    const optionSecBtn = container.querySelector('#btn-option-secondary');
    if (optionSecBtn) optionSecBtn.addEventListener('click', onGoRestOption);

    const viewStatsBtn = container.querySelector('#btn-view-stats');
    if (viewStatsBtn) viewStatsBtn.addEventListener('click', onGoHistory);

    const homeBtn = container.querySelector('#btn-home');
    if (homeBtn) homeBtn.addEventListener('click', onGoHome);

    const historyBtn = container.querySelector('#btn-history');
    if (historyBtn) historyBtn.addEventListener('click', onGoHistory);
  };

  updateUI();
  return container;
}
