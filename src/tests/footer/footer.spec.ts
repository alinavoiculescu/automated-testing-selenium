import { config } from '../../config/config';
import { ThenableWebDriver, Browser } from 'selenium-webdriver';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import { Reports } from '../../utils/reports/Reports';
import { AllPages } from '../../utils/pages/AllPages';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import 'chromedriver';
import { assert, expect } from 'chai';

describe('Footer tests', function () {
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

    beforeEach(async function () {
        await webDriver.get(config.websiteUrl);
        await allPages.login.login(config.credentials.username, config.credentials.password);
        await seleniumWrappers.waitForPageToLoad();
    });

    afterEach(async function () {
        await reports.makeReport(this.currentTest);
    });

    after(async function () {
        await seleniumWrappers.waitForPageToLoad();
        await allPages.close();
    });

    const websiteFunctions = {
        twitter: async () => {
            return await allPages.footer.clickOnTwitterIcon();
        },
        facebook: async () => {
            return await allPages.footer.clickOnFacebookIcon();
        },
        linkedin: async () => {
            return await allPages.footer.clickOnLinkedinIcon();
        },
    };

    for (const websiteName in websiteFunctions) {
        it(`Clicking on the ${websiteName} icon redirects user to ${websiteName} website`, async function () {
            const userWasRedirected = await websiteFunctions[websiteName]();
            await seleniumWrappers.waitForPageToLoad();
            const newUrl = await webDriver.getCurrentUrl();
            assert(userWasRedirected, 'Expected user to be redirected to another website');
            expect(newUrl, `Expected user to be redirected to ${websiteName} website`).to.contain(websiteName);
        });
    }
});
