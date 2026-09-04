/**
 * メインゲーム準備画面コンポーネント
 */
import { determineRestPlayers, selectBestCombination } from '../../models/algorithm.js';

export function renderMatchSetupScreen({ store, onCreateMatch, onGoRestOption, onGoHistory, onGoHome }) {
  const playerCount = store.state.playerCount;
  const gameNumber = store.state.gameHistory.length + 1;
  const maxRestCount = playerCount - 4;
  const manualRestPlayers = store.state.manualRestPlayers || [];

  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up';

  const manualCount = manualRestPlayers.length;
  const autoCount = Math.max(0, maxRestCount - manualCount);

  container.innerHTML = `
    <!-- Header -->
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

    <!-- Main Section -->
    <div class="flex-1 flex flex-col justify-center space-y-6 my-auto py-6">
      <!-- Big Visual Status Card -->
      <div class="glass-panel rounded-3xl p-6 text-center space-y-4 border border-slate-800/80 shadow-xl">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>

        <div>
          <h3 class="text-lg font-extrabold text-white">準備完了</h3>
          <p class="text-xs text-slate-400 mt-1">
            ボタンを押すと過去履歴から最適な組み合わせを作成します
          </p>
        </div>

        <!-- Current Rest Option Summary Box -->
        ${maxRestCount > 0 ? `
          <div class="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
            <div class="flex items-center justify-between text-slate-300">
              <span class="font-semibold">休憩者の設定状況:</span>
              <button id="btn-open-rest-option" class="text-amber-400 hover:underline font-bold flex items-center space-x-1">
                <span>指定変更（オプション）</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>手動固定指定：<strong class="text-amber-300 font-bold">${manualCount > 0 ? manualRestPlayers.join('、') : 'なし'}</strong></span>
              <span>自動ランダム補充：<strong class="text-teal-300 font-bold">${autoCount > 0 ? `${autoCount}人` : 'なし'}</strong></span>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-3 pt-2 border-t border-slate-800/60">
      <button
        id="btn-create-match"
        class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
      >
        <span>組み合わせを作成</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </button>

      ${maxRestCount > 0 ? `
        <button
          id="btn-option-secondary"
          class="w-full py-3 rounded-2xl font-bold text-sm bg-slate-800/90 text-amber-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>休憩者を選択する（オプション）</span>
        </button>
      ` : ''}
    </div>
  `;

  // Event Listeners
  const createBtn = container.querySelector('#btn-create-match');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      // 保持されている手動指定をもとに休憩者を決定
      const { restPlayers, manualRestPlayers, autoRestPlayers } = determineRestPlayers(playerCount, store.state.manualRestPlayers || []);

      // 出場者4人
      const activePlayers = [];
      for (let p = 1; p <= playerCount; p++) {
        if (!restPlayers.includes(p)) {
          activePlayers.push(p);
        }
      }

      // 公平性組み合わせ選出
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

  const openOptionBtn = container.querySelector('#btn-open-rest-option');
  if (openOptionBtn) openOptionBtn.addEventListener('click', onGoRestOption);

  const optionSecBtn = container.querySelector('#btn-option-secondary');
  if (optionSecBtn) optionSecBtn.addEventListener('click', onGoRestOption);

  const homeBtn = container.querySelector('#btn-home');
  if (homeBtn) homeBtn.addEventListener('click', onGoHome);

  const historyBtn = container.querySelector('#btn-history');
  if (historyBtn) historyBtn.addEventListener('click', onGoHistory);

  return container;
}
