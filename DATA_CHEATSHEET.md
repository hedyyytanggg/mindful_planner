# 🎯 Data Storage Cheat Sheet

## The Answer You Asked For

**Q: Where is the current data saved?**

**A: Browser's Local Storage (localStorage)**

```
💾 Location: Your browser's local storage
📍 Size: 5-10 MB per domain
⏱️ Persistence: Until you clear browser cache
🔄 Updates: Auto-saved on every change
👁️ View: Press F12 → Application → Local Storage
```

---

## Where to Find Your Data

### 🖥️ Open Browser DevTools
```
1. Press F12 (or Cmd+Option+I on Mac)
2. Click "Application" tab
3. Click "Local Storage" in left sidebar
4. Click "http://localhost:3000"
5. See your data!
```

### 📋 What You'll See
```
Key                    Value (Type)
────────────────────────────────────────
plan_2025-11-25    → {JSON object}  Your today's plan
plan_2025-11-24    → {JSON object}  Yesterday's plan
plan_2025-11-23    → {JSON object}  Previous day
plan_2025-11-20    → {JSON object}  Even older plans
app_settings       → {JSON object}  Your settings
```

---

## Quick Console Commands

### See all stored data
```javascript
Object.keys(localStorage)
```

### View today's complete plan
```javascript
JSON.parse(localStorage.getItem('plan_2025-11-25'))
```

### View a specific past plan
```javascript
JSON.parse(localStorage.getItem('plan_2025-11-20'))
```

### View your settings
```javascript
JSON.parse(localStorage.getItem('app_settings'))
```

### Check storage size
```javascript
new Blob(Object.values(localStorage)).size
```

### See all data formatted nicely
```javascript
const data = {};
for (let k of Object.keys(localStorage)) {
  data[k] = JSON.parse(localStorage.getItem(k));
}
console.table(data);
```

---

## How Auto-Save Works

```
TRIGGER              EVENT                RESULT
─────────────────────────────────────────────────────
Add Task      →  State updates    →  Auto-saved ✅
Edit Task     →  State updates    →  Auto-saved ✅
Mark Done     →  State updates    →  Auto-saved ✅
Delete Task   →  State updates    →  Auto-saved ✅
Switch Date   →  Save old, load new  Auto-saved ✅
Change Theme  →  State updates    →  Auto-saved ✅
```

**Result:** No manual save button needed - everything auto-persists!

---

## Storage Structure

### Daily Plan Object
```
plan_2025-11-25
├── deepWork: [{id, title, time, notes, completed}]
├── quickWins: [{id, title, completed}]
├── makeItHappen: {id, task, completed}
├── recharge: {id, activity, completed}
├── littleJoys: [string, string, ...]
├── reflection: "text"
└── focusTomorrow: "text"
```

### Settings Object
```
app_settings
├── timezone: "EST"
├── theme: "light"
├── notifications: true
├── emailDigest: true
├── dailyReminder: true
└── reminderTime: "09:00"
```

---

## File Paths in Project

```
Auto-save code location:
/Users/hedytang/ai/mindful/app/planner/page.tsx

Lines 73-82: savePlanForDate() function
Lines 85-107: loadPlanForDate() function
Lines 135-141: Auto-save effect hook

Database setup (Phase 2):
See IMPLEMENTATION.md for database configuration guide
```

---

## Backup Your Data

### Quick Backup (Browser Console)
```javascript
const backup = {};
for (let k of Object.keys(localStorage)) {
  backup[k] = JSON.parse(localStorage.getItem(k));
}
copy(JSON.stringify(backup, null, 2));
// Now paste in a text editor and save!
```

### Use Export Button
1. Go to `/planner`
2. Click **📥 Export** button
3. Saves today's plan as JSON file

---

## Restore from Backup

### If You Have a Backup JSON File
```javascript
const backupData = {
  /* your backup data here */
};

for (let [key, value] of Object.entries(backupData)) {
  localStorage.setItem(key, JSON.stringify(value));
}

console.log('✅ Data restored!');
```

---

## Limits & Quotas

