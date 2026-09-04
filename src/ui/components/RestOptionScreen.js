/**
 * オプション画面：休憩者の選択・固定設定コンポーネント
 */
export function renderRestOptionScreen({ store, onSaveAndBack }) {
  const playerCount = store.state.playerCount;
  const maxRestCount = playerCount - 4; // 休憩上限

  // 現在保持されている手動休憩者のコピー
  const selectedManualRest = new Set(store.state.manualRestPlayers || []);

  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col justify-between p-6 animate-slide-up';

  const updateUI = () => {
    const manualCount = selectedManualRest.size;

    container.innerHTML = `
      <!-- Top Navigation Header -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button id="btn-cancel" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-sm font-semibold">戻る</span>
        </button>
        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Options</span>
          <h2 class="text-lg font-bold text-white">休憩者の選択（オプション）</h2>
        </div>
        <div class="w-10"></div> <!-- Spacer -->
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col justify-center space-y-6 my-auto py-6">
        <div class="text-center space-y-2">
          <p class="text-xs text-slate-300 bg-amber-950/40 border border-amber-800/50 p-3 rounded-2xl">
            💡 ここで選択したプレイヤーは毎ゲーム固定で休憩します。<br/>選択状態は次回以降も保持されます。
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
                  class="player-option-btn relative py-5 rounded-2xl font-extrabold text-2xl transition-all duration-200 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300'
                      : isDisabled
                      ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50'
                      : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border border-slate-700/60 active:scale-95'
                  }"
                >
                  <span>${player}</span>
                  ${isSelected ? `<span class="text-[10px] uppercase font-bold tracking-tight bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded-full mt-1">固定指定</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Status Box -->
          <div class="glass-panel rounded-2xl p-4 text-xs space-y-2">
            <div class="flex items-center justify-between text-slate-300">
              <span>固定休憩指定:</span>
              <span class="font-bold text-amber-400">${manualCount}人 ／ 最大${maxRestCount}人</span>
            </div>
            <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              ${manualCount < maxRestCount ? `※ 残り ${maxRestCount - manualCount} 名分はゲーム生成時に自動ランダム選出されます` : '※ 必要な休憩者が全員手動で固定されています'}
            </div>
          </div>
        ` : `
          <div class="glass-panel rounded-2xl p-6 text-center text-slate-400 text-sm">
            4人参加のため休憩者指定オプションはありません（全員出場）。
          </div>
        `}
      </div>

      <!-- Action Button -->
      <div class="pt-4 border-t border-slate-800/60">
        <button
          id="btn-save-option"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <span>設定を保存して戻る</span>
        </button>
      </div>
    `;

    // Event Listeners
    container.querySelectorAll('.player-option-btn').forEach(btn => {
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

    const saveBtn = container.querySelector('#btn-save-option');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const list = Array.from(selectedManualRest);
        store.setManualRestPlayers(list);
        onSaveAndBack();
      });
    }

    const cancelBtn = container.querySelector('#btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        onSaveAndBack();
      });
    }
  };

  updateUI();
  return container;
}
