
(() => {
"use strict";
const D = GAME_DATA;
const KEY = "glyphbound_neon_wilds_save_v1";
const app = document.getElementById("app");
let state;
let battle = null;
let toastTimer = null;

const deepClone = o => JSON.parse(JSON.stringify(o));
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
const rand = arr => arr[Math.floor(Math.random()*arr.length)];
const shuffle = arr => {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
};
const hash = s => { let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)} return h>>>0; };

function freshState(){
  return {
    version:D.version, started:false, playerName:"TAMER", starter:null,
    monsters:{}, party:[], deck:[...D.starterDeck], cardPool:{},
    zoneWins:{meadow:0,docks:0,arcade:0,relay:0},
    wardens:{meadow:false,docks:false,arcade:false,relay:false},
    zoneUnlocked:0, binds:5, credits:0, settings:{sound:true},
    stats:{battles:0,wins:0,captures:0,cardsPlayed:0,perfectWins:0},
    campaignComplete:false, lastScreen:"explore"
  };
}
function load(){
  try{
    const raw=localStorage.getItem(KEY);
    state=raw?Object.assign(freshState(),JSON.parse(raw)):freshState();
  }catch(e){state=freshState()}
  if(!state.cardPool)state.cardPool={};
  D.starterDeck.forEach(c=>state.cardPool[c]=(state.cardPool[c]||0)+1);
}
function save(){ localStorage.setItem(KEY,JSON.stringify(state)); }
function toast(msg){
  document.querySelector(".toast")?.remove();
  const el=document.createElement("div"); el.className="toast"; el.textContent=msg; document.body.appendChild(el);
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.remove(),2200);
}
function screenWrap(inner,active="explore"){
  return `<main class="screen">
    <div class="topbar"><div class="brand">GLYPHBOUND<small>NEON WILDS / v${D.version}</small></div>
    <span class="badge">◈ ${state.credits} &nbsp; ⬡ ${state.binds}</span></div>
    ${inner}
  </main>${nav(active)}`;
}
function nav(active){
  if(!state.started||battle)return "";
  const items=[["explore","⌁","EXPLORE"],["team","◉","TEAM"],["deck","▤","DECK"],["archive","▦","CODEX"],["system","⚙","SYSTEM"]];
  return `<nav class="nav">${items.map(([id,ic,tx])=>`<button data-nav="${id}" class="${active===id?"active":""}"><b>${ic}</b>${tx}</button>`).join("")}</nav>`;
}
function bindNav(){
  document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{state.lastScreen=b.dataset.nav;save();render(b.dataset.nav)});
}

function typeTag(t){return `<span class="type ${t}">${t}</span>`}
function monsterLevelStats(id, lvl){
  const m=D.monsters[id], growth=Math.max(0,lvl-1);
  return {maxHp:m.base.hp+growth*5,atk:m.base.atk+growth*2,def:m.base.def+growth};
}
function xpNeed(lvl){return 20+lvl*12}
function ensureOwned(id, source="capture"){
  if(state.monsters[id]) return state.monsters[id];
  const mon={id,level:1,xp:0,bond:source==="starter"?2:0,attackUses:0,supportUses:0,nickname:""};
  state.monsters[id]=mon;
  return mon;
}
function displayName(mon){ return mon.nickname||D.monsters[mon.id].name; }