| Item | Limit | Notes |
|------|-------|-------|
| **Total Storage** | ~5-10 MB | Per domain |
| **Daily Plans** | ~2000 | Before hitting limit |
| **Per Plan Size** | 1-5 KB | Depends on content |
| **Settings Size** | 300 bytes | Very small |
| **Key Name Length** | 256 chars | Not a concern |
| **Number of Keys** | Unlimited | Within 5-10 MB |

---

## Data Lifecycle

### Phase 1: MVP (NOW) ✅
```
localStorage
├─ Auto-save: ✅
├─ Per-date: ✅
├─ Export: ✅
└─ Limit: 5-10 MB
```

### Phase 2: Database (NEXT)
```
localStorage → API Routes → PostgreSQL
├─ Cloud sync: ✅ New
├─ Multi-device: ✅ New
├─ Auto-backup: ✅ New
└─ Unlimited: ✅ New
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "My data disappeared!" | Check if you cleared browser cache |
| "I don't see the data" | Try opening DevTools → Application |
| "Storage is full" | Export old data and delete old plans |
| "Can't see on phone" | Phone has separate storage (need database) |
| "Lost my data" | Restore from backup JSON file |
| "Want to start fresh" | `localStorage.clear()` in console |

---

## Key Facts

✅ **Saved in:** Browser localStorage  
✅ **Format:** JSON (human-readable)  
✅ **Updated:** Every few milliseconds  
✅ **Viewable in:** DevTools  
✅ **Exportable:** Yes, as JSON  
✅ **Backupable:** Yes, manually  
⚠️ **Size limit:** ~5-10 MB  
⚠️ **Browser-specific:** Each browser separate  
⚠️ **Not encrypted:** Plain text  
⚠️ **No cloud sync:** Local only (until Phase 2)  

---

## Next Phase Preview

```
When we add PostgreSQL database:

localStorage         PostgreSQL
   ↓                    ↓
Same data             Same data
Same format           Structured tables
Portable              Permanent backup
Local only            Multi-device sync
5-10 MB limit         Unlimited storage
```

**No data loss in migration!** 🎉

---

## Reference Links

| Topic | File |
|-------|------|
| Full overview | WHERE_IS_DATA.md |
| How-to guide | DATA_GUIDE.md |
| Technical details | DATA_STORAGE.md |
| Architecture | ARCHITECTURE.md |
| All docs | DOCS_INDEX.md |

---

## Emergency Commands

### View everything
```javascript
Object.entries(localStorage).forEach(([k,v]) => 
  console.log(k, JSON.parse(v))
)
```

### Backup to file
```javascript
const backup = JSON.stringify(
  Object.fromEntries(
    Object.entries(localStorage).map(([k,v]) => 
      [k, JSON.parse(v)]
    )
  ), 
  null, 
  2
);
console.log(backup);
// Copy and paste into a text file
```

### Delete specific plan
```javascript
localStorage.removeItem('plan_2025-11-25')
```

### Clear everything
```javascript
localStorage.clear()  // ⚠️ CANNOT UNDO!
```

---

## Summary Table

| Feature | MVP | Phase 2 |
|---------|-----|---------|
| **Storage Type** | localStorage | PostgreSQL |
| **Location** | Browser | Server |
| **Persistence** | Session | Forever |
| **Size Limit** | 5-10 MB | Unlimited |
| **Auto-backup** | Manual | Automatic |
| **Multi-device** | ❌ | ✅ |
| **User Accounts** | ❌ | ✅ |
| **Cloud Sync** | ❌ | ✅ |
| **Data Loss Risk** | Medium | Low |

---

## TL;DR

```
Your data is in browser localStorage
├─ Auto-saved every change
├─ View in DevTools (F12 → Application)
├─ Export as JSON anytime
└─ Persists until cache cleared

Total: ~Few KB right now
Limit: ~5-10 MB per domain
Perfect for: MVP testing ✅
```

**You're all set! Your data is safe and auto-saved.** 🎉

---

*Last Updated: November 25, 2025*  
*For more details, see [DOCS_INDEX.md](DOCS_INDEX.md)*
