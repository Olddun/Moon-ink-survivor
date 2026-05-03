const { chromium } = require("/Users/b1lli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const EDGE = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";
const URL = process.env.GAME_URL || "http://127.0.0.1:4173";

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE });
  const errors = [];

  async function desktopRun() {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) errors.push(`${message.type()}: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

    await page.goto(URL, { waitUntil: "networkidle" });
    const loaded = await page.locator("#startButton").isVisible();
    const characterSelect = await page.evaluate(() => ({
      count: document.querySelectorAll(".character-card").length,
      selected: document.querySelector(".character-card[data-selected='true']")?.dataset.characterId || "",
      startText: document.querySelector("#startButton").textContent,
      hasStats: [...document.querySelectorAll(".character-card")].every((card) => card.querySelectorAll(".character-stats b").length >= 3),
      hasTraits: [...document.querySelectorAll(".character-card")].every((card) => card.querySelector(".character-trait b")?.textContent.trim().length > 0),
      pauseHidden: getComputedStyle(document.querySelector("#pauseButton")).display === "none",
    }));
    const characterStarts = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const ids = ["wanderer", "bell-dancer", "ember-warden", "lantern-child"];
      return ids.map((id) => {
        debug.selectCharacter(id);
        const p = debug.player;
        return {
          id,
          weapons: [p.brushCount, p.orbs, p.flameLevel, p.frostLevel, p.lanternLevel, p.sigilLevel].join("/"),
          trait: p.characterTraitName,
          traitText: document.querySelector("#traitBuildPanel").textContent,
          weaponText: document.querySelector("#weaponBuildPanel").textContent,
        };
      });
    });
    await page.click('[data-character-id="lantern-child"]');
    await page.waitForTimeout(80);
    const characterChosen = await page.evaluate(() => ({
      selected: document.querySelector(".character-card[data-selected='true']")?.dataset.characterId || "",
      startText: document.querySelector("#startButton").textContent,
    }));
    await page.click("#startButton");
    await page.waitForTimeout(140);
    const startTransition = await page.locator("#pageTransition.visible.run").count();
    await page.waitForTimeout(1050);
    const started = !(await page.locator("#startOverlay.visible").count());
    await page.click("#pauseButton");
    await page.waitForTimeout(120);
    const pauseOpened = await page.evaluate(() => ({
      visible: document.querySelector("#pauseOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      bodyState: document.body.dataset.gameState,
      buttons: [...document.querySelectorAll(".pause-actions button")].map((button) => button.textContent.trim()).join("|"),
    }));
    await page.click("#resumeButton");
    await page.waitForTimeout(160);
    const pauseResumed = await page.evaluate(() => ({
      hidden: !document.querySelector("#pauseOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      bodyState: document.body.dataset.gameState,
    }));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(120);
    const escPauseOpened = await page.evaluate(() => ({
      visible: document.querySelector("#pauseOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      bodyState: document.body.dataset.gameState,
    }));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(160);
    const escPauseResumed = await page.evaluate(() => ({
      hidden: !document.querySelector("#pauseOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      bodyState: document.body.dataset.gameState,
    }));
    await page.click("#pauseButton");
    await page.waitForTimeout(80);
    await page.click("#pauseRestartButton");
    await page.waitForTimeout(1120);
    const pauseRestarted = await page.evaluate(() => ({
      state: window.__moonSurvivorDebug.state,
      pauseHidden: !document.querySelector("#pauseOverlay").classList.contains("visible"),
      startHidden: !document.querySelector("#startOverlay").classList.contains("visible"),
      time: document.querySelector("#timeText").textContent,
      level: document.querySelector("#levelText").textContent,
    }));
    await page.click("#pauseButton");
    await page.waitForTimeout(80);
    await page.click("#mainMenuButton");
    await page.waitForTimeout(1120);
    const pauseMainMenu = await page.evaluate(() => ({
      state: window.__moonSurvivorDebug.state,
      startVisible: document.querySelector("#startOverlay").classList.contains("visible"),
      pauseHidden: !document.querySelector("#pauseOverlay").classList.contains("visible"),
      selected: document.querySelector(".character-card[data-selected='true']")?.dataset.characterId || "",
    }));
    await page.click("#startButton");
    await page.waitForTimeout(1120);
    const pauseMenuRestarted = await page.evaluate(() => ({
      state: window.__moonSurvivorDebug.state,
      startHidden: !document.querySelector("#startOverlay").classList.contains("visible"),
      character: window.__moonSurvivorDebug.player.characterId,
    }));
    await page.evaluate(() => window.__moonSurvivorDebug.showUpgrades());
    await page.waitForTimeout(100);
    await page.click("#pauseButton");
    await page.waitForTimeout(100);
    const pauseDuringUpgrade = await page.evaluate(() => ({
      paused: document.querySelector("#pauseOverlay").classList.contains("visible"),
      upgradeStillOpen: document.querySelector("#upgradeOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      bodyState: document.body.dataset.gameState,
    }));
    await page.click("#resumeButton");
    await page.waitForTimeout(100);
    const resumeToUpgrade = await page.evaluate(() => ({
      pauseHidden: !document.querySelector("#pauseOverlay").classList.contains("visible"),
      upgradeStillOpen: document.querySelector("#upgradeOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      bodyState: document.body.dataset.gameState,
    }));
    await page.locator(".choice").first().click();
    await page.waitForTimeout(1050);
    await page.click("#codexButton");
    await page.waitForTimeout(100);
    const codexPauseStart = await page.evaluate(() => ({
      visible: document.querySelector("#codexOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      time: window.__moonSurvivorDebug.game.time,
      bodyState: document.body.dataset.gameState,
    }));
    await page.waitForTimeout(650);
    const codexPauseHeld = await page.evaluate(() => ({
      visible: document.querySelector("#codexOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      time: window.__moonSurvivorDebug.game.time,
    }));
    await page.click("#codexCloseButton");
    await page.waitForTimeout(120);
    const codexPauseClosed = await page.evaluate(() => ({
      hidden: !document.querySelector("#codexOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.state,
      bodyState: document.body.dataset.gameState,
    }));
    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      debug.openChest({ x: debug.player.x, y: debug.player.y, r: 18, tier: "common", rewardCount: 1, life: 0, phase: 0 });
    });
    await page.waitForTimeout(100);
    await page.click("#pauseButton");
    await page.waitForTimeout(100);
    const pauseDuringChest = await page.evaluate(() => ({
      paused: document.querySelector("#pauseOverlay").classList.contains("visible"),
      chestStillOpen: document.querySelector("#chestOverlay").classList.contains("visible"),
      chestRevealed: document.querySelector("#chestOverlay").classList.contains("revealed"),
      timerStopped: !window.__moonSurvivorDebug.game.chestState?.timer,
      state: window.__moonSurvivorDebug.state,
    }));
    await page.click("#resumeButton");
    await page.waitForTimeout(100);
    const resumeToChest = await page.evaluate(() => ({
      pauseHidden: !document.querySelector("#pauseOverlay").classList.contains("visible"),
      chestStillOpen: document.querySelector("#chestOverlay").classList.contains("visible"),
      chestRevealed: document.querySelector("#chestOverlay").classList.contains("revealed"),
      timerResumed: Boolean(window.__moonSurvivorDebug.game.chestState?.timer),
      state: window.__moonSurvivorDebug.state,
    }));
    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      debug.revealChest(true);
      debug.closeChest();
    });
    await page.waitForTimeout(100);
    await page.click("#pauseButton");
    await page.waitForTimeout(80);
    await page.click("#pauseRestartButton");
    await page.waitForTimeout(1120);
    const buildPanelsInitial = await page.evaluate(() => ({
      weaponText: document.querySelector("#weaponBuildPanel").textContent,
      weaponRouteReadable: document.querySelector("#weaponBuildPanel").textContent.includes("路线") && document.querySelector("#weaponBuildPanel").textContent.includes("飞得更勤") && document.querySelector("#weaponBuildPanel").textContent.includes("每下更亮"),
      relicText: document.querySelector("#relicBuildPanel").textContent,
      traitText: document.querySelector("#traitBuildPanel").textContent,
      goalText: document.querySelector("#runGoal").textContent,
      expanded: [...document.querySelectorAll(".build-panel")].map((panel) => panel.dataset.expanded),
      thumbIcons: document.querySelectorAll(".build-panel-thumbs .mini-glyph").length,
      detailHidden: [...document.querySelectorAll(".build-panel")].every((panel) => getComputedStyle(panel.querySelector(".build-panel-items")).display === "none"),
      toggles: [...document.querySelectorAll(".build-panel-toggle")].map((button) => button.getAttribute("aria-expanded")),
      character: window.__moonSurvivorDebug.player.characterId,
      hp: window.__moonSurvivorDebug.player.maxHp,
      pickup: window.__moonSurvivorDebug.player.pickup,
      lanternLevel: window.__moonSurvivorDebug.player.lanternLevel,
      panels: document.querySelectorAll(".build-panel").length,
      icons: document.querySelectorAll(".build-panel .mini-glyph").length,
      weaponChips: document.querySelectorAll("#weaponBuildPanel .build-chip").length,
    }));
    await page.evaluate(() => {
      document.querySelector("#weaponBuildPanel .build-panel-toggle").click();
      document.querySelector("#relicBuildPanel .build-panel-toggle").click();
      document.querySelector("#traitBuildPanel .build-panel-toggle").click();
    });
    await page.waitForTimeout(80);
    const buildPanelsExpanded = await page.evaluate(() => ({
      expanded: [...document.querySelectorAll(".build-panel")].map((panel) => panel.dataset.expanded),
      detailVisible: [...document.querySelectorAll(".build-panel")].every((panel) => getComputedStyle(panel.querySelector(".build-panel-items")).display !== "none"),
      toggles: [...document.querySelectorAll(".build-panel-toggle")].map((button) => button.getAttribute("aria-expanded")),
      plans: [...document.querySelectorAll(".build-panel-plan")].map((node) => node.textContent || ""),
      chipHints: [...document.querySelectorAll(".build-chip small")].map((node) => node.textContent || ""),
      scrollable: [...document.querySelectorAll(".build-panel")].every((panel) => getComputedStyle(panel).overflowY === "auto"),
    }));
    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      debug.player.hp = debug.player.maxHp;
      debug.player.invuln = 30;
    });

    const characterTraitFx = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { game, player } = debug;
      const beforeBlooms = game.blooms.length;
      const beforeProjectiles = game.projectiles.length;
      const kinds = ["harmony", "bell", "ember", "lantern"].map((kind, index) => {
        debug.triggerCharacterTrait(kind, player.x + index * 8, player.y + index * 6, 2);
        return game.blooms.at(-1)?.kind || "";
      });
      return {
        exposed: typeof debug.triggerCharacterTrait === "function",
        bloomCount: game.blooms.length - beforeBlooms,
        projectileDelta: game.projectiles.length - beforeProjectiles,
        kinds,
      };
    });

    const routeFeedbackFx = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { game, player } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      const beforeBlooms = game.blooms.length;
      const beforeBeams = game.beams.length;
      const beforeTrails = game.trails.length;
      const beforeParticles = game.particles.length;
      const beforeCharge = player.dewCharge;
      const observed = [
        { x: player.x + 34, y: player.y, r: 18, hp: 90, maxHp: 90, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x - 42, y: player.y + 12, r: 18, hp: 90, maxHp: 90, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...observed);
      const triggered = debug.triggerRouteFeedback("umbrella", "spine");
      return {
        exposed: typeof debug.triggerRouteFeedback === "function",
        triggered,
        routeBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "routeChoice" && bloom.routeBase === "umbrella"),
        beams: game.beams.length - beforeBeams,
        trail: game.trails.length > beforeTrails,
        particles: game.particles.length - beforeParticles,
        damaged: observed.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: observed.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
      };
    });

    const bossEncounter = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { game, player } = debug;
      const snapshot = {
        kills: game.kills,
        bossSpawned: game.bossSpawned,
        bossesDefeated: game.bossesDefeated,
        nextBossKills: game.nextBossKills,
        hp: player.hp,
        invuln: player.invuln,
        enemies: [...game.enemies],
        chests: [...game.chests],
        gems: [...game.gems],
      };
      game.enemies.length = 0;
      game.chests.length = 0;
      game.gems.length = 0;
      game.bossSpawned = false;
      game.bossesDefeated = 0;
      game.nextBossKills = 2;
      game.kills = 1;
      player.hp = player.maxHp;
      player.invuln = 0;
      const fodder = { x: player.x + 58, y: player.y, r: 13, hp: 1, maxHp: 1, dmg: 0, xp: 0, speed: 0, color: "#3d4652", phase: 0, type: "shade", hit: 0, slow: 0 };
      game.enemies.push(fodder);
      debug.triggerInkBurst(fodder.x, fodder.y, 40, 999);
      const first = debug.maybeSpawnBoss();
      const firstBeforeHp = player.hp;
      const beforeBlooms = game.blooms.length;
      const beforeBeams = game.beams.length;
      if (first) {
        first.x = player.x + 36;
        first.y = player.y;
        player.invuln = 0;
        debug.triggerBossSkill(first);
      }
      const firstSkill = {
        hpLost: player.hp < firstBeforeHp,
        blooms: game.blooms.length - beforeBlooms,
        beams: game.beams.length - beforeBeams,
        kind: first?.bossKind || "",
        tier: first?.bossTier || 0,
        cooldown: first?.skillCooldown || 0,
      };
      if (first) debug.triggerInkBurst(first.x, first.y, 220, 999999);
      const firstBossChestReward = game.chests.find((chest) => chest.tier === "boss")?.rewardCount || 0;
      const firstRewardBurst = game.blooms.some((bloom) => bloom.kind === "bossReward");
      const nextTarget = game.nextBossKills;
      game.chests.length = 0;
      game.kills = nextTarget;
      player.hp = player.maxHp;
      player.invuln = 0;
      const second = debug.maybeSpawnBoss();
      const beforeSecondBeams = game.beams.length;
      const beforeSecondBlooms = game.blooms.length;
      if (second) {
        second.x = player.x + 72;
        second.y = player.y;
        debug.triggerBossSkill(second);
      }
      const secondSkill = {
        tier: second?.bossTier || 0,
        kind: second?.bossKind || "",
        beams: game.beams.length - beforeSecondBeams,
        blooms: game.blooms.length - beforeSecondBlooms,
        cooldown: second?.skillCooldown || 0,
      };
      const activeName = second ? debug.bossDisplayName(second) : "";
      if (second) debug.triggerInkBurst(second.x, second.y, 220, 999999);
      const secondBossChestReward = game.chests.find((chest) => chest.tier === "boss")?.rewardCount || 0;
      const secondRewardBurst = game.blooms.some((bloom) => bloom.kind === "bossReward" && bloom.color);
      const killTriggered = game.kills >= 2;
      const bossDefeated = game.bossesDefeated >= 1;
      player.hp = snapshot.hp;
      player.invuln = snapshot.invuln;
      game.kills = snapshot.kills;
      game.bossSpawned = snapshot.bossSpawned;
      game.bossesDefeated = snapshot.bossesDefeated;
      game.nextBossKills = snapshot.nextBossKills;
      game.enemies.length = 0;
      game.enemies.push(...snapshot.enemies);
      game.chests.length = 0;
      game.chests.push(...snapshot.chests);
      game.gems.length = 0;
      game.gems.push(...snapshot.gems);
      return {
        killTriggered,
        firstSpawned: !!first,
        firstTier: firstSkill.tier,
        firstKind: firstSkill.kind,
        firstSkillVisible: firstSkill.blooms > 0 || firstSkill.beams > 0,
        firstSkillThreat: firstSkill.hpLost,
        bossDefeated,
        firstBossChestReward,
        firstRewardBurst,
        nextTarget,
        nextTargetAdvanced: nextTarget > 2,
        secondSpawned: !!second,
        secondTier: secondSkill.tier,
        secondKind: secondSkill.kind,
        secondSkillVisible: secondSkill.blooms > 0 || secondSkill.beams > 0,
        secondStronger: secondSkill.tier > firstSkill.tier && secondSkill.cooldown > 0 && secondSkill.cooldown <= firstSkill.cooldown,
        secondBossChestReward,
        secondRewardBurst,
        activeName,
      };
    });

    let upgraded = false;
    let sawAbility = false;
    let sawRelic = false;
    let choiceStyle = { colored: false, icons: false };
    let routeToast = { visible: false, text: "" };
    let routeMemory = { exists: false, text: "", thumbLabel: "" };
    async function captureChoiceStyle() {
      return page.$$eval(".choice", (buttons) => ({
          types: buttons.map((button) => button.dataset.type || ""),
          colored: buttons.every((button) => {
            const style = getComputedStyle(button);
            return parseFloat(style.borderLeftWidth) >= 6 && style.borderLeftColor !== "rgba(0, 0, 0, 0)";
          }),
          innerFrames: buttons.every((button) => {
            const before = getComputedStyle(button, "::before");
            return before.content !== "none" && before.borderTopColor !== "rgba(0, 0, 0, 0)";
          }),
          distinctFrames: new Set(buttons.map((button) => getComputedStyle(button).borderLeftColor)).size,
          icons: buttons.every((button) => !!button.querySelector(".choice-icon.mini-glyph")),
          levels: buttons.every((button) => button.querySelector(".choice-level")?.textContent.includes("Lv")),
          effects: buttons.every((button) => button.querySelector(".choice-effect")?.textContent.includes("本次")),
          effectText: buttons.map((button) => button.querySelector(".choice-effect")?.textContent || "").join("|"),
          synergy: buttons.every((button) => (button.querySelector(".choice-synergy")?.textContent || "").trim().length > 0),
          synergyText: buttons.map((button) => button.querySelector(".choice-synergy")?.textContent || "").join("|"),
          noFitLine: buttons.every((button) => !button.querySelector(".choice-fit")),
          conciseCards: buttons.every((button) => (button.textContent || "").length < 240),
          plainNotes: buttons.every((button) => !(button.querySelector(".choice-desc")?.textContent || "").includes("出现条件")),
          upgradePlan: document.querySelector("#upgradePlan")?.textContent || "",
          upgradePlanCards: document.querySelectorAll("#upgradePlan span").length,
          upgradePlanColumns: getComputedStyle(document.querySelector("#upgradePlan")).gridTemplateColumns,
          routeCards: buttons.filter((button) => button.querySelectorAll(".route-option").length === 2).length,
          routeText: buttons.map((button) => [...button.querySelectorAll(".route-option")].map((route) => route.textContent || "").join(" / ")).join("|"),
          routeTags: buttons.map((button) => [...button.querySelectorAll(".route-tag")].map((tag) => tag.textContent || "").join(" / ")).join("|"),
          routePlain: buttons.some((button) => [...button.querySelectorAll(".route-tag")].some((tag) => (tag.textContent || "").trim().length > 0)),
          routePayoff: buttons.some((button) => [...button.querySelectorAll(".route-payoff")].some((payoff) => /马上生效|更常发动|高风险|慢，但很痛/.test(payoff.textContent || ""))),
          routeAria: buttons.some((button) => [...button.querySelectorAll(".route-option")].every((route) => (route.getAttribute("aria-label") || "").includes("已选") && (route.getAttribute("aria-label") || "").includes("这边"))),
          routeHelp: buttons.some((button) => (button.querySelector(".route-compare p")?.textContent || "").includes("还能改")),
      }));
    }
    async function chooseVisibleUpgrade(preferType = "能力") {
      if (!(await page.locator("#upgradeOverlay.visible").count())) return false;
      const types = await page.$$eval(".choice", (buttons) => buttons.map((button) => button.dataset.type));
      choiceStyle = await captureChoiceStyle();
      sawAbility = sawAbility || types.includes("能力");
      sawRelic = sawRelic || types.includes("遗物");
      const preferredIndex = types.indexOf(preferType);
      await page.locator(".choice").nth(preferredIndex >= 0 ? preferredIndex : 0).click();
      upgraded = true;
      await page.waitForTimeout(140);
      if (!(await page.locator("#pageTransition.visible.run").count())) {
        errors.push("upgrade transition did not run");
      }
      await page.waitForTimeout(1050);
      return true;
    }
    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      debug.game.enemies.length = 0;
      debug.player.hp = debug.player.maxHp;
      debug.gainXp(debug.player.nextXp);
    });
    await page.waitForTimeout(80);
    await chooseVisibleUpgrade("能力");
    for (let i = 0; i < 10; i += 1) {
      if (upgraded) break;
      await page.keyboard.down(i % 2 ? "a" : "d");
      await page.keyboard.down(i % 3 ? "s" : "w");
      await page.waitForTimeout(1200);
      await page.keyboard.up(i % 2 ? "a" : "d");
      await page.keyboard.up(i % 3 ? "s" : "w");
      if (await chooseVisibleUpgrade("能力")) {
        break;
      }
    }

    for (let i = 0; i < 4 && !sawRelic; i += 1) {
      await page.evaluate(() => {
        const debug = window.__moonSurvivorDebug;
        debug.gainXp(debug.player.nextXp);
      });
      await page.waitForTimeout(80);
      await chooseVisibleUpgrade("遗物");
    }

    const synergy = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      const enemy = game.enemies[0] || {
        x: player.x + 48,
        y: player.y,
        r: 18,
        hp: 120,
        maxHp: 120,
        dmg: 0,
        xp: 0,
        speed: 0,
        color: "#3d4652",
        phase: 0,
        type: "test",
        hit: 0,
        slow: 0,
      };
      if (!game.enemies.includes(enemy)) game.enemies.push(enemy);
      const beforeProjectiles = game.projectiles.length;
      player.abilities.inkMark = true;
      player.relics.moonMirror = true;
      if (enemy) debug.triggerInkBurst(enemy.x, enemy.y, 70, 999);
      const mirrorSpawned = game.projectiles.length > beforeProjectiles;
      player.abilities.dewPulse = true;
      player.relics.dewHourglass = true;
      player.brushTimer = player.brushCooldown;
      player.flameTimer = 3;
      debug.triggerDewPulse();
      return {
        mirrorSpawned,
        cooldownReduced: player.brushTimer < player.brushCooldown || player.flameTimer < 3,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = 3;
      player.abilities.inkMark = true;
      debug.gainXp(player.nextXp);
    });
    await page.waitForTimeout(80);
    const superTypes = await page.$$eval(".choice", (buttons) => buttons.map((button) => button.dataset.type));
    const sawSuper = superTypes.includes("超武");
    const superChoiceFrame = await page.evaluate(() => {
      const el = [...document.querySelectorAll(".choice")].find((button) => button.dataset.type === "超武");
      if (!el) return { exists: false };
      const style = getComputedStyle(el);
      const before = getComputedStyle(el, "::before");
      const after = getComputedStyle(el, "::after");
      return {
        exists: true,
        id: el.dataset.id || "",
        borderWidth: parseFloat(style.borderLeftWidth),
        borderColor: style.borderLeftColor,
        boxShadow: style.boxShadow,
        innerBorder: before.borderTopColor,
        markWidth: parseFloat(after.width),
        ornament: after.backgroundImage,
      };
    });
    const superActivationBefore = await page.evaluate(() => {
      const { game } = window.__moonSurvivorDebug;
      return {
        projectiles: game.projectiles.length,
        blooms: game.blooms.length,
        trails: game.trails.length,
      };
    });
    if (sawSuper) {
      await page.locator(".choice").nth(superTypes.indexOf("超武")).click();
      await page.waitForTimeout(1050);
    } else if (await page.locator("#upgradeOverlay.visible").count()) {
      await page.locator(".choice").first().click();
      await page.waitForTimeout(1050);
    }
    await page.waitForFunction(() => window.__moonSurvivorDebug.state === "playing" && !document.querySelector("#upgradeOverlay").classList.contains("visible"), null, { timeout: 5000 })
      .catch(() => errors.push("run did not return to playing before chest regression"));
    const superWeapon = await page.evaluate((before) => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      const spawned = game.projectiles.slice(before.projectiles);
      return {
        evolved: player.evolutions.voidBrush,
        spawned: spawned.length >= 3,
        source: spawned.some((projectile) => projectile.source === "voidBrush") ? "voidBrush" : spawned[0]?.source || "",
        blooms: Math.max(0, game.blooms.length - before.blooms),
        bloomSeen: game.blooms.some((bloom) => bloom.kind === "evolve"),
        trails: game.trails.length - before.trails,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    }, superActivationBefore);

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = Math.min(player.brushCount, 2);
      player.orbs = Math.min(player.orbs, 2);
      player.flameLevel = Math.min(player.flameLevel, 1);
      player.frostLevel = 0;
      player.sigilLevel = 0;
      player.jadeLevel = 0;
      player.needleLevel = 0;
      player.fanLevel = 0;
      debug.openChest({
        x: player.x,
        y: player.y,
        r: 21,
        tier: "elite",
        rewardCount: 3,
        phase: 0,
        life: 0,
      });
      if (game.chestState?.timer) {
        window.clearTimeout(game.chestState.timer);
        game.chestState.timer = null;
      }
    });
    await page.waitForTimeout(180);
    const chestOpening = await page.evaluate(() => ({
      visible: document.querySelector("#chestOverlay").classList.contains("visible"),
      revealed: document.querySelector("#chestOverlay").classList.contains("revealed"),
    }));
    await page.locator("#chestOverlay").click({ position: { x: 20, y: 20 } });
    await page.locator("#chestOverlay").click({ position: { x: 30, y: 30 } });
    await page.locator("#chestOverlay").click({ position: { x: 40, y: 40 } });
    await page.waitForTimeout(120);
    const chestRevealed = await page.evaluate(() => ({
      visible: document.querySelector("#chestOverlay").classList.contains("visible"),
      revealed: document.querySelector("#chestOverlay").classList.contains("revealed"),
      rewards: document.querySelectorAll(".reward-card").length,
      rewardFrames: [...document.querySelectorAll(".reward-card")].map((card) => {
        const style = getComputedStyle(card);
        const before = getComputedStyle(card, "::before");
        return {
          type: card.dataset.type || "",
          borderWidth: parseFloat(style.borderLeftWidth),
          borderColor: style.borderLeftColor,
          innerBorder: before.borderTopColor,
          hasInner: before.content !== "none",
        };
      }),
      title: document.querySelector("#chestTitle").textContent,
      build: document.querySelector("#buildText").textContent,
    }));
    await page.locator("#chestContinueButton").click();
    await page.waitForTimeout(140);
    const chestClosed = await page.evaluate(() => ({
      visible: document.querySelector("#chestOverlay").classList.contains("visible"),
      state: window.__moonSurvivorDebug.game.chestState,
    }));
    const chestResonance = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player } = debug;
      player.relics.chestResonance = true;
      player.brushTimer = player.brushCooldown;
      player.flameTimer = 3;
      player.orbSurge = 0;
      debug.triggerChestResonance(5);
      return {
        cooldownReduced: player.brushTimer < player.brushCooldown || player.flameTimer < 3,
        orbSurged: player.orbSurge > 0,
      };
    });
    const lacquerKey = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.relics.lacquerKey = true;
      player.dewCharge = player.dewThreshold - 1;
      const beforeBlooms = game.blooms.length;
      debug.addDewCharge(2);
      return {
        pulseTriggered: game.blooms.length > beforeBlooms,
        chargeWrapped: player.dewCharge < player.dewThreshold - 1,
      };
    });
    const craneVow = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.craneVow = true;
      player.evolutions.voidBrush = true;
      player.craneCharges = 3;
      player.craneTimer = 0;
      const before = game.projectiles.length;
      debug.updateCraneVow(0.016, { x: 1, y: 0 });
      const spawned = game.projectiles.slice(before);
      return {
        spawned: spawned.length >= 4,
        source: spawned[0]?.source || "",
        pierce: spawned[0]?.pierce || 0,
        spent: player.craneCharges === 0,
      };
    });
    const focusLensEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.relics.focusLens = false;
      game.picks = game.picks.filter((pick) => pick.id !== "focus");
      game.picks.push({ id: "focus", type: "身法", name: "站定大激光", desc: "站着不动换攻速和激光。", count: 1 });
      const applied = debug.applyUpgradeById("relic-focus-lens");
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      player.focusStillness = 1.2;
      game.enemies.push({ x: player.x + 180, y: player.y + 8, r: 16, hp: 120, maxHp: 120, speed: 0, xp: 0, kind: "test", slow: 0 });
      const triggered = debug.triggerStandingLaser();
      return {
        applied,
        owned: player.relics.focusLens,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: game.blooms.length > beforeBlooms,
        panel: document.querySelector("#relicBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      document.querySelector("#upgradeOverlay")?.classList.remove("visible");
      window.__moonSurvivorDebug.game.pendingUpgrades = 0;
    });
    await page.locator("#codexButton").click();
    await page.waitForTimeout(120);
    const codexOpen = await page.evaluate(() => ({
      visible: document.querySelector("#codexOverlay").classList.contains("visible"),
      summary: document.querySelector("#codexSummary").textContent,
      cards: document.querySelectorAll(".codex-card").length,
      glyphs: document.querySelectorAll(".codex-glyph").length,
      trees: document.querySelectorAll(".evolution-tree").length,
      ready: document.querySelectorAll(".codex-card.is-ready").length,
      owned: document.querySelectorAll(".codex-card.is-owned").length,
      routeSummaries: document.querySelectorAll(".codex-route-summary").length,
      routeSummaryText: [...document.querySelectorAll(".codex-route-summary")].map((node) => node.textContent || "").join("|"),
      superFrames: [...document.querySelectorAll('.codex-card[data-type="超武"]')].map((card) => ({
        id: card.dataset.id || "",
        border: getComputedStyle(card).borderTopColor,
        shadow: getComputedStyle(card).boxShadow,
        inner: getComputedStyle(card, "::before").borderTopColor,
        markWidth: parseFloat(getComputedStyle(card, "::after").width),
      })),
      text: document.querySelector("#codexGrid").textContent,
    }));
    const codexTreeBefore = await page.evaluate(() => {
      const card = [...document.querySelectorAll(".codex-card")].find((node) => node.textContent.includes("墨锋加密"));
      const tree = card?.querySelector(".evolution-tree");
      return {
        exists: !!tree,
        hiddenBefore: tree ? getComputedStyle(tree).maxHeight === "0px" : false,
      };
    });
    const brushCodexCard = page.locator(".codex-card").filter({ hasText: "墨锋加密" });
    if ((await brushCodexCard.count()) === 1) {
      await brushCodexCard.hover();
      await page.waitForTimeout(320);
    } else {
      errors.push("brush codex card was not unique");
    }
    const codexTree = await page.evaluate(() => {
      const card = [...document.querySelectorAll(".codex-card")].find((node) => node.textContent.includes("墨锋加密"));
      const tree = card?.querySelector(".evolution-tree");
      const style = tree ? getComputedStyle(tree) : null;
      return {
        exists: !!tree,
        hiddenBefore: false,
        visibleAfter: !!style && style.opacity !== "0" && style.maxHeight !== "0px",
        text: tree?.textContent || "",
      };
    });
    codexTree.hiddenBefore = codexTreeBefore.hiddenBefore;
    await page.locator("#codexCloseButton").click();
    await page.waitForTimeout(80);
    const codexClosed = await page.evaluate(() => ({
      visible: document.querySelector("#codexOverlay").classList.contains("visible"),
    }));
    if (await page.locator("#upgradeOverlay.visible").count()) {
      await page.locator(".choice").first().click();
      await page.waitForTimeout(1050);
    }

    const after = await page.evaluate(() => ({
      time: document.querySelector("#timeText").textContent,
      level: Number(document.querySelector("#levelText").textContent),
      kills: Number(document.querySelector("#killText").textContent),
      build: document.querySelector("#buildText").textContent,
      weaponPanel: document.querySelector("#weaponBuildPanel").textContent,
      relicPanel: document.querySelector("#relicBuildPanel").textContent,
      traitPanel: document.querySelector("#traitBuildPanel").textContent,
      buildPanelIcons: document.querySelectorAll(".build-panel .mini-glyph").length,
      upgradeVisible: document.querySelector("#upgradeOverlay").classList.contains("visible"),
      gameOverVisible: document.querySelector("#gameOverOverlay").classList.contains("visible"),
      canvasBytes: document.querySelector("canvas").toDataURL().length,
      health: document.querySelector("#healthBar").style.width,
      healthText: document.querySelector("#healthText").textContent,
      healthAria: document.querySelector(".bar.health").getAttribute("aria-valuenow"),
      superBuildFrame: (() => {
        const el = document.querySelector('#weaponBuildPanel .build-chip[data-type="超武"]');
        if (!el) return { exists: false };
        const style = getComputedStyle(el);
        const after = getComputedStyle(el, "::after");
        return {
          exists: true,
          id: el.dataset.id || "",
          border: style.borderTopColor,
          shadow: style.boxShadow,
          markWidth: parseFloat(after.width),
        };
      })(),
    }));

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = 6;
      player.orbs = 6;
      player.flameLevel = 5;
      player.branches.brushSplinter = 0;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      Object.keys(player.abilities).forEach((key) => { player.abilities[key] = true; });
      Object.keys(player.relics).forEach((key) => { player.relics[key] = true; });
      player.relics.branchInkstone = false;
      Object.keys(player.evolutions).forEach((key) => { player.evolutions[key] = true; });
      game.picks = game.picks.filter((pick) => !["branch-brush-splinter", "branch-brush-rain", "branch-orb-recall", "branch-orb-shatter", "branch-flame-cinder", "branch-flame-tide", "branch-crane-echo", "branch-frost-echo", "stride", "heart", "focus"].includes(pick.id));
      game.picks.push(
        { id: "stride", type: "身法", name: "风步", desc: "移动速度提升，拾取范围扩大。", count: 4 },
        { id: "heart", type: "生存", name: "朱砂护心", desc: "生命上限与当下生命一起提升。", count: 4 },
        { id: "focus", type: "身法", name: "站定大激光", desc: "所有伤害小幅提升。", count: 5 },
      );
      debug.showUpgradeById("branch-brush-splinter");
    });
    await page.waitForTimeout(80);
    const brushSplinterOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-brush-splinter"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (brushSplinterOption.exists) {
      await page.locator('.choice[data-id="branch-brush-splinter"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("brush splinter branch option did not appear");
    }
    const brushSplinterEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.relics.moonMirror = true;
      player.evolutions.voidBrush = true;
      const before = game.projectiles.length;
      const triggered = debug.triggerBrushSplinters(player.x, player.y, 0, 2);
      const spawned = game.projectiles.slice(before);
      return {
        level: player.branches.brushSplinter,
        triggered,
        spawned: spawned.length,
        sources: spawned.map((proj) => proj.source).join("|"),
        pierce: spawned[0]?.pierce ?? -1,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = 4;
      player.focusStillness = 1.1;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 0;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.lanternGleam = 3;
      player.branches.lanternVein = 3;
      player.branches.sigilEcho = 3;
      player.branches.sigilCurtain = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-brush-rain");
      debug.showUpgradeById("branch-brush-rain");
    });
    await page.waitForTimeout(80);
    const brushRainOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-brush-rain"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (brushRainOption.exists) {
      await page.locator('.choice[data-id="branch-brush-rain"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("brush rain branch option did not appear");
    }
    const brushRainEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      const enemy = game.enemies[0] || { x: player.x + 90, y: player.y, r: 15, hp: 80, maxHp: 80, hit: 0, color: "#000" };
      if (!game.enemies.includes(enemy)) game.enemies.push(enemy);
      enemy.x = player.x + 70;
      enemy.y = player.y;
      enemy.hp = 80;
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const triggered = debug.triggerBrushRain(player.x, player.y, 0, 4);
      return {
        level: player.branches.brushRain,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "brushRain"),
        damaged: enemy.hp < 80,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = 6;
      player.orbs = 6;
      player.flameLevel = 5;
      player.frostLevel = 5;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 0;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-orb-recall");
      debug.showUpgradeById("branch-orb-recall");
    });
    await page.waitForTimeout(80);
    const branchOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-orb-recall"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (branchOption.exists) {
      await page.locator('.choice[data-id="branch-orb-recall"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("orb recall branch option did not appear");
    }
    const branchEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.relics.starChart = true;
      player.orbSurge = 0;
      const enemy = {
        x: player.x + 30,
        y: player.y,
        r: 16,
        hp: 90,
        maxHp: 90,
        dmg: 0,
        xp: 0,
        speed: 0,
        color: "#3d4652",
        phase: 0,
        type: "test",
        hit: 0,
        slow: 0,
      };
      game.enemies.push(enemy);
      const beforeHp = enemy.hp;
      const beforeBlooms = game.blooms.length;
      const triggered = debug.triggerStarRecall(5);
      return {
        level: player.branches.orbRecall,
        triggered,
        damaged: enemy.hp < beforeHp,
        bloom: game.blooms.length > beforeBlooms && game.blooms.at(-1).kind === "starRecall",
        orbSurged: player.orbSurge >= 1.7,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = 6;
      player.orbs = 4;
      player.flameLevel = 5;
      player.frostLevel = 5;
      player.relics.starChart = true;
      player.evolutions.starRiver = true;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 0;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-orb-shatter");
      debug.showUpgradeById("branch-orb-shatter");
    });
    await page.waitForTimeout(80);
    const orbShatterOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-orb-shatter"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (orbShatterOption.exists) {
      await page.locator('.choice[data-id="branch-orb-shatter"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("orb shatter branch option did not appear");
    }
    const orbShatterEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.evolutions.starRiver = true;
      const before = game.projectiles.length;
      const beforeTrails = game.trails.length;
      player.orbSurge = 0;
      const triggered = debug.triggerStarShards(player.x, player.y, 0, 2);
      const spawned = game.projectiles.slice(before);
      return {
        level: player.branches.orbShatter,
        triggered,
        spawned: spawned.length,
        sources: spawned.map((proj) => proj.source).join("|"),
        pierce: spawned[0]?.pierce ?? -1,
        orbSurged: player.orbSurge > 1,
        trail: game.trails.length > beforeTrails && game.trails.at(-1).kind === "star",
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = 6;
      player.orbs = 6;
      player.flameLevel = 5;
      player.frostLevel = 5;
      player.abilities.emberWeb = true;
      Object.keys(player.evolutions).forEach((key) => { player.evolutions[key] = true; });
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 0;
      player.branches.flameTide = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-flame-cinder");
      debug.showUpgradeById("branch-flame-cinder");
    });
    await page.waitForTimeout(80);
    const cinderOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-flame-cinder"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (cinderOption.exists) {
      await page.locator('.choice[data-id="branch-flame-cinder"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("flame cinder branch option did not appear");
    }
    const cinderEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.evolutions.moonLotus = true;
      const enemy = {
        x: player.x + 24,
        y: player.y,
        r: 16,
        hp: 90,
        maxHp: 90,
        dmg: 0,
        xp: 0,
        speed: 0,
        color: "#3d4652",
        phase: 0,
        type: "test",
        hit: 0,
        slow: 0,
        ember: 3,
      };
      game.enemies.push(enemy);
      const beforeHp = enemy.hp;
      const beforeBlooms = game.blooms.length;
      const triggered = debug.triggerCinderBloom(player.x, player.y, enemy.ember);
      return {
        level: player.branches.flameCinder,
        triggered,
        damaged: enemy.hp < beforeHp,
        bloom: game.blooms.length > beforeBlooms && game.blooms.at(-1).kind === "cinder",
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.brushCount = 6;
      player.orbs = 6;
      player.flameLevel = 5;
      player.frostLevel = 5;
      player.abilities.dewPulse = true;
      Object.keys(player.evolutions).forEach((key) => { player.evolutions[key] = true; });
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 0;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-flame-tide");
      debug.showUpgradeById("branch-flame-tide");
    });
    await page.waitForTimeout(80);
    const flameTideOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-flame-tide"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (flameTideOption.exists) {
      await page.locator('.choice[data-id="branch-flame-tide"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("flame tide branch option did not appear");
    }
    const flameTideEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.evolutions.moonLotus = true;
      const enemy = {
        x: player.x + 28,
        y: player.y,
        r: 16,
        hp: 90,
        maxHp: 90,
        dmg: 0,
        xp: 0,
        speed: 0,
        color: "#3d4652",
        phase: 0,
        type: "test",
        hit: 0,
        slow: 0,
      };
      game.enemies.push(enemy);
      const beforeHp = enemy.hp;
      const beforeBlooms = game.blooms.length;
      const triggered = debug.triggerFlameTide(player.x, player.y, 8);
      return {
        level: player.branches.flameTide,
        triggered,
        damaged: enemy.hp < beforeHp,
        embered: enemy.ember > 0,
        bloom: game.blooms.length > beforeBlooms && game.blooms.at(-1).kind === "flameTide",
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.craneVow = true;
      player.speed = 212;
      player.brushCount = 6;
      player.orbs = 6;
      player.flameLevel = 5;
      player.frostLevel = 5;
      Object.keys(player.evolutions).forEach((key) => { player.evolutions[key] = true; });
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.craneEcho = 0;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-crane-echo");
      debug.showUpgradeById("branch-crane-echo");
    });
    await page.waitForTimeout(80);
    const craneEchoOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-crane-echo"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (craneEchoOption.exists) {
      await page.locator('.choice[data-id="branch-crane-echo"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("crane echo branch option did not appear");
    }
    const craneEchoEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.speed = 212;
      const before = game.projectiles.length;
      const triggered = debug.triggerCraneEcho(player.x, player.y, 0, 3);
      const spawned = game.projectiles.slice(before);
      return {
        level: player.branches.craneEcho,
        triggered,
        spawned: spawned.length,
        sources: spawned.map((proj) => proj.source).join("|"),
        pierce: spawned[0]?.pierce ?? -1,
        panel: document.querySelector("#traitBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.lanternLevel = 3;
      player.sigilLevel = 1;
      player.abilities.dewPulse = true;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.lanternGleam = 3;
      player.branches.lanternVein = 0;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-lantern-vein");
      debug.showUpgradeById("branch-lantern-vein");
    });
    await page.waitForTimeout(80);
    const lanternVeinOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-lantern-vein"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (lanternVeinOption.exists) {
      await page.locator('.choice[data-id="branch-lantern-vein"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("lantern vein branch option did not appear");
    }
    const lanternVeinEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.sigilTimer = player.sigilCooldown;
      player.dewCharge = 0;
      game.enemies.push({
        x: player.x + 120,
        y: player.y,
        r: 18,
        hp: 80,
        maxHp: 80,
        dmg: 0,
        xp: 0,
        speed: 0,
        color: "#3d4652",
        phase: 0,
        type: "test",
        hit: 0,
        slow: 0,
      });
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const triggered = debug.triggerLanternVein(player.x, player.y, 2);
      return {
        level: player.branches.lanternVein,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: game.blooms.length > beforeBlooms && game.blooms.at(-1).kind === "lanternVein",
        cooldownReduced: player.sigilTimer < player.sigilCooldown,
        dewCharged: player.dewCharge > 0,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.sigilLevel = 3;
      player.focusStillness = 1.1;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.lanternGleam = 3;
      player.branches.lanternVein = 3;
      player.branches.sigilEcho = 3;
      player.branches.sigilCurtain = 0;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-sigil-curtain");
      debug.showUpgradeById("branch-sigil-curtain");
    });
    await page.waitForTimeout(80);
    const sigilCurtainOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-sigil-curtain"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (sigilCurtainOption.exists) {
      await page.locator('.choice[data-id="branch-sigil-curtain"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("sigil curtain branch option did not appear");
    }
    const sigilCurtainEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.focusStillness = 1.2;
      game.enemies.push({
        x: player.x + 80,
        y: player.y,
        r: 18,
        hp: 90,
        maxHp: 90,
        dmg: 0,
        xp: 0,
        speed: 0,
        color: "#3d4652",
        phase: 0,
        type: "test",
        hit: 0,
        slow: 0,
      });
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeHp = game.enemies.at(-1).hp;
      const triggered = debug.triggerSigilCurtain(player.x, player.y, 0, 2);
      return {
        level: player.branches.sigilCurtain,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: game.blooms.length > beforeBlooms && game.blooms.at(-1).kind === "sigilCurtain",
        damaged: game.enemies.at(-1)?.hp < beforeHp,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.jadeLevel = 3;
      player.branches.jadeChain = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-jade-chain");
      debug.showUpgradeById("branch-jade-chain");
    });
    await page.waitForTimeout(80);
    const jadeChainOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-jade-chain"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (jadeChainOption.exists) {
      await page.locator('.choice[data-id="branch-jade-chain"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("jade chain branch option did not appear");
    }
    const jadeChainEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.jadeLevel = Math.max(player.jadeLevel, 3);
      player.relics.branchInkstone = true;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      game.enemies.push(
        { x: player.x + 86, y: player.y, r: 18, hp: 110, maxHp: 110, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 138, y: player.y + 38, r: 18, hp: 110, maxHp: 110, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 178, y: player.y - 42, r: 18, hp: 110, maxHp: 110, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
      );
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeCharge = player.dewCharge;
      const triggered = debug.triggerJadeStrike(3);
      return {
        level: player.branches.jadeChain,
        triggered,
        beams: game.beams.length - beforeBeams,
        chainBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "jadeChain"),
        dewCharged: player.dewCharge > beforeCharge,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.jadeLevel = 4;
      player.focusStillness = 1.25;
      player.relics.focusLens = true;
      player.branches.jadeChain = 0;
      player.branches.jadeWard = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-jade-ward");
      debug.showUpgradeById("branch-jade-ward");
    });
    await page.waitForTimeout(80);
    const jadeWardOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-jade-ward"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (jadeWardOption.exists) {
      await page.locator('.choice[data-id="branch-jade-ward"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("jade ward branch option did not appear");
    }
    const jadeWardEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.jadeLevel = Math.max(player.jadeLevel, 4);
      player.focusStillness = 1.25;
      player.relics.focusLens = true;
      player.relics.branchInkstone = true;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.mods.jadeSeal = Math.max(player.mods.jadeSeal, 2);
      player.branches.jadeChain = 0;
      game.enemies.push(
        { x: player.x + 92, y: player.y, r: 18, hp: 170, maxHp: 170, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 126, y: player.y + 32, r: 18, hp: 170, maxHp: 170, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 150, y: player.y - 34, r: 18, hp: 170, maxHp: 170, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
      );
      const observed = game.enemies.slice(-3);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const triggered = debug.triggerJadeStrike(4);
      return {
        level: player.branches.jadeWard,
        triggered,
        beams: game.beams.length - beforeBeams,
        wardBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "jadeWard"),
        wardTrail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "jadeWard"),
        damaged: observed.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: observed.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.needleLevel = 0;
      player.mods.needleShower = 0;
      player.mods.needleSeal = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "needle");
      debug.showUpgradeById("needle");
    });
    await page.waitForTimeout(80);
    const needleOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-base-id="needle"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        routes: el?.querySelectorAll(".route-option").length || 0,
        routeText: [...(el?.querySelectorAll(".route-option") || [])].map((route) => route.textContent).join("|"),
        routeTags: [...(el?.querySelectorAll(".route-tag") || [])].map((tag) => tag.textContent).join("|"),
        effect: el?.querySelector(".choice-effect")?.textContent || "",
        note: el?.querySelector(".choice-desc")?.textContent || "",
      };
    });
    if (needleOption.exists) {
      await page.locator('.choice[data-base-id="needle"]').click();
      await page.waitForTimeout(160);
      routeToast = await page.evaluate(() => {
        const el = document.querySelector("#routeToast");
        return {
          visible: el?.classList.contains("visible") || false,
          text: el?.textContent || "",
          top: el ? getComputedStyle(el).top : "",
        };
      });
      routeMemory = await page.evaluate(() => {
        const chip = document.querySelector('#traitBuildPanel .build-chip[data-id="route-last"]');
        const thumb = document.querySelector('#traitBuildPanel .build-thumb[data-id="route-last"]');
        return {
          exists: !!chip && !!thumb,
          text: chip?.textContent || "",
          thumbLabel: thumb?.getAttribute("aria-label") || "",
        };
      });
      await page.waitForTimeout(1050);
    } else {
      errors.push("needle weapon option did not appear");
    }
    const needleEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.needleLevel = Math.max(player.needleLevel, 3);
      player.mods.needleShower = Math.max(player.mods.needleShower, 1);
      player.mods.needleSeal = Math.max(player.mods.needleSeal, 2);
      player.focusStillness = 1.2;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      game.enemies.push(
        { x: player.x + 80, y: player.y, r: 18, hp: 130, maxHp: 130, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0.8 },
        { x: player.x + 124, y: player.y + 24, r: 18, hp: 130, maxHp: 130, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 160, y: player.y - 28, r: 18, hp: 130, maxHp: 130, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
      );
      const observed = game.enemies.slice(-3);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const triggered = debug.triggerNeedleRain(3);
      return {
        level: player.needleLevel,
        triggered,
        beams: game.beams.length - beforeBeams,
        needleBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "needle"),
        loomBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "needleLoom"),
        needleTrail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "needle"),
        loomTrail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "needleLoom"),
        damaged: observed.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: observed.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.fanLevel = 0;
      player.mods.fanWide = 0;
      player.mods.fanReturn = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "fan");
      debug.showUpgradeById("fan");
    });
    await page.waitForTimeout(80);
    const fanOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-base-id="fan"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        routes: el?.querySelectorAll(".route-option").length || 0,
        routeText: [...(el?.querySelectorAll(".route-option") || [])].map((route) => route.textContent).join("|"),
        effect: el?.querySelector(".choice-effect")?.textContent || "",
      };
    });
    if (fanOption.exists) {
      await page.locator('.choice[data-base-id="fan"] .route-option[data-route-id="return"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("fan weapon option did not appear");
    }
    const fanEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.fanLevel = Math.max(player.fanLevel, 2);
      player.mods.fanWide = Math.max(player.mods.fanWide, 1);
      player.mods.fanReturn = Math.max(player.mods.fanReturn, 1);
      player.abilities.dewPulse = true;
      player.evolutions.jadeFan = false;
      player.dewCharge = 0;
      const enemies = [
        { x: player.x + 76, y: player.y, r: 18, hp: 120, maxHp: 120, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 112, y: player.y + 28, r: 18, hp: 120, maxHp: 120, dmg: 0, xp: 0, speed: 0, color: "#6f8d64", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...enemies);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const triggered = debug.triggerFanGust(0, 2);
      return {
        level: player.fanLevel,
        returnRoute: player.mods.fanReturn,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "fan"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "fan"),
        damaged: enemies.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: enemies.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > 0,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.fanLevel = 3;
      player.mods.fanWide = Math.max(player.mods.fanWide, 1);
      player.mods.fanReturn = Math.max(player.mods.fanReturn, 1);
      player.branches.fanGale = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-fan-gale");
      debug.showUpgradeById("branch-fan-gale");
    });
    await page.waitForTimeout(80);
    const fanBranchOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-fan-gale"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (fanBranchOption.exists) {
      await page.locator('.choice[data-id="branch-fan-gale"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("fan gale branch option did not appear");
    }
    const fanBranchEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.relics.branchInkstone = true;
      player.focusStillness = 1.1;
      player.evolutions.jadeFan = false;
      const enemies = [
        { x: player.x + 56, y: player.y, r: 18, hp: 140, maxHp: 140, dmg: 0, xp: 0, speed: 0, color: "#c99a2e", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 72, y: player.y + 18, r: 18, hp: 140, maxHp: 140, dmg: 0, xp: 0, speed: 0, color: "#c99a2e", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...enemies);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const beforeTimer = player.fanTimer = player.fanCooldown;
      const triggered = debug.triggerFanGale(player.x + 62, player.y, 0, 3);
      return {
        level: player.branches.fanGale,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "fanGale"),
        inkstoneBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "branchInkstone"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "fan"),
        damaged: enemies.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: enemies.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
        cooldownReduced: player.fanTimer < beforeTimer,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.fanLevel = 4;
      player.mods.fanWide = Math.max(player.mods.fanWide, 1);
      player.mods.fanReturn = Math.max(player.mods.fanReturn, 1);
      player.branches.fanFeather = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-fan-feather");
      debug.showUpgradeById("branch-fan-feather");
    });
    await page.waitForTimeout(80);
    const fanFeatherOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-fan-feather"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        effect: el?.querySelector(".choice-effect")?.textContent || "",
      };
    });
    if (fanFeatherOption.exists) {
      await page.locator('.choice[data-id="branch-fan-feather"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("fan feather branch option did not appear");
    }
    const fanFeatherEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.relics.branchInkstone = true;
      player.evolutions.jadeFan = false;
      const enemies = [
        { x: player.x + 92, y: player.y - 20, r: 18, hp: 145, maxHp: 145, dmg: 0, xp: 0, speed: 0, color: "#8ca56b", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 138, y: player.y + 24, r: 18, hp: 145, maxHp: 145, dmg: 0, xp: 0, speed: 0, color: "#8ca56b", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 178, y: player.y - 38, r: 18, hp: 145, maxHp: 145, dmg: 0, xp: 0, speed: 0, color: "#8ca56b", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...enemies);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const beforeTimer = player.fanTimer = player.fanCooldown;
      const triggered = debug.triggerFanFeathers(player.x + 72, player.y, 0, 3);
      const blooms = game.blooms.slice(beforeBlooms);
      return {
        level: player.branches.fanFeather,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: blooms.some((bloom) => bloom.kind === "fanFeather"),
        inkstoneBloom: blooms.some((bloom) => bloom.kind === "branchInkstone"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "fanFeather"),
        damaged: enemies.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: enemies.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
        cooldownReduced: player.fanTimer < beforeTimer,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.fanLevel = 5;
      player.mods.fanWide = Math.max(player.mods.fanWide, 1);
      player.mods.fanReturn = Math.max(player.mods.fanReturn, 1);
      player.branches.fanGale = Math.max(player.branches.fanGale, 1);
      player.branches.fanFeather = Math.max(player.branches.fanFeather, 1);
      player.abilities.dewPulse = true;
      player.evolutions.jadeFan = false;
      game.picks = game.picks.filter((pick) => pick.id !== "evolve-jade-fan");
      debug.showUpgradeById("evolve-jade-fan");
    });
    await page.waitForTimeout(80);
    const fanSuperOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="evolve-jade-fan"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        frame: el ? getComputedStyle(el).boxShadow + getComputedStyle(el).borderColor : "",
      };
    });
    const fanSuperBefore = await page.evaluate(() => {
      const { game } = window.__moonSurvivorDebug;
      return { beams: game.beams.length, blooms: game.blooms.length, trails: game.trails.length };
    });
    if (fanSuperOption.exists) {
      await page.locator('.choice[data-id="evolve-jade-fan"]').click();
      await page.waitForTimeout(80);
    } else {
      errors.push("jade fan super option did not appear");
    }
    const fanSuperActivation = await page.evaluate((before) => {
      const { player, game } = window.__moonSurvivorDebug;
      const blooms = game.blooms.slice(before.blooms);
      return {
        evolved: player.evolutions.jadeFan,
        beams: game.beams.length - before.beams,
        coreBloom: blooms.some((bloom) => bloom.kind === "jadeFanCore"),
        fanBloom: blooms.some((bloom) => bloom.kind === "jadeFan"),
        trail: game.trails.slice(before.trails).some((trail) => trail.kind === "jadeFan"),
      };
    }, fanSuperBefore);
    await page.waitForTimeout(970);
    const fanSuperEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.focusStillness = 1.1;
      player.dewCharge = 0;
      game.enemies.push(
        { x: player.x + 72, y: player.y - 12, r: 18, hp: 210, maxHp: 210, dmg: 0, xp: 0, speed: 0, color: "#dde6c9", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 118, y: player.y + 34, r: 18, hp: 210, maxHp: 210, dmg: 0, xp: 0, speed: 0, color: "#dde6c9", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 150, y: player.y - 44, r: 18, hp: 210, maxHp: 210, dmg: 0, xp: 0, speed: 0, color: "#dde6c9", phase: 0, type: "test", hit: 0, slow: 0 },
      );
      const observed = game.enemies.slice(-3);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const triggered = debug.triggerFanGust(0, 5);
      const blooms = game.blooms.slice(beforeBlooms);
      return {
        evolved: player.evolutions.jadeFan,
        triggered,
        beams: game.beams.length - beforeBeams,
        coreBloom: blooms.some((bloom) => bloom.kind === "jadeFanCore"),
        fanBloom: blooms.some((bloom) => bloom.kind === "jadeFan"),
        galeBloom: blooms.some((bloom) => bloom.kind === "jadeFanGale"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "jadeFan"),
        damagedAll: observed.every((enemy) => enemy.hp < enemy.maxHp),
        slowedAll: observed.every((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > 0,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.umbrellaLevel = 0;
      player.mods.umbrellaGuard = 0;
      player.mods.umbrellaSpine = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "umbrella");
      debug.showUpgradeById("umbrella");
    });
    await page.waitForTimeout(80);
    const umbrellaOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-base-id="umbrella"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        routes: el?.querySelectorAll(".route-option").length || 0,
        routeText: [...(el?.querySelectorAll(".route-option") || [])].map((route) => route.textContent).join("|"),
        effect: el?.querySelector(".choice-effect")?.textContent || "",
      };
    });
    if (umbrellaOption.exists) {
      await page.locator('.choice[data-base-id="umbrella"] .route-option[data-route-id="spine"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("umbrella weapon option did not appear");
    }
    const umbrellaEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.umbrellaLevel = Math.max(player.umbrellaLevel, 2);
      player.mods.umbrellaGuard = Math.max(player.mods.umbrellaGuard, 1);
      player.mods.umbrellaSpine = Math.max(player.mods.umbrellaSpine, 1);
      player.abilities.dewPulse = true;
      player.relics.tempoBell = true;
      player.dewCharge = 0;
      player.focusStillness = 1.1;
      player.invuln = 0;
      const enemies = [
        { x: player.x + 44, y: player.y, r: 18, hp: 150, maxHp: 150, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 96, y: player.y + 18, r: 18, hp: 150, maxHp: 150, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 145, y: player.y - 22, r: 18, hp: 150, maxHp: 150, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...enemies);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const beforeInvuln = player.invuln;
      const beforeTimer = player.umbrellaTimer = player.umbrellaCooldown;
      const triggered = debug.triggerUmbrellaBloom(3);
      const blooms = game.blooms.slice(beforeBlooms);
      return {
        level: player.umbrellaLevel,
        spineRoute: player.mods.umbrellaSpine,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: blooms.some((bloom) => bloom.kind === "umbrella"),
        tempoBloom: blooms.some((bloom) => bloom.kind === "tempoBell"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "umbrella"),
        damaged: enemies.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: enemies.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
        invulnRaised: player.invuln > beforeInvuln,
        cooldownReduced: player.umbrellaTimer < beforeTimer,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.umbrellaLevel = 3;
      player.mods.umbrellaGuard = Math.max(player.mods.umbrellaGuard, 1);
      player.mods.umbrellaSpine = Math.max(player.mods.umbrellaSpine, 1);
      player.branches.umbrellaLotus = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-umbrella-lotus");
      debug.showUpgradeById("branch-umbrella-lotus");
    });
    await page.waitForTimeout(80);
    const umbrellaLotusOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-umbrella-lotus"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        effect: el?.querySelector(".choice-effect")?.textContent || "",
      };
    });
    if (umbrellaLotusOption.exists) {
      await page.locator('.choice[data-id="branch-umbrella-lotus"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("umbrella lotus branch option did not appear");
    }
    const umbrellaLotusEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.relics.branchInkstone = true;
      player.focusStillness = 1.1;
      player.invuln = 0;
      const enemies = [
        { x: player.x + 38, y: player.y, r: 18, hp: 155, maxHp: 155, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 78, y: player.y + 26, r: 18, hp: 155, maxHp: 155, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 112, y: player.y - 30, r: 18, hp: 155, maxHp: 155, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...enemies);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const beforeTimer = player.umbrellaTimer = player.umbrellaCooldown;
      const triggered = debug.triggerUmbrellaLotus(player.x, player.y, 3);
      const blooms = game.blooms.slice(beforeBlooms);
      return {
        level: player.branches.umbrellaLotus,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: blooms.some((bloom) => bloom.kind === "umbrellaLotus"),
        inkstoneBloom: blooms.some((bloom) => bloom.kind === "branchInkstone"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "umbrellaLotus"),
        damaged: enemies.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: enemies.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
        cooldownReduced: player.umbrellaTimer < beforeTimer,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.umbrellaLevel = 4;
      player.mods.umbrellaGuard = Math.max(player.mods.umbrellaGuard, 1);
      player.mods.umbrellaSpine = Math.max(player.mods.umbrellaSpine, 2);
      player.branches.umbrellaEcho = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-umbrella-echo");
      debug.showUpgradeById("branch-umbrella-echo");
    });
    await page.waitForTimeout(80);
    const umbrellaEchoOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-umbrella-echo"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        effect: el?.querySelector(".choice-effect")?.textContent || "",
      };
    });
    if (umbrellaEchoOption.exists) {
      await page.locator('.choice[data-id="branch-umbrella-echo"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("umbrella echo branch option did not appear");
    }
    const umbrellaEchoEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.relics.branchInkstone = true;
      player.focusStillness = 1.1;
      player.invuln = 0;
      const enemies = [
        { x: player.x + 96, y: player.y - 42, r: 18, hp: 165, maxHp: 165, dmg: 0, xp: 0, speed: 0, color: "#8f7bb5", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 142, y: player.y + 34, r: 18, hp: 165, maxHp: 165, dmg: 0, xp: 0, speed: 0, color: "#8f7bb5", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x - 128, y: player.y + 58, r: 18, hp: 165, maxHp: 165, dmg: 0, xp: 0, speed: 0, color: "#8f7bb5", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...enemies);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const beforeTimer = player.umbrellaTimer = player.umbrellaCooldown;
      const triggered = debug.triggerUmbrellaEcho(player.x, player.y, 3);
      const blooms = game.blooms.slice(beforeBlooms);
      return {
        level: player.branches.umbrellaEcho,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: blooms.some((bloom) => bloom.kind === "umbrellaEcho"),
        inkstoneBloom: blooms.some((bloom) => bloom.kind === "branchInkstone"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "umbrellaEcho"),
        damaged: enemies.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: enemies.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > beforeCharge,
        cooldownReduced: player.umbrellaTimer < beforeTimer,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.needleLevel = 3;
      player.branches.needleCurtain = 0;
      player.branches.needleSeal = 0;
      player.frostLevel = Math.max(player.frostLevel, 1);
      player.abilities.dewPulse = true;
      game.picks = game.picks.filter((pick) => !["branch-needle-curtain", "branch-needle-seal"].includes(pick.id));
      debug.showUpgradeById("branch-needle-curtain");
    });
    await page.waitForTimeout(80);
    const needleBranchOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-base-id="branch-needle-curtain"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
        level: el?.querySelector(".choice-level")?.textContent || "",
        effect: el?.querySelector(".choice-effect")?.textContent || "",
      };
    });
    if (needleBranchOption.exists) {
      await page.locator('.choice[data-base-id="branch-needle-curtain"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("needle curtain branch option did not appear");
    }
    const needleBranchEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.needleLevel = Math.max(player.needleLevel, 3);
      player.branches.needleCurtain = Math.max(player.branches.needleCurtain, 2);
      player.branches.needleSeal = Math.max(player.branches.needleSeal, 2);
      player.mods.needleSeal = Math.max(player.mods.needleSeal, 1);
      player.focusStillness = 1.15;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      game.enemies.push(
        { x: player.x + 76, y: player.y - 12, r: 18, hp: 170, maxHp: 170, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0.9 },
        { x: player.x + 112, y: player.y + 34, r: 18, hp: 170, maxHp: 170, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 154, y: player.y - 42, r: 18, hp: 170, maxHp: 170, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
      );
      const observed = game.enemies.slice(-3);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const beforeCharge = player.dewCharge;
      const triggered = debug.triggerNeedleRain(4);
      return {
        curtainLevel: player.branches.needleCurtain,
        sealLevel: player.branches.needleSeal,
        triggered,
        beams: game.beams.length - beforeBeams,
        curtainBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "needleCurtain"),
        sealBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "needleSeal"),
        curtainTrail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "needleCurtain"),
        sealTrail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "needleSeal"),
        damagedAll: observed.every((enemy) => enemy.hp < enemy.maxHp),
        dewCharged: player.dewCharge > beforeCharge,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.frostLevel = 3;
      player.abilities.dewPulse = true;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
    player.branches.flameCinder = 3;
    player.branches.flameTide = 3;
    player.branches.craneEcho = 3;
    player.branches.lanternGleam = 3;
    player.branches.lanternVein = 3;
    player.branches.sigilEcho = 3;
    player.branches.sigilCurtain = 3;
    player.branches.frostEcho = 0;
    player.branches.frostLattice = 3;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-frost-echo");
      debug.showUpgradeById("branch-frost-echo");
    });
    await page.waitForTimeout(80);
    const frostEchoOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-frost-echo"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (frostEchoOption.exists) {
      await page.locator('.choice[data-id="branch-frost-echo"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("frost echo branch option did not appear");
    }
    const frostEchoEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      const before = game.projectiles.length;
      const beforeTrails = game.trails.length;
      const triggered = debug.triggerFrostEcho(player.x, player.y, 0, 3);
      const spawned = game.projectiles.slice(before);
      return {
        level: player.branches.frostEcho,
        triggered,
        spawned: spawned.length,
        sources: spawned.map((proj) => proj.source).join("|"),
        dewCharged: player.dewCharge > 0,
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "frost"),
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.frostLevel = 4;
      player.focusStillness = 1.15;
      player.abilities.dewPulse = true;
      player.evolutions.frostZither = true;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.lanternGleam = 3;
      player.branches.lanternVein = 3;
      player.branches.sigilEcho = 3;
      player.branches.sigilCurtain = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 0;
      game.picks = game.picks.filter((pick) => pick.id !== "branch-frost-lattice");
      debug.showUpgradeById("branch-frost-lattice");
    });
    await page.waitForTimeout(80);
    const frostLatticeOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="branch-frost-lattice"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (frostLatticeOption.exists) {
      await page.locator('.choice[data-id="branch-frost-lattice"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("frost lattice branch option did not appear");
    }
    const frostLatticeEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.dewCharge = 0;
      game.enemies.push({
        x: player.x + 64,
        y: player.y,
        r: 18,
        hp: 90,
        maxHp: 90,
        dmg: 0,
        xp: 0,
        speed: 0,
        color: "#7b8dbb",
        phase: 0,
        type: "test",
        hit: 0,
        slow: 0,
      });
      const enemy = game.enemies.at(-1);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const triggered = debug.triggerFrostLattice(player.x, player.y, 4);
      return {
        level: player.branches.frostLattice,
        triggered,
        beams: game.beams.length - beforeBeams,
        bloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "frostLattice"),
        damaged: enemy.hp < 90,
        slowed: enemy.slow > 0,
        dewCharged: player.dewCharge > 0,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.frostLevel = 4;
      player.abilities.dewPulse = true;
      player.branches.frostLattice = 3;
      Object.keys(player.evolutions).forEach((key) => { player.evolutions[key] = true; });
      player.evolutions.frostZither = false;
      game.picks = game.picks.filter((pick) => pick.id !== "evolve-frost-zither");
      debug.showUpgradeById("evolve-frost-zither");
    });
    await page.waitForTimeout(80);
    const frostSuperOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="evolve-frost-zither"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    const frostSuperBefore = await page.evaluate(() => {
      const { game } = window.__moonSurvivorDebug;
      return { projectiles: game.projectiles.length, blooms: game.blooms.length, trails: game.trails.length };
    });
    if (frostSuperOption.exists) {
      await page.locator('.choice[data-id="evolve-frost-zither"]').click();
      await page.waitForTimeout(80);
    } else {
      errors.push("frost zither super option did not appear");
    }
    const frostSuperActivation = await page.evaluate((before) => {
      const { player, game } = window.__moonSurvivorDebug;
      const spawned = game.projectiles.slice(before.projectiles);
      return {
        evolved: player.evolutions.frostZither,
        spawned: spawned.filter((projectile) => projectile.source === "frostZither").length,
        bloom: game.blooms.length > before.blooms,
        trail: game.trails.length > before.trails,
      };
    }, frostSuperBefore);
    await page.waitForTimeout(970);
    const frostSuperEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      const before = game.projectiles.length;
      debug.makeFrostString(player.x, player.y, 0, 4);
      const spawned = game.projectiles.slice(before);
      return {
        evolved: player.evolutions.frostZither,
        source: spawned[0]?.source || "",
        pierce: spawned[0]?.pierce ?? -1,
        threshold: player.dewThreshold,
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.needleLevel = 5;
      player.abilities.dewPulse = true;
      player.branches.needleCurtain = 2;
      player.branches.needleSeal = 2;
      player.evolutions.rainLoom = false;
      game.picks = game.picks.filter((pick) => pick.id !== "evolve-rain-loom");
      debug.showUpgradeById("evolve-rain-loom");
    });
    await page.waitForTimeout(80);
    const rainSuperOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="evolve-rain-loom"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    const rainSuperBefore = await page.evaluate(() => {
      const { game } = window.__moonSurvivorDebug;
      return { beams: game.beams.length, blooms: game.blooms.length, trails: game.trails.length };
    });
    if (rainSuperOption.exists) {
      await page.locator('.choice[data-id="evolve-rain-loom"]').click();
      await page.waitForTimeout(80);
    } else {
      errors.push("rain loom super option did not appear");
    }
    const rainSuperActivation = await page.evaluate((before) => {
      const { player, game } = window.__moonSurvivorDebug;
      const blooms = game.blooms.slice(before.blooms);
      const trails = game.trails.slice(before.trails);
      return {
        evolved: player.evolutions.rainLoom,
        beams: game.beams.length - before.beams,
        loomBloom: blooms.some((bloom) => bloom.kind === "needleLoom"),
        loomTrail: trails.some((trail) => trail.kind === "needleLoom"),
      };
    }, rainSuperBefore);
    await page.waitForTimeout(970);
    const rainSuperEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.focusStillness = 1.1;
      player.dewCharge = 0;
      game.enemies.push(
        { x: player.x + 68, y: player.y - 18, r: 18, hp: 190, maxHp: 190, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0.8 },
        { x: player.x + 108, y: player.y + 22, r: 18, hp: 190, maxHp: 190, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 148, y: player.y - 46, r: 18, hp: 190, maxHp: 190, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 188, y: player.y + 38, r: 18, hp: 190, maxHp: 190, dmg: 0, xp: 0, speed: 0, color: "#2b7a78", phase: 0, type: "test", hit: 0, slow: 0 },
      );
      const observed = game.enemies.slice(-4);
      const beforeBeams = game.beams.length;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const triggered = debug.triggerNeedleRain(5);
      return {
        evolved: player.evolutions.rainLoom,
        threshold: player.dewThreshold,
        triggered,
        beams: game.beams.length - beforeBeams,
        loomBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "needleLoom"),
        loomTrail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "needleLoom"),
        damagedAll: observed.every((enemy) => enemy.hp < enemy.maxHp),
        panel: document.querySelector("#weaponBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      player.abilities.dewPulse = true;
      Object.keys(player.relics).forEach((key) => { player.relics[key] = true; });
      player.relics.branchInkstone = false;
      game.picks = game.picks.filter((pick) => pick.id !== "relic-branch-inkstone");
      debug.showUpgradeById("relic-branch-inkstone");
    });
    await page.waitForTimeout(80);
    const branchInkstoneOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="relic-branch-inkstone"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (branchInkstoneOption.exists) {
      await page.locator('.choice[data-id="relic-branch-inkstone"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("branch inkstone relic option did not appear");
    }
    const branchInkstoneEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.brushTimer = player.brushCooldown;
      player.flameTimer = 3;
      const beforeBlooms = game.blooms.length;
      const triggered = debug.triggerBranchInkstone("brush", player.x, player.y, 2);
      return {
        owned: player.relics.branchInkstone,
        triggered,
        dewCharged: player.dewCharge > 0,
        cooldownReduced: player.brushTimer < player.brushCooldown || player.flameTimer < 3,
        bloom: game.blooms.length > beforeBlooms && game.blooms.at(-1).kind === "branchInkstone",
        panel: document.querySelector("#relicBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.mods.brushSpeed = Math.max(player.mods.brushSpeed, 1);
      player.mods.needleShower = Math.max(player.mods.needleShower, 1);
      player.relics.routeCharm = false;
      game.picks = game.picks.filter((pick) => pick.id !== "relic-route-charm");
      debug.showUpgradeById("relic-route-charm");
    });
    await page.waitForTimeout(80);
    const routeCharmOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="relic-route-charm"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (routeCharmOption.exists) {
      await page.locator('.choice[data-id="relic-route-charm"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("route charm relic option did not appear");
    }
    const routeCharmEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.brushTimer = player.brushCooldown;
      player.needleTimer = player.needleCooldown;
      player.sigilTimer = player.sigilCooldown;
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const triggered = debug.triggerRouteCharm("needle");
      return {
        owned: player.relics.routeCharm,
        triggered,
        dewCharged: player.dewCharge > 0,
        cooldownReduced: player.brushTimer < player.brushCooldown || player.needleTimer < player.needleCooldown || player.sigilTimer < player.sigilCooldown,
        bloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "routeCharm"),
        trail: game.trails.length > beforeTrails,
        panel: document.querySelector("#relicBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.flameLevel = 1;
      player.sigilLevel = 1;
      player.jadeLevel = 1;
      player.fanLevel = 1;
      player.relics.tempoBell = false;
      game.picks = game.picks.filter((pick) => pick.id !== "relic-tempo-bell");
      debug.showUpgradeById("relic-tempo-bell");
    });
    await page.waitForTimeout(80);
    const tempoBellOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="relic-tempo-bell"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (tempoBellOption.exists) {
      await page.locator('.choice[data-id="relic-tempo-bell"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("tempo bell relic option did not appear");
    }
    const tempoBellEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.abilities.dewPulse = true;
      player.dewCharge = 0;
      player.fanTimer = player.fanCooldown;
      const enemies = [
        { x: player.x + 44, y: player.y, r: 18, hp: 120, maxHp: 120, dmg: 0, xp: 0, speed: 0, color: "#c99a2e", phase: 0, type: "test", hit: 0, slow: 0 },
        { x: player.x + 70, y: player.y + 22, r: 18, hp: 120, maxHp: 120, dmg: 0, xp: 0, speed: 0, color: "#c99a2e", phase: 0, type: "test", hit: 0, slow: 0 },
      ];
      game.enemies.push(...enemies);
      const beforeBlooms = game.blooms.length;
      const beforeTrails = game.trails.length;
      const triggered = debug.triggerTempoBell("fan", player.x + 48, player.y, 4);
      return {
        owned: player.relics.tempoBell,
        triggered,
        bloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "tempoBell"),
        trail: game.trails.slice(beforeTrails).some((trail) => trail.kind === "tempoBell"),
        damaged: enemies.some((enemy) => enemy.hp < enemy.maxHp),
        slowed: enemies.some((enemy) => enemy.slow > 0),
        dewCharged: player.dewCharge > 0,
        cooldownReduced: player.fanTimer < player.fanCooldown,
        panel: document.querySelector("#relicBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.branches.brushSplinter = 3;
      player.branches.brushRain = 3;
      player.branches.orbRecall = 3;
      player.branches.orbShatter = 3;
      player.branches.flameCinder = 3;
      player.branches.flameTide = 3;
      player.branches.craneEcho = 3;
      player.branches.frostEcho = 3;
      player.branches.frostLattice = 3;
      Object.keys(player.relics).forEach((key) => { player.relics[key] = true; });
      player.relics.chestPrism = false;
      game.chestsOpened = Math.max(game.chestsOpened, 1);
      game.picks = game.picks.filter((pick) => pick.id !== "relic-chest-prism");
      debug.showUpgradeById("relic-chest-prism");
    });
    await page.waitForTimeout(80);
    const chestPrismOption = await page.evaluate(() => {
      const el = document.querySelector('.choice[data-id="relic-chest-prism"]');
      return {
        exists: !!el,
        text: el?.textContent || "",
        type: el?.dataset.type || "",
      };
    });
    if (chestPrismOption.exists) {
      await page.locator('.choice[data-id="relic-chest-prism"]').click();
      await page.waitForTimeout(1050);
    } else {
      errors.push("chest prism relic option did not appear");
    }
    const chestPrismEffect = await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      const { player, game } = debug;
      player.evolutions.starRiver = true;
      const beforeProjectiles = game.projectiles.length;
      const beforeBlooms = game.blooms.length;
      const result = debug.triggerChestPrism(3);
      const spawned = game.projectiles.slice(beforeProjectiles);
      return {
        owned: player.relics.chestPrism,
        result,
        spawned: spawned.length,
        sources: spawned.map((proj) => proj.source).join("|"),
        prismBloom: game.blooms.slice(beforeBlooms).some((bloom) => bloom.kind === "prism"),
        panel: document.querySelector("#relicBuildPanel").textContent,
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      debug.player.maxHp = 120;
      debug.player.hp = 37;
      debug.player.invuln = 10;
    });
    await page.waitForTimeout(120);
    const healthMeter = await page.evaluate(() => {
      const bar = document.querySelector(".bar.health");
      return {
        text: document.querySelector("#healthText").textContent,
        width: document.querySelector("#healthBar").style.width,
        state: bar.dataset.healthState,
        ariaNow: bar.getAttribute("aria-valuenow"),
        ariaMax: bar.getAttribute("aria-valuemax"),
      };
    });

    await page.evaluate(() => {
      const debug = window.__moonSurvivorDebug;
      debug.player.hp = 0;
    });
    await page.waitForTimeout(1150);
    const death = await page.evaluate(() => ({
      gameOverVisible: document.querySelector("#gameOverOverlay").classList.contains("visible"),
      text: document.querySelector("#gameOverStats").textContent,
    }));
    await page.close();

    return { loaded, characterSelect, characterStarts, characterChosen, startTransition, started, pauseOpened, pauseResumed, escPauseOpened, escPauseResumed, pauseRestarted, pauseMainMenu, pauseMenuRestarted, pauseDuringUpgrade, resumeToUpgrade, codexPauseStart, codexPauseHeld, codexPauseClosed, pauseDuringChest, resumeToChest, buildPanelsInitial, buildPanelsExpanded, characterTraitFx, routeFeedbackFx, bossEncounter, upgraded, sawAbility, sawRelic, choiceStyle, routeToast, routeMemory, sawSuper, superChoiceFrame, synergy, superWeapon, chestOpening, chestRevealed, chestClosed, chestResonance, lacquerKey, craneVow, focusLensEffect, codexOpen, codexTree, codexClosed, after, healthMeter, brushSplinterOption, brushSplinterEffect, brushRainOption, brushRainEffect, branchOption, branchEffect, orbShatterOption, orbShatterEffect, cinderOption, cinderEffect, flameTideOption, flameTideEffect, craneEchoOption, craneEchoEffect, lanternVeinOption, lanternVeinEffect, sigilCurtainOption, sigilCurtainEffect, jadeChainOption, jadeChainEffect, jadeWardOption, jadeWardEffect, needleOption, needleEffect, fanOption, fanEffect, fanBranchOption, fanBranchEffect, fanFeatherOption, fanFeatherEffect, fanSuperOption, fanSuperActivation, fanSuperEffect, umbrellaOption, umbrellaEffect, umbrellaLotusOption, umbrellaLotusEffect, umbrellaEchoOption, umbrellaEchoEffect, needleBranchOption, needleBranchEffect, frostEchoOption, frostEchoEffect, frostLatticeOption, frostLatticeEffect, frostSuperOption, frostSuperActivation, frostSuperEffect, rainSuperOption, rainSuperActivation, rainSuperEffect, branchInkstoneOption, branchInkstoneEffect, routeCharmOption, routeCharmEffect, tempoBellOption, tempoBellEffect, chestPrismOption, chestPrismEffect, death };
  }

  async function mobileRun() {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) errors.push(`mobile ${message.type()}: ${message.text()}`);
    });

    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForSelector("#touchStick", { timeout: 5000 });
    const initial = await page.evaluate(() => ({
      choices: getComputedStyle(document.querySelector(".choices")).gridTemplateColumns,
      touch: getComputedStyle(document.querySelector("#touchStick")).display,
      startVisible: document.querySelector("#startOverlay").classList.contains("visible"),
      characters: document.querySelectorAll(".character-card").length,
      characterColumns: getComputedStyle(document.querySelector(".character-select")).gridTemplateColumns,
    }));
    await page.tap("#startButton");
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => ({
      time: document.querySelector("#timeText").textContent,
      startVisible: document.querySelector("#startOverlay").classList.contains("visible"),
      touch: getComputedStyle(document.querySelector("#touchStick")).display,
    }));
    await page.close();

    return { initial, after };
  }

  const desktop = await desktopRun();
  const mobile = await mobileRun();
  await browser.close();

  const pass =
    desktop.loaded &&
    desktop.characterSelect.count === 4 &&
    desktop.characterSelect.selected === "wanderer" &&
    desktop.characterSelect.hasStats &&
    desktop.characterSelect.hasTraits &&
    desktop.characterSelect.pauseHidden &&
    desktop.characterSelect.startText.includes("月墨行者") &&
    desktop.characterStarts.length === 4 &&
    new Set(desktop.characterStarts.map((item) => item.weapons)).size === 4 &&
    desktop.characterStarts.every((item) => item.trait && item.traitText.includes(item.trait)) &&
    desktop.characterChosen.selected === "lantern-child" &&
    desktop.characterChosen.startText.includes("流萤拾露") &&
    desktop.startTransition > 0 &&
    desktop.started &&
    desktop.pauseOpened.visible &&
    desktop.pauseOpened.state === "paused" &&
    desktop.pauseOpened.bodyState === "paused" &&
    desktop.pauseOpened.buttons.includes("继续") &&
    desktop.pauseOpened.buttons.includes("重新开始") &&
    desktop.pauseOpened.buttons.includes("回到主菜单") &&
    desktop.pauseResumed.hidden &&
    desktop.pauseResumed.state === "playing" &&
    desktop.escPauseOpened.visible &&
    desktop.escPauseOpened.state === "paused" &&
    desktop.escPauseOpened.bodyState === "paused" &&
    desktop.escPauseResumed.hidden &&
    desktop.escPauseResumed.state === "playing" &&
    desktop.escPauseResumed.bodyState === "playing" &&
    desktop.pauseRestarted.state === "playing" &&
    desktop.pauseRestarted.pauseHidden &&
    desktop.pauseRestarted.startHidden &&
    desktop.pauseRestarted.time === "00:00" &&
    desktop.pauseRestarted.level === "1" &&
    desktop.pauseMainMenu.state === "menu" &&
    desktop.pauseMainMenu.startVisible &&
    desktop.pauseMainMenu.pauseHidden &&
    desktop.pauseMainMenu.selected === "lantern-child" &&
    desktop.pauseMenuRestarted.state === "playing" &&
    desktop.pauseMenuRestarted.startHidden &&
    desktop.pauseMenuRestarted.character === "lantern-child" &&
    desktop.pauseDuringUpgrade.paused &&
    desktop.pauseDuringUpgrade.upgradeStillOpen &&
    desktop.pauseDuringUpgrade.state === "paused" &&
    desktop.resumeToUpgrade.pauseHidden &&
    desktop.resumeToUpgrade.upgradeStillOpen &&
    desktop.resumeToUpgrade.state === "upgrade" &&
    desktop.codexPauseStart.visible &&
    desktop.codexPauseStart.state === "codex" &&
    desktop.codexPauseHeld.visible &&
    desktop.codexPauseHeld.state === "codex" &&
    desktop.codexPauseHeld.time === desktop.codexPauseStart.time &&
    desktop.codexPauseClosed.hidden &&
    desktop.codexPauseClosed.state === "playing" &&
    desktop.pauseDuringChest.paused &&
    desktop.pauseDuringChest.chestStillOpen &&
    !desktop.pauseDuringChest.chestRevealed &&
    desktop.pauseDuringChest.timerStopped &&
    desktop.pauseDuringChest.state === "paused" &&
    desktop.resumeToChest.pauseHidden &&
    desktop.resumeToChest.chestStillOpen &&
    !desktop.resumeToChest.chestRevealed &&
    desktop.resumeToChest.timerResumed &&
    desktop.resumeToChest.state === "chest" &&
    desktop.buildPanelsInitial.character === "lantern-child" &&
    desktop.buildPanelsInitial.hp === 92 &&
    desktop.buildPanelsInitial.pickup >= 180 &&
    desktop.buildPanelsInitial.lanternLevel === 2 &&
    desktop.buildPanelsInitial.panels === 3 &&
    desktop.buildPanelsInitial.weaponChips >= 1 &&
    desktop.buildPanelsInitial.expanded.every((state) => state === "false") &&
    desktop.buildPanelsInitial.toggles.every((state) => state === "false") &&
    desktop.buildPanelsInitial.detailHidden &&
    desktop.buildPanelsInitial.thumbIcons >= 3 &&
    desktop.buildPanelsExpanded.expanded.every((state) => state === "true") &&
    desktop.buildPanelsExpanded.toggles.every((state) => state === "true") &&
    desktop.buildPanelsExpanded.detailVisible &&
    desktop.buildPanelsExpanded.plans.length === 3 &&
    desktop.buildPanelsExpanded.plans.some((text) => text.includes("当前主线")) &&
    desktop.buildPanelsExpanded.plans.some((text) => text.includes("下一步") || text.includes("继续")) &&
    desktop.buildPanelsExpanded.plans.some((text) => text.includes("流派方向")) &&
    desktop.buildPanelsExpanded.chipHints.length >= 3 &&
    desktop.buildPanelsExpanded.scrollable &&
    desktop.buildPanelsInitial.icons >= 3 &&
    desktop.buildPanelsInitial.weaponText.includes("流萤灯") &&
    desktop.buildPanelsInitial.weaponRouteReadable &&
    desktop.buildPanelsInitial.traitText.includes("流萤拾露") &&
    desktop.buildPanelsInitial.traitText.includes("萤露回灯") &&
    desktop.buildPanelsInitial.goalText.includes("盼头") &&
    /前期求生|中期成型|成型清场|极限挑战/.test(desktop.buildPanelsInitial.goalText) &&
    /月露|宝箱|Boss|超武|精英/.test(desktop.buildPanelsInitial.goalText) &&
    desktop.characterTraitFx.exposed &&
    desktop.characterTraitFx.bloomCount >= 4 &&
    desktop.characterTraitFx.projectileDelta >= 3 &&
    ["characterHarmony", "characterBell", "characterEmber", "characterLantern"].every((kind) => desktop.characterTraitFx.kinds.includes(kind)) &&
    desktop.routeFeedbackFx.exposed &&
    desktop.routeFeedbackFx.triggered &&
    desktop.routeFeedbackFx.routeBloom &&
    desktop.routeFeedbackFx.beams >= 6 &&
    desktop.routeFeedbackFx.trail &&
    desktop.routeFeedbackFx.particles >= 8 &&
    desktop.routeFeedbackFx.damaged &&
    desktop.routeFeedbackFx.slowed &&
    desktop.routeFeedbackFx.dewCharged &&
    desktop.bossEncounter.killTriggered &&
    desktop.bossEncounter.firstSpawned &&
    desktop.bossEncounter.firstTier === 1 &&
    desktop.bossEncounter.firstSkillVisible &&
    desktop.bossEncounter.firstSkillThreat &&
    desktop.bossEncounter.bossDefeated &&
    desktop.bossEncounter.firstBossChestReward === 3 &&
    desktop.bossEncounter.firstRewardBurst &&
    desktop.bossEncounter.nextTargetAdvanced &&
    desktop.bossEncounter.secondSpawned &&
    desktop.bossEncounter.secondTier === 2 &&
    desktop.bossEncounter.secondKind !== desktop.bossEncounter.firstKind &&
    desktop.bossEncounter.secondSkillVisible &&
    desktop.bossEncounter.secondStronger &&
    desktop.bossEncounter.secondBossChestReward === 5 &&
    desktop.bossEncounter.secondRewardBurst &&
    desktop.bossEncounter.activeName.includes("首领") &&
    desktop.upgraded &&
    desktop.sawAbility &&
    desktop.choiceStyle.colored &&
    desktop.choiceStyle.innerFrames &&
    desktop.choiceStyle.distinctFrames >= Math.min(new Set(desktop.choiceStyle.types).size, 2) &&
    desktop.choiceStyle.icons &&
    desktop.choiceStyle.levels &&
    desktop.choiceStyle.effects &&
    desktop.choiceStyle.effectText.includes("本次") &&
    desktop.choiceStyle.synergy &&
    /玩法|解锁|遗物|超武|通用/.test(desktop.choiceStyle.synergyText) &&
    desktop.choiceStyle.noFitLine &&
    desktop.choiceStyle.conciseCards &&
    desktop.choiceStyle.plainNotes &&
    desktop.choiceStyle.upgradePlanCards === 3 &&
    desktop.choiceStyle.upgradePlan.includes("主线") &&
    desktop.choiceStyle.upgradePlan.includes("下一步") &&
    desktop.choiceStyle.upgradePlan.includes("候选") &&
    desktop.routeToast.visible &&
    desktop.routeToast.text.includes("已改方向") &&
    desktop.routeToast.text.includes("雨墨针") &&
    /马上生效|更常发动|高风险|慢，但很痛/.test(desktop.routeToast.text) &&
    desktop.routeMemory.exists &&
    desktop.routeMemory.text.includes("刚选路线") &&
    desktop.routeMemory.text.includes("雨墨针") &&
    desktop.routeMemory.text.includes("已生效") &&
    desktop.routeMemory.text.includes("仍可改另一边") &&
    desktop.routeMemory.thumbLabel.includes("刚选路线") &&
    desktop.sawRelic &&
    desktop.sawSuper &&
    desktop.superChoiceFrame.exists &&
    desktop.superChoiceFrame.id.startsWith("evolve-") &&
    desktop.superChoiceFrame.borderWidth >= 6 &&
    desktop.superChoiceFrame.innerBorder !== "rgba(0, 0, 0, 0)" &&
    desktop.superChoiceFrame.markWidth >= 34 &&
    desktop.superChoiceFrame.ornament.includes("linear-gradient") &&
    desktop.synergy.mirrorSpawned &&
    desktop.synergy.cooldownReduced &&
    desktop.superWeapon.evolved &&
    desktop.superWeapon.spawned &&
    desktop.superWeapon.source === "voidBrush" &&
    (desktop.superWeapon.blooms > 0 || desktop.superWeapon.bloomSeen) &&
    desktop.superWeapon.trails > 0 &&
    desktop.superWeapon.panel.includes("万象墨锋") &&
    desktop.chestOpening.visible &&
    !desktop.chestOpening.revealed &&
    desktop.chestRevealed.visible &&
    desktop.chestRevealed.revealed &&
    [1, 3, 5].includes(desktop.chestRevealed.rewards) &&
    desktop.chestRevealed.rewardFrames.length === desktop.chestRevealed.rewards &&
    desktop.chestRevealed.rewardFrames.every((frame) => frame.borderWidth >= 5 && frame.borderColor !== "rgba(0, 0, 0, 0)" && frame.hasInner && frame.innerBorder !== "rgba(0, 0, 0, 0)") &&
    new Set(desktop.chestRevealed.rewardFrames.map((frame) => frame.borderColor)).size >= Math.min(new Set(desktop.chestRevealed.rewardFrames.map((frame) => frame.type)).size, 2) &&
    !desktop.chestClosed.visible &&
    desktop.chestResonance.cooldownReduced &&
    desktop.chestResonance.orbSurged &&
    desktop.lacquerKey.pulseTriggered &&
    desktop.lacquerKey.chargeWrapped &&
    desktop.craneVow.spawned &&
    desktop.craneVow.source === "crane" &&
    desktop.craneVow.pierce >= 6 &&
    desktop.craneVow.spent &&
    desktop.focusLensEffect.applied &&
    desktop.focusLensEffect.owned &&
    desktop.focusLensEffect.triggered &&
    desktop.focusLensEffect.beams >= 3 &&
    desktop.focusLensEffect.bloom &&
    desktop.focusLensEffect.panel.includes("小激光镜") &&
    desktop.codexOpen.visible &&
    desktop.codexOpen.summary.includes("武器层级") &&
    desktop.codexOpen.summary.includes("超武/宝箱") &&
    desktop.codexOpen.cards >= 35 &&
    desktop.codexOpen.glyphs === desktop.codexOpen.cards &&
    desktop.codexOpen.trees === desktop.codexOpen.cards &&
    desktop.codexOpen.routeSummaries >= 10 &&
    desktop.codexOpen.routeSummaryText.includes("下次可改选") &&
    desktop.codexOpen.routeSummaryText.includes("路线：") &&
    desktop.codexOpen.superFrames.length >= 6 &&
    desktop.codexOpen.superFrames.some((frame) => frame.id === "evolve-rain-loom") &&
    desktop.codexOpen.superFrames.some((frame) => frame.id === "evolve-jade-fan") &&
    new Set(desktop.codexOpen.superFrames.map((frame) => frame.border)).size >= 5 &&
    new Set(desktop.codexOpen.superFrames.map((frame) => frame.markWidth)).size >= 5 &&
    desktop.codexOpen.superFrames.every((frame) => frame.id.startsWith("evolve-") && frame.inner !== "rgba(0, 0, 0, 0)") &&
    desktop.codexOpen.owned > 0 &&
    desktop.codexOpen.text.includes("万象墨锋") &&
    desktop.codexOpen.text.includes("纸鹤誓约") &&
    desktop.codexOpen.text.includes("墨痕回环") &&
    desktop.codexOpen.text.includes("星移回响") &&
    desktop.codexOpen.text.includes("焰心复燃") &&
    desktop.codexOpen.text.includes("萤露回灯") &&
    desktop.codexOpen.text.includes("霜弦拨月") &&
    desktop.codexOpen.text.includes("墨锋骤雨") &&
    desktop.codexOpen.text.includes("霜弦封阵") &&
    desktop.codexOpen.text.includes("暗幕大激光") &&
    desktop.codexOpen.text.includes("霜月琴") &&
    desktop.codexOpen.text.includes("清风玉阙") &&
    desktop.codexOpen.text.includes("玉扇裂羽") &&
    desktop.codexOpen.text.includes("墨莲伞") &&
    desktop.codexOpen.text.includes("墨伞莲阵") &&
    desktop.codexOpen.text.includes("伞影回潮") &&
    desktop.codexTree.exists &&
    desktop.codexTree.hiddenBefore &&
    desktop.codexTree.visibleAfter &&
    desktop.codexTree.text.includes("进化树") &&
    desktop.codexTree.text.includes("配合") &&
    desktop.codexTree.text.includes("最终形态") &&
    desktop.codexTree.text.includes("路线1") &&
    desktop.codexTree.text.includes("不会被上次路线锁住") &&
    !desktop.codexTree.text.includes("联动：") &&
    desktop.codexTree.text.includes("万象墨锋") &&
    !desktop.codexClosed.visible &&
    desktop.after.level >= 2 &&
    desktop.after.kills > 0 &&
    desktop.after.build.includes("/") &&
    desktop.after.weaponPanel.includes("Lv") &&
    ["墨锋", "流萤灯", "星铃", "月焰", "霜弦", "照影符", "玉简雷", "雨墨针", "玉扇风", "墨莲伞"].some((name) => desktop.after.weaponPanel.includes(name)) &&
    desktop.after.superBuildFrame.exists &&
    desktop.after.superBuildFrame.id.startsWith("evolve-") &&
    desktop.after.superBuildFrame.markWidth >= 34 &&
    desktop.after.healthText.includes("生命") &&
    desktop.after.healthText.includes("/") &&
    Number(desktop.after.healthAria) > 0 &&
    desktop.healthMeter.text.includes("37 / 120") &&
    desktop.healthMeter.state === "wound" &&
    desktop.healthMeter.ariaNow === "37" &&
    desktop.healthMeter.ariaMax === "120" &&
    desktop.brushSplinterOption.exists &&
    desktop.brushSplinterOption.type === "武器" &&
    desktop.brushSplinterOption.text.includes("命中分裂") &&
    desktop.brushSplinterEffect.level >= 1 &&
    desktop.brushSplinterEffect.triggered &&
    desktop.brushSplinterEffect.spawned >= 4 &&
    desktop.brushSplinterEffect.sources.includes("inkSplinter") &&
    desktop.brushSplinterEffect.pierce >= 1 &&
    desktop.brushSplinterEffect.panel.includes("墨锋散毫") &&
    desktop.brushRainOption.exists &&
    desktop.brushRainOption.type === "武器" &&
    desktop.brushRainOption.text.includes("直线墨雨") &&
    desktop.brushRainEffect.level >= 1 &&
    desktop.brushRainEffect.triggered &&
    desktop.brushRainEffect.beams >= 4 &&
    desktop.brushRainEffect.bloom &&
    desktop.brushRainEffect.damaged &&
    desktop.brushRainEffect.panel.includes("墨锋骤雨") &&
    desktop.branchOption.exists &&
    desktop.branchOption.type === "武器" &&
    desktop.branchOption.text.includes("捡经验召回") &&
    desktop.branchEffect.level >= 1 &&
    desktop.branchEffect.triggered &&
    desktop.branchEffect.damaged &&
    desktop.branchEffect.bloom &&
    desktop.branchEffect.orbSurged &&
    desktop.branchEffect.panel.includes("星铃归潮") &&
    desktop.orbShatterOption.exists &&
    desktop.orbShatterOption.type === "武器" &&
    desktop.orbShatterOption.text.includes("命中碎片") &&
    desktop.orbShatterEffect.level >= 1 &&
    desktop.orbShatterEffect.triggered &&
    desktop.orbShatterEffect.spawned >= 5 &&
    desktop.orbShatterEffect.sources.includes("starShard") &&
    desktop.orbShatterEffect.pierce >= 1 &&
    desktop.orbShatterEffect.orbSurged &&
    desktop.orbShatterEffect.trail &&
    desktop.orbShatterEffect.panel.includes("星铃碎星") &&
    desktop.cinderOption.exists &&
    desktop.cinderOption.type === "武器" &&
    desktop.cinderOption.text.includes("击杀爆炸") &&
    desktop.cinderEffect.level >= 1 &&
    desktop.cinderEffect.triggered &&
    desktop.cinderEffect.damaged &&
    desktop.cinderEffect.bloom &&
    desktop.cinderEffect.panel.includes("月焰烬环") &&
    desktop.flameTideOption.exists &&
    desktop.flameTideOption.type === "武器" &&
    desktop.flameTideOption.text.includes("拾取火潮") &&
    desktop.flameTideEffect.level >= 1 &&
    desktop.flameTideEffect.triggered &&
    desktop.flameTideEffect.damaged &&
    desktop.flameTideEffect.embered &&
    desktop.flameTideEffect.bloom &&
    desktop.flameTideEffect.panel.includes("月焰潮汐") &&
    desktop.craneEchoOption.exists &&
    desktop.craneEchoOption.type === "能力" &&
    desktop.craneEchoOption.text.includes("纸鹤分裂") &&
    desktop.craneEchoEffect.level >= 1 &&
    desktop.craneEchoEffect.triggered &&
    desktop.craneEchoEffect.spawned >= 3 &&
    desktop.craneEchoEffect.sources.includes("craneFeather") &&
    desktop.craneEchoEffect.panel.includes("纸鹤回羽") &&
    desktop.lanternVeinOption.exists &&
    desktop.lanternVeinOption.type === "武器" &&
    desktop.lanternVeinOption.text.includes("追踪激光") &&
    desktop.lanternVeinEffect.level >= 1 &&
    desktop.lanternVeinEffect.triggered &&
    desktop.lanternVeinEffect.beams >= 1 &&
    desktop.lanternVeinEffect.bloom &&
    desktop.lanternVeinEffect.cooldownReduced &&
    desktop.lanternVeinEffect.dewCharged &&
    desktop.lanternVeinEffect.panel.includes("流萤织径") &&
    desktop.sigilCurtainOption.exists &&
    desktop.sigilCurtainOption.type === "武器" &&
    desktop.sigilCurtainOption.text.includes("大激光") &&
    desktop.sigilCurtainEffect.level >= 1 &&
    desktop.sigilCurtainEffect.triggered &&
    desktop.sigilCurtainEffect.beams >= 4 &&
    desktop.sigilCurtainEffect.bloom &&
    desktop.sigilCurtainEffect.damaged &&
    desktop.sigilCurtainEffect.panel.includes("暗幕大激光") &&
    desktop.jadeChainOption.exists &&
    desktop.jadeChainOption.type === "武器" &&
    desktop.jadeChainOption.text.includes("连锁雷") &&
    desktop.jadeChainEffect.level >= 1 &&
    desktop.jadeChainEffect.triggered &&
    desktop.jadeChainEffect.beams >= 3 &&
    desktop.jadeChainEffect.chainBloom &&
    desktop.jadeChainEffect.dewCharged &&
    desktop.jadeChainEffect.panel.includes("玉简连弧") &&
    desktop.jadeWardOption.exists &&
    desktop.jadeWardOption.type === "武器" &&
    desktop.jadeWardOption.text.includes("大雷区") &&
    desktop.jadeWardEffect.level >= 1 &&
    desktop.jadeWardEffect.triggered &&
    desktop.jadeWardEffect.beams >= 5 &&
    desktop.jadeWardEffect.wardBloom &&
    desktop.jadeWardEffect.wardTrail &&
    desktop.jadeWardEffect.damaged &&
    desktop.jadeWardEffect.slowed &&
    desktop.jadeWardEffect.dewCharged &&
    desktop.jadeWardEffect.panel.includes("大雷区") &&
    desktop.needleOption.exists &&
    desktop.needleOption.type === "武器" &&
    desktop.needleOption.text.includes("针雨") &&
    desktop.needleOption.routes === 2 &&
    desktop.needleOption.effect.includes("选 1 条路线") &&
    desktop.needleOption.routeText.includes("路线一") &&
    desktop.needleOption.routeText.includes("路线二") &&
    desktop.needleOption.routeText.includes("已选") &&
    desktop.needleOption.routeText.includes("更常发动") &&
    desktop.needleOption.routeText.includes("慢，但很痛") &&
    desktop.needleOption.routeTags.includes("多目标落针") &&
    desktop.needleOption.routeTags.includes("减速增伤") &&
    desktop.needleOption.text.includes("还能改") &&
    desktop.needleEffect.level >= 1 &&
    desktop.needleEffect.triggered &&
    desktop.needleEffect.beams >= 3 &&
    (desktop.needleEffect.needleBloom || desktop.needleEffect.loomBloom) &&
    (desktop.needleEffect.needleTrail || desktop.needleEffect.loomTrail) &&
    desktop.needleEffect.damaged &&
    desktop.needleEffect.slowed &&
    desktop.needleEffect.dewCharged &&
    desktop.needleEffect.panel.includes("雨墨针") &&
    desktop.fanOption.exists &&
    desktop.fanOption.type === "武器" &&
    desktop.fanOption.text.includes("大扇风") &&
    desktop.fanOption.routes === 2 &&
    desktop.fanOption.routeText.includes("扫得更宽") &&
    desktop.fanOption.routeText.includes("回风返场") &&
    desktop.fanOption.routeText.includes("已选") &&
    desktop.fanEffect.level >= 1 &&
    desktop.fanEffect.returnRoute >= 1 &&
    desktop.fanEffect.triggered &&
    desktop.fanEffect.beams >= 5 &&
    desktop.fanEffect.bloom &&
    desktop.fanEffect.trail &&
    desktop.fanEffect.damaged &&
    desktop.fanEffect.slowed &&
    desktop.fanEffect.dewCharged &&
    desktop.fanEffect.panel.includes("玉扇风") &&
    desktop.fanBranchOption.exists &&
    desktop.fanBranchOption.type === "武器" &&
    desktop.fanBranchOption.text.includes("风纹") &&
    desktop.fanBranchEffect.level >= 1 &&
    desktop.fanBranchEffect.triggered &&
    desktop.fanBranchEffect.beams >= 4 &&
    desktop.fanBranchEffect.bloom &&
    desktop.fanBranchEffect.inkstoneBloom &&
    desktop.fanBranchEffect.trail &&
    desktop.fanBranchEffect.damaged &&
    desktop.fanBranchEffect.slowed &&
    desktop.fanBranchEffect.dewCharged &&
    desktop.fanBranchEffect.cooldownReduced &&
    desktop.fanBranchEffect.panel.includes("玉扇回廊") &&
    desktop.fanFeatherOption.exists &&
    desktop.fanFeatherOption.type === "武器" &&
    desktop.fanFeatherOption.text.includes("追击羽") &&
    desktop.fanFeatherOption.effect.includes("追击羽") &&
    desktop.fanFeatherEffect.level >= 1 &&
    desktop.fanFeatherEffect.triggered &&
    desktop.fanFeatherEffect.beams >= 3 &&
    desktop.fanFeatherEffect.bloom &&
    desktop.fanFeatherEffect.inkstoneBloom &&
    desktop.fanFeatherEffect.trail &&
    desktop.fanFeatherEffect.damaged &&
    desktop.fanFeatherEffect.slowed &&
    desktop.fanFeatherEffect.dewCharged &&
    desktop.fanFeatherEffect.cooldownReduced &&
    desktop.fanFeatherEffect.panel.includes("玉扇裂羽") &&
    desktop.fanSuperOption.exists &&
    desktop.fanSuperOption.type === "超武" &&
    desktop.fanSuperOption.text.includes("超风墙") &&
    desktop.fanSuperOption.text.includes("立刻") &&
    desktop.fanSuperActivation.evolved &&
    desktop.fanSuperActivation.beams >= 7 &&
    desktop.fanSuperActivation.coreBloom &&
    desktop.fanSuperActivation.fanBloom &&
    desktop.fanSuperActivation.trail &&
    desktop.fanSuperEffect.evolved &&
    desktop.fanSuperEffect.triggered &&
    desktop.fanSuperEffect.beams >= 13 &&
    desktop.fanSuperEffect.coreBloom &&
    desktop.fanSuperEffect.fanBloom &&
    desktop.fanSuperEffect.galeBloom &&
    desktop.fanSuperEffect.trail &&
    desktop.fanSuperEffect.damagedAll &&
    desktop.fanSuperEffect.slowedAll &&
    desktop.fanSuperEffect.dewCharged &&
    desktop.fanSuperEffect.panel.includes("清风玉阙") &&
    desktop.umbrellaOption.exists &&
    desktop.umbrellaOption.type === "武器" &&
    desktop.umbrellaOption.text.includes("护身伞") &&
    desktop.umbrellaOption.routes === 2 &&
    desktop.umbrellaOption.routeText.includes("伞面更稳") &&
    desktop.umbrellaOption.routeText.includes("伞骨反刺") &&
    desktop.umbrellaOption.routeText.includes("已选") &&
    desktop.umbrellaOption.effect.includes("选 1 条路线") &&
    desktop.umbrellaEffect.level >= 1 &&
    desktop.umbrellaEffect.spineRoute >= 1 &&
    desktop.umbrellaEffect.triggered &&
    desktop.umbrellaEffect.beams >= 6 &&
    desktop.umbrellaEffect.bloom &&
    desktop.umbrellaEffect.tempoBloom &&
    desktop.umbrellaEffect.trail &&
    desktop.umbrellaEffect.damaged &&
    desktop.umbrellaEffect.slowed &&
    desktop.umbrellaEffect.dewCharged &&
    desktop.umbrellaEffect.invulnRaised &&
    desktop.umbrellaEffect.cooldownReduced &&
    desktop.umbrellaEffect.panel.includes("墨莲伞") &&
    desktop.umbrellaLotusOption.exists &&
    desktop.umbrellaLotusOption.type === "武器" &&
    desktop.umbrellaLotusOption.text.includes("护身阵") &&
    desktop.umbrellaLotusOption.effect.includes("开伞后留下护身阵") &&
    desktop.umbrellaLotusEffect.level >= 1 &&
    desktop.umbrellaLotusEffect.triggered &&
    desktop.umbrellaLotusEffect.beams >= 5 &&
    desktop.umbrellaLotusEffect.bloom &&
    desktop.umbrellaLotusEffect.inkstoneBloom &&
    desktop.umbrellaLotusEffect.trail &&
    desktop.umbrellaLotusEffect.damaged &&
    desktop.umbrellaLotusEffect.slowed &&
    desktop.umbrellaLotusEffect.dewCharged &&
    desktop.umbrellaLotusEffect.cooldownReduced &&
    desktop.umbrellaLotusEffect.panel.includes("墨伞莲阵") &&
    desktop.umbrellaEchoOption.exists &&
    desktop.umbrellaEchoOption.type === "武器" &&
    desktop.umbrellaEchoOption.text.includes("外圈追打") &&
    desktop.umbrellaEchoOption.effect.includes("开伞后追打外圈敌人") &&
    desktop.umbrellaEchoEffect.level >= 1 &&
    desktop.umbrellaEchoEffect.triggered &&
    desktop.umbrellaEchoEffect.beams >= 6 &&
    desktop.umbrellaEchoEffect.bloom &&
    desktop.umbrellaEchoEffect.inkstoneBloom &&
    desktop.umbrellaEchoEffect.trail &&
    desktop.umbrellaEchoEffect.damaged &&
    desktop.umbrellaEchoEffect.slowed &&
    desktop.umbrellaEchoEffect.dewCharged &&
    desktop.umbrellaEchoEffect.cooldownReduced &&
    desktop.umbrellaEchoEffect.panel.includes("伞影回潮") &&
    desktop.needleBranchOption.exists &&
    desktop.needleBranchOption.type === "武器" &&
    desktop.needleBranchOption.text.includes("雨帘") &&
    desktop.needleBranchOption.effect.includes("雨帘") &&
    desktop.needleBranchEffect.curtainLevel >= 1 &&
    desktop.needleBranchEffect.sealLevel >= 1 &&
    desktop.needleBranchEffect.triggered &&
    desktop.needleBranchEffect.beams >= 8 &&
    desktop.needleBranchEffect.curtainBloom &&
    desktop.needleBranchEffect.sealBloom &&
    desktop.needleBranchEffect.curtainTrail &&
    desktop.needleBranchEffect.sealTrail &&
    desktop.needleBranchEffect.damagedAll &&
    desktop.needleBranchEffect.dewCharged &&
    desktop.needleBranchEffect.panel.includes("雨墨帘") &&
    desktop.frostEchoOption.exists &&
    desktop.frostEchoOption.type === "武器" &&
    desktop.frostEchoOption.text.includes("小冰线") &&
    desktop.frostEchoEffect.level >= 1 &&
    desktop.frostEchoEffect.triggered &&
    desktop.frostEchoEffect.spawned >= 3 &&
    desktop.frostEchoEffect.sources.includes("frostEcho") &&
    desktop.frostEchoEffect.dewCharged &&
    desktop.frostEchoEffect.trail &&
    desktop.frostEchoEffect.panel.includes("霜弦裂音") &&
    desktop.frostLatticeOption.exists &&
    desktop.frostLatticeOption.type === "武器" &&
    desktop.frostLatticeOption.text.includes("大冰阵") &&
    desktop.frostLatticeEffect.level >= 1 &&
    desktop.frostLatticeEffect.triggered &&
    desktop.frostLatticeEffect.beams >= 3 &&
    desktop.frostLatticeEffect.bloom &&
    desktop.frostLatticeEffect.damaged &&
    desktop.frostLatticeEffect.slowed &&
    desktop.frostLatticeEffect.dewCharged &&
    desktop.frostLatticeEffect.panel.includes("霜弦封阵") &&
    desktop.frostSuperOption.exists &&
    desktop.frostSuperOption.type === "超武" &&
    desktop.frostSuperOption.text.includes("超冰琴") &&
    desktop.frostSuperOption.text.includes("立刻") &&
    desktop.frostSuperActivation.evolved &&
    desktop.frostSuperActivation.spawned >= 7 &&
    desktop.frostSuperActivation.bloom &&
    desktop.frostSuperActivation.trail &&
    desktop.frostSuperEffect.evolved &&
    desktop.frostSuperEffect.source === "frostZither" &&
    desktop.frostSuperEffect.pierce >= 4 &&
    desktop.frostSuperEffect.threshold <= 7 &&
    desktop.frostSuperEffect.panel.includes("霜月琴") &&
    desktop.rainSuperOption.exists &&
    desktop.rainSuperOption.type === "超武" &&
    desktop.rainSuperOption.text.includes("超雨网") &&
    desktop.rainSuperOption.text.includes("立刻") &&
    desktop.rainSuperActivation.evolved &&
    desktop.rainSuperActivation.beams >= 1 &&
    desktop.rainSuperActivation.loomBloom &&
    desktop.rainSuperActivation.loomTrail &&
    desktop.rainSuperEffect.evolved &&
    desktop.rainSuperEffect.threshold <= 6 &&
    desktop.rainSuperEffect.triggered &&
    desktop.rainSuperEffect.beams >= 10 &&
    desktop.rainSuperEffect.loomBloom &&
    desktop.rainSuperEffect.loomTrail &&
    desktop.rainSuperEffect.damagedAll &&
    desktop.rainSuperEffect.panel.includes("天雨织机") &&
    desktop.branchInkstoneOption.exists &&
    desktop.branchInkstoneOption.type === "遗物" &&
    desktop.branchInkstoneOption.text.includes("分支加速") &&
    desktop.branchInkstoneEffect.owned &&
    desktop.branchInkstoneEffect.triggered &&
    desktop.branchInkstoneEffect.dewCharged &&
    desktop.branchInkstoneEffect.cooldownReduced &&
    desktop.branchInkstoneEffect.bloom &&
    desktop.branchInkstoneEffect.panel.includes("分枝砚") &&
    desktop.routeCharmOption.exists &&
    desktop.routeCharmOption.type === "遗物" &&
    desktop.routeCharmOption.text.includes("路线回响") &&
    desktop.routeCharmEffect.owned &&
    desktop.routeCharmEffect.triggered &&
    desktop.routeCharmEffect.dewCharged &&
    desktop.routeCharmEffect.cooldownReduced &&
    desktop.routeCharmEffect.bloom &&
    desktop.routeCharmEffect.trail &&
    desktop.routeCharmEffect.panel.includes("转向签") &&
    desktop.tempoBellOption.exists &&
    desktop.tempoBellOption.type === "遗物" &&
    desktop.tempoBellOption.text.includes("慢武器重响") &&
    desktop.tempoBellEffect.owned &&
    desktop.tempoBellEffect.triggered &&
    desktop.tempoBellEffect.bloom &&
    desktop.tempoBellEffect.trail &&
    desktop.tempoBellEffect.damaged &&
    desktop.tempoBellEffect.slowed &&
    desktop.tempoBellEffect.dewCharged &&
    desktop.tempoBellEffect.cooldownReduced &&
    desktop.tempoBellEffect.panel.includes("重响磬") &&
    desktop.chestPrismOption.exists &&
    desktop.chestPrismOption.type === "遗物" &&
    desktop.chestPrismOption.text.includes("宝箱触发分支") &&
    desktop.chestPrismEffect.owned &&
    desktop.chestPrismEffect.result.triggered &&
    desktop.chestPrismEffect.result.count >= 2 &&
    desktop.chestPrismEffect.spawned >= 5 &&
    desktop.chestPrismEffect.sources.includes("starShard") &&
    desktop.chestPrismEffect.prismBloom &&
    desktop.chestPrismEffect.panel.includes("匣纹棱镜") &&
    desktop.after.relicPanel.length > 0 &&
    desktop.after.relicPanel.includes("Lv") &&
    desktop.after.traitPanel.length > 0 &&
    desktop.after.traitPanel.includes("Lv") &&
    desktop.after.buildPanelIcons >= 3 &&
    desktop.after.canvasBytes > 5000 &&
    !desktop.after.upgradeVisible &&
    desktop.death.gameOverVisible &&
    desktop.death.text.includes("这把故事") &&
    desktop.death.text.includes("差一点") &&
    desktop.death.text.includes("下把可试") &&
    mobile.initial.choices === "1fr" &&
    mobile.initial.characters === 4 &&
    mobile.initial.characterColumns.split(" ").length === 2 &&
    mobile.after.touch === "block" &&
    errors.length === 0;

  const failed = [];
  const note = (name, condition) => {
    if (!condition) failed.push(name);
  };
  note("chest", desktop.chestOpening.visible && !desktop.chestOpening.revealed && desktop.chestRevealed.visible && desktop.chestRevealed.revealed && [1, 3, 5].includes(desktop.chestRevealed.rewards) && desktop.chestRevealed.rewardFrames.length === desktop.chestRevealed.rewards && desktop.chestRevealed.rewardFrames.every((frame) => frame.borderWidth >= 5 && frame.borderColor !== "rgba(0, 0, 0, 0)" && frame.hasInner && frame.innerBorder !== "rgba(0, 0, 0, 0)") && new Set(desktop.chestRevealed.rewardFrames.map((frame) => frame.borderColor)).size >= Math.min(new Set(desktop.chestRevealed.rewardFrames.map((frame) => frame.type)).size, 2) && !desktop.chestClosed.visible);
  note("pause freeze states", desktop.pauseDuringUpgrade.paused && desktop.resumeToUpgrade.state === "upgrade" && desktop.codexPauseHeld.time === desktop.codexPauseStart.time && desktop.codexPauseClosed.state === "playing" && desktop.pauseDuringChest.paused && desktop.pauseDuringChest.timerStopped && desktop.resumeToChest.state === "chest" && desktop.resumeToChest.timerResumed);
  note("route feedback", desktop.routeFeedbackFx.exposed && desktop.routeFeedbackFx.triggered && desktop.routeFeedbackFx.routeBloom && desktop.routeFeedbackFx.beams >= 6 && desktop.routeFeedbackFx.trail && desktop.routeFeedbackFx.particles >= 8 && desktop.routeFeedbackFx.damaged && desktop.routeFeedbackFx.slowed && desktop.routeFeedbackFx.dewCharged);
  note("boss encounter", desktop.bossEncounter.killTriggered && desktop.bossEncounter.firstSpawned && desktop.bossEncounter.firstTier === 1 && desktop.bossEncounter.firstSkillVisible && desktop.bossEncounter.firstSkillThreat && desktop.bossEncounter.bossDefeated && desktop.bossEncounter.firstBossChestReward === 3 && desktop.bossEncounter.firstRewardBurst && desktop.bossEncounter.nextTargetAdvanced && desktop.bossEncounter.secondSpawned && desktop.bossEncounter.secondTier === 2 && desktop.bossEncounter.secondKind !== desktop.bossEncounter.firstKind && desktop.bossEncounter.secondSkillVisible && desktop.bossEncounter.secondStronger && desktop.bossEncounter.secondBossChestReward === 5 && desktop.bossEncounter.secondRewardBurst && desktop.bossEncounter.activeName.includes("首领"));
  note("run goal", desktop.buildPanelsInitial.goalText.includes("盼头") && /前期求生|中期成型|成型清场|极限挑战/.test(desktop.buildPanelsInitial.goalText) && /月露|宝箱|Boss|超武|精英/.test(desktop.buildPanelsInitial.goalText));
  note("route toast", desktop.routeToast.visible && desktop.routeToast.text.includes("已改方向") && desktop.routeToast.text.includes("雨墨针") && /马上生效|更常发动|高风险|慢，但很痛/.test(desktop.routeToast.text));
  note("route memory", desktop.routeMemory.exists && desktop.routeMemory.text.includes("刚选路线") && desktop.routeMemory.text.includes("雨墨针") && desktop.routeMemory.text.includes("已生效") && desktop.routeMemory.text.includes("仍可改另一边") && desktop.routeMemory.thumbLabel.includes("刚选路线"));
  note("codex", desktop.codexOpen.visible && desktop.codexOpen.summary.includes("武器层级") && desktop.codexOpen.summary.includes("超武/宝箱") && desktop.codexOpen.cards >= 35 && desktop.codexOpen.glyphs === desktop.codexOpen.cards && desktop.codexOpen.trees === desktop.codexOpen.cards && desktop.codexOpen.routeSummaries >= 10 && desktop.codexOpen.routeSummaryText.includes("下次可改选") && desktop.codexOpen.routeSummaryText.includes("路线：") && desktop.codexOpen.superFrames.length >= 6 && desktop.codexOpen.superFrames.some((frame) => frame.id === "evolve-rain-loom") && desktop.codexOpen.superFrames.some((frame) => frame.id === "evolve-jade-fan") && new Set(desktop.codexOpen.superFrames.map((frame) => frame.border)).size >= 5 && new Set(desktop.codexOpen.superFrames.map((frame) => frame.markWidth)).size >= 5 && desktop.codexOpen.superFrames.every((frame) => frame.id.startsWith("evolve-") && frame.inner !== "rgba(0, 0, 0, 0)") && desktop.codexOpen.owned > 0 && desktop.codexOpen.text.includes("万象墨锋") && desktop.codexOpen.text.includes("纸鹤誓约") && desktop.codexOpen.text.includes("墨痕回环") && desktop.codexOpen.text.includes("星移回响") && desktop.codexOpen.text.includes("焰心复燃") && desktop.codexOpen.text.includes("萤露回灯") && desktop.codexOpen.text.includes("霜弦拨月") && desktop.codexOpen.text.includes("墨锋骤雨") && desktop.codexOpen.text.includes("霜弦封阵") && desktop.codexOpen.text.includes("暗幕大激光") && desktop.codexOpen.text.includes("霜月琴") && desktop.codexOpen.text.includes("清风玉阙") && desktop.codexOpen.text.includes("玉扇裂羽") && desktop.codexOpen.text.includes("墨莲伞") && desktop.codexOpen.text.includes("墨伞莲阵") && desktop.codexOpen.text.includes("伞影回潮"));
  note("codex tree", desktop.codexTree.exists && desktop.codexTree.hiddenBefore && desktop.codexTree.visibleAfter && desktop.codexTree.text.includes("进化树") && desktop.codexTree.text.includes("配合") && desktop.codexTree.text.includes("最终形态") && desktop.codexTree.text.includes("路线1") && desktop.codexTree.text.includes("不会被上次路线锁住") && !desktop.codexTree.text.includes("联动：") && desktop.codexTree.text.includes("万象墨锋") && !desktop.codexClosed.visible);
  note("post combat", desktop.after.level >= 2 && desktop.after.kills > 0 && desktop.after.build.includes("/") && desktop.after.weaponPanel.includes("Lv") && ["墨锋", "流萤灯", "星铃", "月焰", "霜弦", "照影符", "玉简雷", "雨墨针", "玉扇风", "墨莲伞"].some((name) => desktop.after.weaponPanel.includes(name)) && desktop.after.superBuildFrame.exists && desktop.after.superBuildFrame.id.startsWith("evolve-") && desktop.after.superBuildFrame.markWidth >= 34 && desktop.after.healthText.includes("生命") && desktop.after.healthText.includes("/") && Number(desktop.after.healthAria) > 0 && desktop.healthMeter.text.includes("37 / 120") && desktop.healthMeter.state === "wound" && desktop.healthMeter.ariaNow === "37" && desktop.healthMeter.ariaMax === "120");
  note("umbrella lotus", desktop.umbrellaLotusOption.exists && desktop.umbrellaLotusOption.type === "武器" && desktop.umbrellaLotusOption.text.includes("护身阵") && desktop.umbrellaLotusOption.effect.includes("开伞后留下护身阵") && desktop.umbrellaLotusEffect.level >= 1 && desktop.umbrellaLotusEffect.triggered && desktop.umbrellaLotusEffect.beams >= 5 && desktop.umbrellaLotusEffect.bloom && desktop.umbrellaLotusEffect.inkstoneBloom && desktop.umbrellaLotusEffect.trail && desktop.umbrellaLotusEffect.damaged && desktop.umbrellaLotusEffect.slowed && desktop.umbrellaLotusEffect.dewCharged && desktop.umbrellaLotusEffect.cooldownReduced && desktop.umbrellaLotusEffect.panel.includes("墨伞莲阵"));
  note("umbrella echo", desktop.umbrellaEchoOption.exists && desktop.umbrellaEchoOption.type === "武器" && desktop.umbrellaEchoOption.text.includes("外圈追打") && desktop.umbrellaEchoOption.effect.includes("开伞后追打外圈敌人") && desktop.umbrellaEchoEffect.level >= 1 && desktop.umbrellaEchoEffect.triggered && desktop.umbrellaEchoEffect.beams >= 6 && desktop.umbrellaEchoEffect.bloom && desktop.umbrellaEchoEffect.inkstoneBloom && desktop.umbrellaEchoEffect.trail && desktop.umbrellaEchoEffect.damaged && desktop.umbrellaEchoEffect.slowed && desktop.umbrellaEchoEffect.dewCharged && desktop.umbrellaEchoEffect.cooldownReduced && desktop.umbrellaEchoEffect.panel.includes("伞影回潮"));
  note("late branches", desktop.needleBranchOption.exists && desktop.needleBranchEffect.triggered && desktop.frostEchoOption.exists && desktop.frostEchoEffect.triggered && desktop.frostLatticeOption.exists && desktop.frostLatticeEffect.triggered && desktop.frostSuperOption.exists && desktop.frostSuperEffect.evolved && desktop.rainSuperOption.exists && desktop.rainSuperEffect.evolved);
  note("relic links", desktop.branchInkstoneOption.exists && desktop.branchInkstoneEffect.owned && desktop.routeCharmOption.exists && desktop.routeCharmEffect.owned && desktop.tempoBellOption.exists && desktop.tempoBellEffect.owned && desktop.chestPrismOption.exists && desktop.chestPrismEffect.owned && desktop.chestPrismEffect.result.triggered && desktop.chestPrismEffect.result.count >= 2 && desktop.chestPrismEffect.spawned >= 5 && desktop.chestPrismEffect.sources.includes("starShard") && desktop.chestPrismEffect.prismBloom && desktop.chestPrismEffect.panel.includes("匣纹棱镜"));
  note("final ui", desktop.after.relicPanel.length > 0 && desktop.after.relicPanel.includes("Lv") && desktop.after.traitPanel.length > 0 && desktop.after.traitPanel.includes("Lv") && desktop.after.buildPanelIcons >= 3 && desktop.after.canvasBytes > 5000 && !desktop.after.upgradeVisible && desktop.death.gameOverVisible && mobile.initial.choices === "1fr" && mobile.initial.characters === 4 && mobile.initial.characterColumns.split(" ").length === 2 && mobile.after.touch === "block" && errors.length === 0);
  note("death recap", desktop.death.gameOverVisible && desktop.death.text.includes("这把故事") && desktop.death.text.includes("差一点") && desktop.death.text.includes("下把可试"));

  const result = { pass, failed, desktop, mobile, errors };
  console.log(JSON.stringify(result, null, 2));
  process.exit(pass ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
