import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(record_video_dir="/app/verification/videos")
        page = await context.new_page()

        try:
            # Navigate to the app
            await page.goto("http://localhost:5173/")
            await page.wait_for_timeout(500)

            # Add a row to the first scenario to interact with the inputs
            await page.get_by_role("button", name="Ajouter une ligne").first.click()
            await page.wait_for_timeout(500)

            # Change mode to 'pv_percent' (Marge & PV) to disable Cost
            mode_select = page.get_by_label("Mode de calcul pour Scénario 1")
            await mode_select.select_option("pv_percent")
            await page.wait_for_timeout(1000)

            # Hover over the disabled Cost input to trigger tooltip
            cost_input = page.get_by_label("Coût de la ligne Ligne 1")
            await cost_input.hover()
            await page.wait_for_timeout(1000)

            # Take a screenshot to verify UI visually
            await page.screenshot(path="/app/verification/screenshots/verify_tooltips.png")

            # Change mode to 'cost_percent' (Marge & Coût) to disable PV
            await mode_select.select_option("cost_percent")
            await page.wait_for_timeout(1000)

            # Hover over the disabled PV input to trigger tooltip
            pv_input = page.get_by_label("Prix de vente de Ligne 1")
            await pv_input.hover()
            await page.wait_for_timeout(1000)

            await page.screenshot(path="/app/verification/screenshots/verify_tooltips_pv.png")

        finally:
            await context.close()
            await browser.close()

asyncio.run(run())
