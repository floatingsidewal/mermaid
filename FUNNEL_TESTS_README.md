# Funnel Diagram Visual Tests

## Overview

This setup provides comprehensive visual testing for Mermaid's funnel diagram feature with 15 different permutations.

## Files Created

1. **playwright.config.ts** - Playwright configuration for E2E testing
2. **e2e/funnel/funnel-visual-tests.spec.ts** - Automated Playwright tests
3. **demos/dev/funnel-visual-tests.html** - Interactive demo page with all 15 funnel variations

## Viewing the Funnel Diagrams

### Access the Demo Page

The dev server is running at: **http://localhost:9000**

View all 15 funnel diagrams at:
**http://localhost:9000/dev/funnel-visual-tests.html**

## 15 Funnel Diagram Permutations

1. **Basic Funnel** - Simple 4-stage sales pipeline
2. **With Data Values** - Shows actual values alongside labels  
3. **E-commerce Conversion** - 4-stage e-commerce funnel with data
4. **Custom Colors** - Each stage has custom color styling
5. **Stage Notes** - Includes descriptive notes for each stage
6. **Custom Stage Numbers** - Uses custom numbering (A1, B2, C3...)
7. **Complete Features** - All features combined (data, colors, notes, numbers)
8. **Recruitment Hiring** - 6-stage recruitment process
9. **Multi-Stage (8 stages)** - Large funnel with 8 stages
10. **Marketing Campaign** - 7-stage marketing ROI funnel
11. **Simple 3-Stage** - Minimal conversion funnel
12. **SaaS Subscription** - 4-stage subscription journey with colors
13. **Content Marketing** - 5-stage content engagement with notes
14. **Webinar Registration** - Custom Unicode numbers (①②③④⑤)
15. **App Onboarding** - 5-stage mobile app onboarding with colors and custom numbers

## Features Tested

- Basic funnel rendering
- `showData` flag to display values
- Custom colors with `[color: "value"]`
- Stage descriptions/notes with `desc "text"`
- Custom stage numbering with `[number: "value"]`
- Various stage counts (3, 4, 5, 6, 7, 8 stages)
- Different value patterns (decreasing, plateaus, large numbers)
- Unicode characters in custom numbers
- Title display
- Combined features

## Taking Screenshots

### Manual Method (Recommended)

1. Open http://localhost:9000/dev/funnel-visual-tests.html in your browser
2. Scroll through each diagram
3. Use browser screenshot tools or OS screenshot utilities
4. Each diagram is clearly labeled with its number and description

### Automated Method (Playwright)

Note: Playwright browser installation had issues in this environment, but the test file is ready.

When browsers are available, run:
```bash
pnpm playwright test e2e/funnel/funnel-visual-tests.spec.ts
```

Screenshots will be saved to: `e2e/screenshots/`

## Dev Server Commands

```bash
# Start server (already running)
pnpm dev

# Stop server
# Kill the background process

# Rebuild if changes made
pnpm build
```

## Next Steps

- View the interactive demo at http://localhost:9000/dev/funnel-visual-tests.html
- Manually capture screenshots of each diagram variation
- Verify visual rendering quality
- Test different themes if needed
- Report any visual issues found