function spriteHTML(id,cls=""){
  return `<div class="spritebox ${cls}"><canvas class="monster-sprite" data-mon="${id}" width="16" height="16"></canvas></div>`;
}
function paintSprites(){
  document.querySelectorAll("canvas.monster-sprite").forEach(c=>drawSprite(c,c.dataset.mon));
}
function drawSprite(canvas,id){
  const ctx=canvas.getContext("2d"), m=D.monsters[id], seed=hash(id);
  ctx.imageSmoothingEnabled=false; ctx.clearRect(0,0,16,16);
  const main=m.color, acc=m.accent, dark="#19131f", eye="#f8f3d7";
  let x=seed;
  const rnd=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296};
  const evolved=m.rarity==="Evolved";
  const bodyTop=evolved?4:5, bodyBottom=evolved?13:12;
  const half=[];
  for(let y=bodyTop;y<=bodyBottom;y++){
    const width = y<bodyTop+2 ? 2+(evolved?1:0) : (y<bodyBottom-2?3+(evolved?1:0):2+(evolved?1:0));
    half.push([y,width]);
  }
  ctx.fillStyle=dark;
  // ears / horns
  const horn = seed%3;
  if(horn===0){ctx.fillRect(3,2,2,4);ctx.fillRect(11,2,2,4)}
  else if(horn===1){ctx.fillRect(4,1,1,5);ctx.fillRect(11,1,1,5)}
  else {ctx.fillRect(2,4,3,2);ctx.fillRect(11,4,3,2)}
  // tail
  if(seed%2===0){ctx.fillRect(13,9,2,2);ctx.fillRect(14,7,1,3)} else {ctx.fillRect(1,10,2,2);ctx.fillRect(1,8,1,3)}
  // body outline
  half.forEach(([y,w])=>ctx.fillRect(8-w,y,w*2,1));
  // body fill slightly inset
  ctx.fillStyle=main;
  for(let y=bodyTop+1;y<bodyBottom;y++){
    let w=(y<bodyTop+2?2:(y<bodyBottom-2?3:2))+(evolved?1:0);
    ctx.fillRect(8-w+1,y,w*2-2,1);
  }
  // accent pattern
  ctx.fillStyle=acc;
  if(seed%3===0){ctx.fillRect(6,8,4,2);ctx.fillRect(7,10,2,2)}
  else if(seed%3===1){ctx.fillRect(5,9,2,2);ctx.fillRect(9,9,2,2)}
  else {ctx.fillRect(7,7,2,5)}
  // face
  ctx.fillStyle=eye;ctx.fillRect(5,6,2,1);ctx.fillRect(9,6,2,1);
  ctx.fillStyle=dark;ctx.fillRect(6,6,1,1);ctx.fillRect(9,6,1,1);
  // feet
  ctx.fillStyle=dark;ctx.fillRect(4,13,3,1);ctx.fillRect(9,13,3,1);
}

function startScreen(){
  app.innerHTML=`<main class="screen center" style="display:flex;flex-direction:column;justify-content:center">
    <div class="card">
      <div class="gold tiny">199X // SIGNAL FOUND</div>
      <h1 class="pixel-title">GLYPHBOUND:<br>NEON WILDS</h1>
      <p class="subtitle">Catch strange creatures. Build a battle deck. Shape how your partners evolve.</p>
      <hr>
      <p class="small">Three systems, one loop: <b>EXPLORE</b> the wilds, <b>BIND</b> monsters when they are weakened, and <b>DUEL</b> using a customizable deck of technique cards.</p>
      <button id="newGame" class="btn primary full">NEW SIGNAL</button>
    </div>
    <p class="tiny muted">Original monsters & mechanics. Progress saves on this device.</p>
  </main>`;
  document.getElementById("newGame").onclick=starterSelect;
}

function starterSelect(){
  const ids=["cindercub","sprigbit","ripplet"];
  app.innerHTML=`<main class="screen">
    <div class="brand">CHOOSE YOUR FIRST GLYPH</div>
    <p class="subtitle">Your first partner cannot be found in the opening wilds. Its evolution will later branch based on how you battle.</p>
    <div class="grid3">${ids.map(id=>{
      const m=D.monsters[id];
      return `<div class="card starter" data-starter="${id}">
        <canvas class="monster-sprite" data-mon="${id}" width="16" height="16"></canvas>
        <div class="monster-name">${m.name}</div>${typeTag(m.type)}
        <p class="tiny muted">${m.desc}</p>
      </div>`
    }).join("")}</div>
    <div class="card">
      <label class="tiny muted">TAMER NAME</label>
      <input id="playerName" maxlength="10" value="TAMER" style="width:100%;margin-top:6px;padding:10px;background:#101018;color:#fff;border:2px solid #4f4a67;border-radius:4px">
      <button id="confirmStarter" class="btn primary full" style="margin-top:10px" disabled>LINK PARTNER</button>
    </div>
  </main>`;
  paintSprites();
  let chosen=null;
  document.querySelectorAll("[data-starter]").forEach(el=>el.onclick=()=>{
    chosen=el.dataset.starter; document.querySelectorAll(".starter").forEach(x=>x.classList.toggle("selected",x===el));
    document.getElementById("confirmStarter").disabled=false;
  });
  document.getElementById("confirmStarter").onclick=()=>{
    const name=(document.getElementById("playerName").value||"TAMER").trim().toUpperCase().slice(0,10);
    state=freshState();state.started=true;state.playerName=name;state.starter=chosen;
    ensureOwned(chosen,"starter");state.party=[chosen];
    state.cardPool={};
    state.deck.forEach(c=>state.cardPool[c]=(state.cardPool[c]||0)+1);
    const starterType=D.monsters[chosen].type;
    const typeCard={BLAZE:"blaze_burst",BLOOM:"thorn_lash",TIDE:"undertow"}[starterType];
    state.cardPool[typeCard]=1; state.deck[state.deck.length-1]=typeCard;
    save(); render("explore"); toast(`${D.monsters[chosen].name} linked!`);
  };
}

