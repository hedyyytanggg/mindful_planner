## Quick Data Storage Reference

### 🎯 TL;DR - Where is Your Data Saved?

**Answer:** In your **browser's localStorage** (5-10 MB local storage per domain)

### 📦 What Gets Saved

```
localStorage:
  plan_2025-11-25    → Your today's plan (Deep Work, Quick Wins, etc.)
  plan_2025-11-24    → Yesterday's plan
  plan_2025-11-23    → Previous days...
  app_settings       → Your preferences (timezone, theme, notifications)
```

### ✨ Auto-Save in Action

Every time you:
- ✅ Add a task → Auto-saved
- ✅ Check off a task → Auto-saved  
- ✅ Edit notes → Auto-saved
- ✅ Switch dates → Current date saved, new date loaded
- ✅ Change settings → Auto-saved

### 🔍 How to View Your Data

**Browser DevTools (Chrome/Firefox/Safari):**
1. Press `F12` to open DevTools
2. Go to **Application** tab
3. Click **Local Storage** in left sidebar
4. Click `http://localhost:3000`
5. You'll see all your plans and settings!

**Or in Console:**
```javascript
// See all your stored keys
Object.keys(localStorage)

// See today's plan
JSON.parse(localStorage.getItem('plan_2025-11-25'))
```

### 📊 Data Structure Example

```json
{
  "deepWork": [
    {"id": "...", "title": "Finish proposal", "completed": false}
  ],
  "quickWins": [
    {"id": "...", "title": "Reply to emails", "completed": true}
  ],
  "littleJoys": ["Great coffee!", "Nice conversation"],
  "reflection": "Productive day today",
  "focusTomorrow": "Focus on design refinement"
}
```

### ⚠️ Important Notes

- ✓ Data persists until you clear browser cache
- ✓ Automatically saved with each change
- ✗ Only in this browser (not synced across devices)
- ✗ No cloud backup yet
- ✗ No server storage yet (coming soon with API integration)

### 🚀 Future: Database Storage

When we implement the API layer:
```
Browser (localStorage) → API Routes → PostgreSQL Database
```

This will enable:
- Multi-device sync
- Cloud backup
- User accounts & sharing
- Better data persistence

### 📤 How to Export Your Data

Click **📥 Export** button on `/planner` page to download your daily plan as JSON.

---

**Status:** MVP uses localStorage ✓ | Ready for database migration when needed
