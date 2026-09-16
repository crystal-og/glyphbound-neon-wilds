
const GB_MAPS = (() => {
 const W=28,H=20;
 const blank=(w=W,h=H,t="floor")=>Array.from({length:h},()=>Array(w).fill(t));
 const rect=(g,x,y,w,h,t)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(g[yy]&&g[yy][xx]!==undefined)g[yy][xx]=t};
 const line=(g,x1,y1,x2,y2,t)=>{if(x1===x2){for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)g[y][x1]=t}else{for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)g[y1][x]=t}};
 const border=g=>{for(let x=0;x<g[0].length;x++){g[0][x]="wall";g[g.length-1][x]="wall"}for(let y=0;y<g.length;y++){g[y][0]="wall";g[y][g[0].length-1]="wall"}};
 const finish=(id,name,g,opt)=>({id,name,w:g[0].length,h:g.length,tiles:g,...opt});

 // Relay Town
 let g=blank(24,18,"town");border(g);
 rect(g,2,2,7,5,"roof"); rect(g,4,6,3,1,"door");
 rect(g,14,2,7,5,"roof"); rect(g,16,6,3,1,"door");
 rect(g,4,11,6,4,"garden");rect(g,14,11,6,4,"garden");
 line(g,1,9,22,9,"path");line(g,11,1,11,16,"path");
 const town=finish("town","Relay Town",g,{
  palette:"town",start:{x:11,y:12},
  exits:[{x:22,y:9,to:"meadow",tx:2,ty:10}],
  npcs:[
   {id:"prof",x:10,y:8,name:"Archivist Ren",kind:"talk",text:"The Neon Wilds are waking again. Capture partners, build a technique deck, and use terminals before long routes."},
   {id:"shop",x:13,y:9,name:"Supply Clerk",kind:"shop"},
   {id:"healer",x:17,y:7,name:"Link Nurse",kind:"heal",text:"I can stabilize every linked monster."}
  ],
  items:[{id:"town_bind",x:7,y:9,label:"3 Bind Glyphs",give:{binds:3}}],
  encounterTiles:[]
 });

 // Meadow
 g=blank(32,22,"grass");border(g);
 rect(g,1,8,30,5,"path"); rect(g,4,2,7,5,"wild");rect(g,17,2,11,5,"wild");rect(g,4,15,9,5,"wild");rect(g,19,15,9,5,"wild");
 line(g,14,1,14,20,"fence"); g[10][14]="path"; g[11][14]="path";
 rect(g,25,8,5,5,"tower");g[10][25]="door";
 rect(g,15,8,2,5,"bridge");
 const meadow=finish("meadow","Circuit Meadow",g,{
  palette:"meadow",start:{x:2,y:10},
  exits:[{x:1,y:10,to:"town",tx:21,ty:9},{x:30,y:11,to:"docks",tx:2,ty:10,requires:"MEADOW"}],
  npcs:[
   {id:"nico",trainer:"nico",x:10,y:9,dir:"down"},
   {id:"arden",trainer:"arden",x:20,y:12,dir:"up"},
   {id:"yara",trainer:"yara",x:27,y:10,dir:"left",requiresTrainers:["nico","arden"]}
  ],
  items:[
   {id:"meadow_bind",x:8,y:4,label:"2 Bind Glyphs",give:{binds:2}},
   {id:"meadow_card",x:23,y:18,label:"Technique: Blaze Burst",give:{card:"blaze_burst"}}
  ],
  heal:{x:16,y:10},encounters:["glimwing","sprigbit","ferrat"],level:[2,5],
  rare:{id:"tinling",chance:.08}
 });

 // Docks
 g=blank(34,22,"dock");border(g);
 rect(g,1,1,32,20,"water");
 rect(g,1,8,32,5,"dock");rect(g,4,3,4,15,"dock");rect(g,13,2,4,16,"dock");rect(g,22,4,4,16,"dock");rect(g,29,2,4,17,"dock");
 rect(g,6,14,22,6,"mud");rect(g,8,15,5,4,"wild");rect(g,18,15,7,4,"wild");
 const docks=finish("docks","Rustwater Docks",g,{
  palette:"docks",start:{x:2,y:10},
  exits:[{x:1,y:10,to:"meadow",tx:29,ty:11},{x:32,y:10,to:"arcade",tx:2,ty:10,requires:"DOCKS"}],
  npcs:[
   {id:"tess",trainer:"tess",x:9,y:9},{id:"omar",trainer:"omar",x:19,y:11},{id:"pike",trainer:"pike",x:30,y:9,requiresTrainers:["tess","omar"]}
  ],
  items:[{id:"dock_bind",x:5,y:4,label:"3 Bind Glyphs",give:{binds:3}},{id:"dock_card",x:24,y:17,label:"Technique: Thorn Lash",give:{card:"thorn_lash"}}],
  heal:{x:14,y:10},encounters:["ripplet","ferrat","coilfin"],level:[5,8],rare:{id:"mireimp",chance:.09}
 });

 // Arcade
 g=blank(30,22,"arcade");border(g);
 rect(g,2,2,26,18,"tile");rect(g,5,4,5,4,"cabinet");rect(g,20,4,5,4,"cabinet");rect(g,5,14,5,4,"cabinet");rect(g,20,14,5,4,"cabinet");
 rect(g,11,3,8,16,"glitch");rect(g,3,9,24,4,"path");
 const arcade=finish("arcade","Nightglass Arcade",g,{
  palette:"arcade",start:{x:2,y:10},
  exits:[{x:1,y:10,to:"docks",tx:31,ty:10},{x:28,y:10,to:"crown",tx:2,ty:11,requires:"ARCADE"}],
  npcs:[{id:"juni",trainer:"juni",x:8,y:10},{id:"vex",trainer:"vex",x:16,y:8},{id:"miri",trainer:"miri",x:26,y:10,requiresTrainers:["juni","vex"]}],
  items:[{id:"arcade_bind",x:7,y:16,label:"3 Bind Glyphs",give:{binds:3}},{id:"arcade_card",x:22,y:5,label:"Technique: Steel Ram",give:{card:"steel_ram"}}],
  heal:{x:14,y:11},encounters:["shadecko","glimwing","mireimp","tinling"],level:[8,11],rare:{id:"coilfin",chance:.07}
 });

 // Crown Relay
 g=blank(32,24,"relay");border(g);
 rect(g,2,2,28,20,"metal");rect(g,3,10,26,4,"path");
 rect(g,5,4,4,4,"coil");rect(g,12,4,4,4,"coil");rect(g,19,4,4,4,"coil");rect(g,26,4,3,4,"coil");
 rect(g,5,16,4,4,"coil");rect(g,12,16,4,4,"coil");rect(g,19,16,4,4,"coil");rect(g,26,16,3,4,"coil");
 rect(g,10,8,12,8,"signal");
 const crown=finish("crown","Crown Relay",g,{
  palette:"crown",start:{x:2,y:11},
  exits:[{x:1,y:11,to:"arcade",tx:27,ty:10}],
  npcs:[{id:"helix",trainer:"helix",x:8,y:11},{id:"sora",trainer:"sora",x:18,y:12},{id:"vale",trainer:"vale",x:27,y:11,requiresTrainers:["helix","sora"]}],
  items:[{id:"crown_bind",x:7,y:18,label:"4 Bind Glyphs",give:{binds:4}},{id:"crown_card",x:27,y:6,label:"Technique: Emergency Patch",give:{card:"emergency_patch"}}],
  heal:{x:4,y:11},encounters:["shadecko","tinling","coilfin","ferrat"],level:[11,14],rare:{id:"mireimp",chance:.06}
 });

 return {town,meadow,docks,arcade,crown};
})();
