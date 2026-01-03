# Forgot Password Feature - Setup Guide

**Last Updated:** January 2, 2026  
**Status:** Implementation Complete

This guide explains the forgot password feature and how to set it up.

---

## 🎯 What's Been Built

### Database Schema ✅
- Added password reset fields to `users` table:
  - `reset_token` - Secure random token for password reset
  - `reset_token_expires` - Token expiration timestamp (1 hour)

### API Endpoints ✅
- `/api/auth/forgot-password` - Request password reset
- `/api/auth/reset-password` - Reset password with token

### Core Utilities ✅
- `src/lib/email.ts` - Email sending utility using Resend API
- Beautiful HTML email template for password reset

### UI Pages ✅
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token
- Updated `/login` with "Forgot password?" link

---

## 🚀 Setup Steps

### Step 1: Run Database Migration

Run the SQL migration to add password reset fields:

```bash
psql "$DATABASE_URL" < scripts/add-password-reset-fields.sql
```

Or manually:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
```

### Step 2: Choose Your Development Approach

**Option A: Console Logging (Recommended for Development)**

Simply don't set `RESEND_API_KEY` in `.env.local`. The reset emails will be logged to your terminal/console instead. This is perfect for testing the flow without setting up email!

When you request a password reset, check your terminal output for:
```
📧 Email would be sent (no RESEND_API_KEY configured):
To: user@example.com
Subject: Reset Your Mindful Planner Password
Body: [HTML content with reset link]
```

Copy the reset link from the console and use it to test!

**Option B: Use Resend with Your Own Domain**

⚠️ **Note:** Resend requires a custom domain. Free email providers (Gmail, Yahoo, etc.) won't work.

If you have a domain:

1. Go to https://resend.com and sign up (free tier includes 100 emails/day)
2. Verify your email
3. Add and verify your domain (see Step 3 below)
4. Go to **API Keys** section
5. Click **Create API Key**
6. Copy the key (starts with `re_...`)

### Step 3: Configure Domain (Required for Resend)

**Important:** You must own a domain to use Resend. For production:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records they provide
5. Verify domain

### Step 4: Set Environment Variables

**For Development (Console Logging):**

Add to your `.env.local`:

```bash
# Email Configuration - Leave RESEND_API_KEY unset for console logging
# RESEND_API_KEY=  # Commented out for development
# EMAIL_FROM=noreply@yourdomain.com  # Not needed for console logging

# Make sure this is set
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For Production (Real Emails):**

Add to your `.env.local` or production environment:

```bash
# Email Configuration
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@yourdomain.com  # Must use YOUR verified domain

# Production URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

⚠️ **Important:** `EMAIL_FROM` must be from a domain you own and have verified in Resend. Free email providers like Gmail, Yahoo, Outlook will NOT work.

### Step 5: Test the Feature
Get the reset link:**
   - **Without API key (Development):** Check your terminal/console output for the reset link
   - **With API key (Production):** Check your email inbox

6. **Copy the reset link from console** (looks like):
   ```
   http://localhost:3000/reset-password?token=abc123def456...
   ```

7. **Paste the link in your browser** or click it from email

8. **Enter new password** and submit

9  ```

3. **Click "Forgot password?"**

4. **Enter your email** and click "Send Reset Link"

5. **Check console logs** (if `RESEND_API_KEY` not set) or your email inbox

6. **Click the reset link** or go to:
   ```
   http://localhost:3000/reset-password?token=YOUR_TOKEN
   ```

7. **Enter new password** and submit

8. **Login with new password**

---

## 🔒 Security Features

- ✅ **Secure tokens:** 32-byte random tokens (256 bits of entropy)
- ✅ **Token expiration:** Tokens expire after 1 hour
- ✅ **Single use:** Tokens are cleared after successful reset
- ✅ **Email enumeration prevention:** Always returns success message
- ✅ **Password strength:** Minimum 8 characters enforced
- ✅ **Bcrypt hashing:** Passwords hashed with bcrypt (12 rounds)
- ✅ **Database cleanup:** Expired tokens automatically ignored

---

## 📧 Email Template

The password reset email includes:

- **Branded header** with Mindful Planner logo
- **Clear CTA button** to reset password
- **Direct link** (clickable and copy-paste)
- **Security notice** about 1-hour expiration
- **Reassurance** if they didn't request it
- **Professional footer** with copyright
- **Mobile-responsive** design

---

## 🔄 User Flow

