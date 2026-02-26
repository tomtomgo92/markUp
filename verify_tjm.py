import sys
import os
from playwright.sync_api import sync_playwright

def run():
    print("Starting TJM verification script...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Set viewport
        page.set_viewport_size({"width": 1280, "height": 900})

        print("Navigating to app...")
        try:
            page.goto("http://localhost:5173")
            page.wait_for_selector("text=Tableau de Bord", timeout=10000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            sys.exit(1)

        print("App loaded.")

        # 1. Setup Scenario
        # Add item if empty
        if page.locator("text=Commencez par ajouter").is_visible():
             page.click("button:has-text('Ajouter une ligne')")

        # 2. Open TJM Calculator
        print("Opening TJM Calculator...")
        # Note: The button has aria-label='Ouvrir calculateur TJM'
        # We need to click the first one if there are multiple, but here we expect one item.
        try:
             page.click("button[aria-label='Ouvrir calculateur TJM']")
        except Exception as e:
             print(f"Could not find calculator button: {e}")
             page.screenshot(path="verification_tjm_failure.png")
             sys.exit(1)

        # Verify it opened
        try:
            page.wait_for_selector("text=Calcul TJM", timeout=2000)
        except:
             print("Popup did not appear")
             page.screenshot(path="verification_tjm_failure_popup.png")
             sys.exit(1)

        # 3. Enter Values
        print("Entering 500 * 3...")
        # Select by placeholder or label
        page.locator("input[placeholder='ex: 500']").fill("500")
        page.locator("input[placeholder='ex: 3']").fill("3")

        # Check displayed total in popup
        # text=1500€ might be split or styled, let's look for text containing 1500
        if not page.locator("text=1500").is_visible():
             print("Error: Popup total incorrect")
             page.screenshot(path="verification_tjm_failure_total.png")
             sys.exit(1)

        # 4. Apply
        print("Clicking Apply...")
        page.click("button:has-text('Appliquer')")

        # 5. Verify Item Value
        # The PV input should now be 1500
        pv_input = page.locator("input[aria-label='Prix de vente de la ligne']").first
        pv_value = pv_input.input_value()

        if pv_value == "1500":
            print("Success: PV updated to 1500")
        else:
            print(f"Error: PV is {pv_value}, expected 1500")
            page.screenshot(path="verification_tjm_failure_value.png")
            sys.exit(1)

        # 6. Screenshot
        page.screenshot(path="verification_tjm_success.png")
        print("Screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run()
