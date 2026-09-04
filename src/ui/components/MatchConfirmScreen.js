/**
 * 9.3 組み合わせ確認画面コンポーネント
 */
import { selectBestCombination, makeCardKey } from '../../models/algorithm.js';

export function renderMatchConfirmScreen({ store, onConfirm, onGoRestOption, onGoHistory }) {
  let currentGame = { ...store.state.currentGame };
  let selectedPlayersForSwap = []; // 手動入れ替え用にタップ選択されたインデックス/位置

  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up';

  const updateUI = () => {
    const { gameNumber, team1, team2, restPlayers, manualRestPlayers, autoRestPlayers } = currentGame;

    // 手動指定・自動選択のラベル整理
    const manualStr = (manualRestPlayers && manualRestPlayers.length > 0) ? manualRestPlayers.join('、') : 'なし';
    const autoStr = (autoRestPlayers && autoRestPlayers.length > 0) ? autoRestPlayers.join('、') : 'なし';

    container.innerHTML = `
      <!-- Top Header -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button id="btn-reselect-rest" class="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition-colors flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          </svg>
          <span>休憩指定オプション</span>
        </button>

        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Confirmation</span>
          <h2 class="text-xl font-bold text-white">第 ${gameNumber} ゲーム</h2>
        </div>

        <button id="btn-history" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
          </svg>
        </button>
      </div>

      <!-- Main Court Card Display -->
      <div class="flex-1 flex flex-col justify-center space-y-5 py-4">
        <!-- Swap Hint -->
        <div class="text-center">
          <span class="inline-block text-[11px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
            💡 選手番号を2人タップすると位置を入れ替えられます
          </span>
        </div>

        <!-- Court Representation -->
        <div class="court-card rounded-3xl p-6 relative overflow-hidden border shadow-2xl">
          <!-- Court Net Line -->
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed court-line flex items-center justify-center">
            <span class="bg-slate-900/90 text-amber-400 text-xs font-black tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
              VS
            </span>
          </div>

          <!-- Team 1 (Top Court) -->
          <div class="mb-10 text-center space-y-3">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400/90">TEAM A</span>
            <div class="flex items-center justify-center space-x-4">
              ${renderPlayerCard(team1[0], 't1-0')}
              <span class="text-slate-500 font-bold">•</span>
              ${renderPlayerCard(team1[1], 't1-1')}
            </div>
          </div>

          <!-- Team 2 (Bottom Court) -->
          <div class="mt-10 text-center space-y-3">
            <div class="flex items-center justify-center space-x-4">
              ${renderPlayerCard(team2[0], 't2-0')}
              <span class="text-slate-500 font-bold">•</span>
              ${renderPlayerCard(team2[1], 't2-1')}
            </div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-teal-400/90">TEAM B</span>
          </div>
        </div>

        <!-- Rest Players Info Panel -->
        <div class="glass-panel rounded-2xl p-4 text-xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-300">休憩プレイヤー:</span>
            <span class="font-extrabold text-amber-400 text-sm">
              ${restPlayers && restPlayers.length > 0 ? restPlayers.join(' 、 ') : 'なし'}
            </span>
          </div>
          ${restPlayers && restPlayers.length > 0 ? `
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動固定：<strong class="text-amber-300">${manualStr}</strong></span>
              <span>自動補充：<strong class="text-teal-300">${autoStr}</strong></span>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2.5 pt-2 border-t border-slate-800/60">
        <button
          id="btn-confirm"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>この組み合わせで確定</span>
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            id="btn-reroll"
            class="py-3 rounded-xl font-bold text-sm bg-slate-800/90 text-emerald-400 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>再抽選</span>
          </button>

          <button
            id="btn-clear-swap"
            class="py-3 rounded-xl font-bold text-sm bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all"
          >
            選択解除
          </button>
        </div>
      </div>
    `;

    function renderPlayerCard(playerNum, slotId) {
      const isSelected = selectedPlayersForSwap.includes(slotId);
      return `
        <button
          data-slot="${slotId}"
          class="player-slot w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
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

    const confirmBtn = container.querySelector('#btn-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        store.setCurrentGame(currentGame);
        onConfirm();
      });
    }

    const reselectRestBtn = container.querySelector('#btn-reselect-rest');
    if (reselectRestBtn) reselectRestBtn.addEventListener('click', onGoRestOption);

    const historyBtn = container.querySelector('#btn-history');
    if (historyBtn) historyBtn.addEventListener('click', onGoHistory);
  };

  updateUI();
  return container;
}
