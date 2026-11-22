// animation.js — time-based motion: card tweens, rising score numbers, table shake and victory confetti.
(function (L) {
  'use strict';

  const tweens = [];
  const effects = [];
  let shake = 0;
  let clock = 0;

  const easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  const easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  function tween(opts) {
    const tw = {
      t: 0, dur: opts.dur || 400, delay: opts.delay || 0,
      ease: opts.ease || easeOut, update: opts.update, done: opts.done, alive: true
    };
    tweens.push(tw);
    return tw;
  }

  function effect(kind, opts) {
    const e = Object.assign({ kind: kind, t: 0, dur: 900 }, opts);
    effects.push(e);
    return e;
  }

  function burst(x, y, color, text) {
    effect('float', { x: x, y: y, color: color, text: text, dur: 1200 });
  }

  function confetti() {
    const colors = ['#ffd479', '#e0613c', '#3aa6c4', '#59a86a', '#9b6fc0'];
    for (let i = 0; i < 90; i++) {
      effect('confetti', {
        x: Math.random() * 1280, y: -20 - Math.random() * 500,
        vx: (Math.random() - 0.5) * 3.4, vy: 2 + Math.random() * 4,
        color: colors[i % colors.length], size: 4 + Math.random() * 7,
        rot: Math.random() * 6, spin: (Math.random() - 0.5) * 0.2,
        dur: 2600 + Math.random() * 1400
      });
    }
  }

  function bump(amount) { shake = Math.max(shake, amount || 8); }

  function update(dt) {
    clock += dt;
    for (const tw of tweens) {
      if (tw.delay > 0) { tw.delay -= dt; continue; }
      tw.t += dt;
      const p = Math.min(1, tw.t / tw.dur);
      if (tw.update) tw.update(tw.ease(p), p);
      if (p >= 1) { tw.alive = false; if (tw.done) tw.done(); }
    }
    for (let i = tweens.length - 1; i >= 0; i--) if (!tweens[i].alive) tweens.splice(i, 1);

    for (const e of effects) {
      e.t += dt;
      if (e.kind === 'confetti') {
        e.x += e.vx * dt / 16;
        e.y += e.vy * dt / 16;
        e.vy += 0.035 * dt / 16;
        e.rot += e.spin * dt / 16;
      }
    }
    for (let i = effects.length - 1; i >= 0; i--) if (effects[i].t >= effects[i].dur) effects.splice(i, 1);

    shake *= Math.pow(0.86, dt / 16);
    if (shake < 0.2) shake = 0;
  }

  function shakeOffset() {
    return { x: (Math.random() - 0.5) * shake, y: (Math.random() - 0.5) * shake };
  }

  L.animation = {
    tween, effect, burst, confetti, bump, update, shakeOffset,
    easeOut, easeInOut, effects,
    get clock() { return clock; }
  };
})(globalThis.Lantern = globalThis.Lantern || {});
