import { WebDriver, By, until } from 'selenium-webdriver';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { Page } from '../../utils/pages/Page';

export class CheckoutComplete extends Page {
    backHomeButton: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.backHomeButton = By.id('#back-to-products');
    }

    public async goToHome() {
        await this.webDriver.wait(until.elementLocated(this.backHomeButton));
        const goBackToHomeButton = await this.webDriver.findElement(this.backHomeButton);
        await goBackToHomeButton.click();
        await this.seleniumWrappers.waitForPageToLoad();
    }
}
