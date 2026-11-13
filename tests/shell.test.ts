import { describe, expect, it } from 'vitest';
import { HOME, checkGoal, createShell, displayPath, normalizePath, runLine, simulate, tokenize } from '../src/engine/shell';

const run = (setup: Parameters<typeof createShell>[0], ...cmds: string[]) => simulate(setup, cmds);

describe('shell: paths & parsing', () => {
  it('normalizes paths', () => {
    expect(normalizePath('docs', HOME)).toBe(`${HOME}/docs`);
    expect(normalizePath('../x', `${HOME}/a`)).toBe(`${HOME}/x`);
    expect(normalizePath('~/a/./b/..', '/')).toBe(`${HOME}/a`);
    expect(normalizePath('/', HOME)).toBe('/');
    expect(normalizePath('..', '/')).toBe('/');
    expect(displayPath(`${HOME}/a`)).toBe('~/a');
  });
  it('tokenizes quotes, pipes and redirects', () => {
    expect(tokenize('echo "hello world" > a.txt')).toEqual(['echo', 'hello world', '>', 'a.txt']);
    expect(tokenize("grep 'x y'|wc -l")).toEqual(['grep', 'x y', '|', 'wc', '-l']);
    expect(tokenize('echo hi >> log')).toEqual(['echo', 'hi', '>>', 'log']);
    expect(() => tokenize('echo "oops')).toThrow();
  });
});

describe('shell: commands', () => {
  it('pwd, cd, ls', () => {
    const { state, transcript } = run({ dirs: ['projects/game'], files: { 'notes.txt': 'hi\n', '.secret': 'x' } }, 'pwd', 'ls', 'cd projects', 'pwd', 'cd ..', 'ls -a');
    expect(transcript).toBe(`${HOME}\nnotes.txt  projects\n${HOME}/projects\n.  ..  .secret  notes.txt  projects\n`);
    expect(state.cwd).toBe(HOME);
  });
  it('cd errors and cd with no args goes home', () => {
    const s = createShell({ files: { 'f.txt': '' }, cwd: '/' });
    expect(runLine(s, 'cd nope').output).toBe('bash: cd: nope: No such file or directory\n');
    expect(runLine(s, 'cd ~/f.txt').output).toContain('Not a directory');
    runLine(s, 'cd');
    expect(s.cwd).toBe(HOME);
  });
  it('mkdir, mkdir -p, touch, rm, rmdir', () => {
    const s = createShell();
    expect(runLine(s, 'mkdir a/b').output).toContain('No such file or directory');
    runLine(s, 'mkdir -p a/b/c');
    expect(s.fs.get(`${HOME}/a/b/c`)?.type).toBe('dir');
    runLine(s, 'touch a/x.txt');
    expect(runLine(s, 'rm a').output).toContain('Is a directory');
    expect(runLine(s, 'rmdir a').output).toContain('Directory not empty');
    runLine(s, 'rm -r a');
    expect(s.fs.has(`${HOME}/a`)).toBe(false);
    expect(s.fs.has(`${HOME}/a/x.txt`)).toBe(false);
  });
  it('refuses to delete home or the folder you are in', () => {
    const s = createShell({ dirs: ['w'], cwd: '~/w' });
    expect(runLine(s, 'rm -r ~/w').error).toBe(true);
    expect(runLine(s, 'rm -r ~').error).toBe(true);
    expect(s.fs.has(`${HOME}/w`)).toBe(true);
  });
  it('echo with > and >>, cat', () => {
    const { transcript, state } = run({}, 'echo first > log.txt', 'echo second >> log.txt', 'cat log.txt');
    expect(transcript).toBe('first\nsecond\n');
    expect(state.fs.get(`${HOME}/log.txt`)).toEqual({ type: 'file', content: 'first\nsecond\n' });
  });
  it('mv and cp (files, into dirs, rename, -r)', () => {
    const s = createShell({ dirs: ['docs', 'src'], files: { 'a.txt': 'A', 'src/main.py': 'print(1)' } });
    runLine(s, 'mv a.txt docs');
    expect(s.fs.has(`${HOME}/docs/a.txt`)).toBe(true);
    expect(s.fs.has(`${HOME}/a.txt`)).toBe(false);
    runLine(s, 'mv docs/a.txt docs/b.txt');
    expect(s.fs.has(`${HOME}/docs/b.txt`)).toBe(true);
    expect(runLine(s, 'cp src backup').output).toContain('-r not specified');
    runLine(s, 'cp -r src backup');
    expect(s.fs.get(`${HOME}/backup/main.py`)).toEqual({ type: 'file', content: 'print(1)' });
    expect(s.fs.has(`${HOME}/src/main.py`)).toBe(true);
  });
  it('grep, wc, head, tail, sort and pipes', () => {
    const file = 'apple\nBanana\ncherry\napricot\n';
    const setup = { files: { 'f.txt': file } };
    expect(run(setup, 'grep ap f.txt').transcript).toBe('apple\napricot\n');
    expect(run(setup, 'grep -i b f.txt').transcript).toBe('Banana\n');
    expect(run(setup, 'grep -c a f.txt').transcript).toBe('3\n');
    expect(run(setup, 'wc -l f.txt').transcript).toBe('4 f.txt\n');
    expect(run(setup, 'cat f.txt | grep ap | wc -l').transcript).toBe('2\n');
    expect(run(setup, 'head -n 2 f.txt').transcript).toBe('apple\nBanana\n');
    expect(run(setup, 'tail -1 f.txt').transcript).toBe('apricot\n');
    expect(run(setup, 'sort f.txt').transcript).toBe('Banana\napple\napricot\ncherry\n');
    expect(run(setup, 'sort f.txt | head -n 1 > first.txt', 'cat first.txt').transcript).toBe('Banana\n');
  });
  it('unknown commands and case hints', () => {
    const s = createShell();
    expect(runLine(s, 'LS').output).toContain('did you mean ls?');
    expect(runLine(s, 'foo').output).toBe('bash: foo: command not found\n');
  });
});

describe('shell: goals', () => {
  it('checks every kind of goal', () => {
    const { state, transcript } = run({ dirs: ['p'] }, 'cd p', 'mkdir src', 'echo hi > src/a.txt', 'pwd');
    expect(checkGoal(state, { cwd: '~/p', dirs: ['~/p/src'], files: ['~/p/src/a.txt'], missing: ['~/q'], contains: { '~/p/src/a.txt': 'hi' }, equals: { '~/p/src/a.txt': 'hi' }, outputIncludes: ['/home/learner/p'], used: ['pwd'] }, transcript)).toEqual([]);
    expect(checkGoal(state, { cwd: '~', used: ['ls'] }, transcript).length).toBe(2);
  });
});
