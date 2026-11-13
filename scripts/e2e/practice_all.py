"""Browser bot: submits the reference solution to every Practice Arena problem.
Usage: DUMP_PROBLEMS=/tmp/problems.json npx vitest run tests/dump-problems.test.ts && python3 scripts/e2e/practice_all.py
"""
import asyncio, json, os, mimetypes, sys
from playwright.async_api import async_playwright
PYDIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "node_modules", "pyodide")
async def serve(route):
    name = route.request.url.split("/pyodide@")[1].split("/", 1)[1].split("?")[0]
    path = os.path.join(PYDIR, name)
    ct = "application/wasm" if name.endswith(".wasm") else ("text/javascript" if name.endswith((".mjs",".js")) else mimetypes.guess_type(name)[0] or "application/octet-stream")
    await route.fulfill(path=path, headers={"content-type": ct, "access-control-allow-origin": "*"})
async def main():
    probs = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "/tmp/problems.json"))
    ok = bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME", "/usr/bin/google-chrome"), args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":1100,"height":900})
        await ctx.route("https://cdn.jsdelivr.net/npm/pyodide@*/**", serve)
        page = await ctx.new_page()
        for pr in probs:
            await page.goto(f"http://localhost:4173/practice/{pr['id']}")
            await page.wait_for_selector(".code-editor .cm-content", timeout=20000)
            await page.evaluate("""(code) => { const v = document.querySelector('.code-editor').cmView; v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: code } }); }""", pr["solution"])
            await page.wait_for_function("() => !document.querySelector('.submit-bar .btn-primary').disabled", timeout=60000)
            await page.locator(".submit-bar .btn-primary").click()
            try:
                await page.wait_for_selector("text=Accepted", timeout=30000); ok += 1
            except Exception:
                bad += 1; print("FAIL", pr["id"]); await page.screenshot(path=f"/tmp/prob-{pr['id']}.png")
        n = await page.evaluate("Object.keys(JSON.parse(localStorage.getItem('loopwise.progress.v1')).problems).length")
        await b.close()
    print(f"practice: {ok} accepted, {bad} failed, {n} recorded as solved")
asyncio.run(main())
