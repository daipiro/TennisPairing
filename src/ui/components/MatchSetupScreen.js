/**
 * メインゲーム準備画面コンポーネント
 * - メイン画面上部に対戦履歴を表示（第1ゲームが一番上、下に追加される）
 * - 履歴枠単体での内側スクロールは行わず、メイン画面全体で縦スクロール
 * - 組み合わせ作成ボタンおよびオプション設定は最下部に配置
 */
import { determineRestPlayers, selectBestCombination } from '../../models/algorithm.js';

export function renderMatchSetupScreen({ store, onCreateMatch, onGoRestOption, onGoHistory, onGoHome }) {
  const playerCount = store.state.playerCount;
  const history = store.state.gameHistory || [];
  const gameNumber = history.length + 1;
  const maxRestCount = playerCount - 4;
  const manualRestPlayers = store.state.manualRestPlayers || [];

  const container = document.createElement('div');
  // 画面全体で縦スクロールできるように overflow-y-auto を設定
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up overflow-y-auto no-scrollbar space-y-6';

  const manualCount = manualRestPlayers.length;
  const autoCount = Math.max(0, maxRestCount - manualCount);

  container.innerHTML = `
    <!-- Top Header -->
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

    <!-- 1. Top Section: Match History List (Chronological: Game 1 at top -> Newest at bottom) -->
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

      <!-- History list with NO inner scrollbar (entire screen scrolls) -->
      ${history.length === 0 ? `
        <div class="py-6 text-center text-slate-500 text-xs">
          確定済みの試合履歴はまだありません。<br/>画面下部の「組み合わせを作成」ボタンを押してください。
        </div>
      ` : `
        <div class="space-y-2.5">
          ${history.map(game => `
            <div class="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full text-[10px]">
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

    <!-- 2. Middle Section: Next Game Setup & Option Summary -->
    <div class="glass-panel rounded-3xl p-5 text-center space-y-4 border border-slate-800/80 shadow-xl shrink-0">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Next Game</span>
        <span class="text-sm font-extrabold text-white bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700">
          第 ${gameNumber} ゲーム
        </span>
      </div>

      <!-- Current Rest Option Summary Box -->
      ${maxRestCount > 0 ? `
        <div class="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 text-xs space-y-2">
          <div class="flex items-center justify-between text-slate-300">
            <span class="font-semibold">休憩指定オプション:</span>
            <button id="btn-open-rest-option" class="text-amber-400 hover:underline font-bold flex items-center space-x-1">
              <span>設定変更</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>手動固定：<strong class="text-amber-300 font-bold">${manualCount > 0 ? manualRestPlayers.join('、') : 'なし'}</strong></span>
            <span>自動補充：<strong class="text-teal-300 font-bold">${autoCount > 0 ? `${autoCount}人` : 'なし'}</strong></span>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- 3. Bottom Actions: Create Match & Option buttons -->
    <div class="space-y-2.5 pt-2 border-t border-slate-800/60 shrink-0 pb-2">
      <button
        id="btn-create-match"
        class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
      >
        <span>第 ${gameNumber} ゲームの組み合わせを作成</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </button>

      ${maxRestCount > 0 ? `
        <button
          id="btn-option-secondary"
          class="w-full py-3 rounded-xl font-bold text-xs bg-slate-800/90 text-amber-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
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

  // Event Listeners
  const createBtn = container.querySelector('#btn-create-match');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const { restPlayers, manualRestPlayers, autoRestPlayers } = determineRestPlayers(playerCount, store.state.manualRestPlayers || []);

      const activePlayers = [];
      for (let p = 1; p <= playerCount; p++) {
        if (!restPlayers.includes(p)) {
          activePlayers.push(p);
        }
      }

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

  const viewStatsBtn = container.querySelector('#btn-view-stats');
  if (viewStatsBtn) viewStatsBtn.addEventListener('click', onGoHistory);

  const homeBtn = container.querySelector('#btn-home');
  if (homeBtn) homeBtn.addEventListener('click', onGoHome);

  const historyBtn = container.querySelector('#btn-history');
  if (historyBtn) historyBtn.addEventListener('click', onGoHistory);

  return container;
}
