import sys
import os
import time
from playwright.sync_api import sync_playwright

def run():
    print("Starting verification script...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Set viewport big enough
        page.set_viewport_size({"width": 1280, "height": 900})

        print("Navigating to app...")
        try:
            page.goto("http://localhost:5173")
            page.wait_for_selector("text=Tableau de Bord", timeout=10000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            # Try to screenshot anyway if something loaded
            page.screenshot(path="navigation_failure.png")
            sys.exit(1)

        print("App loaded.")

        # 1. Setup Scenario 1 (Default)
        # Ensure it has some values
        # "Marge & Coût" mode is default or we select it
        page.select_option("select[aria-label='Mode de calcul']", "cost_percent")
        # Set Global Margin to 50%
        page.locator("input[aria-label='Marge Cible Globale']").fill("50")

        # Add item if empty
        if page.locator("text=Commencez par ajouter").is_visible():
             page.click("button:has-text('Ajouter une ligne')")

        # Set Cost to 100
        page.locator("input[aria-label='Coût de la ligne']").first.fill("100")
        # PV should auto-calc to 200

        # 2. Duplicate Scenario
        print("Duplicating scenario...")
        page.click("button[title='Dupliquer ce scénario']")
        # Wait for second card - check input value
        page.wait_for_selector("input[value='Copie de Scénario 1']")

        # 3. Modify Scenario 2
        # Change name
        page.locator("input[aria-label='Nom du scénario']").nth(1).fill("Scénario 2 (Remisé)")
        # Add Discount
        page.locator("input[aria-label='Montant de la remise']").nth(1).fill("10")
        page.locator("button[aria-label='Remise en pourcentage']").nth(1).click()

        # 4. Click Compare
        print("Clicking Compare...")
        page.click("button[aria-label='Comparer les scénarios']")

        # 5. Wait for Modal
        page.wait_for_selector("text=Comparateur de Scénarios")

        # Wait for animation (chart bars)
        time.sleep(1)

        # 6. Take Screenshot
        screenshot_path = "verification_comparison_view.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        # 7. Close Modal
        page.click("button:has(svg.lucide-x)")

        # Verify modal closed
        time.sleep(0.5)
        if page.locator("text=Comparateur de Scénarios").is_visible():
            print("Error: Modal did not close.")
            sys.exit(1)
        else:
            print("Modal closed successfully.")

        browser.close()

if __name__ == "__main__":
    run()