1. User clicks "Forgot password?" on login page
2. User enters their email address
3. System generates secure reset token
4. Email sent with reset link
5. User clicks link (opens reset password page)
6. User enters new password (min 8 chars)
7. Password is updated in database
8. User redirected to login page
9. User logs in with new password

---

## 🐛 Troubleshooting (Development Mode):**
- ✅ This is correct! Check your terminal/console logs
- Email details including reset link will be printed there
- Copy the reset link from the console to test

**If API key is set:**
- Check spam folder
- Verify email address exists in database
- Check Resend dashboard logs: https://resend.com/logs
- **Verify `EMAIL_FROM` uses YOUR verified domain** (not Gmail, Yahoo, etc.)
- Error "We don't allow free public domains" means you need to use a domain you own

### "We don't allow free public domains" error

This means you're trying to send from a free email provider (Gmail, Yahoo, Outlook, etc.). 

**Solutions:**
1. **Development:** Remove `RESEND_API_KEY` from `.env.local` to use console logging
2. **Production:** Add and verify your own domain in Resend dashboard
3. **Alternative:** Use a different email service that allows free domains (not recommended for production
- Check spam folder
- Verify email address exists in database
- Check Resend dashboard logs: https://resend.com/logs
- Verify `EMAIL_FROM` domain is verified (production only)

### "Invalid or expired reset token"

- Token may have expired (1 hour limit)
- Token may have been already used
- Request a new password reset

### Can't send emails in production

- Verify domain in Resend dashboard
- Add DNS records correctly
- Wait for DNS propagation (can take 24-48 hours)
- Check `EMAIL_FROM` matches verified domain

---

## 💰 Resend Pricing

**Free Tier:**
- 100 emails per day
- 1 verified domain
- Perfect for small apps

**Pro Tier ($20/month):**
- 50,000 emails per month
- Unlimited domains
- Priority support

For most apps, free tier is sufficient!

---

## 🎨 Customization

### Change Email Template

Edit `/src/lib/email.ts` → `sendPasswordResetEmail()` function

### Change Token Expiration

Edit `/app/api/auth/forgot-password/route.ts`:

```typescript
// Change from 1 hour to 2 hours
expiresAt.setHours(expiresAt.getHours() + 2);
```

### Change Password Requirements

Edit `/app/api/auth/reset-password/route.ts`:

```typescript
// Change minimum length
if (password.length < 12) {
    return NextResponse.json(
        { error: 'Password must be at least 12 characters long' },
        { status: 400 }
    );
}
```

---

## 📝 Testing Checklist

- [ ] Database migration completed
- [ ] Resend API key configured (or console logging working)
- [ ] Can access forgot password page
- [ ] Can request password reset
- [ ] Email received (or logged to console)
- [ ] Reset link works
- [ ] Can set new password
- [ ] Old password no longer works
- [ ] New password works for login
- [ ] Token expires after 1 hour
- [ ] Token can't be reused

---

## 🔗 Related Files

**Database:**
- `/scripts/add-password-reset-fields.sql` - Migration script

**Backend:**
- `/src/lib/email.ts` - Email sending utility
- `/app/api/auth/forgot-password/route.ts` - Request reset API
- `/app/api/auth/reset-password/route.ts` - Reset password API

**Frontend:**
- `/app/login/page.tsx` - Login page (with forgot link)
- `/app/forgot-password/page.tsx` - Request reset page
- `/app/reset-password/page.tsx` - Reset password page

---

## 🚀 Production Deployment

### Environment Variables (Vercel/Production)

```bash
RESEND_API_KEY=re_live_your_key_here
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Verify Domain in Resend

1. Add domain in Resend dashboard
2. Add DNS records to your domain provider
3. Verify domain (green checkmark)
4. Update `EMAIL_FROM` to use verified domain

### Test in Production

1. Deploy to production
2. Request password reset on live site
3. Check email arrives promptly
4. Verify reset link works
5. Monitor Resend logs for delivery issues

---

## ✅ Implementation Status

| Component | Status |
|-----------|--------|
| Database migration | ✅ Complete |
| Email utility | ✅ Complete |
| Forgot password API | ✅ Complete |
| Reset password API | ✅ Complete |
| Forgot password page | ✅ Complete |
| Reset password page | ✅ Complete |
| Login page link | ✅ Complete |
| Email template | ✅ Complete |
| Resend setup | ⏳ **You need to do this** |

**Current Action Required:** Follow Steps 1-5 above to configure your database and Resend account.
