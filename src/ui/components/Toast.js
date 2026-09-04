/**
 * トースト通知 & PWA更新プロンプトコンポーネント
 */
export function createToastManager(containerEl) {
  let toastEl = null;

  return {
    showToast(message, type = 'info', duration = 3000) {
      if (toastEl) toastEl.remove();

      toastEl = document.createElement('div');
      toastEl.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl font-semibold text-sm shadow-2xl backdrop-blur-md border animate-slide-up flex items-center space-x-2 ${
        type === 'success'
          ? 'bg-emerald-900/90 text-emerald-200 border-emerald-500/50'
          : type === 'amber'
          ? 'bg-amber-900/90 text-amber-200 border-amber-500/50'
          : 'bg-slate-800/90 text-slate-100 border-slate-700'
      }`;

      toastEl.innerHTML = `
        <span>${message}</span>
      `;

      containerEl.appendChild(toastEl);

      setTimeout(() => {
        if (toastEl) {
          toastEl.classList.add('opacity-0', 'transition-opacity', 'duration-300');
          setTimeout(() => toastEl?.remove(), 300);
        }
      }, duration);
    },

    showUpdatePrompt(onUpdate) {
      const updateEl = document.createElement('div');
      updateEl.className = 'fixed top-4 inset-x-4 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl flex items-center justify-between animate-slide-up';
      updateEl.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-xs font-bold text-slate-100">新しいバージョンがあります</span>
        </div>
        <button id="btn-pwa-update" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-emerald-400">
          更新する
        </button>
      `;

      containerEl.appendChild(updateEl);

      updateEl.querySelector('#btn-pwa-update').addEventListener('click', () => {
        updateEl.remove();
        onUpdate();
      });
    }
  };
}
