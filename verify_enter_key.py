from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Wait for app to load
    page.wait_for_selector("text=Tableau de Bord")

    # Click "Ajouter une ligne" in empty state
    # Use a more generic selector if needed, but text is good
    if page.get_by_text("Commencez par ajouter").is_visible():
        print("Empty state found. Adding a line.")
        page.click("button:has-text('Ajouter une ligne')")
    else:
        print("Empty state not found, assuming rows exist.")

    # Wait for any row input
    page.wait_for_selector("input[placeholder='Nom...']")

    # Count rows
    rows = page.locator("tbody tr").count()
    print(f"Initial row count: {rows}")

    # Find the last row's inputs
    last_row_index = rows - 1
    # We want to focus on an input in the last row.
    # Let's target the 'PV' input (Prix de Vente) which is typically the last editable field before the result.
    # We can find it by placeholder '0' and maybe index.

    # Or rely on the aria-label logic we deduced: "Coût de Ligne X" or "Prix de vente de Ligne X"
    # Let's just grab all inputs with placeholder '0' and take the last one.
    inputs = page.locator("input[placeholder='0']")
    count = inputs.count()
    print(f"Found {count} inputs with placeholder '0'")

    if count > 0:
        last_input = inputs.nth(count - 1)
        print("Focusing last input...")
        last_input.click()

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
