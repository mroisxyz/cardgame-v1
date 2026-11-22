// card-data.js — original suits, recognised by both colour and shape, plus the counter cycle.
(function (L) {
  'use strict';

  // Ember -> Grove -> Tide -> Dusk -> Ember. Each card wears its shape and its colour.
  const SUITS = [
    { id: 'ember', name: 'Ember', shape: '◆', color: '#e0613c', soft: 'rgba(224,97,60,.22)', beats: 'grove' },
    { id: 'tide', name: 'Tide', shape: '●', color: '#3aa6c4', soft: 'rgba(58,166,196,.22)', beats: 'dusk' },
    { id: 'grove', name: 'Grove', shape: '▲', color: '#59a86a', soft: 'rgba(89,168,106,.22)', beats: 'tide' },
    { id: 'dusk', name: 'Dusk', shape: '■', color: '#9b6fc0', soft: 'rgba(155,111,192,.22)', beats: 'ember' },
  ];
  const BY_ID = Object.fromEntries(SUITS.map(function (s) { return [s.id, s]; }));

  function suit(id) { return BY_ID[id] || SUITS[0]; }
  function make(suitId, value, uid) {
    return { uid: uid, suit: suitId, value: value, cost: value >= 8 ? 3 : value >= 5 ? 2 : 1 };
  }
  function label(card) { return suit(card.suit).name + ' ' + card.value; }
  // True when suit a's colour beats suit b's colour.
  function beats(a, b) { return suit(a).beats === suit(b).id; }
  // The suit that defeats the given suit — used for the opponent's readable hint.
  function counterOf(id) { return SUITS.find(function (s) { return s.beats === id; }) || SUITS[0]; }

  L.cardData = { SUITS, BY_ID, suit, make, label, beats, counterOf };
})(globalThis.Lantern = globalThis.Lantern || {});
