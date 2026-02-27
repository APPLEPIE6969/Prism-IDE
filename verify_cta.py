import time
from playwright.sync_api import sync_playwright

def verify_new_quiz_link():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to homepage...")
        page.goto("http://localhost:3000")

        # Wait for the hero section to load
        page.wait_for_selector("text=Code at the Speed of Thought")
        print("Homepage loaded.")

        # Find the New Quiz button
        # It's an anchor tag with the specific href
        quiz_link = page.locator("a[href='https://tiktok-kappa-steel.vercel.app/quiz/generator']")

        # Check if it exists and has the correct text
        if quiz_link.is_visible() and "New Quiz" in quiz_link.inner_text():
            print("New Quiz link found with correct text and href.")
        else:
            print("New Quiz link NOT found or incorrect.")
            exit(1)

        # Take a screenshot of the homepage
        print("Taking screenshot...")
        page.screenshot(path="verification_homepage.png")

        browser.close()

if __name__ == "__main__":
    try:
        verify_new_quiz_link()
        print("Verification successful!")
    except Exception as e:
        print(f"Verification failed: {e}")
        exit(1)
