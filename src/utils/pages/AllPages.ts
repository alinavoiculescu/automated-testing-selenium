import { config } from '../../config/config';
import { SeleniumWrappers } from '../wrappers/selenium/SeleniumWrappers';
import { BrowserWrapper } from '../wrappers/browser/BrowserWrapper';
import { Login } from '../../pages/Login';
import { ThenableWebDriver } from 'selenium-webdriver';
import { NavigationMenu } from '../../pages/shared/NavigationMenu';
import { Footer } from '../../pages/shared/Footer';
import { Products } from '../../pages/Products';
import { ProductDetails } from '../../pages/ProductDetails';
import { Cart } from '../../pages/Cart';
import { Checkout } from '../../pages/checkout/Checkout';
import { CheckoutOverview } from '../../pages/checkout/CheckoutOverview';
import { CheckoutComplete } from '../../pages/checkout/CheckoutComplete';

export class AllPages {
    public login: Login;
    public navigationMenu: NavigationMenu;
    public footer: Footer;
    public products: Products;
    public productDetails: ProductDetails;
    public cart: Cart;
    public checkout: Checkout;
    public checkoutOverview: CheckoutOverview;
    public checkoutComplete: CheckoutComplete;

    public seleniumWrappers: SeleniumWrappers;

    constructor(public browserWrapper: BrowserWrapper) {
        this.seleniumWrappers = new SeleniumWrappers(browserWrapper.webDriver);
        this.login = new Login(browserWrapper);
        this.navigationMenu = new NavigationMenu(browserWrapper);
        this.footer = new Footer(browserWrapper);
        this.products = new Products(browserWrapper);
        this.productDetails = new ProductDetails(browserWrapper);
        this.cart = new Cart(browserWrapper);
        this.checkout = new Checkout(browserWrapper);
        this.checkoutOverview = new CheckoutOverview(browserWrapper);
        this.checkoutComplete = new CheckoutComplete(browserWrapper);
    }

    public getWebDriver() {
        return this.browserWrapper.webDriver;
    }

    public async goToWebsiteAndLogin(webDriver: ThenableWebDriver) {
        await webDriver.get(config.websiteUrl);
        await this.seleniumWrappers.waitForPageToLoad(2000);
        await this.login.login(config.credentials.username, config.credentials.password);
    }

    public async close() {
        await this.browserWrapper.close();
    }
}
