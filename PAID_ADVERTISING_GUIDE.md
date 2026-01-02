# Paid Advertising Setup Guide

## Pre-Launch Checklist (Do This First!)

### 1. Set Up Conversion Tracking
- [ ] Install Google Analytics 4 (GA4) on your site
- [ ] Create conversion events for: signup, trial start, paid conversion
- [ ] Test that events are firing correctly
- [ ] Set up UTM parameters for campaign tracking

### 2. Optimize Your Landing Page
- [ ] Page loads in under 3 seconds
- [ ] Clear headline that communicates value
- [ ] Social proof (testimonials, user count)
- [ ] Mobile-responsive design
- [ ] Clear CTA button
- [ ] Privacy policy and terms linked

### 3. Prepare Creative Assets
- [ ] 5-10 product screenshots (1200x628px for social)
- [ ] 3-5 ad headlines (30 characters max)
- [ ] 3-5 ad descriptions (90 characters max)
- [ ] Video demo (optional but recommended, 15-30 seconds)

### 4. Set Your Budget
- [ ] Decide total monthly ad spend ($300-500 recommended to start)
- [ ] Allocate per platform (Google: 40%, Meta: 40%, Reddit: 20%)
- [ ] Set daily limits to avoid overspending

---

## Google Ads Setup (Search Campaigns)

### Step 1: Create Google Ads Account
1. Go to https://ads.google.com
2. Click "Start Now"
3. Set billing country and time zone
4. Skip the "smart campaign" wizard - choose "Switch to Expert Mode"

### Step 2: Link Google Analytics
1. In Google Ads, go to Tools & Settings → Measurement → Google Analytics
2. Click "Link" and select your GA4 property
3. Enable auto-tagging in settings

### Step 3: Create Your First Search Campaign
1. Click "+ New Campaign"
2. Choose goal: "Website traffic" or "Leads"
3. Campaign type: "Search"
4. Name: "Search - Productivity Keywords - US"

### Step 4: Campaign Settings
- **Networks**: Uncheck "Include Google search partners" initially
- **Locations**: Target specific countries (US, UK, Canada, Australia)
- **Languages**: English
- **Budget**: $15/day
- **Bidding**: "Maximize clicks" (switch to "Target CPA" after 30 conversions)
- **Ad rotation**: "Optimize"

### Step 5: Create Ad Group
1. Name: "Productivity Planner"
2. Add keywords (use "Phrase match" initially):
   - "productivity planner app"
   - "daily planning tool"
   - "mindfulness task manager"
   - "goal tracking app"
   - "reflection journal online"
   - "time management app"
3. Default bid: $1.50 (adjust after seeing data)

### Step 6: Write Responsive Search Ads
Create 3 ads with these components:

**Headlines (add 10-15):**
- Mindful Productivity Planner
- Plan Your Day Mindfully
- Achieve Goals Without Burnout
- Daily Reflection & Planning
- Focus on What Matters Most
- Free Trial - No Credit Card
- Join 1000+ Mindful Achievers
- Turn Goals Into Action
- Reduce Overwhelm, Get More Done

**Descriptions (add 4-5):**
- Plan, reflect, and achieve with our mindful productivity app. Start your free trial today.
- Combine task management with daily reflection. Stay focused and avoid burnout.
- Set goals, track progress, and celebrate wins. Built for sustainable productivity.
- Simple, beautiful, and effective. Join mindful professionals getting more done.

**Final URL**: https://yourdomain.com?utm_source=google&utm_medium=cpc&utm_campaign=search-productivity
**Display Path**: yourdomain.com/start-free

### Step 7: Add Negative Keywords
Add these to avoid wasted spend:
- free
- download
- crack
- torrent
- alternative to [competitor]
- vs [competitor]

### Step 8: Set Up Conversion Tracking
1. Tools & Settings → Measurement → Conversions
2. Click "+" to create conversion action
3. Choose "Website"
4. Name: "Signup"
5. Category: "Sign up"
6. Value: Assign value based on your pricing (e.g., $10 if 10% convert to paid)
7. Install the conversion tag on your signup success page

