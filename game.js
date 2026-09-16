
(() => {
"use strict";
const D=GB_DATA,M=GB_MAPS,KEY="glyphbound_neon_wilds_save_v2";
const app=document.getElementById("app");
let state,battle=null,worldTimer=null,moveLock=false,toastTimer=null;
const clone=o=>JSON.parse(JSON.stringify(o)),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),rand=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

function fresh(){
 return {version:D.version,started:false,name:"TAMER",starter:null,map:"town",x:M.town.start.x,y:M.town.start.y,dir:"down",prev:{x:M.town.start.x,y:M.town.start.y},
 monsters:{},party:[],deck:[...D.starterDeck],cardPool:{},binds:4,credits:12,badges:[],trainerWins:{},items:{},steps:0,lastEncounterStep:0,
 stats:{battles:0,wins:0,captures:0,trainerWins:0,wardens:0,cards:0,losses:0},campaignComplete:false,lastMenu:"team"};
}
function load(){try{state=Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){state=fresh()}if(!state.cardPool)state.cardPool={};if(!Object.keys(state.cardPool).length)state.deck.forEach(c=>state.cardPool[c]=(state.cardPool[c]||0)+1)}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function stats(id,lvl){const m=D.monsters[id],g=lvl-1;return{maxHp:m.base.hp+g*5,atk:m.base.atk+g*2,def:m.base.def+g}}
function need(lvl){return 28+lvl*15}
function own(id,starter=false,lvl=1){if(state.monsters[id])return state.monsters[id];const s=stats(id,lvl);return state.monsters[id]={id,level:lvl,xp:0,bond:starter?2:0,currentHp:s.maxHp,attackUses:0,supportUses:0,nickname:""}}
function monName(m){return m.nickname||D.monsters[m.id].name}
function typeTag(t){return `<span class="type ${t}">${t}</span>`}
function toast(msg){document.querySelector(".toast")?.remove();const e=document.createElement("div");e.className="toast";e.textContent=msg;document.body.appendChild(e);clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.remove(),2200)}
function showModal(title,html,cb){const o=document.createElement("div");o.className="overlay";o.id="overlay";o.innerHTML=`<div class="modal"><h2>${title}</h2>${html}<button class="btn primary full" id="modalOK" style="margin-top:12px">CONTINUE</button></div>`;document.body.appendChild(o);document.getElementById("modalOK").onclick=()=>{o.remove();cb&&cb()}}
function showRaw(html){const o=document.createElement("div");o.className="overlay";o.id="overlay";o.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(o);return o}
function spriteHTML(id,cls=""){return `<div class="sprite ${cls}"><canvas width="32" height="32" class="monsprite" data-id="${id}"></canvas></div>`}
function paintSprites(){document.querySelectorAll(".monsprite").forEach(c=>drawMonster(c,c.dataset.id))}
function px(ctx,c,x,y,w=1,h=1){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function poly(ctx,c,pts){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fill()}
function drawMonster(c,id){
 const x=c.getContext("2d");x.imageSmoothingEnabled=false;x.clearRect(0,0,32,32);const o="#17131c",white="#f5efd5";
 const art=D.monsters[id].art;
 const eye=(ex,ey,col=white)=>{px(x,col,ex,ey,2,2);px(x,o,ex+1,ey,1,1)};
 if(art==="cindercub"){poly(x,o,[[7,10],[10,5],[13,8],[19,8],[22,5],[25,10],[25,23],[21,27],[11,27],[7,23]]);poly(x,"#c94f34",[[9,11],[12,8],[15,10],[18,10],[21,8],[23,11],[23,22],[20,25],[12,25],[9,22]]);px(x,"#33252a",12,15,8,7);px(x,"#ffb84d",14,17,4,3);px(x,"#ff6a3d",25,19,4,3);px(x,"#ffcf55",28,17,2,3);eye(12,12);eye(19,12);px(x,o,14,24,3,4);px(x,o,19,24,3,4)}
 else if(art==="magmara"){poly(x,o,[[3,16],[6,9],[10,7],[12,3],[15,8],[21,8],[24,4],[26,10],[30,14],[28,23],[23,27],[10,27],[5,24]]);poly(x,"#682d2d",[[6,16],[9,10],[13,10],[15,8],[21,10],[24,9],[27,15],[26,22],[21,25],[11,25],[7,22]]);px(x,"#ff7048",11,14,3,7);px(x,"#ff9a4b",17,11,3,9);px(x,"#ffcf55",22,14,2,6);px(x,o,8,24,5,4);px(x,o,21,24,5,4);eye(10,11,"#ffd66c");eye(21,11,"#ffd66c")}
 else if(art==="solvulp"){poly(x,o,[[5,13],[8,7],[12,9],[15,5],[19,9],[24,7],[27,13],[25,23],[21,27],[11,27],[7,23]]);poly(x,"#e6d6b7",[[8,13],[10,9],[13,11],[16,8],[19,11],[23,9],[25,13],[23,22],[20,25],[12,25],[9,22]]);px(x,"#79dfff",13,16,6,5);poly(x,"#62bfe8",[[25,18],[30,15],[29,21],[26,24]]);eye(11,13,"#83dbff");eye(20,13,"#83dbff");px(x,o,13,24,3,4);px(x,o,18,24,3,4)}
 else if(art==="sprigbit"){poly(x,o,[[5,17],[8,10],[13,8],[19,9],[24,13],[26,21],[22,26],[10,26],[6,22]]);poly(x,"#5aa64e",[[8,17],[10,12],[14,10],[19,11],[22,14],[23,21],[20,24],[11,24],[8,21]]);poly(x,"#a8d85e",[[10,9],[13,4],[16,8],[18,3],[20,10]]);px(x,"#ddd36d",11,16,9,5);eye(10,13);eye(19,13);px(x,o,8,23,4,4);px(x,o,20,23,4,4)}
 else if(art==="thornjaw"){poly(x,o,[[3,17],[6,10],[11,8],[12,4],[16,8],[22,8],[27,13],[29,21],[24,27],[9,27],[4,23]]);poly(x,"#477943",[[6,17],[8,12],[13,10],[17,11],[22,10],[25,14],[26,21],[22,24],[10,24],[7,21]]);poly(x,"#a9ce4d",[[7,11],[5,6],[11,9],[13,4],[16,9],[20,5],[21,10],[26,7],[24,13]]);px(x,"#d9cf79",9,17,14,5);poly(x,o,[[7,18],[3,16],[6,21]]);poly(x,o,[[24,18],[29,16],[26,21]]);eye(10,13);eye(20,13)}
 else if(art==="mossoracle"){poly(x,o,[[7,14],[9,8],[13,7],[12,3],[15,6],[17,2],[19,7],[23,8],[26,15],[24,25],[19,28],[12,27],[8,23]]);poly(x,"#6f9f63",[[10,14],[11,10],[15,9],[18,9],[22,10],[23,15],[22,23],[18,25],[13,24],[10,22]]);px(x,"#b9e08c",12,15,9,7);poly(x,"#8ecf6a",[[10,10],[8,5],[13,8],[16,4],[18,9],[23,5],[22,11]]);px(x,"#7af5b5",15,5,2,2);eye(12,12,"#d7ff9d");eye(20,12,"#d7ff9d")}
 else if(art==="ripplet"){poly(x,o,[[4,16],[8,10],[14,8],[18,9],[23,7],[28,12],[26,19],[21,22],[17,27],[12,23],[7,22]]);poly(x,"#48a3d7",[[7,16],[10,12],[14,10],[18,11],[22,10],[25,13],[24,17],[20,20],[16,23],[13,20],[9,20]]);poly(x,"#95e7ef",[[4,12],[9,13],[8,17],[3,19]]);poly(x,"#95e7ef",[[22,10],[27,6],[28,13]]);px(x,"#dff9ff",12,15,7,3);eye(10,13);eye(19,13)}
 else if(art==="abyssail"){poly(x,o,[[2,15],[8,8],[15,5],[22,8],[30,15],[25,22],[18,21],[16,28],[13,21],[7,22]]);poly(x,"#235a92",[[5,15],[10,10],[15,8],[21,10],[27,15],[23,19],[18,18],[16,23],[14,18],[9,19]]);poly(x,"#5bbdd9",[[8,12],[15,10],[22,12],[18,15],[12,15]]);px(x,"#76f1ee",14,8,4,2);eye(10,13,"#aafaff");eye(21,13,"#aafaff")}
 else if(art==="coralisk"){poly(x,o,[[10,27],[7,22],[9,17],[7,12],[11,8],[12,4],[16,7],[20,4],[21,9],[25,12],[23,18],[25,23],[21,28]]);poly(x,"#4a9eb4",[[12,25],[10,21],[12,17],[10,13],[13,10],[15,8],[18,10],[22,13],[20,18],[22,22],[20,25]]);poly(x,"#f4a3b1",[[12,10],[9,6],[13,7],[15,3],[16,8],[21,4],[19,10],[24,7],[21,12]]);px(x,"#bcecff",14,15,5,4);eye(13,12);eye(20,12)}
 else if(art==="glimwing"){poly(x,o,[[15,8],[9,5],[4,8],[3,15],[8,19],[14,17],[15,27],[18,27],[18,17],[24,19],[29,15],[28,8],[23,5],[18,8]]);poly(x,"#dfc443",[[14,10],[9,7],[6,9],[6,14],[10,16],[14,14]]);poly(x,"#dfc443",[[19,10],[23,7],[26,9],[26,14],[22,16],[19,14]]);px(x,"#fff29b",8,10,3,3);px(x,"#fff29b",22,10,3,3);px(x,"#866fde",15,9,4,9);eye(15,10)}
 else if(art==="luxmoth"){poly(x,o,[[14,7],[8,3],[2,7],[3,17],[9,22],[14,18],[14,29],[19,29],[19,18],[24,22],[30,17],[31,7],[25,3],[19,7]]);poly(x,"#ead34f",[[13,9],[8,6],[5,8],[6,15],[10,18],[13,15]]);poly(x,"#ead34f",[[20,9],[25,6],[28,8],[27,15],[23,18],[20,15]]);px(x,"#77dfff",7,9,4,5);px(x,"#c28cff",10,15,3,3);px(x,"#77dfff",23,9,4,5);px(x,"#c28cff",20,15,3,3);px(x,"#6d58a8",15,8,4,12);eye(15,9)}
 else if(art==="ferrat"){poly(x,o,[[5,16],[8,9],[13,8],[17,10],[23,8],[28,13],[27,22],[22,25],[12,25],[7,22]]);poly(x,"#8b98a7",[[8,16],[10,11],[14,10],[17,12],[22,10],[25,14],[24,20],[20,23],[13,23],[9,20]]);px(x,"#dbe5ed",9,13,5,3);px(x,"#c3704f",22,14,4,2);poly(x,"#b8c4ce",[[26,20],[31,18],[30,22],[27,23]]);eye(11,12);px(x,"#e5eef4",8,17,3,5)}
 else if(art==="ironmaw"){poly(x,o,[[3,17],[6,10],[12,7],[20,7],[26,11],[30,17],[27,25],[21,28],[10,28],[5,24]]);poly(x,"#687584",[[6,17],[9,12],[13,10],[20,10],[24,13],[27,17],[24,23],[20,25],[11,25],[8,22]]);px(x,"#aebbc6",10,11,4,12);px(x,"#aebbc6",18,10,5,13);poly(x,"#d9e1e6",[[26,15],[31,13],[29,18],[31,22],[26,20]]);eye(9,14,"#ffcf64");px(x,o,7,24,6,4);px(x,o,20,24,6,4)}
 else if(art==="shadecko"){poly(x,o,[[6,20],[7,12],[12,8],[18,8],[22,5],[25,9],[23,14],[27,18],[24,24],[17,26],[10,25]]);poly(x,"#72529b",[[9,20],[10,13],[13,11],[18,11],[21,8],[22,10],[20,15],[24,19],[22,21],[17,23],[12,22]]);px(x,"#d68cff",11,16,3,3);px(x,"#d68cff",18,14,3,3);poly(x,"#4b356e",[[8,22],[3,25],[4,21]]);eye(12,12,"#e5b1ff");eye(19,11,"#e5b1ff")}
 else if(art==="noctalon"){poly(x,o,[[4,17],[7,9],[13,6],[16,2],[19,7],[25,9],[29,17],[26,24],[20,22],[18,29],[14,29],[12,22],[6,24]]);poly(x,"#5b3e82",[[7,17],[9,11],[13,9],[16,6],[19,10],[23,11],[26,17],[23,20],[19,18],[17,24],[15,24],[13,18],[9,20]]);poly(x,"#b56de0",[[4,16],[10,13],[12,19],[7,22]]);poly(x,"#b56de0",[[28,16],[22,13],[20,19],[25,22]]);eye(12,11,"#efb4ff");eye(20,11,"#efb4ff")}
 else if(art==="coilfin"){poly(x,o,[[4,18],[7,12],[13,10],[17,5],[22,7],[25,13],[29,16],[26,21],[21,22],[17,27],[11,25],[8,21]]);poly(x,"#3d8db2",[[7,18],[9,14],[14,13],[18,8],[21,10],[22,15],[26,17],[24,19],[19,19],[16,23],[12,22],[10,19]]);px(x,"#edcf50",11,12,2,9);px(x,"#edcf50",18,8,2,11);poly(x,"#f4e06b",[[5,14],[2,10],[8,11]]);eye(20,12)}
 else if(art==="dynasea"){poly(x,o,[[3,17],[6,10],[12,8],[15,3],[19,6],[24,7],[29,13],[27,19],[22,21],[20,28],[14,29],[11,23],[6,22]]);poly(x,"#2d769a",[[6,17],[8,12],[13,11],[16,7],[19,9],[23,10],[26,14],[24,17],[19,18],[18,24],[15,25],[13,20],[8,20]]);px(x,"#f0d552",10,9,2,13);px(x,"#f0d552",18,7,2,16);poly(x,"#ffe96e",[[4,13],[1,9],[8,10]]);poly(x,"#ffe96e",[[25,11],[31,8],[28,15]]);eye(21,12)}
 else if(art==="mireimp"){poly(x,o,[[6,18],[8,11],[12,7],[20,7],[24,11],[27,18],[24,25],[19,27],[12,27],[7,24]]);poly(x,"#55407b",[[9,18],[10,12],[13,10],[19,10],[22,12],[24,18],[21,23],[18,24],[13,24],[10,22]]);px(x,"#8c6db0",10,16,13,6);px(x,"#c987e5",12,18,9,3);poly(x,"#6d965c",[[9,10],[7,5],[13,8],[16,4],[19,8],[24,5],[22,11]]);eye(11,12,"#eab1ff");eye(20,12,"#eab1ff")}
 else if(art==="bogeyre"){poly(x,o,[[4,18],[6,10],[10,7],[10,3],[14,6],[17,2],[20,6],[24,4],[24,9],[28,13],[29,21],[24,28],[8,28],[3,23]]);poly(x,"#4c3b6f",[[7,18],[8,12],[12,10],[20,10],[24,13],[26,19],[22,25],[10,25],[6,22]]);px(x,"#77569a",9,16,14,7);poly(x,"#72945f",[[9,9],[8,5],[13,8],[17,4],[20,8],[25,6],[23,11]]);px(x,"#d28eea",12,18,9,3);eye(10,12,"#d7ff85");eye(21,12,"#d7ff85")}
 else if(art==="tinling"){poly(x,o,[[6,16],[9,9],[14,8],[16,4],[18,8],[23,9],[27,15],[24,22],[19,23],[17,28],[14,23],[9,22]]);poly(x,"#a38b6f",[[9,16],[11,11],[15,10],[17,8],[20,11],[23,12],[24,16],[21,20],[18,20],[16,24],[14,20],[11,20]]);px(x,"#d9c896",12,13,9,6);poly(x,"#b6c6d2",[[7,15],[3,12],[8,11]]);poly(x,"#b6c6d2",[[24,14],[29,11],[27,17]]);eye(13,11,"#9ef0ff");px(x,"#d0714f",21,15,4,2)}
 else if(art==="carillume"){poly(x,o,[[4,17],[7,9],[12,7],[15,2],[18,7],[24,9],[29,16],[27,23],[21,24],[18,30],[14,30],[11,24],[6,23]]);poly(x,"#9b815c",[[7,17],[9,11],[13,10],[16,6],[19,10],[22,11],[26,16],[24,20],[19,21],[17,26],[15,26],[13,21],[9,20]]);px(x,"#d7c287",12,12,9,7);poly(x,"#cbd8df",[[5,15],[1,11],[8,10]]);poly(x,"#cbd8df",[[27,14],[31,10],[29,18]]);px(x,"#f2d464",14,17,5,4);eye(12,11,"#b8f3ff");eye(20,11,"#b8f3ff")}
}

function intro(){
 app.innerHTML=`<main class="screen center" style="display:flex;flex-direction:column;justify-content:center"><div class="card">
 <div class="goldtxt tiny">NEW BUILD // OVERWORLD LINK ACTIVE</div><h1 class="title">GLYPHBOUND:<br>NEON WILDS</h1>
 <p class="small muted">Walk the wilds. Capture partners. Build a technique deck. Survive long routes. Defeat tamers and Wardens with a real team.</p>
 <button id="start" class="btn primary full">BEGIN LINK</button></div></main>`;
 document.getElementById("start").onclick=starterScreen;
}
function starterScreen(){
 const ids=["cindercub","sprigbit","ripplet"];
 app.innerHTML=`<main class="screen"><h1 class="title">CHOOSE A PARTNER</h1><p class="small muted">Each starter has two evolution routes. Aggressive card use unlocks one branch; support play and Bond unlock the other.</p>
 <div class="grid3">${ids.map(id=>`<div class="card starter center" data-starter="${id}">${spriteHTML(id,"sm")}<b>${D.monsters[id].name}</b><br>${typeTag(D.monsters[id].type)}<p class="tiny muted">${D.monsters[id].desc}</p></div>`).join("")}</div>
 <div class="card"><label class="tiny">TAMER NAME</label><input id="name" maxlength="10" value="TAMER" style="width:100%;margin:6px 0;padding:10px;background:#0c0e16;color:#fff;border:2px solid #4d4b67;border-radius:5px"><button class="btn primary full" id="link" disabled>LINK PARTNER</button></div></main>`;
 paintSprites();let pick=null;
 document.querySelectorAll("[data-starter]").forEach(e=>e.onclick=()=>{pick=e.dataset.starter;document.querySelectorAll(".starter").forEach(x=>x.classList.toggle("selected",x===e));document.getElementById("link").disabled=false});
 document.getElementById("link").onclick=()=>{state=fresh();state.started=true;state.name=(document.getElementById("name").value||"TAMER").trim().toUpperCase();state.starter=pick;own(pick,true,1);state.party=[pick];state.cardPool={};state.deck.forEach(c=>state.cardPool[c]=(state.cardPool[c]||0)+1);const t=D.monsters[pick].type,tc={BLAZE:"blaze_burst",BLOOM:"thorn_lash",TIDE:"undertow"}[t];state.cardPool[tc]=1;state.deck[15]=tc;save();renderWorld();showModal("LINK ESTABLISHED",`<p class="small">Use the D-pad to walk. Stand beside people, terminals, or caches and press <b>A</b> to interact.</p><p class="small">Wild encounters happen in animated terrain. HP persists until you heal.</p>`)};
}

const solidTiles=new Set(["wall","roof","water","cabinet","coil","fence"]);
function tileAt(map,x,y){return(map.tiles[y]&&map.tiles[y][x])||"wall"}
function npcAt(map,x,y){return map.npcs?.find(n=>n.x===x&&n.y===y)}
function itemAt(map,x,y){return map.items?.find(i=>i.x===x&&i.y===y&&!state.items[i.id])}
function canMove(map,x,y){
 if(solidTiles.has(tileAt(map,x,y)))return false;
 const n=npcAt(map,x,y);if(n)return false;
 return true
}
function renderWorld(){
 battle=null;const map=M[state.map];
 app.innerHTML=`<main class="screen world-shell">
 <div class="world-hud"><div><div class="world-title">${map.name}</div><div class="world-sub">${state.name} · BADGES ${state.badges.length}/4</div></div><div class="row"><span class="badge">◈ ${state.credits}</span><span class="badge">⬡ ${state.binds}</span></div></div>
 <div class="canvas-frame"><canvas id="worldCanvas" width="480" height="320"></canvas><div id="worldMsg" class="world-msg"></div></div>
 <div class="controls"><div class="dpad"><button class="btn up" data-move="up">▲</button><button class="btn left" data-move="left">◀</button><button class="btn down" data-move="down">▼</button><button class="btn right" data-move="right">▶</button></div>
 <div class="menu-strip"><button class="btn" data-menu="team">TEAM</button><button class="btn" data-menu="deck">DECK</button><button class="btn" data-menu="codex">CODEX</button></div>
 <div class="ab"><button class="btn gold" id="interact">A</button><button class="btn" id="quickHeal">B</button></div></div>
 </main>`;
 bindWorldControls();drawWorld();
}
function bindWorldControls(){
 document.querySelectorAll("[data-move]").forEach(b=>{
  const d=b.dataset.move;b.onpointerdown=()=>{movePlayer(d);clearInterval(worldTimer);worldTimer=setInterval(()=>movePlayer(d),170)};b.onpointerup=b.onpointerleave=()=>clearInterval(worldTimer)
 });
 document.getElementById("interact").onclick=interact;
 document.getElementById("quickHeal").onclick=()=>toast("B is reserved for future field tools.");
 document.querySelectorAll("[data-menu]").forEach(b=>b.onclick=()=>openMenu(b.dataset.menu));
 document.onkeydown=e=>{if(document.getElementById("overlay")||battle)return;const k={ArrowUp:"up",w:"up",ArrowDown:"down",s:"down",ArrowLeft:"left",a:"left",ArrowRight:"right",d:"right"}[e.key];if(k){e.preventDefault();movePlayer(k)}else if(e.key===" "||e.key==="Enter")interact()};
}
function movePlayer(dir){
 if(moveLock||battle||document.getElementById("overlay"))return;
 const map=M[state.map];state.dir=dir;let dx=0,dy=0;if(dir==="up")dy=-1;if(dir==="down")dy=1;if(dir==="left")dx=-1;if(dir==="right")dx=1;
 const nx=state.x+dx,ny=state.y+dy;if(!canMove(map,nx,ny)){drawWorld();return}
 state.prev={x:state.x,y:state.y};state.x=nx;state.y=ny;state.steps++;save();drawWorld();
 checkExit();if(battle)return;checkStepEvent();
}
function checkExit(){
 const map=M[state.map],ex=map.exits?.find(e=>e.x===state.x&&e.y===state.y);if(!ex)return;
 if(ex.requires&&!state.badges.includes(ex.requires)){state.x=state.prev.x;state.y=state.prev.y;drawWorld();toast(`The ${ex.requires} badge gate is locked.`);return}
 state.map=ex.to;state.x=ex.tx;state.y=ex.ty;state.prev={x:state.x,y:state.y};save();renderWorld();toast(M[state.map].name);
}
function checkStepEvent(){
 const map=M[state.map],t=tileAt(map,state.x,state.y);
 if((t==="wild"||t==="glitch"||t==="mud"||t==="signal")&&state.steps-state.lastEncounterStep>=4&&Math.random()<.16){
  state.lastEncounterStep=state.steps;save();startWild(map)
 }
}
function front(){
 const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[state.dir];return{x:state.x+d[0],y:state.y+d[1]}
}
function interact(){
 const map=M[state.map],p=front(),npc=npcAt(map,p.x,p.y),item=itemAt(map,p.x,p.y);
 if(npc){handleNPC(npc);return}
 if(item){collect(item);return}
 if(map.heal&&map.heal.x===p.x&&map.heal.y===p.y){healAll();return}
 const hereItem=itemAt(map,state.x,state.y);if(hereItem){collect(hereItem);return}
 toast("Nothing answers.");
}
function handleNPC(n){
 if(n.kind==="talk"){showModal(n.name,`<p class="small">${n.text}</p>`);return}
 if(n.kind==="heal"){healAll(n.text);return}
 if(n.kind==="shop"){openShop();return}
 if(n.trainer){
  const tr=D.trainers[n.trainer];
  if(n.requiresTrainers&&!n.requiresTrainers.every(id=>state.trainerWins[id])){showModal(tr.name,`<p class="small">Come back after defeating ${n.requiresTrainers.map(id=>D.trainers[id].name).join(" and ")}.</p>`);return}
  if(state.trainerWins[n.trainer]){showModal(tr.name,`<p class="small">We already linked. Keep sharpening that team.</p>`);return}
  if(tr.warden&&state.party.length<2){showModal(tr.name,`<p class="small">I will not badge a tamer with only one active signal. Bring at least two partners.</p>`);return}
  if(allFainted()){showModal(tr.name,`<p class="small">Your whole team is unstable. Heal before challenging me.</p>`);return}
  showModal(tr.name,`<p class="small">"${tr.intro}"</p><p class="tiny muted">Team: ${tr.team.map(([id,l])=>`${D.monsters[id].name} Lv.${l}`).join(" · ")}</p>`,()=>startTrainer(n.trainer));
 }
}
function healAll(msg="Terminal link stabilized."){
 Object.values(state.monsters).forEach(m=>m.currentHp=stats(m.id,m.level).maxHp);save();toast(msg+" Team fully healed.");drawWorld()
}
function collect(it){
 state.items[it.id]=true;let msg=it.label;
 if(it.give.binds)state.binds+=it.give.binds;
 if(it.give.credits)state.credits+=it.give.credits;
 if(it.give.card){state.cardPool[it.give.card]=(state.cardPool[it.give.card]||0)+1;msg+=` (${D.cards[it.give.card].name})`}
 save();drawWorld();showModal("FIELD CACHE",`<p class="small">Found: <b>${msg}</b>.</p>`);
}
function openShop(){
 showRaw(`<h2>SUPPLY CLERK</h2><p class="small">Bind Glyph · 18 credits</p><div class="row"><button class="btn gold" id="buy1">BUY 1</button><button class="btn gold" id="buy3">BUY 3 · 50</button></div><button class="btn full" id="close" style="margin-top:12px">LEAVE</button>`);
 document.getElementById("buy1").onclick=()=>buyBind(1,18);document.getElementById("buy3").onclick=()=>buyBind(3,50);document.getElementById("close").onclick=()=>document.getElementById("overlay").remove()
}
function buyBind(n,c){if(state.credits<c){toast("Not enough credits.");return}state.credits-=c;state.binds+=n;save();document.getElementById("overlay").remove();renderWorld();toast(`${n} Bind Glyph${n>1?"s":""} acquired.`)}

function drawWorld(){
 const c=document.getElementById("worldCanvas");if(!c)return;const ctx=c.getContext("2d");ctx.imageSmoothingEnabled=false;
 const map=M[state.map],TS=32,cols=15,rows=10,camX=clamp(state.x-Math.floor(cols/2),0,Math.max(0,map.w-cols)),camY=clamp(state.y-Math.floor(rows/2),0,Math.max(0,map.h-rows));
 for(let sy=0;sy<rows;sy++)for(let sx=0;sx<cols;sx++){const mx=camX+sx,my=camY+sy;drawTile(ctx,tileAt(map,mx,my),sx*TS,sy*TS,TS,mx,my)}
 (map.items||[]).filter(i=>!state.items[i.id]).forEach(i=>{if(i.x>=camX&&i.x<camX+cols&&i.y>=camY&&i.y<camY+rows)drawChest(ctx,(i.x-camX)*TS,(i.y-camY)*TS)});
 (map.npcs||[]).forEach(n=>{if(n.x>=camX&&n.x<camX+cols&&n.y>=camY&&n.y<camY+rows)drawNPC(ctx,(n.x-camX)*TS,(n.y-camY)*TS,n)});
 if(map.heal&&map.heal.x>=camX&&map.heal.x<camX+cols&&map.heal.y>=camY&&map.heal.y<camY+rows)drawTerminal(ctx,(map.heal.x-camX)*TS,(map.heal.y-camY)*TS);
 // follower at previous tile
 if(state.party[0]&&state.prev){const fx=state.prev.x-camX,fy=state.prev.y-camY;if(fx>=0&&fx<cols&&fy>=0&&fy<rows)drawFollower(ctx,fx*TS,fy*TS,D.monsters[state.party[0]].type)}
 drawPlayer(ctx,(state.x-camX)*TS,(state.y-camY)*TS,state.dir);
}
function drawTile(ctx,t,x,y,s,mx,my){
 const checker=(mx+my)%2;
 const fill=c=>{ctx.fillStyle=c;ctx.fillRect(x,y,s,s)};
 if(t==="wall"){fill("#232635");ctx.fillStyle="#35394c";ctx.fillRect(x,y,s,5)}
 else if(t==="town"){fill(checker?"#4b5260":"#505967");ctx.fillStyle="#5f6873";ctx.fillRect(x+4,y+4,24,24)}
 else if(t==="path"){fill(checker?"#a38e68":"#9b835f");ctx.fillStyle="#b8a17b";ctx.fillRect(x+5,y+13,22,5)}
 else if(t==="grass"){fill("#355d3b");ctx.fillStyle="#42734a";for(let i=0;i<4;i++)ctx.fillRect(x+4+i*7,y+6+(i%2)*12,2,7)}
 else if(t==="wild"){fill("#285833");ctx.fillStyle="#69a64f";for(let i=0;i<6;i++){ctx.fillRect(x+3+(i*5)%27,y+4+(i*9)%24,2,9);ctx.fillRect(x+1+(i*5)%27,y+7+(i*9)%24,5,2)}}
 else if(t==="fence"){fill("#3a5e3c");ctx.fillStyle="#c6a46a";ctx.fillRect(x+4,y+7,24,5);ctx.fillRect(x+4,y+20,24,5);ctx.fillRect(x+7,y+3,4,27);ctx.fillRect(x+21,y+3,4,27)}
 else if(t==="roof"){fill("#643a48");ctx.fillStyle="#8b4d59";for(let i=0;i<4;i++)ctx.fillRect(x,y+i*8,s,3)}
 else if(t==="door"){fill("#8d6b4b");ctx.fillStyle="#281d1b";ctx.fillRect(x+9,y+2,14,30);ctx.fillStyle="#f2d568";ctx.fillRect(x+19,y+16,2,2)}
 else if(t==="garden"){fill("#2f5936");ctx.fillStyle="#d98ab7";ctx.fillRect(x+6,y+6,3,3);ctx.fillStyle="#f1d75f";ctx.fillRect(x+19,y+16,3,3)}
 else if(t==="tower"){fill("#303442");ctx.fillStyle="#62697a";ctx.fillRect(x+4,y+4,24,24);ctx.fillStyle="#f1d35b";ctx.fillRect(x+13,y+3,6,26)}
 else if(t==="bridge"){fill("#6e553f");ctx.fillStyle="#9b7955";for(let i=3;i<30;i+=7)ctx.fillRect(x,y+i,s,3)}
 else if(t==="water"){fill(checker?"#244d68":"#285671");ctx.fillStyle="#3b7992";ctx.fillRect(x+2,y+8,13,2);ctx.fillRect(x+17,y+22,12,2)}
 else if(t==="dock"){fill("#594a3c");ctx.fillStyle="#7c674f";for(let i=3;i<32;i+=8)ctx.fillRect(x,y+i,s,3)}
 else if(t==="mud"){fill("#514738");ctx.fillStyle="#6b5b45";ctx.fillRect(x+5,y+7,8,3);ctx.fillRect(x+18,y+19,9,3)}
 else if(t==="arcade"||t==="tile"){fill(checker?"#24253a":"#2b2b43");ctx.fillStyle="#3c3a57";ctx.strokeStyle="#44425f";ctx.strokeRect(x+.5,y+.5,s-1,s-1)}
 else if(t==="cabinet"){fill("#171827");ctx.fillStyle="#6e4ba2";ctx.fillRect(x+5,y+3,22,27);ctx.fillStyle="#55dce2";ctx.fillRect(x+8,y+6,16,9);ctx.fillStyle="#f0d55b";ctx.fillRect(x+11,y+20,3,3)}
 else if(t==="glitch"){fill("#191b2e");ctx.fillStyle=checker?"#754ea8":"#3f8b9b";ctx.fillRect(x+2,y+5,8,4);ctx.fillRect(x+17,y+19,12,3);ctx.fillRect(x+9,y+11,5,7)}
 else if(t==="relay"||t==="metal"){fill(checker?"#363a43":"#3b4049");ctx.fillStyle="#20242b";ctx.fillRect(x+3,y+3,5,5);ctx.fillRect(x+24,y+24,5,5);ctx.strokeStyle="#545b66";ctx.strokeRect(x+.5,y+.5,s-1,s-1)}
 else if(t==="coil"){fill("#252934");ctx.fillStyle="#7f8b98";ctx.fillRect(x+6,y+6,20,20);ctx.fillStyle="#f0d25a";ctx.fillRect(x+13,y+4,6,24)}
 else if(t==="signal"){fill("#18232b");ctx.fillStyle=checker?"#3ea19b":"#5862b6";ctx.fillRect(x+4,y+4,8,8);ctx.fillRect(x+20,y+19,8,8)}
 else fill("#222735")
}
function drawPlayer(ctx,x,y,dir){ctx.fillStyle="#111520";ctx.fillRect(x+9,y+7,14,18);ctx.fillStyle="#d4a071";ctx.fillRect(x+11,y+5,10,8);ctx.fillStyle="#71edc1";ctx.fillRect(x+8,y+13,16,8);ctx.fillStyle="#342c4f";ctx.fillRect(x+9,y+21,6,9);ctx.fillRect(x+18,y+21,6,9);ctx.fillStyle="#f2d568";if(dir==="left")ctx.fillRect(x+6,y+14,3,4);if(dir==="right")ctx.fillRect(x+23,y+14,3,4)}
function drawFollower(ctx,x,y,type){const col={BLAZE:"#ff754d",BLOOM:"#70ce62",TIDE:"#5bb5ed",VOLT:"#e6d15d",GLOOM:"#9e71cf",ALLOY:"#9eabb7"}[type];ctx.fillStyle="#14131a";ctx.fillRect(x+8,y+12,16,14);ctx.fillRect(x+11,y+8,4,6);ctx.fillRect(x+18,y+8,4,6);ctx.fillStyle=col;ctx.fillRect(x+10,y+13,12,11);ctx.fillStyle="#f4f0da";ctx.fillRect(x+12,y+15,2,2);ctx.fillRect(x+18,y+15,2,2)}
function drawNPC(ctx,x,y,n){ctx.fillStyle="#13151e";ctx.fillRect(x+9,y+6,14,20);ctx.fillStyle=n.trainer&&D.trainers[n.trainer]?.warden?"#f2d568":"#b17bd6";ctx.fillRect(x+8,y+12,16,10);ctx.fillStyle="#d8a57a";ctx.fillRect(x+11,y+5,10,8);ctx.fillStyle="#20243a";ctx.fillRect(x+10,y+23,5,8);ctx.fillRect(x+18,y+23,5,8);if(n.trainer&&!state.trainerWins[n.trainer]){ctx.fillStyle="#fff";ctx.fillRect(x+15,y+1,3,3)}}
function drawChest(ctx,x,y){ctx.fillStyle="#20170e";ctx.fillRect(x+6,y+10,20,16);ctx.fillStyle="#d39a45";ctx.fillRect(x+7,y+11,18,14);ctx.fillStyle="#f0d568";ctx.fillRect(x+15,y+15,3,6)}
function drawTerminal(ctx,x,y){ctx.fillStyle="#141923";ctx.fillRect(x+6,y+5,20,23);ctx.fillStyle="#4cd9c0";ctx.fillRect(x+9,y+8,14,9);ctx.fillStyle="#e7e2d0";ctx.fillRect(x+12,y+21,8,3)}

function activeHealthyIndex(){return state.party.findIndex(id=>state.monsters[id]&&state.monsters[id].currentHp>0)}
function allFainted(){return activeHealthyIndex()<0}
function startWild(map){
 if(allFainted()){toast("Your team is unstable. Find a terminal.");return}
 let id=rand(map.encounters);if(map.rare&&Math.random()<map.rare.chance)id=map.rare.id;
 const lvl=map.level[0]+Math.floor(Math.random()*(map.level[1]-map.level[0]+1));startBattle({kind:"wild",enemyTeam:[[id,lvl]],label:"WILD SIGNAL"})
}
function startTrainer(id){const tr=D.trainers[id];startBattle({kind:"trainer",trainerId:id,enemyTeam:clone(tr.team),label:tr.warden?"WARDEN DUEL":"TAMER DUEL"})}
function startBattle(spec){
 const pi=activeHealthyIndex();const pId=state.party[pi],pm=state.monsters[pId];const e0=spec.enemyTeam[0],es=stats(e0[0],e0[1]);
 battle={...spec,playerIndex:pi,enemyIndex:0,enemyId:e0[0],enemyLevel:e0[1],enemyHp:es.maxHp,enemyMax:es.maxHp,guard:0,enemyGuard:0,energy:3,focus:0,bondAttack:0,reflect:0,deck:shuffle(state.deck),discard:[],hand:[],turn:1,log:[],intent:null};
 state.stats.battles++;drawCards(5);rollIntent();save();renderBattle()
}
function drawCards(n){for(let i=0;i<n;i++){if(!battle.deck.length){battle.deck=shuffle(battle.discard);battle.discard=[]}if(battle.deck.length&&battle.hand.length<7)battle.hand.push(battle.deck.shift())}}
function rollIntent(){const m=D.monsters[battle.enemyId],s=stats(battle.enemyId,battle.enemyLevel),r=Math.random();if(r<.62)battle.intent={kind:"attack",power:Math.round(s.atk*.72)+Math.floor(Math.random()*5),label:"STRIKE"};else if(r<.78)battle.intent={kind:"guard",power:10+battle.enemyLevel,label:"FORTIFY"};else if(r<.9)battle.intent={kind:"attack",power:Math.round(s.atk*.9)+4,label:"CHARGED"};else battle.intent={kind:"heal",power:8+battle.enemyLevel,label:"REPAIR"}}
function currentMon(){return state.monsters[state.party[battle.playerIndex]]}
function renderBattle(){
 const pm=currentMon(),pd=D.monsters[pm.id],ed=D.monsters[battle.enemyId],ps=stats(pm.id,pm.level),canBind=battle.kind==="wild"&&bindChance()>0;
 app.innerHTML=`<main class="screen"><div class="topbar"><div class="brand">${battle.label}<small>${battle.kind==="trainer"?D.trainers[battle.trainerId].name:M[state.map].name}</small></div><span class="badge">TURN ${battle.turn}</span></div>
 <div class="battlefield"><div class="combatant">${spriteHTML(battle.enemyId)}<b>${ed.name} Lv.${battle.enemyLevel}</b><br>${typeTag(ed.type)}<div class="stat hp" style="margin-top:5px"><i style="width:${battle.enemyHp/battle.enemyMax*100}%"></i></div><div class="tiny">${battle.enemyHp}/${battle.enemyMax} HP</div><div class="intent">${battle.intent.label} ${battle.intent.power}</div></div>
 <div class="combatant">${spriteHTML(pm.id)}<b>${monName(pm)} Lv.${pm.level}</b><br>${typeTag(pd.type)}<div class="stat hp" style="margin-top:5px"><i style="width:${pm.currentHp/ps.maxHp*100}%"></i></div><div class="tiny">${pm.currentHp}/${ps.maxHp} HP · Guard ${battle.guard}</div></div></div>
 <div class="card"><div class="row spread"><b>ENERGY ${battle.energy}</b><span class="tiny">Enemy ${battle.enemyIndex+1}/${battle.enemyTeam.length} · Your team ${state.party.filter(id=>state.monsters[id].currentHp>0).length}/${state.party.length}</span></div></div>
 <div class="hand">${battle.hand.map((id,i)=>cardBtn(id,i)).join("")}</div>
 <div class="battle-actions"><button class="btn" id="switch">SWITCH</button><button class="btn ${canBind?"gold":""}" id="bind" ${canBind?"":"disabled"}>BIND ${canBind?bindChance()+"%":""}</button><button class="btn primary" id="end">END TURN</button></div>
 <div class="battle-log">${battle.log.slice(-9).map(s=>`› ${s}<br>`).join("")||"› Choose a technique."}</div></main>`;
 paintSprites();document.querySelectorAll("[data-ci]").forEach(b=>b.onclick=()=>playCard(Number(b.dataset.ci)));document.getElementById("end").onclick=endTurn;document.getElementById("switch").onclick=openSwitch;document.getElementById("bind").onclick=attemptBind
}
function cardBtn(id,i){const c=D.cards[id];return `<button class="handcard ${c.kind}" data-ci="${i}" ${c.cost>battle.energy?"disabled":""}><span class="cost">${c.cost}</span><strong>${c.name}</strong><span>${c.desc}</span></button>`}
function log(s){battle.log.push(s)}
function damageEnemy(raw,type,pierce=false){
 let mult=1;if(type){const et=D.monsters[battle.enemyId].type;mult=D.typeChart[type]?.[et]||1}let dmg=Math.max(1,Math.round(raw*mult));if(!pierce){const b=Math.min(battle.enemyGuard,dmg);battle.enemyGuard-=b;dmg-=b}battle.enemyHp=clamp(battle.enemyHp-dmg,0,battle.enemyMax);return{dmg,mult}
}
function playCard(i){
 const id=battle.hand[i],c=D.cards[id];if(!c||c.cost>battle.energy)return;const m=currentMon(),s=stats(m.id,m.level);battle.energy-=c.cost;battle.hand.splice(i,1);battle.discard.push(id);state.stats.cards++;
 if(c.kind==="attack"){m.attackUses++;let raw=c.power+s.atk;if(c.type===D.monsters[m.id].type)raw=Math.round(raw*1.2);if(battle.focus){raw=Math.round(raw*1.5);battle.focus=0}if(battle.bondAttack){raw+=m.bond*2;battle.bondAttack=0}const r=damageEnemy(raw,c.type||D.monsters[m.id].type,c.pierce);log(`${c.name}: ${r.dmg}${r.mult>1?" WEAK":r.mult<1?" RESIST":""}.`)}
 else{m.supportUses++;if(c.guard)battle.guard+=c.guard;if(c.heal)m.currentHp=clamp(m.currentHp+c.heal,0,s.maxHp);if(c.focus)battle.focus=1;if(c.draw)drawCards(c.draw);if(c.energy)battle.energy+=c.energy;if(c.hurt)m.currentHp=clamp(m.currentHp-c.hurt,1,s.maxHp);if(c.reflect)battle.reflect=c.reflect;if(c.bondAttack)battle.bondAttack=1;if(c.teamHeal)state.party.forEach(pid=>{const mm=state.monsters[pid],ss=stats(mm.id,mm.level);mm.currentHp=clamp(mm.currentHp+c.teamHeal,0,ss.maxHp)});log(`${c.name} activated.`)}
 save();if(battle.enemyHp<=0){enemyFainted();return}renderBattle()
}
function enemyFainted(){
 const name=D.monsters[battle.enemyId].name;log(`${name} dropped.`);gainXP(13+battle.enemyLevel*5);
 battle.enemyIndex++;
 if(battle.enemyIndex>=battle.enemyTeam.length){winBattle();return}
 const [id,lvl]=battle.enemyTeam[battle.enemyIndex],s=stats(id,lvl);battle.enemyId=id;battle.enemyLevel=lvl;battle.enemyHp=s.maxHp;battle.enemyMax=s.maxHp;battle.enemyGuard=0;rollIntent();renderBattle();toast(`${D.monsters[id].name} entered!`)
}
function enemyAct(){
 const a=battle.intent,m=currentMon();if(a.kind==="guard"){battle.enemyGuard+=a.power;log(`Enemy gained ${a.power} Guard.`)}else if(a.kind==="heal"){battle.enemyHp=clamp(battle.enemyHp+a.power,0,battle.enemyMax);log(`Enemy repaired ${a.power} HP.`)}else{let dmg=a.power,b=Math.min(battle.guard,dmg);battle.guard-=b;dmg-=b;m.currentHp=clamp(m.currentHp-dmg,0,stats(m.id,m.level).maxHp);if(dmg&&battle.reflect){battle.enemyHp=clamp(battle.enemyHp-battle.reflect,0,battle.enemyMax);battle.reflect=0}log(`Enemy dealt ${dmg} (${b} blocked).`)}
}
function endTurn(){
 enemyAct();if(battle.enemyHp<=0){enemyFainted();return}if(currentMon().currentHp<=0){playerFainted();return}
 battle.turn++;battle.energy=3;battle.hand.forEach(id=>battle.discard.push(id));battle.hand=[];drawCards(5);rollIntent();save();renderBattle()
}
function playerFainted(){
 log(`${monName(currentMon())} collapsed.`);const nxt=state.party.findIndex((id,i)=>i!==battle.playerIndex&&state.monsters[id].currentHp>0);
 if(nxt<0){loseBattle();return}battle.playerIndex=nxt;battle.guard=0;battle.energy=3;battle.hand=[];drawCards(5);rollIntent();save();renderBattle();toast(`${monName(currentMon())} switched in.`)
}
function openSwitch(){
 const viable=state.party.map((id,i)=>({id,i,m:state.monsters[id]})).filter(x=>x.i!==battle.playerIndex&&x.m.currentHp>0);
 if(!viable.length){toast("No healthy partner to switch to.");return}
 const o=showRaw(`<h2>SWITCH PARTNER</h2>${viable.map(x=>`<button class="btn full" style="margin:5px 0" data-sw="${x.i}">${D.monsters[x.id].name} · Lv.${x.m.level} · ${x.m.currentHp} HP</button>`).join("")}<button id="cancelSw" class="btn ghost full">CANCEL</button>`);
 o.querySelectorAll("[data-sw]").forEach(b=>b.onclick=()=>{if(battle.energy<1){toast("Switching costs 1 Energy.");return}battle.energy--;battle.playerIndex=Number(b.dataset.sw);battle.guard=0;o.remove();renderBattle()});document.getElementById("cancelSw").onclick=()=>o.remove()
}
function bindChance(){if(battle.kind!=="wild"||state.binds<1)return 0;const r=battle.enemyHp/battle.enemyMax;if(r>.35)return 0;const st=D.monsters[battle.enemyId].stage;return clamp(Math.round(35+(1-r)*58-(st-1)*18),20,88)}
function attemptBind(){
 const ch=bindChance();if(!ch)return;state.binds--;
 if(Math.random()*100<ch){const id=battle.enemyId,l=battle.enemyLevel,isNew=!state.monsters[id];const m=own(id,false,l);m.currentHp=stats(id,l).maxHp;if(!state.party.includes(id)&&state.party.length<3)state.party.push(id);state.stats.captures++;state.credits+=6;save();battle=null;renderWorld();showModal("GLYPH BOUND",`<div class="monrow">${spriteHTML(id,"sm")}<div><b>${D.monsters[id].name}</b><p class="small">${isNew?"New Codex entry.":"Signal reinforced."}</p></div></div>`);paintSprites()}
 else{log("Bind Glyph shattered.");enemyAct();if(currentMon().currentHp<=0){playerFainted();return}battle.turn++;battle.energy=3;battle.hand=[];drawCards(5);rollIntent();save();renderBattle()}
}
function gainXP(xp){
 const m=currentMon();m.xp+=xp;m.bond=clamp(m.bond+1,0,10);let up=false;while(m.xp>=need(m.level)){m.xp-=need(m.level);m.level++;const s=stats(m.id,m.level);m.currentHp=Math.min(s.maxHp,m.currentHp+8);up=true}if(up)log(`${monName(m)} reached Lv.${m.level}.`)
}
function winBattle(){
 state.stats.wins++;let reward="";
 if(battle.kind==="trainer"){const tr=D.trainers[battle.trainerId];state.trainerWins[battle.trainerId]=true;state.stats.trainerWins++;state.credits+=tr.reward.credits;const c=tr.reward.card;if(c){state.cardPool[c]=(state.cardPool[c]||0)+1;reward=` Technique earned: ${D.cards[c].name}.`}if(tr.warden){state.stats.wardens++;if(tr.reward.badge&&!state.badges.includes(tr.reward.badge))state.badges.push(tr.reward.badge);if(tr.final)state.campaignComplete=true}}
 else state.credits+=5+battle.enemyLevel;
 const evolve=state.party.map(id=>state.monsters[id]).find(m=>evolutionReady(m));save();battle=null;renderWorld();showModal("VICTORY",`<p class="small">Battle won.${reward}</p>`,()=>{if(evolve)showEvolution(evolve.id);if(state.campaignComplete)showModal("CROWN LINKED",`<p class="small">You cleared every Warden and took the Crown Relay. The wilds remain open for collecting, evolving, and deck refinement.</p>`)})
}
function loseBattle(){
 state.stats.losses++;state.credits=Math.max(0,state.credits-15);Object.values(state.monsters).forEach(m=>{const s=stats(m.id,m.level);m.currentHp=Math.max(1,Math.round(s.maxHp*.35))});state.map="town";state.x=M.town.start.x;state.y=M.town.start.y;save();battle=null;renderWorld();showModal("LINK FAILURE",`<p class="small">Your team was recovered in Relay Town. You lost 15 credits and each partner returned at 35% HP.</p>`)
}
function evolutionReady(m){const d=D.monsters[m.id];return d.evolves&&m.level>=8}
function showEvolution(base){
 const m=state.monsters[base],opts=D.monsters[base].evolves;if(!opts)return;const branch=opts.length===2;
 const html=opts.map((id,i)=>{let ok=true,rule="Level 8 reached";if(branch){if(i===0){ok=m.attackUses>=14;rule=`Attack route: ${m.attackUses}/14 attack cards`}else{ok=m.supportUses>=10&&m.bond>=6;rule=`Bond route: ${m.supportUses}/10 support · Bond ${m.bond}/6`}}return `<div class="card center">${spriteHTML(id,"sm")}<b>${D.monsters[id].name}</b><p class="tiny muted">${D.monsters[id].desc}</p><p class="tiny ${ok?"good":"muted"}">${rule}</p><button class="btn gold" data-ev="${id}" ${ok?"":"disabled"}>EVOLVE</button></div>`}).join("");
 const o=showRaw(`<h2>EVOLUTION SIGNAL</h2><div class="grid2">${html}</div><button id="later" class="btn full">LATER</button>`);paintSprites();o.querySelectorAll("[data-ev]").forEach(b=>b.onclick=()=>evolve(base,b.dataset.ev));document.getElementById("later").onclick=()=>o.remove()
}
function evolve(base,target){
 const m=state.monsters[base];delete state.monsters[base];m.id=target;m.currentHp=stats(target,m.level).maxHp;state.monsters[target]=m;state.party=state.party.map(id=>id===base?target:id);if(state.starter===base)state.starter=target;save();document.getElementById("overlay")?.remove();renderWorld();toast(`${D.monsters[target].name} evolved!`)
}

function tabNav(active){return `<nav class="tabbar">${[["world","⌁","WORLD"],["team","◉","TEAM"],["deck","▤","DECK"],["codex","▦","CODEX"],["system","⚙","SYSTEM"]].map(([id,ic,t])=>`<button class="${active===id?"active":""}" data-tab="${id}"><b>${ic}</b>${t}</button>`).join("")}</nav>`}
function shell(inner,active){return `<main class="screen"><div class="topbar"><div class="brand">GLYPHBOUND<small>NEON WILDS // ${D.version}</small></div><span class="badge">BADGES ${state.badges.length}/4</span></div>${inner}</main>${tabNav(active)}`}
function bindTabs(){document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{if(b.dataset.tab==="world"){renderWorld()}else openMenu(b.dataset.tab)})}
function openMenu(which){
 if(which==="team")teamMenu();else if(which==="deck")deckMenu();else if(which==="codex")codexMenu();else systemMenu();bindTabs();paintSprites()
}
function teamMenu(){
 app.innerHTML=shell(`<h1 class="title">ACTIVE TEAM</h1><p class="small muted">The first healthy slot enters battle. HP persists until a terminal heals you.</p><div class="party-list">${state.party.map((id,i)=>teamCard(id,i)).join("")}</div><div class="card"><h3>STORAGE</h3>${Object.keys(state.monsters).filter(id=>!state.party.includes(id)).map(id=>`<button class="btn full" style="margin:4px 0" data-store="${id}">${D.monsters[id].name} · Lv.${state.monsters[id].level}</button>`).join("")||'<p class="small muted">No stored partners.</p>'}</div>`,"team");
 document.querySelectorAll("[data-lead]").forEach(b=>b.onclick=()=>{const id=b.dataset.lead;state.party=[id,...state.party.filter(x=>x!==id)];save();teamMenu();bindTabs();paintSprites()});
 document.querySelectorAll("[data-store]").forEach(b=>b.onclick=()=>{const id=b.dataset.store;if(state.party.length<3)state.party.push(id);else state.party[state.party.length-1]=id;save();teamMenu();bindTabs();paintSprites()});
 document.querySelectorAll("[data-evolution]").forEach(b=>b.onclick=()=>showEvolution(b.dataset.evolution))
}
function teamCard(id,i){const m=state.monsters[id],s=stats(id,m.level),ev=evolutionReady(m);return `<div class="card monrow">${spriteHTML(id,"sm")}<div><div class="row spread"><div><b class="monname">${monName(m)}</b> ${i===0?'<span class="badge good">LEAD</span>':""}<br>${typeTag(D.monsters[id].type)}</div><b>Lv.${m.level}</b></div><div class="tiny">HP ${m.currentHp}/${s.maxHp}</div><div class="stat hp"><i style="width:${m.currentHp/s.maxHp*100}%"></i></div><div class="tiny">XP ${m.xp}/${need(m.level)} · Bond ${m.bond}/10</div><div class="row" style="margin-top:7px">${i?`<button class="btn" data-lead="${id}">MAKE LEAD</button>`:""}${ev?`<button class="btn gold" data-evolution="${id}">EVOLUTION</button>`:""}</div></div></div>`}
function deckMenu(){
 const counts={};state.deck.forEach(c=>counts[c]=(counts[c]||0)+1);const cards=Object.keys(state.cardPool).filter(id=>state.cardPool[id]>0);
 app.innerHTML=shell(`<h1 class="title">TECHNIQUE DECK</h1><p class="small muted">Exactly 16 cards. Maximum 3 copies, limited by what you own.</p><div class="card"><div class="row spread"><b>DECK</b><b class="${state.deck.length===16?"good":"danger"}">${state.deck.length}/16</b></div>${cards.map(id=>deckRow(id,counts[id]||0,state.cardPool[id])).join("")}</div>`,"deck");
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>deckAdj(b.dataset.add,1));document.querySelectorAll("[data-rem]").forEach(b=>b.onclick=()=>deckAdj(b.dataset.rem,-1))
}
function deckRow(id,n,owned){const c=D.cards[id];return `<div class="deckrow"><div><b>${c.name}</b> <span class="badge">${c.kind}</span><div class="tiny muted">${c.desc}</div></div><div class="qty"><button class="btn" data-rem="${id}" ${n<1?"disabled":""}>−</button><b>${n}</b><button class="btn" data-add="${id}" ${n>=Math.min(3,owned)||state.deck.length>=16?"disabled":""}>+</button></div></div>`}
function deckAdj(id,d){if(d>0){const n=state.deck.filter(x=>x===id).length;if(state.deck.length>=16||n>=Math.min(3,state.cardPool[id]||0))return;state.deck.push(id)}else{if(state.deck.length<=10){toast("Keep at least 10 cards while editing.");return}const i=state.deck.indexOf(id);if(i>=0)state.deck.splice(i,1)}save();deckMenu();bindTabs()}
function codexMenu(){
 const ids=Object.keys(D.monsters);app.innerHTML=shell(`<h1 class="title">GLYPH CODEX</h1><p class="small muted">${ids.filter(id=>state.monsters[id]).length}/${ids.length} forms linked.</p><div class="grid2">${ids.map(id=>{const known=!!state.monsters[id],m=D.monsters[id];return `<div class="card center" style="${known?"":"opacity:.35;filter:grayscale(1)"}">${known?spriteHTML(id,"sm"):'<div class="sprite sm" style="margin:auto">?</div>'}<b>${known?m.name:"UNKNOWN"}</b><br>${known?typeTag(m.type):""}<p class="tiny muted">${known?m.desc:"No stable field record."}</p></div>`}).join("")}</div>`,"codex")
}
function systemMenu(){
 app.innerHTML=shell(`<h1 class="title">SYSTEM</h1><div class="card"><h3>PROGRESS</h3><p class="small">Battles ${state.stats.battles} · Wins ${state.stats.wins} · Losses ${state.stats.losses}<br>Trainer wins ${state.stats.trainerWins} · Captures ${state.stats.captures}<br>Wardens ${state.stats.wardens}/4</p></div><div class="card notice"><p class="small"><b>v2 overhaul:</b> full walkable maps, persistent HP, multi-monster trainer teams, route gates, authored creature sprites, harder fixed level curves, and team switching.</p></div><div class="card"><button class="btn danger full" id="reset">ERASE v2 SAVE</button></div>`,"system");
 document.getElementById("reset").onclick=()=>{if(confirm("Erase all v2 progress?")){localStorage.removeItem(KEY);state=fresh();intro()}}
}
function render(){if(!state.started)intro();else renderWorld()}
load();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
render();
})();
