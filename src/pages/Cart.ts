/* eslint-disable prettier/prettier */
import { WebDriver, By, until } from 'selenium-webdriver';
import { Page } from '../utils/pages/Page';
import { BrowserWrapper } from '../utils/wrappers/browser/BrowserWrapper';

export class Cart extends Page {
    cartList: By;
    items: By;
    productName: By;
    productPrice: By;
    productDescription: By;
    cartQuantity: By;
    productButton: By;
    shoppingCartBadge: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.cartList = By.css('.cart_list');
        this.items = By.css('.cart_item');
        this.productName = By.css('.inventory_item_name');
        this.productPrice = By.css('.inventory_item_price');
        this.productDescription = By.css('.inventory_item_desc');
        this.cartQuantity = By.css('.cart_quantity');
        this.productButton = By.css('.cart_button');
        this.shoppingCartBadge = By.css('.shopping_cart_badge');
    }

    public async getProductNames(): Promise<string[]> {
        await this.webDriver.wait(until.elementLocated(this.cartList));
        const productList = await this.webDriver.findElement(this.cartList);
        const items = await productList.findElements(this.items);
        const names: string[] = [];

        for (let i = 0; i < items.length; i++) {
            const name = await (await items[i].findElement(this.productName)).getText();
            names.push(name);
        }
        return names;
    }

    public async getProductQuantity(productName: string): Promise<number> {
        await this.webDriver.wait(until.elementLocated(this.cartList));
        const cartList = await this.webDriver.findElement(this.cartList);
        const items = await cartList.findElements(this.items);

        console.log(productName);

        for (let i = 0; i < items.length; i++) {
            const name = await items[i].findElement(this.productName).getText();
            if (name === productName) {
                const quantity = await items[i].findElement(this.cartQuantity).getText();
                return parseInt(quantity);
            }
        }

        return 0;
    }

    public async getProductDescriptionByName(productName: string) {
        const productList = await this.webDriver.findElement(this.cartList);
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
        await this.webDriver.wait(until.elementLocated(this.cartList));
        const productList = await this.webDriver.findElement(this.cartList);
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
        await this.webDriver.wait(until.elementLocated(this.cartList));
        const productList = await this.webDriver.findElement(this.cartList);
        const items = await productList.findElements(this.items);

        for (let i = 0; i < items.length; i++) {
            const name = await items[i].findElement(this.productName).getText();
            if (name === productName) {
                const addToCartButton = await items[i].findElement(this.productButton);
                const buttonText = await addToCartButton.getText();
                if (buttonText === 'Add to cart') {
                    return true;
                } else if (buttonText === 'Remove') {
                    return false;
                }
            }
        }

        throw new Error(`Product with name '${productName}' not found`);
    }
}
