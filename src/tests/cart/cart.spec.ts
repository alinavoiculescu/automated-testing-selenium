import { config } from '../../config/config';
import { assert, expect } from 'chai';
import { Browser, ThenableWebDriver, until } from 'selenium-webdriver';
import { AllPages } from '../../utils/pages/AllPages';
import { Reports } from '../../utils/reports/Reports';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import {
    CART_PAGE_ROUTE,
    ORDER_HEADER_TEXT,
    ORDER_TEXT,
    PRODUCTS_PAGE_ROUTE,
    REQUIRED_FIRST_NAME,
} from '../../config/constants';

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

        it('All products are being removed from the cart when the "Remove" button is clicked for each one from "Cart" page', async function () {
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
                    `Expected the shopping cart value to be initial value - 1`,
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

        it('Random product is being removed from the cart when the “Remove” button is clicked from "Cart" page', async function () {
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

        it('An order can be placed when "Finish" button from checkout overview is clicked', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.scrollDown();

            await allPages.cart.goToCheckout();

            await allPages.checkout.fillFirstName('Popescu');
            await allPages.checkout.fillLastName('Robertto');
            await allPages.checkout.fillPostalCode('123');

            await allPages.checkout.continueToCheckoutOverview();
            await allPages.checkoutOverview.placeOrder();

            await seleniumWrappers.waitForPageToLoad();
            expect(
                await seleniumWrappers.isDisplayed(allPages.checkoutComplete.iconOrder),
                'Expected the icon to be displayed',
            ).to.be.true;

            expect(
                await seleniumWrappers.isDisplayed(allPages.checkoutComplete.headerOrder),
                'Expected the order header to be displayed',
            ).to.be.true;

            const headerOrderElement = await webDriver.findElement(allPages.checkoutComplete.headerOrder);
            const headerOrderText = await headerOrderElement.getText();

            expect(headerOrderText, `Expected order header text to be "${ORDER_HEADER_TEXT}"`).to.be.equal(
                ORDER_HEADER_TEXT,
            );

            expect(
                await seleniumWrappers.isDisplayed(allPages.checkoutComplete.textOrder),
                'Expected the order text to be displayed',
            ).to.be.true;

            const textOrderElement = await webDriver.findElement(allPages.checkoutComplete.textOrder);
            const textOrderText = await textOrderElement.getText();

            expect(textOrderText, `Expected order text to be "${ORDER_TEXT}"`).to.be.equal(ORDER_TEXT);
        });

        it('Home page is displayed when "Back Home" button is clicked after a successfully placed order', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.scrollDown();

            await allPages.cart.goToCheckout();

            await allPages.checkout.fillFirstName('Popescu');
            await allPages.checkout.fillLastName('Robertto');
            await allPages.checkout.fillPostalCode('123');

            await allPages.checkout.continueToCheckoutOverview();
            await allPages.checkoutOverview.placeOrder();

            await seleniumWrappers.waitForPageToLoad();

            expect(
                await seleniumWrappers.isDisplayed(allPages.checkoutComplete.backHomeButton),
                'Expected the back to home button to be displayed',
            ).to.be.true;

            await allPages.checkoutComplete.goToHome();

            await seleniumWrappers.waitForPageToLoad();
            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl, 'Expected redirected URL to contain Products page route').to.include(
                PRODUCTS_PAGE_ROUTE,
            );
        });

        it('The cart is empty after finishing an order', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.scrollDown();

            await allPages.cart.goToCheckout();

            await allPages.checkout.fillFirstName('Popescu');
            await allPages.checkout.fillLastName('Robertto');
            await allPages.checkout.fillPostalCode('123');

            await allPages.checkout.continueToCheckoutOverview();
            await allPages.checkoutOverview.placeOrder();

            await seleniumWrappers.waitForPageToLoad();

            await allPages.checkoutComplete.goToHome();

            await seleniumWrappers.waitForPageToLoad();
            const currentUrl = await webDriver.getCurrentUrl();

            expect(currentUrl, 'Expected redirected URL to contain Products page route').to.include(
                PRODUCTS_PAGE_ROUTE,
            );

            const updatedShoppingBadgeValue = await allPages.products.getShoppingCartBadgeValue();

            assert.strictEqual(updatedShoppingBadgeValue, 0, `Expected the shopping badge value to be 0`);

            await allPages.products.goToShoppingCart();
            await seleniumWrappers.waitForPageToLoad();

            const cartProductNames: string[] = await allPages.cart.getProductNames();

            assert.strictEqual(cartProductNames.length, 0, `Expected the cart to be empty`);
        });

        it('All products have their corresponding name, description, quantity and price when comparing the name, description and price from Cart page with the one from Checkout Overview page', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.scrollDown();

            const cartProducts: string[] = await allPages.cart.getProductNames();

            const cartProductsDescriptions: string[] = [];

            const cartProductsQuantitys: number[] = [];

            const cartProductPrices: number[] = [];

            for (let i = 0; i < cartProducts.length; i++) {
                cartProductsDescriptions[i] = await allPages.cart.getProductDescriptionByName(cartProducts[i]);
                cartProductsQuantitys[i] = await allPages.cart.getProductQuantity(cartProducts[i]);
                cartProductPrices[i] = await allPages.cart.getProductPriceByName(cartProducts[i]);
            }

            await allPages.cart.goToCheckout();

            await allPages.checkout.fillFirstName('Popescu');
            await allPages.checkout.fillLastName('Robertto');
            await allPages.checkout.fillPostalCode('123');

            await allPages.checkout.continueToCheckoutOverview();

            const checkoutOverviewProductNames: string[] = await allPages.checkoutOverview.getProductNames();
            for (let i = 0; i < checkoutOverviewProductNames.length; i++) {
                const checkoutOverviewProductName = checkoutOverviewProductNames[i];

                assert.strictEqual(
                    checkoutOverviewProductName,
                    cartProducts[i],
                    `Expected the product ${cartProducts[i]} from cart page to match with the ${checkoutOverviewProductName} from checkout overview page`,
                );

                const checkoutOverviewProductDescription: string =
                    await allPages.checkoutOverview.getProductDescriptionByName(checkoutOverviewProductName);

                assert.strictEqual(
                    checkoutOverviewProductDescription,
                    cartProductsDescriptions[i],
                    `Expected the description for ${checkoutOverviewProductName} to match the description provided in the list of cart products`,
                );

                const checkoutOverviewProductQuantity: number = await allPages.checkoutOverview.getProductQuantity(
                    checkoutOverviewProductName,
                );

                assert.strictEqual(
                    checkoutOverviewProductQuantity,
                    cartProductsQuantitys[i],
                    `Expected the description for ${checkoutOverviewProductQuantity} to match the quantity provided in the list of cart products`,
                );

                const checkoutOverviewProductPrice: number = await allPages.checkoutOverview.getProductPriceByName(
                    checkoutOverviewProductName,
                );

                assert.strictEqual(
                    checkoutOverviewProductPrice,
                    cartProductPrices[i],
                    `Expected the price for ${checkoutOverviewProductPrice} to match the quantity provided in the list of cart products`,
                );
            }
        });

        it('Order progress is canceled when "Cancel" button from checkout is clicked', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.scrollDown();

            await allPages.cart.goToCheckout();

            await seleniumWrappers.waitForPageToLoad();

            expect(
                await seleniumWrappers.isDisplayed(allPages.checkout.cancelCheckoutButton),
                'Expected the cancel button to be displayed',
            ).to.be.true;

            await allPages.checkout.cancelProgress();

            await seleniumWrappers.waitForPageToLoad();

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl, 'Expected redirected URL to contain Cart page route').to.include(CART_PAGE_ROUTE);
        });

        it('Order progress is canceled when "Cancel" button from checkout overview is clicked', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.scrollDown();

            await allPages.cart.goToCheckout();

            await allPages.checkout.fillFirstName('Popescu');
            await allPages.checkout.fillLastName('Robertto');
            await allPages.checkout.fillPostalCode('123');

            await allPages.checkout.continueToCheckoutOverview();

            await seleniumWrappers.waitForPageToLoad();

            await allPages.checkoutOverview.scrollDown();

            expect(
                await seleniumWrappers.isDisplayed(allPages.checkoutOverview.cancelOrderButton),
                'Expected the cancel button to be displayed',
            ).to.be.true;

            await allPages.checkoutOverview.cancelCheckout();

            await seleniumWrappers.waitForPageToLoad();

            const currentUrl = await webDriver.getCurrentUrl();
            expect(currentUrl, 'Expected redirected URL to contain Products page route').to.include(
                PRODUCTS_PAGE_ROUTE,
            );
        });

        it('Unsuccessful continue to Checkout Overview when First Name field is left blank', async function () {
            const productNames: string[] = await allPages.products.getProductNames();
            for (let i = 0; i < productNames.length; i++) {
                await allPages.products.addToCart(productNames[i]);
            }

            await allPages.products.goToShoppingCart();

            await allPages.cart.scrollDown();

            await allPages.cart.goToCheckout();

            const expectedUrl = await webDriver.getCurrentUrl();

            await allPages.checkout.fillFirstName('');
            await allPages.checkout.fillLastName('');
            await allPages.checkout.fillPostalCode('');

            await allPages.checkout.continueToCheckoutOverview();

            const actualUrl = await webDriver.getCurrentUrl();

            expect(expectedUrl, 'Expected to remain on checkout page').to.be.equal(actualUrl);

            expect(
                await seleniumWrappers.isDisplayed(allPages.checkout.errorMessage),
                'Expected an error message to be displayed',
            ).to.be.true;

            const errorMessage = await webDriver.findElement(allPages.checkout.errorMessage);
            const firstName = await webDriver.findElement(allPages.checkout.firstNameInput);
            const lastName = await webDriver.findElement(allPages.checkout.lastNameInput);
            const postalCode = await webDriver.findElement(allPages.checkout.postalCodeInput);

            expect(
                await errorMessage.getText(),
                'Expected error message to contain "First Name is required"',
            ).to.contain('First Name is required');

            expect(
                await firstName.getAttribute('class'),
                'Expected first name input element to contain class `error`',
            ).to.contain('error');

            expect(
                await lastName.getAttribute('class'),
                'Expected last name input element to contain class `error`',
            ).to.contain('error');

            expect(
                await postalCode.getAttribute('class'),
                'Expected postal code input element to contain class `error`',
            ).to.contain('error');
        });
    });
});
