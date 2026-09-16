
const GB_DATA = {
 version:"2.0.0",
 types:["BLAZE","BLOOM","TIDE","VOLT","GLOOM","ALLOY"],
 typeChart:{
  BLAZE:{BLOOM:1.5,ALLOY:1.35,TIDE:.7},
  BLOOM:{TIDE:1.5,VOLT:1.25,BLAZE:.7},
  TIDE:{BLAZE:1.5,ALLOY:1.2,VOLT:.7},
  VOLT:{TIDE:1.5,ALLOY:1.2,BLOOM:.8},
  GLOOM:{BLOOM:1.4,VOLT:1.2,ALLOY:.8},
  ALLOY:{GLOOM:1.5,BLOOM:1.2,BLAZE:.8}
 },
 monsters:{
  cindercub:{name:"Cindercub",type:"BLAZE",stage:1,base:{hp:48,atk:10,def:6},art:"cindercub",desc:"A kiln-bellied cub. Its tail coal flares when it smells danger.",evolves:["magmara","solvulp"]},
  magmara:{name:"Magmara",type:"BLAZE",stage:2,base:{hp:79,atk:18,def:10},art:"magmara",desc:"A basalt prowler venting heat through chimney-like shoulders."},
  solvulp:{name:"Solvulp",type:"BLAZE",stage:2,base:{hp:72,atk:14,def:15},art:"solvulp",desc:"A ceramic fox whose controlled blue flame reflects a disciplined bond."},

  sprigbit:{name:"Sprigbit",type:"BLOOM",stage:1,base:{hp:53,atk:8,def:8},art:"sprigbit",desc:"A burrowing seed-beast that roots itself into dead circuit boards.",evolves:["thornjaw","mossoracle"]},
  thornjaw:{name:"Thornjaw",type:"BLOOM",stage:2,base:{hp:84,atk:16,def:13},art:"thornjaw",desc:"A bramble boar with a jaw framed by living thorn shears."},
  mossoracle:{name:"Mossoracle",type:"BLOOM",stage:2,base:{hp:76,atk:12,def:17},art:"mossoracle",desc:"A patient antlered seer carrying a luminous garden on its back."},

  ripplet:{name:"Ripplet",type:"TIDE",stage:1,base:{hp:50,atk:9,def:7},art:"ripplet",desc:"A river kite-creature whose translucent fins gather radio static.",evolves:["abyssail","coralisk"]},
  abyssail:{name:"Abyssail",type:"TIDE",stage:2,base:{hp:75,atk:18,def:11},art:"abyssail",desc:"A predatory manta that cuts through water like a black sail."},
  coralisk:{name:"Coralisk",type:"TIDE",stage:2,base:{hp:82,atk:13,def:16},art:"coralisk",desc:"A reef serpent armored in branching pink antenna coral."},

  glimwing:{name:"Glimwing",type:"VOLT",stage:1,base:{hp:43,atk:11,def:5},art:"glimwing",desc:"A neon moth that roosts behind old arcade marquees.",evolves:["luxmoth"]},
  luxmoth:{name:"Luxmoth",type:"VOLT",stage:2,base:{hp:69,atk:17,def:10},art:"luxmoth",desc:"Its stained-glass wings flash warnings in forgotten machine code."},

  ferrat:{name:"Ferrat",type:"ALLOY",stage:1,base:{hp:58,atk:8,def:12},art:"ferrat",desc:"A scrapyard rodent with bolt teeth and a magnetic tail.",evolves:["ironmaw"]},
  ironmaw:{name:"Ironmaw",type:"ALLOY",stage:2,base:{hp:91,atk:14,def:19},art:"ironmaw",desc:"A plated tunneler whose rotating jaw can bite through rail steel."},

  shadecko:{name:"Shadecko",type:"GLOOM",stage:1,base:{hp:47,atk:11,def:7},art:"shadecko",desc:"A wall-crawling mimic that steals the shadow beneath lit signs.",evolves:["noctalon"]},
  noctalon:{name:"Noctalon",type:"GLOOM",stage:2,base:{hp:73,atk:18,def:12},art:"noctalon",desc:"A rooftop ambusher with crescent claws and a cloak-like membrane."},

  coilfin:{name:"Coilfin",type:"VOLT",stage:1,base:{hp:51,atk:12,def:7},art:"coilfin",desc:"An eel whose copper-ring fins hum before thunderstorms.",evolves:["dynasea"]},
  dynasea:{name:"Dynasea",type:"VOLT",stage:2,base:{hp:78,atk:18,def:12},art:"dynasea",desc:"A serpentine storm engine wrapped in floating induction rings."},

  mireimp:{name:"Mireimp",type:"GLOOM",stage:1,base:{hp:55,atk:9,def:9},art:"mireimp",desc:"A swamp goblin-frog that bottles reflected faces in its throat sac.",evolves:["bogeyre"]},
  bogeyre:{name:"Bogeyre",type:"GLOOM",stage:2,base:{hp:87,atk:15,def:15},art:"bogeyre",desc:"A hulking marsh idol whose eyes glow from inside a hollow crown."},

  tinling:{name:"Tinling",type:"ALLOY",stage:1,base:{hp:45,atk:10,def:10},art:"tinling",desc:"A clockwork songbird assembled from vending-machine springs.",evolves:["carillume"]},
  carillume:{name:"Carillume",type:"ALLOY",stage:2,base:{hp:70,atk:15,def:16},art:"carillume",desc:"A cathedral-bell bird with resonant bronze feathers."}
 },
 cards:{
  quick_jab:{name:"Quick Jab",cost:1,kind:"attack",power:7,desc:"Reliable neutral strike."},
  heavy_strike:{name:"Heavy Strike",cost:2,kind:"attack",power:13,desc:"Heavy neutral damage."},
  brace:{name:"Brace",cost:1,kind:"guard",guard:11,desc:"Gain 11 Guard."},
  harden:{name:"Harden",cost:2,kind:"guard",guard:20,desc:"Gain 20 Guard."},
  patch:{name:"Patch",cost:2,kind:"heal",heal:13,desc:"Restore 13 HP."},
  focus:{name:"Focus",cost:1,kind:"support",focus:1,desc:"Next attack deals 50% more."},
  scout:{name:"Scout",cost:0,kind:"support",draw:1,desc:"Draw a card."},
  cycle:{name:"Cycle",cost:1,kind:"support",draw:2,desc:"Draw 2 cards."},
  blaze_burst:{name:"Blaze Burst",cost:2,kind:"attack",power:16,type:"BLAZE",desc:"Blaze technique."},
  thorn_lash:{name:"Thorn Lash",cost:2,kind:"attack",power:16,type:"BLOOM",desc:"Bloom technique."},
  undertow:{name:"Undertow",cost:2,kind:"attack",power:16,type:"TIDE",desc:"Tide technique."},
  arc_flash:{name:"Arc Flash",cost:2,kind:"attack",power:16,type:"VOLT",desc:"Volt technique."},
  night_bite:{name:"Night Bite",cost:2,kind:"attack",power:16,type:"GLOOM",desc:"Gloom technique."},
  steel_ram:{name:"Steel Ram",cost:2,kind:"attack",power:16,type:"ALLOY",desc:"Alloy technique."},
  mirror_guard:{name:"Mirror Guard",cost:2,kind:"guard",guard:13,reflect:5,desc:"Guard and reflect."},
  bond_surge:{name:"Bond Surge",cost:2,kind:"support",bondAttack:1,desc:"Next attack gains Bond ×2."},
  emergency_patch:{name:"Emergency Patch",cost:3,kind:"heal",heal:27,desc:"Large heal."},
  overclock:{name:"Overclock",cost:0,kind:"support",energy:2,hurt:6,desc:"Gain 2 Energy; lose 6 HP."},
  pierce:{name:"Piercing Line",cost:2,kind:"attack",power:11,pierce:true,desc:"Ignores Guard."},
  rally:{name:"Rally Link",cost:1,kind:"support",teamHeal:5,desc:"Restore 5 HP to the whole team."}
 },
 starterDeck:["quick_jab","quick_jab","quick_jab","heavy_strike","brace","brace","brace","patch","patch","focus","scout","scout","cycle","harden","quick_jab","heavy_strike"],
 trainers:{
  nico:{name:"Runner Nico",map:"meadow",team:[["glimwing",3],["sprigbit",3]],reward:{credits:24,card:"cycle"},intro:"You made it past the old pylons? Show me your link discipline."},
  arden:{name:"Tamer Arden",map:"meadow",team:[["ferrat",4],["glimwing",4]],reward:{credits:28,card:"harden"},intro:"Wild catches mean nothing if you cannot rotate a tired partner."},
  yara:{name:"Warden Yara",map:"meadow",warden:true,team:[["glimwing",5],["sprigbit",5],["luxmoth",6]],reward:{credits:55,card:"arc_flash",badge:"MEADOW"},intro:"The Meadow badge is not for a one-monster sprint. Show me a real team."},

  tess:{name:"Dockhand Tess",map:"docks",team:[["ripplet",6],["ferrat",6]],reward:{credits:32,card:"undertow"},intro:"These docks chew up reckless tamers."},
  omar:{name:"Rigger Omar",map:"docks",team:[["coilfin",6],["ferrat",7],["ripplet",7]],reward:{credits:36,card:"mirror_guard"},intro:"Three signals. No freebies. Ready?"},
  pike:{name:"Warden Pike",map:"docks",warden:true,team:[["ironmaw",8],["coilfin",8],["coralisk",9]],reward:{credits:70,card:"steel_ram",badge:"DOCKS"},intro:"Your starter alone will fold here. Prove you learned the docks."},

  juni:{name:"Cabinet Kid Juni",map:"arcade",team:[["shadecko",9],["glimwing",9],["tinling",9]],reward:{credits:42,card:"night_bite"},intro:"Winner gets the high-score corridor."},
  vex:{name:"Glitch Tamer Vex",map:"arcade",team:[["mireimp",10],["noctalon",10]],reward:{credits:46,card:"overclock"},intro:"I built my deck to punish predictable play."},
  miri:{name:"Warden Miri",map:"arcade",warden:true,team:[["noctalon",11],["luxmoth",11],["bogeyre",12]],reward:{credits:85,card:"emergency_patch",badge:"ARCADE"},intro:"Every bright screen throws a shadow. Can your team survive both?"},

  helix:{name:"Relay Adept Helix",map:"crown",team:[["carillume",12],["dynasea",12],["ironmaw",12]],reward:{credits:55,card:"pierce"},intro:"The Crown does not care how quickly you arrived."},
  sora:{name:"Antenna Sora",map:"crown",team:[["mossoracle",13],["abyssail",13],["noctalon",13]],reward:{credits:60,card:"rally"},intro:"Your strongest monster is not your strongest team."},
  vale:{name:"Crown Tamer Vale",map:"crown",warden:true,final:true,team:[["magmara",14],["coralisk",14],["carillume",14],["dynasea",15]],reward:{credits:120,card:"bond_surge",badge:"CROWN"},intro:"Four signals. Four answers. Take the Crown if your links can hold."}
 }
};