function render(which=state.lastScreen||"explore"){
  if(!state.started){startScreen();return}
  if(which==="explore")renderExplore();
  else if(which==="team")renderTeam();
  else if(which==="deck")renderDeck();
  else if(which==="archive")renderCodex();
  else if(which==="system")renderSystem();
  bindNav();paintSprites();
}

function renderExplore(){
  const completed=Object.values(state.wardens).filter(Boolean).length;
  const campaign = state.campaignComplete?`<div class="card"><b class="gold">CROWN RELAY CLEARED</b><p class="small">The Neon Wilds are fully open. Keep hunting rare partners and perfecting your deck.</p></div>`:"";
  app.innerHTML=screenWrap(`
    <h1 class="pixel-title">NEON WILDS</h1>
    <p class="subtitle">Signal map for ${state.playerName}. Defeat 3 wild encounters in a zone to challenge its Warden.</p>
    ${campaign}
    <div class="row spread"><span class="badge">WARDENS ${completed}/4</span><span class="badge">CAPTURES ${state.stats.captures}</span></div>
    ${D.zones.map((z,i)=>zoneCard(z,i)).join("")}
  `,"explore");
  document.querySelectorAll("[data-hunt]").forEach(b=>b.onclick=()=>startWildBattle(b.dataset.hunt));
  document.querySelectorAll("[data-boss]").forEach(b=>b.onclick=()=>startBossBattle(b.dataset.boss));
}
function zoneCard(z,i){
  const locked=i>state.zoneUnlocked,w=state.zoneWins[z.id]||0,bossReady=w>=3&&!state.wardens[z.id];
  return `<div class="card zone ${locked?"locked":""}">
    <div class="zone-num">0${i+1}</div>
    <div class="gold tiny">${z.tag}</div><h3>${z.name}</h3><p class="small muted">${z.desc}</p>
    <div class="row spread"><div class="progress-dots">${[0,1,2].map(n=>`<i class="${w>n?"on":""}"></i>`).join("")}</div>
      ${state.wardens[z.id]?`<span class="badge good">WARDEN CLEARED</span>`:""}
    </div>
    ${!locked?`<div class="row" style="margin-top:10px">
      <button class="btn primary" data-hunt="${z.id}">SCAN WILDS</button>
      ${bossReady?`<button class="btn gold" data-boss="${z.id}">CHALLENGE WARDEN</button>`:""}
    </div>`:`<p class="tiny muted">Clear the prior Warden to unlock.</p>`}
  </div>`;
}

