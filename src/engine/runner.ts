/**
 * Main-thread API for running learner code in sandboxed Web Workers.
 * Each language has one long-lived worker; if code hangs (infinite loop) the worker is
 * terminated and replaced, and the run reports `timedOut`.
 *
 * Adding a language: write a worker that accepts {id, code, tests, stdin} and posts
 * {id, result: RunResult}; register it in WORKER_FACTORIES. Server-run languages
 * (Java, C, C++…) will go through a Firebase Function instead — see docs/ARCHITECTURE.md.
 */
import type { CodeTest, Language } from '../content/types';
import type { RunResult } from './types';
import { runHtml } from './htmlHarness';

const WORKER_FACTORIES: Partial<Record<Language, () => Worker>> = {
  python: () => new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' }),
  javascript: () => new Worker(new URL('./js.worker.ts', import.meta.url), { type: 'module' }),
  sql: () => new Worker(new URL('./sql.worker.ts', import.meta.url), { type: 'module' }),
};

/** Seconds a single run may take (Python's first load is excluded via warmup). */
const RUN_TIMEOUT_MS = 8000;
const LOAD_TIMEOUT_MS = 60000;

const workers = new Map<Language, Worker>();
const ready = new Map<Language, Promise<void>>();
let nextId = 1;

/** HTML/CSS needs no worker: it is rendered in a sandboxed iframe on the page (see htmlHarness.ts). */
const IN_PAGE: Partial<Record<Language, (code: string, tests: CodeTest[]) => Promise<RunResult>>> = {
  html: runHtml,
};

export const canRun = (lang: Language) => lang in WORKER_FACTORIES || lang in IN_PAGE;

// Browser test scripts (scripts/e2e/html_checks.py) set localStorage "loopwise.e2e" = "1" to get a direct hook
// for checking every HTML exercise. Regular visitors never have this flag, so nothing is exposed for them.
try {
  if (typeof window !== 'undefined' && window.localStorage?.getItem('loopwise.e2e') === '1') {
    (window as unknown as { __loopwiseRunHtml?: typeof runHtml }).__loopwiseRunHtml = runHtml;
  }
} catch {
  // localStorage can be blocked (private mode); the hook is only for tests, so ignore.
}

function getWorker(lang: Language): Worker {
  let w = workers.get(lang);
  if (!w) {
    const make = WORKER_FACTORIES[lang];
    if (!make) throw new Error(`Running ${lang} in the browser isn't supported yet.`);
    w = make();
    workers.set(lang, w);
  }
  return w;
}

function call(lang: Language, msg: object, timeoutMs: number): Promise<{ result?: RunResult; fatal?: string; ready?: boolean }> {
  const worker = getWorker(lang);
  const id = nextId++;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      worker.removeEventListener('message', onMsg);
      worker.terminate();
      workers.delete(lang);
      ready.delete(lang);
      resolve({ result: { output: '', error: null, tests: [], timedOut: true } });
    }, timeoutMs);
    function onMsg(e: MessageEvent) {
      if (e.data?.id !== id) return;
      clearTimeout(timer);
      worker.removeEventListener('message', onMsg);
      resolve(e.data);
    }
    worker.addEventListener('message', onMsg);
    worker.postMessage({ id, ...msg });
  });
}

/** Start loading a language runtime early (e.g. when a lesson with code opens). */
export function warmup(lang: Language): Promise<void> {
  if (!canRun(lang) || lang in IN_PAGE) return Promise.resolve();
  let p = ready.get(lang);
  if (!p) {
    p = call(lang, { type: 'warmup' }, LOAD_TIMEOUT_MS).then((r) => {
      if (r.fatal) {
        ready.delete(lang);
        throw new Error(r.fatal);
      }
    });
    ready.set(lang, p);
  }
  return p;
}

/** `setup` is used by SQL exercises: statements that create the sample tables before the learner's code runs. */
export async function runCode(lang: Language, code: string, tests: CodeTest[] = [], stdin = '', setup = ''): Promise<RunResult> {
  if (!canRun(lang)) {
    return { output: '', error: `Running ${lang} in the browser is coming soon.`, tests: [] };
  }
  const inPage = IN_PAGE[lang];
  if (inPage) return inPage(code, tests);
  try {
    await warmup(lang);
  } catch (e) {
    return { output: '', error: (e as Error).message + '\nCheck your internet connection and try again.', tests: [] };
  }
  const r = await call(lang, { type: 'run', code, tests, stdin, setup }, RUN_TIMEOUT_MS);
  if (r.fatal) return { output: '', error: r.fatal, tests: [] };
  const result = r.result!;
  if (result.timedOut) {
    result.error = `Your code ran for more than ${RUN_TIMEOUT_MS / 1000} seconds and was stopped.\nDo you have a loop that never ends?`;
  }
  return result;
}
