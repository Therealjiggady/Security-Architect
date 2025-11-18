# Day 40: Staging Review & QA Testing

## Overview
Team review of the staging deployment, systematic QA testing, and fixing common deployment issues including CORS configuration and image path problems.

## Staging Environment

**Backend:** https://broke-beauty-api.onrender.com  
**Frontend:** https://broke-beauty.vercel.app  
**API Docs:** https://broke-beauty-api.onrender.com/docs

## QA Testing Checklist

### Core Functionality ✅

#### Authentication
- [ ] User registration works
- [ ] Email validation prevents duplicates
- [ ] Login with valid credentials succeeds
- [ ] Login with invalid credentials fails appropriately
- [ ] Logout clears session
- [ ] Password reset flow works (if implemented)
- [ ] JWT tokens refresh properly

#### Product Browsing
- [ ] Products page loads without errors
- [ ] All product images display correctly
- [ ] Product names and prices are accurate
- [ ] Product descriptions are readable
- [ ] "Add to Cart" buttons are visible
- [ ] Size selection works (if implemented)
- [ ] Product details modal/page works

#### Shopping Cart
- [ ] Add product to cart succeeds
- [ ] Cart persists across page reloads
- [ ] Quantity can be updated
- [ ] Items can be removed from cart
- [ ] Cart total calculates correctly
- [ ] Empty cart message displays when appropriate
- [ ] Cart icon shows item count

#### Checkout Process
- [ ] Checkout button is accessible
- [ ] Shipping form validates inputs
- [ ] Payment method selection works
- [ ] Order creation succeeds
- [ ] Order confirmation displays
- [ ] Inventory updates after purchase

#### User Profile
- [ ] Profile page displays user info
- [ ] Order history shows past orders
- [ ] User can update profile information
- [ ] Wishlist functionality works (if implemented)

#### Navigation
- [ ] All navigation links work
- [ ] Back button works correctly
- [ ] 404 page for invalid routes
- [ ] Breadcrumbs work (if implemented)
- [ ] Mobile menu works

### UI/UX Polish ✨

#### Visual Design
- [ ] Brand colors consistent throughout
- [ ] Typography is readable
- [ ] Spacing and alignment correct
- [ ] Buttons have hover states
- [ ] Loading states display appropriately
- [ ] Error messages are user-friendly
- [ ] Success messages are clear

#### Responsive Design
- [ ] Desktop (1920px) works
- [ ] Laptop (1280px) works
- [ ] Tablet (768px) works
- [ ] Mobile (375px) works
- [ ] Navigation adapts to screen size
- [ ] Images scale properly
- [ ] Text remains readable

#### Accessibility
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast meets standards
- [ ] Screen reader friendly

### Performance ⚡

#### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Product images load quickly
- [ ] Navigation is responsive
- [ ] No layout shift (CLS)
- [ ] Smooth scrolling

#### Network
- [ ] API responses < 500ms
- [ ] Images optimized
- [ ] Minimal bundle size
- [ ] Efficient caching

### Security 🔒

#### HTTPS
- [ ] All pages served over HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid

#### Headers
- [ ] CSP headers set
- [ ] CORS configured correctly
- [ ] XSS protection enabled
- [ ] No sensitive data in URLs

## Common Deployment Issues & Fixes

### Issue 1: CORS Errors

**Symptom:**
```
Access to fetch at 'https://api.onrender.com/products' from origin 
'https://app.vercel.app' has been blocked by CORS policy
```

**Fix 1: Update Backend CORS Configuration**

Check your backend CORS settings in [`backend/app/main.py`](../backend/app/main.py:22):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://broke-beauty.vercel.app",  # Add your Vercel URL
        "https://broke-beauty-staging.vercel.app"  # Add staging URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Fix 2: Use Environment Variable**

Better approach - use environment variable:

```python
import os

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then set in Render:
```
FRONTEND_URL=https://broke-beauty.vercel.app
```

**Fix 3: Wildcard for Development (NOT for production)**
```python
# Only for development/staging
allow_origins=["*"]  # ⚠️ NOT SECURE for production
```

### Issue 2: Images Not Loading

**Symptom:**
- Images show broken icon
- 404 errors for image URLs
- Console shows: `GET /static/images/product.png 404`

**Fix 1: Verify Static Files Mount**

Check [`backend/app/main.py`](../backend/app/main.py:19):
```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```

**Fix 2: Check File Paths**

Ensure directory structure:
```
backend/
  static/
    images/
      product1.png
      product2.png
```

**Fix 3: Update Image URLs**

In database, images should be:
```
/static/images/filename.png  ✅ Correct
static/images/filename.png   ❌ Missing leading slash
```

**Fix 4: Ensure Images Deploy to Render**

Check that `static/` directory is committed to Git:
```bash
git add backend/static/images/
git commit -m "Add product images"
git push
```

### Issue 3: API URL Configuration

**Symptom:**
- Frontend makes requests to `http://localhost:8000`
- Network errors in production

**Fix: Update Frontend API URL**

