import * as fs from 'fs';
import { WebDriver } from 'selenium-webdriver';
import * as logReport from 'mochawesome-screenshots/logReport';

export class Reports {
    webDriver: WebDriver;

    constructor(webDriver: WebDriver) {
        this.webDriver = webDriver;
    }

    public async makeReport(currentTest: Mocha.Test) {
        const testCaseName: string = currentTest.title;
        const testCaseStatus: string = currentTest.state;
        const imageName = `${testCaseName}.png`.replaceAll('"', "'").replace(/[:\\\/*?<>|]/g, '-');

        if (testCaseStatus === 'failed') {
            const data = await this.webDriver.takeScreenshot();
            const screenshotPath = `testResults/screenshots/${imageName}`;

            fs.writeFileSync(screenshotPath, data, 'base64');
            logReport.setScreenshot(currentTest, imageName, testCaseName);
        }
    }
}
