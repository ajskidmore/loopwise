/**
 * A tiny, safe, pretend Unix shell for command-line lessons. Nothing touches the real computer:
 * the "disk" is an in-memory map of paths. Pure TypeScript — unit-tested in tests/shell.test.ts.
 *
 * Supported: pwd, ls [-a] [-l], cd, mkdir [-p], touch, cat, echo, rm [-r] [-f], rmdir, mv, cp [-r],
 *            grep [-i] [-c] [-n], wc [-l], head/tail [-n N], sort [-r], clear, history, help
 *            plus pipes (a | b) and redirection (> file, >> file).
 * Messages imitate bash so what learners see here matches a real terminal.
 */

export const HOME = '/home/learner';

type Node = { type: 'dir' } | { type: 'file'; content: string };

export interface ShellSetup {
  /** Starting directory (absolute or ~/...). Default: home. */
  cwd?: string;
  /** Directories to create (parents are created automatically). */
  dirs?: string[];
  /** Files to create: path → contents. */
  files?: Record<string, string>;
}

export interface ShellState {
  fs: Map<string, Node>;
  cwd: string;
  history: string[];
}

export interface RunOutput { output: string; error: boolean; clear?: boolean }

// ------------------------------------------------------------------ paths
export function normalizePath(path: string, cwd: string): string {
  let p = path;
  if (p === '~') p = HOME;
  else if (p.startsWith('~/')) p = HOME + p.slice(1);
  if (!p.startsWith('/')) p = (cwd === '/' ? '' : cwd) + '/' + p;
  const parts: string[] = [];
  for (const seg of p.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return '/' + parts.join('/');
}
const parentOf = (p: string) => (p === '/' ? '/' : p.slice(0, p.lastIndexOf('/')) || '/');
const baseName = (p: string) => p.slice(p.lastIndexOf('/') + 1);
export const displayPath = (p: string) => (p === HOME ? '~' : p.startsWith(HOME + '/') ? '~' + p.slice(HOME.length) : p);

// ------------------------------------------------------------------ state
export function createShell(setup: ShellSetup = {}): ShellState {
  const fs = new Map<string, Node>();
  const mkdirs = (abs: string) => {
    let cur = '';
    for (const seg of abs.split('/').filter(Boolean)) {
      cur += '/' + seg;
      if (!fs.has(cur)) fs.set(cur, { type: 'dir' });
    }
  };
  fs.set('/', { type: 'dir' });
  mkdirs(HOME);
  for (const d of setup.dirs ?? []) mkdirs(normalizePath(d, HOME));
  for (const [f, content] of Object.entries(setup.files ?? {})) {
    const abs = normalizePath(f, HOME);
    mkdirs(parentOf(abs));
    fs.set(abs, { type: 'file', content });
  }
  const cwd = normalizePath(setup.cwd ?? '~', HOME);
  mkdirs(cwd);
  return { fs, cwd, history: [] };
}

const children = (s: ShellState, dir: string) => {
  const prefix = dir === '/' ? '/' : dir + '/';
  return [...s.fs.keys()].filter((k) => k !== dir && k.startsWith(prefix) && !k.slice(prefix.length).includes('/')).map(baseName).sort();
};

// ------------------------------------------------------------------ parsing
/** Split a command line into words, honoring '' and "" quotes and separating | > >>. */
export function tokenize(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quote: string | null = null;
  let started = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) quote = null;
      else cur += c;
      continue;
    }
    if (c === '"' || c === "'") { quote = c; started = true; continue; }
    if (c === ' ' || c === '\t') {
      if (started) { out.push(cur); cur = ''; started = false; }
      continue;
    }
    if (c === '|' || c === '>') {
      if (started) { out.push(cur); cur = ''; started = false; }
      if (c === '>' && line[i + 1] === '>') { out.push('>>'); i++; } else out.push(c);
      continue;
    }
    cur += c;
    started = true;
  }
  if (quote) throw new Error('unexpected end of line: missing closing quote');
  if (started) out.push(cur);
  return out;
}

// ------------------------------------------------------------------ commands
type Ctx = { s: ShellState; stdin: string | null };
type Result = { out: string; err?: string; clear?: boolean };

