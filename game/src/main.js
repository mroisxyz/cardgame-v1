// main.js — boots the match, wires input and the animation loop, and orchestrates each turn.
(function (L) {
  'use strict';

  const canvas = document.getElementById('game');
  L.render.init(canvas);

  const demo = new URLSearchParams(location.search).get('demo');
  let s = demo ? L.state.demo(demo) : L.state.create();
  if (!demo) s.screen = 'title';
  let resolving = false;

  function picked() {
    return s.selection.map(function (i) { return s.hand[i]; }).filter(Boolean);
  }

  const game = {
    get state() { return s; },

    start: function () {
      if (s.screen === 'play') return;
      s = L.state.create(demo ? 20261122 : undefined);
      L.render.resetViews();
      resolving = false;
    },
    startOrCommit: function () {
      if (s.screen === 'play') this.commit();
      else this.start();
    },
    toggle: function (i) {
      if (resolving || s.screen !== 'play' || i >= s.hand.length) return;
      const at = s.selection.indexOf(i);
      if (at >= 0) s.selection.splice(at, 1);
      else s.selection.push(i);
      s.boosts = 0;
      s.prompt = '';
    },
    boost: function () {
      if (resolving || s.screen !== 'play') return;
      if (!L.evaluator.analyze(picked()).valid) { s.prompt = 'Pick a valid combo first.'; return; }
      if (s.light <= L.evaluator.analyze(picked()).cost) { s.prompt = 'No spare light to boost.'; return; }
      s.boosts = (s.boosts + 1) % 3;
      s.prompt = '';
    },
    hint: function () {
      if (s.screen !== 'play') return;
      const best = L.evaluator.bestFor(s.hand, s.light);
      s.prompt = best ? 'Best here: ' + best.title + ' — ' + best.power + ' power for ' + best.cost + ' light.'
        : 'No playable combo in hand.';
    },
    commit: function () {
      if (resolving || s.screen !== 'play') return;
      const combo = L.evaluator.withBoost(L.evaluator.analyze(picked()), s.boosts, s.light);
      if (!combo.valid) { s.prompt = 'Not a combo — play a single, a pair or a same-suit run.'; return; }
      if (!combo.affordable) { s.prompt = 'Not enough light: ' + combo.cost + ' needed, ' + s.light + ' held.'; return; }

      resolving = true;
      const res = L.rules.resolve(s, combo);
      s.played = combo.cards;
      s.foePlayed = s.intent.card;
      s.result = res;
      s.prompt = '';
      L.animation.bump(9);
      L.animation.burst(522, 252, res.outcome === 'win' ? '#ffd479' : '#e0613c',
        res.power + ' vs ' + res.foePower);

      setTimeout(function () {
        L.rules.apply(s, res);
        resolving = false;
        if (s.screen === 'win') { L.animation.confetti(); L.animation.bump(14); }
        if (s.screen === 'loss') L.animation.bump(16);
      }, 1200);
    }
  };

  L.game = game;
  L.input.attach(canvas, game);
  if (s.screen === 'win') L.animation.confetti();

  let last = 0;
  function loop(t) {
    const dt = Math.min(50, t - last || 16);
    last = t;
    L.animation.update(dt);
    L.render.frame(s, dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})(globalThis.Lantern = globalThis.Lantern || {});
