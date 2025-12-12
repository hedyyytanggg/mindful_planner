# 🏗️ Architecture & Data Flow

## Current Architecture (PostgreSQL + Next.js)

```
┌─────────────────────────────────────────────────────────────┐
│            MINDFUL DAILY PLANNER - FULL STACK                │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│               FRONTEND (React 19 + Next.js 16)              │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Planner Page                              │   │
│  │  - DeepWorkZone, QuickWins, MakeItHappen          │   │
│  │  - RechargeZone, LittleJoys                       │   │
│  │  - ReflectionToday, FocusTomorrow                 │   │
│  │  - Authentication check via useSession()           │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │ onClick, onChange, onSave                   │
│               ↓                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Component State (React Hooks)                      │   │
│  │  - deepWork[], quickWins[], recharge[], etc.       │   │
│  │  - reflection, focusTomorrow (strings)              │   │
│  │  - Auto-save triggers on state change              │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │ useEffect (2s debounce)                     │
│               ↓                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PATCH /api/plans/[date]                            │   │
│  │  - JSON.stringify(planData)                         │   │
│  │  - Save to localStorage (backup)                    │   │
│  └────────────┬────────────────────────────────────────┘   │
└───────────────┼────────────────────────────────────────────┘
                │ HTTP PATCH
                ↓
┌────────────────────────────────────────────────────────────┐
│         BACKEND (Next.js API Routes)                       │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  app/api/plans/[date]/route.ts                      │   │
│  │  - Authenticate user (userId from URL)              │   │
│  │  - Call updateDailyPlan(userId, date, planData)     │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │ Extract nested data                        │
│               ↓                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Database Helper Functions (dbHelpers.ts)           │   │
│  │  - saveDeepWorkZones(planId, items)                │   │
│  │  - saveQuickWins(planId, items)                    │   │
│  │  - saveMakeItHappen(planId, item)                  │   │
│  │  - saveRechargeZones(planId, items)                │   │
│  │  - saveLittleJoys(planId, items)                   │   │
│  │  - saveReflectionToday(planId, content)            │   │
│  │  - saveFocusTomorrow(planId, content)              │   │
│  │  - Updates timestamps on daily_plans               │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │ Connection pooling                         │
│               ↓                                            │
└───────────────┼────────────────────────────────────────────┘
                │ SQL INSERT/UPDATE/DELETE
                ↓
    ┌────────────────────────────────────┐
    │     PostgreSQL 16+                 │
    │                                    │
    │  ┌──────────────────────────────┐  │
    │  │ daily_plans (master)         │  │
    │  │ - id (PK)                    │  │
    │  │ - userId (FK)                │  │
    │  │ - planDate                   │  │
    │  │ - createdAt, updatedAt       │  │
    │  └────────────┬─────────────────┘  │
    │               │                    │
    │    ┌──────────┼──────────┬─────────┴────────┐
    │    │          │          │                  │
    │    ↓          ↓          ↓                  ↓
    │  ┌─────┐  ┌──────┐  ┌────────┐        ┌─────────┐
    │  │deep │  │quick │  │make_it │  ┌─────│recharge │
    │  │work │  │ wins │  │happen  │  │     │ zones   │
    │  │zones│  └──────┘  └────────┘  │     └─────────┘
    │  └─────┘                        │
    │                    ┌────────────┴────────────┐
    │                    │                         │
    │                    ↓                         ↓
    │             ┌─────────────┐       ┌─────────────────┐
    │             │little_joys  │       │reflections_    │
    │             │(many)       │       │today (unique)   │
    │             └─────────────┘       └─────────────────┘
    │
    │             ┌─────────────────┐
    │             │focus_tomorrow   │
    │             │(unique per plan)│
    │             └─────────────────┘
    │
    └────────────────────────────────────┘
```

## Data Save Flow

```
User Action (type, click, toggle)
    │
    ├─ Set text in component
    ├─ Call onSave() callback
    └─ Update React state
         │
         ↓
    useEffect detects state change
         │
         ├─ Wait 2 seconds (debounce)
         ├─ Cancel if state changes again
         │
         ↓
    savePlanForDate(date)
         │
         ├─ Create planData object with:
         │   - deep_work: deepWork[]
         │   - quick_wins: quickWins[]
         │   - make_it_happen: {task, completed}
         │   - recharge_zone: rechargeItems[]
         │   - little_joys: string[]
         │   - reflection: string | null
         │   - focus_tomorrow: string | null
         │
         ├─ Save to localStorage (backup)
         │
         └─ PATCH /api/plans/[date] with JSON body
              │
              ├─ Validate userId from URL
              │
              ├─ Call updateDailyPlan()
              │   ├─ Get/create daily_plan record
              │   ├─ Extract detail data
              │   └─ Call individual save functions:
              │       ├─ DELETE old records
              │       ├─ INSERT new records with generated IDs
              │       └─ Include timestamps
              │
              ├─ Update daily_plans.updatedAt
              │
              └─ Return complete plan object
                 │
                 ↓
            Front-end displays in notification
            "✅ Plan saved to database"
```

