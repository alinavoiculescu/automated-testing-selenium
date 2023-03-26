import { config } from '../../config/config';
import { ThenableWebDriver, Browser } from 'selenium-webdriver';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import { Reports } from '../../utils/reports/Reports';
import { AllPages } from '../../utils/pages/AllPages';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import 'chromedriver';
import { assert, expect } from 'chai';
import { ABOUT_PAGE_URL, CART_PAGE_ROUTE, PRODUCTS_PAGE_ROUTE } from '../../config/constants';

describe('Navigation Menu tests', function () {
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

    it('Clicking on the menu button opens the navigation menu', async function () {
        assert(!(await allPages.navigationMenu.isMenuOpened()), 'Expected menu to be closed');
        await allPages.navigationMenu.openMenu();
        assert(
            await allPages.navigationMenu.isMenuOpened(),
            'Expected menu to open after clicking on menu button from upper left corner',
        );
    });

    it('Clicking on the X menu button closes the navigation menu', async function () {
        await allPages.navigationMenu.openMenu();
        assert(await allPages.navigationMenu.isMenuOpened(), 'Expected menu to be opened');
        await allPages.navigationMenu.closeMenu();
        assert(!(await allPages.navigationMenu.isMenuOpened()), 'Expected menu to close after clicking on X button');
    });

    it('Clicking on the "All Items" option from the menu opens Products page', async function () {
        await webDriver.get(config.websiteUrl + CART_PAGE_ROUTE);
        const clickedSuccessfully = await allPages.navigationMenu.clickOnAllItemsOption();
        assert(clickedSuccessfully, 'Expected user to be redirected to another page');
        const currentUrl = await webDriver.getCurrentUrl();
        expect(currentUrl, 'Expected the redirected page to be Products page').to.contain(PRODUCTS_PAGE_ROUTE);
    });

    it('Clicking on the "About" option from the menu opens About page', async function () {
        const clickedSuccessfully = await allPages.navigationMenu.clickOnAboutOption();
        assert(clickedSuccessfully, 'Expected user to be redirected to another page');
        const currentUrl = await webDriver.getCurrentUrl();
        expect(currentUrl, 'Expected the redirected page to be About page').to.eq(ABOUT_PAGE_URL);
    });

    it('Clicking on the "Reset App State" option from the menu deletes all products from cart', async function () {
        // TODO
    });

    it('Clicking on the "Logout" option from the menu logs user out and opens Login page', async function () {
        const clickedSuccessfully = await allPages.navigationMenu.clickOnLogoutOption();
        assert(clickedSuccessfully, 'Expected user to be redirected to another page');
        const currentUrl = await webDriver.getCurrentUrl();
        expect(currentUrl, 'Expected the redirected page to be Login page').to.eq(config.websiteUrl);
    });
});
