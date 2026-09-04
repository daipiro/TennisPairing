/**
 * 9.4 履歴・参加状況画面コンポーネント
 */
export function renderHistoryScreen({ store, onUndo, onReset, onBack }) {
  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up';

  const history = store.state.gameHistory || [];
  const stats = store.getStats();
  const playerCount = store.state.playerCount;

  const updateUI = () => {
    container.innerHTML = `
      <!-- Navigation Bar -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button id="btn-back" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-sm font-semibold">戻る</span>
        </button>

        <h2 class="text-xl font-bold text-white">履歴・参加状況</h2>

        <div class="w-10"></div> <!-- Spacer -->
      </div>

      <!-- Main Scrollable Area -->
      <div class="flex-1 overflow-y-auto space-y-6 py-4 no-scrollbar">
        <!-- Stats Summary Section -->
        <div class="glass-panel rounded-3xl p-5 space-y-4 shadow-lg border border-slate-800/80">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 class="font-extrabold text-sm text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>参加状況 (${playerCount}人)</span>
            </h3>
            <span class="text-xs text-slate-400">累計 ${history.length} 試合</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${Array.from({ length: playerCount }, (_, i) => i + 1).map(p => {
      const stat = stats[p] || { playCount: 0, restCount: 0 };
      return `
                <div class="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                      ${p}
                    </span>
                  </div>
                  <div class="text-right text-xs">
                    <span class="text-slate-200 font-bold">出場 ${stat.playCount}回</span>
                    <span class="text-slate-500 mx-1">/</span>
                    <span class="text-amber-400 font-medium">休憩 ${stat.restCount}回</span>
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>

        <!-- History Match List Section -->
        <div class="space-y-3">
          <h3 class="font-extrabold text-sm text-slate-300 uppercase tracking-wider px-1">
            対戦履歴
          </h3>

          ${history.length === 0 ? `
            <div class="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
              確定済みの試合データがまだありません。
            </div>
          ` : `
            <div class="space-y-3">
              ${[...history].reverse().map(game => `
                <div class="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                      第 ${game.gameNumber} ゲーム
                    </span>
                  </div>

                  <!-- Teams Match Display -->
                  <div class="flex items-center justify-around py-2 text-base font-black text-white">
                    <div class="text-emerald-300">
                      ${game.team1[0]} ・ ${game.team1[1]}
                    </div>
                    <div class="text-xs font-black text-slate-500 px-2">VS</div>
                    <div class="text-teal-300">
                      ${game.team2[0]} ・ ${game.team2[1]}
                    </div>
                  </div>

                  <!-- Rest info -->
                  <div class="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span>休憩：<strong class="text-amber-400 font-bold">${game.restPlayers && game.restPlayers.length > 0 ? game.restPlayers.join('、') : 'なし'}</strong></span>
                    ${game.manuallySelectedRestPlayers && game.manuallySelectedRestPlayers.length > 0 ? `
                      <span class="text-[10px] text-slate-500">手動指定: ${game.manuallySelectedRestPlayers.join('、')}</span>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Action Footer -->
      <div class="space-y-2 pt-3 border-t border-slate-800/60">
        ${history.length > 0 ? `
          <button
            id="btn-undo"
            class="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${history.length}ゲーム)</span>
          </button>
        ` : ''}

        <button
          id="btn-reset"
          class="w-full py-3 rounded-2xl font-semibold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all"
        >
          最初からやり直す (データ全リセット)
        </button>
      </div>
    `;

    // Confirm dialog helper
    const backBtn = container.querySelector('#btn-back');
    if (backBtn) backBtn.addEventListener('click', onBack);

    const undoBtn = container.querySelector('#btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (confirm(`最新の第 ${history.length} ゲームの確定を取り消して巻き戻しますか？`)) {
          onUndo();
        }
      });
    }

    const resetBtn = container.querySelector('#btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('すべての対戦履歴と進行状況をリセットして、最初からやり直しますか？')) {
          onReset();
        }
      });
    }
  };

  updateUI();
  return container;
}
