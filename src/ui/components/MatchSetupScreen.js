/**
 * メイン画面コンポーネント (1画面完結型)
 * - 上部：時系列対戦履歴（第1ゲームが一番上、下に追加される）
 * - 中央上部：休憩者の手動選択・固定設定（組み合わせの上にインライン表示）
 * - 中央〜下部：作成・生成された対戦組み合わせ（プレイヤーを横一列表示）、交代操作、再抽選（手動固定以外を再選出）
 * - 最下部：アイコンのみの横並びアクションボタン (取り消し → 再抽選 → 確定)
 */
import { makeCardKey, calculateConsecutivePlaysWithCurrent, calculateConsecutiveRestsWithCurrent } from '../../models/algorithm.js';

export function renderMatchSetupScreen({ store, onConfirmMatch, onUndoMatch, onGoHistory, onGoHome, onGoMaxConsecutive }) {
  const playerCount = store.state.playerCount;
  const history = store.state.gameHistory || [];
  const maxRestCount = playerCount - 4;

  let selectedPlayersForSwap = []; // 手動入れ替え用に選択されたスロット

  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col h-full overflow-hidden animate-slide-up relative';

  const updateUI = () => {
    const manualRestPlayers = store.state.manualRestPlayers || [];
    const manualCount = manualRestPlayers.length;

    let currentGame = store.state.currentGame;
    if (!currentGame) {
      currentGame = store.generateNextCurrentGame();
    } else {
      currentGame = { ...currentGame };
    }

    const { gameNumber, team1, team2, restPlayers, manualRestPlayers: gameManualRest, autoRestPlayers: gameAutoRest } = currentGame;

    const manualStr = (gameManualRest && gameManualRest.length > 0) ? gameManualRest.join('、') : 'なし';
    const autoStr = (gameAutoRest && gameAutoRest.length > 0) ? gameAutoRest.join('、') : 'なし';

    container.innerHTML = `
      <!-- Scrollable Main Content -->
      <div id="main-scroll-content" class="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        <!-- Top Navigation Header -->
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

        <!-- 1. Top Section: Chronological Match History (Game 1 at Top -> Newest at Bottom) -->
        ${history.length > 0 ? `
          <div class="space-y-3 shrink-0">
            ${history.map((game, gameIdx) => `
              <div class="court-card rounded-3xl p-4 border shadow-2xl space-y-2.5">
                <!-- Horizontal Players Row: [ Game Badge ]  [ Team A (2) ]  VS  [ Team B (2) ] -->
                <div class="flex items-start justify-between py-1 px-1">
                  <!-- Game Number Badge -->
                  <div class="flex items-start shrink-0 min-w-[54px] pt-0.5">
                    <span class="bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 text-xs font-black px-2 py-1.5 rounded-xl shadow-inner whitespace-nowrap">
                      第${game.gameNumber}G
                    </span>
                  </div>

                  <!-- Team A Players -->
                  <div class="flex space-x-2.5 items-start">
                    ${renderHistoryDisplayPlayerCard(game.team1[0], gameIdx)}
                    ${renderHistoryDisplayPlayerCard(game.team1[1], gameIdx)}
                  </div>

                  <!-- VS Badge -->
                  <div class="px-1 flex flex-col items-center justify-center pt-4">
                    <span class="bg-slate-900/90 text-amber-400 text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full border border-amber-500/40 shadow-inner">
                      VS
                    </span>
                  </div>

                  <!-- Team B Players -->
                  <div class="flex space-x-2.5 items-start">
                    ${renderHistoryDisplayPlayerCard(game.team2[0], gameIdx)}
                    ${renderHistoryDisplayPlayerCard(game.team2[1], gameIdx)}
                  </div>
                </div>

                <!-- Bottom Row: Rest Players inside Court Container -->
                ${game.restPlayers && game.restPlayers.length > 0 ? `
                  <div class="pt-2 border-t border-slate-800/80 flex items-start px-1">
                    <!-- 左側スペーサー (第〇Gバッジの幅に揃える) -->
                    <div class="shrink-0 min-w-[54px]"></div>
                    <!-- 休憩選手カード -->
                    <div class="flex items-start space-x-2.5">
                      ${game.restPlayers.map(r => renderHistoryDisplayRestCard(r, gameIdx)).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 2. Middle Section: Current Generated Match (Players aligned HORIZONTALLY in one row) -->
        <div class="shrink-0">
          <!-- Horizontal Court Container -->
          <div class="court-card rounded-3xl p-4 border shadow-2xl space-y-2.5">
            <!-- Horizontal Players Row: [ Game Badge ]  [ Team A (2) ]  VS  [ Team B (2) ] -->
            <div class="flex items-start justify-between py-1 px-1">
              <!-- Game Number Badge (出場ナンバーカードの上位置に揃える) -->
              <div class="flex items-start shrink-0 min-w-[54px] pt-0.5">
                <span class="bg-emerald-950/90 border border-emerald-600/60 text-emerald-400 text-xs font-black px-2 py-1.5 rounded-xl shadow-inner whitespace-nowrap">
                  第${gameNumber}G
                </span>
              </div>

              <!-- Team A Players -->
              <div class="flex space-x-2.5 items-start">
                ${renderPlayerCard(team1[0], 't1-0')}
                ${renderPlayerCard(team1[1], 't1-1')}
              </div>

              <!-- VS Badge -->
              <div class="px-1 flex flex-col items-center justify-center pt-4">
                <span class="bg-slate-900/90 text-amber-400 text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full border border-amber-500/40 shadow-inner">
                  VS
                </span>
              </div>

              <!-- Team B Players -->
              <div class="flex space-x-2.5 items-start">
                ${renderPlayerCard(team2[0], 't2-0')}
                ${renderPlayerCard(team2[1], 't2-1')}
              </div>
            </div>

            <!-- Bottom Row: Rest Players inside Court Container (Team Aの左端カードと位置揃え) -->
            ${restPlayers && restPlayers.length > 0 ? `
              <div class="pt-2 border-t border-slate-800/80 flex items-start px-1">
                <!-- 左側スペーサー (第〇Gバッジの幅に揃える) -->
                <div class="shrink-0 min-w-[54px]"></div>
                <!-- 休憩選手カード -->
                <div class="flex items-start space-x-2.5">
                  ${restPlayers.map((playerNum, idx) => renderRestPlayerCard(playerNum, `rest-${idx}`)).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- 3. Middle Bottom Section: Inline Rest Player Selection / Manual Options -->
        ${maxRestCount > 0 ? `
          <div class="glass-panel rounded-3xl p-5 border border-slate-800/80 shadow-lg space-y-3 shrink-0">
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 class="font-extrabold text-xs text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <span>休憩者を選択</span>
              </h3>
              <div class="flex items-center space-x-2">
                <span class="text-[11px] font-bold text-amber-400">
                  手動: ${manualCount}人 / 最大${maxRestCount}人
                </span>
                <button id="btn-max-consecutive" class="px-2 py-0.5 rounded-lg text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900 transition-colors flex items-center space-x-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  </svg>
                  <span>連続制限設定</span>
                </button>
              </div>
            </div>

            <!-- Rest Player Option Buttons (Inline 1~N, strictly 1 row) -->
            <div class="grid gap-1.5 pt-1 w-full" style="grid-template-columns: repeat(${playerCount}, minmax(0, 1fr));">
              ${Array.from({ length: playerCount }, (_, i) => i + 1).map(p => {
            const isSelected = manualRestPlayers.includes(p);
            const isDisabled = !isSelected && manualCount >= maxRestCount;
            const isLarge = playerCount >= 7;
            const isXLarge = playerCount >= 9;

            return `
                  <button
                    data-manual-rest="${p}"
                    ${isDisabled ? 'disabled' : ''}
                    class="manual-rest-toggle-btn ${isXLarge ? 'py-1.5 px-0.5 text-xs' : isLarge ? 'py-2 px-1 text-sm' : 'py-2.5 px-1 text-base'} rounded-xl font-black transition-all duration-150 flex flex-col items-center justify-center min-w-0 ${isSelected
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-300'
                : isDisabled
                  ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50'
                  : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700/60 active:scale-95'
              }"
                  >
                    <span class="leading-none">${p}</span>
                    ${isSelected ? `<span class="${isLarge ? 'text-[7px]' : 'text-[9px]'} font-extrabold text-amber-950 leading-tight">固定</span>` : ''}
                  </button>
                `;
          }).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- 4. Fixed Bottom Action Bar: Undo -> Reroll -> Confirm -->
      <div class="shrink-0 p-4 pt-3 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-lg z-20">
        <div class="grid grid-cols-3 gap-3">
          <!-- 1. 取り消し (Undo) -->
          <button
            id="btn-undo-main"
            ${history.length === 0 ? 'disabled' : ''}
            title="直前の確定を取り消す"
            aria-label="直前の確定を取り消す"
            class="py-3.5 rounded-2xl font-extrabold text-base flex items-center justify-center transition-all duration-150 ${history.length > 0
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 active:scale-95 shadow-md shadow-amber-500/10'
        : 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50'
      }"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
          </button>

          <!-- 2. 再抽選/更新 (Reroll) -->
          <button
            id="btn-reroll-bottom"
            title="組み合わせを更新 (再抽選)"
            aria-label="組み合わせを更新 (再抽選)"
            class="py-3.5 rounded-2xl font-extrabold text-base bg-slate-800/90 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center shadow-md shadow-emerald-500/10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>

          <!-- 3. 確定 (Confirm) -->
          <button
            id="btn-confirm-match"
            title="この組み合わせで確定"
            aria-label="この組み合わせで確定"
            class="py-3.5 rounded-2xl font-extrabold text-base bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all duration-150 flex items-center justify-center"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // 履歴内出場選手カード（枠色あり、連続出場回数文字バッジなし）
    function renderHistoryDisplayPlayerCard(playerNum, gameIdx) {
      const consecutivePlays = getHistoryConsecutivePlays(playerNum, gameIdx);

      let borderStyle = 'bg-slate-800/90 text-white border border-slate-600/50';
      if (consecutivePlays === 2) {
        borderStyle = 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/40';
      } else if (consecutivePlays === 3) {
        borderStyle = 'bg-blue-950/80 border-2 border-blue-400 text-blue-200 ring-1 ring-blue-400/40';
      } else if (consecutivePlays >= 4) {
        borderStyle = 'bg-rose-950/80 border-2 border-rose-500 text-rose-200 ring-1 ring-rose-500/40';
      }

      return `
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center shadow-md ${borderStyle}">
            ${playerNum}
          </div>
        </div>
      `;
    }

    // 履歴内休憩選手カード（枠色あり、連続休憩回数文字バッジなし）
    function renderHistoryDisplayRestCard(playerNum, gameIdx) {
      const consecutiveRests = getHistoryConsecutiveRests(playerNum, gameIdx);

      let borderStyle = 'bg-slate-800/90 text-amber-300 border border-amber-500/30';
      if (consecutiveRests >= 2) {
        borderStyle = 'bg-amber-950/80 text-amber-300 border-2 border-amber-400 ring-1 ring-amber-400/40';
      }

      return `
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 rounded-2xl font-black text-xl flex items-center justify-center shadow-md ${borderStyle}">
            ${playerNum}
          </div>
        </div>
      `;
    }

    // 履歴内プレイヤーナンバーバッジレンダリング
    function renderHistoryPlayerBadge(playerNum, isRest = false, consecutiveCount = 1) {
      if (isRest) {
        let restStyle = 'bg-amber-950/90 border border-amber-500/60 text-amber-300';
        if (consecutiveCount >= 2) {
          restStyle = 'bg-amber-950 border-2 border-amber-400 text-amber-300 ring-1 ring-amber-400/40 shadow-sm';
        }
        return `<span class="inline-flex items-center justify-center min-w-[22px] h-5 px-1 rounded-md font-extrabold text-[11px] ${restStyle}">${playerNum}</span>`;
      }

      let badgeStyle = 'bg-slate-800 border border-slate-600/80 text-emerald-300';
      if (consecutiveCount === 2) {
        badgeStyle = 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm';
      } else if (consecutiveCount === 3) {
        badgeStyle = 'bg-blue-950 border-2 border-blue-400 text-blue-300 ring-1 ring-blue-400/40 shadow-sm';
      } else if (consecutiveCount >= 4) {
        badgeStyle = 'bg-rose-950 border-2 border-rose-500 text-rose-300 ring-1 ring-rose-500/40 shadow-sm';
      }

      return `<span class="inline-flex items-center justify-center min-w-[22px] h-5 px-1 rounded-md font-extrabold text-[11px] ${badgeStyle}">${playerNum}</span>`;
    }

    // 履歴内ゲームインデックス時点での連続出場数を計算
    function getHistoryConsecutivePlays(playerNum, gameIdx) {
      let count = 0;
      for (let i = gameIdx; i >= 0; i--) {
        const g = history[i];
        if (g && (g.team1.includes(playerNum) || g.team2.includes(playerNum))) {
          count++;
        } else {
          break;
        }
      }
      return count;
    }

    // 履歴内ゲームインデックス時点での連続休憩数を計算
    function getHistoryConsecutiveRests(playerNum, gameIdx) {
      let count = 0;
      for (let i = gameIdx; i >= 0; i--) {
        const g = history[i];
        if (g && g.restPlayers && g.restPlayers.includes(playerNum)) {
          count++;
        } else {
          break;
        }
      }
      return count;
    }

    // 出場選手カード（横一列用）
    function renderPlayerCard(playerNum, slotId) {
      const isSelected = selectedPlayersForSwap.includes(slotId);
      const consecutivePlays = calculateConsecutivePlaysWithCurrent(playerNum, history, currentGame);

      let borderStyle = 'bg-slate-800/90 text-white border border-slate-600/50 hover:bg-slate-700 active:scale-95';
      if (consecutivePlays === 2) {
        borderStyle = 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/40 hover:bg-emerald-900 active:scale-95';
      } else if (consecutivePlays === 3) {
        borderStyle = 'bg-blue-950/80 border-2 border-blue-400 text-blue-200 ring-1 ring-blue-400/40 hover:bg-blue-900 active:scale-95';
      } else if (consecutivePlays >= 4) {
        borderStyle = 'bg-rose-950/80 border-2 border-rose-500 text-rose-200 ring-1 ring-rose-500/40 hover:bg-rose-900 active:scale-95';
      }

      const cardStyle = isSelected
        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce'
        : borderStyle;

      return `
        <div class="flex flex-col items-center space-y-1">
          <button
            data-slot="${slotId}"
            class="player-slot w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${cardStyle}"
          >
            ${playerNum}
          </button>
          ${consecutivePlays >= 2 ? `
            <div class="h-6 flex items-center justify-center">
              <span class="text-xs font-black text-emerald-300 bg-emerald-950 border border-emerald-500/60 px-2 py-0.5 rounded-full shadow-sm flex items-center justify-center leading-none">
                <span class="text-sm font-extrabold mr-0.5">${consecutivePlays}</span>連
              </span>
            </div>
          ` : ''}
        </div>
      `;
    }

    // 休憩選手カード
    function renderRestPlayerCard(playerNum, slotId) {
      const isSelected = selectedPlayersForSwap.includes(slotId);
      const consecutiveRests = calculateConsecutiveRestsWithCurrent(playerNum, history, currentGame);

      let borderStyle = 'bg-slate-800/90 text-amber-300 border border-amber-500/30 hover:bg-slate-700/90 active:scale-95';
      if (consecutiveRests >= 2) {
        borderStyle = 'bg-amber-950/80 text-amber-300 border-2 border-amber-400 ring-1 ring-amber-400/40 hover:bg-amber-900/90 active:scale-95';
      }

      const cardStyle = isSelected
        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-105 animate-pulse'
        : borderStyle;

      return `
        <div class="flex flex-col items-center space-y-1">
          <button
            data-slot="${slotId}"
            class="player-slot w-12 h-12 rounded-2xl font-black text-xl flex items-center justify-center transition-all duration-200 shadow-md ${cardStyle}"
          >
            ${playerNum}
          </button>
          ${consecutiveRests >= 2 ? `
            <div class="h-6 flex items-center justify-center">
              <span class="text-xs font-black text-amber-300 bg-amber-950 border border-amber-500/60 px-2 py-0.5 rounded-full shadow-sm flex items-center justify-center leading-none">
                <span class="text-sm font-extrabold mr-0.5">${consecutiveRests}</span>連
              </span>
            </div>
          ` : ''}
        </div>
      `;
    }

    // インライン手動休憩トグルボタンのイベントリスナー
    container.querySelectorAll('.manual-rest-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const playerNum = parseInt(e.currentTarget.dataset.manualRest, 10);
        store.toggleManualRestPlayer(playerNum);
        updateUI();
      });
    });

    // 選手タップ（入れ替え）のイベントリスナー
    container.querySelectorAll('.player-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = e.currentTarget.dataset.slot;

        if (selectedPlayersForSwap.includes(slot)) {
          selectedPlayersForSwap = selectedPlayersForSwap.filter(s => s !== slot);
        } else {
          selectedPlayersForSwap.push(slot);
          if (selectedPlayersForSwap.length === 2) {
            swapPlayers(selectedPlayersForSwap[0], selectedPlayersForSwap[1]);
            selectedPlayersForSwap = [];
          }
        }
        updateUI();
      });
    });

    function swapPlayers(slotA, slotB) {
      const getVal = (slot) => {
        if (slot === 't1-0') return currentGame.team1[0];
        if (slot === 't1-1') return currentGame.team1[1];
        if (slot === 't2-0') return currentGame.team2[0];
        if (slot === 't2-1') return currentGame.team2[1];
        if (slot.startsWith('rest-')) {
          const idx = parseInt(slot.replace('rest-', ''), 10);
          return currentGame.restPlayers[idx];
        }
      };

      const setVal = (slot, val) => {
        if (slot === 't1-0') currentGame.team1[0] = val;
        else if (slot === 't1-1') currentGame.team1[1] = val;
        else if (slot === 't2-0') currentGame.team2[0] = val;
        else if (slot === 't2-1') currentGame.team2[1] = val;
        else if (slot.startsWith('rest-')) {
          const idx = parseInt(slot.replace('rest-', ''), 10);
          currentGame.restPlayers[idx] = val;
          currentGame.restPlayers.sort((a, b) => a - b);
        }
      };

      const valA = getVal(slotA);
      const valB = getVal(slotB);

      setVal(slotA, valB);
      setVal(slotB, valA);

      currentGame.lastDisplayedKey = makeCardKey(currentGame.team1, currentGame.team2);
      store.setCurrentGame(currentGame);
    }

    const scrollToBottom = (smooth = true) => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const scrollEl = container.querySelector('#main-scroll-content');
          if (scrollEl) {
            scrollEl.scrollTo({
              top: scrollEl.scrollHeight,
              behavior: smooth ? 'smooth' : 'auto'
            });
          }
        }, 30);
      });
    };

    // 再抽選ボタン
    const triggerReroll = () => {
      store.rerollCurrentGame();
      selectedPlayersForSwap = [];
      updateUI();
      scrollToBottom();
    };

    const rerollBottomBtn = container.querySelector('#btn-reroll-bottom');
    if (rerollBottomBtn) rerollBottomBtn.addEventListener('click', triggerReroll);

    const confirmMatchBtn = container.querySelector('#btn-confirm-match');
    if (confirmMatchBtn) {
      confirmMatchBtn.addEventListener('click', () => {
        store.setCurrentGame(currentGame);
        onConfirmMatch();
        scrollToBottom();
      });
    }

    const undoMainBtn = container.querySelector('#btn-undo-main');
    if (undoMainBtn && history.length > 0) {
      undoMainBtn.addEventListener('click', () => {
        onUndoMatch();
        scrollToBottom();
      });
    }

    const viewStatsBtn = container.querySelector('#btn-view-stats');
    if (viewStatsBtn) viewStatsBtn.addEventListener('click', onGoHistory);

    const homeBtn = container.querySelector('#btn-home');
    if (homeBtn) homeBtn.addEventListener('click', onGoHome);

    const maxConsecutiveBtn = container.querySelector('#btn-max-consecutive');
    if (maxConsecutiveBtn) maxConsecutiveBtn.addEventListener('click', onGoMaxConsecutive);

    const historyBtn = container.querySelector('#btn-history');
    if (historyBtn) historyBtn.addEventListener('click', onGoHistory);
  };

  updateUI();
  
  // UI構築完了後に最下部へオートスクロール
  requestAnimationFrame(() => {
    setTimeout(() => {
      const scrollEl = container.querySelector('#main-scroll-content');
      if (scrollEl) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    }, 50);
  });

  return container;
}
