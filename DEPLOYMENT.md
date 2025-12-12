# 🚀 Deployment Guide

This guide covers deploying the Mindful application to production using Vercel (frontend/API) and Neon or Railway (PostgreSQL database).

---

## 🎯 Deployment Overview

### Recommended Stack
- **Frontend/API**: Vercel (Next.js hosting)
- **Database**: Neon or Railway (PostgreSQL)
- **CDN**: Vercel Edge Network (built-in)
- **DNS**: Your domain registrar

### Expected Costs
- **Vercel**: Free tier or $20+/month
- **Neon**: Free tier (up to 3 projects) or $0.12 per 1GB
- **Domain**: $10-15/year

---

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Environment variables documented
- [ ] Database migrations tested locally
- [ ] Git repository created and pushed to GitHub
- [ ] README.md updated with correct information
- [ ] .env.local is in .gitignore (not committed)
- [ ] Production environment variables ready

---

## Step 1: Set Up PostgreSQL Database (Neon)

Neon is recommended for serverless PostgreSQL with Vercel integration.

### 1.1 Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up or log in
3. Click "Create Project"
4. Fill in project details:
   - **Project name**: `mindful`
   - **Region**: Closest to your users
   - **Postgres version**: 16 (default)
5. Click "Create"

### 1.2 Get Connection String

1. In Neon dashboard, go to your project
2. Click "Connection string" 
3. Copy the PostgreSQL connection string (starts with `postgresql://`)
4. It will look like: `postgresql://user:password@host/mindful`

### 1.3 Initialize Database Schema

```bash
# Install psql if needed
brew install postgresql@16

# Connect to remote database
psql "postgresql://user:password@host/mindful" -f prisma/init.sql

# Verify tables were created
psql "postgresql://user:password@host/mindful" -c "\dt"
```

---

## Step 2: Set Up GitHub Repository

Vercel deploys directly from GitHub.

### 2.1 Create GitHub Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create repository on github.com
# Then add remote and push
git remote add origin https://github.com/yourusername/mindful.git
git branch -M main
git push -u origin main
```

### 2.2 Ensure .gitignore

```bash
# Verify these are in .gitignore
cat .gitignore | grep -E ".env|node_modules|.next"
```

---

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "Add New" → "Project"
4. Import GitHub repository (search for "mindful")
5. Click "Import"

### 3.2 Configure Environment Variables

In Vercel dashboard, go to project settings → "Environment Variables"

Add these variables:

```
DATABASE_URL = postgresql://user:password@host/mindful
NEXTAUTH_URL = https://yourdomain.com
NEXTAUTH_SECRET = your-secret-key-here
NODE_ENV = production
```

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (typically 2-3 minutes)
3. You'll see a success message with your URL: `https://mindful-xxx.vercel.app`

### 3.4 Verify Deployment

```bash
# Test the deployed app
curl https://yourdomain.vercel.app
curl https://yourdomain.vercel.app/api/auth/session
```

---

## Step 4: Configure Custom Domain

### 4.1 Add Domain to Vercel

1. In Vercel project settings, go to "Domains"
2. Click "Add Domain"
3. Enter your domain: `mindful.example.com`
4. Follow instructions to update DNS records

### 4.2 Update DNS Records

At your domain registrar (GoDaddy, Namecheap, etc.):

```
Type: CNAME
Name: mindful
Value: cname.vercel-dns.com
```

**Or using A records:**
```
Type: A
Name: mindful
Value: 76.76.19.165

Type: AAAA
Name: mindful
Value: 2606:4700:4400::2f87:13a5
```

Wait for DNS propagation (5-15 minutes).

### 4.3 Update Environment Variable

Update `NEXTAUTH_URL` in Vercel dashboard:
```
NEXTAUTH_URL = https://mindful.example.com
```

---

## Step 5: Configure Authentication

### 5.1 Update NextAuth Settings

Update environment variables in Vercel:

```env
NEXTAUTH_URL=https://mindful.example.com
NEXTAUTH_SECRET=your-very-secure-secret-key
```

### 5.2 Test Authentication

```bash
# Test sign up
curl -X POST https://mindful.example.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"TestPassword123",
    "name":"Test User"
  }'

# Test sign in
curl -X POST https://mindful.example.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"TestPassword123"
  }'
```

---

## Step 6: Set Up Database Backups

### Neon Automatic Backups

Neon provides:
- **Retention period**: 7 days (free tier)
- **Auto-backups**: Every 6 hours
- **Point-in-time recovery**: Available

To restore from backup:
1. In Neon console, go to "Backups"
2. Select a backup
3. Click "Restore"

### Manual Backups

