"""
Smoke test for flows the play-all bot doesn't cover: onboarding, wrong answers + re-queue,
Review mode, failing a checkpoint, locked lessons, search, profile, 404 — plus screenshots.
Usage: python3 scripts/e2e/smoke.py   (with `npx vite preview --port 4173` running)
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright, expect

BASE = os.environ.get("BASE", "http://localhost:4173")
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
SHOTS = os.environ.get("SHOTS", "/tmp/smoke-shots")
os.makedirs(SHOTS, exist_ok=True)
checks = []

def ok(name, cond):
    checks.append((name, bool(cond)))
    print(("PASS " if cond else "FAIL ") + name)

async def primary(page):
    await page.locator(".player-bottom .bottom-actions .btn-wide").click()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        for name, vp in [("desktop", {"width": 1280, "height": 860}), ("mobile", {"width": 390, "height": 844})]:
            ctx = await b.new_context(viewport=vp)
            page = await ctx.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            await page.goto(BASE + "/")
            await page.evaluate("localStorage.clear(); localStorage.setItem('loopwise.muted','1')")
            await page.reload()
            await page.screenshot(path=f"{SHOTS}/{name}-landing.png")

            # Onboarding
            await page.get_by_role("link", name="Get started").click()
            await page.get_by_role("button", name="Let's go").click()
            await page.get_by_role("radio", name="Serious").click()
            await page.screenshot(path=f"{SHOTS}/{name}-welcome-goal.png")
            await page.get_by_role("button", name="Continue").click()
            await page.screenshot(path=f"{SHOTS}/{name}-welcome-start.png")
            await page.get_by_role("button", name="brand new").click()
            await page.wait_for_url("**/lesson/fnd-1-what-is-code")
            goal = json.loads(await page.evaluate("localStorage.getItem('loopwise.progress.v1')"))["dailyGoal"]
            ok(f"{name}: onboarding saves daily goal (60)", goal == 60)

            # Lesson with one wrong answer → re-queued at the end
            await primary(page); await primary(page)           # 2 explains
            await page.locator(".choice").nth(0).click()        # WRONG (answer is 1)
            await primary(page)
            await page.wait_for_selector(".status-wrong")
            ok(f"{name}: wrong answer shows correct answer", await page.locator("text=Correct answer:").count() > 0)
            await page.screenshot(path=f"{SHOTS}/{name}-wrong.png")
            await primary(page)                                 # Got it
            # remaining: explain, order, explain, choice(1), choice(1), then requeued choice(1)
            await primary(page)
            for line in ["Pick up two slices of bread", "Open the peanut butter jar", "Spread peanut butter on one slice", "Put the two slices together"]:
                await page.locator(".order-pool .order-line:not([disabled])", has_text=line).first.click()
            await primary(page); await primary(page)
            await primary(page)                                 # explain
            for _ in range(3):
                await page.locator(".choice").nth(1).click(); await primary(page)
                await page.wait_for_selector(".status-correct"); await primary(page)
            await page.wait_for_selector("text=Lesson complete!")
            ok(f"{name}: lesson finishes after re-queued question", True)
            ok(f"{name}: shows First Steps achievement", await page.locator("text=New achievement: First Steps").count() == 1)
            await page.screenshot(path=f"{SHOTS}/{name}-results.png")
            prog = json.loads(await page.evaluate("localStorage.getItem('loopwise.progress.v1')"))
            ok(f"{name}: mistake recorded", list(prog["mistakes"].keys()) == ["L:fnd-1-what-is-code#2"])
            ok(f"{name}: accuracy recorded < 100%", prog["lessons"]["fnd-1-what-is-code"]["bestAccuracy"] < 1)

            # Learn page shows review card; do the review
            await page.goto(BASE + "/learn/foundations")
            await page.wait_for_selector(".unit")
            ok(f"{name}: review card on path", await page.locator("text=Review 1 missed question").count() == 1)
            await page.screenshot(path=f"{SHOTS}/{name}-learn.png", full_page=False)
            await page.goto(BASE + "/review")
            # answer every question correctly by reading the step type
            for _ in range(20):
                await page.wait_for_selector(".player-body .step, .results")
                if await page.locator("text=Review complete!").count():
                    break
                if await page.locator(".choices").count():
                    # find the right choice by trying: use known answers from content via data in page isn't available,
                    # so pick each choice until correct (wrong ones re-queue, which is fine for this test)
                    await page.locator(".choice").nth(1).click()
                elif await page.locator(".order-pool").count():
                    for line in ["Pick up two slices of bread", "Open the peanut butter jar", "Spread peanut butter on one slice", "Put the two slices together"]:
                        await page.locator(".order-pool .order-line:not([disabled])", has_text=line).first.click()
                else:
                    await page.screenshot(path=f"{SHOTS}/{name}-review-unknown.png")
                    print("DEBUG review step:", (await page.locator(".player-body").inner_text())[:300])
                await primary(page)
                await page.wait_for_selector(".status-correct, .status-wrong")
                await primary(page)
            await page.wait_for_selector("text=Review complete!", timeout=10000)
            prog = json.loads(await page.evaluate("localStorage.getItem('loopwise.progress.v1')"))
            ok(f"{name}: review clears the fixed mistake", "L:fnd-1-what-is-code#2" not in prog["mistakes"] and prog["reviews"] == 1)
            await page.screenshot(path=f"{SHOTS}/{name}-review-done.png")

            # Fail a checkpoint by running out of hearts
            await page.goto(BASE + "/checkpoint/fnd-1")
            await page.get_by_role("button", name="Start").click()
            await page.wait_for_selector(".player-body .step")
            for _ in range(3):
                await page.locator(".choice").nth(3 if await page.locator(".choice").count() > 3 else 1).click()
                await primary(page)
                await page.wait_for_selector(".status-wrong, .status-correct")
                await primary(page)
            await page.wait_for_selector("text=Out of hearts", timeout=5000)
            ok(f"{name}: running out of hearts fails the checkpoint", True)
            await page.screenshot(path=f"{SHOTS}/{name}-out-of-hearts.png")

            # Locked lesson
            await page.goto(BASE + "/lesson/py-2-arithmetic")
            await page.wait_for_selector(".results, .player")
            ok(f"{name}: locked lesson is blocked", await page.locator("text=This lesson is locked").count() == 1)

            # Search ranks ready lessons first
            await page.goto(BASE + "/search?q=dictionary")
            first = await page.locator(".search-result").first.inner_text()
            ok(f"{name}: search finds the Dictionaries lesson first", "Dictionaries" in first)
            await page.screenshot(path=f"{SHOTS}/{name}-search.png")

            # Profile and courses
            await page.goto(BASE + "/profile")
            await page.wait_for_selector(".badge-grid")
            ok(f"{name}: profile shows achievements", await page.locator(".badge.earned").count() >= 2)
            await page.screenshot(path=f"{SHOTS}/{name}-profile.png", full_page=True)
            await page.goto(BASE + "/courses")
            await page.wait_for_selector(".course-card")
            await page.screenshot(path=f"{SHOTS}/{name}-courses.png")
            await page.goto(BASE + "/practice")
            await page.wait_for_selector(".problem-row")
            ok(f"{name}: practice lists 33 problems", await page.locator(".problem-row").count() == 33)
            await page.screenshot(path=f"{SHOTS}/{name}-practice.png")
            await page.goto(BASE + "/nope")
            await page.wait_for_selector(".results")
            ok(f"{name}: 404 page", await page.locator("text=Page not found").count() == 1)
            ok(f"{name}: no page errors", not errors)
            if errors: print(errors[:5])
            await ctx.close()
        await b.close()
    failed = [c for c in checks if not c[1]]
    print(f"\n{len(checks) - len(failed)}/{len(checks)} checks passed")
    sys.exit(1 if failed else 0)

asyncio.run(main())
