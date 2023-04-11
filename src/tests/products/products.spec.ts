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

    it('All products have their corresponding name, description, image, price and button when comparing the name, description, image, price and button from Products page with the one from details page', async function () {
        const productNames: string[] = await allPages.products.getProductNames();
        for (let i = 0; i < productNames.length; i++) {
            const productName = productNames[i];

            const productNameExpected: string = productName;
            const productDescriptionExpected: string = await allPages.products.getProductDescriptionByName(productName);
            const productImageExpected = await allPages.products.getProductImageByName(productName);
            const productPriceExpected = (await allPages.products.getProductPriceByName(productName)).toString();
            const productButtonExpected = await allPages.products.verifyAddToCartButtonExists(productName);

            await allPages.products.clickProductByName(productName);
            await seleniumWrappers.waitForPageToLoad();

            const productNameDisplayed: string = await allPages.productDetails.getProductTitle();

            assert.strictEqual(
                productNameDisplayed,
                productNameExpected,
                `Expected the name for ${productName} to match the name provided in the list of products`,
            );

            const productDescriptionDisplayed: string = await allPages.productDetails.getProductDescription();

            assert.strictEqual(
                productDescriptionDisplayed,
                productDescriptionExpected,
                `Expected the description for ${productName} to match the description provided in the list of products`,
            );

            const productImageDisplayed = await allPages.productDetails.getProductImage();

            assert.strictEqual(
                productImageDisplayed,
                productImageExpected,
                `Expected the image for ${productName} to match the image provided in the list of products`,
            );

            const productPriceDisplayed: string = (await allPages.productDetails.getProductPrice()).toString();

            assert.strictEqual(
                productPriceDisplayed,
                productPriceExpected,
                `Expected the price for ${productName} to match the price provided in the list of products`,
            );

            const productButtonDisplayed: boolean = await allPages.productDetails.getProductButton();

            assert.strictEqual(
                productButtonDisplayed,
                productButtonExpected,
                `Expected the price for ${productName} to match the price provided in the list of products`,
            );

            await allPages.productDetails.navigateBackToProductsPage();
            await seleniumWrappers.waitForPageToLoad();
        }

        assert(await allPages.products.verifyProductsDisplayedAndVisible(), 'Expected to display all products');
    });

    // it('A product can be added to the Cart when "Add to Cart" button is clicked', async function () {
    //     // Navigate to the "Products" page
    //     //await allPages.navigationMenu.navigateToProducts();

    //     // Get the name of a specific product on the page
    //     const productName = await allPages.products.getProductNames()[0];

    //     // Click on the "Add to Cart" button for the specific product
    //     await allPages.products.addToCart(productName);

    //     // Verify that the "Add to Cart" button is replaced with the "Remove" button for the specific product
    //     assert(
    //         await allPages.products.verifyRemoveButtonDisplayed(productName),
    //         `Expected the "Remove" button to be displayed for product "${productName}"`,
    //     );

    //     // Verify that the cart icon on the page is updated to indicate that the product has been added to the cart
    //     assert(await allPages.navigation.verifyCartIconCount(1), 'Expected the cart icon count to be updated to 1');

    //     // Navigate to the "Cart" page and verify that the product is displayed in the cart
    //     await allPages.navigation.navigateToCart();
    //     assert(
    //         await allPages.cart.verifyProductDisplayed(productName),
    //         `Expected product "${productName}" to be displayed in the cart`,
    //     );
    // });
});