```bash
# Export database
pg_dump "postgresql://user:password@host/mindful" > backup.sql

# Import database
psql "postgresql://user:password@host/mindful" < backup.sql
```

---

## Step 7: Monitor Production

### 7.1 Vercel Monitoring

In Vercel dashboard:
- Check "Analytics" for performance
- Monitor "Functions" for API usage
- Review "Deployments" for deployment history

### 7.2 Database Monitoring

In Neon console:
- Check "Operations" for query performance
- Monitor storage usage in project settings
- Set up alerts for quota limits

### 7.3 Error Tracking

Add error tracking service (optional):

```bash
npm install @sentry/nextjs
```

Then configure in `next.config.ts`:

```typescript
import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  org: "your-sentry-org",
  project: "mindful",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

---

## Step 8: CI/CD Pipeline (Optional)

### Enable Vercel Preview Deployments

Every GitHub PR automatically gets:
- Preview URL
- Database connection (staging)
- Full testing

No additional configuration needed! ✨

### Automatic Rollback

If a deployment fails:
1. Vercel keeps previous version live
2. Fix the issue
3. Redeploy with new commit

---

## 🚨 Troubleshooting Deployment

### Issue: Database Connection Fails

**Symptoms**: 500 errors on API calls

**Solutions:**
```bash
# Check connection string is correct
echo $DATABASE_URL | grep postgresql://

# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Verify in Vercel environment
curl https://your-domain.vercel.app/api/auth/session
```

### Issue: CORS Errors

**Symptoms**: Frontend requests blocked from origin

**Solution:**
Update `NEXTAUTH_URL` to match your domain in Vercel environment variables.

### Issue: Build Fails with TypeScript Errors

**Solution:**
```bash
# Check locally
npx tsc --noEmit

# Fix errors, then redeploy
git push origin main
```

### Issue: Database Migrations Failed

**Solution:**
```bash
# Re-run schema initialization
psql "postgresql://user:password@host/mindful" -f prisma/init.sql

# Or from Neon web console
# Paste schema SQL and execute
```

### Issue: 503 Service Unavailable

**Causes:**
- Vercel build still in progress (wait 2-3 min)
- Database unavailable (check Neon status)
- Too many concurrent requests (scale up)

---

## 📊 Performance Optimization

### 1. Enable Edge Caching

In `vercel.json`:
```json
{
  "crons": [],
  "env": {
    "CACHE_CONTROL_MAX_AGE": "86400"
  }
}
```

### 2. Optimize Database Queries

Use connection pooling (already configured):
```typescript
// src/lib/db.ts
const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
});
```

### 3. Enable Response Compression

Built into Vercel by default. No action needed.

### 4. Monitor Function Execution Time

View in Vercel Analytics:
1. Dashboard → Analytics
2. Check "Execution Duration"
3. Target <300ms for API calls

---

## 🔐 Security Checklist

- [ ] NEXTAUTH_SECRET is random and > 32 characters
- [ ] DATABASE_URL not exposed in code
- [ ] HTTPS enabled on custom domain
- [ ] Database credentials not in version control
- [ ] API rate limiting configured (if needed)
- [ ] CSRF protection enabled (NextAuth default)
- [ ] SQL injection prevented (parameterized queries)
- [ ] Authentication required for /planner route

---

## 📈 Scaling Considerations

### When to Upgrade Vercel
- If you exceed 100GB/month bandwidth
- For >1000 requests/second
- For always-on APIs (Pro plan)

### When to Upgrade Database
- If storage >10GB (Neon growth tiers)
- For >100 concurrent connections
- For dedicated hardware requirements

---

## 🔄 Continuous Deployment

### Automatic Deployments

Every push to `main` branch:
1. GitHub notifies Vercel
2. Vercel runs build
3. If successful, deploys to production
4. If fails, keeps previous version live

### Manual Redeployment

```bash
# Push to trigger deployment
git push origin main

# Or redeploy existing commit in Vercel
# Dashboard → Deployments → Click commit → Redeploy
```

---

## 📚 Useful Commands

```bash
# Connect to production database
psql "postgresql://user:password@host/mindful"

# Export backup
pg_dump "postgresql://user:password@host/mindful" > backup.sql

# Check Vercel deployment status
vercel status

# Check logs (requires Vercel CLI)
vercel logs
```

---

## 📞 Support

- **Vercel Issues**: https://vercel.com/support
- **Neon Issues**: https://neon.tech/docs/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **PostgreSQL Help**: https://www.postgresql.org/docs/

---

**Last Updated:** December 12, 2025

**Estimated Setup Time:** 20-30 minutes for first deployment
