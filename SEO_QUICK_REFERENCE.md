# SEO Quick Reference — Mindful Planner

Quick reference guide for maintaining and improving SEO for Mindful Daily Planner.

## 🎯 Current SEO Setup

### Files Created
- [`/app/sitemap.ts`](app/sitemap.ts) - Auto-generated XML sitemap
- [`/app/robots.ts`](app/robots.ts) - Search engine crawling rules
- [`/src/lib/seo.ts`](src/lib/seo.ts) - SEO utility functions
- [SEO Best Practices Guide](SEO_BEST_PRACTICES.md) - Comprehensive guide
- [SEO Implementation Checklist](SEO_IMPLEMENTATION_CHECKLIST.md) - Track progress

### Metadata Added
All pages now have proper SEO metadata:
- ✅ Homepage with WebSite schema
- ✅ Features page with FAQ schema
- ✅ About page
- ✅ Contact page
- ✅ Login page (noindex)
- ✅ Signup page
- ✅ Root layout with organization schema

---

## 🚀 Quick Commands

### Test Your SEO

```bash
# Build and check for errors
npm run build

# Run local development
npm run dev

# Check sitemap (after starting dev server)
curl http://localhost:3000/sitemap.xml

# Check robots.txt
curl http://localhost:3000/robots.txt
```

### View Generated Files

After building:
- Sitemap: `https://mindfulplanner.com/sitemap.xml`
- Robots: `https://mindfulplanner.com/robots.txt`

---

## 📝 Adding Metadata to New Pages

### Server Component (Recommended)

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Mindful Planner',
  description: 'Page description under 160 characters',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    url: 'https://mindfulplanner.com/page-url',
    type: 'website',
  },
  alternates: {
    canonical: 'https://mindfulplanner.com/page-url',
  },
}

export default function Page() {
  return <div>Content</div>
}
```

### Client Component

Create a `layout.tsx` wrapper:

```typescript
// app/my-page/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Mindful Planner',
  description: 'Description here',
}

export default function Layout({ children }) {
  return <>{children}</>
}
```

---

## 🏗️ Adding Structured Data (JSON-LD)

### In a Server Component

```typescript
export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Article Title',
    description: 'Article description',
    // ... more fields
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div>Content</div>
    </>
  )
}
```

### Using SEO Utilities

```typescript
import { generateArticleSchema, generateFAQSchema } from '@/lib/seo'

const articleSchema = generateArticleSchema({
  title: 'How to Plan Your Day',
  description: 'A guide to effective daily planning',
  author: 'Mindful Team',
  publishedAt: '2025-12-17',
  image: '/blog/article-image.png',
  url: 'https://mindfulplanner.com/blog/how-to-plan',
})
```

---

## 📊 Key SEO Checkpoints

### Before Publishing New Content

- [ ] Title tag under 60 characters
- [ ] Meta description under 160 characters
- [ ] Include target keyword in title
- [ ] Add canonical URL
- [ ] Include Open Graph metadata
- [ ] Add structured data if applicable
- [ ] Optimize images (alt text, compression)
- [ ] Use semantic HTML (H1, H2, H3)
- [ ] Add internal links to related pages
- [ ] Check mobile responsiveness

### After Publishing

- [ ] Submit to Google Search Console
- [ ] Share on social media
- [ ] Monitor Google Analytics
- [ ] Check for indexing in Search Console
- [ ] Monitor ranking for target keywords

---

## 🎨 Image SEO Best Practices

```tsx
import Image from 'next/image'

<Image
  src="/features/deep-work-zone.png"
  alt="Deep work zone interface showing focus timer and task list"
  width={800}
  height={600}
  loading="lazy" // or "eager" for above-fold images
/>
```

**File naming:**
- ✅ `deep-work-zone-screenshot.png`
- ❌ `img123.png`

**Alt text rules:**
- Describe the image clearly
- Include keywords naturally (don't stuff)
- Keep under 125 characters
- Don't start with "Image of" or "Picture of"

---

## 📱 Social Media Preview

### Testing Tools
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### OG Image Requirements
- **Size:** 1200x630 pixels
- **Format:** PNG or JPG
- **Max file size:** < 1MB
- **Safe zone:** Keep text/logos in center 1000x500px

---

## 🔍 Monitoring SEO Performance

### Weekly Tasks
1. Check Google Search Console for:
   - Indexing issues
   - Coverage errors
   - Mobile usability issues
   - Core Web Vitals

2. Review Google Analytics:
   - Organic traffic trends
   - Top landing pages
   - Bounce rate for key pages
   - Conversion rate from organic

### Monthly Tasks
1. Track keyword rankings
2. Analyze backlink profile
3. Update old content
4. Fix broken links
5. Review and optimize slow pages
6. Check competitor rankings

---

## 🎯 Target Keywords (Track These)

**Primary (High Priority):**
- daily planner app
- mindful productivity planner
- work-life balance planner
- productivity app for professionals

**Secondary:**
- deep work planner
- daily reflection journal
- task prioritization app
- burnout prevention tool

**Long-Tail:**
- how to plan your day for productivity and wellness
- best daily planner for remote workers
- mindful task management app

---

## 🛠️ Essential Tools

### Free
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results)

### Paid (for growth phase)
- Ahrefs: Keyword research, backlink analysis
- SEMrush: Competitor analysis, rank tracking
- Moz: Domain authority tracking

---

## 🚨 Common SEO Mistakes to Avoid

- ❌ Duplicate meta descriptions
- ❌ Missing alt text on images
- ❌ Broken internal links
- ❌ Slow page load times
- ❌ Not mobile-optimized
- ❌ Thin or duplicate content
- ❌ Keyword stuffing
- ❌ Missing canonical tags
- ❌ Not submitting sitemap
- ❌ Ignoring Search Console errors

---

## 📞 Need Help?

- Full guide: [SEO_BEST_PRACTICES.md](SEO_BEST_PRACTICES.md)
- Checklist: [SEO_IMPLEMENTATION_CHECKLIST.md](SEO_IMPLEMENTATION_CHECKLIST.md)
- Next.js SEO docs: https://nextjs.org/learn/seo/introduction-to-seo

---

**Last Updated:** December 17, 2025  
**Maintained By:** Mindful Planner Team