function readInput(c: Ctx, cmd: string, files: string[]): Result {
  if (files.length === 0) {
    if (c.stdin === null) return { out: '', err: `${cmd}: missing file operand` };
    return { out: c.stdin };
  }
  let out = '';
  for (const f of files) {
    const abs = normalizePath(f, c.s.cwd);
    const n = c.s.fs.get(abs);
    if (!n) return { out, err: `${cmd}: ${f}: No such file or directory` };
    if (n.type === 'dir') return { out, err: `${cmd}: ${f}: Is a directory` };
    out += n.content;
  }
  return { out };
}

const lines = (text: string) => (text === '' ? [] : text.replace(/\n$/, '').split('\n'));
const joinLines = (ls: string[]) => (ls.length ? ls.join('\n') + '\n' : '');

function splitFlags(args: string[]): { flags: Set<string>; rest: string[]; n?: number } {
  const flags = new Set<string>();
  const rest: string[] = [];
  let n: number | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-n' && /^\d+$/.test(args[i + 1] ?? '')) { n = Number(args[++i]); continue; }
    if (/^-\d+$/.test(a)) { n = Number(a.slice(1)); continue; }
    if (a.startsWith('-') && a.length > 1) { for (const ch of a.slice(1)) flags.add(ch); continue; }
    rest.push(a);
  }
  return { flags, rest, n };
}

