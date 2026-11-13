# Notes for Claude (and any AI assistant) working on Loopwise

- Start every session by reading `docs/STATUS.md`; update it before you finish.
- The owner is a beginner at hand-coding: explain changes plainly and keep code well-commented.
- Lesson ids in `src/content/roadmap.ts` are permanent (progress is keyed by them).
- Follow `docs/CONTENT_GUIDE.md` when writing lessons. Run `npm test` and `npm run build` before handing off.
- After changing the roadmap, run `npm run curriculum` to regenerate `docs/CURRICULUM.md`.
- Pip is an original mascot — never imitate Duolingo's owl or other brands' characters.
- Before handing off, also run the browser checks in `scripts/e2e/README.md` (play_all, smoke, a11y).
- Keep WCAG 2.1 AA: use the `-text` color tokens for text; course colors need ≥ 4.5:1 contrast with white.
- Don't reorder steps in published lessons (Review-mode keys use step positions) — append instead.
