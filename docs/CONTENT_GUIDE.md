# Writing lessons

## The teaching rules

1. **Assume zero.** Never use a word or symbol before it's been taught. If you must, explain it on the spot.
2. **One idea per screen.** An `explain` step is short (≤ ~120 words). Then *immediately* practice it.
3. **Explain → recognize → produce.** Show it, ask a multiple-choice question about it, then make the learner
   type/write it (`fill`, `answer`, `code`).
4. **~8–10 steps per lesson**, at least half of them questions. A lesson should take 3–6 minutes.
5. **Every explanation answers "why".** Wrong-answer explanations teach, they don't just say "wrong".
6. **Friendly, plain voice.** Short sentences. Use `tip` for Pip's encouragement or a key insight.
7. **Checkpoint = 8–10 questions** covering every lesson in the unit, mostly `answer`/`code`, a little harder
   than the lessons. Pass at 80%, 3 hearts.
8. **Math lessons** use small numbers, show the work in the explanation, and connect to code when possible.

## Where things go

- Add/rename lessons in `src/content/roadmap.ts` (structure). Ids are permanent once published.
- Write steps in `src/content/lessons/<track-id>.ts`, exporting `lessons`, `checkpoints`, `finalExams`.
- A new content file must be added to `CONTENT_MODULES` in `src/content/index.ts`.
- Run `npm test` — it checks ids, answer indexes, blanks, and runs every code solution in real Python/JS.
- Then run the browser bot (`scripts/e2e/README.md`) — it plays every lesson in Chrome.

## Shorthand helpers (`src/content/lessons/_helpers.ts`)

New lesson files use these — they build exactly the objects shown in the next section:

```ts
ex('Title', 'Markdown body', 'optional Pip tip')
mc('Prompt', ['choice A', 'choice B'], 1, 'Why B is right', 'optional python code shown above')
ans('Prompt', ['accepted', 'answers'], 'Explanation', 'optional python code')
ord('Prompt', ['line 1', 'line 2', 'line 3'], 'Explanation')        // correct order
fill('Prompt', 'print(___)', [['answer']], 'Explanation', ['word', 'bank'])
py({ prompt, starter, expectedOutput, tests, hints, solution })
term({ prompt, setup: { dirs, files, cwd }, goal: { cwd, dirs, files, missing, contains, equals, outputIncludes, used }, hints, solution: ['cmd', …] })
mcT / ansT / fillT                   // same as mc / ans / fill but code is labeled plain text (shell, git, pseudocode)
eq('area(3, 4)', '12')               // test: expression == value, with a friendly failure message
rerun('n', '7', 'odd')               // test: re-run the program with `n = 7` and check it prints "odd"
raises('withdraw(5, 9)', 'ValueError') // test: the expression must raise this exception
fast(setup, expr, seconds, name)     // test: expr must finish in time (catches O(n²) when O(n) is required)
```

Speed tests (`fast`) should use inputs where the intended complexity finishes in well under a second but the
naive one takes much longer; keep `seconds` generous (1.5–3) because browsers vary. An exercise may start
with deliberately slow code — `npm test` aborts it after 3 s via `__perf_probe__`.

Use `rerun` whenever an exercise branches on a starting value, so hard-coding the expected output fails.
Pseudocode snippets (Foundations) must be labeled `language: 'text'` — see `foundations-2.ts`.

**"What does this print?" questions are executed by `npm test`.** If a prompt starts with "What does this
print/show" and its Python snippet runs, the real output must match the answer.

**Practice terminal goals** are checked against the pretend file system after the learner's commands
(paths may use `~`). `npm test` runs each `solution` from the `setup` and requires it to pass — and requires
the untouched setup to fail. Supported commands are listed at the top of `src/engine/shell.ts`.

**Don't reorder steps in a published lesson** — saved mistakes point at step positions. Add new steps at the end.

## Step types (see `src/content/types.ts`)

```ts
{ kind: 'explain', title: 'Variables', body: 'Markdown **text** with `code`', tip: 'Optional Pip tip' }

{ kind: 'choice', prompt: 'What prints?', code: 'print(2+2)', language: 'python',
  choices: ['4', '2+2'], answer: 0, explanation: 'Why 4 is right.' }

{ kind: 'fill', prompt: 'Complete it', template: '___("hi")', answers: [['print']],
  bank: ['print', 'say', 'show'], explanation: '…' }         // bank optional; omit → typed blanks

{ kind: 'order', prompt: 'Put in order', lines: ['first', 'second', 'third'], explanation: '…' }
                                                            // lines in the CORRECT order; UI shuffles

{ kind: 'answer', prompt: 'What is 7 % 3?', accept: ['1'], explanation: '…' }
                                                            // numericTolerance: 0.01 for decimals

{ kind: 'code', prompt: 'Print Hello', language: 'python', starter: '# your code\n',
  expectedOutput: 'Hello',                                  // and/or tests:
  tests: [{ name: 'x is 5', code: 'assert x == 5, "Set x to 5"' }],
  hints: ['Hint 1', 'Hint 2'], solution: 'print("Hello")' }
```

Markdown supported in text: paragraphs, `- lists`, ```` ```code blocks``` ````, `| tables |`, `**bold**`,
`*italic*`, `` `code` ``.

### Code test tips
- Tests run after the learner's code in the same scope (Python: copy of globals; JS: same function scope).
- `__output__` = everything printed; `__source__` = the learner's code (use it to forbid shortcuts like `max(`).
- Python: use `assert cond, "friendly message"`. JS: use `assert(cond, "friendly message")`.
- The starter must **fail** and the solution must **pass** — `npm test` enforces both.

## Practice problems

Add to `src/content/problems.ts`: id, title, difficulty (`intro|easy|medium|hard`), tags, the track it
reinforces, and a `code` step. Prefer function-based problems with 3–5 tests including edge cases, plus a
performance test for medium/hard ones.
