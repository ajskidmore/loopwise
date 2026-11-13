/// <reference lib="webworker" />
/**
 * Module worker that runs SQL with sql.js (SQLite compiled to WebAssembly).
 * The ~700 KB .wasm file is bundled with the site (no CDN) and only downloaded when a SQL lesson opens.
 */
import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { runSqlWith, type SqlJsLike } from './sqlHarness';

let sqlPromise: Promise<SqlJsLike> | null = null;
const getSql = () => (sqlPromise ??= initSqlJs({ locateFile: () => wasmUrl }) as Promise<SqlJsLike>);

self.onmessage = async (e: MessageEvent) => {
  const { id, type, code, tests, setup } = e.data;
  try {
    const SQL = await getSql();
    if (type === 'warmup') {
      self.postMessage({ id, ready: true });
      return;
    }
    self.postMessage({ id, result: runSqlWith(SQL, setup ?? '', code, tests ?? []) });
  } catch (err) {
    sqlPromise = null; // let the next run try loading again
    self.postMessage({ id, fatal: `Could not start the SQL engine: ${(err as Error).message}` });
  }
};