function getActiveMon(){return state.monsters[state.party[0]]}
function startWildBattle(zoneId){
  const z=D.zones.find(x=>x.id===zoneId), candidates=z.encounters;
  const enemyId=rand(candidates);
  const maxOwnedLvl=Math.max(...state.party.map(id=>state.monsters[id].level));
  const level=clamp(maxOwnedLvl + Math.floor(Math.random()*3)-1,1,8);
  newBattle(enemyId,level,false,zoneId);
}
function startBossBattle(zoneId){
  const z=D.zones.find(x=>x.id===zoneId);
  const level=clamp(3+z.unlock*2,3,9);
  newBattle(z.boss,level,true,zoneId,z.bossName);
}
function newBattle(enemyId,enemyLevel,isBoss,zoneId,bossName=""){
  const active=getActiveMon();
  const ps=monsterLevelStats(active.id,active.level), es=monsterLevelStats(enemyId,enemyLevel);
  battle={
    zoneId,isBoss,bossName, enemyId,enemyLevel,
    playerHp:ps.maxHp,playerMax:ps.maxHp,enemyHp:es.maxHp,enemyMax:es.maxHp,
    guard:0,enemyGuard:0,energy:3,focus:0,bondAttack:0,reflect:0,
    deck:shuffle(state.deck),discard:[],hand:[],turn:1,log:[],enemyIntent:null,
    noDamageTaken:true
  };
  drawCards(4); rollIntent(); state.stats.battles++; save(); renderBattle();
}
function drawCards(n){
  for(let i=0;i<n;i++){
    if(!battle.deck.length){battle.deck=shuffle(battle.discard);battle.discard=[]}
    if(battle.deck.length && battle.hand.length<6) battle.hand.push(battle.deck.shift());
  }
}
function rollIntent(){
  const m=D.monsters[battle.enemyId], lvl=battle.enemyLevel;
  const r=Math.random();
  if(r<.68) battle.enemyIntent={kind:"attack",power:Math.max(5,m.base.atk+lvl*2+Math.floor(Math.random()*5)),label:"STRIKE"};
  else if(r<.86) battle.enemyIntent={kind:"guard",power:8+lvl*2,label:"FORTIFY"};
  else battle.enemyIntent={kind:"attack",power:Math.max(7,m.base.atk+lvl*2+3),label:"CHARGED HIT"};
}
function renderBattle(){
  const p=getActiveMon(), pm=D.monsters[p.id], em=D.monsters[battle.enemyId];
  const bindChance=calcBindChance();
  app.innerHTML=`<main class="screen">
    <div class="topbar"><div class="brand">${battle.isBoss?"WARDEN DUEL":"WILD ENCOUNTER"}<small>${D.zones.find(z=>z.id===battle.zoneId).name}</small></div>
    <span class="badge">TURN ${battle.turn}</span></div>
    <div class="battlefield">
      <div class="combatant">
        ${spriteHTML(battle.enemyId)}
        <div class="monster-name">${em.name} <span class="tiny">Lv.${battle.enemyLevel}</span></div>${typeTag(em.type)}
        <div class="statline hp" style="margin-top:7px"><i style="width:${battle.enemyHp/battle.enemyMax*100}%"></i></div>
        <div class="tiny">${battle.enemyHp}/${battle.enemyMax} HP</div>
        <div class="intent">${battle.enemyIntent.label}: ${battle.enemyIntent.power}</div>
      </div>
      <div class="combatant">
        ${spriteHTML(p.id)}
        <div class="monster-name">${displayName(p)} <span class="tiny">Lv.${p.level}</span></div>${typeTag(pm.type)}
        <div class="statline hp" style="margin-top:7px"><i style="width:${battle.playerHp/battle.playerMax*100}%"></i></div>
        <div class="tiny">${battle.playerHp}/${battle.playerMax} HP</div>
        <div class="badge">GUARD ${battle.guard}</div>
      </div>
    </div>
    <div class="card tight">
      <div class="row spread"><b>ENERGY ${"◆".repeat(battle.energy)}${"◇".repeat(Math.max(0,3-battle.energy))}</b>
      <button class="btn ${bindChance>0?"gold":""}" id="bindBtn" ${bindChance<=0||battle.isBoss?"disabled":""}>BIND ${bindChance>0?bindChance+"%":""}</button></div>
    </div>
    <div class="hand">${battle.hand.map((c,i)=>cardButton(c,i)).join("")}</div>
    <div class="row" style="margin:10px 0">
      <button class="btn full" id="endTurn">END TURN</button>
      <button class="btn danger" id="fleeBtn" ${battle.isBoss?"disabled":""}>FLEE</button>
    </div>
    <div class="battlelog">${battle.log.slice(-8).map(x=>`› ${x}<br>`).join("")||"› Signal locked. Choose a technique."}</div>
  </main>`;
  paintSprites();
  document.querySelectorAll("[data-card-index]").forEach(b=>b.onclick=()=>playCard(Number(b.dataset.cardIndex)));
  document.getElementById("endTurn").onclick=endTurn;
  document.getElementById("fleeBtn").onclick=()=>{battle=null;render("explore");toast("Signal lost.")};
  document.getElementById("bindBtn").onclick=attemptBind;
}
function cardButton(id,i){
  const c=D.cards[id];
  return `<button class="handcard ${c.kind}" data-card-index="${i}" ${c.cost>battle.energy?"disabled":""}>
    <span class="cost">${c.cost}</span><strong>${c.name}</strong><span class="desc">${c.desc}</span>
  </button>`;
}
function calcBindChance(){
  if(battle.isBoss || state.binds<=0) return 0;
  const hpRatio=battle.enemyHp/battle.enemyMax;
  if(hpRatio>.45) return 0;
  const rarity=D.monsters[battle.enemyId].rarity;
  const mod=rarity==="Uncommon"?-10:0;
  return clamp(Math.round(38+(1-hpRatio)*65+mod),25,92);
}
function log(msg){battle.log.push(msg)}
function playCard(i){
  const id=battle.hand[i], c=D.cards[id]; if(!c||c.cost>battle.energy)return;
  battle.energy-=c.cost; battle.hand.splice(i,1); battle.discard.push(id); state.stats.cardsPlayed++;
  const mon=getActiveMon(), m=D.monsters[mon.id], st=monsterLevelStats(mon.id,mon.level);
  if(c.kind==="attack"){
    mon.attackUses++;
    let power=c.power+st.atk;
    let attackType=c.type||m.type;
    if(c.type && c.type===m.type)power=Math.round(power*1.15);
    const enemyType=D.monsters[battle.enemyId].type;
    const mult=(D.typeChart[attackType]&&D.typeChart[attackType][enemyType])||1;
    power=Math.round(power*mult);
    if(battle.focus){power=Math.round(power*1.5);battle.focus=0}
    if(battle.bondAttack){power+=mon.bond*2;battle.bondAttack=0}
    const absorbed=Math.min(battle.enemyGuard,power);battle.enemyGuard-=absorbed;power-=absorbed;
    battle.enemyHp=clamp(battle.enemyHp-power,0,battle.enemyMax);
    log(`${c.name} dealt ${power}${mult>1?" (WEAKNESS)":mult<1?" (RESISTED)":""}.`);
  }else{
    mon.supportUses++;
    if(c.guard){battle.guard+=c.guard;log(`Gained ${c.guard} Guard.`)}
    if(c.heal){battle.playerHp=clamp(battle.playerHp+c.heal,0,battle.playerMax);log(`Recovered ${c.heal} HP.`)}
    if(c.focus){battle.focus+=c.focus;log("Focus primed.")}
    if(c.draw){drawCards(c.draw);log(`Drew ${c.draw} card.`)}
    if(c.energy){battle.energy+=c.energy;log(`Recovered ${c.energy} Energy.`)}
    if(c.hurt){battle.playerHp=clamp(battle.playerHp-c.hurt,1,battle.playerMax);log(`Overclock cost ${c.hurt} HP.`)}
    if(c.reflect){battle.reflect=c.reflect;log("Mirror Guard primed.")}
    if(c.bondAttack){battle.bondAttack=1;log("Bond energy charged.")}
  }
  save();
  if(battle.enemyHp<=0){victory();return}
  renderBattle();
}
function endTurn(){
  enemyAction();
  if(battle.playerHp<=0){defeat();return}
  battle.turn++;battle.energy=3;drawCards(2);rollIntent();renderBattle();
}
function enemyAction(){
  const a=battle.enemyIntent;
  if(a.kind==="guard"){battle.enemyGuard+=a.power;log(`${D.monsters[battle.enemyId].name} gained ${a.power} Guard.`);return}
  let dmg=a.power,blocked=Math.min(battle.guard,dmg);battle.guard-=blocked;dmg-=blocked;
  if(dmg>0){battle.playerHp=clamp(battle.playerHp-dmg,0,battle.playerMax);battle.noDamageTaken=false}
  if(battle.reflect&&dmg>0){battle.enemyHp=clamp(battle.enemyHp-battle.reflect,0,battle.enemyMax);log(`Mirror reflected ${battle.reflect}.`);battle.reflect=0}
  log(`Enemy hit for ${dmg} (${blocked} blocked).`);
}
function attemptBind(){
  const chance=calcBindChance(); if(chance<=0)return;
  state.binds--; save();
  if(Math.random()*100<chance){
    const id=battle.enemyId, wasNew=!state.monsters[id]; ensureOwned(id,"capture");
    if(!state.party.includes(id)&&state.party.length<3)state.party.push(id);
    state.stats.captures++;save();
    const reward=battleRewards(true);
    battle=null;render("team");
    showModal("GLYPH BOUND",`${D.monsters[id].name} joined your archive.${wasNew?" NEW SPECIES!":""}<br><br>${reward}`);
  }else{
    log("Bind failed! The glyph shattered.");
    enemyAction();
    if(battle.playerHp<=0){defeat();return}
    battle.turn++;battle.energy=3;drawCards(2);rollIntent();renderBattle();
  }
}
function battleRewards(captured=false){
  const p=getActiveMon();
  const xp=10+battle.enemyLevel*5+(battle.isBoss?15:0), credits=4+battle.enemyLevel*2;
  p.xp+=xp;p.bond=clamp(p.bond+1,0,10);state.credits+=credits;
  let levels=0;
  while(p.xp>=xpNeed(p.level)){p.xp-=xpNeed(p.level);p.level++;levels++}
  let txt=`+${xp} XP, +${credits} credits, +1 Bond.`;
  if(levels)txt+=` ${displayName(p)} reached Lv.${p.level}!`;
  return txt;
}
function victory(){
  state.stats.wins++; if(battle.noDamageTaken)state.stats.perfectWins++;
  const z=D.zones.find(x=>x.id===battle.zoneId);
  const rewardText=battleRewards();
  let extra="";
  if(battle.isBoss){
    state.wardens[z.id]=true;
    const idx=D.zones.findIndex(x=>x.id===z.id);
    state.zoneUnlocked=Math.max(state.zoneUnlocked,Math.min(D.zones.length-1,idx+1));
    const card=z.reward;state.cardPool[card]=(state.cardPool[card]||0)+1;
    extra=`<br><br><b>${z.bossName} defeated.</b><br>Technique acquired: ${D.cards[card].name}.`;
    if(z.id==="relay")state.campaignComplete=true;
  }else state.zoneWins[z.id]=(state.zoneWins[z.id]||0)+1;
  const evoId=getEvolutionReady(getActiveMon());
  save(); battle=null; render("explore");
  showModal("VICTORY",`${rewardText}${extra}`,()=>{
    if(evoId)showEvolution(evoId);
  });
}
function defeat(){
  const lost=Math.min(8,state.credits);state.credits-=lost;save();battle=null;render("explore");
  showModal("SIGNAL BROKEN",`Your partner fainted. You lost ${lost} credits, but no monsters or cards.`);
}

