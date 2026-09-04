/**
 * 9.2 休憩者選択画面コンポーネント
 */
import { determineRestPlayers, selectBestCombination } from '../../models/algorithm.js';

export function renderRestSelectionScreen({ store, onCreateMatch, onGoHistory, onGoHome }) {
  const playerCount = store.state.playerCount;
  const gameNumber = store.state.gameHistory.length + 1;
  const maxRestCount = playerCount - 4; // 休憩上限

  // 選択中の手動指定休憩者
  const selectedManualRest = new Set();

  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up';

  const updateUI = () => {
    const manualCount = selectedManualRest.size;
    const autoNeeded = Math.max(0, maxRestCount - manualCount);

    container.innerHTML = `
      <!-- Top Bar / Navigation -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button id="btn-home" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </button>
        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Game #${gameNumber}</span>
          <h2 class="text-xl font-bold text-white">第 ${gameNumber} ゲーム</h2>
        </div>
        <button id="btn-history" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
          </svg>
          ${store.state.gameHistory.length > 0 ? `<span class="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>` : ''}
        </button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col justify-center space-y-6 my-auto py-6">
        <div class="text-center space-y-2">
          <h3 class="text-lg font-bold text-slate-200">
            ${maxRestCount > 0 ? '休憩する人を選択' : '4名全員が出場します'}
          </h3>
          <p class="text-xs text-slate-400">
            ${maxRestCount > 0 ? '選択しない場合はアプリが自動でランダム決定します' : 'コート1面にぴったり4人です'}
          </p>
        </div>

        ${maxRestCount > 0 ? `
          <!-- Player Selection Grid -->
          <div class="grid grid-cols-4 gap-3">
            ${Array.from({ length: playerCount }, (_, i) => i + 1).map(player => {
              const isSelected = selectedManualRest.has(player);
              const isDisabled = !isSelected && manualCount >= maxRestCount;
              return `
                <button
                  data-player="${player}"
                  ${isDisabled ? 'disabled' : ''}
                  class="player-rest-btn relative py-5 rounded-2xl font-extrabold text-2xl transition-all duration-200 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300'
                      : isDisabled
                      ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50'
                      : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border border-slate-700/60 active:scale-95'
                  }"
                >
                  <span>${player}</span>
                  ${isSelected ? `<span class="text-[10px] uppercase font-bold tracking-tight bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded-full mt-1">手動指定</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Status Indicators -->
          <div class="glass-panel rounded-2xl p-4 space-y-2 text-xs">
            <div class="flex items-center justify-between text-slate-300">
              <span>手動選択状況:</span>
              <span class="font-bold text-amber-400">${manualCount}人 ／ 最大${maxRestCount}人</span>
            </div>
            <div class="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800/60">
              <span>ランダム自動追加:</span>
              <span class="font-semibold text-slate-300">${autoNeeded > 0 ? `残り ${autoNeeded}人` : 'なし (手動で完了)'}</span>
            </div>
          </div>
        ` : `
          <!-- 4 Players case -->
          <div class="glass-panel rounded-2xl p-6 text-center text-emerald-400 border-emerald-500/30">
            <svg class="w-12 h-12 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <p class="font-bold text-base">全員出場（1, 2, 3, 4）</p>
          </div>
        `}
      </div>

      <!-- Footer Action -->
      <div class="pt-4 border-t border-slate-800/60">
        <button
          id="btn-create-match"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <span>組み合わせを作成</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    `;

    // Event listeners
    container.querySelectorAll('.player-rest-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const player = parseInt(e.currentTarget.dataset.player, 10);
        if (selectedManualRest.has(player)) {
          selectedManualRest.delete(player);
        } else {
          if (selectedManualRest.size < maxRestCount) {
            selectedManualRest.add(player);
          }
        }
        updateUI();
      });
    });

    const createBtn = container.querySelector('#btn-create-match');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        // 休憩者の確定
        const manualList = Array.from(selectedManualRest);
        const { restPlayers, manualRestPlayers, autoRestPlayers } = determineRestPlayers(playerCount, manualList);

        // 出場者4人の選出
        const activePlayers = [];
        for (let p = 1; p <= playerCount; p++) {
          if (!restPlayers.includes(p)) {
            activePlayers.push(p);
          }
        }

        // 組み合わせアルゴリズムの適用
        const bestCombination = selectBestCombination(activePlayers, store.state.gameHistory);

        const currentGameData = {
          gameNumber,
          restPlayers,
          manualRestPlayers,
          autoRestPlayers,
          team1: bestCombination.team1,
          team2: bestCombination.team2,
          lastDisplayedKey: bestCombination.key
        };

        onCreateMatch(currentGameData);
      });
    }

    const homeBtn = container.querySelector('#btn-home');
    if (homeBtn) homeBtn.addEventListener('click', onGoHome);

    const historyBtn = container.querySelector('#btn-history');
    if (historyBtn) historyBtn.addEventListener('click', onGoHistory);
  };

  updateUI();
  return container;
}
