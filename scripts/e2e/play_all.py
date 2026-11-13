"""
Browser bot: plays EVERY written lesson, checkpoint and final exam in order with the correct
answers, in real Chrome, and reports anything that doesn't reach a "correct" state.

Usage (from the project root):
  DUMP_CONTENT=/tmp/content.json npx vitest run tests/dump-content.test.ts
  npm run build && npx vite preview --port 4173 &
  python3 scripts/e2e/play_all.py /tmp/content.json

Needs: pip install playwright (and a Chrome/Chromium). Pyodide is served from node_modules,
so no internet is needed.
"""
import asyncio, json, os, re, sys, mimetypes, time
from playwright.async_api import async_playwright

BASE = os.environ.get("BASE", "http://localhost:4173")
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PYDIR = os.path.join(ROOT, "node_modules", "pyodide")
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
SHOTS = os.environ.get("SHOTS", "/tmp/e2e-shots")
os.makedirs(SHOTS, exist_ok=True)

async def serve_pyodide(route):
    name = route.request.url.split("/pyodide@")[1].split("/", 1)[1].split("?")[0]
    path = os.path.join(PYDIR, name)
    if not os.path.exists(path):
        return await route.fulfill(status=404, body="not found")
    ct = "application/wasm" if name.endswith(".wasm") else ("text/javascript" if name.endswith((".mjs", ".js")) else mimetypes.guess_type(name)[0] or "application/octet-stream")
    await route.fulfill(path=path, headers={"content-type": ct, "access-control-allow-origin": "*"})

def exact(text):
    return re.compile("^\\s*" + re.escape(text.strip()) + "\\s*$")

async def click_primary(page):
    btn = page.locator(".player-bottom .bottom-actions .btn-wide")
    await btn.click()

async def answer_step(page, step):
    k = step["kind"]
    if k == "explain":
        return
    if k == "choice":
        await page.locator(".choices .choice").nth(step["answer"]).click()
    elif k == "fill":
        if step.get("bank"):
            for ans in step["answers"]:
                target = ans[0] if ans[0] in step["bank"] else next(a for a in ans if a in step["bank"])
                await page.locator(".chips .chip:not([disabled])").filter(has_text=exact(target)).first.click()
        else:
            for i, ans in enumerate(step["answers"]):
                await page.locator(".blank-input").nth(i).fill(ans[0])
    elif k == "order":
        for line in step["lines"]:
            await page.locator(".order-pool .order-line:not([disabled])").filter(has_text=exact(line)).first.click()
    elif k == "answer":
        await page.locator(".answer-input").fill(step["accept"][0])
    elif k == "terminal":
        for cmd in step["solution"]:
            await page.locator("#term-input").fill(cmd)
            await page.locator("#term-input").press("Enter")
    elif k == "code":
        await page.wait_for_selector(".code-editor .cm-content", timeout=20000)
        await page.evaluate("""(code) => { const el = document.querySelector('.code-editor'); const v = el.cmView;
            v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: code } }); }""", step["solution"])

async def play(page, steps, label, failures):
    try:
        return await _play(page, steps, label, failures)
    except Exception as e:
        failures.append(f"{label}: bot error {str(e).splitlines()[0][:200]}")
        await page.screenshot(path=f"{SHOTS}/{label}-error.png")
        return False

async def _play(page, steps, label, failures):
    for i, step in enumerate(steps):
        await page.wait_for_selector(".player-bottom .bottom-actions .btn-wide:not([disabled])" if step["kind"] == "explain" else ".player-body .step", timeout=20000)
        await answer_step(page, step)
        btn = page.locator(".player-bottom .bottom-actions .btn-wide")
        try:
            await page.wait_for_function("() => { const b = document.querySelector('.player-bottom .bottom-actions .btn-wide'); return b && !b.disabled; }", timeout=60000)
        except Exception:
            failures.append(f"{label} step {i} ({step['kind']}): Check button never enabled")
            await page.screenshot(path=f"{SHOTS}/{label}-{i}.png")
            return False
        await btn.click()
        if step["kind"] == "explain":
            continue
        try:
            await page.wait_for_selector(".player-bottom.status-correct, .player-bottom.status-wrong", timeout=60000)
        except Exception:
            failures.append(f"{label} step {i} ({step['kind']}): no feedback after Check")
            await page.screenshot(path=f"{SHOTS}/{label}-{i}.png")
            return False
        if await page.locator(".player-bottom.status-wrong").count():
            failures.append(f"{label} step {i} ({step['kind']}): correct answer graded WRONG — {json.dumps(step)[:160]}")
            await page.screenshot(path=f"{SHOTS}/{label}-{i}.png")
            return False
        await click_primary(page)  # Continue
    return True

async def main(content_path):
    content = json.load(open(content_path))
    failures, counts = [], {"lessons": 0, "checkpoints": 0, "finals": 0, "steps": 0}
    t0 = time.time()
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": 1100, "height": 900})
        await ctx.route("https://cdn.jsdelivr.net/npm/pyodide@*/**", serve_pyodide)
        page = await ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        await page.goto(BASE + "/learn")
        await page.evaluate("localStorage.clear(); localStorage.setItem('loopwise.muted', '1')")
        for track in content:
            for unit in track["units"]:
                for lesson in unit["lessons"]:
                    await page.goto(f"{BASE}/lesson/{lesson['id']}")
                    ok = await play(page, lesson["steps"], lesson["id"], failures)
                    if ok:
                        try:
                            await page.wait_for_selector("text=Lesson complete!", timeout=10000)
                            counts["lessons"] += 1
                            counts["steps"] += len(lesson["steps"])
                        except Exception:
                            failures.append(f"{lesson['id']}: no results screen")
                if unit["checkpoint"]:
                    await page.goto(f"{BASE}/checkpoint/{unit['id']}")
                    await page.get_by_role("button", name="Start").click()
                    if await play(page, unit["checkpoint"]["questions"], unit["id"] + "-checkpoint", failures):
                        try:
                            await page.wait_for_selector("text=Checkpoint passed", timeout=10000)
                            counts["checkpoints"] += 1
                        except Exception:
                            failures.append(f"{unit['id']} checkpoint: did not pass")
            if track["finalExam"]:
                await page.goto(f"{BASE}/final/{track['id']}")
                await page.get_by_role("button", name="Start").click()
                if await play(page, track["finalExam"]["questions"], track["id"] + "-final", failures):
                    try:
                        await page.wait_for_selector("text=Course complete", timeout=10000)
                        counts["finals"] += 1
                    except Exception:
                        failures.append(f"{track['id']} final: did not pass")
        prog = json.loads(await page.evaluate("localStorage.getItem('loopwise.progress.v1')"))
        await b.close()
    print(f"Played {counts} in {time.time() - t0:.0f}s. XP={prog['xp']} lessons={len(prog['lessons'])} units={len(prog['units'])} tracks={len(prog['tracks'])}")
    errs = [e for e in errors if "favicon" not in e and "fonts.g" not in e and "net::ERR" not in e]
    if errs:
        print("PAGE ERRORS:", errs[:10])
    if failures:
        print(f"{len(failures)} FAILURE(S):")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("ALL PASSED")

asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/content.json"))
