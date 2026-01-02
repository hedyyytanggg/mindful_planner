# Conversion Tracking Setup Guide

## Step 1: Create Google Analytics 4 Account

### 1.1 Set up GA4 Property
1. Go to https://analytics.google.com
2. Click "Admin" (gear icon in bottom left)
3. Click "Create Property"
4. Fill in details:
   - **Property name**: Mindful Planner
   - **Time zone**: Your timezone
   - **Currency**: USD
5. Click "Next" → Choose business details → Click "Create"
6. Accept the Terms of Service

### 1.2 Set up Data Stream
1. After creating property, click "Web" under "Choose a platform"
2. Enter your website URL: `https://yourdomain.com` (or `http://localhost:3000` for testing)
3. Stream name: "Mindful Planner Production" (or "Local Development")
4. Click "Create stream"
5. **Copy the Measurement ID** (format: G-XXXXXXXXXX)

### 1.3 Add Measurement ID to Your Site
1. Open your `.env.local` file (create it if it doesn't exist)
2. Add this line:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

3. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## Step 2: Configure Conversion Events in GA4

### 2.1 Mark Events as Conversions
1. In GA4, go to **Admin** → **Events** (under Property column)
2. Wait a few minutes/hours for events to start appearing after you deploy
3. When you see these events, click the toggle to mark as conversions:
   - `sign_up` ✅ (most important!)
   - `purchase` ✅ (if you have paid plans)
   - `begin_checkout` ✅ (trial starts)

### 2.2 Create Custom Conversions (Optional)
1. Go to **Admin** → **Conversions**
2. Click "New conversion event"
3. Add custom events:
   - `reflection_complete` (engaged users)
   - `feature_use` (feature adoption)

---

## Step 3: Set up Google Ads Conversion Tracking (If using Google Ads)

### 3.1 Link Google Ads to GA4
1. In GA4, go to **Admin** → **Google Ads Links**
2. Click "Link" and select your Google Ads account
3. Enable:
   - ✅ Personalized advertising
   - ✅ Import conversions
4. Choose conversions to import:
   - ✅ sign_up
   - ✅ purchase
5. Click "Link accounts"

### 3.2 Create Google Ads Conversion Action (Alternative Method)
If you want Google Ads-specific tracking:

1. Go to Google Ads → **Tools** → **Conversions**
2. Click "+" to create new conversion
3. Choose "Website"
4. Fill in:
   - **Category**: Sign-up
   - **Conversion name**: Signup
   - **Value**: Assign estimated value (e.g., $10)
   - **Count**: One (count one conversion per user)
5. Click "Create and Continue"
6. Choose "Use Google tag manager" or "Install manually"
7. Copy the conversion ID (format: AW-XXXXXXXXX/XXXXXXXXXX)
8. Update the `trackSignup` function in `/components/Analytics.tsx`:
   ```typescript
   // Replace this line:
   send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
   // With your actual conversion ID:
   send_to: 'AW-123456789/AbC-dEfGhIjK',
   ```

---

## Step 4: Set up Meta Pixel (Facebook/Instagram Ads)

### 4.1 Create Meta Pixel
1. Go to https://business.facebook.com/events_manager
2. Click "Connect Data Sources" → "Web"
3. Choose "Meta Pixel" → Click "Connect"
4. Name: "Mindful Planner Pixel"
5. Enter your website URL
6. Click "Continue"

### 4.2 Install Pixel Code
1. Choose "Install code manually"
2. Copy the Pixel ID (format: numbers only, e.g., 1234567890123456)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
   ```

4. Create Meta Pixel component at `/components/MetaPixel.tsx`:

```typescript
'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    
    // Track page views on route change
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

// Track specific events
export const trackMetaEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};

export const trackMetaSignup = () => {
  trackMetaEvent('CompleteRegistration', {
    content_name: 'signup',
    status: 'completed'
  });
};

export const trackMetaLead = () => {
  trackMetaEvent('Lead');
};
```

5. Add to your `layout.tsx` (import and add `<MetaPixel />` in the `<head>`)

6. Update signup page to track Meta conversion:
```typescript
import { trackMetaSignup } from '@/components/MetaPixel';

// In handleSubmit, after successful signup:
trackMetaSignup();
```

### 4.3 Verify Meta Pixel
1. Install "Meta Pixel Helper" Chrome extension
2. Visit your site and signup
3. Check that events are firing in the extension
4. In Events Manager, go to "Test Events" to see real-time data

---

## Step 5: Set up Reddit Pixel (If using Reddit Ads)

### 5.1 Create Reddit Pixel
1. Go to https://ads.reddit.com
2. Navigate to Pixels tab
3. Click "Create Pixel"
4. Name: "Mindful Conversions"
5. Copy Pixel ID

### 5.2 Install Reddit Pixel
Add to `.env.local`:
```
NEXT_PUBLIC_REDDIT_PIXEL_ID=your_pixel_id
```

Create component at `/components/RedditPixel.tsx`:
```typescript
'use client';

import Script from 'next/script';

const REDDIT_PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;

