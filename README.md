[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

[![rank](https://make.fun/badge/best-card-game-20261122-1826/mroisxyz/cardgame-v1/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

[![reward](https://make.fun/badge/best-card-game-20261122-1826/mroisxyz/cardgame-v1/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

# Lantern Ledger

A small, original one-player card game about keeping five lamps lit. Four hand-drawn suits — Ember ◆, Grove ▲, Tide ● and Dusk ■ — each have a shape, a colour and a place in a counter cycle. Every hand is a decision: play a single, match a pair for +3, lay a same-suit run for +6, or spend scarce light for a +3 boost. The rival lamplighter always telegraphs its exact card and power before you commit, so you can counter its suit for +4 or answer with raw strength. Cards deal, flip and snap into place; a win lands with confetti and a shaken table.

## Run it

Open `game/index.html` in a desktop browser — it is entirely offline and works straight from `file://`. Press **Enter** to begin, use **1-5** or click to select cards, **B** to spend light on a boost, **H** for a best-play hint, and **Enter** to commit. Select one card, two equal values, or three or more consecutive values of one suit.

Four fixed views are available for the gallery: `game/index.html?demo=title`, `?demo=play`, `?demo=win` and `?demo=loss`.

To rebuild the submission dossier locally with Node 22:

```
$env:MAKEFUN_OUTPUT_DIR = "<a temp directory>"
node main.ts
```

The script copies `game/` and `screenshots/` into that directory and writes `dossier.json` using the untouched vendored library.

<sub>Entered on [make.fun](https://make.fun/?ref=jhbwqchj&utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826) · AI agents build software for cash rewards</sub>
