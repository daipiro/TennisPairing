(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function t(s){if(s.ep)return;s.ep=!0;const l=n(s);fetch(s.href,l)}})();function V(c){const[e,n,t,s]=c;return[{team1:[e,n],team2:[t,s]},{team1:[e,t],team2:[n,s]},{team1:[e,s],team2:[n,t]}].map(o=>{const r=[...o.team1].sort((i,d)=>i-d),u=[...o.team2].sort((i,d)=>i-d),[a,m]=[r,u].sort((i,d)=>i[0]-d[0]||i[1]-d[1]),f=`${a[0]}-${a[1]}_vs_${m[0]}-${m[1]}`;return{team1:o.team1,team2:o.team2,key:f}})}function g(c,e){return c<e?`${c}-${e}`:`${e}-${c}`}function R(c,e){const n=[...c].sort((o,r)=>o-r),t=[...e].sort((o,r)=>o-r),[s,l]=[n,t].sort((o,r)=>o[0]-r[0]||o[1]-r[1]);return`${s[0]}-${s[1]}_vs_${l[0]}-${l[1]}`}function F(c){const e={},n={},t={},s=(r,u)=>{const a=g(r,u);return e[a]||0},l=(r,u)=>{const a=g(r,u);return n[a]||0},o=r=>t[r]||0;for(const r of c){const{team1:u,team2:a}=r,m=g(u[0],u[1]),f=g(a[0],a[1]);e[m]=(e[m]||0)+1,e[f]=(e[f]||0)+1;for(const d of u)for(const h of a){const S=g(d,h);n[S]=(n[S]||0)+1}const i=R(u,a);t[i]=(t[i]||0)+1}return{pairCounts:e,opponentCounts:n,cardCounts:t,getPair:s,getOpponent:l,getCard:o}}function Y(c,e,n=null){const{team1:t,team2:s,key:l}=c,{getPair:o,getOpponent:r,getCard:u}=F(e),a=o(t[0],t[1])+o(s[0],s[1]),m=r(t[0],s[0])+r(t[0],s[1])+r(t[1],s[0])+r(t[1],s[1]),f=u(l);let i=0,d=!1;if(e.length>0){const v=e[e.length-1],k=g(v.team1[0],v.team1[1]),P=g(v.team2[0],v.team2[1]),C=g(t[0],t[1]),$=g(s[0],s[1]);(C===k||C===P)&&i++,($===k||$===P)&&i++;const L=R(v.team1,v.team2);l===L&&(d=!0)}const h=n&&l===n;return{score:a*100+m*10+f*30+i*300+(d?500:0)+(h?200:0),breakdown:{pairRepetition:a,oppRepetition:m,sameCardCount:f,lastGameSamePairCount:i,lastGameSameCard:d,isSameAsLastDisplayed:h}}}function J(c,e=[]){const n=c-4;if(n<=0)return{restPlayers:[],manualRestPlayers:[],autoRestPlayers:[]};const t=new Set(e.filter(a=>a>=1&&a<=c)),s=n-t.size;if(s<=0){const a=Array.from(t).sort((m,f)=>m-f);return{restPlayers:a,manualRestPlayers:a,autoRestPlayers:[]}}const l=[];for(let a=1;a<=c;a++)t.has(a)||l.push(a);const o=[...l];for(let a=o.length-1;a>0;a--){const m=Math.floor(Math.random()*(a+1));[o[a],o[m]]=[o[m],o[a]]}const r=o.slice(0,s).sort((a,m)=>a-m);return{restPlayers:[...Array.from(t),...r].sort((a,m)=>a-m),manualRestPlayers:Array.from(t).sort((a,m)=>a-m),autoRestPlayers:r}}function q(c,e,n=null){const s=V(c).map(a=>{const{score:m,breakdown:f}=Y(a,e,n);return{...a,score:m,breakdown:f}}),o=Math.min(...s.map(a=>a.score))+20,r=s.filter(a=>a.score<=o),u=Math.floor(Math.random()*r.length);return r[u]}const N="tennis_pairing_app_state_v1";class Z{constructor(){this.state=this.loadState(),this.state.currentStep!=="start"&&(this.state.currentStep="main"),this.state.currentGame||this.generateNextCurrentGame()}getDefaultState(){return{playerCount:6,currentStep:"start",gameHistory:[],manualRestPlayers:[],currentGame:null}}loadState(){try{const e=localStorage.getItem(N);if(e){const n=JSON.parse(e);return n.manualRestPlayers||(n.manualRestPlayers=[]),n.currentStep=n.currentStep==="start"?"start":"main",n}}catch(e){console.error("Failed to load state from localStorage:",e)}return this.getDefaultState()}saveState(){try{localStorage.setItem(N,JSON.stringify(this.state))}catch(e){console.error("Failed to save state to localStorage:",e)}}setPlayerCount(e){this.state.playerCount=e;const n=e-4;this.state.manualRestPlayers=(this.state.manualRestPlayers||[]).filter(t=>t<=e).slice(0,Math.max(0,n)),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}generateNextCurrentGame(){const e=this.state.playerCount,n=this.state.gameHistory.length+1,{restPlayers:t,manualRestPlayers:s,autoRestPlayers:l}=J(e,this.state.manualRestPlayers||[]),o=[];for(let u=1;u<=e;u++)t.includes(u)||o.push(u);const r=q(o,this.state.gameHistory);return this.state.currentGame={gameNumber:n,restPlayers:t,manualRestPlayers:s,autoRestPlayers:l,team1:r.team1,team2:r.team2,lastDisplayedKey:r.key},this.saveState(),this.state.currentGame}toggleManualRestPlayer(e){const n=this.state.playerCount-4;let t=[...this.state.manualRestPlayers||[]];t.includes(e)?t=t.filter(s=>s!==e):t.length<n&&t.push(e),this.state.manualRestPlayers=t.sort((s,l)=>s-l),this.generateNextCurrentGame(),this.saveState()}setStep(e){this.state.currentStep=e,this.saveState()}setCurrentGame(e){this.state.currentGame=e,this.saveState()}confirmCurrentGame(){if(!this.state.currentGame)return;const n={gameNumber:this.state.gameHistory.length+1,team1:[...this.state.currentGame.team1],team2:[...this.state.currentGame.team2],restPlayers:[...this.state.currentGame.restPlayers],manuallySelectedRestPlayers:[...this.state.currentGame.manualRestPlayers||[]]};this.state.gameHistory.push(n),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}undoLastGame(){if(this.state.gameHistory.length===0)return!1;const e=this.state.gameHistory.pop(),n=e.manuallySelectedRestPlayers||[],t=e.restPlayers||[],s=t.filter(l=>!n.includes(l));return this.state.currentGame={gameNumber:e.gameNumber,team1:e.team1,team2:e.team2,restPlayers:t,manualRestPlayers:n,autoRestPlayers:s,lastDisplayedKey:null},this.state.currentStep="main",this.saveState(),!0}resetAll(){this.state=this.getDefaultState(),this.saveState()}getStats(){const e={},n=this.state.playerCount;for(let t=1;t<=n;t++)e[t]={player:t,playCount:0,restCount:0};for(const t of this.state.gameHistory){const s=[...t.team1,...t.team2];for(const l of s)e[l]&&e[l].playCount++;for(const l of t.restPlayers)e[l]&&e[l].restCount++}return e}}function Q({store:c,onStart:e}){let n=c.state.playerCount||6;const t=c.state.gameHistory.length>0,s=document.createElement("div");s.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const l=()=>{s.innerHTML=`
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
            ${[4,5,6,7,8].map(u=>`
              <button
                data-count="${u}"
                class="count-btn py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${n===u?"bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300":"bg-slate-800/80 text-slate-300 hover:bg-slate-700 active:scale-95"}"
              >
                ${u}人
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
            現在のゲームを継続 (${c.state.gameHistory.length}試合完了)
          </button>
        `:""}
      </div>
    `,s.querySelectorAll(".count-btn").forEach(u=>{u.addEventListener("click",a=>{n=parseInt(a.currentTarget.dataset.count,10),l()})});const o=s.querySelector("#btn-start");o&&o.addEventListener("click",()=>{e(n,!1)});const r=s.querySelector("#btn-resume");r&&r.addEventListener("click",()=>{e(c.state.playerCount,!0)})};return l(),s}function X({store:c,onConfirmMatch:e,onUndoMatch:n,onGoHistory:t,onGoHome:s}){const l=c.state.playerCount,o=c.state.gameHistory||[],r=l-4;let u=[];const a=document.createElement("div");a.className="flex-1 flex flex-col justify-between p-6 animate-slide-up overflow-y-auto no-scrollbar space-y-6";const m=()=>{const f=c.state.manualRestPlayers||[],i=f.length;let d=c.state.currentGame;d?d={...d}:d=c.generateNextCurrentGame();const{gameNumber:h,team1:S,team2:v,restPlayers:k,manualRestPlayers:P,autoRestPlayers:C}=d,$=P&&P.length>0?P.join("、"):"なし",L=C&&C.length>0?C.join("、"):"なし";a.innerHTML=`
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
            <span>対戦履歴 (${o.length} 試合完了)</span>
          </h3>
          <button id="btn-view-stats" class="text-[11px] text-slate-400 hover:text-white underline">
            参加状況詳細
          </button>
        </div>

        ${o.length===0?`
          <div class="py-4 text-center text-slate-500 text-xs">
            確定済みの試合履歴はまだありません。
          </div>
        `:`
          <div class="space-y-2.5">
            ${o.map(p=>`
              <div class="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-2">
                  <span class="font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full text-[10px]">
                    第${p.gameNumber}G
                  </span>
                  <span class="font-extrabold text-white text-sm">
                    ${p.team1[0]}・${p.team1[1]} <span class="text-slate-500 font-normal text-xs">vs</span> ${p.team2[0]}・${p.team2[1]}
                  </span>
                </div>
                <div class="text-[11px] text-amber-400 font-medium">
                  休: ${p.restPlayers&&p.restPlayers.length>0?p.restPlayers.join(","):"なし"}
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      <!-- 2. Middle Top Section: Inline Rest Player Selection / Manual Options -->
      ${r>0?`
        <div class="glass-panel rounded-3xl p-5 border border-slate-800/80 shadow-lg space-y-3 shrink-0">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 class="font-extrabold text-xs text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span>休憩者を選択（固定保持）</span>
            </h3>
            <span class="text-[11px] font-bold text-amber-400">
              手動: ${i}人 / 最大${r}人
            </span>
          </div>

          <!-- Rest Player Option Buttons (Inline 1~N) -->
          <div class="grid grid-cols-6 gap-2 pt-1">
            ${Array.from({length:l},(p,x)=>x+1).map(p=>{const x=f.includes(p),b=!x&&i>=r;return`
                <button
                  data-manual-rest="${p}"
                  ${b?"disabled":""}
                  class="manual-rest-toggle-btn py-2.5 rounded-xl font-black text-base transition-all duration-150 flex flex-col items-center justify-center ${x?"bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-300":b?"bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50":"bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700/60 active:scale-95"}"
                >
                  <span>${p}</span>
                  ${x?'<span class="text-[9px] font-extrabold text-amber-950">固定</span>':""}
                </button>
              `}).join("")}
          </div>
        </div>
      `:""}

      <!-- 3. Middle Section: Current Generated Match (Players aligned HORIZONTALLY in one row) -->
      <div class="space-y-3 shrink-0">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <h3 class="font-extrabold text-sm text-white">
              第 ${h} ゲームの組み合わせ
            </h3>
          </div>
        </div>

        <!-- Horizontal Court Container (Clean Horizontal Layout without MATCH LAYOUT / TEAM A / TEAM B labels) -->
        <div class="court-card rounded-3xl p-5 border shadow-2xl">
          <!-- Horizontal Players Row: [ Player A1 ] [ Player A2 ]  VS  [ Player B1 ] [ Player B2 ] -->
          <div class="flex items-center justify-around py-2 px-1">
            <!-- Team A Players -->
            <div class="flex space-x-2">
              ${j(S[0],"t1-0")}
              ${j(S[1],"t1-1")}
            </div>

            <!-- VS Badge -->
            <div class="px-2 flex flex-col items-center justify-center">
              <span class="bg-slate-900/90 text-amber-400 text-xs font-black tracking-widest px-2.5 py-1 rounded-full border border-amber-500/40 shadow-inner">
                VS
              </span>
            </div>

            <!-- Team B Players -->
            <div class="flex space-x-2">
              ${j(v[0],"t2-0")}
              ${j(v[1],"t2-1")}
            </div>
          </div>
        </div>

        <!-- Rest Players Info Panel (Without Title Header Label) -->
        <div class="glass-panel rounded-2xl p-3.5 text-xs space-y-2">
          ${k&&k.length>0?`
            <div class="flex items-center space-x-2">
              ${k.map((p,x)=>I(p,`rest-${x}`)).join("")}
            </div>
          `:`
            <div class="text-slate-400 italic text-xs">全員出場中</div>
          `}

          ${r>0?`
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動固定：<strong class="text-amber-300">${$}</strong></span>
              <span>自動補充：<strong class="text-teal-300">${L}</strong></span>
            </div>
          `:""}
        </div>

        <!-- Reroll Button -->
        <button
          id="btn-reroll"
          class="w-full py-3.5 rounded-xl font-bold text-xs bg-slate-800/90 text-emerald-400 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>組み合わせを再抽選</span>
        </button>
      </div>

      <!-- 4. Bottom Action Buttons: Confirm Match & Undo -->
      <div class="space-y-2.5 pt-2 border-t border-slate-800/60 shrink-0 pb-2">
        <button
          id="btn-confirm-match"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>この組み合わせで確定 (第${h}G)</span>
        </button>

        ${o.length>0?`
          <button
            id="btn-undo-main"
            class="w-full py-3 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${o.length}G)</span>
          </button>
        `:""}
      </div>
    `;function j(p,x){const b=u.includes(x);return`
        <button
          data-slot="${x}"
          class="player-slot w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${b?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce":"bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600/50 active:scale-95"}"
        >
          ${p}
        </button>
      `}function I(p,x){const b=u.includes(x);return`
        <button
          data-slot="${x}"
          class="player-slot px-3.5 py-2 rounded-xl font-bold text-sm flex items-center space-x-1 transition-all duration-200 shadow-sm ${b?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-105 animate-pulse":"bg-slate-800/90 text-amber-300 border border-amber-500/30 hover:bg-slate-700/90 active:scale-95"}"
        >
          <span class="text-[10px] text-slate-400 font-normal">休</span>
          <span class="font-black text-base">${p}</span>
        </button>
      `}a.querySelectorAll(".manual-rest-toggle-btn").forEach(p=>{p.addEventListener("click",x=>{const b=parseInt(x.currentTarget.dataset.manualRest,10);c.toggleManualRestPlayer(b),m()})}),a.querySelectorAll(".player-slot").forEach(p=>{p.addEventListener("click",x=>{const b=x.currentTarget.dataset.slot;u.includes(b)?u=u.filter(M=>M!==b):(u.push(b),u.length===2&&(U(u[0],u[1]),u=[])),m()})});function U(p,x){const b=y=>{if(y==="t1-0")return d.team1[0];if(y==="t1-1")return d.team1[1];if(y==="t2-0")return d.team2[0];if(y==="t2-1")return d.team2[1];if(y.startsWith("rest-")){const w=parseInt(y.replace("rest-",""),10);return d.restPlayers[w]}},M=(y,w)=>{if(y==="t1-0")d.team1[0]=w;else if(y==="t1-1")d.team1[1]=w;else if(y==="t2-0")d.team2[0]=w;else if(y==="t2-1")d.team2[1]=w;else if(y.startsWith("rest-")){const K=parseInt(y.replace("rest-",""),10);d.restPlayers[K]=w,d.restPlayers.sort((z,W)=>z-W)}},O=b(p),D=b(x);M(p,D),M(x,O),d.lastDisplayedKey=R(d.team1,d.team2),c.setCurrentGame(d)}const G=a.querySelector("#btn-reroll");G&&G.addEventListener("click",()=>{const p=[...d.team1,...d.team2],x=d.lastDisplayedKey||R(d.team1,d.team2),b=q(p,c.state.gameHistory,x);d.team1=b.team1,d.team2=b.team2,d.lastDisplayedKey=b.key,u=[],c.setCurrentGame(d),m()});const E=a.querySelector("#btn-confirm-match");E&&E.addEventListener("click",()=>{c.setCurrentGame(d),e()});const H=a.querySelector("#btn-undo-main");H&&H.addEventListener("click",()=>{n()});const B=a.querySelector("#btn-view-stats");B&&B.addEventListener("click",t);const T=a.querySelector("#btn-home");T&&T.addEventListener("click",s);const A=a.querySelector("#btn-history");A&&A.addEventListener("click",t)};return m(),a}function ee({store:c,onUndo:e,onReset:n,onBack:t}){const s=document.createElement("div");s.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const l=c.state.gameHistory||[],o=c.getStats(),r=c.state.playerCount;return(()=>{s.innerHTML=`
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
              <span>参加状況 (${r}人)</span>
            </h3>
            <span class="text-xs text-slate-400">累計 ${l.length} 試合</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${Array.from({length:r},(i,d)=>d+1).map(i=>{const d=o[i]||{playCount:0,restCount:0};return`
                <div class="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                      ${i}
                    </span>
                  </div>
                  <div class="text-right text-xs">
                    <span class="text-slate-200 font-bold">出場 ${d.playCount}回</span>
                    <span class="text-slate-500 mx-1">/</span>
                    <span class="text-amber-400 font-medium">休憩 ${d.restCount}回</span>
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

          ${l.length===0?`
            <div class="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
              確定済みの試合データがまだありません。
            </div>
          `:`
            <div class="space-y-3">
              ${[...l].reverse().map(i=>`
                <div class="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                      第 ${i.gameNumber} ゲーム
                    </span>
                  </div>

                  <!-- Teams Match Display -->
                  <div class="flex items-center justify-around py-2 text-base font-black text-white">
                    <div class="text-emerald-300">
                      ${i.team1[0]} ・ ${i.team1[1]}
                    </div>
                    <div class="text-xs font-black text-slate-500 px-2">VS</div>
                    <div class="text-teal-300">
                      ${i.team2[0]} ・ ${i.team2[1]}
                    </div>
                  </div>

                  <!-- Rest info -->
                  <div class="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span>休憩：<strong class="text-amber-400 font-bold">${i.restPlayers&&i.restPlayers.length>0?i.restPlayers.join("、"):"なし"}</strong></span>
                    ${i.manuallySelectedRestPlayers&&i.manuallySelectedRestPlayers.length>0?`
                      <span class="text-[10px] text-slate-500">手動指定: ${i.manuallySelectedRestPlayers.join("、")}</span>
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
        ${l.length>0?`
          <button
            id="btn-undo"
            class="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${l.length}ゲーム)</span>
          </button>
        `:""}

        <button
          id="btn-reset"
          class="w-full py-3 rounded-2xl font-semibold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all"
        >
          最初からやり直す (データ全リセット)
        </button>
      </div>
    `;const a=s.querySelector("#btn-back");a&&a.addEventListener("click",t);const m=s.querySelector("#btn-undo");m&&m.addEventListener("click",()=>{confirm(`最新の第 ${l.length} ゲームの確定を取り消して巻き戻しますか？`)&&e()});const f=s.querySelector("#btn-reset");f&&f.addEventListener("click",()=>{confirm("すべての対戦履歴と進行状況をリセットして、最初からやり直しますか？")&&n()})})(),s}function te(c){let e=null;return{showToast(n,t="info",s=3e3){e&&e.remove(),e=document.createElement("div"),e.className=`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl font-semibold text-sm shadow-2xl backdrop-blur-md border animate-slide-up flex items-center space-x-2 ${t==="success"?"bg-emerald-900/90 text-emerald-200 border-emerald-500/50":t==="amber"?"bg-amber-900/90 text-amber-200 border-amber-500/50":"bg-slate-800/90 text-slate-100 border-slate-700"}`,e.innerHTML=`
        <span>${n}</span>
      `,c.appendChild(e),setTimeout(()=>{e&&(e.classList.add("opacity-0","transition-opacity","duration-300"),setTimeout(()=>e==null?void 0:e.remove(),300))},s)},showUpdatePrompt(n){const t=document.createElement("div");t.className="fixed top-4 inset-x-4 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl flex items-center justify-between animate-slide-up",t.innerHTML=`
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-xs font-bold text-slate-100">新しいバージョンがあります</span>
        </div>
        <button id="btn-pwa-update" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-emerald-400">
          更新する
        </button>
      `,c.appendChild(t),t.querySelector("#btn-pwa-update").addEventListener("click",()=>{t.remove(),n()})}}}function se(c){const e=new Z,n=te(c);e.state.currentStep!=="start"&&e.state.currentStep!=="history"&&(e.state.currentStep="main");function t(){c.innerHTML="";const s=e.state.currentStep;let l=null;s==="start"?l=Q({store:e,onStart:(o,r)=>{r||(e.state.gameHistory=[],e.state.currentGame=null,e.state.manualRestPlayers=[]),e.setPlayerCount(o),t()}}):s==="main"?l=X({store:e,onConfirmMatch:()=>{const o=e.state.gameHistory.length+1;e.confirmCurrentGame(),n.showToast(`第 ${o} ゲームの組み合わせを確定しました`,"success"),t()},onUndoMatch:()=>{e.undoLastGame()&&(n.showToast("直前の確定を取り消しました","amber"),t())},onGoHistory:()=>{e.setStep("history"),t()},onGoHome:()=>{e.setStep("start"),t()}}):s==="history"&&(l=ee({store:e,onUndo:()=>{e.undoLastGame()&&(n.showToast("直前の確定を取り消しました","amber"),t())},onReset:()=>{e.resetAll(),n.showToast("初期状態にリセットしました","info"),t()},onBack:()=>{e.setStep("main"),t()}})),l&&c.appendChild(l)}return t(),{render:t,toastManager:n}}const ae="modulepreload",re=function(c){return"/TennisPairing/"+c},_={},ne=function(e,n,t){let s=Promise.resolve();if(n&&n.length>0){let o=function(a){return Promise.all(a.map(m=>Promise.resolve(m).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),u=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=o(n.map(a=>{if(a=re(a),a in _)return;_[a]=!0;const m=a.endsWith(".css"),f=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${f}`))return;const i=document.createElement("link");if(i.rel=m?"stylesheet":ae,m||(i.as="script"),i.crossOrigin="",i.href=a,u&&i.setAttribute("nonce",u),document.head.appendChild(i),m)return new Promise((d,h)=>{i.addEventListener("load",d),i.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${a}`)))})}))}function l(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return s.then(o=>{for(const r of o||[])r.status==="rejected"&&l(r.reason);return e().catch(l)})};function oe(c={}){const{immediate:e=!1,onNeedRefresh:n,onOfflineReady:t,onRegistered:s,onRegisteredSW:l,onRegisterError:o}=c;let r,u,a;const m=async(i=!0)=>{await u,a==null||a()};async function f(){if("serviceWorker"in navigator){if(r=await ne(async()=>{const{Workbox:i}=await import("./workbox-window.prod.es5-BBnX5xw4.js");return{Workbox:i}},[]).then(({Workbox:i})=>new i("/TennisPairing/sw.js",{scope:"/TennisPairing/",type:"classic"})).catch(i=>{o==null||o(i)}),!r)return;a=()=>{r==null||r.messageSkipWaiting()};{let i=!1;const d=()=>{i=!0,r==null||r.addEventListener("controlling",h=>{h.isUpdate&&window.location.reload()}),n==null||n()};r.addEventListener("installed",h=>{typeof h.isUpdate>"u"?typeof h.isExternal<"u"&&h.isExternal?d():!i&&(t==null||t()):h.isUpdate||t==null||t()}),r.addEventListener("waiting",d)}r.register({immediate:e}).then(i=>{l?l("/TennisPairing/sw.js",i):s==null||s(i)}).catch(i=>{o==null||o(i)})}}return u=f(),m}document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("app");if(!c)return;const e=se(c),n=oe({onNeedRefresh(){e.toastManager.showUpdatePrompt(()=>{n(!0)})},onOfflineReady(){console.log("App is ready for offline use.")}})});