function getEvolutionReady(mon){
  const data=D.monsters[mon.id]; if(!data.evolves||mon.level<5)return null;
  return mon.id;
}
function showEvolution(baseId){
  const mon=state.monsters[baseId], opts=D.monsters[baseId].evolves;
  if(!opts)return;
  const starterBranch=opts.length===2;
  const html=opts.map((id,idx)=>{
    const target=D.monsters[id];
    let rule="",ok=true;
    if(starterBranch){
      if(idx===0){ok=mon.attackUses>=8;rule=`Attack route: ${mon.attackUses}/8 attack cards played`}
      else {ok=mon.supportUses>=6 && mon.bond>=5;rule=`Bond route: ${mon.supportUses}/6 support cards, Bond ${mon.bond}/5`}
    }else rule="Level 5 reached";
    return `<div class="evo-opt">${spriteHTML(id,"sm")}<b>${target.name}</b><br>${typeTag(target.type)}
      <p class="tiny muted">${target.desc}</p><p class="tiny ${ok?"good":"muted"}">${rule}</p>
      <button class="btn primary" data-evolve="${id}" ${ok?"":"disabled"}>EVOLVE</button></div>`;
  }).join("");
  showRawModal(`<h2>EVOLUTION SIGNAL</h2><p class="small">Your partner can rewrite its glyph pattern. Starter partners branch according to how you trained them.</p><div class="evo-options">${html}</div><button class="btn ghost full" id="closeModal">LATER</button>`);
  paintSprites();
  document.querySelectorAll("[data-evolve]").forEach(b=>b.onclick=()=>evolve(baseId,b.dataset.evolve));
  document.getElementById("closeModal").onclick=closeModal;
}
function evolve(baseId,targetId){
  const mon=state.monsters[baseId];
  delete state.monsters[baseId];
  mon.id=targetId;mon.bond=clamp(mon.bond+1,0,10);
  state.monsters[targetId]=mon;
  state.party=state.party.map(x=>x===baseId?targetId:x);
  if(state.starter===baseId)state.starter=targetId;
  save();closeModal();render("team");toast(`${D.monsters[targetId].name} evolved!`);
}

