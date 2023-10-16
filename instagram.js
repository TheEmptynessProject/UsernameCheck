const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const email = 'mtxeomb21o2gwx@omfg.run'; //some random email
const fName = 'merememere'; //some random name
const passW = 'Secured111@the.emptyness.project'; //some random password

//Keep in mind, this checks for availability! This doesnt create or register any account

async function checkUsernameAvailability(username) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.instagram.com/accounts/emailsignup/');
    await page.waitForSelector('input[name="emailOrPhone"]');
    await page.type('input[name="emailOrPhone"]', email);
    await page.type('input[name="fullName"]', fName);
    await page.type('input[name="password"]', passW);
    await page.type('input[name="username"]', username);
    await page.keyboard.press('Tab');

    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 6000)); //If the check is timing out a lot of the times, you are rate limited

    const result = await Promise.race([
      page.waitForSelector('span.xo3uz88.x1nxxyus'),
      page.waitForSelector('span.xo3uz88.x1twbzvy'),
      timeoutPromise
    ]);

    if (result === timeoutPromise) {
      console.log(`Error: Could not retrieve availability for username ${username}`);
    } else if (await page.$('span.xo3uz88.x1nxxyus')) {
      console.log(`Username ${username} is not available.`);
    } else if (await page.$('span.xo3uz88.x1twbzvy')) {
      console.log(`Username ${username} is available.`);
    } else {
      console.log(`Could not determine the availability of username ${username}.`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

async function checkUsernamesFromFile(filename) {
  try {
    const usernames = (await fs.readFile(filename, 'utf-8')).split(', ');
    for (const username of usernames) {
        console.log(username)
      await checkUsernameAvailability(username);
      await delay(5000);
    }
  } catch (error) {
    console.error('An error occurred while reading the file:', error);
  }
}

// Single username
checkUsernameAvailability("gorilla457467");

// File containing usernames
checkUsernamesFromFile('./js/users.txt');
// Should follow the format: username1, username2, username3
