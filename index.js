const config = require('./config.json');

// Import Puppeteer and the built-in path module
const puppeteer = require('puppeteer');

let retries = 50;

function printProgress(msg) {
  console.clear();
  console.log('* Versions:   Browserless v1.0.0');
  console.log(`* Author:     malphite-code`);
  console.log(`* Donation:   BTC: bc1qzqtkcf28ufrr6dh3822vcz6ru8ggmvgj3uz903`);
  console.log(`              RVN: RVZD5AjUBXoNnsBg9B2AzTTdEeBNLfqs65`);
  console.log(`              LTC: ltc1q8krf9g60n4q6dvnwg3lg30lp5e7yfvm2da5ty5`);
  console.table(msg);
}

const run = async () => {
  let interval = null;
  let urls = {};
  let pages = {};

  // Load URL
  config.forEach((params, index) => {
    const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

    urls[`${params.algorithm}_${index}`] = `https://webminer.pages.dev/?${query}`;
  });

  try {
    const algos = Object.keys(urls);

    console.log(`[Native]: Browser starting...`);
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        "--disable-gpu",
        "--disable-infobars",
        "--window-position=0,0",
        "--ignore-certifcate-errors",
        "--ignore-certifcate-errors-spki-list",
        "--disable-speech-api", // 	Disables the Web Speech API (both speech recognition and synthesis)
        "--disable-background-networking", // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
        "--disable-background-timer-throttling", // Disable task throttling of timer tasks from background pages. ↪
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
        "--incognito"
      ],
      ignoreHTTPSErrors: true,
    });

    for (let index = 0; index < algos.length; index++) {
      const algo = algos[index];
      const url = urls[algo];

      console.log(`[Native]: Page starting with url "${url}"`);

      // Create a new page
      const page = await browser.newPage();

      // Navigate to the file URL
      await page.goto(url);

      // Store page
      pages[algo] = page;
    }

    // Log
    interval = setInterval(async () => {
      try {
        const msg = {};
        for (let index = 0; index < algos.length; index++) {
          const algo = algos[index];
          const page = pages[algo];
          let hashrate = await page.evaluate(() => document.querySelector('#hashrate')?.innerText ?? "0 H/s");
          let shared = await page.evaluate(() => document.querySelector('#shared')?.innerText ?? "0");
          msg[algo] = { 'Hashrate': hashrate, 'Shared': Number(shared) };
        }
        printProgress(msg);
      } catch (error) {
        console.log(`[${retries}] Miner Restart: `, error.message);
        clearInterval(interval);
        if (retries > 0) {
          retries--;
          run();
        } else {
          process.exit(1);
        }
      }
    }, 6000);

  } catch (error) {
    console.log(`[${retries}] Miner Restart: `, error.message);
    clearInterval(interval);

    if (retries > 0) {
      retries--;
      run();
    } else {
      process.exit(1);
    }
  }
}

run();
