import { test, expect } from '@playwright/test';
import { resolve } from 'path';

/**
 * Funnel Diagram Visual Tests
 *
 * This test suite generates screenshots for various funnel diagram permutations
 * to validate visual rendering and styling.
 */

const screenshotDir = resolve(__dirname, '../screenshots');

/**
 * Helper function to render a mermaid diagram and take a screenshot
 */
async function renderAndCapture(page: any, diagramCode: string, filename: string) {
  // Create HTML page with the diagram
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <script type="module">
          import mermaid from '/mermaid.esm.mjs';
          mermaid.initialize({ startOnLoad: true });
        </script>
      </head>
      <body>
        <div class="mermaid">
${diagramCode}
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);

  // Wait for mermaid to render
  await page.waitForSelector('svg', { timeout: 5000 });
  await page.waitForTimeout(500); // Extra time for animations

  // Take screenshot of the SVG element
  const svg = page.locator('svg').first();
  await svg.screenshot({
    path: `${screenshotDir}/${filename}.png`,
    omitBackground: true
  });

  // Verify SVG was rendered
  const svgCount = await page.locator('svg').count();
  expect(svgCount).toBeGreaterThan(0);
}

test.describe('Funnel Diagram Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a blank page
    await page.goto('/');
  });

  test('01 - Basic Funnel (Simple 4-stage)', async ({ page }) => {
    const diagram = `funnel title Sales Pipeline
    "Leads" : 1000
    "Qualified" : 500
    "Proposal" : 200
    "Closed" : 50`;

    await renderAndCapture(page, diagram, '01-basic-funnel');
  });

  test('02 - Funnel with Data Values Displayed', async ({ page }) => {
    const diagram = `funnel showData
    title User Acquisition Funnel
    "Impressions" : 100000
    "Clicks" : 10000
    "Registrations" : 1000
    "Activations" : 500
    "Retained" : 250`;

    await renderAndCapture(page, diagram, '02-funnel-with-data');
  });

  test('03 - E-commerce Conversion Funnel', async ({ page }) => {
    const diagram = `funnel showData
    title E-commerce Conversion
    "Product Views" : 50000
    "Add to Cart" : 5000
    "Checkout Started" : 2000
    "Payment Completed" : 1500`;

    await renderAndCapture(page, diagram, '03-ecommerce-funnel');
  });

  test('04 - Funnel with Custom Colors', async ({ page }) => {
    const diagram = `funnel title Marketing Campaign
    "Awareness" : 10000
    [color: "#FF6B6B"]
    "Interest" : 5000
    [color: "#4ECDC4"]
    "Consideration" : 2000
    [color: "#45B7D1"]
    "Conversion" : 500
    [color: "#96CEB4"]`;

    await renderAndCapture(page, diagram, '04-custom-colors');
  });

  test('05 - Funnel with Stage Notes', async ({ page }) => {
    const diagram = `funnel title Customer Journey
    "Awareness" : 5000
    desc "Customer discovers the brand"
    desc "Through marketing channels"
    "Interest" : 2000
    desc "Customer shows interest"
    desc "Engages with content"
    "Decision" : 500
    desc "Customer makes purchase"`;

    await renderAndCapture(page, diagram, '05-stage-notes');
  });

  test('06 - Funnel with Custom Stage Numbers', async ({ page }) => {
    const diagram = `funnel title Product Development
    "Planning" : 100
    [number: "A1"]
    "Design" : 80
    [number: "B2"]
    "Development" : 60
    [number: "C3"]
    "Testing" : 40
    [number: "D4"]
    "Launch" : 20
    [number: "E5"]`;

    await renderAndCapture(page, diagram, '06-custom-numbers');
  });

  test('07 - Complete Funnel with All Features', async ({ page }) => {
    const diagram = `funnel showData
    title Complete Sales Funnel
    "Lead Generation" : 1000
    desc "Marketing campaigns drive traffic"
    desc "Multiple channels: SEO, Ads, Social"
    [color: "#FF6B6B"]
    [number: "01"]
    "Lead Qualification" : 500
    desc "Sales team reviews leads"
    [color: "#4ECDC4"]
    [number: "02"]
    "Proposal" : 200
    desc "Custom solutions presented"
    [color: "#45B7D1"]
    [number: "03"]
    "Closed Won" : 100
    desc "Contract signed"
    [color: "#96CEB4"]
    [number: "04"]`;

    await renderAndCapture(page, diagram, '07-complete-features');
  });

  test('08 - Recruitment Hiring Funnel', async ({ page }) => {
    const diagram = `funnel title Hiring Process
    "Applications" : 500
    "Phone Screens" : 100
    "Technical Interviews" : 50
    "On-site Interviews" : 25
    "Offers" : 10
    "Acceptances" : 8`;

    await renderAndCapture(page, diagram, '08-recruitment-funnel');
  });

  test('09 - Large Multi-Stage Funnel (8 stages)', async ({ page }) => {
    const diagram = `funnel showData
    title Multi-Stage Process
    "Stage 1" : 10000
    "Stage 2" : 8500
    "Stage 3" : 7000
    "Stage 4" : 5500
    "Stage 5" : 4000
    "Stage 6" : 2800
    "Stage 7" : 1500
    "Stage 8" : 800`;

    await renderAndCapture(page, diagram, '09-multi-stage-funnel');
  });

  test('10 - Marketing Campaign Funnel with Mixed Values', async ({ page }) => {
    const diagram = `funnel title Marketing ROI
    "Impressions" : 500000
    "Clicks" : 25000
    "Landing Page Views" : 20000
    "Form Submissions" : 5000
    "Qualified Leads" : 1200
    "Sales Opportunities" : 400
    "Closed Deals" : 100`;

    await renderAndCapture(page, diagram, '10-marketing-campaign');
  });

  test('11 - Simple 3-Stage Conversion', async ({ page }) => {
    const diagram = `funnel showData
    title Simple Conversion
    "Visitors" : 1000
    "Sign-ups" : 300
    "Purchases" : 75`;

    await renderAndCapture(page, diagram, '11-simple-conversion');
  });

  test('12 - SaaS Subscription Funnel', async ({ page }) => {
    const diagram = `funnel showData
    title SaaS Subscription Journey
    "Free Trial Start" : 5000
    [color: "#3498db"]
    "Product Adoption" : 3000
    [color: "#2ecc71"]
    "Paid Conversion" : 1000
    [color: "#f39c12"]
    "Annual Upgrade" : 300
    [color: "#e74c3c"]`;

    await renderAndCapture(page, diagram, '12-saas-subscription');
  });

  test('13 - Content Marketing Funnel', async ({ page }) => {
    const diagram = `funnel title Content Engagement
    "Blog Readers" : 50000
    desc "Organic and paid traffic"
    "Newsletter Subscribers" : 10000
    desc "Email opt-ins"
    "Download Lead Magnet" : 3000
    desc "Premium content access"
    "Product Interest" : 500
    desc "Demo requests"
    "Customers" : 150
    desc "Paying customers"`;

    await renderAndCapture(page, diagram, '13-content-marketing');
  });

  test('14 - Webinar Registration Funnel', async ({ page }) => {
    const diagram = `funnel showData
    title Webinar Conversion
    "Landing Page Visits" : 15000
    [number: "①"]
    "Registrations" : 3000
    [number: "②"]
    "Attended Live" : 1200
    [number: "③"]
    "Watched Replay" : 800
    [number: "④"]
    "Follow-up Action" : 400
    [number: "⑤"]`;

    await renderAndCapture(page, diagram, '14-webinar-funnel');
  });

  test('15 - App Onboarding Funnel', async ({ page }) => {
    const diagram = `funnel title Mobile App Onboarding
    "App Downloads" : 100000
    [color: "#9b59b6"]
    [number: "Step 1"]
    "Account Created" : 75000
    [color: "#3498db"]
    [number: "Step 2"]
    "Profile Completed" : 50000
    [color: "#1abc9c"]
    [number: "Step 3"]
    "First Action" : 30000
    [color: "#f39c12"]
    [number: "Step 4"]
    "Active User (30 days)" : 15000
    [color: "#27ae60"]
    [number: "Step 5"]`;

    await renderAndCapture(page, diagram, '15-app-onboarding');
  });
});
