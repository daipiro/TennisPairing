(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&t(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();function V(d){const[e,n,t,s]=d;return[{team1:[e,n],team2:[t,s]},{team1:[e,t],team2:[n,s]},{team1:[e,s],team2:[n,t]}].map(c=>{const a=[...c.team1].sort((r,p)=>r-p),m=[...c.team2].sort((r,p)=>r-p),[l,o]=[a,m].sort((r,p)=>r[0]-p[0]||r[1]-p[1]),u=`${l[0]}-${l[1]}_vs_${o[0]}-${o[1]}`;return{team1:c.team1,team2:c.team2,key:u}})}function g(d,e){return d<e?`${d}-${e}`:`${e}-${d}`}function L(d,e){const n=[...d].sort((c,a)=>c-a),t=[...e].sort((c,a)=>c-a),[s,i]=[n,t].sort((c,a)=>c[0]-a[0]||c[1]-a[1]);return`${s[0]}-${s[1]}_vs_${i[0]}-${i[1]}`}function W(d){const e={},n={},t={},s=(a,m)=>{const l=g(a,m);return e[l]||0},i=(a,m)=>{const l=g(a,m);return n[l]||0},c=a=>t[a]||0;for(const a of d){const{team1:m,team2:l}=a,o=g(m[0],m[1]),u=g(l[0],l[1]);e[o]=(e[o]||0)+1,e[u]=(e[u]||0)+1;for(const p of m)for(const b of l){const w=g(p,b);n[w]=(n[w]||0)+1}const r=L(m,l);t[r]=(t[r]||0)+1}return{pairCounts:e,opponentCounts:n,cardCounts:t,getPair:s,getOpponent:i,getCard:c}}function F(d,e,n=null){const{team1:t,team2:s,key:i}=d,{getPair:c,getOpponent:a,getCard:m}=W(e),l=c(t[0],t[1])+c(s[0],s[1]),o=a(t[0],s[0])+a(t[0],s[1])+a(t[1],s[0])+a(t[1],s[1]),u=m(i);let r=0,p=!1;if(e.length>0){const h=e[e.length-1],k=g(h.team1[0],h.team1[1]),S=g(h.team2[0],h.team2[1]),C=g(t[0],t[1]),P=g(s[0],s[1]);(C===k||C===S)&&r++,(P===k||P===S)&&r++;const R=L(h.team1,h.team2);i===R&&(p=!0)}const b=n&&i===n;return{score:l*100+o*10+u*30+r*300+(p?500:0)+(b?200:0),breakdown:{pairRepetition:l,oppRepetition:o,sameCardCount:u,lastGameSamePairCount:r,lastGameSameCard:p,isSameAsLastDisplayed:b}}}function J(d,e=[]){const n=d-4;if(n<=0)return{restPlayers:[],manualRestPlayers:[],autoRestPlayers:[]};const t=new Set(e.filter(l=>l>=1&&l<=d)),s=n-t.size;if(s<=0){const l=Array.from(t).sort((o,u)=>o-u);return{restPlayers:l,manualRestPlayers:l,autoRestPlayers:[]}}const i=[];for(let l=1;l<=d;l++)t.has(l)||i.push(l);const c=[...i];for(let l=c.length-1;l>0;l--){const o=Math.floor(Math.random()*(l+1));[c[l],c[o]]=[c[o],c[l]]}const a=c.slice(0,s).sort((l,o)=>l-o);return{restPlayers:[...Array.from(t),...a].sort((l,o)=>l-o),manualRestPlayers:Array.from(t).sort((l,o)=>l-o),autoRestPlayers:a}}function O(d,e,n=null){const s=V(d).map(l=>{const{score:o,breakdown:u}=F(l,e,n);return{...l,score:o,breakdown:u}}),c=Math.min(...s.map(l=>l.score))+20,a=s.filter(l=>l.score<=c),m=Math.floor(Math.random()*a.length);return a[m]}const U="tennis_pairing_app_state_v1";class Y{constructor(){this.state=this.loadState(),this.state.currentStep!=="start"&&!this.state.currentGame&&this.generateNextCurrentGame()}getDefaultState(){return{playerCount:6,currentStep:"start",gameHistory:[],manualRestPlayers:[],currentGame:null}}loadState(){try{const e=localStorage.getItem(U);if(e){const n=JSON.parse(e);return n.manualRestPlayers||(n.manualRestPlayers=[]),(n.currentStep==="match_setup"||n.currentStep==="match_confirm")&&(n.currentStep="main"),n}}catch(e){console.error("Failed to load state from localStorage:",e)}return this.getDefaultState()}saveState(){try{localStorage.setItem(U,JSON.stringify(this.state))}catch(e){console.error("Failed to save state to localStorage:",e)}}setPlayerCount(e){this.state.playerCount=e;const n=e-4;this.state.manualRestPlayers=(this.state.manualRestPlayers||[]).filter(t=>t<=e).slice(0,Math.max(0,n)),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}generateNextCurrentGame(){const e=this.state.playerCount,n=this.state.gameHistory.length+1,{restPlayers:t,manualRestPlayers:s,autoRestPlayers:i}=J(e,this.state.manualRestPlayers||[]),c=[];for(let m=1;m<=e;m++)t.includes(m)||c.push(m);const a=O(c,this.state.gameHistory);return this.state.currentGame={gameNumber:n,restPlayers:t,manualRestPlayers:s,autoRestPlayers:i,team1:a.team1,team2:a.team2,lastDisplayedKey:a.key},this.saveState(),this.state.currentGame}setManualRestPlayers(e){this.state.manualRestPlayers=[...e].sort((n,t)=>n-t),this.generateNextCurrentGame(),this.saveState()}setStep(e){this.state.currentStep=e,this.saveState()}setCurrentGame(e){this.state.currentGame=e,this.saveState()}confirmCurrentGame(){if(!this.state.currentGame)return;const n={gameNumber:this.state.gameHistory.length+1,team1:[...this.state.currentGame.team1],team2:[...this.state.currentGame.team2],restPlayers:[...this.state.currentGame.restPlayers],manuallySelectedRestPlayers:[...this.state.currentGame.manualRestPlayers||[]]};this.state.gameHistory.push(n),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}undoLastGame(){if(this.state.gameHistory.length===0)return!1;const e=this.state.gameHistory.pop(),n=e.manuallySelectedRestPlayers||[],t=e.restPlayers||[],s=t.filter(i=>!n.includes(i));return this.state.currentGame={gameNumber:e.gameNumber,team1:e.team1,team2:e.team2,restPlayers:t,manualRestPlayers:n,autoRestPlayers:s,lastDisplayedKey:null},this.state.currentStep="main",this.saveState(),!0}resetAll(){this.state=this.getDefaultState(),this.saveState()}getStats(){const e={},n=this.state.playerCount;for(let t=1;t<=n;t++)e[t]={player:t,playCount:0,restCount:0};for(const t of this.state.gameHistory){const s=[...t.team1,...t.team2];for(const i of s)e[i]&&e[i].playCount++;for(const i of t.restPlayers)e[i]&&e[i].restCount++}return e}}function Q({store:d,onStart:e}){let n=d.state.playerCount||6;const t=d.state.gameHistory.length>0,s=document.createElement("div");s.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const i=()=>{s.innerHTML=`
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
            ${[4,5,6,7,8].map(m=>`
              <button
                data-count="${m}"
                class="count-btn py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${n===m?"bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300":"bg-slate-800/80 text-slate-300 hover:bg-slate-700 active:scale-95"}"
              >
                ${m}人
              </button>
            `).join("")}
          </div>
          <div class="text-xs text-slate-400 bg-slate-900/60 py-2.5 px-4 rounded-xl border border-slate-800">
            試合出場：<span class="text-emerald-400 font-bold">4人</span> ／ 休憩：<span class="text-amber-400 font-bold">${n-4}人</span>
          </div>
        </div>
      </div>

      <!-- Action Button Footer -->
      <div class="w-full space-y-3 pt-4 border-t border-slate-800/60">
        <button
          id="btn-start"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <span>${t?"新しくゲームを開始":"開始する"}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>

        ${t?`
          <button
            id="btn-resume"
            class="w-full py-3.5 rounded-2xl font-bold text-slate-300 bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/90 active:scale-[0.99] transition-all duration-150"
          >
            現在のゲームを継続 (${d.state.gameHistory.length}試合完了)
          </button>
        `:""}
      </div>
    `,s.querySelectorAll(".count-btn").forEach(m=>{m.addEventListener("click",l=>{n=parseInt(l.currentTarget.dataset.count,10),i()})});const c=s.querySelector("#btn-start");c&&c.addEventListener("click",()=>{e(n,!1)});const a=s.querySelector("#btn-resume");a&&a.addEventListener("click",()=>{e(d.state.playerCount,!0)})};return i(),s}function X({store:d,onConfirmMatch:e,onUndoMatch:n,onGoRestOption:t,onGoHistory:s,onGoHome:i}){const c=d.state.playerCount,a=d.state.gameHistory||[],m=c-4,l=d.state.manualRestPlayers||[];let o=d.state.currentGame;o?o={...o}:o=d.generateNextCurrentGame();let u=[];const r=document.createElement("div");r.className="flex-1 flex flex-col justify-between p-6 animate-slide-up overflow-y-auto no-scrollbar space-y-6";const p=()=>{l.length;const{gameNumber:b,team1:w,team2:h,restPlayers:k,manualRestPlayers:S,autoRestPlayers:C}=o,P=S&&S.length>0?S.join("、"):"なし",R=C&&C.length>0?C.join("、"):"なし";r.innerHTML=`
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
      <div class="glass-panel rounded-3xl p-5 border border-slate-800/80 shadow-lg space-y-3 shrink-0">
        <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <h3 class="font-extrabold text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>対戦履歴 (${a.length} 試合完了)</span>
          </h3>
          <button id="btn-view-stats" class="text-[11px] text-slate-400 hover:text-white underline">
            参加状況詳細
          </button>
        </div>

        ${a.length===0?`
          <div class="py-4 text-center text-slate-500 text-xs">
            確定済みの試合履歴はまだありません。
          </div>
        `:`
          <div class="space-y-2.5">
            ${a.map(f=>`
              <div class="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-2">
                  <span class="font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full text-[10px]">
                    第${f.gameNumber}G
                  </span>
                  <span class="font-extrabold text-white text-sm">
                    ${f.team1[0]}・${f.team1[1]} <span class="text-slate-500 font-normal text-xs">vs</span> ${f.team2[0]}・${f.team2[1]}
                  </span>
                </div>
                <div class="text-[11px] text-amber-400 font-medium">
                  休: ${f.restPlayers&&f.restPlayers.length>0?f.restPlayers.join(","):"なし"}
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      <!-- 2. Middle Section: Current Generated Match Card (Inline Court Representation) -->
      <div class="space-y-3 shrink-0">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <h3 class="font-extrabold text-sm text-white">
              第 ${b} ゲームの組み合わせ
            </h3>
          </div>
          <span class="text-[11px] text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            💡 選手2人タップで位置交換
          </span>
        </div>

        <!-- Court Container -->
        <div class="court-card rounded-3xl p-6 relative overflow-hidden border shadow-2xl">
          <!-- Court Net Line -->
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed court-line flex items-center justify-center">
            <span class="bg-slate-900/90 text-amber-400 text-xs font-black tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
              VS
            </span>
          </div>

          <!-- Team 1 (Top Court) -->
          <div class="mb-9 text-center space-y-2">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400/90">TEAM A</span>
            <div class="flex items-center justify-center space-x-4">
              ${$(w[0],"t1-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${$(w[1],"t1-1")}
            </div>
          </div>

          <!-- Team 2 (Bottom Court) -->
          <div class="mt-9 text-center space-y-2">
            <div class="flex items-center justify-center space-x-4">
              ${$(h[0],"t2-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${$(h[1],"t2-1")}
            </div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-teal-400/90">TEAM B</span>
          </div>
        </div>

        <!-- Rest & Options Info Panel -->
        <div class="glass-panel rounded-2xl p-4 text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-300">休憩プレイヤー:</span>
            <span class="font-extrabold text-amber-400 text-sm">
              ${k&&k.length>0?k.join(" 、 "):"なし"}
            </span>
          </div>
          ${m>0?`
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動固定：<strong class="text-amber-300">${P}</strong></span>
              <span>自動補充：<strong class="text-teal-300">${R}</strong></span>
              <button id="btn-open-rest-option" class="text-amber-400 hover:underline font-bold ml-2">
                設定変更
              </button>
            </div>
          `:""}
        </div>

        <!-- Reroll & Clear buttons -->
        <div class="grid grid-cols-2 gap-2">
          <button
            id="btn-reroll"
            class="py-3 rounded-xl font-bold text-xs bg-slate-800/90 text-emerald-400 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>組み合わせを再抽選</span>
          </button>

          <button
            id="btn-clear-swap"
            class="py-3 rounded-xl font-bold text-xs bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all"
          >
            位置選択を解除
          </button>
        </div>
      </div>

      <!-- 3. Bottom Action Buttons: Confirm Match, Undo & Options -->
      <div class="space-y-2.5 pt-2 border-t border-slate-800/60 shrink-0 pb-2">
        <button
          id="btn-confirm-match"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>この組み合わせで確定 (第${b}G)</span>
        </button>

        ${a.length>0?`
          <button
            id="btn-undo-main"
            class="w-full py-3 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${a.length}G)</span>
          </button>
        `:""}

        ${m>0?`
          <button
            id="btn-option-secondary"
            class="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 text-amber-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>休憩者を選択する（オプション）</span>
          </button>
        `:""}
      </div>
    `;function $(f,v){const x=u.includes(v);return`
        <button
          data-slot="${v}"
          class="player-slot w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${x?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce":"bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600/50 active:scale-95"}"
        >
          ${f}
        </button>
      `}r.querySelectorAll(".player-slot").forEach(f=>{f.addEventListener("click",v=>{const x=v.currentTarget.dataset.slot;u.includes(x)?u=u.filter(j=>j!==x):(u.push(x),u.length===2&&(D(u[0],u[1]),u=[])),p()})});function D(f,v){const x=y=>{if(y==="t1-0")return o.team1[0];if(y==="t1-1")return o.team1[1];if(y==="t2-0")return o.team2[0];if(y==="t2-1")return o.team2[1]},j=(y,M)=>{y==="t1-0"&&(o.team1[0]=M),y==="t1-1"&&(o.team1[1]=M),y==="t2-0"&&(o.team2[0]=M),y==="t2-1"&&(o.team2[1]=M)},K=x(f),z=x(v);j(f,z),j(v,K),o.lastDisplayedKey=L(o.team1,o.team2),d.setCurrentGame(o)}const E=r.querySelector("#btn-reroll");E&&E.addEventListener("click",()=>{const f=[...o.team1,...o.team2],v=o.lastDisplayedKey||L(o.team1,o.team2),x=O(f,d.state.gameHistory,v);o.team1=x.team1,o.team2=x.team2,o.lastDisplayedKey=x.key,u=[],d.setCurrentGame(o),p()});const G=r.querySelector("#btn-clear-swap");G&&G.addEventListener("click",()=>{u=[],p()});const B=r.querySelector("#btn-confirm-match");B&&B.addEventListener("click",()=>{d.setCurrentGame(o),e()});const H=r.querySelector("#btn-undo-main");H&&H.addEventListener("click",()=>{n()});const N=r.querySelector("#btn-open-rest-option");N&&N.addEventListener("click",t);const T=r.querySelector("#btn-option-secondary");T&&T.addEventListener("click",t);const A=r.querySelector("#btn-view-stats");A&&A.addEventListener("click",s);const _=r.querySelector("#btn-home");_&&_.addEventListener("click",i);const q=r.querySelector("#btn-history");q&&q.addEventListener("click",s)};return p(),r}function Z({store:d,onSaveAndBack:e}){const n=d.state.playerCount,t=n-4,s=new Set(d.state.manualRestPlayers||[]),i=document.createElement("div");i.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const c=()=>{const a=s.size;i.innerHTML=`
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

        ${t>0?`
          <!-- Player Selection Grid -->
          <div class="grid grid-cols-4 gap-3">
            ${Array.from({length:n},(o,u)=>u+1).map(o=>{const u=s.has(o),r=!u&&a>=t;return`
                <button
                  data-player="${o}"
                  ${r?"disabled":""}
                  class="player-option-btn relative py-5 rounded-2xl font-extrabold text-2xl transition-all duration-200 flex flex-col items-center justify-center ${u?"bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300":r?"bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50":"bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border border-slate-700/60 active:scale-95"}"
                >
                  <span>${o}</span>
                  ${u?'<span class="text-[10px] uppercase font-bold tracking-tight bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded-full mt-1">固定指定</span>':""}
                </button>
              `}).join("")}
          </div>

          <!-- Status Box -->
          <div class="glass-panel rounded-2xl p-4 text-xs space-y-2">
            <div class="flex items-center justify-between text-slate-300">
              <span>固定休憩指定:</span>
              <span class="font-bold text-amber-400">${a}人 ／ 最大${t}人</span>
            </div>
            <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              ${a<t?`※ 残り ${t-a} 名分はゲーム生成時に自動ランダム選出されます`:"※ 必要な休憩者が全員手動で固定されています"}
            </div>
          </div>
        `:`
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
    `,i.querySelectorAll(".player-option-btn").forEach(o=>{o.addEventListener("click",u=>{const r=parseInt(u.currentTarget.dataset.player,10);s.has(r)?s.delete(r):s.size<t&&s.add(r),c()})});const m=i.querySelector("#btn-save-option");m&&m.addEventListener("click",()=>{const o=Array.from(s);d.setManualRestPlayers(o),e()});const l=i.querySelector("#btn-cancel");l&&l.addEventListener("click",()=>{e()})};return c(),i}function ee({store:d,onUndo:e,onReset:n,onBack:t}){const s=document.createElement("div");s.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const i=d.state.gameHistory||[],c=d.getStats(),a=d.state.playerCount;return(()=>{s.innerHTML=`
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
              <span>参加状況 (${a}人)</span>
            </h3>
            <span class="text-xs text-slate-400">累計 ${i.length} 試合</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${Array.from({length:a},(r,p)=>p+1).map(r=>{const p=c[r]||{playCount:0,restCount:0};return`
                <div class="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                      ${r}
                    </span>
                  </div>
                  <div class="text-right text-xs">
                    <span class="text-slate-200 font-bold">出場 ${p.playCount}回</span>
                    <span class="text-slate-500 mx-1">/</span>
                    <span class="text-amber-400 font-medium">休憩 ${p.restCount}回</span>
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- History Match List Section -->
        <div class="space-y-3">
          <h3 class="font-extrabold text-sm text-slate-300 uppercase tracking-wider px-1">
            対戦履歴
          </h3>

          ${i.length===0?`
            <div class="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
              確定済みの試合データがまだありません。
            </div>
          `:`
            <div class="space-y-3">
              ${[...i].reverse().map(r=>`
                <div class="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                      第 ${r.gameNumber} ゲーム
                    </span>
                  </div>

                  <!-- Teams Match Display -->
                  <div class="flex items-center justify-around py-2 text-base font-black text-white">
                    <div class="text-emerald-300">
                      ${r.team1[0]} ・ ${r.team1[1]}
                    </div>
                    <div class="text-xs font-black text-slate-500 px-2">VS</div>
                    <div class="text-teal-300">
                      ${r.team2[0]} ・ ${r.team2[1]}
                    </div>
                  </div>

                  <!-- Rest info -->
                  <div class="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span>休憩：<strong class="text-amber-400 font-bold">${r.restPlayers&&r.restPlayers.length>0?r.restPlayers.join("、"):"なし"}</strong></span>
                    ${r.manuallySelectedRestPlayers&&r.manuallySelectedRestPlayers.length>0?`
                      <span class="text-[10px] text-slate-500">手動指定: ${r.manuallySelectedRestPlayers.join("、")}</span>
                    `:""}
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>

      <!-- Action Footer -->
      <div class="space-y-2 pt-3 border-t border-slate-800/60">
        ${i.length>0?`
          <button
            id="btn-undo"
            class="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${i.length}ゲーム)</span>
          </button>
        `:""}

        <button
          id="btn-reset"
          class="w-full py-3 rounded-2xl font-semibold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all"
        >
          最初からやり直す (データ全リセット)
        </button>
      </div>
    `;const l=s.querySelector("#btn-back");l&&l.addEventListener("click",t);const o=s.querySelector("#btn-undo");o&&o.addEventListener("click",()=>{confirm(`最新の第 ${i.length} ゲームの確定を取り消して巻き戻しますか？`)&&e()});const u=s.querySelector("#btn-reset");u&&u.addEventListener("click",()=>{confirm("すべての対戦履歴と進行状況をリセットして、最初からやり直しますか？")&&n()})})(),s}function te(d){let e=null;return{showToast(n,t="info",s=3e3){e&&e.remove(),e=document.createElement("div"),e.className=`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl font-semibold text-sm shadow-2xl backdrop-blur-md border animate-slide-up flex items-center space-x-2 ${t==="success"?"bg-emerald-900/90 text-emerald-200 border-emerald-500/50":t==="amber"?"bg-amber-900/90 text-amber-200 border-amber-500/50":"bg-slate-800/90 text-slate-100 border-slate-700"}`,e.innerHTML=`
        <span>${n}</span>
      `,d.appendChild(e),setTimeout(()=>{e&&(e.classList.add("opacity-0","transition-opacity","duration-300"),setTimeout(()=>e==null?void 0:e.remove(),300))},s)},showUpdatePrompt(n){const t=document.createElement("div");t.className="fixed top-4 inset-x-4 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl flex items-center justify-between animate-slide-up",t.innerHTML=`
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-xs font-bold text-slate-100">新しいバージョンがあります</span>
        </div>
        <button id="btn-pwa-update" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-emerald-400">
          更新する
        </button>
      `,d.appendChild(t),t.querySelector("#btn-pwa-update").addEventListener("click",()=>{t.remove(),n()})}}}function se(d){const e=new Y,n=te(d);e.state.currentStep!=="start"&&e.state.currentStep!=="rest_option"&&e.state.currentStep!=="history"&&(e.state.currentStep="main");function t(){d.innerHTML="";const s=e.state.currentStep;let i=null;s==="start"?i=Q({store:e,onStart:(c,a)=>{a||(e.state.gameHistory=[],e.state.currentGame=null,e.state.manualRestPlayers=[]),e.setPlayerCount(c),t()}}):s==="main"?i=X({store:e,onConfirmMatch:()=>{const c=e.state.gameHistory.length+1;e.confirmCurrentGame(),n.showToast(`第 ${c} ゲームの組み合わせを確定しました`,"success"),t()},onUndoMatch:()=>{e.undoLastGame()&&(n.showToast("直前の確定を取り消しました","amber"),t())},onGoRestOption:()=>{e.setStep("rest_option"),t()},onGoHistory:()=>{e.setStep("history"),t()},onGoHome:()=>{e.setStep("start"),t()}}):s==="rest_option"?i=Z({store:e,onSaveAndBack:()=>{e.setStep("main"),t()}}):s==="history"&&(i=ee({store:e,onUndo:()=>{e.undoLastGame()&&(n.showToast("直前の確定を取り消しました","amber"),t())},onReset:()=>{e.resetAll(),n.showToast("初期状態にリセットしました","info"),t()},onBack:()=>{e.setStep("main"),t()}})),i&&d.appendChild(i)}return t(),{render:t,toastManager:n}}const ae="modulepreload",re=function(d){return"/"+d},I={},ne=function(e,n,t){let s=Promise.resolve();if(n&&n.length>0){let c=function(l){return Promise.all(l.map(o=>Promise.resolve(o).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),m=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=c(n.map(l=>{if(l=re(l),l in I)return;I[l]=!0;const o=l.endsWith(".css"),u=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const r=document.createElement("link");if(r.rel=o?"stylesheet":ae,o||(r.as="script"),r.crossOrigin="",r.href=l,m&&r.setAttribute("nonce",m),document.head.appendChild(r),o)return new Promise((p,b)=>{r.addEventListener("load",p),r.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(c){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=c,window.dispatchEvent(a),!a.defaultPrevented)throw c}return s.then(c=>{for(const a of c||[])a.status==="rejected"&&i(a.reason);return e().catch(i)})};function oe(d={}){const{immediate:e=!1,onNeedRefresh:n,onOfflineReady:t,onRegistered:s,onRegisteredSW:i,onRegisterError:c}=d;let a,m,l;const o=async(r=!0)=>{await m,l==null||l()};async function u(){if("serviceWorker"in navigator){if(a=await ne(async()=>{const{Workbox:r}=await import("./workbox-window.prod.es5-BBnX5xw4.js");return{Workbox:r}},[]).then(({Workbox:r})=>new r("/sw.js",{scope:"/",type:"classic"})).catch(r=>{c==null||c(r)}),!a)return;l=()=>{a==null||a.messageSkipWaiting()};{let r=!1;const p=()=>{r=!0,a==null||a.addEventListener("controlling",b=>{b.isUpdate&&window.location.reload()}),n==null||n()};a.addEventListener("installed",b=>{typeof b.isUpdate>"u"?typeof b.isExternal<"u"&&b.isExternal?p():!r&&(t==null||t()):b.isUpdate||t==null||t()}),a.addEventListener("waiting",p)}a.register({immediate:e}).then(r=>{i?i("/sw.js",r):s==null||s(r)}).catch(r=>{c==null||c(r)})}}return m=u(),o}document.addEventListener("DOMContentLoaded",()=>{const d=document.getElementById("app");if(!d)return;const e=se(d),n=oe({onNeedRefresh(){e.toastManager.showUpdatePrompt(()=>{n(!0)})},onOfflineReady(){console.log("App is ready for offline use.")}})});
