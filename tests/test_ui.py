import re
from playwright.sync_api import Page, expect


BASE_URL = "http://localhost:5173"


def login(page: Page):
    page.goto(BASE_URL)

    page.get_by_placeholder("Username").fill("testuser")
    page.get_by_placeholder("Password").fill("Test@123")

    page.get_by_role("button", name="Login").click()

    page.on("dialog", lambda dialog: dialog.accept())

    expect(page.get_by_text("Welcome, testuser!")).to_be_visible()


def test_login(page: Page):
    page.goto(BASE_URL)

    page.get_by_placeholder("Username").fill("testuser")
    page.get_by_placeholder("Password").fill("Test@123")

    page.on("dialog", lambda dialog: dialog.accept())

    page.get_by_role("button", name="Login").click()

    expect(page.get_by_text("Welcome, testuser!")).to_be_visible()


def test_add_product_to_cart(page: Page):
    login(page)

    # Find first Add to Cart button
    page.get_by_role("button", name="Add to Cart").first.click()

    # Verify cart contains product
    expect(page.get_by_text(re.compile(r"Shopping Cart \(1\)"))).to_be_visible()


def test_checkout_page(page: Page):
    login(page)

    page.get_by_role("button", name="Add to Cart").first.click()

    page.get_by_role("button", name="Checkout").click()

    expect(page.get_by_text("Demo Checkout")).to_be_visible()

    expect(page.get_by_placeholder("Email for invoice")).to_be_visible()
    expect(page.get_by_placeholder("Name on Card")).to_be_visible()
    expect(page.get_by_placeholder("Card Number")).to_be_visible()
    expect(page.get_by_placeholder("MM/YY")).to_be_visible()
    expect(page.get_by_placeholder("CVV")).to_be_visible()


def test_successful_dummy_payment(page: Page):
    login(page)

    # Add product
    page.get_by_role("button", name="Add to Cart").first.click()

    # Checkout
    page.get_by_role("button", name="Checkout").click()

    # Enter dummy payment information
    page.get_by_placeholder("Email for invoice").fill(
        "test@example.com"
    )

    page.get_by_placeholder("Name on Card").fill(
        "Test User"
    )

    page.get_by_placeholder("Card Number").fill(
        "4111111111111111"
    )

    page.get_by_placeholder("MM/YY").fill(
        "12/30"
    )

    page.get_by_placeholder("CVV").fill(
        "123"
    )

    # Accept JavaScript payment alert
    page.on("dialog", lambda dialog: dialog.accept())

    # Pay
    page.get_by_role("button", name=re.compile(r"Pay \$")).click()

    # Payment has a 1.5 second setTimeout in your React code
    expect(
        page.get_by_text("Payment Successful!")
    ).to_be_visible(timeout=5000)

    # Verify transaction ID
    expect(
        page.get_by_text("Transaction ID:")
    ).to_be_visible()

    # Verify amount
    expect(
        page.get_by_text("Amount Paid:")
    ).to_be_visible()

    # Verify invoice email
    expect(
        page.get_by_text("test@example.com")
    ).to_be_visible()