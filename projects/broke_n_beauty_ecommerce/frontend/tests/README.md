# E2E Testing with Playwright

## Setup

### 1. Install Playwright
```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

### 2. Install Browsers
```bash
npx playwright install chromium firefox webkit
```

## Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/auth.spec.ts
npx playwright test tests/e2e/products.spec.ts
npx playwright test tests/e2e/cart.spec.ts
npx playwright test tests/e2e/complete-flow.spec.ts
```

### Run Tests in UI Mode
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## View Test Results

### Show HTML Report
```bash
npx playwright show-report
```

### Show Trace (for failed tests)
```bash
npx playwright show-trace trace.zip
```

## Prerequisites

Before running tests, make sure:

1. **Backend is running** on http://localhost:8000
   ```bash
   cd backend
   source ../.venv/bin/activate
   uvicorn app.main:app --reload
   ```

2. **Frontend dev server is running** on http://localhost:5173
   ```bash
   cd frontend
   npm run dev
   ```

## Test Files

- `auth.spec.ts` - Authentication tests (signup, login, logout)
- `products.spec.ts` - Product browsing tests
- `cart.spec.ts` - Shopping cart tests
- `complete-flow.spec.ts` - Full end-to-end user journey

## Writing New Tests

Create new test files in `frontend/tests/e2e/`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test code here
  });
});
```

## Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Wait for elements** before interacting
3. **Check visibility** before assertions
4. **Clean up test data** after tests
5. **Run tests in isolation** (no dependencies between tests)

## Troubleshooting

### Tests are flaky
- Increase timeouts: `{ timeout: 10000 }`
- Add explicit waits: `await page.waitForSelector()`
- Use `waitForLoadState()`: `await page.waitForLoadState('networkidle')`

### Can't find elements
- Use Playwright Inspector: `npx playwright test --debug`
- Check selector: `await page.locator('selector').highlight()`
- Print page content: `console.log(await page.content())`

### Backend not responding
- Verify backend is running on port 8000
- Check CORS settings in backend
- Verify database has test data

## CI/CD Integration

Add to `.github/workflows/tests.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Install Playwright
        run: cd frontend && npx playwright install --with-deps
      - name: Start backend
        run: |
          cd backend
          python -m venv venv
          source venv/bin/activate
          pip install -r requirements.txt
          uvicorn app.main:app &
      - name: Run tests
        run: cd frontend && npm run test:e2e
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend/playwright-report/