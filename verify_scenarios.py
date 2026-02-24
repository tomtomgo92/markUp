from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to home page...")
        try:
            page.goto("http://localhost:5173/markUp/")

            # Wait for the initial scenario input
            print("Waiting for initial scenario...")
            page.wait_for_selector('input[value="Scénario 1"]')
            print("Initial scenario found.")

            # Add a new scenario
            print("Adding a new scenario...")
            # The button has text "Ajouter une comparaison"
            page.get_by_text("Ajouter une comparaison").click()

            # Verify new scenario appears (Scénario 2)
            print("Waiting for second scenario...")
            page.wait_for_selector('input[value="Scénario 2"]')
            print("New scenario added.")

            # Update first scenario name
            print("Updating first scenario name...")
            page.locator('input[value="Scénario 1"]').fill("Base Case")

            # Verify update
            print("Verifying update...")
            page.wait_for_selector('input[value="Base Case"]')
            print("Scenario name updated.")

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification_scenarios.png", full_page=True)

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
            print("Error screenshot saved.")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
