// state.js — one snapshot of a match, plus the four fixed demo states the gallery needs.
(function (L) {
  'use strict';

  function create(seed) {
    const d = L.deck.fresh(seed || (Date.now() >>> 0));
    const s = {
      deck: d, hand: [], foeHand: [], selection: [], boosts: 0,
      life: 5, foeLife: 5, light: 4, lightMax: 6, round: 1,
      intent: null, played: null, foePlayed: null, result: null,
      prompt: '', screen: 'play', winner: null, seed: seed
    };
    for (let i = 0; i < 5; i++) s.hand.push(L.deck.draw(d));
    for (let i = 0; i < 5; i++) s.foeHand.push(L.deck.draw(d));
    s.intent = L.opponent.plan(s.round, d.rnd, s.foeHand);
    return s;
  }

  function demo(kind) {
    const s = create(20261122);
    s.selection = [0];
    if (kind === 'title') { s.screen = 'title'; return s; }
    if (kind === 'win') {
      s.foeLife = 0; s.life = 4; s.screen = 'win'; s.winner = 'player';
      return s;
    }
    if (kind === 'loss') {
      s.life = 0; s.foeLife = 3; s.screen = 'loss'; s.winner = 'foe';
      return s;
    }
    s.screen = 'play';
    return s;
  }

  L.state = { create, demo };
})(globalThis.Lantern = globalThis.Lantern || {});
