# Day 39: Deployment to Staging

## Overview
Deploy the Broken Beauty e-commerce platform to staging environments for testing and demonstration.

**Backend:** Render or Heroku (FastAPI + PostgreSQL)  
**Frontend:** Vercel or Netlify (React + Vite)

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Users (Browser)                  │
└──────────────┬──────────────────────────┘
               │
               ├──────────────────┐
               │                  │
       ┌───────▼────────┐  ┌─────▼──────────┐
       │   Vercel/       │  │   Render/      │
       │   Netlify       │  │   Heroku       │
       │   (Frontend)    │  │   (Backend)    │
       └────────┬────────┘  └────────┬───────┘
                │                    │
                │           ┌────────▼────────┐
                │           │   PostgreSQL    │
                │           │   Database      │
                └───────────┴─────────────────┘
```

## Backend Deployment (Render)

### Why Render?
- ✅ Free tier available
- ✅ Automatic PostgreSQL database
- ✅ Zero-config deployments
- ✅ Automatic HTTPS
- ✅ Health checks built-in

### Prerequisites
1. GitHub repository
2. Render account (render.com)

### Setup Steps

#### 1. Prepare Backend
```bash
cd backend
# Already have requirements.txt
# Create Procfile and render.yaml
```

#### 2. Environment Variables
Create `.env.production`:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-app.vercel.app
```

#### 3. Deploy to Render
1. Go to render.com → New → Web Service
2. Connect your GitHub repo
3. Configure:
   - **Name:** broke-beauty-api
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

4. Add environment variables in Render dashboard
5. Add PostgreSQL database (create new PostgreSQL instance)
6. Deploy!

**Live URL:** `https://broke-beauty-api.onrender.com`

### Alternative: Heroku Deployment

#### Setup Steps
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
cd backend
heroku create broke-beauty-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://your-app.vercel.app

# Deploy
git push heroku main

# Run migrations (if needed)
heroku run python -m alembic upgrade head
```

**Live URL:** `https://broke-beauty-api.herokuapp.com`

## Frontend Deployment (Vercel)

### Why Vercel?
- ✅ Optimized for Vite/React
- ✅ Instant deployments
- ✅ Preview deployments for PRs
- ✅ Edge network (fast globally)
- ✅ Free SSL certificates

### Prerequisites
1. Vercel account (vercel.com)
2. GitHub repository

### Setup Steps

#### 1. Prepare Frontend
```bash
cd frontend
# Update API endpoint
# Create vercel.json
```

#### 2. Environment Variables
Create `.env.production`:
```env
VITE_API_URL=https://broke-beauty-api.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

#### 3. Deploy to Vercel

**Option A: CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

**Option B: Dashboard**
1. Go to vercel.com → New Project
2. Import your GitHub repo
3. Configure:
   - **Framework:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
   - **Install Command:** `npm install`

4. Add environment variables
5. Deploy!

**Live URL:** `https://broke-beauty.vercel.app`

### Alternative: Netlify Deployment

#### Setup Steps

**Option A: CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
cd frontend
netlify init

# Deploy
netlify deploy --prod
```

**Option B: Dashboard**
1. Go to netlify.com → Add new site
2. Import from Git
3. Configure:
   - **Base directory:** frontend
   - **Build command:** `npm run build`
   - **Publish directory:** frontend/dist

4. Add environment variables
5. Deploy!

**Live URL:** `https://broke-beauty.netlify.app`

## Database Setup

### PostgreSQL on Render
1. Create PostgreSQL database in Render
2. Get connection string
3. Add to backend environment variables
4. Run migrations:
```bash
# Connect to instance
render shell
# Run migrations
python -m alembic upgrade head
```

### Seed Production Data
```bash
# Minimal seed data for production
python seed_production.py
```

## Post-Deployment Checklist

### Backend ✅
- [ ] API is accessible
- [ ] Database connected
- [ ] Health check passes (`/health`)
- [ ] CORS configured for frontend URL
- [ ] Environment variables set
- [ ] SSL certificate active
- [ ] Logs working

### Frontend ✅
- [ ] Site loads correctly
- [ ] API calls working
- [ ] Environment variables set
- [ ] Routes working (no 404s)
- [ ] Images loading
- [ ] SSL certificate active
- [ ] Performance optimized

### Integration ✅
- [ ] Frontend → Backend communication
- [ ] Authentication working
- [ ] CORS configured correctly
- [ ] Products loading
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] Order creation

