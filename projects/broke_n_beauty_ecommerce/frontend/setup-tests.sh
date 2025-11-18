#!/bin/bash

echo "======================================"
echo "Setting up E2E Tests with Playwright"
echo "======================================"

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "Error: Must be run from frontend directory"
    exit 1
fi

# Install Playwright
echo ""
echo "Step 1: Installing Playwright..."
npm install -D @playwright/test

# Install browsers
echo ""
echo "Step 2: Installing browsers (Chromium, Firefox, WebKit)..."
npx playwright install

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "To run tests:"
echo "  npm run test:e2e              # Run all tests"
echo "  npm run test:e2e:ui           # Run in UI mode"
echo "  npm run test:e2e:headed       # Run with visible browser"
echo "  npm run test:e2e:debug        # Debug mode"
echo ""
echo "Make sure your backend is running on http://localhost:8000"
echo "======================================"