from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to the app
    # The base path is /markUp/
    url = "http://localhost:5173/markUp/"
    print(f"Navigating to {url}")
    page.goto(url)

    # Wait for the app to load
    page.wait_for_selector("h1") # Header

    # Check if empty state is visible
    # We look for the text "Commencez par ajouter des éléments à chiffrer"
    empty_state_text = page.get_by_text("Commencez par ajouter des éléments à chiffrer")
    if empty_state_text.is_visible():
        print("Empty state is visible.")
    else:
        print("Empty state NOT found!")

    # Take screenshot of empty state
    page.screenshot(path="verification_empty_state.png")
    print("Screenshot saved: verification_empty_state.png")

    # Click the "Ajouter une ligne" button in the empty state
    # There are multiple "Ajouter une ligne" buttons (one in header of table, one in empty state).
    # The one in empty state is inside the td.
    # We can target it specifically or just click the visible one.

    # Let's find the button inside the empty state container
    add_button = page.locator("td").filter(has_text="Commencez par ajouter").get_by_role("button", name="Ajouter une ligne")

    if add_button.is_visible():
        print("Clicking 'Ajouter une ligne' button...")
        add_button.click()

        # Wait for a row to appear
        # The row has inputs.
        page.wait_for_selector("input[aria-label='Nom de la ligne']")
        print("Row added.")

        # Take screenshot of state with row
        page.screenshot(path="verification_row_added.png")
        print("Screenshot saved: verification_row_added.png")
    else:
        print("Add button not found in empty state!")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
