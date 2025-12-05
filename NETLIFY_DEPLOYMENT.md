# 🚀 CryptoAlert Frontend - Netlify Deployment Guide

## Overview

This guide explains how to deploy the CryptoAlert frontend (React SPA) to Netlify.

**Project**: CryptoAlert Frontend  
**Framework**: React 19 + TypeScript + Vite  
**Build Size**: ~438 KB (JS) + 33 KB (CSS)  
**Hosting**: Netlify (Static site hosting)

---

## ✅ Prerequisites

1. **Netlify Account**
   - Free tier: https://app.netlify.com/signup
   - No credit card required

2. **GitHub Repository**
   - Already connected: https://github.com/DaviNogueira1020/CryptoAlert_

3. **Backend API URL**
   - Backend must be deployed (Vercel or other)
   - Example: `https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app`

---

## 🔧 Step 1: Connect GitHub to Netlify

### Option A: Automatic (Recommended)

1. Go to https://app.netlify.com
2. Click **"Connect to Git"**
3. Select **GitHub**
4. Authorize Netlify to access your repositories
5. Select: **DaviNogueira1020/CryptoAlert_**

### Option B: Manual via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to repository
cd CryptoAlert_
netlify init

# Deploy
netlify deploy --prod
```

---

## 📋 Step 2: Configure Build Settings

When connecting the repository, Netlify will ask for build configuration:

### Build Command
```
npm run build --workspace=apps/frontend
```

### Publish Directory
```
apps/frontend/build
```

**Note**: The `netlify.toml` file in the root automatically configures this, but you can verify/update in Netlify dashboard:
- Site settings → Build & deploy → Build settings

---

## 🌍 Step 3: Set Environment Variables

### In Netlify Dashboard

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add the following variables:

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your backend API URL | `https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app` |
| `NODE_ENV` | `production` | `production` |
| `NODE_VERSION` | `20` | `20` (or current stable) |

**Important**: 
- The backend must be running and accessible from Netlify
- CORS must be configured on the backend to allow frontend domain

### Example CORS Setup (Backend)

```typescript
// apps/backend/src/app.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://cryptoalert-frontend.netlify.app',
  credentials: true,
}));
```

---

## 🔄 Step 4: Set Backend CORS

Update your **Vercel environment variables** to allow Netlify frontend:

Go to: https://vercel.com/dashboard/project/cripto-alert/settings/environment-variables

Add/Update:
```
CORS_ORIGIN = https://YOUR_NETLIFY_SITE_NAME.netlify.app
```

Or allow multiple origins:
```
CORS_ORIGIN = https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app,https://YOUR_NETLIFY_SITE_NAME.netlify.app
```

---

## 🚀 Step 5: Deploy

### Automatic (Recommended)

Once GitHub is connected:
1. Every push to `main` branch automatically triggers a build
2. Netlify builds and deploys automatically
3. Check deployment status in Netlify dashboard

```bash
# Just push your code
git push origin main

# Netlify automatically:
# 1. Runs npm run build --workspace=apps/frontend
# 2. Builds React + Vite
# 3. Deploys to Netlify edge network
```

### Manual Deploy via CLI

```bash
# One-time deploy (for testing)
netlify deploy --workspace=apps/frontend

# Production deploy
netlify deploy --workspace=apps/frontend --prod
```

---

## ✨ Post-Deployment

### 1. Get Your Frontend URL

After deployment, you'll have a URL like:
```
https://YOUR_SITE_NAME.netlify.app
```

You can also:
- Set custom domain in Site settings
- Get SSL certificate (automatic with Netlify)

### 2. Test the Frontend

```bash
# Test health endpoint
curl https://YOUR_NETLIFY_URL/
# Should load React app

# Test API connection
# Open browser console and check if API calls work
https://YOUR_NETLIFY_URL/dashboard
```

### 3. Verify API Connection

Check browser console (DevTools → Console):
- Should see successful API calls to backend
- No CORS errors

If CORS error:
- Backend CORS is not configured correctly
- Check `CORS_ORIGIN` environment variable on Vercel

---

## 🔍 Troubleshooting

### 1. Build Fails

**Error**: `"build": "vite build" failed`

**Solution**:
```bash
# Check build locally first
cd apps/frontend
npm install
npm run build

