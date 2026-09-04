/**
 * メインアプリケーションコントローラー
 */
import { AppStore } from './models/store.js';
import { renderStartScreen } from './ui/components/StartScreen.js';
import { renderMatchSetupScreen } from './ui/components/MatchSetupScreen.js';
import { renderRestOptionScreen } from './ui/components/RestOptionScreen.js';
import { renderHistoryScreen } from './ui/components/HistoryScreen.js';
import { createToastManager } from './ui/components/Toast.js';

export function initApp(rootElement) {
  const store = new AppStore();
  const toastManager = createToastManager(rootElement);

  // 以前のセッションデータのステップが古い場合の移行補正
  if (store.state.currentStep !== 'start' && store.state.currentStep !== 'rest_option' && store.state.currentStep !== 'history') {
    store.state.currentStep = 'main';
  }

  function render() {
    rootElement.innerHTML = '';
    const step = store.state.currentStep;

    let viewComponent = null;

    if (step === 'start') {
      viewComponent = renderStartScreen({
        store,
        onStart: (count, isResume) => {
          if (!isResume) {
            store.state.gameHistory = [];
            store.state.currentGame = null;
            store.state.manualRestPlayers = [];
          }
          store.setPlayerCount(count);
          render();
        }
      });
    } else if (step === 'main') {
      viewComponent = renderMatchSetupScreen({
        store,
        onConfirmMatch: () => {
          const gameNum = store.state.gameHistory.length + 1;
          store.confirmCurrentGame();
          toastManager.showToast(`第 ${gameNum} ゲームの組み合わせを確定しました`, 'success');
          render();
        },
        onGoRestOption: () => {
          store.setStep('rest_option');
          render();
        },
        onGoHistory: () => {
          store.setStep('history');
          render();
        },
        onGoHome: () => {
          store.setStep('start');
          render();
        }
      });
    } else if (step === 'rest_option') {
      viewComponent = renderRestOptionScreen({
        store,
        onSaveAndBack: () => {
          store.setStep('main');
          render();
        }
      });
    } else if (step === 'history') {
      viewComponent = renderHistoryScreen({
        store,
        onUndo: () => {
          const ok = store.undoLastGame();
          if (ok) {
            toastManager.showToast('直前の確定を取り消しました', 'amber');
            render();
          }
        },
        onReset: () => {
          store.resetAll();
          toastManager.showToast('初期状態にリセットしました', 'info');
          render();
        },
        onBack: () => {
          store.setStep('main');
          render();
        }
      });
    }

    if (viewComponent) {
      rootElement.appendChild(viewComponent);
    }
  }

  render();

  return {
    render,
    toastManager
  };
}
