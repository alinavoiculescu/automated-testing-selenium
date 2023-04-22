import { WebDriver, By, until } from 'selenium-webdriver';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { Page } from '../../utils/pages/Page';

export class CheckoutComplete extends Page {
    iconOrder: By;
    headerOrder: By;
    textOrder: By;
    backHomeButton: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.iconOrder = By.css('.pony_express');
        this.headerOrder = By.css('.complete-header');
        this.textOrder = By.css('.complete-text');
        this.backHomeButton = By.css('#back-to-products');
    }

    public async goToHome() {
        await this.webDriver.wait(until.elementLocated(this.backHomeButton));
        const goBackToHomeButton = await this.webDriver.findElement(this.backHomeButton);
        await goBackToHomeButton.click();
        await this.seleniumWrappers.waitForPageToLoad();
    }
}