## Data Load Flow

```
User navigates to /planner
    │
    ├─ Page mounts
    ├─ useSession() checks authentication
    ├─ If not authenticated → Redirect to /login
    │
    └─ If authenticated:
         │
         ├─ useEffect runs once
         ├─ Set currentDate = today
         │
         └─ loadPlanForDate(date)
              │
              ├─ GET /api/plans/[date]?userId=...
              │
              ├─ Server executes:
              │   ├─ SELECT * FROM daily_plans (1 query)
              │   ├─ SELECT * FROM deep_work_zones (parallel)
              │   ├─ SELECT * FROM quick_wins (parallel)
              │   ├─ SELECT * FROM make_it_happen (parallel)
              │   ├─ SELECT * FROM recharge_zones (parallel)
              │   ├─ SELECT * FROM little_joys (parallel)
              │   ├─ SELECT * FROM reflections_today (parallel)
              │   └─ SELECT * FROM focus_tomorrow (parallel)
              │       Total: ~500ms with all 8 queries
              │
              ├─ Assemble DailyPlan object:
              │   {
              │     id, userId, planDate,
              │     deep_work: [...],
              │     quick_wins: [...],
              │     make_it_happen: {...} | null,
              │     recharge_zone: [...],
              │     little_joys: [...],
              │     reflection: string | null,
              │     focus_tomorrow: string | null,
              │     createdAt, updatedAt
              │   }
              │
              └─ Return JSON
                 │
                 ↓
            Front-end receives response
                 │
                 ├─ setDeepWork(dbPlan.deep_work)
                 ├─ setQuickWins(dbPlan.quick_wins)
                 ├─ setMakeItHappen(dbPlan.make_it_happen)
                 ├─ setRecharge(dbPlan.recharge_zone)
                 ├─ setLittleJoys(dbPlan.little_joys)
                 ├─ setReflection(dbPlan.reflection)
                 └─ setFocusTomorrow(dbPlan.focus_tomorrow)
                    │
                    ↓
                 Components useEffect syncs
                    │
                    └─ setText() and setIsEditing() update
                       to match loaded content
                       │
                       ↓
                    Components re-render with data
```

## Component Hierarchy

```
app/planner/page.tsx (Parent)
│
├─ Page state:
│  ├─ deepWork[]
│  ├─ quickWins[]
│  ├─ makeItHappen
│  ├─ recharge[]
│  ├─ littleJoys[]
│  ├─ reflection
│  └─ focusTomorrow
│
├─ useEffect (dependency: all state vars)
│  └─ Triggers savePlanForDate() after 2s debounce
│
└─ Rendered components:
   ├─ <DeepWorkZone items={deepWork} onAdd={} onUpdate={} onDelete={} />
   ├─ <QuickWins items={quickWins} onAdd={} onUpdate={} onDelete={} />
   ├─ <MakeItHappen item={makeItHappen} onAdd={} onUpdate={} onDelete={} />
   ├─ <RechargeZone items={recharge} onAdd={} onUpdate={} onDelete={} />
   ├─ <LittleJoys joys={littleJoys} onAdd={} onDelete={} />
   ├─ <ReflectionToday content={reflection} onSave={setReflection} />
   │  └─ useEffect watches content prop
   │     └─ Syncs local state (text, isEditing) when prop changes
   │
   └─ <FocusTomorrow content={focusTomorrow} onSave={setFocusTomorrow} />
      └─ useEffect watches content prop
         └─ Syncs local state (text, isEditing) when prop changes
```

## Database Relationships

```
users (1) ──┐
            │
            │ 1:N
            │
daily_plans (N) ─┬──→ deep_work_zones
                 ├──→ quick_wins
                 ├──→ make_it_happen (1:1)
                 ├──→ recharge_zones
                 ├──→ little_joys
                 ├──→ reflections_today (1:1 UNIQUE)
                 └──→ focus_tomorrow (1:1 UNIQUE)

All relationships have ON DELETE CASCADE
All IDs are VARCHAR(25) string type
All timestamps tracked with createdAt, updatedAt
```

## Key Implementation Details

