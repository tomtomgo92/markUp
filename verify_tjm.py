import os
import sys
from playwright.sync_api import sync_playwright, expect

def main():
    with sync_playwright() as p:
        # Define directories for outputs
        output_dir = "/app/verification"
        video_dir = os.path.join(output_dir, "video")
        os.makedirs(video_dir, exist_ok=True)

        browser = p.chromium.launch(headless=True)
        # Record video
        context = browser.new_context(record_video_dir=video_dir)
        page = context.new_page()

        try:
            # 1. Navigate to the app
            page.goto("http://localhost:5173/")
            page.wait_for_timeout(1000)

            # 2. Add a new row to have something to calculate
            # "Ajouter une ligne"
            add_line_btn = page.get_by_role("button", name="Ajouter une ligne").first
            add_line_btn.click()
            page.wait_for_timeout(500)

            # 3. Open the TJM Calculator
            # Find the calculator button for "Prix" (which is TJM)
            calc_btn = page.get_by_role("button", name="Ouvrir calculateur TJM").first
            calc_btn.click()
            page.wait_for_timeout(500)

            # 4. Verify TJM Modal is open and labels are linked
            # We look for the modal text
            expect(page.get_by_text("Calcul TJM")).to_be_visible()

            # Get the TJM/CJM label and click it
            tjm_label = page.locator("label").filter(has_text="TJM (€/j)")
            tjm_label.click()
            page.wait_for_timeout(500)

            # Verify the TJM input is focused
            tjm_input = page.locator("input[placeholder='ex: 500']")
            expect(tjm_input).to_be_focused()

            # Get the Jours label and click it
            jours_label = page.locator("label").filter(has_text="Jours")
            jours_label.click()
            page.wait_for_timeout(500)

            # Verify the Jours input is focused
            jours_input = page.locator("input[placeholder='ex: 3']")
            expect(jours_input).to_be_focused()

            # Take a screenshot of the opened modal
            screenshot_path = os.path.join(output_dir, "tjm_modal_verification.png")
            page.screenshot(path=screenshot_path)

            # Get the path to the recorded video before closing context
            video_path = page.video.path()
            print(f"Screenshot saved to: {screenshot_path}")
            print(f"Video saved to: {video_path}")

        except Exception as e:
            print(f"Error during verification: {e}")
            sys.exit(1)

        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    main()
