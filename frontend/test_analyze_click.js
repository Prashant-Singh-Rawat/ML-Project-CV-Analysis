import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  console.log("Navigating to http://localhost:5173/");
  await page.goto('http://localhost:5173/');
  
  // Wait for React to mount
  await page.waitForTimeout(2000);
  
  console.log("Clicking 'Build from Scratch'");
  await page.click('button:has-text("Build from Scratch")');
  await page.waitForTimeout(1000);
  
  console.log("Filling some data or navigating to step 5");
  // Assuming there's a Next button to reach the analyse page
  for (let i = 0; i < 5; i++) {
     try {
       await page.click('button:has-text("Next")');
       await page.waitForTimeout(500);
     } catch {
       console.log("Next button not found, maybe we reached the end");
       break;
     }
  }

  console.log("Clicking 'Analyse My Resume'");
  await page.click('button:has-text("Analyse My Resume")');
  
  await page.waitForTimeout(2000);
  
  // Get error text if any
  const errorText = await page.evaluate(() => {
    const errorEl = document.querySelector('.text-red-700');
    return errorEl ? errorEl.innerText : 'No error found in UI';
  });
  
  console.log("UI Error Text:", errorText);

  await browser.close();
})();