## Monitoring & Logging

### Render Monitoring
- View logs: Render Dashboard → Logs tab
- Metrics: Dashboard → Metrics
- Health checks: Automatic

### Vercel Monitoring
- Analytics: Vercel Dashboard → Analytics
- Logs: Dashboard → Deployments → View Logs
- Performance: Web Vitals tab

### Error Tracking (Optional)
```bash
# Install Sentry
pip install sentry-sdk
npm install @sentry/react

# Configure in app
```

## Troubleshooting

### Backend Issues

**Problem:** Database connection failed
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
python test_connection.py
```

**Problem:** Port binding error
```python
# Use $PORT environment variable
import os
port = int(os.getenv("PORT", 8000))
uvicorn.run(app, host="0.0.0.0", port=port)
```

**Problem:** Static files not serving
```python
# Update paths for production
app.mount("/static", StaticFiles(directory="static"), name="static")
```

### Frontend Issues

**Problem:** API calls failing (CORS)
```javascript
// Check API URL
console.log(import.meta.env.VITE_API_URL)

// Update CORS in backend
allow_origins=["https://your-app.vercel.app"]
```

**Problem:** Blank page after deployment
```bash
# Check build output
npm run build
# Check dist/ directory
ls -la dist/
# Check browser console for errors
```

**Problem:** Environment variables not working
```javascript
// Vercel/Netlify: Must start with VITE_
VITE_API_URL=https://api.example.com

// Access in code
const apiUrl = import.meta.env.VITE_API_URL
```

## Environment Management

### Development
```env
API_URL=http://localhost:8000
DATABASE_URL=sqlite:///./app.db
```

### Staging  
```env
API_URL=https://broke-beauty-staging.onrender.com
DATABASE_URL=postgresql://staging_db_url
```

### Production
```env
API_URL=https://broke-beauty-api.onrender.com
DATABASE_URL=postgresql://production_db_url
```

## Continuous Deployment

### Automatic Deployments
Both Render and Vercel support automatic deployments:

1. **Push to main** → Production deployment
2. **Push to develop** → Staging deployment  
3. **Open PR** → Preview deployment

Configure in:
- Render: Settings → Auto-Deploy
- Vercel: Git → Production Branch

## Security Considerations

### Backend
- [] JWT secret is secure and random
- [ ] Database credentials secured
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] CORS properly restricted
- [ ] SQL injection protection (SQLAlchemy)

### Frontend
- [ ] API keys not exposed in client code
- [ ] Use environment variables
- [ ] Content Security Policy configured
- [ ] XSS protection enabled

## Performance Optimization

### Backend
- [ ] Database indexes created
- [ ] Query optimization
- [ ] Response caching
- [ ] Connection pooling

### Frontend
- [ ] Code splitting
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Bundle size optimization
- [ ] CDN for static assets

## Cost Estimates

### Free Tier
- **Render:** Free (with limitations)
- **Vercel:** Free (100GB bandwidth/month)
- **Netlify:** Free (100GB bandwidth/month)

### Paid Plans (if needed)
- **Render:** $7/month (Starter)
- **Vercel:** $20/month (Pro)
- **Netlify:** $19/month (Pro)

## Testing Staging Environment

### Manual Testing
```bash
# Test backend
curl https://broke-beauty-api.onrender.com/health

# Test frontend
open https://broke-beauty.vercel.app

# Test integration
# 1. Browse products
# 2. Add to cart
# 3. Checkout
# 4. Verify order created
```

### Automated Testing
```bash
# Run E2E tests against staging
BASEURL=https://broke-beauty.vercel.app npm run test:e2e
```

## Rollback Strategy

### Render
1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

### Vercel/Netlify
1. Go to Deployments
2. Find working deployment
3. Click "Promote to Production"

## Documentation

- **Backend API:** `https://broke-beauty-api.onrender.com/docs`
- **Health Check:** `https://broke-beauty-api.onrender.com/health`
- **Frontend:** `https://broke-beauty.vercel.app`

## Next Steps

### Day 40: Production Deployment
- Set up custom domain
- Configure DNS
- Production database backups
- Monitoring and alerts
- Load balancing (if needed)

### Future Enhancements
- CDN configuration
- Database replicas
- Redis caching
- Message queue
- Scheduled jobs
- API rate limiting
- Advanced analytics

## Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)