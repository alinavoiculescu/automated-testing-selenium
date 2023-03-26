import { config } from '../../config/config';
import { ThenableWebDriver, Browser } from 'selenium-webdriver';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';
import { Reports } from '../../utils/reports/Reports';
import { AllPages } from '../../utils/pages/AllPages';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import {
    INVALID_USERNAME,
    INVALID_PASSWORD,
    EMPTY_STRING,
    LOGIN_INVALID_ERROR,
    REQUIRED_USERNAME_ERROR,
    REQUIRED_PASSWORD_ERROR,
    LOCKED_OUT_USERNAME,
    USER_LOCKED_OUT_ERROR,
} from '../../config/constants';
import 'chromedriver';
import { assert, expect } from 'chai';

describe('Login page tests', function () {
    let webDriver: ThenableWebDriver;
    let seleniumWrappers: SeleniumWrappers;
    let reports: Reports;
    let allPages: AllPages;
    this.timeout(90000);

    before(async function () {
        allPages = new AllPages(new BrowserWrapper(Browser.CHROME));
        await allPages.browserWrapper.maximizeWindow();
        webDriver = allPages.getWebDriver();
        seleniumWrappers = new SeleniumWrappers(webDriver);
        reports = new Reports(webDriver);
    });

    beforeEach(async function () {
        await webDriver.get(config.websiteUrl);
        await seleniumWrappers.waitForPageToLoad();
    });

    afterEach(async function () {
        await reports.makeReport(this.currentTest);
    });

    after(async function () {
        await seleniumWrappers.waitForPageToLoad();
        await allPages.close();
    });

    it('Unsuccessful login when no credentials provided', async function () {
        const loginSuccessfully = await allPages.login.clickLogin();
        assert(!loginSuccessfully, 'Expected to remain on login page');
        assert(
            await seleniumWrappers.isDisplayed(allPages.login.errorMessage),
            'Expected an error message to be displayed',
        );
        const errorMessage = await webDriver.findElement(allPages.login.errorMessage);
        const username = await webDriver.findElement(allPages.login.fieldUsername);
        const password = await webDriver.findElement(allPages.login.fieldPassword);
        expect(await errorMessage.getText(), `Expected error message to contain ${REQUIRED_USERNAME_ERROR}`).to.contain(
            REQUIRED_USERNAME_ERROR,
        );
        expect(
            await username.getAttribute('class'),
            'Expected username input element to contain class `error`',
        ).to.contain('error');
        expect(
            await password.getAttribute('class'),
            'Expected password input element to contain class `error`',
        ).to.contain('error');
    });

    it('Unsuccessful login when invalid credentials provided (both username and password)', async function () {
        const loginSuccessfully = await allPages.login.login(INVALID_USERNAME, INVALID_PASSWORD);
        assert(!loginSuccessfully, 'Expected to remain on login page');
        assert(
            await seleniumWrappers.isDisplayed(allPages.login.errorMessage),
            'Expected an error message to be displayed',
        );
        const errorMessage = await webDriver.findElement(allPages.login.errorMessage);
        const username = await webDriver.findElement(allPages.login.fieldUsername);
        const password = await webDriver.findElement(allPages.login.fieldPassword);
        expect(await errorMessage.getText(), `Expected error message to contain ${LOGIN_INVALID_ERROR}`).to.contain(
            LOGIN_INVALID_ERROR,
        );
        expect(
            await username.getAttribute('class'),
            'Expected username input element to contain class `error`',
        ).to.contain('error');
        expect(
            await password.getAttribute('class'),
            'Expected password input element to contain class `error`',
        ).to.contain('error');
    });

    it('Unsuccessful login when invalid credentials provided (username exist, password is wrong)', async function () {
        const loginSuccessfully = await allPages.login.login(config.credentials.username, INVALID_PASSWORD);
        assert(!loginSuccessfully, 'Expected to remain on login page');
        assert(
            await seleniumWrappers.isDisplayed(allPages.login.errorMessage),
            'Expected an error message to be displayed',
        );
        const errorMessage = await webDriver.findElement(allPages.login.errorMessage);
        const username = await webDriver.findElement(allPages.login.fieldUsername);
        const password = await webDriver.findElement(allPages.login.fieldPassword);
        expect(await errorMessage.getText(), `Expected error message to contain ${LOGIN_INVALID_ERROR}`).to.contain(
            LOGIN_INVALID_ERROR,
        );
        expect(
            await username.getAttribute('class'),
            'Expected username input element to contain class `error`',
        ).to.contain('error');
        expect(
            await password.getAttribute('class'),
            'Expected password input element to contain class `error`',
        ).to.contain('error');
    });

    it('Unsuccessful login when invalid credentials provided (username is wrong, password exists)', async function () {
        const loginSuccessfully = await allPages.login.login(INVALID_USERNAME, config.credentials.password);
        assert(!loginSuccessfully, 'Expected to remain on login page');
        assert(
            await seleniumWrappers.isDisplayed(allPages.login.errorMessage),
            'Expected an error message to be displayed',
        );
        const errorMessage = await webDriver.findElement(allPages.login.errorMessage);
        const username = await webDriver.findElement(allPages.login.fieldUsername);
        const password = await webDriver.findElement(allPages.login.fieldPassword);
        expect(await errorMessage.getText(), `Expected error message to contain ${LOGIN_INVALID_ERROR}`).to.contain(
            LOGIN_INVALID_ERROR,
        );
        expect(
            await username.getAttribute('class'),
            'Expected username input element to contain class `error`',
        ).to.contain('error');
        expect(
            await password.getAttribute('class'),
            'Expected password input element to contain class `error`',
        ).to.contain('error');
    });

    it('Unsuccessful login when username field is left blank', async function () {
        const loginSuccessfully = await allPages.login.login(EMPTY_STRING, config.credentials.password);
        assert(!loginSuccessfully, 'Expected to remain on login page');
        assert(
            await seleniumWrappers.isDisplayed(allPages.login.errorMessage),
            'Expected an error message to be displayed',
        );
        const errorMessage = await webDriver.findElement(allPages.login.errorMessage);
        const username = await webDriver.findElement(allPages.login.fieldUsername);
        const password = await webDriver.findElement(allPages.login.fieldPassword);
        expect(await errorMessage.getText(), `Expected error message to contain ${REQUIRED_USERNAME_ERROR}`).to.contain(
            REQUIRED_USERNAME_ERROR,
        );
        expect(
            await username.getAttribute('class'),
            'Expected username input element to contain class `error`',
        ).to.contain('error');
        expect(
            await password.getAttribute('class'),
            'Expected password input element to contain class `error`',
        ).to.contain('error');
    });

    it('Unsuccessful login when password field is left blank', async function () {
        const loginSuccessfully = await allPages.login.login(config.credentials.username, EMPTY_STRING);
        assert(!loginSuccessfully, 'Expected to remain on login page');
        assert(
            await seleniumWrappers.isDisplayed(allPages.login.errorMessage),
            'Expected an error message to be displayed',
        );
        const errorMessage = await webDriver.findElement(allPages.login.errorMessage);
        const username = await webDriver.findElement(allPages.login.fieldUsername);
        const password = await webDriver.findElement(allPages.login.fieldPassword);
        expect(await errorMessage.getText(), `Expected error message to contain ${REQUIRED_PASSWORD_ERROR}`).to.contain(
            REQUIRED_PASSWORD_ERROR,
        );
        expect(
            await username.getAttribute('class'),
            'Expected username input element to contain class `error`',
        ).to.contain('error');
        expect(
            await password.getAttribute('class'),
            'Expected password input element to contain class `error`',
        ).to.contain('error');
    });

    it('Unsuccessful login when user is locked out', async function () {
        const loginSuccessfully = await allPages.login.login(LOCKED_OUT_USERNAME, config.credentials.password);
        assert(!loginSuccessfully, 'Expected to remain on login page');
        assert(
            await seleniumWrappers.isDisplayed(allPages.login.errorMessage),
            'Expected an error message to be displayed',
        );
        const errorMessage = await webDriver.findElement(allPages.login.errorMessage);
        const username = await webDriver.findElement(allPages.login.fieldUsername);
        const password = await webDriver.findElement(allPages.login.fieldPassword);
        expect(await errorMessage.getText(), `Expected error message to contain ${USER_LOCKED_OUT_ERROR}`).to.contain(
            USER_LOCKED_OUT_ERROR,
        );
        expect(
            await username.getAttribute('class'),
            'Expected username input element to contain class `error`',
        ).to.contain('error');
        expect(
            await password.getAttribute('class'),
            'Expected password input element to contain class `error`',
        ).to.contain('error');
    });

    it('Successful login when valid credentials provided', async function () {
        const loginSuccessfully = await allPages.login.login(config.credentials.username, config.credentials.password);
        assert(loginSuccessfully, 'Expected to be logged in successfully and to be redirected to the next page');
    });
});
