/** Writes all playable content to a JSON file for the browser bot (scripts/e2e). Runs only with DUMP_CONTENT=path. */
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { TRACKS } from '../src/content';

it.skipIf(!process.env.DUMP_CONTENT)('dump content', () => {
  const out = TRACKS.map((t) => ({
    id: t.id,
    units: t.units.map((u) => ({
      id: u.id,
      lessons: u.lessons.filter((l) => l.status === 'ready').map((l) => ({ id: l.id, steps: l.steps })),
      checkpoint: u.checkpoint ?? null,
    })),
    finalExam: t.finalExam ?? null,
  }));
  writeFileSync(process.env.DUMP_CONTENT!, JSON.stringify(out));
});
