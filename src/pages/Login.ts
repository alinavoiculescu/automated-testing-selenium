/* eslint-disable prettier/prettier */
import { WebDriver, By, until } from 'selenium-webdriver';
import { Page } from '../utils/pages/Page';
import { BrowserWrapper } from '../utils/wrappers/browser/BrowserWrapper';

export class Login extends Page {
    fieldUsername: By;
    fieldPassword: By;
    buttonLogin: By;
    errorMessage: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.fieldUsername = By.css('#user-name');
        this.fieldPassword = By.css('#password');
        this.buttonLogin = By.css('#login-button');
        this.errorMessage = By.css('.error-message-container');
    }

    public async setUsername(username: string) {
        const elementFieldUsername = await this.webDriver.wait(until.elementLocated(this.fieldUsername));
        await this.seleniumWrappers.type(elementFieldUsername, username);
    }

    public async setPassword(password: string) {
        const elementFieldPassword = await this.webDriver.wait(until.elementLocated(this.fieldPassword));
        await this.seleniumWrappers.type(elementFieldPassword, password);
    }

    public async clickLogin() {
        const loginUrl: string = await this.webDriver.getCurrentUrl();
        const elementButtonLogin = await this.webDriver.wait(until.elementLocated(this.buttonLogin));

        await this.seleniumWrappers.click(elementButtonLogin);
        await this.seleniumWrappers.waitForPageToLoad();
        return loginUrl != (await this.webDriver.getCurrentUrl());
    }

    public async login(username: string, password: string) {
        try {
            await this.seleniumWrappers.waitForPageToLoad();
            await this.setUsername(username);
            await this.setPassword(password);
            return await this.clickLogin();
        } catch (e) {
            console.log(e);
        }
    }
}
