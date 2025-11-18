# Quick Deployment Guide

## 🚀 Deploy in 10 Minutes

### Prerequisites
- [ ] GitHub account
- [ ] Code pushed to GitHub repository
- [ ] Render account (render.com)
- [ ] Vercel account (vercel.com)

## Backend (Render) - 5 Minutes

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy from Dashboard
1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Select your repository
4. Render detects `render.yaml` automatically
5. Click **"Apply"**
6. Wait 3-5 minutes for deployment

### Step 3: Get Your Backend URL
Your API will be live at:
```
https://broke-beauty-api.onrender.com
```

### Step 4: Test Backend
```bash
curl https://broke-beauty-api.onrender.com/health
# Should return: {"status":"ok"}

curl https://broke-beauty-api.onrender.com/products/
# Should return: [] or list of products
```

### Step 5: Seed Database (Optional)
1. Go to Render Dashboard → Your Service
2. Click **"Shell"** tab
3. Run:
   ```bash
   python seed_production.py
   ```

## Frontend (Vercel) - 5 Minutes

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 3: Add Environment Variable
1. Go to **Project Settings** → **Environment Variables**
2. Add:
   ```
   Name: VITE_API_URL
   Value: https://broke-beauty-api.onrender.com
   ```
3. Select all environments (Production, Preview, Development)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build

### Step 5: Get Your Frontend URL
Your site will be live at:
```
https://broke-beauty.vercel.app
```

### Step 6: Test Frontend
1. Visit your Vercel URL
2. Click "Products"
3. Verify products load
4. Test login functionality

## Update Backend CORS

Once you have your frontend URL, update backend CORS:

1. Go to Render Dashboard → Your Service
2. Click **"Environment"** tab
3. Add environment variable:
   ```
   Name: FRONTEND_URL
   Value: https://broke-beauty.vercel.app
   ```
4. Click **"Save Changes"**
5. Service will auto-redeploy

## Verify Integration

Test the complete flow:

1. **Products Page:** Visit `https://broke-beauty.vercel.app/products`
2. **Browse Products:** Should see all products with images
3. **Create Account:** Register a new user
4. **Login:** Sign in with credentials
5. **Add to Cart:** Add products to cart
6. **View Cart:** Check cart page
7. **Profile:** View your profile

## Troubleshooting

### Products Not Loading

**Check 1: Backend API**
```bash
curl https://broke-beauty-api.onrender.com/products/
```

**Check 2: CORS**
- Ensure `FRONTEND_URL` is set in Render
- Should match your Vercel URL exactly

**Check 3: Frontend API URL**
- Check Vercel environment variables
- `VITE_API_URL` should point to Render backend

### Login Not Working

**Check 1: Backend logs**
- Go to Render → Logs
- Look for authentication errors

**Check 2: Frontend console**
- Press F12 in browser
- Check Console tab for errors
- Check Network tab for failed requests

### Images Not Loading

**Check 1: Image paths**
- Images should be in `backend/static/images/`
- URLs should be `/static/images/filename.png`

**Check 2: Static files**
- Verify static files are deployed with backend
- Check Render logs for mount errors

## Production URLs

After deployment, your app will be available at:

- **Frontend:** https://broke-beauty.vercel.app
- **Backend API:** https://broke-beauty-api.onrender.com
- **API Docs:** https://broke-beauty-api.onrender.com/docs
- **Health Check:** https://broke-beauty-api.onrender.com/health

## Auto-Deployments

Once set up, deployments are automatic:

- **Push to `main`** → Deploys to production
- **Push to `develop`** → Deploys to staging  
- **Open PR** → Creates preview deployment

## Cost

Both services are **FREE** for:
- Render: 750 hours/month (1 service always on)
- Vercel: 100GB bandwidth/month

## Next Steps

1. **Custom Domain:** Add your own domain
2. **Monitoring:** Set up uptime monitoring
3. **Analytics:** Add Google Analytics
4. **Error Tracking:** Configure Sentry
5. **Backups:** Schedule database backups

## Need Help?

- **Render Support:** [render.com/docs](https://render.com/docs)
- **Vercel Support:** [vercel.com/docs](https://vercel.com/docs)
- **Issues:** Check logs in respective dashboards

## Summary

✅ Backend deployed to Render with PostgreSQL  
✅ Frontend deployed to Vercel with auto-build  
✅ CORS configured for cross-origin requests  
✅ HTTPS enabled automatically  
✅ Auto-deployments on Git push  

**Total Time:** ~10 minutes  
**Total Cost:** $0 (using free tiers)