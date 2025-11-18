# Staging Issues Tracker

Track and resolve issues found during staging review and QA testing.

## Active Issues

### Critical 🔴

#### Issue #1: [Title]
- **Status:** Open / In Progress / Resolved
- **Reporter:** 
- **Date Found:** 
- **Description:** 
- **Steps to Reproduce:**
  1. 
  2. 
  3. 
- **Expected Behavior:** 
- **Actual Behavior:** 
- **Screenshot/Error:** 
- **Fix:** 
- **Priority:** Critical
- **Assignee:** 
- **Date Resolved:** 

---

### High Priority 🟡

#### Issue #2: [Title]
- **Status:** 
- **Reporter:** 
- **Date Found:** 
- **Description:** 
- **Fix:** 
- **Priority:** High
- **Assignee:** 
- **Date Resolved:** 

---

### Medium Priority 🟢

#### Issue #3: [Title]
- **Status:** 
- **Reporter:** 
- **Date Found:** 
- **Description:** 
- **Fix:** 
- **Priority:** Medium
- **Assignee:** 
- **Date Resolved:** 

---

## Common Issues & Solutions

### CORS Errors

**Issue:** Frontend can't access backend API
```
Access to fetch has been blocked by CORS policy
```

**Solution:**
1. Add frontend URL to Render environment variables:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
2. Backend automatically includes this in CORS allowed origins
3. Redeploy backend
4. Clear browser cache and test

**Files Changed:**
- [`backend/app/main.py`](backend/app/main.py:22)

---

### Image Loading Issues

**Issue:** Product images show broken icons or 404 errors

**Solution 1:** Ensure images are in Git
```bash
git add backend/static/images/
git commit -m "Add product images"
git push
```

**Solution 2:** Fix image URLs in database
```sql
-- URLs should start with /
UPDATE products SET image_url = '/static/images/product.png' 
WHERE image_url = 'static/images/product.png';
```

**Solution 3:** Verify static mount in backend
```python
app.mount("/static", StaticFiles(directory="static"), name="static")
```

**Files Changed:**
- Database records
- [`backend/app/main.py`](backend/app/main.py:19)

---

### Authentication Not Working

**Issue:** Login fails or tokens not persisting

**Solution:**
1. Check CORS credentials: `allow_credentials=True`
2. Verify JWT_SECRET is set in Render
3. Check cookie settings in frontend
4. Ensure frontend uses `credentials: 'include'` in fetch

**Files Changed:**
- [`backend/app/main.py`](backend/app/main.py:22)
- Frontend auth code

---

### Database Tables Missing

**Issue:** 500 errors, "no such table" in logs

**Solution:**
1. Tables should auto-create on startup (SQLAlchemy)
2. If not, run in Render Shell:
   ```bash
   python seed_production.py
   ```
3. Or manual migration:
   ```bash
   python -c "from app.db import Base, engine; Base.metadata.create_all(engine)"
   ```

**Files Changed:**
- Database schema

---

### Environment Variables Not Loading

**Issue:** App crashes, KeyError for env vars

**Solution:**
1. Set in Render Dashboard → Environment
2. Required variables:
   - `JWT_SECRET`
   - `DATABASE_URL` (auto-set)
   - `FRONTEND_URL`
3. Redeploy after adding variables

**Files Changed:**
- Render environment configuration

---

## Resolved Issues ✅

### Issue: CORS blocking product loading
- **Fixed:** 2025-11-10
- **Solution:** Added FRONTEND_URL environment variable
- **By:** Team

### Issue: Images returning 404
- **Fixed:** 2025-11-10
- **Solution:** Committed static/images to Git
- **By:** Team

---

## Testing Notes

### What's Working ✅
- ✅ Products page loads
- ✅ Images display correctly
- ✅ Add to cart works
- ✅ Login/authentication
- ✅ Cart persistence
- ✅ Checkout flow

### What Needs Testing
- [ ] Payment processing
- [ ] Email notifications
- [ ] Order status updates
- [ ] Mobile experience
- [ ] Cross-browser compatibility

---

## Deployment Checklist

Before marking staging complete:

- [ ] All critical issues resolved
- [ ] High priority issues resolved or documented
- [ ] CORS working correctly
- [ ] Images loading on all pages
- [ ] Authentication working
- [ ] Cart and checkout functional
- [ ] Mobile responsive
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] Team sign-off received
- [ ] Ready for production deployment

---

## Team Sign-off

### Development Team
- [ ] Code changes complete
- [ ] Tests passing
- **Signed:** _____________ **Date:** _____________

### QA Team
- [ ] Testing complete
- [ ] Critical bugs fixed
- **Signed:** _____________ **Date:** _____________

### Design Team
- [ ] UI approved
- [ ] Responsive design verified
- **Signed:** _____________ **Date:** _____________

### Product Owner
- [ ] Features approved
- [ ] Ready for production
- **Signed:** _____________ **Date:** _____________

---

## Next Actions

1. [ ] Fix remaining critical issues
2. [ ] Complete QA testing checklist
3. [ ] Update documentation
4. [ ] Schedule production deployment
5. [ ] Prepare rollback plan

**Target Production Date:** _____________