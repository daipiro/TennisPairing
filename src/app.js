/**
 * メインアプリケーションコントローラー
 */
import { AppStore } from './models/store.js';
import { renderStartScreen } from './ui/components/StartScreen.js';
import { renderRestSelectionScreen } from './ui/components/RestSelectionScreen.js';
import { renderMatchConfirmScreen } from './ui/components/MatchConfirmScreen.js';
import { renderHistoryScreen } from './ui/components/HistoryScreen.js';
import { createToastManager } from './ui/components/Toast.js';

export function initApp(rootElement) {
  const store = new AppStore();
  const toastManager = createToastManager(rootElement);

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
          }
          store.setPlayerCount(count);
          render();
        }
      });
    } else if (step === 'rest_selection') {
      viewComponent = renderRestSelectionScreen({
        store,
        onCreateMatch: (currentGameData) => {
          store.setCurrentGame(currentGameData);
          store.setStep('match_confirm');
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
    } else if (step === 'match_confirm') {
      if (!store.state.currentGame) {
        store.setStep('rest_selection');
        render();
        return;
      }
      viewComponent = renderMatchConfirmScreen({
        store,
        onConfirm: () => {
          const gameNum = store.state.currentGame?.gameNumber || store.state.gameHistory.length + 1;
          store.confirmCurrentGame();
          toastManager.showToast(`第 ${gameNum} ゲームの組み合わせを確定しました`, 'success');
          render();
        },
        onReselectRest: () => {
          store.setStep('rest_selection');
          render();
        },
        onGoHistory: () => {
          store.setStep('history');
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
          // 直前の有効なステップへ
          if (store.state.currentGame) {
            store.setStep('match_confirm');
          } else {
            store.setStep('rest_selection');
          }
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