Create [`frontend/.env.production`](../frontend/.env.production):
```env
VITE_API_URL=https://broke-beauty-api.onrender.com
```

Or in Vercel dashboard:
```
VITE_API_URL=https://broke-beauty-api.onrender.com
```

Update code to use environment variable:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

### Issue 4: Database Not Initialized

**Symptom:**
- 500 errors on all endpoints
- "no such table" errors in logs

**Fix: Run Migrations**

On Render Shell:
```bash
# Option 1: If using Alembic
python -m alembic upgrade head

# Option 2: SQLAlchemy auto-create (already in code)
# Tables created automatically on startup

# Option 3: Seed database
python seed_production.py
```

### Issue 5: Environment Variables Missing

**Symptom:**
- Application crashes on startup
- KeyError for environment variables

**Fix: Set in Render Dashboard**

1. Go to your service → Environment
2. Add required variables:
   ```
   JWT_SECRET=<secure-random-string>
   FRONTEND_URL=https://your-app.vercel.app
   DATABASE_URL=<auto-set-by-render>
   ```

### Issue 6: Static Files 404 on Render

**Symptom:**
- CSS/JS files return 404
- Images return 404

**Fix: Ensure Static Directory Exists**
```bash
# Check directory exists
ls -la backend/static/images/

# Ensure it's committed
git add backend/static/
git commit -m "Add static files"
git push
```

### Issue 7: Port Binding Issues

**Symptom:**
- "Address already in use"
- Service won't start

**Fix: Use PORT Environment Variable**
```python
import os

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

### Issue 8: Build Failures on Vercel

**Symptom:**
- Build fails during deployment
- TypeScript errors

**Fix 1: Test Build Locally**
```bash
cd frontend
npm run build

# Fix any errors
# Then redeploy
```

**Fix 2: Check Node Version**

In [`frontend/package.json`](../frontend/package.json:1):
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## UI Polish Tasks

### Visual Improvements
- [ ] Consistent spacing (use Tailwind spacing scale)
- [ ] Proper loading states (spinners, skeletons)
- [ ] Error states with helpful messages
- [ ] Success feedback (toasts, confirmations)
- [ ] Smooth transitions and animations
- [ ] Consistent button styles
- [ ] Professional color scheme

### UX Improvements
- [ ] Clear call-to-action buttons
- [ ] Intuitive navigation
- [ ] Helpful empty states
- [ ] Form validation feedback
- [ ] Mobile-friendly touch targets
- [ ] Fast page transitions
- [ ] Breadcrumb navigation

### Content Improvements
- [ ] Professional product descriptions
- [ ] Clear pricing information
- [ ] Shipping information
- [ ] Return policy
- [ ] Contact information
- [ ] About page
- [ ] FAQ section

## Testing Scenarios

### Happy Path Testing
1. **New User Journey**
   - Visit site → Register → Browse → Add to Cart → Checkout → Order Confirmation

2. **Returning User Journey**
   - Login → Browse → Quick Add to Cart → Checkout

3. **Guest Browsing**
   - Browse Products → View Details → See Pricing

### Edge Case Testing
1. **Network Issues**
   - Slow connection simulation
   - Offline mode
   - API timeout handling

2. **Empty States**
   - Empty cart
   - No order history
   - No search results

3. **Error Scenarios**
   - Invalid login
   - Out of stock items
   - Payment failures
   - Server errors

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Performance Testing

### Lighthouse Scores
Run on production URL:
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://broke-beauty.vercel.app --view

# Target scores:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://broke-beauty-api.onrender.com/products/

# Or use Locust/Artillery for more complex tests
```

## Monitoring Setup

### Application Monitoring

**1. Render Monitoring**
- Dashboard → Metrics
- View CPU, Memory, Response times

**2. Vercel Analytics**
- Dashboard → Analytics
- View page views, performance

**3. Error Tracking (Sentry)**
```bash
# Install Sentry
pip install sentry-sdk
npm install @sentry/react

# Configure
# See sentry.io for setup
```

### Uptime Monitoring

Set up with UptimeRobot:
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add new monitor
3. Monitor these URLs:
   - `https://broke-beauty-api.onrender.com/health`
   - `https://broke-beauty.vercel.app`
4. Set up alerts (email/SMS)

## Team Review Process

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] No console.log statements in production
- [ ] Error handling implemented
- [ ] Loading states for async operations
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Security best practices followed

### Feature Review
- [ ] All required features implemented
- [ ] Features work as expected
- [ ] Edge cases handled
- [ ] User flow is intuitive
- [ ] Performance acceptable

### Design Review
- [ ] Matches design mockups
- [ ] Brand consistency
- [ ] Professional appearance
- [ ] Mobile experience optimized
- [ ] Clear hierarchy
- [ ] Readable typography

## Bug Tracking

### Create Issues for:
1. **Critical** - Blocks core functionality
2. **High** - Impacts user experience significantly  
3. **Medium** - Minor issues, workarounds available
4. **Low** - Nice to have, polish items

