/**
 * 9.1 開始画面コンポーネント
 */
export function renderStartScreen({ store, onStart }) {
  let selectedCount = store.state.playerCount || 6;
  const hasHistory = store.state.gameHistory.length > 0;

  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up';

  const updateUI = () => {
    container.innerHTML = `
      <div class="flex-1 flex flex-col justify-center items-center text-center space-y-8 my-auto">
        <!-- Header / Logo -->
        <div class="space-y-3">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2 tennis-ball-glow">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke-width="1.8"/>
              <path d="M5.636 5.636a9 9 0 0 1 12.728 0M5.636 18.364a9 9 0 0 0 12.728 0" stroke-width="1.8" stroke-dasharray="2 2"/>
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">テニス乱数表</h1>
          <p class="text-sm text-slate-400 max-w-xs mx-auto">
            1面コート・ダブルス専用<br/>休憩者ランダム指定 & 公平ペア生成
          </p>
        </div>

        <!-- Selection Panel -->
        <div class="w-full glass-panel rounded-3xl p-6 space-y-5 shadow-xl">
          <label class="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
            参加人数を選択してください
          </label>
          <div class="grid grid-cols-5 gap-2" id="count-buttons">
            ${[4, 5, 6, 7, 8].map(count => `
              <button
                data-count="${count}"
                class="count-btn py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  selectedCount === count
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 active:scale-95'
                }"
              >
                ${count}人
              </button>
            `).join('')}
          </div>
          <div class="text-xs text-slate-400 bg-slate-900/60 py-2.5 px-4 rounded-xl border border-slate-800">
            試合出場：<span class="text-emerald-400 font-bold">4人</span> ／ 休憩：<span class="text-amber-400 font-bold">${selectedCount - 4}人</span>
          </div>
        </div>
      </div>

      <!-- Action Button Footer -->
      <div class="w-full space-y-3 pt-4 border-t border-slate-800/60">
        <button
          id="btn-start"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <span>${hasHistory ? '新しくゲームを開始' : '開始する'}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>

        ${hasHistory ? `
          <button
            id="btn-resume"
            class="w-full py-3.5 rounded-2xl font-bold text-slate-300 bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/90 active:scale-[0.99] transition-all duration-150"
          >
            現在のゲームを継続 (${store.state.gameHistory.length}試合完了)
          </button>
        ` : ''}
      </div>
    `;

    // Event listeners
    container.querySelectorAll('.count-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const count = parseInt(e.currentTarget.dataset.count, 10);
        selectedCount = count;
        updateUI();
      });
    });

    const startBtn = container.querySelector('#btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        onStart(selectedCount, false);
      });
    }

    const resumeBtn = container.querySelector('#btn-resume');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        onStart(store.state.playerCount, true);
      });
    }
  };

  updateUI();
  return container;
}
