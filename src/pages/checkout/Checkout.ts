import { WebDriver, By, until } from 'selenium-webdriver';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { Page } from '../../utils/pages/Page';

export class Checkout extends Page {
    cancelCheckoutButton: By;
    continueCheckoutButton: By;
    firstNameInput: By;
    lastNameInput: By;
    postalCodeInput: By;
    errorMessage: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.cancelCheckoutButton = By.css('.cart_cancel_link');
        this.continueCheckoutButton = By.css('.cart_button');
        this.firstNameInput = By.css('#first-name');
        this.lastNameInput = By.css('#last-name');
        this.postalCodeInput = By.css('#postal-code');
        this.errorMessage = By.css('.error-message-container');
    }

    public async fillFirstName(firstName: string) {
        await this.webDriver.wait(until.elementLocated(this.firstNameInput));
        const firstNameInputField = await this.webDriver.findElement(this.firstNameInput);
        await firstNameInputField.sendKeys(firstName);
    }

    public async fillLastName(lastName: string) {
        await this.webDriver.wait(until.elementLocated(this.lastNameInput));
        const lastNameInputField = await this.webDriver.findElement(this.lastNameInput);
        await lastNameInputField.sendKeys(lastName);
    }

    public async fillPostalCode(postalCode: string) {
        await this.webDriver.wait(until.elementLocated(this.postalCodeInput));
        const postalCodeInputField = await this.webDriver.findElement(this.postalCodeInput);
        await postalCodeInputField.sendKeys(postalCode);
    }

    public async cancelProgress() {
        await this.webDriver.wait(until.elementLocated(this.cancelCheckoutButton));
        const cancelCheckoutButton = await this.webDriver.findElement(this.cancelCheckoutButton);
        await cancelCheckoutButton.click();
        await this.seleniumWrappers.waitForPageToLoad();
    }

    public async continueToCheckoutOverview() {
        await this.webDriver.wait(until.elementLocated(this.continueCheckoutButton));
        const continueCheckoutButton = await this.webDriver.findElement(this.continueCheckoutButton);
        await continueCheckoutButton.click();
        await this.seleniumWrappers.waitForPageToLoad();
    }
}
