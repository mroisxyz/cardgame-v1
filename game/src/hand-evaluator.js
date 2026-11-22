// hand-evaluator.js — reads a selection and names the combo it makes, its power and its light cost.
(function (L) {
  'use strict';

  const COST = { single: 1, pair: 2, chain: 3, none: 0 };

  function analyze(cards) {
    if (!cards || cards.length === 0) {
      return { kind: 'none', valid: false, power: 0, cost: 0, cards: [], title: 'No cards', detail: 'Pick 1-5 cards' };
    }
    const sorted = cards.slice().sort(function (a, b) { return a.value - b.value; });

    if (sorted.length === 1) {
      const c = sorted[0];
      return {
        kind: 'single', valid: true, power: c.value, cost: COST.single, suit: c.suit, cards: sorted,
        title: L.cardData.label(c), detail: 'One card, straight power'
      };
    }
    if (sorted.length === 2 && sorted[0].value === sorted[1].value) {
      return {
        kind: 'pair', valid: true, power: sorted[0].value * 2 + 3, cost: COST.pair, suit: sorted[0].suit, cards: sorted,
        title: 'Pair of ' + sorted[0].value, detail: 'Matching numbers gain +3'
      };
    }
    if (sorted.length >= 3 &&
        sorted.every(function (c) { return c.suit === sorted[0].suit; }) &&
        sorted.every(function (c, i) { return i === 0 || c.value === sorted[i - 1].value + 1; })) {
      const power = sorted.reduce(function (n, c) { return n + c.value; }, 0) + 6 + 2 * (sorted.length - 3);
      return {
        kind: 'chain', valid: true, power: power, cost: COST.chain, suit: sorted[0].suit, cards: sorted,
        title: L.cardData.suit(sorted[0].suit).name + ' run ' + sorted[0].value + '-' + sorted[sorted.length - 1].value,
        detail: 'Same suit, in order, +6'
      };
    }
    return {
      kind: 'none', valid: false, power: 0, cost: 0, suit: sorted[0].suit, cards: sorted,
      title: 'Not a combo', detail: 'Singles, a matching pair, or a same-suit run'
    };
  }

  // Light boost: up to two extra lamps, each buying +3 power and costing 1 light.
  function withBoost(combo, boosts, light) {
    const b = Math.max(0, Math.min(2, boosts || 0));
    const cost = combo.cost + b;
    const out = Object.assign({}, combo, {
      boosts: b,
      power: combo.power + (combo.valid ? b * 3 : 0),
      cost: cost,
      affordable: cost <= light,
      detail: combo.detail + (b ? '   +' + (b * 3) + ' boost' : '')
    });
    return out;
  }

  // Strongest affordable play from any subset of the hand — used by the "best play" hint.
  function bestFor(hand, light) {
    let best = null;
    for (let mask = 1; mask < (1 << hand.length); mask++) {
      const pick = [];
      for (let i = 0; i < hand.length; i++) if (mask & (1 << i)) pick.push(hand[i]);
      const base = analyze(pick);
      if (!base.valid) continue;
      for (let b = 0; b <= 2; b++) {
        const play = withBoost(base, b, light);
        if (play.affordable && (!best || play.power > best.power)) best = play;
      }
    }
    return best;
  }

  L.evaluator = { COST, analyze, withBoost, bestFor };
})(globalThis.Lantern = globalThis.Lantern || {});
