import { WebDriver, By, until } from 'selenium-webdriver';
import { Page } from '../utils/pages/Page';
import { BrowserWrapper } from '../utils/wrappers/browser/BrowserWrapper';

export class ProductDetails extends Page {
    productTitle: By;
    productDescription: By;
    productPrice: By;
    backButton: By;
    productImage: By;
    addToCartButton: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.productTitle = By.css('.inventory_details_name');
        this.productDescription = By.css('.inventory_details_desc');
        this.productPrice = By.css('.inventory_details_price');
        this.backButton = By.css('.inventory_details_back_button');
        this.productImage = By.css('.inventory_details_img');
        this.addToCartButton = By.css('.btn_inventory');
    }

    public async getProductTitle(): Promise<string> {
        await this.webDriver.wait(until.elementLocated(this.productTitle));
        const productTitleElement = await this.webDriver.findElement(this.productTitle);
        return productTitleElement.getText();
    }

    public async getProductDescription(): Promise<string> {
        await this.webDriver.wait(until.elementLocated(this.productDescription));
        const productDescriptionElement = await this.webDriver.findElement(this.productDescription);
        return productDescriptionElement.getText();
    }

    public async getProductImage(): Promise<string> {
        await this.webDriver.wait(until.elementLocated(this.productImage));
        const productImageElement = await this.webDriver.findElement(this.productImage);
        const productImageSrc = await productImageElement.getAttribute('src');
        return productImageSrc;
    }

    public async getProductPrice(): Promise<number> {
        await this.webDriver.wait(until.elementLocated(this.productPrice));
        const productPriceElement = await this.webDriver.findElement(this.productPrice);
        const priceString = await productPriceElement.getText();
        const price = parseFloat(priceString.replace('$', ''));
        return price;
    }

    public async getProductButton(): Promise<boolean> {
        await this.webDriver.wait(until.elementLocated(this.addToCartButton));
        const addToCartButtonElement = await this.webDriver.findElement(this.addToCartButton);
        return addToCartButtonElement.isDisplayed();
    }

    public async addToCart() {
        await this.webDriver.wait(until.elementLocated(this.addToCartButton));
        const addButton = await this.webDriver.findElement(this.addToCartButton);
        await addButton.click();
    }

    public async removeFromCart() {
        await this.webDriver.wait(until.elementLocated(this.addToCartButton));
        const removeButton = await this.webDriver.findElement(this.addToCartButton);
        await removeButton.click();
    }

    public async navigateBackToProductsPage() {
        await this.webDriver.wait(until.elementLocated(this.backButton));
        const backButtonElement = await this.webDriver.findElement(this.backButton);
        await backButtonElement.click();
    }
}
