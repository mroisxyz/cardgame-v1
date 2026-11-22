// rules.js — resolves one committed turn from the telegraphed intent; no drawing or side effects here.
(function (L) {
  'use strict';

  function resolve(s, combo) {
    const foe = s.intent;
    const counters = L.cardData.beats(combo.suit, foe.suit);
    const countered = L.cardData.beats(foe.suit, combo.suit);
    const power = combo.power + (counters ? 4 : 0) - (countered ? 3 : 0);
    const foePower = foe.power;
    let outcome, foeDamage = 0, playerDamage = 0, lightGain = 0;
    if (power > foePower) { outcome = 'win'; foeDamage = 1; lightGain = 1; }
    else if (power < foePower) { outcome = 'loss'; playerDamage = 1; }
    else { outcome = 'tie'; lightGain = 1; }

    const headline = outcome === 'win' ? 'You hold the light.'
      : outcome === 'loss' ? 'The dark takes a lamp.'
      : 'The flames flicker — a standoff.';
    const note = counters
      ? L.cardData.suit(combo.suit).name + ' breaks ' + L.cardData.suit(foe.suit).name + ' (+4).'
      : countered
      ? L.cardData.suit(foe.suit).name + ' smothers your ' + L.cardData.suit(combo.suit).name + ' (-3).'
      : 'Even colours — raw power decides.';

    return {
      combo: combo, foe: foe, power: power, foePower: foePower, outcome: outcome,
      counters: counters, countered: countered, foeDamage: foeDamage,
      playerDamage: playerDamage, lightGain: lightGain, headline: headline, note: note
    };
  }

  // Commits the resolved turn to the snapshot: lamps, light, replacement cards and the next plan.
  function apply(s, res) {
    s.life = Math.max(0, s.life - res.playerDamage);
    s.foeLife = Math.max(0, s.foeLife - res.foeDamage);
    s.light = Math.min(s.lightMax, s.light - res.combo.cost + 2 + res.lightGain);

    const used = new Set(res.combo.cards.map(function (c) { return c.uid; }));
    s.hand = s.hand.filter(function (c) { return !used.has(c.uid); });
    L.deck.discard(s.deck, res.combo.cards);
    while (s.hand.length < 5) {
      const c = L.deck.draw(s.deck);
      if (!c) break;
      s.hand.push(c);
    }
    s.foeHand = s.foeHand.filter(function (c) { return c.uid !== res.foe.card.uid; });
    while (s.foeHand.length < 5) {
      const c = L.deck.draw(s.deck);
      if (!c) break;
      s.foeHand.push(c);
    }

    s.round++;
    s.selection = []; s.boosts = 0; s.played = null; s.foePlayed = null; s.result = null;
    s.intent = L.opponent.plan(s.round, s.deck.rnd, s.foeHand);
    if (s.foeLife <= 0) { s.screen = 'win'; s.winner = 'player'; }
    else if (s.life <= 0) { s.screen = 'loss'; s.winner = 'foe'; }
    return s;
  }

  L.rules = { resolve, apply };
})(globalThis.Lantern = globalThis.Lantern || {});
