# Loopwise — Project Status & Handoff

> **Read this first when continuing in a new session.** Update it at the end of every session.
> Last updated: **2026-11-13** (session 5: Firebase setup + first deploy, Probability & Statistics, Linear Algebra, Calculus, JavaScript, Web and SQL courses + HTML/CSS preview + SQL runner)
>
> **Live:** https://loopwise-de7e1.web.app · **Repo:** https://github.com/ajskidmore/loopwise (public)

## What Loopwise is

A free, Duolingo-style learning platform that takes a complete beginner (no coding, no advanced math) to
"ready for a CS master's" (target: Georgia Tech OMSCS-level). Bite-sized lessons, real code running in the
browser, a checkpoint test to finish every unit, a final exam to finish every course, a LeetCode-style
Practice Arena, Review mode, achievements, full-text search, and accounts that save progress. Hosted on Firebase.

Owner: A.J. (a beginner at hand-coding, so docs and code comments should stay plain-spoken).
Mascot: **Pip**, an original round purple robot with a loop-shaped antenna (`src/components/Pip.tsx`).
Never imitate Duolingo's owl or any other brand's character.

## Decisions made

| Topic | Decision |
|---|---|
| Name | **Loopwise** (placeholder; easy to rename: search "loopwise" / "Loopwise") |
| Stack | Vite + React 19 + TypeScript, React Router, Firebase Auth + Firestore + Hosting |
| Code execution | **Browser-first.** Python via Pyodide (jsDelivr CDN) and JavaScript in Web Workers. Java/C/C++/Go/Rust need a server **later** (Judge0/Piston behind a Firebase Function, Blaze plan). Until then those courses are reading + quizzes. |
| Math | **Full math track** mixed in with the coding |
| Repo | Public GitHub repo `ajskidmore/loopwise` (made public 2026-11-13) (personal account). Pushes are pinned to `ajskidmore` in the repo's local git config. |
| Hosting | **Deployed** to Firebase project `loopwise-de7e1` (personal account ajskidless@gmail.com): Hosting + Auth (Email/Password, Google) + Firestore `(default)` in `us-central1`. The app still works fully in guest mode. |
| Cost | Free tier (Spark plan) is enough: static hosting + Auth + Firestore; code runs in the learner's browser |
| Lessons | Wrong answers re-queue at the end of the lesson; no hearts in lessons (beginner-friendly) |
| Tests | Checkpoints and finals: 3 hearts, pass at 80%; any checkpoint can be taken early to "test out" |
| Accessibility | WCAG 2.1 AA: 0 serious/critical axe violations in light + dark mode (keep it that way: `scripts/e2e/a11y.py`) |

## Current state