export function RedditPixel() {
  if (!REDDIT_PIXEL_ID) return null;

  return (
    <Script
      id="reddit-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
          rdt('init', '${REDDIT_PIXEL_ID}', {
            optOut: false,
            useDecimalCurrencyValues: true
          });
          rdt('track', 'PageVisit');
        `,
      }}
    />
  );
}

export const trackRedditSignup = () => {
  if (typeof window !== 'undefined' && (window as any).rdt) {
    (window as any).rdt('track', 'SignUp');
  }
};
```

---

## Step 6: Test Your Tracking

### 6.1 Install Browser Extensions
- **Google Analytics Debugger** (Chrome)
- **Meta Pixel Helper** (Chrome)
- Open browser console (F12) to see tracking logs

### 6.2 Test Signup Flow
1. Start your dev server: `npm run dev`
2. Open http://localhost:3000/signup
3. Open browser console (F12)
4. Complete signup process
5. Check console for tracking logs:
   - Should see: "Signup conversion tracked"
   - GA4: Event 'sign_up' fired
   - Meta: Event 'CompleteRegistration' fired

### 6.3 Verify in Analytics Platforms
**Google Analytics 4:**
1. Go to **Reports** → **Realtime**
2. Perform a signup
3. Should see event appear within seconds

**Meta Events Manager:**
1. Go to **Test Events**
2. Enter your IP or browser
3. Perform actions on your site
4. Events should appear in real-time

**Google Ads:**
1. Tools → Conversions
2. Wait 24 hours for data
3. Check "All conversions" column

---

## Step 7: Set up UTM Parameter Tracking

UTM parameters let you track which campaigns drive conversions.

### 7.1 UTM Parameter Format
```
?utm_source=google&utm_medium=cpc&utm_campaign=search-productivity&utm_content=ad-variation-1
```

- **utm_source**: Platform (google, facebook, reddit)
- **utm_medium**: Type (cpc, paid, social)
- **utm_campaign**: Campaign name (search-productivity)
- **utm_content**: Ad variation (ad1, ad2)
- **utm_term**: Keyword (optional)

### 7.2 Campaign URLs for Ads
Use these in your ad campaigns:

**Google Ads:**
```
https://yourdomain.com?utm_source=google&utm_medium=cpc&utm_campaign=search-productivity
```

**Meta Ads:**
```
https://yourdomain.com?utm_source=facebook&utm_medium=paid&utm_campaign=interest-targeting
```

**Reddit Ads:**
```
https://yourdomain.com?utm_source=reddit&utm_medium=cpc&utm_campaign=productivity-subreddits
```

### 7.3 Track UTM Parameters
GA4 automatically tracks UTM parameters. View them:
1. GA4 → **Reports** → **Acquisition** → **Traffic acquisition**
2. See conversions by source/medium/campaign

---

## Step 8: Create Custom Dashboard

### 8.1 GA4 Dashboard
1. Go to **Explore** → Create new exploration
2. Add these metrics:
   - **Sign ups** (sign_up event count)
   - **Conversion rate** (sign_up / sessions)
   - **Cost per signup** (ad spend / sign_ups)
   - **Source/Medium** (dimension)

### 8.2 Key Metrics to Monitor
| Metric | What it Measures | Target |
|--------|------------------|--------|
| Sign ups | Total conversions | Track growth |
| Conversion Rate | % of visitors who sign up | >3% |
| Bounce Rate | % who leave immediately | <50% |
| Avg Session Duration | Time on site | >2 min |
| Pages per Session | Engagement | >3 |

---

## Environment Variables Checklist

Your `.env.local` should have:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel (Facebook/Instagram Ads)
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456

# Reddit Pixel
NEXT_PUBLIC_REDDIT_PIXEL_ID=t2_xxxxxxx

# Google Ads Conversion (optional, can track through GA4)
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-123456789/AbC-dEfGhIjK

# Your existing variables
DATABASE_URL=...
NEXTAUTH_SECRET=...
```

---

## Troubleshooting

### No events showing in GA4
- Check Measurement ID is correct
- Verify `.env.local` has `NEXT_PUBLIC_` prefix
- Restart dev server after adding env variables
- Check browser console for errors
- Wait 24-48 hours for data to appear in reports (Realtime should be instant)

### Meta Pixel not firing
- Install Meta Pixel Helper extension
- Check console for errors
- Verify Pixel ID is correct (numbers only)
- Check network tab for requests to facebook.com/tr

### Events firing multiple times
- Make sure you're not calling track functions multiple times
- Check for duplicate pixel installations
- Disable browser extensions that might interfere

### Conversions not attributed to ads
- Ensure UTM parameters are in ad URLs
- Check that auto-tagging is enabled (Google Ads)
- Verify conversion window settings (default: 30 days)
- Wait 24-48 hours for conversion attribution

---

## Production Deployment Checklist

Before launching ads:
- [ ] GA4 Measurement ID added to production environment variables
- [ ] Meta Pixel ID added to production
- [ ] Conversion events marked in GA4
- [ ] Google Ads linked to GA4 (if using)
- [ ] Meta Events Manager shows test conversions
- [ ] UTM parameters tested and working
- [ ] Custom dashboard created
- [ ] Verified tracking on mobile devices
- [ ] Privacy policy mentions analytics/cookies
- [ ] Cookie consent banner (optional but recommended for EU)

---

## Next Steps

1. **Week 1**: Set up all tracking (GA4, Meta, Reddit)
2. **Week 2**: Test thoroughly, verify all events fire correctly
3. **Week 3**: Create ad accounts and prepare creative
4. **Week 4**: Launch campaigns with small budget, monitor closely

Once tracking is confirmed working, you're ready to launch paid ads with confidence! You'll be able to see exactly which campaigns, ads, and keywords drive signups.
