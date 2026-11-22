// opponent.js — the rival always announces its exact card, power and weakness before you commit.
(function (L) {
  'use strict';

  function plan(round, rnd, hand) {
    const suits = L.cardData.SUITS;
    const chosen = suits[Math.floor(rnd() * suits.length)];
    // The foe "reads" the strength of your hand and charges a burst when it feels threatened.
    const pressure = hand.reduce(function (n, c) { return n + c.value; }, 0) / Math.max(1, hand.length);
    const base = Math.round(3 + rnd() * 5 + pressure * 0.22 + Math.min(2, round / 4));
    const charge = rnd() < 0.35 ? 2 : 0;
    const late = round > 5 ? 1 : 0;
    const card = L.cardData.make(chosen.id, Math.max(1, Math.min(9, base)), 'foe-' + round);
    const power = card.value + charge + late;
    const counter = L.cardData.counterOf(chosen.id);
    return {
      card: card, suit: chosen.id, charge: charge, power: power, round: round,
      tell: charge ? 'I am charging +2 this turn.' : 'No charge from me this turn.',
      hint: 'Counter with ' + counter.name + ' (+4).'
    };
  }

  L.opponent = { plan: plan };
})(globalThis.Lantern = globalThis.Lantern || {});