# Check for TypeScript errors
npm run type-check
```

### 2. CORS Errors

**Error**: API calls fail with `Cross-Origin Request Blocked`

**Solution**:
1. Check backend CORS configuration
2. Verify `CORS_ORIGIN` in Vercel includes Netlify domain
3. Redeploy backend after changing env vars

### 3. API Endpoint Not Found

**Error**: 404 when calling API

**Solution**:
1. Verify `VITE_API_URL` in Netlify environment
2. Check backend is running and accessible
3. Verify endpoint path is correct

### 4. Blank Page After Deploy

**Error**: Frontend loads but shows blank page

**Solution**:
1. Check browser console for JS errors
2. Verify `index.html` is in build output
3. Check Netlify build logs for errors

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│           NETLIFY (Frontend)                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  React SPA (Static Site)                        │
│  ├─ Served from Netlify CDN (global)           │
│  ├─ Files: apps/frontend/build/                │
│  │  ├─ index.html                              │
│  │  └─ assets/                                 │
│  ├─ Auto-HTTPS: ✅                             │
│  ├─ Auto-deploys on git push: ✅               │
│  └─ Redirects all routes to index.html: ✅     │
│                                                 │
│  Calls Backend API (on Vercel)                  │
│  └─ VITE_API_URL env variable                  │
│                                                 │
└─────────────────────────────────────────────────┘
         │
         │ git push main
         │
    ┌─────────────┐
    │ GitHub repo │
    │    main     │
    └─────────────┘
         │
         └──→ Auto-trigger Netlify build
```

---

## 🎯 Configuration Files

### netlify.toml (Root)
Located at: `/netlify.toml`

```toml
[build]
  command = "npm run build --workspace=apps/frontend"
  publish = "apps/frontend/build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### _redirects (Fallback)
Located at: `apps/frontend/public/_redirects`

```
/* /index.html 200
```

Both handle SPA routing. If `netlify.toml` exists, it takes precedence.

---

## 📱 Testing Checklist

After deployment, verify:

- [ ] Frontend loads at Netlify URL
- [ ] All pages render (dashboard, alerts, profile, etc.)
- [ ] API calls work (check Network tab in DevTools)
- [ ] Authentication works (login/register)
- [ ] Alerts CRUD works
- [ ] No CORS errors in console
- [ ] No TypeScript errors in build
- [ ] Performance is good (check Lighthouse)

---

## 🔐 Security

### Netlify Security Features

- ✅ **HTTPS**: Automatic SSL/TLS certificate
- ✅ **DDoS Protection**: Built-in
- ✅ **Headers**: Security headers configured in `netlify.toml`
- ✅ **CDN**: Global edge network reduces latency

### Recommended Additional Security

1. **Set custom domain** (instead of netlify.app subdomain)
2. **Enable branch deploys** for staging
3. **Set up branch protection** on GitHub
4. **Monitor build logs** for vulnerabilities

---

## 🚀 Continuous Deployment

Every push to `main` triggers automatic deployment:

```bash
# 1. Make code changes
git add .
git commit -m "feat: update frontend"

# 2. Push to GitHub
git push origin main

# 3. Netlify automatically:
#    - Clones repo
#    - Runs: npm run build --workspace=apps/frontend
#    - Deploys to CDN
#    - Updates live site

# 4. Check deployment
# - Netlify dashboard shows build status
# - New deployment URL created
```

---

## 📊 Build Artifacts

### Frontend Build Output

```
apps/frontend/build/
├── index.html                    (0.44 KB)
├── _redirects                    (12 bytes)
└── assets/
    ├── index-DD81ZBzk.css        (33.12 KB)
    ├── index-CQnRZH2N.js         (438.23 KB)
    └── [other assets]

Total size: ~471 KB (gzipped: ~143 KB)
Build time: ~3-4 seconds
```

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| **Netlify Dashboard** | https://app.netlify.com |
| **Site Settings** | https://app.netlify.com/sites/YOUR_SITE_NAME/settings |
| **GitHub Repo** | https://github.com/DaviNogueira1020/CryptoAlert_ |
| **Backend (Vercel)** | https://vercel.com/dashboard/project/cripto-alert |
| **Netlify Docs** | https://docs.netlify.com |
| **React Deployment** | https://docs.netlify.com/frameworks/react |
| **SPA Routing** | https://docs.netlify.com/routing/redirects/spa-fallback |

---

## 📞 Support

### Troubleshooting Resources

1. **Netlify Docs**: https://docs.netlify.com
2. **Build Issues**: Check Netlify dashboard → Deploys → build log
3. **API Issues**: Check browser console → Network tab
4. **GitHub Issues**: Create issue in repository

### Common Commands

```bash
# Clear Netlify cache
netlify cache:clear

# View build logs
netlify logs

# Test locally
cd apps/frontend
npm run dev

# Build locally
npm run build
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository connected to Netlify
- [ ] Build command set: `npm run build --workspace=apps/frontend`
- [ ] Publish directory set: `apps/frontend/build`
- [ ] Environment variable set: `VITE_API_URL`
- [ ] Backend CORS configured for Netlify domain
- [ ] First deployment successful
- [ ] Frontend loads without errors
- [ ] API calls work (check DevTools)
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up (optional)

---

**Status**: 🟢 Ready for Deployment  
**Last Updated**: December 5, 2025  
**Framework**: React 19 + Vite + TypeScript  
**Hosting**: Netlify
