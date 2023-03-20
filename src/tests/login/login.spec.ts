import { config } from '../../config/config';
import { ThenableWebDriver, Browser } from 'selenium-webdriver';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import { Reports } from '../../utils/reports/Reports';
import { AllPages } from '../../utils/pages/AllPages';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { INVALID_USERNAME, INVALID_PASSWORD } from '../../config/constants';
import 'chromedriver';
import { assert } from 'chai';

describe('Login tests', function () {
    let webDriver: ThenableWebDriver;
    let seleniumWrappers: SeleniumWrappers;
    let reports: Reports;
    let allPages: AllPages;
    this.timeout(90000);

    before(async function () {
        allPages = new AllPages(new BrowserWrapper(Browser.CHROME));
        await allPages.browserWrapper.maximizeWindow();
        webDriver = allPages.getWebDriver();
        seleniumWrappers = new SeleniumWrappers(webDriver);
        reports = new Reports(webDriver);
    });

    afterEach(async function () {
        await reports.makeReport(this.currentTest);
    });

    after(async function () {
        await seleniumWrappers.waitForPageToLoad();
        await allPages.close();
    });

    it('Should remain on login page WHEN providing invalid data', async function () {
        await webDriver.get(config.websiteUrl);
        await seleniumWrappers.waitForPageToLoad();
        const loginSuccessfully = await allPages.login.login(INVALID_USERNAME, INVALID_PASSWORD);
        assert(!loginSuccessfully, "It didn't remain on login page when login with invalid data");
    });

    it('Should login WHEN providing valid data', async function () {
        await webDriver.get(config.websiteUrl);
        await seleniumWrappers.waitForPageToLoad();
        const loginSuccessfully = await allPages.login.login(config.credentials.username, config.credentials.password);
        assert(loginSuccessfully, "It didn't login when valid data was received");
    });
});
