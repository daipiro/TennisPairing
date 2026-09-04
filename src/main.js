/**
 * アプリケーションエントリーポイント & PWAサービスワーカー登録
 */
import { initApp } from './app.js';
import { registerSW } from 'virtual:pwa-register';

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('app');
  if (!rootEl) return;

  const appInstance = initApp(rootEl);

  // PWA Service Worker の自動更新登録
  const updateSW = registerSW({
    onNeedRefresh() {
      appInstance.toastManager.showUpdatePrompt(() => {
        updateSW(true);
      });
    },
    onOfflineReady() {
      console.log('App is ready for offline use.');
    }
  });
});
