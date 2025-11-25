# How to Access & Manage Your Data

## 🎯 Quick Answer

**Your data is saved in:** Browser's `localStorage`

**Key Names:**
- `plan_2025-11-25` → Your today's plan
- `plan_2025-11-24` → Yesterday's plan
- `app_settings` → Your app preferences

**Auto-saved:** Every time you add/edit/delete anything

---

## 🔍 View Your Data - Step by Step

### Method 1: Browser DevTools (Easiest)

#### Chrome / Edge
1. Open app at `http://localhost:3000/planner`
2. Press **Ctrl + Shift + I** (Windows) or **Cmd + Option + I** (Mac)
3. Click **Application** tab at the top
4. In left sidebar, expand **Local Storage**
5. Click `http://localhost:3000`
6. You'll see all your saved plans!

#### Firefox
1. Press **F12** to open DevTools
2. Click **Storage** tab
3. Click **Local Storage** in left sidebar
4. Click `http://localhost:3000`
5. View your saved data!

#### Safari
1. Enable Developer Tools (Preferences → Advanced → "Show Develop menu")
2. Go to Develop → Show Web Inspector
3. Click **Storage** tab
4. Expand **Local Storage**
5. Click `http://localhost:3000`

### Method 2: Browser Console (Advanced)

Open DevTools Console (usually F12, then Console tab) and run:

#### See all stored keys
```javascript
Object.keys(localStorage)
```

Output example:
```
['plan_2025-11-25', 'plan_2025-11-24', 'plan_2025-11-23', 'app_settings']
```

#### View today's complete plan
```javascript
JSON.parse(localStorage.getItem('plan_2025-11-25'))
```

Output example:
```json
{
  "deepWork": [
    {
      "id": "0.9876543210123456",
      "title": "Finish project proposal",
      "timeEstimate": 120,
      "notes": "Include budget breakdown",
      "completed": false
    }
  ],
  "quickWins": [
    {
      "id": "0.1234567890123456",
      "title": "Reply to 5 emails",
      "completed": true
    }
  ],
  "littleJoys": [
    "Great morning coffee",
    "Colleague appreciated my work"
  ],
  "reflection": "Very productive day, made real progress",
  "focusTomorrow": "Follow up on client feedback"
}
```

#### View a specific past plan
```javascript
JSON.parse(localStorage.getItem('plan_2025-11-20'))
```

#### View app settings
```javascript
JSON.parse(localStorage.getItem('app_settings'))
```

Output:
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

#### Check total storage size
```javascript
new Blob(Object.values(localStorage)).size
```

Output: Something like `8453` bytes (8.4 KB)

#### See storage usage
```javascript
// Shows all keys and their sizes
Object.entries(localStorage).map(([key, value]) => ({
  key,
  size: new Blob([value]).size + ' bytes'
}))
```

---

## 💾 Export Your Data

### Option 1: Use Built-in Export Button
1. Go to `/planner`
2. Click **📥 Export** button
3. Downloads your today's plan as `daily-plan-2025-11-25.json`

### Option 2: Export Everything via Console
```javascript
// Create complete backup of ALL data
const backup = {};
for (let key of Object.keys(localStorage)) {
  backup[key] = JSON.parse(localStorage.getItem(key));
}

// Download as file
const json = JSON.stringify(backup, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'mindful_complete_backup.json';
a.click();
```

### Option 3: Copy to Clipboard
```javascript
// Copy all data to clipboard
const backup = {};
for (let key of Object.keys(localStorage)) {
  backup[key] = JSON.parse(localStorage.getItem(key));
}
copy(JSON.stringify(backup, null, 2));
console.log('Copied to clipboard!');
```

---

## 🔄 Restore Your Data

### From Backup File

If you have a backup JSON file, restore it:

```javascript
// Paste your backup data and run this
const backupData = {
  "plan_2025-11-25": {
    "deepWork": [...],
    // ... your data here
  },
  // ... more plans
};

// Restore everything
for (let [key, value] of Object.entries(backupData)) {
  localStorage.setItem(key, JSON.stringify(value));
}

console.log('Data restored!');
```

---

## 🗑️ Clear Your Data

### Delete a Specific Plan
```javascript
// Delete November 25th plan
localStorage.removeItem('plan_2025-11-25')
```

### Delete All Settings
```javascript
localStorage.removeItem('app_settings')
```

### Delete Everything
```javascript
// ⚠️ WARNING: This deletes ALL data!
localStorage.clear()
```

### Clear Specific Plans (Keep Recent)
```javascript
// Keep only last 30 days of plans
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

for (let key of Object.keys(localStorage)) {
  if (key.startsWith('plan_')) {
    const planDate = key.replace('plan_', '');
    const planDateObj = new Date(planDate);
    if (planDateObj < thirtyDaysAgo) {
      localStorage.removeItem(key);
    }
  }
}

console.log('Old plans deleted!');
```

---

## 📊 Analyze Your Data

### Count total plans stored
```javascript
Object.keys(localStorage).filter(k => k.startsWith('plan_')).length
```

### Get statistics
```javascript
const stats = {
  totalPlans: Object.keys(localStorage).filter(k => k.startsWith('plan_')).length,
  storageUsed: Math.round(new Blob(Object.values(localStorage)).size / 1024) + ' KB',
  settings: JSON.parse(localStorage.getItem('app_settings')),
};
console.table(stats);
```

### Find most productive day
```javascript
const plans = {};
for (let key of Object.keys(localStorage)) {
  if (key.startsWith('plan_')) {
    const plan = JSON.parse(localStorage.getItem(key));
    const completed = 
      plan.deepWork.filter(d => d.completed).length +
      plan.quickWins.filter(q => q.completed).length;
    plans[key] = completed;
  }
}
console.log('Most productive day:', 
  Object.entries(plans).sort((a, b) => b[1] - a[1])[0]);
```

---

## 🛡️ Important Security Notes

⚠️ **Browser localStorage is not encrypted**
- Anyone with access to your computer can see your data
- Don't store sensitive information (passwords, etc.)
- Consider using private browsing if on shared computer

✅ **Good practices:**
- Regularly export backups
- Use browser's password manager, not localStorage
- Clear cache when done on public computers
- Enable browser privacy settings

---

## 🚨 Troubleshooting

### "My data disappeared!"
1. Check if you cleared browser cache
2. Check if you're in Incognito/Private mode
3. Try checking a different date in the date picker
4. Open DevTools and check localStorage still exists

### "Storage seems full"
```javascript
// Check if approaching limit
const total = new Blob(Object.values(localStorage)).size;
console.log(total / (1024*1024) + ' MB used out of ~5-10 MB');
```

### "Want to start fresh"
```javascript
// Completely reset
localStorage.clear();
location.reload();
```

---

## 📈 Data Migration Path (Future)

When we add the database:
1. Current localStorage data persists ✓
2. New API reads from database
3. First sync uploads localStorage to database
4. Can then use app across devices
5. No data loss in migration!

---

**Summary:**
- ✅ Data saved: Browser localStorage
- ✅ Auto-save: On every change
- ✅ Backup: Export whenever
- ✅ View: DevTools → Application → Local Storage
- ✅ Size: Currently just a few KB
- ⏳ Future: Will migrate to PostgreSQL when ready