**Courses fully written (every lesson + every checkpoint + final exam):**
- 🧠 `foundations` How Computers Think — 3 units, 12 lessons
- 🔢 `math-0` Math Refresher — 4 units, 15 lessons
- 🐍 `python-1` Python Basics — 8 units, 34 lessons
- 🛠️ `tools` Developer Tools — 3 units, 11 lessons (command line is hands-on in the practice terminal; Git; editor/packages/venv)
- 🐉 `python-2` Python Intermediate — 6 units, 19 lessons (exceptions, files, modules, OOP, recursion, testing, generators)
- ♾️ `discrete-math` Discrete Math — 7 units, 26 lessons (logic, proofs, sets/functions/relations, counting, graphs, number theory/RSA, recurrences)
- 🧱 `data-structures` Data Structures — 6 units, 18 lessons (arrays/linked lists, stacks/queues, hash tables, trees/BSTs/balancing, heaps, graphs/tries/union-find)
- ⚙️ `algorithms` Algorithms — 8 units, 31 lessons (Big-O, searching/sorting, two pointers/sliding window/prefix sums/backtracking, divide & conquer + Master Theorem, greedy, dynamic programming, BFS/DFS/topo sort/Dijkstra/MST/Bellman–Ford, P vs NP/reductions/approximation)
- 🎲 `prob-stats` Probability & Statistics — 3 units, 9 lessons (probability rules, conditional probability/independence, Bayes, random variables, expected value/variance, binomial/uniform/normal, descriptive stats, sampling/CLT, hypothesis tests/p-values/confidence intervals)
- 📐 `linear-algebra` Linear Algebra — 3 units, 9 lessons (vectors, magnitude, dot product/cosine similarity, matrices, matrix multiplication as transformations, systems/Gaussian elimination, determinants/inverses, span/basis/rank, eigenvalues/eigenvectors, data matrices/linear models/PCA intuition). Plain Python lists, no numpy.
- 📈 `calculus` Calculus Essentials — 3 units, 8 lessons (limits, derivatives as slopes, power/product/chain rules, optimization, partial derivatives and gradients, gradient descent, integrals as Riemann sums, fundamental theorem). Answers are numbers, not formulas, so they grade reliably.
- ⚡ `javascript` JavaScript — 5 units, 13 lessons (console.log/let/const/template literals, types and ===, if/loops/FizzBuzz, functions and arrow functions, arrays with map/filter/reduce, objects and JSON, the DOM and XSS safety, events, callbacks and the event loop, promises and async/await, fetch and status codes, TypeScript types, interfaces and generics). The JS runner is synchronous with no DOM, so DOM/event/async exercises are plain functions with fake objects, and the TypeScript unit is explain + quiz.
- 🌐 `web-1` Web Basics: HTML & CSS — 2 units, 9 lessons (tags/links/images, page structure and semantic tags, forms, accessible HTML, selectors and the cascade, box model, flexbox, grid, responsive design/media queries). Hands-on with the new live HTML/CSS preview.
- 🗄️ `sql` SQL & Databases — 3 units, 9 lessons (SELECT/WHERE/ORDER BY, aggregates/GROUP BY/HAVING, JOINs incl. LEFT JOIN, INSERT/UPDATE/DELETE, CREATE TABLE and keys, normalization 1NF–3NF, indexes/B-trees, transactions/ACID). Real SQLite (sql.js) in the browser against a small sample shop (`SHOP` in `src/content/lessons/sql.ts`).

Totals: **223 lessons, 64 checkpoints, 14 final exams, 33 practice problems** (of 306 lessons planned across 24 courses). The whole "CS core" a master's program assumes (programming, discrete math, data structures, algorithms) is now written.

**Features:**
- Learning path with unlocking, test-out checkpoints, final exams; course switcher; "up next" card
- Question types: explain, multiple choice, fill-in-the-blank (word bank or typed), order-the-lines, short answer, **live code** (Python + JS) with hidden tests, **practice terminal** (simulated bash: ls/cd/mkdir/mv/cp/rm/grep/wc/head/tail/sort, pipes, > and >>; `src/engine/shell.ts`), hints, show-solution after 2 failures; 8-second infinite-loop guard
- Onboarding (`/welcome`): daily goal + starting point
- XP, perfect bonus, replay XP, levels, daily goal ring, streaks, weekly chart
- **Review mode** (`/review`): missed questions are saved and practiced until right; topped up with random questions from finished lessons
- **19 achievements** (derived from progress, never stored) with "New achievement" on results screens
- Practice Arena with difficulty/topic filters; Search (MiniSearch) with available content ranked first
- Accounts (Google + email, password reset) with guest→cloud merge; progress syncs between browser tabs
- Error boundary (friendly crash screen + "new version" detection), confetti, sounds (mutable), dark mode
- Installable as an app (PWA manifest + icons; no offline service worker yet)
- Code-split: Firebase and the code editor load only when needed

**Quality checks (all passing):**
- `npm test` — structure, wiring, every correct answer grades correct, wrong choices grade wrong, every "What does this print?" snippet is run in real Python and its output matches the answer, every code solution passes and every starter fails
- `scripts/e2e/play_all.py` — a bot plays **all 61 lessons, 15 checkpoints and 3 finals** in real Chrome with real Python
- `scripts/e2e/smoke.py` — 30 checks: onboarding, wrong answers/re-queue, Review, failing a checkpoint, locks, search, profile, 404 (desktop + mobile)
- `scripts/e2e/a11y.py` — axe-core WCAG 2.1 AA audit of 12 pages, light + dark

