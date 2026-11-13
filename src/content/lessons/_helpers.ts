/**
 * Shorthand constructors for writing lessons compactly. They produce plain Step objects,
 * exactly like writing the object literals by hand (see docs/CONTENT_GUIDE.md).
 *
 *   ex(title, body, tip?)                         explain card
 *   mc(prompt, choices, answer, explanation, code?) multiple choice (code shown above choices)
 *   ans(prompt, accept, explanation, code?)        short typed answer
 *   ord(prompt, linesInCorrectOrder, explanation)  put lines in order
 *   fill(prompt, template, answers, explanation, bank?)  fill the ___ blanks
 *   py({...}) / js({...})                          live code exercise
 */
import type { AnswerStep, ChoiceStep, CodeStep, ExplainStep, FillStep, OrderStep } from '../types';

export const ex = (title: string, body: string, tip?: string): ExplainStep => ({ kind: 'explain', title, body, ...(tip ? { tip } : {}) });

export const mc = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  kind: 'choice', prompt, choices, answer, explanation, ...(code ? { code, language: 'python' as const } : {}),
});

export const ans = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  kind: 'answer', prompt, accept, explanation, ...(code ? { code, language: 'python' as const } : {}),
});

export const ord = (prompt: string, lines: string[], explanation: string, language?: 'python' | 'text'): OrderStep => ({
  kind: 'order', prompt, lines, explanation, ...(language ? { language } : {}),
});

export const fill = (prompt: string, template: string, answers: string[][], explanation: string, bank?: string[]): FillStep => ({
  kind: 'fill', prompt, template, answers, explanation, language: 'python', ...(bank ? { bank } : {}),
});

type CodeArgs = Omit<CodeStep, 'kind' | 'language' | 'starter'> & { starter?: string };
export const py = (a: CodeArgs): CodeStep => ({ kind: 'code', language: 'python', starter: '', ...a });
export const js = (a: CodeArgs): CodeStep => ({ kind: 'code', language: 'javascript', starter: '', ...a });

/** Build a test that checks a Python expression equals an expected value, with a readable failure. */
export const eq = (expr: string, expected: string, name?: string) => ({
  name: name ?? `${expr} == ${expected}`,
  code: `__v = ${expr}\nassert __v == ${expected}, f"expected ${expected.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/{/g, '{{').replace(/}/g, '}}')}, got {__v!r}"`,
});

/**
 * Re-run the learner's program with a different starting value and check what it prints.
 * Replaces the first top-level line `VAR = ...` with `VAR = newValue`.
 * Example: rerun('n', '7', 'odd') — "with n = 7 your code should print odd".
 */
export const rerun = (variable: string, newValue: string, expectedOutput: string, name?: string) => ({
  name: name ?? `with ${variable} = ${newValue} it prints ${expectedOutput.replace(/\n/g, ' / ')}`,
  code: [
    'import io, re, contextlib',
    `__src2, __n = re.subn(r"^${variable}\\s*=.*$", ${JSON.stringify(`${variable} = ${newValue}`)}, __source__, count=1, flags=re.M)`,
    `assert __n == 1, "Keep the line that sets ${variable} at the top of your code"`,
    '__buf = io.StringIO()',
    'with contextlib.redirect_stdout(__buf):',
    '    exec(__src2, {"__name__": "__main__"})',
    `assert __buf.getvalue().strip() == ${JSON.stringify(expectedOutput)}, f"With ${variable} = ${newValue.replace(/"/g, '\\"')} it should print ${expectedOutput.replace(/\n/g, ' / ').replace(/"/g, '\\"')}, but printed {__buf.getvalue().strip()!r}"`,
  ].join('\n'),
});

/** Practice-terminal exercise (see src/engine/shell.ts for the supported commands). */
export const term = (a: Omit<import('../types').TerminalStep, 'kind'>): import('../types').TerminalStep => ({ kind: 'terminal', ...a });

/** Plain-text variants for shell/git snippets (so they aren't labeled "python"). */
export const mcT = (prompt: string, choices: string[], answer: number, explanation: string, code?: string): ChoiceStep => ({
  ...mc(prompt, choices, answer, explanation), ...(code ? { code, language: 'text' as const } : {}),
});
export const ansT = (prompt: string, accept: string[], explanation: string, code?: string): AnswerStep => ({
  ...ans(prompt, accept, explanation), ...(code ? { code, language: 'text' as const } : {}),
});
export const fillT = (prompt: string, template: string, answers: string[][], explanation: string, bank?: string[]): FillStep => ({
  ...fill(prompt, template, answers, explanation, bank), language: 'text',
});

/** Test: evaluating `expr` must raise the exception `exc`. */
export const raises = (expr: string, exc: string, name?: string) => ({
  name: name ?? `${expr} raises ${exc}`,
  code: `try:\n    ${expr}\nexcept ${exc}:\n    pass\nelse:\n    raise AssertionError("${expr.replace(/\\/g, '\\\\').replace(/"/g, '\\"')} should raise ${exc}")`,
});

/**
 * Test: running `setup` then `expr` must finish within `seconds` (catches O(n²) where O(n) is expected).
 * When the content tests check a deliberately slow STARTER they define `__perf_probe__`, which turns on
 * a tracer that aborts after 3 seconds (the browser does the same with its 8-second worker timeout).
 */
export const fast = (setup: string, expr: string, seconds: number, name: string) => ({
  name,
  code: [
    'import time, sys',
    setup,
    '__t0 = time.perf_counter()',
    'if globals().get("__perf_probe__"):',
    '    def __lw_tr(frame, event, arg):',
    '        if time.perf_counter() - __t0 > 3:',
    '            raise TimeoutError("too slow")',
    '        return __lw_tr',
    '    sys.settrace(__lw_tr)',
    'try:',
    ...expr.split('\n').map((l) => '    ' + l),
    'finally:',
    '    sys.settrace(None)',
    '__dt = time.perf_counter() - __t0',
    `assert __dt < ${seconds}, f"took {__dt:.2f}s — too slow; look for a faster approach"`,
  ].join('\n'),
});
