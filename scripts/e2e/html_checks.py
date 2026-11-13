"""
Browser check for HTML/CSS exercises: for EVERY html code step (lessons, checkpoints, finals, problems),
render the reference solution and the starter in real Chrome and run the lesson's page checks.
The solution must pass every check; the starter must fail at least one.

`npm test` can't do this (Node has no browser to render pages), so run this after changing HTML content.

Usage (from the project root):
  DUMP_CONTENT=/tmp/content.json npx vitest run tests/dump-content.test.ts
  npm run build && npx vite preview --port 4173 &
  python3 scripts/e2e/html_checks.py /tmp/content.json

The app exposes window.__loopwiseRunHtml only when localStorage "loopwise.e2e" is "1" (see src/engine/runner.ts).
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

BASE = os.environ.get("BASE", "http://localhost:4173")
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")


def html_steps(content):
    for track in content:
        for unit in track["units"]:
            for lesson in unit["lessons"]:
                for i, s in enumerate(lesson.get("steps") or []):
                    yield f"{lesson['id']}#{i}", s
            if unit.get("checkpoint"):
                for i, s in enumerate(unit["checkpoint"]["questions"]):
                    yield f"{unit['id']}-checkpoint#{i}", s
        if track.get("finalExam"):
            for i, s in enumerate(track["finalExam"]["questions"]):
                yield f"{track['id']}-final#{i}", s


async def main(content_path):
    content = json.load(open(content_path))
    steps = [(w, s) for w, s in html_steps(content) if s.get("kind") == "code" and s.get("language") == "html"]
    failures = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        page = await b.new_page()
        await page.goto(BASE + "/learn")
        await page.evaluate("localStorage.setItem('loopwise.e2e', '1')")
        # A lesson page loads the code runner, which installs the test hook.
        await page.goto(BASE + "/lesson/fnd-1-what-is-code")
        await page.wait_for_function("() => typeof window.__loopwiseRunHtml === 'function'", timeout=20000)
        for where, s in steps:
            good = await page.evaluate("([c, t]) => window.__loopwiseRunHtml(c, t)", [s["solution"], s["tests"]])
            bad_checks = [t for t in good["tests"] if not t["passed"]]
            if good["error"] or bad_checks:
                failures.append(f"{where}: solution fails — {good['error'] or bad_checks}")
            start = await page.evaluate("([c, t]) => window.__loopwiseRunHtml(c, t)", [s["starter"], s["tests"]])
            if not start["error"] and all(t["passed"] for t in start["tests"]):
                failures.append(f"{where}: starter already passes every check")
        await b.close()
    print(f"Checked {len(steps)} HTML exercises (solution passes, starter fails).")
    if failures:
        print(f"{len(failures)} FAILURE(S):")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("ALL PASSED")


asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/content.json"))
