import { WebDriver, WebElement, WebElementPromise, By, Key } from 'selenium-webdriver';

export class SeleniumWrappers {
    webDriver: WebDriver;

    constructor(webDriver: WebDriver) {
        this.webDriver = webDriver;
    }

    public async isDisplayed(element: By): Promise<boolean> {
        return (await this.webDriver.findElements(element)).length != 0;
    }

    public async waitForPageToLoad(ms = 1000) {
        return new Promise<void>((resolve) => {
            setTimeout(function () {
                resolve();
            }, ms);
        });
    }

    public async click(element: WebElementPromise | WebElement): Promise<boolean> {
        try {
            const elementIsDisplayed = await element.isDisplayed();
            const elementIsEnabled = await element.isEnabled();

            if (elementIsDisplayed && elementIsEnabled) {
                await element.click();
                await this.waitForPageToLoad();
                return true;
            }
            return false;
        } catch (e) {
            console.log(e);
        }
    }

    public async scrollToElement(element: WebElementPromise | WebElement): Promise<void> {
        this.webDriver.executeScript('arguments[0].scrollIntoView();', element);
    }

    public async doubleClick(element: WebElementPromise | WebElement): Promise<void> {
        await this.click(element);
        await this.click(element);
    }

    public async isAttributePresent(element: WebElementPromise | WebElement, attribute: string): Promise<boolean> {
        let result = false;
        try {
            const value = await element.getAttribute(attribute);

            if (value != null) {
                result = true;
            }
        } catch (e) {}
        return result;
    }

    public async getText(element: WebElementPromise | WebElement): Promise<string> {
        return await element.getText();
    }

    public async isDisabled(button: WebElementPromise | WebElement): Promise<boolean> {
        try {
            if (this.isAttributePresent(button, 'disabled')) {
                return (await button.getAttribute('disabled')) === 'true';
            }

            return false;
        } catch (exception) {
            return false;
        }
    }

    public async isEnabled(button: WebElementPromise | WebElement): Promise<boolean> {
        return !(await this.isDisabled(button));
    }

    public async clearInput(element: WebElement): Promise<void> {
        await element.getDriver().executeScript((elem) => elem.select(), element);
        await element.sendKeys(Key.BACK_SPACE);
    }

    public async type(element: WebElementPromise | WebElement, text: string): Promise<void> {
        await element.isDisplayed();
        await this.clearInput(element);
        await element.sendKeys(text);
    }
}