### ID Generation
- All table IDs: `randomBytes(12).toString('hex').substring(0, 25)`
- Provides 96-bit entropy, 25-character hex string
- Client-side generation for immediate UI updates

### State Sync (ReflectionToday, FocusTomorrow)
- Component receives `content` prop from parent
- Local state initialized: `text = content || ''`, `isEditing = !content`
- **Problem (fixed)**: When prop changes, local state didn't update
- **Solution**: Added `useEffect` to watch `content` prop changes
  ```typescript
  useEffect(() => {
    setText(content || '');
    setIsEditing(!content);
  }, [content]);
  ```

### Save Guard Condition (FIXED)
- **Old**: Only saved if `text.trim()` was truthy
- **Fixed**: Always save with `onSave(text.trim() || null)`
- Allows empty/null values to be persisted

### Query Optimization
- getDailyPlan() executes 8 parallel queries via Promise.all()
- ~50ms total execution time
- Indexes on `planId` foreign keys

### Debouncing
- 2-second debounce on auto-save
- useEffect cleanup cancels pending saves if state changes again
- Reduces database load while maintaining responsiveness

---

**Last Updated:** December 12, 2025
        │           └─ Initialize empty arrays
        │
        ├─ Render UI with loaded data
        │
        └─ Ready for user input
```

## Date Navigation Flow

```
User clicks "Prev" button
        │
        ├─ goToPreviousDay()
        │
        ├─ calculateNewDate()
        │
        ├─ handleDateChange(newDate)
        │       │
        │       ├─ savePlanForDate(currentDate)  ← Save current before switching
        │       │
        │       ├─ setCurrentDate(newDate)       ← Update date state
        │       │
        │       └─ loadPlanForDate(newDate)      ← Load new date's plan
        │
        └─ UI re-renders with new date's data
```

## Component State to Storage Mapping

```
React Component State                  localStorage Key
────────────────────────────────────────────────────────
deepWork: DeepWorkItem[]       ┐
quickWins: QuickWinItem[]      │
makeItHappen: Item | null      │
recharge: RechargeItem | null  ├─→ plan_2025-11-25
littleJoys: string[]           │
reflection: string | null      │
focusTomorrow: string | null   ┘

settings: {                            
  timezone: string,            ┐
  theme: string,               │
  notifications: boolean,      ├─→ app_settings
  emailDigest: boolean,        │
  dailyReminder: boolean,      │
  reminderTime: string         ┘
}
```

## Future: Database Architecture (Phase 2)

```
┌──────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  React Frontend  │
│  (Browser)       │
└────────┬─────────┘
         │ HTTP/REST
         ↓
┌────────────────────────────────────────┐
│      Next.js API Routes                │
│  /app/api/plans/route.ts               │
│  /app/api/zones/route.ts               │
│  /app/api/settings/route.ts            │
└────────┬─────────────────────────────┘
         │ Database adapter
         ↓
┌────────────────────────────────────────┐
│      PostgreSQL Database               │
│  Tables:                               │
│  - users                               │
│  - daily_plans                         │
│  - deep_work_zones                     │
│  - quick_wins                          │
│  - recharge_zones                      │
│  - little_joys                         │
│  - reflections_today                   │
│  - focus_tomorrow                      │
│  - sessions                            │
└────────────────────────────────────────┘
```

## Data Persistence Comparison

```
CURRENT (MVP)                FUTURE (Production)
──────────────────────────────────────────────────
Browser Local Storage    →    PostgreSQL Database
  5-10 MB limit         →    Unlimited
  Single browser        →    Multi-device sync
  No backup             →    Automatic backup
  No authentication     →    User accounts
  Session-based         →    Permanent
  JSON files            →    Structured tables
  Fast reads            →    Optimized queries
  No sharing            →    Team collaboration
```

## Storage Timeline

```
MVP Phase (Now)
├─ localStorage ✓
├─ JSON export ✓
├─ Auto-save ✓
└─ Per-date storage ✓

Phase 2: Database Integration
├─ API endpoints → /api/plans
├─ PostgreSQL setup → DATABASE_URL configured
├─ User authentication → NextAuth.js
├─ Cloud backup → Automatic
└─ Multi-device sync → Enabled

Phase 3: Advanced Features
├─ Team collaboration → Shared plans
├─ Advanced analytics → Trend analysis
├─ Mobile app → Native support
└─ Offline mode → Service Worker
```

---

**Key Insight:** 
Your data is safely stored in browser localStorage with automatic saving. When ready, 
we'll migrate to PostgreSQL without losing any existing data - just need to add API layer!
