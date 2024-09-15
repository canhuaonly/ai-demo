import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:4200/dashboard/nfts")
    page.get_by_role("link", name="Test0003").click()
    page.get_by_role("link", name="Test0004").click()
    page.get_by_text("文心一言").click()
    page.get_by_placeholder("Type your message...").fill("3+4=")
    # 等待
    # with page.expect_navigation():
    page.press('textarea[id="sendInput"]', 'Enter')
    # page.get_by_role("button", name="Send").click()
    # expect(page.get_by_text("Welcome, John")).to_contain_text("4")
    # 等待动态内容加载
    # page.wait_for_selector('div[title="根据基本的数学运算，**1+1=2**。"]')
    expect(page.locator("#messageList")).to_contain_text("7")
    print("Success")
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
