import { WebDriver, By, until } from 'selenium-webdriver';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { Page } from '../../utils/pages/Page';

export class CheckoutOverview extends Page {
    checkoutList: By;
    items: By;
    productName: By;
    productPrice: By;
    productDescription: By;
    checkoutQuantity: By;
    cancelOrderButton: By;
    finishOrderButton: By;
    itemsSubtotal: By;
    taxValue: By;
    totalValue: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.checkoutList = By.css('.cart_list');
        this.items = By.css('.cart_item');
        this.productName = By.css('.inventory_item_name');
        this.productPrice = By.css('.inventory_item_price');
        this.productDescription = By.css('.inventory_item_desc');
        this.checkoutQuantity = By.css('.cart_quantity');
        this.cancelOrderButton = By.css('.cart_cancel_link');
        this.finishOrderButton = By.css('#finish');
        this.itemsSubtotal = By.css('.summary_subtotal_label');
        this.taxValue = By.css('.summary_tax_label');
        this.totalValue = By.css('.summary_total_label');
    }

    public async cancelCheckout() {
        await this.webDriver.wait(until.elementLocated(this.cancelOrderButton));
        const cancelCheckoutButton = await this.webDriver.findElement(this.cancelOrderButton);
        await cancelCheckoutButton.click();
        await this.seleniumWrappers.waitForPageToLoad();
    }

    public async placeOrder() {
        await this.webDriver.wait(until.elementLocated(this.finishOrderButton));
        const finishCheckoutButton = await this.webDriver.findElement(this.finishOrderButton);
        await finishCheckoutButton.click();
        await this.seleniumWrappers.waitForPageToLoad();
    }
}
