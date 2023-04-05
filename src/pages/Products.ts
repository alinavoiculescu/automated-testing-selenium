/* eslint-disable prettier/prettier */
import { WebDriver, By, until } from 'selenium-webdriver';
import { Page } from '../utils/pages/Page';
import { BrowserWrapper } from '../utils/wrappers/browser/BrowserWrapper';

export class Products extends Page {
    productList: By;
    items: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.productList = By.css('.inventory_list');
        this.items = By.css('.inventory_item');
    }

    public async verifyProductsDisplayedAndVisible() {
        await this.webDriver.wait(until.elementLocated(this.productList));
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);
        let allItemsDisplayed = true;
        for (let i = 0; i < items.length; i++) {
            const itemDisplayed = await items[i].isDisplayed();
            if (!itemDisplayed) {
                allItemsDisplayed = false;
                break;
            }
        }
        return allItemsDisplayed;
    }

    public async scrollDown() {
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);
        for (let i = 0; i < items.length; i++) {
            await this.seleniumWrappers.scrollToElement(items[i]);
        }
    }
}
