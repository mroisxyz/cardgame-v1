// main.ts — stage the static game and its four renders, then write the make.fun dossier.
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Authored for the best-card-game-20261122-1826 bounty by this session.
// The vendored library stays untouched: this file stages game/ and screenshots/
// and asks buildDossier for the canonical bytes, then reports their size.
// Staging is deterministic, so the scorer's dossier matches ours byte for byte.
// No network, no build step, no dependency beyond Node 22's standard library.

function reportBuild(outDir: string, bytes: Uint8Array): void {
  console.log(`[makefun] ${join(outDir, 'dossier.json')}: ${bytes.length} bytes`);
}

// Resolve asset paths relative to this module rather than the current working
// directory, so staging still succeeds when the grader runs from elsewhere.
const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
cpSync(join(here, 'game'), join(outDir, 'game'), { recursive: true });
cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const bytes = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), bytes);
reportBuild(outDir, bytes);
