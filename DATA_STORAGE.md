# Data Storage Architecture - Mindful Daily Planner

## Current Storage Solution

Your Mindful Daily Planner MVP is currently using **Browser Local Storage** to persist all user data.

---

## 📊 What Data is Stored

### 1. **Daily Plans** (Per-Date Storage)
**Storage Key:** `plan_${date}` (e.g., `plan_2025-11-25`)  
**Location:** Browser's localStorage  
**Format:** JSON object

```json
{
  "deepWork": [
    {
      "id": "0.123456789",
      "title": "Finish project proposal",
      "timeEstimate": 120,
      "notes": "Include timeline and budget",
      "completed": false
    }
  ],
  "quickWins": [
    {
      "id": "0.987654321",
      "title": "Reply to 5 emails",
      "completed": false
    }
  ],
  "makeItHappen": {
    "id": "0.456789123",
    "task": "Book dentist appointment",
    "completed": false
  },
  "recharge": {
    "id": "0.789123456",
    "activity": "Walk in park",
    "completed": false
  },
  "littleJoys": [
    "Great coffee this morning",
    "Colleague complimented my work"
  ],
  "reflection": "Today was productive. Made good progress on the proposal.",
  "focusTomorrow": "Follow up on client feedback and refine design."
}
```

**Storage Size per Date:** ~1-5 KB depending on content

---

### 2. **App Settings** (User Preferences)
**Storage Key:** `app_settings`  
**Location:** Browser's localStorage  
**Format:** JSON object

```json
{
  "timezone": "EST",
  "theme": "light",
  "notifications": true,
  "emailDigest": true,
  "dailyReminder": true,
  "reminderTime": "09:00"
}
```

**Storage Size:** ~300 bytes

---

## 🔍 How to View Your Data

### Method 1: Browser DevTools (Chrome/Safari/Firefox)
1. Open your app at `http://localhost:3000/planner`
2. Right-click → **Inspect** (or press `F12`)
3. Go to **Application** tab
4. In left sidebar, click **Local Storage**
5. Select `http://localhost:3000`
6. You'll see all your saved data:
   - `plan_2025-11-25`
   - `plan_2025-11-24`
   - `app_settings`
   - etc.

### Method 2: JavaScript Console
Open DevTools console and run:

```javascript
// View all stored keys
Object.keys(localStorage)

// View today's plan
JSON.parse(localStorage.getItem('plan_2025-11-25'))

// View app settings
JSON.parse(localStorage.getItem('app_settings'))

// View all localStorage size
new Blob(Object.values(localStorage)).size
```

### Method 3: Export Feature
Click the **📥 Export** button on the planner page to download your daily plan as JSON.

---

## 📁 Storage Hierarchy

```
Browser LocalStorage
├── plan_2025-11-25          (Today's plan)
├── plan_2025-11-24          (Yesterday's plan)
├── plan_2025-11-23          (Previous day)
├── plan_2025-11-22          (etc...)
└── app_settings             (User preferences)
```

**Browser Storage Limit:** ~5-10 MB per domain  
**Current Usage:** ~Few KB (very efficient!)

---

## ⚡ How Data is Saved

### Auto-Save Mechanism
1. **On Component Mount:** Loads today's plan from localStorage
2. **On Every Change:** Any addition/edit/delete triggers auto-save
3. **On Date Change:** Saves current plan before switching to another date
4. **Debounced Updates:** React useEffect watches all state changes

```typescript
// Auto-save effect (from planner/page.tsx)
useEffect(() => {
    if (!isLoading && currentDate) {
        savePlanForDate(currentDate);
    }
}, [deepWork, quickWins, makeItHappen, recharge, littleJoys, reflection, focusTomorrow, isLoading, currentDate]);
```

### Save Flow
```
User adds task
    ↓
Component state updates
    ↓
useEffect detects change
    ↓
savePlanForDate() called
    ↓
JSON serialized
    ↓
Stored in localStorage with key `plan_${date}`
```

---

## ⚠️ Current Limitations

### 1. **Browser-Dependent**
- Data only exists in your current browser
- Clearing browser cache = data loss
- Different browsers have separate storage
- Can't sync across devices

### 2. **No Cloud Backup**
- No server-side persistence yet
- No automatic backup
- Single point of failure (browser storage)

### 3. **Storage Limits**
- ~5-10 MB per domain (varies by browser)
- ~2000 daily plans before hitting limit (if using only for plans)

### 4. **No Authentication**
- Anyone with access to your browser can view data
- Not suitable for sensitive information
- No user accounts yet

---

## 🚀 Next Steps: Database Integration

To move beyond local storage, you'll need to:

### Phase 1: API Layer (Already Designed)
```
Frontend (React) 
    ↓ API calls
Next.js API Routes (/app/api/plans, /zones)
    ↓ Database adapter
PostgreSQL Database
```

### Phase 2: Implementation Steps
1. **Create API endpoints:**
   - `POST /api/plans` - Save plan
   - `GET /api/plans/[date]` - Load plan
   - `PATCH /api/plans/[id]` - Update plan
   - `DELETE /api/plans/[id]` - Delete plan

2. **Update frontend to use API:**
   ```typescript
   // Instead of localStorage
   const savePlanForDate = async (date: string) => {
     const response = await fetch('/api/plans', {
       method: 'POST',
       body: JSON.stringify(plan),
     });
     // Handle response
   };
   ```

3. **Configure database connection:**
   - Set `DATABASE_URL` in `.env.local`
   - Run database migrations
   - Database schema should be defined

---

## 📋 Current Data Storage Summary

| Aspect | Current Status |
|--------|---|
| **Storage Type** | Browser localStorage |
| **Persistence** | Session-based (until browser cache cleared) |
| **Cloud Backup** | ❌ None |
| **Server Storage** | ❌ None |
| **Encryption** | ❌ No |
| **User Accounts** | ❌ No |
| **Multi-Device Sync** | ❌ No |
| **Data Limit** | ~5-10 MB |
| **Export Format** | ✓ JSON |
| **Settings Storage** | ✓ localStorage |

---

## 🔐 Data Recovery

### How to Manually Export Your Data
1. Open DevTools (F12)
2. Go to Console tab
3. Run this command:

```javascript
const data = {};
for (let key of Object.keys(localStorage)) {
  data[key] = JSON.parse(localStorage.getItem(key));
}
const json = JSON.stringify(data, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'mindful_backup.json';
a.click();
```

### How to Restore Data
1. Open DevTools Console
2. Run:

```javascript
const backupData = /* paste your backup JSON here */;
for (let [key, value] of Object.entries(backupData)) {
  localStorage.setItem(key, JSON.stringify(value));
}
```

---

## 📝 Recommendations

1. **For MVP Testing:** Current localStorage solution is perfect ✓
2. **For Production:** Switch to PostgreSQL + API routes
3. **For Multi-Device:** Implement cloud sync after auth
4. **For Backup:** Add automatic export feature or cloud backup

Your data is currently safe and accessible, but moving to a database will unlock better persistence, sharing, and reliability!
