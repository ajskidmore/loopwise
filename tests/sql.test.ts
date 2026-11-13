/**
 * Tests for the SQL exercise runner (src/engine/sqlHarness.ts), using the real sql.js engine.
 */
import { describe, expect, it } from 'vitest';
import initSqlJs from 'sql.js';
import { formatTable, runSqlWith, type SqlJsLike } from '../src/engine/sqlHarness';

const SQL = (await initSqlJs()) as SqlJsLike;
const SETUP = "CREATE TABLE pets (id INTEGER PRIMARY KEY, name TEXT, age INTEGER);\nINSERT INTO pets VALUES (1, 'Rex', 3), (2, 'Mia', 5), (3, 'Bo', NULL);";

describe('runSqlWith', () => {
  it('runs a query against the setup data and shows a table', () => {
    const r = runSqlWith(SQL, SETUP, 'SELECT name FROM pets ORDER BY name;', []);
    expect(r.error).toBeNull();
    expect(r.output).toBe('name\n----\nBo\nMia\nRex\n(3 rows)\n');
  });

  it('gives checks the last result, and query() sees changes', () => {
    const tests = [
      { name: 'last result', code: 'assert(JSON.stringify(result.rows) === JSON.stringify([[2]]), "rows: " + JSON.stringify(result.rows))' },
      { name: 'update applied', code: 'assert(query("SELECT age FROM pets WHERE id = 1").rows[0][0] === 4, "age not updated")' },
    ];
    const r = runSqlWith(SQL, SETUP, "UPDATE pets SET age = 4 WHERE id = 1;\nSELECT COUNT(*) FROM pets WHERE age > 3;", tests);
    expect(r.tests.map((t) => t.passed)).toEqual([true, true]);
  });

  it('reports SQL errors in plain words and skips checks', () => {
    const r = runSqlWith(SQL, SETUP, 'SELEC name FROM pets;', [{ name: 'x', code: 'assert(true)' }]);
    expect(r.error).toMatch(/^SQL error: .*syntax error/);
    expect(r.tests).toEqual([]);
  });

  it('every run starts from fresh data (DROP TABLE does no lasting harm)', () => {
    runSqlWith(SQL, SETUP, 'DROP TABLE pets;', []);
    const r = runSqlWith(SQL, SETUP, 'SELECT COUNT(*) AS n FROM pets;', []);
    expect(r.error).toBeNull();
    expect(r.output).toContain('3');
  });

  it('a failing check reports its message', () => {
    const r = runSqlWith(SQL, SETUP, 'SELECT name FROM pets;', [{ name: 'needs ORDER BY', code: 'assert(/order by/i.test(__source__), "Sort with ORDER BY")' }]);
    expect(r.tests[0]).toEqual({ name: 'needs ORDER BY', passed: false, message: 'Sort with ORDER BY' });
  });
});

describe('formatTable', () => {
  it('pads columns, shows NULL, and counts rows', () => {
    expect(formatTable({ columns: ['name', 'age'], rows: [['Rex', 3], ['Bo', null]] })).toBe(
      'name | age\n-----+-----\nRex  | 3\nBo   | NULL\n(2 rows)\n',
    );
  });
  it('says when a statement returns no rows', () => {
    expect(formatTable({ columns: [], rows: [] })).toMatch(/doesn't return rows/);
  });
});
