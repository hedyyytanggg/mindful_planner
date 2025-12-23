# Production Launch Checklist — Mindful Daily Planner

Complete checklist for launching Mindful Planner to production.

---

## 🚨 Critical (Must Complete Before Launch)

### 1. Environment Variables & Configuration

- [ ] **Set production environment variables**
  ```bash
  # Required in Vercel/Production
  NEXT_PUBLIC_BASE_URL=https://yourdomain.com
  DATABASE_URL=postgresql://user:password@host:5432/mindful_production
  NEXTAUTH_URL=https://yourdomain.com
  NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
  ```

- [ ] **Generate secure NEXTAUTH_SECRET**
  ```bash
  openssl rand -base64 32
  ```

- [ ] **Verify all API keys are in environment variables (not hardcoded)**

- [ ] **Set up production database** (Neon, Supabase, or AWS RDS)
  - Create production database
  - Run migrations
  - Set up backups
  - Configure connection pooling

### 2. Database & Data

- [ ] **Run database migrations in production**
  ```bash
  # Test locally first
  npm run db:migrate
  ```

- [ ] **Verify database schema matches code**
- [ ] **Set up database backups** (daily automated backups)
- [ ] **Test database connection from production environment**
- [ ] **Set up monitoring for database performance**
- [ ] **Configure connection limits** (prevent exhaustion)

### 3. Security

- [ ] **Update CORS settings** for production domain
- [ ] **Verify HTTPS is enforced** (should be automatic on Vercel)
- [ ] **Test authentication flow** end-to-end
- [ ] **Verify password hashing** is working (bcrypt)
- [ ] **Test session management** (login, logout, session expiry)
- [ ] **Review and update CSP headers** in `next.config.ts`
- [ ] **Scan dependencies for vulnerabilities**
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] **Remove any debug/console logs** from production code
  ```bash
  # Search for console.log
  grep -r "console.log" app/ src/
  ```

- [ ] **Verify no sensitive data in client-side code**
- [ ] **Test rate limiting** if implemented

### 4. Domain & DNS

- [ ] **Purchase domain** (if not already owned)
- [ ] **Configure DNS records**
  - A record or CNAME pointing to Vercel
  - Verify propagation: `nslookup yourdomain.com`

- [ ] **Set up SSL certificate** (automatic on Vercel)
- [ ] **Configure custom domain in Vercel**
- [ ] **Test domain accessibility** (www and non-www)
- [ ] **Set up redirect** (www → non-www or vice versa)

### 5. SEO & Social Media

- [ ] **Create OG images** (already referenced in code)
  - `/public/og-image.png` (1200×630px)
  - `/public/twitter-image.png` (1200×600px)

- [ ] **Update NEXT_PUBLIC_BASE_URL** to production domain
- [ ] **Test sitemap.xml** works at `/sitemap.xml`
- [ ] **Test robots.txt** works at `/robots.txt`
- [ ] **Verify all metadata** displays correctly
  - Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
  - Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 6. Performance

- [ ] **Run Lighthouse audit** (target 90+ scores)
  ```bash
  npm run build
  npm start
  # Then run Lighthouse in Chrome DevTools
  ```

- [ ] **Optimize images**
  - Convert to WebP format
  - Compress all images
  - Add proper alt text

- [ ] **Test Core Web Vitals**
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

- [ ] **Enable compression** (gzip/brotli - should be automatic on Vercel)
- [ ] **Verify caching headers** are set correctly

### 7. Testing

- [ ] **Test on multiple browsers**
  - Chrome
  - Safari
  - Firefox
  - Edge

- [ ] **Test on mobile devices**
  - iOS Safari
  - Android Chrome

- [ ] **Test all user flows**
  - Sign up → Complete
  - Log in → Access planner
  - Create daily plan
  - Auto-save functionality
  - Log out

- [ ] **Test error scenarios**
  - Invalid login
  - Network errors
  - Database connection failures
  - 404 pages

- [ ] **Load testing** (simulate 100+ concurrent users)
  ```bash
  # Use tools like Apache Bench or k6
  ```

---

## ⚠️ Important (Should Complete Before Launch)

### 8. Analytics & Monitoring

- [ ] **Set up Google Analytics 4**
  - Create GA4 property
  - Add tracking code to [app/layout.tsx](app/layout.tsx)
  - Test events are firing

- [ ] **Set up Google Search Console**
  - Verify domain ownership
  - Submit sitemap
  - Monitor for errors

- [ ] **Set up error tracking** (Sentry or similar)
  ```bash
  npm install @sentry/nextjs
  ```

- [ ] **Configure uptime monitoring** (UptimeRobot, Pingdom)
- [ ] **Set up logging** (Vercel logs or external service)
- [ ] **Create dashboard for key metrics**
  - Daily active users
  - Sign-ups
  - Error rate
  - API response times

### 9. Legal & Compliance

- [ ] **Create/update Privacy Policy**
  - Data collection practices
  - Cookie usage
  - Third-party services
  - User rights (GDPR, CCPA)

- [ ] **Create/update Terms of Service**
  - User responsibilities
  - Service limitations
  - Account termination
  - Intellectual property

