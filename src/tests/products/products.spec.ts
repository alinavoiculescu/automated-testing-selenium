import { config } from '../../config/config';
import { assert, expect } from 'chai';
import { Browser, ThenableWebDriver } from 'selenium-webdriver';
import { AllPages } from '../../utils/pages/AllPages';
import { Reports } from '../../utils/reports/Reports';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import { PRODUCTS_PAGE_ROUTE } from '../../config/constants';

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
    });

    afterEach(async function () {
        await reports.makeReport(this.currentTest);
    });

    after(async function () {
        await seleniumWrappers.waitForPageToLoad();
        await allPages.close();
    });

    describe('User is logged out', function () {
        it('Cannot access products page when user is not logged in', async function () {
            await webDriver.get(config.websiteUrl + PRODUCTS_PAGE_ROUTE);
            await seleniumWrappers.waitForPageToLoad(10000);
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl, 'Expected redirected URL to not contain Products page route').to.not.include(
                PRODUCTS_PAGE_ROUTE,
            );
            expect(currentUrl, 'Expected redirected URL to be the Login page').to.be.equal(config.websiteUrl);
        });
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

        it('All products have prices greater than 0', async function () {
            const productNames = await allPages.products.getProductNames();
            for (const productName of productNames) {
                const productPrice = await allPages.products.getProductPriceByName(productName);
                expect(
                    productPrice,
                    `Expected price for product "${productName}" (${productPrice}$) to be greater than 0"`,
                ).to.be.greaterThan(0);
            }
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
                cartProductButton,
                `Expected the cart button to be the same as on the product list`,
            );
        });

        it('A product can be removed from the Cart when "Remove item" button is clicked', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            let findRemoveButtonProductName = '';
            let findRemoveButton = true;
            for (let i = 0; i < productNames.length; i++) {
                const currentProductName = productNames[i];
                const haveAddToCartButton = await allPages.products.verifyAddToCartButtonExists(currentProductName);

                if (!haveAddToCartButton) {
                    findRemoveButtonProductName = currentProductName;
                    findRemoveButton = haveAddToCartButton;
                    break;
                }
            }

            const productNameWithRemoveButton = findRemoveButtonProductName;
            const productRemoveButton = findRemoveButton;

            const initialShoppingCartValue = await allPages.products.getShoppingCartBadgeValue();
            const expectedShoppingCartValue = initialShoppingCartValue - 1;
            const expectedButton = !productRemoveButton;

            await allPages.products.removeFromCart(productNameWithRemoveButton);

            const actualShoppingCartValue = await allPages.products.getShoppingCartBadgeValue();
            const actualButton = await allPages.products.verifyAddToCartButtonExists(productNameWithRemoveButton);

            assert.strictEqual(
                actualShoppingCartValue,
                expectedShoppingCartValue,
                `Expected the cart value from products to be equal to initial shopping cart value - 1`,
            );

            assert.strictEqual(
                actualButton,
                expectedButton,
                `Expected the product button to be add to cart instead of remove`,
            );

            await allPages.products.goToShoppingCart();

            const productQuantityInCart = await allPages.cart.getProductQuantity(productNameWithRemoveButton);
            assert.strictEqual(0, productQuantityInCart, `Expected the quantity of that product to be 0 in the cart`);
        });

        it('All products can be added to the Cart when "Add to Cart" button is clicked for each one', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            const cartProductNames: string[] = await allPages.cart.getProductNames();

            expect(productNames).to.deep.equal(cartProductNames, 'Expected all the products to be added to the cart');
        });

        it('All products can be removed from the Cart when "Remove" button is clicked for each one', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.removeFromCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            const cartProductNames: string[] = await allPages.cart.getProductNames();

            assert.strictEqual(cartProductNames.length, 0, `Expected all the products have been removed from the cart`);
        });

        it('All products can be added to the Cart from product details when "Add to Cart" button is clicked for each one', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                const productName = productNames[i];

                await allPages.products.clickProductByName(productName);
                await seleniumWrappers.waitForPageToLoad();

                await allPages.productDetails.addToCart();

                await allPages.productDetails.navigateBackToProductsPage();
                await seleniumWrappers.waitForPageToLoad();
            }

            await allPages.products.goToShoppingCart();

            const cartProductNames: string[] = await allPages.cart.getProductNames();

            expect(productNames).to.deep.equal(cartProductNames, 'Expected all the products to be added to the cart');
        });

        it('All products can be removed to the Cart from product details when "Remove" button is clicked for each one', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                const productName = productNames[i];

                await allPages.products.clickProductByName(productName);
                await seleniumWrappers.waitForPageToLoad();

                await allPages.productDetails.removeFromCart();

                await allPages.productDetails.navigateBackToProductsPage();
                await seleniumWrappers.waitForPageToLoad();
            }

            await allPages.products.goToShoppingCart();

            const cartProductNames: string[] = await allPages.cart.getProductNames();

            assert.strictEqual(cartProductNames.length, 0, `Expected all the products have been removed from the cart`);
        });
    });
});
