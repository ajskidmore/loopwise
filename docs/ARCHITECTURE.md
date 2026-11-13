# Architecture

```
src/
  content/                 ← WHAT is taught
    types.ts               schema: Track → Unit → Lesson → Step, Checkpoint, Problem
    roadmap.ts             every planned track/unit/lesson (structure only)
    lessons/<track>.ts     lesson steps + checkpoints + final exams, keyed by id
    lessons/_helpers.ts    shorthand constructors: ex, mc, ans, ord, fill, py, js, eq, rerun
    index.ts               merges roadmap + lessons; lookups (getLesson, getUnit…)
    problems.ts            Practice Arena problems
  engine/                  ← HOW answers are checked (no React)
    grading.ts             pure graders for every question type
    runner.ts              main-thread API: runCode(), warmup(), timeouts
    python.worker.ts       Pyodide in a module Web Worker
    js.worker.ts           JavaScript in a Web Worker
    pythonHarness.ts       Python code that runs learner code + tests (shared with tests/)
    jsHarness.ts           same for JS
    shell.ts               pretend bash + in-memory file system for terminal exercises (pure, tested)
  player/                  ← the lesson/test experience
    QuizPlayer.tsx         queue, Check button, feedback sheet, hearts
    steps.tsx              one view per step kind
    sfx.ts                 tiny synthesized sounds
  progress/
    model.ts               pure progress logic: XP, streaks, levels, unlocking, mistakes, merging
    achievements.ts        achievements derived from progress (never stored)
    ProgressContext.tsx    React state + localStorage + cross-tab sync + Firebase Auth/Firestore sync
  review.ts                Review mode: turns saved mistakes into a practice session
  search/index.ts          MiniSearch index built at startup
  pages/                   Learn (path), Courses, PlayPages (lesson/checkpoint/final/review), Practice,
                           Welcome (onboarding), Misc (landing, search, profile, login, 404)
  components/              Layout, Pip, Markdown, CodeEditor (CodeMirror 6, lazy), Confetti, ErrorBoundary
tests/                     vitest: content integrity, wiring, snippet outputs, grading, progress model
scripts/e2e/               browser bots: play_all.py, smoke.py, a11y.py (see its README)
public/                    favicon, PWA manifest + icons
docs/                      STATUS (start here), CURRICULUM (generated), CONTENT_GUIDE, DEPLOY
```

## Key ideas

**Structure vs content.** `roadmap.ts` lists every lesson (title, summary, tags) so the whole curriculum is
visible and searchable from day one. Content modules add steps by lesson id. A lesson with steps becomes
`status: 'ready'`. **Never change an id** — saved progress is keyed by it.

**Unlocking.** Unit 1 of every course is open. A unit unlocks when the previous unit's checkpoint is passed
(or, if that unit has no checkpoint, when all its lessons are done). Inside a unit, lessons unlock in order.
Any checkpoint can be taken early to "test out". Course prerequisites are *recommendations*, never locks.

**Running code safely.** Learner code never runs on the page's main thread. Each language has a Web Worker;
`runner.ts` kills and recreates the worker if a run exceeds 8 s. Tests run after the learner's code, in the
same scope, and can read `__output__` (everything printed) and `__source__` (the code itself).
Python = Pyodide (CPython compiled to WebAssembly) from jsDelivr; set `VITE_PYODIDE_URL` to self-host.

**Adding a server-run language later (Java, C, C++…):** add a Firebase Function `runCode` that forwards to a
Judge0/Piston instance (Blaze plan), then in `runner.ts` add a branch for those languages that `fetch`es the
function instead of using a worker. Grading stays the same: return `{output, error, tests}`. Use
`expectedOutput` for those exercises (tests in other languages would need a per-language harness).

**Review & achievements.** When a lesson or checkpoint ends, missed questions are stored in
`progress.mistakes` as keys like `L:py-3-strings#4` (lesson id + step index) and answered-correctly ones are
removed. Because keys use step indexes, **avoid reordering steps in published lessons** (append instead);
stale keys are ignored safely. Achievements are computed from progress, so adding one credits everyone.

**Code splitting.** The landing page and learning path load first. Other pages, the code editor and the
Firebase SDK load on demand (`React.lazy`, `getFirebase()`).

**Progress & accounts.** `model.ts` is pure and unit-tested. Guests save to localStorage. On sign-in the
local copy is merged with Firestore `users/{uid}` (`mergeProgress` never loses data) and later changes save
there (debounced 1.5 s) with a full overwrite (no `merge: true`, so removed keys really disappear). `firestore.rules` only lets a user read/write their own document.

**Design system.** All tokens are CSS variables at the top of `src/index.css` (light + dark). Use
`--primary` / `--success` / `--danger` for button backgrounds, the `-text` versions for text, `-shadow` for the
3D edge, and `--success-fill` / `--gold` / `--fire` only for decoration. Course colors in `roadmap.ts` must keep
≥ 4.5:1 contrast with white (they sit behind white unit-banner text). Chunky "3D"
buttons (bottom box-shadow that collapses when pressed), rounded cards, bold rounded font (Nunito), bright
accents per course. Pip has moods: happy, wave, cheer, sad, think.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server at http://localhost:5173 |
| `npm test` | Content + logic tests (downloads nothing; uses the local `pyodide` package) |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run curriculum` | Regenerate `docs/CURRICULUM.md` from the roadmap |
| `firebase deploy` | Deploy hosting + Firestore rules (see DEPLOY.md) |
