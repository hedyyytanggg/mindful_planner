# Stripe Payment Integration - Setup Guide

**Last Updated:** January 2, 2026  
**Status:** Implementation Complete - Configuration Required

This guide walks you through setting up Stripe payment processing for Mindful Planner's Pro subscription.

---

## 📋 What's Been Built

### Database Schema ✅
- Added subscription fields to `users` table:
  - `subscription_tier` (free/pro)
  - `subscription_status` (active/inactive/canceled/past_due/trialing)
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `subscription_end_date`

### API Endpoints ✅
- `/api/stripe/checkout` - Creates Stripe checkout sessions
- `/api/stripe/webhook` - Handles subscription webhooks
- `/api/stripe/portal` - Opens customer billing portal

### Core Utilities ✅
- `src/lib/stripe.ts` - Stripe client & pricing config
- `src/lib/subscription.ts` - Feature gating logic

### UI ✅
- `/upgrade` - Beautiful pricing page with monthly/yearly toggle

---

## 🚀 Setup Steps

### Step 1: Create Stripe Account

1. Go to https://stripe.com and sign up
2. Activate your account (you'll need to verify your email)
3. Stay in **Test Mode** for now (toggle in top-right)

### Step 2: Create Products & Prices

1. Go to **Products** in Stripe Dashboard
2. Click **+ Add Product**

**Product 1: Mindful Pro - Monthly**
- Name: `Mindful Pro - Monthly`
- Description: `Unlimited history, cloud sync, project tracking, and more`
- Pricing: 
  - Pricing Model: `Standard pricing`
  - Price: `$1.99 USD`
  - Billing period: `Monthly`
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)

**Product 2: Mindful Pro - Yearly**
- Name: `Mindful Pro - Yearly`
- Description: `Save $4/year with annual billing`
- Pricing:
  - Pricing Model: `Standard pricing`
  - Price: `$19.99 USD`
  - Billing period: `Yearly`
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`)

### Step 3: Get API Keys

1. Go to **Developers > API keys**
2. Copy your **Secret key** (starts with `sk_test_...`)
3. Keep this page open - you'll need it for webhooks

### Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_PRO_MONTHLY=price_your_monthly_price_id
STRIPE_PRICE_PRO_YEARLY=price_your_yearly_price_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# This will be set up in Step 5
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 5: Set Up Webhook (Development)

For local development, use Stripe CLI:

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to localhost:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copy the webhook secret** (starts with `whsec_...`) and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Keep this terminal running** while testing!

### Step 6: Test the Integration

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Start Stripe webhook forwarding** (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. **Visit the upgrade page:**
   ```
   http://localhost:3000/upgrade
   ```

4. **Click "Upgrade to Pro"** and use test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

5. **Check the webhook terminal** - you should see events flowing in

6. **Verify in database:**
   ```bash
   source .env.local && psql "$DATABASE_URL" -c "SELECT email, subscription_tier, subscription_status FROM users;"
   ```

---

## 🌐 Production Setup

### Step 1: Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live mode** (top-right)
2. Create the same products/prices in Live mode
3. Get your **Live API keys** from Developers > API keys

### Step 2: Configure Production Webhooks

1. Go to **Developers > Webhooks**
2. Click **+ Add endpoint**
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

### Step 3: Set Production Environment Variables

In **Vercel** (or your hosting platform):

```bash
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
STRIPE_PRICE_PRO_MONTHLY=price_your_live_monthly_price_id
STRIPE_PRICE_PRO_YEARLY=price_your_live_yearly_price_id
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Step 4: Test Production

1. Deploy to production
2. Visit `/upgrade` on your live site
3. Complete a real test payment (you can refund it later)
4. Verify webhook events are received
5. Check user's subscription status in database

---

## 🎨 Customizing Pricing

Want to change prices? Update in two places:

1. **Stripe Dashboard:** Modify product prices (or create new prices)
2. **Code:** Update prices in `/app/upgrade/page.tsx`:
   ```tsx
   const monthlyPrice = 1.99; // Update this
   const yearlyPrice = 19.99; // Update this
   ```

---

## 🔒 Security Checklist

- ✅ Never commit `.env.local` with real keys
- ✅ Use test keys in development
- ✅ Verify webhook signatures (already implemented)
- ✅ Store sensitive data server-side only
- ✅ Use HTTPS in production (required by Stripe)
- ✅ Set up proper CSP headers (already configured)

---

## 📊 Monitoring Subscriptions

### Check Current Subscriptions

```sql
SELECT 
  email,
  subscription_tier,
  subscription_status,
  subscription_end_date
FROM users
WHERE subscription_tier = 'pro'
ORDER BY subscription_end_date DESC;
```

### Find Users Ready to Upgrade

```sql
SELECT 
  email,
  subscription_tier,
  createdat,
  DATE_PART('day', NOW() - createdat) as days_since_signup
FROM users
WHERE subscription_tier = 'free'
  AND DATE_PART('day', NOW() - createdat) >= 7
ORDER BY createdat DESC;
```

---

## 🐛 Troubleshooting

### "No handler for event type"
- Check webhook events are enabled in Stripe Dashboard
- Verify webhook secret is correct

### "Invalid signature"
- Make sure `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check you're using raw request body (already implemented)

### Checkout not working
- Verify price IDs are correct
- Check Stripe API keys are set
- Look in browser console for errors

### Subscription not updating
- Check Stripe webhook logs in Dashboard
- Verify webhook endpoint is accessible
- Look in Next.js logs for errors

---

## 💰 Revenue Tracking

View revenue in Stripe Dashboard:
- **Dashboard > Payments** - Individual transactions
- **Dashboard > Reports** - Revenue analytics
- **Dashboard > Subscriptions** - Active subscribers

---

## 🚀 Next Steps

After Stripe is configured:

1. **Implement 7-day history limit** for free users
2. **Add upgrade CTAs** when users hit limits
3. **Set up conversion tracking** in Google Analytics
4. **Launch paid ads** (guide already created)
5. **Monitor conversion rates** and optimize

---

## 📞 Support

**Stripe Documentation:**
- Checkout: https://stripe.com/docs/payments/checkout
- Subscriptions: https://stripe.com/docs/billing/subscriptions
- Webhooks: https://stripe.com/docs/webhooks

**Need Help?**
- Stripe Support: https://support.stripe.com
- Stripe Discord: https://stripe.com/go/developer-chat

---

## ✅ Implementation Status

| Component | Status |
|-----------|--------|
| Database schema | ✅ Complete |
| Stripe API integration | ✅ Complete |
| Checkout flow | ✅ Complete |
| Webhook handlers | ✅ Complete |
| Customer portal | ✅ Complete |
| Upgrade page | ✅ Complete |
| Feature gating logic | ✅ Complete |
| 7-day history limit | ⏳ Next step |
| Upgrade prompts | ⏳ Next step |
| Stripe configuration | ⏳ **You need to do this** |

**Current Action Required:** Follow Steps 1-6 above to configure your Stripe account and test the integration.
