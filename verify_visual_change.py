from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000/markup/")

            # Wait for initial load
            page.wait_for_selector('input[value="Scénario 1"]')

            # Add a second scenario
            print("Adding second scenario...")
            page.get_by_text("Ajouter une comparaison").click()
            page.wait_for_selector('input[value="Scénario 2"]')

            # Add items to both scenarios
            print("Adding items...")
            page.locator('button:has-text("Ajouter une ligne")').first.click()
            page.locator('button:has-text("Ajouter une ligne")').nth(1).click()

            # Wait for animations
            page.wait_for_timeout(1000)

            # Take a screenshot to visualize the state (even though this is an invisible a11y change)
            print("Taking screenshot...")
            page.screenshot(path="verification_accessibility_fix.png", full_page=True)
            print("Screenshot saved to verification_accessibility_fix.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
