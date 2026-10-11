// playwright-utils.js
// Reusable Playwright helper functions with JSDoc
//To create new function >> write pfunc then click tab
import dotenv from 'dotenv';

const { expect } = require('playwright/test');

/**
 * Navigate to a URL and wait for network to be idle.
 * @param {import('@playwright/test').Page} page - Playwright Page object.
 * @param {string} url - The URL to navigate to.
 */
async function navigateTo(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
}

/**
 * Login with provided credentials.
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
async function login(page, username, password) {
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Click an element by its visible text.
 * @param {import('@playwright/test').Page} page
 * @param {string} text - Text to match.
 */
async function clickByText(page, text) {
  await page.locator(`text=${text}`).click();
}

/**
 * Fill an input field with text.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS or XPath selector.
 * @param {string} text - Text to input.
 */
async function typeText(page, selector, text) {
  await page.waitForSelector(selector, { state: 'visible' });
  await page.fill(selector, text);
}

/**
 * Click an element.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS or XPath selector.
 */
async function clickElement(page, selector) {
  await page.waitForSelector(selector, { state: 'visible' });
  await page.click(selector);
}

/**
 * Select an option from a dropdown by value.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} value
 */
async function selectOptionByValue(page, selector, value) {
  await page.selectOption(selector, value);
}

/**
 * Assert that an element's text contains expected text.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} expectedText
 * @throws Will throw an error if text does not match.
 */
async function expectText(page, selector, expectedText) {
  const text = await page.textContent(selector);
  if (!text.includes(expectedText)) {
    throw new Error(`Expected "${expectedText}" but got "${text}"`);
  }
}

/**
 * Wait for an element to be visible.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
async function expectVisible(page, selector) {
  await page.waitForSelector(selector, { state: 'visible' });
}

/**
 * Wait for a specific URL.
 * @param {import('@playwright/test').Page} page
 * @param {string|RegExp} expectedUrl - URL string or RegExp.
 */
async function waitForUrl(page, expectedUrl) {
  await page.waitForURL(expectedUrl);
}

/**
 * Wait for specific text in an element.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} expectedText
 */
async function waitForText(page, selector, expectedText) {
  await page.waitForFunction(
    (sel, text) => document.querySelector(sel)?.innerText.includes(text),
    selector,
    expectedText
  );
}

/**
 * Take a screenshot with timestamp in the filename.
 * @param {import('@playwright/test').Page} page
 * @param {string} name - Base name for the screenshot.
 */
async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
}

/**
 * Log browser console messages to Node.js console.
 * @param {import('@playwright/test').Page} page
 */
function logConsole(page) {
  page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
}

/**
 * Upload a file to an input[type=file] element.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} filePath
 */
async function uploadFile(page, selector, filePath) {
  await page.setInputFiles(selector, filePath);
}

/**
 * Download a file and return its local path.
 * @param {import('@playwright/test').Page} page
 * @param {string} triggerSelector - Selector for download button/link.
 * @returns {Promise<string>} Path to downloaded file.
 */
const path = require('path');
const fs = require('fs');
async function downloadFile(page, triggerSelector) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click(triggerSelector)
  ]);
  // Save in project root
  const fileName = download.suggestedFilename();
  const filePath = path.join(process.cwd(), fileName);
  await download.saveAs(filePath);
  return filePath;
}

/**
 * Returns today's date in YYYY-MM-DD format.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
async function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get a frame (iframe) object by its selector.
 * @param {import('@playwright/test').Page} pageo
 * @param {string} selector
 * @returns {Promise<import('@playwright/test').Frame|null>}
 */
async function getFrameBySelector(page, selector) {
  const elementHandle = await page.$(selector);
  return await elementHandle?.contentFrame();
}


//Validate checkbox
/** 
 * Validate checkbox.
* @param {import('@playwright/test').Page} page
* @param {string} selector
*/

async function validatedBoxIsChecked(page, selector){
  await expect.soft(page.locator(selector)).toBeChecked()
}

/**
 * Handle a popup window triggered by clicking an element.
 * @param {import('@playwright/test').Page} page
 * @param {string} triggerSelector
 * @param {(popup: import('@playwright/test').Page) => Promise<void>} actionFn - Function to run inside popup.
 */
async function handlePopup(page, triggerSelector, actionFn) {
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click(triggerSelector)
  ]);
  await actionFn(popup);
}
/**
 * scroll to view and click next button element.
 * @param {import('@playwright/test').Page} page - Playwright Page object
 * @param {string} buttonSelector - CSS/XPath selector
 * @returns {Promise<void>}
 */
async function scrollInfiniteThenClickNext(page, buttonSelector, options = {}) {
  const {
    step = 400,          // scroll distance per step
    maxScrolls = 100,    // total scroll attempts
    headerHeight = 0,    // sticky header height in px
    waitAfterScroll = 300, // wait after each scroll (ms)
    waitForNewContent = 1000 // extra wait if content might still be loading
  } = options;

  let lastHeight = await page.evaluate(() => document.body.scrollHeight);
  let reachedBottomCount = 0; // to confirm we've stopped loading

  for (let i = 0; i < maxScrolls; i++) {
    // Check if button already exists and is visible
    const buttonVisible = await page.locator(buttonSelector).isVisible();
    if (buttonVisible) {
      const box = await page.locator(buttonSelector).boundingBox();
      const viewport = page.viewportSize();

      if (box && box.y + box.height > headerHeight && box.y < viewport.height) {
        console.log(`"${buttonSelector}" is visible & clickable`);
        await page.click(buttonSelector);
        return;
      }
    }

    // Scroll down
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(waitAfterScroll);

    // Check page height for new content
    const newHeight = await page.evaluate(() => document.body.scrollHeight);

    if (newHeight === lastHeight) {
      reachedBottomCount++;
      if (reachedBottomCount >= 2) { // confirm no new content twice in a row
        console.log("No more content is loading. Waiting for button...");
        await page.waitForTimeout(waitForNewContent);
      }
    } else {
      reachedBottomCount = 0; // reset if new content appeared
    }

    lastHeight = newHeight;
  }

  throw new Error(`"${buttonSelector}" was not clickable after scrolling`);
}
/**
 * functionName - Description of the function
 * @param {import('@playwright/test').Page} page - Playwright Page object
 * @param {string} selector - CSS/XPath selector
 * @returns {Promise<void>}
 */
async function functionName(page, selector) {
  // TODO: Implement function
}

module.exports = { functionName };

// Export All Functions here:

module.exports = {
  navigateTo,
  login,
  clickByText,
  typeText,
  selectOptionByValue,
  expectText,
  clickElement,
  scrollInfiniteThenClickNext,
  expectVisible,
  waitForUrl,
  getTodayDate,
  waitForText,
  takeScreenshot,
  logConsole,
  uploadFile,
  downloadFile,
  getFrameBySelector,
  validatedBoxIsChecked,
  handlePopup
};