### Step 9: Launch & Monitor
- Review all settings
- Click "Publish campaign"
- Check daily for first 3 days, then weekly
- Let it run for at least 2 weeks before major changes

---

## Meta Ads (Facebook/Instagram)

### Step 1: Set Up Meta Business Suite
1. Go to https://business.facebook.com
2. Click "Create Account"
3. Enter business name and details
4. Add your Facebook Page (create one if needed)
5. Add Instagram account

### Step 2: Create Ad Account
1. Business Settings → Accounts → Ad Accounts
2. Click "Add" → "Create a new ad account"
3. Set time zone and currency
4. Add payment method

### Step 3: Install Meta Pixel
1. Events Manager → Data Sources → Pixels
2. Click "Add" → "Meta Pixel"
3. Name: "Mindful Pixel"
4. Choose "Manual Installation"
5. Copy the pixel code
6. Add to your site's `<head>` tag (in layout.tsx)

**Code to add:**
```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
```

### Step 4: Set Up Conversion Events
1. Events Manager → Data Sources → Your Pixel
2. Click "Add Events" → "From the Pixel"
3. Add standard events:
   - ViewContent (homepage)
   - Lead (signup)
   - CompleteRegistration (account created)
   - Purchase (if you have paid plans)

### Step 5: Create Your First Campaign
1. Go to Ads Manager
2. Click "Create" campaign
3. Choose "Traffic" or "Conversions" objective
4. Name: "US - Interest Targeting - Conversions"
5. Set daily budget: $10-15

### Step 6: Ad Set Configuration
**Audience:**
- Location: United States (or your target countries)
- Age: 22-55
- Gender: All
- Detailed Targeting (Layer these):
  - **Interests**: Productivity, Self-improvement, Mindfulness, Getting Things Done, Bullet Journal
  - **Behaviors**: Small business owners, Frequent travelers
  - **More Categories**: Time management, Personal development

**Placements:**
- Start with "Advantage+ placements" 
- After data comes in, remove underperforming placements

**Optimization:**
- Conversion event: "Lead" or "CompleteRegistration"
- Cost control: None initially
- Delivery type: Standard

### Step 7: Create Ad Creative
**Format Options:**
1. Single Image (easiest to start)
2. Carousel (show multiple features)
3. Video (higher engagement)

**Single Image Ad:**
1. Upload screenshot of your app (1080x1080px square)
2. **Primary Text** (125 characters):
   - "Plan your day mindfully. Achieve goals without burnout. Daily reflections + task management in one beautiful app. 🧘‍♀️✅"
   - "Overwhelmed by endless to-dos? Our mindful productivity planner helps you focus on what matters. Try free today."
   - "Turn chaos into calm. Plan, reflect, achieve. Join 1000+ people using mindful productivity to get more done."

3. **Headline** (40 characters):
   - "Mindful Productivity Planner"
   - "Plan. Reflect. Achieve."
   - "Focus Without Burnout"

4. **Description** (optional, 30 characters):
   - "Start your free trial"
   - "No credit card needed"

5. **Destination**: Your landing page with UTM: 
   - ?utm_source=facebook&utm_medium=paid&utm_campaign=interest-targeting

6. **Call to Action**: "Sign Up" or "Learn More"

### Step 8: Create Multiple Ad Variations
Create 3-4 ads with:
- Different images (screenshots of different features)
- Different primary text angles:
  1. Pain point focused ("Tired of burnout?")
  2. Benefit focused ("Achieve more with less stress")
  3. Social proof ("Join 1000+ mindful achievers")
  4. Feature focused ("Daily planning + reflection in one app")

### Step 9: Launch & Monitor
- Review all settings
- Click "Publish"
- Check daily for first week
- Look for ads with CTR > 1% and CPC < $2
- Turn off underperforming ads after 3-4 days

---

## Reddit Ads

### Step 1: Create Reddit Ads Account
1. Go to https://ads.reddit.com
2. Click "Get Started"
3. Enter business info
4. Add payment method