- [ ] **Add cookie consent banner** (if required by region)
- [ ] **GDPR compliance** (if serving EU users)
  - Data export functionality
  - Account deletion
  - Cookie consent

- [ ] **Accessibility compliance** (WCAG 2.1 AA)
  - Run accessibility audit
  - Fix critical issues

### 10. Content & Communication

- [ ] **Prepare launch announcement**
  - Blog post
  - Social media posts
  - Email to beta users

- [ ] **Create support documentation**
  - FAQs
  - Getting started guide
  - Troubleshooting

- [ ] **Set up support email** (support@yourdomain.com)
- [ ] **Prepare email templates**
  - Welcome email
  - Password reset
  - Account notifications

### 11. Deployment Setup

- [ ] **Configure production deployment on Vercel**
  - Connect GitHub repository
  - Set environment variables
  - Configure build settings

- [ ] **Set up staging environment** (optional but recommended)
  ```
  staging.yourdomain.com
  ```

- [ ] **Configure CI/CD pipeline**
  - Automated tests on PR
  - Automated deployment on merge to main

- [ ] **Create rollback plan**
  - Document rollback procedure
  - Test rollback process

---

## 📝 Nice to Have (Can Do Post-Launch)

### 12. Marketing & Growth

- [ ] **Submit to directories**
  - Product Hunt
  - AlternativeTo
  - Capterra
  - G2

- [ ] **Create landing page variations** for A/B testing
- [ ] **Set up email marketing** (Mailchimp, ConvertKit)
- [ ] **Prepare content calendar** (blog posts)
- [ ] **Create video demo** for homepage
- [ ] **Prepare press kit** (screenshots, logo, description)

### 13. Advanced Features

- [ ] **Set up backup/restore system**
- [ ] **Implement feature flags** (for gradual rollouts)
- [ ] **Add user feedback system**
- [ ] **Create admin dashboard** (user management, analytics)
- [ ] **Set up API documentation** (if exposing APIs)

---

## ✅ Pre-Launch Verification (Day Before Launch)

### Final Checks

1. **Test entire user flow** on production/staging
   - [ ] Sign up with new account
   - [ ] Create and save daily plan
   - [ ] Log out and log back in
   - [ ] Verify data persists

2. **Verify all environment variables** are set in Vercel

3. **Check all external links** work
   - [ ] Social media links in footer
   - [ ] Privacy policy
   - [ ] Terms of service

4. **Run security scan**
   ```bash
   npm audit
   ```

5. **Test email functionality** (if implemented)
   - [ ] Welcome email
   - [ ] Password reset

6. **Verify analytics tracking**
   - [ ] Google Analytics receiving data
   - [ ] Error tracking working

7. **Check mobile responsiveness** on real devices

8. **Test with slow connection** (throttle in Chrome DevTools)

9. **Verify OG images** display correctly when sharing links

10. **Run final Lighthouse audit** (all scores 90+)

---

## 🚀 Launch Day Checklist

### Morning of Launch

- [ ] **Final production build**
  ```bash
  npm run build
  ```

- [ ] **Deploy to production**
  ```bash
  git push origin main
  # Or deploy via Vercel dashboard
  ```

- [ ] **Verify deployment succeeded**
  - Check Vercel deployment logs
  - Visit production URL

- [ ] **Test critical paths** on live site
  - Sign up
  - Log in
  - Create plan
  - Auto-save

- [ ] **Monitor error logs** for first hour

- [ ] **Post launch announcement**
  - Social media
  - Email list
  - Product Hunt (if applicable)

### First 24 Hours

- [ ] **Monitor analytics** (users, sign-ups, errors)
- [ ] **Watch error logs** continuously
- [ ] **Check server/database performance**
- [ ] **Be available for support** questions
- [ ] **Collect user feedback**
- [ ] **Monitor social media** mentions

---

## 📊 Success Metrics (First Week)

Track these metrics:

- **Sign-ups:** Target X per day
- **Daily active users (DAU):** Track engagement
- **Error rate:** Should be < 1%
- **Page load time:** < 2 seconds
- **API response time:** < 200ms average
- **Uptime:** 99.9%+

---

## 🆘 Emergency Contacts & Rollback

### If Something Goes Wrong

1. **Quick rollback:**
   ```bash
   # In Vercel dashboard: Deployments → Previous → Promote to Production
   ```

2. **Emergency contacts:**
   - Database admin: [contact]
   - DevOps: [contact]
   - Support lead: [contact]

3. **Communication plan:**
   - Post status updates on status page
   - Email affected users
   - Update social media

---

## 🎯 Quick Reference Commands

```bash
# Build for production
npm run build

# Run production locally
npm run build && npm start

# Check for errors
npm run lint
npm run type-check  # if you have this script

# Security audit
npm audit

# Run tests
npm test  # if you have tests

# Database migration (production)
# Run with caution!
npm run db:migrate
```

---

## 📞 Need Help?

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Neon Database Docs](https://neon.tech/docs)

---

**Last Updated:** December 17, 2025  
**Status:** Pre-Launch Preparation  
**Target Launch Date:** [Set your date]

---

**Remember:** It's better to delay launch by a few days to get these right than to launch with critical issues. Good luck! 🚀
