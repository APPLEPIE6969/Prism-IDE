import time
from playwright.sync_api import sync_playwright

def verify_reset_workspace():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to editor...")
        page.goto("http://localhost:3000/editor")

        # Wait for the editor to load
        page.wait_for_selector("text=WORKSPACE")
        print("Editor loaded.")

        # 1. Create a new file to change state
        print("Creating a new file...")
        page.click("button[title='New File']")
        page.fill("input[placeholder='filename.py']", "test_file.py")
        page.press("input[placeholder='filename.py']", "Enter")

        # Verify file created
        page.wait_for_selector("text=test_file.py")
        print("File created.")

        # 2. Add some content to the file
        # Monaco editor is hard to interact with directly in headless mode sometimes,
        # but we can check if the file is in the list which updates the store.

        # 3. Reload the page to verify persistence
        print("Reloading page...")
        page.reload()
        page.wait_for_selector("text=WORKSPACE")

        # Verify file still exists after reload
        if page.is_visible("text=test_file.py"):
            print("Persistence verified: test_file.py exists after reload.")
        else:
            print("Persistence FAILED: test_file.py missing after reload.")
            exit(1)

        # 4. Click Reset Workspace
        print("Clicking Reset Workspace...")

        # Handle the confirmation dialog
        page.on("dialog", lambda dialog: dialog.accept())

        page.click("button[title='Reset Workspace']")

        # Wait a bit for state update
        time.sleep(1)

        # 5. Verify file is gone
        if not page.is_visible("text=test_file.py"):
             print("Reset verified: test_file.py is gone.")
        else:
             print("Reset FAILED: test_file.py still exists.")
             exit(1)

        # Take a screenshot of the reset state
        print("Taking screenshot...")
        page.screenshot(path="verification_reset.png")

        browser.close()

if __name__ == "__main__":
    # Give Next.js some time to start if it was just launched
    time.sleep(5)
    try:
        verify_reset_workspace()
        print("Verification successful!")
    except Exception as e:
        print(f"Verification failed: {e}")
        exit(1)
