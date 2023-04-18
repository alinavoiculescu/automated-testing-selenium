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

    public async getProductNames(): Promise<string[]> {
        await this.webDriver.wait(until.elementLocated(this.checkoutList));
        const productList = await this.webDriver.findElement(this.checkoutList);
        const items = await productList.findElements(this.items);
        const names: string[] = [];

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            names.push(name);
        }
        return names;
    }

    public async getProductDescriptionByName(productName: string) {
        const productList = await this.webDriver.findElement(this.checkoutList);
        const items = await productList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            if (name === productName) {
                const description = await (await items[i].findElement(this.productDescription)).getText();
                return description;
            }
        }

        throw new Error(`Product with name '${productName}' not found`);
    }

    public async getProductPriceByName(productName: string) {
        await this.webDriver.wait(until.elementLocated(this.checkoutList));
        const productList = await this.webDriver.findElement(this.checkoutList);
        const items = await productList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            if (name === productName) {
                const priceString = await (await items[i].findElement(this.productPrice)).getText();
                const price = parseFloat(priceString.replace('$', ''));
                return price;
            }
        }

        throw new Error(`Product with name '${productName}' not found`);
    }

    public async getProductQuantity(productName: string): Promise<number> {
        await this.webDriver.wait(until.elementLocated(this.checkoutList));
        const cartList = await this.webDriver.findElement(this.checkoutList);
        const items = await cartList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await items[i].findElement(this.productName).getText();
            if (name === productName) {
                const quantity = await items[i].findElement(this.checkoutQuantity).getText();
                return parseInt(quantity);
            }
        }

        return 0;
    }

    public async scrollDown() {
        const checkoutList = await this.webDriver.findElement(this.checkoutList);
        const items = await checkoutList.findElements(this.items);
        for (let i = 0; i < items.length; i++) {
            await this.seleniumWrappers.scrollToElement(items[i]);
        }
    }

    public async getItemsSubtotal(): Promise<number> {
        await this.webDriver.wait(until.elementLocated(this.itemsSubtotal));
        const itemsSubtotalElement = await this.webDriver.findElement(this.itemsSubtotal);
        const itemsSubtotalString = await itemsSubtotalElement.getText();
        const itemsSubtotal = parseFloat(itemsSubtotalString.replace(/[^0-9.]/g, ''));
        return itemsSubtotal;
    }

    public async getTaxValue(): Promise<number> {
        await this.webDriver.wait(until.elementLocated(this.taxValue));
        const taxValueElement = await this.webDriver.findElement(this.taxValue);
        const taxValueString = await taxValueElement.getText();
        const taxValue = parseFloat(taxValueString.replace(/[^0-9.]/g, ''));
        return taxValue;
    }

    public async getTotalValue(): Promise<number> {
        await this.webDriver.wait(until.elementLocated(this.totalValue));
        const totalValueElement = await this.webDriver.findElement(this.totalValue);
        const totalValueString = await totalValueElement.getText();
        const totalValue = parseFloat(totalValueString.replace(/[^0-9.]/g, ''));
        return totalValue;
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
