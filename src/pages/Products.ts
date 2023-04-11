/* eslint-disable prettier/prettier */
import { WebDriver, By, until } from 'selenium-webdriver';
import { Page } from '../utils/pages/Page';
import { BrowserWrapper } from '../utils/wrappers/browser/BrowserWrapper';

export class Products extends Page {
    productList: By;
    items: By;
    productName: By;
    productPrice: By;
    productDescription: By;
    productImage: By;
    productButton: By;
    webDriver: WebDriver;
    sortDropdown: By;
    sortOptionNameAsc: By;
    sortOptionNameDesc: By;
    sortOptionPriceAsc: By;
    sortOptionPricesDesc: By;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.productList = By.css('.inventory_list');
        this.items = By.css('.inventory_item');
        this.productName = By.css('.inventory_item_name');
        this.productPrice = By.css('.inventory_item_price');
        this.productDescription = By.css('.inventory_item_desc');
        this.productImage = By.css('img.inventory_item_img');
        this.productButton = By.css('.btn_inventory');
        this.sortDropdown = By.css('.product_sort_container');
        this.sortOptionNameAsc = By.css('option[value="az"]');
        this.sortOptionNameDesc = By.css('option[value="za"]');
        this.sortOptionPriceAsc = By.css('option[value="lohi"]');
        this.sortOptionPricesDesc = By.css('option[value="hilo"]');
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

    public async getProductNames(): Promise<string[]> {
        await this.webDriver.wait(until.elementLocated(this.productList));
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);
        const names: string[] = [];

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            names.push(name);
        }

        return names;
    }

    public async getProductPrices(): Promise<number[]> {
        await this.webDriver.wait(until.elementLocated(this.productList));
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);
        const prices: number[] = [];

        for (let i = 0; i < items.length; i++) {
            const priceString = await (await items[i].findElement(this.productPrice)).getText();
            const price = parseFloat(priceString.replace('$', ''));
            prices.push(price);
        }

        return prices;
    }

    public async getProductDescriptionByName(productName: string) {
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            if (name === productName) {
                const description = await (await items[i].findElement(By.css('.inventory_item_desc'))).getText();
                return description;
            }
        }

        throw new Error(`Product with name '${productName}' not found`);
    }

    public async getProductImageByName(productName: string) {
        await this.webDriver.wait(until.elementLocated(this.productList));
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            if (name === productName) {
                const imageElement = await items[i].findElement(this.productImage);
                await this.seleniumWrappers.waitForPageToLoad();
                const imageSrc = await imageElement.getAttribute('src');
                return imageSrc;
            }
        }

        throw new Error(`Product with name '${productName}' not found`);
    }

    public async getProductPriceByName(productName: string) {
        await this.webDriver.wait(until.elementLocated(this.productList));
        const productList = await this.webDriver.findElement(this.productList);
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

    public async verifyAddToCartButtonExists(productName: string) {
        await this.webDriver.wait(until.elementLocated(this.productList));
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await items[i].findElement(this.productName).getText();
            if (name === productName) {
                const addToCartButton = await items[i].findElement(this.productButton);
                const buttonDisplayed = await addToCartButton.isDisplayed();
                if (buttonDisplayed) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        throw new Error(`Product with name '${productName}' not found`);
    }

    public async sortProductsByNameAsc() {
        await this.webDriver.wait(until.elementLocated(this.sortDropdown));
        const sortDropdownElement = await this.webDriver.findElement(this.sortDropdown);
        await sortDropdownElement.click();

        await this.webDriver.wait(until.elementLocated(this.sortOptionNameAsc));
        const sortOptionNameAscElement = await this.webDriver.findElement(this.sortOptionNameAsc);
        await sortOptionNameAscElement.click();
    }

    public async sortProductsByNameDesc() {
        await this.webDriver.wait(until.elementLocated(this.sortDropdown));
        const sortDropdownElement = await this.webDriver.findElement(this.sortDropdown);
        await sortDropdownElement.click();

        await this.webDriver.wait(until.elementLocated(this.sortOptionNameDesc));
        const sortOptionNameDescElement = await this.webDriver.findElement(this.sortOptionNameDesc);
        await sortOptionNameDescElement.click();
    }

    public async sortProductsByPriceAsc() {
        await this.webDriver.wait(until.elementLocated(this.sortDropdown));
        const sortDropdownElement = await this.webDriver.findElement(this.sortDropdown);
        await sortDropdownElement.click();

        await this.webDriver.wait(until.elementLocated(this.sortOptionPriceAsc));
        const sortOptionPriceAscElement = await this.webDriver.findElement(this.sortOptionPriceAsc);
        await sortOptionPriceAscElement.click();
    }

    public async sortProductsByPriceDesc() {
        await this.webDriver.wait(until.elementLocated(this.sortDropdown));
        const sortDropdownElement = await this.webDriver.findElement(this.sortDropdown);
        await sortDropdownElement.click();

        await this.webDriver.wait(until.elementLocated(this.sortOptionPricesDesc));
        const sortOptionPriceDescElement = await this.webDriver.findElement(this.sortOptionPricesDesc);
        await sortOptionPriceDescElement.click();
    }

    public async clickProductByName(productName: string) {
        await this.webDriver.wait(until.elementLocated(this.productList));
        const productList = await this.webDriver.findElement(this.productList);
        const items = await productList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            if (name === productName) {
                await this.seleniumWrappers.click(await items[i].findElement(this.productName));
                return;
            }
        }

        throw new Error(`Product with name '${productName}' not found`);
    }
}
