import { WebDriver, By, until } from 'selenium-webdriver';
import { Page } from '../../utils/pages/Page';
import { BrowserWrapper } from '../../utils/wrappers/browser/BrowserWrapper';
import { SeleniumWrappers } from '../../utils/wrappers/selenium/SeleniumWrappers';

export class Footer extends Page {
    twitterIcon: By;
    facebookIcon: By;
    linkedinIcon: By;
    webDriver: WebDriver;

    constructor(browserWrapper: BrowserWrapper) {
        super(browserWrapper);
        this.webDriver = browserWrapper.webDriver;
        this.seleniumWrappers = new SeleniumWrappers(this.webDriver);
        this.initElements();
    }

    private initElements() {
        this.twitterIcon = By.css('.social_twitter');
        this.facebookIcon = By.css('.social_facebook');
        this.linkedinIcon = By.css('.social_linkedin');
    }

    public async clickOnTwitterIcon(): Promise<boolean> {
        return await this.clickOnIcon(this.twitterIcon);
    }

    public async clickOnFacebookIcon(): Promise<boolean> {
        return await this.clickOnIcon(this.facebookIcon);
    }

    public async clickOnLinkedinIcon(): Promise<boolean> {
        return await this.clickOnIcon(this.linkedinIcon);
    }

    public async clickOnIcon(icon: By): Promise<boolean> {
        const appUrl: string = await this.webDriver.getCurrentUrl();
        const elementIcon = await this.webDriver.wait(until.elementLocated(icon));

        await this.seleniumWrappers.scrollToElement(elementIcon);
        await this.seleniumWrappers.click(elementIcon);
        await this.seleniumWrappers.waitForPageToLoad();
        await this.webDriver.close();
        const handles = await this.webDriver.getAllWindowHandles();
        await this.webDriver.switchTo().window(handles[handles.length - 1]);
        return appUrl != (await this.webDriver.getCurrentUrl());
    }
}
