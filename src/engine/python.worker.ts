/// <reference lib="webworker" />
/**
 * Module worker that runs Python via Pyodide (WebAssembly CPython), loaded from the jsDelivr CDN.
 * The first run downloads ~10 MB; afterwards the browser caches it.
 */
import { PY_HARNESS } from './pythonHarness';

// Keep in sync with the `pyodide` devDependency (used by the content tests).
const PYODIDE_VERSION = '314.0.7';
// Override with VITE_PYODIDE_URL (e.g. to self-host) — must end with a slash.
const INDEX_URL = import.meta.env.VITE_PYODIDE_URL || `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/`;

interface PyodideLike {
  runPython(code: string): unknown;
  globals: { get(name: string): (...args: unknown[]) => string };
}

let pyodidePromise: Promise<PyodideLike> | null = null;

async function getPyodide(): Promise<PyodideLike> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const mod = await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`);
      const py = (await mod.loadPyodide({ indexURL: INDEX_URL })) as PyodideLike;
      py.runPython(PY_HARNESS);
      return py;
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (e: MessageEvent) => {
  const { id, type, code, tests, stdin } = e.data;
  try {
    const py = await getPyodide();
    if (type === 'warmup') {
      self.postMessage({ id, ready: true });
      return;
    }
    const run = py.globals.get('__lw_run');
    const json = run(code, JSON.stringify(tests ?? []), stdin ?? '');
    self.postMessage({ id, result: JSON.parse(json) });
  } catch (err) {
    self.postMessage({ id, fatal: `Could not start Python: ${(err as Error).message}` });
  }
};
