import { Builder, ThenableWebDriver, Browser } from 'selenium-webdriver';

export class BrowserWrapper {
    webDriver: ThenableWebDriver;

    constructor(browserType: string, options?) {
        const webDriver = new Builder().forBrowser(browserType);

        if (options) {
            switch (browserType) {
                case Browser.CHROME: {
                    webDriver.setChromeOptions(options);
                    break;
                }
                case Browser.EDGE: {
                    webDriver.setEdgeOptions(options);
                    break;
                }
                case Browser.FIREFOX: {
                    webDriver.setFirefoxOptions(options);
                    break;
                }
                case Browser.SAFARI: {
                    webDriver.setSafariOptions(options);
                    break;
                }
                case Browser.INTERNET_EXPLORER: {
                    webDriver.setIeOptions(options);
                    break;
                }
            }
        }
        this.webDriver = webDriver.build();
    }

    public async maximizeWindow() {
        await this.webDriver.manage().window().maximize();
    }

    public async navigate(url: string): Promise<void> {
        await this.webDriver.navigate().to(url);
    }

    public async clearCookies(url?: string): Promise<void> {
        if (url) {
            const currentUrl = await this.webDriver.getCurrentUrl();
            await this.navigate(url);
            await this.webDriver.manage().deleteAllCookies();
            await this.navigate(currentUrl);
        } else {
            await this.webDriver.manage().deleteAllCookies();
        }
    }

    public async close(): Promise<void> {
        await this.webDriver.quit();
    }
}
