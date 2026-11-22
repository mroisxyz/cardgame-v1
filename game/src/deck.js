// deck.js — a 36-card deck (four suits, values 1-9), shuffled with a seed so demos replay exactly.
(function (L) {
  'use strict';

  function rngFrom(seed) {
    let s = (seed >>> 0) || 0x9e3779b9;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  function shuffle(pile, rnd) {
    for (let i = pile.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = pile[i]; pile[i] = pile[j]; pile[j] = t;
    }
    return pile;
  }

  function fresh(seed) {
    const rnd = rngFrom(seed);
    const pile = [];
    let uid = 0;
    L.cardData.SUITS.forEach(function (s) {
      for (let v = 1; v <= 9; v++) pile.push(L.cardData.make(s.id, v, 'c' + uid++));
    });
    return { pile: shuffle(pile, rnd), discard: [], rnd: rnd };
  }

  function draw(d) {
    if (d.pile.length === 0) {
      if (d.discard.length === 0) return null;
      d.pile = shuffle(d.discard, d.rnd);
      d.discard = [];
    }
    return d.pile.pop() || null;
  }

  function discard(d, cards) { cards.forEach(function (c) { d.discard.push(c); }); }

  L.deck = { rngFrom, shuffle, fresh, draw, discard };
})(globalThis.Lantern = globalThis.Lantern || {});
