const { test, expect } = require('@playwright/test');
const utils = require('../utils/playwright-utils');
const locators = require('../utils/locators');
import dotenv from 'dotenv';

test.describe('CMS Home Page Tests', () => {
    test('CMS theme page flow test', async ({ page }) => {
        await utils.navigateTo(page, locators.loginPage.url); // Navigate to login page
        await page.getByLabel('Email').fill(process.env.UserName); //Add your UN on .env
        await page.getByLabel('Password', { exact: true }).fill(process.env.Password); //Add your pwd on .env
        await utils.clickElement(page, locators.loginPage.loginButton);  // Click login button
        await utils.expectText(page, locators.homePage.pageHeader, locators.homePage.PageHeaderText); // Verify page header text
        await utils.clickElement(page, locators.homePage.loadPages);  // Click 'Pages' link
        await page.waitForTimeout(1000);
        await utils.typeText(page, locators.homePage.searchBox, locators.homePage.searchBoxText); // Input 'theme' in the search box
        await page.waitForTimeout(1000);
        await utils.waitForUrl(page, locators.homePage.expectedUrl);  // Verify URL contains 'q=theme'
        await utils.clickElement(page, locators.homePage.searchResults); // Click on the first search result
       
    });

});
