/**
 * プレイヤー毎の最大連続出場回数設定画面コンポーネント
 */
import { calculateConsecutivePlays } from '../../models/algorithm.js';

export function renderMaxConsecutivePlaysScreen({ store, onBack }) {
  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up overflow-y-auto no-scrollbar space-y-6';

  const playerCount = store.state.playerCount;
  const history = store.state.gameHistory || [];

  const updateUI = () => {
    const map = store.state.maxConsecutivePlaysMap || {};

    container.innerHTML = `
      <!-- Navigation Bar -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4 shrink-0">
        <button id="btn-back" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-sm font-semibold">戻る</span>
        </button>

        <h2 class="text-lg font-bold text-white">最大連続出場回数の設定</h2>

        <div class="w-10"></div> <!-- Spacer -->
      </div>

      <!-- Description Banner -->
      <div class="glass-panel rounded-2xl p-4 text-xs space-y-1.5 border border-slate-800/80 shrink-0">
        <div class="flex items-center space-x-2 text-emerald-400 font-bold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>設定のルール</span>
        </div>
        <p class="text-slate-300 leading-relaxed">
          プレイヤーごとに連続出場の最大制限回数を設定できます。設定された回数に達したプレイヤーは、自動的に「固定保持（休憩）」となり次の試合で休憩に割り当てられます（休憩後は自動解除されます）。
        </p>
      </div>

      <!-- Player Options List -->
      <div class="flex-1 space-y-3">
        ${Array.from({ length: playerCount }, (_, i) => i + 1).map(p => {
          const currentLimit = map[p] || 0;
          const currentConsecutive = calculateConsecutivePlays(p, history);
          const isAtLimit = currentLimit > 0 && currentConsecutive >= currentLimit;

          return `
            <div class="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <span class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-base flex items-center justify-center border border-emerald-500/30">
                    ${p}
                  </span>
                  <div>
                    <span class="text-sm font-extrabold text-white">プレイヤー ${p}</span>
                    <span class="text-xs text-slate-400 block">現在: ${currentConsecutive} 試合連続出場中</span>
                  </div>
                </div>
                ${isAtLimit ? `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    上限到達 (次回休憩固定)
                  </span>
                ` : ''}
              </div>

              <!-- Options Selection Row -->
              <div class="grid grid-cols-5 gap-1.5 pt-1">
                ${[
                  { val: 0, label: '未設定' },
                  { val: 1, label: '1連' },
                  { val: 2, label: '2連' },
                  { val: 3, label: '3連' },
                  { val: 4, label: '4連' }
                ].map(opt => {
                  const isChecked = currentLimit === opt.val;
                  return `
                    <button
                      data-player="${p}"
                      data-limit="${opt.val}"
                      class="limit-option-btn py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-300 scale-[1.02]'
                          : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700/60 active:scale-95'
                      }"
                    >
                      ${opt.label}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Action Footer -->
      <div class="pt-3 border-t border-slate-800/60 shrink-0">
        <button
          id="btn-done"
          class="w-full py-3.5 rounded-2xl font-extrabold text-base bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>設定完了して戻る</span>
        </button>
      </div>
    `;

    // Event listeners
    container.querySelector('#btn-back')?.addEventListener('click', onBack);
    container.querySelector('#btn-done')?.addEventListener('click', onBack);

    container.querySelectorAll('.limit-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const playerNum = Number(e.currentTarget.dataset.player);
        const limitVal = Number(e.currentTarget.dataset.limit);
        store.setMaxConsecutivePlays(playerNum, limitVal);
        updateUI();
      });
    });
  };

  updateUI();
  return container;
}
