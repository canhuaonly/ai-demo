import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:4200/dashboard/nfts")
    page.get_by_role("link", name="Test0004").click()
    expect(page.locator("#userNm")).to_contain_text("Wang")
    expect(page.locator("app-podcast")).to_contain_text("暂无聊天记录，点击左侧对话者，开始聊天！")
    expect(page.locator("#contactNm0")).to_contain_text("文心一言")
    page.get_by_text("Playwright").click()
    expect(page.locator("#messageList")).to_contain_text("Playwright 是一款强大的浏览器自动化工具，可以用于网页测试、爬虫和自动化任务等场景。下面是使用 Playwright 的基本步骤： 1. 安装 Playwright：首先，你需要在你的项目中安装 Playwright。可以通过 npm（Node 包管理器）来安装。在你的项目目录下打开终端，并运行以下命令： ```shell npm install playwright ``` 2. 创建基本脚本：创建一个 JavaScript 文件，例如 `test.js`，并开始编写你的 Playwright 脚本。下面是一个简单的示例脚本，演示如何打开网页、断言页面标题和关闭浏览器实例： ```javascript const { chromium } = require('playwright'); (async () => { // 启动浏览器实例 const browser = await chromium.launch(); // 打开网页 const context = await browser.newContext(); const page = await context.newPage(); // 导航到网页 await page.goto('https://example.com'); // 断言页面标题是否正确 const title = await page.title(); console.log('Page title is:', title); // 输出页面标题 // 断言标题是否符合预期（这里假设预期标题是'Example Domain'） if (title !== 'Example Domain') { throw new Error('Title mismatch!'); // 断言失败抛出错误 } // 关闭浏览器实例和上下文 await browser.close(); // 或 await context.close() 仅关闭上下文而不关闭整个浏览器实例。根据需要选择使用。 })(); // 执行脚本中的异步函数 ``` 运行这个脚本可以使用 `node test.js` 命令。请确保安装了 Node.js 和 Playwright。在执行脚本之前，可能需要确保 Playwright 版本与你的浏览器版本兼容。这可能需要额外的设置和配置，尤其是在 Windows 上运行时可能会遇到一些问题。如果你遇到问题，可以参考官方文档以获取解决方案。此外，Playwright 还支持 Chromium（Webkit）、Firefox 和 WebKit 等浏览器引擎。你可以根据需要选择使用不同的浏览器引擎来运行你的自动化任务。通过 `chromium`、`firefox` 或 `webkit` 模块来调用不同的浏览器引擎。记得在使用之前确保安装了相应的浏览器版本。此外，Playwright 还提供了许多其他功能，如处理 JavaScript 和重定向等特性。可以查看官方文档了解更多功能和配置选项的使用方法。通过使用这些基本功能和其他更高级的特性，你可以轻松地自动化浏览器任务、执行网页测试等任务。")
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
