# QA Testing Checklist for Staging

## Pre-Testing Setup

- [ ] Staging backend URL: ____________________
- [ ] Staging frontend URL: ____________________
- [ ] Test user credentials created
- [ ] Sample products in database
- [ ] Test payment method configured

## Test Environment

- **Date:** ____________
- **Tester:** ____________
- **Browser:** ____________
- **Device:** ____________
- **OS:** ____________

---

## 1. Authentication Testing

### Registration
- [ ] Can access registration page
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] Duplicate email prevented
- [ ] Success message shown
- [ ] Redirects to appropriate page
- [ ] **Notes:** ____________________

### Login
- [ ] Can access login page
- [ ] Valid credentials succeed
- [ ] Invalid email shows error
- [ ] Invalid password shows error
- [ ] "Remember me" works (if implemented)
- [ ] Redirects to appropriate page
- [ ] **Notes:** ____________________

### Logout
- [ ] Logout button visible when logged in
- [ ] Logout clears session
- [ ] Redirects to home/login
- [ ] Cannot access protected pages after logout
- [ ] **Notes:** ____________________

---

## 2. Product Browsing

### Products Page
- [ ] Products page loads (no errors)
- [ ] All products displayed
- [ ] Product images load correctly
- [ ] Product names readable
- [ ] Prices displayed correctly
- [ ] "Add to Cart" buttons visible
- [ ] Grid layout works on desktop
- [ ] Grid layout works on mobile
- [ ] **Notes:** ____________________

### Product Details
- [ ] Can click on product card
- [ ] Product details page/modal loads
- [ ] Full description visible
- [ ] Size selection works
- [ ] Color selection works (if implemented)
- [ ] Stock availability shown
- [ ] Can add to cart from details
- [ ] **Notes:** ____________________

### Images
- [ ] All product images load
- [ ] Images are high quality
- [ ] No broken image icons
- [ ] Images scale properly on mobile
- [ ] Lazy loading works
- [ ] **Notes:** ____________________

---

## 3. Shopping Cart

### Add to Cart
- [ ] Can add product to cart
- [ ] Success feedback shown
- [ ] Cart icon updates count
- [ ] Multiple items can be added
- [ ] Same item increases quantity
- [ ] **Notes:** ____________________

### View Cart
- [ ] Cart page loads correctly
- [ ] All cart items displayed
- [ ] Product images show in cart
- [ ] Prices are correct
- [ ] Subtotal calculates correctly
- [ ] Tax calculated (if implemented)
- [ ] Total amount correct
- [ ] **Notes:** ____________________

### Modify Cart
- [ ] Can update quantity
- [ ] Quantity updates total
- [ ] Can remove items
- [ ] Can empty entire cart
- [ ] Empty cart message shows
- [ ] Changes persist on reload
- [ ] **Notes:** ____________________

---

## 4. Checkout Process

### Checkout Flow
- [ ] Can proceed to checkout
- [ ] Shipping form displays
- [ ] Form validation works
- [ ] Payment method selection works
- [ ] Order summary accurate
- [ ] Can submit order
- [ ] Order confirmation shows
- [ ] **Notes:** ____________________

### Order Creation
- [ ] Order appears in order history
- [ ] Order has correct status (pending)
- [ ] Order items are correct
- [ ] Order total is correct
- [ ] Stock was decremented
- [ ] Cart was cleared
- [ ] **Notes:** ____________________

---

## 5. User Profile

### Profile Page
- [ ] Profile page loads
- [ ] User information displayed
- [ ] Email shown correctly
- [ ] Name shown correctly
- [ ] Can edit profile (if implemented)
- [ ] **Notes:** ____________________

### Order History
- [ ] Order history page loads
- [ ] Past orders displayed
- [ ] Order details correct
- [ ] Order status shown
- [ ] Can view order details
- [ ] Orders sorted by date (newest first)
- [ ] **Notes:** ____________________

---

## 6. Navigation & UI

### Header/Navigation
- [ ] Logo/brand name visible
- [ ] Nav links work
- [ ] Cart icon visible
- [ ] User menu works (when logged in)
- [ ] Mobile menu works
- [ ] Navigation is sticky (if designed)
- [ ] **Notes:** ____________________

### Footer
- [ ] Footer displays on all pages
- [ ] Links work
- [ ] Contact info visible
- [ ] Social links work (if implemented)
- [ ] Copyright year correct
- [ ] **Notes:** ____________________

### Overall UI
- [ ] Consistent branding
- [ ] Readable fonts
- [ ] Proper spacing
- [ ] Colors match design
- [ ] No visual glitches
- [ ] Professional appearance
- [ ] **Notes:** ____________________

