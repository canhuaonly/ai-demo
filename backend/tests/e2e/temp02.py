from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        for browser_type in [p.chromium, p.firefox, p.webkit]:
            print(f'start browser {browser_type.name} ...')
            # playwright默认是无头模式
            #browser = browser_type.launch()
            # 指定为有头模式，方便查看界面
            browser = browser_type.launch(headless=False)

            context = browser.new_context()
            page = browser.new_page()

            # goto baidu homepage
            page.goto('http://www.baidu.com')

            # search something
            page.fill('input[name="wd"]', '法定节假日')
            with page.expect_navigation():
                page.press('input[id="su"]', 'Enter')

            # 等待出现“百度热搜”四个字
            page.wait_for_selector('div[title="百度热搜"]')

            # screenshot
            page.screenshot(path=f'screenshot-{browser_type.name}.png')
            context.close()
            browser.close()

if __name__ == '__main__':
    test()
