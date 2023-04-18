import { config } from '../../config/config';
import { assert, expect } from 'chai';
import { Browser, ThenableWebDriver } from 'selenium-webdriver';
import { AllPages } from '../../utils/pages/AllPages';
import { Reports } from '../../utils/reports/Reports';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import { CART_PAGE_ROUTE } from '../../config/constants';

describe.only('Cart page tests', function () {
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
        it('Cannot access cart page when user is not logged in', async function () {
            await webDriver.get(config.websiteUrl + CART_PAGE_ROUTE);
            await seleniumWrappers.waitForPageToLoad(10000);
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl, 'Expected redirected URL to not contain cart page route').to.not.include(
                CART_PAGE_ROUTE,
            );
            expect(currentUrl, 'Expected redirected URL to be the Login page').to.be.equal(config.websiteUrl);
        });
    });

    describe('User is logged in', function () {
        beforeEach(async function () {
            await allPages.login.login(config.credentials.username, config.credentials.password);
            await seleniumWrappers.waitForPageToLoad();
        });

        it('All products can be removed from the Cart', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            const cartProductNames: string[] = await allPages.cart.getProductNames();

            for (let i = 0; i < cartProductNames.length; i++) {
                const initialShoppingBadgeValue = await allPages.cart.getShoppingCartBadgeValue();
                await allPages.cart.removeFromCart(cartProductNames[i]);
                const shoppingBadgeValueAfterRemovedProduct = await allPages.cart.getShoppingCartBadgeValue();
                const deletedProductQuantity = await allPages.cart.getProductQuantity(cartProductNames[i]);
                assert.strictEqual(
                    0,
                    deletedProductQuantity,
                    `Expected the quantity for ${cartProductNames[i]} to be 0 after it was removed from the cart`,
                );

                assert.strictEqual(
                    initialShoppingBadgeValue - 1,
                    shoppingBadgeValueAfterRemovedProduct,
                    `Expected the shopping cart value to be initial value -1`,
                );
            }

            const updatedShoppingCartValue = await allPages.cart.getShoppingCartBadgeValue();
            const expectedShoppingCartValue = 0;

            assert.strictEqual(
                updatedShoppingCartValue,
                expectedShoppingCartValue,
                `Expected the shopping cart value to be updated to 0`,
            );

            const cartProductNamesAfterRemove: string[] = await allPages.cart.getProductNames();

            assert.strictEqual(
                cartProductNamesAfterRemove.length,
                0,
                `Expected all the products have been removed from the cart`,
            );
        });

        it('Random product is being removed from the cart when the “Remove” button is clicked from Cart page', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            const initialShoppingCartValue = await allPages.cart.getShoppingCartBadgeValue();

            const cartProductNames: string[] = await allPages.cart.getProductNames();
            const randomIndex = Math.floor(Math.random() * cartProductNames.length);
            const randomProductName = cartProductNames[randomIndex];

            await allPages.cart.removeFromCart(randomProductName);

            const updatedShoppingCartValue = await allPages.cart.getShoppingCartBadgeValue();
            const expectedShoppingCartValue = initialShoppingCartValue - updatedShoppingCartValue;

            assert.strictEqual(
                1,
                expectedShoppingCartValue,
                `Expected the difference between initial shopping cart value and the current value to be 1`,
            );

            const quantityOfRandomProductAfterRemove = await allPages.cart.getProductQuantity(randomProductName);

            assert.strictEqual(
                quantityOfRandomProductAfterRemove,
                0,
                `Expected the quantity of the random product to be 0 after remove`,
            );
        });

        it('Can place an order', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.goToCheckout();

            await allPages.checkout.fillFirstName('Popescu');
            await allPages.checkout.fillLastName('Robertto');
            await allPages.checkout.fillPostalCode('123');

            await allPages.checkout.continueToCheckoutOverview();
            await allPages.checkoutOverview.placeOrder();
        });
    });
});