### Issue Template
```markdown
**Title:** [Component] Brief description

**Priority:** Critical/High/Medium/Low

**Description:**
Clear description of the issue

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
Attach screenshots if applicable

**Environment:**
- Browser: Chrome 120
- OS: macOS
- URL: https://broke-beauty.vercel.app/products
```

## Common Fixes

### CORS Quick Fix
```python
# backend/app/main.py
import os

# Get frontend URL from environment
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Image Path Quick Fix
```python
# Ensure proper static file mounting
from pathlib import Path

# Get absolute path to static directory
static_dir = Path(__file__).parent / "static"

app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
```

### API URL Quick Fix
```javascript
// frontend - create config file
// src/config.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Use in components
import { API_URL } from './config';
const response = await fetch(`${API_URL}/products/`);
```

## Deployment Issue Debug Script

See [`debug_deployment.py`](../backend/debug_deployment.py:1) for automated debugging of common issues.

## Polish Tasks

### High Priority
- [ ] Fix any CORS errors
- [ ] Fix broken image links
- [ ] Ensure all API endpoints work
- [ ] Verify authentication flow
- [ ] Test cart functionality
- [ ] Confirm checkout works

### Medium Priority
- [ ] Add loading spinners
- [ ] Improve error messages
- [ ] Add success notifications
- [ ] Polish mobile layout
- [ ] Optimize images
- [ ] Add favicon

### Low Priority
- [ ] Add animations
- [ ] Improve transitions
- [ ] Add micro-interactions
- [ ] Polish footer
- [ ] Add social links
- [ ] Improve SEO meta tags

## Sign-off Criteria

Before moving to production, verify:

### Functionality ✅
- [ ] All core features working
- [ ] No critical bugs
- [ ] Authentication secure
- [ ] Payments processing
- [ ] Email notifications sent

### Performance ✅
- [ ] Lighthouse score > 90
- [ ] API response time < 500ms
- [ ] Page load time < 3s
- [ ] No memory leaks
- [ ] Efficient database queries

### Security ✅
- [ ] HTTPS enabled
- [ ] JWT tokens secure
- [ ] SQL injection protected
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Rate limiting configured

### User Experience ✅
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Consistent design
- [ ] Mobile friendly
- [ ] Fast and responsive

## Stakeholder Review

### Prepare for Review
1. Create test accounts with sample data
2. Document known issues
3. Prepare demo flow
4. List completed features
5. Note pending items

### Review Agenda
1. **Demo** (15 min)
   - Walk through user journey
   - Show key features
   - Demonstrate mobile experience

2. **Feedback** (30 min)
   - Gather stakeholder input
   - Document requested changes
   - Prioritize feedback

3. **Sign-off** (15 min)
   - Review critical issues
   - Set production timeline
   - Assign action items

## Documentation Updates

### Update README.md
- [ ] Add deployment URLs
- [ ] Update setup instructions
- [ ] Add screenshots
- [ ] Document known issues
- [ ] Add contribution guide

### Update API Documentation
- [ ] Ensure all endpoints documented
- [ ] Add example requests/responses
- [ ] Document authentication
- [ ] Add error codes
- [ ] Include rate limits

## Handoff Checklist

### For Development Team
- [ ] All code merged to main
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Known issues documented

### For QA Team
- [ ] Test plan provided
- [ ] Test credentials shared
- [ ] Known issues listed
- [ ] Acceptance criteria defined

### For Design Team
- [ ] UI implemented per specs
- [ ] Responsive design verified
- [ ] Accessibility reviewed
- [ ] Brand guidelines followed

### For Stakeholders
- [ ] Demo environment ready
- [ ] User guide available
- [ ] Timeline communicated
- [ ] Budget on track

## Next Steps

### Day 41: Production Deployment
- Final security audit
- Performance optimization
- Production database migration
- Custom domain setup
- Monitoring and alerts
- Launch plan

### Post-Staging Actions
1. Fix all critical issues found
2. Address high-priority feedback
3. Re-test after fixes
4. Get final stakeholder approval
5. Plan production deployment
6. Prepare rollback plan

## Tools & Resources

### Testing Tools
- **Lighthouse:** Performance auditing
- **WAVE:** Accessibility testing
- **BrowserStack:** Cross-browser testing
- **Postman:** API testing

### Monitoring Tools
- **UptimeRobot:** Uptime monitoring
- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **Google Analytics:** Usage analytics

### Documentation
- Deployment guide: [`DEPLOYMENT.md`](../DEPLOYMENT.md:1)
- Quick deploy: [`QUICK_DEPLOY.md`](../QUICK_DEPLOY.md:1)
- API docs: Available at `/docs` endpoint

## Success Metrics

### Technical
- ✅ 99.9% uptime
- ✅ < 500ms API response time
- ✅ < 3s page load time
- ✅ 0 critical bugs
- ✅ All tests passing

### Business
- ✅ Stakeholders approved
- ✅ User acceptance criteria met
- ✅ Timeline on track
- ✅ Budget maintained
- ✅ Team confident in production readiness

## Notes
- Keep staging environment up at all times
- Test after each deployment
- Document all issues found
- Get sign-off before production
- Maintain staging as production-like environment