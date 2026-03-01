from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to home page...")
        try:
            page.goto("http://localhost:5173/markUp/")

            # Wait for initial load
            page.wait_for_selector('input[value="Scénario 1"]')

            # Add a second scenario
            print("Adding second scenario...")
            page.get_by_text("Ajouter une comparaison").click()
            page.wait_for_selector('input[value="Scénario 2"]')

            # Add items to both scenarios
            print("Adding items to scenarios...")
            # Scenario 1 - click Add Line
            page.locator('button:has-text("Ajouter une ligne")').first.click()
            # Scenario 2 - click Add Line
            page.locator('button:has-text("Ajouter une ligne")').nth(1).click()

            # Wait for items to appear
            page.wait_for_timeout(500)

            # Check for duplicate aria-labels on critical inputs
            print("Checking for duplicate aria-labels...")

            labels_to_check = [
                "Nom du scénario",
                "Mode de calcul",
                "Marge Cible Globale",
                "Nom de la ligne",
                "Coût de la ligne",
                "Prix de vente de la ligne"
            ]

            issues_found = False
            for label in labels_to_check:
                elements = page.locator(f'[aria-label="{label}"]').all()
                count = len(elements)
                print(f"Found {count} elements with aria-label='{label}'")

                if count > 1:
                    print(f"⚠️  ISSUE: Duplicate aria-label found for '{label}'! ({count} instances)")
                    issues_found = True
                elif count == 0:
                     print(f"ℹ️  Info: No elements found for '{label}' (might be conditional)")

            if issues_found:
                print("\n❌ Accessibility Check Failed: Duplicate aria-labels found. Screen reader users cannot distinguish between inputs.")
            else:
                print("\n✅ Accessibility Check Passed: No duplicate aria-labels found.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
