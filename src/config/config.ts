import dotenv from 'dotenv';

dotenv.config();

export const config = {
    websiteUrl: process.env.WEBSITE_URL || 'https://www.saucedemo.com/',
    credentials: {
        username: process.env.ACCOUNT_USERNAME || '',
        password: process.env.ACCOUNT_PASSWORD || '',
    },
};
