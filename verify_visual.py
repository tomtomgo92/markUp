import sys
import os
from playwright.sync_api import sync_playwright

def run():
    os.makedirs("/home/jules/verification", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Set viewport big enough to see side-by-side
        page.set_viewport_size({"width": 1280, "height": 1000})

        print("Navigating to app...")
        try:
            page.goto("http://localhost:5173")
            page.wait_for_selector("text=Tableau de Bord", timeout=10000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            sys.exit(1)

        # Setup Scenario 1
        page.select_option("select[aria-label='Mode de calcul']", "cost_percent")
        page.locator("input[aria-label='Marge Cible Globale']").fill("50")
        if page.locator("text=Commencez par ajouter").is_visible():
            page.click("button:has-text('Ajouter une ligne')")
        page.locator("input[aria-label='Coût de la ligne']").first.fill("100")

        # Duplicate
        page.click("button[title='Dupliquer ce scénario']")
        page.wait_for_timeout(1000)

        # Setup Scenario 2 with Discount
        cards = page.locator(".bg-white.rounded-3xl")
        card2 = cards.nth(1)

        card2.locator("input[aria-label='Montant de la remise']").fill("10")
        card2.locator("button[aria-label='Remise en pourcentage']").click()

        page.wait_for_timeout(1000)

        # Take screenshot of the whole page
        screenshot_path = "/home/jules/verification/verification.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
