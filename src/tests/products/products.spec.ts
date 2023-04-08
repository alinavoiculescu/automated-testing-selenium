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

    it('All products are successfully sorted alphabetically in ascending order when "Name (A to Z)" is selected', async function () {
        const productNames: string[] = await allPages.products.getProductNames();
        const sortedProductNames: string[] = [...productNames].sort();

        await allPages.products.sortProductsByNameAsc();
        await seleniumWrappers.waitForPageToLoad();

        const sortedProductNamesDisplayed: string[] = await allPages.products.getProductNames();

        assert.deepEqual(
            sortedProductNamesDisplayed,
            sortedProductNames,
            'Expected the products to be sorted alphabetically in ascending order',
        );
        assert(await allPages.products.verifyProductsDisplayedAndVisible(), 'Expected to display all products');
        await allPages.products.scrollDown();
        assert(
            await allPages.products.verifyProductsDisplayedAndVisible(),
            'Expected to display all products after scrolling',
        );
    });

    it('All products are successfully sorted alphabetically in descending order when "Name (Z to A)" is selected', async function () {
        const productNames: string[] = await allPages.products.getProductNames();
        const sortedProductNames: string[] = [...productNames].sort((a, b) => b.localeCompare(a));

        await allPages.products.sortProductsByNameDesc();
        await seleniumWrappers.waitForPageToLoad();

        const sortedProductNamesDisplayed: string[] = await allPages.products.getProductNames();

        assert.deepEqual(
            sortedProductNamesDisplayed,
            sortedProductNames,
            'Expected the products to be sorted alphabetically in descending order',
        );
        assert(await allPages.products.verifyProductsDisplayedAndVisible(), 'Expected to display all products');
        await allPages.products.scrollDown();
        assert(
            await allPages.products.verifyProductsDisplayedAndVisible(),
            'Expected to display all products after scrolling',
        );
    });

    it('All products are successfully sorted ascending by price when "Price (low to high)" is selected', async function () {
        const productPrices: number[] = await allPages.products.getProductPrices();
        const sortedProductPrices: number[] = [...productPrices].sort((a, b) => a - b);

        await allPages.products.sortProductsByPriceAsc();
        await seleniumWrappers.waitForPageToLoad();

        const sortedProductPricesDisplayed: number[] = await allPages.products.getProductPrices();

        assert.deepEqual(
            sortedProductPricesDisplayed,
            sortedProductPrices,
            'Expected the products to be sorted by price in ascending order',
        );
        assert(await allPages.products.verifyProductsDisplayedAndVisible(), 'Expected to display all products');
        await allPages.products.scrollDown();
        assert(
            await allPages.products.verifyProductsDisplayedAndVisible(),
            'Expected to display all products after scrolling',
        );
    });

    it('All products are successfuly sorted descending by price when "Price (high to low)" is selected', async function () {
        const productPrices: number[] = await allPages.products.getProductPrices();
        const sortedProductPrices: number[] = [...productPrices].sort((a, b) => b - a);

        await allPages.products.sortProductsByPriceDesc();
        await seleniumWrappers.waitForPageToLoad();

        const sortedProductPricesDisplayed: number[] = await allPages.products.getProductPrices();

        assert.deepEqual(
            sortedProductPricesDisplayed,
            sortedProductPrices,
            'Expected the products to be sorted by price in descending order',
        );
        assert(await allPages.products.verifyProductsDisplayedAndVisible(), 'Expected to display all products');
        await allPages.products.scrollDown();
        assert(
            await allPages.products.verifyProductsDisplayedAndVisible(),
            'Expected to display all products after scrolling',
        );
    });
});