function renderTeam(){
  const owned=state.party.map(id=>state.monsters[id]).filter(Boolean);
  app.innerHTML=screenWrap(`
    <h1 class="pixel-title">ACTIVE TEAM</h1>
    <p class="subtitle">Up to 3 linked monsters travel with you. The first slot battles.</p>
    ${owned.map((mon,i)=>teamCard(mon,i)).join("")}
    <div class="card"><b>ARCHIVE STORAGE</b><p class="tiny muted">Tap a stored monster to swap it into your team.</p>
      ${Object.values(state.monsters).filter(m=>!state.party.includes(m.id)).map(m=>storageItem(m)).join("")||`<p class="small muted">No stored monsters yet.</p>`}
    </div>
  `,"team");
  document.querySelectorAll("[data-lead]").forEach(b=>b.onclick=()=>{const id=b.dataset.lead;state.party=[id,...state.party.filter(x=>x!==id)];save();renderTeam()});
  document.querySelectorAll("[data-storage]").forEach(b=>b.onclick=()=>swapStored(b.dataset.storage));
  document.querySelectorAll("[data-evo-check]").forEach(b=>b.onclick=()=>showEvolution(b.dataset.evoCheck));
}
function teamCard(mon,i){
  const m=D.monsters[mon.id],st=monsterLevelStats(mon.id,mon.level),need=xpNeed(mon.level),evo=getEvolutionReady(mon);
  return `<div class="card"><div class="collection-item">${spriteHTML(mon.id,"sm")}
    <div style="flex:1"><div class="row spread"><div><div class="monster-name">${displayName(mon)} ${i===0?'<span class="badge good">LEAD</span>':""}</div>${typeTag(m.type)}</div><b>Lv.${mon.level}</b></div>
    <div class="tiny muted" style="margin-top:7px">HP ${st.maxHp} · ATK ${st.atk} · DEF ${st.def}</div>
    <div class="tiny">XP ${mon.xp}/${need}</div><div class="statline xp"><i style="width:${mon.xp/need*100}%"></i></div>
    <div class="tiny">BOND ${mon.bond}/10</div><div class="statline bond"><i style="width:${mon.bond*10}%"></i></div>
    </div></div>
    <div class="row" style="margin-top:10px">${i?`<button class="btn" data-lead="${mon.id}">MAKE LEAD</button>`:""}
    ${evo?`<button class="btn gold" data-evo-check="${mon.id}">EVOLUTION</button>`:""}</div>
  </div>`;
}
function storageItem(mon){
  return `<button class="btn full" data-storage="${mon.id}" style="margin-top:7px;text-align:left">${D.monsters[mon.id].name} · Lv.${mon.level} · Bond ${mon.bond}</button>`;
}
function swapStored(id){
  if(state.party.length<3){state.party.push(id)}
  else {const out=state.party[state.party.length-1];state.party[state.party.length-1]=id;toast(`${D.monsters[id].name} swapped with ${D.monsters[out].name}.`)}
  save();renderTeam();
}

