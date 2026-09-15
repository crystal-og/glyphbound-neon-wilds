
const GAME_DATA = {
  version: "1.0.0",
  types: ["BLAZE","BLOOM","TIDE","VOLT","GLOOM","ALLOY"],
  typeChart: {
    BLAZE:{BLOOM:1.5,ALLOY:1.4,TIDE:.7},
    BLOOM:{TIDE:1.5,VOLT:1.3,BLAZE:.7},
    TIDE:{BLAZE:1.5,ALLOY:1.2,VOLT:.7},
    VOLT:{TIDE:1.5,ALLOY:1.2,BLOOM:.8},
    GLOOM:{BLOOM:1.4,VOLT:1.2,ALLOY:.8},
    ALLOY:{GLOOM:1.5,BLOOM:1.2,BLAZE:.8}
  },
  monsters: {
    cindercub:{name:"Cindercub",type:"BLAZE",rarity:"Starter",base:{hp:44,atk:9,def:5},color:"#ff7a4e",accent:"#ffd06b",evolves:["magmara","solvulp"],desc:"A furnace-tailed cub that hoards warm batteries."},
    magmara:{name:"Magmara",type:"BLAZE",rarity:"Evolved",base:{hp:68,atk:15,def:8},color:"#e44f3f",accent:"#ffd36b",desc:"An aggressive magma beast born from relentless offense."},
    solvulp:{name:"Solvulp",type:"BLAZE",rarity:"Evolved",base:{hp:61,atk:12,def:11},color:"#ff9861",accent:"#fff09b",desc:"A radiant fox that evolves through trust and restraint."},

    sprigbit:{name:"Sprigbit",type:"BLOOM",rarity:"Starter",base:{hp:49,atk:7,def:7},color:"#69ce63",accent:"#d5f089",evolves:["thornjaw","mossoracle"],desc:"A seed-backed scavenger that nests in old circuit boards."},
    thornjaw:{name:"Thornjaw",type:"BLOOM",rarity:"Evolved",base:{hp:73,atk:13,def:10},color:"#4ca94f",accent:"#d8e96b",desc:"A bramble predator sharpened by repeated combat."},
    mossoracle:{name:"Mossoracle",type:"BLOOM",rarity:"Evolved",base:{hp:67,atk:10,def:14},color:"#6dbf84",accent:"#cfffc8",desc:"A patient grove seer that responds to a careful tamer."},

    ripplet:{name:"Ripplet",type:"TIDE",rarity:"Starter",base:{hp:46,atk:8,def:6},color:"#54a8ed",accent:"#a8eeff",evolves:["abyssail","coralisk"],desc:"A buoyant riverling that surfs electrical runoff."},
    abyssail:{name:"Abyssail",type:"TIDE",rarity:"Evolved",base:{hp:64,atk:15,def:8},color:"#307fd1",accent:"#82e9ff",desc:"A deepwater hunter shaped by bold attacking instincts."},
    coralisk:{name:"Coralisk",type:"TIDE",rarity:"Evolved",base:{hp:70,atk:11,def:13},color:"#52b8d3",accent:"#ffc7c7",desc:"A reef guardian that develops through bond and defense."},

    glimwing:{name:"Glimwing",type:"VOLT",rarity:"Common",base:{hp:39,atk:10,def:4},color:"#f1d64a",accent:"#fff4a8",evolves:["luxmoth"],desc:"A static-charged moth drawn to arcade marquees."},
    luxmoth:{name:"Luxmoth",type:"VOLT",rarity:"Evolved",base:{hp:58,atk:15,def:7},color:"#ffd85a",accent:"#f8fbff",desc:"Its wings flash coded warnings across the night sky."},

    ferrat:{name:"Ferrat",type:"ALLOY",rarity:"Common",base:{hp:52,atk:7,def:10},color:"#9aa6b3",accent:"#e2edf6",evolves:["ironmaw"],desc:"A scrapyard rodent that replaces lost teeth with bolts."},
    ironmaw:{name:"Ironmaw",type:"ALLOY",rarity:"Evolved",base:{hp:78,atk:12,def:15},color:"#7c8b9c",accent:"#d9ebf8",desc:"A plated burrower that can chew through relay housings."},

    shadecko:{name:"Shadecko",type:"GLOOM",rarity:"Uncommon",base:{hp:43,atk:9,def:6},color:"#8d65bd",accent:"#dfa7ff",evolves:["noctalon"],desc:"A wall-crawling mimic that steals shadows from neon signs."},
    noctalon:{name:"Noctalon",type:"GLOOM",rarity:"Evolved",base:{hp:62,atk:14,def:10},color:"#69499d",accent:"#ce9cff",desc:"A silent rooftop stalker whose claws leave no reflection."}
  },
  cards: {
    quick_jab:{name:"Quick Jab",cost:1,kind:"attack",power:6,desc:"Deal 6 + ATK damage."},
    heavy_strike:{name:"Heavy Strike",cost:2,kind:"attack",power:12,desc:"Deal 12 + ATK damage."},
    brace:{name:"Brace",cost:1,kind:"guard",guard:10,desc:"Gain 10 Guard."},
    harden:{name:"Harden",cost:2,kind:"guard",guard:18,desc:"Gain 18 Guard."},
    patch:{name:"Patch",cost:2,kind:"heal",heal:12,desc:"Restore 12 HP."},
    focus:{name:"Focus",cost:1,kind:"tech",focus:1,desc:"Gain Focus: next attack +50%."},
    scout:{name:"Scout",cost:0,kind:"tech",draw:1,desc:"Draw 1 card."},
    recycle:{name:"Recycle",cost:1,kind:"tech",energy:1,desc:"Gain 1 Energy and draw 1."},
    blaze_burst:{name:"Blaze Burst",cost:2,kind:"attack",power:15,type:"BLAZE",desc:"Blaze attack. Stronger with Blaze monsters."},
    thorn_lash:{name:"Thorn Lash",cost:2,kind:"attack",power:15,type:"BLOOM",desc:"Bloom attack. Stronger with Bloom monsters."},
    undertow:{name:"Undertow",cost:2,kind:"attack",power:15,type:"TIDE",desc:"Tide attack. Stronger with Tide monsters."},
    arc_flash:{name:"Arc Flash",cost:2,kind:"attack",power:15,type:"VOLT",desc:"Volt attack. Stronger with Volt monsters."},
    night_bite:{name:"Night Bite",cost:2,kind:"attack",power:15,type:"GLOOM",desc:"Gloom attack. Stronger with Gloom monsters."},
    steel_ram:{name:"Steel Ram",cost:2,kind:"attack",power:15,type:"ALLOY",desc:"Alloy attack. Stronger with Alloy monsters."},
    mirror_guard:{name:"Mirror Guard",cost:2,kind:"guard",guard:12,reflect:4,desc:"Gain 12 Guard. Reflect 4 next hit."},
    bond_surge:{name:"Bond Surge",cost:2,kind:"tech",bondAttack:1,desc:"Next attack gets bonus from Bond."},
    emergency_patch:{name:"Emergency Patch",cost:3,kind:"heal",heal:24,desc:"Restore 24 HP."},
    overclock:{name:"Overclock",cost:0,kind:"tech",energy:2,hurt:5,desc:"Gain 2 Energy. Lose 5 HP."}
  },
  zones: [
    {id:"meadow",name:"Circuit Meadow",tag:"WILD SIGNALS",desc:"Wind turbines, grass, and buried coax lines.",unlock:0,
      encounters:["glimwing","sprigbit","ripplet"],boss:"luxmoth",bossName:"Relay Keeper Yara",reward:"arc_flash"},
    {id:"docks",name:"Rustwater Docks",tag:"SALT + STEEL",desc:"Flooded loading bays and corroded terminals.",unlock:1,
      encounters:["ferrat","ripplet","glimwing"],boss:"ironmaw",bossName:"Dock Warden Pike",reward:"steel_ram"},
    {id:"arcade",name:"Nightglass Arcade",tag:"AFTER HOURS",desc:"A dead mall where cabinets still hum at midnight.",unlock:2,
      encounters:["shadecko","glimwing","ferrat"],boss:"noctalon",bossName:"Arcade Ghost Miri",reward:"night_bite"},
    {id:"relay",name:"Crown Relay",tag:"FINAL UPLINK",desc:"The abandoned broadcast tower at the edge of the wilds.",unlock:3,
      encounters:["shadecko","ferrat","glimwing"],boss:"magmara",bossName:"Crown Tamer Vale",reward:"bond_surge"}
  ],
  starterDeck:["quick_jab","quick_jab","quick_jab","brace","brace","focus","scout","patch","heavy_strike","recycle"]
};
