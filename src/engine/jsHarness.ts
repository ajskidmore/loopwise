import type { CodeTest } from '../content/types';
import type { RunResult } from './types';

/**
 * Runs learner JavaScript with captured console output, then runs tests in the same scope.
 * Pure function: used by the browser worker and by the Node content tests.
 * NOTE: no timeout here — the worker is terminated by the main thread if it hangs.
 */
export function runJs(src: string, tests: CodeTest[] = [], stdin = ''): RunResult {
  const lines: string[] = [];
  const fmt = (v: unknown): string => {
    if (typeof v === 'string') return v;
    try {
      return typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v);
    } catch {
      return String(v);
    }
  };
  const log = (...args: unknown[]) => lines.push(args.map(fmt).join(' '));
  const fakeConsole = { log, info: log, warn: log, error: log };
  const inputLines = stdin.split('\n');
  const prompt = () => inputLines.shift() ?? null;
  const assert = (cond: unknown, msg?: string) => {
    if (!cond) throw new Error(msg || 'Check failed');
  };

  const testFns = tests
    .map((t) => `() => { const __output__ = __getOutput(); const __source__ = __src; ${t.code}\n}`)
    .join(',\n');
  const body = `${src}\n;return [${testFns}];`;

  let closures: Array<() => void> = [];
  try {
    const fn = new Function('console', 'prompt', 'assert', '__getOutput', '__src', body);
    closures = fn(fakeConsole, prompt, assert, () => lines.join('\n') + (lines.length ? '\n' : ''), src);
  } catch (e) {
    const err = e as Error;
    return { output: lines.join('\n') + (lines.length ? '\n' : ''), error: `${err.name}: ${err.message}`, tests: [] };
  }
  const output = lines.join('\n') + (lines.length ? '\n' : '');
  const results = tests.map((t, i) => {
    try {
      closures[i]();
      return { name: t.name, passed: true };
    } catch (e) {
      return { name: t.name, passed: false, message: (e as Error).message };
    }
  });
  return { output, error: null, tests: results };
}
