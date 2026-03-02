from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Wait for app to load
    page.wait_for_selector("text=Tableau de Bord")

    # Click "Ajouter une ligne" in empty state if present
    if page.get_by_text("Commencez par ajouter").is_visible():
        print("Empty state found. Adding a line.")
        page.click("button:has-text('Ajouter une ligne')")

    # Wait for input
    page.wait_for_selector("input[placeholder='Nom...']")

    # Count rows
    rows = page.locator("tbody tr").count()
    print(f"Initial row count: {rows}")

    # Locate an input to press Enter in.
    # We'll use the 'Name' input of the last row.
    # Selector: input[aria-label^='Nom de la ligne'] (starts with)
    # Get the last one
    last_name_input = page.locator("input[aria-label^='Nom de la ligne']").last

    if last_name_input.count() > 0:
        print("Focusing last name input...")
        last_name_input.click()

        print("Pressing Enter...")
        page.keyboard.press("Enter")

        # Wait a bit
        page.wait_for_timeout(1000)

        # Count rows again
        new_rows = page.locator("tbody tr").count()
        print(f"Row count after Enter: {new_rows}")

        if new_rows > rows:
            print("SUCCESS: New row added via Enter key.")
        else:
            print("FAILURE: Enter key did nothing.")
    else:
        print("No inputs found to test.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