**Known gaps:**
- Not yet checked on the live site: password reset email, guest→cloud merge when a guest with progress signs in, sync between two devices, Google sign-in (the walkthrough was done once with one sign-in method), and phones.
- The browser checks in `scripts/e2e/` (play_all, smoke, a11y) were not rerun against the live site this session (setup only, no app changes).
- Fonts load from Google Fonts; Pyodide from jsDelivr (~10 MB first run, then cached). On the live site Pyodide loads from jsDelivr fine.
- No server code runner (Java/C/C++)
- On Node 20, Vitest crashes while *printing* a failed test (`Map.groupBy is not a function`), hiding the details. Workaround: `npx vitest run --reporter=json --outputFile=/tmp/vt.json`. Upgrading to Node 22+ fixes it (and `npm run curriculum`).
- No offline mode (service worker), leaderboards, friends or reminders/notifications yet
- `input()` isn't supported in exercises yet (stdin is wired in the engine but has no UI)

## Next steps (in priority order)

1. Finish the live checks listed under "Known gaps" (password reset, Google sign-in, guest→cloud merge, a phone).
2. Content, in path order:
   - `c-systems`, `architecture-os`, `networks-security`, `theory`, `software-engineering`, `ml-intro`, `grad-ready`
3. A simple Git simulator for the practice terminal (init/add/commit/log/branch) to make tl-2 hands-on
4. Leaderboard (weekly XP, opt-in), reminders, offline service worker, server runner for Java/C/C++

## How to continue in a new session

1. Unzip / clone, `npm install`, `npm test`, `npm run dev`.
2. Read `docs/ARCHITECTURE.md` and `docs/CONTENT_GUIDE.md`.
3. Write the next unit in a new `src/content/lessons/<track>-<n>.ts`, register it in `src/content/index.ts`.
4. Run `npm test`, then the browser checks in `scripts/e2e/README.md`.
5. Update this file.

## Deployment and setup notes (session 5)

- **Updating the site:** `npm run build && firebase deploy --only hosting`. Rules changes: `firebase deploy --only firestore:rules`.
- **Firebase web config** lives in `.env.local` (never committed; `.gitignore` covers it). Web app id
  `1:611330314060:web:431f53e553c1e6561649e9`. Get the values again with `firebase apps:sdkconfig web <appId>`.
- **Accounts:** the Firebase CLI is set to `ajskidless@gmail.com` for this folder (`firebase login:use`); gcloud uses the
  `personal` configuration. Never use the Eudo work accounts here.
- **npm on this Mac:** `~/.npmrc` contains `os=linux`, which makes npm install the Linux build tools (rolldown) and
  breaks tests/builds. Until that line is removed, install with `npm install --os=darwin --cpu=x64`.
- The Firestore API had to be turned on with `gcloud services enable firestore.googleapis.com` before the database could be created.

**Verified on the live site (2026-11-13):**
- Site loads with no console errors; lesson `py-1-hello` plays: multiple choice graded right, Python exercise ran
  in Pyodide (printed `Hello, world!`) and was graded correct.
