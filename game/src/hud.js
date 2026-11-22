// hud.js — the in-match information layer: lamps, light, the foe's telegraph and the combo readout.
(function (L) {
  'use strict';
  const D = L.draw, Q = D.LAYOUT;

  function lamps(ctx, x, y, w, value, max, color, align) {
    const bx = align === 'right' ? x - w : x;
    D.txt(ctx, value + ' / ' + max, x, y - 9, 'bold 15px system-ui', color, align);
    D.rr(ctx, bx, y, w, 9, 5);
    ctx.fillStyle = 'rgba(255,255,255,.09)'; ctx.fill();
    D.rr(ctx, bx, y, Math.max(0, w * value / max), 9, 5);
    ctx.fillStyle = color; ctx.fill();
  }

  function top(ctx, s) {
    ctx.fillStyle = 'rgba(8,14,20,.93)'; ctx.fillRect(0, 0, Q.W, 64);
    ctx.fillStyle = 'rgba(127,214,200,.35)'; ctx.fillRect(0, 63, Q.W, 1);
    D.txt(ctx, '▲ LANTERN LEDGER', 24, 41, 'bold 22px Georgia', '#f4f0e4');
    D.txt(ctx, 'ROUND ' + s.round, 640, 40, 'bold 20px Georgia', '#ffd479', 'center');

    D.txt(ctx, 'LIGHT', 1256, 24, 'bold 12px system-ui', '#7fd6c8', 'right');
    for (let i = 0; i < s.lightMax; i++) {
      const x = 1256 - (s.lightMax - i) * 17 + 8;
      ctx.beginPath(); ctx.arc(x, 43, 6, 0, Math.PI * 2);
      ctx.fillStyle = i < s.light ? '#ffd479' : 'rgba(255,212,121,.18)'; ctx.fill();
    }
    D.txt(ctx, String(s.light), 1256 - s.lightMax * 17 - 8, 48, 'bold 18px system-ui', '#ffd479', 'right');

    D.txt(ctx, 'YOUR LAMPS', 24, 81, 'bold 11px system-ui', '#c98a72');
    lamps(ctx, 24, 88, 220, s.life, 5, '#e0613c', 'left');
    D.txt(ctx, 'FOE LAMPS', 1256, 81, 'bold 11px system-ui', '#7bb7c9', 'right');
    lamps(ctx, 1256, 88, 220, s.foeLife, 5, '#3aa6c4', 'right');
  }

  function intent(ctx, s) {
    const f = s.intent;
    if (!f) return;
    const suit = L.cardData.suit(f.suit);
    D.panel(ctx, 380, 102, 520, 64, 'rgba(12,24,30,.93)', suit.color, 10);
    D.txt(ctx, 'FOE INTENT', 398, 128, 'bold 12px system-ui', '#8fa8ae');
    D.txt(ctx, L.cardData.label(f.card) + '  →  ' + f.power + ' power', 398, 153, 'bold 21px Georgia', '#f4f0e4');
    D.txt(ctx, f.tell, 882, 126, 'italic 12px Georgia', '#b8c8c8', 'right');
    D.txt(ctx, f.hint, 882, 152, 'bold 12px system-ui', suit.color, 'right');
  }

  function arena(ctx, s) {
    if (!s.played) return;
    D.txt(ctx, 'YOUR PLAY', Q.playerX + Q.arenaW / 2, 306, 'bold 14px system-ui', '#f4f0e4', 'center');
    D.txt(ctx, 'FOE PLAY', Q.foeX + Q.arenaW / 2, 306, 'bold 14px system-ui', '#f4f0e4', 'center');
    if (!s.result) return;
    const r = s.result;
    D.txt(ctx, String(r.power), Q.playerX + Q.arenaW / 2, 500, 'bold 30px Georgia', r.outcome === 'win' ? '#ffd479' : '#f4f0e4', 'center');
    D.txt(ctx, String(r.foePower), Q.foeX + Q.arenaW / 2, 500, 'bold 30px Georgia', '#3aa6c4', 'center');
    D.panel(ctx, 400, 508, 480, 54, 'rgba(10,20,26,.94)', r.outcome === 'win' ? '#ffd479' : r.outcome === 'loss' ? '#e0613c' : '#7fd6c8', 10);
    D.txt(ctx, r.headline, 640, 534, 'bold 20px Georgia', '#f4f0e4', 'center');
    D.txt(ctx, r.note, 640, 553, '12px system-ui', '#a9bcbf', 'center');
  }

  function handInfo(ctx, s, combo) {
    if (combo && combo.valid) {
      const col = combo.affordable ? '#f4f0e4' : '#e0613c';
      D.txt(ctx, combo.title + '   ·   ' + combo.power + ' power   ·   ' + combo.cost + ' light',
        640, 586, 'bold 17px Georgia', col, 'center');
    }
    if (s.prompt) D.txt(ctx, s.prompt, 640, 607, 'bold 14px system-ui', '#ffd479', 'center');
    else if (!combo || !combo.valid) {
      D.txt(ctx, '1-5 pick cards   ·   B boost   ·   ENTER commit   ·   H best play',
        640, 607, '13px system-ui', '#8298a0', 'center');
    }
  }

  L.hud = { top, intent, arena, handInfo };
})(globalThis.Lantern = globalThis.Lantern || {});