function renderDeck(){
  const counts={};state.deck.forEach(c=>counts[c]=(counts[c]||0)+1);
  const pool=state.cardPool||{};
  const all=Object.keys(pool).filter(c=>pool[c]>0);
  app.innerHTML=screenWrap(`
    <h1 class="pixel-title">TECHNIQUE DECK</h1>
    <p class="subtitle">Battle with exactly 10 cards. Duplicate limit: 3. Your lead monster can use any card, but same-type techniques receive a bonus.</p>
    <div class="card"><div class="row spread"><b>DECK SIZE</b><span class="${state.deck.length===10?"good":"danger"}">${state.deck.length}/10</span></div>
      ${all.map(id=>deckRow(id,counts[id]||0,pool[id]||0)).join("")}
    </div>
  `,"deck");
  document.querySelectorAll("[data-addcard]").forEach(b=>b.onclick=()=>deckAdjust(b.dataset.addcard,1));
  document.querySelectorAll("[data-removecard]").forEach(b=>b.onclick=()=>deckAdjust(b.dataset.removecard,-1));
}
function deckRow(id,inDeck,owned){
  const c=D.cards[id];return `<div class="deckcard"><div><b>${c.name}</b> <span class="badge">${c.kind.toUpperCase()}</span><div class="tiny muted">${c.desc}</div><div class="tiny">Owned ${owned}</div></div>
    <div class="qty"><button class="btn" data-removecard="${id}" ${inDeck<=0?"disabled":""}>−</button><b>${inDeck}</b><button class="btn" data-addcard="${id}" ${inDeck>=Math.min(3,owned)||state.deck.length>=10?"disabled":""}>+</button></div></div>`;
}
function deckAdjust(id,delta){
  if(delta>0){const owned=state.cardPool[id]||0,count=state.deck.filter(x=>x===id).length;if(state.deck.length>=10||count>=Math.min(3,owned))return;state.deck.push(id)}
  else {const i=state.deck.indexOf(id);if(i>=0)state.deck.splice(i,1)}
  save();renderDeck();
}