- A.J. created an account, finished a lesson, signed out and back in: progress came back.
- Firestore has the `users/{uid}` document (fields `progress`, `displayName`, `updatedAt`; 10 XP, `py-1-hello` done).
- Security rules: signed-out reads of `users/*` return "Missing or insufficient permissions". Rules test API
  (same engine as the console's Rules Playground): a user can read their own doc; reading, updating or deleting
  another user's doc and listing all users are all denied.
- `npm test`: 36 passed (2 skipped are on-demand content dump helpers). `npm run build` passes (chunk-size warnings only).

## Session log

- **Session 5:** Firebase setup and first deploy: created the web app, Firestore and Auth, deployed Hosting +
  rules, verified end to end, created the GitHub repo (now public). Then wrote **Probability & Statistics**
  (`src/content/lessons/prob-stats.ts`): 9 lessons, 3 checkpoints, 1 final exam, all numbers checked in Python.
  `npm test` passes; play_all (prob-stats only: 9 lessons, 3 checkpoints, final) ALL PASSED; smoke 30/30; a11y
  0 serious/critical. `docs/CURRICULUM.md` was NOT regenerated: `npm run curriculum` needs Node 22.6+
  (`--experimental-strip-types`) and this Mac has Node 20. Run it after upgrading Node.
  Then wrote **Linear Algebra** (`src/content/lessons/linear-algebra.ts`): 9 lessons, 3 checkpoints, 1 final exam.
  Same checks: `npm test` passes; play_all (linear-algebra only) ALL PASSED; smoke 30/30; a11y 0 serious/critical.
  Then wrote **Calculus Essentials** (`src/content/lessons/calculus.ts`): 8 lessons, 3 checkpoints, 1 final exam, same
  checks, all passing. The math track (math-0, discrete, prob-stats, linear-algebra, calculus) is now complete.
  Then wrote **JavaScript** (`src/content/lessons/javascript.ts`): 13 lessons, 5 checkpoints, 1 final exam. `npm test` doesn't
  run JS "What does this print?" snippets, so all 36 were run in Node by hand (0 mismatches). The bot caught two word-bank
  questions that needed the same word twice (unanswerable: each chip can be used once); fixed, and `tests/content.test.ts`
  now fails on that pattern. play_all (javascript only) ALL PASSED; smoke 30/30; a11y 0 serious/critical.
  Then built the **HTML/CSS live preview** (`src/engine/htmlHarness.ts`, wired in `runner.ts`, preview in
  `src/player/steps.tsx`; new dependency `@codemirror/lang-html` for syntax colors) and wrote **Web Basics**
  (`src/content/lessons/web-1.ts`): 9 lessons, 2 checkpoints, 1 final exam. Verified: new `scripts/e2e/html_checks.py`
  (12 HTML exercises: solutions pass, starters fail) ALL PASSED; a `<script>`/`onerror` page can't run code in the
  parent; near-miss CSS (blue for navy) is graded wrong; play_all (web-1) ALL PASSED; smoke 30/30; a11y 0
  serious/critical, plus axe on the HTML exercise screen in light + dark: 0 violations.
  Then built the **SQL runner** (`src/engine/sqlHarness.ts` + `sql.worker.ts`, sql.js pinned to 1.15.2 because 1.16.0
  was only 3 days old; wasm is bundled, ~340 KB gzipped, loaded only for SQL lessons; `@codemirror/lang-sql` for colors;
  new optional `setup` field on code steps) and wrote **SQL & Databases** (`src/content/lessons/sql.ts`): 9 lessons,
  3 checkpoints, 1 final. `npm test` now runs SQL solutions/starters in real SQLite, and a new test runs every
  "What does this query return?" question against the sample data (it caught one wrong answer, fixed). New
  `tests/sql.test.ts` (7 runner tests). play_all (sql) ALL PASSED; smoke 30/30; a11y 0; axe on the SQL exercise
  screen in light + dark: 0 violations.

- **Session 1:** planned the curriculum (24 courses / 306 lessons); built the app, lesson engine, Python/JS
  runners, progress + accounts, search, Practice Arena, Pip and the design system; 16 lessons + 7 problems.
- **Session 4:** wrote Data Structures (18) and Algorithms (31) — 49 lessons, 14 checkpoints, 2 finals;
  14 new Practice Arena problems (33 total, first "hard" ones). New helpers `raises` and `fast` (speed tests);
  content tests now abort deliberately-slow starters via `__perf_probe__` instead of hanging.
- **Session 3:** built the practice terminal (simulated shell + new `terminal` exercise type, tests, bot
  support); wrote Developer Tools (11), Python Intermediate (19) and Discrete Math (26) — 56 lessons,
  16 checkpoints, 3 final exams. Content tests now also verify terminal solutions.
- **Session 2:** finished Foundations, Python Basics and the Math Refresher (61 lessons, 15 checkpoints,
  3 final exams); added Review mode, achievements, onboarding, confetti, error boundary, PWA manifest,
  password reset, cross-tab sync, lazy loading; 12 new problems (19 total); full WCAG AA contrast pass
  (new color tokens, darker course colors); content tests that run every snippet; browser bots for all content,
  key flows and accessibility. Fixed: cloud saves used `merge: true`, which would never delete removed keys.
