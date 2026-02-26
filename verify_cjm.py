import sys
import os
from playwright.sync_api import sync_playwright

def run():
    print("Starting CJM verification script...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Set viewport - taller to ensure popup is visible
        page.set_viewport_size({"width": 1280, "height": 1200})

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

        # 2. Open CJM Calculator
        print("Opening CJM Calculator...")
        # Note: The button has aria-label='Ouvrir calculateur CJM'
        try:
             # Wait for the button to be visible
             page.wait_for_selector("button[aria-label='Ouvrir calculateur CJM']", state="visible")
             page.click("button[aria-label='Ouvrir calculateur CJM']")
        except Exception as e:
             print(f"Could not find CJM calculator button: {e}")
             page.screenshot(path="verification_cjm_failure.png")
             sys.exit(1)

        # Verify it opened
        try:
            page.wait_for_selector("text=Calcul CJM", timeout=2000)
        except:
             print("Popup did not appear or title is incorrect")
             page.screenshot(path="verification_cjm_failure_popup.png")
             sys.exit(1)

        # Verify Label
        if not page.locator("text=CJM (€/j)").is_visible():
             print("Error: Popup label incorrect, expected 'CJM (€/j)'")
             page.screenshot(path="verification_cjm_failure_label.png")
             sys.exit(1)

        # 3. Enter Values
        print("Entering 400 * 2...")
        # Select by placeholder or label
        page.locator("input[placeholder='ex: 500']").fill("400")
        page.locator("input[placeholder='ex: 3']").fill("2")

        # Check displayed total in popup
        # text=800€ might be split or styled
        if not page.locator("text=800").is_visible():
             print("Error: Popup total incorrect")
             page.screenshot(path="verification_cjm_failure_total.png")
             sys.exit(1)

        # 4. Apply
        print("Clicking Apply...")
        # Force click if needed or ensure it's in view
        try:
            page.screenshot(path="verification_cjm_before_apply.png")
            page.click("button:has-text('Appliquer')", timeout=5000)
        except Exception as e:
            print(f"Failed to click Apply: {e}")
            # Try force click
            print("Trying force click...")
            page.click("button:has-text('Appliquer')", force=True)

        # 5. Verify Item Value
        # The Cost input should now be 800
        # We need to be careful to get the correct input.
        # The row has multiple inputs. Cost input is the first numeric one in the row usually?
        # Let's use the aria-label we added in ScenarioItemRow.jsx
        cost_input = page.locator("input[aria-label^='Coût de']").first
        cost_value = cost_input.input_value()

        if cost_value == "800":
            print("Success: Cost updated to 800")
        else:
            print(f"Error: Cost is {cost_value}, expected 800")
            page.screenshot(path="verification_cjm_failure_value.png")
            sys.exit(1)

        # 6. Screenshot
        page.screenshot(path="verification_cjm_success.png")
        print("Screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run()
