(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();function W(c){const[e,a,t,s]=c;return[{team1:[e,a],team2:[t,s]},{team1:[e,t],team2:[a,s]},{team1:[e,s],team2:[a,t]}].map(i=>{const r=[...i.team1].sort((l,u)=>l-u),d=[...i.team2].sort((l,u)=>l-u),[o,m]=[r,d].sort((l,u)=>l[0]-u[0]||l[1]-u[1]),x=`${o[0]}-${o[1]}_vs_${m[0]}-${m[1]}`;return{team1:i.team1,team2:i.team2,key:x}})}function $(c,e){return c<e?`${c}-${e}`:`${e}-${c}`}function G(c,e){const a=[...c].sort((i,r)=>i-r),t=[...e].sort((i,r)=>i-r),[s,n]=[a,t].sort((i,r)=>i[0]-r[0]||i[1]-r[1]);return`${s[0]}-${s[1]}_vs_${n[0]}-${n[1]}`}function I(c,e){let a=0;for(let t=e.length-1;t>=0;t--){const s=e[t];if([...s.team1,...s.team2].includes(c))a++;else break}return a}function F(c){const e={},a={},t={},s=(r,d)=>{const o=$(r,d);return e[o]||0},n=(r,d)=>{const o=$(r,d);return a[o]||0},i=r=>t[r]||0;for(const r of c){const{team1:d,team2:o}=r,m=$(d[0],d[1]),x=$(o[0],o[1]);e[m]=(e[m]||0)+1,e[x]=(e[x]||0)+1;for(const u of d)for(const v of o){const C=$(u,v);a[C]=(a[C]||0)+1}const l=G(d,o);t[l]=(t[l]||0)+1}return{pairCounts:e,opponentCounts:a,cardCounts:t,getPair:s,getOpponent:n,getCard:i}}function J(c,e,a=null){const{team1:t,team2:s,key:n}=c,{getPair:i,getOpponent:r,getCard:d}=F(e),o=i(t[0],t[1])+i(s[0],s[1]),m=r(t[0],s[0])+r(t[0],s[1])+r(t[1],s[0])+r(t[1],s[1]),x=d(n);let l=0,u=!1;if(e.length>0){const y=e[e.length-1],k=$(y.team1[0],y.team1[1]),p=$(y.team2[0],y.team2[1]),b=$(t[0],t[1]),g=$(s[0],s[1]);(b===k||b===p)&&l++,(g===k||g===p)&&l++;const M=G(y.team1,y.team2);n===M&&(u=!0)}const v=a&&n===a,C=[...t,...s];let R=0;for(const y of C){const k=I(y,e);k>=3&&(R+=(k-2)*150)}return{score:o*100+m*10+x*30+l*300+(u?500:0)+(v?200:0)+R,breakdown:{pairRepetition:o,oppRepetition:m,sameCardCount:x,lastGameSamePairCount:l,lastGameSameCard:u,isSameAsLastDisplayed:v,consecutivePlayPenalty:R}}}function Y(c,e=[],a=[],t=[]){const s=c-4;if(s<=0)return{restPlayers:[],manualRestPlayers:[],autoRestPlayers:[]};const n=new Set(e.filter(p=>p>=1&&p<=c)),i=s-n.size;if(i<=0){const p=Array.from(n).sort((b,g)=>b-g);return{restPlayers:p,manualRestPlayers:p,autoRestPlayers:[]}}const r=[];for(let p=1;p<=c;p++)n.has(p)||r.push(p);const d=p=>{const b=[...p];for(let g=b.length-1;g>0;g--){const M=Math.floor(Math.random()*(g+1));[b[g],b[M]]=[b[M],b[g]]}return b},o={};for(const p of r)o[p]=I(p,t);const m=new Set(a),x=r.filter(p=>o[p]>=3),l=r.filter(p=>o[p]<3&&!m.has(p)),u=r.filter(p=>o[p]<3&&m.has(p)),v=d(x),C=d(l),R=d(u);let S=[];for(const p of[v,C,R]){if(S.length>=i)break;const b=i-S.length;S=[...S,...p.slice(0,b)]}const y=S.sort((p,b)=>p-b);return{restPlayers:[...Array.from(n),...y].sort((p,b)=>p-b),manualRestPlayers:Array.from(n).sort((p,b)=>p-b),autoRestPlayers:y}}function Z(c,e,a=null){const s=W(c).map(o=>{const{score:m,breakdown:x}=J(o,e,a);return{...o,score:m,breakdown:x}}),i=Math.min(...s.map(o=>o.score))+20,r=s.filter(o=>o.score<=i),d=Math.floor(Math.random()*r.length);return r[d]}const _="tennis_pairing_app_state_v1";class Q{constructor(){this.state=this.loadState(),this.state.currentStep!=="start"&&(this.state.currentStep="main"),this.state.currentGame||this.generateNextCurrentGame()}getDefaultState(){return{playerCount:6,currentStep:"start",gameHistory:[],manualRestPlayers:[],currentGame:null}}loadState(){try{const e=localStorage.getItem(_);if(e){const a=JSON.parse(e);return a.manualRestPlayers||(a.manualRestPlayers=[]),a.currentStep=a.currentStep==="start"?"start":"main",a}}catch(e){console.error("Failed to load state from localStorage:",e)}return this.getDefaultState()}saveState(){try{localStorage.setItem(_,JSON.stringify(this.state))}catch(e){console.error("Failed to save state to localStorage:",e)}}setPlayerCount(e){this.state.playerCount=e;const a=e-4;this.state.manualRestPlayers=(this.state.manualRestPlayers||[]).filter(t=>t<=e).slice(0,Math.max(0,a)),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}generateNextCurrentGame(e=null){const a=this.state.playerCount,t=this.state.gameHistory.length+1;let s=[];this.state.gameHistory.length>0&&(s=this.state.gameHistory[this.state.gameHistory.length-1].restPlayers||[]);const{restPlayers:n,manualRestPlayers:i,autoRestPlayers:r}=Y(a,this.state.manualRestPlayers||[],s,this.state.gameHistory),d=[];for(let m=1;m<=a;m++)n.includes(m)||d.push(m);const o=Z(d,this.state.gameHistory,e);return this.state.currentGame={gameNumber:t,restPlayers:n,manualRestPlayers:i,autoRestPlayers:r,team1:o.team1,team2:o.team2,lastDisplayedKey:o.key},this.saveState(),this.state.currentGame}rerollCurrentGame(){var a;const e=((a=this.state.currentGame)==null?void 0:a.lastDisplayedKey)||null;return this.generateNextCurrentGame(e)}toggleManualRestPlayer(e){const a=this.state.playerCount-4;let t=[...this.state.manualRestPlayers||[]];t.includes(e)?t=t.filter(s=>s!==e):t.length<a&&t.push(e),this.state.manualRestPlayers=t.sort((s,n)=>s-n),this.generateNextCurrentGame(),this.saveState()}setStep(e){this.state.currentStep=e,this.saveState()}setCurrentGame(e){this.state.currentGame=e,this.saveState()}confirmCurrentGame(){if(!this.state.currentGame)return;const a={gameNumber:this.state.gameHistory.length+1,team1:[...this.state.currentGame.team1],team2:[...this.state.currentGame.team2],restPlayers:[...this.state.currentGame.restPlayers],manuallySelectedRestPlayers:[...this.state.currentGame.manualRestPlayers||[]]};this.state.gameHistory.push(a),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}undoLastGame(){if(this.state.gameHistory.length===0)return!1;const e=this.state.gameHistory.pop(),a=e.manuallySelectedRestPlayers||[],t=e.restPlayers||[],s=t.filter(n=>!a.includes(n));return this.state.currentGame={gameNumber:e.gameNumber,team1:e.team1,team2:e.team2,restPlayers:t,manualRestPlayers:a,autoRestPlayers:s,lastDisplayedKey:null},this.state.currentStep="main",this.saveState(),!0}resetAll(){this.state=this.getDefaultState(),this.saveState()}getStats(){const e={},a=this.state.playerCount;for(let t=1;t<=a;t++)e[t]={player:t,playCount:0,restCount:0};for(const t of this.state.gameHistory){const s=[...t.team1,...t.team2];for(const n of s)e[n]&&e[n].playCount++;for(const n of t.restPlayers)e[n]&&e[n].restCount++}return e}}function X({store:c,onStart:e}){let a=c.state.playerCount||6;const t=c.state.gameHistory.length>0,s=document.createElement("div");s.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const n=()=>{s.innerHTML=`
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
            ${[4,5,6,7,8].map(d=>`
              <button
                data-count="${d}"
                class="count-btn py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${a===d?"bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300":"bg-slate-800/80 text-slate-300 hover:bg-slate-700 active:scale-95"}"
              >
                ${d}人
              </button>
            `).join("")}
          </div>
          <div class="text-xs text-slate-400 bg-slate-900/60 py-2.5 px-4 rounded-xl border border-slate-800">
            試合出場：<span class="text-emerald-400 font-bold">4人</span> ／ 休憩：<span class="text-amber-400 font-bold">${a-4}人</span>
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
    `,s.querySelectorAll(".count-btn").forEach(d=>{d.addEventListener("click",o=>{a=parseInt(o.currentTarget.dataset.count,10),n()})});const i=s.querySelector("#btn-start");i&&i.addEventListener("click",()=>{e(a,!1)});const r=s.querySelector("#btn-resume");r&&r.addEventListener("click",()=>{e(c.state.playerCount,!0)})};return n(),s}function ee({store:c,onConfirmMatch:e,onUndoMatch:a,onGoHistory:t,onGoHome:s}){const n=c.state.playerCount,i=c.state.gameHistory||[],r=n-4;let d=[];const o=document.createElement("div");o.className="flex-1 flex flex-col justify-between p-6 animate-slide-up overflow-y-auto no-scrollbar space-y-6";const m=()=>{const x=c.state.manualRestPlayers||[],l=x.length;let u=c.state.currentGame;u?u={...u}:u=c.generateNextCurrentGame();const{gameNumber:v,team1:C,team2:R,restPlayers:S,manualRestPlayers:y,autoRestPlayers:k}=u,p=y&&y.length>0?y.join("、"):"なし",b=k&&k.length>0?k.join("、"):"なし";o.innerHTML=`
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
            <span>対戦履歴 (${i.length} 試合完了)</span>
          </h3>
          <button id="btn-view-stats" class="text-[11px] text-slate-400 hover:text-white underline">
            参加状況詳細
          </button>
        </div>

        ${i.length===0?`
          <div class="py-4 text-center text-slate-500 text-xs">
            確定済みの試合履歴はまだありません。
          </div>
        `:`
          <div class="space-y-2.5">
            ${i.map(f=>`
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
              手動: ${l}人 / 最大${r}人
            </span>
          </div>

          <!-- Rest Player Option Buttons (Inline 1~N) -->
          <div class="grid grid-cols-6 gap-2 pt-1">
            ${Array.from({length:n},(f,h)=>h+1).map(f=>{const h=x.includes(f),w=!h&&l>=r;return`
                <button
                  data-manual-rest="${f}"
                  ${w?"disabled":""}
                  class="manual-rest-toggle-btn py-2.5 rounded-xl font-black text-base transition-all duration-150 flex flex-col items-center justify-center ${h?"bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-300":w?"bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50":"bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700/60 active:scale-95"}"
                >
                  <span>${f}</span>
                  ${h?'<span class="text-[9px] font-extrabold text-amber-950">固定</span>':""}
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
              第 ${v} ゲームの組み合わせ
            </h3>
          </div>
        </div>

        <!-- Horizontal Court Container -->
        <div class="court-card rounded-3xl p-5 border shadow-2xl">
          <!-- Horizontal Players Row: [ Team A (2) ]  VS  [ Team B (2) ] -->
          <div class="flex items-center justify-around py-2 px-1">
            <!-- Team A Players -->
            <div class="flex space-x-2">
              ${g(C[0],"t1-0")}
              ${g(C[1],"t1-1")}
            </div>

            <!-- VS Badge -->
            <div class="px-2 flex flex-col items-center justify-center">
              <span class="bg-slate-900/90 text-amber-400 text-xs font-black tracking-widest px-2.5 py-1 rounded-full border border-amber-500/40 shadow-inner">
                VS
              </span>
            </div>

            <!-- Team B Players -->
            <div class="flex space-x-2">
              ${g(R[0],"t2-0")}
              ${g(R[1],"t2-1")}
            </div>
          </div>
        </div>

        <!-- Rest Players Info Panel -->
        <div class="glass-panel rounded-2xl p-3.5 text-xs space-y-2">
          ${S&&S.length>0?`
            <div class="flex items-center space-x-2">
              ${S.map((f,h)=>M(f,`rest-${h}`)).join("")}
            </div>
          `:`
            <div class="text-slate-400 italic text-xs">全員出場中</div>
          `}

          ${r>0?`
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動固定：<strong class="text-amber-300">${p}</strong></span>
              <span>自動補充：<strong class="text-teal-300">${b}</strong></span>
            </div>
          `:""}
        </div>

        <!-- Reroll Button (Re-evaluates rest players as well except manual fixed ones) -->
        <button
          id="btn-reroll"
          class="w-full py-3.5 rounded-xl font-bold text-xs bg-slate-800/90 text-emerald-400 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>組み合わせを再抽選 (休憩者含む)</span>
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
          <span>この組み合わせで確定 (第${v}G)</span>
        </button>

        ${i.length>0?`
          <button
            id="btn-undo-main"
            class="w-full py-3 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${i.length}G)</span>
          </button>
        `:""}
      </div>
    `;function g(f,h){const w=d.includes(h);return`
        <button
          data-slot="${h}"
          class="player-slot w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${w?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce":"bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600/50 active:scale-95"}"
        >
          ${f}
        </button>
      `}function M(f,h){const w=d.includes(h);return`
        <button
          data-slot="${h}"
          class="player-slot px-3.5 py-2 rounded-xl font-bold text-sm flex items-center space-x-1 transition-all duration-200 shadow-sm ${w?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-105 animate-pulse":"bg-slate-800/90 text-amber-300 border border-amber-500/30 hover:bg-slate-700/90 active:scale-95"}"
        >
          <span class="text-[10px] text-slate-400 font-normal">休</span>
          <span class="font-black text-base">${f}</span>
        </button>
      `}o.querySelectorAll(".manual-rest-toggle-btn").forEach(f=>{f.addEventListener("click",h=>{const w=parseInt(h.currentTarget.dataset.manualRest,10);c.toggleManualRestPlayer(w),m()})}),o.querySelectorAll(".player-slot").forEach(f=>{f.addEventListener("click",h=>{const w=h.currentTarget.dataset.slot;d.includes(w)?d=d.filter(L=>L!==w):(d.push(w),d.length===2&&(O(d[0],d[1]),d=[])),m()})});function O(f,h){const w=P=>{if(P==="t1-0")return u.team1[0];if(P==="t1-1")return u.team1[1];if(P==="t2-0")return u.team2[0];if(P==="t2-1")return u.team2[1];if(P.startsWith("rest-")){const j=parseInt(P.replace("rest-",""),10);return u.restPlayers[j]}},L=(P,j)=>{if(P==="t1-0")u.team1[0]=j;else if(P==="t1-1")u.team1[1]=j;else if(P==="t2-0")u.team2[0]=j;else if(P==="t2-1")u.team2[1]=j;else if(P.startsWith("rest-")){const D=parseInt(P.replace("rest-",""),10);u.restPlayers[D]=j,u.restPlayers.sort((z,V)=>z-V)}},U=w(f),K=w(h);L(f,K),L(h,U),u.lastDisplayedKey=G(u.team1,u.team2),c.setCurrentGame(u)}const H=o.querySelector("#btn-reroll");H&&H.addEventListener("click",()=>{c.rerollCurrentGame(),d=[],m()});const E=o.querySelector("#btn-confirm-match");E&&E.addEventListener("click",()=>{c.setCurrentGame(u),e()});const B=o.querySelector("#btn-undo-main");B&&B.addEventListener("click",()=>{a()});const T=o.querySelector("#btn-view-stats");T&&T.addEventListener("click",t);const N=o.querySelector("#btn-home");N&&N.addEventListener("click",s);const A=o.querySelector("#btn-history");A&&A.addEventListener("click",t)};return m(),o}function te({store:c,onUndo:e,onReset:a,onBack:t}){const s=document.createElement("div");s.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const n=c.state.gameHistory||[],i=c.getStats(),r=c.state.playerCount;return(()=>{s.innerHTML=`
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
            <span class="text-xs text-slate-400">累計 ${n.length} 試合</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${Array.from({length:r},(l,u)=>u+1).map(l=>{const u=i[l]||{playCount:0,restCount:0};return`
                <div class="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                      ${l}
                    </span>
                  </div>
                  <div class="text-right text-xs">
                    <span class="text-slate-200 font-bold">出場 ${u.playCount}回</span>
                    <span class="text-slate-500 mx-1">/</span>
                    <span class="text-amber-400 font-medium">休憩 ${u.restCount}回</span>
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

          ${n.length===0?`
            <div class="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
              確定済みの試合データがまだありません。
            </div>
          `:`
            <div class="space-y-3">
              ${[...n].reverse().map(l=>`
                <div class="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                      第 ${l.gameNumber} ゲーム
                    </span>
                  </div>

                  <!-- Teams Match Display -->
                  <div class="flex items-center justify-around py-2 text-base font-black text-white">
                    <div class="text-emerald-300">
                      ${l.team1[0]} ・ ${l.team1[1]}
                    </div>
                    <div class="text-xs font-black text-slate-500 px-2">VS</div>
                    <div class="text-teal-300">
                      ${l.team2[0]} ・ ${l.team2[1]}
                    </div>
                  </div>

                  <!-- Rest info -->
                  <div class="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span>休憩：<strong class="text-amber-400 font-bold">${l.restPlayers&&l.restPlayers.length>0?l.restPlayers.join("、"):"なし"}</strong></span>
                    ${l.manuallySelectedRestPlayers&&l.manuallySelectedRestPlayers.length>0?`
                      <span class="text-[10px] text-slate-500">手動指定: ${l.manuallySelectedRestPlayers.join("、")}</span>
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
        ${n.length>0?`
          <button
            id="btn-undo"
            class="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${n.length}ゲーム)</span>
          </button>
        `:""}

        <button
          id="btn-reset"
          class="w-full py-3 rounded-2xl font-semibold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all"
        >
          最初からやり直す (データ全リセット)
        </button>
      </div>
    `;const o=s.querySelector("#btn-back");o&&o.addEventListener("click",t);const m=s.querySelector("#btn-undo");m&&m.addEventListener("click",()=>{confirm(`最新の第 ${n.length} ゲームの確定を取り消して巻き戻しますか？`)&&e()});const x=s.querySelector("#btn-reset");x&&x.addEventListener("click",()=>{confirm("すべての対戦履歴と進行状況をリセットして、最初からやり直しますか？")&&a()})})(),s}function se(c){let e=null;return{showToast(a,t="info",s=3e3){e&&e.remove(),e=document.createElement("div"),e.className=`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl font-semibold text-sm shadow-2xl backdrop-blur-md border animate-slide-up flex items-center space-x-2 ${t==="success"?"bg-emerald-900/90 text-emerald-200 border-emerald-500/50":t==="amber"?"bg-amber-900/90 text-amber-200 border-amber-500/50":"bg-slate-800/90 text-slate-100 border-slate-700"}`,e.innerHTML=`
        <span>${a}</span>
      `,c.appendChild(e),setTimeout(()=>{e&&(e.classList.add("opacity-0","transition-opacity","duration-300"),setTimeout(()=>e==null?void 0:e.remove(),300))},s)},showUpdatePrompt(a){const t=document.createElement("div");t.className="fixed top-4 inset-x-4 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl flex items-center justify-between animate-slide-up",t.innerHTML=`
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-xs font-bold text-slate-100">新しいバージョンがあります</span>
        </div>
        <button id="btn-pwa-update" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-emerald-400">
          更新する
        </button>
      `,c.appendChild(t),t.querySelector("#btn-pwa-update").addEventListener("click",()=>{t.remove(),a()})}}}function ae(c){const e=new Q,a=se(c);e.state.currentStep!=="start"&&e.state.currentStep!=="history"&&(e.state.currentStep="main");function t(){c.innerHTML="";const s=e.state.currentStep;let n=null;s==="start"?n=X({store:e,onStart:(i,r)=>{r||(e.state.gameHistory=[],e.state.currentGame=null,e.state.manualRestPlayers=[]),e.setPlayerCount(i),t()}}):s==="main"?n=ee({store:e,onConfirmMatch:()=>{const i=e.state.gameHistory.length+1;e.confirmCurrentGame(),a.showToast(`第 ${i} ゲームの組み合わせを確定しました`,"success"),t()},onUndoMatch:()=>{e.undoLastGame()&&(a.showToast("直前の確定を取り消しました","amber"),t())},onGoHistory:()=>{e.setStep("history"),t()},onGoHome:()=>{e.setStep("start"),t()}}):s==="history"&&(n=te({store:e,onUndo:()=>{e.undoLastGame()&&(a.showToast("直前の確定を取り消しました","amber"),t())},onReset:()=>{e.resetAll(),a.showToast("初期状態にリセットしました","info"),t()},onBack:()=>{e.setStep("main"),t()}})),n&&c.appendChild(n)}return t(),{render:t,toastManager:a}}const re="modulepreload",ne=function(c){return"/TennisPairing/"+c},q={},oe=function(e,a,t){let s=Promise.resolve();if(a&&a.length>0){let i=function(o){return Promise.all(o.map(m=>Promise.resolve(m).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=i(a.map(o=>{if(o=ne(o),o in q)return;q[o]=!0;const m=o.endsWith(".css"),x=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${x}`))return;const l=document.createElement("link");if(l.rel=m?"stylesheet":re,m||(l.as="script"),l.crossOrigin="",l.href=o,d&&l.setAttribute("nonce",d),document.head.appendChild(l),m)return new Promise((u,v)=>{l.addEventListener("load",u),l.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return s.then(i=>{for(const r of i||[])r.status==="rejected"&&n(r.reason);return e().catch(n)})};function le(c={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:t,onRegistered:s,onRegisteredSW:n,onRegisterError:i}=c;let r,d,o;const m=async(l=!0)=>{await d,o==null||o()};async function x(){if("serviceWorker"in navigator){if(r=await oe(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-BBnX5xw4.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/TennisPairing/sw.js",{scope:"/TennisPairing/",type:"classic"})).catch(l=>{i==null||i(l)}),!r)return;o=()=>{r==null||r.messageSkipWaiting()};{let l=!1;const u=()=>{l=!0,r==null||r.addEventListener("controlling",v=>{v.isUpdate&&window.location.reload()}),a==null||a()};r.addEventListener("installed",v=>{typeof v.isUpdate>"u"?typeof v.isExternal<"u"&&v.isExternal?u():!l&&(t==null||t()):v.isUpdate||t==null||t()}),r.addEventListener("waiting",u)}r.register({immediate:e}).then(l=>{n?n("/TennisPairing/sw.js",l):s==null||s(l)}).catch(l=>{i==null||i(l)})}}return d=x(),m}document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("app");if(!c)return;const e=ae(c),a=le({onNeedRefresh(){e.toastManager.showUpdatePrompt(()=>{a(!0)})},onOfflineReady(){console.log("App is ready for offline use.")}})});
