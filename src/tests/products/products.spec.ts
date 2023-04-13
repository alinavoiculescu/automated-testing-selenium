/* eslint-disable prettier/prettier */
import { config } from '../../config/config';
import { assert, expect } from 'chai';
import { Browser, ThenableWebDriver } from 'selenium-webdriver';
import { AllPages } from '../../utils/pages/AllPages';
import { Reports } from '../../utils/reports/Reports';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import { ABOUT_PAGE_URL, PRODUCTS_PAGE_ROUTE } from '../../config/constants';

describe.only('Products page tests', function () {
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
    });

    afterEach(async function () {
        await reports.makeReport(this.currentTest);
    });

    after(async function () {
        await seleniumWrappers.waitForPageToLoad();
        await allPages.close();
    });

    describe('User is logged in', function () {
        beforeEach(async function () {
            await allPages.login.login(config.credentials.username, config.credentials.password);
            await seleniumWrappers.waitForPageToLoad();
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
                const productDescriptionExpected: string = await allPages.products.getProductDescriptionByName(
                    productName,
                );
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

        it('A product can be added to the Cart when "Add to Cart" button is clicked', async function () {
            const productNames = await allPages.products.getProductNames();
            const firstProductName = productNames[0];

            const initialShoppingCartValue = await allPages.products.getShoppingCartBadgeValue();
            const initialProductButton = await allPages.products.verifyAddToCartButtonExists(firstProductName);
            const expectedProductButton = !initialProductButton;

            await allPages.products.addToCart(firstProductName);

            const updatedShoppingCartValue = await allPages.products.getShoppingCartBadgeValue();
            const updatedProductButton = await allPages.products.verifyAddToCartButtonExists(firstProductName);

            const shoppingCartValueDifference = updatedShoppingCartValue - initialShoppingCartValue;

            assert.strictEqual(
                1,
                shoppingCartValueDifference,
                `Expected the updated shopping cart value - initial shopping cart value equals to 1`,
            );

            assert.strictEqual(
                expectedProductButton,
                updatedProductButton,
                `Expected the updated product button to be different than the initial button`,
            );

            const productDescription = await allPages.products.getProductDescriptionByName(firstProductName);
            const productPrice = await allPages.products.getProductPriceByName(firstProductName);
            const productButton = await allPages.products.verifyAddToCartButtonExists(firstProductName);

            await allPages.products.goToShoppingCart();

            const productQuantityInCart = await allPages.cart.getProductQuantity(firstProductName);
            assert.strictEqual(1, productQuantityInCart, `Expected the quantity of that product to be 1 in the cart`);

            const cartProductNames = await allPages.cart.getProductNames();
            const cartFirstProductName = cartProductNames[0];

            const cartProductDescription = await allPages.cart.getProductDescriptionByName(cartFirstProductName);
            const cartProductPrice = await allPages.cart.getProductPriceByName(cartFirstProductName);
            const cartProductButton = await allPages.cart.verifyAddToCartButtonExists(cartFirstProductName);

            assert.strictEqual(
                firstProductName,
                cartFirstProductName,
                `Expected the cart product name to be the same as on the product list`,
            );

            assert.strictEqual(
                productDescription,
                cartProductDescription,
                `Expected the cart product description to be the same as on the product list`,
            );

            assert.strictEqual(
                productPrice,
                cartProductPrice,
                `Expected the cart product price to be the same as on the product list`,
            );

            assert.strictEqual(
                expectedProductButton,
                productButton,
                `Expected the cart button to be the same as on the product list`,
            );
        });
    });

    describe('User is logged out', function () {
        it('Cannot access products page when user is not logged in', async function () {
            await webDriver.get(config.websiteUrl + PRODUCTS_PAGE_ROUTE);
            await seleniumWrappers.waitForPageToLoad();
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl, 'Expected redirected URL to not contain Products page route').to.not.include(
                PRODUCTS_PAGE_ROUTE,
            );
            expect(currentUrl, 'Expected redirected URL to be the Login page').to.be.equal(config.websiteUrl);
        });
    });
});
