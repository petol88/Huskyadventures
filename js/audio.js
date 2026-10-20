/*
 * audio.js — Äänet & musiikki
 * Kaikki äänet syntetisoidaan Web Audio APIlla (ei äänitiedostoja).
 * - Audio.unlock()  : käynnistä AudioContext käyttäjän eleestä (selainpakko)
 * - Audio.play(name): soita äänitehoste
 * - Audio.startMusic()/stopMusic()/setTension(v): taustamusiikki
 * - Audio.toggle()  : mykistys päälle/pois (palauttaa onko ääni päällä)
 */

const Audio = (() => {
  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let enabled = true;

  // Musiikin tila
  let beatTimer = null;
  let step = 0;
  let tensionGain = null;   // jännitys-dronen voimakkuus
  let tensionTarget = 0;

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = enabled ? 0.6 : 0;
    masterGain.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.5;
    musicGain.connect(masterGain);
  }

  function unlock() {
    init();
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // --- Perusäänet ---
  function blip(freq, type, dur, gain, slideTo, when = 0, dest) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest || masterGain);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  function noiseBurst(dur, gain, filterFreq, when = 0) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = src;
    if (filterFreq) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filterFreq;
      src.connect(f);
      node = f;
    }
    node.connect(g);
    g.connect(masterGain);
    src.start(t);
    src.stop(t + dur);
  }

  // Ulvonta: liukuu ylös ja takaisin alas, vibratolla
  function howl() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(280, t);
    o.frequency.linearRampToValueAtTime(620, t + 0.25);
    o.frequency.setValueAtTime(620, t + 0.45);
    o.frequency.linearRampToValueAtTime(240, t + 0.95);
    // Vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 6;
    lfoGain.gain.value = 18;
    lfo.connect(lfoGain);
    lfoGain.connect(o.frequency);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 1400;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.08);
    g.gain.setValueAtTime(0.3, t + 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    o.connect(f);
    f.connect(g);
    g.connect(masterGain);
    o.start(t); lfo.start(t);
    o.stop(t + 1.05); lfo.stop(t + 1.05);
  }

  // --- Äänitehosteet ---
  function play(name) {
    if (!ctx || !enabled) return;
    switch (name) {
      case 'catch':
        blip(660, 'square', 0.08, 0.22, 880);
        blip(990, 'square', 0.09, 0.18, 1320, 0.07);
        break;
      case 'bone':
        blip(520, 'triangle', 0.12, 0.22, 640);
        break;
      case 'goldbone':
        [660, 880, 1320].forEach((f, i) => blip(f, 'sine', 0.12, 0.2, f * 1.05, i * 0.06));
        break;
      case 'hurt':
        blip(180, 'sawtooth', 0.28, 0.3, 70);
        noiseBurst(0.2, 0.22, 900);
        break;
      case 'howl':
        howl();
        break;
      case 'levelup':
        [523, 659, 784, 1047].forEach((f, i) => blip(f, 'triangle', 0.18, 0.22, f, i * 0.08));
        break;
      case 'skill':
        blip(784, 'sine', 0.12, 0.22, 880);
        blip(1175, 'sine', 0.16, 0.2, 1320, 0.09);
        break;
      case 'charge': // syöksyvaroitus
        blip(900, 'sawtooth', 0.18, 0.26, 480);
        blip(900, 'sawtooth', 0.18, 0.22, 480, 0.22);
        break;
      case 'thunder':
        blip(70, 'sawtooth', 0.8, 0.45, 30);
        blip(45, 'triangle', 1.2, 0.5, 20, 0.1);
        noiseBurst(0.7, 0.38, 400);
        break;
      case 'tick':
        blip(1400, 'sine', 0.008, 0.08, 1200);
        break;
      case 'whistle':
        blip(1800, 'sine', 0.22, 0.28, 2200);
        blip(2100, 'triangle', 0.18, 0.24, 2400, 0.04);
        break;
      case 'eagle': // kotkan huuto
        blip(750, 'sawtooth', 0.14, 0.20, 1500);
        blip(1500, 'sawtooth', 0.18, 0.18, 1000, 0.07);
        break;
      case 'lynx': // ilveksen sähinä
        noiseBurst(0.22, 0.25, 1800);
        blip(260, 'sawtooth', 0.18, 0.15, 140);
        break;
      case 'boss':
        blip(120, 'sawtooth', 0.7, 0.3, 90);
        noiseBurst(0.5, 0.18, 400);
        break;
      case 'gameover':
        [440, 330, 247, 165].forEach((f, i) => blip(f, 'sawtooth', 0.35, 0.25, f * 0.95, i * 0.18));
        break;
      case 'map': // aarrekartta löytyi
        noiseBurst(0.18, 0.1, 2500);
        blip(523, 'triangle', 0.14, 0.18, 784);
        blip(784, 'triangle', 0.18, 0.16, 1047, 0.1);
        break;
      case 'dig': // kaivamisen kopsahdus
        blip(140, 'sine', 0.1, 0.2, 90);
        noiseBurst(0.08, 0.12, 600);
        break;
      case 'gem': // jalokivi löytyi — kirkas riemu
        [784, 1047, 1319, 1568, 2093].forEach((f, i) => blip(f, 'sine', 0.22, 0.2, f, i * 0.07));
        blip(523, 'triangle', 0.6, 0.12, 523, 0.1);
        break;
      case 'clue': // aarreketju jatkuu — vihje eteenpäin
        blip(660, 'triangle', 0.14, 0.18, 880);
        blip(880, 'triangle', 0.16, 0.16, 1175, 0.1);
        break;
      case 'legendary': // legendaarinen aarre — mahtipontinen fanfaari
        [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => blip(f, 'triangle', 0.3, 0.22, f, i * 0.1));
        [262, 330, 392].forEach((f, i) => blip(f, 'sawtooth', 0.8, 0.12, f, i * 0.1 + 0.2));
        noiseBurst(0.3, 0.08, 6000, 0.05);
        break;
      case 'artifact': // muinaisesine löytyi — mystinen helinä
        [659, 988, 1319, 1976].forEach((f, i) => blip(f, 'sine', 0.4, 0.18, f * 1.01, i * 0.09));
        blip(330, 'triangle', 0.9, 0.12, 330, 0.05);
        break;
      case 'shield': // kilpi torjui osuman — metallinen kalahdus
        blip(700, 'square', 0.1, 0.18, 500);
        blip(1100, 'sine', 0.18, 0.14, 700, 0.02);
        noiseBurst(0.12, 0.1, 3000);
        break;
      case 'pet': // Silittelyn tyytyväinen pulssi
        blip(480, 'triangle', 0.22, 0.20, 560);
        blip(560, 'triangle', 0.28, 0.16, 700, 0.08);
        break;
      case 'mushroom_good':
        blip(523, 'sine', 0.08, 0.22, 784);
        blip(784, 'sine', 0.12, 0.18, 1047, 0.06);
        break;
      case 'mushroom_bad':
        blip(400, 'sawtooth', 0.15, 0.25, 200);
        blip(300, 'sawtooth', 0.18, 0.2, 100, 0.08);
        break;
      case 'buzz':
        blip(180, 'sawtooth', 0.15, 0.25, 190);
        blip(190, 'sawtooth', 0.15, 0.22, 170, 0.05);
        break;
      default:
        break;
    }
  }

  // --- Taustamusiikki: dynaamiset maakohtaiset musiikkiteemat & syntetisoija ---
  let currentTheme = 'default';
  let musicVolume = 0.5;
  let fireplaceTimer = null;

  const THEMES = {
    default: {
      scale: [261.63, 311.13, 349.23, 392.0, 466.16, 523.25], // C minor pentatonic
      pattern: [0, 2, 4, 2, 3, 1, 4, 5],
      tempo: 390,
      wave: 'triangle',
      bassWave: 'sine'
    },
    finland: {
      scale: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00], // A minor pentatonic (kaunis ja utuinen)
      pattern: [0, 1, 3, 1, 2, 4, 3, 5],
      tempo: 520,
      wave: 'sine',
      bassWave: 'sine'
    },
    switzerland: {
      scale: [261.63, 293.66, 329.63, 392.00, 523.25, 587.33], // C major pentatonic (alppien ilo)
      pattern: [0, 2, 4, 5, 4, 2, 3, 1],
      tempo: 330,
      wave: 'triangle',
      bassWave: 'triangle'
    },
    egypt: {
      scale: [220.00, 233.08, 277.18, 293.66, 329.63, 349.23, 415.30], // A Phrygian Dominant (autiomaa-vibe)
      pattern: [0, 1, 2, 3, 2, 1, 4, 0, 5, 4, 6, 5],
      tempo: 460,
      wave: 'triangle',
      bassWave: 'sine'
    },
    brazil: {
      scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C major samba/bossa
      pattern: [0, 2, 1, 3, 2, 4, 3, 5, 4, 2, 5, 0],
      tempo: 280,
      wave: 'triangle',
      bassWave: 'triangle'
    },
    iceland: {
      scale: [164.81, 196.00, 220.00, 233.08, 246.94, 293.66], // E minor volcanic/blues
      pattern: [0, 1, 0, 2, 1, 3, 2, 4, 3, 2, 1, 0],
      tempo: 480,
      wave: 'sawtooth',
      bassWave: 'sawtooth'
    },
    japan: {
      scale: [261.63, 277.18, 349.23, 392.00, 415.30, 523.25], // Kioton Yo-asteikko (Zen-tyyli)
      pattern: [0, 1, 2, 1, 3, 2, 4, 3, 5, 4, 2, 0],
      tempo: 450,
      wave: 'sine',
      bassWave: 'sine'
    }
  };

  function startMusic() {
    if (!ctx || beatTimer) return;

    // Alustetaan voimakkuus
    musicGain.gain.value = enabled ? musicVolume : 0;

    // Jännitys-drone: matala saha + lowpass, voimakkuus 0
    const drone = ctx.createOscillator();
    const drone2 = ctx.createOscillator();
    drone.type = 'sawtooth'; drone2.type = 'sawtooth';
    drone.frequency.value = 55; drone2.frequency.value = 55 * 1.01;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 200;
    tensionGain = ctx.createGain();
    tensionGain.gain.value = 0;
    drone.connect(lp); drone2.connect(lp);
    lp.connect(tensionGain);
    tensionGain.connect(masterGain);
    drone.start(); drone2.start();
    tensionGain._osc = [drone, drone2];

    step = 0;

    const playBeat = () => {
      if (!ctx || !enabled) return;
      const theme = THEMES[currentTheme] || THEMES['default'];
      const n = theme.scale[theme.pattern[step % theme.pattern.length]];
      blip(n, theme.wave, 0.32, 0.07, n, 0, musicGain);
      
      // Basso joka 4. isku
      if (step % 4 === 0) {
        blip(n / 2, theme.bassWave, 0.5, 0.08, n / 2, 0, musicGain);
      }
      step++;

      // Liu'uta jännitys kohti tavoitetta
      if (tensionGain) {
        const cur = tensionGain.gain.value;
        const next = cur + (tensionTarget * 0.14 - cur) * 0.5;
        tensionGain.gain.setTargetAtTime(next, ctx.currentTime, 0.1);
      }
    };

    const runTimer = () => {
      const theme = THEMES[currentTheme] || THEMES['default'];
      playBeat();
      beatTimer = setTimeout(runTimer, theme.tempo);
    };

    runTimer();
  }

  function stopMusic() {
    if (beatTimer) { clearTimeout(beatTimer); beatTimer = null; }
    if (tensionGain && tensionGain._osc) {
      const t = ctx.currentTime;
      tensionGain.gain.setTargetAtTime(0, t, 0.1);
      tensionGain._osc.forEach((o) => { try { o.stop(t + 0.3); } catch (e) {} });
      tensionGain = null;
    }
  }

  function setTension(v) {
    tensionTarget = Math.max(0, Math.min(1, v));
  }

  function toggle() {
    enabled = !enabled;
    if (masterGain) {
      masterGain.gain.setTargetAtTime(enabled ? 0.6 : 0, ctx.currentTime, 0.05);
    }
    return enabled;
  }

  function isEnabled() { return enabled; }

  function setMusicTheme(themeKey) {
    if (THEMES[themeKey]) {
      currentTheme = themeKey;
      if (beatTimer) {
        stopMusic();
        startMusic();
      }
    }
  }

  function setMusicVolume(vol) {
    musicVolume = Math.max(0, Math.min(1, vol));
    if (musicGain && ctx) {
      musicGain.gain.setValueAtTime(musicVolume, ctx.currentTime);
    }
  }

  function getMusicTheme() { return currentTheme; }
  function getMusicVolume() { return musicVolume; }

  function startCabinAmbient() {
    if (!ctx || fireplaceTimer) return;
    
    const tickFire = () => {
      if (!enabled) {
        fireplaceTimer = setTimeout(tickFire, 200 + Math.random() * 300);
        return;
      }
      
      const isPop = Math.random() < 0.22;
      if (isPop) {
        blip(70 + Math.random() * 45, 'sawtooth', 0.015 + Math.random() * 0.02, 0.05, 20);
      } else {
        noiseBurst(0.003 + Math.random() * 0.010, 0.04, 1500 + Math.random() * 1000);
      }
      
      fireplaceTimer = setTimeout(tickFire, 150 + Math.random() * 380);
    };

    tickFire();
  }

  function stopCabinAmbient() {
    if (fireplaceTimer) {
      clearTimeout(fireplaceTimer);
      fireplaceTimer = null;
    }
  }

  return { 
    unlock, 
    play, 
    startMusic, 
    stopMusic, 
    setTension, 
    toggle, 
    isEnabled,
    setMusicTheme,
    setMusicVolume,
    getMusicTheme,
    getMusicVolume,
    startCabinAmbient,
    stopCabinAmbient
  };
})();

