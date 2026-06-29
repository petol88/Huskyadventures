/*
 * game.js — Pelin ydin
 * Hoitaa pelisilmukan, tasot & vaikeustason, kentän generoinnin,
 * törmäykset ja pelitilat (aloitus → peli → game over).
 */

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const levelEl = document.getElementById('level');
  const progressEl = document.getElementById('progress');
  const goalEl = document.getElementById('goal');
  const huskyLevelEl = document.getElementById('huskyLevel');
  const livesEl = document.getElementById('lives');
  const xpFillEl = document.getElementById('xpfill');
  const perksEl = document.getElementById('perks');
  const bannerEl = document.getElementById('banner');
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlay-text');
  const startBtn = document.getElementById('start-btn');
  const highscoresEl = document.getElementById('highscores');
  const muteBtn = document.getElementById('mute-btn');

  muteBtn.addEventListener('click', () => {
    Audio.unlock();
    const on = Audio.toggle();
    muteBtn.textContent = on ? '🔊' : '🔇';
  });
  const skillOverlay = document.getElementById('skill-overlay');
  const skillCardsEl = document.getElementById('skill-cards');
  const huskyLevelUpEl = document.getElementById('huskyLevelUp');

  // Pelimaailman koko (kiinteä logiikkakoko; canvas skaalaa tähän)
  const world = { width: 960, height: 640 };
  const center = { x: world.width / 2, y: world.height / 2 };

  let husky, prey, predators, obstacles;
  let level = 1;
  let score = 0;            // pyydystetyt yhteensä (koko peli)
  let caughtThisLevel = 0;  // edistyminen nykyisellä tasolla
  let goal = 8;             // montako pyydystettävä päästäkseen seuraavalle tasolle
  let lives = 3;
  let maxLives = 3;
  let running = false;
  let lastTime = 0;
  let invulnTimer = 0;      // lyhyt suoja-aika osuman jälkeen
  let howlRings = [];       // laajenevat ulvonta-aallot (visuaalinen)
  let particles = [];       // hiukkaset (nappauspurske ym.)
  let shakeTimer = 0;       // ruudun tärinän kesto
  let flashTimer = 0;       // punaisen osumavälähdyksen kesto
  let collectibles = [];    // keräiltävät luut
  let gameTime = 0;         // kulunut peliaika (luiden leijunta-animaatioon)

  // Huskyn oma kokemustaso ja taidot
  let perks = Skills.freshPerks();
  let huskyLevel = 1;
  let huskyXp = 0;
  let xpToNext = 4;

  function xpForHuskyLevel(lv) { return 4 + (lv - 1) * 2; } // Lv1→4, Lv2→6, Lv3→8 ...

  // --- Ennätykset (localStorage) ---
  const HS_KEY = 'huskyAdventures.highscores';
  function loadHighScores() {
    try { return JSON.parse(localStorage.getItem(HS_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveHighScores() {
    try { localStorage.setItem(HS_KEY, JSON.stringify(highScores)); } catch (e) { /* esim. yksityistila */ }
  }
  let highScores = loadHighScores(); // { bestLevel, bestScore, bestHuskyLevel }

  function renderHighScores(newRecord) {
    const hs = highScores;
    if (!hs.bestLevel && !hs.bestScore) { highscoresEl.innerHTML = ''; return; }
    highscoresEl.innerHTML =
      (newRecord ? '<div class="record-badge">🏆 Uusi ennätys!</div>' : '') +
      '<div class="hs-title">Parhaat tulokset</div>' +
      `<div class="hs-row"><span>🏆 Taso</span><b>${hs.bestLevel || 0}</b></div>` +
      `<div class="hs-row"><span>🐾 Saalis</span><b>${hs.bestScore || 0}</b></div>` +
      `<div class="hs-row"><span>🦴 Husky Lv</span><b>${hs.bestHuskyLevel || 1}</b></div>`;
  }

  // --- Canvasin skaalaus ruudun mukaan ---
  function resize() {
    const scale = Math.min(
      window.innerWidth / world.width,
      window.innerHeight / world.height
    );
    canvas.width = world.width;
    canvas.height = world.height;
    canvas.style.width = `${world.width * scale}px`;
    canvas.style.height = `${world.height * scale}px`;
  }
  window.addEventListener('resize', resize);
  resize();

  function randomPos(margin = 60) {
    return {
      x: margin + Math.random() * (world.width - margin * 2),
      y: margin + Math.random() * (world.height - margin * 2),
    };
  }

  // --- Tasokohtaiset asetukset (vaikeus kasvaa) ---
  function goalForLevel(lv) { return 6 + lv * 2; }       // L1:8, L2:10, L3:12 ...
  function preyOnField(lv) { return Math.min(4 + lv, 8); } // montako saalista kentällä yhtä aikaa

  // Generoi kenttä: pusikoita (piilo) ja kiviä (näköeste), määrä kasvaa tasoittain.
  // Esteet eivät mene päällekkäin eivätkä keskelle (huskyn aloituspaikka).
  function generateObstacles(lv) {
    const obs = [];
    const bushCount = Math.min(4 + lv, 9);
    const rockCount = Math.min(2 + lv, 7);

    function tryPlace(type, rMin, rMax) {
      for (let attempt = 0; attempt < 40; attempt++) {
        const radius = rMin + Math.random() * (rMax - rMin);
        const p = randomPos(70);
        if (Math.hypot(p.x - center.x, p.y - center.y) < 100) continue; // jätä keskus vapaaksi
        let ok = true;
        for (const o of obs) {
          if (Math.hypot(p.x - o.x, p.y - o.y) < o.radius + radius + 28) { ok = false; break; }
        }
        if (ok) { obs.push(new Obstacle(p.x, p.y, radius, type)); return; }
      }
    }

    for (let i = 0; i < bushCount; i++) tryPlace('bush', 38, 55);
    for (let i = 0; i < rockCount; i++) tryPlace('rock', 30, 42);
    return obs;
  }

  function isBossLevel(lv) { return lv % 5 === 0; }

  // Pedot tasoittain: enemmän ja nopeampia. Joka 5. taso on pomotaso.
  function predatorsForLevel(lv) {
    const speedMul = 1 + (lv - 1) * 0.06;
    const corners = [
      { x: 120, y: 120 },
      { x: world.width - 120, y: world.height - 120 },
      { x: world.width - 120, y: 120 },
      { x: 120, y: world.height - 120 },
    ];

    if (isBossLevel(lv)) {
      // Iso pomo keskellä ylhäällä, + apureita korkeammilla tasoilla
      const bossKind = ((lv / 5) % 2 === 1) ? 'wolf' : 'bear';
      const list = [new Predator(center.x, 120, bossKind, speedMul, true)];
      if (lv >= 10) list.push(new Predator(corners[3].x, corners[3].y, 'fox', speedMul));
      if (lv >= 15) list.push(new Predator(corners[2].x, corners[2].y, 'wolf', speedMul));
      return list;
    }

    const count = Math.min(lv, 4);
    const list = [];
    for (let i = 0; i < count; i++) {
      // Karhu/susi vuorotellen; kettu liittyy mukaan tasolta 3 (viimeisenä)
      let kind = i % 2 === 0 ? 'bear' : 'wolf';
      if (lv >= 3 && i === count - 1) kind = 'fox';
      list.push(new Predator(corners[i].x, corners[i].y, kind, speedMul));
    }
    return list;
  }

  // --- Saaliin luonti ---
  function preyKindsForLevel(lv) {
    const k = ['rabbit', 'mouse', 'squirrel', 'hedgehog'];
    if (lv >= 2) k.push('bird'); // nopea lintu tulee mukaan tasolta 2
    return k;
  }

  function spawnOnePrey() {
    const kinds = preyKindsForLevel(level);
    // Ilmesty etäälle huskysta, ettei pääse heti kiinni
    for (let attempt = 0; attempt < 30; attempt++) {
      const p = randomPos(50);
      if (Math.hypot(p.x - husky.x, p.y - husky.y) > 150) {
        return new Prey(p.x, p.y, kinds[Math.floor(Math.random() * kinds.length)]);
      }
    }
    const p = randomPos(50);
    return new Prey(p.x, p.y, kinds[0]);
  }

  function refillPrey() {
    while (prey.length < preyOnField(level)) prey.push(spawnOnePrey());
  }

  // Luo kentälle muutama keräiltävä luu (joukossa harvoin kultainen)
  function spawnCollectibles() {
    const list = [];
    const n = 2 + Math.floor(Math.random() * 2); // 2–3 luuta
    for (let i = 0; i < n; i++) {
      const p = randomPos(70);
      const gold = Math.random() < 0.22; // ~22 % kultainen
      list.push({ x: p.x, y: p.y, radius: 16, gold, phase: Math.random() * Math.PI * 2 });
    }
    return list;
  }

  // --- Pelin alustus ---
  function init() {
    level = 1;
    score = 0;
    caughtThisLevel = 0;
    goal = goalForLevel(level);
    maxLives = 3;
    lives = 3;
    invulnTimer = 0;
    howlRings = [];
    particles = [];
    shakeTimer = 0;
    flashTimer = 0;
    collectibles = [];
    gameTime = 0;
    // Nollaa huskyn kokemustaso ja taidot
    perks = Skills.freshPerks();
    huskyLevel = 1;
    huskyXp = 0;
    xpToNext = xpForHuskyLevel(huskyLevel);
    obstacles = generateObstacles(level);
    husky = new Husky(center.x, center.y);
    predators = predatorsForLevel(level);
    prey = [];
    refillPrey();
    collectibles = spawnCollectibles();
    renderPerks();
    updateXpBar();
    updateHud();
  }

  // --- Tasonvaihto ---
  function nextLevel() {
    level++;
    caughtThisLevel = 0;
    goal = goalForLevel(level);
    obstacles = generateObstacles(level);
    predators = predatorsForLevel(level);
    husky.x = center.x;
    husky.y = center.y;
    prey = [];
    refillPrey();
    collectibles = spawnCollectibles();
    invulnTimer = 1.0; // pieni armonaika uuteen kenttään
    showBanner(isBossLevel(level) ? `👑 POMOTASO ${level}!` : `Taso ${level}! 🎉`);
    updateHud();
  }

  function showBanner(text) {
    bannerEl.textContent = text;
    bannerEl.classList.remove('show');
    void bannerEl.offsetWidth; // pakota animaation uudelleenkäynnistys
    bannerEl.classList.add('show');
  }

  function updateHud() {
    levelEl.textContent = level;
    progressEl.textContent = caughtThisLevel;
    goalEl.textContent = goal;
    huskyLevelEl.textContent = huskyLevel;
    livesEl.textContent = lives;
  }

  function updateXpBar() {
    const pct = Math.max(0, Math.min(1, huskyXp / xpToNext)) * 100;
    xpFillEl.style.width = `${pct}%`;
  }

  // Näytä opitut taidot pieninä merkkeinä (emoji + kertamäärä)
  function renderPerks() {
    perksEl.innerHTML = '';
    for (const skill of Skills.ALL) {
      const n = perks.taken[skill.id] || 0;
      if (n === 0) continue;
      const chip = document.createElement('div');
      chip.className = 'perk-chip';
      chip.title = `${skill.name}: ${skill.desc}`;
      chip.textContent = n > 1 ? `${skill.emoji}×${n}` : skill.emoji;
      perksEl.appendChild(chip);
    }
  }

  // --- Huskyn taso & taidonvalinta ---
  const skillApi = {
    gainLife() { maxLives++; lives++; updateHud(); },
  };

  function offerSkill() {
    const choices = Skills.roll(perks.taken, 3);
    if (choices.length === 0) {
      // Kaikki taidot opittu — muunna XP pienen bonuksen sijaan vain nollaa
      huskyXp -= xpToNext;
      huskyLevel++;
      xpToNext = xpForHuskyLevel(huskyLevel);
      updateHud();
      updateXpBar();
      return;
    }
    running = false;
    renderSkillCards(choices);
    huskyLevelUpEl.textContent = huskyLevel + 1;
    skillOverlay.classList.remove('hidden');
  }

  function renderSkillCards(choices) {
    skillCardsEl.innerHTML = '';
    for (const skill of choices) {
      const owned = perks.taken[skill.id] || 0;
      const card = document.createElement('button');
      card.className = 'skill-card';
      card.innerHTML =
        `<div class="skill-emoji">${skill.emoji}</div>` +
        `<div class="skill-name">${skill.name}${owned ? ` <span class="lvl">Lv ${owned + 1}</span>` : ''}</div>` +
        `<div class="skill-desc">${skill.desc}</div>`;
      card.addEventListener('click', () => chooseSkill(skill));
      skillCardsEl.appendChild(card);
    }
  }

  function chooseSkill(skill) {
    skill.apply(perks, skillApi);
    perks.taken[skill.id] = (perks.taken[skill.id] || 0) + 1;
    huskyLevel++;
    huskyXp -= xpToNext;
    xpToNext = xpForHuskyLevel(huskyLevel);
    renderPerks();
    updateHud();
    updateXpBar();
    skillOverlay.classList.add('hidden');

    if (huskyXp >= xpToNext) {
      offerSkill();        // riitti vielä toiseen tasoon
    } else {
      resumeGame();
    }
  }

  function resumeGame() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  // --- Törmäystarkistus kahden ympyrän välillä ---
  function collides(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y) < a.radius + b.radius;
  }

  // Hiukkaspurske annetuilla väreillä (nappaus, osuma)
  function spawnBurst(x, y, colors, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 130;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.45 + Math.random() * 0.3,
        maxLife: 0.75,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function update(dt) {
    const dir = Input.getDirection();
    husky.update(dt, dir, world, obstacles, perks, Input.isSprinting());

    // Ulvonta: pelästytä lähellä olevat pedot (jos taito opittu & jäähtynyt)
    const howlPressed = Input.consumeHowl();
    if (perks.hasHowl && howlPressed && husky.howlCd <= 0) {
      const radius = 170 + perks.howlPower * 55;
      const duration = 2.5 + perks.howlPower * 0.6;
      husky.howlMax = Math.max(2.5, 6 - perks.howlPower * 1.0);
      husky.howlCd = husky.howlMax;
      for (const pred of predators) {
        if (Math.hypot(pred.x - husky.x, pred.y - husky.y) < radius) pred.scare(duration);
      }
      howlRings.push({ x: husky.x, y: husky.y, t: 0, maxR: radius });
      Audio.play('howl');
    }
    // Päivitä ulvonta-aaltojen animaatio
    for (const r of howlRings) r.t += dt;
    howlRings = howlRings.filter((r) => r.t < 0.6);

    // Päivitä hiukkaset ja ruutuefektien ajastimet
    for (const pt of particles) {
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vx *= 0.9;
      pt.vy *= 0.9;
      pt.life -= dt;
    }
    particles = particles.filter((pt) => pt.life > 0);
    if (shakeTimer > 0) shakeTimer -= dt;
    if (flashTimer > 0) flashTimer -= dt;
    gameTime += dt;

    // Saaliit
    for (const p of prey) {
      if (!p.alive) continue;
      p.update(dt, husky, world, perks);
      // Nappausetäisyyttä kasvattaa Saalistaja-taito (perks.catchBonus)
      const reach = husky.radius + p.radius + perks.catchBonus;
      if (Math.hypot(husky.x - p.x, husky.y - p.y) < reach) {
        p.alive = false;
        score++;
        caughtThisLevel++;
        huskyXp++;
        spawnBurst(p.x, p.y, ['#fff', '#ffe8c0', '#d8c4a0'], 12); // nappauspurske
        Audio.play('catch');
        updateHud();
        updateXpBar();
      }
    }
    prey = prey.filter((p) => p.alive);

    // Keräiltävät luut → antavat huskylle kokemusta
    for (const c of collectibles) {
      if (c.collected) continue;
      if (Math.hypot(husky.x - c.x, husky.y - c.y) < husky.radius + c.radius) {
        c.collected = true;
        huskyXp += c.gold ? 6 : 2;
        spawnBurst(c.x, c.y,
          c.gold ? ['#ffe680', '#ffd24a', '#fff'] : ['#fff', '#e8e0d0'],
          c.gold ? 18 : 10);
        Audio.play(c.gold ? 'goldbone' : 'bone');
        updateXpBar();
      }
    }
    collectibles = collectibles.filter((c) => !c.collected);

    // Husky nousi tasolle → tarjoa taito (pysäyttää pelin)
    if (huskyXp >= xpToNext) {
      offerSkill();
      if (!running) return;
    }

    // Tason läpäisy?
    if (caughtThisLevel >= goal) {
      nextLevel();
      return; // kenttä vaihtui — jatketaan seuraavalla framella
    }
    refillPrey();

    // Pedot
    if (invulnTimer > 0) invulnTimer -= dt;
    for (const pred of predators) {
      pred.update(dt, husky, world, obstacles, perks);
      if (invulnTimer <= 0 && collides(husky, pred)) {
        lives--;
        invulnTimer = 1.6;
        shakeTimer = 0.4;
        flashTimer = 0.4;
        spawnBurst(husky.x, husky.y, ['#ff5a4a', '#ffac4a'], 14);
        // Potkaise husky pois pedosta (ei enää nykivää teleporttia keskelle)
        const dx = husky.x - pred.x, dy = husky.y - pred.y;
        const d = Math.hypot(dx, dy) || 1;
        husky.x += (dx / d) * 110;
        husky.y += (dy / d) * 110;
        husky.x = clamp(husky.x, husky.radius, world.width - husky.radius);
        husky.y = clamp(husky.y, husky.radius, world.height - husky.radius);
        updateHud();
        if (lives <= 0) {
          gameOver();
          return;
        }
      }
    }
  }

  function draw() {
    ctx.save();
    // Ruudun tärinä osuman jälkeen
    if (shakeTimer > 0) {
      const mag = shakeTimer * 22;
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }

    // Tausta (piirretään hieman ylikokoisena, ettei tärinä paljasta reunoja)
    ctx.fillStyle = '#3a5a3a';
    ctx.fillRect(-20, -20, world.width + 40, world.height + 40);

    // Kevyt ruudukko maaston tunnuksi
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < world.width; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, world.height); ctx.stroke();
    }
    for (let y = 0; y < world.height; y += 64) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(world.width, y); ctx.stroke();
    }

    // Näkökentät ensin (alimmaksi)
    for (const pred of predators) pred.drawVision(ctx);

    // Kivet pohjalle, hahmot päälle, pusikot ylimmäs (peittävät huskyn)
    for (const o of obstacles) if (o.type === 'rock') o.draw(ctx);

    // Keräiltävät luut (leijuvat kevyesti)
    for (const c of collectibles) {
      const bob = Math.sin(gameTime * 3 + c.phase) * 3;
      Sprites.drawBone(ctx, c.x, c.y, c.radius, c.gold, bob);
    }

    for (const p of prey) p.draw(ctx);
    for (const pred of predators) {
      // Syöksyn telegraph: latauksen aikana sykkivä punainen varoitusviiva
      if (pred.isBoss && pred.chargeState === 'windup') {
        const pulse = 0.4 + 0.5 * Math.abs(Math.sin(gameTime * 12));
        const len = 360;
        ctx.save();
        ctx.translate(pred.x, pred.y);
        ctx.rotate(Math.atan2(pred.chargeDir.y, pred.chargeDir.x));
        const g = ctx.createLinearGradient(0, 0, len, 0);
        g.addColorStop(0, `rgba(255,40,30,${pulse})`);
        g.addColorStop(1, 'rgba(255,40,30,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, -10, len, 20);
        // Kärkinuoli
        ctx.fillStyle = `rgba(255,60,40,${pulse})`;
        ctx.beginPath();
        ctx.moveTo(len, -22);
        ctx.lineTo(len + 26, 0);
        ctx.lineTo(len, 22);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      pred.draw(ctx);

      // Pomolle kruunu ja punainen kehä (toipuessa himmeämpi = haavoittuvampi)
      if (pred.isBoss) {
        ctx.strokeStyle = pred.chargeState === 'recover'
          ? 'rgba(120,180,255,0.6)' : 'rgba(255,70,60,0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pred.x, pred.y, pred.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = `${pred.radius}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👑', pred.x, pred.y - pred.radius - 6);
      }
    }

    // Husky vilkkuu suoja-aikana
    if (invulnTimer <= 0 || Math.floor(invulnTimer * 10) % 2 === 0) {
      husky.draw(ctx);
    }

    // Pusikot huskyn päälle, jotta piiloutuminen näkyy visuaalisesti
    for (const o of obstacles) if (o.type === 'bush') o.draw(ctx);

    // Ulvonta-aallot (laajenevat renkaat)
    for (const r of howlRings) {
      const p = r.t / 0.6;
      ctx.strokeStyle = `rgba(180,210,255,${(1 - p) * 0.8})`;
      ctx.lineWidth = 4 * (1 - p) + 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.maxR * p, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Pinottavat mittarit huskyn yllä
    let barY = husky.y - husky.radius - 24;

    // Sprint-energiapalkki (vain jos Kirmaus opittu)
    if (perks.hasSprint) {
      const w = 38, x = husky.x - w / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 5);
      ctx.fillStyle = husky.sprinting ? '#ffd24a' : (husky.stamina > 0.25 ? '#7ad0ff' : '#ff8c5a');
      ctx.fillRect(x, barY, w * husky.stamina, 5);
      barY -= 8;
    }

    // Ulvonnan jäähdytysmittari (vain jos Ulvonta opittu)
    if (perks.hasHowl) {
      const w = 38, x = husky.x - w / 2;
      const ready = husky.howlCd <= 0;
      const fill = ready ? 1 : 1 - husky.howlCd / husky.howlMax;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x, barY, w, 5);
      ctx.fillStyle = ready ? '#c79cff' : '#6a5a8a';
      ctx.fillRect(x, barY, w * fill, 5);
    }

    // "Piilossa"-ilmaisin huskyn yllä
    if (husky.hidden) {
      ctx.fillStyle = '#aef0ae';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🤫 Piilossa', husky.x, husky.y - husky.radius - 14);
    }

    // Hiukkaset (nappauspurske, osumaroiske) ylimmäs
    for (const pt of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.life / pt.maxLife));
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore(); // lopeta tärinä-translaatio

    // Punainen osumavälähdys (ruutukoordinaatistossa, ei tärise)
    if (flashTimer > 0) {
      ctx.fillStyle = `rgba(255,40,30,${(flashTimer / 0.4) * 0.35})`;
      ctx.fillRect(0, 0, world.width, world.height);
    }
  }

  function loop(time) {
    if (!running) return;
    const dt = Math.min((time - lastTime) / 1000, 0.05); // rajaa isot hypyt
    lastTime = time;
    update(dt);
    // Jos update() pysäytti pelin (taidonvalinta / game over), älä ajasta
    // uutta framea — muuten resumeGame loisi toisen rinnakkaisen silmukan.
    if (running) {
      draw();
      requestAnimationFrame(loop);
    }
  }

  function startGame() {
    init();
    overlay.classList.add('hidden');
    Audio.unlock();
    Audio.startMusic();
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function gameOver() {
    running = false;
    // Päivitä ennätykset
    let newRecord = false;
    if (level > (highScores.bestLevel || 0)) { highScores.bestLevel = level; newRecord = true; }
    if (score > (highScores.bestScore || 0)) { highScores.bestScore = score; newRecord = true; }
    if (huskyLevel > (highScores.bestHuskyLevel || 0)) { highScores.bestHuskyLevel = huskyLevel; newRecord = true; }
    if (newRecord) saveHighScores();

    overlayText.textContent =
      `Peli päättyi tasolla ${level}! Husky ehti tasolle ${huskyLevel} ja pyydysti yhteensä ${score} eläintä.`;
    renderHighScores(newRecord);
    startBtn.textContent = 'Pelaa uudelleen';
    overlay.classList.remove('hidden');
  }

  startBtn.addEventListener('click', startGame);

  // Näytä tallennetut ennätykset jo aloitusruudussa
  renderHighScores(false);
})();
