(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function l(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(t){if(t.ep)return;t.ep=!0;const a=l(t);fetch(t.href,a)}})();const E="tennis_pairing_app_state_v1";class A{constructor(){this.state=this.loadState()}getDefaultState(){return{playerCount:6,currentStep:"start",gameHistory:[],manualRestPlayers:[],currentGame:null}}loadState(){try{const e=localStorage.getItem(E);if(e){const l=JSON.parse(e);return l.manualRestPlayers||(l.manualRestPlayers=[]),l}}catch(e){console.error("Failed to load state from localStorage:",e)}return this.getDefaultState()}saveState(){try{localStorage.setItem(E,JSON.stringify(this.state))}catch(e){console.error("Failed to save state to localStorage:",e)}}setPlayerCount(e){this.state.playerCount=e;const l=e-4;this.state.manualRestPlayers=(this.state.manualRestPlayers||[]).filter(s=>s<=e).slice(0,Math.max(0,l)),this.state.currentStep="match_setup",this.saveState()}setManualRestPlayers(e){this.state.manualRestPlayers=[...e].sort((l,s)=>l-s),this.saveState()}setStep(e){this.state.currentStep=e,this.saveState()}setCurrentGame(e){this.state.currentGame=e,this.saveState()}confirmCurrentGame(){if(!this.state.currentGame)return;const l={gameNumber:this.state.gameHistory.length+1,team1:[...this.state.currentGame.team1],team2:[...this.state.currentGame.team2],restPlayers:[...this.state.currentGame.restPlayers],manuallySelectedRestPlayers:[...this.state.currentGame.manualRestPlayers||[]]};this.state.gameHistory.push(l),this.state.currentGame=null,this.state.currentStep="match_setup",this.saveState()}undoLastGame(){if(this.state.gameHistory.length===0)return!1;const e=this.state.gameHistory.pop(),l=e.manuallySelectedRestPlayers||[],s=e.restPlayers||[],t=s.filter(a=>!l.includes(a));return this.state.currentGame={gameNumber:e.gameNumber,team1:e.team1,team2:e.team2,restPlayers:s,manualRestPlayers:l,autoRestPlayers:t,lastDisplayedKey:null},this.state.currentStep="match_confirm",this.saveState(),!0}resetAll(){this.state=this.getDefaultState(),this.saveState()}getStats(){const e={},l=this.state.playerCount;for(let s=1;s<=l;s++)e[s]={player:s,playCount:0,restCount:0};for(const s of this.state.gameHistory){const t=[...s.team1,...s.team2];for(const a of t)e[a]&&e[a].playCount++;for(const a of s.restPlayers)e[a]&&e[a].restCount++}return e}}function T({store:c,onStart:e}){let l=c.state.playerCount||6;const s=c.state.gameHistory.length>0,t=document.createElement("div");t.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const a=()=>{t.innerHTML=`
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
                class="count-btn py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${l===m?"bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300":"bg-slate-800/80 text-slate-300 hover:bg-slate-700 active:scale-95"}"
              >
                ${m}人
              </button>
            `).join("")}
          </div>
          <div class="text-xs text-slate-400 bg-slate-900/60 py-2.5 px-4 rounded-xl border border-slate-800">
            試合出場：<span class="text-emerald-400 font-bold">4人</span> ／ 休憩：<span class="text-amber-400 font-bold">${l-4}人</span>
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
    `,t.querySelectorAll(".count-btn").forEach(m=>{m.addEventListener("click",r=>{l=parseInt(r.currentTarget.dataset.count,10),a()})});const o=t.querySelector("#btn-start");o&&o.addEventListener("click",()=>{e(l,!1)});const n=t.querySelector("#btn-resume");n&&n.addEventListener("click",()=>{e(c.state.playerCount,!0)})};return a(),t}function N(c){const[e,l,s,t]=c;return[{team1:[e,l],team2:[s,t]},{team1:[e,s],team2:[l,t]},{team1:[e,t],team2:[l,s]}].map(o=>{const n=[...o.team1].sort((i,p)=>i-p),m=[...o.team2].sort((i,p)=>i-p),[r,d]=[n,m].sort((i,p)=>i[0]-p[0]||i[1]-p[1]),u=`${r[0]}-${r[1]}_vs_${d[0]}-${d[1]}`;return{team1:o.team1,team2:o.team2,key:u}})}function g(c,e){return c<e?`${c}-${e}`:`${e}-${c}`}function R(c,e){const l=[...c].sort((o,n)=>o-n),s=[...e].sort((o,n)=>o-n),[t,a]=[l,s].sort((o,n)=>o[0]-n[0]||o[1]-n[1]);return`${t[0]}-${t[1]}_vs_${a[0]}-${a[1]}`}function q(c){const e={},l={},s={},t=(n,m)=>{const r=g(n,m);return e[r]||0},a=(n,m)=>{const r=g(n,m);return l[r]||0},o=n=>s[n]||0;for(const n of c){const{team1:m,team2:r}=n,d=g(m[0],m[1]),u=g(r[0],r[1]);e[d]=(e[d]||0)+1,e[u]=(e[u]||0)+1;for(const p of m)for(const f of r){const w=g(p,f);l[w]=(l[w]||0)+1}const i=R(m,r);s[i]=(s[i]||0)+1}return{pairCounts:e,opponentCounts:l,cardCounts:s,getPair:t,getOpponent:a,getCard:o}}function z(c,e,l=null){const{team1:s,team2:t,key:a}=c,{getPair:o,getOpponent:n,getCard:m}=q(e),r=o(s[0],s[1])+o(t[0],t[1]),d=n(s[0],t[0])+n(s[0],t[1])+n(s[1],t[0])+n(s[1],t[1]),u=m(a);let i=0,p=!1;if(e.length>0){const b=e[e.length-1],C=g(b.team1[0],b.team1[1]),P=g(b.team2[0],b.team2[1]),$=g(s[0],s[1]),k=g(t[0],t[1]);($===C||$===P)&&i++,(k===C||k===P)&&i++;const S=R(b.team1,b.team2);a===S&&(p=!0)}const f=l&&a===l;return{score:r*100+d*10+u*30+i*300+(p?500:0)+(f?200:0),breakdown:{pairRepetition:r,oppRepetition:d,sameCardCount:u,lastGameSamePairCount:i,lastGameSameCard:p,isSameAsLastDisplayed:f}}}function D(c,e=[]){const l=c-4;if(l<=0)return{restPlayers:[],manualRestPlayers:[],autoRestPlayers:[]};const s=new Set(e.filter(r=>r>=1&&r<=c)),t=l-s.size;if(t<=0){const r=Array.from(s).sort((d,u)=>d-u);return{restPlayers:r,manualRestPlayers:r,autoRestPlayers:[]}}const a=[];for(let r=1;r<=c;r++)s.has(r)||a.push(r);const o=[...a];for(let r=o.length-1;r>0;r--){const d=Math.floor(Math.random()*(r+1));[o[r],o[d]]=[o[d],o[r]]}const n=o.slice(0,t).sort((r,d)=>r-d);return{restPlayers:[...Array.from(s),...n].sort((r,d)=>r-d),manualRestPlayers:Array.from(s).sort((r,d)=>r-d),autoRestPlayers:n}}function H(c,e,l=null){const t=N(c).map(r=>{const{score:d,breakdown:u}=z(r,e,l);return{...r,score:d,breakdown:u}}),o=Math.min(...t.map(r=>r.score))+20,n=t.filter(r=>r.score<=o),m=Math.floor(Math.random()*n.length);return n[m]}function O({store:c,onCreateMatch:e,onGoRestOption:l,onGoHistory:s,onGoHome:t}){const a=c.state.playerCount,o=c.state.gameHistory.length+1,n=a-4,m=c.state.manualRestPlayers||[],r=document.createElement("div");r.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const d=m.length,u=Math.max(0,n-d);r.innerHTML=`
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
      <button id="btn-home" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      </button>
      <div class="text-center">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Game #${o}</span>
        <h2 class="text-xl font-bold text-white">第 ${o} ゲーム</h2>
      </div>
      <button id="btn-history" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
        </svg>
        ${c.state.gameHistory.length>0?'<span class="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>':""}
      </button>
    </div>

    <!-- Main Section -->
    <div class="flex-1 flex flex-col justify-center space-y-6 my-auto py-6">
      <!-- Big Visual Status Card -->
      <div class="glass-panel rounded-3xl p-6 text-center space-y-4 border border-slate-800/80 shadow-xl">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>

        <div>
          <h3 class="text-lg font-extrabold text-white">準備完了</h3>
          <p class="text-xs text-slate-400 mt-1">
            ボタンを押すと過去履歴から最適な組み合わせを作成します
          </p>
        </div>

        <!-- Current Rest Option Summary Box -->
        ${n>0?`
          <div class="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
            <div class="flex items-center justify-between text-slate-300">
              <span class="font-semibold">休憩者の設定状況:</span>
              <button id="btn-open-rest-option" class="text-amber-400 hover:underline font-bold flex items-center space-x-1">
                <span>指定変更（オプション）</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>手動固定指定：<strong class="text-amber-300 font-bold">${d>0?m.join("、"):"なし"}</strong></span>
              <span>自動ランダム補充：<strong class="text-teal-300 font-bold">${u>0?`${u}人`:"なし"}</strong></span>
            </div>
          </div>
        `:""}
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-3 pt-2 border-t border-slate-800/60">
      <button
        id="btn-create-match"
        class="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2"
      >
        <span>組み合わせを作成</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </button>

      ${n>0?`
        <button
          id="btn-option-secondary"
          class="w-full py-3 rounded-2xl font-bold text-sm bg-slate-800/90 text-amber-300 border border-slate-700/80 hover:bg-slate-700/90 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>休憩者を選択する（オプション）</span>
        </button>
      `:""}
    </div>
  `;const i=r.querySelector("#btn-create-match");i&&i.addEventListener("click",()=>{const{restPlayers:C,manualRestPlayers:P,autoRestPlayers:$}=D(a,c.state.manualRestPlayers||[]),k=[];for(let x=1;x<=a;x++)C.includes(x)||k.push(x);const S=H(k,c.state.gameHistory),j={gameNumber:o,restPlayers:C,manualRestPlayers:P,autoRestPlayers:$,team1:S.team1,team2:S.team2,lastDisplayedKey:S.key};e(j)});const p=r.querySelector("#btn-open-rest-option");p&&p.addEventListener("click",l);const f=r.querySelector("#btn-option-secondary");f&&f.addEventListener("click",l);const w=r.querySelector("#btn-home");w&&w.addEventListener("click",t);const b=r.querySelector("#btn-history");return b&&b.addEventListener("click",s),r}function I({store:c,onSaveAndBack:e}){const l=c.state.playerCount,s=l-4,t=new Set(c.state.manualRestPlayers||[]),a=document.createElement("div");a.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const o=()=>{const n=t.size;a.innerHTML=`
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
            ${Array.from({length:l},(d,u)=>u+1).map(d=>{const u=t.has(d),i=!u&&n>=s;return`
                <button
                  data-player="${d}"
                  ${i?"disabled":""}
                  class="player-option-btn relative py-5 rounded-2xl font-extrabold text-2xl transition-all duration-200 flex flex-col items-center justify-center ${u?"bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300":i?"bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed opacity-50":"bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border border-slate-700/60 active:scale-95"}"
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
              <span class="font-bold text-amber-400">${n}人 ／ 最大${s}人</span>
            </div>
            <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              ${n<s?`※ 残り ${s-n} 名分はゲーム生成時に自動ランダム選出されます`:"※ 必要な休憩者が全員手動で固定されています"}
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
    `,a.querySelectorAll(".player-option-btn").forEach(d=>{d.addEventListener("click",u=>{const i=parseInt(u.currentTarget.dataset.player,10);t.has(i)?t.delete(i):t.size<s&&t.add(i),o()})});const m=a.querySelector("#btn-save-option");m&&m.addEventListener("click",()=>{const d=Array.from(t);c.setManualRestPlayers(d),e()});const r=a.querySelector("#btn-cancel");r&&r.addEventListener("click",()=>{e()})};return o(),a}function U({store:c,onConfirm:e,onGoRestOption:l,onGoHistory:s}){let t={...c.state.currentGame},a=[];const o=document.createElement("div");o.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const n=()=>{const{gameNumber:m,team1:r,team2:d,restPlayers:u,manualRestPlayers:i,autoRestPlayers:p}=t,f=i&&i.length>0?i.join("、"):"なし",w=p&&p.length>0?p.join("、"):"なし";o.innerHTML=`
      <!-- Top Header -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button id="btn-reselect-rest" class="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition-colors flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          </svg>
          <span>休憩指定オプション</span>
        </button>

        <div class="text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Confirmation</span>
          <h2 class="text-xl font-bold text-white">第 ${m} ゲーム</h2>
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
              ${b(r[0],"t1-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${b(r[1],"t1-1")}
            </div>
          </div>

          <!-- Team 2 (Bottom Court) -->
          <div class="mt-10 text-center space-y-3">
            <div class="flex items-center justify-center space-x-4">
              ${b(d[0],"t2-0")}
              <span class="text-slate-500 font-bold">•</span>
              ${b(d[1],"t2-1")}
            </div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-teal-400/90">TEAM B</span>
          </div>
        </div>

        <!-- Rest Players Info Panel -->
        <div class="glass-panel rounded-2xl p-4 text-xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-300">休憩プレイヤー:</span>
            <span class="font-extrabold text-amber-400 text-sm">
              ${u&&u.length>0?u.join(" 、 "):"なし"}
            </span>
          </div>
          ${u&&u.length>0?`
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span>手動固定：<strong class="text-amber-300">${f}</strong></span>
              <span>自動補充：<strong class="text-teal-300">${w}</strong></span>
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
    `;function b(x,v){const h=a.includes(v);return`
        <button
          data-slot="${v}"
          class="player-slot w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all duration-200 shadow-md ${h?"bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 animate-bounce":"bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600/50 active:scale-95"}"
        >
          ${x}
        </button>
      `}o.querySelectorAll(".player-slot").forEach(x=>{x.addEventListener("click",v=>{const h=v.currentTarget.dataset.slot;a.includes(h)?a=a.filter(M=>M!==h):(a.push(h),a.length===2&&(C(a[0],a[1]),a=[])),n()})});function C(x,v){const h=y=>{if(y==="t1-0")return t.team1[0];if(y==="t1-1")return t.team1[1];if(y==="t2-0")return t.team2[0];if(y==="t2-1")return t.team2[1]},M=(y,L)=>{y==="t1-0"&&(t.team1[0]=L),y==="t1-1"&&(t.team1[1]=L),y==="t2-0"&&(t.team2[0]=L),y==="t2-1"&&(t.team2[1]=L)},G=h(x),_=h(v);M(x,_),M(v,G),t.lastDisplayedKey=R(t.team1,t.team2)}const P=o.querySelector("#btn-reroll");P&&P.addEventListener("click",()=>{const x=[...t.team1,...t.team2],v=t.lastDisplayedKey||R(t.team1,t.team2),h=H(x,c.state.gameHistory,v);t.team1=h.team1,t.team2=h.team2,t.lastDisplayedKey=h.key,a=[],n()});const $=o.querySelector("#btn-clear-swap");$&&$.addEventListener("click",()=>{a=[],n()});const k=o.querySelector("#btn-confirm");k&&k.addEventListener("click",()=>{c.setCurrentGame(t),e()});const S=o.querySelector("#btn-reselect-rest");S&&S.addEventListener("click",l);const j=o.querySelector("#btn-history");j&&j.addEventListener("click",s)};return n(),o}function K({store:c,onUndo:e,onReset:l,onBack:s}){const t=document.createElement("div");t.className="flex-1 flex flex-col justify-between p-6 animate-slide-up";const a=c.state.gameHistory||[],o=c.getStats(),n=c.state.playerCount;return(()=>{t.innerHTML=`
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
              <span>参加状況 (${n}人)</span>
            </h3>
            <span class="text-xs text-slate-400">累計 ${a.length} 試合</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${Array.from({length:n},(i,p)=>p+1).map(i=>{const p=o[i]||{playCount:0,restCount:0};return`
                <div class="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                      ${i}
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

          ${a.length===0?`
            <div class="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
              確定済みの試合データがまだありません。
            </div>
          `:`
            <div class="space-y-3">
              ${[...a].reverse().map(i=>`
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
        ${a.length>0?`
          <button
            id="btn-undo"
            class="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>直前の確定を取り消す (第${a.length}ゲーム)</span>
          </button>
        `:""}

        <button
          id="btn-reset"
          class="w-full py-3 rounded-2xl font-semibold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all"
        >
          最初からやり直す (データ全リセット)
        </button>
      </div>
    `;const r=t.querySelector("#btn-back");r&&r.addEventListener("click",s);const d=t.querySelector("#btn-undo");d&&d.addEventListener("click",()=>{confirm(`最新の第 ${a.length} ゲームの確定を取り消して巻き戻しますか？`)&&e()});const u=t.querySelector("#btn-reset");u&&u.addEventListener("click",()=>{confirm("すべての対戦履歴と進行状況をリセットして、最初からやり直しますか？")&&l()})})(),t}function V(c){let e=null;return{showToast(l,s="info",t=3e3){e&&e.remove(),e=document.createElement("div"),e.className=`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl font-semibold text-sm shadow-2xl backdrop-blur-md border animate-slide-up flex items-center space-x-2 ${s==="success"?"bg-emerald-900/90 text-emerald-200 border-emerald-500/50":s==="amber"?"bg-amber-900/90 text-amber-200 border-amber-500/50":"bg-slate-800/90 text-slate-100 border-slate-700"}`,e.innerHTML=`
        <span>${l}</span>
      `,c.appendChild(e),setTimeout(()=>{e&&(e.classList.add("opacity-0","transition-opacity","duration-300"),setTimeout(()=>e==null?void 0:e.remove(),300))},t)},showUpdatePrompt(l){const s=document.createElement("div");s.className="fixed top-4 inset-x-4 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/40 shadow-2xl flex items-center justify-between animate-slide-up",s.innerHTML=`
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-xs font-bold text-slate-100">新しいバージョンがあります</span>
        </div>
        <button id="btn-pwa-update" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-emerald-400">
          更新する
        </button>
      `,c.appendChild(s),s.querySelector("#btn-pwa-update").addEventListener("click",()=>{s.remove(),l()})}}}function W(c){const e=new A,l=V(c);e.state.currentStep==="rest_selection"&&(e.state.currentStep="match_setup");function s(){c.innerHTML="";const t=e.state.currentStep;let a=null;if(t==="start")a=T({store:e,onStart:(o,n)=>{n||(e.state.gameHistory=[],e.state.currentGame=null,e.state.manualRestPlayers=[]),e.setPlayerCount(o),s()}});else if(t==="match_setup")a=O({store:e,onCreateMatch:o=>{e.setCurrentGame(o),e.setStep("match_confirm"),s()},onGoRestOption:()=>{e.setStep("rest_option"),s()},onGoHistory:()=>{e.setStep("history"),s()},onGoHome:()=>{e.setStep("start"),s()}});else if(t==="rest_option")a=I({store:e,onSaveAndBack:()=>{e.state.currentGame?e.setStep("match_confirm"):e.setStep("match_setup"),s()}});else if(t==="match_confirm"){if(!e.state.currentGame){e.setStep("match_setup"),s();return}a=U({store:e,onConfirm:()=>{var n;const o=((n=e.state.currentGame)==null?void 0:n.gameNumber)||e.state.gameHistory.length+1;e.confirmCurrentGame(),l.showToast(`第 ${o} ゲームの組み合わせを確定しました`,"success"),s()},onGoRestOption:()=>{e.setStep("rest_option"),s()},onGoHistory:()=>{e.setStep("history"),s()}})}else t==="history"&&(a=K({store:e,onUndo:()=>{e.undoLastGame()&&(l.showToast("直前の確定を取り消しました","amber"),s())},onReset:()=>{e.resetAll(),l.showToast("初期状態にリセットしました","info"),s()},onBack:()=>{e.state.currentGame?e.setStep("match_confirm"):e.setStep("match_setup"),s()}}));a&&c.appendChild(a)}return s(),{render:s,toastManager:l}}const F="modulepreload",J=function(c){return"/"+c},B={},Y=function(e,l,s){let t=Promise.resolve();if(l&&l.length>0){let o=function(r){return Promise.all(r.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),m=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));t=o(l.map(r=>{if(r=J(r),r in B)return;B[r]=!0;const d=r.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${u}`))return;const i=document.createElement("link");if(i.rel=d?"stylesheet":F,d||(i.as="script"),i.crossOrigin="",i.href=r,m&&i.setAttribute("nonce",m),document.head.appendChild(i),d)return new Promise((p,f)=>{i.addEventListener("load",p),i.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${r}`)))})}))}function a(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return t.then(o=>{for(const n of o||[])n.status==="rejected"&&a(n.reason);return e().catch(a)})};function Q(c={}){const{immediate:e=!1,onNeedRefresh:l,onOfflineReady:s,onRegistered:t,onRegisteredSW:a,onRegisterError:o}=c;let n,m,r;const d=async(i=!0)=>{await m,r==null||r()};async function u(){if("serviceWorker"in navigator){if(n=await Y(async()=>{const{Workbox:i}=await import("./workbox-window.prod.es5-BBnX5xw4.js");return{Workbox:i}},[]).then(({Workbox:i})=>new i("/sw.js",{scope:"/",type:"classic"})).catch(i=>{o==null||o(i)}),!n)return;r=()=>{n==null||n.messageSkipWaiting()};{let i=!1;const p=()=>{i=!0,n==null||n.addEventListener("controlling",f=>{f.isUpdate&&window.location.reload()}),l==null||l()};n.addEventListener("installed",f=>{typeof f.isUpdate>"u"?typeof f.isExternal<"u"&&f.isExternal?p():!i&&(s==null||s()):f.isUpdate||s==null||s()}),n.addEventListener("waiting",p)}n.register({immediate:e}).then(i=>{a?a("/sw.js",i):t==null||t(i)}).catch(i=>{o==null||o(i)})}}return m=u(),d}document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("app");if(!c)return;const e=W(c),l=Q({onNeedRefresh(){e.toastManager.showUpdatePrompt(()=>{l(!0)})},onOfflineReady(){console.log("App is ready for offline use.")}})});
