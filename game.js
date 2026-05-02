(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const ui = {
    start: document.getElementById("startOverlay"),
    upgrade: document.getElementById("upgradeOverlay"),
    gameOver: document.getElementById("gameOverOverlay"),
    chest: document.getElementById("chestOverlay"),
    pause: document.getElementById("pauseOverlay"),
    choices: document.getElementById("upgradeChoices"),
    chestRewards: document.getElementById("chestRewards"),
    chestTitle: document.getElementById("chestTitle"),
    chestStage: document.getElementById("chestStage"),
    chestContinueButton: document.getElementById("chestContinueButton"),
    codex: document.getElementById("codexOverlay"),
    codexButton: document.getElementById("codexButton"),
    codexCloseButton: document.getElementById("codexCloseButton"),
    codexGrid: document.getElementById("codexGrid"),
    codexSummary: document.getElementById("codexSummary"),
    characterSelect: document.getElementById("characterSelect"),
    startButton: document.getElementById("startButton"),
    pauseButton: document.getElementById("pauseButton"),
    resumeButton: document.getElementById("resumeButton"),
    pauseRestartButton: document.getElementById("pauseRestartButton"),
    mainMenuButton: document.getElementById("mainMenuButton"),
    restartButton: document.getElementById("restartButton"),
    timeText: document.getElementById("timeText"),
    levelText: document.getElementById("levelText"),
    xpText: document.getElementById("xpText"),
    killText: document.getElementById("killText"),
    buildText: document.getElementById("buildText"),
    weaponBuildPanel: document.getElementById("weaponBuildPanel"),
    relicBuildPanel: document.getElementById("relicBuildPanel"),
    traitBuildPanel: document.getElementById("traitBuildPanel"),
    runSubtitle: document.getElementById("runSubtitle"),
    healthBar: document.getElementById("healthBar"),
    healthText: document.getElementById("healthText"),
    xpBar: document.getElementById("xpBar"),
    gameOverStats: document.getElementById("gameOverStats"),
    touchStick: document.getElementById("touchStick"),
    transition: document.getElementById("pageTransition"),
  };

  const palette = {
    paper: "#f7f1e7",
    paperDeep: "#e9dfcf",
    ink: "#1f2630",
    softInk: "#3d4652",
    teal: "#2b7a78",
    coral: "#d75a4a",
    gold: "#c99a2e",
    lilac: "#8f7bb5",
    moss: "#6f8d64",
    white: "#fff9ed",
  };

  const buildPanelExpanded = {
    weaponBuildPanel: false,
    relicBuildPanel: false,
    traitBuildPanel: false,
  };

  const characters = [
    {
      id: "wanderer",
      name: "月墨行者",
      role: "均衡起式",
      icon: "brush",
      accent: palette.teal,
      secondary: palette.gold,
      desc: "只携墨锋与墨印起手；以直线贯穿、散毫和骤雨形成纯墨构筑。",
      stats: ["生命 106", "墨锋 3", "墨印连锁"],
      build: "墨锋 / 贯穿流",
      trait: {
        name: "墨痕回环",
        desc: "墨系命中 4 次后释放墨痕回环，回转墨锋并震开周围敌人。",
      },
      apply: (p) => {
        p.maxHp = 106;
        p.hp = 106;
        p.brushCount = 3;
        p.brushCooldown = 0.82;
        p.orbs = 0;
        p.flameLevel = 0;
        p.abilities.inkMark = true;
        p.mods.brushForce = 1;
        p.characterTraitName = "墨痕回环";
        p.characterTraitDesc = "墨系命中 4 次后释放墨痕回环，回转墨锋并震开敌人。";
      },
    },
    {
      id: "bell-dancer",
      name: "星铃游侠",
      role: "机动环切",
      icon: "orb",
      accent: palette.lilac,
      secondary: palette.teal,
      desc: "只携星铃起手；贴身环切、碎星命中和星盘路线形成纯星构筑。",
      stats: ["生命 88", "星铃 4", "星盘"],
      build: "回旋 / 命中流",
      trait: {
        name: "星移回响",
        desc: "星铃或碎星命中 5 次后爆出星座回响，短暂大幅加速星铃。",
      },
      apply: (p) => {
        p.maxHp = 88;
        p.hp = 88;
        p.speed = 225;
        p.brushCount = 0;
        p.orbs = 4;
        p.orbDamage = 18;
        p.flameLevel = 0;
        p.frostLevel = 0;
        p.relics.starChart = true;
        p.mods.orbTempo = 1;
        p.characterTraitName = "星移回响";
        p.characterTraitDesc = "星铃命中积攒星移，满 5 次爆出星座回响并加速星铃。";
      },
    },
    {
      id: "ember-warden",
      name: "焰莲守望",
      role: "低频爆发",
      icon: "flame",
      accent: palette.coral,
      secondary: palette.gold,
      desc: "只携月焰起手；靠余烬、击杀链和焰莲爆发撑起纯火构筑。",
      stats: ["生命 122", "月焰 2", "余烬织线"],
      build: "爆发 / 击杀流",
      trait: {
        name: "焰心复燃",
        desc: "击杀积攒焰心，余烬击杀加倍；满 4 层释放高收益焰莲爆。",
      },
      apply: (p) => {
        p.maxHp = 122;
        p.hp = 122;
        p.speed = 172;
        p.brushCount = 0;
        p.orbs = 0;
        p.flameLevel = 2;
        p.flameCooldown = 4.75;
        p.abilities.emberWeb = true;
        p.damageMult = 1.08;
        p.pickup = 122;
        p.characterTraitName = "焰心复燃";
        p.characterTraitDesc = "击杀积攒焰心，满 4 层释放焰莲爆；余烬击杀加倍计数。";
      },
    },
    {
      id: "lantern-child",
      name: "流萤拾露",
      role: "拾取联动",
      icon: "lantern",
      accent: palette.moss,
      secondary: palette.gold,
      desc: "只携流萤灯起手；用拾取、萤辉和引露脉冲形成纯拾取构筑。",
      stats: ["生命 92", "流萤灯 2", "引露脉冲"],
      build: "拾取 / 范围流",
      trait: {
        name: "萤露回灯",
        desc: "拾取 5 点经验后释放萤灯回照，生成追击流萤并为引露脉冲充能。",
      },
      apply: (p) => {
        p.maxHp = 92;
        p.hp = 92;
        p.brushCount = 0;
        p.orbs = 0;
        p.flameLevel = 0;
        p.pickup = 184;
        p.lanternLevel = 2;
        p.lanternCooldown = 2.05;
        p.lanternTimer = 0.72;
        p.abilities.dewPulse = true;
        p.mods.lanternSwarm = 1;
        p.dewCharge = 3;
        p.characterTraitName = "萤露回灯";
        p.characterTraitDesc = "拾取 5 点经验释放萤灯回照，生成追击流萤并充能引露。";
      },
    },
  ];

  const keys = new Set();
  const pointer = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
  const world = { w: 2800, h: 2200 };
  const camera = { x: 0, y: 0 };
  let dpr = 1;
  let last = 0;
  let state = "menu";
  let shake = 0;
  let transitioning = false;
  let selectedCharacterId = "wanderer";
  let pauseReturnState = "playing";
  let codexReturnState = null;

  const game = {
    time: 0,
    kills: 0,
    wave: 1,
    spawnTimer: 0,
    eliteTimer: 28,
    bossSpawned: false,
    player: null,
    enemies: [],
    projectiles: [],
    trails: [],
    gems: [],
    chests: [],
    particles: [],
    blooms: [],
    beams: [],
    choices: [],
    chestState: null,
    pendingUpgrades: 0,
    relicPickups: 0,
    abilityPickups: 0,
    evolutionPickups: 0,
    chestsOpened: 0,
    picks: [],
    lastVariant: "",
  };

  const upgradeCaps = {
    brush: 6,
    orb: 6,
    flame: 5,
    frost: 5,
    lantern: 5,
    sigil: 5,
    jade: 5,
    needle: 5,
    fan: 5,
    umbrella: 5,
    "branch-brush-splinter": 3,
    "branch-brush-rain": 3,
    "branch-orb-recall": 3,
    "branch-orb-shatter": 3,
    "branch-flame-cinder": 3,
    "branch-flame-tide": 3,
    "branch-lantern-gleam": 3,
    "branch-lantern-vein": 3,
    "branch-sigil-echo": 3,
    "branch-sigil-curtain": 3,
    "branch-crane-echo": 3,
    "branch-frost-echo": 3,
    "branch-frost-lattice": 3,
    "branch-jade-chain": 3,
    "branch-jade-ward": 3,
    "branch-needle-curtain": 3,
    "branch-needle-seal": 3,
    "branch-fan-gale": 3,
    "branch-fan-feather": 3,
    "branch-umbrella-lotus": 3,
    "branch-umbrella-echo": 3,
    stride: 4,
    heart: 4,
    focus: 5,
    "ability-ink-mark": 1,
    "ability-dew-pulse": 1,
    "ability-ember": 1,
    "ability-crane-vow": 1,
    "relic-moon-mirror": 1,
    "relic-dew-hourglass": 1,
    "relic-star-chart": 1,
    "relic-red-seal": 1,
    "relic-chest-resonance": 1,
    "relic-lacquer-key": 1,
    "relic-branch-inkstone": 1,
    "relic-chest-prism": 1,
    "relic-focus-lens": 1,
    "relic-tempo-bell": 1,
    "evolve-void-brush": 1,
    "evolve-star-river": 1,
    "evolve-moon-lotus": 1,
    "evolve-frost-zither": 1,
    "evolve-rain-loom": 1,
    "evolve-jade-fan": 1,
  };

  const upgrades = [
    {
      id: "brush",
      type: "武器",
      name: "墨锋加密",
      desc: "自动飞出的墨锋更多、更快。3 重墨锋 + 墨印连锁可合成超武。",
      available: (p) => p.brushCount < upgradeCaps.brush,
      apply: (p) => {
        p.brushCount += 1;
        p.brushCooldown = Math.max(0.24, p.brushCooldown * 0.86);
      },
    },
    {
      id: "branch-brush-splinter",
      type: "武器",
      name: "墨锋散毫",
      desc: "墨锋 3 重 + 墨印连锁后出现。墨锋命中裂出细毫，裂月镜会额外多裂一道。",
      available: (p) => p.brushCount >= 3 && p.abilities.inkMark && p.branches.brushSplinter < upgradeCaps["branch-brush-splinter"],
      apply: (p) => {
        p.branches.brushSplinter += 1;
        p.brushCooldown = Math.max(0.22, p.brushCooldown * 0.96);
      },
    },
    {
      id: "branch-brush-rain",
      type: "武器",
      name: "墨锋骤雨",
      desc: "墨锋 4 重后出现。墨锋齐射会积攒碑拓，满后落下直线墨雨；站定凝神会更快触发。",
      available: (p) => p.brushCount >= 4 && p.branches.brushRain < upgradeCaps["branch-brush-rain"],
      apply: (p) => {
        p.branches.brushRain += 1;
        p.brushCooldown = Math.max(0.2, p.brushCooldown * 0.95);
      },
    },
    {
      id: "orb",
      type: "武器",
      name: "星铃回旋",
      desc: "增加一枚环绕星铃，贴身切开夜影。4 枚星铃 + 星盘可合成超武。",
      available: (p) => p.orbs < upgradeCaps.orb,
      apply: (p) => {
        p.orbs += 1;
        p.orbDamage += 3;
      },
    },
    {
      id: "branch-orb-recall",
      type: "武器",
      name: "星铃归潮",
      desc: "星铃 3 枚后出现。拾取月露会触发召回星纹，若拥有星盘则范围和加速更强。",
      available: (p) => p.orbs >= 3 && p.branches.orbRecall < upgradeCaps["branch-orb-recall"],
      apply: (p) => {
        p.branches.orbRecall += 1;
        p.orbDamage += 1.5;
        p.pickup += 10;
      },
    },
    {
      id: "branch-orb-shatter",
      type: "武器",
      name: "星铃碎星",
      desc: "星铃 4 枚 + 星盘后出现。星铃命中会裂出碎星，星河轮会让碎星贯穿。",
      available: (p) => p.orbs >= 4 && p.relics.starChart && p.branches.orbShatter < upgradeCaps["branch-orb-shatter"],
      apply: (p) => {
        p.branches.orbShatter += 1;
        p.orbDamage += 1.2;
      },
    },
    {
      id: "flame",
      type: "武器",
      name: "月焰外放",
      desc: "周期性释放扩散月焰。3 层月焰 + 余烬织线可合成超武。",
      available: (p) => p.flameLevel < upgradeCaps.flame,
      apply: (p) => {
        p.flameLevel += 1;
        p.flameCooldown = Math.max(2.2, p.flameCooldown * 0.88);
      },
    },
    {
      id: "branch-flame-cinder",
      type: "武器",
      name: "月焰烬环",
      desc: "月焰 2 层 + 余烬织线后出现。余烬敌人死亡时爆开焰环，白月焰莲会强化范围。",
      available: (p) => p.flameLevel >= 2 && p.abilities.emberWeb && p.branches.flameCinder < upgradeCaps["branch-flame-cinder"],
      apply: (p) => {
        p.branches.flameCinder += 1;
        p.flameCooldown = Math.max(1.9, p.flameCooldown * 0.94);
      },
    },
    {
      id: "branch-flame-tide",
      type: "武器",
      name: "月焰潮汐",
      desc: "月焰 3 层 + 引露脉冲后出现。引露脉冲会额外展开月焰潮，白月焰莲会扩大潮汐。",
      available: (p) => p.flameLevel >= 3 && p.abilities.dewPulse && p.branches.flameTide < upgradeCaps["branch-flame-tide"],
      apply: (p) => {
        p.branches.flameTide += 1;
        p.flameCooldown = Math.max(1.85, p.flameCooldown * 0.96);
      },
    },
    {
      id: "frost",
      type: "武器",
      name: "霜弦拨月",
      desc: "周期拨出霜弦，穿刺并减速一列敌人。3 重霜弦 + 引露脉冲可解锁裂音分支。",
      available: (p) => p.frostLevel < upgradeCaps.frost,
      apply: (p) => {
        p.frostLevel += 1;
        p.frostCooldown = Math.max(1.05, p.frostCooldown * 0.9);
      },
    },
    {
      id: "lantern",
      type: "武器",
      name: "流萤灯",
      desc: "放出追光流萤，自动追击远处敌人。走拾取与范围连锁流派，可和引露脉冲联动。",
      available: (p) => p.lanternLevel < upgradeCaps.lantern,
      apply: (p) => {
        p.lanternLevel += 1;
        p.lanternCooldown = Math.max(1.05, p.lanternCooldown * 0.9);
        p.pickup += 4;
      },
    },
    {
      id: "branch-lantern-gleam",
      type: "武器",
      name: "流萤聚辉",
      desc: "流萤灯 3 级 + 引露脉冲后出现。拾取月露会爆出萤辉，适合经验拾取与范围清场。",
      available: (p) => p.lanternLevel >= 3 && p.abilities.dewPulse && p.branches.lanternGleam < upgradeCaps["branch-lantern-gleam"],
      apply: (p) => {
        p.branches.lanternGleam += 1;
        p.lanternCooldown = Math.max(0.86, p.lanternCooldown * 0.93);
        p.pickup += 10;
      },
    },
    {
      id: "branch-lantern-vein",
      type: "武器",
      name: "流萤织径",
      desc: "流萤灯 3 级 + 照影符后出现。流萤命中会织出萤径光束，回转照影符并充能引露。",
      available: (p) => p.lanternLevel >= 3 && p.sigilLevel > 0 && p.branches.lanternVein < upgradeCaps["branch-lantern-vein"],
      apply: (p) => {
        p.branches.lanternVein += 1;
        p.lanternCooldown = Math.max(0.9, p.lanternCooldown * 0.95);
        p.sigilTimer = Math.min(p.sigilTimer, p.sigilCooldown * 0.64);
      },
    },
    {
      id: "branch-frost-echo",
      type: "武器",
      name: "霜弦裂音",
      desc: "霜弦 3 重 + 引露脉冲后出现。霜弦命中会裂出寒音，寒音命中会为月露脉冲充能。",
      available: (p) => p.frostLevel >= 3 && p.abilities.dewPulse && p.branches.frostEcho < upgradeCaps["branch-frost-echo"],
      apply: (p) => {
        p.branches.frostEcho += 1;
        p.frostCooldown = Math.max(0.92, p.frostCooldown * 0.95);
      },
    },
    {
      id: "branch-frost-lattice",
      type: "武器",
      name: "霜弦封阵",
      desc: "霜弦 4 重后出现。霜弦命中会展开六角霜阵，持续压制并充能引露；站定时范围更大。",
      available: (p) => p.frostLevel >= 4 && p.branches.frostLattice < upgradeCaps["branch-frost-lattice"],
      apply: (p) => {
        p.branches.frostLattice += 1;
        p.frostCooldown = Math.max(0.9, p.frostCooldown * 0.96);
      },
    },
    {
      id: "sigil",
      type: "武器",
      name: "照影符",
      desc: "低频射出直线影符，伤害高且有贯穿潜力。3 级照影符 + 裂月镜可解锁回照分支。",
      available: (p) => p.sigilLevel < upgradeCaps.sigil,
      apply: (p) => {
        p.sigilLevel += 1;
        p.sigilCooldown = Math.max(1.55, p.sigilCooldown * 0.9);
      },
    },
    {
      id: "jade",
      type: "武器",
      name: "玉简雷",
      desc: "周期唤出玉简雷刻，锁定多名敌人落下折线雷痕。视觉与墨锋/星铃/月焰完全不同，适合点杀与连锁。",
      available: (p) => p.jadeLevel < upgradeCaps.jade,
      apply: (p) => {
        p.jadeLevel += 1;
        p.jadeCooldown = Math.max(1.18, p.jadeCooldown * 0.9);
      },
    },
    {
      id: "needle",
      type: "武器",
      name: "雨墨针",
      desc: "周期从天幕垂落细针雨，直接钉向多名敌人。站定会额外落针，引露脉冲会被雨纹充能。",
      available: (p) => p.needleLevel < upgradeCaps.needle,
      apply: (p) => {
        p.needleLevel += 1;
        p.needleCooldown = Math.max(1.05, p.needleCooldown * 0.9);
      },
    },
    {
      id: "fan",
      type: "武器",
      name: "玉扇风",
      desc: "低频挥出扇面弧风，扫过一片敌人并短暂减速。触发不快，但单次范围收益清楚，适合控场和站定构筑。",
      available: (p) => p.fanLevel < upgradeCaps.fan,
      apply: (p) => {
        p.fanLevel += 1;
        p.fanCooldown = Math.max(1.32, p.fanCooldown * 0.9);
      },
    },
    {
      id: "umbrella",
      type: "武器",
      name: "墨莲伞",
      desc: "新基础武器。低频在身边张开墨莲伞，挡近身敌人并反打；触发少但一次能看见护圈、伞骨和屏幕压迫感。",
      available: (p) => p.umbrellaLevel < upgradeCaps.umbrella,
      apply: (p) => {
        p.umbrellaLevel += 1;
        p.umbrellaCooldown = Math.max(1.42, p.umbrellaCooldown * 0.9);
      },
    },
    {
      id: "branch-fan-gale",
      type: "武器",
      name: "玉扇回廊",
      desc: "玉扇风 3 重后出现。扇风命中会在扇面末端展开回廊风纹；回风路线会追加一次风纹，引露脉冲会被风纹充能。",
      available: (p) => p.fanLevel >= 3 && p.branches.fanGale < upgradeCaps["branch-fan-gale"],
      apply: (p) => {
        p.branches.fanGale += 1;
        p.fanCooldown = Math.max(1.18, p.fanCooldown * 0.95);
      },
    },
    {
      id: "branch-fan-feather",
      type: "武器",
      name: "玉扇裂羽",
      desc: "玉扇风 4 重后出现。扇风边缘飞出玉羽追远处敌人；宽扇路线多飞羽，回风路线会折返一次。",
      available: (p) => p.fanLevel >= 4 && p.branches.fanFeather < upgradeCaps["branch-fan-feather"],
      apply: (p) => {
        p.branches.fanFeather += 1;
        p.fanCooldown = Math.max(1.12, p.fanCooldown * 0.94);
      },
    },
    {
      id: "branch-umbrella-lotus",
      type: "武器",
      name: "墨伞莲阵",
      desc: "墨莲伞 3 重后出现。护伞张开后留下墨莲阵，持续压住近身敌人；护圈路线让阵更大，反刺路线会在阵边补伞骨。",
      available: (p) => p.umbrellaLevel >= 3 && p.branches.umbrellaLotus < upgradeCaps["branch-umbrella-lotus"],
      apply: (p) => {
        p.branches.umbrellaLotus += 1;
        p.umbrellaCooldown = Math.max(1.24, p.umbrellaCooldown * 0.95);
      },
    },
    {
      id: "branch-umbrella-echo",
      type: "武器",
      name: "伞影回潮",
      desc: "墨莲伞 4 重后出现。护伞张开后折出回潮伞影，追打外圈敌人；反刺路线更多，护圈路线补一点保护。",
      available: (p) => p.umbrellaLevel >= 4 && p.branches.umbrellaEcho < upgradeCaps["branch-umbrella-echo"],
      apply: (p) => {
        p.branches.umbrellaEcho += 1;
        p.umbrellaCooldown = Math.max(1.18, p.umbrellaCooldown * 0.94);
      },
    },
    {
      id: "branch-needle-curtain",
      type: "武器",
      name: "雨墨帘",
      desc: "雨墨针 3 重后出现。针雨命中时拉开纵向雨帘，多条细光同时钉落；触发慢但一次非常醒目。",
      available: (p) => p.needleLevel >= 3 && p.branches.needleCurtain < upgradeCaps["branch-needle-curtain"],
      apply: (p) => {
        p.branches.needleCurtain += 1;
        p.needleCooldown = Math.max(0.98, p.needleCooldown * 0.95);
      },
    },
    {
      id: "branch-needle-seal",
      type: "武器",
      name: "定雨纹",
      desc: "雨墨针 3 重 + 霜弦或引露脉冲后出现。针雨命中减速目标会展开定雨纹，低频触发换高范围收益。",
      available: (p) => p.needleLevel >= 3 && (p.frostLevel > 0 || p.abilities.dewPulse) && p.branches.needleSeal < upgradeCaps["branch-needle-seal"],
      apply: (p) => {
        p.branches.needleSeal += 1;
        p.needleCooldown = Math.max(1.02, p.needleCooldown * 0.96);
      },
    },
    {
      id: "branch-jade-chain",
      type: "武器",
      name: "玉简连弧",
      desc: "玉简雷 3 重后出现。雷刻命中后折出玉弧连到附近敌人；触发慢但单次清场可见。",
      available: (p) => p.jadeLevel >= 3 && p.branches.jadeChain < upgradeCaps["branch-jade-chain"],
      apply: (p) => {
        p.branches.jadeChain += 1;
        p.jadeCooldown = Math.max(1.08, p.jadeCooldown * 0.96);
      },
    },
    {
      id: "branch-jade-ward",
      type: "武器",
      name: "玉简镇域",
      desc: "玉简雷 4 重后出现。雷刻落点展开镇域方阵，触发慢但大范围减速；站定凝神和寂光砚会显著扩大收益。",
      available: (p) => p.jadeLevel >= 4 && p.branches.jadeWard < upgradeCaps["branch-jade-ward"],
      apply: (p) => {
        p.branches.jadeWard += 1;
        p.jadeCooldown = Math.max(1.04, p.jadeCooldown * 0.97);
      },
    },
    {
      id: "branch-sigil-echo",
      type: "武器",
      name: "照影回文",
      desc: "照影符 3 级 + 裂月镜后出现。影符命中时展开回照暗场，低频但高收益。",
      available: (p) => p.sigilLevel >= 3 && p.relics.moonMirror && p.branches.sigilEcho < upgradeCaps["branch-sigil-echo"],
      apply: (p) => {
        p.branches.sigilEcho += 1;
        p.sigilCooldown = Math.max(1.24, p.sigilCooldown * 0.94);
      },
    },
    {
      id: "branch-sigil-curtain",
      type: "武器",
      name: "照影折幕",
      desc: "照影符 3 级后出现。影符命中会折出暗幕光束；站定凝神时光束更多、收益更高。",
      available: (p) => p.sigilLevel >= 3 && p.branches.sigilCurtain < upgradeCaps["branch-sigil-curtain"],
      apply: (p) => {
        p.branches.sigilCurtain += 1;
        p.sigilCooldown = Math.max(1.28, p.sigilCooldown * 0.96);
      },
    },
    {
      id: "stride",
      type: "身法",
      name: "风步",
      desc: "移动速度提升，拾取范围扩大。",
      available: () => getPickCount("stride") < upgradeCaps.stride,
      apply: (p) => {
        p.speed += 22;
        p.pickup += 18;
      },
    },
    {
      id: "heart",
      type: "生存",
      name: "朱砂护心",
      desc: "生命上限与当下生命一起提升。",
      available: () => getPickCount("heart") < upgradeCaps.heart,
      apply: (p) => {
        p.maxHp += 22;
        p.hp = Math.min(p.maxHp, p.hp + 34);
      },
    },
    {
      id: "focus",
      type: "身法",
      name: "清辉入定",
      desc: "所有伤害小幅提升；首次选择后，站定才会获得攻速收益，高等级解锁凝神激光。",
      available: () => getPickCount("focus") < upgradeCaps.focus,
      apply: (p) => {
        p.damageMult += 0.16;
      },
    },
    {
      id: "ability-ink-mark",
      type: "能力",
      name: "墨印连锁",
      desc: "任意武器命中会叠墨印；4 层爆开。星铃命中墨印敌人会缩短墨锋冷却。",
      once: true,
      available: (p) => !p.abilities.inkMark,
      apply: (p) => {
        p.abilities.inkMark = true;
        game.abilityPickups += 1;
      },
    },
    {
      id: "ability-dew-pulse",
      type: "能力",
      name: "引露脉冲",
      desc: "拾取月露会蓄能；满 8 点释放一次伤害脉冲并短暂牵引敌人。",
      once: true,
      available: (p) => !p.abilities.dewPulse,
      apply: (p) => {
        p.abilities.dewPulse = true;
        p.dewThreshold = 8;
        game.abilityPickups += 1;
      },
    },
    {
      id: "ability-ember",
      type: "能力",
      name: "余烬织线",
      desc: "月焰命中会留下余烬；墨印爆发会点燃余烬造成二次伤害。",
      once: true,
      available: (p) => !p.abilities.emberWeb,
      apply: (p) => {
        p.abilities.emberWeb = true;
        game.abilityPickups += 1;
      },
    },
    {
      id: "ability-crane-vow",
      type: "能力",
      name: "纸鹤誓约",
      desc: "站立片刻会折出纸鹤；下一次移动释放纸鹤锋线。和风步、万象墨锋联动。",
      once: true,
      available: (p) => !p.abilities.craneVow,
      apply: (p) => {
        p.abilities.craneVow = true;
        game.abilityPickups += 1;
      },
    },
    {
      id: "branch-crane-echo",
      type: "能力",
      name: "纸鹤回羽",
      desc: "纸鹤誓约后出现。纸鹤锋线首次命中会分裂回羽，风步会额外加一道回羽。",
      available: (p) => p.abilities.craneVow && p.branches.craneEcho < upgradeCaps["branch-crane-echo"],
      apply: (p) => {
        p.branches.craneEcho += 1;
        p.craneTimer = Math.max(0, p.craneTimer - 0.18);
      },
    },
    {
      id: "relic-moon-mirror",
      type: "遗物",
      name: "裂月镜",
      desc: "墨印爆发时射出三枚月片。和墨锋加密、墨印连锁联动。",
      once: true,
      available: (p) => !p.relics.moonMirror && p.abilities.inkMark,
      apply: (p) => {
        p.relics.moonMirror = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-dew-hourglass",
      type: "遗物",
      name: "露砂漏",
      desc: "引露脉冲触发时，墨锋与月焰当前冷却立刻回转一截。",
      once: true,
      available: (p) => !p.relics.dewHourglass && p.abilities.dewPulse,
      apply: (p) => {
        p.relics.dewHourglass = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-star-chart",
      type: "遗物",
      name: "星盘",
      desc: "每枚星铃提高墨锋伤害，墨锋命中也会让星铃短暂加速。",
      once: true,
      available: (p) => !p.relics.starChart && p.orbs >= 2,
      apply: (p) => {
        p.relics.starChart = true;
        p.orbSurge = 0;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-red-seal",
      type: "遗物",
      name: "朱砂印",
      desc: "受伤后获得朱砂印；下一次击破敌人治疗自身，并释放小型墨印爆发。",
      once: true,
      available: (p) => !p.relics.redSeal,
      apply: (p) => {
        p.relics.redSeal = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-chest-resonance",
      type: "遗物",
      name: "匣心回响",
      desc: "开宝箱后释放月匣脉冲；若开出 3/5 项奖励，额外回转武器冷却。",
      once: true,
      available: (p) => !p.relics.chestResonance && game.chestsOpened > 0,
      apply: (p) => {
        p.relics.chestResonance = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-lacquer-key",
      type: "遗物",
      name: "漆钥",
      desc: "开过宝箱后出现。拾取范围提升；之后宝箱奖励会为引露脉冲额外充能。",
      once: true,
      available: (p) => !p.relics.lacquerKey && game.chestsOpened > 0,
      apply: (p) => {
        p.relics.lacquerKey = true;
        p.pickup += 22;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-branch-inkstone",
      type: "遗物",
      name: "分枝砚",
      desc: "拥有任意强化分支后出现。分支触发会回转冷却，并为引露脉冲充能。",
      once: true,
      available: (p) => !p.relics.branchInkstone && totalBranchLevel(p) > 0,
      apply: (p) => {
        p.relics.branchInkstone = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-chest-prism",
      type: "遗物",
      name: "匣纹棱镜",
      desc: "开过宝箱并拥有任意分支后出现。宝箱奖励会折射已拥有分支；3/5 项奖励触发更多分支。",
      once: true,
      available: (p) => !p.relics.chestPrism && game.chestsOpened > 0 && totalBranchLevel(p) > 0,
      apply: (p) => {
        p.relics.chestPrism = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-focus-lens",
      type: "遗物",
      name: "寂光砚",
      desc: "清辉入定或纸鹤誓约后出现。站定更早射出凝神光束，并追加两道侧光。",
      once: true,
      available: (p) => !p.relics.focusLens && (getPickCount("focus") > 0 || p.abilities.craneVow),
      apply: (p) => {
        p.relics.focusLens = true;
        p.focusLaserTimer = Math.min(p.focusLaserTimer, 0.18);
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-route-charm",
      type: "遗物",
      name: "转向签",
      desc: "选过 2 次武器路线后出现。以后每次选路线都会立刻放出一圈回响，回一点武器出手间隔，并给引露脉冲充能。",
      once: true,
      available: (p) => !p.relics.routeCharm && Object.values(p.mods).reduce((sum, value) => sum + value, 0) >= 2,
      apply: (p) => {
        p.relics.routeCharm = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "relic-tempo-bell",
      type: "遗物",
      name: "重响磬",
      desc: "慢武器合计 4 级后出现。月焰、照影符、玉简雷、雨墨针、玉扇风、墨莲伞每次出手都会多一圈重响，造成伤害和减速，并把下一次出手往前推。",
      once: true,
      available: (p) => !p.relics.tempoBell && slowWeaponLevel(p) >= 4,
      apply: (p) => {
        p.relics.tempoBell = true;
        game.relicPickups += 1;
      },
    },
    {
      id: "evolve-void-brush",
      type: "超武",
      name: "万象墨锋",
      desc: "合成：3 重墨锋 + 墨印连锁。墨锋变为贯穿墨月，命中会更快引爆墨印。",
      once: true,
      available: (p) => !p.evolutions.voidBrush && p.brushCount >= 3 && p.abilities.inkMark,
      apply: (p) => {
        p.evolutions.voidBrush = true;
        p.brushCooldown = Math.max(0.2, p.brushCooldown * 0.72);
        p.damageMult += 0.08;
        game.evolutionPickups += 1;
      },
    },
    {
      id: "evolve-star-river",
      type: "超武",
      name: "星河轮",
      desc: "合成：4 枚星铃 + 星盘。星铃扩成双层星河，切割范围和伤害大幅提升。",
      once: true,
      available: (p) => !p.evolutions.starRiver && p.orbs >= 4 && p.relics.starChart,
      apply: (p) => {
        p.evolutions.starRiver = true;
        p.orbDamage += 10;
        p.pickup += 18;
        game.evolutionPickups += 1;
      },
    },
    {
      id: "evolve-moon-lotus",
      type: "超武",
      name: "白月焰莲",
      desc: "合成：3 层月焰 + 余烬织线。月焰释放双重焰莲，余烬爆燃更强。",
      once: true,
      available: (p) => !p.evolutions.moonLotus && p.flameLevel >= 3 && p.abilities.emberWeb,
      apply: (p) => {
        p.evolutions.moonLotus = true;
        p.flameCooldown = Math.max(1.85, p.flameCooldown * 0.76);
        p.maxHp += 12;
        p.hp = Math.min(p.maxHp, p.hp + 20);
        game.evolutionPickups += 1;
      },
    },
    {
      id: "evolve-frost-zither",
      type: "超武",
      name: "霜月琴",
      desc: "合成：4 重霜弦 + 引露脉冲。霜弦化为琴音，贯穿更远，并让寒音更快充能月露。",
      once: true,
      available: (p) => !p.evolutions.frostZither && p.frostLevel >= 4 && p.abilities.dewPulse,
      apply: (p) => {
        p.evolutions.frostZither = true;
        p.frostCooldown = Math.max(0.72, p.frostCooldown * 0.68);
        p.dewThreshold = Math.max(6, p.dewThreshold - 1);
        game.evolutionPickups += 1;
      },
    },
    {
      id: "evolve-rain-loom",
      type: "超武",
      name: "天雨织机",
      desc: "合成：5 重雨墨针 + 引露脉冲 + 任意针雨分支。针雨织成大范围雨线网络，雨帘与定雨纹同时放大。",
      once: true,
      available: (p) => !p.evolutions.rainLoom && p.needleLevel >= 5 && p.abilities.dewPulse && (p.branches.needleCurtain > 0 || p.branches.needleSeal > 0),
      apply: (p) => {
        p.evolutions.rainLoom = true;
        p.needleCooldown = Math.max(0.82, p.needleCooldown * 0.62);
        p.dewThreshold = Math.max(6, p.dewThreshold - 1);
        game.evolutionPickups += 1;
      },
    },
    {
      id: "evolve-jade-fan",
      type: "超武",
      name: "清风玉阙",
      desc: "合成：5 重玉扇风 + 玉扇回廊 + 清辉入定或引露脉冲。扇风变成双层风墙，回廊风纹更大，站定和回风收益更明显。",
      once: true,
      available: (p) => !p.evolutions.jadeFan && p.fanLevel >= 5 && p.branches.fanGale > 0 && (getPickCount("focus") > 0 || p.abilities.dewPulse),
      apply: (p) => {
        p.evolutions.jadeFan = true;
        p.fanCooldown = Math.max(0.88, p.fanCooldown * 0.66);
        p.pickup += 12;
        game.evolutionPickups += 1;
      },
    },
  ];

  const upgradeVariants = {
    brush: [
      { id: "swift", name: "更快出手", contrast: "打法：更多、更快", effect: "本次：墨锋出手间隔额外 -18%，适合想让屏幕上一直有墨锋的玩法。", apply: (p) => { p.mods.brushSpeed += 1; p.brushCooldown = Math.max(0.2, p.brushCooldown * 0.82); } },
      { id: "pierce", name: "单下更狠", contrast: "打法：更痛、更直", effect: "本次：墨锋打得更痛，也更容易打穿一排敌人，适合少而重的玩法。", apply: (p) => { p.mods.brushForce += 1; } },
    ],
    orb: [
      { id: "orbit", name: "圈子更大", contrast: "打法：安全大圈", effect: "本次：星铃转得更远，安全距离更大，走位时更容易蹭到敌人。", apply: (p) => { p.mods.orbOrbit += 1; p.pickup += 4; } },
      { id: "tempo", name: "贴身更痛", contrast: "打法：贴身爆发", effect: "本次：星铃伤害提高，并短暂转快，适合主动贴近敌人的玩法。", apply: (p) => { p.mods.orbTempo += 1; p.orbDamage += 2; p.orbSurge = Math.max(p.orbSurge, 1.2); } },
    ],
    flame: [
      { id: "reach", name: "炸得更大", contrast: "打法：大范围爆炸", effect: "本次：月焰范围明显扩大，虽然发动不算频繁，但每次清怪更明显。", apply: (p) => { p.mods.flameReach += 1; } },
      { id: "tempo", name: "来得更勤", contrast: "打法：稳定清身边", effect: "本次：月焰出手间隔额外 -16%，适合稳定清掉身边敌人。", apply: (p) => { p.mods.flameTempo += 1; p.flameCooldown = Math.max(1.85, p.flameCooldown * 0.84); } },
    ],
    frost: [
      { id: "long", name: "打得更远", contrast: "打法：远距穿线", effect: "本次：霜弦更宽、更能穿过敌人，适合远距离控制一条线。", apply: (p) => { p.mods.frostPierce += 1; } },
      { id: "pulse", name: "命中返利", contrast: "打法：命中攒波", effect: "本次：霜弦命中后会给下一次水波效果攒进度，适合连环发动。", apply: (p) => { p.mods.frostPulse += 1; } },
    ],
    lantern: [
      { id: "swarm", name: "飞得更勤", contrast: "打法：连续追击", effect: "本次：流萤出现更快，适合一直追着敌人补伤害。", apply: (p) => { p.mods.lanternSwarm += 1; p.lanternCooldown = Math.max(0.82, p.lanternCooldown * 0.84); } },
      { id: "radiance", name: "每下更亮", contrast: "打法：单次高亮", effect: "本次：流萤和聚光伤害提高，发动少一点也能看到更大回报。", apply: (p) => { p.mods.lanternRadiance += 1; } },
    ],
    sigil: [
      { id: "line", name: "直线穿透", contrast: "打法：瞄一条线", effect: "本次：照影符飞得更快、更痛、更能穿过敌人，适合瞄准一条路。", apply: (p) => { p.mods.sigilLine += 1; } },
      { id: "veil", name: "暗场更强", contrast: "打法：暗场压制", effect: "本次：照影命中后的暗场更强，发动不多，但每次更能改变战局。", apply: (p) => { p.mods.sigilVeil += 1; } },
    ],
    jade: [
      { id: "fork", name: "多劈一个", contrast: "打法：多目标", effect: "本次：玉简雷每次可以多打 1 个敌人，适合快速清理分散目标。", apply: (p) => { p.mods.jadeFork += 1; } },
      { id: "seal", name: "劈中更重", contrast: "打法：重击减速", effect: "本次：玉简雷伤害和减速提高，发动不多，但每一下都更有分量。", apply: (p) => { p.mods.jadeSeal += 1; } },
    ],
    needle: [
      { id: "shower", name: "多落一针", contrast: "打法：多目标落针", effect: "本次：雨墨针额外落 1 枚，适合快速点掉多个小目标。", apply: (p) => { p.mods.needleShower += 1; } },
      { id: "seal", name: "慢敌更痛", contrast: "打法：减速增伤", effect: "本次：雨墨针对被减速的敌人更痛；站着不动时也更容易看出收益。", apply: (p) => { p.mods.needleSeal += 1; } },
    ],
    fan: [
      { id: "wide", name: "扫得更宽", contrast: "打法：大扇面控场", effect: "本次：玉扇风角度更宽、减速更久，适合一次挡住身前大片敌人。", apply: (p) => { p.mods.fanWide += 1; } },
      { id: "return", name: "回风返场", contrast: "打法：慢触发高回报", effect: "本次：玉扇风会折回一次，发动少但同一群敌人能吃到第二段。", apply: (p) => { p.mods.fanReturn += 1; p.fanCooldown = Math.max(1.26, p.fanCooldown * 0.96); } },
    ],
    umbrella: [
      { id: "guard", name: "伞面更稳", contrast: "打法：近身护圈", effect: "本次：墨莲伞护圈更大，张开时短暂更安全，适合站住脚清身边敌人。", apply: (p) => { p.mods.umbrellaGuard += 1; p.maxHp += 4; p.hp = Math.min(p.maxHp, p.hp + 8); } },
      { id: "spine", name: "伞骨反刺", contrast: "打法：反打远刺", effect: "本次：墨莲伞张开时多射伞骨光刺，近身被围时能马上反打外圈敌人。", apply: (p) => { p.mods.umbrellaSpine += 1; p.umbrellaCooldown = Math.max(1.28, p.umbrellaCooldown * 0.94); } },
    ],
  };

  const codexSections = [
    {
      title: "角色特性",
      items: characters.map((character) => ({
        id: `trait-${character.id}`,
        type: "特性",
        name: character.trait?.name || character.role,
        desc: `${character.name}自带特性。${character.trait?.desc || character.desc}`,
        state: (p) => (p.characterId === character.id ? `当前角色 · ${p.characterTraitCooldown > 0 ? "回响中" : "待触发"}` : character.build),
        owned: (p) => p.characterId === character.id,
        ready: (p) => p.characterId !== character.id,
        tree: (p) => {
          const selected = p.characterId === character.id;
          const trees = {
            wanderer: [
              "起手：3 重墨锋 + 墨印连锁，无星铃/月焰",
              "触发：墨系命中 4 次",
              "收益：墨痕回环 + 回转墨锋冷却",
              "流派：贯穿、散毫、骤雨纯墨构筑",
            ],
            "bell-dancer": [
              "起手：4 星铃 + 星盘，无墨锋/月焰",
              "触发：星铃/碎星命中 5 次",
              "收益：星座回响 + 星铃加速 + 碎星爆发",
              "流派：贴身回旋、碎星命中、星河轮",
            ],
            "ember-warden": [
              "起手：2 层月焰 + 余烬织线，无墨锋/星铃",
              "触发：击杀积焰，余烬击杀加倍",
              "收益：焰莲方阵 + 大范围爆燃",
              "流派：低频爆发、击杀连锁、白月焰莲",
            ],
            "lantern-child": [
              "起手：2 盏流萤灯 + 引露脉冲，无墨锋/星铃",
              "触发：拾取 5 点经验",
              "收益：萤灯螺旋 + 追击流萤 + 引露充能",
              "流派：拾取、聚辉、宝箱/引露循环",
            ],
          };
          return (trees[character.id] || []).map((text, index) => ({
            text,
            status: selected ? (index === 0 ? "owned" : "ready") : "locked",
          }));
        },
      })),
    },
    {
      title: "武器",
      items: [
        {
          id: "weapon-brush",
          type: "武器",
          name: "墨锋加密",
          desc: "自动飞出墨锋；重数越高，弹幕越密。",
          state: (p) => `墨锋 ${p.brushCount} 重`,
          owned: (p) => p.brushCount > 1,
          tree: (p) => [
            { text: "墨锋起式", status: "owned" },
            { text: `${p.brushCount}/3 加密重数`, status: p.brushCount >= 3 ? "owned" : "ready" },
            { text: `每级二选一：速写 ${p.mods.brushSpeed} / 破墨 ${p.mods.brushForce}`, status: p.brushCount > 1 ? "ready" : "locked" },
            { text: `分支：散毫命中 ${p.branches.brushSplinter}/3`, status: p.branches.brushSplinter ? "owned" : p.brushCount >= 3 && p.abilities.inkMark ? "ready" : "locked" },
            { text: `分支：骤雨齐射 ${p.branches.brushRain}/3`, status: p.branches.brushRain ? "owned" : p.brushCount >= 4 ? "ready" : "locked" },
            { text: "联动：墨印连锁引爆", status: p.abilities.inkMark ? "owned" : "locked" },
            { text: "联动：站定凝神加速骤雨", status: p.focusStillness > 0.55 ? "owned" : "ready" },
            { text: "联动：裂月镜额外散毫", status: p.relics.moonMirror ? "owned" : "locked" },
            { text: "终点：万象墨锋", status: p.evolutions.voidBrush ? "owned" : p.brushCount >= 3 && p.abilities.inkMark ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-brush-splinter",
          type: "武器",
          name: "墨锋散毫",
          desc: "墨锋强化分支。墨锋命中时裂出细毫，补足侧翼与近身敌人。",
          state: (p) => (p.branches.brushSplinter ? `Lv ${p.branches.brushSplinter}/${upgradeCaps["branch-brush-splinter"]}` : p.brushCount >= 3 && p.abilities.inkMark ? "可出现" : "需 3 重墨锋 + 墨印连锁"),
          owned: (p) => p.branches.brushSplinter > 0,
          ready: (p) => p.brushCount >= 3 && p.abilities.inkMark && p.branches.brushSplinter < upgradeCaps["branch-brush-splinter"],
          tree: (p) => [
            { text: "条件：墨锋 3 重", status: p.brushCount >= 3 ? "ready" : "locked" },
            { text: "条件：墨印连锁", status: p.abilities.inkMark ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.brushSplinter}/3`, status: p.branches.brushSplinter ? "owned" : "ready" },
            { text: "触发：墨锋命中裂出细毫", status: p.branches.brushSplinter ? "owned" : "locked" },
            { text: "联动：裂月镜额外细毫", status: p.relics.moonMirror ? "owned" : "locked" },
            { text: "联动：万象墨锋细毫贯穿", status: p.evolutions.voidBrush ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-brush-rain",
          type: "武器",
          name: "墨锋骤雨",
          desc: "墨锋第二分支。齐射积攒碑拓，满后落下纵横墨雨；站定凝神可更快触发，适合冷却和阵地流。",
          state: (p) => (p.branches.brushRain ? `Lv ${p.branches.brushRain}/${upgradeCaps["branch-brush-rain"]}` : p.brushCount >= 4 ? "可出现" : "需墨锋 4 重"),
          owned: (p) => p.branches.brushRain > 0,
          ready: (p) => p.brushCount >= 4 && p.branches.brushRain < upgradeCaps["branch-brush-rain"],
          tree: (p) => [
            { text: "条件：墨锋 4 重", status: p.brushCount >= 4 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.brushRain}/3`, status: p.branches.brushRain ? "owned" : "ready" },
            { text: "触发：墨锋齐射积攒碑拓", status: p.branches.brushRain ? "owned" : "locked" },
            { text: "博弈：触发较慢，换多道贯穿墨柱", status: p.branches.brushRain ? "owned" : "ready" },
            { text: "联动：站定凝神加快积攒", status: p.focusStillness > 0.55 ? "owned" : "ready" },
            { text: "联动：万象墨锋提升墨雨数量", status: p.evolutions.voidBrush ? "owned" : "locked" },
            { text: "联动：分枝砚/匣纹棱镜", status: p.relics.branchInkstone || p.relics.chestPrism ? "ready" : "locked" },
          ],
        },
        {
          id: "weapon-orb",
          type: "武器",
          name: "星铃回旋",
          desc: "环绕切割，和星盘组成星河轮。",
          state: (p) => `${p.orbs} 枚星铃`,
          owned: (p) => p.orbs > 2,
          tree: (p) => [
            { text: "星铃双环", status: "owned" },
            { text: `${p.orbs}/4 星铃数量`, status: p.orbs >= 4 ? "owned" : "ready" },
            { text: `每级二选一：大环 ${p.mods.orbOrbit} / 急旋 ${p.mods.orbTempo}`, status: p.orbs > 2 ? "ready" : "locked" },
            { text: `分支：归潮拾取 ${p.branches.orbRecall}/3`, status: p.branches.orbRecall ? "owned" : p.orbs >= 3 ? "ready" : "locked" },
            { text: `分支：碎星命中 ${p.branches.orbShatter}/3`, status: p.branches.orbShatter ? "owned" : p.orbs >= 4 && p.relics.starChart ? "ready" : "locked" },
            { text: "触发：拾取月露召回星纹", status: p.branches.orbRecall ? "owned" : "locked" },
            { text: "联动：星盘强化墨锋", status: p.relics.starChart ? "owned" : "locked" },
            { text: "终点：星河轮", status: p.evolutions.starRiver ? "owned" : p.orbs >= 4 && p.relics.starChart ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-orb-recall",
          type: "武器",
          name: "星铃归潮",
          desc: "星铃强化分支。拾取月露时召回星纹，造成近身伤害并加速星铃。",
          state: (p) => (p.branches.orbRecall ? `Lv ${p.branches.orbRecall}/${upgradeCaps["branch-orb-recall"]}` : p.orbs >= 3 ? "可出现" : "需 3 枚星铃"),
          owned: (p) => p.branches.orbRecall > 0,
          ready: (p) => p.orbs >= 3 && p.branches.orbRecall < upgradeCaps["branch-orb-recall"],
          tree: (p) => [
            { text: "条件：星铃 3 枚", status: p.orbs >= 3 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.orbRecall}/3`, status: p.branches.orbRecall ? "owned" : "ready" },
            { text: "触发：拾取月露", status: p.branches.orbRecall ? "owned" : "locked" },
            { text: "效果：召回星纹伤害 + 星铃加速", status: p.branches.orbRecall ? "owned" : "locked" },
            { text: "联动：星盘扩大半径", status: p.relics.starChart ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-orb-shatter",
          type: "武器",
          name: "星铃碎星",
          desc: "星铃第二分支。星铃命中时裂出碎星，适合命中频率和星河轮构筑。",
          state: (p) => (p.branches.orbShatter ? `Lv ${p.branches.orbShatter}/${upgradeCaps["branch-orb-shatter"]}` : p.orbs >= 4 && p.relics.starChart ? "可出现" : "需 4 枚星铃 + 星盘"),
          owned: (p) => p.branches.orbShatter > 0,
          ready: (p) => p.orbs >= 4 && p.relics.starChart && p.branches.orbShatter < upgradeCaps["branch-orb-shatter"],
          tree: (p) => [
            { text: "条件：星铃 4 枚", status: p.orbs >= 4 ? "ready" : "locked" },
            { text: "条件：星盘", status: p.relics.starChart ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.orbShatter}/3`, status: p.branches.orbShatter ? "owned" : "ready" },
            { text: "触发：星铃命中裂出碎星", status: p.branches.orbShatter ? "owned" : "locked" },
            { text: "联动：星河轮碎星贯穿", status: p.evolutions.starRiver ? "owned" : "locked" },
            { text: "联动：分枝砚回转冷却", status: p.relics.branchInkstone ? "owned" : "locked" },
          ],
        },
        {
          id: "weapon-flame",
          type: "武器",
          name: "月焰外放",
          desc: "周期性扩散，和余烬织线组成白月焰莲。",
          state: (p) => `月焰 ${p.flameLevel} 层`,
          owned: (p) => p.flameLevel > 1,
          tree: (p) => [
            { text: "月焰外放", status: "owned" },
            { text: `${p.flameLevel}/3 焰莲层级`, status: p.flameLevel >= 3 ? "owned" : "ready" },
            { text: `每级二选一：广焰 ${p.mods.flameReach} / 短燃 ${p.mods.flameTempo}`, status: p.flameLevel > 1 ? "ready" : "locked" },
            { text: `分支：烬环击杀 ${p.branches.flameCinder}/3`, status: p.branches.flameCinder ? "owned" : p.flameLevel >= 2 && p.abilities.emberWeb ? "ready" : "locked" },
            { text: `分支：潮汐脉冲 ${p.branches.flameTide}/3`, status: p.branches.flameTide ? "owned" : p.flameLevel >= 3 && p.abilities.dewPulse ? "ready" : "locked" },
            { text: "联动：余烬织线二次点燃", status: p.abilities.emberWeb ? "owned" : "locked" },
            { text: "终点：白月焰莲", status: p.evolutions.moonLotus ? "owned" : p.flameLevel >= 3 && p.abilities.emberWeb ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-flame-cinder",
          type: "武器",
          name: "月焰烬环",
          desc: "月焰强化分支。余烬敌人死亡时爆开焰环，形成击杀连锁。",
          state: (p) => (p.branches.flameCinder ? `Lv ${p.branches.flameCinder}/${upgradeCaps["branch-flame-cinder"]}` : p.flameLevel >= 2 && p.abilities.emberWeb ? "可出现" : "需月焰 2 层 + 余烬织线"),
          owned: (p) => p.branches.flameCinder > 0,
          ready: (p) => p.flameLevel >= 2 && p.abilities.emberWeb && p.branches.flameCinder < upgradeCaps["branch-flame-cinder"],
          tree: (p) => [
            { text: "条件：月焰 2 层", status: p.flameLevel >= 2 ? "ready" : "locked" },
            { text: "条件：余烬织线", status: p.abilities.emberWeb ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.flameCinder}/3`, status: p.branches.flameCinder ? "owned" : "ready" },
            { text: "触发：余烬敌人死亡", status: p.branches.flameCinder ? "owned" : "locked" },
            { text: "联动：白月焰莲扩大焰环", status: p.evolutions.moonLotus ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-flame-tide",
          type: "武器",
          name: "月焰潮汐",
          desc: "月焰第二分支。引露脉冲释放时展开月焰潮，适合拾取与脉冲构筑。",
          state: (p) => (p.branches.flameTide ? `Lv ${p.branches.flameTide}/${upgradeCaps["branch-flame-tide"]}` : p.flameLevel >= 3 && p.abilities.dewPulse ? "可出现" : "需月焰 3 层 + 引露脉冲"),
          owned: (p) => p.branches.flameTide > 0,
          ready: (p) => p.flameLevel >= 3 && p.abilities.dewPulse && p.branches.flameTide < upgradeCaps["branch-flame-tide"],
          tree: (p) => [
            { text: "条件：月焰 3 层", status: p.flameLevel >= 3 ? "ready" : "locked" },
            { text: "条件：引露脉冲", status: p.abilities.dewPulse ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.flameTide}/3`, status: p.branches.flameTide ? "owned" : "ready" },
            { text: "触发：引露脉冲释放月焰潮", status: p.branches.flameTide ? "owned" : "locked" },
            { text: "联动：白月焰莲扩大潮汐", status: p.evolutions.moonLotus ? "owned" : "locked" },
            { text: "联动：分枝砚回转冷却", status: p.relics.branchInkstone ? "owned" : "locked" },
          ],
        },
        {
          id: "weapon-frost",
          type: "武器",
          name: "霜弦拨月",
          desc: "拨出穿刺霜弦，给敌人挂减速；和引露脉冲组成裂音分支。",
          state: (p) => `霜弦 ${p.frostLevel} 重`,
          owned: (p) => p.frostLevel > 0,
          ready: (p) => p.frostLevel < upgradeCaps.frost,
          tree: (p) => [
            { text: "霜弦入池", status: p.frostLevel > 0 ? "owned" : "ready" },
            { text: `${p.frostLevel}/3 裂音重数`, status: p.frostLevel >= 3 ? "owned" : "ready" },
            { text: `每级二选一：长弦 ${p.mods.frostPierce} / 寒律 ${p.mods.frostPulse}`, status: p.frostLevel > 0 ? "ready" : "locked" },
            { text: `分支：裂音 ${p.branches.frostEcho}/3`, status: p.branches.frostEcho ? "owned" : p.frostLevel >= 3 && p.abilities.dewPulse ? "ready" : "locked" },
            { text: `分支：封阵控场 ${p.branches.frostLattice}/3`, status: p.branches.frostLattice ? "owned" : p.frostLevel >= 4 ? "ready" : "locked" },
            { text: "触发：霜弦命中裂出寒音", status: p.branches.frostEcho ? "owned" : "locked" },
            { text: "触发：霜弦命中展开六角霜阵", status: p.branches.frostLattice ? "owned" : "locked" },
            { text: "联动：寒音为引露脉冲充能", status: p.abilities.dewPulse ? "ready" : "locked" },
            { text: "联动：分枝砚回转冷却", status: p.relics.branchInkstone ? "owned" : "locked" },
            { text: "终点：霜月琴", status: p.evolutions.frostZither ? "owned" : p.frostLevel >= 4 && p.abilities.dewPulse ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-frost-echo",
          type: "武器",
          name: "霜弦裂音",
          desc: "霜弦强化分支。霜弦命中时裂出寒音，适合减速与引露构筑。",
          state: (p) => (p.branches.frostEcho ? `Lv ${p.branches.frostEcho}/${upgradeCaps["branch-frost-echo"]}` : p.frostLevel >= 3 && p.abilities.dewPulse ? "可出现" : "需 3 重霜弦 + 引露脉冲"),
          owned: (p) => p.branches.frostEcho > 0,
          ready: (p) => p.frostLevel >= 3 && p.abilities.dewPulse && p.branches.frostEcho < upgradeCaps["branch-frost-echo"],
          tree: (p) => [
            { text: "条件：霜弦 3 重", status: p.frostLevel >= 3 ? "ready" : "locked" },
            { text: "条件：引露脉冲", status: p.abilities.dewPulse ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.frostEcho}/3`, status: p.branches.frostEcho ? "owned" : "ready" },
            { text: "触发：霜弦命中裂出寒音", status: p.branches.frostEcho ? "owned" : "locked" },
            { text: "联动：寒音充能引露脉冲", status: p.abilities.dewPulse ? "ready" : "locked" },
            { text: "联动：分枝砚回转霜弦", status: p.relics.branchInkstone ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-frost-lattice",
          type: "武器",
          name: "霜弦封阵",
          desc: "霜弦第二分支。霜弦命中后开出六角霜阵，低频但范围控场强；站定和霜月琴会提高收益。",
          state: (p) => (p.branches.frostLattice ? `Lv ${p.branches.frostLattice}/${upgradeCaps["branch-frost-lattice"]}` : p.frostLevel >= 4 ? "可出现" : "需 4 重霜弦"),
          owned: (p) => p.branches.frostLattice > 0,
          ready: (p) => p.frostLevel >= 4 && p.branches.frostLattice < upgradeCaps["branch-frost-lattice"],
          tree: (p) => [
            { text: "条件：霜弦 4 重", status: p.frostLevel >= 4 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.frostLattice}/3`, status: p.branches.frostLattice ? "owned" : "ready" },
            { text: "触发：霜弦命中展开六角霜阵", status: p.branches.frostLattice ? "owned" : "locked" },
            { text: "博弈：触发较慢，换强控场和可见阵地", status: p.branches.frostLattice ? "owned" : "ready" },
            { text: "联动：站定凝神扩大霜阵", status: p.focusStillness > 0.55 ? "owned" : "ready" },
            { text: "联动：霜月琴让霜阵更大更久", status: p.evolutions.frostZither ? "owned" : "locked" },
            { text: "联动：引露脉冲/分枝砚", status: p.abilities.dewPulse || p.relics.branchInkstone ? "ready" : "locked" },
          ],
        },
        {
          id: "weapon-lantern",
          type: "武器",
          name: "流萤灯",
          desc: "追光流萤自动追击远处敌人；适合拾取、引露和范围连锁流派。",
          state: (p) => (p.lanternLevel ? `流萤灯 ${p.lanternLevel} 盏` : "升级可遇"),
          owned: (p) => p.lanternLevel > 0,
          ready: (p) => p.lanternLevel < upgradeCaps.lantern,
          tree: (p) => [
            { text: "流萤入池", status: p.lanternLevel > 0 ? "owned" : "ready" },
            { text: `${p.lanternLevel}/3 聚辉条件`, status: p.lanternLevel >= 3 ? "owned" : "ready" },
            { text: `每级二选一：群萤 ${p.mods.lanternSwarm} / 明烛 ${p.mods.lanternRadiance}`, status: p.lanternLevel > 0 ? "ready" : "locked" },
            { text: `分支：聚辉拾取 ${p.branches.lanternGleam}/3`, status: p.branches.lanternGleam ? "owned" : p.lanternLevel >= 3 && p.abilities.dewPulse ? "ready" : "locked" },
            { text: `分支：织径命中 ${p.branches.lanternVein}/3`, status: p.branches.lanternVein ? "owned" : p.lanternLevel >= 3 && p.sigilLevel > 0 ? "ready" : "locked" },
            { text: "流派：经验拾取 + 范围清场", status: p.lanternLevel > 0 ? "ready" : "locked" },
            { text: "联动：引露脉冲充能", status: p.abilities.dewPulse ? "ready" : "locked" },
            { text: "联动：照影符回冷却", status: p.sigilLevel > 0 ? "ready" : "locked" },
            { text: "联动：宝箱棱镜折射聚辉/织径", status: p.relics.chestPrism ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-lantern-gleam",
          type: "武器",
          name: "流萤聚辉",
          desc: "流萤灯强化分支。拾取月露爆出萤辉，给拾取流派稳定的范围清场与引露充能。",
          state: (p) => (p.branches.lanternGleam ? `Lv ${p.branches.lanternGleam}/${upgradeCaps["branch-lantern-gleam"]}` : p.lanternLevel >= 3 && p.abilities.dewPulse ? "可出现" : "需流萤灯 3 级 + 引露脉冲"),
          owned: (p) => p.branches.lanternGleam > 0,
          ready: (p) => p.lanternLevel >= 3 && p.abilities.dewPulse && p.branches.lanternGleam < upgradeCaps["branch-lantern-gleam"],
          tree: (p) => [
            { text: "条件：流萤灯 3 级", status: p.lanternLevel >= 3 ? "ready" : "locked" },
            { text: "条件：引露脉冲", status: p.abilities.dewPulse ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.lanternGleam}/3`, status: p.branches.lanternGleam ? "owned" : "ready" },
            { text: "触发：拾取月露爆出萤辉", status: p.branches.lanternGleam ? "owned" : "locked" },
            { text: "博弈：少直接伤害，换取拾取清场", status: p.branches.lanternGleam ? "owned" : "ready" },
            { text: "联动：分枝砚/匣纹棱镜", status: p.relics.branchInkstone || p.relics.chestPrism ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-lantern-vein",
          type: "武器",
          name: "流萤织径",
          desc: "流萤灯第二分支。流萤命中后织出萤径光束，回转照影符并充能引露。",
          state: (p) => (p.branches.lanternVein ? `Lv ${p.branches.lanternVein}/${upgradeCaps["branch-lantern-vein"]}` : p.lanternLevel >= 3 && p.sigilLevel > 0 ? "可出现" : "需流萤灯 3 级 + 照影符"),
          owned: (p) => p.branches.lanternVein > 0,
          ready: (p) => p.lanternLevel >= 3 && p.sigilLevel > 0 && p.branches.lanternVein < upgradeCaps["branch-lantern-vein"],
          tree: (p) => [
            { text: "条件：流萤灯 3 级", status: p.lanternLevel >= 3 ? "ready" : "locked" },
            { text: "条件：照影符入池", status: p.sigilLevel > 0 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.lanternVein}/3`, status: p.branches.lanternVein ? "owned" : "ready" },
            { text: "触发：流萤命中织出萤径光束", status: p.branches.lanternVein ? "owned" : "locked" },
            { text: "收益：照影符回冷却 + 引露充能", status: p.branches.lanternVein ? "owned" : "ready" },
            { text: "联动：照影回文可在织径终点展开", status: p.branches.sigilEcho ? "owned" : "locked" },
            { text: "联动：匣纹棱镜可折射织径", status: p.relics.chestPrism ? "ready" : "locked" },
          ],
        },
        {
          id: "weapon-sigil",
          type: "武器",
          name: "照影符",
          desc: "低频直线影符。触发少但单次收益高，适合贯穿、裂月镜和暗场回照流派。",
          state: (p) => (p.sigilLevel ? `照影符 ${p.sigilLevel} 重` : "升级可遇"),
          owned: (p) => p.sigilLevel > 0,
          ready: (p) => p.sigilLevel < upgradeCaps.sigil,
          tree: (p) => [
            { text: "照影入池", status: p.sigilLevel > 0 ? "owned" : "ready" },
            { text: `${p.sigilLevel}/3 回文条件`, status: p.sigilLevel >= 3 ? "owned" : "ready" },
            { text: `每级二选一：直拓 ${p.mods.sigilLine} / 晦纹 ${p.mods.sigilVeil}`, status: p.sigilLevel > 0 ? "ready" : "locked" },
            { text: `分支：照影回文 ${p.branches.sigilEcho}/3`, status: p.branches.sigilEcho ? "owned" : p.sigilLevel >= 3 && p.relics.moonMirror ? "ready" : "locked" },
            { text: `分支：照影折幕 ${p.branches.sigilCurtain}/3`, status: p.branches.sigilCurtain ? "owned" : p.sigilLevel >= 3 ? "ready" : "locked" },
            { text: "博弈：冷却长，单次贯穿和暗场收益高", status: p.sigilLevel > 0 ? "ready" : "locked" },
            { text: "联动：裂月镜解锁回文", status: p.relics.moonMirror ? "owned" : "locked" },
            { text: "联动：站定凝神强化折幕", status: p.focusStillness > 0.55 ? "owned" : "ready" },
            { text: "联动：宝箱棱镜折射回照", status: p.relics.chestPrism ? "ready" : "locked" },
          ],
        },
        {
          id: "weapon-jade",
          type: "武器",
          name: "玉简雷",
          desc: "新基础武器。召出玉简雷刻，锁定多名敌人落下折线雷痕，和现有武器有完全不同的点杀节奏。",
          state: (p) => (p.jadeLevel ? `玉简雷 ${p.jadeLevel} 重` : "升级可遇"),
          owned: (p) => p.jadeLevel > 0,
          ready: (p) => p.jadeLevel < upgradeCaps.jade,
          tree: (p) => [
            { text: "玉简入池", status: p.jadeLevel > 0 ? "owned" : "ready" },
            { text: `${p.jadeLevel}/5 雷刻层级`, status: p.jadeLevel > 0 ? "ready" : "locked" },
            { text: `每级二选一：分雷 ${p.mods.jadeFork} / 镇刻 ${p.mods.jadeSeal}`, status: p.jadeLevel > 0 ? "ready" : "locked" },
            { text: "触发：周期锁定多名敌人", status: p.jadeLevel > 0 ? "owned" : "locked" },
            { text: "博弈：触发慢，但点杀和减速很清楚", status: p.jadeLevel > 0 ? "ready" : "locked" },
            { text: `分支：连弧 ${p.branches.jadeChain}/3`, status: p.branches.jadeChain ? "owned" : p.jadeLevel >= 3 ? "ready" : "locked" },
            { text: `分支：镇域 ${p.branches.jadeWard}/3`, status: p.branches.jadeWard ? "owned" : p.jadeLevel >= 4 ? "ready" : "locked" },
            { text: "联动：清辉入定提高站定收益", status: getPickCount("focus") > 0 ? "ready" : "locked" },
          ],
        },
        {
          id: "weapon-needle",
          type: "武器",
          name: "雨墨针",
          desc: "新基础武器。天幕垂落细针雨，直接钉向多名敌人，和霜弦减速、引露脉冲、站定凝神形成针雨流派。",
          state: (p) => (p.needleLevel ? `雨墨针 ${p.needleLevel} 重` : "升级可遇"),
          owned: (p) => p.needleLevel > 0,
          ready: (p) => p.needleLevel < upgradeCaps.needle,
          tree: (p) => [
            { text: "雨墨针入池", status: p.needleLevel > 0 ? "owned" : "ready" },
            { text: `${p.needleLevel}/5 针雨层级`, status: p.needleLevel > 0 ? "ready" : "locked" },
            { text: `每级二选一：疾雨 ${p.mods.needleShower} / 定雨 ${p.mods.needleSeal}`, status: p.needleLevel > 0 ? "ready" : "locked" },
            { text: "触发：周期垂落细针雨", status: p.needleLevel > 0 ? "owned" : "locked" },
            { text: "博弈：触发慢，换多目标定点伤害", status: p.needleLevel > 0 ? "ready" : "locked" },
            { text: `分支：雨墨帘 ${p.branches.needleCurtain}/3`, status: p.branches.needleCurtain ? "owned" : p.needleLevel >= 3 ? "ready" : "locked" },
            { text: `分支：定雨纹 ${p.branches.needleSeal}/3`, status: p.branches.needleSeal ? "owned" : p.needleLevel >= 3 && (p.frostLevel > 0 || p.abilities.dewPulse) ? "ready" : "locked" },
            { text: "联动：减速敌人吃更高伤害", status: p.frostLevel > 0 || p.branches.frostLattice ? "ready" : "locked" },
            { text: "联动：引露脉冲获得雨纹充能", status: p.abilities.dewPulse ? "ready" : "locked" },
            { text: "联动：站定凝神额外落针", status: getPickCount("focus") > 0 || p.focusStillness > 0.55 ? "ready" : "locked" },
            { text: "终点：天雨织机", status: p.evolutions.rainLoom ? "owned" : p.needleLevel >= 5 && p.abilities.dewPulse && (p.branches.needleCurtain || p.branches.needleSeal) ? "ready" : "locked" },
          ],
        },
        {
          id: "weapon-fan",
          type: "武器",
          name: "玉扇风",
          desc: "新基础武器。低频挥出扇面弧风，扫过一片敌人并减速；一次发动能直接看见安全区。",
          state: (p) => (p.fanLevel ? `玉扇风 ${p.fanLevel} 重` : "升级可遇"),
          owned: (p) => p.fanLevel > 0,
          ready: (p) => p.fanLevel < upgradeCaps.fan,
          tree: (p) => [
            { text: "玉扇风入池", status: p.fanLevel > 0 ? "owned" : "ready" },
            { text: `${p.fanLevel}/5 扇风层级`, status: p.fanLevel > 0 ? "ready" : "locked" },
            { text: `每级二选一：宽扇 ${p.mods.fanWide} / 回风 ${p.mods.fanReturn}`, status: p.fanLevel > 0 ? "ready" : "locked" },
            { text: "触发：周期挥出扇面弧风", status: p.fanLevel > 0 ? "owned" : "locked" },
            { text: "博弈：出手慢，换大片减速和清身前敌人", status: p.fanLevel > 0 ? "ready" : "locked" },
            { text: `分支：回廊风纹 ${p.branches.fanGale}/3`, status: p.branches.fanGale ? "owned" : p.fanLevel >= 3 ? "ready" : "locked" },
            { text: `分支：扇缘裂羽 ${p.branches.fanFeather}/3`, status: p.branches.fanFeather ? "owned" : p.fanLevel >= 4 ? "ready" : "locked" },
            { text: "联动：站定凝神缩短出手间隔并扩大安全区", status: getPickCount("focus") > 0 || p.focusStillness > 0.55 ? "ready" : "locked" },
            { text: "联动：引露脉冲可吃回风充能", status: p.abilities.dewPulse && p.mods.fanReturn ? "ready" : "locked" },
            { text: "终点：清风玉阙", status: p.evolutions.jadeFan ? "owned" : p.fanLevel >= 5 && p.branches.fanGale && (getPickCount("focus") > 0 || p.abilities.dewPulse) ? "ready" : "locked" },
          ],
        },
        {
          id: "weapon-umbrella",
          type: "武器",
          name: "墨莲伞",
          desc: "新基础武器。低频张开护身墨莲伞，近身护圈和外圈伞骨同时反打，被围时收益很容易看见。",
          state: (p) => (p.umbrellaLevel ? `墨莲伞 ${p.umbrellaLevel} 重` : "升级可遇"),
          owned: (p) => p.umbrellaLevel > 0,
          ready: (p) => p.umbrellaLevel < upgradeCaps.umbrella,
          tree: (p) => [
            { text: "墨莲伞入池", status: p.umbrellaLevel > 0 ? "owned" : "ready" },
            { text: `${p.umbrellaLevel}/5 护伞层级`, status: p.umbrellaLevel > 0 ? "ready" : "locked" },
            { text: `每级二选一：护圈 ${p.mods.umbrellaGuard} / 反刺 ${p.mods.umbrellaSpine}`, status: p.umbrellaLevel > 0 ? "ready" : "locked" },
            { text: "怎么发动：周期在身边张开伞面", status: p.umbrellaLevel > 0 ? "owned" : "locked" },
            { text: "取舍：护圈更安全，反刺打到外圈敌人", status: p.umbrellaLevel > 0 ? "ready" : "locked" },
            { text: `分支：墨伞莲阵 ${p.branches.umbrellaLotus}/3`, status: p.branches.umbrellaLotus ? "owned" : p.umbrellaLevel >= 3 ? "ready" : "locked" },
            { text: `分支：伞影回潮 ${p.branches.umbrellaEcho}/3`, status: p.branches.umbrellaEcho ? "owned" : p.umbrellaLevel >= 4 ? "ready" : "locked" },
            { text: "配合：站定凝神让护伞更快张开", status: getPickCount("focus") > 0 || p.focusStillness > 0.55 ? "ready" : "locked" },
            { text: "配合：重响磬补一圈减速伤害", status: p.relics.tempoBell ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-umbrella-lotus",
          type: "武器",
          name: "墨伞莲阵",
          desc: "墨莲伞强化分支。护伞张开后留下墨莲阵，持续压近身敌人；护圈路线更稳，反刺路线阵边补光刺。",
          state: (p) => (p.branches.umbrellaLotus ? `Lv ${p.branches.umbrellaLotus}/${upgradeCaps["branch-umbrella-lotus"]}` : p.umbrellaLevel >= 3 ? "可出现" : "需墨莲伞 3 重"),
          owned: (p) => p.branches.umbrellaLotus > 0,
          ready: (p) => p.umbrellaLevel >= 3 && p.branches.umbrellaLotus < upgradeCaps["branch-umbrella-lotus"],
          tree: (p) => [
            { text: "条件：墨莲伞 3 重", status: p.umbrellaLevel >= 3 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.umbrellaLotus}/3`, status: p.branches.umbrellaLotus ? "owned" : "ready" },
            { text: "怎么发动：墨莲伞张开后留下莲阵", status: p.branches.umbrellaLotus ? "owned" : "locked" },
            { text: "取舍：一次护圈变成短暂阵地", status: p.branches.umbrellaLotus ? "owned" : "ready" },
            { text: "配合：伞面更稳扩大莲阵和保护", status: p.mods.umbrellaGuard ? "ready" : "locked" },
            { text: "配合：伞骨反刺让阵边补光刺", status: p.mods.umbrellaSpine ? "ready" : "locked" },
            { text: "配合：分枝砚回伞冷却并充能", status: p.relics.branchInkstone ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-umbrella-echo",
          type: "武器",
          name: "伞影回潮",
          desc: "墨莲伞第二分支。护伞张开后折出几道回潮伞影，追打外圈敌人；反刺路线更多，护圈路线补保护。",
          state: (p) => (p.branches.umbrellaEcho ? `Lv ${p.branches.umbrellaEcho}/${upgradeCaps["branch-umbrella-echo"]}` : p.umbrellaLevel >= 4 ? "可出现" : "需墨莲伞 4 重"),
          owned: (p) => p.branches.umbrellaEcho > 0,
          ready: (p) => p.umbrellaLevel >= 4 && p.branches.umbrellaEcho < upgradeCaps["branch-umbrella-echo"],
          tree: (p) => [
            { text: "条件：墨莲伞 4 重", status: p.umbrellaLevel >= 4 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.umbrellaEcho}/3`, status: p.branches.umbrellaEcho ? "owned" : "ready" },
            { text: "怎么发动：墨莲伞张开后追打外圈敌人", status: p.branches.umbrellaEcho ? "owned" : "locked" },
            { text: "取舍：少量低频出手，换更远的追击回潮", status: p.branches.umbrellaEcho ? "owned" : "ready" },
            { text: "配合：伞骨反刺增加追击条数", status: p.mods.umbrellaSpine ? "ready" : "locked" },
            { text: "配合：伞面更稳补短暂保护", status: p.mods.umbrellaGuard ? "ready" : "locked" },
            { text: "配合：重响磬/分枝砚让慢出手更值", status: p.relics.tempoBell || p.relics.branchInkstone ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-fan-gale",
          type: "武器",
          name: "玉扇回廊",
          desc: "玉扇风强化分支。扇风命中后在扇面末端展开回廊风纹，把低频挥扇变成可见的范围控场。",
          state: (p) => (p.branches.fanGale ? `Lv ${p.branches.fanGale}/${upgradeCaps["branch-fan-gale"]}` : p.fanLevel >= 3 ? "可出现" : "需玉扇风 3 重"),
          owned: (p) => p.branches.fanGale > 0,
          ready: (p) => p.fanLevel >= 3 && p.branches.fanGale < upgradeCaps["branch-fan-gale"],
          tree: (p) => [
            { text: "条件：玉扇风 3 重", status: p.fanLevel >= 3 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.fanGale}/3`, status: p.branches.fanGale ? "owned" : "ready" },
            { text: "触发：扇风命中后展开回廊风纹", status: p.branches.fanGale ? "owned" : "locked" },
            { text: "博弈：出手慢，换更清楚的大范围减速", status: p.branches.fanGale ? "owned" : "ready" },
            { text: "取舍：回廊留场控场，裂羽追远处敌人", status: p.branches.fanFeather ? "ready" : "locked" },
            { text: "联动：回风路线会追加风纹和引露充能", status: p.mods.fanReturn ? "ready" : "locked" },
            { text: "联动：站定凝神扩大风纹", status: p.focusStillness > 0.55 || getPickCount("focus") > 0 ? "ready" : "locked" },
            { text: "联动：分枝砚/匣纹棱镜", status: p.relics.branchInkstone || p.relics.chestPrism ? "ready" : "locked" },
            { text: "终点：清风玉阙会把风纹变成双层风墙", status: p.evolutions.jadeFan ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-fan-feather",
          type: "武器",
          name: "玉扇裂羽",
          desc: "玉扇风第二分支。扇风边缘飞出玉羽，追击远处敌人；宽扇多羽，回风会返场。",
          state: (p) => (p.branches.fanFeather ? `Lv ${p.branches.fanFeather}/${upgradeCaps["branch-fan-feather"]}` : p.fanLevel >= 4 ? "可出现" : "需玉扇风 4 重"),
          owned: (p) => p.branches.fanFeather > 0,
          ready: (p) => p.fanLevel >= 4 && p.branches.fanFeather < upgradeCaps["branch-fan-feather"],
          tree: (p) => [
            { text: "条件：玉扇风 4 重", status: p.fanLevel >= 4 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.fanFeather}/3`, status: p.branches.fanFeather ? "owned" : "ready" },
            { text: "怎么发动：扇风边缘飞出玉羽", status: p.branches.fanFeather ? "owned" : "locked" },
            { text: "取舍：回廊控场，裂羽追远处敌人", status: p.branches.fanFeather ? "owned" : "ready" },
            { text: "配合：宽扇多飞羽", status: p.mods.fanWide ? "ready" : "locked" },
            { text: "配合：回风会返场充能", status: p.mods.fanReturn ? "ready" : "locked" },
            { text: "配合：清风玉阙让裂羽更亮更多", status: p.evolutions.jadeFan ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-needle-curtain",
          type: "武器",
          name: "雨墨帘",
          desc: "雨墨针强化分支。针雨命中时追加纵向雨帘与目标间雨线，适合多目标点杀和宝箱棱镜折射。",
          state: (p) => (p.branches.needleCurtain ? `Lv ${p.branches.needleCurtain}/${upgradeCaps["branch-needle-curtain"]}` : p.needleLevel >= 3 ? "可出现" : "需雨墨针 3 重"),
          owned: (p) => p.branches.needleCurtain > 0,
          ready: (p) => p.needleLevel >= 3 && p.branches.needleCurtain < upgradeCaps["branch-needle-curtain"],
          tree: (p) => [
            { text: "条件：雨墨针 3 重", status: p.needleLevel >= 3 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.needleCurtain}/3`, status: p.branches.needleCurtain ? "owned" : "ready" },
            { text: "触发：针雨命中追加雨帘", status: p.branches.needleCurtain ? "owned" : "locked" },
            { text: "博弈：触发频率低，换更密集的垂直光雨", status: p.branches.needleCurtain ? "owned" : "ready" },
            { text: "联动：匣纹棱镜可折射雨帘", status: p.relics.chestPrism ? "ready" : "locked" },
            { text: "联动：分枝砚回转冷却并充能", status: p.relics.branchInkstone ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-needle-seal",
          type: "武器",
          name: "定雨纹",
          desc: "雨墨针第二分支。针雨命中减速目标会展开定雨纹，把低频落针转成范围压制。",
          state: (p) => (p.branches.needleSeal ? `Lv ${p.branches.needleSeal}/${upgradeCaps["branch-needle-seal"]}` : p.needleLevel >= 3 && (p.frostLevel > 0 || p.abilities.dewPulse) ? "可出现" : "需雨墨针 3 重 + 霜弦或引露"),
          owned: (p) => p.branches.needleSeal > 0,
          ready: (p) => p.needleLevel >= 3 && (p.frostLevel > 0 || p.abilities.dewPulse) && p.branches.needleSeal < upgradeCaps["branch-needle-seal"],
          tree: (p) => [
            { text: "条件：雨墨针 3 重", status: p.needleLevel >= 3 ? "ready" : "locked" },
            { text: "条件：霜弦或引露脉冲", status: p.frostLevel > 0 || p.abilities.dewPulse ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.needleSeal}/3`, status: p.branches.needleSeal ? "owned" : "ready" },
            { text: "触发：针雨命中减速目标展开雨纹", status: p.branches.needleSeal ? "owned" : "locked" },
            { text: "收益：范围减速 + 引露充能", status: p.branches.needleSeal ? "owned" : "ready" },
            { text: "联动：站定凝神扩大雨纹", status: p.focusStillness > 0.55 ? "owned" : "ready" },
          ],
        },
        {
          id: "branch-jade-chain",
          type: "武器",
          name: "玉简连弧",
          desc: "玉简雷强化分支。雷刻命中后折出玉弧连到附近敌人，敌人密集时低频触发也有高收益。",
          state: (p) => (p.branches.jadeChain ? `Lv ${p.branches.jadeChain}/${upgradeCaps["branch-jade-chain"]}` : p.jadeLevel >= 3 ? "可出现" : "需玉简雷 3 重"),
          owned: (p) => p.branches.jadeChain > 0,
          ready: (p) => p.jadeLevel >= 3 && p.branches.jadeChain < upgradeCaps["branch-jade-chain"],
          tree: (p) => [
            { text: "条件：玉简雷 3 重", status: p.jadeLevel >= 3 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.jadeChain}/3`, status: p.branches.jadeChain ? "owned" : "ready" },
            { text: "触发：雷刻命中后折出连弧", status: p.branches.jadeChain ? "owned" : "locked" },
            { text: "博弈：触发慢，换敌群连锁点杀", status: p.branches.jadeChain ? "owned" : "ready" },
            { text: "联动：分枝砚回转冷却并充能", status: p.relics.branchInkstone ? "owned" : "locked" },
            { text: "联动：清辉入定让低频触发更密", status: getPickCount("focus") > 0 ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-jade-ward",
          type: "武器",
          name: "玉简镇域",
          desc: "玉简雷第二分支。雷刻落点展开镇域方阵，低频触发换大范围减速和阵地压制。",
          state: (p) => (p.branches.jadeWard ? `Lv ${p.branches.jadeWard}/${upgradeCaps["branch-jade-ward"]}` : p.jadeLevel >= 4 ? "可出现" : "需玉简雷 4 重"),
          owned: (p) => p.branches.jadeWard > 0,
          ready: (p) => p.jadeLevel >= 4 && p.branches.jadeWard < upgradeCaps["branch-jade-ward"],
          tree: (p) => [
            { text: "条件：玉简雷 4 重", status: p.jadeLevel >= 4 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.jadeWard}/3`, status: p.branches.jadeWard ? "owned" : "ready" },
            { text: "触发：雷刻落点展开镇域方阵", status: p.branches.jadeWard ? "owned" : "locked" },
            { text: "博弈：触发慢，换大范围减速和高单次收益", status: p.branches.jadeWard ? "owned" : "ready" },
            { text: "联动：清辉入定扩大镇域", status: getPickCount("focus") > 0 || p.focusStillness > 0.55 ? "ready" : "locked" },
            { text: "联动：寂光砚追加白色镇域光纹", status: p.relics.focusLens ? "owned" : "locked" },
            { text: "联动：分枝砚回转冷却并充能", status: p.relics.branchInkstone ? "owned" : "locked" },
          ],
        },
        {
          id: "branch-sigil-echo",
          type: "武器",
          name: "照影回文",
          desc: "照影符强化分支。影符命中时展开回照暗场和横向光束，触发少但高收益。",
          state: (p) => (p.branches.sigilEcho ? `Lv ${p.branches.sigilEcho}/${upgradeCaps["branch-sigil-echo"]}` : p.sigilLevel >= 3 && p.relics.moonMirror ? "可出现" : "需照影符 3 级 + 裂月镜"),
          owned: (p) => p.branches.sigilEcho > 0,
          ready: (p) => p.sigilLevel >= 3 && p.relics.moonMirror && p.branches.sigilEcho < upgradeCaps["branch-sigil-echo"],
          tree: (p) => [
            { text: "条件：照影符 3 级", status: p.sigilLevel >= 3 ? "ready" : "locked" },
            { text: "条件：裂月镜", status: p.relics.moonMirror ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.sigilEcho}/3`, status: p.branches.sigilEcho ? "owned" : "ready" },
            { text: "触发：影符命中展开暗场", status: p.branches.sigilEcho ? "owned" : "locked" },
            { text: "联动：分枝砚回转冷却", status: p.relics.branchInkstone ? "owned" : "locked" },
            { text: "联动：匣纹棱镜可折射", status: p.relics.chestPrism ? "ready" : "locked" },
          ],
        },
        {
          id: "branch-sigil-curtain",
          type: "武器",
          name: "照影折幕",
          desc: "照影符第二分支。影符命中时折出多道暗幕光束，站定凝神会提高光束数量和伤害。",
          state: (p) => (p.branches.sigilCurtain ? `Lv ${p.branches.sigilCurtain}/${upgradeCaps["branch-sigil-curtain"]}` : p.sigilLevel >= 3 ? "可出现" : "需照影符 3 级"),
          owned: (p) => p.branches.sigilCurtain > 0,
          ready: (p) => p.sigilLevel >= 3 && p.branches.sigilCurtain < upgradeCaps["branch-sigil-curtain"],
          tree: (p) => [
            { text: "条件：照影符 3 级", status: p.sigilLevel >= 3 ? "ready" : "locked" },
            { text: `分支等级 ${p.branches.sigilCurtain}/3`, status: p.branches.sigilCurtain ? "owned" : "ready" },
            { text: "触发：影符命中折出暗幕光束", status: p.branches.sigilCurtain ? "owned" : "locked" },
            { text: "博弈：冷却长，单次清场收益高", status: p.branches.sigilCurtain ? "owned" : "ready" },
            { text: "联动：站定凝神额外光束", status: p.focusStillness > 0.55 ? "owned" : "ready" },
            { text: "联动：分枝砚/匣纹棱镜", status: p.relics.branchInkstone || p.relics.chestPrism ? "ready" : "locked" },
          ],
        },
      ],
    },
    {
      title: "能力",
      items: [
        { id: "ability-ink-mark", type: "能力", name: "墨印连锁", desc: "命中叠墨印，4 层爆开；星铃会加速墨锋。", state: (p) => (p.abilities.inkMark ? "已掌握" : "升级可遇"), owned: (p) => p.abilities.inkMark, tree: (p) => [{ text: "命中叠印", status: p.abilities.inkMark ? "owned" : "ready" }, { text: "4 层爆开", status: p.abilities.inkMark ? "owned" : "locked" }, { text: "解锁：万象墨锋", status: p.brushCount >= 3 && p.abilities.inkMark ? "ready" : "locked" }] },
        { id: "ability-dew-pulse", type: "能力", name: "引露脉冲", desc: "拾取月露蓄能，满后牵引并伤害敌人。", state: (p) => (p.abilities.dewPulse ? `蓄能 ${p.dewCharge}/${p.dewThreshold}` : "升级可遇"), owned: (p) => p.abilities.dewPulse, tree: (p) => [{ text: "拾取月露蓄能", status: p.abilities.dewPulse ? "owned" : "ready" }, { text: "满 8 点脉冲", status: p.abilities.dewPulse ? "owned" : "locked" }, { text: "联动：露砂漏回冷却", status: p.relics.dewHourglass ? "owned" : "locked" }] },
        { id: "ability-ember", type: "能力", name: "余烬织线", desc: "月焰留下余烬，墨印爆发会二次点燃。", state: (p) => (p.abilities.emberWeb ? "已掌握" : "升级可遇"), owned: (p) => p.abilities.emberWeb, tree: (p) => [{ text: "月焰挂余烬", status: p.abilities.emberWeb ? "owned" : "ready" }, { text: "墨印爆发点燃", status: p.abilities.emberWeb && p.abilities.inkMark ? "ready" : "locked" }, { text: "解锁：白月焰莲", status: p.flameLevel >= 3 && p.abilities.emberWeb ? "ready" : "locked" }] },
        { id: "ability-crane-vow", type: "能力", name: "纸鹤誓约", desc: "静止蓄纸鹤，移动时释放锋线；风步加快折纸，万象墨锋强化贯穿。", state: (p) => (p.abilities.craneVow ? `纸鹤 ${p.craneCharges}/3` : "升级可遇"), owned: (p) => p.abilities.craneVow, tree: (p) => [{ text: "静止折纸", status: p.abilities.craneVow ? "owned" : "ready" }, { text: "移动释放锋线", status: p.abilities.craneVow ? "owned" : "locked" }, { text: `分支：回羽 ${p.branches.craneEcho}/3`, status: p.branches.craneEcho ? "owned" : p.abilities.craneVow ? "ready" : "locked" }, { text: "联动：风步额外回羽", status: p.speed > 190 ? "owned" : "locked" }, { text: "联动：万象墨锋加贯穿", status: p.evolutions.voidBrush ? "owned" : "locked" }] },
        { id: "branch-crane-echo", type: "能力", name: "纸鹤回羽", desc: "纸鹤强化分支。纸鹤锋线首次命中会分裂回羽，形成扇形追击。", state: (p) => (p.branches.craneEcho ? `Lv ${p.branches.craneEcho}/${upgradeCaps["branch-crane-echo"]}` : p.abilities.craneVow ? "可出现" : "需纸鹤誓约"), owned: (p) => p.branches.craneEcho > 0, ready: (p) => p.abilities.craneVow && p.branches.craneEcho < upgradeCaps["branch-crane-echo"], tree: (p) => [{ text: "条件：纸鹤誓约", status: p.abilities.craneVow ? "ready" : "locked" }, { text: `分支等级 ${p.branches.craneEcho}/3`, status: p.branches.craneEcho ? "owned" : "ready" }, { text: "触发：纸鹤首次命中", status: p.branches.craneEcho ? "owned" : "locked" }, { text: "联动：风步额外回羽", status: p.speed > 190 ? "owned" : "locked" }, { text: "联动：万象墨锋提高贯穿", status: p.evolutions.voidBrush ? "owned" : "locked" }] },
      ],
    },
    {
      title: "遗物",
      items: [
        { id: "relic-moon-mirror", type: "遗物", name: "裂月镜", desc: "墨印爆发射出月片。条件：墨印连锁。", state: (p) => (p.relics.moonMirror ? "已获得" : p.abilities.inkMark ? "可出现" : "需墨印连锁"), owned: (p) => p.relics.moonMirror, ready: (p) => p.abilities.inkMark && !p.relics.moonMirror, tree: (p) => [{ text: "条件：墨印连锁", status: p.abilities.inkMark ? "ready" : "locked" }, { text: "爆印射月片", status: p.relics.moonMirror ? "owned" : "locked" }] },
        { id: "relic-dew-hourglass", type: "遗物", name: "露砂漏", desc: "引露脉冲回转武器冷却。条件：引露脉冲。", state: (p) => (p.relics.dewHourglass ? "已获得" : p.abilities.dewPulse ? "可出现" : "需引露脉冲"), owned: (p) => p.relics.dewHourglass, ready: (p) => p.abilities.dewPulse && !p.relics.dewHourglass, tree: (p) => [{ text: "条件：引露脉冲", status: p.abilities.dewPulse ? "ready" : "locked" }, { text: "脉冲回转墨锋/月焰", status: p.relics.dewHourglass ? "owned" : "locked" }] },
        { id: "relic-star-chart", type: "遗物", name: "星盘", desc: "星铃强化墨锋，墨锋加速星铃，并扩大星铃归潮。", state: (p) => (p.relics.starChart ? "已获得" : "升级可遇"), owned: (p) => p.relics.starChart, tree: (p) => [{ text: "星铃数量提高收益", status: p.orbs >= 3 ? "ready" : "locked" }, { text: "联动：归潮半径 +28%", status: p.branches.orbRecall ? "ready" : "locked" }, { text: "解锁：星河轮", status: p.orbs >= 4 && p.relics.starChart ? "ready" : "locked" }] },
        { id: "relic-red-seal", type: "遗物", name: "朱砂印", desc: "受伤后下一次击破治疗并爆发。", state: (p) => (p.relics.redSeal ? "已获得" : "升级可遇"), owned: (p) => p.relics.redSeal, tree: (p) => [{ text: "受伤蓄朱砂", status: p.relics.redSeal ? "owned" : "ready" }, { text: "击破治疗并爆印", status: p.redSealReady ? "ready" : p.relics.redSeal ? "owned" : "locked" }] },
        { id: "relic-chest-resonance", type: "遗物", name: "匣心回响", desc: "宝箱奖励触发月匣脉冲和冷却回转。", state: (p) => (p.relics.chestResonance ? "已获得" : game.chestsOpened ? "可出现" : "需开启宝箱"), owned: (p) => p.relics.chestResonance, ready: (p) => game.chestsOpened > 0 && !p.relics.chestResonance, tree: () => [{ text: "条件：开启宝箱", status: game.chestsOpened ? "ready" : "locked" }, { text: "奖励数越多脉冲越强", status: "ready" }] },
        { id: "relic-lacquer-key", type: "遗物", name: "漆钥", desc: "宝箱奖励为引露脉冲额外充能。", state: (p) => (p.relics.lacquerKey ? "已获得" : game.chestsOpened ? "可出现" : "需开启宝箱"), owned: (p) => p.relics.lacquerKey, ready: (p) => game.chestsOpened > 0 && !p.relics.lacquerKey, tree: (p) => [{ text: "条件：开启宝箱", status: game.chestsOpened ? "ready" : "locked" }, { text: "联动：引露脉冲", status: p.abilities.dewPulse ? "ready" : "locked" }] },
        { id: "relic-branch-inkstone", type: "遗物", name: "分枝砚", desc: "分支触发时回转冷却，并为引露脉冲充能。", state: (p) => (p.relics.branchInkstone ? "已获得" : totalBranchLevel(p) > 0 ? "可出现" : "需任意分支"), owned: (p) => p.relics.branchInkstone, ready: (p) => totalBranchLevel(p) > 0 && !p.relics.branchInkstone, tree: (p) => [{ text: "条件：拥有任意分支", status: totalBranchLevel(p) > 0 ? "ready" : "locked" }, { text: `当前分支等级合计 ${totalBranchLevel(p)}`, status: totalBranchLevel(p) > 0 ? "owned" : "locked" }, { text: "触发：散毫/骤雨/归潮/碎星/烬环/潮汐/聚辉/织径/回羽/裂音/封阵/回文/折幕/连弧/镇域/回廊/裂羽/莲阵", status: p.relics.branchInkstone ? "owned" : "ready" }, { text: "联动：引露脉冲充能", status: p.abilities.dewPulse ? "ready" : "locked" }] },
        { id: "relic-chest-prism", type: "遗物", name: "匣纹棱镜", desc: "宝箱奖励折射已拥有分支，奖励越多触发越多。", state: (p) => (p.relics.chestPrism ? "已获得" : game.chestsOpened > 0 && totalBranchLevel(p) > 0 ? "可出现" : "需宝箱 + 任意分支"), owned: (p) => p.relics.chestPrism, ready: (p) => game.chestsOpened > 0 && totalBranchLevel(p) > 0 && !p.relics.chestPrism, tree: (p) => [{ text: "条件：开启宝箱", status: game.chestsOpened ? "ready" : "locked" }, { text: "条件：拥有任意分支", status: totalBranchLevel(p) > 0 ? "ready" : "locked" }, { text: "1/3/5 奖励触发 1/2/3 个分支", status: p.relics.chestPrism ? "owned" : "ready" }, { text: "联动：分枝砚继续回转冷却", status: p.relics.branchInkstone ? "ready" : "locked" }] },
        { id: "relic-focus-lens", type: "遗物", name: "寂光砚", desc: "站定凝神更早射出寂光侧束。条件：清辉入定或纸鹤誓约。", state: (p) => (p.relics.focusLens ? "已获得" : getPickCount("focus") > 0 || p.abilities.craneVow ? "可出现" : "需清辉入定/纸鹤誓约"), owned: (p) => p.relics.focusLens, ready: (p) => !p.relics.focusLens && (getPickCount("focus") > 0 || p.abilities.craneVow), tree: (p) => [{ text: "条件：清辉入定或纸鹤誓约", status: getPickCount("focus") > 0 || p.abilities.craneVow ? "ready" : "locked" }, { text: "站定 1 秒后可提前射出凝神光束", status: p.relics.focusLens ? "owned" : "ready" }, { text: "追加两道寂光侧束 + 更强震屏", status: p.relics.focusLens ? "owned" : "locked" }, { text: "联动：照影折幕/霜弦封阵阵地流", status: p.branches.sigilCurtain || p.branches.frostLattice ? "ready" : "locked" }] },
        { id: "relic-route-charm", type: "遗物", name: "转向签", desc: "选路线也会有即时回响。选过 2 次武器路线后出现。", state: (p) => (p.relics.routeCharm ? "已获得" : Object.values(p.mods).reduce((sum, value) => sum + value, 0) >= 2 ? "可出现" : "需选 2 次路线"), owned: (p) => p.relics.routeCharm, ready: (p) => !p.relics.routeCharm && Object.values(p.mods).reduce((sum, value) => sum + value, 0) >= 2, tree: (p) => [{ text: "条件：选过 2 次武器路线", status: Object.values(p.mods).reduce((sum, value) => sum + value, 0) >= 2 ? "ready" : "locked" }, { text: "触发：以后每次选择路线", status: p.relics.routeCharm ? "owned" : "ready" }, { text: "收益：立刻回一点武器出手间隔", status: p.relics.routeCharm ? "owned" : "locked" }, { text: "联动：引露脉冲充能 + 选路回响特效", status: p.abilities.dewPulse ? "ready" : "locked" }] },
        { id: "relic-tempo-bell", type: "遗物", name: "重响磬", desc: "慢武器每次出手多一圈重响，补伤害、减速并提前下一次出手。", state: (p) => (p.relics.tempoBell ? "已获得" : slowWeaponLevel(p) >= 4 ? "可出现" : `${slowWeaponLevel(p)}/4 慢武器等级`), owned: (p) => p.relics.tempoBell, ready: (p) => !p.relics.tempoBell && slowWeaponLevel(p) >= 4, tree: (p) => [{ text: `慢武器合计 ${slowWeaponLevel(p)}/4`, status: slowWeaponLevel(p) >= 4 ? "ready" : "locked" }, { text: "怎么发动：月焰、照影符、玉简雷、雨墨针、玉扇风、墨莲伞出手", status: p.relics.tempoBell ? "owned" : "ready" }, { text: "好处：多一圈重响，伤害和减速马上可见", status: p.relics.tempoBell ? "owned" : "locked" }, { text: "配合：慢触发路线、站定阵地、引露脉冲", status: p.abilities.dewPulse || getPickCount("focus") > 0 ? "ready" : "locked" }] },
      ],
    },
    {
      title: "超武",
      items: [
        { id: "evolve-void-brush", type: "超武", name: "万象墨锋", desc: "合成：3 重墨锋 + 墨印连锁。贯穿墨月，更快引爆墨印。", state: (p) => (p.evolutions.voidBrush ? "已合成" : p.brushCount >= 3 && p.abilities.inkMark ? "可合成" : `${p.brushCount}/3 墨锋 + ${p.abilities.inkMark ? "墨印已备" : "需墨印"}`), owned: (p) => p.evolutions.voidBrush, ready: (p) => p.brushCount >= 3 && p.abilities.inkMark && !p.evolutions.voidBrush, tree: (p) => [{ text: "墨锋 3 重", status: p.brushCount >= 3 ? "owned" : "locked" }, { text: "墨印连锁", status: p.abilities.inkMark ? "owned" : "locked" }, { text: "贯穿 + 纸鹤加贯穿", status: p.evolutions.voidBrush ? "owned" : "ready" }] },
        { id: "evolve-star-river", type: "超武", name: "星河轮", desc: "合成：4 枚星铃 + 星盘。双层星河切割。", state: (p) => (p.evolutions.starRiver ? "已合成" : p.orbs >= 4 && p.relics.starChart ? "可合成" : `${p.orbs}/4 星铃 + ${p.relics.starChart ? "星盘已备" : "需星盘"}`), owned: (p) => p.evolutions.starRiver, ready: (p) => p.orbs >= 4 && p.relics.starChart && !p.evolutions.starRiver, tree: (p) => [{ text: "星铃 4 枚", status: p.orbs >= 4 ? "owned" : "locked" }, { text: "星盘", status: p.relics.starChart ? "owned" : "locked" }, { text: "双层回旋切割", status: p.evolutions.starRiver ? "owned" : "ready" }] },
        { id: "evolve-moon-lotus", type: "超武", name: "白月焰莲", desc: "合成：3 层月焰 + 余烬织线。双重焰莲爆燃。", state: (p) => (p.evolutions.moonLotus ? "已合成" : p.flameLevel >= 3 && p.abilities.emberWeb ? "可合成" : `${p.flameLevel}/3 月焰 + ${p.abilities.emberWeb ? "余烬已备" : "需余烬"}`), owned: (p) => p.evolutions.moonLotus, ready: (p) => p.flameLevel >= 3 && p.abilities.emberWeb && !p.evolutions.moonLotus, tree: (p) => [{ text: "月焰 3 层", status: p.flameLevel >= 3 ? "owned" : "locked" }, { text: "余烬织线", status: p.abilities.emberWeb ? "owned" : "locked" }, { text: "双重焰莲爆燃", status: p.evolutions.moonLotus ? "owned" : "ready" }] },
        { id: "evolve-frost-zither", type: "超武", name: "霜月琴", desc: "合成：4 重霜弦 + 引露脉冲。霜弦化为琴音，寒音更快充能。", state: (p) => (p.evolutions.frostZither ? "已合成" : p.frostLevel >= 4 && p.abilities.dewPulse ? "可合成" : `${p.frostLevel}/4 霜弦 + ${p.abilities.dewPulse ? "引露已备" : "需引露"}`), owned: (p) => p.evolutions.frostZither, ready: (p) => p.frostLevel >= 4 && p.abilities.dewPulse && !p.evolutions.frostZither, tree: (p) => [{ text: "霜弦 4 重", status: p.frostLevel >= 4 ? "owned" : "locked" }, { text: "引露脉冲", status: p.abilities.dewPulse ? "owned" : "locked" }, { text: "琴音贯穿 + 寒音充能", status: p.evolutions.frostZither ? "owned" : "ready" }, { text: "联动：霜弦裂音/封阵", status: p.branches.frostEcho || p.branches.frostLattice ? "ready" : "locked" }] },
        { id: "evolve-rain-loom", type: "超武", name: "天雨织机", desc: "合成：5 重雨墨针 + 引露脉冲 + 任意针雨分支。针雨织成全局雨线网络。", state: (p) => (p.evolutions.rainLoom ? "已合成" : p.needleLevel >= 5 && p.abilities.dewPulse && (p.branches.needleCurtain || p.branches.needleSeal) ? "可合成" : `${p.needleLevel}/5 雨墨针 + ${p.abilities.dewPulse ? "引露已备" : "需引露"} + ${p.branches.needleCurtain || p.branches.needleSeal ? "分支已备" : "需针雨分支"}`), owned: (p) => p.evolutions.rainLoom, ready: (p) => p.needleLevel >= 5 && p.abilities.dewPulse && (p.branches.needleCurtain || p.branches.needleSeal) && !p.evolutions.rainLoom, tree: (p) => [{ text: "雨墨针 5 重", status: p.needleLevel >= 5 ? "owned" : "locked" }, { text: "引露脉冲", status: p.abilities.dewPulse ? "owned" : "locked" }, { text: "雨墨帘或定雨纹", status: p.branches.needleCurtain || p.branches.needleSeal ? "owned" : "locked" }, { text: "雨线网络 + 雨纹放大", status: p.evolutions.rainLoom ? "owned" : "ready" }] },
        { id: "evolve-jade-fan", type: "超武", name: "清风玉阙", desc: "合成：5 重玉扇风 + 玉扇回廊 + 清辉入定或引露脉冲。双层风墙，回廊风纹更大。", state: (p) => (p.evolutions.jadeFan ? "已合成" : p.fanLevel >= 5 && p.branches.fanGale && (getPickCount("focus") > 0 || p.abilities.dewPulse) ? "可合成" : `${p.fanLevel}/5 玉扇风 + ${p.branches.fanGale ? "回廊已备" : "需回廊"} + ${getPickCount("focus") > 0 || p.abilities.dewPulse ? "站定/引露已备" : "需站定或引露"}`), owned: (p) => p.evolutions.jadeFan, ready: (p) => p.fanLevel >= 5 && p.branches.fanGale && (getPickCount("focus") > 0 || p.abilities.dewPulse) && !p.evolutions.jadeFan, tree: (p) => [{ text: "玉扇风 5 重", status: p.fanLevel >= 5 ? "owned" : "locked" }, { text: "玉扇回廊", status: p.branches.fanGale ? "owned" : "locked" }, { text: "清辉入定或引露脉冲", status: getPickCount("focus") > 0 || p.abilities.dewPulse ? "owned" : "locked" }, { text: "双层风墙 + 回廊放大", status: p.evolutions.jadeFan ? "owned" : "ready" }] },
      ],
    },
  ];

  function fitCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetGame() {
    game.time = 0;
    game.kills = 0;
    game.wave = 1;
    game.spawnTimer = 0;
    game.eliteTimer = 24;
    game.bossSpawned = false;
    game.enemies = [];
    game.projectiles = [];
    game.trails = [];
    game.gems = [];
    game.chests = [];
    game.particles = [];
    game.blooms = [];
    game.beams = [];
    game.choices = [];
    game.chestState = null;
    game.pendingUpgrades = 0;
    game.relicPickups = 0;
    game.abilityPickups = 0;
    game.evolutionPickups = 0;
    game.chestsOpened = 0;
    game.picks = [];
    game.lastVariant = "";
    game.player = {
      x: world.w / 2,
      y: world.h / 2,
      r: 18,
      hp: 100,
      maxHp: 100,
      xp: 0,
      nextXp: 6,
      level: 1,
      speed: 190,
      pickup: 135,
      invuln: 0,
      brushCooldown: 0.62,
      brushTimer: 0.22,
      brushCount: 1,
      orbs: 2,
      orbDamage: 16,
      orbAngle: 0,
      flameLevel: 1,
      flameCooldown: 5.2,
      flameTimer: 3.2,
      frostLevel: 0,
      frostCooldown: 2.9,
      frostTimer: 1.8,
      lanternLevel: 0,
      lanternCooldown: 2.35,
      lanternTimer: 1.2,
      sigilLevel: 0,
      sigilCooldown: 3.75,
      sigilTimer: 2.2,
      jadeLevel: 0,
      jadeCooldown: 3.15,
      jadeTimer: 1.6,
      needleLevel: 0,
      needleCooldown: 2.85,
      needleTimer: 1.35,
      fanLevel: 0,
      fanCooldown: 3.05,
      fanTimer: 1.45,
      umbrellaLevel: 0,
      umbrellaCooldown: 3.25,
      umbrellaTimer: 1.7,
      focusStillness: 0,
      focusLaserTimer: 0.7,
      damageMult: 1,
      mods: {
        brushSpeed: 0,
        brushForce: 0,
        orbOrbit: 0,
        orbTempo: 0,
        flameReach: 0,
        flameTempo: 0,
        frostPierce: 0,
        frostPulse: 0,
        lanternSwarm: 0,
        lanternRadiance: 0,
        sigilLine: 0,
        sigilVeil: 0,
        jadeFork: 0,
        jadeSeal: 0,
        needleShower: 0,
        needleSeal: 0,
        fanWide: 0,
        fanReturn: 0,
        umbrellaGuard: 0,
        umbrellaSpine: 0,
      },
      abilities: {
        inkMark: false,
        dewPulse: false,
        emberWeb: false,
        craneVow: false,
      },
      relics: {
        moonMirror: false,
        dewHourglass: false,
        starChart: false,
        redSeal: false,
        chestResonance: false,
        lacquerKey: false,
        branchInkstone: false,
        chestPrism: false,
        focusLens: false,
        routeCharm: false,
        tempoBell: false,
      },
      evolutions: {
        voidBrush: false,
        starRiver: false,
        moonLotus: false,
        frostZither: false,
        rainLoom: false,
        jadeFan: false,
      },
      branches: {
        brushSplinter: 0,
        brushRain: 0,
        orbRecall: 0,
        orbShatter: 0,
        flameCinder: 0,
        flameTide: 0,
        lanternGleam: 0,
        lanternVein: 0,
        sigilEcho: 0,
        sigilCurtain: 0,
        craneEcho: 0,
        frostEcho: 0,
        frostLattice: 0,
        jadeChain: 0,
        jadeWard: 0,
        needleCurtain: 0,
        needleSeal: 0,
        fanGale: 0,
        fanFeather: 0,
        umbrellaLotus: 0,
        umbrellaEcho: 0,
      },
      dewCharge: 0,
      dewThreshold: 8,
      orbSurge: 0,
      redSealReady: false,
      stillness: 0,
      craneCharges: 0,
      craneTimer: 0,
      lastMoveX: 1,
      lastMoveY: 0,
      characterTraitName: "",
      characterTraitDesc: "",
      characterTraitCounter: 0,
      characterTraitCooldown: 0,
      characterRecentSources: [],
      brushRainCounter: 0,
      characterId: selectedCharacterId,
      characterName: "月墨行者",
      characterRole: "均衡起式",
      characterAccent: palette.teal,
      characterSecondary: palette.gold,
    };
    applyCharacterSetup(game.player);
    for (let i = 0; i < 20; i += 1) spawnEnemy(true);
    updateHud();
  }

  function selectedCharacter() {
    return characters.find((character) => character.id === selectedCharacterId) || characters[0];
  }

  function applyCharacterSetup(p) {
    const character = selectedCharacter();
    p.characterId = character.id;
    p.characterName = character.name;
    p.characterRole = character.role;
    p.characterAccent = character.accent;
    p.characterSecondary = character.secondary;
    character.apply(p);
    p.hp = Math.min(p.maxHp, p.hp);
  }

  function renderCharacterSelect() {
    const current = selectedCharacter();
    ui.startButton.textContent = `以${current.name}开始`;
    ui.characterSelect.innerHTML = characters.map((character) => {
      const selected = character.id === selectedCharacterId;
      return `<button class="character-card" type="button" role="radio" aria-checked="${selected}" data-character-id="${character.id}" data-glyph="${character.icon}" data-selected="${selected}">
        <span class="mini-glyph character-glyph" data-glyph="${character.icon}" aria-hidden="true"></span>
        <strong>${character.name}</strong>
        <em>${character.role}</em>
        <small>${character.desc}</small>
        <span class="character-build">${character.build}</span>
        <span class="character-trait"><b>${character.trait?.name || character.role}</b>${character.trait?.desc || ""}</span>
        <span class="character-stats">${character.stats.map((stat) => `<b>${stat}</b>`).join("")}</span>
      </button>`;
    }).join("");
  }

  function playPageTransition(onCovered) {
    if (transitioning) return Promise.resolve(false);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    transitioning = true;
    if (reducedMotion) {
      onCovered();
      transitioning = false;
      return Promise.resolve(true);
    }

    ui.transition.className = "page-transition visible";
    ui.transition.getBoundingClientRect();
    ui.transition.classList.add("run");

    return new Promise((resolve) => {
      window.setTimeout(onCovered, 310);
      window.setTimeout(() => {
        ui.transition.className = "page-transition";
        transitioning = false;
        resolve(true);
      }, 960);
    });
  }

  function canFreezeRun() {
    return ["playing", "upgrade", "chest"].includes(state);
  }

  function pauseChestRevealTimer() {
    const chestState = game.chestState;
    if (!chestState || chestState.revealed || !chestState.timer) return;
    window.clearTimeout(chestState.timer);
    chestState.timer = null;
    chestState.remaining = Math.max(220, (chestState.revealDueAt || performance.now() + 900) - performance.now());
  }

  function resumeChestRevealTimer() {
    const chestState = game.chestState;
    if (state !== "chest" || !chestState || chestState.revealed || chestState.timer) return;
    const delay = chestState.remaining || 900;
    chestState.revealDueAt = performance.now() + delay;
    chestState.timer = window.setTimeout(() => revealChest(false), delay);
    chestState.remaining = null;
  }

  async function startRun() {
    if (transitioning) return;
    state = "transition";
    const changed = await playPageTransition(() => {
      resetGame();
      state = "playing";
      pauseReturnState = "playing";
      codexReturnState = null;
      ui.start.classList.remove("visible");
      ui.gameOver.classList.remove("visible");
      ui.upgrade.classList.remove("visible");
      ui.chest.classList.remove("visible", "revealed");
      ui.pause.classList.remove("visible");
      draw();
    });
    if (!changed) return;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function pauseRun() {
    if (!canFreezeRun() || transitioning) return false;
    pauseReturnState = state;
    pauseChestRevealTimer();
    state = "paused";
    pointer.active = false;
    pointer.id = null;
    ui.touchStick.querySelector("span").style.transform = "translate(0, 0)";
    ui.pause.classList.add("visible");
    updateHud();
    draw();
    return true;
  }

  function resumeRun() {
    if (state !== "paused" || transitioning) return false;
    ui.pause.classList.remove("visible");
    state = pauseReturnState || "playing";
    resumeChestRevealTimer();
    updateHud();
    if (state === "playing") {
      last = performance.now();
      requestAnimationFrame(loop);
    }
    return true;
  }

  async function returnToMainMenu() {
    if (!["paused", "gameover"].includes(state) || transitioning) return false;
    state = "transition";
    const changed = await playPageTransition(() => {
      state = "menu";
      ui.pause.classList.remove("visible");
      ui.gameOver.classList.remove("visible");
      ui.upgrade.classList.remove("visible");
      ui.chest.classList.remove("visible", "revealed");
      ui.codex.classList.remove("visible");
      pauseReturnState = "playing";
      codexReturnState = null;
      ui.start.classList.add("visible");
      game.chestState = null;
      renderCharacterSelect();
      resetGame();
      draw();
    });
    return changed;
  }

  function showGameOver() {
    state = "gameover";
    playPageTransition(() => {
      ui.gameOverStats.textContent = `${game.player.characterName}坚持 ${formatTime(game.time)}，击破 ${game.kills} 个夜影，抵达等级 ${game.player.level}；能力 ${game.abilityPickups}，遗物 ${game.relicPickups}，超武 ${game.evolutionPickups}，宝箱 ${game.chestsOpened}。`;
      ui.gameOver.classList.add("visible");
    });
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function angleTo(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  function pointLineDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = Math.max(1, dx * dx + dy * dy);
    const t = clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    return Math.hypot(px - x, py - y);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function spawnEnemy(initial = false, elite = false, boss = false) {
    const p = game.player || { x: world.w / 2, y: world.h / 2 };
    let x;
    let y;
    if (initial) {
      x = rand(160, world.w - 160);
      y = rand(160, world.h - 160);
      if (Math.hypot(x - p.x, y - p.y) < 360) x += 460;
    } else {
      const a = rand(0, Math.PI * 2);
      const radius = Math.max(canvas.clientWidth, canvas.clientHeight) * 0.58 + rand(40, 180);
      x = p.x + Math.cos(a) * radius;
      y = p.y + Math.sin(a) * radius;
    }
    x = clamp(x, 40, world.w - 40);
    y = clamp(y, 40, world.h - 40);

    const t = game.time;
    const hpScale = 1 + t / 85 + game.wave * 0.08;
    const typeRoll = Math.random();
    const type = boss ? "boss" : elite ? "elite" : typeRoll > 0.78 ? "swift" : typeRoll > 0.55 ? "bloom" : "shade";
    const stats = {
      shade: { r: 17, hp: 20 * hpScale, speed: 76 + game.wave * 3, dmg: 11, xp: 1, color: palette.softInk },
      swift: { r: 13, hp: 14 * hpScale, speed: 122 + game.wave * 3, dmg: 8, xp: 1, color: palette.coral },
      bloom: { r: 22, hp: 34 * hpScale, speed: 54 + game.wave * 2, dmg: 16, xp: 2, color: palette.moss },
      elite: { r: 29, hp: 145 * hpScale, speed: 72 + game.wave * 2, dmg: 24, xp: 10, color: palette.lilac },
      boss: { r: 48, hp: 620 * hpScale, speed: 56, dmg: 36, xp: 35, color: palette.ink },
    }[type];

    game.enemies.push({
      ...stats,
      x,
      y,
      type,
      maxHp: stats.hp,
      hit: 0,
      slow: 0,
      phase: rand(0, Math.PI * 2),
    });
  }

  function spawnGem(x, y, value) {
    game.gems.push({ x, y, r: 7 + Math.min(value, 6), value, vy: rand(-18, 18), life: 0 });
  }

  function spawnChest(x, y, tier = "common") {
    game.chests.push({
      x,
      y,
      r: tier === "boss" ? 24 : tier === "elite" ? 21 : 18,
      tier,
      rewardCount: rollChestRewardCount(tier),
      phase: rand(0, Math.PI * 2),
      life: 0,
    });
  }

  function rollChestRewardCount(tier) {
    const roll = Math.random();
    if (tier === "boss") return roll < 0.42 ? 5 : 3;
    if (tier === "elite") return roll < 0.12 ? 5 : roll < 0.44 ? 3 : 1;
    return roll < 0.04 ? 5 : roll < 0.18 ? 3 : 1;
  }

  function spawnParticles(x, y, color, count = 9) {
    for (let i = 0; i < count; i += 1) {
      const a = rand(0, Math.PI * 2);
      const s = rand(24, 150);
      game.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        r: rand(1.5, 4.5),
        life: rand(0.32, 0.78),
        maxLife: 0.78,
        color,
      });
    }
  }

  function addTrail(x, y, color, radius, life = 0.28, kind = "round") {
    game.trails.push({ x, y, color, radius, life, maxLife: life, kind, angle: rand(0, Math.PI * 2) });
  }

  function makeProjectile(x, y, angle, spread = 0) {
    const a = angle + spread;
    const starChartBonus = game.player.relics.starChart ? 1 + game.player.orbs * 0.055 : 1;
    const evolved = game.player.evolutions.voidBrush;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(a) * (evolved ? 610 : 520),
      vy: Math.sin(a) * (evolved ? 610 : 520),
      r: evolved ? 11 : 8,
      damage: ((evolved ? 26 : 18) + game.player.mods.brushForce * 4) * game.player.damageMult * starChartBonus,
      life: evolved ? 1.38 : 1.15,
      pierce: (evolved ? 5 : 1) + Math.floor(game.player.mods.brushForce / 2),
      angle: a,
      source: evolved ? "voidBrush" : "brush",
      color: evolved ? palette.ink : palette.teal,
      trailTimer: 0,
      width: evolved ? 38 : 28,
    });
  }

  function makeMoonShard(x, y, angle) {
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * 420,
      vy: Math.sin(angle) * 420,
      r: 6,
      damage: 10 * game.player.damageMult,
      life: 0.8,
      pierce: 0,
      angle,
      source: "mirror",
      color: palette.lilac,
      trailTimer: 0,
      width: 22,
    });
  }

  function makeStarShard(x, y, angle, strength = 1) {
    const p = game.player;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * 465,
      vy: Math.sin(angle) * 465,
      r: 5 + Math.min(2, strength),
      damage: (7 + p.branches.orbShatter * 3 + (p.evolutions.starRiver ? 4 : 0)) * p.damageMult,
      life: 0.62 + p.branches.orbShatter * 0.04,
      pierce: p.evolutions.starRiver ? 1 : 0,
      angle,
      source: "starShard",
      color: p.evolutions.starRiver ? palette.lilac : palette.gold,
      trailTimer: 0,
      width: 18 + p.branches.orbShatter * 3,
    });
  }

  function makeInkSplinter(x, y, angle, strength = 1) {
    const p = game.player;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * 430,
      vy: Math.sin(angle) * 430,
      r: 5 + Math.min(2, strength),
      damage: (6 + p.branches.brushSplinter * 3 + strength) * p.damageMult,
      life: 0.52 + p.branches.brushSplinter * 0.04,
      pierce: p.evolutions.voidBrush ? 1 : 0,
      angle,
      source: "inkSplinter",
      color: p.evolutions.voidBrush ? palette.ink : palette.teal,
      trailTimer: 0,
      width: 17 + p.branches.brushSplinter * 2,
    });
  }

  function makeCraneBlade(x, y, angle, charge = 1) {
    const p = game.player;
    const evolvedBonus = p.evolutions.voidBrush ? 1.24 : 1;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * (560 + charge * 32),
      vy: Math.sin(angle) * (560 + charge * 32),
      r: 9 + charge,
      damage: (14 + charge * 5) * p.damageMult * evolvedBonus,
      life: 0.84 + charge * 0.06,
      pierce: 1 + charge + (p.evolutions.voidBrush ? 2 : 0),
      angle,
      source: "crane",
      color: palette.white,
      trailTimer: 0,
      width: 30 + charge * 5,
      charge,
    });
  }

  function makeCraneFeather(x, y, angle, charge = 1) {
    const p = game.player;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * 460,
      vy: Math.sin(angle) * 460,
      r: 6 + Math.min(3, charge),
      damage: (8 + p.branches.craneEcho * 3 + charge * 2) * p.damageMult,
      life: 0.54 + p.branches.craneEcho * 0.05,
      pierce: p.evolutions.voidBrush ? 1 : 0,
      angle,
      source: "craneFeather",
      color: palette.white,
      trailTimer: 0,
      width: 18 + p.branches.craneEcho * 3,
      charge,
    });
  }

  function makeFrostString(x, y, angle, strength = 1, echo = false) {
    const p = game.player;
    const zither = p.evolutions.frostZither && !echo;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * (zither ? 650 : echo ? 500 : 575),
      vy: Math.sin(angle) * (zither ? 650 : echo ? 500 : 575),
      r: zither ? 10 : echo ? 6 : 8,
      damage: (echo ? 8 + p.branches.frostEcho * 3 + (p.evolutions.frostZither ? 3 : 0) : (zither ? 20 : 13) + p.frostLevel * 4 + p.mods.frostPierce * 2) * p.damageMult,
      life: zither ? 1.08 + p.frostLevel * 0.05 : echo ? 0.58 : 0.82 + p.frostLevel * 0.04,
      pierce: echo ? (p.evolutions.frostZither ? 1 : 0) : (zither ? 4 : 1 + Math.floor(p.frostLevel / 2) + Math.floor(p.mods.frostPierce / 2)),
      angle,
      source: echo ? "frostEcho" : zither ? "frostZither" : "frostString",
      color: palette.lilac,
      trailTimer: 0,
      width: zither ? 52 + p.frostLevel * 3 + p.mods.frostPierce * 4 : echo ? 20 + p.branches.frostEcho * 2 : 34 + p.frostLevel * 3 + p.mods.frostPierce * 4,
      strength,
    });
  }

  function makeLanternWisp(x, y, angle, strength = 1) {
    const p = game.player;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * (360 + p.lanternLevel * 18),
      vy: Math.sin(angle) * (360 + p.lanternLevel * 18),
      r: 7 + Math.min(3, strength),
      damage: (10 + p.lanternLevel * 4 + p.branches.lanternGleam * 2 + p.mods.lanternRadiance * 4) * p.damageMult,
      life: 1.05 + p.lanternLevel * 0.04,
      pierce: p.branches.lanternGleam ? 1 : 0,
      angle,
      source: "lantern",
      color: palette.moss,
      trailTimer: 0,
      width: 22 + p.lanternLevel * 3,
      strength,
    });
  }

  function makeSigilGlyph(x, y, angle, strength = 1) {
    const p = game.player;
    const line = p.mods.sigilLine || 0;
    const veil = p.mods.sigilVeil || 0;
    game.projectiles.push({
      x,
      y,
      vx: Math.cos(angle) * (390 + p.sigilLevel * 18 + line * 26),
      vy: Math.sin(angle) * (390 + p.sigilLevel * 18 + line * 26),
      r: 10 + Math.min(4, p.sigilLevel),
      damage: (24 + p.sigilLevel * 7 + line * 5 + veil * 2) * p.damageMult,
      life: 1.0 + p.sigilLevel * 0.06 + line * 0.04,
      pierce: 1 + Math.floor(p.sigilLevel / 3) + Math.floor(line / 2),
      angle,
      source: "sigil",
      color: palette.ink,
      trailTimer: 0,
      width: 34 + p.sigilLevel * 4 + line * 3,
      strength,
    });
  }

  function triggerJadeStrike(power = 1) {
    const p = game.player;
    if (!p?.jadeLevel) return false;
    const targets = [...game.enemies]
      .sort((a, b) => dist(p, a) - dist(p, b))
      .slice(0, Math.min(game.enemies.length, 1 + Math.floor(p.jadeLevel / 2) + p.mods.jadeFork));
    if (!targets.length) return false;
    const damage = (18 + p.jadeLevel * 6 + p.mods.jadeSeal * 7 + power * 1.5) * p.damageMult;
    const radius = 32 + p.jadeLevel * 4 + p.mods.jadeSeal * 5;
    for (const target of targets) {
      const top = { x: target.x + rand(-18, 18), y: target.y - 120 - rand(0, 28) };
      game.beams.push({
        x1: top.x,
        y1: top.y,
        x2: target.x,
        y2: target.y,
        life: 0.24,
        maxLife: 0.24,
        width: 10 + p.jadeLevel * 2 + p.mods.jadeSeal * 2,
        color: palette.moss,
      });
      game.blooms.push({ x: target.x, y: target.y, r: 5, max: radius, life: 0.36, color: palette.moss, kind: "jade" });
      addTrail(target.x, target.y, palette.gold, radius * 0.28, 0.32, "diamond");
      target.slow = Math.max(target.slow || 0, 0.45 + p.mods.jadeSeal * 0.18);
      dealDamage(target, damage, 8, top, "jade");
      if (p.branches.jadeWard) {
        const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
        const lensBonus = p.relics.focusLens ? 1 : 0;
        const wardRadius = 48 + p.branches.jadeWard * 20 + p.mods.jadeSeal * 5 + stillBonus * 24 + lensBonus * 16;
        const wardDamage = damage * (0.28 + p.branches.jadeWard * 0.13 + stillBonus * 0.12 + lensBonus * 0.08);
        game.blooms.push({ x: target.x, y: target.y, r: 8, max: wardRadius, life: 0.46 + lensBonus * 0.08, color: lensBonus ? palette.white : palette.moss, kind: "jadeWard" });
        for (let i = 0; i < 4; i += 1) {
          const a = Math.PI / 4 + (i * Math.PI) / 2 + game.time * 0.08;
          const side = wardRadius * 0.62;
          const px = Math.cos(a) * side;
          const py = Math.sin(a) * side;
          const qx = Math.cos(a + Math.PI / 2) * side;
          const qy = Math.sin(a + Math.PI / 2) * side;
          game.beams.push({
            x1: target.x + px,
            y1: target.y + py,
            x2: target.x + qx,
            y2: target.y + qy,
            life: 0.24,
            maxLife: 0.24,
            width: 5 + p.branches.jadeWard * 2 + stillBonus * 2,
            color: lensBonus ? palette.white : palette.moss,
          });
        }
        addTrail(target.x, target.y, lensBonus ? palette.white : palette.moss, wardRadius * 0.28, 0.38, "jadeWard");
        for (const enemy of [...game.enemies]) {
          if (enemy.hp > 0 && Math.hypot(enemy.x - target.x, enemy.y - target.y) < wardRadius + enemy.r) {
            enemy.slow = Math.max(enemy.slow || 0, 0.85 + p.branches.jadeWard * 0.16 + stillBonus * 0.24);
            dealDamage(enemy, wardDamage, 7 + p.branches.jadeWard * 2, target, "jade");
          }
        }
        triggerBranchInkstone("jade", target.x, target.y, power + p.branches.jadeWard + stillBonus + lensBonus);
      }
      if (p.branches.jadeChain) {
        const arcs = [...game.enemies]
          .filter((enemy) => enemy !== target && enemy.hp > 0 && Math.hypot(enemy.x - target.x, enemy.y - target.y) < 210 + p.branches.jadeChain * 32)
          .slice(0, 1 + p.branches.jadeChain);
        for (const enemy of arcs) {
          game.beams.push({
            x1: target.x,
            y1: target.y,
            x2: enemy.x,
            y2: enemy.y,
            life: 0.2,
            maxLife: 0.2,
            width: 7 + p.branches.jadeChain * 2,
            color: palette.gold,
          });
          game.blooms.push({ x: enemy.x, y: enemy.y, r: 4, max: radius * 0.82, life: 0.3, color: palette.gold, kind: "jadeChain" });
          enemy.slow = Math.max(enemy.slow || 0, 0.32 + p.branches.jadeChain * 0.1);
          dealDamage(enemy, damage * (0.36 + p.branches.jadeChain * 0.08), 5, target, "jade");
        }
        if (arcs.length) {
          addTrail(target.x, target.y, palette.gold, radius * 0.18, 0.26, "diamond");
          triggerBranchInkstone("jade", target.x, target.y, power + arcs.length);
        }
      }
    }
    spawnParticles(p.x, p.y, palette.moss, 5 + targets.length * 4);
    shake = Math.max(shake, 1.8 + targets.length * 0.6 + p.branches.jadeChain * 0.7 + p.branches.jadeWard * 0.9);
    triggerTempoBell("jade", targets[0].x, targets[0].y, power + targets.length);
    return true;
  }

  function triggerNeedleRain(power = 1) {
    const p = game.player;
    if (!p?.needleLevel) return false;
    const curtain = p.branches.needleCurtain || 0;
    const seal = p.branches.needleSeal || 0;
    const loom = p.evolutions.rainLoom ? 1 : 0;
    const count = Math.min(14, 1 + Math.floor(p.needleLevel / 2) + p.mods.needleShower + curtain + loom * 3 + (p.focusStillness > 0.55 ? 1 : 0));
    const targets = [...game.enemies]
      .filter((enemy) => enemy.hp > 0)
      .sort((a, b) => dist(p, a) - dist(p, b))
      .slice(0, Math.min(count, game.enemies.length));
    if (!targets.length) return false;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const baseDamage = (13 + p.needleLevel * 5 + p.mods.needleSeal * 4 + curtain * 2 + seal * 3 + loom * 8 + power * 1.1 + stillBonus * 4) * p.damageMult;
    const radius = 24 + p.needleLevel * 5 + p.mods.needleSeal * 6 + curtain * 4 + loom * 16 + stillBonus * 8;
    for (const target of targets) {
      const slowedBonus = target.slow > 0 ? 1.35 + p.mods.needleSeal * 0.12 + loom * 0.18 : 1;
      const top = { x: target.x + rand(-16, 16), y: target.y - 150 - rand(0, 40) };
      game.beams.push({
        x1: top.x,
        y1: top.y,
        x2: target.x,
        y2: target.y,
        life: 0.2,
        maxLife: 0.2,
        width: 5 + p.needleLevel + p.mods.needleSeal + loom * 2,
        color: loom ? palette.white : palette.teal,
      });
      game.blooms.push({ x: target.x, y: target.y, r: 4, max: radius, life: 0.34 + loom * 0.1, color: loom ? palette.white : palette.teal, kind: loom ? "needleLoom" : "needle" });
      addTrail(target.x, target.y, loom ? palette.white : palette.teal, radius * 0.34, 0.32 + loom * 0.08, loom ? "needleLoom" : "needle");
      target.slow = Math.max(target.slow || 0, 0.24 + p.mods.needleSeal * 0.08);
      dealDamage(target, baseDamage * slowedBonus, 6, top, "needle");
      if (curtain || loom) {
        const curtainLines = Math.min(7, 2 + curtain + loom * 2);
        for (let i = 0; i < curtainLines; i += 1) {
          const offset = (i - (curtainLines - 1) / 2) * (9 + curtain * 2);
          game.beams.push({
            x1: target.x + offset,
            y1: target.y - 118 - i * 7,
            x2: target.x + offset * 0.42,
            y2: target.y + 18,
            life: 0.16 + curtain * 0.02,
            maxLife: 0.16 + curtain * 0.02,
            width: 2.8 + curtain + loom,
            color: loom ? palette.gold : palette.white,
          });
        }
        game.blooms.push({ x: target.x, y: target.y, r: 4, max: radius * 1.2, life: 0.3 + loom * 0.08, color: loom ? palette.gold : palette.white, kind: "needleCurtain" });
        addTrail(target.x, target.y, loom ? palette.gold : palette.white, radius * 0.42, 0.3 + loom * 0.06, "needleCurtain");
        dealDamage(target, baseDamage * (0.2 + curtain * 0.08 + loom * 0.08), 5, top, "needle");
      }
      if ((seal || loom) && (target.slow > 0 || p.focusStillness > 0.55 || loom)) {
        const sealRadius = 42 + seal * 16 + p.mods.needleSeal * 5 + loom * 22 + stillBonus * 14;
        const sealDamage = baseDamage * (0.34 + seal * 0.12 + loom * 0.12 + stillBonus * 0.08);
        game.blooms.push({ x: target.x, y: target.y, r: 8, max: sealRadius, life: 0.42, color: palette.teal, kind: "needleSeal" });
        addTrail(target.x, target.y, palette.teal, sealRadius * 0.32, 0.42, "needleSeal");
        for (const enemy of [...game.enemies]) {
          if (enemy.hp > 0 && dist(target, enemy) < sealRadius + enemy.r) {
            enemy.slow = Math.max(enemy.slow || 0, 0.52 + seal * 0.12);
            dealDamage(enemy, sealDamage, 7 + seal, target, "needle");
          }
        }
        addDewCharge(0.18 + seal * 0.12);
      }
    }
    if ((curtain || loom) && targets.length > 1) {
      for (let i = 1; i < targets.length; i += 1) {
        game.beams.push({
          x1: targets[i - 1].x,
          y1: targets[i - 1].y,
          x2: targets[i].x,
          y2: targets[i].y,
          life: 0.18 + loom * 0.06,
          maxLife: 0.18 + loom * 0.06,
          width: 2.4 + curtain + loom * 2,
          color: loom ? palette.white : palette.teal,
        });
      }
      if (loom) {
        const center = targets.reduce((acc, target) => ({ x: acc.x + target.x / targets.length, y: acc.y + target.y / targets.length }), { x: 0, y: 0 });
        game.blooms.push({ x: center.x, y: center.y, r: 12, max: 96 + targets.length * 10, life: 0.58, color: palette.white, kind: "needleLoom" });
        addTrail(center.x, center.y, palette.white, 42 + targets.length * 4, 0.48, "needleLoom");
      }
      triggerBranchInkstone("needle", targets[0].x, targets[0].y, power + curtain);
    }
    addDewCharge(0.2 + p.needleLevel * 0.08 + p.mods.needleShower * 0.05 + seal * 0.05 + loom * 0.35);
    spawnParticles(p.x, p.y, loom ? palette.white : palette.teal, 5 + targets.length * (loom ? 4 : 2));
    shake = Math.max(shake, 1.4 + targets.length * 0.34 + stillBonus * 0.9 + curtain * 0.35 + seal * 0.45 + loom * 2.4);
    triggerTempoBell("needle", targets[0].x, targets[0].y, power + targets.length);
    return true;
  }

  function triggerFanGust(angle = 0, power = 1) {
    const p = game.player;
    if (!p?.fanLevel) return false;
    const wide = p.mods.fanWide || 0;
    const returning = p.mods.fanReturn || 0;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const evolved = p.evolutions.jadeFan ? 1 : 0;
    const arc = 0.72 + wide * 0.13 + stillBonus * 0.08 + evolved * 0.16;
    const range = 150 + p.fanLevel * 22 + wide * 22 + Math.min(32, power * 5) + evolved * 52;
    const damage = (16 + p.fanLevel * 5 + returning * 4 + stillBonus * 4 + evolved * 12) * p.damageMult;
    const passes = evolved ? Math.max(2, returning ? 3 : 2) : returning ? 2 : 1;
    const origin = { x: p.x, y: p.y };
    if (evolved) {
      game.blooms.push({ x: origin.x, y: origin.y, r: 18, max: 98 + wide * 10, life: 0.5, color: palette.white, kind: "jadeFanCore" });
      addTrail(origin.x, origin.y, palette.gold, 36 + wide * 6, 0.44, "jadeFan");
    }
    for (let pass = 0; pass < passes; pass += 1) {
      const dir = angle + (pass ? Math.PI + 0.18 * Math.sin(game.time + pass) : 0) + (evolved && pass === 2 ? 0.34 : 0);
      const color = evolved ? [palette.white, palette.gold, palette.moss][pass % 3] : pass ? palette.lilac : palette.moss;
      const delay = pass ? 0.12 : 0;
      const emit = () => {
        const center = {
          x: origin.x + Math.cos(dir) * range * 0.48,
          y: origin.y + Math.sin(dir) * range * 0.48,
        };
        game.blooms.push({ x: center.x, y: center.y, r: 10, max: 56 + wide * 12 + stillBonus * 12 + evolved * 28, life: 0.34 + evolved * 0.08, color, kind: evolved ? "jadeFan" : pass ? "fanReturn" : "fan" });
        const bladeCount = evolved ? 7 : 5;
        for (let i = 0; i < bladeCount; i += 1) {
          const a = dir + (i - (bladeCount - 1) / 2) * arc * (evolved ? 0.18 : 0.25);
          game.beams.push({
            x1: origin.x + Math.cos(a) * 18,
            y1: origin.y + Math.sin(a) * 18,
            x2: origin.x + Math.cos(a) * range,
            y2: origin.y + Math.sin(a) * range,
            life: 0.22 + wide * 0.015 + evolved * 0.06,
            maxLife: 0.22 + wide * 0.015 + evolved * 0.06,
            width: 7 + p.fanLevel + wide + evolved * 2,
            color,
          });
        }
        addTrail(center.x, center.y, color, 24 + wide * 6 + returning * 4 + evolved * 8, 0.36 + evolved * 0.08, evolved ? "jadeFan" : "fan");
        spawnParticles(center.x, center.y, color, 7 + p.fanLevel * 2 + wide * 2 + evolved * 8);
        for (const enemy of [...game.enemies]) {
          const dx = enemy.x - origin.x;
          const dy = enemy.y - origin.y;
          const d = Math.hypot(dx, dy);
          const diff = Math.abs(Math.atan2(Math.sin(Math.atan2(dy, dx) - dir), Math.cos(Math.atan2(dy, dx) - dir)));
          if (d < range + enemy.r && diff < arc + enemy.r / Math.max(60, d)) {
            enemy.slow = Math.max(enemy.slow || 0, 0.34 + wide * 0.1 + returning * 0.08 + evolved * 0.2);
            dealDamage(enemy, damage * (pass ? 0.72 + returning * 0.05 + evolved * 0.08 : 1), 6 + wide * 2 + evolved * 3, origin, "fan");
          }
        }
        if (p.branches.fanGale) {
          triggerFanGale(center.x, center.y, dir, power + pass + wide);
        }
        if (p.branches.fanFeather) {
          triggerFanFeathers(center.x, center.y, dir, power + pass + wide + returning);
        }
      };
      if (delay) window.setTimeout(() => state === "playing" && emit(), delay * 1000);
      else emit();
    }
    if (returning) addDewCharge(0.18 + returning * 0.08);
    if (evolved) addDewCharge(0.32 + returning * 0.1 + stillBonus * 0.12);
    shake = Math.max(shake, 1.8 + wide * 0.5 + returning * 0.9 + stillBonus * 0.8 + evolved * 2.1);
    triggerTempoBell("fan", origin.x + Math.cos(angle) * range * 0.32, origin.y + Math.sin(angle) * range * 0.32, power + wide + returning + evolved);
    return true;
  }

  function triggerFanGale(x, y, angle = 0, power = 1) {
    const p = game.player;
    if (!p?.branches.fanGale) return false;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const returnBonus = p.mods.fanReturn ? 1 : 0;
    const evolved = p.evolutions.jadeFan ? 1 : 0;
    const radius = 54 + p.branches.fanGale * 18 + p.mods.fanWide * 10 + stillBonus * 14 + returnBonus * 10 + Math.min(24, power * 3) + evolved * 34;
    const damage = (10 + p.branches.fanGale * 5 + returnBonus * 3 + stillBonus * 4 + evolved * 8) * p.damageMult;
    game.blooms.push({ x, y, r: 8, max: radius, life: 0.44 + evolved * 0.12, color: evolved ? palette.white : palette.gold, kind: evolved ? "jadeFanGale" : "fanGale" });
    const lineCount = evolved ? 6 : 4;
    for (let i = 0; i < lineCount; i += 1) {
      const a = angle + (i - (lineCount - 1) / 2) * (evolved ? 0.26 : 0.34);
      game.beams.push({
        x1: x - Math.cos(a) * radius * 0.18,
        y1: y - Math.sin(a) * radius * 0.18,
        x2: x + Math.cos(a) * radius * 0.82,
        y2: y + Math.sin(a) * radius * 0.82,
        life: 0.2 + p.branches.fanGale * 0.015 + evolved * 0.06,
        maxLife: 0.2 + p.branches.fanGale * 0.015 + evolved * 0.06,
        width: 5 + p.branches.fanGale + stillBonus * 2 + evolved * 2,
        color: evolved ? (i % 2 ? palette.gold : palette.white) : i % 2 ? palette.moss : palette.gold,
      });
    }
    addTrail(x, y, evolved ? palette.white : palette.gold, radius * 0.28, 0.42 + evolved * 0.08, evolved ? "jadeFan" : "fan");
    spawnParticles(x, y, evolved ? palette.white : palette.gold, 8 + p.branches.fanGale * 4 + evolved * 8);
    addDewCharge(0.24 + p.branches.fanGale * 0.12 + returnBonus * 0.1 + evolved * 0.24);
    triggerBranchInkstone("fan", x, y, power + p.branches.fanGale);
    for (const enemy of [...game.enemies]) {
      if (Math.hypot(enemy.x - x, enemy.y - y) < radius + enemy.r) {
        enemy.slow = Math.max(enemy.slow || 0, 0.5 + p.branches.fanGale * 0.1);
        dealDamage(enemy, damage, 6 + p.branches.fanGale * 2, { x, y }, "fan");
      }
    }
    shake = Math.max(shake, 2.2 + p.branches.fanGale * 0.5 + stillBonus * 1.2 + evolved * 1.8);
    return true;
  }

  function triggerFanFeathers(x, y, angle = 0, power = 1) {
    const p = game.player;
    if (!p?.branches.fanFeather) return false;
    const evolved = p.evolutions.jadeFan ? 1 : 0;
    const returnBonus = p.mods.fanReturn ? 1 : 0;
    const wideBonus = p.mods.fanWide || 0;
    const count = Math.min(10, 2 + p.branches.fanFeather + wideBonus + evolved * 2);
    const range = 170 + p.fanLevel * 18 + Math.min(38, power * 5) + evolved * 35;
    const damage = (9 + p.branches.fanFeather * 4 + p.fanLevel * 2 + returnBonus * 2 + evolved * 5) * p.damageMult;
    const targets = [...game.enemies]
      .filter((enemy) => enemy.hp > 0)
      .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    for (let i = 0; i < count; i += 1) {
      const spread = (i - (count - 1) / 2) * 0.18;
      const target = targets[i % Math.max(1, targets.length)];
      const targetAngle = target ? Math.atan2(target.y - y, target.x - x) : angle;
      const dir = targetAngle * 0.65 + (angle + spread) * 0.35;
      const end = {
        x: x + Math.cos(dir) * range,
        y: y + Math.sin(dir) * range,
      };
      const color = evolved ? (i % 2 ? palette.white : palette.gold) : i % 2 ? palette.white : palette.moss;
      game.beams.push({
        x1: x,
        y1: y,
        x2: end.x,
        y2: end.y,
        life: 0.18 + evolved * 0.04,
        maxLife: 0.18 + evolved * 0.04,
        width: 4 + p.branches.fanFeather + evolved,
        color,
      });
      game.blooms.push({ x: end.x, y: end.y, r: 4, max: 20 + p.branches.fanFeather * 5 + evolved * 8, life: 0.28, color, kind: evolved ? "jadeFanFeather" : "fanFeather" });
      addTrail(end.x, end.y, color, 10 + p.branches.fanFeather * 2 + evolved * 3, 0.24 + evolved * 0.04, "fanFeather");
      for (const enemy of [...game.enemies]) {
        const lineDist = pointLineDistance(enemy.x, enemy.y, x, y, end.x, end.y);
        const along = ((enemy.x - x) * (end.x - x) + (enemy.y - y) * (end.y - y)) / Math.max(1, range * range);
        if (along >= -0.05 && along <= 1.05 && lineDist < enemy.r + 7 + p.branches.fanFeather) {
          enemy.slow = Math.max(enemy.slow || 0, 0.2 + p.branches.fanFeather * 0.08);
          dealDamage(enemy, damage, 5 + p.branches.fanFeather, { x, y }, "fan");
        }
      }
    }
    if (returnBonus) {
      window.setTimeout(() => {
        if (state !== "playing") return;
        game.blooms.push({ x, y, r: 8, max: 42 + p.branches.fanFeather * 8, life: 0.3, color: palette.lilac, kind: "fanFeather" });
        addDewCharge(0.16 + p.branches.fanFeather * 0.07);
      }, 110);
    }
    addDewCharge(0.18 + p.branches.fanFeather * 0.08 + evolved * 0.15);
    triggerBranchInkstone("fan", x, y, power + p.branches.fanFeather);
    shake = Math.max(shake, 1.6 + p.branches.fanFeather * 0.35 + evolved * 1.1);
    return true;
  }

  function triggerUmbrellaBloom(power = 1) {
    const p = game.player;
    if (!p?.umbrellaLevel) return false;
    const guard = p.mods.umbrellaGuard || 0;
    const spine = p.mods.umbrellaSpine || 0;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const radius = 84 + p.umbrellaLevel * 16 + guard * 18 + stillBonus * 16 + Math.min(24, power * 3);
    const damage = (20 + p.umbrellaLevel * 6 + guard * 3 + spine * 4 + stillBonus * 5) * p.damageMult;
    const color = guard > spine ? palette.teal : spine ? palette.ink : palette.lilac;
    game.blooms.push({ x: p.x, y: p.y, r: 12, max: radius, life: 0.48 + guard * 0.04, color, kind: "umbrella" });
    addTrail(p.x, p.y, color, radius * 0.24, 0.4 + guard * 0.03, "umbrella");
    spawnParticles(p.x, p.y, color, 12 + p.umbrellaLevel * 3 + spine * 3);
    p.invuln = Math.max(p.invuln, 0.14 + guard * 0.045 + stillBonus * 0.06);
    const ribCount = Math.min(14, 6 + p.umbrellaLevel + spine * 2);
    for (let i = 0; i < ribCount; i += 1) {
      const a = (i / ribCount) * Math.PI * 2 + game.time * 0.24;
      const reach = radius * (spine ? 1.32 : 0.96);
      game.beams.push({
        x1: p.x + Math.cos(a) * radius * 0.18,
        y1: p.y + Math.sin(a) * radius * 0.18,
        x2: p.x + Math.cos(a) * reach,
        y2: p.y + Math.sin(a) * reach,
        life: 0.22 + spine * 0.02,
        maxLife: 0.22 + spine * 0.02,
        width: 4 + guard + Math.min(3, spine),
        color: i % 2 ? color : palette.white,
      });
    }
    for (const enemy of [...game.enemies]) {
      const d = Math.hypot(enemy.x - p.x, enemy.y - p.y);
      if (d < radius + enemy.r) {
        enemy.slow = Math.max(enemy.slow || 0, 0.32 + guard * 0.09);
        dealDamage(enemy, damage, 8 + guard, p, "umbrella");
      } else if (spine && d < radius * 1.38 + enemy.r) {
        const a = angleTo(p, enemy);
        const end = { x: p.x + Math.cos(a) * radius * 1.34, y: p.y + Math.sin(a) * radius * 1.34 };
        game.beams.push({ x1: p.x, y1: p.y, x2: end.x, y2: end.y, life: 0.16, maxLife: 0.16, width: 3 + spine, color: palette.ink });
        enemy.slow = Math.max(enemy.slow || 0, 0.18 + spine * 0.05);
        dealDamage(enemy, damage * (0.46 + spine * 0.06), 5 + spine, p, "umbrella");
      }
    }
    addDewCharge(0.12 + p.umbrellaLevel * 0.04 + guard * 0.05 + spine * 0.04);
    if (p.branches.umbrellaLotus) {
      triggerUmbrellaLotus(p.x, p.y, power + guard + spine);
    }
    if (p.branches.umbrellaEcho) {
      triggerUmbrellaEcho(p.x, p.y, power + guard + spine);
    }
    triggerTempoBell("umbrella", p.x, p.y, power + guard + spine);
    shake = Math.max(shake, 2.2 + p.umbrellaLevel * 0.28 + spine * 0.45 + stillBonus * 0.8);
    return true;
  }

  function triggerUmbrellaLotus(x = game.player.x, y = game.player.y, power = 1) {
    const p = game.player;
    if (!p?.branches.umbrellaLotus) return false;
    const guard = p.mods.umbrellaGuard || 0;
    const spine = p.mods.umbrellaSpine || 0;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const radius = 58 + p.branches.umbrellaLotus * 20 + guard * 12 + stillBonus * 16 + Math.min(28, power * 3);
    const damage = (12 + p.branches.umbrellaLotus * 6 + guard * 2 + spine * 3 + stillBonus * 4) * p.damageMult;
    game.blooms.push({ x, y, r: 8, max: radius, life: 0.46 + p.branches.umbrellaLotus * 0.04, color: palette.teal, kind: "umbrellaLotus" });
    addTrail(x, y, palette.teal, radius * 0.24, 0.42, "umbrellaLotus");
    const petalCount = Math.min(12, 5 + p.branches.umbrellaLotus * 2 + spine);
    for (let i = 0; i < petalCount; i += 1) {
      const a = (i / petalCount) * Math.PI * 2 + game.time * 0.18;
      const inner = radius * 0.24;
      const outer = radius * (0.76 + spine * 0.05);
      game.beams.push({
        x1: x + Math.cos(a) * inner,
        y1: y + Math.sin(a) * inner,
        x2: x + Math.cos(a) * outer,
        y2: y + Math.sin(a) * outer,
        life: 0.2 + p.branches.umbrellaLotus * 0.02,
        maxLife: 0.2 + p.branches.umbrellaLotus * 0.02,
        width: 3 + p.branches.umbrellaLotus + Math.min(2, guard),
        color: i % 2 ? palette.teal : palette.white,
      });
    }
    for (const enemy of [...game.enemies]) {
      const d = Math.hypot(enemy.x - x, enemy.y - y);
      if (d < radius + enemy.r) {
        enemy.slow = Math.max(enemy.slow || 0, 0.38 + p.branches.umbrellaLotus * 0.08 + guard * 0.04);
        dealDamage(enemy, damage * (d < radius * 0.52 ? 1.18 : 1), 7 + p.branches.umbrellaLotus, { x, y }, "umbrella");
      }
    }
    if (guard) {
      p.invuln = Math.max(p.invuln, 0.08 + guard * 0.035);
    }
    addDewCharge(0.16 + p.branches.umbrellaLotus * 0.08 + guard * 0.04);
    triggerBranchInkstone("umbrella", x, y, power + p.branches.umbrellaLotus);
    shake = Math.max(shake, 1.8 + p.branches.umbrellaLotus * 0.45 + stillBonus * 0.8);
    return true;
  }

  function triggerUmbrellaEcho(x = game.player.x, y = game.player.y, power = 1) {
    const p = game.player;
    if (!p?.branches.umbrellaEcho) return false;
    const guard = p.mods.umbrellaGuard || 0;
    const spine = p.mods.umbrellaSpine || 0;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const radius = 86 + p.branches.umbrellaEcho * 18 + spine * 12 + stillBonus * 12;
    const damage = (18 + p.branches.umbrellaEcho * 7 + spine * 5 + guard * 2 + stillBonus * 5) * p.damageMult;
    const targets = [...game.enemies]
      .map((enemy) => ({ enemy, d: Math.hypot(enemy.x - x, enemy.y - y) }))
      .filter((item) => item.d < 330 + p.branches.umbrellaEcho * 38)
      .sort((a, b) => b.d - a.d)
      .slice(0, Math.min(7, 2 + p.branches.umbrellaEcho + spine + stillBonus));
    game.blooms.push({ x, y, r: 10, max: radius, life: 0.34 + p.branches.umbrellaEcho * 0.035, color: palette.lilac, kind: "umbrellaEcho" });
    addTrail(x, y, palette.lilac, radius * 0.28, 0.38, "umbrellaEcho");
    const spokes = Math.max(4, targets.length || 4);
    for (let i = 0; i < spokes; i += 1) {
      const a = targets[i]?.enemy ? angleTo({ x, y }, targets[i].enemy) : (i / spokes) * Math.PI * 2 + game.time;
      const rim = { x: x + Math.cos(a) * radius * 0.38, y: y + Math.sin(a) * radius * 0.38 };
      const far = targets[i]?.enemy || { x: x + Math.cos(a) * radius, y: y + Math.sin(a) * radius };
      game.beams.push({ x1: rim.x, y1: rim.y, x2: far.x, y2: far.y, life: 0.18, maxLife: 0.18, width: 3.4 + p.branches.umbrellaEcho, color: i % 2 ? palette.lilac : palette.white });
      game.beams.push({ x1: far.x, y1: far.y, x2: x + Math.cos(a + Math.PI) * radius * 0.18, y2: y + Math.sin(a + Math.PI) * radius * 0.18, life: 0.12, maxLife: 0.12, width: 2.2 + Math.min(3, spine), color: palette.teal });
    }
    for (const { enemy, d } of targets) {
      enemy.slow = Math.max(enemy.slow || 0, 0.26 + p.branches.umbrellaEcho * 0.06 + spine * 0.04);
      dealDamage(enemy, damage * (d > radius ? 1.18 : 1), 8 + p.branches.umbrellaEcho + spine, { x, y }, "umbrella");
    }
    if (guard) {
      p.invuln = Math.max(p.invuln, 0.05 + guard * 0.025);
    }
    addDewCharge(0.12 + p.branches.umbrellaEcho * 0.08 + spine * 0.05);
    triggerBranchInkstone("umbrella", x, y, power + p.branches.umbrellaEcho);
    shake = Math.max(shake, 2.4 + p.branches.umbrellaEcho * 0.45 + spine * 0.35);
    return targets.length > 0;
  }

  function getMoveVector() {
    let x = 0;
    let y = 0;
    if (keys.has("arrowleft") || keys.has("a")) x -= 1;
    if (keys.has("arrowright") || keys.has("d")) x += 1;
    if (keys.has("arrowup") || keys.has("w")) y -= 1;
    if (keys.has("arrowdown") || keys.has("s")) y += 1;
    if (pointer.active) {
      x += (pointer.x - pointer.ox) / 44;
      y += (pointer.y - pointer.oy) / 44;
    }
    const len = Math.hypot(x, y);
    return len > 0 ? { x: x / len, y: y / len } : { x: 0, y: 0 };
  }

  function nearestEnemy() {
    let best = null;
    let bestD = Infinity;
    for (const e of game.enemies) {
      const d = dist(game.player, e);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    return best;
  }

  function dealDamage(enemy, amount, knock = 0, from = game.player, source = "raw") {
    enemy.hp -= amount;
    enemy.hit = 0.12;
    if (game.player.abilities.inkMark && source !== "mark") {
      applyInkMark(enemy, source);
    }
    if (game.player.abilities.emberWeb && source === "flame") {
      enemy.ember = Math.max(enemy.ember || 0, 3.6);
    }
    if (!game.enemies.includes(enemy)) return;
    if (knock) {
      const a = angleTo(from, enemy);
      enemy.x += Math.cos(a) * knock;
      enemy.y += Math.sin(a) * knock;
    }
    if (game.enemies.includes(enemy)) updateCharacterHitTrait(source, enemy);
    if (game.enemies.includes(enemy) && enemy.hp <= 0) killEnemy(enemy);
  }

  function traitSourceGroup(source) {
    if (["brush", "voidBrush", "inkSplinter", "brushRain", "mirror", "mark"].includes(source)) return "brush";
    if (["orb", "starShard"].includes(source)) return "star";
    if (["flame", "cinder", "flameTide"].includes(source)) return "flame";
    if (["frostString", "frostEcho", "frostLattice", "frostZither"].includes(source)) return "frost";
    if (["lantern"].includes(source)) return "lantern";
    if (["sigil"].includes(source)) return "sigil";
    if (["jade"].includes(source)) return "jade";
    if (["needle"].includes(source)) return "needle";
    return null;
  }

  function updateCharacterHitTrait(source, enemy) {
    const p = game.player;
    if (!p || p.characterTraitCooldown > 0) return;
    const group = traitSourceGroup(source);
    if (!group) return;
    if (p.characterId === "wanderer" && group === "brush") {
      p.characterTraitCounter += source === "brushRain" ? 2 : 1;
      if (p.characterTraitCounter >= 4) {
        p.characterTraitCounter = 0;
        triggerCharacterTrait("harmony", enemy.x, enemy.y, 1);
      }
    }
    if (p.characterId === "bell-dancer" && ["star", "orb"].includes(group)) {
      p.characterTraitCounter += 1;
      if (p.characterTraitCounter >= 5) {
        p.characterTraitCounter = 0;
        triggerCharacterTrait("bell", enemy.x, enemy.y, 1);
      }
    }
  }

  function applyInkMark(enemy, source) {
    enemy.marks = (enemy.marks || 0) + (source === "orb" ? 1.4 : source === "voidBrush" ? 2 : 1);
    if (source === "orb") {
      game.player.brushTimer = Math.min(game.player.brushTimer, Math.max(0.08, game.player.brushCooldown * 0.38));
    }
    if (enemy.marks >= 4) {
      enemy.marks = 0;
      triggerInkBurst(enemy.x, enemy.y, 56, 18 * game.player.damageMult);
    }
  }

  function triggerInkBurst(x, y, radius, damage) {
    game.blooms.push({ x, y, r: 10, max: radius, life: 0.35, color: palette.ink, kind: "ink" });
    spawnParticles(x, y, palette.ink, 18);
    for (const e of [...game.enemies]) {
      if (Math.hypot(e.x - x, e.y - y) < radius + e.r) {
        const emberBonus = game.player.abilities.emberWeb && e.ember > 0 ? 1.55 : 1;
        e.ember = Math.max(0, (e.ember || 0) - 1.8);
        dealDamage(e, damage * emberBonus, 14, { x, y }, "mark");
      }
    }
    if (game.player.relics.moonMirror) {
      for (let i = 0; i < 3; i += 1) {
        makeMoonShard(x, y, -Math.PI / 2 + i * (Math.PI * 2 / 3) + rand(-0.18, 0.18));
      }
    }
  }

  function triggerDewPulse() {
    const p = game.player;
    const radius = 130 + p.level * 3;
    game.blooms.push({ x: p.x, y: p.y, r: 14, max: radius, life: 0.44, color: palette.lilac, kind: "dew" });
    spawnParticles(p.x, p.y, palette.lilac, 24);
    for (const e of [...game.enemies]) {
      const d = dist(p, e);
      if (d < radius + e.r) {
        const pull = Math.max(8, 34 * (1 - d / radius));
        const a = angleTo(e, p);
        e.x += Math.cos(a) * pull;
        e.y += Math.sin(a) * pull;
        dealDamage(e, (16 + p.level * 0.8) * p.damageMult, 4, p, "dew");
      }
    }
    if (p.relics.dewHourglass) {
      p.brushTimer = Math.min(p.brushTimer, p.brushCooldown * 0.18);
      p.flameTimer = Math.max(0, p.flameTimer - 1.1);
    }
    if (p.branches.flameTide) {
      triggerFlameTide(p.x, p.y, p.dewThreshold);
    }
  }

  function triggerCharacterTrait(kind, x = game.player.x, y = game.player.y, power = 1) {
    const p = game.player;
    if (!p) return false;
    const specs = {
      harmony: { color: palette.teal, bloom: "characterHarmony", radius: 104, life: 0.5, shake: 2.8, cooldown: 3.2 },
      bell: { color: palette.lilac, bloom: "characterBell", radius: 118, life: 0.46, shake: 2.4, cooldown: 1.2 },
      ember: { color: palette.coral, bloom: "characterEmber", radius: 132, life: 0.5, shake: 5.4, cooldown: 1.6 },
      lantern: { color: palette.moss, bloom: "characterLantern", radius: 112, life: 0.54, shake: 2.2, cooldown: 1.0 },
    };
    const spec = specs[kind];
    if (!spec) return false;
    const radius = spec.radius + Math.min(42, power * 7);
    game.blooms.push({ x, y, r: 8, max: radius, life: spec.life, color: spec.color, kind: spec.bloom });
    addTrail(x, y, spec.color, radius * 0.16, 0.38, kind === "bell" ? "star" : kind === "ember" ? "cinder" : kind === "lantern" ? "lantern" : "diamond");
    spawnParticles(x, y, spec.color, 18 + Math.floor(power * 3));
    shake = Math.max(shake, spec.shake);
    p.characterTraitCooldown = Math.max(p.characterTraitCooldown, spec.cooldown);

    if (kind === "harmony") {
      p.brushTimer = Math.min(p.brushTimer, p.brushCooldown * 0.18);
      p.flameTimer = Math.max(0, p.flameTimer - 1.05);
      p.frostTimer = Math.min(p.frostTimer, p.frostCooldown * 0.24);
      p.sigilTimer = Math.min(p.sigilTimer, p.sigilCooldown * 0.32);
      for (const e of [...game.enemies]) {
        if (Math.hypot(e.x - x, e.y - y) < radius + e.r) dealDamage(e, (13 + p.level * 0.9) * p.damageMult, 8, { x, y }, "characterTrait");
      }
    }
    if (kind === "bell") {
      p.orbSurge = Math.max(p.orbSurge, 1.85);
      for (let i = 0; i < 6; i += 1) {
        makeStarShard(x, y, (i / 6) * Math.PI * 2, 1 + power * 0.3);
      }
      for (const e of [...game.enemies]) {
        if (Math.hypot(e.x - x, e.y - y) < radius + e.r) {
          e.slow = Math.max(e.slow || 0, 0.5);
          dealDamage(e, (9 + p.orbs * 1.4) * p.damageMult, 5, { x, y }, "characterTrait");
        }
      }
    }
    if (kind === "ember") {
      p.flameTimer = Math.max(0, p.flameTimer - 1.4);
      for (const e of [...game.enemies]) {
        if (Math.hypot(e.x - x, e.y - y) < radius + e.r) {
          e.ember = Math.max(e.ember || 0, 3.4);
          dealDamage(e, (24 + p.flameLevel * 5 + power * 2) * p.damageMult, 16, { x, y }, "flame");
        }
      }
    }
    if (kind === "lantern") {
      addDewCharge(1.2 + power * 0.25);
      const target = nearestEnemy();
      const base = target ? angleTo(p, target) : rand(0, Math.PI * 2);
      for (let i = 0; i < 3; i += 1) {
        makeLanternWisp(x, y, base + (i - 1) * 0.34, Math.max(1, power));
      }
      for (const e of [...game.enemies]) {
        if (Math.hypot(e.x - x, e.y - y) < radius * 0.72 + e.r) dealDamage(e, (8 + p.lanternLevel * 2.5) * p.damageMult, 4, { x, y }, "lantern");
      }
    }
    return true;
  }

  function updateCraneVow(dt, mv) {
    const p = game.player;
    if (!p.abilities.craneVow) return;
    p.craneTimer = Math.max(0, p.craneTimer - dt);
    const moving = Math.hypot(mv.x, mv.y) > 0.1;
    if (moving) {
      p.lastMoveX = mv.x;
      p.lastMoveY = mv.y;
      if (p.craneCharges > 0 && p.craneTimer <= 0) {
        const base = Math.atan2(mv.y, mv.x);
        const count = p.craneCharges + (p.evolutions.voidBrush && p.craneCharges >= 3 ? 1 : 0);
        for (let i = 0; i < count; i += 1) {
          const spread = (i - (count - 1) / 2) * 0.18;
          makeCraneBlade(p.x, p.y, base + spread, p.craneCharges);
        }
        addTrail(p.x, p.y, palette.gold, 20 + p.craneCharges * 4, 0.36, "crane");
        spawnParticles(p.x, p.y, palette.white, 7 + p.craneCharges * 3);
        p.craneCharges = 0;
        p.craneTimer = 0.5;
      }
      p.stillness = 0;
      return;
    }

    p.stillness += dt;
    const chargeInterval = p.speed > 190 ? 0.68 : 0.84;
    while (p.stillness >= chargeInterval && p.craneCharges < 3) {
      p.stillness -= chargeInterval;
      p.craneCharges += 1;
      addTrail(p.x, p.y - 10, palette.white, 12 + p.craneCharges * 4, 0.42, "crane");
      spawnParticles(p.x, p.y - 10, palette.gold, 5);
    }
    if (p.craneCharges >= 3) p.stillness = Math.min(p.stillness, chargeInterval);
  }

  function updateStandingFocus(dt, mv) {
    const p = game.player;
    const moving = Math.hypot(mv.x, mv.y) > 0.1;
    const focusRank = getPickCount("focus");
    if (moving) {
      p.focusStillness = Math.max(0, p.focusStillness - dt * 2.8);
      p.focusLaserTimer = Math.min(p.focusLaserTimer, 0.42);
      return;
    }
    p.focusStillness += dt;
    if (focusRank > 0 && p.focusStillness > 0.55) {
      const boost = (p.focusStillness > 1.2 ? 0.72 : 0.36) + focusRank * 0.12;
      p.brushTimer -= dt * boost;
      p.frostTimer -= dt * boost;
      p.lanternTimer -= dt * boost;
      p.sigilTimer -= dt * boost;
      p.jadeTimer -= dt * boost;
      p.fanTimer -= dt * boost;
      p.umbrellaTimer -= dt * boost;
      p.flameTimer -= dt * boost * 0.55;
    }
    if ((focusRank >= 2 || p.relics.focusLens) && p.focusStillness > 1.05) {
      p.focusLaserTimer -= dt;
      if (p.focusLaserTimer <= 0) {
        p.focusLaserTimer = Math.max(0.56, 1.35 - focusRank * 0.12 - (p.relics.focusLens ? 0.26 : 0));
        triggerStandingLaser();
      }
    }
  }

  function addDewCharge(value) {
    const p = game.player;
    if (!p.abilities.dewPulse) return;
    p.dewCharge += value;
    while (p.dewCharge >= p.dewThreshold) {
      p.dewCharge -= p.dewThreshold;
      triggerDewPulse();
    }
  }

  function totalBranchLevel(p = game.player) {
    if (!p?.branches) return 0;
    return Object.values(p.branches).reduce((sum, value) => sum + (Number(value) || 0), 0);
  }

  function slowWeaponLevel(p = game.player) {
    if (!p) return 0;
    return (p.flameLevel || 0) + (p.sigilLevel || 0) + (p.jadeLevel || 0) + (p.needleLevel || 0) + (p.fanLevel || 0) + (p.umbrellaLevel || 0);
  }

  function triggerBranchInkstone(kind, x = game.player.x, y = game.player.y, power = 1) {
    const p = game.player;
    if (!p?.relics.branchInkstone) return false;
    const branchWeight = Math.max(1, totalBranchLevel(p));
    const charge = Math.min(3, 1 + power * 0.35 + branchWeight * 0.08);
    p.brushTimer = Math.min(p.brushTimer, p.brushCooldown * 0.34);
    p.flameTimer = Math.max(0, p.flameTimer - 0.18 - branchWeight * 0.025);
    p.frostTimer = Math.min(p.frostTimer, p.frostCooldown * 0.38);
    p.sigilTimer = Math.min(p.sigilTimer, p.sigilCooldown * 0.42);
    p.fanTimer = Math.min(p.fanTimer, p.fanCooldown * 0.48);
    p.umbrellaTimer = Math.min(p.umbrellaTimer, p.umbrellaCooldown * 0.48);
    addDewCharge(charge);
    game.blooms.push({ x, y, r: 6, max: 30 + branchWeight * 4, life: 0.26, color: palette.lilac, kind: "branchInkstone" });
    addTrail(x, y, palette.lilac, 12 + branchWeight, 0.24, "diamond");
    spawnParticles(x, y, kind === "cinder" ? palette.coral : kind === "star" ? palette.gold : palette.lilac, 5 + Math.min(8, branchWeight));
    return true;
  }

  function triggerRouteCharm(baseId = "") {
    const p = game.player;
    if (!p?.relics.routeCharm) return false;
    const routeCount = Math.max(1, Object.values(p.mods).reduce((sum, value) => sum + value, 0));
    const color =
      baseId === "flame" ? palette.coral :
        baseId === "orb" ? palette.gold :
          baseId === "frost" ? palette.lilac :
            baseId === "lantern" ? palette.moss :
              baseId === "needle" ? palette.teal :
                baseId === "jade" ? palette.moss :
                  baseId === "fan" ? palette.gold :
                    baseId === "umbrella" ? palette.teal :
                  baseId === "sigil" ? palette.lilac :
                    palette.teal;
    p.brushTimer = Math.min(p.brushTimer, p.brushCooldown * 0.28);
    p.frostTimer = Math.min(p.frostTimer, p.frostCooldown * 0.5);
    p.sigilTimer = Math.min(p.sigilTimer, p.sigilCooldown * 0.55);
    p.jadeTimer = Math.min(p.jadeTimer, p.jadeCooldown * 0.58);
    p.needleTimer = Math.min(p.needleTimer, p.needleCooldown * 0.58);
    p.fanTimer = Math.min(p.fanTimer, p.fanCooldown * 0.58);
    p.umbrellaTimer = Math.min(p.umbrellaTimer, p.umbrellaCooldown * 0.58);
    p.flameTimer = Math.max(0, p.flameTimer - 0.32);
    p.lanternTimer = Math.max(0, p.lanternTimer - 0.28);
    p.orbSurge = Math.max(p.orbSurge, 0.7 + Math.min(0.8, routeCount * 0.06));
    addDewCharge(0.45 + Math.min(1.8, routeCount * 0.12));
    game.blooms.push({ x: p.x, y: p.y, r: 8, max: 54 + Math.min(52, routeCount * 5), life: 0.34, color, kind: "routeCharm" });
    addTrail(p.x, p.y, color, 18 + Math.min(18, routeCount), 0.3, "diamond");
    spawnParticles(p.x, p.y, color, 10 + Math.min(14, routeCount));
    shake = Math.max(shake, 2.2 + Math.min(2.6, routeCount * 0.12));
    return true;
  }

  function triggerRouteFeedback(baseId = "", variantId = "") {
    const p = game.player;
    if (!p) return false;
    const routeCount = Math.max(1, Object.values(p.mods).reduce((sum, value) => sum + (Number(value) || 0), 0));
    const color =
      baseId === "brush" ? palette.ink :
        baseId === "orb" ? palette.gold :
          baseId === "flame" ? palette.coral :
            baseId === "frost" ? palette.lilac :
              baseId === "lantern" ? palette.moss :
                baseId === "sigil" ? palette.lilac :
                  baseId === "jade" ? palette.moss :
                    baseId === "needle" ? palette.teal :
                      baseId === "fan" ? palette.gold :
                        baseId === "umbrella" ? palette.teal :
                          palette.gold;
    const radius = 42 + Math.min(44, routeCount * 5) + (["flame", "needle", "fan", "umbrella"].includes(baseId) ? 12 : 0);
    const beamCount = baseId === "needle" ? 5 : baseId === "umbrella" ? 8 : baseId === "fan" ? 6 : baseId === "orb" ? 7 : 4;
    const damage = (5 + routeCount * 0.9 + (["needle", "fan", "umbrella", "flame"].includes(baseId) ? 3 : 0)) * p.damageMult;
    game.blooms.push({ x: p.x, y: p.y, r: 7, max: radius, life: 0.36, color, kind: "routeChoice", routeBase: baseId, routeVariant: variantId });
    addTrail(p.x, p.y, color, 16 + Math.min(24, routeCount * 2), 0.28, baseId === "umbrella" ? "umbrella" : baseId === "needle" ? "needle" : "diamond");
    for (let i = 0; i < beamCount; i += 1) {
      const angle = (i / beamCount) * Math.PI * 2 + (variantId.length % 5) * 0.16;
      const reach = radius * (0.55 + (i % 2) * 0.28);
      game.beams.push({
        x1: p.x + Math.cos(angle) * 12,
        y1: p.y + Math.sin(angle) * 12,
        x2: p.x + Math.cos(angle) * reach,
        y2: p.y + Math.sin(angle) * reach,
        life: 0.2,
        maxLife: 0.2,
        width: baseId === "umbrella" ? 5 : 3,
        color,
      });
    }
    for (const enemy of game.enemies) {
      if (dist(p, enemy) < radius + enemy.r) {
        dealDamage(enemy, damage, 7, p, "route");
        enemy.slow = Math.max(enemy.slow || 0, 0.3);
      }
    }
    addDewCharge(0.18 + Math.min(0.7, routeCount * 0.04));
    spawnParticles(p.x, p.y, color, 10 + Math.min(10, routeCount));
    shake = Math.max(shake, 1.8 + Math.min(1.6, routeCount * 0.06));
    return true;
  }

  function triggerTempoBell(source = "", x = game.player.x, y = game.player.y, power = 1) {
    const p = game.player;
    if (!p?.relics.tempoBell) return false;
    const weight = Math.max(1, slowWeaponLevel(p));
    const radius = 48 + Math.min(52, power * 7) + Math.min(36, weight * 4);
    const damage = (9 + power * 2.2 + weight * 1.6) * p.damageMult;
    const color =
      source === "flame" ? palette.coral :
        source === "needle" ? palette.teal :
          source === "fan" ? palette.gold :
            source === "jade" ? palette.moss :
              source === "umbrella" ? palette.teal :
              source === "sigil" ? palette.lilac :
                palette.gold;
    const timerTargets = {
      flame: () => { p.flameTimer = Math.max(0, p.flameTimer - 0.48); },
      sigil: () => { p.sigilTimer = Math.min(p.sigilTimer, p.sigilCooldown * 0.64); },
      jade: () => { p.jadeTimer = Math.min(p.jadeTimer, p.jadeCooldown * 0.64); },
      needle: () => { p.needleTimer = Math.min(p.needleTimer, p.needleCooldown * 0.64); },
      fan: () => { p.fanTimer = Math.min(p.fanTimer, p.fanCooldown * 0.64); },
      umbrella: () => { p.umbrellaTimer = Math.min(p.umbrellaTimer, p.umbrellaCooldown * 0.64); },
    };
    timerTargets[source]?.();
    game.blooms.push({ x, y, r: 10, max: radius, life: 0.42, color, kind: "tempoBell" });
    addTrail(x, y, color, radius * 0.24, 0.38, "tempoBell");
    spawnParticles(x, y, color, 8 + Math.min(16, weight * 2));
    addDewCharge(0.22 + Math.min(1.2, weight * 0.08));
    for (const enemy of [...game.enemies]) {
      if (enemy.hp > 0 && Math.hypot(enemy.x - x, enemy.y - y) < radius + enemy.r) {
        enemy.slow = Math.max(enemy.slow || 0, 0.32 + Math.min(0.36, weight * 0.04));
        dealDamage(enemy, damage, 5 + Math.min(5, power), { x, y }, source || "tempoBell");
      }
    }
    shake = Math.max(shake, 1.5 + Math.min(2.6, weight * 0.16));
    return true;
  }

  function triggerChestResonance(rewardCount) {
    const p = game.player;
    const radius = 118 + rewardCount * 24;
    game.blooms.push({ x: p.x, y: p.y, r: 12, max: radius, life: 0.48, color: palette.gold, kind: "chest" });
    spawnParticles(p.x, p.y, palette.gold, 18 + rewardCount * 4);
    for (const e of [...game.enemies]) {
      if (dist(p, e) < radius + e.r) {
        dealDamage(e, (12 + rewardCount * 5) * p.damageMult, 8 + rewardCount * 2, p, "chest");
      }
    }
    if (rewardCount >= 3) {
      p.brushTimer = Math.min(p.brushTimer, p.brushCooldown * 0.24);
      p.flameTimer = Math.max(0, p.flameTimer - (rewardCount === 5 ? 1.8 : 0.9));
      p.orbSurge = Math.max(p.orbSurge, rewardCount === 5 ? 2.2 : 1.2);
    }
  }

  function triggerChestPrism(rewardCount = 1) {
    const p = game.player;
    if (!p?.relics.chestPrism) return { triggered: false, count: 0, names: [] };
    const triggers = [];
    const x = p.x;
    const y = p.y;
    const maxTriggers = rewardCount >= 5 ? 3 : rewardCount >= 3 ? 2 : 1;
    const push = (name, fn) => {
      if (triggers.length >= maxTriggers) return;
      if (fn()) triggers.push(name);
    };

    game.blooms.push({ x, y, r: 10, max: 88 + rewardCount * 18, life: 0.46, color: palette.lilac, kind: "prism" });
    addTrail(x, y, palette.lilac, 24 + rewardCount * 4, 0.4, "diamond");
    spawnParticles(x, y, palette.lilac, 12 + rewardCount * 3);

    push("星铃碎星", () => p.branches.orbShatter && triggerStarShards(x, y, -Math.PI / 2, rewardCount));
    push("墨锋散毫", () => p.branches.brushSplinter && triggerBrushSplinters(x, y, -Math.PI / 2, Math.max(1, rewardCount)));
    push("墨锋骤雨", () => p.branches.brushRain && triggerBrushRain(x, y, -Math.PI / 2, Math.max(1, rewardCount)));
    push("霜弦裂音", () => p.branches.frostEcho && triggerFrostEcho(x, y, Math.PI / 2, Math.max(1, rewardCount)));
    push("霜弦封阵", () => p.branches.frostLattice && triggerFrostLattice(x, y, rewardCount));
    push("星铃归潮", () => p.branches.orbRecall && triggerStarRecall(rewardCount));
    push("月焰烬环", () => p.branches.flameCinder && triggerCinderBloom(x, y, rewardCount));
    push("月焰潮汐", () => p.branches.flameTide && triggerFlameTide(x, y, rewardCount));
    push("流萤聚辉", () => p.branches.lanternGleam && triggerLanternGleam(x, y, rewardCount));
    push("流萤织径", () => p.branches.lanternVein && triggerLanternVein(x, y, rewardCount));
    push("照影回文", () => p.branches.sigilEcho && triggerSigilEcho(x, y, -Math.PI / 2, rewardCount));
    push("照影折幕", () => p.branches.sigilCurtain && triggerSigilCurtain(x, y, -Math.PI / 2, rewardCount));
    push("玉简连弧", () => p.branches.jadeChain && triggerJadeStrike(rewardCount));
    push("玉简镇域", () => p.branches.jadeWard && triggerJadeStrike(rewardCount + 1));
    push("雨墨帘", () => p.branches.needleCurtain && triggerNeedleRain(rewardCount + 2));
    push("定雨纹", () => p.branches.needleSeal && triggerNeedleRain(rewardCount + 2));
    push("玉扇回廊", () => p.branches.fanGale && triggerFanGale(x, y, -Math.PI / 2, rewardCount + 1));
    push("玉扇裂羽", () => p.branches.fanFeather && triggerFanFeathers(x, y, -Math.PI / 2, rewardCount + 1));
    push("玉扇风", () => p.fanLevel && triggerFanGust(-Math.PI / 2, rewardCount + 1));
    push("墨伞莲阵", () => p.branches.umbrellaLotus && triggerUmbrellaLotus(x, y, rewardCount + 1));
    push("伞影回潮", () => p.branches.umbrellaEcho && triggerUmbrellaEcho(x, y, rewardCount + 1));
    push("墨莲伞", () => p.umbrellaLevel && triggerUmbrellaBloom(rewardCount + 1));
    push("雨墨针", () => p.needleLevel && triggerNeedleRain(rewardCount + 1));
    push("纸鹤回羽", () => p.branches.craneEcho && triggerCraneEcho(x, y, 0, Math.min(3, rewardCount)));

    if (triggers.length) p.orbSurge = Math.max(p.orbSurge, rewardCount >= 3 ? 1.25 : 0.8);
    return { triggered: triggers.length > 0, count: triggers.length, names: triggers };
  }

  function triggerStarRecall(power = 1) {
    const p = game.player;
    if (!p?.branches.orbRecall) return false;
    const starChartBonus = p.relics.starChart ? 1.28 : 1;
    const radius = (56 + p.branches.orbRecall * 18 + Math.min(18, power * 3)) * starChartBonus;
    const damage = (7 + p.branches.orbRecall * 4 + power * 0.8) * p.damageMult * starChartBonus;
    p.orbSurge = Math.max(p.orbSurge, p.relics.starChart ? 1.75 : 0.95);
    game.blooms.push({ x: p.x, y: p.y, r: 8, max: radius, life: 0.34, color: p.relics.starChart ? palette.lilac : palette.gold, kind: "starRecall" });
    addTrail(p.x, p.y, p.relics.starChart ? palette.lilac : palette.gold, radius * 0.18, 0.26, "star");
    triggerBranchInkstone("star", p.x, p.y, power);
    for (const e of [...game.enemies]) {
      if (dist(p, e) < radius + e.r) {
        dealDamage(e, damage, 6 + p.branches.orbRecall * 2, p, "orb");
      }
    }
    return true;
  }

  function triggerStarShards(x, y, angle = 0, power = 1) {
    const p = game.player;
    if (!p?.branches.orbShatter) return false;
    const count = 2 + p.branches.orbShatter + (p.evolutions.starRiver ? 2 : 0);
    for (let i = 0; i < count; i += 1) {
      const offset = (i - (count - 1) / 2) * (p.evolutions.starRiver ? 0.22 : 0.32);
      makeStarShard(x, y, angle + offset, power);
    }
    p.orbSurge = Math.max(p.orbSurge, p.evolutions.starRiver ? 1.45 : 0.72);
    addTrail(x, y, p.evolutions.starRiver ? palette.lilac : palette.gold, 15 + p.branches.orbShatter * 4, 0.32, "star");
    spawnParticles(x, y, p.evolutions.starRiver ? palette.lilac : palette.gold, 5 + count);
    triggerBranchInkstone("star", x, y, power);
    return true;
  }

  function triggerCinderBloom(x, y, power = 1) {
    const p = game.player;
    if (!p?.branches.flameCinder) return false;
    const lotusBonus = p.evolutions.moonLotus ? 1.32 : 1;
    const radius = (44 + p.branches.flameCinder * 17 + Math.min(16, power * 2)) * lotusBonus;
    const damage = (8 + p.branches.flameCinder * 5 + (p.evolutions.moonLotus ? 7 : 0)) * p.damageMult;
    game.blooms.push({ x, y, r: 7, max: radius, life: 0.36, color: p.evolutions.moonLotus ? palette.coral : palette.gold, kind: "cinder" });
    addTrail(x, y, p.evolutions.moonLotus ? palette.coral : palette.gold, radius * 0.16, 0.3, "cinder");
    spawnParticles(x, y, p.evolutions.moonLotus ? palette.coral : palette.gold, 8 + p.branches.flameCinder * 4);
    triggerBranchInkstone("cinder", x, y, power);
    for (const e of [...game.enemies]) {
      if (Math.hypot(e.x - x, e.y - y) < radius + e.r) {
        e.cinderSpent = true;
        dealDamage(e, damage, 7 + p.branches.flameCinder * 2, { x, y }, "cinder");
      }
    }
    return true;
  }

  function triggerFlameTide(x, y, power = 1) {
    const p = game.player;
    if (!p?.branches.flameTide) return false;
    const lotusBonus = p.evolutions.moonLotus ? 1.28 : 1;
    const radius = (64 + p.branches.flameTide * 20 + Math.min(20, power * 1.5)) * lotusBonus;
    const damage = (9 + p.branches.flameTide * 5 + (p.evolutions.moonLotus ? 6 : 0)) * p.damageMult;
    game.blooms.push({ x, y, r: 8, max: radius, life: 0.38, color: p.evolutions.moonLotus ? palette.coral : palette.gold, kind: "flameTide" });
    addTrail(x, y, p.evolutions.moonLotus ? palette.coral : palette.gold, radius * 0.14, 0.32, "cinder");
    spawnParticles(x, y, p.evolutions.moonLotus ? palette.coral : palette.gold, 8 + p.branches.flameTide * 4);
    triggerBranchInkstone("cinder", x, y, power);
    for (const e of [...game.enemies]) {
      if (Math.hypot(e.x - x, e.y - y) < radius + e.r) {
        e.ember = Math.max(e.ember || 0, 2.2 + p.branches.flameTide * 0.4);
        dealDamage(e, damage, 5 + p.branches.flameTide * 2, { x, y }, "flame");
      }
    }
    return true;
  }

  function triggerLanternGleam(x, y, power = 1) {
    const p = game.player;
    if (!p?.branches.lanternGleam) return false;
    const radius = 54 + p.branches.lanternGleam * 18 + Math.min(22, power * 3);
    const damage = (7 + p.branches.lanternGleam * 4 + p.lanternLevel * 1.2) * p.damageMult;
    game.blooms.push({ x, y, r: 6, max: radius, life: 0.4, color: palette.moss, kind: "lanternGleam" });
    addTrail(x, y, palette.moss, radius * 0.18, 0.34, "lantern");
    spawnParticles(x, y, palette.moss, 7 + p.branches.lanternGleam * 4);
    addDewCharge(0.35 + p.branches.lanternGleam * 0.18);
    triggerBranchInkstone("lantern", x, y, power);
    for (const e of [...game.enemies]) {
      if (Math.hypot(e.x - x, e.y - y) < radius + e.r) {
        dealDamage(e, damage, 4 + p.branches.lanternGleam, { x, y }, "lantern");
      }
    }
    return true;
  }

  function triggerLanternVein(x, y, power = 1) {
    const p = game.player;
    if (!p?.branches.lanternVein) return false;
    let target = null;
    let best = Infinity;
    for (const enemy of game.enemies) {
      const d = Math.hypot(enemy.x - x, enemy.y - y);
      if (d < best) {
        best = d;
        target = enemy;
      }
    }
    const length = Math.min(560, Math.max(130, best + 46));
    const angle = target ? Math.atan2(target.y - y, target.x - x) : rand(0, Math.PI * 2);
    const end = {
      x: target ? target.x : x + Math.cos(angle) * length,
      y: target ? target.y : y + Math.sin(angle) * length,
    };
    const width = 10 + p.branches.lanternVein * 3 + Math.min(6, power);
    const radius = 38 + p.branches.lanternVein * 12 + Math.min(18, power * 2);
    game.beams.push({ x1: x, y1: y, x2: end.x, y2: end.y, life: 0.28, maxLife: 0.28, width, color: palette.moss });
    game.blooms.push({ x, y, r: 5, max: radius, life: 0.38, color: palette.moss, kind: "lanternVein" });
    addTrail(x, y, palette.moss, radius * 0.18, 0.34, "lantern");
    spawnParticles(x, y, palette.moss, 6 + p.branches.lanternVein * 3);
    p.sigilTimer = Math.min(p.sigilTimer, p.sigilCooldown * Math.max(0.26, 0.6 - p.branches.lanternVein * 0.08));
    addDewCharge(0.22 + p.branches.lanternVein * 0.12);
    triggerBranchInkstone("lantern", x, y, power);
    for (const enemy of [...game.enemies]) {
      const lineDist = pointLineDistance(enemy.x, enemy.y, x, y, end.x, end.y);
      const along = ((enemy.x - x) * (end.x - x) + (enemy.y - y) * (end.y - y)) / Math.max(1, length * length);
      if (along >= -0.05 && along <= 1.05 && lineDist < enemy.r + width * 0.55) {
        dealDamage(enemy, (7 + p.branches.lanternVein * 4 + p.sigilLevel * 1.4) * p.damageMult, 4, { x, y }, "lantern");
      }
    }
    if (p.branches.sigilEcho && p.branches.lanternVein >= 2) {
      triggerSigilEcho(end.x, end.y, angle, power);
    }
    return true;
  }

  function triggerSigilEcho(x, y, angle = 0, power = 1) {
    const p = game.player;
    if (!p?.branches.sigilEcho) return false;
    const radius = 58 + p.branches.sigilEcho * 18 + p.mods.sigilVeil * 9 + Math.min(24, power * 4);
    const damage = (14 + p.branches.sigilEcho * 7 + p.mods.sigilVeil * 5 + power * 1.4) * p.damageMult;
    game.blooms.push({ x, y, r: 8, max: radius, life: 0.46, color: palette.ink, kind: "sigilEcho" });
    game.beams.push({
      x1: x - Math.cos(angle + Math.PI / 2) * radius * 0.72,
      y1: y - Math.sin(angle + Math.PI / 2) * radius * 0.72,
      x2: x + Math.cos(angle + Math.PI / 2) * radius * 0.72,
      y2: y + Math.sin(angle + Math.PI / 2) * radius * 0.72,
      life: 0.24,
      maxLife: 0.24,
      width: 14 + p.branches.sigilEcho * 3,
      color: palette.lilac,
    });
    addTrail(x, y, palette.ink, radius * 0.16, 0.38, "sigil");
    spawnParticles(x, y, palette.lilac, 8 + p.branches.sigilEcho * 4);
    shake = Math.max(shake, 2.8 + p.mods.sigilVeil * 0.9);
    triggerBranchInkstone("sigil", x, y, power);
    for (const e of [...game.enemies]) {
      if (Math.hypot(e.x - x, e.y - y) < radius + e.r) {
        dealDamage(e, damage, 7 + p.branches.sigilEcho * 2, { x, y }, "sigil");
      }
    }
    return true;
  }

  function triggerSigilCurtain(x, y, angle = 0, power = 1) {
    const p = game.player;
    if (!p?.branches.sigilCurtain) return false;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const radius = 72 + p.branches.sigilCurtain * 18 + stillBonus * 26 + Math.min(26, power * 4);
    const beamCount = 2 + p.branches.sigilCurtain + stillBonus;
    const damage = (10 + p.branches.sigilCurtain * 5 + p.mods.sigilLine * 2 + stillBonus * 8) * p.damageMult;
    game.blooms.push({ x, y, r: 9, max: radius, life: 0.5, color: palette.ink, kind: "sigilCurtain" });
    for (let i = 0; i < beamCount; i += 1) {
      const a = angle + (i - (beamCount - 1) / 2) * 0.42 + (i % 2 ? 0.12 : -0.12);
      game.beams.push({
        x1: x - Math.cos(a) * radius * 0.18,
        y1: y - Math.sin(a) * radius * 0.18,
        x2: x + Math.cos(a) * radius,
        y2: y + Math.sin(a) * radius,
        life: 0.26,
        maxLife: 0.26,
        width: 9 + p.branches.sigilCurtain * 2 + stillBonus * 4,
        color: i % 2 ? palette.ink : palette.lilac,
      });
    }
    addTrail(x, y, palette.ink, radius * 0.15, 0.42, "sigil");
    spawnParticles(x, y, palette.ink, 10 + beamCount * 2);
    shake = Math.max(shake, 3.4 + stillBonus * 3.2);
    triggerBranchInkstone("sigil", x, y, power + stillBonus);
    for (const enemy of [...game.enemies]) {
      if (Math.hypot(enemy.x - x, enemy.y - y) < radius + enemy.r) {
        dealDamage(enemy, damage, 8 + p.branches.sigilCurtain * 2, { x, y }, "sigil");
      }
    }
    return true;
  }

  function triggerStandingLaser() {
    const p = game.player;
    const target = nearestEnemy();
    if (!target) return false;
    const a = angleTo(p, target);
    const length = Math.min(620, Math.hypot(target.x - p.x, target.y - p.y) + 80);
    const end = { x: p.x + Math.cos(a) * length, y: p.y + Math.sin(a) * length };
    const width = 18 + Math.min(18, p.focusStillness * 4);
    const lens = p.relics.focusLens;
    game.beams.push({ x1: p.x, y1: p.y, x2: end.x, y2: end.y, life: lens ? 0.28 : 0.22, maxLife: lens ? 0.28 : 0.22, width: width + (lens ? 5 : 0), color: lens ? palette.white : palette.gold });
    if (lens) {
      for (const offset of [-0.24, 0.24]) {
        const side = a + offset;
        game.beams.push({
          x1: p.x + Math.cos(a + Math.PI / 2) * offset * 38,
          y1: p.y + Math.sin(a + Math.PI / 2) * offset * 38,
          x2: p.x + Math.cos(side) * (length * 0.78),
          y2: p.y + Math.sin(side) * (length * 0.78),
          life: 0.24,
          maxLife: 0.24,
          width: Math.max(9, width * 0.42),
          color: palette.lilac,
        });
      }
      addTrail(p.x, p.y, palette.lilac, 38, 0.34, "focus");
    }
    game.blooms.push({ x: p.x, y: p.y, r: 5, max: 48 + Math.min(34, p.focusStillness * 8) + (lens ? 24 : 0), life: lens ? 0.36 : 0.28, color: lens ? palette.lilac : palette.gold, kind: "focus" });
    spawnParticles(p.x, p.y, lens ? palette.lilac : palette.gold, lens ? 15 : 9);
    shake = Math.max(shake, lens ? 7.2 : 4.5);
    for (const e of [...game.enemies]) {
      const lineDist = pointLineDistance(e.x, e.y, p.x, p.y, end.x, end.y);
      const along = ((e.x - p.x) * (end.x - p.x) + (e.y - p.y) * (end.y - p.y)) / Math.max(1, length * length);
      if (along >= 0 && along <= 1 && lineDist < e.r + width * 0.44) {
        dealDamage(e, (18 + p.level * 1.4 + p.focusStillness * 3.5 + (lens ? 12 : 0)) * p.damageMult, 8, p, "focus");
      }
    }
    return true;
  }

  function triggerCraneEcho(x, y, angle, charge = 1) {
    const p = game.player;
    if (!p?.branches.craneEcho) return false;
    const featherCount = 2 + (p.speed > 190 ? 1 : 0);
    const spreadBase = featherCount === 3 ? [-0.58, 0, 0.58] : [-0.46, 0.46];
    for (const spread of spreadBase) {
      makeCraneFeather(x, y, angle + Math.PI + spread, charge);
    }
    addTrail(x, y, palette.white, 14 + p.branches.craneEcho * 4, 0.34, "crane");
    spawnParticles(x, y, palette.white, 4 + p.branches.craneEcho * 2);
    triggerBranchInkstone("crane", x, y, charge);
    return true;
  }

  function triggerBrushSplinters(x, y, angle = 0, strength = 1) {
    const p = game.player;
    if (!p?.branches.brushSplinter) return false;
    const count = 2 + Math.min(2, p.branches.brushSplinter) + (p.relics.moonMirror ? 1 : 0);
    for (let i = 0; i < count; i += 1) {
      const offset = (i - (count - 1) / 2) * 0.34;
      makeInkSplinter(x, y, angle + Math.PI + offset, strength);
    }
    addTrail(x, y, p.evolutions.voidBrush ? palette.ink : palette.teal, 18 + p.branches.brushSplinter * 3, 0.32, "splinter");
    spawnParticles(x, y, p.evolutions.voidBrush ? palette.ink : palette.teal, 4 + count);
    triggerBranchInkstone("brush", x, y, strength);
    return true;
  }

  function triggerBrushRain(x, y, angle = 0, strength = 1) {
    const p = game.player;
    if (!p?.branches.brushRain) return false;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const count = 2 + p.branches.brushRain + stillBonus + (p.evolutions.voidBrush ? 1 : 0);
    const length = 210 + p.branches.brushRain * 42 + p.mods.brushForce * 18 + Math.min(70, strength * 12);
    const width = 14 + p.branches.brushRain * 3 + stillBonus * 4;
    const damage = (12 + p.branches.brushRain * 6 + p.mods.brushForce * 2 + stillBonus * 5) * p.damageMult;
    const color = p.evolutions.voidBrush ? palette.ink : palette.teal;
    game.blooms.push({ x, y, r: 7, max: 62 + p.branches.brushRain * 14 + stillBonus * 18, life: 0.42, color, kind: "brushRain" });
    for (let i = 0; i < count; i += 1) {
      const lane = (i - (count - 1) / 2) * (22 + p.branches.brushRain * 3);
      const along = (i % 2 ? 1 : -1) * 18;
      const nx = Math.cos(angle + Math.PI / 2);
      const ny = Math.sin(angle + Math.PI / 2);
      const cx = x + nx * lane + Math.cos(angle) * along;
      const cy = y + ny * lane + Math.sin(angle) * along;
      const x1 = cx - Math.cos(angle) * length * 0.42;
      const y1 = cy - Math.sin(angle) * length * 0.42;
      const x2 = cx + Math.cos(angle) * length * 0.72;
      const y2 = cy + Math.sin(angle) * length * 0.72;
      game.beams.push({ x1, y1, x2, y2, life: 0.25, maxLife: 0.25, width, color });
      const segLenSq = Math.max(1, (x2 - x1) ** 2 + (y2 - y1) ** 2);
      for (const enemy of [...game.enemies]) {
        const lineDist = pointLineDistance(enemy.x, enemy.y, x1, y1, x2, y2);
        const alongLine = ((enemy.x - x1) * (x2 - x1) + (enemy.y - y1) * (y2 - y1)) / segLenSq;
        if (alongLine >= -0.08 && alongLine <= 1.08 && lineDist < enemy.r + width * 0.52) {
          dealDamage(enemy, damage, 6 + p.branches.brushRain * 2, { x: x1, y: y1 }, "brushRain");
        }
      }
    }
    addTrail(x, y, color, 20 + p.branches.brushRain * 6, 0.34, "slash");
    spawnParticles(x, y, color, 8 + count * 2);
    shake = Math.max(shake, 2.6 + stillBonus * 2.2 + (p.evolutions.voidBrush ? 1.4 : 0));
    triggerBranchInkstone("brush", x, y, strength + stillBonus);
    return true;
  }

  function triggerFrostEcho(x, y, angle = 0, strength = 1) {
    const p = game.player;
    if (!p?.branches.frostEcho) return false;
    const count = 2 + Math.min(2, p.branches.frostEcho);
    for (let i = 0; i < count; i += 1) {
      const offset = (i - (count - 1) / 2) * 0.42;
      makeFrostString(x, y, angle + Math.PI + offset, strength, true);
    }
    addDewCharge((p.evolutions.frostZither ? 1.2 : 0.6) + p.branches.frostEcho * 0.35);
    addTrail(x, y, palette.lilac, 16 + p.branches.frostEcho * 4 + (p.evolutions.frostZither ? 8 : 0), 0.32, "frost");
    spawnParticles(x, y, palette.lilac, 5 + count + (p.evolutions.frostZither ? 4 : 0));
    triggerBranchInkstone("frost", x, y, strength);
    return true;
  }

  function triggerFrostLattice(x, y, power = 1) {
    const p = game.player;
    if (!p?.branches.frostLattice) return false;
    const stillBonus = p.focusStillness > 0.55 ? 1 : 0;
    const zitherBonus = p.evolutions.frostZither ? 1 : 0;
    const radius = 58 + p.branches.frostLattice * 18 + stillBonus * 18 + zitherBonus * 20 + Math.min(26, power * 4);
    const damage = (9 + p.branches.frostLattice * 5 + p.mods.frostPulse * 3 + zitherBonus * 5 + stillBonus * 4) * p.damageMult;
    game.blooms.push({ x, y, r: 7, max: radius, life: 0.48 + zitherBonus * 0.1, color: palette.lilac, kind: "frostLattice" });
    for (let i = 0; i < 3; i += 1) {
      const a = game.time * 0.12 + (i * Math.PI) / 3;
      game.beams.push({
        x1: x - Math.cos(a) * radius * 0.62,
        y1: y - Math.sin(a) * radius * 0.62,
        x2: x + Math.cos(a) * radius * 0.62,
        y2: y + Math.sin(a) * radius * 0.62,
        life: 0.22,
        maxLife: 0.22,
        width: 8 + p.branches.frostLattice * 2 + zitherBonus * 3,
        color: palette.lilac,
      });
    }
    addTrail(x, y, palette.lilac, radius * 0.2, 0.38, "frost");
    spawnParticles(x, y, palette.lilac, 8 + p.branches.frostLattice * 4 + zitherBonus * 4);
    addDewCharge(0.28 + p.branches.frostLattice * 0.16 + zitherBonus * 0.2);
    shake = Math.max(shake, 2.4 + stillBonus * 1.6 + zitherBonus * 1.4);
    triggerBranchInkstone("frost", x, y, power + stillBonus + zitherBonus);
    for (const enemy of [...game.enemies]) {
      if (Math.hypot(enemy.x - x, enemy.y - y) < radius + enemy.r) {
        enemy.slow = Math.max(enemy.slow || 0, 1.0 + p.branches.frostLattice * 0.18 + zitherBonus * 0.25);
        dealDamage(enemy, damage, 5 + p.branches.frostLattice * 2, { x, y }, "frostLattice");
      }
    }
    return true;
  }

  function killEnemy(enemy) {
    const index = game.enemies.indexOf(enemy);
    if (index >= 0) game.enemies.splice(index, 1);
    game.kills += 1;
    spawnGem(enemy.x, enemy.y, enemy.xp);
    const chestChance = enemy.type === "boss" ? 1 : enemy.type === "elite" ? 0.72 : enemy.type === "bloom" ? 0.045 : 0.025;
    if (Math.random() < chestChance) spawnChest(enemy.x + rand(-12, 12), enemy.y + rand(-12, 12), enemy.type === "boss" ? "boss" : enemy.type === "elite" ? "elite" : "common");
    spawnParticles(enemy.x, enemy.y, enemy.color, enemy.type === "boss" ? 42 : 12);
    const p = game.player;
    if (p.branches.flameCinder && enemy.ember > 0 && !enemy.cinderSpent) {
      triggerCinderBloom(enemy.x, enemy.y, enemy.ember);
    }
    if (p.characterId === "ember-warden" && p.characterTraitCooldown <= 0) {
      p.characterTraitCounter += enemy.ember > 0 ? 2 : 1;
      if (p.characterTraitCounter >= 4) {
        p.characterTraitCounter = 0;
        triggerCharacterTrait("ember", enemy.x, enemy.y, enemy.ember || 1);
      }
    }
    if (p.relics.redSeal && p.redSealReady) {
      p.redSealReady = false;
      p.hp = Math.min(p.maxHp, p.hp + 12);
      triggerInkBurst(enemy.x, enemy.y, 44, 12 * p.damageMult);
    }
    if (enemy.type === "boss") {
      game.bossSpawned = false;
      game.eliteTimer = 8;
    }
  }

  function gainXp(value) {
    const p = game.player;
    p.xp += value;
    while (p.xp >= p.nextXp) {
      p.xp -= p.nextXp;
      p.level += 1;
      p.nextXp = Math.floor(p.nextXp * 1.28 + 5);
      game.pendingUpgrades += 1;
      showQueuedUpgrade();
    }
  }

  function showQueuedUpgrade() {
    if (
      game.pendingUpgrades <= 0 ||
      state !== "playing" ||
      ui.chest.classList.contains("visible") ||
      ui.upgrade.classList.contains("visible")
    ) {
      return false;
    }
    game.pendingUpgrades -= 1;
    showUpgrades();
    return true;
  }

  function applyUpgrade(upgrade) {
    upgrade.apply(game.player);
    if (upgrade.variantApply) upgrade.variantApply(game.player);
    if (upgrade.variantId) {
      game.lastVariant = `${upgrade.baseName || upgrade.name}：${upgrade.variantName}`;
      triggerRouteFeedback(upgrade.baseId || upgrade.id, upgrade.variantId);
      triggerRouteCharm(upgrade.baseId || upgrade.id);
    }
    const pickId = upgrade.baseId || upgrade.id;
    const existing = game.picks.find((pick) => pick.id === pickId);
    if (existing && !upgrade.once) {
      existing.count += 1;
    } else if (!existing) {
      game.picks.push({
        id: pickId,
        type: upgrade.type || "升级",
        name: upgrade.baseName || upgrade.name,
        desc: upgrade.baseDesc || upgrade.desc,
        count: 1,
      });
    }
    if (pickId.startsWith("evolve-")) {
      triggerEvolutionShowcase(pickId);
    }
  }

  function triggerEvolutionShowcase(id, p = game.player) {
    if (!p) return false;
    const target = nearestEnemy();
    const base = target ? angleTo(p, target) : -Math.PI / 2;
    if (id === "evolve-void-brush") {
      p.brushTimer = 0;
      triggerInkBurst(p.x, p.y, 76, 18 * p.damageMult);
      game.blooms.push({ x: p.x, y: p.y, r: 18, max: 148, life: 1.45, color: palette.ink, kind: "evolve" });
      for (let i = 0; i < 7; i += 1) {
        makeProjectile(p.x, p.y, base + (i - 3) * 0.14);
      }
      addTrail(p.x, p.y, palette.ink, 36, 0.44, "burst");
      spawnParticles(p.x, p.y, palette.ink, 24);
      shake = Math.max(shake, 4.2);
      return true;
    }
    if (id === "evolve-star-river") {
      p.orbSurge = Math.max(p.orbSurge, 2.2);
      game.blooms.push({ x: p.x, y: p.y, r: 14, max: 128, life: 0.52, color: palette.lilac, kind: "starRecall" });
      addTrail(p.x, p.y, palette.lilac, 44, 0.5, "star");
      const count = Math.max(12, p.orbs * 3);
      for (let i = 0; i < count; i += 1) {
        makeStarShard(p.x, p.y, (i / count) * Math.PI * 2, 2.5);
      }
      spawnParticles(p.x, p.y, palette.lilac, 30);
      shake = Math.max(shake, 4);
      return true;
    }
    if (id === "evolve-moon-lotus") {
      p.flameTimer = 0;
      const radius = 128 + p.flameLevel * 24 + p.mods.flameReach * 18;
      game.blooms.push({ x: p.x, y: p.y, r: 18, max: radius, life: 0.54, color: palette.coral, kind: "lotus" });
      game.blooms.push({ x: p.x, y: p.y, r: 8, max: radius * 0.55, life: 0.42, color: palette.gold, kind: "lotus" });
      for (const enemy of [...game.enemies]) {
        if (dist(p, enemy) < radius + enemy.r) {
          dealDamage(enemy, (36 + p.flameLevel * 10) * p.damageMult, 22, p, "flame");
        }
      }
      triggerCinderBloom(p.x, p.y, Math.max(2, p.flameLevel));
      triggerFlameTide(p.x, p.y, Math.max(2, p.flameLevel));
      spawnParticles(p.x, p.y, palette.coral, 38);
      triggerTempoBell("flame", p.x, p.y, p.flameLevel + 3);
      shake = Math.max(shake, 4.6);
      return true;
    }
    if (id === "evolve-frost-zither") {
      p.frostTimer = 0;
      const count = Math.max(7, 4 + p.branches.frostEcho + p.branches.frostLattice);
      for (let i = 0; i < count; i += 1) {
        makeFrostString(p.x, p.y, base + (i - (count - 1) / 2) * 0.15, Math.max(4, p.frostLevel));
      }
      triggerFrostLattice(p.x, p.y, Math.max(4, p.frostLevel));
      game.blooms.push({ x: p.x, y: p.y, r: 12, max: 112, life: 0.5, color: palette.lilac, kind: "frost" });
      addTrail(p.x, p.y, palette.lilac, 38, 0.44, "frost");
      spawnParticles(p.x, p.y, palette.lilac, 26);
      shake = Math.max(shake, 4);
      return true;
    }
    if (id === "evolve-rain-loom") {
      p.needleTimer = 0;
      const triggered = triggerNeedleRain(Math.max(5, p.needleLevel + 1));
      game.blooms.push({ x: p.x, y: p.y, r: 12, max: 118, life: 0.5, color: palette.white, kind: "needleLoom" });
      addTrail(p.x, p.y, palette.white, 46, 0.5, "needleLoom");
      if (!triggered) {
        for (let i = 0; i < 8; i += 1) {
          const offset = (i - 3.5) * 18;
          game.beams.push({
            x1: p.x + offset,
            y1: p.y - 150,
            x2: p.x - offset * 0.25,
            y2: p.y + 70,
            life: 0.22,
            maxLife: 0.22,
            width: 4,
            color: i % 2 ? palette.gold : palette.white,
          });
        }
      }
      spawnParticles(p.x, p.y, palette.white, 30);
      shake = Math.max(shake, 4.4);
      return true;
    }
    if (id === "evolve-jade-fan") {
      p.fanTimer = 0;
      triggerFanGust(base, Math.max(5, p.fanLevel + 1));
      game.blooms.push({ x: p.x, y: p.y, r: 14, max: 126, life: 0.5, color: palette.gold, kind: "jadeFanCore" });
      addTrail(p.x, p.y, palette.gold, 44, 0.48, "jadeFan");
      spawnParticles(p.x, p.y, palette.gold, 28);
      shake = Math.max(shake, 4.5);
      return true;
    }
    return false;
  }

  function getPickCount(id) {
    return game.picks.find((pick) => pick.id === id)?.count || 0;
  }

  function getUpgradeLevel(upgrade, p = game.player) {
    if (!p) return 0;
    const id = upgrade.baseId || upgrade.id;
    if (id === "brush") return p.brushCount;
    if (id === "branch-brush-splinter") return p.branches.brushSplinter;
    if (id === "branch-brush-rain") return p.branches.brushRain;
    if (id === "orb") return p.orbs;
    if (id === "branch-orb-recall") return p.branches.orbRecall;
    if (id === "branch-orb-shatter") return p.branches.orbShatter;
    if (id === "flame") return p.flameLevel;
    if (id === "branch-flame-cinder") return p.branches.flameCinder;
    if (id === "branch-flame-tide") return p.branches.flameTide;
    if (id === "frost") return p.frostLevel;
    if (id === "branch-frost-echo") return p.branches.frostEcho;
    if (id === "branch-frost-lattice") return p.branches.frostLattice;
    if (id === "lantern") return p.lanternLevel;
    if (id === "branch-lantern-gleam") return p.branches.lanternGleam;
    if (id === "branch-lantern-vein") return p.branches.lanternVein;
    if (id === "sigil") return p.sigilLevel;
    if (id === "branch-sigil-echo") return p.branches.sigilEcho;
    if (id === "branch-sigil-curtain") return p.branches.sigilCurtain;
    if (id === "jade") return p.jadeLevel;
    if (id === "needle") return p.needleLevel;
    if (id === "fan") return p.fanLevel;
    if (id === "umbrella") return p.umbrellaLevel;
    if (id === "branch-jade-chain") return p.branches.jadeChain;
    if (id === "branch-jade-ward") return p.branches.jadeWard;
    if (id === "branch-needle-curtain") return p.branches.needleCurtain;
    if (id === "branch-needle-seal") return p.branches.needleSeal;
    if (id === "branch-fan-gale") return p.branches.fanGale;
    if (id === "branch-fan-feather") return p.branches.fanFeather;
    if (id === "branch-umbrella-lotus") return p.branches.umbrellaLotus;
    if (id === "branch-umbrella-echo") return p.branches.umbrellaEcho;
    if (id === "branch-crane-echo") return p.branches.craneEcho;
    if (id === "ability-ink-mark") return p.abilities.inkMark ? 1 : 0;
    if (id === "ability-dew-pulse") return p.abilities.dewPulse ? 1 : 0;
    if (id === "ability-ember") return p.abilities.emberWeb ? 1 : 0;
    if (id === "ability-crane-vow") return p.abilities.craneVow ? 1 : 0;
    if (id === "relic-moon-mirror") return p.relics.moonMirror ? 1 : 0;
    if (id === "relic-dew-hourglass") return p.relics.dewHourglass ? 1 : 0;
    if (id === "relic-star-chart") return p.relics.starChart ? 1 : 0;
    if (id === "relic-red-seal") return p.relics.redSeal ? 1 : 0;
    if (id === "relic-chest-resonance") return p.relics.chestResonance ? 1 : 0;
    if (id === "relic-lacquer-key") return p.relics.lacquerKey ? 1 : 0;
    if (id === "relic-branch-inkstone") return p.relics.branchInkstone ? 1 : 0;
    if (id === "relic-chest-prism") return p.relics.chestPrism ? 1 : 0;
    if (id === "relic-focus-lens") return p.relics.focusLens ? 1 : 0;
    if (id === "relic-route-charm") return p.relics.routeCharm ? 1 : 0;
    if (id === "relic-tempo-bell") return p.relics.tempoBell ? 1 : 0;
    if (id === "evolve-void-brush") return p.evolutions.voidBrush ? 1 : 0;
    if (id === "evolve-star-river") return p.evolutions.starRiver ? 1 : 0;
    if (id === "evolve-moon-lotus") return p.evolutions.moonLotus ? 1 : 0;
    if (id === "evolve-frost-zither") return p.evolutions.frostZither ? 1 : 0;
    if (id === "evolve-rain-loom") return p.evolutions.rainLoom ? 1 : 0;
    if (id === "evolve-jade-fan") return p.evolutions.jadeFan ? 1 : 0;
    return getPickCount(id);
  }

  function getUpgradeMax(upgrade) {
    const id = upgrade.baseId || upgrade.id;
    return upgradeCaps[id] || (upgrade.once ? 1 : "∞");
  }

  function formatUpgradeLevel(upgrade, p = game.player) {
    return `Lv ${getUpgradeLevel(upgrade, p)}/${getUpgradeMax(upgrade)}`;
  }

  function describeUpgradeEffect(upgrade, p = game.player) {
    if (upgrade.variantEffect) return `${upgrade.variantEffect}（${upgrade.baseName || upgrade.name}升至 Lv ${getUpgradeLevel(upgrade, p) + 1}/${getUpgradeMax(upgrade)}）`;
    if (!p) return "本次：获得该升级";
    const nextLevel = Math.min(Number(getUpgradeMax(upgrade)) || getUpgradeLevel(upgrade, p) + 1, getUpgradeLevel(upgrade, p) + 1);
    const effects = {
      brush: `本次：墨锋数量 +1，冷却缩短 14%（升至 Lv ${nextLevel}/${upgradeCaps.brush}）`,
      "branch-brush-splinter": `本次：墨锋散毫 +1，墨锋命中裂出细毫（升至 Lv ${nextLevel}/${upgradeCaps["branch-brush-splinter"]}）`,
      "branch-brush-rain": `本次：墨锋骤雨 +1，墨锋齐射积攒碑拓并落下墨柱；站定更快触发（升至 Lv ${nextLevel}/${upgradeCaps["branch-brush-rain"]}）`,
      orb: `本次：星铃数量 +1，星铃伤害 +3（升至 Lv ${nextLevel}/${upgradeCaps.orb}）`,
      "branch-orb-recall": `本次：星铃归潮 +1，拾取月露触发召回星纹（升至 Lv ${nextLevel}/${upgradeCaps["branch-orb-recall"]}）`,
      "branch-orb-shatter": `本次：星铃碎星 +1，星铃命中裂出碎星（升至 Lv ${nextLevel}/${upgradeCaps["branch-orb-shatter"]}）`,
      flame: `本次：月焰层级 +1，冷却缩短 12%（升至 Lv ${nextLevel}/${upgradeCaps.flame}）`,
      "branch-flame-cinder": `本次：月焰烬环 +1，余烬击杀触发焰环（升至 Lv ${nextLevel}/${upgradeCaps["branch-flame-cinder"]}）`,
      "branch-flame-tide": `本次：月焰潮汐 +1，引露脉冲额外展开月焰潮（升至 Lv ${nextLevel}/${upgradeCaps["branch-flame-tide"]}）`,
      frost: `本次：霜弦层级 +1，冷却缩短 10%（升至 Lv ${nextLevel}/${upgradeCaps.frost}）`,
      "branch-frost-echo": `本次：霜弦裂音 +1，霜弦命中裂出寒音并充能月露（升至 Lv ${nextLevel}/${upgradeCaps["branch-frost-echo"]}）`,
      "branch-frost-lattice": `本次：霜弦封阵 +1，霜弦命中展开六角霜阵；站定范围更大（升至 Lv ${nextLevel}/${upgradeCaps["branch-frost-lattice"]}）`,
      lantern: `本次：流萤灯 +1，发射流萤数量/伤害提升，拾取范围 +4（升至 Lv ${nextLevel}/${upgradeCaps.lantern}）`,
      "branch-lantern-gleam": `本次：流萤聚辉 +1，拾取月露会爆出萤辉并充能引露（升至 Lv ${nextLevel}/${upgradeCaps["branch-lantern-gleam"]}）`,
      "branch-lantern-vein": `本次：流萤织径 +1，流萤命中织出光束并回转照影符（升至 Lv ${nextLevel}/${upgradeCaps["branch-lantern-vein"]}）`,
      sigil: `本次：照影符 +1，低频高伤影符更强，3 级后可走回文分支（升至 Lv ${nextLevel}/${upgradeCaps.sigil}）`,
      "branch-sigil-echo": `本次：照影回文 +1，影符命中展开更强暗场和横向光束（升至 Lv ${nextLevel}/${upgradeCaps["branch-sigil-echo"]}）`,
      "branch-sigil-curtain": `本次：照影折幕 +1，影符命中折出暗幕光束；站定收益更高（升至 Lv ${nextLevel}/${upgradeCaps["branch-sigil-curtain"]}）`,
      jade: `本次：玉简雷 +1，锁定雷刻伤害提高；本级方向会额外生效（升至 Lv ${nextLevel}/${upgradeCaps.jade}）`,
      needle: `本次：雨墨针 +1，细针雨伤害提高；本级方向会额外生效（升至 Lv ${nextLevel}/${upgradeCaps.needle}）`,
      fan: `本次：玉扇风 +1，弧风伤害提高；本级方向会额外生效（升至 Lv ${nextLevel}/${upgradeCaps.fan}）`,
      umbrella: `本次：墨莲伞 +1，护圈伤害和伞骨数量提高；本级方向会额外生效（升至 Lv ${nextLevel}/${upgradeCaps.umbrella}）`,
      "branch-jade-chain": `本次：玉简连弧 +1，雷刻命中后折出连锁玉弧（升至 Lv ${nextLevel}/${upgradeCaps["branch-jade-chain"]}）`,
      "branch-jade-ward": `本次：玉简镇域 +1，雷刻落点展开方阵镇域；站定与寂光砚收益更高（升至 Lv ${nextLevel}/${upgradeCaps["branch-jade-ward"]}）`,
      "branch-needle-curtain": `本次：雨墨帘 +1，针雨命中追加纵向雨帘和目标间雨线（升至 Lv ${nextLevel}/${upgradeCaps["branch-needle-curtain"]}）`,
      "branch-needle-seal": `本次：定雨纹 +1，减速目标被针雨命中会展开范围雨纹（升至 Lv ${nextLevel}/${upgradeCaps["branch-needle-seal"]}）`,
      "branch-fan-gale": `本次：玉扇回廊 +1，扇风命中后展开回廊风纹；回风路线会多触发一次（升至 Lv ${nextLevel}/${upgradeCaps["branch-fan-gale"]}）`,
      "branch-fan-feather": `本次：玉扇裂羽 +1，扇风边缘飞出玉羽追远处敌人；宽扇会多飞羽（升至 Lv ${nextLevel}/${upgradeCaps["branch-fan-feather"]}）`,
      "branch-umbrella-lotus": `本次：墨伞莲阵 +1，护伞张开后留下短暂阵地；护圈更稳，反刺补光刺（升至 Lv ${nextLevel}/${upgradeCaps["branch-umbrella-lotus"]}）`,
      "branch-umbrella-echo": `本次：伞影回潮 +1，护伞张开后追打外圈敌人；反刺会多一道回潮（升至 Lv ${nextLevel}/${upgradeCaps["branch-umbrella-echo"]}）`,
      "branch-crane-echo": `本次：纸鹤回羽 +1，纸鹤命中分裂回羽（升至 Lv ${nextLevel}/${upgradeCaps["branch-crane-echo"]}）`,
      stride: `本次：移速 +22，拾取范围 +18（升至 Lv ${nextLevel}/${upgradeCaps.stride}）`,
      heart: `本次：生命上限 +22，当前生命 +34（升至 Lv ${nextLevel}/${upgradeCaps.heart}）`,
      focus: `本次：所有伤害 +16%；解锁/强化站定凝神收益，2 级后可射出凝神激光（升至 Lv ${nextLevel}/${upgradeCaps.focus}）`,
      "ability-ink-mark": "本次：解锁墨印叠层，4 层爆开；星铃命中会回转墨锋",
      "ability-dew-pulse": "本次：解锁月露蓄能，满 8 点释放牵引伤害脉冲",
      "ability-ember": "本次：解锁月焰余烬，墨印爆发会二次点燃",
      "ability-crane-vow": "本次：解锁静止蓄纸鹤，移动释放锋线",
      "relic-moon-mirror": "本次：墨印爆发额外射出三枚月片",
      "relic-dew-hourglass": "本次：引露脉冲会回转墨锋与月焰冷却",
      "relic-star-chart": "本次：星铃提高墨锋伤害，墨锋命中加速星铃",
      "relic-red-seal": "本次：受伤蓄印，下一次击破治疗并爆发",
      "relic-chest-resonance": "本次：宝箱奖励触发月匣脉冲；3/5 奖励额外回冷却",
      "relic-lacquer-key": "本次：拾取范围 +22；宝箱奖励为引露脉冲充能",
      "relic-branch-inkstone": "本次：分支触发会回冷却，并为引露脉冲充能",
      "relic-chest-prism": "本次：宝箱奖励会折射已拥有分支，3/5 奖励触发更多",
      "relic-focus-lens": "本次：站定更早发射凝神光束，并追加两道寂光侧束",
      "relic-tempo-bell": "本次：慢武器每次出手多一圈重响，补伤害、减速，并提前下一次出手",
      "evolve-void-brush": "本次：合成万象墨锋，并立刻放出一轮贯穿墨锋",
      "evolve-star-river": "本次：合成星河轮，并立刻爆出一圈碎星",
      "evolve-moon-lotus": "本次：合成白月焰莲，并立刻引爆一次双重焰莲",
      "evolve-frost-zither": "本次：合成霜月琴，并立刻拨出一排贯穿琴音",
      "evolve-rain-loom": "本次：合成天雨织机，并立刻织出雨线网络",
      "evolve-jade-fan": "本次：合成清风玉阙，并立刻展开双层风墙",
    };
    return effects[upgrade.id] || "本次：获得该升级";
  }

  function describeUpgradeSynergy(upgrade) {
    const id = upgrade.baseId || upgrade.id;
    const variant = upgrade.variantName ? ` · ${upgrade.variantName}` : "";
    const hints = {
      brush: `流派：墨印/贯穿${variant}，后续看墨印连锁与万象墨锋`,
      "branch-brush-splinter": "流派：命中裂变，吃墨印、裂月镜、分枝砚",
      "branch-brush-rain": "流派：齐射碑拓，站定加速触发，低频多线贯穿",
      orb: `流派：回旋/贴身${variant}，后续看星盘与星河轮`,
      "branch-orb-recall": "流派：拾取召回，吃拾取范围、星盘、宝箱棱镜",
      "branch-orb-shatter": "流派：命中碎星，吃星铃数量、星盘、星河轮",
      flame: `流派：范围爆发${variant}，后续看余烬织线与白月焰莲`,
      "branch-flame-cinder": "流派：击杀连锁，低频触发但一炸一片",
      "branch-flame-tide": "流派：引露脉冲，拾取越多潮汐越频繁",
      frost: `流派：减速控场${variant}，后续看引露脉冲与霜月琴`,
      "branch-frost-echo": "流派：寒音充能，把控场转成引露循环",
      "branch-frost-lattice": "流派：阵地控场，低频换大范围减速和引露充能",
      lantern: `流派：拾取追击${variant}，后续看引露脉冲与流萤聚辉`,
      "branch-lantern-gleam": "流派：拾取清场，经验就是触发器",
      "branch-lantern-vein": "流派：流萤/照影双核，命中少但回冷却与光束收益高",
      sigil: `流派：低频高收益${variant}，后续看裂月镜与照影回文`,
      "branch-sigil-echo": "流派：暗场爆发，触发少但收益高，吃分枝砚/宝箱棱镜",
      "branch-sigil-curtain": "流派：站定折幕，低频触发换大范围光束和屏幕压迫感",
      jade: `流派：雷刻点杀${variant}，触发慢但目标清晰、反馈强`,
      needle: `流派：针雨点杀${variant}，触发慢但多目标落点很清楚`,
      fan: `流派：扇面控场${variant}，发动不快但一次能扫出大片安全区`,
      umbrella: `流派：近身反打${variant}，被围时用护圈和伞骨马上看见收益`,
      "branch-jade-chain": "流派：低频连锁点杀，敌人密集时一次决策能马上看见收益",
      "branch-jade-ward": "流派：站定镇域，触发少但大范围减速和方阵压制很明显",
      "branch-needle-curtain": "流派：雨帘点杀，触发少但一次落下多条光雨，吃宝箱棱镜",
      "branch-needle-seal": "流派：减速定点，把霜弦/引露/站定转成范围雨纹收益",
      "branch-fan-gale": "流派：低频控场，挥一下留下风纹，回风和站定会明显放大收益",
      "branch-fan-feather": "流派：远端收割，宽扇给更多飞羽，回风让飞羽返场充能",
      "branch-umbrella-lotus": "流派：近身阵地，把一次护圈变成持续莲阵，吃站定、护圈、反刺",
      "branch-umbrella-echo": "流派：外圈追击，触发不快但一开伞就打远处，吃反刺和慢武器遗物",
      "branch-crane-echo": "流派：静止蓄力后移动释放，吃风步与万象墨锋",
      "ability-ink-mark": "解锁：墨锋超武与裂月镜；适合高频命中",
      "ability-dew-pulse": "解锁：拾取/脉冲流；联动霜弦、流萤、露砂漏",
      "ability-ember": "解锁：月焰击杀链与白月焰莲",
      "ability-crane-vow": "解锁：静止蓄力流；移动时集中爆发",
      "relic-moon-mirror": "遗物：强化墨印，也解锁照影回文",
      "relic-dew-hourglass": "遗物：把拾取脉冲转成武器冷却收益",
      "relic-star-chart": "遗物：星铃核心件，解锁星河轮和碎星",
      "relic-red-seal": "遗物：受伤后反打，适合高风险贴身构筑",
      "relic-chest-resonance": "遗物：宝箱变战斗爆发，奖励越多越强",
      "relic-lacquer-key": "遗物：宝箱给引露充能，补足拾取/脉冲流",
      "relic-branch-inkstone": "遗物：所有分支触发都回冷却，分支越多越值",
      "relic-chest-prism": "遗物：宝箱折射分支，1/3/5 奖励放大构筑",
      "relic-focus-lens": "遗物：站定阵地流核心，低频触发换高伤和强视觉反馈",
      "relic-tempo-bell": "遗物：慢武器补偿核心，触发频率低就用更醒目的重响换收益",
      "evolve-void-brush": "超武：墨锋终点，选后马上发动；适合贯穿和墨印爆发",
      "evolve-star-river": "超武：星铃终点，选后马上发动；适合回旋和碎星",
      "evolve-moon-lotus": "超武：月焰终点，选后马上发动；适合范围爆发和击杀链",
      "evolve-frost-zither": "超武：霜弦终点，选后马上发动；适合控场和引露循环",
      "evolve-rain-loom": "超武：雨墨针终点，选后马上发动；触发慢但一出手覆盖很大",
      "evolve-jade-fan": "超武：玉扇风终点，选后马上发动；发动慢但一出手就改战场",
      stride: "通用：提高走位和拾取，利好归潮/聚辉/纸鹤",
      heart: "通用：容错提升，适合贴身和受伤反打",
      focus: "通用：站定构筑核心；不选清辉入定就不会白送激光",
    };
    return hints[id] || "流派：通用成长，补强当前构筑";
  }

  function showUpgrades() {
    state = "upgrade";
    const pool = buildUpgradePool();
    renderUpgradeChoices(pool);
  }

  function renderUpgradeChoices(pool) {
    game.choices = pool;
    ui.choices.innerHTML = "";
    for (const up of pool) {
      const card = document.createElement("div");
      card.className = "choice";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.dataset.id = up.id;
      card.dataset.baseId = up.baseId || up.id;
      card.dataset.type = up.type || "升级";
      const routeOptions = getRouteOptions(up);
      card.innerHTML = `<span class="choice-icon mini-glyph" data-glyph="${up.baseId || up.id}" aria-hidden="true"></span><em>${up.type || "升级"}</em><strong>${up.baseName || up.name}</strong><span class="choice-level">${formatUpgradeLevel(up)}</span><span class="choice-effect">${routeOptions.length ? "本次升级从下面 2 条路线里选 1 条；以后再升级还可以重新选。" : describeUpgradeEffect(up)}</span><span class="choice-synergy">${describeUpgradeSynergy(up)}</span>${renderRouteChoices(up, routeOptions)}<span class="choice-desc">${describeChoiceNote(up)}</span>`;
      const choose = async (upgrade) => {
        if (transitioning) return;
        applyUpgrade(upgrade);
        updateHud();
        state = "transition";
        const changed = await playPageTransition(() => {
          ui.upgrade.classList.remove("visible");
          state = "playing";
          draw();
        });
        if (!changed) return;
        if (showQueuedUpgrade()) return;
        last = performance.now();
        requestAnimationFrame(loop);
      };
      card.addEventListener("click", async (event) => {
        const routeButton = event.target.closest(".route-option");
        if (routeButton) {
          const route = routeOptions.find((item) => item.variantId === routeButton.dataset.routeId);
          await choose(route || up);
          return;
        }
        await choose(up);
      });
      card.addEventListener("keydown", async (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          await choose(up);
        }
      });
      ui.choices.appendChild(card);
    }
    ui.upgrade.classList.add("visible");
    updateHud();
  }

  function getRouteOptions(upgrade) {
    const baseId = upgrade.baseId || upgrade.id;
    const variants = upgradeVariants[baseId];
    if (!variants?.length) return [];
    const base = upgrades.find((item) => item.id === baseId) || upgrade;
    return variants.map((variant) => makeVariantUpgrade(base, variant));
  }

  function renderRouteChoices(upgrade, routes) {
    if (!routes.length) return "";
    return `<div class="route-compare" aria-label="路线对比">${routes.map((route, index) => `<button class="route-option ${route.variantId === upgrade.variantId ? "is-selected" : ""}" type="button" data-route-id="${route.variantId}"><span>${index === 0 ? "路线一" : "路线二"} · ${route.variantName}</span><i class="route-tag">${route.routeContrast || "打法：本次生效"}</i><small>${plainRouteEffect(route.variantEffect)}</small></button>`).join("")}<p>两个都能点；喜欢另一边就直接选另一边，本次升级马上生效。</p></div>`;
  }

  function plainRouteEffect(effect = "") {
    return effect
      .replace(/^本次：/, "")
      .replace(/走/g, "适合")
      .replace(/流。/g, "玩法。")
      .replace(/流/g, "玩法")
      .replace(/冷却/g, "出手间隔")
      .replace(/触发/g, "发动")
      .replace(/收益/g, "好处");
  }

  function describeChoiceNote(upgrade) {
    const text = upgrade.baseDesc || upgrade.desc || "";
    const conditionMatch = text.match(/^(合成：[^。]+。|[^。]+后出现。)/);
    const condition = conditionMatch ? conditionMatch[1].replace(/^合成：/, "需要：").replace(/后出现。$/, "后会加入候选。") : "";
    const body = condition ? text.slice(conditionMatch[1].length).trim() : text;
    if (condition) return `${body} ${condition}`;
    if (upgrade.variantId) return `${text.replace(/本次方向：[^。]+。/, "").trim()} 可在两条路线之间反复选择。`;
    return text;
  }

  function buildUpgradePool() {
    const p = game.player;
    const available = upgrades.filter((up) => !up.available || up.available(p)).flatMap((up) => expandUpgradeVariants(up));
    const evolutionCandidates = available.filter((up) => up.type === "超武");
    const abilityCandidates = available.filter((up) => up.type === "能力");
    const relicCandidates = available.filter((up) => up.type === "遗物");
    const regularCandidates = available.filter((up) => !["能力", "遗物", "超武"].includes(up.type));
    const branchCandidates = available.filter((up) => (up.baseId || up.id).startsWith("branch-"));
    const abilityBranchCandidates = branchCandidates.filter((up) => up.type === "能力");
    const pool = [];
    const inPool = (candidate) => pool.some((item) => (item.baseId || item.id) === (candidate.baseId || candidate.id));
    const pushChoice = (candidate) => {
      if (candidate && !inPool(candidate)) pool.push(candidate);
    };

    if (evolutionCandidates.length) {
      pushChoice(pickOne(evolutionCandidates));
    }
    if ((p.level === 2 || game.abilityPickups < 2) && abilityCandidates.length) {
      pushChoice(pickOne(abilityCandidates));
    }
    if ((p.level >= 3 || game.abilityPickups > 0) && relicCandidates.length) {
      pushChoice(pickOne(relicCandidates));
    }
    if (branchCandidates.length && pool.length < 3) {
      pushChoice(pickOne((abilityBranchCandidates.length ? abilityBranchCandidates : branchCandidates).filter((up) => !inPool(up))));
    }
    while (pool.length < 3 && regularCandidates.length) {
      const pick = pickOne(regularCandidates.filter((up) => !pool.includes(up) && !pool.some((item) => (item.baseId || item.id) === (up.baseId || up.id))));
      if (!pick) break;
      pool.push(pick);
    }
    while (pool.length < 3 && available.length) {
      const pick = pickOne(available.filter((up) => !pool.includes(up)));
      if (!pick) break;
      pool.push(pick);
    }
    return pool.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  function expandUpgradeVariants(upgrade) {
    const variants = upgradeVariants[upgrade.id];
    if (!variants?.length) return [upgrade];
    return variants.map((variant) => makeVariantUpgrade(upgrade, variant));
  }

  function makeVariantUpgrade(upgrade, variant) {
    return {
      ...upgrade,
      id: `${upgrade.id}-${variant.id}`,
      baseId: upgrade.id,
      baseName: upgrade.name,
      baseDesc: upgrade.desc,
      variantId: variant.id,
      variantName: variant.name,
      variantEffect: variant.effect,
      routeContrast: variant.contrast,
      name: `${upgrade.name} · ${variant.name}`,
      desc: `${upgrade.desc} 本次方向：${variant.name}。每次升级都可重新选择方向，不依赖之前选择。`,
      variantApply: variant.apply,
    };
  }

  function pickOne(items) {
    if (!items.length) return null;
    return items[Math.floor(Math.random() * items.length)];
  }

  function update(dt) {
    const p = game.player;
    game.time += dt;
    game.wave = 1 + Math.floor(game.time / 38);
    p.invuln = Math.max(0, p.invuln - dt);
    p.characterTraitCooldown = Math.max(0, (p.characterTraitCooldown || 0) - dt);
    p.orbSurge = Math.max(0, p.orbSurge - dt);
    p.orbAngle += dt * (2.2 + p.orbs * 0.08 + (p.orbSurge > 0 ? 1.4 : 0));
    p.brushTimer -= dt;
    p.flameTimer -= dt;
    p.frostTimer -= dt;
    p.lanternTimer -= dt;
    p.sigilTimer -= dt;
    p.jadeTimer -= dt;
    p.needleTimer -= dt;
    p.fanTimer -= dt;
    p.umbrellaTimer -= dt;

    const mv = getMoveVector();
    p.x = clamp(p.x + mv.x * p.speed * dt, 28, world.w - 28);
    p.y = clamp(p.y + mv.y * p.speed * dt, 28, world.h - 28);
    updateStandingFocus(dt, mv);
    updateCraneVow(dt, mv);

    const target = nearestEnemy();
    if (target && p.brushTimer <= 0) {
      p.brushTimer = p.brushCooldown;
      const base = angleTo(p, target);
      for (let i = 0; i < p.brushCount; i += 1) {
        makeProjectile(p.x, p.y, base, (i - (p.brushCount - 1) / 2) * 0.16);
      }
      if (p.branches.brushRain) {
        p.brushRainCounter += 1 + (p.focusStillness > 0.55 ? 1 : 0);
        const threshold = Math.max(2, 5 - p.branches.brushRain - (p.evolutions.voidBrush ? 1 : 0));
        if (p.brushRainCounter >= threshold) {
          p.brushRainCounter = 0;
          triggerBrushRain(target.x, target.y, base, p.brushCount);
        }
      }
    }

    if (target && p.frostLevel > 0 && p.frostTimer <= 0) {
      p.frostTimer = p.frostCooldown;
      const base = angleTo(p, target);
      const count = 1 + Math.floor(p.frostLevel / 3);
      for (let i = 0; i < count; i += 1) {
        makeFrostString(p.x, p.y, base + (i - (count - 1) / 2) * 0.22, p.frostLevel);
      }
      addTrail(p.x, p.y, palette.lilac, 18 + p.frostLevel * 2, 0.28, "frost");
      spawnParticles(p.x, p.y, palette.lilac, 4 + p.frostLevel);
    }

    if (target && p.lanternLevel > 0 && p.lanternTimer <= 0) {
      p.lanternTimer = p.lanternCooldown;
      const base = angleTo(p, target);
      const count = 1 + Math.floor(p.lanternLevel / 2);
      for (let i = 0; i < count; i += 1) {
        const offset = (i - (count - 1) / 2) * 0.24;
        makeLanternWisp(p.x, p.y, base + offset, p.lanternLevel);
      }
      addTrail(p.x, p.y, palette.moss, 18 + p.lanternLevel * 3, 0.34, "lantern");
      spawnParticles(p.x, p.y, palette.moss, 5 + p.lanternLevel);
    }

    if (target && p.sigilLevel > 0 && p.sigilTimer <= 0) {
      p.sigilTimer = p.sigilCooldown;
      const base = angleTo(p, target);
      const count = p.sigilLevel >= 4 ? 2 : 1;
      for (let i = 0; i < count; i += 1) {
        makeSigilGlyph(p.x, p.y, base + (i - (count - 1) / 2) * 0.18, p.sigilLevel);
      }
      addTrail(p.x, p.y, palette.ink, 20 + p.sigilLevel * 3, 0.34, "sigil");
      spawnParticles(p.x, p.y, palette.lilac, 5 + p.sigilLevel);
      triggerTempoBell("sigil", p.x + Math.cos(base) * 62, p.y + Math.sin(base) * 62, p.sigilLevel);
    }

    if (target && p.jadeLevel > 0 && p.jadeTimer <= 0) {
      p.jadeTimer = p.jadeCooldown;
      triggerJadeStrike(p.jadeLevel);
    }

    if (target && p.needleLevel > 0 && p.needleTimer <= 0) {
      p.needleTimer = p.needleCooldown;
      triggerNeedleRain(p.needleLevel);
    }

    if (target && p.fanLevel > 0 && p.fanTimer <= 0) {
      p.fanTimer = p.fanCooldown;
      triggerFanGust(angleTo(p, target), p.fanLevel);
    }

    if (p.umbrellaLevel > 0 && p.umbrellaTimer <= 0) {
      p.umbrellaTimer = p.umbrellaCooldown;
      triggerUmbrellaBloom(p.umbrellaLevel);
    }

    if (p.flameLevel > 0 && p.flameTimer <= 0) {
      p.flameTimer = p.flameCooldown;
      const radius = 115 + p.flameLevel * 22 + p.mods.flameReach * 18 + (p.evolutions.moonLotus ? 36 : 0);
      game.blooms.push({ x: p.x, y: p.y, r: 18, max: radius, life: 0.48, color: palette.gold, kind: p.evolutions.moonLotus ? "lotus" : "flame" });
      for (const e of [...game.enemies]) {
        const d = dist(p, e);
        if (d < radius + e.r) dealDamage(e, (28 + p.flameLevel * 8 + (p.evolutions.moonLotus ? 16 : 0)) * p.damageMult, 20, p, "flame");
      }
      if (p.evolutions.moonLotus) {
        const inner = radius * 0.58;
        window.setTimeout(() => {
          if (state !== "playing") return;
          game.blooms.push({ x: p.x, y: p.y, r: 8, max: inner, life: 0.3, color: palette.coral, kind: "lotus" });
          for (const e of [...game.enemies]) {
            if (dist(p, e) < inner + e.r) dealDamage(e, 22 * p.damageMult, 10, p, "flame");
          }
        }, 180);
      }
      spawnParticles(p.x, p.y, palette.gold, p.evolutions.moonLotus ? 36 : 24);
      triggerTempoBell("flame", p.x, p.y, p.flameLevel + (p.evolutions.moonLotus ? 2 : 0));
    }

    updateSpawning(dt);
    updateEnemies(dt);
    updateWeapons(dt);
    updateGems(dt);
    updateChests(dt);
    updateParticles(dt);
    updateCamera();
    updateHud();

    if (p.hp <= 0) showGameOver();
  }

  function updateSpawning(dt) {
    game.spawnTimer -= dt;
    game.eliteTimer -= dt;
    const baseInterval = Math.max(0.14, 0.88 - game.time / 160);
    if (game.spawnTimer <= 0) {
      game.spawnTimer = baseInterval;
      const count = game.time > 70 ? 2 : 1;
      for (let i = 0; i < count; i += 1) spawnEnemy();
    }
    if (game.eliteTimer <= 0) {
      game.eliteTimer = 30 + rand(8, 16);
      spawnEnemy(false, true);
    }
    if (game.time > 135 && !game.bossSpawned) {
      game.bossSpawned = true;
      spawnEnemy(false, false, true);
    }
  }

  function updateEnemies(dt) {
    const p = game.player;
    for (const e of [...game.enemies]) {
      e.hit = Math.max(0, e.hit - dt);
      e.slow = Math.max(0, e.slow - dt);
      e.starShardCooldown = Math.max(0, (e.starShardCooldown || 0) - dt);
      const a = angleTo(e, p);
      const sway = Math.sin(game.time * 2 + e.phase) * 0.34;
      const speed = e.speed * (e.slow > 0 ? 0.55 : 1);
      e.x += Math.cos(a + sway * 0.18) * speed * dt;
      e.y += Math.sin(a + sway * 0.18) * speed * dt;
      e.x = clamp(e.x, 18, world.w - 18);
      e.y = clamp(e.y, 18, world.h - 18);
      const d = dist(e, p);
      if (d < e.r + p.r && p.invuln <= 0) {
        p.hp -= e.dmg;
        p.invuln = 0.68;
        if (p.relics.redSeal) p.redSealReady = true;
        shake = 9;
        spawnParticles(p.x, p.y, palette.coral, 16);
      }
    }
  }

  function updateWeapons(dt) {
    const p = game.player;
    for (const proj of [...game.projectiles]) {
      const px = proj.x;
      const py = proj.y;
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      proj.trailTimer = (proj.trailTimer || 0) - dt;
      if (proj.trailTimer <= 0) {
        proj.trailTimer = proj.source === "voidBrush" || proj.source === "crane" || proj.source === "craneFeather" || proj.source === "inkSplinter" || proj.source === "starShard" || proj.source === "frostString" || proj.source === "frostEcho" || proj.source === "frostZither" || proj.source === "lantern" || proj.source === "sigil" ? 0.018 : 0.028;
        addTrail(
          (px + proj.x) / 2,
          (py + proj.y) / 2,
          proj.source === "crane" || proj.source === "craneFeather" ? palette.gold : proj.color || palette.teal,
          proj.source === "voidBrush" ? 18 : proj.source === "crane" ? 14 + (proj.charge || 1) * 3 : proj.source === "craneFeather" ? 10 : proj.source === "inkSplinter" ? 8 : proj.source === "starShard" ? 9 : proj.source === "frostZither" ? 15 : proj.source === "frostString" ? 12 : proj.source === "frostEcho" ? 9 : proj.source === "lantern" ? 13 : proj.source === "sigil" ? 15 : 11,
          proj.source === "voidBrush" || proj.source === "crane" || proj.source === "craneFeather" || proj.source === "inkSplinter" || proj.source === "starShard" || proj.source === "frostString" || proj.source === "frostEcho" || proj.source === "frostZither" || proj.source === "lantern" || proj.source === "sigil" ? 0.42 : 0.26,
          proj.source === "mirror" ? "diamond" : proj.source === "crane" || proj.source === "craneFeather" ? "crane" : proj.source === "inkSplinter" ? "splinter" : proj.source === "starShard" ? "star" : proj.source === "frostString" || proj.source === "frostEcho" || proj.source === "frostZither" ? "frost" : proj.source === "lantern" ? "lantern" : proj.source === "sigil" ? "sigil" : "slash",
        );
      }
      proj.life -= dt;
      for (const e of [...game.enemies]) {
        if (Math.hypot(proj.x - e.x, proj.y - e.y) < proj.r + e.r) {
          dealDamage(e, proj.damage, 9, proj, proj.source || "brush");
          if (proj.source === "crane" && !proj.echoed) {
            proj.echoed = true;
            triggerCraneEcho(proj.x, proj.y, proj.angle, proj.charge || 1);
          }
          if ((proj.source === "brush" || proj.source === "voidBrush") && !proj.splintered) {
            proj.splintered = true;
            triggerBrushSplinters(proj.x, proj.y, proj.angle, proj.source === "voidBrush" ? 2 : 1);
          }
          if ((proj.source === "frostString" || proj.source === "frostZither") && !proj.echoed) {
            proj.echoed = true;
            e.slow = Math.max(e.slow || 0, (proj.source === "frostZither" ? 1.05 : 0.7) + game.player.branches.frostEcho * 0.12);
            triggerFrostEcho(proj.x, proj.y, proj.angle, (proj.strength || 1) + (proj.source === "frostZither" ? 1 : 0));
            triggerFrostLattice(proj.x, proj.y, (proj.strength || 1) + (proj.source === "frostZither" ? 1 : 0));
          }
          if (proj.source === "frostEcho") {
            e.slow = Math.max(e.slow || 0, 0.52);
            addDewCharge(0.18 + game.player.mods.frostPulse * 0.08);
          }
          if (proj.source === "lantern") {
            addDewCharge(0.1 + game.player.branches.lanternGleam * 0.04);
            if ((e.lanternVeinAt || -99) + 0.28 < game.time) {
              e.lanternVeinAt = game.time;
              triggerLanternVein(proj.x, proj.y, proj.strength || 1);
            }
          }
          if (proj.source === "sigil" && !proj.echoed) {
            proj.echoed = true;
            triggerSigilEcho(proj.x, proj.y, proj.angle, proj.strength || 1);
            triggerSigilCurtain(proj.x, proj.y, proj.angle, proj.strength || 1);
          }
          proj.pierce -= 1;
          if (game.player.relics.starChart && ["brush", "voidBrush"].includes(proj.source || "brush")) game.player.orbSurge = 1.15;
          spawnParticles(proj.x, proj.y, proj.color || palette.teal, 5);
          addTrail(proj.x, proj.y, proj.source === "crane" || proj.source === "craneFeather" ? palette.gold : proj.color || palette.teal, proj.source === "voidBrush" ? 28 : proj.source === "crane" ? 22 : proj.source === "craneFeather" ? 14 : proj.source === "inkSplinter" ? 12 : proj.source === "starShard" ? 14 : proj.source === "frostZither" ? 22 : proj.source === "frostString" ? 18 : proj.source === "frostEcho" ? 13 : proj.source === "lantern" ? 18 : proj.source === "sigil" ? 22 : 16, 0.34, proj.source === "crane" || proj.source === "craneFeather" ? "crane" : proj.source === "inkSplinter" ? "splinter" : proj.source === "starShard" ? "star" : proj.source === "frostString" || proj.source === "frostEcho" || proj.source === "frostZither" ? "frost" : proj.source === "lantern" ? "lantern" : proj.source === "sigil" ? "sigil" : "burst");
          if (proj.pierce < 0) proj.life = -1;
          break;
        }
      }
      if (proj.life <= 0) game.projectiles.splice(game.projectiles.indexOf(proj), 1);
    }

    const orbLayers = p.evolutions.starRiver ? 2 : 1;
    for (let layer = 0; layer < orbLayers; layer += 1) {
      for (let i = 0; i < p.orbs; i += 1) {
        const a = p.orbAngle * (layer ? -0.74 : 1) + (i / p.orbs) * Math.PI * 2 + layer * 0.35;
        const radius = (layer ? 96 : p.evolutions.starRiver ? 62 : 64) + p.mods.orbOrbit * 8;
        const orb = { x: p.x + Math.cos(a) * radius, y: p.y + Math.sin(a) * radius, r: p.evolutions.starRiver ? 15 : 13 };
      for (const e of [...game.enemies]) {
        if (Math.hypot(orb.x - e.x, orb.y - e.y) < orb.r + e.r) {
          e.slow = p.evolutions.starRiver ? 0.45 : 0.25;
          dealDamage(e, p.orbDamage * p.damageMult * dt * (p.evolutions.starRiver ? 4.4 : 3.2), 2, orb, "orb");
          if (p.branches.orbShatter && (e.starShardCooldown || 0) <= 0) {
            e.starShardCooldown = p.evolutions.starRiver ? 0.28 : 0.42;
            triggerStarShards(orb.x, orb.y, angleTo(p, e), layer + 1);
          }
          if (Math.random() < (p.evolutions.starRiver ? 0.34 : 0.16)) {
            addTrail(orb.x, orb.y, layer ? palette.lilac : palette.gold, p.evolutions.starRiver ? 16 : 12, 0.28, "star");
          }
        }
      }
      }
    }

    for (const bloom of [...game.blooms]) {
      bloom.r += (bloom.max - bloom.r) * Math.min(1, dt * 9);
      bloom.life -= dt;
      if (bloom.life <= 0) game.blooms.splice(game.blooms.indexOf(bloom), 1);
    }
    updateTrails(dt);
  }

  function updateTrails(dt) {
    for (const trail of [...game.trails]) {
      trail.life -= dt;
      trail.radius += dt * 18;
      if (trail.life <= 0) game.trails.splice(game.trails.indexOf(trail), 1);
    }
  }

  function updateGems(dt) {
    const p = game.player;
    for (const gem of [...game.gems]) {
      gem.life += dt;
      gem.y += Math.sin(gem.life * 5) * dt * 9 + gem.vy * dt * 0.2;
      const d = dist(gem, p);
      if (d < p.pickup || gem.life > 1.15) {
        const a = angleTo(gem, p);
        const rangeFactor = clamp(1 - d / Math.max(p.pickup, 1), 0.08, 1);
        const pull = rangeFactor * 540 + (gem.life > 1.15 ? 150 : 120);
        gem.x += Math.cos(a) * pull * dt;
        gem.y += Math.sin(a) * pull * dt;
      }
      if (d < p.r + gem.r + 8) {
        gainXp(gem.value);
        addDewCharge(gem.value);
        if (p.characterId === "lantern-child" && p.characterTraitCooldown <= 0) {
          p.characterTraitCounter += gem.value;
          if (p.characterTraitCounter >= 5) {
            p.characterTraitCounter = 0;
            triggerCharacterTrait("lantern", gem.x, gem.y, gem.value);
          }
        }
        if (p.branches.orbRecall) triggerStarRecall(gem.value);
        if (p.branches.lanternGleam) triggerLanternGleam(gem.x, gem.y, gem.value);
        spawnParticles(gem.x, gem.y, palette.lilac, 7);
        game.gems.splice(game.gems.indexOf(gem), 1);
      }
    }
  }

  function updateChests(dt) {
    const p = game.player;
    for (const chest of [...game.chests]) {
      chest.life += dt;
      chest.y += Math.sin(chest.life * 3 + chest.phase) * dt * 6;
      if (dist(chest, p) < p.r + chest.r + 18) {
        game.chests.splice(game.chests.indexOf(chest), 1);
        openChest(chest);
        break;
      }
    }
  }

  function openChest(chest) {
    if (state !== "playing") return;
    state = "chest";
    game.chestsOpened += 1;
    game.chestState = {
      chest,
      rewards: buildChestRewards(chest.rewardCount),
      revealed: false,
      clicks: 0,
      timer: null,
      remaining: null,
      revealDueAt: performance.now() + 2400,
    };
    ui.chestTitle.textContent = `${chest.rewardCount} 道月匣奖励`;
    ui.chestRewards.innerHTML = "";
    ui.chest.classList.add("visible");
    ui.chest.classList.remove("revealed");
    game.chestState.timer = window.setTimeout(() => revealChest(false), 2400);
  }

  function buildChestRewards(count) {
    const rewards = [];
    for (let i = 0; i < count; i += 1) {
      const available = upgrades.filter((up) => (!up.available || up.available(game.player)) && !rewards.some((reward) => reward.id === up.id));
      const superItems = available.filter((up) => up.type === "超武");
      const relicItems = available.filter((up) => up.type === "遗物");
      const abilityItems = available.filter((up) => up.type === "能力");
      const regularItems = available.filter((up) => !["超武", "遗物", "能力"].includes(up.type));
      const roll = Math.random();
      const bucket =
        superItems.length && roll < 0.22
          ? superItems
          : relicItems.length && roll < 0.48
            ? relicItems
            : abilityItems.length && roll < 0.68
              ? abilityItems
              : regularItems.length
                ? regularItems
                : available;
      const reward = pickOne(bucket.length ? bucket : available);
      if (!reward) break;
      rewards.push(reward);
    }
    return rewards;
  }

  function revealChest(skipped) {
    const chestState = game.chestState;
    if (!chestState || chestState.revealed) return;
    if (chestState.timer) window.clearTimeout(chestState.timer);
    chestState.timer = null;
    chestState.remaining = null;
    chestState.revealed = true;
    ui.chest.classList.add("revealed");
    ui.chestTitle.textContent = skipped ? "月匣已应声而开" : "月匣绽放";
    ui.chestRewards.innerHTML = "";
    for (const reward of chestState.rewards) {
      applyUpgrade(reward);
      const card = document.createElement("article");
      card.className = "reward-card";
      card.dataset.id = reward.id;
      card.dataset.type = reward.type || "升级";
      card.innerHTML = `<em>${reward.type || "升级"}</em><strong>${reward.name}</strong><span>${reward.desc}</span>`;
      ui.chestRewards.appendChild(card);
    }
    if (game.player.relics.chestResonance) {
      triggerChestResonance(chestState.rewards.length);
    }
    if (game.player.relics.lacquerKey) {
      addDewCharge(chestState.rewards.length * 2);
    }
    if (game.player.relics.chestPrism) {
      triggerChestPrism(chestState.rewards.length);
    }
    updateHud();
  }

  function closeChest() {
    if (state !== "chest" || !game.chestState?.revealed) return;
    ui.chest.classList.remove("visible", "revealed");
    game.chestState = null;
    state = "playing";
    if (showQueuedUpgrade()) return;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function updateParticles(dt) {
    for (const part of [...game.particles]) {
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.vx *= 1 - dt * 3.5;
      part.vy *= 1 - dt * 3.5;
      part.life -= dt;
      if (part.life <= 0) game.particles.splice(game.particles.indexOf(part), 1);
    }
    for (const e of game.enemies) {
      e.ember = Math.max(0, (e.ember || 0) - dt);
    }
    for (const beam of [...game.beams]) {
      beam.life -= dt;
      if (beam.life <= 0) game.beams.splice(game.beams.indexOf(beam), 1);
    }
    shake = Math.max(0, shake - dt * 22);
  }

  function updateCamera() {
    const p = game.player;
    camera.x += (p.x - canvas.clientWidth / 2 - camera.x) * 0.12;
    camera.y += (p.y - canvas.clientHeight / 2 - camera.y) * 0.12;
    camera.x = clamp(camera.x, 0, world.w - canvas.clientWidth);
    camera.y = clamp(camera.y, 0, world.h - canvas.clientHeight);
  }

  function updateHud() {
    const p = game.player;
    if (!p) return;
    const hpPercent = clamp((p.hp / p.maxHp) * 100, 0, 100);
    const hpNow = Math.max(0, Math.ceil(p.hp));
    const hpMax = Math.ceil(p.maxHp);
    document.body.dataset.gameState = state;
    ui.timeText.textContent = formatTime(game.time);
    ui.levelText.textContent = p.level;
    ui.xpText.textContent = `${p.xp} / ${p.nextXp}`;
    ui.killText.textContent = game.kills;
    ui.buildText.textContent = `${game.abilityPickups}/${game.relicPickups}/${game.evolutionPickups}`;
    ui.runSubtitle.textContent = `第 ${game.wave} 潮`;
    ui.healthBar.style.width = `${hpPercent}%`;
    ui.healthText.textContent = `生命 ${hpNow} / ${hpMax} · ${Math.round(hpPercent)}%`;
    ui.healthBar.parentElement.dataset.healthState = hpPercent <= 30 ? "danger" : hpPercent <= 55 ? "wound" : "steady";
    ui.healthBar.parentElement.setAttribute("aria-valuemax", hpMax);
    ui.healthBar.parentElement.setAttribute("aria-valuenow", hpNow);
    ui.xpBar.style.width = `${clamp((p.xp / p.nextXp) * 100, 0, 100)}%`;
    renderBuildPanels();
  }

  function renderBuildPanels() {
    const p = game.player;
    if (!p) return;
    renderBuildPanel(ui.weaponBuildPanel, "武器", collectWeapons(p));
    renderBuildPanel(ui.relicBuildPanel, "遗物", collectRelics(p));
    renderBuildPanel(ui.traitBuildPanel, "特性", collectTraits(p));
  }

  function renderBuildPanel(panel, title, items) {
    const expanded = !!buildPanelExpanded[panel.id];
    panel.dataset.expanded = expanded ? "true" : "false";
    const thumbHtml = items.length
      ? items.map((item) => `<span class="build-thumb" data-id="${item.id}" data-type="${item.type}" title="${item.name} ${item.value || ""} · ${item.desc || ""}" aria-label="${item.name} ${item.value || ""}" tabindex="0"><span class="mini-glyph" data-glyph="${item.id}" aria-hidden="true"></span></span>`).join("")
      : `<span class="build-thumb build-thumb-empty" title="未选择" aria-label="${title}未选择"></span>`;
    const itemHtml = items.length
      ? items.map((item) => `<div class="build-chip" data-id="${item.id}" data-type="${item.type}" title="${item.desc || item.name}"><span class="mini-glyph" data-glyph="${item.id}" aria-hidden="true"></span><b>${item.name}</b><em>${item.value || ""}</em></div>`).join("")
      : `<div class="build-empty">未选择</div>`;
    panel.innerHTML = `<div class="build-panel-title"><span>${title}</span><strong>${items.length}</strong><button class="build-panel-toggle" type="button" aria-label="${expanded ? "收起" : "展开"}${title}面板" aria-expanded="${expanded}">${expanded ? "−" : "+"}</button></div><div class="build-panel-thumbs" aria-label="${title}缩略图">${thumbHtml}</div><div class="build-panel-items">${itemHtml}</div>`;
  }

  function weaponRouteValue(levelText, routes) {
    const activeRoutes = routes.filter((route) => route.value > 0);
    if (!activeRoutes.length) return levelText;
    return `${levelText} · 路线 ${routes.map((route) => `${route.name} ${route.value}`).join(" / ")}`;
  }

  function collectWeapons(p) {
    const items = [];
    if (p.brushCount) items.push({ id: "brush", type: "武器", name: "墨锋", value: weaponRouteValue(`Lv ${p.brushCount}/${upgradeCaps.brush}`, [{ name: "更快出手", value: p.mods.brushSpeed }, { name: "更痛爆开", value: p.mods.brushForce }]), desc: "自动飞出的墨锋" });
    if (p.orbs) items.push({ id: "orb", type: "武器", name: "星铃", value: weaponRouteValue(`Lv ${p.orbs}/${upgradeCaps.orb}`, [{ name: "转得更大", value: p.mods.orbOrbit }, { name: "转得更快", value: p.mods.orbTempo }]), desc: "环绕切割的星铃" });
    if (p.flameLevel) items.push({ id: "flame", type: "武器", name: "月焰", value: weaponRouteValue(`Lv ${p.flameLevel}/${upgradeCaps.flame}`, [{ name: "烧得更远", value: p.mods.flameReach }, { name: "烧得更勤", value: p.mods.flameTempo }]), desc: "周期扩散的月焰" });
    if (p.frostLevel) items.push({ id: "frost", type: "武器", name: "霜弦", value: weaponRouteValue(`Lv ${p.frostLevel}/${upgradeCaps.frost}`, [{ name: "穿更多人", value: p.mods.frostPierce }, { name: "冻得更久", value: p.mods.frostPulse }]), desc: "穿刺并减速的霜弦" });
    if (p.lanternLevel) items.push({ id: "lantern", type: "武器", name: "流萤灯", value: weaponRouteValue(`Lv ${p.lanternLevel}/${upgradeCaps.lantern}`, [{ name: "飞得更勤", value: p.mods.lanternSwarm }, { name: "每下更亮", value: p.mods.lanternRadiance }]), desc: "追光流萤自动追击" });
    if (p.sigilLevel) items.push({ id: "sigil", type: "武器", name: "照影符", value: weaponRouteValue(`Lv ${p.sigilLevel}/${upgradeCaps.sigil}`, [{ name: "直线更长", value: p.mods.sigilLine }, { name: "暗场更稳", value: p.mods.sigilVeil }]), desc: "低频直线影符，高收益贯穿" });
    if (p.jadeLevel) items.push({ id: "jade", type: "武器", name: "玉简雷", value: weaponRouteValue(`Lv ${p.jadeLevel}/${upgradeCaps.jade}`, [{ name: "分雷点杀", value: p.mods.jadeFork }, { name: "镇住一片", value: p.mods.jadeSeal }]), desc: "玉简雷刻锁定点杀" });
    if (p.needleLevel) items.push({ id: "needle", type: "武器", name: "雨墨针", value: weaponRouteValue(`Lv ${p.needleLevel}/${upgradeCaps.needle}`, [{ name: "下得更密", value: p.mods.needleShower }, { name: "钉住目标", value: p.mods.needleSeal }]), desc: "天幕垂落细针雨" });
    if (p.fanLevel) items.push({ id: "fan", type: "武器", name: "玉扇风", value: weaponRouteValue(`Lv ${p.fanLevel}/${upgradeCaps.fan}`, [{ name: "扇面更宽", value: p.mods.fanWide }, { name: "回风追打", value: p.mods.fanReturn }]), desc: "低频扇面弧风，扫出安全区" });
    if (p.umbrellaLevel) items.push({ id: "umbrella", type: "武器", name: "墨莲伞", value: weaponRouteValue(`Lv ${p.umbrellaLevel}/${upgradeCaps.umbrella}`, [{ name: "护圈更稳", value: p.mods.umbrellaGuard }, { name: "伞骨反刺", value: p.mods.umbrellaSpine }]), desc: "近身护圈，伞骨反打外圈敌人" });
    if (p.branches.brushSplinter) items.push({ id: "branch-brush-splinter", type: "武器", name: "墨锋散毫", value: `Lv ${p.branches.brushSplinter}/${upgradeCaps["branch-brush-splinter"]}`, desc: "墨锋命中裂出细毫" });
    if (p.branches.brushRain) items.push({ id: "branch-brush-rain", type: "武器", name: "墨锋骤雨", value: `Lv ${p.branches.brushRain}/${upgradeCaps["branch-brush-rain"]}`, desc: "墨锋齐射落下碑拓墨雨" });
    if (p.branches.orbRecall) items.push({ id: "branch-orb-recall", type: "武器", name: "星铃归潮", value: `Lv ${p.branches.orbRecall}/${upgradeCaps["branch-orb-recall"]}`, desc: "拾取月露触发召回星纹" });
    if (p.branches.orbShatter) items.push({ id: "branch-orb-shatter", type: "武器", name: "星铃碎星", value: `Lv ${p.branches.orbShatter}/${upgradeCaps["branch-orb-shatter"]}`, desc: "星铃命中裂出碎星" });
    if (p.branches.flameCinder) items.push({ id: "branch-flame-cinder", type: "武器", name: "月焰烬环", value: `Lv ${p.branches.flameCinder}/${upgradeCaps["branch-flame-cinder"]}`, desc: "余烬击杀触发焰环" });
    if (p.branches.flameTide) items.push({ id: "branch-flame-tide", type: "武器", name: "月焰潮汐", value: `Lv ${p.branches.flameTide}/${upgradeCaps["branch-flame-tide"]}`, desc: "引露脉冲展开月焰潮" });
    if (p.branches.lanternGleam) items.push({ id: "branch-lantern-gleam", type: "武器", name: "流萤聚辉", value: `Lv ${p.branches.lanternGleam}/${upgradeCaps["branch-lantern-gleam"]}`, desc: "拾取月露爆出萤辉" });
    if (p.branches.lanternVein) items.push({ id: "branch-lantern-vein", type: "武器", name: "流萤织径", value: `Lv ${p.branches.lanternVein}/${upgradeCaps["branch-lantern-vein"]}`, desc: "流萤命中织出萤径光束" });
    if (p.branches.sigilEcho) items.push({ id: "branch-sigil-echo", type: "武器", name: "照影回文", value: `Lv ${p.branches.sigilEcho}/${upgradeCaps["branch-sigil-echo"]}`, desc: "影符命中展开回照暗场" });
    if (p.branches.sigilCurtain) items.push({ id: "branch-sigil-curtain", type: "武器", name: "照影折幕", value: `Lv ${p.branches.sigilCurtain}/${upgradeCaps["branch-sigil-curtain"]}`, desc: "影符命中折出暗幕光束" });
    if (p.branches.jadeChain) items.push({ id: "branch-jade-chain", type: "武器", name: "玉简连弧", value: `Lv ${p.branches.jadeChain}/${upgradeCaps["branch-jade-chain"]}`, desc: "玉简雷命中折出连锁玉弧" });
    if (p.branches.jadeWard) items.push({ id: "branch-jade-ward", type: "武器", name: "玉简镇域", value: `Lv ${p.branches.jadeWard}/${upgradeCaps["branch-jade-ward"]}`, desc: "雷刻落点展开方阵镇域" });
    if (p.branches.needleCurtain) items.push({ id: "branch-needle-curtain", type: "武器", name: "雨墨帘", value: `Lv ${p.branches.needleCurtain}/${upgradeCaps["branch-needle-curtain"]}`, desc: "针雨命中追加纵向雨帘" });
    if (p.branches.needleSeal) items.push({ id: "branch-needle-seal", type: "武器", name: "定雨纹", value: `Lv ${p.branches.needleSeal}/${upgradeCaps["branch-needle-seal"]}`, desc: "针雨命中减速目标展开雨纹" });
    if (p.branches.fanGale) items.push({ id: "branch-fan-gale", type: "武器", name: "玉扇回廊", value: `Lv ${p.branches.fanGale}/${upgradeCaps["branch-fan-gale"]}`, desc: "扇风命中后展开回廊风纹" });
    if (p.branches.fanFeather) items.push({ id: "branch-fan-feather", type: "武器", name: "玉扇裂羽", value: `Lv ${p.branches.fanFeather}/${upgradeCaps["branch-fan-feather"]}`, desc: "扇风边缘飞出玉羽追远处敌人" });
    if (p.branches.umbrellaLotus) items.push({ id: "branch-umbrella-lotus", type: "武器", name: "墨伞莲阵", value: `Lv ${p.branches.umbrellaLotus}/${upgradeCaps["branch-umbrella-lotus"]}`, desc: "护伞张开后留下短暂阵地" });
    if (p.branches.umbrellaEcho) items.push({ id: "branch-umbrella-echo", type: "武器", name: "伞影回潮", value: `Lv ${p.branches.umbrellaEcho}/${upgradeCaps["branch-umbrella-echo"]}`, desc: "护伞张开后追打外圈敌人" });
    if (p.branches.frostEcho) items.push({ id: "branch-frost-echo", type: "武器", name: "霜弦裂音", value: `Lv ${p.branches.frostEcho}/${upgradeCaps["branch-frost-echo"]}`, desc: "霜弦命中裂出寒音" });
    if (p.branches.frostLattice) items.push({ id: "branch-frost-lattice", type: "武器", name: "霜弦封阵", value: `Lv ${p.branches.frostLattice}/${upgradeCaps["branch-frost-lattice"]}`, desc: "霜弦命中展开六角霜阵" });
    if (p.evolutions.voidBrush) items.push({ id: "evolve-void-brush", type: "超武", name: "万象墨锋", value: "Lv 1/1", desc: "贯穿墨月，更快引爆墨印" });
    if (p.evolutions.starRiver) items.push({ id: "evolve-star-river", type: "超武", name: "星河轮", value: "Lv 1/1", desc: "双层星河切割" });
    if (p.evolutions.moonLotus) items.push({ id: "evolve-moon-lotus", type: "超武", name: "白月焰莲", value: "Lv 1/1", desc: "双重焰莲爆燃" });
    if (p.evolutions.frostZither) items.push({ id: "evolve-frost-zither", type: "超武", name: "霜月琴", value: "Lv 1/1", desc: "琴音贯穿，寒音充能" });
    if (p.evolutions.rainLoom) items.push({ id: "evolve-rain-loom", type: "超武", name: "天雨织机", value: "Lv 1/1", desc: "雨线网络，放大针雨分支" });
    if (p.evolutions.jadeFan) items.push({ id: "evolve-jade-fan", type: "超武", name: "清风玉阙", value: "Lv 1/1", desc: "双层风墙，放大玉扇回廊" });
    return items;
  }

  function collectRelics(p) {
    const relics = [
      ["relic-moon-mirror", p.relics.moonMirror, "裂月镜", "墨印爆发射出月片"],
      ["relic-dew-hourglass", p.relics.dewHourglass, "露砂漏", "引露脉冲回转武器冷却"],
      ["relic-star-chart", p.relics.starChart, "星盘", "星铃强化墨锋"],
      ["relic-red-seal", p.relics.redSeal, "朱砂印", "受伤后击破治疗并爆发"],
      ["relic-chest-resonance", p.relics.chestResonance, "匣心回响", "宝箱奖励触发月匣脉冲"],
      ["relic-lacquer-key", p.relics.lacquerKey, "漆钥", "宝箱奖励为引露脉冲充能"],
      ["relic-branch-inkstone", p.relics.branchInkstone, "分枝砚", "分支触发回冷却并充能"],
      ["relic-chest-prism", p.relics.chestPrism, "匣纹棱镜", "宝箱奖励折射已拥有分支"],
      ["relic-focus-lens", p.relics.focusLens, "寂光砚", "站定凝神追加侧光束"],
      ["relic-route-charm", p.relics.routeCharm, "转向签", "选路线立刻回响并回出手间隔"],
      ["relic-tempo-bell", p.relics.tempoBell, "重响磬", "慢武器出手追加重响"],
    ];
    return relics.filter(([, owned]) => owned).map(([id, , name, desc]) => ({ id, type: "遗物", name, value: "Lv 1/1", desc }));
  }

  function getBuildArchetype(p) {
    const scores = [
      {
        name: "墨印贯穿",
        id: "archetype-ink",
        score: p.brushCount + p.mods.brushForce + p.mods.brushSpeed + p.branches.brushSplinter * 2 + p.branches.brushRain * 2 + (p.abilities.inkMark ? 2 : 0) + (p.evolutions.voidBrush ? 4 : 0),
        desc: "核心：墨锋、墨印连锁、散毫/骤雨、万象墨锋",
      },
      {
        name: "星铃回旋",
        id: "archetype-star",
        score: p.orbs + p.mods.orbOrbit + p.mods.orbTempo + p.branches.orbRecall + p.branches.orbShatter * 2 + (p.relics.starChart ? 3 : 0) + (p.evolutions.starRiver ? 4 : 0),
        desc: "核心：星铃、星盘、归潮/碎星、星河轮",
      },
      {
        name: "月焰爆发",
        id: "archetype-flame",
        score: p.flameLevel + p.mods.flameReach + p.mods.flameTempo + p.branches.flameCinder * 2 + p.branches.flameTide + (p.abilities.emberWeb ? 3 : 0) + (p.evolutions.moonLotus ? 4 : 0),
        desc: "核心：月焰、余烬织线、烬环/潮汐、白月焰莲",
      },
      {
        name: "引露拾取",
        id: "archetype-dew",
        score: p.lanternLevel + p.mods.lanternSwarm + p.mods.lanternRadiance + p.branches.lanternGleam * 2 + p.branches.lanternVein * 2 + (p.abilities.dewPulse ? 3 : 0) + (p.relics.dewHourglass ? 2 : 0) + Math.max(0, Math.floor((p.pickup - 135) / 30)),
        desc: "核心：流萤灯、引露脉冲、聚辉/织径、露砂漏/漆钥",
      },
      {
        name: "霜弦控场",
        id: "archetype-frost",
        score: p.frostLevel + p.mods.frostPierce + p.mods.frostPulse + p.branches.frostEcho * 2 + p.branches.frostLattice * 2 + (p.evolutions.frostZither ? 4 : 0),
        desc: "核心：霜弦、引露脉冲、裂音/封阵、霜月琴",
      },
      {
        name: "照影暗场",
        id: "archetype-sigil",
        score: p.sigilLevel + p.mods.sigilLine + p.mods.sigilVeil + p.branches.sigilEcho * 3 + p.branches.sigilCurtain * 2 + p.branches.lanternVein + (p.relics.moonMirror ? 2 : 0),
        desc: "核心：照影符、裂月镜、回文/折幕、流萤织径",
      },
      {
        name: "玉简点杀",
        id: "archetype-jade",
        score: p.jadeLevel + p.mods.jadeFork * 2 + p.mods.jadeSeal * 2 + p.branches.jadeChain * 2 + p.branches.jadeWard * 3 + getPickCount("focus") + (p.relics.focusLens ? 3 : 0) + (p.relics.tempoBell ? 2 : 0),
        desc: "核心：玉简雷、分雷/镇刻、玉简连弧/镇域、清辉入定、重响磬",
      },
      {
        name: "针雨定点",
        id: "archetype-needle",
        score: p.needleLevel + p.mods.needleShower * 2 + p.mods.needleSeal * 2 + p.branches.needleCurtain * 3 + p.branches.needleSeal * 3 + (p.evolutions.rainLoom ? 5 : 0) + (p.abilities.dewPulse ? 2 : 0) + (p.frostLevel > 0 ? 2 : 0) + getPickCount("focus") + (p.relics.tempoBell ? 2 : 0),
        desc: "核心：雨墨针、疾雨/定雨、雨墨帘/定雨纹、重响磬、天雨织机",
      },
      {
        name: "玉扇控场",
        id: "archetype-fan",
        score: p.fanLevel + p.mods.fanWide * 2 + p.mods.fanReturn * 2 + p.branches.fanGale * 3 + p.branches.fanFeather * 2 + getPickCount("focus") + (p.abilities.dewPulse && p.mods.fanReturn ? 2 : 0) + (p.evolutions.jadeFan ? 5 : 0) + (p.relics.tempoBell ? 2 : 0),
        desc: "核心：玉扇风、宽扇/回风、玉扇回廊/裂羽、重响磬、清风玉阙",
      },
      {
        name: "墨莲反打",
        id: "archetype-umbrella",
        score: p.umbrellaLevel + p.mods.umbrellaGuard * 2 + p.mods.umbrellaSpine * 2 + p.branches.umbrellaLotus * 3 + p.branches.umbrellaEcho * 3 + getPickCount("focus") + (p.relics.tempoBell ? 2 : 0),
        desc: "核心：墨莲伞、护圈/反刺、墨伞莲阵/伞影回潮、站定凝神、重响磬",
      },
      {
        name: "纸鹤蓄势",
        id: "archetype-crane",
        score: (p.abilities.craneVow ? 3 : 0) + p.branches.craneEcho * 2 + Math.max(0, Math.floor((p.speed - 190) / 28)) + (p.evolutions.voidBrush ? 1 : 0) + (p.relics.focusLens ? 2 : 0),
        desc: "核心：纸鹤誓约、风步、回羽、静止凝神、寂光砚",
      },
    ].sort((a, b) => b.score - a.score);
    return scores[0];
  }

  function collectTraits(p) {
    const traits = [
      [`character-${p.characterId || "wanderer"}`, true, p.characterName || "月墨行者", p.characterRole || "均衡起式"],
      ["ability-ink-mark", p.abilities.inkMark, "墨印连锁", "命中叠墨印，4 层爆开"],
      ["ability-dew-pulse", p.abilities.dewPulse, "引露脉冲", `月露蓄能 ${p.dewCharge}/${p.dewThreshold}`],
      ["ability-ember", p.abilities.emberWeb, "余烬织线", "月焰留下余烬，墨印爆发二次点燃"],
      ["ability-crane-vow", p.abilities.craneVow, "纸鹤誓约", `纸鹤 ${p.craneCharges}/3`],
    ]
      .filter(([, owned]) => owned)
      .map(([id, , name, desc]) => ({ id, type: "能力", name, value: "Lv 1/1", desc }));
    if (p.characterTraitName) {
      const threshold = p.characterId === "wanderer" ? 4 : p.characterId === "ember-warden" ? 4 : p.characterId === "lantern-child" ? 5 : p.characterId === "bell-dancer" ? 5 : 3;
      const counterText = `${Math.floor(p.characterTraitCounter || 0)}/${threshold}`;
      traits.push({
        id: `trait-${p.characterId}`,
        type: "特性",
        name: p.characterTraitName,
        value: p.characterTraitCooldown > 0 ? "回响中" : counterText,
        desc: p.characterTraitDesc,
      });
    }
    if (p.branches.craneEcho) traits.push({ id: "branch-crane-echo", type: "能力", name: "纸鹤回羽", value: `Lv ${p.branches.craneEcho}/${upgradeCaps["branch-crane-echo"]}`, desc: "纸鹤命中分裂回羽" });
    const archetype = getBuildArchetype(p);
    if (archetype.score >= 6) traits.push({ id: archetype.id, type: "流派", name: "当前流派", value: archetype.name, desc: archetype.desc });
    const directionScore = Object.values(p.mods).reduce((sum, value) => sum + value, 0);
    if (directionScore) traits.push({ id: "focus", type: "能力", name: "构筑方向", value: `已选 ${directionScore}`, desc: "每次武器升级都可二选一改变方向" });
    if (getPickCount("focus") > 0 && p.focusStillness > 0.55) traits.push({ id: "focus", type: "能力", name: "静止凝神", value: getPickCount("focus") >= 2 && p.focusStillness > 1.05 ? "激光" : "攻速+", desc: "清辉入定后，站定换取攻速和额外光束" });
    for (const pick of game.picks.filter((item) => ["身法", "生存"].includes(item.type))) {
      traits.push({ ...pick, value: `Lv ${pick.count}/${upgradeCaps[pick.id] || "∞"}` });
    }
    return traits;
  }

  function renderCodex() {
    const p = game.player;
    if (!p) return;
    ui.codexGrid.innerHTML = "";
    const flatItems = codexSections.flatMap((section) => section.items);
    const ownedCount = flatItems.filter((item) => item.owned?.(p)).length;
    const readyCount = flatItems.filter((item) => item.ready?.(p)).length;
    const weaponLevel = p.brushCount + p.orbs + p.flameLevel + p.frostLevel + p.lanternLevel + p.sigilLevel + p.jadeLevel + p.needleLevel + p.fanLevel + p.umbrellaLevel + p.branches.brushSplinter + p.branches.brushRain + p.branches.orbRecall + p.branches.orbShatter + p.branches.flameCinder + p.branches.flameTide + p.branches.lanternGleam + p.branches.lanternVein + p.branches.sigilEcho + p.branches.sigilCurtain + p.branches.frostEcho + p.branches.frostLattice + p.branches.jadeChain + p.branches.jadeWard + p.branches.needleCurtain + p.branches.needleSeal + p.branches.fanGale + p.branches.fanFeather + p.branches.umbrellaLotus + p.branches.umbrellaEcho;
    ui.codexSummary.innerHTML = `<span>武器层级<strong>${weaponLevel}</strong></span><span>能力/遗物<strong>${game.abilityPickups}/${game.relicPickups}</strong></span><span>超武/宝箱<strong>${game.evolutionPickups}/${game.chestsOpened}</strong></span><span>已点亮/可合成<strong>${ownedCount}/${readyCount}</strong></span>`;
    for (const section of codexSections) {
      const header = document.createElement("div");
      header.className = "codex-section-title";
      header.textContent = section.title;
      ui.codexGrid.appendChild(header);
      for (const item of section.items) {
        const owned = !!item.owned?.(p);
        const ready = !!item.ready?.(p);
        const card = document.createElement("article");
        card.className = `codex-card ${owned ? "is-owned" : ""} ${ready ? "is-ready" : ""}`;
        card.dataset.id = item.id;
        card.dataset.type = item.type;
        card.tabIndex = 0;
        card.innerHTML = `<div class="codex-card-top"><em>${item.type}</em><b>${owned ? "已获得" : ready ? "可合成/可遇" : "未完成"}</b></div><span class="codex-glyph" data-glyph="${item.id}"></span><strong>${item.name}</strong><p>${item.desc}</p><small>${item.state(p)}</small>${renderEvolutionTree(item, p)}`;
        card.addEventListener("pointerenter", () => card.classList.add("tree-open"));
        card.addEventListener("pointerleave", () => card.classList.remove("tree-open"));
        card.addEventListener("focus", () => card.classList.add("tree-open"));
        card.addEventListener("blur", () => card.classList.remove("tree-open"));
        card.addEventListener("click", () => {
          const wasOpen = card.classList.contains("tree-open");
          ui.codexGrid.querySelectorAll(".codex-card.tree-pinned").forEach((node) => {
            if (node !== card) node.classList.remove("tree-pinned", "tree-open");
          });
          card.classList.toggle("tree-pinned", !wasOpen || !card.classList.contains("tree-pinned"));
          card.classList.toggle("tree-open", !wasOpen || card.classList.contains("tree-pinned"));
        });
        ui.codexGrid.appendChild(card);
      }
    }
  }

  function renderEvolutionTree(item, player) {
    const nodes = typeof item.tree === "function" ? item.tree(player) : item.tree;
    if (!nodes?.length) return "";
    return `<div class="evolution-tree" aria-label="${item.name}进化树"><span>进化树</span>${nodes
      .map((node, index) => `<i class="tree-node is-${node.status || "locked"}"><b>${index + 1}</b>${plainTreeText(node.text)}</i>`)
      .join("")}</div>`;
  }

  function plainTreeText(text = "") {
    return text
      .replace(/条件：/g, "需要：")
      .replace(/触发：/g, "怎么发动：")
      .replace(/收益：/g, "好处：")
      .replace(/流派：/g, "适合：")
      .replace(/博弈：/g, "取舍：")
      .replace(/联动：/g, "配合：")
      .replace(/终点：/g, "最终形态：")
      .replace(/冷却/g, "出手间隔")
      .replace(/触发/g, "发动")
      .replace(/收益/g, "好处");
  }

  function openCodex() {
    if (!ui.codex.classList.contains("visible") && canFreezeRun()) {
      codexReturnState = state;
      pauseChestRevealTimer();
      state = "codex";
      pointer.active = false;
      pointer.id = null;
      ui.touchStick.querySelector("span").style.transform = "translate(0, 0)";
    }
    renderCodex();
    ui.codex.classList.add("visible");
    updateHud();
    draw();
  }

  function closeCodex() {
    ui.codex.classList.remove("visible");
    if (state === "codex") {
      state = codexReturnState || "playing";
      codexReturnState = null;
      resumeChestRevealTimer();
      updateHud();
      if (state === "playing") {
        last = performance.now();
        requestAnimationFrame(loop);
      }
    }
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    const sx = shake ? rand(-shake, shake) : 0;
    const sy = shake ? rand(-shake, shake) : 0;
    ctx.translate(sx, sy);
    drawBackground(w, h);
    ctx.translate(-camera.x, -camera.y);
    drawWorldMotifs();
    for (const chest of game.chests) drawChest(chest);
    for (const gem of game.gems) drawGem(gem);
    for (const bloom of game.blooms) drawBloom(bloom);
    for (const trail of game.trails) drawTrail(trail);
    for (const e of game.enemies) drawEnemy(e);
    drawPlayer(game.player);
    drawOrbs(game.player);
    for (const proj of game.projectiles) drawProjectile(proj);
    for (const beam of game.beams) drawBeam(beam);
    for (const part of game.particles) drawParticle(part);
    ctx.restore();
    drawSigilWash(w, h);
    drawFocusWash(w, h);
  }

  function drawBackground(w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#fbf7ee");
    grad.addColorStop(0.52, "#f3eadc");
    grad.addColorStop(1, "#e7dccb");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1;
    const spacing = 96;
    const offX = -((camera.x * 0.32) % spacing);
    const offY = -((camera.y * 0.32) % spacing);
    for (let x = offX; x < w + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 32, h);
      ctx.stroke();
    }
    for (let y = offY; y < h + spacing; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y - 24);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawWorldMotifs() {
    ctx.save();
    ctx.globalAlpha = 0.24;
    for (let i = 0; i < 48; i += 1) {
      const x = ((i * 617) % (world.w - 240)) + 120;
      const y = ((i * 383) % (world.h - 240)) + 120;
      const r = 28 + ((i * 13) % 42);
      ctx.strokeStyle = i % 3 === 0 ? palette.gold : i % 3 === 1 ? palette.teal : palette.lilac;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.35, (i % 8) * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayer(p) {
    if (!p) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = p.invuln > 0 ? 0.72 : 1;
    ctx.fillStyle = "rgba(31, 38, 48, 0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 25, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.ink;
    leaf(0, -3, 18, 27, 0);
    ctx.fillStyle = p.characterAccent || palette.teal;
    leaf(-8, -7, 10, 20, -0.42);
    ctx.fillStyle = p.characterSecondary || palette.gold;
    leaf(9, -8, 10, 19, 0.38);
    ctx.strokeStyle = p.characterAccent || palette.teal;
    ctx.globalAlpha = (p.invuln > 0 ? 0.48 : 0.36);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, -3, 21, 28, Math.sin(game.time * 1.4) * 0.08, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = p.invuln > 0 ? 0.72 : 1;
    ctx.fillStyle = palette.white;
    ctx.beginPath();
    ctx.arc(-5, -8, 2.3, 0, Math.PI * 2);
    ctx.arc(5, -8, 2.3, 0, Math.PI * 2);
    ctx.fill();
    if (p.abilities.craneVow) {
      for (let i = 0; i < 3; i += 1) {
        const a = -Math.PI / 2 + (i - 1) * 0.46 + Math.sin(game.time * 2 + i) * 0.08;
        const active = i < p.craneCharges;
        ctx.save();
        ctx.translate(Math.cos(a) * 26, -7 + Math.sin(a) * 18);
        ctx.rotate(a + Math.PI / 2);
        ctx.globalAlpha = active ? 0.95 : 0.18 + clamp(p.stillness / 0.84, 0, 1) * 0.24;
        ctx.fillStyle = active ? palette.white : palette.gold;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(8, 5);
        ctx.lineTo(0, 2);
        ctx.lineTo(-8, 5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = palette.gold;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawEnemy(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(Math.sin(game.time * 2 + e.phase) * 0.08);
    ctx.fillStyle = "rgba(31, 38, 48, 0.12)";
    ctx.beginPath();
    ctx.ellipse(0, e.r * 0.82, e.r * 1.05, e.r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = e.hit > 0 ? palette.coral : e.color;
    if (e.type === "swift") {
      petalShape(e.r * 1.15, e.r * 0.72, 4);
    } else if (e.type === "bloom") {
      petalShape(e.r, e.r * 0.92, 6);
    } else if (e.type === "elite" || e.type === "boss") {
      petalShape(e.r, e.r, e.type === "boss" ? 8 : 7);
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, e.r * 0.68, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      leaf(0, 0, e.r * 1.45, e.r * 1.2, 0);
    }
    if (e.type === "elite" || e.type === "boss") {
      ctx.fillStyle = "rgba(31, 38, 48, 0.16)";
      ctx.fillRect(-e.r, -e.r - 13, e.r * 2, 4);
      ctx.fillStyle = palette.coral;
      ctx.fillRect(-e.r, -e.r - 13, e.r * 2 * Math.max(0, e.hp / e.maxHp), 4);
    }
    if (e.marks > 0) {
      ctx.strokeStyle = palette.teal;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.38 + Math.min(0.42, e.marks * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, e.r + 5 + e.marks, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (e.ember > 0) {
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, e.r + 9, e.r * 0.48 + 6, game.time * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawOrbs(p) {
    if (!p) return;
    const layers = p.evolutions.starRiver ? 2 : 1;
    ctx.save();
    ctx.globalAlpha = p.evolutions.starRiver ? 0.28 : 0.16;
    ctx.strokeStyle = p.evolutions.starRiver ? palette.lilac : palette.gold;
    ctx.lineWidth = p.evolutions.starRiver ? 3 : 2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.evolutions.starRiver ? 96 : 64, p.evolutions.starRiver ? 96 : 64, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (p.evolutions.starRiver) {
      ctx.strokeStyle = palette.gold;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 62, 62, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    for (let layer = 0; layer < layers; layer += 1) {
      for (let i = 0; i < p.orbs; i += 1) {
        const a = p.orbAngle * (layer ? -0.74 : 1) + (i / p.orbs) * Math.PI * 2 + layer * 0.35;
        const radius = layer ? 96 : p.evolutions.starRiver ? 62 : 64;
        const x = p.x + Math.cos(a) * radius;
        const y = p.y + Math.sin(a) * radius;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-a);
        ctx.fillStyle = layer ? palette.lilac : palette.gold;
        leaf(0, 0, p.evolutions.starRiver ? 13 : 11, p.evolutions.starRiver ? 22 : 18, 0);
        ctx.fillStyle = palette.white;
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  function drawProjectile(proj) {
    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(proj.angle);
    if (proj.source === "crane") {
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = palette.gold;
      leaf(-16, 0, proj.r * 1.25, proj.width + 10, Math.PI / 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.white;
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(-8, -12 - (proj.charge || 1) * 2);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-8, 12 + (proj.charge || 1) * 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, 0);
      ctx.moveTo(-2, 0);
      ctx.lineTo(-9, -10);
      ctx.moveTo(-2, 0);
      ctx.lineTo(-9, 10);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (proj.source === "craneFeather") {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = palette.gold;
      leaf(-8, 0, proj.r * 1.1, proj.width + 8, Math.PI / 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.white;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-7, -7);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-7, 7);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-8, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (proj.source === "inkSplinter") {
      ctx.globalAlpha = 0.24;
      ctx.fillStyle = palette.ink;
      leaf(-5, 0, proj.r * 0.9, proj.width + 8, Math.PI / 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = proj.color || palette.teal;
      leaf(0, 0, proj.r, proj.width, Math.PI / 2);
      ctx.strokeStyle = "rgba(255, 249, 237, 0.72)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-8, -2);
      ctx.lineTo(10, 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (proj.source === "starShard") {
      ctx.globalAlpha = 0.24;
      ctx.strokeStyle = palette.lilac;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-proj.width * 0.5, 0);
      ctx.lineTo(proj.width * 0.5, 0);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = proj.color || palette.gold;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(-proj.r * 1.2, 0);
        ctx.lineTo(0, -proj.r * 0.42);
        ctx.lineTo(proj.r * 1.2, 0);
        ctx.lineTo(0, proj.r * 0.42);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      return;
    }
    if (proj.source === "frostString" || proj.source === "frostEcho" || proj.source === "frostZither") {
      ctx.globalAlpha = proj.source === "frostZither" ? 0.26 : proj.source === "frostString" ? 0.2 : 0.16;
      ctx.strokeStyle = palette.lilac;
      ctx.lineWidth = proj.source === "frostZither" ? 11 : proj.source === "frostString" ? 8 : 5;
      ctx.beginPath();
      ctx.moveTo(-proj.width * 0.62, 0);
      ctx.quadraticCurveTo(0, -proj.r * 0.55, proj.width * 0.62, 0);
      ctx.stroke();
      if (proj.source === "frostZither") {
        ctx.globalAlpha = 0.42;
        ctx.strokeStyle = palette.gold;
        ctx.lineWidth = 1.2;
        for (let i = -1; i <= 1; i += 1) {
          ctx.beginPath();
          ctx.moveTo(-proj.width * 0.46, i * 4);
          ctx.quadraticCurveTo(0, i * 4 - 3, proj.width * 0.46, i * 4);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255, 249, 237, 0.92)";
      ctx.lineWidth = proj.source === "frostString" ? 2.2 : 1.5;
      ctx.beginPath();
      ctx.moveTo(-proj.width * 0.55, 0);
      ctx.lineTo(proj.width * 0.55, 0);
      ctx.stroke();
      ctx.strokeStyle = palette.lilac;
      ctx.lineWidth = 1;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(proj.width * 0.18 * i, -proj.r);
        ctx.lineTo(proj.width * 0.18 * i + proj.r * 0.6, 0);
        ctx.lineTo(proj.width * 0.18 * i, proj.r);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    if (proj.source === "lantern") {
      const pulse = 1 + Math.sin(game.time * 8 + proj.x * 0.01) * 0.12;
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = palette.gold;
      ctx.beginPath();
      ctx.ellipse(-proj.width * 0.22, 0, proj.width * 0.48, proj.r * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = palette.moss;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, proj.r * 1.35 * pulse, proj.r * 0.82, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = palette.gold;
      ctx.beginPath();
      ctx.arc(0, 0, proj.r * 0.64 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 249, 237, 0.84)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i += 1) {
        ctx.rotate(Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.moveTo(proj.r * 0.82, 0);
        ctx.quadraticCurveTo(proj.r * 1.6, -proj.r * 0.24, proj.r * 2.15, 0);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    if (proj.source === "sigil") {
      const pulse = 1 + Math.sin(game.time * 7 + proj.x * 0.012) * 0.08;
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = palette.ink;
      ctx.beginPath();
      ctx.ellipse(-proj.width * 0.18, 0, proj.width * 0.55, proj.r * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "rgba(255, 249, 237, 0.92)";
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -proj.r * 1.5 * pulse);
      ctx.lineTo(proj.r * 1.08 * pulse, 0);
      ctx.lineTo(0, proj.r * 1.5 * pulse);
      ctx.lineTo(-proj.r * 1.08 * pulse, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = palette.lilac;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-proj.r * 0.62, 0);
      ctx.lineTo(proj.r * 0.62, 0);
      ctx.moveTo(0, -proj.r * 0.88);
      ctx.lineTo(0, proj.r * 0.88);
      ctx.stroke();
      ctx.globalAlpha = 0.52;
      ctx.strokeStyle = palette.gold;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(-proj.width * 0.32, i * proj.r * 0.36);
        ctx.quadraticCurveTo(0, i * proj.r * 0.36 - proj.r * 0.24, proj.width * 0.32, i * proj.r * 0.36);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = proj.color || palette.teal;
    leaf(-10, 0, proj.r * 1.1, proj.width || 28, Math.PI / 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = proj.color || palette.teal;
    leaf(0, 0, proj.source === "voidBrush" ? 15 : 11, proj.source === "voidBrush" ? 42 : 30, Math.PI / 2);
    if (proj.source === "voidBrush") {
      ctx.strokeStyle = "rgba(255, 249, 237, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-20, -4);
      ctx.quadraticCurveTo(0, 7, 22, -3);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255, 249, 237, 0.85)";
    ctx.fillRect(-5, -1, 13, 2);
    ctx.restore();
  }

  function drawTrail(trail) {
    const alpha = Math.max(0, trail.life / trail.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha * 0.42;
    ctx.translate(trail.x, trail.y);
    ctx.rotate(trail.angle + game.time);
    ctx.strokeStyle = trail.color;
    ctx.fillStyle = trail.color;
    if (trail.kind === "slash") {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, trail.radius * 1.7, trail.radius * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (trail.kind === "diamond") {
      ctx.beginPath();
      ctx.moveTo(0, -trail.radius);
      ctx.lineTo(trail.radius * 0.65, 0);
      ctx.lineTo(0, trail.radius);
      ctx.lineTo(-trail.radius * 0.65, 0);
      ctx.closePath();
      ctx.fill();
    } else if (trail.kind === "star") {
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(-trail.radius, 0);
        ctx.lineTo(trail.radius, 0);
        ctx.stroke();
      }
    } else if (trail.kind === "cinder") {
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.arc(trail.radius * 0.55, 0, trail.radius * 0.16, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (trail.kind === "fan") {
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, trail.radius * (0.55 + i * 0.16), -0.72, 0.72);
        ctx.stroke();
      }
      ctx.globalAlpha *= 0.7;
      ctx.beginPath();
      ctx.moveTo(-trail.radius * 0.18, -trail.radius * 0.24);
      ctx.quadraticCurveTo(trail.radius * 0.55, 0, -trail.radius * 0.18, trail.radius * 0.24);
      ctx.stroke();
    } else if (trail.kind === "jadeFan") {
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, trail.radius * (0.42 + i * 0.14), -0.86, 0.86);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.72;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(-trail.radius * 0.32, i * trail.radius * 0.16);
        ctx.quadraticCurveTo(trail.radius * 0.24, -i * trail.radius * 0.22, trail.radius * 0.86, i * trail.radius * 0.28);
        ctx.stroke();
      }
    } else if (trail.kind === "fanFeather") {
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.moveTo(-trail.radius * 0.55, i * trail.radius * 0.1);
        ctx.quadraticCurveTo(0, -trail.radius * (0.32 + i * 0.04), trail.radius * 0.7, i * trail.radius * 0.12);
        ctx.stroke();
      }
      ctx.globalAlpha *= 0.55;
      ctx.fillStyle = trail.color;
      ctx.beginPath();
      ctx.ellipse(trail.radius * 0.16, 0, trail.radius * 0.22, trail.radius * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (trail.kind === "umbrella") {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, trail.radius, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      for (let i = -2; i <= 2; i += 1) {
        const a = -Math.PI / 2 + i * 0.23;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * trail.radius * 0.88, Math.sin(a) * trail.radius * 0.88);
        ctx.stroke();
      }
      ctx.globalAlpha *= 0.58;
      ctx.beginPath();
      ctx.ellipse(0, -trail.radius * 0.16, trail.radius * 0.44, trail.radius * 0.16, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (trail.kind === "umbrellaLotus") {
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 8; i += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(trail.radius * 0.16, 0);
        ctx.quadraticCurveTo(trail.radius * 0.42, -trail.radius * 0.18, trail.radius * 0.76, 0);
        ctx.quadraticCurveTo(trail.radius * 0.42, trail.radius * 0.18, trail.radius * 0.16, 0);
        ctx.stroke();
      }
      ctx.globalAlpha *= 0.52;
      ctx.beginPath();
      ctx.arc(0, 0, trail.radius * 0.36, 0, Math.PI * 2);
      ctx.stroke();
    } else if (trail.kind === "umbrellaEcho") {
      ctx.lineWidth = 1.8;
      for (let i = 0; i < 4; i += 1) {
        const a = i * Math.PI / 2 + game.time * 0.16;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * trail.radius * 0.18, Math.sin(a) * trail.radius * 0.18);
        ctx.quadraticCurveTo(Math.cos(a + 0.5) * trail.radius * 0.58, Math.sin(a + 0.5) * trail.radius * 0.58, Math.cos(a + 1.1) * trail.radius * 0.92, Math.sin(a + 1.1) * trail.radius * 0.92);
        ctx.stroke();
      }
      ctx.globalAlpha *= 0.55;
      ctx.beginPath();
      ctx.arc(0, 0, trail.radius * 0.44, Math.PI * 0.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (trail.kind === "tempoBell") {
      ctx.lineWidth = 1.8;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, trail.radius * (0.38 + i * 0.22), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha *= 0.62;
      ctx.strokeStyle = palette.white;
      ctx.beginPath();
      ctx.moveTo(-trail.radius * 0.68, 0);
      ctx.quadraticCurveTo(0, -trail.radius * 0.28, trail.radius * 0.68, 0);
      ctx.stroke();
    } else if (trail.kind === "splinter") {
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 5; i += 1) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.moveTo(-trail.radius * 0.18, 0);
        ctx.lineTo(trail.radius, 0);
        ctx.stroke();
      }
    } else if (trail.kind === "frost") {
      ctx.lineWidth = 1.7;
      for (let i = 0; i < 3; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(-trail.radius * 0.8, 0);
        ctx.lineTo(trail.radius * 0.8, 0);
        ctx.moveTo(trail.radius * 0.26, -trail.radius * 0.18);
        ctx.lineTo(trail.radius * 0.48, 0);
        ctx.lineTo(trail.radius * 0.26, trail.radius * 0.18);
        ctx.stroke();
      }
    } else if (trail.kind === "crane") {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trail.radius * 1.35, 0);
      ctx.lineTo(-trail.radius * 0.35, -trail.radius * 0.7);
      ctx.lineTo(-trail.radius * 0.05, 0);
      ctx.lineTo(-trail.radius * 0.35, trail.radius * 0.7);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.16;
      ctx.fill();
    } else if (trail.kind === "lantern") {
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, trail.radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 5; i += 1) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.moveTo(trail.radius * 0.22, 0);
        ctx.quadraticCurveTo(trail.radius * 0.58, -trail.radius * 0.12, trail.radius * 0.95, 0);
        ctx.stroke();
      }
    } else if (trail.kind === "sigil") {
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -trail.radius * 0.82);
      ctx.lineTo(trail.radius * 0.62, 0);
      ctx.lineTo(0, trail.radius * 0.82);
      ctx.lineTo(-trail.radius * 0.62, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.42;
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-trail.radius * 0.28, -trail.radius * 0.28, trail.radius * 0.56, trail.radius * 0.56);
    } else if (trail.kind === "jadeWard") {
      ctx.lineWidth = 1.7;
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-trail.radius * 0.72, -trail.radius * 0.72, trail.radius * 1.44, trail.radius * 1.44);
      ctx.globalAlpha = alpha * 0.26;
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-trail.radius * 0.42, -trail.radius * 0.42, trail.radius * 0.84, trail.radius * 0.84);
      ctx.beginPath();
      ctx.moveTo(-trail.radius * 0.86, 0);
      ctx.lineTo(trail.radius * 0.86, 0);
      ctx.moveTo(0, -trail.radius * 0.86);
      ctx.lineTo(0, trail.radius * 0.86);
      ctx.stroke();
    } else if (trail.kind === "needle") {
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.ellipse(0, 0, trail.radius * 1.12, trail.radius * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.24;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, -trail.radius * 0.9);
        ctx.lineTo(0, -trail.radius * 0.28);
        ctx.stroke();
      }
    } else if (trail.kind === "needleCurtain") {
      ctx.lineWidth = 1.15;
      for (let i = -2; i <= 2; i += 1) {
        const x = i * trail.radius * 0.18;
        ctx.beginPath();
        ctx.moveTo(x, -trail.radius * 0.9);
        ctx.lineTo(x * 0.35, trail.radius * 0.72);
        ctx.stroke();
      }
      ctx.globalAlpha = alpha * 0.28;
      ctx.beginPath();
      ctx.ellipse(0, trail.radius * 0.38, trail.radius * 0.9, trail.radius * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (trail.kind === "needleSeal") {
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, trail.radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.32;
      for (let i = 0; i < 8; i += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(trail.radius * 0.18, 0);
        ctx.lineTo(trail.radius * 0.72, 0);
        ctx.stroke();
      }
    } else if (trail.kind === "needleLoom") {
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, trail.radius * 1.18, trail.radius * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.38;
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(-trail.radius * 0.9, 0);
        ctx.quadraticCurveTo(0, -trail.radius * 0.26, trail.radius * 0.9, 0);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha = alpha * 0.24;
      ctx.beginPath();
      ctx.arc(0, 0, trail.radius * 0.36, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, trail.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBeam(beam) {
    const alpha = Math.max(0, beam.life / beam.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha * 0.28;
    ctx.strokeStyle = palette.gold;
    ctx.lineWidth = beam.width * 1.8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(beam.x1, beam.y1);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.86;
    ctx.strokeStyle = "rgba(255, 249, 237, 0.95)";
    ctx.lineWidth = Math.max(3, beam.width * 0.35);
    ctx.beginPath();
    ctx.moveTo(beam.x1, beam.y1);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawFocusWash(w, h) {
    const p = game.player;
    if (!p || p.focusStillness < 0.45) return;
    const alpha = clamp((p.focusStillness - 0.45) / 1.4, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha * 0.15;
    ctx.fillStyle = palette.ink;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = alpha * 0.22;
    const x = p.x - camera.x;
    const y = p.y - camera.y;
    const grad = ctx.createRadialGradient(x, y, 12, x, y, 260);
    grad.addColorStop(0, "rgba(255, 249, 237, 0.95)");
    grad.addColorStop(0.36, "rgba(201, 154, 46, 0.32)");
    grad.addColorStop(1, "rgba(201, 154, 46, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawSigilWash(w, h) {
    const bloom = game.blooms.find((item) => item.kind === "sigilEcho");
    const curtain = game.blooms.find((item) => item.kind === "sigilCurtain");
    const source = curtain || bloom;
    if (!source) return;
    const alpha = clamp(source.life / (curtain ? 0.5 : 0.46), 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha * (curtain ? 0.18 : 0.12);
    ctx.fillStyle = palette.ink;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = alpha * (curtain ? 0.22 : 0.18);
    const x = source.x - camera.x;
    const y = source.y - camera.y;
    const grad = ctx.createRadialGradient(x, y, 8, x, y, Math.max(180, source.max || 180));
    grad.addColorStop(0, "rgba(255, 249, 237, 0.86)");
    grad.addColorStop(0.26, "rgba(143, 123, 181, 0.24)");
    grad.addColorStop(1, "rgba(31, 38, 48, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawGem(gem) {
    ctx.save();
    ctx.translate(gem.x, gem.y);
    ctx.rotate(Math.sin(gem.life * 3) * 0.45);
    ctx.fillStyle = palette.lilac;
    ctx.beginPath();
    ctx.moveTo(0, -gem.r);
    ctx.lineTo(gem.r * 0.85, 0);
    ctx.lineTo(0, gem.r);
    ctx.lineTo(-gem.r * 0.85, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawChest(chest) {
    ctx.save();
    ctx.translate(chest.x, chest.y + Math.sin(chest.life * 4 + chest.phase) * 4);
    ctx.fillStyle = "rgba(31, 38, 48, 0.14)";
    ctx.beginPath();
    ctx.ellipse(0, chest.r + 9, chest.r * 1.15, chest.r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = chest.tier === "boss" ? palette.lilac : chest.tier === "elite" ? palette.gold : "#d8ad4a";
    ctx.beginPath();
    ctx.roundRect(-chest.r, -chest.r * 0.52, chest.r * 2, chest.r * 1.15, 5);
    ctx.fill();
    ctx.fillStyle = palette.ink;
    ctx.fillRect(-chest.r, -2, chest.r * 2, 4);
    ctx.fillRect(-3, -chest.r * 0.52, 6, chest.r * 1.15);
    ctx.strokeStyle = "rgba(255, 249, 237, 0.86)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -chest.r * 0.52, chest.r * 0.62, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = palette.white;
    ctx.beginPath();
    ctx.arc(0, 5, 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = palette.gold;
    ctx.beginPath();
    ctx.ellipse(0, 0, chest.r * 1.55, chest.r * 0.58, game.time * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawBloom(bloom) {
    const r = Math.max(0.5, bloom.r || 0);
    ctx.save();
    ctx.globalAlpha = Math.max(0, bloom.life / 0.42);
    ctx.strokeStyle = bloom.color;
    ctx.lineWidth = bloom.kind === "ink" ? 5 : 4;
    ctx.beginPath();
    ctx.arc(bloom.x, bloom.y, r, 0, Math.PI * 2);
    ctx.stroke();
    if (bloom.kind === "flame" || bloom.kind === "lotus" || bloom.kind === "cinder" || bloom.kind === "flameTide") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * (bloom.kind === "cinder" ? -1.1 : bloom.kind === "flameTide" ? 1.25 : 0.6));
      ctx.strokeStyle = bloom.kind === "lotus" || bloom.kind === "cinder" || bloom.kind === "flameTide" ? palette.coral : palette.gold;
      ctx.globalAlpha *= 0.72;
      const petals = bloom.kind === "flameTide" ? 12 : bloom.kind === "cinder" ? 10 : 8;
      for (let i = 0; i < petals; i += 1) {
        ctx.rotate((Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.moveTo(r * (bloom.kind === "cinder" || bloom.kind === "flameTide" ? 0.12 : 0.18), 0);
        ctx.quadraticCurveTo(r * 0.44, r * (bloom.kind === "flameTide" ? 0.2 : 0.12), r * (bloom.kind === "cinder" || bloom.kind === "flameTide" ? 0.82 : 0.68), 0);
        ctx.stroke();
      }
      if (bloom.kind === "flameTide") {
        ctx.strokeStyle = palette.gold;
        ctx.globalAlpha *= 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.46, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (bloom.kind === "starRecall") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 1.4);
      ctx.strokeStyle = palette.lilac;
      ctx.globalAlpha *= 0.82;
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(r * 0.16, 0);
        ctx.lineTo(r * 0.42, r * 0.08);
        ctx.lineTo(r * 0.7, 0);
        ctx.lineTo(r * 0.42, -r * 0.08);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }
    if (bloom.kind === "branchInkstone") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.7);
      ctx.strokeStyle = palette.lilac;
      ctx.globalAlpha *= 0.76;
      ctx.strokeRect(-r * 0.32, -r * 0.32, r * 0.64, r * 0.64);
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-r * 0.22, -r * 0.22, r * 0.44, r * 0.44);
      ctx.restore();
    }
    if (bloom.kind === "routeChoice") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.9 + String(bloom.routeVariant || "").length * 0.12);
      ctx.strokeStyle = bloom.color;
      ctx.globalAlpha *= 0.8;
      const spokes = bloom.routeBase === "umbrella" ? 8 : bloom.routeBase === "fan" ? 6 : bloom.routeBase === "needle" ? 10 : 5;
      for (let i = 0; i < spokes; i += 1) {
        ctx.rotate((Math.PI * 2) / spokes);
        ctx.beginPath();
        ctx.moveTo(r * 0.18, 0);
        ctx.lineTo(r * 0.74, 0);
        ctx.stroke();
      }
      ctx.globalAlpha *= 0.72;
      if (bloom.routeBase === "fan" || bloom.routeBase === "umbrella") {
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.54, -Math.PI * 0.15, Math.PI * 1.15);
        ctx.stroke();
      } else {
        ctx.strokeRect(-r * 0.3, -r * 0.3, r * 0.6, r * 0.6);
      }
      ctx.restore();
    }
    if (bloom.kind === "fanFeather" || bloom.kind === "jadeFanFeather") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 1.1);
      ctx.strokeStyle = bloom.kind === "jadeFanFeather" ? palette.white : palette.moss;
      ctx.globalAlpha *= 0.78;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(-r * 0.12, -r * 0.08);
        ctx.quadraticCurveTo(r * 0.42, -r * 0.34, r * 0.76, 0);
        ctx.quadraticCurveTo(r * 0.42, r * 0.34, -r * 0.12, r * 0.08);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (bloom.kind === "umbrella") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(Math.sin(game.time * 1.7) * 0.08);
      ctx.strokeStyle = bloom.color;
      ctx.globalAlpha *= 0.82;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.78, Math.PI * 1.03, Math.PI * 1.97);
      ctx.stroke();
      for (let i = -3; i <= 3; i += 1) {
        const a = -Math.PI / 2 + i * 0.17;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.58;
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.22, r * 0.34, r * 0.12, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "umbrellaLotus") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.42);
      ctx.strokeStyle = palette.teal;
      ctx.globalAlpha *= 0.8;
      ctx.lineWidth = 1.8;
      for (let i = 0; i < 10; i += 1) {
        ctx.rotate(Math.PI / 5);
        ctx.beginPath();
        ctx.moveTo(r * 0.18, 0);
        ctx.quadraticCurveTo(r * 0.48, -r * 0.2, r * 0.82, 0);
        ctx.quadraticCurveTo(r * 0.48, r * 0.2, r * 0.18, 0);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.54;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "umbrellaEcho") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 0.36);
      ctx.strokeStyle = palette.lilac;
      ctx.globalAlpha *= 0.82;
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.22, Math.sin(a) * r * 0.22);
        ctx.quadraticCurveTo(Math.cos(a + 0.46) * r * 0.72, Math.sin(a + 0.46) * r * 0.72, Math.cos(a + 1.0) * r * 0.96, Math.sin(a + 1.0) * r * 0.96);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.54, Math.PI * 0.08, Math.PI * 1.92);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "jade") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.9);
      ctx.strokeStyle = palette.moss;
      ctx.globalAlpha *= 0.84;
      ctx.strokeRect(-r * 0.34, -r * 0.52, r * 0.68, r * 1.04);
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, -r * 0.12);
      ctx.lineTo(r * 0.08, -r * 0.12);
      ctx.lineTo(-r * 0.02, r * 0.18);
      ctx.lineTo(r * 0.22, r * 0.18);
      ctx.stroke();
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.72;
      ctx.beginPath();
      ctx.moveTo(-r * 0.46, 0);
      ctx.lineTo(r * 0.46, 0);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "jadeChain") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 1.3);
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.82;
      for (let i = 0; i < 3; i += 1) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.moveTo(-r * 0.18, -r * 0.46);
        ctx.lineTo(r * 0.22, -r * 0.08);
        ctx.lineTo(-r * 0.08, r * 0.34);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.moss;
      ctx.globalAlpha *= 0.68;
      ctx.strokeRect(-r * 0.28, -r * 0.28, r * 0.56, r * 0.56);
      ctx.restore();
    }
    if (bloom.kind === "jadeWard") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(Math.PI / 4 + game.time * 0.18);
      ctx.strokeStyle = palette.moss;
      ctx.globalAlpha *= 0.86;
      ctx.strokeRect(-r * 0.54, -r * 0.54, r * 1.08, r * 1.08);
      ctx.strokeRect(-r * 0.34, -r * 0.34, r * 0.68, r * 0.68);
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.74;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(r * 0.1, -r * 0.62);
        ctx.lineTo(r * 0.34, -r * 0.38);
        ctx.lineTo(r * 0.18, -r * 0.12);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.62;
      ctx.beginPath();
      ctx.moveTo(-r * 0.62, 0);
      ctx.lineTo(r * 0.62, 0);
      ctx.moveTo(0, -r * 0.62);
      ctx.lineTo(0, r * 0.62);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "needle") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.36);
      ctx.strokeStyle = palette.teal;
      ctx.globalAlpha *= 0.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.9, r * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.62;
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.78);
        ctx.lineTo(0, -r * 0.28);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "needleCurtain") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.74;
      for (let i = -3; i <= 3; i += 1) {
        const x = i * r * 0.13;
        ctx.beginPath();
        ctx.moveTo(x, -r * 0.82);
        ctx.quadraticCurveTo(x * 0.2, -r * 0.16, -x * 0.26, r * 0.62);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.teal;
      ctx.globalAlpha *= 0.7;
      ctx.beginPath();
      ctx.ellipse(0, r * 0.34, r * 0.76, r * 0.2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "needleSeal") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.22);
      ctx.strokeStyle = palette.teal;
      ctx.globalAlpha *= 0.82;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.72;
      for (let i = 0; i < 8; i += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(r * 0.18, 0);
        ctx.lineTo(r * 0.72, 0);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.6;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.38, r * 0.16, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "needleLoom") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 0.28);
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.78;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.96, r * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(-r * 0.76, 0);
        ctx.quadraticCurveTo(0, -r * 0.18, r * 0.76, 0);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.68;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = palette.teal;
      ctx.globalAlpha *= 0.62;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "brushRain") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.48);
      ctx.strokeStyle = palette.teal;
      ctx.globalAlpha *= 0.78;
      for (let i = 0; i < 5; i += 1) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.moveTo(-r * 0.2, -r * 0.72);
        ctx.lineTo(r * 0.18, -r * 0.18);
        ctx.lineTo(-r * 0.1, r * 0.72);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha *= 0.72;
      ctx.beginPath();
      ctx.moveTo(-r * 0.52, -r * 0.52);
      ctx.lineTo(r * 0.52, r * 0.52);
      ctx.moveTo(r * 0.52, -r * 0.52);
      ctx.lineTo(-r * 0.52, r * 0.52);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "prism") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 0.9);
      ctx.strokeStyle = palette.lilac;
      ctx.globalAlpha *= 0.82;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.88);
        ctx.lineTo(r * 0.3, 0);
        ctx.lineTo(0, r * 0.88);
        ctx.lineTo(-r * 0.3, 0);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.7;
      ctx.beginPath();
      ctx.moveTo(-r * 0.62, 0);
      ctx.lineTo(r * 0.62, 0);
      ctx.moveTo(0, -r * 0.62);
      ctx.lineTo(0, r * 0.62);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "lanternGleam") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 1.7);
      ctx.strokeStyle = palette.moss;
      ctx.globalAlpha *= 0.78;
      for (let i = 0; i < 8; i += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(r * 0.46, 0, r * 0.18, r * 0.07, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "lanternVein") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 1.25);
      ctx.strokeStyle = palette.moss;
      ctx.globalAlpha *= 0.8;
      for (let i = 0; i < 5; i += 1) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.moveTo(r * 0.14, 0);
        ctx.bezierCurveTo(r * 0.36, -r * 0.18, r * 0.62, r * 0.18, r * 0.88, 0);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.gold;
      ctx.globalAlpha *= 0.72;
      ctx.beginPath();
      ctx.moveTo(-r * 0.54, 0);
      ctx.lineTo(r * 0.54, 0);
      ctx.moveTo(0, -r * 0.54);
      ctx.lineTo(0, r * 0.54);
      ctx.stroke();
      ctx.restore();
    }
    if (bloom.kind === "frostLattice") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 0.5);
      ctx.strokeStyle = palette.lilac;
      ctx.globalAlpha *= 0.82;
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2;
        const x1 = Math.cos(a) * r * 0.36;
        const y1 = Math.sin(a) * r * 0.36;
        const x2 = Math.cos(a) * r * 0.82;
        const y2 = Math.sin(a) * r * 0.82;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(a) * r * 0.7;
        const y = Math.sin(a) * r * 0.7;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.strokeStyle = palette.white;
      ctx.globalAlpha *= 0.72;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (["characterHarmony", "characterBell", "characterEmber", "characterLantern"].includes(bloom.kind)) {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.globalAlpha *= 0.88;
      if (bloom.kind === "characterHarmony") {
        const colors = [palette.teal, palette.gold, palette.coral];
        for (let i = 0; i < 3; i += 1) {
          ctx.rotate((Math.PI * 2) / 3);
          ctx.strokeStyle = colors[i];
          ctx.beginPath();
          ctx.arc(0, 0, r * (0.38 + i * 0.14), -0.95 + game.time * 0.6, 0.95 + game.time * 0.6);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(r * 0.16, 0);
          ctx.quadraticCurveTo(r * 0.45, -r * 0.2, r * 0.78, 0);
          ctx.stroke();
        }
      } else if (bloom.kind === "characterBell") {
        ctx.rotate(-game.time * 1.1);
        ctx.strokeStyle = palette.lilac;
        ctx.beginPath();
        for (let i = 0; i < 7; i += 1) {
          const a = (i / 7) * Math.PI * 2;
          const x = Math.cos(a) * r * (i % 2 ? 0.52 : 0.78);
          const y = Math.sin(a) * r * (i % 2 ? 0.52 : 0.78);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = palette.gold;
        for (let i = 0; i < 7; i += 1) {
          const a = (i / 7) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * r * 0.68, Math.sin(a) * r * 0.68, Math.max(2, r * 0.04), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (bloom.kind === "characterEmber") {
        ctx.rotate(game.time * 0.82);
        ctx.strokeStyle = palette.coral;
        for (let i = 0; i < 4; i += 1) {
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-r * 0.5, -r * 0.5, r, r);
        }
        ctx.strokeStyle = palette.gold;
        for (let i = 0; i < 8; i += 1) {
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(r * 0.22, 0);
          ctx.quadraticCurveTo(r * 0.5, -r * 0.13, r * 0.86, 0);
          ctx.stroke();
        }
      } else if (bloom.kind === "characterLantern") {
        ctx.rotate(game.time * 1.35);
        ctx.strokeStyle = palette.moss;
        for (let i = 0; i < 10; i += 1) {
          const a = i * 0.72;
          const rr = r * (0.18 + i * 0.055);
          ctx.beginPath();
          ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, Math.max(2, r * 0.035), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = palette.gold;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.42, r * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (bloom.kind === "sigilEcho") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(-game.time * 0.8);
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha *= 0.82;
      for (let i = 0; i < 4; i += 1) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.82);
        ctx.lineTo(r * 0.34, 0);
        ctx.lineTo(0, r * 0.82);
        ctx.lineTo(-r * 0.34, 0);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.strokeStyle = palette.lilac;
      ctx.globalAlpha *= 0.7;
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-r * 0.36, -r * 0.36, r * 0.72, r * 0.72);
      ctx.restore();
    }
    if (bloom.kind === "sigilCurtain") {
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.55);
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha *= 0.82;
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(r * 0.18, -r * 0.18);
        ctx.lineTo(r * 0.72, -r * 0.34);
        ctx.lineTo(r * 0.5, r * 0.2);
        ctx.stroke();
      }
      ctx.strokeStyle = palette.lilac;
      ctx.globalAlpha *= 0.74;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bloom.x, bloom.y, r * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    if (bloom.kind === "lotus") {
      ctx.translate(bloom.x, bloom.y);
      ctx.rotate(game.time * 0.8);
      ctx.strokeStyle = palette.coral;
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.ellipse(r * 0.36, 0, r * 0.28, r * 0.08, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawParticle(part) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, part.life / part.maxLife);
    ctx.fillStyle = part.color;
    ctx.beginPath();
    ctx.arc(part.x, part.y, part.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function leaf(x, y, w, h, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.bezierCurveTo(w / 2, -h / 3, w / 2, h / 3, 0, h / 2);
    ctx.bezierCurveTo(-w / 2, h / 3, -w / 2, -h / 3, 0, -h / 2);
    ctx.fill();
    ctx.restore();
  }

  function petalShape(r, h, count) {
    ctx.beginPath();
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      const rr = i % 2 ? r * 0.72 : r;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function loop(now) {
    if (state !== "playing") return;
    const dt = Math.min(0.033, (now - last) / 1000 || 0);
    last = now;
    update(dt);
    draw();
    if (state === "playing") requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    fitCanvas();
    draw();
  });

  window.addEventListener("keydown", (event) => {
    keys.add(event.key.toLowerCase());
    if (event.key === " " && state === "menu") startRun();
    if (event.key.toLowerCase() === "p" && canFreezeRun()) {
      event.preventDefault();
      pauseRun();
    } else if (event.key.toLowerCase() === "p" && state === "paused") {
      event.preventDefault();
      resumeRun();
    }
    if (event.key.toLowerCase() === "i") {
      if (ui.codex.classList.contains("visible")) closeCodex();
      else openCodex();
    }
    if (event.key === "Escape" && ui.codex.classList.contains("visible")) closeCodex();
    else if (event.key === "Escape" && canFreezeRun()) pauseRun();
    else if (event.key === "Escape" && state === "paused") resumeRun();
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.key.toLowerCase());
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    pointer.active = true;
    pointer.id = event.pointerId;
    pointer.ox = event.clientX;
    pointer.oy = event.clientY;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    ui.touchStick.style.left = `${event.clientX - 44}px`;
    ui.touchStick.style.top = `${event.clientY - 44}px`;
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!pointer.active || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.ox;
    const dy = event.clientY - pointer.oy;
    const len = Math.hypot(dx, dy);
    const max = 34;
    const nx = len > max ? (dx / len) * max : dx;
    const ny = len > max ? (dy / len) * max : dy;
    pointer.x = pointer.ox + nx;
    pointer.y = pointer.oy + ny;
    ui.touchStick.querySelector("span").style.transform = `translate(${nx}px, ${ny}px)`;
  });

  window.addEventListener("pointerup", (event) => {
    if (pointer.id !== event.pointerId) return;
    pointer.active = false;
    pointer.id = null;
    ui.touchStick.querySelector("span").style.transform = "translate(0, 0)";
  });

  ui.startButton.addEventListener("click", startRun);
  ui.restartButton.addEventListener("click", startRun);
  ui.pauseButton.addEventListener("click", pauseRun);
  ui.resumeButton.addEventListener("click", resumeRun);
  ui.pauseRestartButton.addEventListener("click", startRun);
  ui.mainMenuButton.addEventListener("click", returnToMainMenu);
  ui.characterSelect.addEventListener("click", (event) => {
    const card = event.target.closest(".character-card");
    if (!card || state !== "menu") return;
    selectedCharacterId = card.dataset.characterId || selectedCharacterId;
    renderCharacterSelect();
    ui.characterSelect.querySelector(`[data-character-id="${selectedCharacterId}"]`)?.focus();
  });
  function toggleBuildPanel(panel) {
    buildPanelExpanded[panel.id] = !buildPanelExpanded[panel.id];
    renderBuildPanels();
  }
  [ui.weaponBuildPanel, ui.relicBuildPanel, ui.traitBuildPanel].forEach((panel) => {
    panel.addEventListener("pointerdown", (event) => {
      if (!event.target.closest(".build-panel-toggle")) return;
      event.preventDefault();
      event.stopPropagation();
      toggleBuildPanel(panel);
    });
    panel.addEventListener("click", (event) => {
      if (!event.target.closest(".build-panel-toggle")) return;
      if (event.detail) return;
      toggleBuildPanel(panel);
    });
  });
  ui.codexButton.addEventListener("click", openCodex);
  ui.codexCloseButton.addEventListener("click", closeCodex);
  ui.codex.addEventListener("click", (event) => {
    if (event.target === ui.codex) closeCodex();
  });
  ui.chest.addEventListener("click", () => {
    if (state !== "chest" || !game.chestState || game.chestState.revealed) return;
    game.chestState.clicks += 1;
    if (game.chestState.clicks >= 3) revealChest(true);
  });
  ui.chestContinueButton.addEventListener("click", (event) => {
    event.stopPropagation();
    closeChest();
  });

  fitCanvas();
  renderCharacterSelect();
  resetGame();
  window.__moonSurvivorDebug = {
    get player() {
      return game.player;
    },
    get game() {
      return game;
    },
    get selectedCharacter() {
      return selectedCharacter();
    },
    get state() {
      return state;
    },
    selectCharacter(id) {
      if (!characters.some((character) => character.id === id) || state !== "menu") return false;
      selectedCharacterId = id;
      renderCharacterSelect();
      resetGame();
      return true;
    },
    gainXp,
    showUpgrades() {
      if (ui.chest.classList.contains("visible")) {
        if (state === "chest" && game.chestState && !game.chestState.revealed) revealChest(true);
        if (state === "chest" && game.chestState?.revealed) closeChest();
        ui.chest.classList.remove("visible", "revealed");
        game.chestState = null;
        if (state === "chest") state = "playing";
      }
      showUpgrades();
    },
    showUpgradeById(id) {
      if (ui.chest.classList.contains("visible")) {
        if (state === "chest" && game.chestState && !game.chestState.revealed) revealChest(true);
        if (state === "chest" && game.chestState?.revealed) closeChest();
        ui.chest.classList.remove("visible", "revealed");
        game.chestState = null;
      }
      const available = upgrades
        .filter((up) => !up.available || up.available(game.player))
        .flatMap((up) => expandUpgradeVariants(up));
      const choice = available.find((up) => up.id === id || up.baseId === id);
      if (!choice) {
        game.choices = [];
        ui.choices.innerHTML = "";
        ui.upgrade.classList.add("visible");
        state = "upgrade";
        updateHud();
        return false;
      }
      state = "upgrade";
      renderUpgradeChoices([choice]);
      return true;
    },
    openCodex,
    closeCodex,
    pauseRun,
    resumeRun,
    returnToMainMenu,
    spawnChest,
    openChest,
    revealChest,
    closeChest,
    applyUpgradeById(id) {
      const upgrade = upgrades.find((item) => item.id === id);
      if (!upgrade || (upgrade.available && !upgrade.available(game.player))) return false;
      applyUpgrade(upgrade);
      updateHud();
      return true;
    },
    triggerDewPulse,
    addDewCharge,
    triggerChestResonance,
    triggerChestPrism,
    triggerBranchInkstone,
    triggerRouteCharm,
    triggerRouteFeedback,
    triggerTempoBell,
    triggerBrushSplinters,
    triggerBrushRain,
    triggerStarRecall,
    triggerStarShards,
    triggerCinderBloom,
    triggerFlameTide,
    triggerLanternGleam,
    triggerLanternVein,
    triggerSigilEcho,
    triggerSigilCurtain,
    triggerNeedleRain,
    triggerFanGust,
    triggerFanGale,
    triggerFanFeathers,
    triggerEvolutionShowcase,
    triggerUmbrellaBloom,
    triggerUmbrellaLotus,
    triggerUmbrellaEcho,
    triggerStandingLaser,
    triggerCharacterTrait,
    triggerCraneEcho,
    triggerFrostEcho,
    triggerFrostLattice,
    triggerInkBurst,
    makeCraneBlade,
    makeCraneFeather,
    makeFrostString,
    makeLanternWisp,
    makeSigilGlyph,
    triggerJadeStrike,
    makeInkSplinter,
    makeStarShard,
    updateCraneVow,
  };
  draw();
})();
