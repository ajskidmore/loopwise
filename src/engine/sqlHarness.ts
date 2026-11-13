/**
 * SQL exercises: run the learner's SQL against a fresh in-memory SQLite database (sql.js), then run checks.
 * Pure function given a loaded sql.js module, so the browser worker (sql.worker.ts) and the Node content
 * tests use exactly the same code.
 *
 * Each run starts from scratch: a new database, then the step's `setup` SQL (tables + sample rows), then the
 * learner's code. Nothing is saved anywhere, so learners can't break anything, even with DROP TABLE.
 *
 * Checks are small JavaScript snippets (CodeTest) that can use:
 *   result            { columns, rows } from the learner's LAST statement that returned rows (empty if none)
 *   query(sql)        run another query afterwards (e.g. to see what an UPDATE changed) → { columns, rows }
 *   assert(cond, msg) fail with a friendly message
 *   __source__        the learner's SQL as text
 */
import type { CodeTest } from '../content/types';
import type { RunResult, TestResult } from './types';

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
}

interface DatabaseLike {
  exec(sql: string): { columns: string[]; values: unknown[][] }[];
  close(): void;
}
export interface SqlJsLike {
  Database: new () => DatabaseLike;
}

const EMPTY: QueryResult = { columns: [], rows: [] };
/** Most rows shown in the output panel (checks still see every row). */
const MAX_ROWS_SHOWN = 50;

function lastResult(db: DatabaseLike, sql: string): QueryResult {
  const sets = db.exec(sql);
  const last = sets[sets.length - 1];
  return last ? { columns: last.columns, rows: last.values } : EMPTY;
}

/** Format rows as a plain-text table for the output panel. */
export function formatTable(r: QueryResult): string {
  if (r.columns.length === 0) return 'Done. (This statement doesn\'t return rows.)';
  const cell = (v: unknown) => (v === null ? 'NULL' : String(v));
  const shown = r.rows.slice(0, MAX_ROWS_SHOWN).map((row) => row.map(cell));
  const widths = r.columns.map((c, i) => Math.max(c.length, ...shown.map((row) => row[i].length)));
  const line = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join(' | ').trimEnd();
  const out = [line(r.columns), widths.map((w) => '-'.repeat(w)).join('-+-'), ...shown.map(line)];
  if (r.rows.length > MAX_ROWS_SHOWN) out.push(`… and ${r.rows.length - MAX_ROWS_SHOWN} more rows`);
  out.push(`(${r.rows.length} row${r.rows.length === 1 ? '' : 's'})`);
  return out.join('\n') + '\n';
}

function cleanError(e: unknown): string {
  const msg = (e as Error)?.message ?? String(e);
  return `SQL error: ${msg}`;
}

export function runSqlWith(SQL: SqlJsLike, setup: string, code: string, tests: CodeTest[]): RunResult {
  const db = new SQL.Database();
  try {
    if (setup.trim()) db.exec(setup);
  } catch (e) {
    db.close();
    return { output: '', error: `The lesson's sample data failed to load (${cleanError(e)}). Please report this.`, tests: [] };
  }

  let result: QueryResult;
  try {
    result = code.trim() ? lastResult(db, code) : EMPTY;
  } catch (e) {
    db.close();
    return { output: '', error: cleanError(e), tests: [] };
  }

  const query = (sql: string): QueryResult => lastResult(db, sql);
  const assert = (cond: unknown, msg?: string) => {
    if (!cond) throw new Error(msg || 'Check failed');
  };
  const results: TestResult[] = tests.map((t) => {
    try {
      new Function('result', 'query', 'assert', '__source__', t.code)(result, query, assert, code);
      return { name: t.name, passed: true };
    } catch (e) {
      return { name: t.name, passed: false, message: (e as Error).message };
    }
  });
  db.close();
  return { output: code.trim() ? formatTable(result) : '', error: null, tests: results };
}