### Step 2: Install Reddit Pixel
1. Ads Dashboard → Pixels
2. Click "Create Pixel"
3. Name: "Mindful Conversions"
4. Copy the pixel code
5. Add to your site's `<head>` tag

### Step 3: Set Up Conversion Tracking
1. Pixels → Events
2. Create custom event: "Signup"
3. Add event to your signup success page

### Step 4: Create Campaign
1. Click "Create Campaign"
2. Objective: "Conversions"
3. Name: "Productivity Subreddits - Signups"
4. Budget: $10/day
5. Start and end dates: Set 30-day campaign

### Step 5: Ad Group Setup
**Targeting:**
1. Location: United States (or target countries)
2. Interests:
   - Business & Finance
   - Fitness & Wellness
   - Technology

3. **Communities** (most important for Reddit):
   - r/productivity (600k+ members)
   - r/getdisciplined (1M+ members)
   - r/selfimprovement (900k+ members)
   - r/bulletjournal (300k+ members)
   - r/GetStudying (200k+ members)
   - r/DecidingToBeBetter (300k+ members)

4. Devices: All
5. Platform: All

**Bidding:**
- Bid strategy: "Auto-bid"
- Can switch to manual after gathering data

### Step 6: Create Ad
Reddit supports:
1. **Promoted Posts** (recommended - looks native)
2. Image ads
3. Video ads

**Promoted Post Format:**
1. **Title** (300 characters, be authentic):
   - "I built a productivity app that focuses on sustainability, not burnout"
   - "Struggling with endless to-do lists? I made an app that combines planning with daily reflection"
   - "My approach to productivity: plan your day, reflect on progress, avoid burnout"

2. **Text Post** (40,000 characters - be conversational):
```
Hey r/productivity!

I've been working on a mindful productivity planner for the past year, and I wanted to share it with this community.

**The Problem:**
Most productivity apps just pile on more tasks, making us feel overwhelmed. I was burning out trying to "optimize" everything.

**What's Different:**
- Daily planning with built-in reflection time
- Track "little joys" alongside tasks
- Focus on sustainable progress, not hustle culture
- Beautiful, minimal interface

**Features:**
✅ Daily planner with time blocking
✅ Quick wins & deep work tracking
✅ Daily reflections
✅ Progress timeline
✅ Core memories journal

It's free to start, no credit card needed. Would love to hear your feedback!

[Link to app]

Happy to answer any questions!
```

**Or Image Ad:**
- Upload screenshot (1200x628px)
- Title: "A productivity planner that won't burn you out"
- Destination URL: Your landing page with UTM

### Step 7: Launch & Monitor
- Review and publish
- Reddit users are critical - be authentic
- Engage with comments (both positive and negative)
- Expect lower CTR than other platforms (0.3-0.5% is normal)

---

## Monitoring & Optimization

### Daily Checks (First Week)
- [ ] Check spend (make sure not overspending)
- [ ] Review CTR (click-through rate)
  - Google: Aim for 2%+
  - Meta: Aim for 1%+
  - Reddit: Aim for 0.3%+
- [ ] Check CPC (cost per click)
  - Google: $1-3
  - Meta: $0.50-2
  - Reddit: $0.20-0.50
- [ ] Pause any ad with CTR < 0.5% after 100 impressions

### Weekly Analysis
- [ ] Cost per signup (divide ad spend by signups)
- [ ] Conversion rate (signups / clicks)
- [ ] Best performing ads (scale these up)
- [ ] Worst performers (pause or adjust)
- [ ] Add negative keywords (Google)

### Monthly Review
- [ ] Calculate LTV:CAC ratio
- [ ] Adjust budgets (increase winners, cut losers)
- [ ] Test new audiences
- [ ] Test new ad creative
- [ ] Review landing page conversion rate

### Key Metrics Targets
| Metric | Target |
|--------|--------|
| CTR | >1% |
| CPC | <$2 |
| Conversion Rate | >5% |
| Cost per Signup | <$20 |
| LTV:CAC | >3:1 |

