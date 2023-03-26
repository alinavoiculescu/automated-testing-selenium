import { config } from '../../config/config';
import { SeleniumWrappers } from '../wrappers/selenium/SeleniumWrappers';
import { BrowserWrapper } from '../wrappers/browser/BrowserWrapper';
import { Login } from '../../pages/Login';
import { ThenableWebDriver } from 'selenium-webdriver';

export class AllPages {
    public login: Login;

    public seleniumWrappers: SeleniumWrappers;

    constructor(public browserWrapper: BrowserWrapper) {
        this.seleniumWrappers = new SeleniumWrappers(browserWrapper.webDriver);
        this.login = new Login(browserWrapper);
    }

    public getWebDriver() {
        return this.browserWrapper.webDriver;
    }

    public async goToWebsiteAndLogin(webDriver: ThenableWebDriver) {
        await webDriver.get(config.websiteUrl);
        await this.seleniumWrappers.waitForPageToLoad(2000);
        await this.login.login(config.credentials.username, config.credentials.password);
    }

    public async close() {
        await this.browserWrapper.close();
    }
}
