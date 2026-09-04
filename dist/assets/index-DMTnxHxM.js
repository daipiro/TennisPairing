(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=i(t);fetch(t.href,n)}})();const H="tennis_pairing_app_state_v1";class T{constructor(){this.state=this.loadState()}getDefaultState(){return{playerCount:6,currentStep:"start",gameHistory:[],currentGame:null}}loadState(){try{const e=localStorage.getItem(H);if(e)return JSON.parse(e)}catch(e){console.error("Failed to load state from localStorage:",e)}return this.getDefaultState()}saveState(){try{localStorage.setItem(H,JSON.stringify(this.state))}catch(e){console.error("Failed to save state to localStorage:",e)}}setPlayerCount(e){this.state.playerCount=e,this.state.currentStep="rest_selection",this.saveState()}setStep(e){this.state.currentStep=e,this.saveState()}setCurrentGame(e){this.state.currentGame=e,this.saveState()}confirmCurrentGame(){if(!this.state.currentGame)return;const i={gameNumber:this.state.gameHistory.length+1,team1:[...this.state.currentGame.team1],team2:[...this.state.currentGame.team2],restPlayers:[...this.state.currentGame.restPlayers],manuallySelectedRestPlayers:[...this.state.currentGame.manualRestPlayers||[]]};this.state.gameHistory.push(i),this.state.currentGame=null,this.state.currentStep="rest_selection",this.saveState()}undoLastGame(){if(this.state.gameHistory.length===0)return!1;const e=this.state.gameHistory.pop(),i=e.manuallySelectedRestPlayers||[],s=e.restPlayers||[],t=s.filter(n=>!i.includes(n));return this.state.currentGame={gameNumber:e.gameNumber,team1:e.team1,team2:e.team2,restPlayers:s,manualRestPlayers:i,autoRestPlayers:t,lastDisplayedKey:null},this.state.currentStep="match_confirm",this.saveState(),!0}resetAll(){this.state=this.getDefaultState(),this.saveState()}getStats(){const e={},i=this.state.playerCount;for(let s=1;s<=i;s++)e[s]={player:s,playCount:0,restCount:0};for(const s of this.state.gameHistory){const t=[...s.team1,...s.team2];for(const n of t)e[n]&&e[n].playCount++;for(const n of s.restPlayers)e[n]&&e[n].restCount++}return e}}function A({store:c,onStart:e}){let i=c.state.playerCount||6;const s=c.state.gameHistory.length>0,t=document.createElement("div");t.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const n=()=>{t.innerHTML=`
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
                class="count-btn py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${i===u?"bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300":"bg-slate-800/80 text-slate-300 hover:bg-slate-700 active:scale-95"}"
              >
                ${u}人
              </button>
            `).join("")}
          </div>
          <div class="text-xs text-slate-400 bg-slate-900/60 py-2.5 px-4 rounded-xl border border-slate-800">
            試合出場：<span class="text-emerald-400 font-bold">4人</span> ／ 休憩：<span class="text-amber-400 font-bold">${i-4}人</span>
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
    `,t.querySelectorAll(".count-btn").forEach(u=>{u.addEventListener("click",o=>{i=parseInt(o.currentTarget.dataset.count,10),n()})});const r=t.querySelector("#btn-start");r&&r.addEventListener("click",()=>{e(i,!1)});const a=t.querySelector("#btn-resume");a&&a.addEventListener("click",()=>{e(c.state.playerCount,!0)})};return n(),t}function N(c){const[e,i,s,t]=c;return[{team1:[e,i],team2:[s,t]},{team1:[e,s],team2:[i,t]},{team1:[e,t],team2:[i,s]}].map(r=>{const a=[...r.team1].sort((l,p)=>l-p),u=[...r.team2].sort((l,p)=>l-p),[o,d]=[a,u].sort((l,p)=>l[0]-p[0]||l[1]-p[1]),m=`${o[0]}-${o[1]}_vs_${d[0]}-${d[1]}`;return{team1:r.team1,team2:r.team2,key:m}})}function k(c,e){return c<e?`${c}-${e}`:`${e}-${c}`}function M(c,e){const i=[...c].sort((r,a)=>r-a),s=[...e].sort((r,a)=>r-a),[t,n]=[i,s].sort((r,a)=>r[0]-a[0]||r[1]-a[1]);return`${t[0]}-${t[1]}_vs_${n[0]}-${n[1]}`}function q(c){const e={},i={},s={},t=(a,u)=>{const o=k(a,u);return e[o]||0},n=(a,u)=>{const o=k(a,u);return i[o]||0},r=a=>s[a]||0;for(const a of c){const{team1:u,team2:o}=a,d=k(u[0],u[1]),m=k(o[0],o[1]);e[d]=(e[d]||0)+1,e[m]=(e[m]||0)+1;for(const p of u)for(const b of o){const x=k(p,b);i[x]=(i[x]||0)+1}const l=M(u,o);s[l]=(s[l]||0)+1}return{pairCounts:e,opponentCounts:i,cardCounts:s,getPair:t,getOpponent:n,getCard:r}}function D(c,e,i=null){const{team1:s,team2:t,key:n}=c,{getPair:r,getOpponent:a,getCard:u}=q(e),o=r(s[0],s[1])+r(t[0],t[1]),d=a(s[0],t[0])+a(s[0],t[1])+a(s[1],t[0])+a(s[1],t[1]),m=u(n);let l=0,p=!1;if(e.length>0){const f=e[e.length-1],h=k(f.team1[0],f.team1[1]),$=k(f.team2[0],f.team2[1]),S=k(s[0],s[1]),y=k(t[0],t[1]);(S===h||S===$)&&l++,(y===h||y===$)&&l++;const j=M(f.team1,f.team2);n===j&&(p=!0)}const b=i&&n===i;return{score:o*100+d*10+m*30+l*300+(p?500:0)+(b?200:0),breakdown:{pairRepetition:o,oppRepetition:d,sameCardCount:m,lastGameSamePairCount:l,lastGameSameCard:p,isSameAsLastDisplayed:b}}}function I(c,e=[]){const i=c-4;if(i<=0)return{restPlayers:[],manualRestPlayers:[],autoRestPlayers:[]};const s=new Set(e.filter(o=>o>=1&&o<=c)),t=i-s.size;if(t<=0){const o=Array.from(s).sort((d,m)=>d-m);return{restPlayers:o,manualRestPlayers:o,autoRestPlayers:[]}}const n=[];for(let o=1;o<=c;o++)s.has(o)||n.push(o);const r=[...n];for(let o=r.length-1;o>0;o--){const d=Math.floor(Math.random()*(o+1));[r[o],r[d]]=[r[d],r[o]]}const a=r.slice(0,t).sort((o,d)=>o-d);return{restPlayers:[...Array.from(s),...a].sort((o,d)=>o-d),manualRestPlayers:Array.from(s).sort((o,d)=>o-d),autoRestPlayers:a}}function B(c,e,i=null){const t=N(c).map(o=>{const{score:d,breakdown:m}=D(o,e,i);return{...o,score:d,breakdown:m}}),r=Math.min(...t.map(o=>o.score))+20,a=t.filter(o=>o.score<=r),u=Math.floor(Math.random()*a.length);return a[u]}function U({store:c,onCreateMatch:e,onGoHistory:i,onGoHome:s}){const t=c.state.playerCount,n=c.state.gameHistory.length+1,r=t-4,a=new Set,u=document.createElement("div");u.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const o=()=>{const d=a.size,m=Math.max(0,r-d);u.innerHTML=`
      <!-- Top Bar / Navigation -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button id="btn-home" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </button>
        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Game #${n}</span>
          <h2 class="text-xl font-bold text-white">第 ${n} ゲーム</h2>
        </div>
        <button id="btn-history" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
          </svg>
          ${c.state.gameHistory.length>0?'<span class="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>':""}
        </button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col justify-center space-y-6 my-auto py-6">
        <div class="text-center space-y-2">
          <h3 class="text-lg font-bold text-slate-200">
            ${r>0?"休憩する人を選択":"4名全員が出場します"}
          </h3>
          <p class="text-xs text-slate-400">
            ${r>0?"選択しない場合はアプリが自動でランダム決定します":"コート1面にぴったり4人です"}
          </p>
        </div>

        ${r>0?`
          <!-- Player Selection Grid -->
          <div class="grid grid-cols-4 gap-3">
            ${Array.from({length:t},(x,f)=>f+1).map(x=>{const f=a.has(x),h=!f&&d>=r;return`
                <button
                  data-player="${x}"
                  ${h?"disabled":""}
                  class="player-rest-btn relative py-5 rounded-2xl font-extrabold text-2xl transition-all duration-200 flex flex-col items-center justify-center ${f?"bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300":h?"bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50":"bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border border-slate-700/60 active:scale-95"}"
                >
                  <span>${x}</span>
                  ${f?'<span class="text-[10px] uppercase font-bold tracking-tight bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded-full mt-1">手動指定</span>':""}
                </button>
              `}).join("")}
          </div>

          <!-- Status Indicators -->
          <div class="glass-panel rounded-2xl p-4 space-y-2 text-xs">
            <div class="flex items-center justify-between text-slate-300">
              <span>手動選択状況:</span>
              <span class="font-bold text-amber-400">${d}人 ／ 最大${r}人</span>
            </div>
            <div class="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800/60">
              <span>ランダム自動追加:</span>
              <span class="font-semibold text-slate-300">${m>0?`残り ${m}人`:"なし (手動で完了)"}</span>
            </div>
          </div>
        `:`
          <!-- 4 Players case -->
          <div class="glass-panel rounded-2xl p-6 text-center text-emerald-400 border-emerald-500/30">
            <svg class="w-12 h-12 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <p class="font-bold text-base">全員出場（1, 2, 3, 4）</p>
          </div>
        `}
      </div>

      <!-- Footer Action -->
      <div class="pt-4 border-t border-slate-800/60">
        <button
          id="btn-create-match"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <span>組み合わせを作成</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    `,u.querySelectorAll(".player-rest-btn").forEach(x=>{x.addEventListener("click",f=>{const h=parseInt(f.currentTarget.dataset.player,10);a.has(h)?a.delete(h):a.size<r&&a.add(h),o()})});const l=u.querySelector("#btn-create-match");l&&l.addEventListener("click",()=>{const x=Array.from(a),{restPlayers:f,manualRestPlayers:h,autoRestPlayers:$}=I(t,x),S=[];for(let P=1;P<=t;P++)f.includes(P)||S.push(P);const y=B(S,c.state.gameHistory),j={gameNumber:n,restPlayers:f,manualRestPlayers:h,autoRestPlayers:$,team1:y.team1,team2:y.team2,lastDisplayedKey:y.key};e(j)});const p=u.querySelector("#btn-home");p&&p.addEventListener("click",s);const b=u.querySelector("#btn-history");b&&b.addEventListener("click",i)};return o(),u}function K({store:c,onConfirm:e,onReselectRest:i,onGoHistory:s}){let t={...c.state.currentGame},n=[];const r=document.createElement("div");r.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const a=()=>{const{gameNumber:u,team1:o,team2:d,restPlayers:m,manualRestPlayers:l,autoRestPlayers:p}=t,b=l&&l.length>0?l.join("、"):"なし",x=p&&p.length>0?p.join("、"):"なし";r.innerHTML=`
      <!-- Top Header -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button id="btn-reselect-rest" class="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition-colors flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>休憩者選び直し</span>
        </button>

        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Confirmation</span>
          <h2 class="text-xl font-bold text-white">第 ${u} ゲーム</h2>
        </div>

        <button id="btn-history" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
          </svg>
        </button>
      </div>

      <!-- Main Court Card Display -->
      <div class="flex-1 flex flex-col justify-center space-y-5 py-4">
        <!-- Swap Hint -->
        <div class="text-center">
          <span class="inline-block text-[11px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
            💡 選手番号を2人タップすると位置を入れ替えられます
          </span>
        </div>

        <!-- Court Representation -->
        <div class="court-card rounded-3xl p-6 relative overflow-hidden border shadow-2xl">
          <!-- Court Net Line -->
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed court-line flex items-center justify-center">
            <span class="bg-slate-900/90 text-amber-400 text-xs font-black tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
              VS
            </span>
          </div>

          <!-- Team 1 (Top Court) -->
          <div class="mb-10 text-center space-y-3">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400/90">TEAM A</span>
            <div class="flex items-center justify-center space-x-4">
              ${f(o[0],"t1-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${f(o[1],"t1-1")}
            </div>
          </div>

          <!-- Team 2 (Bottom Court) -->
          <div class="mt-10 text-center space-y-3">
            <div class="flex items-center justify-center space-x-4">
              ${f(d[0],"t2-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${f(d[1],"t2-1")}
            </div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-teal-400/90">TEAM B</span>
          </div>
        </div>

        <!-- Rest Players Info Panel -->
        <div class="glass-panel rounded-2xl p-4 text-xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-300">休憩プレイヤー:</span>
            <span class="font-extrabold text-amber-400 text-sm">
              ${m&&m.length>0?m.join(" 、 "):"なし"}
            </span>
          </div>
          ${m&&m.length>0?`
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動指定：<strong class="text-amber-300">${b}</strong></span>
              <span>自動選択：<strong class="text-teal-300">${x}</strong></span>
            </div>
          `:""}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2.5 pt-2 border-t border-slate-800/60">
        <button
          id="btn-confirm"
          class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>この組み合わせで確定</span>
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            id="btn-reroll"
            class="py-3 rounded-xl font-bold text-sm bg-slate-800/90 text-emerald-400 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>再抽選</span>
          </button>

          <button
            id="btn-clear-swap"
            class="py-3 rounded-xl font-bold text-sm bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all"
          >
            選択解除
          </button>
        </div>
      </div>
    `;function f(C,g){const v=n.includes(g);return`
        <button
          data-slot="${g}"
          class="player-slot w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${v?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce":"bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600/50 active:scale-95"}"
        >
          ${C}
        </button>
      `}r.querySelectorAll(".player-slot").forEach(C=>{C.addEventListener("click",g=>{const v=g.currentTarget.dataset.slot;n.includes(v)?n=n.filter(L=>L!==v):(n.push(v),n.length===2&&(h(n[0],n[1]),n=[])),a()})});function h(C,g){const v=w=>{if(w==="t1-0")return t.team1[0];if(w==="t1-1")return t.team1[1];if(w==="t2-0")return t.team2[0];if(w==="t2-1")return t.team2[1]},L=(w,E)=>{w==="t1-0"&&(t.team1[0]=E),w==="t1-1"&&(t.team1[1]=E),w==="t2-0"&&(t.team2[0]=E),w==="t2-1"&&(t.team2[1]=E)},G=v(C),_=v(g);L(C,_),L(g,G),t.lastDisplayedKey=M(t.team1,t.team2)}const $=r.querySelector("#btn-reroll");$&&$.addEventListener("click",()=>{const C=[...t.team1,...t.team2],g=t.lastDisplayedKey||M(t.team1,t.team2),v=B(C,c.state.gameHistory,g);t.team1=v.team1,t.team2=v.team2,t.lastDisplayedKey=v.key,n=[],a()});const S=r.querySelector("#btn-clear-swap");S&&S.addEventListener("click",()=>{n=[],a()});const y=r.querySelector("#btn-confirm");y&&y.addEventListener("click",()=>{c.setCurrentGame(t),e()});const j=r.querySelector("#btn-reselect-rest");j&&j.addEventListener("click",i);const P=r.querySelector("#btn-history");P&&P.addEventListener("click",s)};return a(),r}function z({store:c,onUndo:e,onReset:i,onBack:s}){const t=document.createElement("div");t.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const n=c.state.gameHistory||[],r=c.getStats(),a=c.state.playerCount;return(()=>{t.innerHTML=`
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
            <span class="text-xs text-slate-400">累計 ${n.length} 試合</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${Array.from({length:a},(l,p)=>p+1).map(l=>{const p=r[l]||{playCount:0,restCount:0};return`
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
    `;const o=t.querySelector("#btn-back");o&&o.addEventListener("click",s);const d=t.querySelector("#btn-undo");d&&d.addEventListener("click",()=>{confirm(`最新の第 ${n.length} ゲームの確定を取り消して巻き戻しますか？`)&&e()});const m=t.querySelector("#btn-reset");m&&m.addEventListener("click",()=>{confirm("すべての対戦履歴と進行状況をリセットして、最初からやり直しますか？")&&i()})})(),t}function O(c){let e=null;return{showToast(i,s="info",t=3e3){e&&e.remove(),e=document.createElement("div"),e.className=`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl font-semibold text-sm shadow-2xl backdrop-blur-md border animate-slide-up flex items-center space-x-2 ${s==="success"?"bg-emerald-900/90 text-emerald-200 border-emerald-500/50":s==="amber"?"bg-amber-900/90 text-amber-200 border-amber-500/50":"bg-slate-800/90 text-slate-100 border-slate-700"}`,e.innerHTML=`
        <span>${i}</span>
      `,c.appendChild(e),setTimeout(()=>{e&&(e.classList.add("opacity-0","transition-opacity","duration-300"),setTimeout(()=>e==null?void 0:e.remove(),300))},t)},showUpdatePrompt(i){const s=document.createElement("div");s.className="fixed top-4 inset-x-4 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl flex items-center justify-between animate-slide-up",s.innerHTML=`
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-xs font-bold text-slate-100">新しいバージョンがあります</span>
        </div>
        <button id="btn-pwa-update" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-emerald-400">
          更新する
        </button>
      `,c.appendChild(s),s.querySelector("#btn-pwa-update").addEventListener("click",()=>{s.remove(),i()})}}}function V(c){const e=new T,i=O(c);function s(){c.innerHTML="";const t=e.state.currentStep;let n=null;if(t==="start")n=A({store:e,onStart:(r,a)=>{a||(e.state.gameHistory=[],e.state.currentGame=null),e.setPlayerCount(r),s()}});else if(t==="rest_selection")n=U({store:e,onCreateMatch:r=>{e.setCurrentGame(r),e.setStep("match_confirm"),s()},onGoHistory:()=>{e.setStep("history"),s()},onGoHome:()=>{e.setStep("start"),s()}});else if(t==="match_confirm"){if(!e.state.currentGame){e.setStep("rest_selection"),s();return}n=K({store:e,onConfirm:()=>{var a;const r=((a=e.state.currentGame)==null?void 0:a.gameNumber)||e.state.gameHistory.length+1;e.confirmCurrentGame(),i.showToast(`第 ${r} ゲームの組み合わせを確定しました`,"success"),s()},onReselectRest:()=>{e.setStep("rest_selection"),s()},onGoHistory:()=>{e.setStep("history"),s()}})}else t==="history"&&(n=z({store:e,onUndo:()=>{e.undoLastGame()&&(i.showToast("直前の確定を取り消しました","amber"),s())},onReset:()=>{e.resetAll(),i.showToast("初期状態にリセットしました","info"),s()},onBack:()=>{e.state.currentGame?e.setStep("match_confirm"):e.setStep("rest_selection"),s()}}));n&&c.appendChild(n)}return s(),{render:s,toastManager:i}}const W="modulepreload",F=function(c){return"/"+c},R={},J=function(e,i,s){let t=Promise.resolve();if(i&&i.length>0){let r=function(o){return Promise.all(o.map(d=>Promise.resolve(d).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),u=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));t=r(i.map(o=>{if(o=F(o),o in R)return;R[o]=!0;const d=o.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${m}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":W,d||(l.as="script"),l.crossOrigin="",l.href=o,u&&l.setAttribute("nonce",u),document.head.appendChild(l),d)return new Promise((p,b)=>{l.addEventListener("load",p),l.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return t.then(r=>{for(const a of r||[])a.status==="rejected"&&n(a.reason);return e().catch(n)})};function Y(c={}){const{immediate:e=!1,onNeedRefresh:i,onOfflineReady:s,onRegistered:t,onRegisteredSW:n,onRegisterError:r}=c;let a,u,o;const d=async(l=!0)=>{await u,o==null||o()};async function m(){if("serviceWorker"in navigator){if(a=await J(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-BBnX5xw4.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/sw.js",{scope:"/",type:"classic"})).catch(l=>{r==null||r(l)}),!a)return;o=()=>{a==null||a.messageSkipWaiting()};{let l=!1;const p=()=>{l=!0,a==null||a.addEventListener("controlling",b=>{b.isUpdate&&window.location.reload()}),i==null||i()};a.addEventListener("installed",b=>{typeof b.isUpdate>"u"?typeof b.isExternal<"u"&&b.isExternal?p():!l&&(s==null||s()):b.isUpdate||s==null||s()}),a.addEventListener("waiting",p)}a.register({immediate:e}).then(l=>{n?n("/sw.js",l):t==null||t(l)}).catch(l=>{r==null||r(l)})}}return u=m(),d}document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("app");if(!c)return;const e=V(c),i=Y({onNeedRefresh(){e.toastManager.showUpdatePrompt(()=>{i(!0)})},onOfflineReady(){console.log("App is ready for offline use.")}})});
