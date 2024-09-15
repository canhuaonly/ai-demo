import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:4200/dashboard/nfts")
    page.get_by_role("link", name="Test0004").click()
    page.get_by_text("Assistant✍").click()
    page.get_by_text("文心一言✍").click()
    page.get_by_text("Assistant✍").click()
    page.get_by_text("文心一言✍").click()
    page.get_by_text("Assistant✍").click()
    page.locator("#messageList").get_by_text("大连勇进软件有限公司的英文缩写是**DLYF**。").click()
    expect(page.locator("#messageList")).to_contain_text("他的英文缩写是")

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
