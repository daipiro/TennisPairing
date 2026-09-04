(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();function K(c){const[e,n,s,a]=c;return[{team1:[e,n],team2:[s,a]},{team1:[e,s],team2:[n,a]},{team1:[e,a],team2:[n,s]}].map(i=>{const r=[...i.team1].sort((l,p)=>l-p),m=[...i.team2].sort((l,p)=>l-p),[t,d]=[r,m].sort((l,p)=>l[0]-p[0]||l[1]-p[1]),u=`${t[0]}-${t[1]}_vs_${d[0]}-${d[1]}`;return{team1:i.team1,team2:i.team2,key:u}})}function g(c,e){return c<e?`${c}-${e}`:`${e}-${c}`}function R(c,e){const n=[...c].sort((i,r)=>i-r),s=[...e].sort((i,r)=>i-r),[a,o]=[n,s].sort((i,r)=>i[0]-r[0]||i[1]-r[1]);return`${a[0]}-${a[1]}_vs_${o[0]}-${o[1]}`}function z(c){const e={},n={},s={},a=(r,m)=>{const t=g(r,m);return e[t]||0},o=(r,m)=>{const t=g(r,m);return n[t]||0},i=r=>s[r]||0;for(const r of c){const{team1:m,team2:t}=r,d=g(m[0],m[1]),u=g(t[0],t[1]);e[d]=(e[d]||0)+1,e[u]=(e[u]||0)+1;for(const p of m)for(const x of t){const w=g(p,x);n[w]=(n[w]||0)+1}const l=R(m,t);s[l]=(s[l]||0)+1}return{pairCounts:e,opponentCounts:n,cardCounts:s,getPair:a,getOpponent:o,getCard:i}}function V(c,e,n=null){const{team1:s,team2:a,key:o}=c,{getPair:i,getOpponent:r,getCard:m}=z(e),t=i(s[0],s[1])+i(a[0],a[1]),d=r(s[0],a[0])+r(s[0],a[1])+r(s[1],a[0])+r(s[1],a[1]),u=m(o);let l=0,p=!1;if(e.length>0){const h=e[e.length-1],S=g(h.team1[0],h.team1[1]),k=g(h.team2[0],h.team2[1]),P=g(s[0],s[1]),$=g(a[0],a[1]);(P===S||P===k)&&l++,($===S||$===k)&&l++;const C=R(h.team1,h.team2);o===C&&(p=!0)}const x=n&&o===n;return{score:t*100+d*10+u*30+l*300+(p?500:0)+(x?200:0),breakdown:{pairRepetition:t,oppRepetition:d,sameCardCount:u,lastGameSamePairCount:l,lastGameSameCard:p,isSameAsLastDisplayed:x}}}function W(c,e=[]){const n=c-4;if(n<=0)return{restPlayers:[],manualRestPlayers:[],autoRestPlayers:[]};const s=new Set(e.filter(t=>t>=1&&t<=c)),a=n-s.size;if(a<=0){const t=Array.from(s).sort((d,u)=>d-u);return{restPlayers:t,manualRestPlayers:t,autoRestPlayers:[]}}const o=[];for(let t=1;t<=c;t++)s.has(t)||o.push(t);const i=[...o];for(let t=i.length-1;t>0;t--){const d=Math.floor(Math.random()*(t+1));[i[t],i[d]]=[i[d],i[t]]}const r=i.slice(0,a).sort((t,d)=>t-d);return{restPlayers:[...Array.from(s),...r].sort((t,d)=>t-d),manualRestPlayers:Array.from(s).sort((t,d)=>t-d),autoRestPlayers:r}}function I(c,e,n=null){const a=K(c).map(t=>{const{score:d,breakdown:u}=V(t,e,n);return{...t,score:d,breakdown:u}}),i=Math.min(...a.map(t=>t.score))+20,r=a.filter(t=>t.score<=i),m=Math.floor(Math.random()*r.length);return r[m]}const _="tennis_pairing_app_state_v1";class F{constructor(){this.state=this.loadState(),this.state.currentStep!=="start"&&!this.state.currentGame&&this.generateNextCurrentGame()}getDefaultState(){return{playerCount:6,currentStep:"start",gameHistory:[],manualRestPlayers:[],currentGame:null}}loadState(){try{const e=localStorage.getItem(_);if(e){const n=JSON.parse(e);return n.manualRestPlayers||(n.manualRestPlayers=[]),(n.currentStep==="match_setup"||n.currentStep==="match_confirm")&&(n.currentStep="main"),n}}catch(e){console.error("Failed to load state from localStorage:",e)}return this.getDefaultState()}saveState(){try{localStorage.setItem(_,JSON.stringify(this.state))}catch(e){console.error("Failed to save state to localStorage:",e)}}setPlayerCount(e){this.state.playerCount=e;const n=e-4;this.state.manualRestPlayers=(this.state.manualRestPlayers||[]).filter(s=>s<=e).slice(0,Math.max(0,n)),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}generateNextCurrentGame(){const e=this.state.playerCount,n=this.state.gameHistory.length+1,{restPlayers:s,manualRestPlayers:a,autoRestPlayers:o}=W(e,this.state.manualRestPlayers||[]),i=[];for(let m=1;m<=e;m++)s.includes(m)||i.push(m);const r=I(i,this.state.gameHistory);return this.state.currentGame={gameNumber:n,restPlayers:s,manualRestPlayers:a,autoRestPlayers:o,team1:r.team1,team2:r.team2,lastDisplayedKey:r.key},this.saveState(),this.state.currentGame}setManualRestPlayers(e){this.state.manualRestPlayers=[...e].sort((n,s)=>n-s),this.generateNextCurrentGame(),this.saveState()}setStep(e){this.state.currentStep=e,this.saveState()}setCurrentGame(e){this.state.currentGame=e,this.saveState()}confirmCurrentGame(){if(!this.state.currentGame)return;const n={gameNumber:this.state.gameHistory.length+1,team1:[...this.state.currentGame.team1],team2:[...this.state.currentGame.team2],restPlayers:[...this.state.currentGame.restPlayers],manuallySelectedRestPlayers:[...this.state.currentGame.manualRestPlayers||[]]};this.state.gameHistory.push(n),this.state.currentGame=null,this.generateNextCurrentGame(),this.state.currentStep="main",this.saveState()}undoLastGame(){if(this.state.gameHistory.length===0)return!1;const e=this.state.gameHistory.pop(),n=e.manuallySelectedRestPlayers||[],s=e.restPlayers||[],a=s.filter(o=>!n.includes(o));return this.state.currentGame={gameNumber:e.gameNumber,team1:e.team1,team2:e.team2,restPlayers:s,manualRestPlayers:n,autoRestPlayers:a,lastDisplayedKey:null},this.state.currentStep="main",this.saveState(),!0}resetAll(){this.state=this.getDefaultState(),this.saveState()}getStats(){const e={},n=this.state.playerCount;for(let s=1;s<=n;s++)e[s]={player:s,playCount:0,restCount:0};for(const s of this.state.gameHistory){const a=[...s.team1,...s.team2];for(const o of a)e[o]&&e[o].playCount++;for(const o of s.restPlayers)e[o]&&e[o].restCount++}return e}}function J({store:c,onStart:e}){let n=c.state.playerCount||6;const s=c.state.gameHistory.length>0,a=document.createElement("div");a.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const o=()=>{a.innerHTML=`
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
          <span>${s?"新しくゲームを開始":"開始する"}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>

        ${s?`
          <button
            id="btn-resume"
            class="w-full py-3.5 rounded-2xl font-bold text-slate-300 bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/90 active:scale-[0.99] transition-all duration-150"
          >
            現在のゲームを継続 (${c.state.gameHistory.length}試合完了)
          </button>
        `:""}
      </div>
    `,a.querySelectorAll(".count-btn").forEach(m=>{m.addEventListener("click",t=>{n=parseInt(t.currentTarget.dataset.count,10),o()})});const i=a.querySelector("#btn-start");i&&i.addEventListener("click",()=>{e(n,!1)});const r=a.querySelector("#btn-resume");r&&r.addEventListener("click",()=>{e(c.state.playerCount,!0)})};return o(),a}function Y({store:c,onConfirmMatch:e,onGoRestOption:n,onGoHistory:s,onGoHome:a}){const o=c.state.playerCount,i=c.state.gameHistory||[],r=o-4,m=c.state.manualRestPlayers||[];let t=c.state.currentGame;t?t={...t}:t=c.generateNextCurrentGame();let d=[];const u=document.createElement("div");u.className="flex-1 flex flex-col justify-between p-6 animate-slide-up overflow-y-auto no-scrollbar space-y-6";const l=()=>{m.length;const{gameNumber:p,team1:x,team2:w,restPlayers:h,manualRestPlayers:S,autoRestPlayers:k}=t,P=S&&S.length>0?S.join("、"):"なし",$=k&&k.length>0?k.join("、"):"なし";u.innerHTML=`
      <!-- Top Navigation Header -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-3 shrink-0">
        <button id="btn-home" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
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

      <!-- 2. Middle Section: Current Generated Match Card (Inline Court Representation) -->
      <div class="space-y-3 shrink-0">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <h3 class="font-extrabold text-sm text-white">
              第 ${p} ゲームの組み合わせ
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
              ${C(x[0],"t1-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${C(x[1],"t1-1")}
            </div>
          </div>

          <!-- Team 2 (Bottom Court) -->
          <div class="mt-9 text-center space-y-2">
            <div class="flex items-center justify-center space-x-4">
              ${C(w[0],"t2-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${C(w[1],"t2-1")}
            </div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-teal-400/90">TEAM B</span>
          </div>
        </div>

        <!-- Rest & Options Info Panel -->
        <div class="glass-panel rounded-2xl p-4 text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-300">休憩プレイヤー:</span>
            <span class="font-extrabold text-amber-400 text-sm">
              ${h&&h.length>0?h.join(" 、 "):"なし"}
            </span>
          </div>
          ${r>0?`
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動固定：<strong class="text-amber-300">${P}</strong></span>
              <span>自動補充：<strong class="text-teal-300">${$}</strong></span>
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

      <!-- 3. Bottom Action Buttons: Confirm Match & Options -->
      <div class="space-y-2.5 pt-2 border-t border-slate-800/60 shrink-0 pb-2">
        <button
          id="btn-confirm-match"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>この組み合わせで確定 (第${p}G)</span>
        </button>

        ${r>0?`
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
    `;function C(f,v){const b=d.includes(v);return`
        <button
          data-slot="${v}"
          class="player-slot w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${b?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce":"bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600/50 active:scale-95"}"
        >
          ${f}
        </button>
      `}u.querySelectorAll(".player-slot").forEach(f=>{f.addEventListener("click",v=>{const b=v.currentTarget.dataset.slot;d.includes(b)?d=d.filter(j=>j!==b):(d.push(b),d.length===2&&(O(d[0],d[1]),d=[])),l()})});function O(f,v){const b=y=>{if(y==="t1-0")return t.team1[0];if(y==="t1-1")return t.team1[1];if(y==="t2-0")return t.team2[0];if(y==="t2-1")return t.team2[1]},j=(y,M)=>{y==="t1-0"&&(t.team1[0]=M),y==="t1-1"&&(t.team1[1]=M),y==="t2-0"&&(t.team2[0]=M),y==="t2-1"&&(t.team2[1]=M)},U=b(f),D=b(v);j(f,D),j(v,U),t.lastDisplayedKey=R(t.team1,t.team2),c.setCurrentGame(t)}const L=u.querySelector("#btn-reroll");L&&L.addEventListener("click",()=>{const f=[...t.team1,...t.team2],v=t.lastDisplayedKey||R(t.team1,t.team2),b=I(f,c.state.gameHistory,v);t.team1=b.team1,t.team2=b.team2,t.lastDisplayedKey=b.key,d=[],c.setCurrentGame(t),l()});const E=u.querySelector("#btn-clear-swap");E&&E.addEventListener("click",()=>{d=[],l()});const G=u.querySelector("#btn-confirm-match");G&&G.addEventListener("click",()=>{c.setCurrentGame(t),e()});const B=u.querySelector("#btn-open-rest-option");B&&B.addEventListener("click",n);const H=u.querySelector("#btn-option-secondary");H&&H.addEventListener("click",n);const N=u.querySelector("#btn-view-stats");N&&N.addEventListener("click",s);const T=u.querySelector("#btn-home");T&&T.addEventListener("click",a);const A=u.querySelector("#btn-history");A&&A.addEventListener("click",s)};return l(),u}function Q({store:c,onSaveAndBack:e}){const n=c.state.playerCount,s=n-4,a=new Set(c.state.manualRestPlayers||[]),o=document.createElement("div");o.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const i=()=>{const r=a.size;o.innerHTML=`
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

        ${s>0?`
          <!-- Player Selection Grid -->
          <div class="grid grid-cols-4 gap-3">
            ${Array.from({length:n},(d,u)=>u+1).map(d=>{const u=a.has(d),l=!u&&r>=s;return`
                <button
                  data-player="${d}"
                  ${l?"disabled":""}
                  class="player-option-btn relative py-5 rounded-2xl font-extrabold text-2xl transition-all duration-200 flex flex-col items-center justify-center ${u?"bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300":l?"bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50":"bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border border-slate-700/60 active:scale-95"}"
                >
                  <span>${d}</span>
                  ${u?'<span class="text-[10px] uppercase font-bold tracking-tight bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded-full mt-1">固定指定</span>':""}
                </button>
              `}).join("")}
          </div>

          <!-- Status Box -->
          <div class="glass-panel rounded-2xl p-4 text-xs space-y-2">
            <div class="flex items-center justify-between text-slate-300">
              <span>固定休憩指定:</span>
              <span class="font-bold text-amber-400">${r}人 ／ 最大${s}人</span>
            </div>
            <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              ${r<s?`※ 残り ${s-r} 名分はゲーム生成時に自動ランダム選出されます`:"※ 必要な休憩者が全員手動で固定されています"}
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
    `,o.querySelectorAll(".player-option-btn").forEach(d=>{d.addEventListener("click",u=>{const l=parseInt(u.currentTarget.dataset.player,10);a.has(l)?a.delete(l):a.size<s&&a.add(l),i()})});const m=o.querySelector("#btn-save-option");m&&m.addEventListener("click",()=>{const d=Array.from(a);c.setManualRestPlayers(d),e()});const t=o.querySelector("#btn-cancel");t&&t.addEventListener("click",()=>{e()})};return i(),o}function X({store:c,onUndo:e,onReset:n,onBack:s}){const a=document.createElement("div");a.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const o=c.state.gameHistory||[],i=c.getStats(),r=c.state.playerCount;return(()=>{a.innerHTML=`
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
            <span class="text-xs text-slate-400">累計 ${o.length} 試合</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${Array.from({length:r},(l,p)=>p+1).map(l=>{const p=i[l]||{playCount:0,restCount:0};return`
                <div class="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                      ${l}
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

          ${o.length===0?`
            <div class="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
              確定済みの試合データがまだありません。
            </div>
          `:`
            <div class="space-y-3">
              ${[...o].reverse().map(l=>`
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
        ${o.length>0?`
          <button
            id="btn-undo"
            class="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${o.length}ゲーム)</span>
          </button>
        `:""}

        <button
          id="btn-reset"
          class="w-full py-3 rounded-2xl font-semibold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all"
        >
          最初からやり直す (データ全リセット)
        </button>
      </div>
    `;const t=a.querySelector("#btn-back");t&&t.addEventListener("click",s);const d=a.querySelector("#btn-undo");d&&d.addEventListener("click",()=>{confirm(`最新の第 ${o.length} ゲームの確定を取り消して巻き戻しますか？`)&&e()});const u=a.querySelector("#btn-reset");u&&u.addEventListener("click",()=>{confirm("すべての対戦履歴と進行状況をリセットして、最初からやり直しますか？")&&n()})})(),a}function Z(c){let e=null;return{showToast(n,s="info",a=3e3){e&&e.remove(),e=document.createElement("div"),e.className=`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl font-semibold text-sm shadow-2xl backdrop-blur-md border animate-slide-up flex items-center space-x-2 ${s==="success"?"bg-emerald-900/90 text-emerald-200 border-emerald-500/50":s==="amber"?"bg-amber-900/90 text-amber-200 border-amber-500/50":"bg-slate-800/90 text-slate-100 border-slate-700"}`,e.innerHTML=`
        <span>${n}</span>
      `,c.appendChild(e),setTimeout(()=>{e&&(e.classList.add("opacity-0","transition-opacity","duration-300"),setTimeout(()=>e==null?void 0:e.remove(),300))},a)},showUpdatePrompt(n){const s=document.createElement("div");s.className="fixed top-4 inset-x-4 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl flex items-center justify-between animate-slide-up",s.innerHTML=`
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-xs font-bold text-slate-100">新しいバージョンがあります</span>
        </div>
        <button id="btn-pwa-update" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-emerald-400">
          更新する
        </button>
      `,c.appendChild(s),s.querySelector("#btn-pwa-update").addEventListener("click",()=>{s.remove(),n()})}}}function ee(c){const e=new F,n=Z(c);e.state.currentStep!=="start"&&e.state.currentStep!=="rest_option"&&e.state.currentStep!=="history"&&(e.state.currentStep="main");function s(){c.innerHTML="";const a=e.state.currentStep;let o=null;a==="start"?o=J({store:e,onStart:(i,r)=>{r||(e.state.gameHistory=[],e.state.currentGame=null,e.state.manualRestPlayers=[]),e.setPlayerCount(i),s()}}):a==="main"?o=Y({store:e,onConfirmMatch:()=>{const i=e.state.gameHistory.length+1;e.confirmCurrentGame(),n.showToast(`第 ${i} ゲームの組み合わせを確定しました`,"success"),s()},onGoRestOption:()=>{e.setStep("rest_option"),s()},onGoHistory:()=>{e.setStep("history"),s()},onGoHome:()=>{e.setStep("start"),s()}}):a==="rest_option"?o=Q({store:e,onSaveAndBack:()=>{e.setStep("main"),s()}}):a==="history"&&(o=X({store:e,onUndo:()=>{e.undoLastGame()&&(n.showToast("直前の確定を取り消しました","amber"),s())},onReset:()=>{e.resetAll(),n.showToast("初期状態にリセットしました","info"),s()},onBack:()=>{e.setStep("main"),s()}})),o&&c.appendChild(o)}return s(),{render:s,toastManager:n}}const te="modulepreload",se=function(c){return"/"+c},q={},ae=function(e,n,s){let a=Promise.resolve();if(n&&n.length>0){let i=function(t){return Promise.all(t.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),m=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=i(n.map(t=>{if(t=se(t),t in q)return;q[t]=!0;const d=t.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${u}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":te,d||(l.as="script"),l.crossOrigin="",l.href=t,m&&l.setAttribute("nonce",m),document.head.appendChild(l),d)return new Promise((p,x)=>{l.addEventListener("load",p),l.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${t}`)))})}))}function o(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return a.then(i=>{for(const r of i||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};function re(c={}){const{immediate:e=!1,onNeedRefresh:n,onOfflineReady:s,onRegistered:a,onRegisteredSW:o,onRegisterError:i}=c;let r,m,t;const d=async(l=!0)=>{await m,t==null||t()};async function u(){if("serviceWorker"in navigator){if(r=await ae(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-BBnX5xw4.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/sw.js",{scope:"/",type:"classic"})).catch(l=>{i==null||i(l)}),!r)return;t=()=>{r==null||r.messageSkipWaiting()};{let l=!1;const p=()=>{l=!0,r==null||r.addEventListener("controlling",x=>{x.isUpdate&&window.location.reload()}),n==null||n()};r.addEventListener("installed",x=>{typeof x.isUpdate>"u"?typeof x.isExternal<"u"&&x.isExternal?p():!l&&(s==null||s()):x.isUpdate||s==null||s()}),r.addEventListener("waiting",p)}r.register({immediate:e}).then(l=>{o?o("/sw.js",l):a==null||a(l)}).catch(l=>{i==null||i(l)})}}return m=u(),d}document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("app");if(!c)return;const e=ee(c),n=re({onNeedRefresh(){e.toastManager.showUpdatePrompt(()=>{n(!0)})},onOfflineReady(){console.log("App is ready for offline use.")}})});
