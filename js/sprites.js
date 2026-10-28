/*
 * sprites.js — Hahmojen grafiikka
 * Jokainen eläin piirretään käsin vektorigrafiikalla (ei kuvatiedostoja).
 * Hahmot piirretään katsoen oikealle; entiteetti kääntää ne (flip) ja
 * lisää kävelyanimaation animPhase-arvon perusteella.
 *
 * Kutsutaan: Sprites.draw(ctx, entity)
 * entity tarvitsee: x, y, radius, kind, flip (1/-1), animPhase, moving
 */

const Sprites = (() => {
  // --- Pienet apufunktiot ---

  function ellipse(ctx, cx, cy, rx, ry, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pystysuunnassa varjostettu vartalo (vaalea ylhäällä, tumma alhaalla)
  function shadedEllipse(ctx, cx, cy, rx, ry, top, bottom) {
    const g = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
    }
  }

  // Animoitu jalka, joka heilahtaa kävellessä
  function leg(ctx, x, yTop, w, h, color, swing) {
    ctx.save();
    ctx.translate(x, yTop);
    ctx.rotate(swing);
    ctx.fillStyle = color;
    roundRect(ctx, -w / 2, 0, w, h, w / 2);
    ctx.fill();
    ctx.restore();
  }

  // Terävä korva (kolmio) pehmennetyin kärjin
  function ear(ctx, x, y, w, h, angle, outer, inner) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.quadraticCurveTo(0, -h * 1.1, w / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = inner;
    ctx.beginPath();
    ctx.moveTo(-w / 4, -h * 0.1);
    ctx.quadraticCurveTo(0, -h * 0.7, w / 4, -h * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function eye(ctx, x, y, r, color = '#1a1a1a') {
    ellipse(ctx, x, y, r, r, color);
    // pieni kiilto
    ellipse(ctx, x - r * 0.3, y - r * 0.3, r * 0.35, r * 0.35, 'rgba(255,255,255,0.85)');
  }

  function groundShadow(ctx, r) {
    ellipse(ctx, 0, r * 0.95, r * 1.15, r * 0.35, 'rgba(0,0,0,0.18)');
  }

  const HUSKY_SKINS = {
    default: {
      bodyT: '#eef0f5', bodyB: '#c2c6d2',
      tailT: '#f2f4f8', tailB: '#b9bdc9', tailC: '#9aa0b0',
      legBack: '#a7adba', legFront: '#dfe2ea',
      headT: '#f4f6fa', headB: '#d2d6e0',
      earO: '#aab0c0', earI: '#d98c9c',
      mask: '#8b91a3', snout: '#fbfcff',
      eye: '#4aa6e0'
    },
    shiba: {
      bodyT: '#f57c00', bodyB: '#e65100',
      tailT: '#f57c00', tailB: '#e65100', tailC: '#ffffff',
      legBack: '#e65100', legFront: '#ffe0b2',
      headT: '#f57c00', headB: '#e65100',
      earO: '#e65100', earI: '#ffab91',
      mask: '#f57c00', snout: '#ffffff',
      eye: '#3e2723'
    },
    retriever: {
      bodyT: '#ffd54f', bodyB: '#ffb300',
      tailT: '#ffe082', tailB: '#ffa000', tailC: '#fff8e1',
      legBack: '#ef6c00', legFront: '#ffe082',
      headT: '#ffd54f', headB: '#ffb300',
      earO: '#f57c00', earI: '#ff8a80',
      mask: '#ffa726', snout: '#fffde7',
      eye: '#5d4037'
    },
    poodle: {
      bodyT: '#f5f5f5', bodyB: '#cfd8dc',
      tailT: '#eceff1', tailB: '#b0bec5', tailC: '#ffffff',
      legBack: '#90a4ae', legFront: '#eceff1',
      headT: '#eceff1', headB: '#cfd8dc',
      earO: '#b0bec5', earI: '#ffc1e3',
      mask: '#eceff1', snout: '#ffffff',
      eye: '#212121'
    },
    wolf: {
      bodyT: '#8d6e63', bodyB: '#4e342e',
      tailT: '#a1887f', tailB: '#3e2723', tailC: '#1a0c08',
      legBack: '#3e2723', legFront: '#a1887f',
      headT: '#8d6e63', headB: '#4e342e',
      earO: '#3e2723', earI: '#d84315',
      mask: '#1a0c08', snout: '#d7ccc8',
      eye: '#ffeb3b'
    },
    fire: {
      bodyT: '#ffaa44', bodyB: '#dd5511',
      tailT: '#ffcc66', tailB: '#dd6622', tailC: '#ff3300',
      legBack: '#bb4400', legFront: '#ee9933',
      headT: '#ffaa44', headB: '#cc4400',
      earO: '#bb4400', earI: '#ffdd77',
      mask: '#aa3300', snout: '#ffeeaa',
      eye: '#ffea00'
    },
    shadow: {
      bodyT: '#2a2d35', bodyB: '#14161c',
      tailT: '#333742', tailB: '#1a1c24', tailC: '#000000',
      legBack: '#1d2028', legFront: '#2a2d35',
      headT: '#2a2d35', headB: '#14161c',
      earO: '#1d2028', earI: '#c2243e',
      mask: '#0c0d12', snout: '#1d2028',
      eye: '#ff2255'
    },
    arctic: {
      bodyT: '#fdfdfd', bodyB: '#e6ebf5',
      tailT: '#ffffff', tailB: '#ebeff7', tailC: '#d8e1f0',
      legBack: '#d5dde8', legFront: '#ecf0f7',
      headT: '#ffffff', headB: '#e6ebf5',
      earO: '#d5dde8', earI: '#ffd6e0',
      mask: '#c0cbdc', snout: '#ffffff',
      eye: '#3ae2ff'
    }
  };

  // --- Husky (pelaaja) ---
  function husky(ctx, r, swing, e) {
    const skinId = (e && e.skin) || 'default';
    const isCompanion = (e && e.constructor && e.constructor.name === 'Companion');
    let s = HUSKY_SKINS[skinId] || HUSKY_SKINS.default;
    if (isCompanion && skinId === 'default') {
      s = HUSKY_SKINS.shiba;
    }

    groundShadow(ctx, r);
    // Häntä (pörröinen, käppyrällä ylös takana)
    ctx.save();
    ctx.translate(-r * 1.05, -r * 0.2);
    shadedEllipse(ctx, 0, 0, r * 0.5, r * 0.42, s.tailT, s.tailB);
    ellipse(ctx, r * 0.1, -r * 0.05, r * 0.28, r * 0.24, s.tailC);
    ctx.restore();

    // Takajalat (tummemmat)
    leg(ctx, -r * 0.55, r * 0.45, r * 0.34, r * 0.55, s.legBack, swing * 0.6);
    
    // Vartalo
    shadedEllipse(ctx, 0, 0, r * 1.2, r * 0.82, s.bodyT, s.bodyB);
    
    // Vaalea vatsa
    ellipse(ctx, r * 0.1, r * 0.35, r * 0.85, r * 0.4, s.snout);
    
    // Etujalat (vaaleammat)
    leg(ctx, r * 0.6, r * 0.45, r * 0.34, r * 0.58, s.legFront, -swing * 0.6);
    
    // Pää
    const hx = r * 0.95, hy = -r * 0.18;
    ear(ctx, hx - r * 0.35, hy - r * 0.55, r * 0.5, r * 0.6, -0.25, s.earO, s.earI);
    ear(ctx, hx + r * 0.35, hy - r * 0.55, r * 0.5, r * 0.6, 0.25, s.earO, s.earI);
    shadedEllipse(ctx, hx, hy, r * 0.72, r * 0.66, s.headT, s.headB);
    
    // Husky-naamio (tummempi otsa/poskialue)
    ctx.fillStyle = s.mask;
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.5, hy - r * 0.1);
    ctx.quadraticCurveTo(hx, hy - r * 0.75, hx + r * 0.5, hy - r * 0.1);
    ctx.quadraticCurveTo(hx + r * 0.2, hy + r * 0.1, hx, hy + r * 0.05);
    ctx.quadraticCurveTo(hx - r * 0.2, hy + r * 0.1, hx - r * 0.5, hy - r * 0.1);
    ctx.fill();
    
    // Kuono
    ellipse(ctx, hx + r * 0.55, hy + r * 0.18, r * 0.42, r * 0.32, s.snout);
    ellipse(ctx, hx + r * 0.92, hy + r * 0.18, r * 0.12, r * 0.1, '#2a2a2e'); // nenä
    
    // Husky-silmät
    eye(ctx, hx + r * 0.28, hy - r * 0.05, r * 0.13, s.eye);
  }

  // --- Jänis ---
  function rabbit(ctx, r, swing) {
    groundShadow(ctx, r);
    ellipse(ctx, -r * 0.95, r * 0.1, r * 0.28, r * 0.28, '#fbf3e6'); // pörröhäntä
    leg(ctx, -r * 0.4, r * 0.45, r * 0.3, r * 0.5, '#d9c7ad', swing * 0.5);
    shadedEllipse(ctx, 0, 0, r * 1.05, r * 0.78, '#efe3d0', '#d4c2a6');
    ellipse(ctx, r * 0.1, r * 0.32, r * 0.7, r * 0.34, '#fbf5ea');
    leg(ctx, r * 0.55, r * 0.45, r * 0.3, r * 0.52, '#e7d8c0', -swing * 0.5);
    const hx = r * 0.85, hy = -r * 0.3;
    // Pitkät korvat
    ear(ctx, hx - r * 0.18, hy - r * 0.7, r * 0.34, r * 1.15, -0.18, '#e7d8c0', '#f0b8c0');
    ear(ctx, hx + r * 0.22, hy - r * 0.7, r * 0.34, r * 1.15, 0.18, '#e7d8c0', '#f0b8c0');
    shadedEllipse(ctx, hx, hy, r * 0.58, r * 0.55, '#f2e8d8', '#dccbb0');
    ellipse(ctx, hx + r * 0.45, hy + r * 0.12, r * 0.1, r * 0.08, '#e89aa6'); // nenä
    eye(ctx, hx + r * 0.18, hy - r * 0.02, r * 0.11);
  }

  // --- Hiiri ---
  function mouse(ctx, r, swing) {
    groundShadow(ctx, r);
    // Pitkä häntä
    ctx.strokeStyle = '#e7a9b0';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, r * 0.1);
    ctx.quadraticCurveTo(-r * 1.6, -r * 0.3, -r * 1.3, -r * 0.8);
    ctx.stroke();
    leg(ctx, -r * 0.4, r * 0.4, r * 0.26, r * 0.45, '#9b958f', swing * 0.5);
    shadedEllipse(ctx, 0, 0, r * 1.0, r * 0.72, '#bdb7b2', '#928c87');
    ellipse(ctx, r * 0.1, r * 0.3, r * 0.65, r * 0.3, '#d8d3ce');
    leg(ctx, r * 0.5, r * 0.4, r * 0.26, r * 0.47, '#aaa49e', -swing * 0.5);
    const hx = r * 0.85, hy = -r * 0.18;
    // Suuret pyöreät korvat
    ellipse(ctx, hx - r * 0.3, hy - r * 0.45, r * 0.4, r * 0.4, '#a59f99');
    ellipse(ctx, hx - r * 0.3, hy - r * 0.45, r * 0.24, r * 0.24, '#f0b8c0');
    ellipse(ctx, hx + r * 0.3, hy - r * 0.5, r * 0.4, r * 0.4, '#a59f99');
    ellipse(ctx, hx + r * 0.3, hy - r * 0.5, r * 0.24, r * 0.24, '#f0b8c0');
    shadedEllipse(ctx, hx, hy, r * 0.55, r * 0.52, '#c4beb9', '#a09a95');
    ellipse(ctx, hx + r * 0.42, hy + r * 0.12, r * 0.1, r * 0.08, '#e89aa6');
    eye(ctx, hx + r * 0.18, hy, r * 0.1);
  }

  // --- Orava ---
  function squirrel(ctx, r, swing, e) {
    const isGold = (e && e.kind === 'golden_squirrel');
    if (isGold) {
      ctx.save();
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 14;
    }

    groundShadow(ctx, r);
    // Suuri pörröhäntä kaartuu selän yli
    ctx.save();
    ctx.translate(-r * 0.9, -r * 0.1);
    shadedEllipse(ctx, 0, -r * 0.4, r * 0.55, r * 0.95, isGold ? '#ffd700' : '#d98a4e', isGold ? '#ffa000' : '#9e5526');
    ellipse(ctx, 0, -r * 0.7, r * 0.36, r * 0.6, isGold ? '#fff176' : '#e9a868');
    ctx.restore();
    leg(ctx, -r * 0.35, r * 0.4, r * 0.28, r * 0.48, isGold ? '#ffa000' : '#9e5526', swing * 0.5);
    shadedEllipse(ctx, 0, 0, r * 0.95, r * 0.74, isGold ? '#ffb300' : '#c8743a', isGold ? '#ffa000' : '#9e5526');
    ellipse(ctx, r * 0.15, r * 0.3, r * 0.6, r * 0.32, isGold ? '#fffde7' : '#f0d8b8'); // vaalea vatsa
    leg(ctx, r * 0.5, r * 0.42, r * 0.28, r * 0.5, isGold ? '#ffa000' : '#b5642e', -swing * 0.5);
    const hx = r * 0.85, hy = -r * 0.28;
    ear(ctx, hx - r * 0.22, hy - r * 0.5, r * 0.34, r * 0.5, -0.2, isGold ? '#ffa000' : '#b5642e', isGold ? '#fff176' : '#e9a868');
    ear(ctx, hx + r * 0.22, hy - r * 0.5, r * 0.34, r * 0.5, 0.2, isGold ? '#ffa000' : '#b5642e', isGold ? '#fff176' : '#e9a868');
    shadedEllipse(ctx, hx, hy, r * 0.56, r * 0.54, isGold ? '#ffd700' : '#d07e44', isGold ? '#ffa000' : '#a85c2c');
    ellipse(ctx, hx + r * 0.45, hy + r * 0.1, r * 0.1, r * 0.09, '#3a2a20');
    eye(ctx, hx + r * 0.2, hy - r * 0.04, r * 0.11);

    if (isGold) {
      ctx.restore();
    }
  }

  // --- Kärppä ---
  function weasel(ctx, r, swing) {
    groundShadow(ctx, r);
    // Takajalka ja etujalka (lyhyet pikkujalat)
    leg(ctx, -r * 0.5, r * 0.45, r * 0.18, r * 0.35, '#8a5a3a', swing * 0.8);
    leg(ctx, r * 0.5, r * 0.45, r * 0.18, r * 0.35, '#8a5a3a', -swing * 0.8);
    
    // Pitkä ohut vartalo
    shadedEllipse(ctx, 0, 0, r * 1.25, r * 0.48, '#a06a48', '#784c30');
    // Valkoinen alavatsa/kaula
    ellipse(ctx, r * 0.2, r * 0.16, r * 0.8, r * 0.22, '#ffffff');

    // Ohut pieni häntä takana
    ctx.save();
    ctx.translate(-r * 1.15, -r * 0.15);
    ctx.rotate(0.2 + Math.sin(swing * 2) * 0.25);
    shadedEllipse(ctx, -r * 0.3, 0, r * 0.45, r * 0.18, '#8e5b3c', '#5e3a24');
    ctx.restore();

    // Pää (pitkähkön kaulan päässä edessä)
    const hx = r * 0.95, hy = -r * 0.38;
    // Pienet korvat
    ear(ctx, hx - r * 0.1, hy - r * 0.24, r * 0.2, r * 0.22, -0.1, '#a06a48', '#ffccd5');
    // Pääkuori
    shadedEllipse(ctx, hx, hy, r * 0.44, r * 0.34, '#b27752', '#8c5836');
    // Silmä
    eye(ctx, hx + r * 0.14, hy - r * 0.08, r * 0.08);
    // Kuono/Nenä
    ellipse(ctx, hx + r * 0.4, hy + r * 0.08, r * 0.07, r * 0.07, '#221105');
  }

  // --- Siili ---
  function hedgehog(ctx, r, swing) {
    groundShadow(ctx, r);
    leg(ctx, -r * 0.3, r * 0.45, r * 0.24, r * 0.4, '#8a6a4a', swing * 0.4);
    leg(ctx, r * 0.35, r * 0.45, r * 0.24, r * 0.42, '#8a6a4a', -swing * 0.4);
    // Piikkikupu
    const g = ctx.createLinearGradient(0, -r * 0.8, 0, r * 0.6);
    g.addColorStop(0, '#7a6347');
    g.addColorStop(1, '#4f3f2c');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(-r * 0.1, -r * 0.05, r * 1.05, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    // Piikit
    ctx.fillStyle = '#3d3020';
    for (let i = 0; i < 11; i++) {
      const a = -Math.PI * 0.95 + (i / 10) * Math.PI * 0.9;
      const bx = -r * 0.1 + Math.cos(a) * r * 1.0;
      const by = -r * 0.05 + Math.sin(a) * r * 0.8;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(-r * 0.1, 0);
      ctx.lineTo(r * 0.32, 0);
      ctx.lineTo(-r * 0.1, r * 0.16);
      ctx.fill();
      ctx.restore();
    }
    // Vaalea naama edessä
    const hx = r * 0.7, hy = r * 0.12;
    shadedEllipse(ctx, hx, hy, r * 0.5, r * 0.42, '#e8d4ba', '#c8ad8c');
    ellipse(ctx, hx + r * 0.42, hy + r * 0.05, r * 0.13, r * 0.11, '#2a2018'); // nenä
    eye(ctx, hx, hy - r * 0.05, r * 0.1);
  }

  // --- Karhu (peto) ---
  function bear(ctx, r, swing) {
    groundShadow(ctx, r);
    leg(ctx, -r * 0.55, r * 0.5, r * 0.42, r * 0.5, '#5e3a24', swing * 0.5);
    shadedEllipse(ctx, 0, 0, r * 1.18, r * 0.95, '#8a5a3a', '#5e3a24');
    leg(ctx, r * 0.6, r * 0.5, r * 0.42, r * 0.52, '#6b4226', -swing * 0.5);
    const hx = r * 0.92, hy = -r * 0.1;
    // Pyöreät korvat
    ellipse(ctx, hx - r * 0.4, hy - r * 0.55, r * 0.3, r * 0.3, '#6b4226');
    ellipse(ctx, hx - r * 0.4, hy - r * 0.55, r * 0.16, r * 0.16, '#caa074');
    ellipse(ctx, hx + r * 0.35, hy - r * 0.6, r * 0.3, r * 0.3, '#6b4226');
    ellipse(ctx, hx + r * 0.35, hy - r * 0.6, r * 0.16, r * 0.16, '#caa074');
    shadedEllipse(ctx, hx, hy, r * 0.72, r * 0.66, '#7e5234', '#5e3a24');
    // Kuono
    shadedEllipse(ctx, hx + r * 0.45, hy + r * 0.22, r * 0.42, r * 0.34, '#caa074', '#a07c50');
    ellipse(ctx, hx + r * 0.78, hy + r * 0.18, r * 0.14, r * 0.11, '#241812');
    // Pienet uhkaavat silmät
    eye(ctx, hx + r * 0.2, hy - r * 0.12, r * 0.1, '#1a1a1a');
    // Kulmakarva (vihaisuus)
    ctx.strokeStyle = '#3a2418';
    ctx.lineWidth = r * 0.08;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.05, hy - r * 0.32);
    ctx.lineTo(hx + r * 0.35, hy - r * 0.2);
    ctx.stroke();
  }

  // --- Susi (peto) ---
  function wolf(ctx, r, swing) {
    groundShadow(ctx, r);
    // Pörröhäntä
    ctx.save();
    ctx.translate(-r * 1.05, r * 0.05);
    shadedEllipse(ctx, 0, 0, r * 0.6, r * 0.4, '#5a5f6e', '#33384a');
    ellipse(ctx, -r * 0.2, 0, r * 0.28, r * 0.2, '#2b2f3e');
    ctx.restore();
    leg(ctx, -r * 0.55, r * 0.48, r * 0.36, r * 0.55, '#3c4150', swing * 0.6);
    shadedEllipse(ctx, 0, 0, r * 1.18, r * 0.82, '#5a5f6e', '#3c4150');
    ellipse(ctx, r * 0.1, r * 0.35, r * 0.8, r * 0.38, '#7a8090'); // vaaleampi vatsa
    leg(ctx, r * 0.6, r * 0.48, r * 0.36, r * 0.58, '#4a4f60', -swing * 0.6);
    const hx = r * 0.95, hy = -r * 0.15;
    ear(ctx, hx - r * 0.35, hy - r * 0.6, r * 0.5, r * 0.62, -0.25, '#4a4f60', '#2b2f3e');
    ear(ctx, hx + r * 0.35, hy - r * 0.6, r * 0.5, r * 0.62, 0.25, '#4a4f60', '#2b2f3e');
    shadedEllipse(ctx, hx, hy, r * 0.72, r * 0.64, '#5e6373', '#42475a');
    // Vaalea kuono
    ellipse(ctx, hx + r * 0.5, hy + r * 0.2, r * 0.42, r * 0.3, '#8a90a0');
    ellipse(ctx, hx + r * 0.88, hy + r * 0.18, r * 0.13, r * 0.1, '#15171f'); // nenä
    // Keltaiset pedon silmät
    eye(ctx, hx + r * 0.25, hy - r * 0.08, r * 0.12, '#e8c64a');
    ellipse(ctx, hx + r * 0.25, hy - r * 0.08, r * 0.05, r * 0.05, '#1a1a1a'); // pupilli
  }

  // --- Lintu (saalis) — nopea ja kepeä ---
  function bird(ctx, r, swing) {
    groundShadow(ctx, r * 0.8);
    // Pyrstö
    ctx.fillStyle = '#3a7fc0';
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.1);
    ctx.lineTo(-r * 1.3, -r * 0.4);
    ctx.lineTo(-r * 1.25, r * 0.25);
    ctx.closePath();
    ctx.fill();
    // Vartalo
    shadedEllipse(ctx, 0, 0, r * 0.9, r * 0.72, '#6ab0ec', '#3f86cf');
    ellipse(ctx, r * 0.05, r * 0.28, r * 0.6, r * 0.32, '#dff0ff'); // vaalea rinta
    // Siipi (räpyttää swingin mukaan)
    ctx.save();
    ctx.translate(-r * 0.05, -r * 0.1);
    ctx.rotate(swing * 0.5);
    ellipse(ctx, 0, 0, r * 0.55, r * 0.3, '#3a7fc0');
    ctx.restore();
    // Pää
    const hx = r * 0.7, hy = -r * 0.25;
    shadedEllipse(ctx, hx, hy, r * 0.5, r * 0.48, '#6ab0ec', '#4a90d8');
    // Nokka
    ctx.fillStyle = '#f0a838';
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.35, hy);
    ctx.lineTo(hx + r * 0.85, hy + r * 0.08);
    ctx.lineTo(hx + r * 0.35, hy + r * 0.22);
    ctx.closePath();
    ctx.fill();
    eye(ctx, hx + r * 0.1, hy - r * 0.02, r * 0.1);
  }

  // --- Kettu (peto) — nopea, kapea mutta pitkä näkökenttä ---
  function fox(ctx, r, swing) {
    groundShadow(ctx, r);
    // Pörröhäntä valkoisella kärjellä
    ctx.save();
    ctx.translate(-r * 1.05, r * 0.05);
    shadedEllipse(ctx, 0, 0, r * 0.62, r * 0.42, '#e07b2a', '#b85a1e');
    ellipse(ctx, -r * 0.35, 0, r * 0.3, r * 0.26, '#f5ede0'); // valkoinen kärki
    ctx.restore();
    leg(ctx, -r * 0.5, r * 0.5, r * 0.3, r * 0.5, '#9e4e18', swing * 0.6);
    shadedEllipse(ctx, 0, 0, r * 1.12, r * 0.74, '#e07b2a', '#b85a1e');
    ellipse(ctx, r * 0.1, r * 0.34, r * 0.78, r * 0.34, '#f5ede0'); // valkoinen vatsa
    leg(ctx, r * 0.55, r * 0.5, r * 0.3, r * 0.52, '#c4691f', -swing * 0.6);
    const hx = r * 0.92, hy = -r * 0.18;
    // Terävät korvat
    ear(ctx, hx - r * 0.3, hy - r * 0.55, r * 0.42, r * 0.6, -0.25, '#c4691f', '#2b2018');
    ear(ctx, hx + r * 0.3, hy - r * 0.58, r * 0.42, r * 0.6, 0.25, '#c4691f', '#2b2018');
    shadedEllipse(ctx, hx, hy, r * 0.62, r * 0.56, '#e07b2a', '#bf631f');
    // Valkoiset posket + kuono
    ellipse(ctx, hx + r * 0.45, hy + r * 0.22, r * 0.46, r * 0.3, '#f5ede0');
    ellipse(ctx, hx + r * 0.82, hy + r * 0.2, r * 0.12, r * 0.1, '#1a1410'); // nenä
    // Terävä keltainen silmä
    eye(ctx, hx + r * 0.2, hy - r * 0.06, r * 0.12, '#f0c040');
    ellipse(ctx, hx + r * 0.2, hy - r * 0.06, r * 0.05, r * 0.07, '#1a1a1a'); // kapea pupilli
  }

  // --- Ilves (peto) — nopea loikkaaja, korvatupsut, bobtail ---
  function lynx(ctx, r, swing) {
    groundShadow(ctx, r);
    // Töpöhäntä
    ctx.save();
    ctx.translate(-r * 1.0, r * 0.05);
    ctx.rotate(-0.2 + swing * 0.2);
    shadedEllipse(ctx, 0, 0, r * 0.35, r * 0.26, '#9c8e82', '#7a6d61');
    ellipse(ctx, -r * 0.15, 0, r * 0.18, r * 0.18, '#1a1a1a'); // musta kärki
    ctx.restore();
    // Takajalat
    leg(ctx, -r * 0.5, r * 0.48, r * 0.34, r * 0.54, '#7a6d61', swing * 0.6);
    // Vartalo täplillä
    shadedEllipse(ctx, 0, 0, r * 1.14, r * 0.78, '#b0a295', '#7a6d61');
    // Täplät
    ellipse(ctx, -r * 0.4, -r * 0.15, r * 0.08, r * 0.08, '#4c3f35');
    ellipse(ctx, -r * 0.15, -r * 0.3, r * 0.08, r * 0.08, '#4c3f35');
    ellipse(ctx, -r * 0.2, r * 0.1, r * 0.08, r * 0.08, '#4c3f35');
    ellipse(ctx, r * 0.2, -r * 0.2, r * 0.08, r * 0.08, '#4c3f35');
    ellipse(ctx, r * 0.15, r * 0.2, r * 0.08, r * 0.08, '#4c3f35');
    ellipse(ctx, -r * 0.6, r * 0.15, r * 0.08, r * 0.08, '#4c3f35');

    // Vatsa
    ellipse(ctx, r * 0.1, r * 0.34, r * 0.74, r * 0.34, '#eae3da');
    leg(ctx, r * 0.55, r * 0.48, r * 0.34, r * 0.56, '#8e8073', -swing * 0.6);
    
    // Pää & tupsukorvat
    const hx = r * 0.9, hy = -r * 0.18;
    ear(ctx, hx - r * 0.3, hy - r * 0.55, r * 0.45, r * 0.65, -0.2, '#8e8073', '#eae3da');
    ear(ctx, hx + r * 0.3, hy - r * 0.58, r * 0.45, r * 0.65, 0.2, '#8e8073', '#eae3da');
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = r * 0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.4, hy - r * 1.1);
    ctx.lineTo(hx - r * 0.45, hy - r * 1.3);
    ctx.moveTo(hx + r * 0.4, hy - r * 1.1);
    ctx.lineTo(hx + r * 0.45, hy - r * 1.3);
    ctx.stroke();

    shadedEllipse(ctx, hx, hy, r * 0.64, r * 0.58, '#b0a295', '#8e8073');
    ellipse(ctx, hx - r * 0.35, hy + r * 0.2, r * 0.32, r * 0.25, '#eae3da');
    ellipse(ctx, hx + r * 0.35, hy + r * 0.2, r * 0.32, r * 0.25, '#eae3da');
    ellipse(ctx, hx + r * 0.35, hy + r * 0.24, r * 0.38, r * 0.26, '#eae3da');
    ellipse(ctx, hx + r * 0.68, hy + r * 0.2, r * 0.12, r * 0.08, '#1a1a1a'); // nenä
    eye(ctx, hx + r * 0.16, hy - r * 0.06, r * 0.12, '#aed046');
    ellipse(ctx, hx + r * 0.16, hy - r * 0.06, r * 0.05, r * 0.07, '#1a1a1a'); // pupilli
  }

  // --- Kotka (peto) — lentävä saalistaja, siivet räpyttävät ---
  function eagle(ctx, r, swing) {
    ctx.fillStyle = '#3d2b20';
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, r * 0.1);
    ctx.lineTo(-r * 1.25, r * 0.4);
    ctx.lineTo(-r * 1.25, -r * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fdfbf7';
    ctx.beginPath();
    ctx.moveTo(-r * 1.1, r * 0.3);
    ctx.lineTo(-r * 1.35, r * 0.42);
    ctx.lineTo(-r * 1.35, -r * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(-r * 0.15, -r * 0.25);
    ctx.rotate(-0.55 + swing * 0.75);
    shadedEllipse(ctx, 0, -r * 0.8, r * 0.42, r * 1.1, '#3d2b20', '#201610');
    ctx.restore();

    shadedEllipse(ctx, 0, 0, r * 1.1, r * 0.68, '#4e3629', '#2d1e16');

    const hx = r * 0.82, hy = -r * 0.18;
    shadedEllipse(ctx, hx, hy, r * 0.52, r * 0.48, '#ffffff', '#e8e5df');

    ctx.fillStyle = '#f0b838';
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.3, hy - r * 0.1);
    ctx.lineTo(hx + r * 0.88, hy + r * 0.05);
    ctx.quadraticCurveTo(hx + r * 0.78, hy + r * 0.42, hx + r * 0.25, hy + r * 0.28);
    ctx.closePath();
    ctx.fill();
    eye(ctx, hx + r * 0.1, hy - r * 0.08, r * 0.11, '#f5c63c');
    ellipse(ctx, hx + r * 0.1, hy - r * 0.08, r * 0.06, r * 0.06, '#1a1a1a');

    ctx.save();
    ctx.translate(r * 0.05, -r * 0.15);
    ctx.rotate(0.2 - swing * 0.75);
    shadedEllipse(ctx, 0, -r * 0.9, r * 0.46, r * 1.25, '#5c4335', '#3d2b20');
    ctx.strokeStyle = '#2d1e16';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -r * 0.6);
    ctx.lineTo(-r * 0.15, -r * 1.4);
    ctx.moveTo(0, -r * 0.5);
    ctx.lineTo(0, -r * 1.5);
    ctx.moveTo(r * 0.15, -r * 0.6);
    ctx.lineTo(r * 0.15, -r * 1.4);
    ctx.stroke();
    ctx.restore();
  }


  // --- Hirvi (deer) ---
  function deer(ctx, r, swing, e) {
    // Jalat
    const legSwing = e.moving ? Math.sin(e.animPhase) * 0.38 : 0;
    const legColor = '#7a4a1a';
    leg(ctx, -r*0.3, r*0.25, r*0.22, r*0.65, legColor, legSwing);
    leg(ctx, r*0.3, r*0.25, r*0.22, r*0.65, legColor, -legSwing);
    // Vartalo
    shadedEllipse(ctx, 0, -r*0.1, r*1.05, r*0.55, '#c8824a', '#8a5424');
    // Kaula
    ctx.fillStyle = '#c8824a';
    ctx.beginPath();
    ctx.ellipse(r*0.7, -r*0.5, r*0.22, r*0.38, 0.35, 0, Math.PI * 2);
    ctx.fill();
    // Pää
    ctx.fillStyle = '#bf7830';
    ctx.beginPath();
    ctx.ellipse(r*1.0, -r*0.82, r*0.32, r*0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Korvat
    ctx.fillStyle = '#d89050';
    ctx.beginPath();
    ctx.ellipse(r*0.85, -r*1.1, r*0.1, r*0.22, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r*1.15, -r*1.05, r*0.1, r*0.22, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Sarvet (sarvipukit)
    ctx.strokeStyle = '#5a3008';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(r*0.88, -r*1.18);
    ctx.lineTo(r*0.72, -r*1.6);
    ctx.lineTo(r*0.55, -r*1.42);
    ctx.moveTo(r*0.72, -r*1.6);
    ctx.lineTo(r*0.9, -r*1.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r*1.12, -r*1.15);
    ctx.lineTo(r*1.28, -r*1.58);
    ctx.lineTo(r*1.45, -r*1.4);
    ctx.moveTo(r*1.28, -r*1.58);
    ctx.lineTo(r*1.1, -r*1.73);
    ctx.stroke();
    // Silmä
    ctx.fillStyle = '#1a0a00';
    ctx.beginPath();
    ctx.arc(r*1.12, -r*0.88, r*0.075, 0, Math.PI * 2);
    ctx.fill();
    // Pyrstö (pieni valkoinen täplä)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-r*0.95, -r*0.2, r*0.2, r*0.25, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Majava (beaver) ---
  function beaver(ctx, r, swing, e) {
    const legSwing = e.moving ? Math.sin(e.animPhase) * 0.28 : 0;
    // Lapio-pyrstö
    ctx.fillStyle = '#5a3820';
    ctx.beginPath();
    ctx.ellipse(-r*1.0, r*0.35, r*0.55, r*0.22, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a2010';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Ristikuvio pyrstöön
    ctx.strokeStyle = '#3a2010';
    ctx.lineWidth = 0.7;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-r*0.62 + i*r*0.22, r*0.2);
      ctx.lineTo(-r*1.38 + i*r*0.18, r*0.5);
      ctx.stroke();
    }
    // Jalat
    leg(ctx, -r*0.25, r*0.18, r*0.24, r*0.48, '#6a4228', legSwing);
    leg(ctx, r*0.25, r*0.18, r*0.24, r*0.48, '#6a4228', -legSwing);
    // Pyöreä vartalo
    shadedEllipse(ctx, 0, -r*0.06, r*0.88, r*0.62, '#8a5a30', '#5a3818');
    // Vatsa
    ctx.fillStyle = '#b89070';
    ctx.beginPath();
    ctx.ellipse(r*0.1, r*0.05, r*0.45, r*0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pää
    ctx.fillStyle = '#8a5a30';
    ctx.beginPath();
    ctx.ellipse(r*0.82, -r*0.5, r*0.38, r*0.32, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Korvat pyöreät
    ctx.fillStyle = '#6a4420';
    ctx.beginPath(); ctx.arc(r*0.72, -r*0.86, r*0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r*1.0, -r*0.84, r*0.14, 0, Math.PI * 2); ctx.fill();
    // Silmä
    ctx.fillStyle = '#100800';
    ctx.beginPath(); ctx.arc(r*0.98, -r*0.56, r*0.09, 0, Math.PI * 2); ctx.fill();
    // Isot etuhampaat
    ctx.fillStyle = '#fffadc';
    ctx.fillRect(r*0.92, -r*0.32, r*0.12, r*0.18);
    ctx.fillRect(r*1.08, -r*0.32, r*0.12, r*0.18);
    ctx.strokeStyle = '#c8b060';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(r*0.92, -r*0.32, r*0.12, r*0.18);
    ctx.strokeRect(r*1.08, -r*0.32, r*0.12, r*0.18);
  }

  // --- Lepakko (bat) ---
  function bat(ctx, r, swing) {
    // Siivet
    ctx.fillStyle = '#222228';
    ctx.save();
    ctx.translate(-r * 0.1, -r * 0.1);
    ctx.rotate(-0.5 + swing * 1.1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-r * 1.6, -r * 0.8);
    ctx.lineTo(-r * 1.1, r * 0.2);
    ctx.lineTo(-r * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(r * 0.1, -r * 0.1);
    ctx.rotate(0.5 - swing * 1.1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 1.6, -r * 0.8);
    ctx.lineTo(r * 1.1, r * 0.2);
    ctx.lineTo(r * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Vartalo
    shadedEllipse(ctx, 0, 0, r * 0.6, r * 0.8, '#3c3540', '#1c1822');

    // Korvat
    ctx.fillStyle = '#3c3540';
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.7);
    ctx.lineTo(-r * 0.4, -r * 1.3);
    ctx.lineTo(-r * 0.1, -r * 0.8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r * 0.3, -r * 0.7);
    ctx.lineTo(r * 0.4, -r * 1.3);
    ctx.lineTo(r * 0.1, -r * 0.8);
    ctx.closePath();
    ctx.fill();

    // Silmät (pienet punaiset hehkut)
    ctx.fillStyle = '#ff3344';
    ellipse(ctx, -r * 0.2, -r * 0.2, r * 0.08, r * 0.08);
    ellipse(ctx, r * 0.2, -r * 0.2, r * 0.08, r * 0.08);
  }

  // --- Pöllö (owl) ---
  function owl(ctx, r, swing) {
    // Vartalo
    shadedEllipse(ctx, 0, r * 0.1, r * 0.85, r * 1.0, '#7d5c44', '#473224');

    // Naamamaski
    ctx.fillStyle = '#eae1d8';
    ctx.beginPath();
    ctx.arc(-r * 0.35, -r * 0.2, r * 0.32, 0, Math.PI * 2);
    ctx.arc(r * 0.35, -r * 0.2, r * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Suuret keltaiset pöllönsilmät
    ctx.fillStyle = '#ffe04a';
    ctx.beginPath();
    ctx.arc(-r * 0.35, -r * 0.2, r * 0.24, 0, Math.PI * 2);
    ctx.arc(r * 0.35, -r * 0.2, r * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#100c08';
    ctx.beginPath();
    ctx.arc(-r * 0.35, -r * 0.2, r * 0.12, 0, Math.PI * 2);
    ctx.arc(r * 0.35, -r * 0.2, r * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Nokka
    ctx.fillStyle = '#ffaa33';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.15);
    ctx.lineTo(-r * 0.1, r * 0.12);
    ctx.lineTo(r * 0.1, r * 0.12);
    ctx.closePath();
    ctx.fill();

    // Siivet sivuilla
    ctx.save();
    ctx.translate(-r * 0.8, r * 0.1);
    ctx.rotate(0.2 + swing * 0.15);
    shadedEllipse(ctx, 0, 0, r * 0.22, r * 0.74, '#5c412f', '#322218');
    ctx.restore();

    ctx.save();
    ctx.translate(r * 0.8, r * 0.1);
    ctx.rotate(-0.2 - swing * 0.15);
    shadedEllipse(ctx, 0, 0, r * 0.22, r * 0.74, '#5c412f', '#322218');
    ctx.restore();

    // Korvatupsut
    ctx.fillStyle = '#7d5c44';
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, -r * 0.7);
    ctx.lineTo(-r * 0.85, -r * 1.15);
    ctx.lineTo(-r * 0.35, -r * 0.8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r * 0.6, -r * 0.7);
    ctx.lineTo(r * 0.85, -r * 1.15);
    ctx.lineTo(r * 0.35, -r * 0.8);
    ctx.closePath();
    ctx.fill();
  }

  // --- Yeti ---
  function yeti(ctx, r, swing) {
    const legSwing = Math.sin(swing * 2) * 0.3;
    leg(ctx, -r * 0.4, r * 0.4, r * 0.34, r * 0.8, '#ddedf8', legSwing);
    leg(ctx, r * 0.4, r * 0.4, r * 0.34, r * 0.8, '#ddedf8', -legSwing);

    // Vartalo
    shadedEllipse(ctx, 0, -r * 0.15, r * 1.25, r * 1.0, '#ffffff', '#bce2f5');

    // Kädet
    ctx.save();
    ctx.translate(-r * 0.8, -r * 0.1);
    ctx.rotate(0.4 + legSwing * 0.6);
    shadedEllipse(ctx, 0, r * 0.3, r * 0.3, r * 0.8, '#ffffff', '#bce2f5');
    ctx.restore();

    ctx.save();
    ctx.translate(r * 0.8, -r * 0.1);
    ctx.rotate(-0.4 - legSwing * 0.6);
    shadedEllipse(ctx, 0, r * 0.3, r * 0.3, r * 0.8, '#ffffff', '#bce2f5');
    ctx.restore();

    // Naama (sinertävä iho)
    ctx.fillStyle = '#a2cbe6';
    ctx.beginPath();
    ctx.arc(0, -r * 0.42, r * 0.48, 0, Math.PI * 2);
    ctx.fill();

    // Silmät (keltaisen hehkuvat)
    ctx.fillStyle = '#ffd700';
    ellipse(ctx, -r * 0.18, -r * 0.48, r * 0.08, r * 0.08);
    ellipse(ctx, r * 0.18, -r * 0.48, r * 0.08, r * 0.08);
    ctx.fillStyle = '#100c08';
    ellipse(ctx, -r * 0.18, -r * 0.48, r * 0.04, r * 0.04);
    ellipse(ctx, r * 0.18, -r * 0.48, r * 0.04, r * 0.04);

    // Suu ja torhahampaat
    ctx.strokeStyle = '#22384a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -r * 0.28, r * 0.15, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Torahampaat (ylös)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-r * 0.09, -r * 0.26);
    ctx.lineTo(-r * 0.06, -r * 0.16);
    ctx.lineTo(-r * 0.03, -r * 0.26);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(r * 0.03, -r * 0.26);
    ctx.lineTo(r * 0.06, -r * 0.16);
    ctx.lineTo(r * 0.09, -r * 0.26);
    ctx.closePath();
    ctx.fill();
  }

  // --- Scorpion ---
  function scorpion(ctx, r, swing) {
    const walkAnim = Math.sin(swing * 3) * 0.35;
    
    // Sakset (Pinchers)
    ctx.strokeStyle = '#6d1b1b';
    ctx.lineWidth = r * 0.18;
    ctx.lineCap = 'round';
    
    ctx.save();
    ctx.translate(r * 0.4, -r * 0.1);
    ctx.rotate(0.3 + walkAnim);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.6, -r * 0.3);
    ctx.stroke();
    // Saksi-osa
    ctx.fillStyle = '#8f2323';
    ctx.beginPath();
    ctx.ellipse(r * 0.6, -r * 0.3, r * 0.25, r * 0.16, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(r * 0.4, r * 0.3);
    ctx.rotate(-0.3 - walkAnim);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.6, r * 0.3);
    ctx.stroke();
    // Saksi-osa
    ctx.fillStyle = '#8f2323';
    ctx.beginPath();
    ctx.ellipse(r * 0.6, r * 0.3, r * 0.25, r * 0.16, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Vartalo segmentit
    shadedEllipse(ctx, 0, r * 0.1, r * 0.95, r * 0.64, '#802020', '#4a1010');

    // Jalat (monta pientä niveltä sivuilla)
    ctx.strokeStyle = '#4a1010';
    ctx.lineWidth = r * 0.1;
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      const legX = i * r * 0.24;
      const offset = i * 0.25 + walkAnim;
      ctx.beginPath();
      ctx.moveTo(legX, r * 0.3);
      ctx.lineTo(legX - r * 0.15, r * 0.7 + offset * r * 0.18);
      ctx.lineTo(legX - r * 0.32, r * 1.05 + offset * r * 0.14);
      ctx.stroke();
    }

    // Pyrstö (segmentit + myrkkypistin kaarella ylös)
    ctx.save();
    ctx.translate(-r * 0.76, r * 0.1);
    ctx.rotate(-0.8 + Math.sin(swing * 2) * 0.22);
    // Pyrstösegmentit
    ctx.fillStyle = '#6d1b1b';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(-i * r * 0.26, -i * r * 0.18, r * 0.25 * (1 - i * 0.12), 0, Math.PI * 2);
      ctx.fill();
      if (i === 4) {
        // Myrkkypistin
        ctx.fillStyle = '#ff2a4b';
        ctx.beginPath();
        ctx.arc(-i * r * 0.26 - r * 0.1, -i * r * 0.18 - r * 0.2, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
        // Piikki
        ctx.strokeStyle = '#ff2a4b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-i * r * 0.26 - r * 0.1, -i * r * 0.18 - r * 0.2);
        ctx.quadraticCurveTo(-i * r * 0.26 - r * 0.25, -i * r * 0.18 - r * 0.5, -i * r * 0.26 - r * 0.45, -i * r * 0.58);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // --- Crocodile ---
  function crocodile(ctx, r, swing) {
    const wiggle = Math.sin(swing * 2) * 0.25;

    // Pyrstö wiggle
    ctx.save();
    ctx.translate(-r * 0.65, r * 0.1);
    ctx.rotate(wiggle);
    ctx.fillStyle = '#263a23';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.35);
    ctx.lineTo(-r * 1.55, 0);
    ctx.lineTo(0, r * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Jalat
    leg(ctx, -r * 0.38, r * 0.34, r * 0.24, r * 0.42, '#2e482b', wiggle);
    leg(ctx, r * 0.38, r * 0.34, r * 0.24, r * 0.42, '#2e482b', -wiggle);

    // Vartalo (pitkulainen)
    shadedEllipse(ctx, 0, r * 0.08, r * 1.15, r * 0.48, '#3d5c39', '#263a23');

    // Selän harjanteet
    ctx.fillStyle = '#21331e';
    for (let i = -3; i <= 3; i++) {
      const rx = i * r * 0.24;
      ctx.beginPath();
      ctx.moveTo(rx - 8, -r * 0.45);
      ctx.lineTo(rx, -r * 0.62);
      ctx.lineTo(rx + 8, -r * 0.45);
      ctx.closePath();
      ctx.fill();
    }

    // Pää (pitkä kuono)
    ctx.fillStyle = '#3d5c39';
    ctx.beginPath();
    ctx.ellipse(r * 1.0, -r * 0.05, r * 0.55, r * 0.32, 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Silmät (keltaiset, pystyt)
    ctx.fillStyle = '#ffe23a';
    ellipse(ctx, r * 0.88, -r * 0.24, r * 0.09, r * 0.07);
    ctx.fillStyle = '#100c08';
    ellipse(ctx, r * 0.88, -r * 0.24, r * 0.03, r * 0.07);

    // Valkoiset hampaat pilkottavat suusta
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
      const tx = r * 0.95 + i * r * 0.16;
      ctx.beginPath();
      ctx.moveTo(tx, r * 0.1);
      ctx.lineTo(tx + 4, r * 0.2);
      ctx.lineTo(tx + 8, r * 0.1);
      ctx.closePath();
      ctx.fill();
    }
  }

  function panther(ctx, r, phase) {
    // Jalat
    ctx.fillStyle = '#1c1c22';
    const legW = r * 0.22, legH = r * 0.65;
    const dy = Math.sin(phase) * r * 0.18;
    ctx.fillRect(-r * 0.5 - legW/2, dy, legW, legH);
    ctx.fillRect( r * 0.4 - legW/2, -dy, legW, legH);
    ctx.fillStyle = '#16161a';
    ctx.fillRect(-r * 0.2 - legW/2, -dy, legW, legH);
    ctx.fillRect( r * 0.1 - legW/2, dy, legW, legH);

    // Häntä
    ctx.strokeStyle = '#16161a';
    ctx.lineWidth = r * 0.16;
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.1);
    ctx.quadraticCurveTo(-r * 1.3, -r * 0.6, -r * 1.5, -r * 0.1);
    ctx.stroke();

    // Vartalo
    ctx.fillStyle = '#1c1c22';
    ellipse(ctx, 0, 0, r * 0.9, r * 0.55);

    // Pää
    ctx.fillStyle = '#22222a';
    ellipse(ctx, r * 0.8, -r * 0.35, r * 0.42, r * 0.38);

    // Korvat
    ctx.fillStyle = '#16161a';
    ctx.beginPath();
    ctx.moveTo(r * 0.6, -r * 0.65);
    ctx.lineTo(r * 0.8, -r * 0.72);
    ctx.lineTo(r * 0.85, -r * 0.55);
    ctx.fill();

    // Silmät (keltahehkuiset)
    ctx.fillStyle = '#ffd700';
    ellipse(ctx, r * 0.9, -r * 0.38, r * 0.08, r * 0.05);
  }

  function monkey(ctx, r, phase) {
    // Pitkä häntä
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = r * 0.15;
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, 0);
    ctx.quadraticCurveTo(-r * 1.2, -r * 0.8, -r * 1.0, -r * 1.2);
    ctx.stroke();

    // Jalat ja kädet
    ctx.fillStyle = '#734a22';
    const anim = Math.sin(phase * 1.3) * r * 0.22;
    ellipse(ctx, -r * 0.4, r * 0.6 + anim * 0.5, r * 0.18, r * 0.35);
    
    ctx.save();
    ctx.translate(r * 0.4, r * 0.2 + anim);
    ctx.rotate(0.3 + Math.sin(phase) * 0.4);
    ellipse(ctx, 0, 0, r * 0.15, r * 0.45);
    ctx.restore();

    // Keho
    ctx.fillStyle = '#8b5a2b';
    ellipse(ctx, -r * 0.1, r * 0.2, r * 0.6, r * 0.5);

    // Pää
    ellipse(ctx, r * 0.45, -r * 0.28, r * 0.4, r * 0.38);

    // Naama
    ctx.fillStyle = '#f0b89a';
    ellipse(ctx, r * 0.55, -r * 0.25, r * 0.25, r * 0.24);

    // Silmät ja hymy
    ctx.fillStyle = '#000000';
    ellipse(ctx, r * 0.6, -r * 0.3, r * 0.04, r * 0.04);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(r * 0.58, -r * 0.2, r * 0.08, 0, Math.PI);
    ctx.stroke();

    // Korvat
    ctx.fillStyle = '#8b5a2b';
    ellipse(ctx, r * 0.22, -r * 0.35, r * 0.12, r * 0.14);
    ctx.fillStyle = '#f0b89a';
    ellipse(ctx, r * 0.22, -r * 0.35, r * 0.07, r * 0.09);
  }

  function mountain_goat(ctx, r, phase) {
    // Jalat
    ctx.fillStyle = '#dcdcdc';
    const legW = r * 0.2;
    const dy = Math.sin(phase) * r * 0.2;
    ctx.fillRect(-r * 0.45, dy, legW, r * 0.7);
    ctx.fillRect( r * 0.35, -dy, legW, r * 0.7);
    ctx.fillStyle = '#eaeaea';
    ctx.fillRect(-r * 0.2, -dy, legW, r * 0.7);
    ctx.fillRect( r * 0.1, dy, legW, r * 0.7);

    // Keho
    ctx.fillStyle = '#eaeaea';
    ellipse(ctx, 0, 0, r * 0.8, r * 0.58);

    // Pää (kaula + kuono)
    ctx.fillStyle = '#fcfcfc';
    ctx.save();
    ctx.translate(r * 0.52, -r * 0.35);
    ctx.rotate(-0.35);
    ellipse(ctx, 0, 0, r * 0.28, r * 0.45);
    
    // Parta
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, r * 0.3);
    ctx.lineTo(r * 0.08, r * 0.6);
    ctx.lineTo(r * 0.16, r * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Sarvet
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = r * 0.11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(r * 0.45, -r * 0.62);
    ctx.quadraticCurveTo(r * 0.2, -r * 0.95, -r * 0.05, -r * 0.85);
    ctx.stroke();

    // Silmä
    ctx.fillStyle = '#000000';
    ellipse(ctx, r * 0.62, -r * 0.42, r * 0.04, r * 0.05);
  }

  function campfire(ctx, r, phase) {
    ctx.fillStyle = '#6b3e1b';
    ctx.save();
    ctx.translate(0, r * 0.35);
    ctx.rotate(0.4);
    ctx.fillRect(-r * 0.7, -r * 0.12, r * 1.4, r * 0.24);
    ctx.rotate(-0.8);
    ctx.fillRect(-r * 0.7, -r * 0.12, r * 1.4, r * 0.24);
    ctx.restore();

    const pulse = 0.85 + 0.15 * Math.abs(Math.sin(phase * 12));
    const radGrd = ctx.createRadialGradient(0, 0, 2, 0, 0, r * pulse * 1.15);
    radGrd.addColorStop(0, 'rgba(255, 230, 50, 0.95)');
    radGrd.addColorStop(0.3, 'rgba(255, 120, 0, 0.85)');
    radGrd.addColorStop(0.7, 'rgba(255, 40, 0, 0.55)');
    radGrd.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = radGrd;
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * pulse * 1.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.3 * pulse, r * 0.45 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function leafpile(ctx, r, phase) {
    ctx.save();
    const colors = ['#d86a1a', '#cc3322', '#c8a015', '#b85a1a'];
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = colors[i % colors.length];
      const angle = (i / 9) * Math.PI * 2;
      const dist = r * 0.45;
      const lx = Math.cos(angle) * dist;
      const ly = Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.ellipse(lx, ly, r * 0.55, r * 0.35, angle + 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lx - Math.cos(angle) * r * 0.3, ly - Math.sin(angle) * r * 0.3);
      ctx.lineTo(lx + Math.cos(angle) * r * 0.3, ly + Math.sin(angle) * r * 0.3);
      ctx.stroke();
    }
    ctx.restore();
  }

  function chest(ctx, r, phase) {
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(-r * 0.9, -r * 0.6, r * 1.8, r * 1.2);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 3;
    ctx.strokeRect(-r * 0.9, -r * 0.6, r * 1.8, r * 1.2);
    
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(-r * 0.9, -r * 0.6, r * 0.25, r * 1.2);
    ctx.fillRect(r * 0.65, -r * 0.6, r * 0.25, r * 1.2);
    
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(-r * 0.18, -r * 0.1, r * 0.36, r * 0.36);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, r * 0.05, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  function spikes(ctx, r, phase) {
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(-r * 0.9, -r * 0.9, r * 1.8, r * 1.8);
    ctx.strokeStyle = '#37474f';
    ctx.strokeRect(-r * 0.9, -r * 0.9, r * 1.8, r * 1.8);

    const up = Math.sin(phase * 4) > 0.0; 
    if (up) {
      ctx.fillStyle = '#cfd8dc';
      ctx.strokeStyle = '#78909c';
      ctx.lineWidth = 2;
      
      const xs = [-r * 0.5, -r * 0.17, r * 0.17, r * 0.5];
      for (const x of xs) {
        ctx.beginPath();
        ctx.moveTo(x, r * 0.6);
        ctx.lineTo(x - r * 0.12, -r * 0.85);
        ctx.lineTo(x + r * 0.12, r * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#263238';
      const xs = [-r * 0.5, -r * 0.17, r * 0.17, r * 0.5];
      for (const x of xs) {
        ctx.beginPath();
        ctx.arc(x, 0, r * 0.1, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  function portal(ctx, r, phase, e) {
    ctx.save();
    ctx.rotate(phase * 2.8);
    
    const locked = e && e.locked;
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r * 1.1);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, locked ? '#bdc3c7' : '#ea80fc');
    grad.addColorStop(0.7, locked ? '#7f8c8d' : '#8c9eff');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = locked ? '#bdc3c7' : '#ffffff';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(r * 0.5, -r * 0.3, r * 0.85, -r * 0.85);
      ctx.stroke();
    }
    ctx.restore();
  }

  function coconut_crab(ctx, r, phase, e) {
    ctx.save();
    const hiding = e && e.hiding;
    if (hiding) {
      ctx.fillStyle = '#c8b080';
      ctx.beginPath();
      ctx.arc(0, r * 0.3, r * 0.95, Math.PI, 0);
      ctx.fill();
      ctx.restore();
      return;
    }
    
    const walk = Math.sin(phase * 12);
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    for (let i = -1; i <= 1; i += 2) {
      ctx.beginPath();
      ctx.moveTo(i * r * 0.3, 0);
      ctx.lineTo(i * r * 0.95, r * (0.35 + walk * 0.15 * i));
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(i * r * 0.3, r * 0.3);
      ctx.lineTo(i * r * 0.95, r * (0.6 + walk * 0.15 * -i));
      ctx.stroke();
    }

    ctx.fillStyle = '#a1887f';
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i += 2) {
      ctx.save();
      ctx.translate(i * r * 0.45, -r * 0.3);
      ctx.rotate(i * 0.25 + walk * 0.1);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.35, r * 0.22, i * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.1, r * 0.08, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.1, r * 0.08, 0, Math.PI * 2);
    ctx.arc(0, r * 0.2, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  function seagull(ctx, r, phase) {
    ctx.save();
    const flap = Math.sin(phase * 15);
    ctx.fillStyle = '#e0e0e0';
    ctx.strokeStyle = '#9e9e9e';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, 0);
    ctx.quadraticCurveTo(-r * 0.7, -r * 0.6 + flap * r * 0.5, -r * 1.35, -r * 0.1 + flap * r * 0.45);
    ctx.quadraticCurveTo(-r * 0.6, -r * 0.1, -r * 0.15, r * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.moveTo(-r * 1.0, -r * 0.3 + flap * r * 0.45);
    ctx.lineTo(-r * 1.35, -r * 0.1 + flap * r * 0.45);
    ctx.lineTo(-r * 1.1, r * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(r * 0.15, 0);
    ctx.quadraticCurveTo(r * 0.7, -r * 0.6 + flap * r * 0.5, r * 1.35, -r * 0.1 + flap * r * 0.45);
    ctx.quadraticCurveTo(r * 0.6, -r * 0.1, r * 0.15, r * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.moveTo(r * 1.0, -r * 0.3 + flap * r * 0.45);
    ctx.lineTo(r * 1.35, -r * 0.1 + flap * r * 0.45);
    ctx.lineTo(r * 1.1, r * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.28, r * 0.68, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cfd8dc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffb300';
    ctx.beginPath();
    ctx.moveTo(-r * 0.08, -r * 0.65);
    ctx.lineTo(0, -r * 1.05);
    ctx.lineTo(r * 0.08, -r * 0.65);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function shark(ctx, r, swing) {
    groundShadow(ctx, r);

    // Pyrstöevä (heiluu)
    ctx.save();
    ctx.translate(-r * 0.9, 0);
    ctx.rotate(swing * 0.4);
    ctx.fillStyle = '#607d8b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-r * 0.65, -r * 0.75);
    ctx.lineTo(-r * 0.45, 0);
    ctx.lineTo(-r * 0.65, r * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Rintaevä (alaosaan)
    ctx.fillStyle = '#546e7a';
    ctx.beginPath();
    ctx.moveTo(r * 0.1, r * 0.4);
    ctx.lineTo(-r * 0.4, r * 0.95);
    ctx.lineTo(-r * 0.4, r * 0.4);
    ctx.closePath();
    ctx.fill();

    // Vartalo
    shadedEllipse(ctx, 0, 0, r * 1.15, r * 0.65, '#78909c', '#455a64');

    // Selkäevä (hai-evä yläosassa)
    ctx.fillStyle = '#78909c';
    ctx.beginPath();
    ctx.moveTo(-r * 0.35, -r * 0.55);
    ctx.quadraticCurveTo(-r * 0.3, -r * 1.35, -r * 0.7, -r * 1.4);
    ctx.quadraticCurveTo(-r * 0.1, -r * 1.05, r * 0.1, -r * 0.4);
    ctx.closePath();
    ctx.fill();

    // Kidukset (gills)
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(r * 0.25 - i * 8, -r * 0.05, r * 0.22, -0.6, 0.6);
      ctx.stroke();
    }

    // Silmä
    eye(ctx, r * 0.7, -r * 0.2, r * 0.12, '#000000');
  }

  function spider(ctx, r, phase) {
    ctx.save();
    ctx.strokeStyle = '#9b5de5';
    ctx.lineWidth = r * 0.15;
    for (let i = 0; i < 8; i++) {
      ctx.save();
      const angleOffset = (i < 4 ? -0.5 - i * 0.22 : 0.5 + (i - 4) * 0.22);
      const speedScale = (i % 2 === 0 ? 1 : -1);
      const legWiggle = Math.sin((phase || 0) * 0.45 + i) * 0.22 * speedScale;
      ctx.rotate(angleOffset + legWiggle);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, r * (i < 4 ? -1.25 : 1.25));
      ctx.lineTo(r * 0.4, r * (i < 4 ? -1.65 : 1.65));
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.fillStyle = '#2c1e4d';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, 0, r * 0.65, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#4a2f7d';
    ctx.beginPath();
    ctx.arc(r * 0.2, 0, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.arc(r * 0.45, -r * 0.15, r * 0.08, 0, Math.PI * 2);
    ctx.arc(r * 0.45, r * 0.15, r * 0.08, 0, Math.PI * 2);
    ctx.arc(r * 0.35, -r * 0.25, r * 0.06, 0, Math.PI * 2);
    ctx.arc(r * 0.35, r * 0.25, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- Kenguru (Australian Outback -saalis/ystävä) ---
  function kangaroo(ctx, r, swing, e) {
    groundShadow(ctx, r * 1.1);
    const hop = (e && e.moving) ? Math.abs(Math.sin(e.animPhase * 2)) * r * 0.35 : 0;
    
    ctx.save();
    ctx.translate(0, -hop);

    // Paksu voimakas häntä takana
    ctx.strokeStyle = '#9c542a';
    ctx.lineWidth = r * 0.28;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, r * 0.2);
    ctx.quadraticCurveTo(-r * 1.3, r * 0.45, -r * 1.5, r * 0.7);
    ctx.stroke();

    // Voimakkaat takajalat ja pitkät jalkaterät
    const legRot = (e && e.moving) ? Math.sin(e.animPhase) * 0.4 : 0;
    leg(ctx, -r * 0.25, r * 0.4, r * 0.35, r * 0.65, '#a7582c', legRot);
    ellipse(ctx, -r * 0.15 + Math.sin(legRot) * r * 0.2, r * 0.85, r * 0.42, r * 0.16, '#8b441f'); // pitkä jalkaterä

    // Vartalo (pystyhkö kankaan kaareva muoto)
    ctx.save();
    ctx.rotate(-0.15);
    shadedEllipse(ctx, -r * 0.05, 0, r * 0.82, r * 1.05, '#c7733e', '#9c542a');
    // Vaaleampi vatsa & pussi
    ellipse(ctx, r * 0.18, r * 0.12, r * 0.55, r * 0.72, '#f6d8be');
    ctx.restore();

    // Pienet etukäpälät
    ctx.strokeStyle = '#a7582c';
    ctx.lineWidth = r * 0.14;
    ctx.beginPath();
    ctx.moveTo(r * 0.35, -r * 0.05);
    ctx.quadraticCurveTo(r * 0.65, 0, r * 0.55, r * 0.2);
    ctx.stroke();

    // Pää ja niska
    const hx = r * 0.65, hy = -r * 0.75;
    shadedEllipse(ctx, hx - r * 0.15, hy + r * 0.35, r * 0.32, r * 0.45, '#c7733e', '#9c542a'); // niska
    shadedEllipse(ctx, hx, hy, r * 0.46, r * 0.42, '#cf7b44', '#9c542a'); // pää
    
    // Pitkät suuret pystykorvat
    ear(ctx, hx - r * 0.18, hy - r * 0.55, r * 0.25, r * 0.8, -0.22, '#c7733e', '#f5b5ab');
    ear(ctx, hx + r * 0.18, hy - r * 0.58, r * 0.25, r * 0.8, 0.2, '#c7733e', '#f5b5ab');

    // Kuono ja musta kirsu
    ellipse(ctx, hx + r * 0.35, hy + r * 0.1, r * 0.25, r * 0.2, '#b86634');
    ellipse(ctx, hx + r * 0.55, hy + r * 0.08, r * 0.08, r * 0.07, '#1f140e');

    // Suuri tumma silmä
    eye(ctx, hx + r * 0.14, hy - r * 0.06, r * 0.11, '#2b1a10');
    ellipse(ctx, hx + r * 0.17, hy - r * 0.08, r * 0.04, r * 0.04, '#ffffff'); // kiilto

    ctx.restore();
  }

  // --- Ylämaankarja / Pörrölehmä (Highland Cow) 🐂 ---
  function highland_cow(ctx, r, swing, e) {
    groundShadow(ctx, r * 1.3);

    // 4 tukevaa sorkkajalkaa
    leg(ctx, -r * 0.65, r * 0.32, r * 0.22, r * 0.55, '#7a3411', swing);
    leg(ctx, -r * 0.25, r * 0.32, r * 0.22, r * 0.55, '#9e461a', -swing);
    leg(ctx, r * 0.35, r * 0.32, r * 0.22, r * 0.55, '#7a3411', -swing);
    leg(ctx, r * 0.72, r * 0.32, r * 0.22, r * 0.55, '#9e461a', swing);

    // Häntä ja tupsu
    ctx.strokeStyle = '#9e461a';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r * 0.85, -r * 0.1);
    ctx.quadraticCurveTo(-r * 1.25, r * 0.2, -r * 1.15, r * 0.6);
    ctx.stroke();
    ellipse(ctx, -r * 1.15, r * 0.62, r * 0.16, r * 0.22, '#d97736');

    // Muhkea, tuuhea oranssinruskea keho
    shadedEllipse(ctx, 0, -r * 0.05, r * 1.05, r * 0.75, '#c3672b', '#7a3411');

    // Pörröisiä karvatupsuja vartalon reunoilla
    ctx.fillStyle = '#d97736';
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(i * r * 0.25, r * 0.42, r * 0.16, 0, Math.PI);
      ctx.fill();
    }

    // Pää ja sarvet
    const hx = r * 0.72, hy = -r * 0.32;
    
    // Mahtavat kaarevat sarvet taustalla
    ctx.strokeStyle = '#f5eedc';
    ctx.lineWidth = r * 0.16;
    ctx.lineCap = 'round';
    // Vasen sarvi
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.1, hy - r * 0.15);
    ctx.quadraticCurveTo(hx - r * 0.55, hy - r * 0.6, hx - r * 0.35, hy - r * 0.85);
    ctx.stroke();
    // Oikea sarvi
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.15, hy - r * 0.15);
    ctx.quadraticCurveTo(hx + r * 0.65, hy - r * 0.58, hx + r * 0.5, hy - r * 0.85);
    ctx.stroke();
    // Sarvien tummat kärjet
    ctx.fillStyle = '#3a271d';
    ellipse(ctx, hx - r * 0.35, hy - r * 0.85, r * 0.08, r * 0.1, '#3a271d');
    ellipse(ctx, hx + r * 0.5, hy - r * 0.85, r * 0.08, r * 0.1, '#3a271d');

    // Korvat sarvien alla
    ear(ctx, hx - r * 0.35, hy, r * 0.22, r * 0.38, -0.65, '#a44d1e', '#e59866');
    ear(ctx, hx + r * 0.35, hy, r * 0.22, r * 0.38, 0.65, '#a44d1e', '#e59866');

    // Pää
    shadedEllipse(ctx, hx, hy, r * 0.48, r * 0.44, '#b95c25', '#7a3411');

    // Turpa & kirsu
    ellipse(ctx, hx + r * 0.22, hy + r * 0.15, r * 0.28, r * 0.2, '#5d2c1d');
    ellipse(ctx, hx + r * 0.16, hy + r * 0.16, r * 0.05, r * 0.06, '#1a0d07');
    ellipse(ctx, hx + r * 0.28, hy + r * 0.16, r * 0.05, r * 0.06, '#1a0d07');

    // Ylämaankarjan tunnusomainen runsas otsatukka silmien yli
    ctx.fillStyle = '#e08244';
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.35, hy - r * 0.3);
    ctx.quadraticCurveTo(hx, hy + r * 0.1, hx + r * 0.35, hy - r * 0.3);
    ctx.lineTo(hx + r * 0.3, hy + r * 0.05);
    ctx.quadraticCurveTo(hx, hy + r * 0.25, hx - r * 0.3, hy + r * 0.05);
    ctx.closePath();
    ctx.fill();

    // Silmät pilkistävät tuuhean tukan lomasta
    eye(ctx, hx - r * 0.08, hy - r * 0.04, r * 0.08, '#1a0d07');
    eye(ctx, hx + r * 0.14, hy - r * 0.04, r * 0.08, '#1a0d07');
    ellipse(ctx, hx - r * 0.06, hy - r * 0.06, r * 0.03, r * 0.03, '#ffffff');
    ellipse(ctx, hx + r * 0.16, hy - r * 0.06, r * 0.03, r * 0.03, '#ffffff');
  }

  // --- Loch Nessin Hirviö (Nessie) 🦕 ---
  function nessie(ctx, r, swing, e) {
    // Veden väreilyt ja aallot
    ctx.save();
    ctx.strokeStyle = 'rgba(77, 208, 225, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.5, r * 1.3, r * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Kaksi vartalokumpua vedestä
    shadedEllipse(ctx, -r * 0.65, r * 0.25, r * 0.45, r * 0.35, '#2ec4b6', '#146356');
    shadedEllipse(ctx, -r * 0.15, r * 0.2, r * 0.55, r * 0.4, '#2ec4b6', '#146356');

    // Pyrstö vedestä
    ctx.strokeStyle = '#2ec4b6';
    ctx.lineWidth = r * 0.22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r * 0.95, r * 0.2);
    ctx.quadraticCurveTo(-r * 1.3, r * 0.0, -r * 1.25, -r * 0.2);
    ctx.stroke();

    // Pitkä joutsenmainen kaula kohoaa vedestä
    const neckPhase = (e && e.moving) ? Math.sin(e.animPhase * 2) * 0.1 : 0;
    ctx.beginPath();
    ctx.moveTo(r * 0.3, r * 0.25);
    ctx.quadraticCurveTo(r * 0.65 + neckPhase * r, -r * 0.3, r * 0.55, -r * 0.95);
    ctx.lineWidth = r * 0.32;
    ctx.strokeStyle = '#2ec4b6';
    ctx.stroke();

    // Vaalea vatsaraita kaulassa
    ctx.lineWidth = r * 0.12;
    ctx.strokeStyle = '#b2ebf2';
    ctx.beginPath();
    ctx.moveTo(r * 0.42, r * 0.22);
    ctx.quadraticCurveTo(r * 0.72 + neckPhase * r, -r * 0.3, r * 0.62, -r * 0.92);
    ctx.stroke();

    // Pää ja suloinen dinonokkakuono
    const hx = r * 0.58, hy = -r * 0.98;
    shadedEllipse(ctx, hx, hy, r * 0.4, r * 0.3, '#38ef7d', '#146356');
    ellipse(ctx, hx + r * 0.25, hy + r * 0.05, r * 0.22, r * 0.16, '#2ec4b6');

    // Pikkuharja pään takana
    ctx.fillStyle = '#ffeb3b';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(hx - r * 0.22 - i * r * 0.1, hy - r * 0.15 + i * r * 0.15, r * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }

    // Suuri ystävällinen silmä
    eye(ctx, hx + r * 0.08, hy - r * 0.06, r * 0.1, '#004d40');
    ellipse(ctx, hx + r * 0.11, hy - r * 0.09, r * 0.04, r * 0.04, '#ffffff');

    // Vesipisarat
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(r * 0.7, r * 0.45 + Math.sin(Date.now() * 0.01) * 3, 2, 0, Math.PI * 2);
    ctx.arc(-r * 0.8, r * 0.48 + Math.cos(Date.now() * 0.01) * 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- Koiranpentu (Puppy) 🐶🍼 ---
  function puppy(ctx, r, swing, e) {
    groundShadow(ctx, r * 1.0);
    const pType = (e && e.puppyType) ? e.puppyType : 'lumi';
    
    // Väriteemat pennuille
    const colors = {
      lumi:   { body: '#f0f4f8', mark: '#d9e2ec', ear: '#bcccdc', innerEar: '#fbb6ce', eye: '#1976d2' },
      kipina: { body: '#ff8a65', mark: '#e64a19', ear: '#bf360c', innerEar: '#ffccbc', eye: '#3e2723' },
      hilla:  { body: '#ffd54f', mark: '#ffb300', ear: '#f57f17', innerEar: '#ffe082', eye: '#4e342e' },
      salama: { body: '#37474f', mark: '#eceff1', ear: '#263238', innerEar: '#ff80ab', eye: '#00e5ff' },
      toivo:  { body: '#a5d6a7', mark: '#e8f5e9', ear: '#43a047', innerEar: '#c8e6c9', eye: '#1b5e20' }
    }[pType] || { body: '#d9e2ec', mark: '#bcccdc', ear: '#829ab1', innerEar: '#fbb6ce', eye: '#243b53' };

    // Pieni vipattava häntä takana
    const tailWag = Math.sin((e && e.animPhase ? e.animPhase : Date.now() * 0.015) * 16) * 0.6;
    ctx.save();
    ctx.translate(-r * 0.55, -r * 0.1);
    ctx.rotate(tailWag);
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = r * 0.22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-r * 0.4, -r * 0.35, -r * 0.3, -r * 0.65);
    ctx.stroke();
    // Valkea hännänpää
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = r * 0.18;
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.45);
    ctx.lineTo(-r * 0.3, -r * 0.65);
    ctx.stroke();
    ctx.restore();

    // 4 lyhyttä suloista tassua
    leg(ctx, -r * 0.35, r * 0.35, r * 0.2, r * 0.45, colors.ear, swing);
    leg(ctx, -r * 0.1,  r * 0.35, r * 0.2, r * 0.45, colors.body, -swing);
    leg(ctx,  r * 0.25, r * 0.35, r * 0.2, r * 0.45, colors.ear, -swing);
    leg(ctx,  r * 0.5,  r * 0.35, r * 0.2, r * 0.45, colors.body, swing);

    // Pyöreä pehmoinen vatsa & vartalo
    shadedEllipse(ctx, 0, 0, r * 0.72, r * 0.6, colors.body, colors.mark);
    ellipse(ctx, r * 0.1, r * 0.1, r * 0.45, r * 0.4, '#ffffff');

    // Suhteellisen suuri, hellyttävä pentupää
    const hx = r * 0.45, hy = -r * 0.45;
    shadedEllipse(ctx, hx, hy, r * 0.58, r * 0.52, colors.body, colors.mark);

    // Korvat (hieman lerpattavat hellyttävät pentukorvat)
    ear(ctx, hx - r * 0.28, hy - r * 0.38, r * 0.22, r * 0.42, -0.3, colors.ear, colors.innerEar);
    ear(ctx, hx + r * 0.15, hy - r * 0.42, r * 0.22, r * 0.42, 0.25, colors.ear, colors.innerEar);

    // Naaman valkeat merkit
    ellipse(ctx, hx + r * 0.2, hy + r * 0.12, r * 0.3, r * 0.22, '#ffffff');

    // Pieni musta kirsu
    ellipse(ctx, hx + r * 0.35, hy + r * 0.08, r * 0.09, r * 0.07, '#1a1a24');

    // Suuret sädehtivät pennunsilmät
    eye(ctx, hx + r * 0.02, hy - r * 0.08, r * 0.13, colors.eye);
    eye(ctx, hx + r * 0.24, hy - r * 0.08, r * 0.13, colors.eye);
    ellipse(ctx, hx + r * 0.05, hy - r * 0.12, r * 0.05, r * 0.05, '#ffffff'); // iso kiilto
    ellipse(ctx, hx + r * 0.27, hy - r * 0.12, r * 0.05, r * 0.05, '#ffffff');
    ellipse(ctx, hx - r * 0.01, hy - r * 0.05, r * 0.025, r * 0.025, '#ffffff'); // pikkukiilto

    // Pieni iloinen kieli ulkona
    ctx.fillStyle = '#ff80ab';
    ctx.beginPath();
    ctx.arc(hx + r * 0.28, hy + r * 0.22, r * 0.07, 0, Math.PI);
    ctx.fill();
  }

    // --- Galápagoksen Jättiläiskilpikonna (Giant Tortoise) 🐢 ---
  function giant_tortoise(ctx, r, swing, e) {
    // Varjo
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.45, r * 1.25, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const isRetracted = e && e.fleeing;
    const tuck = isRetracted ? 0.4 : 1.0;

    // 4 järeää pilarimaista jalkaa kynsillä
    const legSwing = isRetracted ? 0 : Math.sin(swing * 2) * 0.18;
    const legColor = '#4a5340';
    
    // Takajalat
    ctx.save();
    ctx.translate(-r * 0.55, r * 0.35);
    ctx.rotate(-legSwing * tuck);
    ctx.fillStyle = legColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.28 * tuck, r * 0.32 * tuck, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(-r * 0.25, r * 0.45);
    ctx.rotate(legSwing * tuck);
    ctx.fillStyle = legColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.26 * tuck, r * 0.30 * tuck, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Etujalat
    ctx.save();
    ctx.translate(r * 0.45, r * 0.38);
    ctx.rotate(legSwing * tuck);
    ctx.fillStyle = legColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.30 * tuck, r * 0.35 * tuck, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(r * 0.2, r * 0.48);
    ctx.rotate(-legSwing * tuck);
    ctx.fillStyle = legColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.28 * tuck, r * 0.32 * tuck, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pieni tynkähäntä
    ctx.fillStyle = legColor;
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, r * 0.05);
    ctx.lineTo(-r * 1.15 * tuck, r * 0.15);
    ctx.lineTo(-r * 0.85, r * 0.25);
    ctx.closePath();
    ctx.fill();

    // Kilpi (Carapace) - Massiivinen kupolimainen kilpi rengaskuvioineen
    const shellGrad = ctx.createRadialGradient(-r * 0.1, -r * 0.3, r * 0.2, 0, 0, r * 1.1);
    shellGrad.addColorStop(0, '#5a4632');
    shellGrad.addColorStop(0.5, '#3e2e1e');
    shellGrad.addColorStop(1, '#261b11');
    ctx.fillStyle = shellGrad;
    ctx.strokeStyle = '#1e140b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.05, r * 1.05, r * 0.82, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Kilven kuviot (suomut/laatat)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.22)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(-r * 0.05, -r * 0.18, r * 0.42, r * 0.32, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(r * 0.45, -r * 0.08, r * 0.32, r * 0.28, 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-r * 0.52, -r * 0.05, r * 0.32, r * 0.28, -0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Sammallaikku kilvellä
    ctx.fillStyle = 'rgba(76, 175, 80, 0.35)';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.35, r * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Kaula ja viisas vanha pää
    const headExt = isRetracted ? 0.3 : 1.0;
    const hx = r * 0.75 + (isRetracted ? 0 : r * 0.35);
    const hy = -r * 0.05 - (isRetracted ? 0 : r * 0.25);

    ctx.fillStyle = '#4a5340';
    ctx.beginPath();
    ctx.ellipse(r * 0.65, r * 0.05, r * 0.28 * headExt, r * 0.22, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(hx, hy, r * 0.36 * headExt, r * 0.26 * headExt, 0.15, 0, Math.PI * 2);
    ctx.fill();

    if (!isRetracted) {
      ctx.strokeStyle = '#272d20';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hx + r * 0.15, hy + r * 0.1);
      ctx.lineTo(hx + r * 0.32, hy + r * 0.06);
      ctx.stroke();

      ctx.fillStyle = '#1c1b18';
      ctx.beginPath();
      ctx.arc(hx + r * 0.12, hy - r * 0.08, r * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(hx + r * 0.14, hy - r * 0.1, r * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Galápagoksen Merileguaani (Marine Iguana) 🦎 ---
  function marine_iguana(ctx, r, swing, e) {
    // Varjo
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.35, r * 1.1, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Aaltoileva uimahäntä
    const tailWave = Math.sin(swing * 3) * 0.35;
    ctx.save();
    ctx.translate(-r * 0.6, r * 0.05);
    ctx.rotate(tailWave);
    ctx.fillStyle = '#1b2a24';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.18);
    ctx.quadraticCurveTo(-r * 0.7, r * 0.05, -r * 1.35, r * 0.2);
    ctx.quadraticCurveTo(-r * 0.65, r * 0.28, 0, r * 0.18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00e5ff';
    for (let i = 0; i < 4; i++) {
      const tx = -r * 0.3 * (i + 1);
      ctx.beginPath();
      ctx.arc(tx, -r * 0.08 + i * 0.05 * r, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4 raajaa kynsillä
    const legSwing = Math.sin(swing * 2.5) * 0.25;
    ctx.fillStyle = '#1f332b';
    ctx.save();
    ctx.translate(-r * 0.35, r * 0.25);
    ctx.rotate(-legSwing);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.18, r * 0.25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(r * 0.38, r * 0.28);
    ctx.rotate(legSwing);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.18, r * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Keho
    const bodyGrad = ctx.createLinearGradient(0, -r * 0.4, 0, r * 0.4);
    bodyGrad.addColorStop(0, '#273b32');
    bodyGrad.addColorStop(0.5, '#192b23');
    bodyGrad.addColorStop(1, '#0e1814');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.78, r * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Selkäpiikit (Dorsal crest)
    ctx.fillStyle = '#4ade80';
    for (let i = -3; i <= 3; i++) {
      const px = i * r * 0.18;
      const py = -r * 0.38;
      ctx.beginPath();
      ctx.moveTo(px - r * 0.05, py + r * 0.08);
      ctx.lineTo(px, py - r * 0.15);
      ctx.lineTo(px + r * 0.05, py + r * 0.08);
      ctx.closePath();
      ctx.fill();
    }

    // Pää ja kuono
    const hx = r * 0.65;
    const hy = -r * 0.15;
    ctx.fillStyle = '#22382e';
    ctx.beginPath();
    ctx.ellipse(hx, hy, r * 0.36, r * 0.28, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Pään suomut
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(hx - r * 0.08, hy - r * 0.24, 2.5, 0, Math.PI * 2);
    ctx.arc(hx + r * 0.05, hy - r * 0.26, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Silmä
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(hx + r * 0.05, hy - r * 0.08, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(hx + r * 0.06, hy - r * 0.08, r * 0.045, 0, Math.PI * 2);
    ctx.fill();

    // Suolapärske sieraimista
    if (Math.sin(swing * 4) > 0.65) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(hx + r * 0.38, hy - r * 0.05, 1.8, 0, Math.PI * 2);
      ctx.arc(hx + r * 0.44, hy - r * 0.12, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

    // --- Intian Aasiannorsu (Asian Elephant) 🐘 ---
  function elephant(ctx, r, swing, e) {
    // Varjo
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.55, r * 1.35, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const legSwing = Math.sin(swing * 2) * 0.2;
    const legCol = '#6b7280';
    const nailCol = '#e5e7eb';
    
    // Takajalat
    for (let i = -1; i <= 1; i += 2) {
      ctx.save();
      const lx = (i === -1 ? -r * 0.65 : -r * 0.3);
      ctx.translate(lx, r * 0.38);
      ctx.rotate(i * legSwing);
      ctx.fillStyle = legCol;
      ctx.beginPath();
      ctx.rect(-r * 0.16, -r * 0.1, r * 0.32, r * 0.52);
      ctx.fill();
      ctx.fillStyle = nailCol;
      ctx.beginPath();
      ctx.arc(-r * 0.08, r * 0.38, 2.5, 0, Math.PI * 2);
      ctx.arc(0, r * 0.4, 2.5, 0, Math.PI * 2);
      ctx.arc(r * 0.08, r * 0.38, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Etujalat
    for (let i = -1; i <= 1; i += 2) {
      ctx.save();
      const lx = (i === -1 ? r * 0.25 : r * 0.55);
      ctx.translate(lx, r * 0.38);
      ctx.rotate(-i * legSwing);
      ctx.fillStyle = legCol;
      ctx.beginPath();
      ctx.rect(-r * 0.16, -r * 0.1, r * 0.32, r * 0.52);
      ctx.fill();
      ctx.fillStyle = nailCol;
      ctx.beginPath();
      ctx.arc(-r * 0.08, r * 0.38, 2.5, 0, Math.PI * 2);
      ctx.arc(0, r * 0.4, 2.5, 0, Math.PI * 2);
      ctx.arc(r * 0.08, r * 0.38, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Häntä
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, -r * 0.05);
    ctx.quadraticCurveTo(-r * 1.15, r * 0.1, -r * 1.1, r * 0.38);
    ctx.stroke();
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(-r * 1.1, r * 0.4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Keho
    const bodyGrad = ctx.createRadialGradient(-r * 0.1, -r * 0.2, r * 0.2, 0, 0, r * 1.1);
    bodyGrad.addColorStop(0, '#9ca3af');
    bodyGrad.addColorStop(0.6, '#6b7280');
    bodyGrad.addColorStop(1, '#4b5563');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.05, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();

    // Korva
    const earFlap = Math.sin(swing * 2.5) * 0.12;
    ctx.save();
    ctx.translate(r * 0.4, -r * 0.2);
    ctx.rotate(earFlap);
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.38, r * 0.55, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(-r * 0.02, 0, r * 0.22, r * 0.38, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pää
    const hx = r * 0.75, hy = -r * 0.12;
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.ellipse(hx, hy, r * 0.48, r * 0.44, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Syöksyhammas
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.18, hy + r * 0.18);
    ctx.quadraticCurveTo(hx + r * 0.48, hy + r * 0.35, hx + r * 0.62, hy + r * 0.15);
    ctx.quadraticCurveTo(hx + r * 0.44, hy + r * 0.22, hx + r * 0.15, hy + r * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Kärsä
    const trunkWave = Math.sin(swing * 2) * 0.2;
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = r * 0.28;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.22, hy + r * 0.15);
    ctx.quadraticCurveTo(hx + r * 0.45 + trunkWave * 15, hy + r * 0.45, hx + r * 0.65, hy + r * 0.7 + trunkWave * 20);
    ctx.stroke();

    // Kärsän pää
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(hx + r * 0.65, hy + r * 0.7 + trunkWave * 20, r * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Vesisuihku
    if (Math.sin(swing * 3.5) > 0.6) {
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(hx + r * 0.75 + i * 5, hy + r * 0.68 - i * 6 + trunkWave * 20, 2 + i * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Silmä
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(hx + r * 0.1, hy - r * 0.1, r * 0.065, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(hx + r * 0.12, hy - r * 0.12, r * 0.025, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Intian Kuningasriikinkukko (Indian Peacock) 🦚 ---
  function peacock(ctx, r, swing, e) {
    // Varjo
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.4, r * 1.0, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pyrstöviuhka
    const fanPulse = 0.95 + 0.08 * Math.sin(swing * 3);
    const numFeathers = 9;
    ctx.save();
    ctx.translate(-r * 0.3, -r * 0.1);
    for (let i = 0; i < numFeathers; i++) {
      const angle = -Math.PI * 0.75 + (i / (numFeathers - 1)) * Math.PI * 0.9;
      const fLen = r * 1.35 * fanPulse;
      const fx = Math.cos(angle) * fLen;
      const fy = Math.sin(angle) * fLen;

      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(fx, fy);
      ctx.stroke();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(fx, fy, r * 0.22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(fx, fy, r * 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(fx, fy, r * 0.08, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.arc(fx + 1, fy - 1, r * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Jalat
    const legSwing = Math.sin(swing * 3) * 0.25;
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, r * 0.2);
    ctx.lineTo(-r * 0.1 + legSwing * 10, r * 0.6);
    ctx.moveTo(r * 0.15, r * 0.2);
    ctx.lineTo(r * 0.15 - legSwing * 10, r * 0.6);
    ctx.stroke();

    // Keho
    const bodyGrad = ctx.createLinearGradient(0, -r * 0.3, 0, r * 0.3);
    bodyGrad.addColorStop(0, '#0284c7');
    bodyGrad.addColorStop(0.6, '#0369a1');
    bodyGrad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.45, r * 0.32, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Kaula ja pää
    const hx = r * 0.38, hy = -r * 0.42;
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = r * 0.26;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(r * 0.1, -r * 0.1);
    ctx.quadraticCurveTo(r * 0.22, -r * 0.28, hx, hy);
    ctx.stroke();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(hx, hy, r * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Kruunu
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    for (let c = -1; c <= 1; c++) {
      const cx = hx + c * 3;
      const cy = hy - r * 0.32;
      ctx.beginPath();
      ctx.moveTo(hx, hy - r * 0.15);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nokka
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.15, hy - r * 0.05);
    ctx.lineTo(hx + r * 0.38, hy + r * 0.02);
    ctx.lineTo(hx + r * 0.14, hy + r * 0.1);
    ctx.closePath();
    ctx.fill();

    // Silmä
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(hx + r * 0.06, hy - r * 0.06, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(hx + r * 0.07, hy - r * 0.07, r * 0.02, 0, Math.PI * 2);
    ctx.fill();
  }

  const drawers = { husky, rabbit, mouse, squirrel, golden_squirrel: squirrel, hedgehog, bear, wolf, bird, fox, lynx, eagle, deer, beaver, bat, owl, yeti, scorpion, crocodile, panther, monkey, mountain_goat, campfire, leafpile, chest, spikes, portal, coconut_crab, seagull, shark, weasel, spider, kangaroo, highland_cow, nessie, puppy, giant_tortoise, marine_iguana, elephant, peacock };


  function drawHat(ctx, r, hatId) {
    const hx = r * 0.95;
    const hy = -r * 0.72; // hieman pään yläpuolella
    
    ctx.save();
    ctx.translate(hx, hy);
    
    if (hatId === 'christmas') {
      // Joulupukin tonttulakki: punainen kolmio ja valkoinen pallo + valkoinen reunus
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.55, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ff3333';
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, -r * 0.05);
      ctx.lineTo(r * 0.45, -r * 0.05);
      ctx.quadraticCurveTo(-r * 0.1, -r * 0.8, -r * 0.5, -r * 0.7);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-r * 0.52, -r * 0.7, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (hatId === 'detective') {
      // Sherlock-etsivähattu: ruskea kupu ja lierit
      ctx.fillStyle = '#8a6a4d';
      ctx.strokeStyle = '#5a422d';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.7, r * 0.15, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r * 0.45, Math.PI, 0);
      ctx.fill(); ctx.stroke();
      
      ctx.fillStyle = '#3a2b1f';
      ctx.fillRect(-r * 0.42, -r * 0.15, r * 0.84, r * 0.12);
      
    } else if (hatId === 'fedora') {
      ctx.fillStyle = '#212121';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 4, r * 0.72, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.rect(-r * 0.38, -r * 0.44, r * 0.76, r * 0.44);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(-r * 0.38, 0, r * 0.76, 4);

    } else if (hatId === 'bow') {
      ctx.fillStyle = '#ff1744';
      ctx.strokeStyle = '#b71c1c';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(-1, 0);
      ctx.lineTo(-r * 0.45, -r * 0.22);
      ctx.lineTo(-r * 0.45, r * 0.22);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1, 0);
      ctx.lineTo(r * 0.45, -r * 0.22);
      ctx.lineTo(r * 0.45, r * 0.22);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
      ctx.fill();

    } else if (hatId === 'crown') {
      // Kuninkaan kultainen kruunu
      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.moveTo(-r * 0.4, 0);
      ctx.lineTo(r * 0.4, 0);
      ctx.lineTo(r * 0.45, -r * 0.45);
      ctx.lineTo(r * 0.2, -r * 0.25);
      ctx.lineTo(0, -r * 0.55);
      ctx.lineTo(-r * 0.2, -r * 0.25);
      ctx.lineTo(-r * 0.45, -r * 0.45);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      
      ctx.fillStyle = '#ff2b55';
      ctx.beginPath(); ctx.arc(0, -r * 0.55, r * 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2b7fff';
      ctx.beginPath(); ctx.arc(-r * 0.45, -r * 0.45, r * 0.06, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(r * 0.45, -r * 0.45, r * 0.06, 0, Math.PI * 2); ctx.fill();
      
    } else if (hatId === 'glasses') {
      // Siistit aurinkolasit silmille
      ctx.translate(r * 0.25, r * 0.46);
      ctx.fillStyle = '#1a1a1a';
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.ellipse(-r * 0.2, 0, r * 0.22, r * 0.16, 0, 0, Math.PI * 2);
      ctx.ellipse(r * 0.2, 0, r * 0.22, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(-r * 0.42, -r * 0.06);
      ctx.lineTo(r * 0.42, -r * 0.06);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function draw(ctx, e) {
    const fn = drawers[e.kind];
    if (!fn) return;
    const swing = e.moving ? Math.sin(e.animPhase) * 0.5 : 0;
    const bob = e.moving ? Math.sin(e.animPhase * 2) * 1.2 : 0;
    ctx.save();
    
    if (e.kind === 'eagle') {
      ctx.translate(e.x, e.y);
      const shadowScale = Math.max(0.2, 1 - (e.heightOffset || 0) / 95);
      ctx.save();
      ctx.scale(shadowScale, shadowScale);
      groundShadow(ctx, e.radius);
      ctx.restore();
      ctx.translate(0, -(e.heightOffset || 0));
    } else {
      ctx.translate(e.x, e.y + bob);
    }
    
    if (e.flip < 0) ctx.scale(-1, 1);
    if (e.scale) ctx.scale(e.scale, e.scale);

    if (e.elite) {
      ctx.save();
      const glowGrad = ctx.createRadialGradient(0, 0, e.radius * 0.4, 0, 0, e.radius * 2.2);
      const auraColor = e.eliteColor || '#ffd700';
      glowGrad.addColorStop(0, auraColor + '55');
      glowGrad.addColorStop(0.5, auraColor + '22');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, e.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨', 0, -e.radius * 1.4);
      ctx.restore();
    }

    fn(ctx, e.radius, swing, e);

    if (e.kind === 'husky' && e.hat && e.hat !== 'none') {
      drawHat(ctx, e.radius, e.hat);
    }

    ctx.restore();
  }

  // --- Keräiltävä luu (ja kultainen luu) ---
  function drawBone(ctx, x, y, r, gold, bob) {
    ctx.save();
    ctx.translate(x, y + bob);
    if (gold) {
      // Kultainen hehku
      ctx.shadowColor = 'rgba(255,210,80,0.9)';
      ctx.shadowBlur = 14;
    }
    const g = ctx.createLinearGradient(0, -r, 0, r);
    if (gold) { g.addColorStop(0, '#ffe680'); g.addColorStop(1, '#e0a020'); }
    else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d8d2c4'); }
    ctx.fillStyle = g;
    ctx.strokeStyle = gold ? '#a6730c' : '#b8b0a0';
    ctx.lineWidth = 1.5;
    // Varsi
    const len = r * 1.4, w = r * 0.5;
    roundRect(ctx, -len / 2, -w / 2, len, w, w / 2);
    ctx.fill(); ctx.stroke();
    // Päiden nystyt
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(sx * len / 2, sy * r * 0.42, r * 0.42, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      }
    }
    ctx.restore();
  }

  return { draw, drawBone };
})();
