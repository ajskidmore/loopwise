# Browser checks

These drive real Chrome with Playwright. Install once: `pip install playwright` (and have Chrome or Chromium;
set `CHROME=/path/to/chrome` if it isn't at `/usr/bin/google-chrome`).

```bash
npm run build
npx vite preview --port 4173 &            # serve the production build

# 1. Play every written lesson, checkpoint and final exam with the correct answers
DUMP_CONTENT=/tmp/content.json npx vitest run tests/dump-content.test.ts
python3 scripts/e2e/play_all.py /tmp/content.json     # ~15 min for 166 lessons; prints ALL PASSED

# 1a. HTML/CSS exercises: every solution passes its page checks and every starter fails
python3 scripts/e2e/html_checks.py /tmp/content.json

# 1b. Submit every Practice Arena solution
DUMP_PROBLEMS=/tmp/problems.json npx vitest run tests/dump-problems.test.ts
python3 scripts/e2e/practice_all.py /tmp/problems.json

# 2. Key flows (onboarding, wrong answers, Review, failing a test, locks, search, profile) on desktop + mobile
python3 scripts/e2e/smoke.py                          # screenshots in /tmp/smoke-shots

# 3. Accessibility (axe-core, WCAG 2.1 AA) in light + dark mode
python3 scripts/e2e/a11y.py                           # must print 0 serious/critical violations
```

Pyodide is served from `node_modules/pyodide`, so these work without internet.
`smoke.py` follows the exact steps of `fnd-1-what-is-code`; update it if that lesson changes.
