import { WebDriver, By, until } from 'selenium-webdriver';
import { Page } from '../../utils/pages/Page';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';

export class NavigationMenu extends Page {
    menu: By;
    buttonOpenMenu: By;
    buttonCloseMenu: By;
    optionAllItems: By;
    optionAbout: By;
    optionLogout: By;
    optionResetAppState: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.initElements();
    }

    private initElements() {
        this.menu = By.css('.bm-menu-wrap');
        this.buttonOpenMenu = By.css('button#react-burger-menu-btn');
        this.buttonCloseMenu = By.css('button#react-burger-cross-btn');
        this.optionAllItems = By.css('#inventory_sidebar_link');
        this.optionAbout = By.css('#about_sidebar_link');
        this.optionLogout = By.css('#logout_sidebar_link');
        this.optionResetAppState = By.css('#reset_sidebar_link');
    }

    public async openMenu() {
        const elementButtonOpenMenu = await this.webDriver.findElement(this.buttonOpenMenu);
        if (!(await this.isMenuOpened())) {
            await this.seleniumWrappers.click(elementButtonOpenMenu);
        }
    }

    public async closeMenu() {
        const elementButtonCloseMenu = await this.webDriver.findElement(this.buttonCloseMenu);
        if (await this.isMenuOpened()) {
            await this.seleniumWrappers.click(elementButtonCloseMenu);
        }
    }

    public async isMenuOpened(): Promise<boolean> {
        const elementMenu = await this.webDriver.findElement(this.menu);
        const isMenuOpened = (await elementMenu.getAttribute('aria-hidden')) === 'false';
        return isMenuOpened;
    }

    public async clickOnAllItemsOption(): Promise<boolean> {
        return await this.clickOnOption(this.optionAllItems);
    }

    public async clickOnAboutOption(): Promise<boolean> {
        return await this.clickOnOption(this.optionAbout);
    }

    public async clickOnLogoutOption(): Promise<boolean> {
        return await this.clickOnOption(this.optionLogout);
    }

    public async clickOnResetAppState() {
        await this.openMenu();
        const elementResetAppStateOption = await this.webDriver.wait(until.elementLocated(this.optionResetAppState));
        await this.seleniumWrappers.scrollToElement(elementResetAppStateOption);
        await this.seleniumWrappers.click(elementResetAppStateOption);
    }

    public async clickOnOption(option: By): Promise<boolean> {
        const firstUrl: string = await this.webDriver.getCurrentUrl();
        await this.openMenu();
        const elementOption = await this.webDriver.wait(until.elementLocated(option));

        await this.seleniumWrappers.scrollToElement(elementOption);
        await this.seleniumWrappers.click(elementOption);
        await this.seleniumWrappers.waitForPageToLoad();
        return firstUrl != (await this.webDriver.getCurrentUrl());
    }
}
