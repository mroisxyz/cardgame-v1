// input.js — turns keys and pointer clicks into the four controller actions.
(function (L) {
  'use strict';

  function inRect(p, r) {
    return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  }

  function attach(canvas, game) {
    function point(e) {
      const r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) * (L.draw.LAYOUT.W / r.width),
        y: (e.clientY - r.top) * (L.draw.LAYOUT.H / r.height)
      };
    }

    canvas.addEventListener('pointerdown', function (e) {
      const p = point(e);
      const s = game.state;
      if (s.screen !== 'play') { game.start(); return; }
      const rects = L.render.handRects;
      for (let i = 0; i < rects.length; i++) {
        if (inRect(p, rects[i])) { game.toggle(i); return; }
      }
      if (inRect(p, L.draw.LAYOUT.commit)) { game.commit(); return; }
      if (inRect(p, L.draw.LAYOUT.boost)) { game.boost(); return; }
    });

    addEventListener('keydown', function (e) {
      const k = e.key;
      if (k >= '1' && k <= '5') { game.toggle(parseInt(k, 10) - 1); return; }
      if (k === 'b' || k === 'B') { game.boost(); return; }
      if (k === 'h' || k === 'H') { game.hint(); return; }
      if (k === 'Enter' || k === ' ') { e.preventDefault(); game.startOrCommit(); }
    });
  }

  L.input = { attach };
})(globalThis.Lantern = globalThis.Lantern || {});
