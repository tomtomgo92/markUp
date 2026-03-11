from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to app
        page.goto("http://localhost:5173/")
        page.wait_for_selector(".max-w-7xl") # Wait for main content to load

        # Take a screenshot
        page.screenshot(path="verification.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_app()