const COMMANDS: Record<string, (c: Ctx, args: string[]) => Result> = {
  pwd: (c) => ({ out: c.s.cwd + '\n' }),

  ls: (c, args) => {
    const { flags, rest } = splitFlags(args);
    const targets = rest.length ? rest : ['.'];
    const chunks: string[] = [];
    for (const t of targets) {
      const abs = normalizePath(t, c.s.cwd);
      const n = c.s.fs.get(abs);
      if (!n) return { out: chunks.join(''), err: `ls: cannot access '${t}': No such file or directory` };
      if (n.type === 'file') { chunks.push(t + '\n'); continue; }
      let names = children(c.s, abs);
      if (flags.has('a')) names = ['.', '..', ...names];
      else names = names.filter((x) => !x.startsWith('.'));
      const header = targets.length > 1 ? `${t}:\n` : '';
      if (flags.has('l')) {
        const rows = names.map((x) => {
          const node = x === '.' || x === '..' ? { type: 'dir' as const } : c.s.fs.get(normalizePath(x, abs))!;
          return node.type === 'dir' ? `drwxr-xr-x  ${x}` : `-rw-r--r--  ${x}  (${node.content.length} bytes)`;
        });
        chunks.push(header + joinLines(rows));
      } else {
        chunks.push(header + (names.length ? names.join('  ') + '\n' : ''));
      }
    }
    return { out: chunks.join(targets.length > 1 ? '\n' : '') };
  },

  cd: (c, args) => {
    if (args.length > 1) return { out: '', err: 'bash: cd: too many arguments' };
    const target = args[0] ?? '~';
    const abs = normalizePath(target, c.s.cwd);
    const n = c.s.fs.get(abs);
    if (!n) return { out: '', err: `bash: cd: ${target}: No such file or directory` };
    if (n.type !== 'dir') return { out: '', err: `bash: cd: ${target}: Not a directory` };
    c.s.cwd = abs;
    return { out: '' };
  },

  mkdir: (c, args) => {
    const { flags, rest } = splitFlags(args);
    if (!rest.length) return { out: '', err: 'mkdir: missing operand' };
    for (const d of rest) {
      const abs = normalizePath(d, c.s.cwd);
      if (c.s.fs.has(abs)) {
        if (flags.has('p')) continue;
        return { out: '', err: `mkdir: cannot create directory '${d}': File exists` };
      }
      if (!c.s.fs.has(parentOf(abs))) {
        if (!flags.has('p')) return { out: '', err: `mkdir: cannot create directory '${d}': No such file or directory` };
        let cur = '';
        for (const seg of abs.split('/').filter(Boolean)) {
          cur += '/' + seg;
          const ex = c.s.fs.get(cur);
          if (ex?.type === 'file') return { out: '', err: `mkdir: cannot create directory '${d}': Not a directory` };
          if (!ex) c.s.fs.set(cur, { type: 'dir' });
        }
      } else if (c.s.fs.get(parentOf(abs))!.type !== 'dir') {
        return { out: '', err: `mkdir: cannot create directory '${d}': Not a directory` };
      } else c.s.fs.set(abs, { type: 'dir' });
    }
    return { out: '' };
  },

  touch: (c, args) => {
    if (!args.length) return { out: '', err: 'touch: missing file operand' };
    for (const f of args) {
      const abs = normalizePath(f, c.s.cwd);
      const parent = c.s.fs.get(parentOf(abs));
      if (!parent || parent.type !== 'dir') return { out: '', err: `touch: cannot touch '${f}': No such file or directory` };
      if (!c.s.fs.has(abs)) c.s.fs.set(abs, { type: 'file', content: '' });
    }
    return { out: '' };
  },

  cat: (c, args) => readInput(c, 'cat', args),

  echo: (_c, args) => ({ out: args.join(' ') + '\n' }),

  rm: (c, args) => {
    const { flags, rest } = splitFlags(args);
    if (!rest.length) return { out: '', err: 'rm: missing operand' };
    for (const f of rest) {
      const abs = normalizePath(f, c.s.cwd);
      const n = c.s.fs.get(abs);
      if (!n) {
        if (flags.has('f')) continue;
        return { out: '', err: `rm: cannot remove '${f}': No such file or directory` };
      }
      if (abs === '/' || abs === HOME || c.s.cwd === abs || c.s.cwd.startsWith(abs + '/')) {
        return { out: '', err: `rm: refusing to remove '${f}' (Loopwise safety rule: you are inside it, or it's your home folder)` };
      }
      if (n.type === 'dir') {
        if (!flags.has('r') && !flags.has('R')) return { out: '', err: `rm: cannot remove '${f}': Is a directory` };
        for (const k of [...c.s.fs.keys()]) if (k === abs || k.startsWith(abs + '/')) c.s.fs.delete(k);
      } else c.s.fs.delete(abs);
    }
    return { out: '' };
  },

  rmdir: (c, args) => {
    if (!args.length) return { out: '', err: 'rmdir: missing operand' };
    for (const d of args) {
      const abs = normalizePath(d, c.s.cwd);
      const n = c.s.fs.get(abs);
      if (!n) return { out: '', err: `rmdir: failed to remove '${d}': No such file or directory` };
      if (n.type !== 'dir') return { out: '', err: `rmdir: failed to remove '${d}': Not a directory` };
      if (children(c.s, abs).length) return { out: '', err: `rmdir: failed to remove '${d}': Directory not empty` };
      if (abs === HOME || c.s.cwd === abs || c.s.cwd.startsWith(abs + '/')) return { out: '', err: `rmdir: failed to remove '${d}': Device or resource busy` };
      c.s.fs.delete(abs);
    }
    return { out: '' };
  },

  mv: (c, args) => moveOrCopy(c, args, 'mv'),
  cp: (c, args) => moveOrCopy(c, args, 'cp'),

  grep: (c, args) => {
    const { flags, rest } = splitFlags(args);
    const [pattern, ...files] = rest;
    if (pattern === undefined) return { out: '', err: 'Usage: grep [-i] [-c] [-n] PATTERN [FILE]...' };
    const input = readInput(c, 'grep', files);
    if (input.err) return input;
    const needle = flags.has('i') ? pattern.toLowerCase() : pattern;
    const matched: string[] = [];
    lines(input.out).forEach((l, i) => {
      if ((flags.has('i') ? l.toLowerCase() : l).includes(needle)) matched.push(flags.has('n') ? `${i + 1}:${l}` : l);
    });
    if (flags.has('c')) return { out: matched.length + '\n' };
    return { out: joinLines(matched) };
  },

  wc: (c, args) => {
    const { flags, rest } = splitFlags(args);
    const input = readInput(c, 'wc', rest);
    if (input.err) return input;
    const ls = lines(input.out).length;
    const words = input.out.split(/\s+/).filter(Boolean).length;
    const suffix = rest.length ? ` ${rest.join(' ')}` : '';
    if (flags.has('l')) return { out: `${ls}${suffix}\n` };
    if (flags.has('w')) return { out: `${words}${suffix}\n` };
    return { out: `${ls} ${words} ${input.out.length}${suffix}\n` };
  },

  head: (c, args) => {
    const { rest, n = 10 } = splitFlags(args);
    const input = readInput(c, 'head', rest);
    return input.err ? input : { out: joinLines(lines(input.out).slice(0, n)) };
  },

  tail: (c, args) => {
    const { rest, n = 10 } = splitFlags(args);
    const input = readInput(c, 'tail', rest);
    return input.err ? input : { out: joinLines(lines(input.out).slice(-n)) };
  },

  sort: (c, args) => {
    const { flags, rest } = splitFlags(args);
    const input = readInput(c, 'sort', rest);
    if (input.err) return input;
    const sorted = lines(input.out).sort();
    return { out: joinLines(flags.has('r') ? sorted.reverse() : sorted) };
  },

  clear: () => ({ out: '', clear: true }),

  history: (c) => ({ out: joinLines(c.s.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`)) }),

  help: () => ({
    out: 'Commands you can use here:\n  pwd  ls  cd  mkdir  touch  cat  echo  rm  rmdir  mv  cp\n  grep  wc  head  tail  sort  clear  history\nUse | to pipe output into another command, > to save output to a file, >> to append.\n',
  }),
};

function moveOrCopy(c: Ctx, args: string[], cmd: 'mv' | 'cp'): Result {
  const { flags, rest } = splitFlags(args);
  if (rest.length < 2) return { out: '', err: `${cmd}: missing destination file operand` };
  const dest = rest[rest.length - 1];
  const sources = rest.slice(0, -1);
  const destAbs = normalizePath(dest, c.s.cwd);
  const destNode = c.s.fs.get(destAbs);
  if (sources.length > 1 && destNode?.type !== 'dir') return { out: '', err: `${cmd}: target '${dest}' is not a directory` };
  for (const src of sources) {
    const srcAbs = normalizePath(src, c.s.cwd);
    const n = c.s.fs.get(srcAbs);
    if (!n) return { out: '', err: `${cmd}: cannot stat '${src}': No such file or directory` };
    if (n.type === 'dir' && cmd === 'cp' && !flags.has('r') && !flags.has('R')) return { out: '', err: `cp: -r not specified; omitting directory '${src}'` };
    const target = destNode?.type === 'dir' ? normalizePath(baseName(srcAbs), destAbs) : destAbs;
    if (target === srcAbs) continue;
    if (target.startsWith(srcAbs + '/')) return { out: '', err: `${cmd}: cannot ${cmd === 'mv' ? 'move' : 'copy'} '${src}' to a subdirectory of itself` };
    const parent = c.s.fs.get(parentOf(target));
    if (!parent || parent.type !== 'dir') return { out: '', err: `${cmd}: cannot ${cmd === 'mv' ? 'move' : 'create regular file'} '${dest}': No such file or directory` };
    if (cmd === 'mv' && (c.s.cwd === srcAbs || c.s.cwd.startsWith(srcAbs + '/'))) return { out: '', err: `mv: cannot move '${src}': you are inside it` };
    const moved: [string, Node][] = [];
    for (const [k, v] of c.s.fs) if (k === srcAbs || k.startsWith(srcAbs + '/')) moved.push([target + k.slice(srcAbs.length), v.type === 'file' ? { ...v } : v]);
    if (cmd === 'mv') for (const [k] of [...c.s.fs]) if (k === srcAbs || k.startsWith(srcAbs + '/')) c.s.fs.delete(k);
    for (const [k, v] of moved) c.s.fs.set(k, v);
  }
  return { out: '' };
}

/** Run one command line. Mutates `s`. */
export function runLine(s: ShellState, line: string): RunOutput {
  const trimmed = line.trim();
  if (!trimmed) return { output: '', error: false };
  s.history.push(trimmed);
  let tokens: string[];
  try {
    tokens = tokenize(trimmed);
  } catch (e) {
    return { output: `bash: ${(e as Error).message}\n`, error: true };
  }
  // Split into pipeline stages, pulling out a final redirection.
  let redirect: { mode: '>' | '>>'; file: string } | null = null;
  const ri = tokens.findIndex((t) => t === '>' || t === '>>');
  if (ri >= 0) {
    const file = tokens[ri + 1];
    if (!file || file === '|' || file === '>' || file === '>>') return { output: 'bash: syntax error: expected a file name after ' + tokens[ri] + '\n', error: true };
    if (tokens.length > ri + 2) return { output: 'bash: Loopwise\'s practice terminal only supports > or >> at the end of a command\n', error: true };
    redirect = { mode: tokens[ri] as '>' | '>>', file };
    tokens = tokens.slice(0, ri);
  }
  const stages: string[][] = [[]];
  for (const t of tokens) {
    if (t === '|') stages.push([]);
    else stages[stages.length - 1].push(t);
  }
  if (stages.some((st) => st.length === 0)) return { output: 'bash: syntax error near unexpected token `|\'\n', error: true };

  let stdin: string | null = null;
  let errors = '';
  let clear = false;
  for (const [name, ...args] of stages) {
    const fn = COMMANDS[name];
    if (!fn) {
      const hint = ['ls', 'cd', 'pwd', 'cat', 'mkdir'].find((k) => k.toLowerCase() === name.toLowerCase());
      return { output: `bash: ${name}: command not found${hint ? ` (commands are case-sensitive — did you mean ${hint}?)` : ''}\n`, error: true };
    }
    const r = fn({ s, stdin }, args);
    if (r.err) errors += r.err + '\n';
    if (r.clear) clear = true;
    stdin = r.out;
    if (r.err) break;
  }
  let output = stdin ?? '';
  if (redirect && !errors) {
    const abs = normalizePath(redirect.file, s.cwd);
    const parent = s.fs.get(parentOf(abs));
    const existing = s.fs.get(abs);
    if (!parent || parent.type !== 'dir') errors += `bash: ${redirect.file}: No such file or directory\n`;
    else if (existing?.type === 'dir') errors += `bash: ${redirect.file}: Is a directory\n`;
    else {
      const prev = redirect.mode === '>>' && existing?.type === 'file' ? existing.content : '';
      s.fs.set(abs, { type: 'file', content: prev + output });
    }
    output = '';
  }
  return { output: output + errors, error: errors !== '', clear };
}

// ------------------------------------------------------------------ goals (grading)
export interface ShellGoal {
  /** Must end in this directory (absolute or ~/...). */
  cwd?: string;
  /** Paths that must exist as directories. */
  dirs?: string[];
  /** Paths that must exist as files. */
  files?: string[];
  /** Paths that must NOT exist. */
  missing?: string[];
  /** File path → text it must contain. */
  contains?: Record<string, string>;
  /** File path → exact contents (trailing newline ignored). */
  equals?: Record<string, string>;
  /** Text that must appear somewhere in the session's output. */
  outputIncludes?: string[];
  /** Command names that must have been used at least once (e.g. ['pwd']). */
  used?: string[];
}

export function checkGoal(s: ShellState, goal: ShellGoal, transcript: string): string[] {
  const fails: string[] = [];
  const abs = (p: string) => normalizePath(p, HOME);
  if (goal.cwd && s.cwd !== abs(goal.cwd)) fails.push(`You should end up in ${displayPath(abs(goal.cwd))} (you're in ${displayPath(s.cwd)}).`);
  for (const d of goal.dirs ?? []) if (s.fs.get(abs(d))?.type !== 'dir') fails.push(`The folder ${displayPath(abs(d))} doesn't exist yet.`);
  for (const f of goal.files ?? []) if (s.fs.get(abs(f))?.type !== 'file') fails.push(`The file ${displayPath(abs(f))} doesn't exist yet.`);
  for (const m of goal.missing ?? []) if (s.fs.has(abs(m))) fails.push(`${displayPath(abs(m))} should be gone.`);
  for (const [f, text] of Object.entries(goal.contains ?? {})) {
    const n = s.fs.get(abs(f));
    if (n?.type !== 'file' || !n.content.includes(text)) fails.push(`${displayPath(abs(f))} should contain "${text}".`);
  }
  for (const [f, text] of Object.entries(goal.equals ?? {})) {
    const n = s.fs.get(abs(f));
    if (n?.type !== 'file' || n.content.replace(/\n$/, '') !== text.replace(/\n$/, '')) fails.push(`${displayPath(abs(f))} doesn't have the expected contents.`);
  }
  for (const t of goal.outputIncludes ?? []) if (!transcript.includes(t)) fails.push(`Your commands should display "${t}".`);
  for (const u of goal.used ?? []) if (!s.history.some((h) => h.split(/\s+/)[0] === u || h.split('|').some((p) => p.trim().split(/\s+/)[0] === u))) fails.push(`Use the ${u} command.`);
  return fails;
}

/** Run a list of commands from a fresh setup; returns the state and all output (used by tests). */
export function simulate(setup: ShellSetup | undefined, commands: string[]) {
  const s = createShell(setup);
  let transcript = '';
  for (const c of commands) transcript += runLine(s, c).output;
  return { state: s, transcript };
}
