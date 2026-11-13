/**
 * Content integrity tests. Run with `npm test`.
 * - Every id is unique and every question is well-formed.
 * - Every Python/JS code exercise's reference solution passes its own grader
 *   (using the exact same harness the browser uses).
 * - Every starter code does NOT already pass (otherwise the exercise is free).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { loadPyodide } from 'pyodide';
import { CONTENT_MODULES, TRACKS, allLessons, getLesson, getTrack, getUnit } from '../src/content';
import { PROBLEMS } from '../src/content/problems';
import type { CodeStep, QuestionStep, Step } from '../src/content/types';
import { PY_HARNESS } from '../src/engine/pythonHarness';
import { runJs } from '../src/engine/jsHarness';
import { runSqlWith, type SqlJsLike } from '../src/engine/sqlHarness';
import initSqlJs from 'sql.js';
import { SHOP } from '../src/content/lessons/sql';
import { gradeAnswer, gradeChoice, gradeCode, gradeFill, gradeOrder, normalizeOutput } from '../src/engine/grading';
import type { RunResult } from '../src/engine/types';
import { checkGoal, simulate } from '../src/engine/shell';

let runPy: (src: string, tests: unknown[]) => RunResult;

beforeAll(async () => {
  const py = await loadPyodide();
  py.runPython(PY_HARNESS);
  const fn = py.globals.get('__lw_run');
  runPy = (src, tests) => JSON.parse(fn(src, JSON.stringify(tests), ''));
}, 120_000);

function allSteps(): { where: string; step: Step }[] {
  const out: { where: string; step: Step }[] = [];
  for (const t of TRACKS) {
    for (const u of t.units) {
      for (const l of u.lessons) (l.steps ?? []).forEach((s, i) => out.push({ where: `${l.id}#${i}`, step: s }));
      (u.checkpoint?.questions ?? []).forEach((s, i) => out.push({ where: `${u.id}:checkpoint#${i}`, step: s }));
    }
    (t.finalExam?.questions ?? []).forEach((s, i) => out.push({ where: `${t.id}:final#${i}`, step: s }));
  }
  PROBLEMS.forEach((p) => out.push({ where: `problem:${p.id}`, step: p.step }));
  return out;
}

// sql.js loads its WebAssembly once (top-level await is fine in Vitest).
const SQL = (await initSqlJs()) as SqlJsLike;

const run = (s: CodeStep, code: string): RunResult =>
  s.language === 'python' ? runPy(code, s.tests ?? [])
    : s.language === 'sql' ? runSqlWith(SQL, s.setup ?? '', code, s.tests ?? [])
    : runJs(code, s.tests ?? []);

describe('structure', () => {
  it('ids are unique', () => {
    const ids = new Set<string>();
    for (const t of TRACKS) {
      for (const id of [t.id, ...t.units.map((u) => u.id), ...t.units.flatMap((u) => u.lessons.map((l) => l.id))]) {
        expect(ids.has(id), `duplicate id ${id}`).toBe(false);
        ids.add(id);
      }
    }
  });

  it('prerequisites point at real tracks', () => {
    const ids = new Set(TRACKS.map((t) => t.id));
    for (const t of TRACKS) for (const p of t.prerequisites) expect(ids.has(p), `${t.id} → ${p}`).toBe(true);
  });

  it('ready lessons have steps and at least one question', () => {
    for (const { lesson } of allLessons().filter((l) => l.lesson.status === 'ready')) {
      expect(lesson.steps!.length, lesson.id).toBeGreaterThan(2);
      expect(lesson.steps!.some((s) => s.kind !== 'explain'), lesson.id).toBe(true);
    }
  });

  it('every unit with ready lessons has a checkpoint once all its lessons are ready', () => {
    for (const t of TRACKS) for (const u of t.units) {
      if (u.lessons.every((l) => l.status === 'ready')) expect(u.checkpoint, `${u.id} needs a checkpoint`).toBeDefined();
    }
  });

  it('questions are well-formed', () => {
    for (const { where, step } of allSteps()) {
      const q = step as QuestionStep;
      switch (q.kind) {
        case 'choice':
          expect(q.answer, where).toBeGreaterThanOrEqual(0);
          expect(q.answer, where).toBeLessThan(q.choices.length);
          expect(new Set(q.choices).size, `${where} duplicate choices`).toBe(q.choices.length);
          break;
        case 'fill': {
          const blanks = q.template.split('___').length - 1;
          expect(blanks, `${where} blanks vs answers`).toBe(q.answers.length);
          if (q.bank) for (const a of q.answers) expect(a.some((x) => q.bank!.includes(x)), `${where} bank missing answer`).toBe(true);
          if (q.bank) {
            // Each word-bank chip can be used once, so two blanks needing the same word need two chips.
            const needed = q.answers.map((a) => a.find((x) => q.bank!.includes(x)));
            for (const word of new Set(needed)) {
              const need = needed.filter((w) => w === word).length;
              const have = q.bank.filter((w) => w === word).length;
              expect(have, `${where} needs "${word}" ${need} times but the bank has it ${have} time(s)`).toBeGreaterThanOrEqual(need);
            }
          }
          break;
        }
        case 'order':
          expect(q.lines.length, where).toBeGreaterThanOrEqual(2);
          expect(new Set(q.lines).size, `${where} duplicate lines`).toBe(q.lines.length);
          break;
        case 'answer':
          expect(q.accept.length, where).toBeGreaterThan(0);
          break;
        case 'code':
          expect(q.expectedOutput !== undefined || (q.tests?.length ?? 0) > 0, `${where} needs expectedOutput or tests`).toBe(true);
          break;
        case 'terminal': {
          const solved = simulate(q.setup, q.solution);
          expect(checkGoal(solved.state, q.goal, solved.transcript), `${where} solution doesn't meet the goal`).toEqual([]);
          expect(solved.transcript.includes('command not found'), `${where} solution uses an unsupported command`).toBe(false);
          const untouched = simulate(q.setup, []);
          expect(checkGoal(untouched.state, q.goal, untouched.transcript).length, `${where} is already solved before typing anything`).toBeGreaterThan(0);
          break;
        }
      }
    }
  });
});

describe('content wiring', () => {
  it('every written lesson / checkpoint / final exam id exists in the roadmap', () => {
    for (const m of CONTENT_MODULES) {
      for (const id of Object.keys(m.lessons)) expect(getLesson(id), `lesson ${id} not in roadmap`).toBeDefined();
      for (const id of Object.keys(m.checkpoints ?? {})) expect(getUnit(id), `unit ${id} not in roadmap`).toBeDefined();
      for (const id of Object.keys(m.finalExams ?? {})) expect(getTrack(id), `track ${id} not in roadmap`).toBeDefined();
    }
  });

  it('no lesson is written twice', () => {
    const seen = new Set<string>();
    for (const m of CONTENT_MODULES) for (const id of Object.keys(m.lessons)) {
      expect(seen.has(id), `${id} written in two modules`).toBe(false);
      seen.add(id);
    }
  });

  it('the intended correct answer of every question grades as correct', () => {
    for (const { where, step } of allSteps()) {
      switch (step.kind) {
        case 'choice': expect(gradeChoice(step, step.answer), where).toBe(true); break;
        case 'fill': expect(gradeFill(step, step.answers.map((a) => a[0])), where).toBe(true); break;
        case 'order': expect(gradeOrder(step, step.lines), where).toBe(true); break;
        case 'answer': for (const a of step.accept) expect(gradeAnswer(step, a), `${where} accept "${a}"`).toBe(true); break;
      }
    }
  });

  it('wrong answers do not grade as correct', () => {
    for (const { where, step } of allSteps()) {
      if (step.kind === 'choice') step.choices.forEach((_, i) => i !== step.answer && expect(gradeChoice(step, i), where).toBe(false));
      if (step.kind === 'order') expect(gradeOrder(step, [...step.lines].reverse()), where).toBe(false);
    }
  });
});

describe('python snippets in questions', () => {
  it('when a shown snippet runs cleanly, its printed output matches the marked answer', () => {
    const problems: string[] = [];
    for (const { where, step } of allSteps()) {
      if ((step.kind !== 'answer' && step.kind !== 'choice') || !step.code || step.language !== 'python') continue;
      if (!/^what does (this|it)? ?(print|show)/i.test(step.prompt)) continue; // only "What does this print?" questions
      const r = runPy(step.code, []);
      if (r.error || !r.output.trim()) continue; // incomplete snippet or intentional error
      const out = normalizeOutput(r.output);
      const expected = step.kind === 'answer' ? step.accept : [step.choices[step.answer]];
      const ok = expected.some((e) => normalizeOutput(e) === out || (step.kind === 'answer' && gradeAnswer(step, out)));
      if (!ok) problems.push(`${where}: prints ${JSON.stringify(out)} but answer is ${JSON.stringify(expected)}`);
    }
    expect(problems).toEqual([]);
  }, 120_000);
});

describe('code exercises', () => {
  it('reference solutions pass and starters do not', () => {
    const codeSteps = allSteps().filter((x) => x.step.kind === 'code') as { where: string; step: CodeStep }[];
    expect(codeSteps.length).toBeGreaterThan(0);
    for (const { where, step } of codeSteps) {
      if (step.language !== 'python' && step.language !== 'javascript' && step.language !== 'sql') continue;
      const good = gradeCode(step, run(step, step.solution));
      expect(good.failures, `${where} solution fails`).toEqual([]);
      // __perf_probe__ makes speed tests abort slow starters after 3 s instead of hanging (see fast() in _helpers.ts)
      const starter = gradeCode(step, run(step, step.language === 'python' ? `__perf_probe__ = True\n${step.starter}` : step.starter));
      expect(starter.passed, `${where} starter already passes`).toBe(false);
    }
  }, 600_000);
});

describe('sql snippets in questions', () => {
  // "What does this query return?" / "How many rows…?" / "How many products are left…?" questions are run
  // against the sample shop (SHOP in src/content/lessons/sql.ts) and must match the marked answer.
  it('match what SQLite actually returns', () => {
    const problems: string[] = [];
    let checked = 0;
    for (const { where, step } of allSteps()) {
      if ((step.kind !== 'answer' && step.kind !== 'choice') || !step.code || step.language !== 'sql') continue;
      const p = step.prompt;
      const db = new (SQL as unknown as { Database: new () => { exec(s: string): { values: unknown[][] }[]; close(): void } }).Database();
      db.exec(SHOP);
      let got: string | null = null;
      try {
        if (/^how many products are left/i.test(p)) {
          db.exec(step.code);
          got = String(db.exec('SELECT COUNT(*) FROM products')[0].values[0][0]);
        } else if (/^how many rows does this query return/i.test(p) || /^what does this query return\?.*number of rows/i.test(p)) {
          const sets = db.exec(step.code);
          got = String(sets.length ? sets[sets.length - 1].values.length : 0);
        } else if (/^what does this query return/i.test(p)) {
          const sets = db.exec(step.code);
          got = String(sets[sets.length - 1].values[0][0]);
        }
      } catch (e) {
        problems.push(`${where}: SQL error ${(e as Error).message}`);
      }
      db.close();
      if (got === null) continue;
      checked++;
      const ok = step.kind === 'answer' ? gradeAnswer(step, got) : step.choices[step.answer] === got;
      if (!ok) problems.push(`${where}: returns ${got} but the answer is ${JSON.stringify(step.kind === 'answer' ? step.accept : step.choices[step.answer])}`);
    }
    expect(problems, problems.join('\n')).toEqual([]);
    expect(checked).toBeGreaterThan(10);
  });
});

describe('html exercises', () => {
  // Node can't render pages, so solutions/starters are verified in real Chrome by scripts/e2e/html_checks.py.
  // Here we catch what we can without a browser: missing checks and typos in the check code.
  it('have page checks that compile, and a starter different from the solution', () => {
    const htmlSteps = allSteps().filter((x) => x.step.kind === 'code' && x.step.language === 'html') as { where: string; step: CodeStep }[];
    for (const { where, step } of htmlSteps) {
      expect(step.expectedOutput, `${where}: HTML exercises are graded by checks, not printed output`).toBeUndefined();
      expect(step.tests?.length ?? 0, `${where} needs page checks`).toBeGreaterThan(0);
      expect(step.starter.trim(), `${where} starter equals the solution`).not.toBe(step.solution.trim());
      for (const t of step.tests ?? []) {
        expect(() => new Function('$', '$$', 'text', 'attr', 'css', 'px', 'color', 'assert', '__source__', t.code), `${where} check "${t.name}" has a syntax error`).not.toThrow();
      }
    }
  });
});
