/* eslint-disable prettier/prettier */
import { config } from '../../config/config';
import { assert, expect } from 'chai';
import { Browser, ThenableWebDriver } from 'selenium-webdriver';
import { AllPages } from '../../utils/pages/AllPages';
import { Reports } from '../../utils/reports/Reports';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';

describe('Products page tests', function () {
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

    it('Products are successfully displayed when products page is accessed', async function () {
        await allPages.products.scrollDown();
        assert(await allPages.products.verifyProductsDisplayedAndVisible(), 'Expected to display all products');
    });

    /*
  let browserWrapper: BrowserWrapper;
  let loginPage: Login;
  let productsPage: Products;

  beforeAll(async () => {
    browserWrapper = new BrowserWrapper();
    loginPage = new Login(browserWrapper);
    productsPage = new Products(browserWrapper);
    await loginPage.navigateTo();
    await loginPage.login('username', 'password');
  });

  it('should scroll down to see all products', async () => {
    await productsPage.navigateTo();
    await productsPage.scrollDown();
    expect(await productsPage.verifyProductsDisplayed()).toBeTruthy();
  });
  */
});
