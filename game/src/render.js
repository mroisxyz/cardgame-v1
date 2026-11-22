// render.js — draws the felt table, every card and its motion, then the overlays in one frame.
(function (L) {
  'use strict';
  const D = L.draw, Q = D.LAYOUT;
  let canvas = null, ctx = null;
  const views = new Map();
  let handRects = [];

  function init(cv) {
    canvas = cv;
    ctx = cv.getContext('2d');
    resize();
    addEventListener('resize', resize);
  }
  function resize() {
    if (!canvas) return;
    const scale = Math.min(innerWidth / Q.W, innerHeight / Q.H);
    canvas.style.width = (Q.W * scale) + 'px';
    canvas.style.height = (Q.H * scale) + 'px';
  }
  function resetViews() { views.clear(); }

  function background() {
    ctx.fillStyle = '#070b10';
    ctx.fillRect(0, 0, Q.W, Q.H);
    D.glow(ctx, 640, 420, 540, 'rgba(28,58,62,.66)');
    D.glow(ctx, 640, 460, 280, 'rgba(120,86,42,.20)');
    ctx.strokeStyle = 'rgba(130,190,175,.045)';
    ctx.lineWidth = 1;
    for (let x = 0; x < Q.W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Q.H); ctx.stroke();
    }
    for (let y = 0; y < Q.H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Q.W, y); ctx.stroke();
    }
    ctx.beginPath();
    ctx.ellipse(640, 430, 566, 306, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(190,220,200,.11)';
    ctx.lineWidth = 2; ctx.stroke();
    const g = ctx.createRadialGradient(640, 400, 260, 640, 400, 780);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(2,4,7,.86)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, Q.W, Q.H);
  }

  function deckPile() {
    for (let i = 3; i >= 0; i--) {
      D.panel(ctx, Q.deckX - i * 2, Q.deckY - i * 2, Q.handW * 0.7, Q.handH * 0.85,
        'rgba(24,40,50,.95)', '#3d5566', 10);
    }
    D.txt(ctx, 'DECK', Q.deckX + Q.handW * 0.35, Q.deckY - 12, 'bold 12px system-ui', '#6f8a90', 'center');
    D.txt(ctx, '✦', Q.deckX + Q.handW * 0.35, Q.deckY + Q.handH * 0.52, '40px serif', '#5f7f8c', 'center');
  }

  function card(c, x, y, w, h, face, o) {
    o = o || {};
    const suit = L.cardData.suit(c.suit);
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(o.rot || 0);
    ctx.scale(Math.max(0.02, Math.abs(2 * face - 1)) * (o.scale || 1), o.scale || 1);
    ctx.translate(-w / 2, -h / 2);
    ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.62)';
    ctx.shadowBlur = o.hi ? 28 : 16;
    ctx.shadowOffsetY = 8;
    D.rr(ctx, 0, 0, w, h, 12);
    ctx.fillStyle = face >= 0.5 ? '#f4f0e4' : '#1b2b39';
    ctx.fill();
    ctx.restore();

    D.rr(ctx, 0, 0, w, h, 12);
    ctx.lineWidth = o.hi ? 4 : 2.5;
    ctx.strokeStyle = o.hi ? '#ffd479' : (face >= 0.5 ? suit.color : '#3d5566');
    ctx.stroke();

    if (face >= 0.5) {
      D.rr(ctx, 5, 5, w - 10, h - 10, 9);
      ctx.fillStyle = suit.soft; ctx.fill();
      D.txt(ctx, String(c.value), 13, h * 0.27, 'bold ' + Math.round(w * 0.28) + 'px Georgia', '#191419');
      D.txt(ctx, suit.shape, w / 2, h * 0.56, Math.round(w * 0.40) + 'px serif', suit.color, 'center');
      D.txt(ctx, suit.name.toUpperCase(), w / 2, h - 15,
        'bold ' + Math.round(w * 0.095) + 'px system-ui', suit.color, 'center');
      const r = Math.max(9, w * 0.11);
      ctx.beginPath(); ctx.arc(w - r - 6, h - r - 6, r, 0, Math.PI * 2);
      ctx.fillStyle = '#1b2b39'; ctx.fill();
      D.txt(ctx, String(c.cost), w - r - 6, h - 3,
        'bold ' + Math.round(r * 1.15) + 'px system-ui', '#ffd479', 'center');
    } else {
      ctx.save();
      D.rr(ctx, 6, 6, w - 12, h - 12, 8); ctx.clip();
      ctx.strokeStyle = 'rgba(127,214,200,.10)';
      ctx.lineWidth = 1;
      for (let i = -h; i < w; i += 12) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke();
      }
      ctx.restore();
      D.txt(ctx, '✦', w / 2, h / 2 + Math.round(w * 0.13), Math.round(w * 0.36) + 'px serif', '#5f7f8c', 'center');
    }
    ctx.restore();
  }

  function handPos(i, n) {
    return {
      x: Q.handCX - (n - 1) * Q.handGap / 2 + i * Q.handGap - Q.handW / 2,
      y: Q.handY + Math.abs(i - (n - 1) / 2) * 6
    };
  }

  function view(c, x, y) {
    let v = views.get(c.uid);
    if (!v) {
      v = {
        x: Q.deckX + 20, y: Q.deckY - 30, rot: -0.1, scale: 0.9, face: 0, alpha: 0,
        tx: x, ty: y, trot: 0, tscale: 1, tface: 1
      };
      views.set(c.uid, v);
    }
    return v;
  }
  function move(v, k, dt) {
    v.x += (v.tx - v.x) * k;
    v.y += (v.ty - v.y) * k;
    v.rot += (v.trot - v.rot) * k;
    v.scale += (v.tscale - v.scale) * k;
    v.face += (v.tface - v.face) * k;
    v.alpha = Math.min(1, v.alpha + dt / 220);
  }

  function step(s, dt) {
    const k = 1 - Math.exp(-dt / 85);
    const active = new Set();
    s.hand.forEach(function (c, i) {
      active.add(c.uid);
      const p = handPos(i, s.hand.length);
      const sel = s.selection.indexOf(i) >= 0;
      const v = view(c, p.x, p.y);
      v.tx = p.x; v.ty = p.y - (sel ? 28 : 0);
      v.trot = (i - (s.hand.length - 1) / 2) * 0.035;
      v.tscale = sel ? 1.06 : 1;
      v.tface = 1;
      move(v, k, dt);
    });
    s.foeHand.forEach(function (c, i) {
      active.add(c.uid);
      const x = Q.foeCX - (s.foeHand.length - 1) * Q.foeGap / 2 + i * Q.foeGap - Q.foeW / 2;
      const v = view(c, x, Q.foeY);
      v.tx = x; v.ty = Q.foeY; v.trot = 0; v.tscale = 1; v.tface = 0;
      move(v, k, dt);
    });
    if (s.played) s.played.forEach(function (c, i) {
      active.add(c.uid);
      const x = Q.playerX + i * 16, y = Q.arenaY + i * 8;
      const v = view(c, x, y);
      v.tx = x; v.ty = y; v.trot = (i - 1) * 0.05; v.tscale = 1; v.tface = 1;
      move(v, k, dt);
    });
    if (s.foePlayed) {
      const c = s.foePlayed;
      active.add(c.uid);
      const v = view(c, Q.foeX, Q.arenaY);
      v.tx = Q.foeX; v.ty = Q.arenaY; v.trot = 0; v.tscale = 1; v.tface = 1;
      move(v, k, dt);
    }
    for (const uid of Array.from(views.keys())) if (!active.has(uid)) views.delete(uid);
  }

  function comboOf(s) {
    const picked = s.selection.map(function (i) { return s.hand[i]; }).filter(Boolean);
    return L.evaluator.withBoost(L.evaluator.analyze(picked), s.boosts, s.light);
  }

  function button(ctx, r, label, sub, color, enabled) {
    D.panel(ctx, r.x, r.y, r.w, r.h,
      enabled ? 'rgba(24,42,44,.96)' : 'rgba(18,24,28,.9)', color, 10);
    D.txt(ctx, label, r.x + r.w / 2, r.y + (sub ? 31 : r.h / 2 + 8),
      'bold 20px Georgia', enabled ? color : '#5c6a6e', 'center');
    if (sub) D.txt(ctx, sub, r.x + r.w / 2, r.y + r.h - 11, '12px system-ui', '#93a8ac', 'center');
  }

  function buttons(s) {
    const combo = comboOf(s);
    const ready = combo.valid && combo.affordable && !s.played;
    button(ctx, Q.commit, 'COMMIT', ready ? 'ENTER · ' + combo.cost + ' light' : 'ENTER',
      ready ? '#ffd479' : '#5f7479', ready);
    const bok = combo.valid && !s.played && s.light > combo.cost;
    button(ctx, Q.boost, 'BOOST +3', 'B · ' + s.boosts + '/2 charges',
      bok ? '#7fd6c8' : '#5f7479', bok);
  }

  function effects() {
    for (const e of L.animation.effects) {
      const p = Math.min(1, e.t / e.dur);
      if (e.kind === 'float') {
        ctx.globalAlpha = 1 - p;
        D.txt(ctx, e.text, e.x, e.y - p * 46, 'bold 26px Georgia', e.color, 'center');
        ctx.globalAlpha = 1;
      } else if (e.kind === 'confetti') {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (1 - p) * 2);
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rot);
        ctx.fillStyle = e.color;
        ctx.fillRect(-e.size / 2, -e.size / 2, e.size, e.size * 0.6);
        ctx.restore();
      }
    }
  }

  function frame(s, dt) {
    if (!ctx) return;
    ctx.save();
    const sh = L.animation.shakeOffset();
    ctx.translate(sh.x, sh.y);
    background();

    if (s.screen === 'title') {
      L.screens.title(ctx);
      effects();
      ctx.restore();
      return;
    }

    step(s, dt);
    deckPile();

    s.foeHand.forEach(function (c) {
      const v = views.get(c.uid);
      if (v) card(c, v.x, v.y, Q.foeW, Q.foeH, v.face, v);
    });
    if (s.played) s.played.forEach(function (c) {
      const v = views.get(c.uid);
      if (v) card(c, v.x, v.y, Q.arenaW, Q.arenaH, v.face, v);
    });
    if (s.foePlayed) {
      const v = views.get(s.foePlayed.uid);
      if (v) card(s.foePlayed, v.x, v.y, Q.arenaW, Q.arenaH, v.face, v);
    }

    handRects = [];
    s.hand.forEach(function (c, i) {
      const v = views.get(c.uid);
      const p = handPos(i, s.hand.length);
      const sel = s.selection.indexOf(i) >= 0;
      if (v) card(c, v.x, v.y, Q.handW, Q.handH, v.face, Object.assign({}, v, { hi: sel }));
      handRects.push({ x: p.x, y: p.y - (sel ? 28 : 0), w: Q.handW, h: Q.handH });
    });

    L.hud.top(ctx, s);
    L.hud.intent(ctx, s);
    L.hud.arena(ctx, s);
    L.hud.handInfo(ctx, s, comboOf(s));
    buttons(s);

    if (s.screen === 'win' || s.screen === 'loss') {
      ctx.fillStyle = 'rgba(3,6,9,.78)';
      ctx.fillRect(0, 0, Q.W, Q.H);
      if (s.screen === 'win') L.screens.win(ctx, s);
      else L.screens.loss(ctx, s);
    }
    effects();
    ctx.restore();
  }

  L.render = {
    init, resize, resetViews, frame, comboOf,
    get handRects() { return handRects; }
  };
})(globalThis.Lantern = globalThis.Lantern || {});