---

## 7. Responsive Design

### Desktop (1920px)
- [ ] Layout looks professional
- [ ] All content readable
- [ ] Images properly sized
- [ ] No horizontal scroll
- [ ] Navigation clear
- [ ] **Notes:** ____________________

### Laptop (1280px)
- [ ] Layout adapts properly
- [ ] Content still readable
- [ ] Images scale correctly
- [ ] Navigation works
- [ ] **Notes:** ____________________

### Tablet (768px)
- [ ] Layout stacks appropriately
- [ ] Touch targets adequate size
- [ ] Images responsive
- [ ] Navigation adapts (hamburger menu)
- [ ] **Notes:** ____________________

### Mobile (375px)
- [ ] Single column layout
- [ ] All content accessible
- [ ] Images fit screen
- [ ] Forms are usable
- [ ] Buttons large enough
- [ ] **Notes:** ____________________

---

## 8. Performance

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Product images load quickly
- [ ] Navigation is instant
- [ ] API responses feel fast
- [ ] No noticeable lag
- [ ] **Notes:** ____________________

### Interactions
- [ ] Button clicks are responsive
- [ ] Form submissions are quick
- [ ] Page transitions smooth
- [ ] No freezing or hanging
- [ ] **Notes:** ____________________

---

## 9. Error Handling

### Network Errors
- [ ] Graceful handling when offline
- [ ] Error messages are clear
- [ ] Can recover from errors
- [ ] Retry mechanisms work
- [ ] **Notes:** ____________________

### Form Errors
- [ ] Validation errors display clearly
- [ ] Field-specific error messages
- [ ] Form doesn't submit with errors
- [ ] Can correct and resubmit
- [ ] **Notes:** ____________________

### Page Errors
- [ ] 404 page for invalid routes
- [ ] 500 error handled gracefully
- [ ] Error page is branded
- [ ] Can navigate back
- [ ] **Notes:** ____________________

---

## 10. Integration Issues

### CORS
- [ ] No CORS errors in console
- [ ] API calls succeed
- [ ] Cookies/tokens work
- [ ] **Issue:** ____________________
- [ ] **Fix:** ____________________

### Image Paths
- [ ] All images display
- [ ] No 404s for images
- [ ] Paths are correct
- [ ] **Issue:** ____________________
- [ ] **Fix:** ____________________

### API Endpoints
- [ ] All endpoints respond
- [ ] Data format correct
- [ ] Authentication works
- [ ] **Issue:** ____________________
- [ ] **Fix:** ____________________

---

## 11. Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Images load
- [ ] **Issues:** ____________________

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Images load
- [ ] **Issues:** ____________________

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Images load
- [ ] **Issues:** ____________________

### Mobile Safari (iOS)
- [ ] All features work
- [ ] Touch interactions work
- [ ] **Issues:** ____________________

### Mobile Chrome (Android)
- [ ] All features work
- [ ] Touch interactions work
- [ ] **Issues:** ____________________

---

## 12. Security

### HTTPS
- [ ] All pages served over HTTPS
- [ ] SSL certificate valid
- [ ] No security warnings
- [ ] **Notes:** ____________________

### Authentication
- [ ] Passwords not visible
- [ ] Tokens stored securely
- [ ] Session timeout works
- [ ] Unauthorized access prevented
- [ ] **Notes:** ____________________

---

## Bugs Found

### Critical (Blocks core functionality)
1. ____________________
2. ____________________
3. ____________________

### High (Impacts UX significantly)
1. ____________________
2. ____________________
3. ____________________

### Medium (Minor issues)
1. ____________________
2. ____________________
3. ____________________

### Low (Nice to have)
1. ____________________
2. ____________________
3. ____________________

---

## Overall Assessment

### What Works Well ✅
1. ____________________
2. ____________________
3. ____________________

### What Needs Improvement ⚠️
1. ____________________
2. ____________________
3. ____________________

### Blockers for Production 🚫
1. ____________________
2. ____________________
3. ____________________

---

## Sign-off

### Recommendation
- [ ] **Approved** - Ready for production
- [ ] **Approved with conditions** - Fix minor issues first
- [ ] **Not approved** - Major issues must be resolved

### Tester Signature
**Name:** ____________________  
**Date:** ____________________  
**Signature:** ____________________

### Comments
____________________
____________________
____________________
____________________

---

## Next Actions

1. ____________________
2. ____________________
3. ____________________

**Target Production Date:** ____________________