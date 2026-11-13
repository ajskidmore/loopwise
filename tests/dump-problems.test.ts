/** Writes Practice Arena problems (id + solution) to JSON for the browser bot. Runs only with DUMP_PROBLEMS=path. */
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { PROBLEMS } from '../src/content/problems';

it.skipIf(!process.env.DUMP_PROBLEMS)('dump problems', () => {
  writeFileSync(process.env.DUMP_PROBLEMS!, JSON.stringify(PROBLEMS.map((p) => ({ id: p.id, solution: p.step.solution }))));
});
