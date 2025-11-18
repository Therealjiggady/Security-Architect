# Deployment Guide - Broke & Beauty E-Commerce Platform

Complete step-by-step guide for deploying the Broke & Beauty e-commerce platform to production using Render (backend) and Vercel (frontend).

## 🚀 Quick Deployment Overview

**Estimated Time:** 15-20 minutes  
**Cost:** Free tier available for both platforms  
**Requirements:** GitHub account, domain (optional)

### Platform Choice
- **Backend:** Render (PostgreSQL + Python hosting)
- **Frontend:** Vercel (React + Vite optimized)
- **Alternative:** Heroku + Netlify (see bottom section)

---

## 📋 Pre-Deployment Checklist

Before starting, ensure you have:
- [ ] GitHub repository with your code
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Database schema ready for production
- [ ] Frontend building successfully (`npm run build`)

---

## 🔧 Backend Deployment (Render)

### Step 1: Create Render Account & PostgreSQL Database

1. **Sign up for Render**
   - Visit [render.com](https://render.com)
   - Sign up using your GitHub account
   - Connect your repository

2. **Create PostgreSQL Database First**
   ```bash
   # In Render Dashboard:
   # 1. Click "New +" → "PostgreSQL"
   # 2. Choose:
   ```
   - **Name:** `broke-beauty-db`
   - **Database:** `broke_beauty_prod`  
   - **User:** `broke_beauty_user`
   - **Plan:** Free (or Starter for production)
   - **Region:** Same as your web service (e.g. Oregon)

3. **Save Database Connection Details**
   - Copy the **Internal Database URL** (starts with `postgresql://`)
   - Copy the **External Database URL** (for local testing)

### Step 2: Deploy Backend Web Service

1. **Create Web Service**
   ```bash
   # In Render Dashboard:
   # 1. Click "New +" → "Web Service"
   # 2. Connect your GitHub repository
   # 3. Configure:
   ```

2. **Service Configuration**
   - **Name:** `broke-beauty-api`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3.11`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   ```env
   # Required Variables (Add in Render Dashboard → Environment)
   DATABASE_URL=<your-internal-postgresql-url-from-step-1>
   JWT_SECRET=<generate-strong-256-bit-secret>
   FRONTEND_URL=https://broke-beauty.vercel.app
   ENVIRONMENT=production
   
   # Optional but Recommended
   LOG_LEVEL=INFO
   CORS_ORIGINS=https://broke-beauty.vercel.app,https://*.vercel.app
   ADMIN_REGISTRATION_ENABLED=false
   REGISTRATION_ENABLED=true
   ```

   **Generate Strong JWT Secret:**
   ```bash
   # Use this command to generate a secure secret
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

4. **Deploy Service**
   - Click "Create Web Service"
   - Wait 5-10 minutes for initial deployment
   - Monitor logs for any errors

### Step 3: Initialize Production Database

1. **Access Render Shell**
   ```bash
   # In Render Dashboard:
   # 1. Go to your web service
   # 2. Click "Shell" tab
   # 3. Run the following commands:
   ```

2. **Run Database Migrations**
   ```bash
   # In Render Shell terminal:
   python -m alembic upgrade head
   ```

3. **Seed Production Data**
   ```bash
   # Create initial products and admin user:
   python seed_production.py
   
   # Or create admin user manually:
   python -c "
   from app.db import SessionLocal
   from app.models import User
   from app.auth import get_password_hash
   db = SessionLocal()
   admin = User(
       email='admin@brokebeauty.com',
       full_name='Admin User', 
       hashed_password=get_password_hash('admin123!'),
       role='superuser'
   )
   db.add(admin)
   db.commit()
   print('Admin user created')
   "
   ```

4. **Verify Backend Deployment**
   ```bash
   # Test these URLs (replace with your actual Render URL):
   curl https://broke-beauty-api.onrender.com/health
   # Expected: {"status":"healthy","environment":"production",...}
   
   curl https://broke-beauty-api.onrender.com/docs
   # Should show API documentation (if enabled in production)
   
   curl https://broke-beauty-api.onrender.com/products/
   # Should return empty array or seeded products
   ```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

1. **Update Frontend Environment**
   ```bash
   # Create/update frontend/.env.production
   VITE_API_URL=https://broke-beauty-api.onrender.com
   ```

2. **Test Build Locally**
   ```bash
   cd frontend
   npm run build
   # Should complete without errors
   
   # Test production build
   npm run preview
   # Visit http://localhost:4173 to test
   ```

### Step 2: Deploy to Vercel

1. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import Project**
   ```bash
   # In Vercel Dashboard:
   # 1. Click "New Project"
   # 2. Import your GitHub repository
   # 3. Configure project:
   ```

3. **Project Configuration**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables**
   ```env
   # In Vercel Dashboard → Settings → Environment Variables
   VITE_API_URL=https://broke-beauty-api.onrender.com
   
   # Optional: For different environments
   VITE_ENVIRONMENT=production
   VITE_ENABLE_ANALYTICS=true
   ```

5. **Deploy Frontend**
   - Click "Deploy"
   - Wait 2-5 minutes for build and deployment
   - Vercel will provide a URL like `https://broke-beauty-xyz.vercel.app`

### Step 3: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   ```bash
   # In Vercel Dashboard:
   # 1. Go to Project Settings → Domains
   # 2. Add your domain (e.g., brokebeauty.com)
   # 3. Configure DNS records as shown
   ```

2. **Update Backend CORS**
   ```bash
   # Update FRONTEND_URL in Render environment variables:
   FRONTEND_URL=https://brokebeauty.com
   CORS_ORIGINS=https://brokebeauty.com,https://*.vercel.app
   ```

---

## ✅ Post-Deployment Verification

### Complete System Test
```bash
# 1. Visit your frontend URL
# 2. Test these core flows:
```

**Authentication Flow:**
- [ ] User can register new account
- [ ] User can log in successfully  
- [ ] JWT token is properly stored
- [ ] Protected routes work correctly

**E-commerce Flow:**
- [ ] Products load on homepage
- [ ] Product details page works
- [ ] Add to cart functionality
- [ ] Cart persistence across pages
- [ ] User can view profile/wishlist

**Real-Time Features:**
- [ ] Chat system connects properly
- [ ] Messages send/receive instantly
- [ ] WebSocket connection stable
- [ ] Typing indicators work

**Admin Features (if applicable):**
- [ ] Admin can log in
- [ ] Product management works
- [ ] Chat moderation functions
- [ ] All admin endpoints accessible

### Performance Check
```bash
# Use browser dev tools to verify:
```
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Images load properly
- [ ] No JavaScript errors in console
- [ ] WebSocket connections stable

---

## 🚨 Troubleshooting Common Issues

### Backend Issues

**Issue: "Application failed to start"**
```bash
# Check Render logs for specific error
# Common causes:
# 1. Missing environment variables
# 2. Database connection failed
# 3. Python dependency issues

# Solutions:
# - Verify all environment variables are set
# - Check DATABASE_URL format
# - Review requirements.txt for missing packages
```

**Issue: "Database connection failed"**
```bash
# Verify DATABASE_URL in Render environment variables
# Should look like: postgresql://user:pass@host:port/dbname

# Test connection in Render Shell:
python -c "from app.db import engine; print(engine.connect())"

# Common fixes:
# - Use INTERNAL database URL (not external)
# - Check database is running and accessible
# - Verify credentials are correct
```

**Issue: "CORS errors in frontend"**
```python
# Check backend CORS configuration in app/main.py:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Update FRONTEND_URL environment variable to match exactly
```

### Frontend Issues

**Issue: "Build failed on Vercel"**
```bash
# Check build logs in Vercel dashboard
# Common causes:
# 1. TypeScript errors
# 2. Missing dependencies
# 3. Environment variable issues

# Local debugging:
cd frontend
npm install
npm run build
# Fix any errors shown
```

**Issue: "API calls fail from frontend"**
```bash
# Check network tab in browser dev tools
# Verify VITE_API_URL is correct:
console.log(import.meta.env.VITE_API_URL)

# Should match your Render backend URL exactly
# Update Vercel environment variables if needed
```

### WebSocket/Chat Issues

**Issue: "Chat not connecting"**
```bash
# Check browser console for WebSocket errors
# Common causes:
# 1. JWT token not being sent
# 2. WebSocket URL incorrect  
# 3. Backend WebSocket handler failing

# Debug in browser:
# 1. Check JWT token in localStorage
# 2. Verify WebSocket URL format
# 3. Check backend logs for WebSocket errors
```

---

## 🔄 Updates & Maintenance

### Zero-Downtime Deployments
```bash
# Both Render and Vercel support zero-downtime deployments
# Simply push to your main branch:

git add .
git commit -m "feat: new feature"
git push origin main

# Render will automatically rebuild and deploy backend
# Vercel will automatically rebuild and deploy frontend
```

### Database Migrations
```bash
# For schema changes:
# 1. Create migration locally:
cd backend
alembic revision --autogenerate -m "description"

# 2. Test migration locally:
alembic upgrade head

# 3. Commit and push migration file
git add alembic/versions/
git commit -m "feat: add new table"
git push origin main

# 4. Run migration in production (Render Shell):
python -m alembic upgrade head
```

### Monitoring & Alerts
```bash
# Set up monitoring:
# 1. Render provides built-in monitoring
# 2. Vercel provides analytics
# 3. Consider external monitoring:

# Free monitoring options:
# - UptimeRobot (uptime monitoring)
# - LogRocket (error tracking)
# - Google Analytics (user analytics)
```

---

## 💰 Cost Breakdown

### Free Tier Limits
```bash
# Render Free Tier:
# - 750 hours/month (about 31 days)
# - Spins down after 15 minutes of inactivity
# - PostgreSQL: 1GB storage, 1M rows

# Vercel Free Tier:
# - 100GB bandwidth/month
# - 6,000 build minutes/month
# - Custom domains included

# Total Monthly Cost: $0
```

### Paid Plans (Recommended for Production)
```bash
# Render Starter ($7/month):
# - Always-on service (no spin down)
# - More reliable performance
# - Priority support

# Vercel Pro ($20/month):
# - More bandwidth and build minutes
# - Advanced analytics
# - Team collaboration features

# Estimated Production Cost: ~$27/month
```

---

## 🔐 Security Hardening

### Backend Security
```bash
# Environment Variables Checklist:
# [ ] JWT_SECRET is strong (32+ characters)
# [ ] DATABASE_URL uses SSL connection
# [ ] CORS_ORIGINS is restrictive
# [ ] DEBUG mode disabled in production
# [ ] LOG_LEVEL appropriate for production

# Additional security (optional):
# [ ] Rate limiting enabled
# [ ] Security headers configured
# [ ] SSL certificate valid
# [ ] Dependencies updated regularly
```

### Frontend Security
```bash
# Vercel Security Headers (vercel.json):
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📚 Alternative Deployment: Heroku + Netlify

### Backend (Heroku)

```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# or download from heroku.com

# Login and create app
heroku login
cd backend
heroku create broke-beauty-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set FRONTEND_URL=https://your-app.netlify.app

# Deploy
git push heroku main

# Run migrations
heroku run python -m alembic upgrade head
heroku run python seed_production.py
```

### Frontend (Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
cd frontend
netlify deploy --prod

# Configure build settings:
# - Build command: npm run build
# - Publish directory: dist

# Set environment variables in Netlify dashboard:
# VITE_API_URL=https://your-app.herokuapp.com
```

---

## 📞 Support & Resources

### Documentation Links
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)

### Community Support
- [Render Community](https://community.render.com)
- [Vercel Discord](https://discord.com/invite/vercel)
- [FastAPI Discord](https://discord.com/invite/VQjSZaeJmf)

### Monitoring Services
- **Free:** UptimeRobot, StatusCake, Pingdom (basic)
- **Paid:** Datadog, New Relic, PagerDuty

---

## 🔧 Advanced Configuration

### Custom Docker Deployment
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment-Specific Configurations
```python
# backend/app/config.py - example environment handling
import os
from enum import Enum

class Environment(str, Enum):
    development = "development"
    staging = "staging"
    production = "production"

class Settings:
    def __init__(self):
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.database_url = os.getenv("DATABASE_URL")
        self.jwt_secret = os.getenv("JWT_SECRET")
        self.frontend_url = os.getenv("FRONTEND_URL")
        
    @property
    def is_production(self) -> bool:
        return self.environment == Environment.production
```

### Load Testing
```bash
# Test your deployed application
pip install locust

# Create locustfile.py for load testing
# Run load test against your deployed API
locust -H https://your-api.onrender.com
```

---

**🎉 Congratulations! Your e-commerce platform should now be live and accessible to users worldwide.**

*This deployment guide will be updated as platforms evolve and new best practices emerge.*

**Last updated:** November 2025  
**Version:** 1.0.0