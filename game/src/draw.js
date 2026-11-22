// draw.js — the small canvas vocabulary every other module shares: shapes, text, glow and the fixed table layout.
(function (L) {
  'use strict';

  const LAYOUT = {
    W: 1280, H: 800,
    handY: 620, handW: 132, handH: 170, handGap: 86, handCX: 610,
    foeY: 176, foeW: 72, foeH: 96, foeGap: 80, foeCX: 640,
    arenaY: 322, arenaW: 120, arenaH: 160, playerX: 462, foeX: 698,
    deckX: 54, deckY: 636,
    commit: { x: 1000, y: 642, w: 196, h: 58 },
    boost: { x: 1000, y: 712, w: 196, h: 48 },
  };

  function rr(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function txt(ctx, s, x, y, font, color, align) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(String(s), x, y);
  }

  function glow(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function panel(ctx, x, y, w, h, fill, stroke, r) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.55)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    rr(ctx, x, y, w, h, r === undefined ? 12 : r);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
    rr(ctx, x, y, w, h, r === undefined ? 12 : r);
    ctx.lineWidth = 2;
    ctx.strokeStyle = stroke || 'rgba(180,210,200,.25)';
    ctx.stroke();
  }

  L.draw = { LAYOUT, rr, txt, glow, panel };
})(globalThis.Lantern = globalThis.Lantern || {});
