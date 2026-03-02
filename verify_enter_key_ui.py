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

    # Focus on the name of the first row
    page.click("input[aria-label^='Nom de la ligne']")
    page.keyboard.type("Item 1")

    # Press Enter
    print("Pressing Enter...")
    page.keyboard.press("Enter")

    # Wait a bit
    page.wait_for_timeout(500)

    # Check if a second row appeared
    rows = page.locator("tbody tr")
    if rows.count() == 2:
        print("SUCCESS: Second row added.")
        # Type in the second row to show it's usable
        page.locator("input[aria-label^='Nom de la ligne']").nth(1).click()
        page.keyboard.type("Item 2 (Added via Enter)")
    else:
        print("FAILURE: Second row did not appear.")

    # Screenshot
    page.screenshot(path="verification_enter_key_ui.png")
    print("Screenshot saved: verification_enter_key_ui.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
