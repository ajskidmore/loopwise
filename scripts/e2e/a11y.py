"""Accessibility audit with axe-core (WCAG 2.1 A/AA). Usage: python3 scripts/e2e/a11y.py (preview server running)."""
import asyncio, os, sys, json
from playwright.async_api import async_playwright
BASE = os.environ.get("BASE", "http://localhost:4173")
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
AXE = open(os.path.join(os.path.dirname(__file__), "..", "..", "node_modules", "axe-core", "axe.min.js")).read()
PAGES = ["/checkpoint/tl-1", "/", "/welcome", "/learn/python-1", "/courses", "/practice", "/practice/two-sum", "/search?q=loops", "/profile", "/login", "/lesson/fnd-1-what-is-code", "/lesson/py-1-hello", "/checkpoint/fnd-1"]

async def main():
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        for scheme in ["light", "dark"]:
            ctx = await b.new_context(viewport={"width": 1280, "height": 900}, color_scheme=scheme)
            page = await ctx.new_page()
            for path in PAGES:
                await page.goto(BASE + path)
                await page.wait_for_timeout(700)
                if path == "/checkpoint/tl-1":
                    # get to the practice-terminal question (3rd) and type a command
                    await page.get_by_role("button", name="Start").click()
                    for idx in (1, 0):
                        await page.locator(".choice").nth(idx).click()
                        await page.locator(".player-bottom .btn-wide").click()
                        await page.wait_for_selector(".status-correct")
                        await page.locator(".player-bottom .btn-wide").click()
                    await page.locator("#term-input").fill("ls")
                    await page.locator("#term-input").press("Enter")
                if path == "/lesson/py-1-hello":
                    for _ in range(2):
                        await page.locator(".player-bottom .btn-wide").click(); await page.wait_for_timeout(150)
                await page.add_script_tag(content=AXE)
                res = await page.evaluate("axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] })")
                for v in res["violations"]:
                    if v["impact"] in ("serious", "critical"):
                        bad += 1
                        print(f"[{scheme}] {path}: {v['id']} ({v['impact']}) — {v['help']}")
                        for n in v["nodes"][:3]:
                            print("     ", n["target"], (n.get("failureSummary") or "")[:160].replace("\n", " "))
            await ctx.close()
        await b.close()
    print(f"{bad} serious/critical violations")
    sys.exit(1 if bad else 0)
asyncio.run(main())
