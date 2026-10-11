const { test, expect } = require('@playwright/test');
const utils = require('../utils/playwright-utils');
const locators = require('../utils/locators');
import dotenv from 'dotenv';

test.describe('ONS Home Page Tests', () => {
    test('ONS home page flow test', async ({ page }) => {
        await utils.navigateTo(page, locators.onsHomePage.url_ons); // Navigate to ons home page
        await page.waitForTimeout(1000);
        await utils.expectVisible(page, locators.onsHomePage.onsLogo); // Verify ons logo on the home page
    });

});
