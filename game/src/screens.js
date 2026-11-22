// screens.js — the title, victory and defeat curtains that bookend a match.
(function (L) {
  'use strict';
  const D = L.draw, A = L.animation;
  const startRect = { x: 490, y: 556, w: 300, h: 60 };

  function title(ctx) {
    D.glow(ctx, 640, 330, 440, 'rgba(255,178,92,.17)');
    D.glow(ctx, 640, 430, 260, 'rgba(58,166,196,.13)');
    for (let i = 0; i < 3; i++) {
      const x = 360 + i * 280 + Math.sin(A.clock / 900 + i) * 14;
      const y = 420 + Math.cos(A.clock / 1100 + i * 2) * 10;
      const suit = L.cardData.SUITS[i];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((i - 1) * 0.12);
      D.panel(ctx, -44, -62, 88, 124, 'rgba(20,36,44,.92)', suit.color, 10);
      D.txt(ctx, suit.shape, 0, 18, '42px serif', suit.color, 'center');
      ctx.restore();
    }
    D.txt(ctx, 'LANTERN LEDGER', 640, 232, 'bold 74px Georgia', '#f4f0e4', 'center');
    D.txt(ctx, 'Keep five lamps alight against the dark.', 640, 278, '22px Georgia', '#b8c8c8', 'center');

    D.panel(ctx, 330, 314, 620, 150, 'rgba(10,20,26,.91)', 'rgba(180,210,200,.25)', 12);
    D.txt(ctx, 'A HAND IS A DECISION', 640, 346, 'bold 14px system-ui', '#ffd479', 'center');
    D.txt(ctx, 'Play a single, a matching pair, or a same-suit run.', 640, 376, '17px Georgia', '#dbe5df', 'center');
    D.txt(ctx, 'Spend light for +3 power. Break the foe suit for +4.', 640, 404, '17px Georgia', '#dbe5df', 'center');
    D.txt(ctx, 'Ember ◆  >  Grove ▲  >  Tide ●  >  Dusk ■  >  Ember',
      640, 441, 'bold 15px system-ui', '#7fd6c8', 'center');

    D.panel(ctx, startRect.x, startRect.y, startRect.w, startRect.h,
      'rgba(28,48,44,.96)', '#ffd479', 10);
    D.txt(ctx, 'LIGHT THE FIRST LAMP', 640, startRect.y + 38, 'bold 21px Georgia', '#ffd479', 'center');
    D.txt(ctx, 'ENTER or click  ·  keys 1-5 pick cards  ·  B boosts',
      640, 662, '14px system-ui', '#7f959a', 'center');
    D.txt(ctx, 'A tiny original card game, made for this bounty.',
      640, 716, 'italic 14px Georgia', '#5d7479', 'center');
  }

  function win(ctx, s) {
    D.glow(ctx, 640, 360, 540, 'rgba(255,206,120,.20)');
    D.txt(ctx, 'CLEAN LEDGER', 640, 318, 'bold 76px Georgia', '#ffd479', 'center');
    D.txt(ctx, 'The last lantern still burns. The foe has no lamps left.',
      640, 370, '23px Georgia', '#f4f0e4', 'center');
    D.panel(ctx, 440, 408, 400, 112, 'rgba(12,22,26,.92)', '#ffd479', 12);
    D.txt(ctx, 'ROUNDS  ' + s.round, 640, 448, 'bold 22px Georgia', '#f4f0e4', 'center');
    D.txt(ctx, 'LIGHT LEFT  ' + s.light + ' / ' + s.lightMax, 640, 484, 'bold 20px Georgia', '#7fd6c8', 'center');
    ctx.globalAlpha = 0.55 + 0.45 * Math.sin(A.clock / 420);
    D.txt(ctx, 'PRESS ENTER — ANOTHER NIGHT', 640, 600, 'bold 20px Georgia', '#ffd479', 'center');
    ctx.globalAlpha = 1;
  }

  function loss(ctx, s) {
    D.glow(ctx, 640, 360, 540, 'rgba(224,97,60,.18)');
    D.txt(ctx, 'LIGHTS OUT', 640, 318, 'bold 78px Georgia', '#e0613c', 'center');
    D.txt(ctx, 'The ledger closed against you. The street grows cold.',
      640, 370, '23px Georgia', '#e8dcd6', 'center');
    D.panel(ctx, 440, 408, 400, 112, 'rgba(20,12,14,.92)', '#e0613c', 12);
    D.txt(ctx, 'ROUNDS  ' + s.round, 640, 448, 'bold 22px Georgia', '#f4f0e4', 'center');
    D.txt(ctx, 'FOE LAMPS  ' + s.foeLife + ' / 5', 640, 484, 'bold 20px Georgia', '#7bb7c9', 'center');
    ctx.globalAlpha = 0.55 + 0.45 * Math.sin(A.clock / 420);
    D.txt(ctx, 'PRESS ENTER — TRY ANOTHER HAND', 640, 600, 'bold 20px Georgia', '#e0613c', 'center');
    ctx.globalAlpha = 1;
  }

  L.screens = { title, win, loss, startRect };
})(globalThis.Lantern = globalThis.Lantern || {});