function renderCodex(){
  const ids=Object.keys(D.monsters), ownedCount=ids.filter(id=>state.monsters[id]).length;
  app.innerHTML=screenWrap(`
    <h1 class="pixel-title">GLYPH CODEX</h1>
    <div class="row spread"><p class="subtitle">Known species and field notes.</p><span class="badge">${ownedCount}/${ids.length}</span></div>
    <div class="grid2">${ids.map(id=>codexItem(id)).join("")}</div>
  `,"archive");
}
function codexItem(id){
  const known=!!state.monsters[id],m=D.monsters[id];
  return `<div class="card tight ${known?"":"collection-item unknown"} center">${known?spriteHTML(id,"sm"):`<div class="spritebox sm" style="margin:auto">?</div>`}
    <b>${known?m.name:"UNKNOWN"}</b><br>${known?typeTag(m.type):""}<p class="tiny muted">${known?m.desc:"No stable signal recorded."}</p></div>`;
}

function renderSystem(){
  app.innerHTML=screenWrap(`
    <h1 class="pixel-title">SYSTEM</h1>
    <div class="card"><h3>FIELD STATS</h3>
      <p class="small">Battles ${state.stats.battles} · Wins ${state.stats.wins}<br>Captures ${state.stats.captures} · Cards played ${state.stats.cardsPlayed}<br>Perfect wins ${state.stats.perfectWins}</p>
    </div>
    <div class="card"><h3>HOW IT WORKS</h3>
      <p class="small"><b>Catch:</b> weaken a wild monster below 45% HP, then spend a Bind Glyph.</p>
      <p class="small"><b>Cards:</b> each turn starts with 3 Energy. Build a 10-card deck around your lead monster.</p>
      <p class="small"><b>Evolution:</b> most monsters evolve at Lv.5. Starter partners branch according to aggressive vs. supportive training.</p>
      <p class="small"><b>Wardens:</b> win 3 wild fights in a zone to challenge its Warden and unlock the next region.</p>
    </div>
    <div class="card"><button class="btn gold full" id="buyBind">BUY BIND GLYPH · 15 ◈</button>
      <p class="tiny muted center">Current supply: ${state.binds}</p></div>
    <div class="card"><button class="btn danger full" id="resetGame">ERASE SAVE</button></div>
  `,"system");
  document.getElementById("buyBind").onclick=()=>{if(state.credits<15){toast("Not enough credits.");return}state.credits-=15;state.binds++;save();renderSystem();toast("Bind Glyph acquired.")};
  document.getElementById("resetGame").onclick=()=>{if(confirm("Erase all Glyphbound progress on this device?")){localStorage.removeItem(KEY);state=freshState();battle=null;startScreen()}};
}

function showRawModal(html){
  const ov=document.createElement("div");ov.className="overlay";ov.id="overlay";ov.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(ov);
}
function closeModal(){document.getElementById("overlay")?.remove()}
function showModal(title,body,onClose=null){
  showRawModal(`<h2>${title}</h2><div class="small" style="line-height:1.5">${body}</div><button class="btn primary full" id="modalOk" style="margin-top:14px">CONTINUE</button>`);
  document.getElementById("modalOk").onclick=()=>{closeModal();if(onClose)onClose()};
}

load();
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))}
render(state.started?state.lastScreen:"explore");
})();
