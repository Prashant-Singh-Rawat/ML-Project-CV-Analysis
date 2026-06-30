const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('CV Analyzer Flow', () => {
  test('should successfully analyze a resume and navigate to dashboard', async ({ page }) => {
    // Navigate to the app (uses baseURL from config, e.g., the live site or localhost)
    await page.goto('/');

    // Ensure the page loaded by checking the title or a heading
    await expect(page.locator('text=ATS Resume Checker')).toBeVisible();

    // The user clicks "Check Your Resume" to open the wizard
    await page.click('button:has-text("Check Your Resume")');

    // Select "Upload & Analyse"
    await page.click('button:has-text("Upload & Analyse")');

    // Provide the path to the dummy resume PDF
    const fileChooserPromise = page.waitForEvent('filechooser');
    // Assuming there's a click-to-upload area. We will target the input directly or click the box.
    // The exact selector depends on your InputForm component. 
    // Let's assume there is an input[type="file"].
    const resumePath = path.join(__dirname, 'test-resume.pdf');
    
    // Instead of clicking, we can directly set the file on the input
    await page.setInputFiles('input[type="file"]', resumePath);

    // Fill out the CGPA
    await page.fill('input[type="number"]', '8.5');

    // Click on the Experience Level (e.g., Fresher or Experienced)
    await page.click('text=Experienced');

    // Start the analysis
    await page.click('button:has-text("Upload & Grade CV")');

    // VERY IMPORTANT: We now wait for the Dashboard to appear.
    // If the site hangs on "Grading & Matching CV...", this test will time out and fail,
    // capturing a video of the hang.
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 60000 });

    // Verify the dashboard loaded the results
    await expect(page.locator('text=Your Placement Probability')).toBeVisible({ timeout: 15000 });
  });
});