---

## Testing Schedule (First 30 Days)

### Week 1: Launch & Learn
- Launch all platforms with base settings
- 3-4 ad variations per platform
- Gather baseline data
- Don't make changes yet

### Week 2: Initial Optimization
- Pause ads with CTR < 0.5%
- Increase budget on best performers by 20%
- Add negative keywords based on search terms
- Test 2-3 new headlines

### Week 3: Scaling
- Double budget on campaigns with CPA < target
- Test lookalike audiences (Meta)
- Test different landing pages
- Add retargeting campaigns

### Week 4: Refinement
- Analyze full month of data
- Create new ad variations based on winners
- Adjust audience targeting
- Plan next month's tests

---

## Retargeting Setup (After 30 Days)

### Google Ads Retargeting
1. Tools → Audience Manager → Your Data
2. Create audience: "Visited but didn't signup"
3. Include: All visitors
4. Exclude: Signup page visitors
5. Duration: 30 days
6. Create new Display campaign targeting this audience
7. Budget: $5/day

### Meta Retargeting
1. Audiences → Create Custom Audience
2. Website traffic → All visitors (30 days)
3. Exclude: People who completed signup
4. Create new campaign with "Conversions" objective
5. Target this custom audience
6. Budget: $5/day
7. Use more direct CTAs: "Finish Setting Up Your Account"

---

## Budget Allocation Example ($400/month)

| Platform | Monthly | Daily | Purpose |
|----------|---------|-------|---------|
| Google Search | $180 | $6 | High-intent keywords |
| Meta Ads | $150 | $5 | Interest targeting + retargeting |
| Reddit Ads | $70 | $2.30 | Community engagement |

**After 30 days, reallocate based on performance:**
- Move budget to best performing platform
- Increase winning campaigns by 50%
- Test new platforms if all are performing well

---

## Tools & Resources

### Analytics & Tracking
- Google Analytics 4 (free)
- Google Tag Manager (easier pixel management)
- Hotjar (see how users interact with landing page)

### Ad Creation
- Canva (free design tool for ad images)
- Figma (screenshot and mockup tool)
- Kapwing (video editing)

### Keyword Research
- Google Keyword Planner (free with Google Ads)
- Ubersuggest (affordable keyword tool)
- Answer the Public (find questions people ask)

### A/B Testing
- Google Optimize (free)
- Unbounce (landing page builder)

### Spy Tools (See Competitor Ads)
- Meta Ad Library (free - see all Facebook ads)
- SpyFu (paid - see Google Ads competitors)
- SEMrush (paid - comprehensive)

---

## Common Mistakes to Avoid

1. **Setting and forgetting** - Check daily for first week
2. **Making changes too fast** - Wait for statistical significance (100+ clicks)
3. **Not tracking conversions** - You're flying blind without this
4. **Targeting too broad** - Start narrow, then expand
5. **Using only one ad** - Always test 3-4 variations
6. **Ignoring mobile** - 60%+ of traffic is mobile
7. **Weak landing page** - Best ad in the world won't convert with bad landing page
8. **No clear CTA** - Tell people exactly what to do
9. **Competing with yourself** - Don't run overlapping campaigns
10. **Giving up too soon** - Need 30 days minimum to optimize

---

## Success Checklist

Before launching, verify:
- [ ] Conversion tracking installed and tested
- [ ] Landing page loads fast (<3 seconds)
- [ ] Mobile experience is good
- [ ] Clear value proposition on page
- [ ] Multiple ad variations ready
- [ ] Budget limits set to avoid overspending
- [ ] UTM parameters on all URLs
- [ ] Privacy policy and terms pages exist
- [ ] Payment method confirmed in ad platforms
- [ ] Calendar reminders set for daily checks

---

## Next Steps

1. **Week 1**: Set up conversion tracking (most important!)
2. **Week 2**: Create ad accounts and install pixels
3. **Week 3**: Prepare ad creative and copy
4. **Week 4**: Launch campaigns and monitor closely

Good luck! Remember: start small, test everything, and scale what works.
