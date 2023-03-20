import { BrowserWrapper } from '../wrappers/browser/BrowserWrapper';
import { SeleniumWrappers } from '../wrappers/selenium/SeleniumWrappers';

export interface NewablePage<T extends Page> {
    new (browser: BrowserWrapper): T;
}

export abstract class Page {
    browserWrapper: BrowserWrapper;
    seleniumWrappers: SeleniumWrappers;

    constructor(browserWrapper: BrowserWrapper) {
        this.browserWrapper = browserWrapper;
        this.seleniumWrappers = new SeleniumWrappers(browserWrapper.webDriver);
    }
}
